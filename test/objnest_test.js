/**
 * Test case for objnest.
 * Runs with mocha.
 */
'use strict'

const Objnest = require('../lib/objnest.js')
const assert = require('assert')

describe('objnest', () => {

  let { expand, flatten } = new Objnest()

  before((done) => {
    done()
  })

  after((done) => {
    done()
  })

  it('Expand nested.', (done) => {
    let obj = expand({
      'foo.bar': 'baz'
    })
    assert.deepEqual(obj, { foo: { bar: 'baz' } })
    done()
  })

  it('Expand array.', (done) => {
    const obj = expand({
      'foo.bar.baz': 'quz',
      'foo.bar.quzz[0]': 'hoge',
      'foo.bar.quzz[1].fuge[0]': 'fuge0',
      'foo.bar.quzz[1].fuge[1]': 'fuge1'
    })
    assert.deepEqual(obj, {
      'foo': {
        'bar': {
          'quzz': [
            'hoge',
            {
              'fuge': [
                'fuge0',
                'fuge1'
              ]
            }
          ],
          'baz': 'quz'
        }
      }
    })
    done()
  })

  it('Expand object array', (done) => {
    const expanded = expand({
      'data[0].type': 'users',
      'data[0].attributes.key': 'foo_bar3',
      'data[0].attributes.email': 'apbc3@example.com',
      'data[1].type': 'users',
      'data[1].attributes.key': 'foo_bar4',
      'data[1].attributes.email': 'apbc4@example.com'
    })
    assert.deepEqual(expanded, {
      'data': [
        {
          'type': 'users',
          'attributes': {
            'key': 'foo_bar3',
            'email': 'apbc3@example.com'
          }
        },
        {
          'type': 'users',
          'attributes': {
            'key': 'foo_bar4',
            'email': 'apbc4@example.com'
          }
        }
      ]
    })
    done()
  })

  it('Run flatten.', (done) => {
    const flattened = flatten({
      foo: {
        bar: 'baz',
        quz: 2,
        quzz: true
      }
    })
    assert.deepEqual(flattened, { 'foo.bar': 'baz', 'foo.quz': 2, 'foo.quzz': true })
    done()
  })

  it('Flatten null', () => {
    assert.deepEqual(
      flatten({
        a: 1,
        b: null,
      }),
      { a: 1, b: null }
    )
  })

  it('Flatten css.', (done) => {
    let flattened = new Objnest({ separator: ' ' }).flatten({
      body: {
        'main': {
          color: '#555'
        }
      }
    })
    assert.deepEqual(flattened, { 'body main color': '#555' })
    done()
  })

  it('Flatten array.', (done) => {
    let flattened = flatten({
      foo: {
        bar: {
          'baz': 'quz',
          'quzz': [
            'hoge',
            {
              'fuge': [
                'fuge0',
                'fuge1'
              ]
            }
          ]
        }
      }
    })
    assert.deepEqual(flattened, {
      'foo.bar.baz': 'quz',
      'foo.bar.quzz[length]': 2,
      'foo.bar.quzz[0]': 'hoge',
      'foo.bar.quzz[1].fuge[0]': 'fuge0',
      'foo.bar.quzz[1].fuge[length]': 2,
      'foo.bar.quzz[1].fuge[1]': 'fuge1'
    })

    assert.deepEqual(
      expand(flattened),
      {
        'foo': {
          'bar': {
            'baz': 'quz',
            'quzz': [
              'hoge',
              {
                'fuge': [
                  'fuge0',
                  'fuge1'
                ]
              }
            ]
          }
        }
      }
    )
    done()
  })

  it('Large object', () => {
    const flattend = flatten(
      new Array(50000).fill(null).reduce((obj, v, i) => Object.assign(obj, {
        [`attr-${i}`]: { foo: { bar: 'baz' } }
      }), {})
    )
    assert.ok(flattend)
    console.timeEnd('Large object')
  })

  it('Convert date', () => {
    const flattend = flatten({
      d: new Date()
    })
    assert.ok(flattend.d)
  })

  it('Top level array', () => {
    assert.deepEqual(
      expand(flatten( ['a'])),
      ['a'],
    )
    assert.deepEqual(
      expand(flatten( [['a']])),
      [['a']],
    )
  })

})

/* global describe, it */
