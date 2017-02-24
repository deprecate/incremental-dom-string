import assert from 'assert';
import {
  elementOpenStart,
  elementOpenEnd,
  elementOpen,
  elementVoid,
  elementClose,
  text,
  attr,
} from '../src/virtual_elements.js';

describe('element creation', () => {
  it('when creating a single node with text', function() {
    elementOpen('div');
      text('Hello world');
    elementClose('div');
    assert.strictEqual('', '<div>Hello world</div>');
  });
});
