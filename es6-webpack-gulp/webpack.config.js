
var path = require("path");
var webpack = require("webpack");

module.exports = {
    entry: "./www/app.js",
    output: {
        library: 'es6-webpack-gulp',
        filename: 'bundle.js',
        libraryTarget: 'umd'
    },
    module: {
        loaders: [{
          loader: 'babel'
        }]
      }
};