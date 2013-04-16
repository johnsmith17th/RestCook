var RestCook = require('./lib');

var app = new RestCook();

app.resource('test', {
	name: 'Test',
	//desc: 'Description of resource Test',
	route: '/Mytest',
});

app.db('mongodb://localhost/test');

console.log(app._resources);
console.log(app._db);