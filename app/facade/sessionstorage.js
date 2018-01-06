/**
 * @module facade/sessionstorage
 * @exports get ()
 * @exports set ()
 * @exports del ()
 * @exports has ()
 * @description
 * The window.sessionstorage facade
 * This module provides a facade for accessing the internal private cache.
 * In this case: we're using the sessionStorage
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
 * @memberof facade/sessionstorage
 * @param {String} action
 * @param {String} key the key for the sessionStorage item to manipulate
 * @param {String} [value] the value for setting a value
 * @return {Any} the sessionStorages response
 */
const _proxy = (action, key, value) => {
	if (!action || !key) {
		throw new Error("Missing arguments");
	}
	try {
		switch (action) {

			case "set":
				if (!value) {
					throw new Error("Missing arguments");
				}
				return window.sessionStorage.setItem(key, value);

			case "get":
				return window.sessionStorage.getItem(key);

			case "del":
				return window.sessionStorage.removeItem(key);

			case "has":
				return  Boolean(window.sessionStorage.getItem(key));

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
	 * @memberof facade/sessionstorage
	 * @param {String} key the key for the sessionStorage item to get
	 * @return {Any} the sessionStorages response, null if there's no item
	 */
	"get": (key) => _proxy("get", key),

	/**
	 * Stores a key/value pair
	 * @snyc
	 * @private
	 * @memberof facade/sessionstorage
	 * @param {String} key the key for the sessionStorage item to manipulate
	 * @param {String} value the value for setting a value
	 * @return {Any} the sessionStorages response
	 */
	"set": (key, value) => _proxy("set", key, value),

	/**
	 * Deletes an item
	 * @snyc
	 * @private
	 * @memberof facade/sessionstorage
	 * @param {String} key the key for the sessionStorage item to delete
	 * @return {Any} the sessionStorages response
	 */
	"del": (key) => _proxy("del", key),

	/**
	 * Returns a boolean value indicating if there's an entry for this key
	 * @snyc
	 * @api
	 * @memberof facade/sessionstorage
	 * @param {String} key the key for the sessionStorage item to check
	 * @return {Boolean}
	 */
	"has": (key) => _proxy("has", key),
};
