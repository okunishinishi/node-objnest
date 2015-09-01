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

"use strict";

var toArrayKey = require('./key/to_array_key');

/** @lends flatten */
function flatten(nested) {
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
                var subValues = flatten(value);
                Object.keys(subValues).forEach(function (subKey) {
                    var fullKey;
                    if (Array.isArray(value)) {
                        fullKey = key + toArrayKey(subKey);
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

module.exports = flatten;