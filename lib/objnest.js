/**
 * @class Objnest
 * @param {object} config
 */
'use strict'

const extend = require('extend')
const abind = require('abind')
const isArrayKey = require('./key/is_array_key')
const fromArrayKey = require('./key/from_array_key')
const toArrayKey = require('./key/to_array_key')

/** @lends Objnest */
function Objnest (config) {
  const s = this
  extend(s, config || {})
  abind(s)
}

Objnest.prototype = {
  separator: '.',
  /**
   * @function expand
   * @param {object} object - Obj to flatten
   * @returns {object} Flatten obj.
   * @example
   *  const obj = objnest.expand({
   *      'foo.bar': 'baz'
   *  })
   *  console.log(obj) // => {foo: {bar: 'baz'}}
   */
  expand (object) {
    const s = this
    if (Array.isArray(object)) {
      return object.map((object) => s.expand(object))
    }
    const separator = s.separator
    const result = {}
    for (let key of Object.keys(object)) {
      let val = object[key]
      const needsSeparate = !!~key.indexOf(separator)
      if (needsSeparate) {
        const subKeys = key.split(separator)
        const subObj = {}
        const thisKey = subKeys.shift()
        subObj[subKeys.join('.')] = val
        const subExpandedObj = s.expand(subObj)
        const thisVal = result[thisKey]
        val = s._merge(thisVal, subExpandedObj)
        key = thisKey
      }
      if (isArrayKey(key)) {
        let arrayKey = fromArrayKey(key)
        result[arrayKey.name] = result[arrayKey.name] || []
        result[arrayKey.name][arrayKey.index] = s._merge(
          result[arrayKey.name][arrayKey.index],
          val
        )
      } else {
        result[key] = val
      }
    }
    return result
  },
  /**
   * Flatten nested object.
   * @param {object} nested - Object to flatten.
   * @returns {object} - Flattened object.
   * @example
   *  const flattened = objnest.flatten({
   *      'foo': {'bar': 'baz'}
   *  })
   *  console.log(flattened) // => {'foo.bar': 'baz'}
   */
  flatten (nested) {
    const s = this
    if (typeof nested === 'string') {
      return nested
    }
    const separator = s.separator
    const flattened = {}
    for (const key of Object.keys(nested || {})) {
      const value = nested[key]
      switch (typeof value) {
        case 'string':
        case 'number':
        case 'boolean':
        case 'function':
          flattened[key] = value
          break
        default:
          const subValues = s.flatten(value)
          for (const subKey of Object.keys(subValues)) {
            let fullKey
            if (Array.isArray(value)) {
              fullKey = key + toArrayKey(subKey)
            } else {
              fullKey = [key, subKey].join(separator)
            }
            flattened[fullKey] = subValues[subKey]
          }
          break
      }
    }
    return flattened
  },
  _merge (v1, v2) {
    if (typeof v1 === 'undefined') {
      return v2
    }
    if (typeof v2 === 'undefined') {
      return v1
    }
    return extend(true, v1, v2 || {})
  }
}

module.exports = Objnest
