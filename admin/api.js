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

};

/**
 * POST /api/resource
 */
module.exports.postResource = function(req, res) {
	var name = req.param('name');
	$(req).createResource(name, function(e) {
		res.send(200);
	});
};

/**
 * PUT /api/resource
 */
module.exports.putResource = function(req, res) {

};

/**
 * DELETE /api/resource
 */
module.exports.delResource = function(req, res) {

};