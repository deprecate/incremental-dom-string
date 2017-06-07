# Incremental DOM string

The DOM to be rendered is described with the incremental node functions, `elementOpen`, `elementClose` and `text`. For example, the following function:

```js
import {
  elementOpen,
  elementClose,
  text,
  renderToString
 } from 'incremental-dom-string';

const output = renderToString(() => {
  elementOpen('div');
    text('Hello world');
  elementClose('div');
});
```
where `output` would correspond to

```html
<div>
  Hello world
</div>
```
