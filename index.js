'use strict'

var isObj = require('isobj')
var isArray = require('isarray')

module.exports = function (options) {
  options = options || {}
  var blacklist = options.blacklist || []
  var separator = options.separator == null ? '.' : options.separator
  var flattenArray = options.flattenArray || false

  return flatten

  function flatten (obj) {
    if (isArray(obj) && !flattenArray) return obj

    var result = {}
    iterator(obj, '', result)
    return result
  }

  function shouldDive (val) {
    return !isBlacklisted(val) && (isObj(val) || (isArray(val) && flattenArray))
  }

  function iterator (obj, prefix, flattened) {
    if (isArray(obj) && flattenArray) {
      arrayiterator(obj, prefix, flattened)
      return
    }

    objiterator(obj, prefix, flattened)
  }

  function arrayiterator (obj, prefix, flattened) {
    var len = obj.length
    var n = 0

    for (;n < len; n++) {
      var val = obj[n]
      if (shouldDive(val)) {
        iterator(obj[n], prefix + n + separator, flattened)
        continue
      }

      flattened[prefix + n] = val
    }
  }

  function objiterator (obj, prefix, flattened) {
    var n = 0
    var keys = Object.keys(obj)
    var len = keys.length
    var key, val

    for (; n < len; n++) {
      key = keys[n]
      val = obj[key]

      if (shouldDive(val)) {
        iterator(val, prefix + key + separator, flattened)
        continue
      }

      flattened[prefix + key] = val
    }
  }

  function isBlacklisted (obj) {
    for (var i = 0; i < blacklist.length; i++) {
      if (obj instanceof blacklist[i]) return true
    }
  }
}
