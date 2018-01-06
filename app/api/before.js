
/**
 * @module api/before
 * @exports a sync function
 * @returns {Object|Error} Returns the cached response item or throws an Error if the cache is empy or stale
 *
 * @description
 * Handles all the caching steps to be done BEFORE sending a request:
 *
 * check the include / exclude pattern or throw.
 * check the cache-control Header or throw.
 * check the accept Header or throw.
 * check the contentType Header or throw.
 * create the $KEY with escape()
 * check if the localStorage contains a $RESPONSE for $KEY or throw.
 * check for a stale cache by looking at the $TIMESTAMP or throw.
 * return the cached $RESPONSE for $KEY in appropritate format if it's not stale
 * or throw and make the request because the cache is stale or empty or not used
 *
 * @copyright 2017 Martin Krause <github@mkrause.info> (http://martinkr.github.io)
 * @license MIT license: https://opensource.org/licenses/MIT
 *
 * @author Martin Krause <github@mkrause.info>
 */

const configuration = require("./../configuration/main.js");
const patternMatch = require("./../pattern-match/main.js");
const validCacheControl = require("./../header/valid-cache-control.js");
const validContentType = require("./../header/valid-content-type.js");
const cache = require("./../facade/localstorage.js");
const createKey = require("./../cache/create-key.js");
const throwIfInvalid = require("./../utils/throw-invalid.js");
const checkHeaderValue = require("./../header/utils/check-value.js");

/**
 * Checks if the given URI is part of the include / exclude pattern or throws an Error.
 * @param {String} uri the uri for the request
 * @return {Boolean|Error} throws an Error if we should ignore this uri
 */
const _checkPatterns = (uri) => {

	// get everything from the config
	const _include = configuration.get("include");
	const _exclude = configuration.get("exclude");

	// the exclude-pattern takes precedent over the include-pattern
	if (_exclude.length && patternMatch(uri, _exclude)) {
		throw new Error();
	}

	// the include-pattern must be a match if there's an include pattern
	// otherwise the include-pattern is not important
	if (_include.length && patternMatch(uri, _include) === false) {
		throw new Error();
	}

	// no pattern or no failures
	return true;
};

/**
 * Curried function returning the item stored below "key" from "cache".
 * @curried
 * @sync
 * @param {Object} cache the cache to use
 * @return {Object|Error} the cached item or an Error if we should ignore this uri
 */
const _getItemFromCache = (cache) =>
	/** @param {String} key the key for the lookup @return {function} */
	(key) => {
		const item = cache.get(key);
		// is there a fresh item?
		throwIfInvalid(item && item.until >= Date.now());
		return item;
};

/**
 *  * Handles all the caching steps to be done BEFORE sending a request:
 *
 * check the include / exclude pattern
 * check the cache-control Header
 * check the accept Header
 * check the contentType Header
 * create the $KEY with escape()
 * check if the localStorage contains a $RESPONSE for $KEY
 * check for a stale cache by looking at the $TIMESTAMP
 * return the cached $RESPONSE for $KEY in appropritate format if it's not stale
 * or throw and make the request because the cache is stale or empty or not used
 *
 * @param {String} uri the uri
 * @param {Object} options the options for this request. eg options.headers.Content-Type
 * @return {Object|Error} the cached item or an Error if this url does not have an item which is stil fresh
 */
module.exports = (uri, options) => {

	// we're only accepting strings as the first and an optional object as second parameter
	if (typeof (uri) !== "string" || (options && options instanceof Object && options.constructor === Object ) === false ) {
		throw new Error();
	}
	try {
		// we need to check if the given URI is part of the include / exclude pattern or throw.
		_checkPatterns(uri);
		// check if the cache control header let's us handle this request
		checkHeaderValue(validCacheControl)(options)("Cache-Control");
		// check if the accept header let's us handle this request
		checkHeaderValue(validContentType)(options)("Accept");
		// check if the content-type header  let's us handle this request
		checkHeaderValue(validContentType)(options)("Content-Type");
		// check the cache for cached content which is still fresh
		return _getItemFromCache(cache)(createKey(uri));

	} catch (err) {
		throw new Error();
	}

};
