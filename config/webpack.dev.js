/**
 * Webpack configuration for development
 * See: http://webpack.github.io/docs/configuration.html
 * @author: Thangadurai Nainamalai<duraithanga3@gmail.com>
 */

const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const commonConfig = require('./webpack.common.js');
const helpers = require('./helpers');

const METADATA = webpackMerge(commonConfig.metadata, {
  host: process.env.HOST || 'localhost',
  port: process.env.PORT || 3000,
  ENV: process.env.ENV = process.env.NODE_ENV = 'development'
});

module.exports = webpackMerge(commonConfig, {
  metadata: METADATA,

  debug: true,

  entry: [
    `webpack-dev-server/client?http://${METADATA.host}:${METADATA.port}`,
    `webpack/hot/only-dev-server`,
    `./app/app.jsx`
  ],

  devtool: 'cheap-module-eval-source-map',

  output: {
    path: helpers.root("public"),
    filename: 'bundle.js'
  },

  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|public)/,
        loaders: ['react-hot']
      },
      {
        test: /\.scss$/,
        loaders: ['style', 'css', 'postcss', 'sass']
      },
      {
        test: /\.css$/,
        loaders: ['style', 'css', 'postcss']
      }
    ]
  },

  plugins: [
    new webpack.NoErrorsPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      'ENV': JSON.stringify(METADATA.ENV),
      'process.env': {
        'ENV': JSON.stringify(METADATA.ENV),
        'NODE_ENV': JSON.stringify(METADATA.ENV)
      }
    })
  ],

  devServer: {
    contentBase: helpers.root("public"),
    noInfo: true,
    hot: true,
    inline: true,
    historyApiFallback: true,
    port: METADATA.port,
    host: METADATA.host,
    watchOptions: {
      aggregateTimeout: 300,
      poll: 1000
    }
  }
});
