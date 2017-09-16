'use strict';

const path = require("path");
const webpack = require("webpack");

const isProduction = process.env.NODE_ENV === "production";
const env = isProduction ? "production" : "development";
const data = require("./package.json");

const OUTPUT_PATH = process.env.OUTPUT_PATH || "./dist";
const VERSION = data && data.version ? data.vesion : "0.0.1";

const DEVPORT = 3000;

let cssLoaders = [{
  loader: "style"
}, {
  loader: "css"
}];

let sassLoaders = cssLoaders.concat([{
  loader: "sass"
}]);

let jsxLoaders = [{
  loader: "babel"
}, {
  loader: "eslint"
}];

let webpackPlugins = [];

if (isProduction) {
  const CleanWebpackPlugin = require("clean-webpack-plugin");

  webpackPlugins = webpackPlugins.concat([
    new CleanWebpackPlugin([
      "css", "fonts", "img", "js", "sourcemap", "chunk", "public"
    ], {
      root: path.resolve(__dirname, OUTPUT_PATH),
      verbose: true,
      dry: false,
      watch: false,
      exclude: []
    })
  ]);
}

const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ScriptExtHtmlWebpackPlugin = require("script-ext-html-webpack-plugin");
const CreateHtmlElements = require("./template/create-html-elements");

webpackPlugins = webpackPlugins.concat([
  new webpack.DefinePlugin({
    "ENV": JSON.stringify(env),
    "process.env": {
      "ENV": JSON.stringify(env),
      "NODE_ENV": JSON.stringify(env),
      "VERSION": JSON.stringify(VERSION)
    }
  }),
  new webpack.ProvidePlugin({
    "_": "lodash",
    "lod": "lodash",
    "fetch": "isomorphic-fetch",
    "moment": "moment",
    "React": "react",
    "ReactDOM": "react-dom",
    "PropTypes": "prop-types"
  }),
  new webpack.optimize.CommonsChunkPlugin({
    name: "module",
    chunks: ["app"],
    minChunks: module => /node_modules/.test(module.resource)
  }),
  new webpack.LoaderOptionsPlugin({
    minimize: isProduction,
    debug: !isProduction,
    options: {
      eslint: {
        configFile: path.resolve(__dirname, "./.eslintrc.json"),
        failOnError: true
      }
    }
  }),
  new CopyWebpackPlugin([{
    from: "icons",
    to: "icons"
  }], {
    copyUnmodified: true
  }),
  new HtmlWebpackPlugin({
    filename: "public/index.html",
    title: "My Stackoverflow App",
    basePath: "/",
    template: path.resolve(__dirname, "./template/html.ejs"),
    chunksSortMode: "dependency"
  }),
  new ScriptExtHtmlWebpackPlugin(),
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
    headTags: require("./template/head-config.common")
  })
]);

if(!isProduction) {
  jsxLoaders = [{
    loader: "react-hot"
  }].concat(jsxLoaders);

  webpackPlugins = webpackPlugins.concat([
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.WatchIgnorePlugin([
      path.resolve(__dirname, "./node_modules")
    ])
  ]);
}

if (isProduction) {
  const ExtractTextPlugin = require("extract-text-webpack-plugin");

  cssLoaders = ExtractTextPlugin.extract({
    fallback: "style",
    use: "css"
  });

  sassLoaders = ExtractTextPlugin.extract({
    fallback: "style",
    use: "css!sass"
  });

  webpackPlugins = webpackPlugins.concat([
    new ExtractTextPlugin({
      filename: `css/[name]_${VERSION}.css`,
      allChunks: true
    }),
    new webpack.optimize.UglifyJsPlugin({
      beautify: false,
      sourceMap: true,
      output: {
        comments: false
      },
      mangle: {
        scew_ie8: true
      },
      compress: {
        screw_ie8: true,
        warnings: false,
        conditionals: true,
        unused: true,
        comparisons: true,
        sequences: true,
        dead_code: true,
        drop_console: true,
        evaluate: true,
        if_return: true,
        join_vars: true,
        negate_iife: false
      }
    })
  ]);
}

const jsonServer = require("json-server");
const router = jsonServer.router("db.json");

module.exports = {
  entry: {
    app: (isProduction ? [] : [
      `webpack-dev-server/client?http://localhost:${DEVPORT}`,
      "webpack/hot/only-dev-server"
    ]).concat([
      "babel-polyfill",
      path.resolve(__dirname, "./src/index")
    ])
  },
  output: {
    path: path.resolve(__dirname, OUTPUT_PATH),
    filename: `js/[name]_${VERSION}.js`,
    publicPath: "../",
    chunkFilename: `chunk/[id]_${VERSION}.js`,
    sourceMapFilename: `sourceMap/[name]_${VERSION}.map`
  },
  module: {
    rules: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      use: jsxLoaders
    }, {
      test: /\.css$/,
      use: cssLoaders
    }, {
      test: /\.sass$/,
      use: sassLoaders
    }, {
      test: /\.(eot|otf|woff|woff2|ttf)(\?v=\d+\.\d+\.\d+)?$/,
      loader: "file?name=fonts/[name].[ext]"
    }, {
      test: /\.(svg|gif|jpg|png)/,
      loader: "file?name=img/[name].[ext]"
    }]
  },
  resolve: {
    modules: [
      "node_modules",
      path.resolve(__dirname, "src")
    ],
    extensions: [".js", ".json", ".jsx", ".css", ".sass"]
  },
  resolveLoader: {
    moduleExtensions: ["-loader"]
  },
  devtool: isProduction ? "source-map" : "cheap-module-source-map",
  stats: true,
  devServer: {
    contentBase: path.resolve(__dirname, OUTPUT_PATH),
    compress: true,
    historyApiFallback: {
      index: "/public/"
    },
    hot: true,
    https: false,
    port: DEVPORT,
    proxy: {},
    headers: {
      "Allow-Control-Allow-Origin": "*"
    },
    setup: function(app) {
      app.use("/api", router);
    },
    stats: true,
    publicPath: "/",
    watchOptions: {
      aggregateTimeout: 1000,
      ignored: /node_modules/,
      poll: true
    }
  },
  plugins: webpackPlugins,
  parallelism: 1,
  profile: true,
  bail: isProduction,
  node: {
    dns: "empty",
    fs: "empty"
  },
  recordsPath: path.resolve(__dirname, "./records.json")
};
