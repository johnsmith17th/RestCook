/**
 * Get param from express request with decorator.
 * 
 * @param req {HttpRequest}
 * @param p {String}
 * @param decorator {Function}
 */
module.exports.param = function(req, p, decorator) {
	var v = req.param(p);
	return decorator ? decorator(v) : v;
};