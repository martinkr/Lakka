/**
 * @module facade/localstorage
 * @exports get async()
 * @exports set async()
 * @exports del async()
 * @exports has async()
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
 * @asnyc
 * @memberof facade/localstorage
 * @param {String} action
 * @param {String} key the key for the localStorage item to manipulate
 * @param {String} [value] the value for setting a value
 * @return {Any} the localStorages response
 */
const _proxy = async(action, key, value) => {
	if (!action || !key) {
		throw new Error("Missing arguments");
	}
	try {
		switch (action) {

			case "set":
				if (!value) {
					throw new Error("Missing arguments");
				}
				return window.localStorage.setItem(key, value);

			case "get":
				return window.localStorage.getItem(key);

			case "del":
				return window.localStorage.removeItem(key);

			case "has":
				return  Boolean(window.localStorage.getItem(key));

		}
	} catch (err) {
		throw new Error(err);
	}

}


// API
module.exports = {

	/**
	 * Retrives a value for a given key or null
	 * @asnyc
	 * @private
	 * @memberof facade/localstorage
	 * @param {String} key the key for the localStorage item to get
	 * @return {Any} the localStorages response, null if there's no item
	 */
	"get": async(key) => await _proxy("get", key),

	/**
	 * Stores a key/value pair
	 * @asnyc
	 * @private
	 * @memberof facade/localstorage
	 * @param {String} key the key for the localStorage item to manipulate
	 * @param {String} value the value for setting a value
	 * @return {Any} the localStorages response
	 */
	"set": async(key, value) => await _proxy("set", key, value),

	/**
	 * Deletes an item
	 * @asnyc
	 * @private
	 * @memberof facade/localstorage
	 * @param {String} key the key for the localStorage item to delete
	 * @return {Any} the localStorages response
	 */
	"del": async(key) => await _proxy("del", key),

	/**
	 * Returns a boolean value indicating if there's an entry for this key
	 * @asnyc
	 * @api
	 * @memberof facade/localstorage
	 * @param {String} key the key for the localStorage item to check
	 * @return {Boolean}
	 */
	"has": async(key) => await _proxy("has", key),
};
