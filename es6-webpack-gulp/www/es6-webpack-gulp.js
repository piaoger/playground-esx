/*

 es6-webpack-gulp v1.0.0

 A es6, webpack, gulp, babel and flow environment to build next generation JavaScript applications.

 Piaoger Gong <piaoger@gmail.com>


*/

(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["es6-webpack-gulp"] = factory();
	else
		root["es6-webpack-gulp"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	
	'use strict';
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _es6 = __webpack_require__(1);
	
	var _es62 = _interopRequireDefault(_es6);
	
	var commonjs = __webpack_require__(2);
	
	__webpack_require__(3);
	
	alert('I support ' + _es62['default'] + ', ' + commonjs.desc);

/***/ },
/* 1 */
/***/ function(module, exports) {

	
	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	exports['default'] = 'es6 module';
	module.exports = exports['default'];

/***/ },
/* 2 */
/***/ function(module, exports) {

	
	'use strict';
	
	var desc = function desc() {
	    return 'commonjs module';
	};
	
	module.exports.desc = desc();

/***/ },
/* 3 */
/***/ function(module, exports) {

	
	'use strict';
	
	// From: http://www.crmarsh.com/flow/
	
	function foo(x, y) {
	    return x.length * y;
	}
	
	foo("Hello", 6);
	
	/**
	@param {number} x
	@return {number}
	*/
	function square(x) {
	    return x * x;
	}
	square('ddd');
	
	var kv = {
	    'hello': 0,
	    'world': 1
	};
	
	kv.goodbye = 2;
	kv.seeya = 'bump';

/***/ }
/******/ ])
});
;
//# sourceMappingURL=es6-webpack-gulp.js.map