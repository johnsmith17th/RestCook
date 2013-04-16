/**
 * Module dependancies.
 */
var assert = require('assert-plus'),
	util = require('util');

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
};

/**
 * Create resource.
 *
 * @param config {Object} resource configuration:
 *		- name {String} optional, name of resource
 *		- desc {String}	optional, description of resource
 *		- route {String} optional, route
 *		- model {Object} required
 *			- name {String} name of model
 *		- action {Object}
 *		- command {Object}
 */
RestCook.prototype.resource = function(key, config) {

	assert.string(key, 'key');
	assert.object(config, 'config');
	assert.object(config.model, 'config.model');

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
	function _setup(from, to, field, type, desc, decorator, fallback) {
		if (from.hasOwnProperty(field) && assert[type]) {
			assert[type](from[field], desc);
			if (decorator) {
				to[field] = decorator(from[field]);
			} else {
				to[field] = from[field];
			}
		} else {
			to[field] = fallback();
		}
	}

	var _res = {};

	// setup resource name
	_setup(config, _res, 'name', 'string', 'config.name', null, function() {
		return key;
	});

	// setup resource description
	_setup(config, _res, 'desc', 'string', 'config.desc', null, function() {
		return F('Default description of resource %s.', _res.name);
	});

	// setup resource route
	_setup(config, _res, 'route', 'string', 'config.route', null, function() {
		return F('/%s', _res.name.toLowerCase());
	});

	// setup model


	// setup action

	// setup command

	this._resources[key] = _res;
}

/**
 * Setup database for application.
 *
 * @param server {String} server uri.
 */
RestCook.prototype.db = function(server) {
	assert.string(server, 'server');
	this._db = server;
}

/**
 * Create rest service of application.
 *
 * @param port {Number} port to listen.
 * @param fn {Function} optional, callback of server start.
 */
RestCook.prototype.service = function(port, fn) {
	// body...
};

/**
 * Module exports.
 */
module.exports = RestCook;