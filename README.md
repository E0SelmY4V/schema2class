# Schema to Class

Parse JSON schema to class, and you can 'new' your data easily.

This is also an ES3 edition for IE Browser.

## Import

- ES Module

  ```javascript
  import schema2class from 'schema2class';
  ```

- Typescript

  ```javascript
  import schema2class = require('schema2class');
  ```

- CommonJS

  ```javascript
  const schema2class = require('schema2class');
  // or
  var schema2class = require('schema2class/es3');
  ```

- Broswer

  ```html
  <!--[if IE]><script src="schema2class/es3.js"><![endif]-->
    <script src="schema2class/index.js"></script>
  <!--[if IE]></script><![endif]-->
  <script>
    /// <reference path="schema2class/browser.d.ts" />

    console.log(schema2class);
  </script>
  ```

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

const schemaFactory0 = s2c(shcema, {
  realArray: true, // Bad performance, but '[]'
});
const data0 = schemaFactory0();
log(data0); // ParsedObj {}
log(data0.a); // 100
log(data0.b); // ParsedArr(1) [ <1 empty items> ]
log(data0.b[0].str); // def
log(data0.b instanceof Array); // true
log(Array.isArray(data0.b)); // true

const schemaFactory1 = s2c(shcema);
const data1 = schemaFactory1({
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
log(data1.b[3]); // ParsedArr { '0': 'klm', length: 1 }
log(data1.b instanceof Array); // true
log(Array.isArray(data1.b)); // false
```

You can also check the correctness of the data through the factory.

```javascript
const shcema = require('./schema.json');
const s2c = require('schema2class');

const schemaFactory = s2c(shcema, {
  check: true, // Check all the error types
});

schemaFactory({ c: 123 });
// ReferenceError: 'c' is not a key of { a; b; }

schemaFactory({ b: ['asd'] });
// TypeError: Type 'string' is not assignable to type 'array | object'
```
