var errors = require('./errors');

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
	res.json(200, {
		code: 200,
		message: resources
	});
};

/**
 * GET /api/resource
 */
module.exports.getResource = function(req, res) {
	var name = req.param('name');
	var resource = $(req).getResource(name);
	var result = null;
	if (resource) {
		var result = {
			name: resource.name,
			path: resource.path,
			desc: resource.desc,
			method_get: resource.methods['get'].enable,
			method_post: resource.methods['post'].enable,
			method_put: resource.methods['put'].enable,
			method_delete: resource.methods['delete'].enable
		};
		res.json(200, {
			code: 200,
			message: result
		});
	} else {
		res.json(404, errors.e404);
	}
};

/**
 * POST /api/resource
 */
module.exports.postResource = function(req, res) {
	var name = req.param('name');
	$(req).createResource(name, function(e) {
		if (e) res.json(500, errors.e500);
		else res.send(200);
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
		if (e) res.json(500, errors.e500);
		else res.send(200);
	});
};

/**
 * DELETE /api/resource
 */
module.exports.delResource = function(req, res) {
	var name = req.param('name');
	$(req).deleteResource(name, function(e) {
		if (e) res.json(500, errors.e500);
		else res.send(200);
	});
};

/**
 * GET /api/resource/model
 */
module.exports.getModel = function(req, res) {
	var name = req.param('name');
	var model = $(req).getModel(name);
	if (model) {
		res.json(200, {
			code: 200,
			message: model
		});
	} else {
		res.json(404, errors.e404);
	}
};

/**
 * PUT /api/resource/model
 */
module.exports.putModel = function(req, res) {
	var name = req.param('name'),
		opt = {
			name: req.param('model_name'),
			collection: req.param('model_collection')
		};
	$(req).updateModel(name, opt, function(e) {
		if (e) res.json(500, errors.e500);
		else res.send(200);
	});
};