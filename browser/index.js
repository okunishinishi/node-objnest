/**
 * Convert nested object to flatten or expand.
 * @module objnest
 * @version 2.0.6
 */

'use strict';

var pkg = require('../package.json');
var create = require('./create');
var Objnest = require('./objnest');

var lib = create();

lib.version = pkg.version;
lib.create = create;
lib.Objnest = Objnest;

module.exports = lib;