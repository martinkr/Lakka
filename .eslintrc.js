
module.exports = {
	"root": true,
	"extends": "eslint:recommended",
	"parserOptions": { "ecmaVersion": 8 },
	"env": {
		"browser": true,
		"es6": true,
		"amd": true,
		"node": true

	},
	"globals": {
		"ENV": "",
		"ENV_LOGLEVEL": "" // "verboose"
	},

	"rules": {
		"no-console": "off"
	}
}

// sane
// preserve native functionality
// explicit, readable code
// be as verboose as possible
