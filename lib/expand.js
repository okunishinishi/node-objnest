/**
 * Flatten nested object.
 * @memberof module:objnest/lib
 * @function expand
 * @param {object} object - Obj to flatten
 * @returns {object} Flatten obj.
 * @example
 *  var obj = objnest.expand({
     *      'foo.bar': 'baz'
     *  });
 *  console.log(obj); // => {foo: {bar: 'baz'}}
 */

"use strict";


var extend = require('extend'),
    isArrayKey = require('./key/is_array_key'),
    fromArrayKey = require('./key/from_array_key');

/** @lends expand */
function expand(object) {
    var result = {};
    Object.keys(object).forEach(function (key) {
        var val = object[key];
        if (/\./g.test(key)) {
            var subKeys = key.split(/\./g),
                subObj = {},
                thisKey = subKeys.shift();
            subObj[subKeys.join('.')] = val;
            var subExpandedObj = expand(subObj);
            var thisVal = result[thisKey];
            val = extend(true, subExpandedObj, thisVal || {});
            key = thisKey;
        }
        if (isArrayKey(key)) {
            var arrayKey = fromArrayKey(key);
            result[arrayKey.name] = result[arrayKey.name] || [];
            result[arrayKey.name][arrayKey.index] = val;
        } else {
            result[key] = val;
        }
    });
    return result;
}

module.exports = expand;