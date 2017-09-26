/**
 * Convert nested object to flatten or expand.
 * @module objnest
 * @version 4.0.0
 */

'use strict'

const create = require('./create')
const Objnest = require('./objnest')

const lib = create()

Object.assign(lib, create, {
  create,
  Objnest
})

module.exports = lib
