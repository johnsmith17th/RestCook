var util = require("util");

/**
 * HttpError.
 *
 * @param {Number} `code` http status code
 * @param {String} `status` http status description
 * @param {String} `message` customized message of error
 * @constructor
 */
var HttpError = function(code, status, message) {

	Error.call(this, message);
	Error.captureStackTrace(this, arguments.callee);

	this.__defineGetter__('code', function() {
		return code;
	});

	this.__defineGetter__('status', function() {
		return status;
	});

	this.__defineGetter__('message', function() {
		return message;
	});

	this.toString = function() {
		return message;
	};

	this.toJSON = function() {
		return {
			code: code,
			status: status,
			message: message
		};
	};

}
util.inherits(HttpError, Error);

var statusCodes = {
	400: "Bad Request",
	401: "Unauthorized",
	402: "Payment Required",
	403: "Forbidden",
	404: "Not Found",
	405: "Method Not Allowed",
	406: "Not Acceptable",
	407: "Proxy Authentication Required",
	408: "Request Timeout",
	409: "Conflict",
	410: "Gone",
	411: "Length Required",
	412: "Precondition Failed",
	413: "Request Entity Too Large",
	414: "Request-URI Too Long",
	415: "Unsupported Media Type",
	416: "Requested Range Not Satisfiable",
	417: "Expectation Failed",
	418: "Im a Teapot",
	425: "Unordered Collection",
	426: "Upgrade Required",
	428: "Precondition Required",
	429: "Too Many Requests",
	431: "Request Header Fields Too Large",
	444: "No Response",
	450: "Blocked By Windows Parental Controls",
	499: "Client Closed Request",
	500: "Internal Server Error",
	501: "Not Implemented",
	502: "Bad Gateway",
	503: "Service Unavailable",
	504: "Gateway Timeout",
	505: "HTTP Version Not Supported",
	506: "Variant Also Negotiates",
	507: "Insufficient Storage",
	508: "Loop Detected",
	509: "Bandwidth Limit Exceeded",
	510: "Not Extended",
	511: "Network Authentication Required"
};

/**
 * Return a http error with `code` and customized `message`.
 *
 * @param {Number} `code`
 * @param {String} `[message]`
 * @returns {HttpError}
 * @public api
 */
module.exports = function(code, message) {
	return statusCodes[code] ? new HttpError(code, statusCodes[code], message) : undefined;
};