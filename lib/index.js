/**
 * Convert nested object to flatten or expand.
 * @module objnest
 * @version 3.0.2
 */

'use strict'

const pkg = require('../package.json')
const create = require('./create')
const Objnest = require('./objnest')

let lib = create()

lib.version = pkg.version
lib.create = create
lib.Objnest = Objnest

module.exports = lib
