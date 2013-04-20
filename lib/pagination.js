/**
 * This module is from mongoose-pagination.
 *
 * Copyright (c) 2012 Moveline Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

var mongoose = require('mongoose');

mongoose.Query.prototype.paginate = function paginate(page, limit, callback) {
	page = page || 1;
	limit = limit || 10;

	var query = this;
	var model = this.model;
	var skipFrom = (page * limit) - limit;

	query = query.skip(skipFrom).limit(limit);

	if (callback) {
		query.exec(function(err, docs) {
			if (err) {
				callback(err, null, null);
			} else {
				model.count(query._conditions, function(err, total) {
					if (err) {
						callback(err, null, null);
					} else {
						callback(null, docs, total);
					}
				});
			}
		});
	} else {
		return this;
	}
};