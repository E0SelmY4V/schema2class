'use strict';

const getType = (n) => {
	if (n === null) return 'null';
	switch (typeof n) {
		case 'bigint':
		case 'number':
			return 'number';
		case 'boolean':
			return 'bollean';
		case 'object':
			return Array.isArray(n) ? 'array' : 'object';
		case 'string':
			return 'string';
	}
	return "null";
}

this.getClsArr = () => {
	function ParsedArr(n = null) {
		const arr = [];
		Object.setPrototypeOf(arr, ParsedArr.prototype);
		arr.constructor = ParsedArr;
		if (n === null) return arr;
		if (typeof n == 'number') {
			this.length = n;
			return arr;
		}
		ParsedArr.prototype.eleClass
			? n.forEach(e => this.push(new ParsedArr.prototype.eleClass(e)))
			: arr.push(...n);
		return arr;
	}
	ParsedArr.prototype = [];
	return ParsedArr;
}

this.getClsObj = () => function ParsedObj(n = null) {
	if (n === null) return;
	for (let i in n) typeof ParsedObj.prototype[i] !== 'object'
		? this[i] = n[i]
		: this[i] = new ParsedObj.prototype[i].constructor(n[i]);
};

const expArr = (schema) => {
	let cls = this.getClsArr(), eleClass, func = e => cls.prototype.push(e);
	switch (schema.items.type) {
		case 'object':
			eleClass = expObj(schema.items);
			cls.prototype.eleClass = eleClass;
			func = e => cls.prototype.push(new eleClass(e));
			break;
		case 'array':
			eleClass = expArr(schema.items);
			cls.prototype.eleClass = eleClass;
			func = e => {
				let ins = new eleClass(e);
				cls.prototype.push(ins);
				ins.length = eleClass.prototype.length;
			}
			break;
	}
	schema.default.forEach(func);
	return cls;
}

const expObj = (schema) => {
	let cls = this.getClsObj();
	for (let i in schema.properties) {
		let attr = schema.properties[i], type = attr.type;
		if (typeof type !== 'string') {
			type = typeof attr.default === 'undefined' ? type[0] : getType(attr.default);
		}
		switch (type) {
			case 'object':
				cls.prototype[i] = new (expObj(attr));
				break;
			case 'array':
				cls.prototype[i] = new (expArr(attr));
				cls.prototype[i].length = Object.getPrototypeOf(cls.prototype[i]).length;
				break;
			default:
				cls.prototype[i] = attr.default;
				break;
		}
	}
	return cls;
}

module.exports = (schema) => (Array.isArray(schema) ? expArr : typeof schema === 'object' ? expObj : _ => _)(schema);
