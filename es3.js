/**
 * JSON Schema Parser
 * @version 2.5.2
 * @link https://github.com/E0SelmY4V/schema2class
 */
"use strict";
(function () {
	function toMap(arr, f) {
		if (typeof f === 'undefined') f = true;
		for (var map = {}, i = arr.length - 1; i >= 0; --i) map[arr[i]] = f;
		return map;
	}
	var TYPE_BASE = [
		"boolean",
		"integer",
		"null",
		"number",
		"string"
	];
	var getType_map = {
		bigint: 'number',
		number: 'number',
		boolean: 'boolean',
		string: 'string',
		symbol: 'object',
		'function': 'object',
		'undefined': 'null',
		object: false
	};
	function getType(n) {
		return getType_map[typeof n] || (n ? isFinite(n.length) ? 'array' : 'object' : 'null');
	}
	var THR = {
		notKey: function (i, clss) {
			var message = '\'' + i + '\' is not a key of { ';
			for (var j in clss) message += j + '; '
			message += '}';
			throw ReferenceError(message);
		},
		notType: function (t, ts) {
			var message = 'Type \'' + t + '\' is not assignable to type \'' + ts.join(' | ') + '\'';
			throw TypeError(message);
		}
	};
	var exp_map = toMap(TYPE_BASE, function (def) {
		return function (n) { return typeof n === 'undefined' ? def : n; };
	});
	exp_map.object = function (def, o, props) {
		var clss = {};
		var ParsedObj = o.check || o.checkKey ? function ParsedObj(n) {
			if (n) for (var i in n) i in clss ? this[i] = clss[i](n[i]) : THR.notKey(i, clss);
		} : function ParsedObj(n) {
			if (n) for (var i in n) i in clss ? this[i] = clss[i](n[i]) : this[i] = n[i];
		}
		if (props) for (var i in props) ParsedObj.prototype[i] = (clss[i] = parse(props[i], o))();
		typeof def === 'object' && def && !isFinite(def.length) && (ParsedObj.prototype = new ParsedObj(def));
		return function (n) { return new ParsedObj(n); };
	};
	exp_map.array = function (def, o, _, items) {
		var eCls = parse(items || {}, o);
		function ParsedArr(n) {
			if (typeof n !== 'undefined') {
				this.length = 0;
				for (var i = 0; i < n.length; ++i) this.push(eCls(n[i]));
			} else this.length = ParsedArr.prototype.length;
		}
		ParsedArr.prototype = [], ParsedArr.prototype.constructor = ParsedArr;
		if (typeof def === 'object' && def && isFinite(def.length)) for (var i = 0; i < def.length; ++i) ParsedArr.prototype.push(eCls(def[i]));
		return function (n) { return new ParsedArr(n); };
	};
	function parse(sc, o) {
		var types = sc.type || 'object';
		if (typeof types === 'string') {
			var cls = exp_map[types](sc['default'], o, sc.properties, sc.items);
			return o.check || o.checkType
				? function (n) { return typeof n === 'undefined' ? cls() : getType(n) === types ? cls(n) : THR.notType(getType(n), [types]); }
				: function (n) { return typeof n === 'undefined' ? cls() : getType(n) === types ? cls(n) : n; };
		} else {
			var clss = { a: function () { } }, det = types[0] || 'a';
			for (var i = types.length - 1; i >= 0; --i) clss[types[i]] = exp_map[types[i]](sc['default'], o, sc.properties, sc.items);
			return o.check || o.checkType ? function (n) {
				if (typeof n !== 'undefined') {
					var nType = getType(n);
					return nType in clss ? clss[nType](n) : THR.notType(nType, types);
				} else return clss[det]();
			} : function (n) {
				if (typeof n !== 'undefined') {
					var nType = getType(n);
					return nType in clss ? clss[nType](n) : n;
				} else return clss[det]();
			};
		}
	}
	function exp(schema, option) {
		return parse(schema || {}, new Option(option));
	}
	exp.check = false;
	exp.checkKey = false;
	exp.checkType = false;
	function Option(n) {
		if (n) for (var i in n) this[i] = n[i];
	}
	Option.prototype = exp;
	typeof module === 'undefined' ? window.schema2class = exp : module.exports = exp;
})();