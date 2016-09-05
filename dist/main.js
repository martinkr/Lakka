"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.length = exports.clear = exports.set = exports.get = undefined;

var _murmurhash3_gc = require("./../node_modules/es6-murmurhash-js/murmurhash3_gc.js");

var hash = _interopRequireWildcard(_murmurhash3_gc);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var window = window || null;

// private vars
/**
 * @module
 *  Lakka is designed as an AJAX / XMLHTTPRequest / fetch-API accelerator.
 *  Lakka focuses exclusively on caching json requests.
 *
 * Copyright (c) 2016 Martin Krause (mkrause.info)
 * Licensed under the MIT licenses.
 *
 * @todo
 * 	use e-tag for validity
 * 	use Expires
 * 	use Cache-Control: max-age
 * 	normalize options object
 * 	API: remove
 *
 * @author Martin Krause public@mkrause.info
 */

var namespace = "lakka:",
    storage = window && window.sessionStorage ? window.sessionStorage : function () {
	// just an in memory mock
	var storage = {};
	return {
		getItem: function getItem(key) {
			return storage[key];
		},
		setItem: function setItem(key, value) {
			storage[key] = value;
		},
		removeItem: function removeItem(key) {
			storage[key] = null;
			delete storage[key];
		},
		clear: function clear() {
			storage = {};
		},
		length: function length() {
			return Object.keys(storage).length;
		}
	};
}(),
    disabled = false,


/**
 * Creates the content object store at the database. Returns a string
 * @param  {Object} value    the content
 * @param  {Number} validity Validity in minutes
 * @return {String}          The stringified content object
 */
_createContent = function _createContent(value, validity) {
	return JSON.stringify({
		content: value,
		validity: Number(validity) * 60 * 1000,
		timestamp: new Date().getTime()
	});
},


/**
 * Checks if the cached content has expired
 * @param  {Number}  timestamp now
 * @param  {Number}  validity  Validity in minutes
 * @return {Boolean}           [description]
 */
_hasExpired = function _hasExpired(timestamp, validity) {
	return new Date().getTime() - Number(timestamp) > Number(validity);
},


/**
 * Creates the key under which the content is stored.
 * It's a hash of the uri
 * @param  {String} key the original key aka the uri
 * @return {String}     the new key used for the database
 */
_createKey = function _createKey(key) {
	return namespace + hash.generate(key);
},


/**
 * Gets the cached data from the stringified content object
 * @param  {String} string stringified content object
 * @return {Object}        the cached content as object or null
 */
_getContent = function _getContent(string) {
	var _cachedItem = null;

	if (string === undefined || string === null) {
		return null;
	}

	try {
		_cachedItem = JSON.parse(string);
	} catch (e) {
		return null;
	}

	return _cachedItem;
},


/**
 * Retrieves an item from the database
 * @param  {String} key the database key aka the hashed uri
 * @return {String}     the stringified content object from the database
 */
_find = function _find(key) {
	return storage.getItem(key);
},


/**
 * Stores an item at the database
 * @param  {String} key the database key aka the hashed uri
 * @param  {String} content the stringified content object
 * @return {void}
 */
_write = function _write(key, content) {
	return storage.setItem(key, content);
},


/**
 * Internal entry for retrieving an item from the database
 * and returning it to the pubic API
 * @param  {String} key the uri which will identify the content
 * @return {Promise}     a Promise which will be resolved with the cached data. Or rejected if no valid entry was found.
 */
_get = function _get(key) {
	return new Promise(function (resolve, reject) {
		var _cachedItem = void 0;

		// no cache at all
		if (disabled) {
			return reject(key);
		}

		try {
			_cachedItem = _getContent(_find(_createKey(key)));
		} catch (e) {
			return reject(key);
		}

		// no cached item
		if (_cachedItem === null) {
			storage.removeItem(_createKey(key));
			return reject(key);
		}

		// expired cache item
		if (_hasExpired(_cachedItem.timestamp, _cachedItem.validity)) {
			storage.removeItem(_createKey(key));
			return reject(key);
		}

		// found an item
		return resolve(_cachedItem.content);
	});
},

/**
 * Internal entry for writing an item to the database
 * and returning it to the pubic API
 * @param  {String} key the uri which will identify the content
 * @param  {String} value the JSON string to store
 * @param  {Object} options additional options
 * @return {Promise}     a Promise which will be resolved or rejected with the cached data.
 */
_set = function _set(key, value, options) {
	var _options = options || { "validity": 0 };
	return new Promise(function (resolve, reject) {

		if (typeof value !== "string") {
			value = JSON.stringify(value);
		}

		if (disabled || _options.validity === 0) {
			return reject(value);
		}

		_write(_createKey(key), _createContent(value, _options.validity));
		return resolve(value);
	});
},


/**
 * Drops the cache
 * @return {Void}
 */
_clear = function _clear() {
	storage.clear();
},


/**
 * Returns the number of item sin the cache
 * @return {Number}        cached items lenght
 */
_length = function _length() {
	return storage.length();
};

/**
 * Public API
 */
exports.get = _get;
exports.set = _set;
exports.clear = _clear;
exports.length = _length;
