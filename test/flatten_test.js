/**
 * Test case for flatten.
 * Runs with nodeunit.
 */

var flatten = require('../lib/flatten.js');

exports.setUp = function(done) {
    done();
};

exports.tearDown = function(done) {
    done();
};

exports['Run flatten.'] = function (test) {
    var flattened = flatten({
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
    var flattened = flatten({
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

