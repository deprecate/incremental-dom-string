import assert from 'assert';
import {
  attr,
  currentElement,
  elementClose,
  elementOpen,
  elementOpenEnd,
  elementOpenStart,
  elementVoid,
  patch,
  renderToString,
  text,
} from '../src/virtual_elements.js';

describe('element creation', () => {
  const findAttribute = (node, attr, check = true) => {
    const data = new RegExp(attr + '="(\\w+)"');
    const match = node.innerHTML.match(data);

    if (check) {
      assert.ok(match !== null);
      assert.ok(Array.isArray(match));
      assert.strictEqual(match.length, 2);
    }

    return match;
  };

  it('when creating a single node with formatted text', () => {
    const output = renderToString(() => {
      elementOpen('div');
      text('Hello wor', (val) => val + 'l', (val) => val + 'd');
      elementClose('div');
    });
    assert.strictEqual(output, '<div>Hello world</div>');
  });

  it('when creating a single node with text', () => {
    const output = renderToString(() => {
      elementOpen('div');
        text('Hello world');
      elementClose('div');
    });
    assert.strictEqual(output, '<div>Hello world</div>');
  });

  it('when creating a single node with a child node with text', () => {
    const output = renderToString(() => {
      elementOpen('div');
        elementOpen('span');
          text('Hello world 2');
        elementClose('span');
      elementClose('div');
    });
    assert.strictEqual(output, '<div><span>Hello world 2</span></div>');
  });

  it('when creating a single node with multiple child nodes with text', () => {
    const output = renderToString(() => {
      elementOpen('div');
        elementOpen('p');
          text('First child');
        elementClose('p');
        elementOpen('span');
          text('Second child');
        elementClose('span');
      elementClose('div');
    });
    assert.strictEqual(output, '<div><p>First child</p><span>Second child</span></div>');
  });

  it('when creating a single node with attributes', () => {
    const output = renderToString(() => {
      elementOpen('div', null, ['id', 'test-div']);
        text('Test text');
      elementClose('div');
    });
    assert.strictEqual(output, '<div id="test-div">Test text</div>');
  });

  it('when creating a single node with multiple static attributes', () => {
    const attrs = [
      'id', 'test-id',
      'name', 'test-name',
      'data-a', 'test-data-a',
      'data-b', 'test-data-b',
    ];

    const expected = ['<div id="test-id" name="test-name"',
      'data-a="test-data-a"',
      'data-b="test-data-b">Some text</div>'].join(' ');

    const output = renderToString(() => {
      elementOpen('div', null, attrs);
        text('Some text');
      elementClose('div');
    });
    assert.strictEqual(output, expected);
  });

  it('when creating a single node with multiple attributes', () => {
    const attrs = [
      'id', 'test-id',
      'name', 'test-name',
      'data-a', 'test-data-a',
      'data-b', 'test-data-b',
    ];

    const expected = ['<div id="test-id" name="test-name"',
      'data-a="test-data-a"',
      'data-b="test-data-b">Some text</div>'].join(' ');

    const output = renderToString(() => {
      elementOpen('div', null, null, ...attrs);
        text('Some text');
      elementClose('div');
    });
    assert.strictEqual(output, expected);
  });

  it('when creating a single node with several child nodes with attributes and text', () => {
    const output = renderToString(() => {
      elementOpen('div');
        elementOpen('span', null, ['name', 'span-name', 'id', 'span-id']);
          text('Foo');
        elementClose('span');
        elementOpen('button', null, ['name', 'button-name', 'id', 'button-id']);
          text('Bar');
        elementClose('button');
      elementClose('div');
    });

    const expected = ['<div>',
      '<span name="span-name" id="span-id">Foo</span>',
      '<button name="button-name" id="button-id">Bar</button>',
      '</div>'].join('');

    assert.strictEqual(output, expected);
  });

  it('when creating a void node', () => {
    const output = renderToString(() => {
      elementVoid('input', null, ['type', 'text']);
    });

    assert.strictEqual(output, '<input type="text"></input>');
  });

  it('when creating a void node with various attributes', () => {
    const output = renderToString(() => {
      elementVoid('div', null, ['id', 'test-id', 'name', 'test-name', 'data-test', 'test']);
    });
    assert.strictEqual(output, '<div id="test-id" name="test-name" data-test="test"></div>');
  });

  it('when patching a node', () => {
    const output = renderToString(() => {
      elementOpen('main', null, ['id', 'main-element', 'data-foo', 'bar']);
        elementOpen('section');
        elementClose('section');
      elementClose('main');
    });

    let expected = '<main id="main-element" data-foo="bar"><section></section></main>';

    assert.strictEqual(output, expected);

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

    const node = {innerHTML: ''};

    patch(node, () => {
      return createList(10);
    });

    expected = [
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

    patch(node, () => {
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

  it('should flush the output', () => {
    const output1 = renderToString(() => {
      elementOpen('main', null, ['id', 'main-element', 'data-foo', 'bar']);
        elementOpen('section');
        elementClose('section');
      elementClose('main');
    });

    assert.strictEqual(output1, '<main id="main-element" data-foo="bar"><section></section></main>');

    const output2 = renderToString(() => {});

    assert.strictEqual(output2, '');
  });

  it('should allow creating complex nodes', () => {
    const output = renderToString(() => {
      elementOpen('main', null, ['id', 'main-el']);
        elementOpen('div');
          elementOpen('span');
            text('hello');
            elementOpen('p');
              elementVoid('a', null, ['href', 'http:\/\/liferay.com']);
            elementClose('p');
          elementClose('span');
        elementVoid('a', null, ['href', 'http:\/\/www.wedeploy.com']);
        elementClose('div');
      elementClose('main');
    });

    const expected = ['<main id="main-el">',
      '<div><span>hello<p><a href="http://liferay.com">',
      '</a></p></span><a href="http://www.wedeploy.com">',
      '</a></div></main>'].join('');

    assert.strictEqual(output, expected);
  });

  describe('with patch', () => {
    let el = {innerHTML: ''};

    beforeEach(() => {
      patch(el, () => {
        elementVoid('div', 'key', [
            'id', 'someId',
            'class', 'someClass',
            'data-custom', 'custom'
        ],
          'data-foo', 'Hello',
          'data-bar', 'World')
      });
    });

    it('should render with the specificed tag', () => {
      const expected = ['<div id="someId" ',
        'class="someClass" data-custom="custom" ',
        'data-foo="Hello" data-bar="World"></div>'
      ].join('');

      assert.strictEqual(el.innerHTML, expected);
    });

    it('should render with static attributes', () => {
      const matchId = findAttribute(el, 'id');
      assert.strictEqual(matchId[1], 'someId');

      const matchClass = findAttribute(el, 'class');
      assert.strictEqual(matchClass[1], 'someClass');

      const matchData = findAttribute(el, 'data-custom');
      assert.strictEqual(matchData[1], 'custom');
    });

    it('should render with dynamic attributes', () => {
      let matchData = findAttribute(el, 'data-foo');
      assert.strictEqual(matchData[1], 'Hello');

      matchData = findAttribute(el, 'data-bar');
      assert.strictEqual(matchData[1], 'World');
    });

    it('should allow creation without static attributes', () => {
      patch(el, () => {
        elementVoid('div', null, null, 'id', 'test');
      });
      assert.strictEqual(el.innerHTML, '<div id="test"></div>');
    });

    it('should patch inside renderToString flush buffer', () => {
      const output = renderToString(() => {
        patch(el, () => elementVoid('div'));
        assert.strictEqual(el.innerHTML, '<div></div>');
      });
      assert.strictEqual(output, '');
    });

    it('should capture currentElement inside patch', () => {
       let current = {};
       patch(current, () => elementVoid('div'));
      assert.strictEqual(current, currentElement());
    });
  });

  describe('with conditional attributes', () => {
    function render(obj) {
      elementOpenStart('div');
      if (obj.key) {
        attr('data-expanded', obj.key);
      }
      elementOpenEnd();
      elementClose('div');
    }

    it('should be present when specified', () => {
      const node =  {innerHTML: ''};

      patch(node, () => render({key: 'hello'}));

      const matchData = findAttribute(node, 'data-expanded');
      assert.strictEqual(matchData[1], 'hello');
    });

    it('should not be present when not specified', () => {
      const node =  {innerHTML: ''};

      patch(node, () => render({key: false}));

      const matchData = findAttribute(node, 'data-expanded', false);
      assert.ok(matchData === null);
      assert.strictEqual(node.innerHTML, '<div></div>');
    });

    it('should update output when changed', () => {
      const node =  {innerHTML: ''};

      patch(node, () => render({key: 'foo'}));
      patch(node, () => render({key: 'bar'}));

      const matchData = findAttribute(node, 'data-expanded');
      assert.strictEqual(matchData[1], 'bar');
    });
  });
});
