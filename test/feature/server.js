var RestCook = require('../../lib/restcook');

// create application
var app = new RestCook();

// setup database
app.db('mongodb://localhost/test');

// setup resource
app.resource('test', {
	//name: 'Test',
	//desc: 'Description of resource Test',
	//route: '/test',
	//model: 'Test',
	//collection: 'tests',
	schema: {
		key: {
			type: String,
			required: true,
			index: {
				unique: true,
				dropDups: true
			}
		},
		value: {
			type: String,
			required: true
		}
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

// run application
app.service(3030);