var assert = require('assert-plus'),
	util = require('util'),
	mongoose = require('mongoose'),
	error = require('./error');

/**
 * Short cuts.
 */
var F = util.format;

/**
 * Resource.
 *
 * @param key {String}
 * @param options {Object}
 * @constructor
 */

function Resource(key, options) {

	assert.string(key, 'key');
	assert.object(options, 'options');

	// key
	this.__defineGetter__('key', function() {
		return key;
	});

	// name
	assert.optionalString(options.name, 'options.name');
	var name = options.name ? options.name : key;
	this.__defineGetter__('name', function() {
		return name;
	});

	// desc
	assert.optionalString(options.desc, 'options.desc');
	var desc = options.desc ? options.desc : F('Default description of resource %s.', name);
	this.__defineGetter__('desc', function() {
		return desc;
	});

	// route
	assert.optionalString(options.route, 'options.route');
	var route = options.route ? options.route : F('/%s', name.toLowerCase());
	this.__defineGetter__('route', function() {
		return route;
	});

	// model name
	assert.optionalString(options.model, 'options.model');
	var modelName = options.model ? options.model : (name.charAt(0).toUpperCase() + name.slice(1));
	this.__defineGetter__('modelName', function() {
		return modelName;
	});

	// collection name
	assert.optionalString(options.collection, 'options.collection');
	var collectionName = options.collection ? options.collection : F('%ss', name.toLowerCase());
	this.__defineGetter__('collectionName', function() {
		return collectionName;
	});

	// pk
	assert.optionalString(options.pk, 'options.pk');
	var pk = options.pk ? options.pk : 'id';
	this.__defineGetter__('pk', function() {
		return pk;
	});

	// schema
	assert.optionalObject(options.schema, 'options.schema');
	var schema = new mongoose.Schema(options.schema, {
		collection: collectionName
	});
	this.__defineGetter__('schema', function() {
		return schema;
	});

	// model
	var model = mongoose.model(modelName, schema);
	this.__defineGetter__('model', function() {
		return model;
	});

	if (!options.action) {
		return;
	}

	// handlers
	assert.object(options.action, 'options.action');

	var index = undefined,
		post = undefined,
		get = undefined,
		put = undefined,
		del = undefined;

	// index
	var action = options.action.index;
	if (action) {
		index = {};

		// route
		index.route = route;

		// handler
		index.handler = null;
		if (action.handler) {
			assert.func(action.handler, 'options.action.index');
			index.handler = action.handler;
		} else {
			index.handler = function(req, res, next) {
				model.find().lean().exec(function(err, doc) {
					if (err) next(error(500), null);
					else next(err, doc);
				});
			};
		}
	}
	this.__defineGetter__('index', function() {
		return index;
	});

	// post
	action = options.action.post;
	if (action) {
		post = {};

		// route
		post.route = route;

		// handler
		post.handler = null;
		if (action.handler) {
			assert.func(action.handler, 'options.action.post');
			post.handler = action.handler;
		} else {
			post.handler = function(req, res, next) {
				var doc = new model(req.body);
				doc.save(function(err, doc) {
					if (err) next(error(500), null);
					else next(err, doc);
				});
			};
		}
	}
	this.__defineGetter__('post', function() {
		return post;
	});

	// get handler
	action = options.action.get;
	if (action) {
		get = {};

		// route
		get.route = F('%s/:%s', route, pk);

		// handler
		get.handler = null;
		if (action.handler) {
			assert.func(action.handler, 'options.action.get');
			get.handler = action.handler;
		} else {
			get.handler = function(req, res, next) {
				var q = {};
				q[pk] = req.param(pk);
				model.findOne(q).lean().exec(function(err, doc) {
					if (err) next(error(500), null);
					else if (!doc) next(error(404), null);
					else next(err, doc);
				});
			};
		}
	}
	this.__defineGetter__('get', function() {
		return get;
	});

	// put
	action = options.action.put;
	if (action) {
		put = {};

		// route
		put.route = F('%s/:%s', route, pk);;

		// handler
		put.handler = null;
		if (action.handler) {
			assert.func(action.handler, 'options.action.put');
			put.handler = action.handler;
		} else {
			put.handler = function(req, res, next) {
				var q = {};
				q[pk] = req.param(pk);
				var s = req.body;
				model.findOneAndUpdate(q, s).exec(function(err, doc) {
					if (err) next(error(500), null);
					else if (!doc) next(error(404), null);
					else next(err, doc);
				});
			};
		}
	}
	this.__defineGetter__('put', function() {
		return put;
	});

	// del
	action = options.action.del;
	if (action) {
		del = {};

		// route
		del.route = F('%s/:%s', route, pk);;

		// handler
		del.handler = null;
		if (action.handler) {
			assert.func(action.handler, 'options.action.del');
			del.handler = action.handler;
		} else {
			del.handler = function(req, res, next) {
				var q = {};
				q[pk] = req.param(pk);
				model.findOneAndRemove(q).exec(function(err, doc) {
					if (err) next(error(500), null);
					else if (!doc) next(error(404), null);
					else next(err, doc);
				});
			};
		}
	}
	this.__defineGetter__('del', function() {
		return del;
	});
}

module.exports = Resource;