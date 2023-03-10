require('ie-passer').iePasser([
	__dirname + '/../es3.js',
	__dirname + '/tool.js',
], {
	test1() {
		const data0 = schemaFactory();
		alert(data0); // ParsedObj {}
		alert(data0.a); // 100
		alert(data0.b.length); // ParsedArr(1) [ <1 empty items> ]
		alert(data0.b[0].str); // def
		alert(data0.b instanceof Array); // true

	},
	test2() {
		const data1 = schemaFactory({
			b: [
				{ str: "jkl" },
				{},
				void 0,
				[void 0],
			],
		});
		alert(data1.b[0].str); // ParsedObj { str: 'jkl' }
		alert(data1.b[1].str); // abc
		alert(data1.b[2][0]); // hig
		alert(data1.b[3][0]); // ParsedArr { '0': 'klm', length: 1 }
		alert(data1.b[3].length); // ParsedArr { '0': 'klm', length: 1 }
		alert(data1.b instanceof Array); // true
	},
	test3() {
		try {
			schemaFactory({ c: 123 });
			// ReferenceError: 'c' is not a key of { a; b; }
		} catch (err) {
			alert(err.message);
		}
	},
	test4() {
		try {
			schemaFactory({ b: ['asd'] });
			// TypeError: Type 'string' is not assignable to type 'array | object'
		} catch (err) {
			alert(err.message);
		}
	},
});