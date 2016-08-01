'use strict'

var test = require('tape')
var Flatten = require('./')

test('only flatten nested objects', function (t) {
  var flatten = Flatten()

  var obj = {
    number: 1,
    string: 'foo',
    bool: true,
    arr1: [1, 2, 3],
    arr2: [{ foo: 1 }, { bar: 2 }],
    sub: { foo: 1, bar: { baz: 3 } }
  }

  t.deepEqual(flatten(obj), {
    number: 1,
    string: 'foo',
    bool: true,
    arr1: [1, 2, 3],
    arr2: [{ foo: 1 }, { bar: 2 }],
    'sub.foo': 1,
    'sub.bar.baz': 3
  })

  t.end()
})

test('do not traverse black listed types', function (t) {
  var Klass = function () {
    this.foo = 1
  }
  var instance = new Klass()
  var flatten = Flatten({ blacklist: [Klass] })

  var obj = {
    a: {
      a: 1
    },
    b: {
      a: instance
    }
  }

  t.deepEqual(flatten(obj), {
    'a.a': 1,
    'b.a': instance
  })

  t.end()
})

test('support custom separator', function (t) {
  var obj = {
    sub: { foo: 1, bar: { baz: 3 } }
  }
  var flatten = Flatten({ separator: '_' })

  t.deepEqual(flatten(obj), {
    'sub_foo': 1,
    'sub_bar_baz': 3
  })

  t.end()
})

test('support empty string separator', function (t) {
  var obj = {
    sub: { foo: 1, bar: { baz: 3 } }
  }
  var flatten = Flatten({ separator: '' })

  t.deepEqual(flatten(obj), {
    'subfoo': 1,
    'subbarbaz': 3
  })

  t.end()
})

test('support obj is array', function (t) {
  var obj = [ 'a', 'b', 'c' ]
  var flatten = Flatten({ separator: '' })
  t.equal(flatten(obj), obj)

  t.end()
})

test('support array of strings', function (t) {
  var obj = {
    sub: { foo: 1, bar: [ 'a', 'b', 'c' ] }
  }

  var flatten = Flatten({ flattenArray: true })
  t.deepEqual(flatten(obj), {
    'sub.foo': 1,
    'sub.bar.0': 'a',
    'sub.bar.1': 'b',
    'sub.bar.2': 'c'
  })

  t.end()
})

test('support array of objects', function (t) {
  var obj = {
    sub: { foo: 1, bar: [ { key: 'a' }, { key: 'b' }, { key: 'c' } ] }
  }

  var flatten = Flatten({ flattenArray: true })
  t.deepEqual(flatten(obj), {
    'sub.foo': 1,
    'sub.bar.0.key': 'a',
    'sub.bar.1.key': 'b',
    'sub.bar.2.key': 'c'
  })

  t.end()
})

test('support array of objects of arrays', function (t) {
  var obj = {
    sub: { foo: 1, bar: [ { key: 'a' }, { key: 'b' }, { key: [ '1', '2', '3' ] } ] }
  }

  var flatten = Flatten({ flattenArray: true })
  t.deepEqual(flatten(obj), {
    'sub.foo': 1,
    'sub.bar.0.key': 'a',
    'sub.bar.1.key': 'b',
    'sub.bar.2.key.0': '1',
    'sub.bar.2.key.1': '2',
    'sub.bar.2.key.2': '3'
  })

  t.end()
})
