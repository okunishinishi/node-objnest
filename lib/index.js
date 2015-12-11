/**
 * Convert nested object to flatten or expand.
 * @module objnest
 * @version 2.0.0
 */

"use strict";

const pkg = require('../package.json'),
    create = require('./create'),
    Objnest = require('./objnest');

let lib = create();

lib.version = pkg.version;
lib.create = create;
lib.Objnest = Objnest;

module.exports = Objnest;
