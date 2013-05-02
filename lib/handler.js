/**
 * Dependences
 */
var error = require('./error'),
	log = require('./log');

/**
 * Send http response, either `err` or `result`.
 *
 * @param {Request} `req`
 * @param {Response} `res`
 * @param {Error} `err`
 * @param {Object} `result`
 * @private api
 */
var send = function(req, res, err, result) {
	if (err) {
		res.json(err.code, err.toJSON());
	} else {
		res.json(200, result);
	};
};

/**
 * Create handler of `verb /:resource`.
 *
 * @param {Object} `app` application instance
 * @param {String} `verb` http verb
 * @param {String} `action` action of resource
 * @returns {Function}
 * @private api
 */
var pattern = function(app, verb, action) {

	return function(req, res) {

		log('%s %s', verb, req.path);

		var k = req.params.resource;
		var r = app.resources[k];

		// not found
		if (!r) {
			send(req, res, error(404));
			return;
		};

		// not allowed
		if (!r.action[action]) {
			send(req, res, error(405));
			return;
		};

		r.action[action](req, res, send);
	};
}

/**
 * Create handler of `post /:resource`.
 */
module.exports.post = function(app) {
	return pattern(app, 'post', 'post');
};

/**
 * Create handler of `get /:resource`.
 */
module.exports.get = function(app) {
	return pattern(app, 'get', 'get');
};

/**
 * Create handler of `get /:resource/:id`.
 */
module.exports.getOne = function(app) {
	return pattern(app, 'get', 'getOne');
};

/**
 * Create handler of `get /:resource/:id/:field`.
 */
module.exports.getField = function(app) {
	return pattern(app, 'get', 'getField');
};

/**
 * Create handler of `put /:resource`.
 */
module.exports.put = function(app) {
	return pattern(app, 'put', 'put');
};

/**
 * Create handler of `put /:resource/:id`.
 */
module.exports.putOne = function(app) {
	return pattern(app, 'put', 'putOne');
};

/**
 * Create handler of `put /:resource/:id/:field`.
 */
module.exports.putField = function(app) {
	return pattern(app, 'put', 'putField');
};

/**
 * Create handler of `delete /:resource`.
 */
module.exports.del = function(app) {
	return pattern(app, 'delete', 'del');
};

/**
 * Create handler of `delete /:resource/:id`.
 */
module.exports.delOne = function(app) {
	return pattern(app, 'delete', 'delOne');
};

/**
 * Create handler of `delete /:resource/:id/:field`.
 */
module.exports.delField = function(app) {
	return pattern(app, 'delete', 'delField');
};