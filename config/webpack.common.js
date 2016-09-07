/**
 * Webpack default configuration all environment
 * See: http://webpack.github.io/docs/configuration.html
 * @author: Thangadurai Nainamalai<duraithanga3@gmail.com>
 */

const autoprefixer = require('autoprefixer');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const helpers = require('./helpers');
const CreateHtmlElements = require("./create-html-elements");

module.exports = {
  metadata: {
    title: "React Widgets in Redux Architecture"
  },

  resolve: {
    extensions: ['', '.js', '.jsx', '.json'],
    root: helpers.root('app'),
    modulesDirectories: ['node_modules'],
    alias: {
      'materialize-scss': helpers.root('node_modules/materialize-css/sass/materialize.scss')
    }
  },

  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|public)/,
        loader: 'babel'
      },
      {
        test: /\.json$/,
        exclude: /(public)/,
        loader: 'json-loader'
      },
      {
        test: /\.(eot|otf)(\?v=\d+\.\d+\.\d+)?$/,
        exclude: /(public)/,
        loader: "file"
      },
      {
        test: /\.(woff|woff2)$/,
        exclude: /(public)/,
        loader: "url?prefix=font/&limit=5000"
      },
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        exclude: /(public)/,
        loader: "url?limit=10000&mimetype=application/octet-stream"
      },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        exclude: /(public)/,
        loader: "url?limit=10000&mimetype=image/svg+xml"
      },
      {
        test: /\.gif/,
        exclude: /(public)/,
        loader: "url-loader?limit=10000&mimetype=image/gif"
      },
      {
        test: /\.jpg/,
        exclude: /(public)/,
        loader: "url-loader?limit=10000&mimetype=image/jpg"
      },
      {
        test: /\.png/,
        exclude: /(public)/,
        loader: "url-loader?limit=10000&mimetype=image/png"
      }
    ]
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: 'app/index.html',
      chunksSortMode: 'dependency'
    }),

    new CopyWebpackPlugin([{
      from: 'app/assets',
      to: 'assets'
    }]),

    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
      "window.jQuery": "jquery"
    }),
    /*
     * Generate html tags based on javascript maps.
     *
     * If a publicPath is set in the webpack output configuration, it will be automatically added to
     * href attributes, you can disable that by adding a "=href": false property.
     * You can also enable it to other attribute by settings "=attName": true.
     *
     * The configuration supplied is map between a location (key) and an element definition object (value)
     * The location (key) is then exported to the template under then htmlElements property in webpack configuration.
     *
     *  Means we can use it in the template like this:
     *  <%= webpackConfig.htmlElements.headTags %>
     */
    new CreateHtmlElements({
      headTags: require('./head-config.common')
    })
  ],

  postcss: [
    autoprefixer({
      browsers: ['last 2 versions']
    })
  ],

  node: {
    global: 'window',
    crypto: 'empty',
    process: true,
    module: false,
    clearImmediate: false,
    setImmediate: false
  }
};
