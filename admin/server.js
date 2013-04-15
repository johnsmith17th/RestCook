/**
 * Module dependencies.
 */
var express = require('express'),
	routes = require('./routes'),
	api = require('./api'),
	Manager = require('./manager'),
	errors = require('./errors');

/**
 * Initialize app.
 */

var app = module.exports = express();
var manager = new Manager('config.json');

manager.load(function(err) {
	if (err) console.log(err);
});

app.configure(function() {
	app.set('manager', manager);
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
	app.use(express.bodyParser());
	app.use(express.cookieParser());
	app.use(express.methodOverride());
	app.use(app.router);
	app.use(express.static(__dirname + '/public'));
});

/**
 * RESTful Routes
 */

// resources
app.get('/api/resources', api.getResources);

// resource
app.get('/api/resource', api.getResource);
app.post('/api/resource', api.postResource);
app.put('/api/resource', api.putResource);
app.del('/api/resource', api.delResource);

app.get('/api/resource/model', api.getModel);
app.put('/api/resource/model', api.putModel);

// resource model schema field
//app.put('/api/resource/model/schema/field', api.putField);
//app.del('/api/resource/model/schema/field', api.delField);

// views
app.get('/', routes.index);
app.get('/resource/:resource', routes.resource);
app.get('/resource/:resource/model', routes.model);
app.get('/partial/:name', routes.partial);