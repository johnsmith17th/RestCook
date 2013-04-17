/**
 * Module dependancies.
 */
var assert = require('assert-plus'),
	util = require('util'),
	mongoose = require('mongoose');

/**
 * Short cuts
 */
var F = util.format;

/**
 * Create application.
 *
 * @param name {String} application name.
 */

function RestCook(name) {
	if (name) {
		assert.string(name, 'name');
	};
	this._name = name ? name : 'RestCook';
	this._resources = {};
	this._db = null;
	this._schemas = {};
	this._models = {};
	this._server = null;
};

/**
 * Setup express configuration.
 *
 *
 */
RestCook.prototype.config = function(fn) {
	// body...
};

/**
 * Create resource.
 *
 * @param config {Object} resource configuration:
 *		- name {String} optional, name of resource
 *		- desc {String}	optional, description of resource
 *		- route {String} optional, route
 *		- model {String} optional, model name of resource
 *		- collection {String} optional, collection name of resource
 *		- schema {Object}, optional, schema definition
 *		- action {Object}, optional, action definition
 *		- command {Object}
 * @public
 */
RestCook.prototype.resource = function(key, config) {

	assert.string(key, 'key');
	assert.object(config, 'config');

	var _res = {};

	// setup resource.name
	assert.optionalString(config.name, 'config.name');
	this.__setup(config, _res, 'name', 'string', 'config.name', function() {
		return key;
	});

	// setup resource.desc
	assert.optionalString(config.desc, 'config.desc');
	this.__setup(config, _res, 'desc', 'string', 'config.desc', function() {
		return F('Default description of resource %s.', _res.name);
	});

	// setup resource.route
	assert.optionalString(config.route, 'config.route');
	this.__setup(config, _res, 'route', 'string', 'config.route', function() {
		return F('/%s', _res.name.toLowerCase());
	});

	// setup resource.model
	assert.optionalString(config.model, 'config.model');
	this.__setup(config, _res, 'model', 'string', 'config.model', function() {
		var str = _res.name;
		return str.charAt(0).toUpperCase() + str.slice(1);
	});

	// setup resource.collection
	assert.optionalString(config.collection, 'config.collection');
	this.__setup(config, _res, 'collection', 'string', 'config.collection', function() {
		return F('%ss', _res.name.toLowerCase());
	});

	// setup resource.schema
	_res.schema = {};
	assert.optionalObject(config.schema, 'config.schema');
	if (config.schema) {
		_res.schema = config.schema;
	}

	// setup resource.pk
	assert.optionalString(config.pk, 'config.pk');
	this.__setup(config, _res, 'pk', 'string', 'config.pk', function() {
		return '_id';
	});

	this.__buildSchema(_res);
	this.__buildModel(_res);

	// setup resource.action
	var _action = {}, _route;
	if (config.action) {
		var action = config.action;
		assert.object(action, 'config.action');

		_route = _res.route;

		// index
		if (action.index) {
			assert.object(action.index, 'config.action.index');
			_action.index = action.index;
			_action.index.route = _route;

			this.__buildActionIndex(_res);
		}

		// post
		if (config.action.post) {
			assert.object(action.post, 'config.action.post');
			_action.post = action.post;
			_action.post.route = _route;

			this.__buildActionPost(_res);
		}

		_route = F('%s/:%s', _res.route, _res.pk);

		// get
		if (config.action.get) {
			assert.object(action.get, 'config.action.get');
			_action.get = action.get;
			_action.get.route = _route;

			this.__buildActionGet(_res);
		}

		// put
		if (config.action.put) {
			assert.object(action.put, 'config.action.put');
			_action.put = action.put;
			_action.put.route = _route;

			this.__buildActionPut(_res);
		}

		// delete
		if (config.action.del) {
			assert.object(action.del, 'config.action.del');
			_action.del = action.del;
			_action.del.route = _route;

			this.__buildActionDel(_res);
		}
	}
	_res.action = _action;

	// setup resource.command
	_res.command = {};
	assert.optionalObject(config.command, 'config.command');
	if (config.command) {

	}

	this._resources[key] = _res;
	this.__buildSchema(_res);
	this.__buildModel(_res);
	return this;
};

/**
 * Get schema of resource.
 *
 * @param name {String} resource name.
 * @return mongoose schema.
 * @public
 */
RestCook.prototype.schema = function(name) {
	return this._schemas[name];
};

/**
 * Get model of resource.
 *
 * @param name {String} resource name.
 * @return mongoose model.
 * @public
 */
RestCook.prototype.model = function(name) {
	return this._models[name];
};

/**
 * Setup database for application.
 *
 * @param server {String} server uri.
 */
RestCook.prototype.db = function(server) {
	assert.string(server, 'server');
	this._db = server;
	return this;
}

/**
 * Create rest service of application.
 *
 * @param port {Number} port to listen.
 * @param fn {Function} optional, callback of server start.
 */
RestCook.prototype.service = function(port, fn) {
	var app = null;
	this.__build();
};

/* Helper to setup resource configuration.
 *
 * @param from {Object} source
 * @param to {Object} target
 * @param field {String} field to load
 * @param type {String} field type for assertation
 * @param type {String} field description for assertation
 * @param decorator {Function} to clean up field value
 * @param fallback {Function} to get default field value
 */
