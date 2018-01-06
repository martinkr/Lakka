
/**
 * @module pattern/match
 * @exports a sync function
 *
 * @description
 * checks if the given uri matches one of the patterns
 *
 * @copyright 2017 Martin Krause <github@mkrause.info> (http://martinkr.github.io)
 * @license MIT license: https://opensource.org/licenses/MIT
 *
 * @author Martin Krause <github@mkrause.info>
 */

/**
 * Checks it the uri is matched the regexp-patterns in the array
 * @param {String} uri the uri
 * @param {Array} patterns an array of regular expressions
 * @return {Boolean} true if there's a match
 */
module.exports = (uri, patterns) => {
	if ( typeof(uri) !== "string" || Array.isArray(patterns) !== true ) {
		throw new Error();
	}

	return patterns
		.map((regexp) => {
			return regexp.test(uri);
		})
		.some((match) => {
			return match === true;
		});

};
