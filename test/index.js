'use strict';

var assert = require('assert')
  , load = require('../');

[{
  it: 'exposes one single global? Assume module.exports.',
  does: function does() {
    var test = load('./fixtures/file.js');
    assert.ok(typeof test === 'function');
    assert.ok(test() === 'foo:bar');
  }
}, {
  it: 'exposes more globals ? Assume exports.<key> pattern.',
  does: function does() {
    var lib = load('./fixtures/file2');
    assert.ok(typeof lib === 'object');
    assert.ok(typeof lib.foo === 'function');
    assert.ok(typeof lib.bar === 'function');
  }
}, {
  it: 'passes optional argument globals to file scope',
  does: function does() {
    var lib = load('./fixtures/file3', {foo: 'bar'});
    assert.equal(lib.getFoo(), 'bar');
  }
}, {
  it: 'adds nodejs globals to the code.',
  does: function () {
    var stream = load('./fixtures/globals.js');
    assert.ok(stream instanceof require('stream'));
  }
}, {
  it: 'exposes the compiler function for compiling source code',
  does: function () {
    assert.ok(typeof load.compiler === 'function');
  }
}].forEach(function compiling(test, index) {
  console.log('('+ index +') it '+ test.it);
  test.does();
});
