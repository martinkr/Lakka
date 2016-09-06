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
 *
 */


import * as hash from "./../node_modules/es6-murmurhash-js/murmurhash3_gc.js";

let window = window || null

// private vars
const
	namespace = "lakka:",
	storage = (window && window.localStorage) ? window.localStorage : (() => {
		// just an in memory mock
		let storage = {};
		return {
			getItem: (key) => {
				return storage[key];
			},
			setItem: (key, value) => {
				storage[key] = value;
			},
			removeItem: (key) => {
				storage[key] = null;
				delete storage[key];
			},
			clear: () => {
				storage = {};
			},
			length: () => {
				return Object.keys(storage).length;
			}
		}
	})(),
	disabled = false,

	/**
	 * Creates the content object store at the database. Returns a string
	 * @param  {Object} value    the content
	 * @param  {Number} validity Validity in minutes
	 * @return {String}          The stringified content object
	 */
	_createContent = (value, validity) => {
		return JSON.stringify({
			content: value,
			validity: Number(validity) * 60 * 1000,
			timestamp: new Date().getTime()
		})
	},

	/**
	 * Checks if the cached content has expired
	 * @param  {Number}  timestamp now
	 * @param  {Number}  validity  Validity in minutes
	 * @return {Boolean}           [description]
	 */
	_hasExpired = (timestamp, validity) => {
		return new Date().getTime() - Number(timestamp) > Number(validity);
	},

	/**
	 * Creates the key under which the content is stored.
	 * It's a hash of the uri
	 * @param  {String} key the original key aka the uri
	 * @return {String}     the new key used for the database
	 */
	_createKey = (key) => {
		return namespace + hash.generate(key);
	},


	/**
	 * Gets the cached data from the stringified content object
	 * @param  {String} string stringified content object
	 * @return {Object}        the cached content as object or null
	 */
	_getContent = (string) => {
		let _cachedItem = null;

		if (string === undefined || string === null) {
			return null;
		}

		try {
			_cachedItem = JSON.parse(string)
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
	_find = (key) => {
		return storage.getItem(key);
	},


	/**
	 * Stores an item at the database
	 * @param  {String} key the database key aka the hashed uri
	 * @param  {String} content the stringified content object
	 * @return {void}
	 */
	_write = (key, content) => {
		return storage.setItem(key, content);
	},


	/**
	 * Internal entry for retrieving an item from the database
	 * and returning it to the pubic API
	 * @param  {String} key the uri which will identify the content
	 * @return {Promise}     a Promise which will be resolved with the cached data. Or rejected if no valid entry was found.
	 */
	_get = (key) => {
		return new Promise((resolve, reject) => {
			let _cachedItem;

			// no cache at all
			if (disabled) {
				return reject(key);
			}

			try {
				_cachedItem = _getContent(_find(_createKey(key)));
			} catch (e) {
				return reject(key)
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
	_set = (key, value, options) => {
		let _options = (options || { "validity": 0 });
		return new Promise((resolve, reject) => {

			if (typeof value !== "string") {
				value = JSON.stringify(value);
			}

			if (disabled || _options.validity === 0) {
				return reject(value);
			}


			_write(_createKey(key), _createContent(value, _options.validity));
			return resolve(value)
		});
	},

	/**
	 * Drops the cache
	 * @return {Void}
	 */
	_clear = () => {
		storage.clear();
	},

	/**
	 * Returns the number of item sin the cache
	 * @return {Number}        cached items lenght
	 */
	_length = () => {
		return storage.length();
	}

;

/**
 * Public API
 */
export {

	_get as get,

	_set as set,

	_clear as clear,

	_length as length

};
