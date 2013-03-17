'use strict';

var path = require('path')
  , vm = require('vm')
  , fs = require('fs');

/**
 * Load:
 *
 * Loads plain'ol JavaScript files without exports, module patterns in to Node.
 * The only assumption it makes is that it introduces at least one global.
 *
 * @param {String} location
 * @returns {Mixed}
 * @api public
 */
module.exports = function require(location) {
  if (!path.extname(location)) location = location +'.js';
  location = path.resolve(path.dirname(module.parent.filename), location);

  var context = { load: require }
    , name = path.basename(location)
    , code = read(location);

  // Add the missing globals that are not present in vm module.
  Object.keys(missing).forEach(function missingInVM(global) {
    context[global] = missing[global];
  });

  // Run it in a context so we can expose the globals.
  context = vm.createContext(context);
  vm.runInContext(code, context, name);

  // Remove the load module if it's still unchanged
  if (context.load === require) delete context.load;
  Object.keys(missing).forEach(function missingInVM(global) {
    if (context[global] === missing[global]) {
      delete context[global];
    }
  });

  // If only one global was exported, we should simply expose it using the
  // `module.exports` patter. If there are more globals exported, expose them
  // all.
  var globals = Object.keys(context);

  if (globals.length === 1) return context[globals.pop()];
  return globals.reduce(function reduce(exports, method) {
    exports[method] = context[method];
    return exports;
  }, Object.create(null));
};

/**
 * The following properties are missing when loading plain ol files.
 *
 * @private
 */
var missing = {
    console: console
  , setTimeout: setTimeout
  , clearTimeout: clearTimeout
  , setInterval: setInterval
  , clearInterval: clearInterval
};

/**
 * Code reading and cleaning up.
 *
 * @param {String} location
 */
function read(location) {
  var code = fs.readFileSync(location, 'utf-8');

  // Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
  // because the buffer-to-string conversion in `fs.readFileSync()`
  // translates it to FEFF, the UTF-16 BOM.
  if (code.charCodeAt(0) === 0xFEFF) {
    code = code.slice(1);
  }

  return code;
}
