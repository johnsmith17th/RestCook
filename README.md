# RestCook
Build resource-oriented restful data service with nodejs and mongodb.

# Usage

	var RestCook = require('restcook');

	var app = new RestCook();
	app.db('mongodb://localhost/test');

	app.resource('test', {
		schema: {
			key: { type: String, required: true, index: { unique: true } },
			value: { type: String, required: true }
		},
		pk: 'key',
		action: {
			index: {},	// GET /test
			post: {},	// POST /test
			get: {},	// GET /test/:key
			put: {},	// PUT /test/:key
			del: {}		// DELETE /test/:key
		}
	});
	app.service(3030);

See more examples in test.

# Core API

#### RestCook(name:String)
Create a restful web service application. Optional `name` can be pass.

#### RestCook#db(server:String)
Set mongodb connection string `server`.

#### RestCook#resource(key:String, options:Object)
Create a resource with `key` and `options`. See resource options below.

#### RestCook#service(port:Number [, callback:Function])
The run the server and listen at `port`. A `callback` function can be applied.

# Resource Options
This library use a JavaScript object to describe resource. The following options are supported:

* `name` {String} : optional, name of resource.
* `desc` {String} : optional, description of resource.
* `route` {String} : optional, custom route pattern.
* `model` {String} : optional, name of mongoose model. 
* `collection` {String} : optional, collection name in mongodb.
* `pk` {String} : optional, specify a primary key of model, default is `_id`.
* `schema` {Object} : define mongoose schema for model, see [mongoose schema](http://mongoosejs.com/docs/guide.html).
* `action` {Object} : to configure actions of resource.

#### Action
To define actions of resource.

* `index` {Object} : for GET `/resource`
* `post` {Object} : for POST `/resource`
* `get` {Object} : for GET `/resource/:id`
* `put` {Object} : for PUT `/resource/:id`
* `del` {Object} : for DELETE `/resource/:id`

# License

The MIT License (MIT) Copyright (c) 2013 John Smith <john.smith.17th@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.