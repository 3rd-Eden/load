# load

Because fuck your module patterns, your module loader and other kinds of pointless
codebloat that require me to use a damned JavaScript file on the server.

I named it load because it loads files, thats it.

```js
var load = require('load');

// file.js contents:
//
// function test() { return 'test' };
//

// Only one global exported, automatically exposes the function by default.
var test = load('file.js');

// file2.js contents:
//
// function test() {}
// function test1() {}
//

var library = load('file2');
console.log(library.test);
console.log(library.test1);

// And that it.
```

## License

MIT
