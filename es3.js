/**
 * JSON Schema Parser
 * @version 2.3.0
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
	exp_map.object = function (def, props) {
		var clss = {};
		function ParsedObj(n) {
			if (n) for (var i in n) i in clss ? this[i] = clss[i](n[i]) : exp.check || exp.checkKey ? THR.notKey(i, clss) : this[i] = n[i];
		}
		if (props) for (var i in props) ParsedObj.prototype[i] = (clss[i] = exp(props[i]))();
		typeof def === 'object' && !isFinite(def.length) && (ParsedObj.prototype = new ParsedObj(def));
		return function (n) { return new ParsedObj(n); };
	};
	exp_map.array = function (def, _, items) {
		var eCls = exp(items);
		function ParsedArr(n) {
			if (typeof n === 'object' && isFinite(n.length)) {
				this.length = 0;
				for (var i = 0; i < n.length; ++i) this.push(eCls(n[i]));
			} else this.length = ParsedArr.prototype.length;
		}
		ParsedArr.prototype = [], ParsedArr.prototype.constructor = ParsedArr;
		if (typeof def === 'object' && isFinite(def.length)) for (var i = 0; i < def.length; ++i) ParsedArr.prototype.push(eCls(def[i]));
		return function (n) { return new ParsedArr(n); };
	};
	function exp(sc) {
		var types = sc.type || 'object';
		if (typeof types === 'string') {
			var cls = exp_map[types](sc['default'], sc.properties, sc.items);
			return function (n) {
				return typeof n === 'undefined' ? cls() : getType(n) === types ? cls(n) : exp.check || exp.checkType ? THR.notType(getType(n), [types]) : n;
			};
		} else {
			var clss = {};
			for (var i = types.length - 1; i >= 0; --i) clss[types[i]] = exp_map[types[i]](sc['default'], sc.properties, sc.items);
			return function (n) {
				if (typeof n !== 'undefined') {
					var nType = getType(n);
					return nType in clss ? clss[nType](n) : exp.check || exp.checkType ? THR.notType(nType, types) : n;
				} else return clss[types[0]]();
			};
		}
	}
	exp.check = false;
	exp.checkKey = false;
	exp.checkType = false;
	typeof module === 'undefined' ? window.schema2class = exp : module.exports = exp;
})();