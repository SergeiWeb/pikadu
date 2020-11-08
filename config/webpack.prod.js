const paths = require('./paths')
const { merge } = require('webpack-merge')
const common = require('./webpack.common.js')

const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
	.BundleAnalyzerPlugin

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
		new BundleAnalyzerPlugin(),
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
		minimizer: [new OptimizeCssAssetsPlugin(), new TerserPlugin()],
	},
	performance: {
		hints: false,
		maxEntrypointSize: 512000,
		maxAssetSize: 512000,
	},
})
