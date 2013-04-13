var fs = require('fs'),
	util = require('util');

function Store(path) {

	var self = this;

	this.path = path;

	function __name(name) {
		return name.toLowerCase();
	};

	function __path(name) {
		var value = name.replace(/\//g, '').replace(/\./g, '/');
		return '/' + value;
	};

	function __desc(name) {
		return 'This is a resource named ' + name;
	};

	function __method(resource, method) {
		return {
			enable: true,
			desc: util.format('method %s of resource %s', method, resource),
			params: {}
		};
	}

	function __res(name) {
		var key = __name(name);
		return {
			name: key,
			path: __path(key),
			desc: __desc(key),
			model: {},
			methods: {
				index: __method(key, 'index'),
				get: __method(key, 'get'),
				post: __method(key, 'post'),
				put: __method(key, 'put'),
				delete: __method(key, 'delete')
			}
		};
	};

	this.config = {
		version: 0,
		resources: {
			test: __res('test')
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

	this.__name = __name;
	this.__path = __path;
	this.__desc = __desc;
	this.__method = __method;
	this.__res = __res;
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
		this.config.resources[name] = this.__res(name);
		this.config.version++;
		this.save(fn);
	}
	return this;
};

Store.prototype.updateResource = function(name, opt, fn) {
	var res = this.config.resources[name];
	if (res && opt) {
		res.path = opt.path ? opt.path : this.__path(res.name);
		res.desc = opt.desc ? opt.desc : this.__desc(res.name);
		res.methods['index'].enable = (opt.methods['index'] != undefined);
		res.methods['get'].enable = (opt.methods['get'] != undefined);
		res.methods['post'].enable = (opt.methods['post'] != undefined);
		res.methods['put'].enable = (opt.methods['put'] != undefined);
		res.methods['delete'].enable = (opt.methods['delete'] != undefined);
		this.config.version++;
		this.save(fn);
	} else {
		fn && fn(null);
	}

	return this;
};

module.exports = Store;