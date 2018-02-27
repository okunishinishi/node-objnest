/**
 * Convert from array key.
 * @function fromArrayKey
 * @param {string} key - Key to convert.
 * @returns {string} - Converted key.
 */
'use strict'

/** @lends fromArrayKey */
function fromArrayKey (key) {
  const indexKey = key.match(/\[([^\]]+)]$/)[1]
  return {
    name: key.replace(/\[[^\]]+]$/, ''),
    index: /^\d+$/.test(indexKey) ? Number(indexKey) : null,
    key: indexKey,
  }
}

module.exports = fromArrayKey
