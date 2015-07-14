/**
 * Test for objnest.
 * Runs with nodeunit.
 */

"use strict";

var objnest = require('./objnest');

exports['Run flatten.'] = function (test) {
    var flattened = objnest.flatten({
        foo: {
            bar: 'baz'
        }
    });
    test.deepEqual(flattened, {'foo.bar': 'baz'});
    test.done();
};

exports['Expand nested.'] = function (test) {
    var obj = objnest.expand({
        'foo.bar': 'baz'
    });
    test.deepEqual(obj, {foo: {bar: 'baz'}});
    test.done();
};