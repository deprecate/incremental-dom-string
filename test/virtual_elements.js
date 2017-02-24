import {
  patch,
  elementOpen,
  elementVoid,
  elementClose,
  text,
} from '../src/virtual_elements.js';

describe('incremental-dom-string', function() {
  it('foo', function() {
    console.log(patch, elementOpen, elementVoid, elementClose, text);
  });
});
