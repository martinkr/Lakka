
/**
 * @module cache/create-key
 * @exports a sync function
 *
 * @description
 * Creates the key for the cache from the uri
 *
 * @copyright 2017 Martin Krause <github@mkrause.info> (http://martinkr.github.io)
 * @license MIT license: https://opensource.org/licenses/MIT
 *
 * @author Martin Krause <github@mkrause.info>
 */

/**
 * Creates the key for the lakka-cache from the URI
 * @sync
 * @memberof cache/create-key
 * @param {String} uri the uri
 * @return {String} the key for this uri
 */
module.exports = (uri) => {
	if ( typeof(uri) !== "string" ) {
		throw new Error();
	}

	return escape(uri);
};
