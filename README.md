# Schema to Class

Parse JSON schema to class, and you can 'new' your data easily.

## Usage

For example, if you have a JSON schema like this:

```json
{
  "type": "object",
  "properties": {
    "a": {
      "type": "integer",
      "default": 100
    },
    "b": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "str": {
            "type": "string",
            "default": "abc"
          }
        }
      },
      "default": [
        {
          "str": "def"
        }
      ]
    }
  }
}
```

You can create the class for this schema.

```javascript
const shcema = require('./schema.json');
const s2c = require('schema2class');
const log = console.log;

const SchemaClass = s2c(shcema);

const data0 = new SchemaClass();
log(data0); // ParsedObj {}
log(data0.a); // 100
log(data0.b); // ParsedArr(1) [ <1 empty items> ]
log(data0.b[0].str); // def

const data1 = new SchemaClass({
  b: [{ str: "jkl" }, {}]
});
log(data1.b); // ParsedArr(2) [ ParsedObj { str: 'jkl' }, ParsedObj {} ]
log(data1.b[1].str); // abc
```
