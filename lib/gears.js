/**
 * Dependencies
 */
var util = require('util'),
	error = require('./error');

/**
 * Shortcuts
 */
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
 * Conditions.
 *
 * @param {express.Request} `req`
 * @param {Object} `opt`
 * @returns {Object}
 */
var conditions = function(req, opt) {
	var cond;
	if ('object' == typeof opt) {
		return __conds(req, opt);
	} else if (opt === true) {
		return __param(req, '$query', null, function(v) {
			return v ? JSON.parse(v) : null;
		});
	} else {
		return null;
	};
};

module.exports.conditions = conditions;

/**
 * Setter.
 *
 * @param {express.Request} `req`
 * @param {Object} `opt`
 * @returns {Object}
 */
module.exports.setter = function(req, opt) {
	var set = {};
	for (var key in opt) {
		if (key in req.body) {
			set[key] = req.body[key];
		};
	};
	return set;
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
	var cond = conditions(req, opt);
	// without condition
	if (cond == null) {
		return model.find();
	}
	// something error
	else if (E(cond)) {
		return cond;
	}
	// query with conditions
	else {
		return model.query(cond);
	};
};

/**
 * Select.
 *
 * @param {express.Request} `req`
 * @param {mongoose.Query} `query`
 * @param {Object} `opt`
 * @returns {mongoose.Query}
 * @private api
 */
module.exports.select = function(req, query, opt) {
	if ('object' == typeof opt && opt.defaults) {
		return query.select(opt.defaults);
	} else if (opt === true) {
		var filter = __param(req, '$select', null, function(v) {
			return v ? v.replace(/\,/g, ' ') : null;
		});
		return filter ? query.select(filter) : query;
	} else {
		return query;
	};
};

/**
 * Sort.
 *
 * @param {express.Request} `req`
 * @param {mongoose.Query} `query`
 * @param {Object} `opt`
 * @returns {mongoose.Query}
 * @private api
 */
module.exports.sort = function(req, query, opt) {
	if ('object' == typeof opt && opt.defaults) {
		return query.sort(opt.defaults);
	} else if (opt === true) {
		var order = __param(req, '$sort', null, function(v) {
			return v ? v.replace(/\,/g, ' ') : null;
		});
		return order ? query.sort(order) : query;
	} else {
		return query;
	};
};

/**
 * Page.
 *
 * @param {express.Request} `req`
 * @param {mongoose.Query} `query`
 * @param {Object} `opt`
 * @returns {mongoose.Query}
 * @private api
 */
module.exports.page = function(req, query, opt) {
	if (!opt) {
		return query;
	} else {
		var page, limit, skip;
		page = __param(req, '$page', 1, function(v) {
			return parseInt(v);
		});
		limit = __param(req, '$size', ((opt && opt.size) ? opt.size : 10), function(v) {
			return parseInt(v);
		});
		skip = (page * limit) - limit;
		return query.skip(skip).limit(limit);
	};
};