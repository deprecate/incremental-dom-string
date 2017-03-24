
const noop = function() {};

let outputTarget_ = {
  addEventListener() {}
};

let buffer_ = [];
let output_ = {};
let nestingCount_ = 1;
let keepOpen_ = false;
let prettyPrint_ = '';
let doneCallback_;

const push_ = function(token, close = false) {
  buffer_.push(token);

  if (close) {
    output_.html = buffer_.slice().join('');
    buffer_ = [];
  }
};

const getOutput = function(flush = false) {
  if (flush) {
    output_.html = '';
  }
  const tmp = output_.html.slice();
  return tmp;
};

const attrsArray_ = function(data) {
  for (let i = 0, l = data.length; i < l; i += 2) {
    attr(data[i], data[i + 1]);
  }
};

/***
 * Defines a virtual attribute at this point of the DOM. This is only valid
 * when called between elementOpenStart and elementOpenEnd.
 *
 * @param {string} name
 * @param {*} value
 */
const attr = function(name, value) {
  push_(` ${name}="${value}"`);
};

/**
 * Closes an open virtual Element.
 *
 * @param {NameOrCtorDef} nameOrCtor The Element's tag or constructor.
 * @return {!Element} The corresponding Element.
 */
const elementClose = function(nameOrCtor) {
  let close = false;
  nestingCount_--;
  if (nestingCount_ === 1) {
    close = true;
  }
  push_(`</${nameOrCtor}>`, close);

  return outputTarget_;
};

/**
 * Declares a virtual Element at the current location in the document that has
 * no children.
 * @param {NameOrCtorDef} nameOrCtor The Element's tag or constructor.
 * @param {?string=} key The key used to identify this element. This can be an
 *     empty string, but performance may be better if a unique value is used
 *     when iterating over an array of items.
 * @param {?Array<*>=} statics An array of attribute name/value pairs of the
 *     static attributes for the Element. These will only be set once when the
 *     Element is created.
 * @param {...*} var_args Attribute name/value pairs of the dynamic attributes
 *     for the Element.
 * @return {!Element} The corresponding Element.
 */
const elementVoid = function(nameOrCtor, key, statics, var_args) {
  elementOpen(nameOrCtor, key, statics, var_args);
  return elementClose(nameOrCtor);
};


/**
 * @param {NameOrCtorDef} nameOrCtor The Element's tag or constructor.
 * @param {?string=} key The key used to identify this element. This can be an
 *     empty string, but performance may be better if a unique value is used
 *     when iterating over an array of items.
 * @param {?Array<*>=} statics An array of attribute name/value pairs of the
 *     static attributes for the Element. These will only be set once when the
 *     Element is created.
 * @param {...*} var_args, Attribute name/value pairs of the dynamic attributes
 *     for the Element.
 * @return {!Element} The corresponding Element.
 */
const elementOpen = function(nameOrCtor, key, statics, var_args) {

  elementOpenStart(nameOrCtor, key, statics);

  if (Array.isArray(var_args)) {
    attrsArray_(var_args);
  }

  return elementOpenEnd();
};

/**
 * Closes an open tag started with elementOpenStart.
 * @return {!Element} The corresponding Element.
 */
const elementOpenEnd = function() {
  push_('>');
  nestingCount_++;

  return outputTarget_;
};

/**
 * Declares a virtual Element at the current location in the document. This
 * corresponds to an opening tag and a elementClose tag is required. This is
 * like elementOpen, but the attributes are defined using the attr function
 * rather than being passed as arguments. Must be folllowed by 0 or more calls
 * to attr, then a call to elementOpenEnd.
 * @param {NameOrCtorDef} nameOrCtor The Element's tag or constructor.
 * @param {?string=} key The key used to identify this element. This can be an
 *     empty string, but performance may be better if a unique value is used
 *     when iterating over an array of items.
 * @param {?Array<*>=} statics An array of attribute name/value pairs of the
 *     static attributes for the Element. These will only be set once when the
 *     Element is created.
 */
const elementOpenStart = function(nameOrCtor, key, statics) {
  push_(`<${nameOrCtor}`);

  // TODO: probably do something useful with key
  if (Array.isArray(statics)) {
    attrsArray_(statics);
  }
};

const patch = function(node, description, data) {

  const fn = typeof description === 'function' ? description : noop;
  if (typeof node === 'function') {
    node(() => fn(data));
  } else {
    fn(data);
  }


  const output = getOutput();
  if (Object.prototype.hasOwnProperty.call(node, 'innerHTML')) {
    node.innerHTML = output;
  }
  if (doneCallback_) {
    doneCallback_(output_);
  }
};

const patchOuter = patch;
const patchInner = patch;

/**
 * Declares a virtual Text at this point in the document.
 *
 * @param {string|number|boolean} value The value of the Text.
 * @param {...(function((string|number|boolean)):string)} var_args
 *     Functions to format the value which are called only when the value has
 *     changed.
 * @return {!Text} The corresponding text node.
 */
const text = function(value, var_args) {
  let formatted = value;

  if (Array.isArray(var_args)) {
    for (let v of var_args) {
      formatted = v(formatted);
    }
  }

  push_('' + formatted);
};

const setOutput = function(prettyPrint, output, doneCallback, keepOpen) {
  prettyPrint_ = prettyPrint;
  output_ = output ? output : {};
  doneCallback_ = typeof callback === 'function' ? callback : undefined;
  keepOpen_ = keepOpen;
};


const setOutputTarget = function (obj, merge) {
  if (merge) {
    Object.assign(outputTarget_, obj);
  } else {
    outputTarget_ = obj;
  }
};

export {
  elementOpenStart,
  elementOpenEnd,
  elementOpen,
  elementVoid,
  elementClose,
  text,
  attr,
  patch,
  patchInner,
  patchOuter,
  getOutput,
  setOutput,
  setOutputTarget,
};
