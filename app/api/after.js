
/**
 * @module api/after
 * @exports a sync function
 * @returns {String|Object|Error} Stores a cache item at the cache if it's a cacheable, valid response
 *
 * @description
 * Handles all the caching steps to be done AFTER receiving the request's response
 *
 * check the status code for success or throw.
 * check the "Cache-Control" - header or throw.
 * - Cache if it's "public", "private", "Immutable"
 * - Ignore if "must-revalidate", "no-cache", "no-store", "proxy-revalidate"
 * check the "Expires", "Cache-Control" - Header to see if the content is not already stale (crazy but ppl might use this to prevent caching :/ ) or throw
 * check the "Content-Type" or throw
 * create and save the cache item
 * return the cache or throw an error
 *
 * @copyright 2017 Martin Krause <github@mkrause.info> (http://martinkr.github.io)
 * @license MIT license: https://opensource.org/licenses/MIT
 *
 * @author Martin Krause <github@mkrause.info>
 */

const configuration = require("./../configuration/main.js");
const defaultMinutes = configuration.get("minutes");
const defaultMiliseconds = defaultMinutes * 60000;

const validStatusCode = require("./../header/valid-status-code.js");
const validCacheControl = require("./../header/valid-cache-control.js");
const calculateValidity = require("./../cache/calculate-validity.js");
const validContentType = require("./../header/valid-content-type.js");
const cache = require("./../facade/localstorage.js");
const createKey = require("./../cache/create-key.js");
const createItem = require("./../cache/create-item.js");
const throwIfInvalid = require("./../utils/throw-invalid.js");
const getHeaderValue = require("./../header/utils/get-value.js");
const checkHeaderValue = require("./../header/utils/check-value.js");
const setToCache = require("./../cache/set-item.js");
const patternMatch = require("./../pattern-match/main.js");

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
 * Handles all the caching steps to be done AFTER receiving the request's response
 *
 * check the status code for success or throw.
 * check the "Cache-Control" - header or throw.
 * - Cache if it's "public", "private", "Immutable"
 * - Ignore if "must-revalidate", "no-cache", "no-store", "proxy-revalidate"

 * check the "Expires", "Cache-Control" - Header to see if the content is not already stale (crazy but ppl might use this to prevent caching :/ ) or throw
 * check the "Content-Type" or throw
 * create and save the cache item
 * return the cache or throw an error
 *
 * @param {String} uri the uri
 * @param {Object} options the options for this request. eg options.headers.Content-Type
 * @return {Object|Error} the cached item or an Error if this url does not have an item which is stil fresh
 */
module.exports = (uri, responseText, statusCode, options) => {

	// we're only accepting a String as the first, a String as the second, a Number or String as the third and an Object as the fourth parameter
	if (typeof (uri) !== "string" ||
		typeof (responseText) !== "string" ||
		(typeof (statusCode) !== "number" && typeof (statusCode) !== "string") ||
		(options instanceof Object && options.constructor === Object) === false

	) {
		throw new Error();
	}

	const _statusCode = String(statusCode);

	try {
		// we need to check if the given URI is part of the include / exclude pattern or throw.
		_checkPatterns(uri);
		// check if the status code indicates a successful request
		throwIfInvalid(validStatusCode(_statusCode));
		// check if the cache control header let's us cache this request
		checkHeaderValue(validCacheControl)(options)("Cache-Control");
		// check if the content-type is a cachable one
		checkHeaderValue(validContentType)(options)("Content-Type");
		// check if the expires header has a future date or there's no expires header
		throwIfInvalid( calculateValidity("", getHeaderValue(options.headers)("Expires")(null), defaultMiliseconds) >= Date.now() );

	} catch (err) {
		throw new Error();
	}

	// write to cache
	let _item;
	try {
		_item = createItem(uri, responseText, options.headers);
		setToCache(cache)(createKey(uri))( _item );
	} catch (err) {
		// just a safety net
		/* istanbul ignore next */
		throw new Error();
	}

	return _item;

};
