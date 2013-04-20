var RestCook = require('../../lib/restcook');

// create application
var app = new RestCook({
	db: 'mongodb://localhost/test',
	port: 3030
});

// define resource
app.resource('test', {
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

app.start();