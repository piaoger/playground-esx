#!/usr/bin/env node
/* eslint-disable */

// borrowed from yarn and lodash
//  https://github.com/lodash/lodash-webpack-plugin
//  https://github.com/yarnpkg/yarn
//  https://github.com/piaoger/playground-esx
//  https://github.com/caolan/async

// for there is no webpack-stream for webpack 2
// have to use webpack here

const webpack = require('webpack');
const path = require('path');
const util = require('util');
const fs = require('fs');

const pkg = require('../package.json');

const basedir = path.join(__dirname, '../');
const babelRc = JSON.parse(fs.readFileSync(path.join(basedir, '.babelrc'), 'utf8'));

const version = pkg.version;
const name = pkg.name;

const banner = [
        '#!/usr/bin/env node\n',
        '/*\n',
        ' ' + pkg.name + ' v' + pkg.version + '\n',
        ' ' + pkg.description + '\n',
        pkg.author ?   ' ' + pkg.author   + '\n' : '',
        pkg.homepage ? ' ' + pkg.homepage + '\n' : '',
        '*/\n'
    ].join('\n');

//
// Modern build
//

const compiler = webpack({
  // devtool: 'inline-source-map',
  entry: [path.join(basedir, 'src/index.js')],
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
    }, {
      test: /\.json$/,
      loader: 'json-loader',
    }],
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
        compress: {
            hoist_vars: true,
            screw_ie8: true,
            warnings: false
        }
    }),
    new webpack.BannerPlugin(
      banner,
      {
        entryOnly: true,
        raw: true
      }
    )
  ],
  output: {
    filename: `${name}-${version}.js`,
    path: path.join(basedir, 'dist'),
  },
  target: 'node',
});

compiler.run((err, stats) => {
  const {fileDependencies} = stats.compilation;
  const filenames = fileDependencies.map(x => x.replace(basedir, ''));
  console.log(util.inspect(filenames, {maxArrayLength: null}));
});

//
// Legacy build
//

const compilerLegacy = webpack({
  // devtool: 'inline-source-map',
  entry: [path.join(basedir, 'src/index.js')],
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
      query: babelRc.env['pre-node5'],
    }, {
      test: /\.json$/,
      loader: 'json-loader',
    }],
  },
  plugins: [
    new webpack.BannerPlugin(
      banner,
      {
        entryOnly: true,
        raw: true
      }
    )
  ],
  output: {
    filename: `${name}-legacy-${version}.js`,
    path: path.join(basedir, 'dist'),
  },
  target: 'node',
});

compilerLegacy.run((err, stats) => {
  // do nothing, but keep here for debugging...
});