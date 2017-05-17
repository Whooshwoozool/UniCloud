var webpack = require('webpack');
module.exports = {
	context: __dirname + '/app',
	entry: {
		app: './app.js'
		//vendor: ['angular']
	},
	output: {
		path: __dirname + '/bundle',
		filename: 'app.bundle.js'
	},

	watch: true,
	watchOptions: {
		aggregateTimeout: 150
	},

	devtool: "cheap-inline-module-source-map"
};