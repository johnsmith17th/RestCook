var fs = require('fs');

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

	function __res(name) {
		var key = __name(name);
		return {
			name: key,
			path: __path(key),
			desc: __desc(key),
			model: {},
			methods: {
				index: {},
				get: {},
				post: {},
				put: {},
				delete: {}
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
		// set path
		res.path = opt.path ? opt.path : this.__path(res.name);
		// set desc
		res.desc = opt.desc ? opt.desc : this.__desc(res.name);

		// set method index
		if (opt.methods.index && !res.methods.index) {
			res.methods.index = {};
		} else if (!opt.methods.index && res.methods.index) {
			delete res.methods['index'];
		}

		// set method get
		if (opt.methods.get && !res.methods.get) {
			res.methods.get = {};
		} else if (!opt.methods.get && res.methods.get) {
			delete res.methods['get'];
		}

		// set method post
		if (opt.methods.post && !res.methods.post) {
			res.methods.post = {};
		} else if (!opt.methods.post && res.methods.post) {
			delete res.methods['post'];
		}

		// set method put
		if (opt.methods.put && !res.methods.put) {
			res.methods.put = {};
		} else if (!opt.methods.put && res.methods.put) {
			delete res.methods['put'];
		}

		// set method delete
		if (opt.methods['delete'] && !res.methods['delete']) {
			res.methods['delete'] = {};
		} else if (!opt.methods['delete'] && res.methods['delete']) {
			delete res.methods['delete'];
		}

		this.config.version++;
		this.save(fn);
	} else {
		fn && fn(null);
	}

	return this;
};

module.exports = Store;