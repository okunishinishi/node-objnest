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

const isRecursive = (value) => {
  if (!value) {
    return false
  }
  const reservedClasses = [Date]
  const isReservedClass = reservedClasses.some((C) => value instanceof C)
  if (isReservedClass) {
    return false
  }
  switch (typeof value) {
    case 'string':
    case 'number':
    case 'boolean':
    case 'function':
      return false
    default:
      return true
  }
}

/** @lends Objnest */
function Objnest (config) {
  extend(this, config || {})
  abind(this)
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
    if (Array.isArray(object)) {
      return object.map((object) => this.expand(object))
    }
    const separator = this.separator
    const result = {}
    for (let key of Object.keys(object)) {
      let val = object[key]
      const needsSeparate = !!~key.indexOf(separator)
      if (needsSeparate) {
        const subKeys = key.split(separator)
        const subObj = {}
        const thisKey = subKeys.shift()
        subObj[subKeys.join('.')] = val
        const subExpandedObj = this.expand(subObj)
        const thisVal = result[thisKey]
        val = this._merge(thisVal, subExpandedObj)
        key = thisKey
      }
      if (isArrayKey(key)) {
        const arrayKey = fromArrayKey(key)
        if (!result[arrayKey.name]) {
          const length = object[`${arrayKey.name}[length]`] || 0
          result[arrayKey.name] = new Array(length)
        }
        if (arrayKey.index !== null) {
          result[arrayKey.name][arrayKey.index] = this._merge(
            result[arrayKey.name][arrayKey.index],
            val
          )
        }
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
    if (typeof nested === 'string') {
      return nested
    }
    const separator = this.separator
    const flattened = {}
    for (const key of Object.keys(nested || {})) {
      const value = nested[key]
      if (value === null) {
        flattened[key] = value
        continue
      }
      if (isRecursive(value)) {
        const subValues = this.flatten(value)
        const isArray = Array.isArray(value)
        if (isArray) {
          flattened[`${key}[length]`] = value.length
        }
        for (const subKey of Object.keys(subValues)) {
          let fullKey
          if (isArray) {
            fullKey = key + toArrayKey(subKey)
          } else {
            fullKey = [key, subKey].join(separator)
          }
          flattened[fullKey] = subValues[subKey]
        }
      } else {
        flattened[key] = value
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
