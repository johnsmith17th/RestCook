/**
 * Dependences
 */
var mongoose = require('mongoose'),
	util = require('util'),
	error = require('./error'),
	gears = require('./gears'),
	log = require('./log');

/**
 * Shortcuts
 */
var E = util.isError,
	F = util.format;

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
		create: null, // post /:resource -> create resource
		find: null, // get  /:resource -> query on collection
		findOne: null, // get  /:resource/:id -> get resource
		update: null, // put  /:resource -> update on collection
		updateOne: null, // put  /:resource/:id -> update resource
		remove: null, // del  /:resource -> delete on collection
		removeOne: null, // del  /:resource/:id -> delete resource
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
 *	if the `arg` parameter is a function, customized handler is applied to this request.
 *	else a default handler is applied.
 *	options:
 *		- {Boolean, Object} `[returns]`
 *		  `true` to send back the created resource and `false` to send back nothing,
 *		  or a object to customize the fields to return, eg:
 *		  arg = { returns: { _id: 1, name: 1 } } to send back `_id` and `name`
 * @public api
 */
Res.prototype.create = function(arg) {
	var opt = ('object' == typeof arg) ? arg : {};
	var fun = ('function' == typeof arg) ? arg : function(req, res, next) {
			var doc = new this.model(req.body);
			doc.save(function(err, d) {
				var e = err ? error(500, err.message) : null,
					r = d ? gears.returns(opt.returns, d) : null;
				next(req, res, err, d);
			});
		};
	this.action.create = fun.bind(this);
};

/**
 * Setup `get /:resource` handler.
 *
 * @param {Function, Object} `arg`
 *	options:
 *		- {Object, Boolean} `[query]` enable query condition
 *		- {Object, Boolean} `[select]` enable selection on fields
 *		- {Object, Boolean} `[sort]` enable sorting
 *		- {Object, Boolean} `[page]` enable pagination
 * @public api
 */
Res.prototype.find = function(arg) {
	var opt = ('object' == typeof arg) ? arg : {};
	var fn = ('function' == typeof arg) ? arg : function(req, res, next) {
			var model = this.model;
			var da = gears.query(req, model, opt.query);
			// errors in query
			if (E(da)) {
				next(req, res, da, null);
				return;
			};
			da = gears.select(req, da, opt.select);
			da = gears.sort(req, da, opt.sort);
			da = gears.page(req, da, opt.page);
			// query
			da.exec(function(err, doc) {
				if (err) {
					next(req, res, error(500, err.message), null);
				} else if (opt.page) {
					model.count(da._conditions, function(err, total) {
						if (err) {
							next(req, res, error(500, err.message), null);
						} else {
							next(req, res, err, {
								partial: doc,
								total: total
							});
						}
					});
				} else {
					next(req, res, err, doc);
				}
			});
		};
	this.action.find = fn.bind(this);
};

/**
 * Setup `get /:resource/:id` handler.
 *
 * @param {Function, Object} `arg`
 * @public api
 */
Res.prototype.findOne = function(arg) {

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
	this.action.findOne = fn.bind(this);
};

/**
 * Setup `put /:resource` handler.
 *
 * @param {Function, Object} `arg`
 * @public api
 */
Res.prototype.update = function(arg) {

	var fn = ('function' == typeof arg) ? arg : function(req, res, next) {

		};
	this.action.update = fn.bind(this);
};

/**
 * Setup `put /:resource/:id` handler.
 *
 * @param {Function, Object} `arg`
 * @public api
 */
Res.prototype.updateOne = function(arg) {

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
	this.action.updateOne = fn.bind(this);
};

/**
 * Setup `delete /:resource` handler.
 *
 * @param {Function, Object} `arg`
 * @public api
 */
Res.prototype.remove = function(arg) {

	var fn = ('function' == typeof arg) ? arg : function(req, res, next) {

		};
	this.action.remove = fn.bind(this);
};

/**
 * Setup `delete /:resource/:id` handler.
 *
 * @param {Function, Object} `arg`
 * @public api
 */
Res.prototype.removeOne = function(arg) {

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
	this.action.removeOne = fn.bind(this);
};

module.exports = Res;