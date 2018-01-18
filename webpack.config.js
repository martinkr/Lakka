let plugins = [];
const path = require('path');

const MinifyPlugin = require("babel-minify-webpack-plugin");
// plugins.push(new MinifyPlugin());

module.exports = {
	entry: {
		"umd": "./app/api/main.js",
		"global": "./app/adapter/global.js"
	},
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'lakka.[name].bundle.js'
	},

	plugins: plugins,
	module: {
		rules: [
			{ test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" }
		]
	}
};
