import assert from 'assert';
import {
  elementOpenStart,
  elementOpenEnd,
  elementOpen,
  elementVoid,
  elementClose,
  text,
  attr,
  getOutput
} from '../src/virtual_elements.js';

describe('element creation', () => {
  it('when creating a single node with text', function() {

    elementOpen('div');
      text('Hello world');
    elementClose('div');

    assert.strictEqual(getOutput(), '<div>Hello world</div>');
  });

  it('when creating a single node with a child node with text', function() {
    elementOpen('div');
      elementOpen('span');
        text('Hello world 2');
      elementClose('span');
    elementClose('div');
    assert.strictEqual(getOutput(), '<div><span>Hello world 2</span></div>');
  });

  it('when creating a single node with several child nodes with text', function() {
    elementOpen('div');
      elementOpen('p');
        text('First child');
      elementClose('p');
      elementOpen('span');
        text('Second child');
      elementClose('span');
    elementClose('div');
    assert.strictEqual(getOutput(), '<div><p>First child</p><span>Second child</span></div>');
  });

  it('when creating a single node with attributes', function() {
    elementOpen('div', null, ['id', 'test-div']);
      text('Test text');
    elementClose('div');
    assert.strictEqual(getOutput(), '<div id="test-div">Test text</div>');
  });

  it('when creating a single node several attributes', function() {

    const attrs = [
      'id', 'test-id',
      'name', 'test-name',
      'data-a', 'test-data-a',
      'data-b', 'test-data-b'
    ];

    const expected = ['<div id="test-id" name="test-name"',
      'data-a="test-data-a"',
      'data-b="test-data-b">Some text</div>'].join(' ');

    elementOpen('div', null, attrs);
      text('Some text');
    elementClose('div');
    assert.strictEqual(getOutput(), expected);
  });

  it('when creating a single node with several child nodes with attributes and text', function() {
    elementOpen('div');
      elementOpen('span', null, ['name', 'span-name', 'id', 'span-id']);
        text('Foo');
      elementClose('span');
      elementOpen('button', null, ['name', 'button-name', 'id', 'button-id']);
        text('Bar');
      elementClose('button');
    elementClose('div');

    const expected = ['<div>',
      '<span name="span-name" id="span-id">Foo</span>',
      '<button name="button-name" id="button-id">Bar</button>',
      '</div>'].join('');

    assert.strictEqual(getOutput(), expected);
  });

  it('when creating a void node', function() {
    elementVoid('input', null, ['type', 'text']);

    assert.strictEqual(getOutput(), '<input type="text"></input>');
  });
});
