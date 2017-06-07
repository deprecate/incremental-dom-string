# Incremental DOM string

## Setup

```
npm install --save incremental-dom-string
```

## Usage

The string to be rendered is described with the incremental node functions, `elementOpen`, `elementClose` and `text`. For example, the following function:

```js
var IncrementalDOM = require('incremental-dom-string');

const output = IncrementalDOM.renderToString(() => {
  IncrementalDOM.elementOpen('div');
    IncrementalDOM.text('Hello world');
  IncrementalDOM.elementClose('div');
});

console.log(output);
```
where `output` would correspond to

```html
<div>Hello world</div>
```
