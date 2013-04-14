var fs = require('fs'),
	util = require('util');

function Manager(path) {

	var self = this;

	this.path = path;

	// to clean resource name

	function __name(name) {
		return name.toLowerCase().replace(/[^\w\d\.-]+/g, '-');
	};

	// to build resource path

	function __path(name) {
		var value = name.replace(/\./g, '/');
		return '/' + value;
	};

	// to build default resource desc

	function __desc(name) {
		return util.format('This is a resource named %s.', name);
	};

	// to build resource model

	function __model(name) {
		var key = name.replace(/(\w)(\w*)/g, function(g0, g1, g2) {
			return g1.toUpperCase() + g2.toLowerCase();
		}).replace(/[^\w\d]+/g, '');
		var collection = name.replace(/[^\w\d]+/g, '_') + 's';
		return {
			name: key,
			collection: collection,
			schema: {}
		};
	}

	// to build resource method

	function __method(resource, method) {
		return {
			enable: true,
			desc: util.format('method %s of resource %s.', method, resource),
			params: {}
		};
	}

	// to build field of resource model schema

	function __field(name, opt) {
		var key = name.toLowerCase().replace(/[^\w\d_]+/g, '');
		var field = {
			name: key
		};
		field['desc'] = opt['desc'] ? opt['desc'] : '';
		field['type'] = opt['type'] ? opt['type'] : 'String';
		field['default'] = opt['default'] ? opt['default'] : undefined;
		field['required'] = opt['required'] ? true : false;
		field['indexed'] = opt['indexed'] ? true : false;
		field['unique'] = opt['unique'] ? true : false;
		return field;
	}

	// to build a resource

	function __res(name) {
		var key = __name(name);
		return {
			name: key,
			path: __path(key),
			desc: __desc(key),
			model: __model(key),
			methods: {
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

	// private methods
	this.__name = __name;
	this.__path = __path;
	this.__desc = __desc;
	this.__model = __model;
	this.__method = __method;
	this.__field = __field;
	this.__res = __res;
}

/**
 * Get resources.
 */
Manager.prototype.resources = function() {
	return this.config.resources;
};

/**
 * Get resource by name.
 */
Manager.prototype.getResource = function(name) {
	var res = this.config.resources[name];
	return res ? res : null;
};

/**
 * Create resource with name.
 * Create only if it dosen't exist.
 */
Manager.prototype.createResource = function(name, fn) {
	var key = this.__name(name);
	if (this.config.resources[key] === undefined) {
		var res = this.__res(name);
		this.config.resources[key] = res;
		this.config.version++;
		this.save(fn);
	} else {
		fn && fn(null);
	}
	return this;
};

/**
 * Update resource.
 */
Manager.prototype.updateResource = function(name, opt, fn) {
	var res = this.config.resources[name];
	if (res && opt) {
		res.path = opt.path ? opt.path : this.__path(res.name);
		res.desc = opt.desc ? opt.desc : this.__desc(res.name);
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

/**
 * Delete resource with name.
 */
Manager.prototype.deleteResource = function(name, fn) {
	if (this.config.resources[name]) {
		delete this.config.resources[name];
		this.config.version++;
		this.save(fn);
	} else {
		fn && fn(null);
	}
	return this;
};

/**
 * Get model of resource.
 */
Manager.prototype.getModel = function(resource) {
	var model = this.config.resources[resource].model;
	return model ? model : null;
};

/**
 * Update model of resource
 */
Manager.prototype.updateModel = function(resource, opt, fn) {
	var res = this.config.resources[resource];
	if (res && res.model) {

		if (opt.name) {
			res.model.name = opt.name;
		}

		if (opt.collection) {
			res.model.collection = opt.collection;
		}

		this.config.version++;
		this.save(fn);
	} else {
		fn && fn(null);
	}
	return this;
};

/**
 * Set field of resource model schema
 */
Manager.prototype.setField = function(resource, opt, fn) {

	var res = this.config.resources[resource];
	var field = this.__field(opt.name, opt);

	if (res && res.model && field.name) {

		if (!res.model.schema) {
			res.model.schema = {};
		}

		res.model.schema[field.name] = field;
		this.config.version++;
		this.save(fn);
	} else {
		fn && fn(null);
	}
	return this;
}

/**
 * Delete field of resource model schema
 */
Manager.prototype.deleteField = function(resource, name, fn) {
	var res = this.config.resources[resource];
	if (res && res.model && res.model.schema && res.model.schema[name]) {
		delete res.model.schema[name];
		this.config.version++;
		this.save(fn);
	} else {
		fn && fn(null);
	}
	return this;
}

module.exports = Manager;