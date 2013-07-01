x = (function globals() {
  'use strict';

  console.log('Buffer.isBuffer', Buffer.isBuffer(null));
  return new(require('stream'));
})();
