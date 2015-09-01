/**
 * Test case for expand.
 * Runs with nodeunit.
 */

var expand = require('../lib/expand.js');

exports.setUp = function(done) {
    done();
};

exports.tearDown = function(done) {
    done();
};

exports['Expand nested.'] = function (test) {
    var obj = expand({
        'foo.bar': 'baz'
    });
    test.deepEqual(obj, {foo: {bar: 'baz'}});
    test.done();
};

exports['Expand array.'] = function (test) {
    var obj = expand({
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