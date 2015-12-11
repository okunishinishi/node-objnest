/**
 * Create a new context
 * @function create
 */
"use strict";

let Objnest = require('./objnest');

/** @lends create */
function create(config) {
    return new Objnest(config);
}

module.exports = create;