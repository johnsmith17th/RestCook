/*
 * Serve JSON to client.
 */

function $(req) {
	return req.app.settings.manager;
}

/**
 * GET /api/resources
 */
module.exports.getResources = function(req, res) {
	var resources = $(req).resources();
	res.json({
		resources: resources
	});
};

/**
 * GET /api/resource
 */
module.exports.getResource = function(req, res) {
	var name = req.param('resource');
	var resource = $(req).getResource(name);
	res.json({
		resource: resource
	});
};

/**
 * POST /api/resource
 */
module.exports.postResource = function(req, res) {
	var name = req.param('name');
	$(req).createResource(name, function(e) {
		if (e) console.log(e);
		res.send(200);
	});
};

/**
 * PUT /api/resource
 */
module.exports.putResource = function(req, res) {
	var name = req.param('resource'),
		opt = {
			path: req.param('path'),
			desc: req.param('desc'),
			methods: {
				get: req.param('get') ? true : false,
				post: req.param('post') ? true : false,
				put: req.param('put') ? true : false,
				delete: req.param('delete') ? true : false
			}
		};
	$(req).updateResource(name, opt, function(e) {
		if (e) console.log(e);
		res.send(200);
	});
};

/**
 * DELETE /api/resource
 */
module.exports.delResource = function(req, res) {
	var name = req.param('resource');
	$(req).deleteResource(name, function(e) {
		if (e) console.log(e);
		res.send(200);
	});
};