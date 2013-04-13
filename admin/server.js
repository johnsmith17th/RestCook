/**
 * Module dependencies.
 */
var express = require('express');
var Store = require('./store');

var app = module.exports = express(),
	store = new Store('config.json');

store.load(function(err) {
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

app.get('/', function(req, res) {
	var resources = store.resources();
	res.render('index', {
		resources: resources
	});
});

app.post('/resource', function(req, res) {
	store.createResource(req.param('resourceName'), function(err) {
		if (err) {
			console.log(err);
		}
		res.redirect('/');
	});
});

app.get('/resource', function(req, res) {
	// body...
});