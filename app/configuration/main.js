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
let config = require('./default.js');

const validProperties = ["include", "exclude","minutes"];

/**
 * Verifies if the arguments passed to ".set()" are valid.
 * @param {Array} args the arguments passed to .set()
 * @return {Boolean}
 */
const _validArguments = (args) => {

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
		return Object.keys(args[0]).every((element) => validProperties.includes(element));
	}

	// two strings as arguments: we're checking the "minutes" property first
	if (args.length === 2 && args[0] === "minutes") {
		if (
			// should be a number or parsable to a number
			(typeof (Number(args[1])) === "number" && Number.isNaN(Number(args[1])) === false)
			// but not an array
			&& (Array.isArray(args[1]) === false)
			// but not a boolean
			&& (typeof (args[1]) !== "boolean")
		) {
			return true;
		} else {
			return false;
		}
	}

	// two string arguments: check if the first one refers to a valid property
	if ( args.length === 2 && typeof(args[0]) === "string" && typeof(args[1]) === "string" ) {
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
const _get =  (key) => {
	if (!key || typeof(key) !== "string" || validProperties.includes(key) !== true) {
		throw new Error();
	}
	return config[key];
}


/**
 * Stores a key/value pair
 * @sync
 * @private
 * @memberof configuration/main
 * @param {String|Object} key the key for the value OR the configuration object
 * @param {String} [value] the value to set. Skip if the first argument is a configuraiton object
 * @return {Any} the sessionStorages response
 */
const _set =  (key, value) => {
	// unique
	let args = [key, value].filter((element) => element );

	if ( !_validArguments(args)) {
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
		if (typeof(value) === "string") {
			value = new RegExp(value);
		}
		// ignore dublicates
		if (config[key].some((element) => element.source === value.source ) ) {
			return true;
		}
		config[key].push(value);
		return true;
	}

	// key-value pair: store
	config[key] = value;

	return true;
}



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
	"get": (key) => _get(key),

	/**
	 * Stores a key/value pair
	 * @sync
	 * @private
	 * @memberof configuration/main
	 * @param {String|Object} key the key for the value OR the configuration object
	 * @param {String} [value] the value to set. Skip if the first argument is a configuraiton object
	 * @return {Any} the sessionStorages response
	 */
	"set": (key, value) => _set(key, value)

};
