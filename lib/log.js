/**
 * A wrapper of console.log, call when `global.DEBUG` is true.
 */
var log = function() {
	if (global.DEBUG) {
		console.log.apply(global, arguments);
	};
};

module.exports = log;