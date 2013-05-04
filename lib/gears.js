/**
 * Dependencies
 */
var util = require('util'),
	error = require('./error');

var E = util.isError,
	F = util.format;

/**
 * Get param from `req` with `name`, a default value and decorator function can be passed.
 *
 * @param {express.Request} `req`
 * @param {String} `name`
 * @param {Mixed} `[def]` default value
 * @param {Function} `[deco]` decorator function
 * @returns {Mixed}
 * @private api
 */
var __param = function(req, name, def, deco) {
	var value = req.param(name, def);
	return ('function' == typeof deco) ? deco(value) : value;
};

/**
 * Get query condition from request context with options.
 * If a condition field is defined required in `opt` and missing in `req`, return 400 error.
 *
 * @param {express.Request} `req`
 * @param {Object} `opt`
 * @returns {Object, Error}
 * @private api
 */
var __conds = function(req, opt) {
	var val, out = {};
	for (var key in opt) {
		// required
		if (opt[key]) {
			if (req.query[key] !== undefined) {
				out[key] = req.query[key];
			} else {
				return error(400, F('`%s` is required for query', key));
			};
		}
		// optional
		else if (req.query[key] !== undefined) {
			out[key] = req.query[key];
		};
	};
	return out;
};

/**
 * Returns.
 * If `opt` is `true` then return the `doc` for result.
 * If `opt` is an object, then walk through the keys in `opt` and pick up the values from `doc`.
 * Else return a empty object.
 *
 * @param {Object} `opt`
 * @param {Object} `doc`
 * @returns {Object}
 * @private api
 */
module.exports.returns = function(opt, doc) {
	var res = {};
	if ('object' == typeof opt) {
		for (var key in opt) {
			if (opt[key]) {
				res[key] = doc.get(key);
			};
		};
	} else if (opt === true) {
		res = doc;
	};
	return res;
};

/**
 * Query.
 * If `opt` is `true`, get query expression from query string of `req` with the key `$query` and return query with condition.
 * If `opt` is an object, get query conditions from query string with keys in `opt` and return query with condition.
 * Else return query of the whole collection.
 *
 * @param {express.Request} `req`
 * @param {mongoose.Model} `model`
 * @param {Object} `opt`
 * @returns {mongoose.Query}
 * @private api
 */
module.exports.query = function(req, model, opt) {
	var cond;
	if ('object' == typeof opt) {
		cond = __conds(req, opt);
		return E(cond) ? cond : model.find(cond);
	} else if (opt === true) {
		cond = __param(req, '$query', null, function(v) {
			return v ? JSON.parse(v) : {};
		});
		return model.find(cond);
	} else {
		return model.find();
	};
};