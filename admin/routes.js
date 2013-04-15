/**
 * GET /.
 */
exports.index = function(req, res) {
	res.render('index', {
		controller: 'ResourcesCtrl'
	});
};

/**
 * GET /resource/:resource
 */
exports.resource = function(req, res) {
	res.render('index', {
		controller: 'ResourceCtrl'
	});
};

/**
 * GET /resource/:resource/model
 */
exports.resource = function(req, res) {
	res.render('index', {
		controller: 'ModelCtrl'
	});
};


exports.partial = function(req, res) {
	var name = req.params.name;
	res.render('partial/' + name);
};