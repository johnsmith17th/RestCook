var RestCook = require('./lib');

var app = new RestCook();

app.resource('test', {
	//name: 'Test',
	//desc: 'Description of resource Test',
	//route: '/test-all',
	//model: 'TestModel',
	//collection: 'testz',
	schema: {
		key: String,
		value: String
	},
	pk: 'key',
	action: {
		index: {},
		post: {},
		get: {},
		put: {},
		del: {}
	}
});

app.db('mongodb://localhost/test');

console.log(JSON.stringify(app._resources, null, 2));
console.log(app._db);