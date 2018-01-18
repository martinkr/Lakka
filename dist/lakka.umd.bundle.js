/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
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
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 9);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * @module configuration/main
 * @description
 * This module provides the funcitonality to configure the lakka-cache.
 * @exports get ()
 * @exports set ()
 *
 * @copyright 2017 Martin Krause <github@mkrause.info> (http://martinkr.github.io)
 * @license MIT license: https://opensource.org/licenses/MIT
 *
 * @author Martin Krause <github@mkrause.info>
 */

// imports
// import { getUsefulContents } from 'default.js';
var config = __webpack_require__(11);

var validProperties = ["include", "exclude", "minutes"];

/**
 * Verifies if the arguments passed to ".set()" are valid.
 * @param {Array} args the arguments passed to .set()
 * @return {Boolean}
 */
var _validArguments = function _validArguments(args) {

	// no arguments
	if (args.length === 0) {
		return false;
	}
	// just one argument but not an Object ...
	if (args.length === 1 && args[0] !== Object(args[0])) {
		return false;
	}

	// just one argument which is an object: check if the object contains only valid properties
	if (args.length === 1 && args[0] === Object(args[0])) {
		return Object.keys(args[0]).every(function (element) {
			return validProperties.includes(element);
		});
	}

	// two strings as arguments: we're checking the "minutes" property first
	if (args.length === 2 && args[0] === "minutes") {
		if (
		// should be a number or parsable to a number
		typeof Number(args[1]) === "number" && Number.isNaN(Number(args[1])) === false &&
		// but not an array
		Array.isArray(args[1]) === false
		// but not a boolean
		&& typeof args[1] !== "boolean") {
			return true;
		} else {
			return false;
		}
	}

	// two string arguments: check if the first one refers to a valid property
	if (args.length === 2 && typeof args[0] === "string" && typeof args[1] === "string") {
		return validProperties.includes(args[0]);
	}

	return false;
};

/**
 * Retrives a value for a given key or null
 * @sync
 * @private
 * @memberof configuration/main
 * @param {String} key the key for the sessionStorage item to get
 * @return {Any} the configuration value
 */
var _get = function _get(key) {
	// console.log(">>>>", key, validProperties.includes(key))
	if (!key || typeof key !== "string" || validProperties.includes(key) !== true) {
		throw new Error();
	}
	// console.log("<<<<", key, config[key])
	return config[key];
};

/**
 * Stores a key/value pair
 * @sync
 * @private
 * @memberof configuration/main
 * @param {String|Object} key the key for the value OR the configuration object
 * @param {String} [value] the value to set. Skip if the first argument is a configuraiton object
 * @return {Any} the sessionStorages response
 */
var _set = function _set(key, value) {
	// unique
	var args = [key, value].filter(function (element) {
		return element;
	});

	if (!_validArguments(args)) {
		throw new Error();
	}

	// object insted of a key-value pair: merge into current config
	if (args[0] === Object(args[0])) {
		config = Object.assign(config, args[0]);
		return true;
	}

	if (key === "include" || key === "exclude") {
		// we're storing regexp for performance reasons
		/* istanbul ignore next */
		if (typeof value === "string") {
			value = new RegExp(value);
		}
		// ignore dublicates
		if (config[key].some(function (element) {
			return element.source === value.source;
		})) {
			return true;
		}
		config[key].push(value);
		return true;
	}

	// key-value pair: store
	config[key] = value;

	return true;
};

// API
module.exports = {

	/**
  * Retrives a value for a given key or null
  * @sync
  * @private
  * @memberof configuration/main
  * @param {String} key the key for the sessionStorage item to get
  * @return {Any} the configuration value
  */
	"get": function get(key) {
		return _get(key);
	},

	/**
  * Stores a key/value pair
  * @sync
  * @private
  * @memberof configuration/main
  * @param {String|Object} key the key for the value OR the configuration object
  * @param {String} [value] the value to set. Skip if the first argument is a configuraiton object
  * @return {Any} the sessionStorages response
  */
	"set": function set(key, value) {
		return _set(key, value);
	}

};

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * @module utils/throw-invalid
 * @exports a sync function
 *
 * @description
 * A small utility function that throws an error if the value evalutes to false
 *
 * @copyright 2017 Martin Krause <github@mkrause.info> (http://martinkr.github.io)
 * @license MIT license: https://opensource.org/licenses/MIT
 *
 * @author Martin Krause <github@mkrause.info>
 */

/**
 * A small utility function that throws an error if the value evalutes to false
 * @memberof  * @module utils/throw-invalid
 * @sync
 * @param {Any} value the value to check
 * @return {Any|Error} throws an error if the value evalutes to false
 */
module.exports = function (value) {
  if (!value && value !== 0 || value instanceof Error) {
    throw new Error();
  }
};

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * @module cache/create-key
 * @exports a sync function
 *
 * @description
 * Creates the key for the cache from the uri
 *
 * @copyright 2017 Martin Krause <github@mkrause.info> (http://martinkr.github.io)
 * @license MIT license: https://opensource.org/licenses/MIT
 *
 * @author Martin Krause <github@mkrause.info>
 */

/**
 * Creates the key for the lakka-cache from the URI
 * @sync
 * @memberof cache/create-key
 * @param {String} uri the uri
 * @return {String} the key for this uri
 */
module.exports = function (uri) {
  if (typeof uri !== "string") {
    throw new Error();
  }

  return escape(uri);
};

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * @module cache/valid-cache-control
 * @exports a sync function
 *
 * @description
 * Checks the value of the "Cache-Control" HTTP-Header.
 * Checks if the Cache-Control- HTTP-Header let's us cache this request.
 *
 * Agressive cache:
 * Do not cache if
 * must-revalidate
 *	The cache must verify the status of the stale resources before using it and expired ones should not be used.
 * no-store
 * 	The cache should not store anything about the client request or server response.
 * no-cache
 * 	Forces caches to submit the request to the origin server for validation before releasing a cached copy.
 *
 * OBSOLETE
 * Cache if the value is:
 * only-if-cached (Request)
 * 	Indicates to not retrieve new data. The client only wishes to obtain a cached response, and should not contact the origin-server to see if a newer copy exists.
 * immutable
 *	Indicates that the response body will not change over time.
 * public
 * 	Indicates that the response may be cached by any cache.
 * private
 * 	Indicates that the response is intended for a single user and must not be stored by a shared cache. A private cache may store the response.
 *
 * or no entry at all
 *
 *
 * @copyright 2017 Martin Krause <github@mkrause.info> (http://martinkr.github.io)
 * @license MIT license: https://opensource.org/licenses/MIT
 *
 * @author Martin Krause <github@mkrause.info>
 */

var ignorePattern = [new RegExp("must-revalidate"), new RegExp("no-store"), new RegExp("no-cache")];

/**
 * Takes the content of the "Cache-Control" HTTP-Header
 * as string and checks if we can cache the request.
 * @sync
 * @memberof cache/valid-cache-control
 * @param {String} the "Cache-Control" HTTP-Header's content
 * @return {Boolean} true if it is cacheable, false if not
 */
module.exports = function (content) {
  if (typeof content !== "string" || !content) {
    return true;
  }
  return ignorePattern.map(function (regexp) {
    return regexp.test(content);
  }).every(function (match) {
    return match === false;
  });
};

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * @module cache/calculate-validity
 * @exports a sync function
 *
 * @description
 * Calculates the timestamp until this cache entry is valid
 * Looks at the Cache-Control Header, the Expires header and finally the default value.
 * Returns a timestamp in ms
 *
 * @copyright 2017 Martin Krause <github@mkrause.info> (http://martinkr.github.io)
 * @license MIT license: https://opensource.org/licenses/MIT
 *
 * @author Martin Krause <github@mkrause.info>
 */

/**
 * Calculates the value from the Cache-Control Header.
 * Throws an Error if this is not possible.
 * @sync
 * @memberof cache/calculate-validity
 * @param {String} cacheControlHeaderValue the value of the Cache-Control Header
 * @return {Number|Error} the timestamp until the request should be cached or an Error
 */
var _fromCacheControlHeader = function _fromCacheControlHeader(cacheControlHeaderValue, now) {
	if (!cacheControlHeaderValue || !now) {
		throw new Error();
	}
	var regex = /max-age=([0-9]*)/g;
	var _exec = regex.exec(cacheControlHeaderValue);

	// no max-age given, look at expires and default
	if (!_exec || !_exec[1]) {
		throw new Error();
	}

	// max-age given, is it a number? based on the regexp is has to be ...
	var _maxAge = void 0;
	try {
		_maxAge = Number(_exec[1]);
	} catch (err) {
		/* istanbul ignore next */
		throw new Error();
	}
	// but it could be empty ...
	return Number(now + _maxAge);
};

/**
 * Calculates the value from the Expires Header.
 * Throws an Error if this is not possible.
 * @sync
 * @memberof cache/calculate-validity
 * @param {String} expiresHeaderValue the value of the Expires Header
 * @return {Number|Error} the timestamp until the request should be cached or an Error
 */
var _fromExpiresHeader = function _fromExpiresHeader(expiresHeaderValue) {
	if (!expiresHeaderValue || Number(expiresHeaderValue) <= 0) {
		throw new Error();
	}
	// convert datestring to timestamp
	var _expiresTimestamp = new Date(expiresHeaderValue).getTime();
	// check conversion: needs to be numberic, a number, and bigger than zero
	if (new RegExp("/^[0-9]*$/gm").test(_expiresTimestamp) || isNaN(_expiresTimestamp) || _expiresTimestamp < 0) {
		throw new Error();
	}
	return _expiresTimestamp;
};

/**
 * Calculates the value until this request should be cached.
 * Looks at the Cache-Control Header (max-age), the Expires Header
 * and falls back to the default validity from the config
 * @sync
 * @memberof cache/calculate-validity
 * @param {String} cacheControlHeaderValue the value of the Cache-Control Header
 * @param {String} expiresHeaderValue the value of the Expires Header
 * @param {String} defaultValidity the value of the default validity from the configuration
 * @return {Number|Error} the timestamp until the request should be cached
 */
module.exports = function (cacheControlHeaderValue, expiresHeaderValue, defaultValidity) {
	// return new Date().getTime() + defaultValidity;
	var _now = new Date().getTime();
	// console.log("\n\n\n---\n>>", cacheControlHeader, expiresHeader, defaultValidity)

	// cache-control header
	try {
		return _fromCacheControlHeader(cacheControlHeaderValue, _now);
	} catch (err) {}
	// eslint-disable-line no-empty
	// catch error, nothing to see, move on


	// expires header
	try {
		return _fromExpiresHeader(expiresHeaderValue);
	} catch (err) {}
	// eslint-disable-line no-empty
	// catch error, nothing to see, move on


	// no success - use default value
	return Number(_now + defaultValidity);
};

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * @module cache/valid-content-type
 * @exports a sync function
 *
 * @description
 * Checks if the content-type of the response is valid for LAKKA caching
 *
 * @copyright 2017 Martin Krause <github@mkrause.info> (http://martinkr.github.io)
 * @license MIT license: https://opensource.org/licenses/MIT
 *
 * @author Martin Krause <github@mkrause.info>
 */

/**
 * Checks if the content-type of the response indicates a cachable content
 * @sync
 * @memberof cache/valid-content-type
 * @param {String} element the content of the Content-Type header
 * @return {Boolean} true if cachable
 */
var validPattern = [new RegExp("application/json"), new RegExp("text/x-json"), new RegExp("text/plain"), new RegExp("text/html")];

module.exports = function (content) {
  if (typeof content !== "string" || !content) {
    return false;
  }
  return validPattern.map(function (regexp) {
    return regexp.test(content);
  }).some(function (match) {
    return match === true;
  });
};

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * @module facade/localstorage
 * @exports get()
 * @exports set()
 * @exports del()
 * @exports has()
 * @description
 * The window.localstorage facade
 * This module provides a facade for accessing the internal private cache.
 * In this case: we're using the localStorage
 *
 * @copyright 2017 Martin Krause <github@mkrause.info> (http://martinkr.github.io)
 * @license MIT license: https://opensource.org/licenses/MIT
 *
 * @author Martin Krause <github@mkrause.info>
 */

// imports

/**
 * Entry poing for all API functions.
 * Distributes the call to the appropriate action
 * @snyc
 * @memberof facade/localstorage
 * @param {String} action
 * @param {String} key the key for the localStorage item to manipulate
 * @param {String} [value] the value for setting a value
 * @return {Any} the localStorages response
 */
var _proxy = function _proxy(action, key, value) {
	if (!action || !key) {
		throw new Error();
	}
	try {
		switch (action) {

			case "set":
				if (!value && typeof value !== "string") {
					throw new Error();
				}

				if (typeof value !== "string") {
					value = JSON.stringify(value);
				}
				return window.localStorage.setItem(key, value);
			// return window.localStorage.setItem(key, JSON.stringify(value));

			case "get":
				// return window.localStorage.getItem(key);
				return JSON.parse(window.localStorage.getItem(key));

			case "del":
				return window.localStorage.removeItem(key);

			case "has":
				return Boolean(window.localStorage.getItem(key));

		}
	} catch (err) {
		throw new Error(err);
	}
};

// API
module.exports = {

	/**
  * Retrives a value for a given key or null
  * @snyc
  * @private
  * @memberof facade/localstorage
  * @param {String} key the key for the localStorage item to get
  * @return {Any} the localStorages response, null if there's no item
  */
	"get": function get(key) {
		return _proxy("get", key);
	},

	/**
  * Stores a key/value pair
  * @snyc
  * @private
  * @memberof facade/localstorage
  * @param {String} key the key for the localStorage item to manipulate
  * @param {String} value the value for setting a value
  * @return {Any} the localStorages response
  */
	"set": function set(key, value) {
		return _proxy("set", key, value);
	},

	/**
  * Deletes an item
  * @snyc
  * @private
  * @memberof facade/localstorage
  * @param {String} key the key for the localStorage item to delete
  * @return {Any} the localStorages response
  */
	"del": function del(key) {
		return _proxy("del", key);
	},

	/**
  * Returns a boolean value indicating if there's an entry for this key
  * @snyc
  * @api
  * @memberof facade/localstorage
  * @param {String} key the key for the localStorage item to check
  * @return {Boolean}
  */
	"has": function has(key) {
		return _proxy("has", key);
	}
};

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * @module header/utils/get-value
 * @exports a sync function
 *
 * @description
 * Curried function returning the value or "defaultValue"
 * for the header-property "which" from the "headers" object.
 * Handles the the default value fallback and lowercase properties
 *
 *
 * @copyright 2017 Martin Krause <github@mkrause.info> (http://martinkr.github.io)
 * @license MIT license: https://opensource.org/licenses/MIT
 *
 * @author Martin Krause <github@mkrause.info>
 */

/**
 * Curried function returning the value or "defaultValue"
 * for the header-property "which" from the "headers" object.
 * Handles the the default value fallback and lowercase properties
 * @curried
 * @sync
 * @memberof cache/create-item
 * @param {Object} headers the headers object
 * @returns {String|null}
 */
module.exports = function (headers) {
  return (
    /** @param {String} which the name of the header to look for @return {function} */
    function (which) {
      return (
        /** @param {Any} [defaultValue] the optional default value  @return {function} */
        function (defaultValue) {
          if (!headers && defaultValue) {
            return defaultValue;
          }
          if (!headers && !defaultValue || !which) {
            return null;
          }
          var value = headers[which] || headers[which.toLowerCase()];
          if (value) {
            return value;
          }
          if (!value && defaultValue) {
            return defaultValue;
          }
          return null;
        }
      );
    }
  );
};

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * @module header/utils/checl-value
 * @exports a sync function
 *
 * @description
 * Curried function returning if the value for a "header" property
 * inside the "options.headers" object is valid as decided by "fn"
 *
 *
 * @copyright 2017 Martin Krause <github@mkrause.info> (http://martinkr.github.io)
 * @license MIT license: https://opensource.org/licenses/MIT
 *
 * @author Martin Krause <github@mkrause.info>
 */

var throwIfInvalid = __webpack_require__(1);

/**
* Curried function returning if the value for a "header" property
* inside the "options.headers" object is valid as decided by "fn"
* @curried
* @sync
* @param {Function} fn which function to use for validating
* @return {Boolean|Error} throws an Error if we should ignore this uri, defaults to true even if there's no value
*/
module.exports = function (fn) {
  return (
    /** @param {Object} options the options object, contains a headers object @return {function} */
    function (options) {
      return (
        /** @param {String} header the header to look up @return {function} */
        function (header) {
          if (!fn || typeof fn !== "function") {
            throw new Error();
          }
          if (!options || !options.headers || !header) {
            return true;
          }
          var value = options.headers[header] || options.headers[header.toLowerCase()];
          if (!value) {
            return true;
          }
          throwIfInvalid(fn(value));
          return true;
        }
      );
    }
  );
};

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * @module api/main
 * @exports a sync function "ignore"
 * @exports a sync function "configuration"
 *
 * @exports a sync function "after"
 * @exports a sync function "before"
 *
 * @description
 * Defines the publicly exposed API
 * - ignore:
 * 		Add an ignore pattern to the existing / default configuraiton
 * 		urls matching this pattern will be ignored by the lakka cache and passed throught
 * - configuraiton:
 * 		Add a complete configuration object with "ignore", "exclude", "minutes"
 * - after:
 * 		Call this before the actual request. Checks for and returns a fresh cache item or an error.
 * - before:
 * 		Call this after the actual request. Checks the response and store it at the cache. Retruns the cache item or an error.
 *
 * @copyright 2017 Martin Krause <github@mkrause.info> (http://martinkr.github.io)
 * @license MIT license: https://opensource.org/licenses/MIT
 *
 * @author Martin Krause <github@mkrause.info>
 */

var _after = __webpack_require__(10);
var _before = __webpack_require__(15);
var _configuration = __webpack_require__(0);

// API
module.exports = {

	/**
  * TODO: add a second flag for add/remove
  * Dynamically add an "exclude" pattern to the lakka cache.
  * Any matches for this pattern will be ignored by the lakka cache.
  * @sync
  * @public
  * @memberof api/ignore
  * @param {String} pattern the pattern or regexp to check the uri against. Any matches will be ignored by the lakka cache.
  * @return {Any} the configuration value
  */
	"ignore": function ignore(pattern) {
		return _configuration.set("exclude", pattern);
	},

	/**
  * Dynamically merge a configuration object into the current / default configuraiton object.
  * "include"/"exclude" will be merged, "minutes" will be replaced
  * @sync
  * @public
  * @memberof api/ignore
  * @param {String} pattern the pattern or regexp to check the uri against.
  * Any matches will be ignored by the lakka cache.
  * @return {Any} the configuration value
  */
	"configuration": function configuration(obj) {
		return _configuration.set(obj);
	},

	/**
  * Handles all the caching steps to be done AFTER receiving the request's response
  *
  * check the status code for success or throw.
  * check the "Cache-Control" - header or throw.
  * - Cache if it's "public", "private", "Immutable"
  * - Ignore if "must-revalidate", "no-cache", "no-store", "proxy-revalidate"
 	* check the "Expires", "Cache-Control" - Header to see if the content is not already stale (crazy but ppl might use this to prevent caching :/ ) or throw
 * check the "Content-Type" or throw
 * create and save the cache item
 * return the cache or throw an error
 *
 * @sync
 * @public
 * @memberof api/after
 * @param {String} uri the uri
 * @param {Object} options the options for this request. eg options.headers.Content-Type
 * @return {Object|Error} the cached item or an Error if this url does not have an item which is stil fresh
 */
	"after": function after(uri, responseText, statusCode, options) {
		return _after(uri, responseText, statusCode, options);
	},

	/**
  * Handles all the caching steps to be done BEFORE sending a request:
  *
  * check the include / exclude pattern
  * check the cache-control Header
  * check the accept Header
  * check the contentType Header
  * create the $KEY with escape()
  * check if the localStorage contains a $RESPONSE for $KEY
  * check for a stale cache by looking at the $TIMESTAMP
  * return the cached $RESPONSE for $KEY in appropritate format if it's not stale
  * or throw and make the request because the cache is stale or empty or not used
  *
  * @sync
  * @public
  * @memberof api/before
  * @param {String} uri the uri
  * @param {Object} options the options for this request. eg options.headers.Content-Type
  * @return {Object|Error} the cached item or an Error if this url does not have an item which is stil fresh
  */
	"before": function before(uri, options) {
		return _before(uri, options);
	}

};

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * @module api/after
 * @exports a sync function
 * @returns {String|Object|Error} Stores a cache item at the cache if it's a cacheable, valid response
 *
 * @description
 * Handles all the caching steps to be done AFTER receiving the request's response
 *
 * check the status code for success or throw.
 * check the "Cache-Control" - header or throw.
 * - Cache if it's "public", "private", "Immutable"
 * - Ignore if "must-revalidate", "no-cache", "no-store", "proxy-revalidate"
 * check the "Expires", "Cache-Control" - Header to see if the content is not already stale (crazy but ppl might use this to prevent caching :/ ) or throw
 * check the "Content-Type" or throw
 * create and save the cache item
 * return the cache or throw an error
 *
 * @copyright 2017 Martin Krause <github@mkrause.info> (http://martinkr.github.io)
 * @license MIT license: https://opensource.org/licenses/MIT
 *
 * @author Martin Krause <github@mkrause.info>
 */

var configuration = __webpack_require__(0);
var defaultMinutes = configuration.get("minutes");
var defaultMiliseconds = defaultMinutes * 60000;

var validStatusCode = __webpack_require__(12);
var validCacheControl = __webpack_require__(3);
var calculateValidity = __webpack_require__(4);
var validContentType = __webpack_require__(5);
var cache = __webpack_require__(6);
var createKey = __webpack_require__(2);
var createItem = __webpack_require__(13);
var throwIfInvalid = __webpack_require__(1);
var getHeaderValue = __webpack_require__(7);
var checkHeaderValue = __webpack_require__(8);
var setToCache = __webpack_require__(14);

/**
 * Handles all the caching steps to be done AFTER receiving the request's response
 *
 * check the status code for success or throw.
 * check the "Cache-Control" - header or throw.
 * - Cache if it's "public", "private", "Immutable"
 * - Ignore if "must-revalidate", "no-cache", "no-store", "proxy-revalidate"

 * check the "Expires", "Cache-Control" - Header to see if the content is not already stale (crazy but ppl might use this to prevent caching :/ ) or throw
 * check the "Content-Type" or throw
 * create and save the cache item
 * return the cache or throw an error
 *
 * @param {String} uri the uri
 * @param {Object} options the options for this request. eg options.headers.Content-Type
 * @return {Object|Error} the cached item or an Error if this url does not have an item which is stil fresh
 */
module.exports = function (uri, responseText, statusCode, options) {

  // we're only accepting a String as the first, a String as the second, a Number or String as the third and an Object as the fourth parameter
  if (typeof uri !== "string" || typeof responseText !== "string" || typeof statusCode !== "number" && typeof statusCode !== "string" || (options instanceof Object && options.constructor === Object) === false) {
    throw new Error();
  }

  var _statusCode = String(statusCode);

  try {
    // check if the status code indicates a successful request
    throwIfInvalid(validStatusCode(_statusCode));
    // check if the cache control header let's us cache this request
    checkHeaderValue(validCacheControl)(options)("Cache-Control");
    // check if the content-type is a cachable one
    checkHeaderValue(validContentType)(options)("Content-Type");
    // check if the expires header has a future date or there's no expires header
    throwIfInvalid(calculateValidity("", getHeaderValue(options.headers)("Expires")(null), defaultMiliseconds) >= Date.now());
  } catch (err) {
    throw new Error();
  }

  // write to cache
  var _item = void 0;
  try {
    _item = createItem(uri, responseText, options.headers);
    setToCache(cache)(createKey(uri))(_item);
  } catch (err) {
    // just a safety net
    /* istanbul ignore next */
    throw new Error();
  }

  return _item;
};

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
	"include": [],
	"exclude": [],
	"minutes": 60
};

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * @module header/valid-status-code
 * @exports a sync function
 *
 * @description
 * Checks if the status-code of the response indicates cachable content
 *
 * 200 OK
 * 	Standard response for successful HTTP requests. The actual response will depend on the request method used. In a GET request, the response will contain an entity corresponding to the requested resource. In a POST request, the response will contain an entity describing or containing the result of the action.[8]
 * 203 Non-Authoritative Information (since HTTP/1.1)
 * 	The server is a transforming proxy (e.g. a Web accelerator) that received a 200 OK from its origin, but is returning a modified version of the origin's response.[11][12]
 * 226 IM Used (RFC 3229)
 * 	The server has fulfilled a request for the resource, and the response is a representation of the result of one or more instance-manipulations applied to the current instance.[17]
 *
 * TODO  think about these
 * 301 Moved Permanently
 * 	This and all future requests should be directed to the given URI.[20]
 * 302 Found
 * 303 See Other (since HTTP/1.1)
 * 	The response to the request can be found under another URI using the GET method.
 * 304 Not Modified (RFC 7232)
 * 	Indicates that the resource has not been modified since the version specified by the request headers If-Modified-Since or If-None-Match. In such case, there is no need to retransmit the resource since the client still has a previously-downloaded copy.[25]
 * 308 Permanent Redirect (RFC 7538)
 * 	The request and all future requests should be repeated using another URI. 307 and 308 parallel the behaviors of 302 and 301, but do not allow the HTTP method to change. So, for example, submitting a form to a permanently redirected resource may continue smoothly.[30]
 *
 * @copyright 2017 Martin Krause <github@mkrause.info> (http://martinkr.github.io)
 * @license MIT license: https://opensource.org/licenses/MIT
 *
 * @author Martin Krause <github@mkrause.info>
 */

/**
 * Checks if the status-code of the response indicates a cachable content
 * @memberof header/valid-status-code
 * @sync
 * @param {String} element the content of the Status-Code of the response
 * @return {Boolean} true if cachable
 */
module.exports = function (element) {
  return ["200", "203", "226"].includes(element);
};

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * @module cache/create-item
 * @exports a sync function
 *
 * @description
 *
 * Creates a cache-item with
 *
 * "key": create-key(uri)
 * "until": freshness([default, "cache-control", "expires"])
 * "headers" :
 * 		"X-Status-Code": 200
 * 		"Cache-Control":
 * 		"Expires":
 * 		"Content-Type": application-type
 * 		"Status": "200 from cache"
 * "responseText": string
 *
 * @copyright 2017 Martin Krause <github@mkrause.info> (http://martinkr.github.io)
 * @license MIT license: https://opensource.org/licenses/MIT
 *
 * @author Martin Krause <github@mkrause.info>
 */

var configuration = __webpack_require__(0);
var defaultMinutes = configuration.get("minutes");
var defaultMiliseconds = defaultMinutes * 60000;
var createKey = __webpack_require__(2);
var calculateValidity = __webpack_require__(4);
var getHeaderValue = __webpack_require__(7);

/**
 * Creates the item for the lakka-cache from the URI, responseString and the headers opbject
 * @sync
 * @memberof cache/create-item
 * @param {String} uri the uri
 * @param {String} responseString the response
 * @param {Object} [headers] the optional header object
 * @return {Object} a cache item
 */
module.exports = function (uri, responseString, headers) {
  // we're only accepting strings as the first and second and an optional object as third parameter
  if (typeof uri !== "string" || typeof responseString !== "string" || (headers && headers instanceof Object && headers.constructor === Object) === false) {
    throw new Error();
  }

  var _item = { "headers": {} };
  try {
    _item.key = createKey(uri);
    _item.status = 200;
    _item.statusText = "cache";
    _item.responseText = responseString;
    _item.until = calculateValidity(getHeaderValue(headers)("Cache-Control")(null), getHeaderValue(headers)("Expires")(null), defaultMiliseconds);
    _item.headers["Status"] = _item.status + " " + _item.statusText;
    _item.headers["Content-Type"] = getHeaderValue(headers)("Content-Type")("text/plain");
    _item.headers["Cache-Control"] = getHeaderValue(headers)("Cache-Control")(null);
    _item.headers["Expires"] = getHeaderValue(headers)("Expires")(null);
    // purge
    Object.keys(_item.headers).forEach(function (key) {
      return _item.headers[key] == null && delete _item.headers[key];
    });
  } catch (err) {
    // safety net ...
    /* istanbul ignore next */
    throw new Error();
  }
  return _item;
};

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * @module cache/set-item
 * @exports a sync function
 *
 * @description
 *  A Curried function for setting a specific item from a given cache
 *
 * @copyright 2017 Martin Krause <github@mkrause.info> (http://martinkr.github.io)
 * @license MIT license: https://opensource.org/licenses/MIT
 *
 * @author Martin Krause <github@mkrause.info>
 */

var throwIfInvalid = __webpack_require__(1);

/**
 * Curried function setting the item below "key" at "cache".
 * @curried
 * @sync
 * @api
 * @param {Object} cache the cache to use
 * @return {Object|Error} the cached item or an Error if we should ignore this uri
 */
module.exports = function (cache) {
  return (
    /** @param {String} key the key for the lookup @return {function} */
    function (key) {
      return (
        /** @param {Object} item the item to store @return {Object} */
        function (item) {
          throwIfInvalid(cache.set(key, item));
        }
      );
    }
  );
};

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * @module api/before
 * @exports a sync function
 * @returns {Object|Error} Returns the cached response item or throws an Error if the cache is empy or stale
 *
 * @description
 * Handles all the caching steps to be done BEFORE sending a request:
 *
 * check the include / exclude pattern or throw.
 * check the cache-control Header or throw.
 * check the accept Header or throw.
 * check the contentType Header or throw.
 * create the $KEY with escape()
 * check if the localStorage contains a $RESPONSE for $KEY or throw.
 * check for a stale cache by looking at the $TIMESTAMP or throw.
 * return the cached $RESPONSE for $KEY in appropritate format if it's not stale
 * or throw and make the request because the cache is stale or empty or not used
 *
 * @copyright 2017 Martin Krause <github@mkrause.info> (http://martinkr.github.io)
 * @license MIT license: https://opensource.org/licenses/MIT
 *
 * @author Martin Krause <github@mkrause.info>
 */

var configuration = __webpack_require__(0);
var patternMatch = __webpack_require__(16);
var validCacheControl = __webpack_require__(3);
var validContentType = __webpack_require__(5);
var cache = __webpack_require__(6);
var createKey = __webpack_require__(2);
var checkHeaderValue = __webpack_require__(8);
var getFromCache = __webpack_require__(17);

/**
 * Checks if the given URI is part of the include / exclude pattern or throws an Error.
 * @param {String} uri the uri for the request
 * @return {Boolean|Error} throws an Error if we should ignore this uri
 */
var _checkPatterns = function _checkPatterns(uri) {

  // get everything from the config
  var _include = configuration.get("include");
  var _exclude = configuration.get("exclude");

  // the exclude-pattern takes precedent over the include-pattern
  if (_exclude.length && patternMatch(uri, _exclude)) {
    throw new Error();
  }

  // the include-pattern must be a match if there's an include pattern
  // otherwise the include-pattern is not important
  if (_include.length && patternMatch(uri, _include) === false) {
    throw new Error();
  }

  // no pattern or no failures
  return true;
};

/**
 * Handles all the caching steps to be done BEFORE sending a request:
 *
 * check the include / exclude pattern
 * check the cache-control Header
 * check the accept Header
 * check the contentType Header
 * create the $KEY with escape()
 * check if the localStorage contains a $RESPONSE for $KEY
 * check for a stale cache by looking at the $TIMESTAMP
 * return the cached $RESPONSE for $KEY in appropritate format if it's not stale
 * or throw and make the request because the cache is stale or empty or not used
 *
 * @param {String} uri the uri
 * @param {Object} options the options for this request. eg options.headers.Content-Type
 * @return {Object|Error} the cached item or an Error if this url does not have an item which is stil fresh
 */
module.exports = function (uri, options) {

  // we're only accepting strings as the first and an optional object as second parameter
  if (typeof uri !== "string" || (options && options instanceof Object && options.constructor === Object) === false) {
    throw new Error();
  }
  try {
    // we need to check if the given URI is part of the include / exclude pattern or throw.
    _checkPatterns(uri);
    // check if the cache control header let's us handle this request
    checkHeaderValue(validCacheControl)(options)("Cache-Control");
    // check if the accept header let's us handle this request
    checkHeaderValue(validContentType)(options)("Accept");
    // check if the content-type header  let's us handle this request
    checkHeaderValue(validContentType)(options)("Content-Type");
    // check the cache for cached content which is still fresh
    return getFromCache(cache)(createKey(uri));
  } catch (err) {
    throw new Error();
  }
};

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * @module pattern/match
 * @exports a sync function
 *
 * @description
 * checks if the given uri matches one of the patterns
 *
 * @copyright 2017 Martin Krause <github@mkrause.info> (http://martinkr.github.io)
 * @license MIT license: https://opensource.org/licenses/MIT
 *
 * @author Martin Krause <github@mkrause.info>
 */

/**
 * Checks it the uri is matched the regexp-patterns in the array
 * @param {String} uri the uri
 * @param {Array} patterns an array of regular expressions
 * @return {Boolean} true if there's a match
 */
module.exports = function (uri, patterns) {
  if (typeof uri !== "string" || Array.isArray(patterns) !== true) {
    throw new Error();
  }

  return patterns.map(function (regexp) {
    return regexp.test(uri);
  }).some(function (match) {
    return match === true;
  });
};

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * @module cache/get-item
 * @exports a sync function
 *
 * @description
 *  A Curried function for getting a specific item from a given cache
 *
 * @copyright 2017 Martin Krause <github@mkrause.info> (http://martinkr.github.io)
 * @license MIT license: https://opensource.org/licenses/MIT
 *
 * @author Martin Krause <github@mkrause.info>
 */

var throwIfInvalid = __webpack_require__(1);

/**
 * Curried function returning the item stored below "key" from "cache".
 * @curried
 * @sync
 * @api
 * @param {Object} cache the cache to use
 * @return {Object|Error} the cached item or an Error if we should ignore this uri
 */
module.exports = function (cache) {
  return (
    /** @param {String} key the key for the lookup @return {function} */
    function (key) {
      var item = cache.get(key);
      // is there a fresh item?
      throwIfInvalid(item && item.until >= Date.now());
      return item;
    }
  );
};

/***/ })
/******/ ]);