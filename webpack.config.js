let plugins = [];
const path = require("path");
const webpack = require("webpack");
const TerserPlugin = require("terser-webpack-plugin");

plugins.push(
	new webpack.BannerPlugin({
		banner:
			'Lakka, github.com/martinkr/Lakka',
	})
);

module.exports = {
	// mode: 'production',
	stats: 'verboose',
	entry: {
		"umd": "./app/main.js",
	},
	devtool: 'source-map',
	output: {
		clean: true, // Clean the output directory before emit.
		library: "lakka",
		libraryTarget: "umd",
		path: path.resolve(__dirname, "dist"),
		filename: "lakka.umd.js"
	},
	optimization: {
		minimize: true,
		minimizer: [
			new TerserPlugin({
				terserOptions: {
					format: {
						// Say `terser` do not keep license comments
						comments: /!/i,
					},
				},
				// Say `terser-webpack-plugin` do not create license comments
				extractComments: false
			}),
		],
	},
	plugins: plugins,
	module: {
		rules: [
			{ test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" }
		]
	}
};
