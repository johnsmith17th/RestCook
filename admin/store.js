var fs = require('fs');

function Store(path) {

	var self = this;

	this.path = path;
	this.config = {
		version: 0,
		resources: {
			test: {
				name: 'test',
				path: '/test',
				desc: 'This is a default resource for test',
				model: {},
				methods: {
					index: {},
					get: {},
					post: {},
					put: {},
					delete: {}
				}
			}
		}
	}

	this.load = function load(fn) {
		fs.readFile(self.path, 'utf8', function(err, data) {
			if (data) {
				self.config = JSON.parse(data);
			}
			fn(err);
		});
		return self;
	};

	this.save = function save(fn) {
		var data = JSON.stringify(self.config, null, '\t');
		fs.writeFile(self.path, data, fn);
		return self;
	};
}

Store.prototype.resources = function() {
	return this.config.resources;
};

Store.prototype.getResource = function(name) {
	var res = this.config.resources[name];
	return res ? res : null;
};

Store.prototype.createResource = function(name, fn) {
	if (this.config.resources[name] === undefined) {
		this.config.resources[name] = {
			name: name,
			path: '/' + name,
			desc: 'This is a resource named ' + name,
			model: {},
			methods: {
				index: {},
				get: {},
				post: {},
				put: {},
				delete: {}
			}
		};
		this.config.version++;
		this.save(fn);
	}
	return this;
};

module.exports = Store;