RestCook.prototype.__setup = function(from, to, field, type, desc, fallback) {
	if (from && from.hasOwnProperty(field) && assert[type]) {
		assert[type](from[field], desc);
		to[field] = from[field];
	} else {
		to[field] = fallback();
	}
}

/**
 * Build application.
 *
 * @private
 */
RestCook.prototype.__build = function() {
	var resource;
	for (var i in this._resources) {
		resource = this._resources[i];
		this.__buildSchema(resource);
		this.__buildModel(resource);
		this.__buildAction(resource);
	}
	// add models to application server
	this._server.set('models', this._models);
	return this;
};

/**
 * Build schema of resource.
 *
 * @param resource {Object}
 * @private
 */
RestCook.prototype.__buildSchema = function(resource) {
	var schema = new mongoose.Schema(resource.schema, {
		collection: resource.collection
	});
	this._schemas[resource.model] = schema;
	return this;
};

/**
 * Build model of resource.
 *
 * @param resource {Object}
 * @private
 */
RestCook.prototype.__buildModel = function(resource) {
	var shcema = this._schemas[resource.model];
	var model = mongoose.Model(resource.model, schema);
	this._models[resource.model] = model;
	return this;
};

/**
 * Build action index.
 *
 * @param resource {Object}
 * @private
 */
RestCook.prototype.__buildActionIndex = function(resource) {

	var model = resource.model,
		action = resource.action.index;

	if (action.handler) {
		this.__handle(action.route, 'get', action.handler);
	} else {
		this._server.get(action.route, function(req, res) {
			var _m = this._models[model];
			if (m) {
				m.find().lean().exec(function(err, result) {
					this.__respond(res, err, result);
				});
			} else {
				res.json(404);
			}
		});
	}

	return this;
};

/**
 * Build action post.
 *
 * @param resource {Object}
 * @private
 */
RestCook.prototype.__buildActionPost = function(resource) {

	var model = resource.model,
		action = resource.action.post;

	if (action.handler) {
		this.__handle(action.route, 'post', action.handler);
	} else {
		this._server.post(action.route, function(req, res) {
			var _m = this._models[model];
			if (m) {
				var doc = new _m(req.body);
				_m.save(function(err, d) {
					this.__respond(res, err, d);
				});
			} else {
				res.json(404);
			}
		});
	}

	return this;
};

/**
 * Build action get.
 *
 * @param resource {Object}
 * @private
 */
RestCook.prototype.__buildActionGet = function(resource) {

	var model = resource.model,
		pk = resource.pk,
		action = resource.action.post;

	if (action.handler) {
		this.__handle(action.route, 'get', action.handler);
	} else {
		this._server.get(action.route, function(req, res) {
			var _m = this._models[model];
			if (m) {
				var q = {};
				q[pk] = req.param(pk);
				m.findOne(q).lean().exec(function(err, result) {
					this.__respond(res, err, result ? result : null);
				});
			} else {
				res.json(404);
			}
		});
	}

	return this;
};

/**
 * Build action put.
 *
 * @param resource {Object}
 * @private
 */
RestCook.prototype.__buildActionPut = function(resource) {

	var model = resource.model,
		pk = resource.pk,
		action = resource.action.post;

	if (action.handler) {
		this.__handle(action.route, 'put', action.handler);
	} else {
		this._server.put(action.route, function(req, res) {
			var _m = this._models[model];
			if (m) {
				var q = {};
				q[pk] = req.param(pk);
				var s = req.body;
				m.findOneAndUpdate(q, s).exec(function(err) {
					this.__respond(res, err);
				});
			} else {
				res.json(404);
			}
		});
	}

	return this;
};

/**
 * Build action del.
 *
 * @param resource {Object}
 * @private
 */
RestCook.prototype.__buildActionDel = function(resource) {

	var model = resource.model,
		pk = resource.pk,
		action = resource.action.post;

	if (action.handler) {
		this.__handle(action.route, 'del', action.handler);
	} else {
		this._server.del(action.route, function(req, res) {
			var _m = this._models[model];
			if (m) {
				var q = {};
				q[pk] = req.param(pk);
				m.findOneAndRemove(q).exec(function(err) {
					this.__respond(res, err);
				});
			} else {
				res.json(404);
			}
		});
	}

	return this;
};

/**
 * Process request with custom handler.
 *
 * @param route {String}
 * @param method {String} post, get, put, del
 * @param handler {Function}
 * @private
 */
RestCook.prototype.__handle = function(route, method, handler) {
	this._server[method](route, function(req, res) {
		handler(req, res, function(err, result, responded) {
			if (!responded) {
				this.__respond(res, err, result);
			}
		});
	});
};

/**
 * Send response.
 *
 * @param res {HttpResponse} response context
 * @param err {Error} error
 * @param result {Object} result
 * @private
 */
RestCook.prototype.__respond = function(res, err, result) {
	if (err) res.json(err.code ? err.code : 500, err);
	else if (result == null) res.json(404, result);
	else res.json(200, result);
};

RestCook.Types = require('./types');

/**
 * Module exports.
 */
module.exports = RestCook;