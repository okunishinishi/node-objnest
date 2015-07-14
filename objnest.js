/**
 * Convert nested object to flatten or expand.
 * @module objnest
 */
"use strict";

var extend = require('extend');

/** @lends objnest */
var objnest = {
    /**
     * Flatten nested object.
     * @param {object} object - Obj to flatten
     * @returns {object} Flatten obj.
     * @example
     *  var obj = objnest.expand({
     *      'foo.bar': 'baz'
     *  });
     *  console.log(obj); // {foo: {bar: 'baz'}}
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
                result[thisKey] = extend(subExpandedObj, result[thisKey] || {});
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
     *  console.log(flattened); => {'foo.bar': 'baz'}
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
                        var fullKey = [key, subKey].join('.');
                        flattened[fullKey] = subValues[subKey];
                    });
                    break;
            }
        });
        return flattened;
    }
};

module.exports = objnest;
