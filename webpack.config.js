let plugins = [];
const path = require("path");
const webpack = require("webpack");

// const MinifyPlugin = require("babel-minify-webpack-plugin", {
// 	removeConsole: true,
// 	removeDebugger: true,
// });

plugins.push(new webpack.BannerPlugin({
	"raw": true,
	"banner": "/*!lakka*/"
}));
// plugins.push(new MinifyPlugin());

module.exports = {
	entry: {
		"umd": "./app/api/main.js"
	},
	devtool: 'source-map',
	output: {
		library: "lakka",
		libraryTarget: "umd",
		path: path.resolve(__dirname, "dist"),
		filename: "lakka.js"
	},

	plugins: plugins,
	module: {
		rules: [
			{ test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" }
		]
	}
};
