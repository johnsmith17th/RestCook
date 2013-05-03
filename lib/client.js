/**
 * Dependencies.
 */
var restify = require('restify'),
	F = require('util').format;

/**
 * Build url with `resource`, `id` and `field`.
 *
 * @param {String} `resource`
 * @param {String} `[id]`
 * @param {Object} `[options]`
 * @returns {String}
 * @private api
 */
var __route = function(resource, id, options) {

	if (resource && id) {
		return F('/%s/%s', resource, id);
	};

	if (resource) {
		return F('/%s', resource);
	};

	return '';
};

/**
 * RestCook client object.
 *
 * @constructor
 */
var Rcc = function(url) {

	var agent = restify.createJsonClient({
		url: url
	});

	this.__defineGetter__('agent', function() {
		return agent;
	});
};

/**
 * Send `post /:resource`.
 *
 * @param {String} `resource`
 * @param {Object} `params`
 * @param {Object} `options`
 * @param {Function} `callback`
 * @public api
 */
Rcc.prototype.create = function(resource, params, options, callback) {
	options = options || {};
	this.agent.post(__route(resource, null, options), params, callback);
};

/**
 * Send `get /:resource`.
 *
 * @param {String} `resource`
 * @param {Object} `options`
 * @param {Function} `callback`
 * @public api
 */
Rcc.prototype.find = function(resource, options, callback) {
	options = options || {};
	this.agent.get(__route(resource, null, options), callback);
};

/**
 * Send `get /:resource/:id`.
 *
 * @param {String} `resource`
 * @param {String} `id`
 * @param {Function} `callback`
 * @public api
 */
Rcc.prototype.findOne = function(resource, id, callback) {
	this.agent.get(__route(resource, id), callback);
};

/**
 * Send `put /:resource`.
 *
 * @param {String} `resource`
 * @param {Object} `options`
 * @param {Function} `callback`
 * @public api
 */
Rcc.prototype.update = function(resource, params, options, callback) {
	options = options || {};
	this.agent.put(__route(resource, null, options), params, callback);
};

/**
 * Send `put /:resource/:id`.
 *
 * @param {String} `resource`
 * @param {String} `id`
 * @param {Object} `params`
 * @param {Object} `options`
 * @param {Function} `callback`
 * @public api
 */
Rcc.prototype.updateOne = function(resource, id, params, options, callback) {
	options = options || {};
	this.agent.put(__route(resource, id, options), params, callback);
}

/**
 * Send `delete /:resource`.
 *
 * @param {String} `resource`
 * @param {Object} `options`
 * @param {Function} `callback`
 * @public api
 */
Rcc.prototype.remove = function(resource, options, callback) {
	options = options || {};
	this.agent.del(__route(resource, null, options), callback);
};

/**
 * Send `delete /:resource/:id`.
 *
 * @param {String} `resource`
 * @param {String} `id`
 * @param {Function} `callback`
 * @public api
 */
Rcc.prototype.removeOne = function(resource, id, callback) {
	this.agent.del(__route(resource, id), callback);
}

/**
 * Module
 */
module.exports = function(url) {
	return new Rcc(url);
};