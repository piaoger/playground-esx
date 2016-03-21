
'use strict';

var _es = require('./es6');

var _es2 = _interopRequireDefault(_es);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var commonjs = require('./commonjs');

var Utils = require('./utils.js');

var config = require('./config.json');

console.log('I support ' + _es2.default + ', ' + commonjs.desc);

console.log('conf = ', config.debug);