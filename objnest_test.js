/**
 * Test for objnest.
 * Runs with nodeunit.
 */

"use strict";

var objnest = require('./objnest');

exports['Run flatten.'] = function (test) {
    var flattened = objnest.flatten({
        foo: {
            bar: 'baz',
            quz: 2,
            quzz: true
        }
    });
    test.deepEqual(flattened,  { 'foo.bar': 'baz', 'foo.quz': 2, 'foo.quzz': true });
    test.done();
};

exports['Flatten array.'] = function (test) {
    var flattened = objnest.flatten({
        foo: {
            bar: {
                'baz': 'quz',
                'quzz': [
                    'hoge',
                    {
                        'fuge': [
                            "fuge0",
                            "fuge1"
                        ]
                    }
                ]
            }
        }
    });
    test.deepEqual(flattened, {
        'foo.bar.baz': 'quz',
        'foo.bar.quzz[0]': 'hoge',
        'foo.bar.quzz[1].fuge[0]': 'fuge0',
        'foo.bar.quzz[1].fuge[1]': 'fuge1'
    });
    test.done();
};

exports['Expand nested.'] = function (test) {
    var obj = objnest.expand({
        'foo.bar': 'baz'
    });
    test.deepEqual(obj, {foo: {bar: 'baz'}});
    test.done();
};

exports['Expand array.'] = function (test) {
    var obj = objnest.expand({
        'foo.bar.baz': 'quz',
        'foo.bar.quzz[0]': 'hoge',
        'foo.bar.quzz[1].fuge[0]': 'fuge0',
        'foo.bar.quzz[1].fuge[1]': 'fuge1'
    });
    test.deepEqual(obj, {
        "foo": {
            "bar": {
                "quzz": [
                    "hoge",
                    {
                        "fuge": [
                            "fuge0",
                            "fuge1"
                        ]
                    }
                ],
                "baz": "quz"
            }
        }
    });
    test.done();
};