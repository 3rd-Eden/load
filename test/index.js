'use strict';

var assert = require('assert')
  , load = require('../');

var test = load('./fixtures/file.js');
assert.ok(typeof test === 'function');
assert.ok(test() === 'foo:bar');

var lib = load('./fixtures/file2');
assert.ok(typeof lib === 'object');
assert.ok(typeof lib.foo === 'function');
assert.ok(typeof lib.bar === 'function');

var stream = load('./fixtures/globals.js');
assert.ok(stream instanceof require('stream'));
