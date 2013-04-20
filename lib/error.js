var util = require("util");

/**
 * HttpError.
 *
 * @param code {Number} : http status code
 * @param status {String} : http status description
 * @param message {String} : message of error
 * @constructor
 */

function HttpError(code, status, message) {

    Error.call(this, message);

    var __code = code,
        __status = status,
        __message = message;

    this.__defineGetter__('code', function() {
        return __code;
    });

    this.__defineGetter__('status', function() {
        return __status;
    });

    this.__defineGetter__('message', function() {
        return __message;
    });

    this.toString = function() {
        return __message;
    };

    this.toJSON = function() {
        return {
            code: __code,
            message: __message
        };
    };

}
util.inherits(exports.HttpError, Error);

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

module.exports = function(code, message) {
    return statusCodes[code] ? new HttpError(code, statusCodes[code], message) : undefined;
};