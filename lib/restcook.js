/**
 * Module dependancies.
 */
var assert = require('assert-plus'),
	util = require('util'),
	mongoose = require('mongoose'),
	express = require('express'),
	EventEmitter = require('events').EventEmitter,
	Resource = require('./resource');

/**
 * Short cuts
 */
var F = util.format;

/**
 * Create application.
 *
 * @param options {Object} :
 *		- name {String} application name,
 *		- db {String} mongodb connection string,
 *		- port {String} port the server listen to.
 * @constructor
 */

function RestCook(options) {

	var name = 'RestCook',
		app = express(),
		db = null,
		port = 3030,
		res = {};

	// init
	assert.optionalObject(options, 'options');
	if (options) {

		assert.optionalString(options.name, 'options.name');
		name = options.name ? options.name : name;

		assert.optionalString(options.db, 'options.db');
		db = options.db ? options.db : db;

		assert.optionalNumber(options.port, 'options.port');
		port = options.port ? options.port : port;
	};

	// express app
	app.configure(function() {
		//this._app.set('views', __dirname + '/views');
		//this._app.set('view engine', 'jade');
		app.use(express.bodyParser());
		app.use(express.cookieParser());
		app.use(express.methodOverride());
		app.use(app.router);
		//this._app.use(express.static(__dirname + '/public'));
	});

	// name, readonly
	this.__defineGetter__('name', function() {
		return name;
	});

	// app, readonly
	this.__defineGetter__('app', function() {
		return app;
	});

	// db, getter and setter
	this.__defineGetter__('db', function() {
		return db;
	});
	this.__defineSetter__('db', function(value) {
		assert.string(value, 'value');
		db = value;
	});

	// port, getter and setter
	this.__defineGetter__('port', function() {
		return port;
	});
	this.__defineSetter__('port', function(value) {
		assert.number(value, 'value');
		port = value;
	});

	// resources, readonly
	this.__defineGetter__('resources', function() {
		return res;
	});
}

/**
 * Inherit from EventEmitter.
 */
RestCook.prototype.__proto__ = EventEmitter.prototype;

/**
 * Create resource.
 *
 * @param key {String}
 * @param options {Object} resource options:
 *		- name {String} optional, name of resource,
 *		- desc {String}	optional, description of resource,
 *		- route {String} optional, route,
 *		- model {String} optional, model name of resource,
 *		- collection {String} optional, collection name of resource,
 *		- schema {Object}, optional, schema definition,
 *		- action {Object}, optional, action definition.
 * @returns restcook resource.
 * @public
 */
RestCook.prototype.resource = function(key, options) {

	assert.string(key, 'key');
	assert.object(options, 'options');

	var res = new Resource(key, options),
		self = this;

	if (res.index) {
		this.app.get(res.index.route, function(req, res) {
			res.index.handler(req, res, function(err, result) {
				self.__respond(res, err, result);
			});
		});
	}

	if (res.post) {
		this.app.post(res.post.route, function(req, res) {
			res.post.handler(req, res, function(err, result) {
				self.__respond(res, err, result);
			});
		});
	}

	if (res.get) {
		this.app.get(res.get.route, function(req, res) {
			res.get.handler(req, res, function(err, result) {
				self.__respond(res, err, result);
			});
		});
	}

	if (res.put) {
		this.app.put(res.put.route, function(req, res) {
			res.put.handler(req, res, function(err, result) {
				self.__respond(res, err, result);
			});
		});
	}

	if (res.del) {
		this.app.del(res.del.route, function(req, res) {
			res.del.handler(req, res, function(err, result) {
				self.__respond(res, err, result);
			});
		});
	}

	this.resources[key] = res;
	return res;
};

/**
 * Get schema of resource.
 *
 * @param key {String} resource key.
 * @return mongoose schema.
 * @public
 */
RestCook.prototype.schema = function(key) {
	return (this.resources[key] ? this.resources[key].schema : null);
};

/**
 * Get model of resource.
 *
 * @param key {String} resource key.
 * @return mongoose model.
 * @public
 */
RestCook.prototype.model = function(key) {
	return (this.resources[key] ? this.resources[key].model : null);
};

/**
 * Create rest service of application.
 *
 * @param port {Number} port to listen.
 * @param fn {Function} optional, callback of server start.
 */
RestCook.prototype.service = function(port, fn) {

	assert.optionalFunc(fn, 'fn');

	this.port = port;
	mongoose.connect(this.db);
	this.app.listen(port);
	if (fn) {
		fn();
	} else {
		console.log(F('%s start at %d', this._name, this._port));
	}
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