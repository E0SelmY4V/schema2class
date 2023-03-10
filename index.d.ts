import type { OfSchema, TypeOf } from 'accurtype'
type AllPartial<T> = { [I in keyof T]?: AllPartial<T[I]>; }
type AllRequired<T> = { [I in keyof T]-?: AllRequired<T[I]>; }
/**
 * JSON Schema Parser
 * @version 2.5.5
 * @license MIT
 * @link https://github.com/E0SelmY4V/schema2class
 */
declare const _exports: {
	<T>(schema?: T, option?: _exports.ParseOption): (n?: AllPartial<OfSchema<T>>) => AllRequired<OfSchema<T>>;
	realArray: boolean;
	check: boolean;
	checkKey: boolean;
	checkType: boolean;
}
export = _exports
declare namespace _exports {
	type ParseOption = Partial<typeof _exports>
}