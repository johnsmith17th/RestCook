/**
 * Module dependencies.
 */
var express = require('express'),
	Manager = require('./manager'),
	errors = require('./errors');

/**
 * Initialize app.
 */

var app = module.exports = express(),
	manager = new Manager('config.json');

manager.load(function(err) {
	if (err) {
		console.log(err);
	}
});

app.configure(function() {
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
	app.use(express.bodyParser());
	app.use(express.cookieParser());
	app.use(express.methodOverride());
	app.use(app.router);
	app.use(express.static(__dirname + '/public'));
});

/**
 * Routing
 */

/**
 * GET /
 */
app.get('/', function(req, res) {
	var resources = manager.resources();
	res.render('index', {
		resources: resources
	});
});

/**
 * POST /resource
 * to create new resource
 */
app.post('/resource', function(req, res) {
	manager.createResource(req.param('resourceName'), function(err) {
		if (err) {
			console.log(err);
		}
		res.redirect('/');
	});
});

/**
 * GET /resource
 * to get resource detial
 */
app.get('/resource', function(req, res) {
	var name = req.param('res');
	var resource = manager.getResource(name);
	if (resource) {
		res.render('basic', {
			resource: resource
		});
	} else {
		res.render('error', errors.e404);
	}
});

/**
 * DELETE /resource
 * to delete resource
 */
app.del('/resource', function(req, res) {
	var name = req.param('resourceName');
	manager.deleteResource(name, function(err) {
		if (err) {
			console.log(err);
		}
		res.redirect('/');
	});
});

/**
 * GET /resource/model
 * to get model of resource
 */
app.get('/resource/model', function(req, res) {
	var name = req.param('res');
	var model = manager.getModel(name);
	if (model) {
		res.render('model', {
			resource: name,
			model: model
		});
	} else {
		res.render('error', errors.e404);
	}
});

/**
 * PUT /resource/model
 * to update model of resource
 */
app.put('/resource/model', function(req, res) {
	var name = req.param('resourceName');
	var opt = {
		name: req.param('modelName'),
		collection: req.param('modelCollection')
	}
	manager.updateModel(name, opt, function(err) {
		if (err) {
			console.log(err);
		}
		res.redirect('/resource/model?res=' + name);
	});
});

/**
 * PUT /resource/model/schema
 * to create or update field of resource model schema
 */
app.put('/resource/model/schema', function(req, res) {
	var name = req.param('resourceName');
	var opt = {
		name: req.param('fieldName'),
		desc: req.param('fieldDesc'),
		type: req.param('fieldType'),
		default: req.param('fieldDefault'),
		required: req.param('fieldRequired'),
		indexed: req.param('fieldIndexed'),
		unique: req.param('fieldUnique')
	}
	manager.setField(name, opt, function(err) {
		if (err) {
			console.log(err);
		}
		res.redirect('/resource/model?res=' + name);
	});
});