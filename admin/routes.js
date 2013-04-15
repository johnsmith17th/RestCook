/**
 * GET /.
 */
exports.index = function(req, res) {
	res.render('index', {
		base: '/',
		controller: 'ResourcesCtrl'
	});
};

/**
 * GET /resource/:resource
 */
exports.resource = function(req, res) {
	res.render('index', {
		base: '/',
		controller: 'ResourceCtrl'
	});
};

exports.partial = function(req, res) {
	var name = req.params.name;
	res.render('partial/' + name);
};