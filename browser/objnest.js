(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
window.objnest = require("../lib/index.js");
},{"../lib/index.js":4}],2:[function(require,module,exports){
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
},{"./key/from_array_key":5,"./key/is_array_key":6,"extend":8}],3:[function(require,module,exports){
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
            case 'boolean':
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
},{"./key/to_array_key":7}],4:[function(require,module,exports){
/**
 * Convert nested object to flatten or expand.
 * @module objnest
 * @version 1.2.2
 */

"use strict";

exports.expand = require('./expand');
exports.flatten = require('./flatten');

},{"./expand":2,"./flatten":3}],5:[function(require,module,exports){
/**
 * Convert from array key.
 * @memberof module:objnest/lib/key
 * @function fromArrayKey
 * @param {string} key - Key to convert.
 * @returns {string} - Converted key.
 */
"use strict";

/** @lends fromArrayKey */
function fromArrayKey(key) {
    return {
        name: key.replace(/\[\d+\]$/, ''),
        index: Number(key.match(/\[(\d+)\]$/)[1])
    }
}

module.exports = fromArrayKey;

},{}],6:[function(require,module,exports){
/**
 * Detect is an array key.
 * @memberof module:objnest/lib/key
 * @function isArrayKey
 * @param {string} key - Key to convert.
 * @returns {boolean} - Is array key or not.
 */
"use strict";

/** @lends isArrayKey */
function isArrayKey(key) {
    return /\[\d\]$/.test(key);
}

module.exports = isArrayKey;

},{}],7:[function(require,module,exports){
/**
 * Convert to array key.
 * @memberof module:objnest/lib/key
 * @function toArrayKey
 * @param {string} key - Key to convert.
 * @returns {string} - Converted key.
 */
"use strict";

/** @lends toArrayKey */
function toArrayKey(key) {
    var components = key.split(/\./g);
    return [
        '[' + components[0] + ']'
    ].concat(components.slice(1)).join('.');
}

module.exports = toArrayKey;

},{}],8:[function(require,module,exports){
'use strict';

var hasOwn = Object.prototype.hasOwnProperty;
var toStr = Object.prototype.toString;

var isArray = function isArray(arr) {
	if (typeof Array.isArray === 'function') {
		return Array.isArray(arr);
	}

	return toStr.call(arr) === '[object Array]';
};

var isPlainObject = function isPlainObject(obj) {
	if (!obj || toStr.call(obj) !== '[object Object]') {
		return false;
	}

	var hasOwnConstructor = hasOwn.call(obj, 'constructor');
	var hasIsPrototypeOf = obj.constructor && obj.constructor.prototype && hasOwn.call(obj.constructor.prototype, 'isPrototypeOf');
	// Not own constructor property must be Object
	if (obj.constructor && !hasOwnConstructor && !hasIsPrototypeOf) {
		return false;
	}

	// Own properties are enumerated firstly, so to speed up,
	// if last one is own, then all properties are own.
	var key;
	for (key in obj) {/**/}

	return typeof key === 'undefined' || hasOwn.call(obj, key);
};

module.exports = function extend() {
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[0],
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if (typeof target === 'boolean') {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	} else if ((typeof target !== 'object' && typeof target !== 'function') || target == null) {
		target = {};
	}

	for (; i < length; ++i) {
		options = arguments[i];
		// Only deal with non-null/undefined values
		if (options != null) {
			// Extend the base object
			for (name in options) {
				src = target[name];
				copy = options[name];

				// Prevent never-ending loop
				if (target !== copy) {
					// Recurse if we're merging plain objects or arrays
					if (deep && copy && (isPlainObject(copy) || (copyIsArray = isArray(copy)))) {
						if (copyIsArray) {
							copyIsArray = false;
							clone = src && isArray(src) ? src : [];
						} else {
							clone = src && isPlainObject(src) ? src : {};
						}

						// Never move original objects, clone them
						target[name] = extend(deep, clone, copy);

					// Don't bring in undefined values
					} else if (typeof copy !== 'undefined') {
						target[name] = copy;
					}
				}
			}
		}
	}

	// Return the modified object
	return target;
};


},{}]},{},[1]);
