/**
 * @constructor Objnest
 * @param {object} config
 */
"use strict";

const extend = require('extend'),
    isArrayKey = require('./key/is_array_key'),
    fromArrayKey = require('./key/from_array_key'),
    toArrayKey = require('./key/to_array_key');

/** @lends Objnest */
function Objnest(config) {
    let s = this;
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
     *  });
     *  console.log(obj); // => {foo: {bar: 'baz'}}
     */
    expand: function expand(object) {
        let s = this;

        let separator = s.separator,
            result = {};
        Object.keys(object).forEach((key) => {
            let val = object[key];
            if (!!~key.indexOf(separator)) {
                let subKeys = key.split(separator),
                    subObj = {},
                    thisKey = subKeys.shift();
                subObj[subKeys.join('.')] = val;
                let subExpandedObj = s.expand(subObj);
                let thisVal = result[thisKey];
                val = extend(true, subExpandedObj, thisVal || {});
                key = thisKey;
            }
            if (isArrayKey(key)) {
                let arrayKey = fromArrayKey(key);
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
     *  let flattened = objnest.flatten({
     *      'foo': {'bar': 'baz'}
     *  });
     *  console.log(flattened); // => {'foo.bar': 'baz'}
     */
    flatten: function flatten(nested) {
        let s = this;
        let separator = s.separator,
            flattened = {};
        Object.keys(nested || {}).forEach((key) => {
            let value = nested[key];
            switch (typeof(value)) {
                case 'string':
                case 'number':
                case 'boolean':
                case 'function':
                    flattened[key] = value;
                    break;
                default:
                    let subValues = s.flatten(value);
                    Object.keys(subValues).forEach((subKey) => {
                        let fullKey;
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
    }
};

module.exports = Objnest;