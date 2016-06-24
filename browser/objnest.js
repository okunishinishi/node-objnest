/**
 * @constructor Objnest
 * @param {object} config
 */
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var extend = require('extend');
var isArrayKey = require('./key/is_array_key');
var fromArrayKey = require('./key/from_array_key');
var toArrayKey = require('./key/to_array_key');

/** @lends Objnest */
function Objnest(config) {
  var s = this;
  extend(s, config || {});
}

Objnest.prototype = {
  separator: '.',
  /**
   * @function expand
   * @param {object} object - Obj to flatten
   * @returns {object} Flatten obj.
   * @example
   *  let obj = objnest.expand({
     *      'foo.bar': 'baz'
     *  })
   *  console.log(obj) // => {foo: {bar: 'baz'}}
   */
  expand: function expand(object) {
    var s = this;
    if (Array.isArray(object)) {
      return object.map(function (object) {
        return s.expand(object);
      });
    }
    var separator = s.separator;
    var result = {};
    Object.keys(object).forEach(function (key) {
      var val = object[key];
      if (!! ~key.indexOf(separator)) {
        var subKeys = key.split(separator),
            subObj = {},
            thisKey = subKeys.shift();
        subObj[subKeys.join('.')] = val;
        var subExpandedObj = s.expand(subObj);
        var thisVal = result[thisKey];
        val = s._merge(thisVal, subExpandedObj);
        key = thisKey;
      }
      if (isArrayKey(key)) {
        var arrayKey = fromArrayKey(key);
        result[arrayKey.name] = result[arrayKey.name] || [];
        result[arrayKey.name][arrayKey.index] = s._merge(result[arrayKey.name][arrayKey.index], val);
      } else {
        result[key] = val;
      }
    });
    return result;
  },

  /**
   * Flatten nested object.
   * @param {object} nested - Object to flatten.
   * @returns {object} - Flattened object.
   * @example
   *  let flattened = objnest.flatten({
     *      'foo': {'bar': 'baz'}
     *  })
   *  console.log(flattened) // => {'foo.bar': 'baz'}
   */
  flatten: function flatten(nested) {
    var s = this;
    if (typeof nested === 'string') {
      return nested;
    }
    var separator = s.separator;
    var flattened = {};
    Object.keys(nested || {}).forEach(function (key) {
      var value = nested[key];
      switch (typeof value === 'undefined' ? 'undefined' : _typeof(value)) {
        case 'string':
        case 'number':
        case 'boolean':
        case 'function':
          flattened[key] = value;
          break;
        default:
          var subValues = s.flatten(value);
          Object.keys(subValues).forEach(function (subKey) {
            var fullKey = void 0;
            if (Array.isArray(value)) {
              fullKey = key + toArrayKey(subKey);
            } else {
              fullKey = [key, subKey].join(separator);
            }
            flattened[fullKey] = subValues[subKey];
          });
          break;
      }
    });
    return flattened;
  },
  _merge: function _merge(v1, v2) {
    if (typeof v1 === 'undefined') {
      return v2;
    }
    if (typeof v2 === 'undefined') {
      return v1;
    }
    return extend(true, v1, v2 || {});
  }
};

module.exports = Objnest;