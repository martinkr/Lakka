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
const main = (headers) =>
	/** @param {String} which the name of the header to look for @return {function} */
	(which) =>
		/** @param {Any} [defaultValue] the optional default value  @return {function} */
		(defaultValue) => {
			if (!headers && defaultValue) { return defaultValue; }
			if (!headers && !defaultValue || !which) { return null; }
			let value = headers[which] || headers[which.toLowerCase()];
			if (value) { return value; }
			if (!value && defaultValue) { return defaultValue; }
			return null;
		};


export default main;
