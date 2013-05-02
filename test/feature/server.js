global.DEBUG = true;

var RestCook = require('../../lib');

var cases = new RestCook.Resource('cases', {
	key: {
		type: String
	},
	value: {
		type: String
	}
});

cases.post();

var app = new RestCook();
app.reg(cases);
app.run();