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

import throwIfInvalid from "./../../utils/throw-invalid";

/**
* Curried function returning if the value for a "header" property
* inside the "options.headers" object is valid as decided by "fn"
* @curried
* @sync
* @param {Function} fn which function to use for validating
* @return {Boolean|Error} throws an Error if we should ignore this uri, defaults to true even if there's no value
*/
const main = (fn) =>
	/** @param {Object} options the options object, contains a headers object @return {function} */
	(options) =>
		/** @param {String} header the header to look up @return {function} */
		(header) => {
			if (!fn || typeof (fn) !== "function") { throw new Error(); }
			if (!options || !options.headers || !header) { return true; }
			let value = options.headers[header] || options.headers[header.toLowerCase()];
			if (!value) { return true; }
			throwIfInvalid(fn(value));
			return true;
		};

export default main;


