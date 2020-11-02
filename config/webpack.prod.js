const paths = require('./paths')
const { merge } = require('webpack-merge')
const common = require('./webpack.common.js')
const path = require('path')

const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const TerserPlugin = require('terser-webpack-plugin')

module.exports = merge(common, {
	mode: 'production',
	devtool: false,
	output: {
		path: paths.build,
		publicPath: './',
		filename: `${paths.assets}js/[name].[contenthash:5].js`,
	},
	plugins: [
		new MiniCssExtractPlugin({
			filename: `${paths.assets}styles/[name].[contenthash:5].css`,
		}),
	],
	module: {
		rules: [
			{
				test: /\.(sa|sc|c)ss$/,
				use: [
					MiniCssExtractPlugin.loader,
					{
						loader: 'css-loader',
						options: {
							importLoaders: 2,
							sourceMap: false,
						},
					},
					'postcss-loader',
					'group-css-media-queries-loader',
					'sass-loader',
				],
			},
		],
	},
	optimization: {
		minimize: true,
		minimizer: [new TerserPlugin()],
		// Once your build outputs multiple chunks, this option will ensure they share the webpack runtime
		// instead of having their own. This also helps with long-term caching, since the chunks will only
		// change when actual code changes, not the webpack runtime.

		// runtimeChunk: {
		// 	name: 'runtime',
		// },
	},
	performance: {
		hints: false,
		maxEntrypointSize: 512000,
		maxAssetSize: 512000,
	},
})
