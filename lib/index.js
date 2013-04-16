/**
 * Module dependancies.
 */
var assert = require('assert-plus');

/**
 * Create application.
 *
 * @param name {String} application name.
 */
function RestCook(name) {
	assert.string(name, 'name');
	this._appName = name;
};

/**
 * Create resource.
 *
 * @param config {Object} resource configuration:
 *		- name {String} name
 *		- desc {String}	description
 *		- route {String} route
 *		- model {Object}
 *		- action {Object}
 */
RestCook.prototype.resource = function(config) {
	// body...
}

/**
 * Create rest service of application.
 *
 * @param port {Number} port to listen.
 */
RestCook.service = function(port, fn) {
	// body...
};

/**
 * Module exports.
 */
module.exports = RestCook;