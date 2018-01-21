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
const _proxy = (action, key, value) => {
	let _item;
	if (!action || !key) {
		throw new Error();
	}
	try {
		switch (action) {

			case "set":

				if (!value && typeof(value) !== "string") {
					throw new Error();
				}

				if (typeof (value) !== "string") {
					value = JSON.stringify(value);
				}
				return window.localStorage.setItem(key, value);
				// return window.localStorage.setItem(key, JSON.stringify(value));

			case "get":
				_item = window.localStorage.getItem(key);
				// some kind of safety net...
				/* istanbul ignore next */
				if (typeof (_item) === "string") {
					_item = JSON.parse(_item);
				}
				return _item;

			case "flush":
				return window.localStorage.clear();

			case "del":
				return window.localStorage.removeItem(key);

			case "has":
				return Boolean(window.localStorage.getItem(key));

		}
	} catch (err) {
		throw new Error(err);
	}

}


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
	"get":(key) => _proxy("get", key),

	/**
	 * Stores a key/value pair
	 * @snyc
	 * @private
	 * @memberof facade/localstorage
	 * @param {String} key the key for the localStorage item to manipulate
	 * @param {String} value the value for setting a value
	 * @return {Any} the localStorages response
	 */
	"set":(key, value) => _proxy("set", key, value),

	/**
	 * Deletes an item
	 * @snyc
	 * @private
	 * @memberof facade/localstorage
	 * @param {String} key the key for the localStorage item to delete
	 * @return {Any} the localStorages response
	 */
	"del":(key) => _proxy("del", key),

	/**
	 * Flushes the complete cache
	 * @snyc
	 * @private
	 * @memberof facade/localstorage
	 * @return {Any} the localStorages response
	 */
	"flush": () => _proxy("flush", "*"),

	/**
	 * Returns a boolean value indicating if there's an entry for this key
	 * @snyc
	 * @api
	 * @memberof facade/localstorage
	 * @param {String} key the key for the localStorage item to check
	 * @return {Boolean}
	 */
	"has":(key) => _proxy("has", key),
};
