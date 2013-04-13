var restify = require('restify');

var server = restify.createServer({
	name: 'RestCook',
	version: '1.0.0'
});
server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());

server.get(/.*/, function(req, res, next) {
	res.send({resource: req.path()});
	return next();
});

server.listen(8080, function() {
	console.log('%s listening at %s', server.name, server.url);
});