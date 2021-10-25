/**
 * @module cache/valid-cache-control
 * @exports a sync function
 *
 * @description
 * Checks the value of the "Cache-Control" HTTP-Header.
 * Checks if the Cache-Control- HTTP-Header let's us cache this request.
 *
 * Agressive cache:
 * Do not cache if
 * must-revalidate
 *	The cache must verify the status of the stale resources before using it and expired ones should not be used.
 * no-store
 * 	The cache should not store anything about the client request or server response.
 * no-cache
 * 	Forces caches to submit the request to the origin server for validation before releasing a cached copy.
 *
 * OBSOLETE
 * Cache if the value is:
 * only-if-cached (Request)
 * 	Indicates to not retrieve new data. The client only wishes to obtain a cached response, and should not contact the origin-server to see if a newer copy exists.
 * immutable
 *	Indicates that the response body will not change over time.
 * public
 * 	Indicates that the response may be cached by any cache.
 * private
 * 	Indicates that the response is intended for a single user and must not be stored by a shared cache. A private cache may store the response.
 *
 * or no entry at all
 *
 *
 * @copyright 2017 Martin Krause <github@mkrause.info> (http://martinkr.github.io)
 * @license MIT license: https://opensource.org/licenses/MIT
 *
 * @author Martin Krause <github@mkrause.info>
 */

const ignorePattern = [
	new RegExp("must-revalidate"),
	new RegExp("no-store"),
	new RegExp("no-cache")
];

/**
 * Takes the content of the "Cache-Control" HTTP-Header
 * as string and checks if we can cache the request.
 * @sync
 * @memberof cache/valid-cache-control
 * @param {String} the "Cache-Control" HTTP-Header's content
 * @return {Boolean} true if it is cacheable, false if not
 */
const main = (content) => {
	if (typeof (content) !== "string" || !content) {
		return true;
	}
	return ignorePattern.map((regexp) => {
		return regexp.test(content);
	}).every((match) => {
		return match === false;
	});

};

export default main;