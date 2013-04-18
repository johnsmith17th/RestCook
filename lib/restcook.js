/**
 * Module dependancies.
 */
var assert = require('assert-plus'),
	util = require('util'),
	mongoose = require('mongoose'),
	express = require('express');

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
	assert.optionalString(name, 'name');
	this._name = name ? name : 'RestCook';
	this._port = 3030;
	this._resources = {};
	this._db = null;
	this._schemas = {};
	this._models = {};

	// setup express server
	var app = express();
	app.configure(function() {
		//this._app.set('views', __dirname + '/views');
		//this._app.set('view engine', 'jade');
		app.use(express.bodyParser());
		app.use(express.cookieParser());
		app.use(express.methodOverride());
		app.use(app.router);
		//this._app.use(express.static(__dirname + '/public'));
	});
	this._app = app;
};

/**
 * Setup express configuration.
 *
 * @param fn {Function}
 * @public
 */
RestCook.prototype.config = function(fn) {
	assert.func(fn, 'fn');
	fn(this._app);
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
	_res.action = {};
	var _route;
	if (config.action) {
		var action = config.action;
		assert.object(action, 'config.action');

		_route = _res.route;

		// index
		if (action.index) {
			assert.object(action.index, 'config.action.index');
			_res.action.index = action.index;
			_res.action.index.route = _route;

			this.__buildActionIndex(_res);
		}

		// post
		if (config.action.post) {
			assert.object(action.post, 'config.action.post');
			_res.action.post = action.post;
			_res.action.post.route = _route;

			this.__buildActionPost(_res);
		}

		_route = F('%s/:%s', _res.route, _res.pk);

		// get
		if (config.action.get) {
			assert.object(action.get, 'config.action.get');
			_res.action.get = action.get;
			_res.action.get.route = _route;

			this.__buildActionGet(_res);
		}

		// put
		if (config.action.put) {
			assert.object(action.put, 'config.action.put');
			_res.action.put = action.put;
			_res.action.put.route = _route;

			this.__buildActionPut(_res);
		}

		// delete
		if (config.action.del) {
			assert.object(action.del, 'config.action.del');
			_res.action.del = action.del;
			_res.action.del.route = _route;

			this.__buildActionDel(_res);
		}
	}


	// setup resource.command
	_res.command = {};
	assert.optionalObject(config.command, 'config.command');
	if (config.command) {

	}

	this._resources[key] = _res;
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
};

/**
 * Create rest service of application.
 *
 * @param port {Number} port to listen.
 * @param fn {Function} optional, callback of server start.
 */
RestCook.prototype.service = function(port, fn) {

	assert.number(port, 'port');
	assert.optionalFunc(fn, 'fn');

	mongoose.connect(this._db);
	this._port = port;
	this._app.listen(port);
	if (fn) {
		fn();
	} else {
		console.log(F('%s start at %d', this._name, this._port));
	}
	return this;
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
};

/**
 * Build model of resource.
 *
 * @param resource {Object}
 * @private
 */
RestCook.prototype.__buildModel = function(resource) {
	var schema = this._schemas[resource.model];
	var model = mongoose.model(resource.model, schema);
	this._models[resource.model] = model;
};

/**
 * Build action index.
 *
 * @param resource {Object}
 * @private
 */
RestCook.prototype.__buildActionIndex = function(resource) {

	var model = resource.model,
		action = resource.action.index,
		self = this;

	if (action.handler) {
		this.__handle(action.route, 'get', action.handler);
	} else {
		this._app.get(action.route, function(req, res) {
			var _m = self._models[model];
			if (_m) {
				_m.find().lean().exec(function(err, result) {
					self.__respond(res, err, result);
				});
			} else {
				res.json(404);
			}
		});
	}
};

/**
 * Build action post.
 *
 * @param resource {Object}
 * @private
 */
RestCook.prototype.__buildActionPost = function(resource) {

	var model = resource.model,
		action = resource.action.post,
		self = this;

	if (action.handler) {
		this.__handle(action.route, 'post', action.handler);
	} else {
		this._app.post(action.route, function(req, res) {
			var _m = self._models[model];
			if (_m) {
				var doc = new _m(req.body);
				doc.save(function(err, d) {
					self.__respond(res, err, d);
				});
			} else {
				res.json(404);
			}
		});
	}
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
		action = resource.action.get,
		self = this;

	if (action.handler) {
		this.__handle(action.route, 'get', action.handler);
	} else {
		this._app.get(action.route, function(req, res) {
			var _m = self._models[model];
			if (_m) {
				var q = {};
				q[pk] = req.param(pk);
				_m.findOne(q).lean().exec(function(err, result) {
					self.__respond(res, err, result ? result : null);
				});
			} else {
				res.json(404);
			}
		});
	}
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
		action = resource.action.put,
		self = this;

	if (action.handler) {
		this.__handle(action.route, 'put', action.handler);
	} else {
		this._app.put(action.route, function(req, res) {
			var _m = self._models[model];
			if (_m) {
				var q = {};
				q[pk] = req.param(pk);
				var s = req.body;
				_m.findOneAndUpdate(q, s).exec(function(err) {
					self.__respond(res, err);
				});
			} else {
				res.json(404);
			}
		});
	}
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
		action = resource.action.del,
		self = this;

	if (action.handler) {
		this.__handle(action.route, 'del', action.handler);
	} else {
		this._app.del(action.route, function(req, res) {
			var _m = self._models[model];
			if (_m) {
				var q = {};
				q[pk] = req.param(pk);
				_m.findOneAndRemove(q).exec(function(err) {
					self.__respond(res, err);
				});
			} else {
				res.json(404);
			}
		});
	}
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
	var self = this;
	this._app[method](route, function(req, res) {
		handler(req, res, function(err, result) {
			self.__respond(res, err, result);
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

/**
 * Short cuts for mongoose type.
 */
RestCook.Types = {
	ObjectId: mongoose.Schema.Types.ObjectId,
	Mixed: mongoose.Schema.Types.Mixed
};

/**
 * Module exports.
 */
module.exports = RestCook;