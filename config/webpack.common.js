const PATHS = require('./paths')
const fs = require('fs')

const { CleanWebpackPlugin } = require('clean-webpack-plugin')
// const CopyWebpackPlugin = require('copy-webpack-plugin')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const ImageminWebpWebpackPlugin = require('imagemin-webp-webpack-plugin')

const PAGES_DIR = PATHS.src

const PAGES = fs
	.readdirSync(PAGES_DIR)
	.filter(fileName => fileName.endsWith('.html'))

process.traceDeprecation = true

module.exports = {
	entry: {
		app: ['@babel/polyfill', `${PATHS.src}/index.js`],
	},

	target: 'web',

	output: {
		filename: `js/[name].js`,
		path: PATHS.build,
		publicPath: '/',
		assetModuleFilename: 'img/[name][ext]',
	},

	experiments: {
		asset: true,
	},

	resolve: {
		extensions: [
			'.js',
			'.json',
			'.xml',
			'.csv',
			'.png',
			'.svg',
			'.jpg',
			'.jpeg',
			'.sass',
			'.scss',
		],
		alias: {
			'~': PATHS.src,
		},
	},

	plugins: [
		new CleanWebpackPlugin(),

		// new CopyWebpackPlugin({
		// 	patterns: [
		// 		{
		// 			from: `${PATHS.src}/${PATHS.assets}images`,
		// 			to: `images`,
		// 		},
		// 		{
		// 			from: `${PATHS.src}/${PATHS.assets}fonts`,
		// 			to: `fonts`,
		// 		},
		// 		{
		// 			from: `${PATHS.src}/${PATHS.assets}svg`,
		// 			to: `svg`,
		// 		},
		// 		{ from: `${PATHS.src}/static`, to: '' },
		// 	],
		// }),

		new ImageminWebpWebpackPlugin({
			config: [
				{
					test: /\.(jpe?g|png)/,
					options: {
						quality: 75,
					},
				},
			],
			// detailedLogs: true,
		}),

		...PAGES.map(
			page =>
				new HTMLWebpackPlugin({
					favicon: PATHS.src + '/static/favicon.ico',
					template: `${PAGES_DIR}/${page}`,
					filename: `./${page}`,
				})
		),
	],

	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: [
					{
						loader: 'babel-loader',
						options: {
							presets: ['@babel/preset-env'],
							plugins: ['@babel/plugin-proposal-class-properties'],
						},
					},
					'eslint-loader',
				],
			},
			{
				test: /\.(?:ico|gif|png|jpg|jpeg|webp)$/i,
				type: 'asset/resource',
				use: [
					{
						loader: 'webp-loader',
						options: {
							quality: 70,
						},
					},
				],
			},
			{
				test: /\.xml$/,
				use: ['xml-loader'],
			},
			{
				test: /\.csv$/,
				use: ['csv-loader'],
			},
			{
				test: /\.(woff(2)?|eot|ttf|otf|svg)$/,
				type: 'asset/resource',
				generator: {
					filename: 'fonts/[name][ext]',
				},
			},
			{
				test: /\.svg$/,
				type: 'asset/resource',
				generator: {
					filename: 'svg/[name][ext]',
				},
			},
		],
	},
	optimization: {
		splitChunks: {
			chunks: 'all',
			cacheGroups: {
				vendor: {
					name: 'vendors',
					test: /[\\/]node_modules[\\/]/,
					chunks: 'all',
					enforce: true,
				},
			},
		},
	},
}
