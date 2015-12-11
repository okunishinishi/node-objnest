/**
 * Test case for objnest.
 * Runs with mocha.
 */
"use strict";

const Objnest = require('../lib/objnest.js'),
    assert = require('assert');

describe('objnest', () => {

    let objnest = new Objnest();

    before((done) => {
        done();
    });

    after((done) => {
        done();
    });


    it('Expand nested.', (done) => {
        let obj = objnest.expand({
            'foo.bar': 'baz'
        });
        assert.deepEqual(obj, {foo: {bar: 'baz'}});
        done();
    });

    it('Expand array.', (done) => {
        let obj = objnest.expand({
            'foo.bar.baz': 'quz',
            'foo.bar.quzz[0]': 'hoge',
            'foo.bar.quzz[1].fuge[0]': 'fuge0',
            'foo.bar.quzz[1].fuge[1]': 'fuge1'
        });
        assert.deepEqual(obj, {
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
        done();
    });

    it('Run flatten.', (done) => {
        let flattened = objnest.flatten({
            foo: {
                bar: 'baz',
                quz: 2,
                quzz: true
            }
        });
        assert.deepEqual(flattened, {'foo.bar': 'baz', 'foo.quz': 2, 'foo.quzz': true});
        done();
    });

    it('Flatten css.', (done) => {
        let flattened = new Objnest({separator:' '}).flatten({
            body:{
                "main":{
                    color:"#555"
                }
            }
        });
        assert.deepEqual(flattened, {'body main color': '#555'});
        done();
    });

    it('Flatten array.', (done) => {
        let flattened = objnest.flatten({
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
        assert.deepEqual(flattened, {
            'foo.bar.baz': 'quz',
            'foo.bar.quzz[0]': 'hoge',
            'foo.bar.quzz[1].fuge[0]': 'fuge0',
            'foo.bar.quzz[1].fuge[1]': 'fuge1'
        });
        done();
    });
});

