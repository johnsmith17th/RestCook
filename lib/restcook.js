/**
 * Dependences
 */
var express = require('express'),
	mongoose = require('mongoose'),
	error = require('./error'),
	handler = require('./handler')
	resource = require('./resource');

/**
 * Create application.
 *
 * @param {Object} `[opt]` options
 * 		- {Server} `[srv]` express server
 *		- {String} `[db]` database connection string
 *		- {Number} `[port]` the port server to listen
 * @returns {RC} application instance
 * @constructor
 */
var RC = function(opt) {

	var self = this,
		srv = null,
		db = 'mongodb://localhost/test',
		port = 3030,
		res = {};

	if (opt) {
		db = opt.db || db;
		port = opt.port || port;
		srv = opt.srv || null;
	};

	if (!srv) {
		srv = express();
		srv.configure(function() {
			srv.use(express.bodyParser());
			srv.use(express.cookieParser());
			srv.use(express.methodOverride());
			srv.use(srv.router);
		});
	};

	// routing

	srv.post('/api/:resource', handler.post(this));

	srv.get('/api/:resource', handler.get(this));
	srv.get('/api/:resource/:id', handler.getOne(this));
	srv.get('/api/:resource/:id/:field', handler.getField(this));

	srv.put('/api/:resource', handler.put(this));
	srv.put('/api/:resource/:id', handler.putOne(this));
	srv.put('/api/:resource/:id/:field', handler.putField(this));

	srv.del('/api/:resource', handler.del(this));
	srv.del('/api/:resource/:id', handler.delOne(this));
	srv.del('/api/:resource/:id/:field', handler.delField(this));

	// getters

	this.__defineGetter__('server', function() {
		return srv;
	});

	this.__defineGetter__('db', function() {
		return db;
	});

	this.__defineGetter__('port', function() {
		return port;
	});

	this.__defineGetter__('resources', function() {
		return res;
	});
};

/**
 * Run server, connect the `db` and listen the `port`.
 *
 * @param {Function} `[fn]` callback function
 * @public api
 */
RC.prototype.run = function(fn) {
	mongoose.connect(this.db);
	this.server.listen(this.port);
	if ('function' == typeof fn) {
		fn();
	} else {
		console.log('Server start on port %d', this.port);
	}
};

/**
 * Register a resource to application.
 *
 * @param {RC.Resource} `res`
 * @public api
 */
RC.prototype.reg = function(res) {
	if (res instanceof RC.Resource) {
		this.resources[res.name] = res;
	};
};

RC.Resource = resource;

/**
 * Module
 */
module.exports = RC;