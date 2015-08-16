/**
 * Convert nested object to flatten or expand.
 * @module objnest
 */
"use strict";

var extend = require('extend'),
    util = require('util');

/** @lends module:objnest */
var objnest = {
    /**
     * Flatten nested object.
     * @param {object} object - Obj to flatten
     * @returns {object} Flatten obj.
     * @example
     *  var obj = objnest.expand({
     *      'foo.bar': 'baz'
     *  });
     *  console.log(obj); // => {foo: {bar: 'baz'}}
     */
    expand: function (object) {
        var result = {};
        Object.keys(object).forEach(function (key) {
            var val = object[key];
            if (/\./g.test(key)) {
                var subKeys = key.split(/\./g),
                    subObj = {},
                    thisKey = subKeys.shift();
                subObj[subKeys.join('.')] = val;
                var subExpandedObj = objnest.expand(subObj);
                var thisVal = result[thisKey];
                val = extend(true, subExpandedObj, thisVal || {});
                key = thisKey;
            }
            if (_isArrayKey(key)) {
                var arrayKey = _fromArrayKey(key);
                result[arrayKey.name] = result[arrayKey.name] || [];
                result[arrayKey.name][arrayKey.index] = val;
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
     *  var flattened = objnest.flatten({
     *      'foo': {'bar': 'baz'}
     *  });
     *  console.log(flattened); // => {'foo.bar': 'baz'}
     */
    flatten: function (nested) {
        var flattened = {};
        Object.keys(nested || {}).forEach(function (key) {
            var value = nested[key];
            switch (typeof(value)) {
                case 'string':
                case 'number':
                case 'function':
                    flattened[key] = value;
                    break;
                default:
                    var subValues = objnest.flatten(value);
                    Object.keys(subValues).forEach(function (subKey) {
                        var fullKey;
                        if (Array.isArray(value)) {
                            fullKey = key + _toArrayKey(subKey);
                        } else {
                            fullKey = [key, subKey].join('.');
                        }
                        flattened[fullKey] = subValues[subKey];
                    });
                    break;
            }
        });
        return flattened;
    }
};

function _toArrayKey(key) {
    var components = key.split(/\./g);
    return [util.format('[%d]', components[0])].concat(components.slice(1)).join('.');
}
function _isArrayKey(key) {
    return /\[\d\]$/.test(key);
}
function _fromArrayKey(key) {
    return {
        name: key.replace(/\[\d+\]$/, ''),
        index: Number(key.match(/\[(\d+)\]$/)[1])
    }
}

module.exports = objnest;
