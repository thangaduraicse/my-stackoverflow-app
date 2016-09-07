/**
 * Webpack configuration for production
 * See: http://webpack.github.io/docs/configuration.html
 * @author: Thangadurai Nainamalai<duraithanga3@gmail.com>
 */

const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const commonConfig = require('./webpack.common.js');
const helpers = require('./helpers');

const METADATA = webpackMerge(commonConfig.metadata, {
  host: process.env.HOST || 'localhost',
  port: process.env.PORT || 8080,
  ENV: process.env.ENV = process.env.NODE_ENV = 'production'
});

module.exports = webpackMerge(commonConfig, {
  metadata: METADATA,

  debug: false,

  devtool: 'source-map',

  entry: [
    './app/app.jsx'
  ],

  output: {
    path: helpers.root("public"),
    filename: '[chunkhash].js'
  },

  module: {
    loaders: [
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract('style', 'css!postcss!sass')
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('style', 'css!postcss')
      }
    ]
  },

  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),

    new webpack.NoErrorsPlugin(),

    new webpack.optimize.UglifyJsPlugin({
      beautify: false,
      mangle: { screw_ie8 : true, keep_fnames: true },
      compress: {
        warnings: false,
        screw_ie8: true,
        drop_console: true,
        drop_debugger: true
      },
      comments: false
    }),

    new webpack.DefinePlugin({
      'ENV': JSON.stringify(METADATA.ENV),
      'process.env': {
        'ENV': JSON.stringify(METADATA.ENV),
        'NODE_ENV': JSON.stringify(METADATA.ENV)
      }
    }),

    new ExtractTextPlugin('[contenthash].css', {
      allChunks: true
    })
  ],

  node: {
    process: false
  }
});
