var restify = require('restify'),
	mongoose = require('mongoose'),
	express = require('express');

var server = restify.createServer({
	name: 'RestCook',
	version: '1.0.0'
});
server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());

var schema = new mongoose.Schema({
	key: String,
	value: String
});

var model = mongoose.model('Test', schema);

mongoose.connect('mongodb://localhost/test');

server.get('/test', function(req, res, next) {
	model.find().lean().exec(function(err, result) {
		res.send(200, result);
	});
	return next();
});

server.listen(8080, function() {
	console.log('%s listening at %s', server.name, server.url);
});