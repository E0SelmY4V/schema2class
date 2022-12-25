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
        "type": [
          "array",
          "object"
        ],
        "items": {
          "type": "string",
          "default": "klm"
        },
        "properties": {
          "str": {
            "type": "string",
            "default": "abc"
          }
        },
        "default": [
          "hig"
        ]
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

You can create the factory function for this schema, just like:

```javascript
const shcema = require('./schema.json');
const s2c = require('schema2class');
const log = console.log;

const schemaFactory = s2c(shcema);

const data0 = schemaFactory();
log(data0); // ParsedObj {}
log(data0.a); // 100
log(data0.b); // ParsedArr(1) [ <1 empty items> ]
log(data0.b[0].str); // def

const data1 = schemaFactory({
  b: [
    { str: "jkl" },
    {},
    void 0,
    [void 0],
  ],
});
log(data1.b[0]); // ParsedObj { str: 'jkl' }
log(data1.b[1].str); // abc
log(data1.b[2][0]); // hig
log(data1.b[3]); // ParsedArr(1) [ 'klm' ]
```

You can also check the correctness of the data through the factory.

```javascript
const shcema = require('./schema.json');
const s2c = require('schema2class');

const schemaFactory = s2c(shcema);
s2c.check = true;

schemaFactory({ c: 123 });
// ReferenceError: 'c' is not a key of { a; b; }

schemaFactory({ b: ['asd'] });
// TypeError: Type 'string' is not assignable to type 'array | object'
```
