/**
 * Convert nested object to flatten or expand.
 * @module objnest
 * @version 1.2.4
 */

"use strict";

var pkg = require('../package.json');

exports.version = pkg.version;
exports.expand = require('./expand');
exports.flatten = require('./flatten');
