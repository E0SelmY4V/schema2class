"use strict";

const getType = (n) => {
	switch (typeof n) {
		case 'bigint': case 'number': return 'number';
		case 'boolean': return 'bollean';
		case 'object': return n ? Array.isArray(n) ? 'array' : 'object' : 'null';
		case 'string': return 'string';
		default: return "null";
	}
}

const getClsArr = () => {
	function ParsedArr(n = null) {
		const arr = [];
		Object.setPrototypeOf(arr, ParsedArr.prototype);
		ParsedArr.prototype.constructor = ParsedArr;
		n === null ? arr.length = ParsedArr.prototype.length
			: typeof n === 'number' ? arr.length = n
				: ParsedArr.prototype.__eleClass
					? n.forEach(e => arr.push(new ParsedArr.prototype.__eleClass(e)))
					: arr.push(...n);
		return arr;
	}
	ParsedArr.prototype = [];
	return ParsedArr;
}

const getClsObj = () => function ParsedObj(n = null) {
	for (const i in n) typeof ParsedObj.prototype[i] !== 'object'
		? this[i] = n[i]
		: this[i] = new ParsedObj.prototype[i].constructor(n[i]);
};

const expArr = (schema) => {
	const cls = getClsArr();
	let func = e => cls.prototype.push(e);
	switch (schema.items.type) {
		case 'object': {
			const eleClass = expObj(schema.items);
			cls.prototype.__eleClass = eleClass;
			func = e => cls.prototype.push(new eleClass(e));
		} break;
		case 'array': {
			const eleClass = expArr(schema.items);
			cls.prototype.__eleClass = eleClass;
			func = e => {
				let ins = new eleClass(e);
				cls.prototype.push(ins);
				ins.length = eleClass.prototype.length;
			}
		} break;
	}
	return (schema.default || []).forEach(func), cls;
}

const expObj = (schema) => {
	const cls = getClsObj();
	for (let i in schema.properties) {
		let attr = schema.properties[i], type = attr.type;
		if (typeof type !== 'string') type = typeof attr.default === 'undefined' ? type[0] : getType(attr.default);
		switch (type) {
			case 'object': cls.prototype[i] = new (expObj(attr)); break;
			case 'array': cls.prototype[i] = new (expArr(attr)); break;
			default: cls.prototype[i] = attr.default; break;
		}
	}
	return schema.default && (cls.prototype = new cls(schema.default)), cls;
}

module.exports = (schema) => Array.isArray(schema) ? expArr(schema) : typeof schema === 'object' ? expObj(schema) : schema.constructor;
