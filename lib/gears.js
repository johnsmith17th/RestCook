/**
 * Return object from `opt` and `doc`.
 *
 * @param {Object} `opt`
 * @param {Object} `doc`
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