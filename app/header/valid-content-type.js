
/**
 * @module cache/valid-content-type
 * @exports a sync function
 *
 * @description
 * Checks if the content-type of the response is valid for LAKKA caching
 *
 * @copyright 2017 Martin Krause <github@mkrause.info> (http://martinkr.github.io)
 * @license MIT license: https://opensource.org/licenses/MIT
 *
 * @author Martin Krause <github@mkrause.info>
 */

/**
 * Checks if the content-type of the response indicates a cachable content
 * @sync
 * @memberof cache/valid-content-type
 * @param {String} element the content of the Content-Type header
 * @return {Boolean} true if cachable
 */
const validPattern = [
	new RegExp("application/json"),
	new RegExp("text/x-json"),
	new RegExp("text/plain"),
	new RegExp("text/html")
];

module.exports = (content) => {
	if (typeof (content) !== "string" || !content) {
		return false;
	}
	return validPattern.map((regexp) => {
		return regexp.test(content);
	})
	.some((match) => {
		return match === true;
	});

};

