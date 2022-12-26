/**
 * JSON Schema Parser
 * @version 2.3.0
 * @link https://github.com/E0SelmY4V/schema2class
 */
"use strict";
(() => {
	const toMap = (arr, f = true) => (arr.push({}), arr.reduceRight((p, n) => (p[n] = f, p)));
	const TYPE_BASE = [
		"boolean",
		"integer",
		"null",
		"number",
		"string",
	];
	const getType_map = {
		bigint: 'number',
		number: 'number',
		boolean: 'boolean',
		string: 'string',
		symbol: 'object',
		'function': 'object',
		'undefined': 'null',
		object: false,
	};
	const getType = (n) => getType_map[typeof n] || (n ? isFinite(n.length) ? 'array' : 'object' : 'null');
	const THR = {
		notKey(i, clss) {
			const message = `'${i}' is not a key of { ${Object.keys(clss).map(e => e + '; ').join('')}}`;
			throw ReferenceError(message);
		},
		notType(t, ts) {
			const message = `Type '${t}' is not assignable to type '${ts.join(' | ')}'`;
			throw TypeError(message);
		},
	};
	let checkKey = false;
	let checkType = false;
	let realArray = false;
	const exp_map = {
		...toMap(TYPE_BASE, (def) => (n = def) => n),
		object(def, props) {
			const clss = {};
			function ParsedObj(n) {
				for (const i in n) i in clss ? this[i] = clss[i](n[i]) : checkKey ? THR.notKey(i, clss) : this[i] = n[i];
			}
			for (const i in props) ParsedObj.prototype[i] = (clss[i] = exp(props[i]))();
			typeof def === 'object' && !isFinite(def.length) && (ParsedObj.prototype = new ParsedObj(def));
			return n => new ParsedObj(n);
		},
		array(def, _, items) {
			const eCls = exp(items);
			const ParsedArr = realArray ? function ParsedArr(n) {
				return Object.setPrototypeOf(
					typeof n === 'object' && isFinite(n.length)
						? n.map(eCls)
						: ((n = []).length = ParsedArr.prototype.length, n),
					ParsedArr.prototype,
				);
			} : function ParsedArr(n) {
				typeof n === 'object' && isFinite(n.length)
					? (this.length = 0, n.forEach(e => this.push(eCls(e))))
					: this.length = ParsedArr.prototype.length;
			};
			ParsedArr.prototype = [], ParsedArr.prototype.constructor = ParsedArr;
			typeof def === 'object' && isFinite(def.length) && def.forEach(e => ParsedArr.prototype.push(eCls(e)));
			return n => new ParsedArr(n);
		},
	};
	function exp(sc) {
		const types = sc.type || 'object';
		if (typeof types === 'string') {
			const cls = exp_map[types](sc.default, sc.properties, sc.items);
			return (n) => typeof n === 'undefined' ? cls()
				: getType(n) === types ? cls(n) : checkType ? THR.notType(getType(n), [types]) : n;
		} else {
			const clss = {};
			types.forEach(e => clss[e] = exp_map[e](sc.default, sc.properties, sc.items));
			return (n) => {
				if (typeof n !== 'undefined') {
					const nType = getType(n);
					return nType in clss ? clss[nType](n) : checkType ? THR.notType(nType, types) : n;
				} else return clss[types[0]]();
			};
		}
	}
	Object.defineProperties(typeof module === 'undefined' ? window.schema2class = exp : module.exports = exp, {
		check: { get: () => checkKey && checkType, set: (n) => checkKey = checkType = n },
		checkKey: { get: () => checkKey, set: (n) => checkKey = n },
		checkType: { get: () => checkType, set: (n) => checkType = n },
		realArray: { get: () => realArray, set: (n) => realArray = n },
	});
})();