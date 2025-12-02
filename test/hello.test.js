const assert = require('assert');
const { greet } = require('../src/hello');

describe('hello.greet', function () {
  it('should greet the given name', function () {
    assert.strictEqual(greet('Herit'), 'Hello, Herit!');
  });

  it('should greet world by default', function () {
    assert.strictEqual(greet('World'), 'Hello, World!');
  });
});
