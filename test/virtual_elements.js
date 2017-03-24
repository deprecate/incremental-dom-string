import assert from 'assert';
import {
  elementOpenStart,
  elementOpenEnd,
  elementOpen,
  elementVoid,
  elementClose,
  text,
  attr,
  patch,
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

  it('when creating a single node with several attributes', function() {
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

  it('when patching a node', function() {
    debugger;

    elementOpen('main', null, ['id', 'main-element', 'data-foo', 'bar']);
      elementOpen('section');
      elementClose('section');
    elementClose('main');

    assert.strictEqual(getOutput(),
      '<main id="main-element" data-foo="bar"><section></section></main>');

    /* eslint-disable */
    function createList(n = 1) {
      elementOpen('ul', null, ['id', 'test-ul']);
      for (let i = 0; i < n; i++) {
        elementOpen('li', null, ['id', `test-li-${i}`]);
          text(`List item ${i}`);
        elementClose('li');
      }
      elementClose('ul');
    }

    const node = {
      innerHTML: '',
      tagName: 'MAIN',
      attributes: [
        {
          name: 'id',
          value: 'main-element'
        },
        {
          name: 'data-foo',
          value: 'bar'
        }
      ]
    };

    patch(node, function() {
      return createList(10);
    });

    let expected = [
      '<ul id="test-ul">',
      '<li id="test-li-0">List item 0</li>',
      '<li id="test-li-1">List item 1</li>',
      '<li id="test-li-2">List item 2</li>',
      '<li id="test-li-3">List item 3</li>',
      '<li id="test-li-4">List item 4</li>',
      '<li id="test-li-5">List item 5</li>',
      '<li id="test-li-6">List item 6</li>',
      '<li id="test-li-7">List item 7</li>',
      '<li id="test-li-8">List item 8</li>',
      '<li id="test-li-9">List item 9</li>',
      '</ul>'].join('');

    assert.strictEqual(node.innerHTML, expected);


    patch(node, function() {
      createList(5);
    });

    expected = [
      '<ul id="test-ul">',
      '<li id="test-li-0">List item 0</li>',
      '<li id="test-li-1">List item 1</li>',
      '<li id="test-li-2">List item 2</li>',
      '<li id="test-li-3">List item 3</li>',
      '<li id="test-li-4">List item 4</li>',
      '</ul>'].join('');

    assert.strictEqual(node.innerHTML, expected);
  });

  it('should flush the output', function() {
    elementOpen('main', null, ['id', 'main-element', 'data-foo', 'bar']);
      elementOpen('section');
      elementClose('section');
    elementClose('main');

    assert.strictEqual(getOutput(),
      '<main id="main-element" data-foo="bar"><section></section></main>');

    assert.strictEqual(getOutput(true), '');

    elementOpen('div', null, ['id', 'test-div']);
      text('Hello')
    elementClose('div');

    assert.strictEqual(getOutput(), '<div id="test-div">Hello</div>');
    assert.strictEqual(getOutput(true), '');
  });
});
