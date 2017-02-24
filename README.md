# Incremental DOM string

The DOM to be rendered is described with the incremental node functions, `elementOpen`, `elementClose` and `text`. For example, the following function:

```js
import {elementOpen, elementClose, text} from 'incremental-dom-string';

elementOpen('div');
  text('Hello world');
elementClose('div');
```
would correspond to

```html
<div>
  Hello world
</div>
```
