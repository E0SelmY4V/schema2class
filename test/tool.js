var schemaFactory = schema2class({
	"$schema": "http://json-schema.org/draft-07/schema",
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
}, {
	check: true
});
// schema2class.check = true;