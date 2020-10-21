const fs = require('fs')
const path = require('path')
const multi = require('multi-loader')
const webpack = require('webpack')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')
const TerserWebpackPlugin = require('terser-webpack-plugin')
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin')
const ImageminWebpWebpackPlugin = require('imagemin-webp-webpack-plugin')
const ImageminWebpackPlugin = require('imagemin-webpack-plugin').default
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')

const PATHS = {
	src: path.join(__dirname, '/src'),
	dist: path.join(__dirname, '/public'),
	assets: 'assets/',
}

const PAGES_DIR = PATHS.src

const PAGES = fs
	.readdirSync(PAGES_DIR)
	.filter(fileName => fileName.endsWith('.html'))

const isDev = process.env.NODE_ENV === 'development'
const isProd = !isDev

const optimization = () => {
	const config = {
		splitChunks: {
			chunks: 'all',
			cacheGroups: {
				vendor: {
					name: 'vendors',
					test: /node_modules/,
					chunks: 'all',
					enforce: true,
				},
			},
		},
	}

	if (isProd) {
		config.minimizer = [
			new OptimizeCssAssetsWebpackPlugin(),
			new TerserWebpackPlugin(),
		]
	}

	return config
}

const filename = file =>
	isDev
		? `${PATHS.assets}${file}/[name].[hash:5].${file}`
		: `${PATHS.assets}${file}/[name].${file}`

const cssLoaders = extra => {
	const loaders = [
		'style-loader',
		{
			loader: MiniCssExtractPlugin.loader,
			options: {
				hmr: isDev,
				reloadAll: true,
			},
		},
		'css-loader',
		{
			loader: 'postcss-loader',
			options: { config: { path: `postcss.config.js` } },
		},
		{
			loader: 'group-css-media-queries-loader',
		},
	]

	if (extra) {
		loaders.push(extra)
	}

	return loaders
}

const babelObject = preset => {
	const opts = {
		presets: ['@babel/preset-env'],
		plugins: ['@babel/plugin-proposal-class-properties'],
	}

	if (preset) {
		opts.presets.push(preset)
	}

	return opts
}

const jsLoaders = () => {
	const loaders = [
		{
			loader: 'babel-loader',
			options: babelObject(),
		},
	]

	if (isDev) {
		loaders.push('eslint-loader')
	}

	return loaders
}

const plugins = () => {
	const base = [
		new webpack.ProgressPlugin(),
		new CleanWebpackPlugin({
			dry: true,
		}),
		new CopyWebpackPlugin({
			patterns: [
				{ from: `${PATHS.src}/${PATHS.assets}img`, to: `${PATHS.assets}img` },
				{ from: `${PATHS.src}/static`, to: `` },
			],
		}),
		new MiniCssExtractPlugin({
			filename: filename('css'),
		}),
		new ImageminWebpackPlugin({
			test: /\.(jpe?g|png|gif|svg)$/,
			disable: isProd,
			pngquant: {
				quality: '65',
			},
			gifsicle: {
				quality: '65',
			},
		}),
		...PAGES.map(
			page =>
				new HTMLWebpackPlugin({
					template: `${PAGES_DIR}/${page}`,
					filename: `./${page}`,
					minify: {
						collapseWhitespace: isProd,
					},
				})
		),
		new HardSourceWebpackPlugin(),
	]

	if (isProd) {
		base.push(new BundleAnalyzerPlugin(), new ImageminWebpWebpackPlugin())
	}

	return base
}

module.exports = {
	mode: 'development',
	entry: {
		app: ['@babel/polyfill', `${PATHS.src}/index.js`],
	},
	externals: {
		paths: PATHS,
	},
	output: {
		filename: filename('js'),
		path: PATHS.dist,
		publicPath: '/',
	},
	resolve: {
		extensions: ['.js', '.json', '.xml', '.csv', '.png', '.sass', '.scss'],
		alias: {
			'~': PATHS.src,
		},
	},
	optimization: optimization(),
	devServer: {
		port: 3000,
		hot: isDev,
		inline: true,
		watchContentBase: true,
	},
	devtool: isDev ? 'source-map' : '',
	plugins: plugins(),
	module: {
		rules: [
			{
				test: /\.css$/,
				use: cssLoaders(),
			},
			{
				test: /\.s[ac]ss$/,
				use: cssLoaders('sass-loader'),
			},
			{
				test: /\.(jpe?g|png)$/i,
				loader: multi(
					'file-loader?name=[name].[ext].webp!webp-loader?{quality: 60}',
					'file-loader?name=[name].[ext]'
				),
				options: {
					quality: 70,
				},
			},
			{
				test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
				loader: 'file-loader',
				options: {
					name: '[name].[ext]',
				},
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
				test: /\.js$/,
				exclude: /node_modules/,
				use: jsLoaders(),
			},
		],
	},
}
