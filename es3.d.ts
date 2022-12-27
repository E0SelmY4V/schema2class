/**
 * JSON Schema Parser
 * @version 2.5.1
 * @link https://github.com/E0SelmY4V/schema2class
 */
declare const _exports: {
	(schema: any, option?: ParseOption): (n?: any) => any;
	realArray: false;
	check: boolean;
	checkKey: boolean;
	checkType: boolean;
};
export = _exports;
type ParseOption = Partial<typeof _exports>