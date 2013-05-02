var restify = require('restify'),
	assert = require('assert-plus');

var client = restify.createJsonClient({
	url: 'http://localhost:3030'
});

var body = {
	key: 'test-key',
	value: 'test-value'
};
client.post('/api/cases', body, function(e, req, res, r) {
	console.log(r);
});