/**
 * Dependences
 */
var mongoose = require('mongoose'),
	error = require('./error'),
	log = require('./log');

/**
 * Create resource.
 *
 * @param {String} `name` name of resource
 * @param {Schema} `schema` schema of resource
 * @returns {Object}
 * @constructor
 */
var Res = function(name, schema) {

	// schema, model
	var schema = new mongoose.Schema(schema);
	var model = mongoose.model(name, schema);

	// action
	var action = {
		post: null, // post /:resource -> create resource
		get: null, // get  /:resource -> query on collection
		getOne: null, // get  /:resource/:id -> get resource
		getField: null, // get  /:resource/:id/:field -> get field's value of resource
		put: null, // put  /:resource -> update on collection
		putOne: null, // put  /:resource/:id -> update resource
		putField: null, // put  /:resource/:id/:field -> update field's value of resource
		del: null, // del  /:resource -> delete on collection
		delOne: null, // del  /:resource/:id -> delete resource
		delField: null // del  /:resource/:id/:field -> delete field of resource
	};

	// getters

	this.__defineGetter__('name', function() {
		return name;
	});

	this.__defineGetter__('schema', function() {
		return schema;
	});

	this.__defineGetter__('model', function() {
		return model;
	});

	this.__defineGetter__('action', function() {
		return action;
	});
};

/**
 * Setup `post /:resource` handler.
 *
 * @param {Function, Object} `[arg]`
 * 		- if the `arg` parameter is a function, customized handler is applied to post request.
 * 		- else a default handler is applied to post request.
 * @public api
 */
Res.prototype.post = function(arg) {

	var fn = ('function' == typeof arg) ? arg : function(req, res, next) {

			var doc = new this.model(req.body);
			doc.save(function(err, doc) {
				err = err ? error(500, err.message) : null;
				next(req, res, err, doc);
			});
		};
	this.action.post = fn.bind(this);
};

/**
 * Setup `get /:resource` handler.
 *
 * @param {Function, Object} `arg`
 * @public api
 */
Res.prototype.get = function(arg) {

	var fn = ('function' == typeof arg) ? arg : function(req, res, next) {

			var da = this.model.find();
			da.exec(function(err, doc) {
				err = err ? error(500, err.message) : null;
				next(req, res, err, doc);
			});
		};
	this.action.get = fn.bind(this);
};

/**
 * Setup `get /:resource/:id` handler.
 *
 * @param {Function, Object} `arg`
 * @public api
 */
Res.prototype.getOne = function(arg) {

	var fn = ('function' == typeof arg) ? arg : function(req, res, next) {

			var id = req.params.id;
			var da = this.model.findById(id);
			da.exec(function(err, doc) {
				if (err) {
					err = error(500, err.message);
				} else if (doc === null) {
					err = error(404);
				};
				next(req, res, err, doc);
			});
		};
	this.action.getOne = fn.bind(this);
};

/**
 * Setup `get /:resource/:id/:field` handler.
 *
 * @param {Function, Object} `arg`
 * @public api
 */
Res.prototype.getField = function(arg) {

	var fn = ('function' == typeof arg) ? arg : function(req, res, next) {

			var id = req.params.id,
				fd = req.params.field;
			var da = this.model.findById(id);
			da.exec(function(err, doc) {
				if (err) {
					err = error(500, err.message);
				} else if (doc === null) {
					err = error(404);
				} else if (doc !== null) {
					doc = doc.get(fd);
				};
				next(req, res, err, doc);
			});
		};
	this.action.getField = fn.bind(this);
};

/**
 * Setup `put /:resource` handler.
 *
 * @param {Function, Object} `arg`
 * @public api
 */
Res.prototype.put = function(arg) {

	var fn = ('function' == typeof arg) ? arg : function(req, res, next) {

		};
	this.action.put = fn.bind(this);
};

/**
 * Setup `put /:resource/:id` handler.
 *
 * @param {Function, Object} `arg`
 * @public api
 */
Res.prototype.putOne = function(arg) {

	var fn = ('function' == typeof arg) ? arg : function(req, res, next) {

			var id = req.params.id,
				set = req.params.body;

			this.model.findByIdAndUpdate(id, set, function(err, doc) {
				if (err) {
					err = error(500, err.message);
				} else if (doc === null) {
					err = error(404);
				};
				next(req, res, err, doc);
			});
		};
	this.action.putOne = fn.bind(this);
};

/**
 * Setup `put /:resource/:id/:field` handler.
 *
 * @param {Function, Object} `arg`
 * @public api
 */
Res.prototype.putField = function(arg) {

	var fn = ('function' == typeof arg) ? arg : function(req, res, next) {

			var id = req.params.id,
				field = req.params.field,
				value = req.body.value,
				set = {};

			set[field] = value;
			this.model.findByIdAndUpdate(id, set, function(err, doc) {
				if (err) {
					err = error(500, err.message);
				} else if (doc === null) {
					err = error(404);
				};
				next(req, res, err, doc);
			});
		};
	this.action.putField = fn.bind(this);
};

/**
 * Setup `delete /:resource` handler.
 *
 * @param {Function, Object} `arg`
 * @public api
 */
Res.prototype.del = function(arg) {

	var fn = ('function' == typeof arg) ? arg : function(req, res, next) {

		};
	this.action.del = fn.bind(this);
};

/**
 * Setup `delete /:resource/:id` handler.
 *
 * @param {Function, Object} `arg`
 * @public api
 */
Res.prototype.delOne = function(arg) {

	var fn = ('function' == typeof arg) ? arg : function(req, res, next) {

			var id = req.params.id;
			this.model.findByIdAndRemove(id, function(err, doc) {
				if (err) {
					err = error(500, err.message);
				} else if (doc === null) {
					err = error(404);
				};
				next(req, res, err, doc);
			});
		};
	this.action.delOne = fn.bind(this);
};

/**
 * Setup `delete /:resource/:id/:field` handler.
 *
 * @param {Function, Object} `arg`
 * @public api
 */
Res.prototype.delField = function(arg) {

	var fn = ('function' == typeof arg) ? arg : function(req, res, next) {

			var id = req.params.id,
				field = req.params.field,
				set = {
					$unset: {}
				};

			set.$unset[field] = "";
			this.model.findByIdAndUpdate(id, set, function(err, doc) {
				if (err) {
					err = error(500, err.message);
				} else if (doc === null) {
					err = error(404);
				};
				next(req, res, err, doc);
			});
		};
	this.action.delField = fn.bind(this);
};

module.exports = Res;