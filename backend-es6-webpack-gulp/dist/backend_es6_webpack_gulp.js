/*

 backend_es6_webpack_gulp v1.0.0

 A es6, webpack, gulp, babel and flow environment to build next generation JavaScript applications.

 Piaoger Gong <piaoger@gmail.com>


*/

(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("http"), require("request"));
	else if(typeof define === 'function' && define.amd)
		define(["http", "request"], factory);
	else if(typeof exports === 'object')
		exports["backend_es6_webpack_gulp"] = factory(require("http"), require("request"));
	else
		root["backend_es6_webpack_gulp"] = factory(root["http"], root["request"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_5__, __WEBPACK_EXTERNAL_MODULE_6__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	
	'use strict';

	var _es = __webpack_require__(2);

	var _es2 = _interopRequireDefault(_es);

	function _interopRequireDefault(obj) {
	  return obj && obj.__esModule ? obj : { default: obj };
	}

	var commonjs = __webpack_require__(3);

	var Utils = __webpack_require__(4);

	var config = __webpack_require__(7);

	console.log('I support ' + _es2.default + ', ' + commonjs.desc);

	console.log('conf = ', config.debug);

/***/ },
/* 2 */
/***/ function(module, exports) {

	
	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = 'es6 module';

/***/ },
/* 3 */
/***/ function(module, exports) {

	
	'use strict';

	var desc = function desc() {
	    return 'commonjs module';
	};

	module.exports.desc = desc();

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var http = __webpack_require__(5),
	    request = __webpack_require__(6);

	function postJsonData(url, body, callback) {
	    request.put({
	        url: url,
	        headers: { 'content-type': "application/json" },
	        body: JSON.stringify(body)
	    }, function (error, response, body) {
	        console.log(response);
	        if (callback) callback();
	    });
	}

	function download(endpoint, callback) {
	    http.get(endpoint, function (res) {
	        var body = '';
	        res.on('data', function (chuck) {
	            body += chuck;
	        });
	        res.on('end', function () {
	            if (callback) callback(undefined, body);
	        });
	    }).on('error', function (err) {
	        if (callback) callback(err, '');
	    });
	}

	exports.postJsonData = postJsonData;
	exports.download = download;

/***/ },
/* 5 */
/***/ function(module, exports) {

	module.exports = require("http");

/***/ },
/* 6 */
/***/ function(module, exports) {

	module.exports = require("request");

/***/ },
/* 7 */
/***/ function(module, exports) {

	module.exports = {
		"debug": "off"
	};

/***/ }
/******/ ])
});
;