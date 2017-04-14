'use strict';

const webpack = require("webpack");
const path = require("path");
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	devtool: 'source-map',
	entry: {
		app: [
			'./src/index.tsx'
		]
	},
	output: {
		path: path.join(__dirname, "build"),
		filename: "[name]-[hash].js",
		libraryTarget: 'umd',
		publicPath: '/'
	},
	resolve: {
		extensions: ['.js', '.jsx', '.tsx', '.ts']
	},
	plugins: [
		new CleanPlugin(['build']),
		new ExtractTextPlugin({
			filename: '[contenthash].css',
			allChunks: true
		}),
		new webpack.NoEmitOnErrorsPlugin(),
		new webpack.optimize.OccurrenceOrderPlugin(),
		new webpack.optimize.UglifyJsPlugin(),
		new webpack.DefinePlugin({
			'process.env': {
				// Useful to reduce the size of client-side libraries, e.g. react
				NODE_ENV: JSON.stringify('production')
			}
		}),
		new HtmlWebpackPlugin({
			title: 'mapboundaries demos.tf',
			chunks: ['app']
		})
	],
	module: {
		rules: [
			{test: /\.tsx?$/, use: 'ts-loader'},
			{
				test: /.*\.(gif|png|jpe?g|svg|webp)(\?.+)?$/i,
				use: [
					'url-loader?limit=5000&hash=sha512&digest=hex&name=[hash].[ext]'
				]
			},
			{
				test: /\.css$/,
				use: ExtractTextPlugin.extract({
					fallback: "style-loader",
					use: ['css-loader', 'postcss-loader']
				})
			}
		]
	}
};
