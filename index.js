/**
 * JSON Schema Parser
 * @version 2.5.5
 * @license MIT
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
	const exp_map = {
		...toMap(TYPE_BASE, (def) => (n = def) => n),
		object(def, o, props) {
			const clss = {};
			const ParsedObj = o.check || o.checkKey ? function ParsedObj(n) {
				for (const i in n) i in clss ? this[i] = clss[i](n[i]) : THR.notKey(i, clss);
			} : function ParsedObj(n) {
				for (const i in n) i in clss ? this[i] = clss[i](n[i]) : this[i] = n[i];
			}
			for (const i in props) ParsedObj.prototype[i] = (clss[i] = parse(props[i], o))();
			typeof def === 'object' && def && !isFinite(def.length) && (ParsedObj.prototype = new ParsedObj(def));
			return n => new ParsedObj(n);
		},
		array(def, o, _, items = {}) {
			const eCls = parse(items, o);
			const ParsedArr = o.realArray ? function ParsedArr(n) {
				return Object.setPrototypeOf((typeof n === 'object'
					? n.map(eCls)
					: Array(ParsedArr.prototype.length)
				), ParsedArr.prototype);
			} : function ParsedArr(n) {
				typeof n === 'object'
					? (this.length = 0, n.forEach(e => this.push(eCls(e))))
					: this.length = ParsedArr.prototype.length;
			};
			ParsedArr.prototype = [], ParsedArr.prototype.constructor = ParsedArr;
			def && typeof def.forEach === 'function' && def.forEach(e => ParsedArr.prototype.push(eCls(e)));
			return n => new ParsedArr(n);
		},
	};
	function parse(sc, o) {
		const types = sc.type || 'object';
		if (typeof types === 'string') {
			const cls = exp_map[types](sc.default, o, sc.properties, sc.items);
			return o.check || o.checkType
				? (n) => typeof n === 'undefined' ? cls() : getType(n) === types ? cls(n) : THR.notType(getType(n), [types])
				: (n) => typeof n === 'undefined' ? cls() : getType(n) === types ? cls(n) : n;
		} else {
			const clss = { a: () => void 0 }, det = types[0] || 'a';
			types.forEach(e => clss[e] = exp_map[e](sc.default, o, sc.properties, sc.items));
			return o.check || o.checkType ? (n) => {
				if (typeof n !== 'undefined') {
					const nType = getType(n);
					return nType in clss ? clss[nType](n) : THR.notType(nType, types);
				} else return clss[det]();
			} : (n) => {
				if (typeof n !== 'undefined') {
					const nType = getType(n);
					return nType in clss ? clss[nType](n) : n;
				} else return clss[det]();
			};
		}
	}
	const exp = Object.assign((schema = {}, option) => parse(schema, new Option(option)), {
		check: false,
		checkKey: false,
		checkType: false,
		realArray: false,
	});
	function Option(n) {
		Object.assign(this, n);
	}
	Option.prototype = exp;
	typeof module === 'undefined' ? window.schema2class = exp : module.exports = exp;
})();