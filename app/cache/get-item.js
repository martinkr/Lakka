
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

const throwIfInvalid = require("./../utils/throw-invalid.js");

/**
 * Curried function returning the item stored below "key" from "cache".
 * @curried
 * @sync
 * @api
 * @param {Object} cache the cache to use
 * @return {Object|Error} the cached item or an Error if we should ignore this uri
 */
module.exports = (cache) =>
	/** @param {String} key the key for the lookup @return {function} */
	(key) => {
		const item = cache.get(key);
		// is there a fresh item?
		throwIfInvalid(item && item.until >= Date.now());
		return item;
};

