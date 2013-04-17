var restify = require('restify'),
	assert = require('assert-plus');

var client = restify.createJsonClient({
	url: 'http://localhost:3030'
});

module.exports.test = {

	setUp: function(callback) {
		callback();
	},

	tearDown: function(callback) {
		callback();
	},

	post: function(test) {
		var p = {
			key: 'my_key',
			value: 'my_value'
		};
		client.post('/test', p, function(err, req, res, obj) {
			test.done();
			console.log(obj);
		});
	},

	get: function(test) {
		client.get('/test/my_key', function(err, req, res, obj) {
			test.expect(1);
			test.equal('my_key', obj.key);
			test.done();
			console.log(obj);
		});
	},

	put: function(test) {
		var p = {
			value: 'my_value_modify'
		};
		client.put('/test/my_key', p, function(err, req, res, obj) {
			test.done();
			console.log(obj);
		});
	},

	index: function(test) {
		client.get('/test', function(err, req, res, obj) {
			test.done();
			console.log(obj);
		});
	},

	del: function(test) {
		client.del('/test/my_key', function(err, req, res, obj) {
			test.done();
			console.log(obj);
		});
	}

};