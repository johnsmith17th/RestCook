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
	var result = null;
	if (resource) {
		result = {
			name: resource.name,
			path: resource.path,
			desc: resource.desc,
			method_get: resource.methods['get'].enable,
			method_post: resource.methods['post'].enable,
			method_put: resource.methods['put'].enable,
			method_delete: resource.methods['delete'].enable
		};
	}
	res.json({
		resource: result
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
	var name = req.param('name'),
		opt = {
			path: req.param('path'),
			desc: req.param('desc'),
			methods: {
				get: req.param('method_get') == 'true',
				post: req.param('method_post') == 'true',
				put: req.param('method_put') == 'true',
				delete: req.param('method_delete') == 'true'
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
	var name = req.param('name');
	$(req).deleteResource(name, function(e) {
		if (e) console.log(e);
		res.send(200);
	});
};