const htmlparser = require('htmlparser2');

const parseTags = (html) => {

  const output = {
    tag: null,
    startIndex: 0,
    endIndex: 0,
    startStr: '',
    endStr: ''
  };

  let root = {name: '', attribs: null};

  const parser = new htmlparser.Parser({
    onopentag(name, attribs) {
      if (!root.name) {
        root.name = name;
        root.attribs = attribs;
      }
    },
    onclosetag(tagname) {
      if (root.name && tagname === root.name) {
        output.tag = root;
      }
    }
  });

  parser.write(html);
  parser.end();

  output.startIndex = parser.startIndex;
  output.endIndex = parser.endIndex;
  output.startStr = html.substr(0, output.startIndex);
  output.endStr = html.substr(output.startIndex - (output.endIndex + 1));

  return output;
};

export {
  parseTags
};
