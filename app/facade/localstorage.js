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
	let _objLakka;
	if (!action || !key) {
		throw new Error();
	}

	try {
		switch (action) {

			case "set":
				try {
					_objLakka = JSON.parse(window.localStorage.getItem("lakka"));
				} catch (err) {
					// safety net
				}

				if (!_objLakka) {
					_objLakka = {};
				}

				if ((!value && typeof (value) !== "string") && value !== null) {
					throw new Error();
				}

				// if (typeof (value) !== "string") {
				// 	value = JSON.stringify(value);
				// }

				// API: del()
				if (value === null) {
					delete _objLakka[key];
				} else {
					_objLakka[key] = value;
				}

				window.localStorage.setItem("lakka", JSON.stringify(_objLakka));
				return true;


			case "get":
				try {
					_objLakka = JSON.parse(window.localStorage.getItem("lakka"));
				} catch (err) {
					_objLakka = {}
					return null;
				}
				_item = _objLakka[key] || null;
				return _item;

			case "del":
				return _proxy("set", key, null);

			case "flush":
				return window.localStorage.setItem("lakka", JSON.stringify({}));
		}
	} catch (err) {
		throw new Error(err);
	}

}


// API
const api = {

	/**
	 * Retrives a value for a given key or null
	 * @snyc
	 * @private
	 * @memberof facade/localstorage
	 * @param {String} key the key for the localStorage item to get
	 * @return {Any} the localStorages response, null if there's no item
	 */
	"get": (key) => _proxy("get", key),

	/**
	 * Stores a key/value pair
	 * @snyc
	 * @private
	 * @memberof facade/localstorage
	 * @param {String} key the key for the localStorage item to manipulate
	 * @param {String} value the value for setting a value
	 * @return {Any} the localStorages response
	 */
	"set": (key, value) => _proxy("set", key, value),

	/**
	 * Deletes an item
	 * @snyc
	 * @private
	 * @memberof facade/localstorage
	 * @param {String} key the key for the localStorage item to delete
	 * @return {Any} the localStorages response
	 */
	"del": (key) => _proxy("del", key),

	/**
	 * Flushes the complete cache
	 * @snyc
	 * @private
	 * @memberof facade/localstorage
	 * @return {Any} the localStorages response
	 */
	"flush": () => _proxy("flush", "*")

};


export default api;