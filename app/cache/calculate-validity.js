/**
 * @module cache/calculate-validity
 * @exports a sync function
 *
 * @description
 * Calculates the timestamp until this cache entry is valid
 * Looks at the Cache-Control Header, the Expires header and finally the default value.
 * Returns a timestamp in ms
 *
 * @copyright 2017 Martin Krause <github@mkrause.info> (http://martinkr.github.io)
 * @license MIT license: https://opensource.org/licenses/MIT
 *
 * @author Martin Krause <github@mkrause.info>
 */

/**
 * Calculates the value from the Cache-Control Header.
 * Throws an Error if this is not possible.
 * @sync
 * @memberof cache/calculate-validity
 * @param {String} cacheControlHeaderValue the value of the Cache-Control Header
 * @return {Number|Error} the timestamp until the request should be cached or an Error
 */
const _fromCacheControlHeader = (cacheControlHeaderValue, now) => {
	if (!cacheControlHeaderValue || !now) {
		throw new Error()
	}
	const regex = /max-age=([0-9]*)/g;
	let _exec = regex.exec(cacheControlHeaderValue);

	// no max-age given, look at expires and default
	if (!_exec || !_exec[1]) {
		throw new Error();
	}

	// max-age given, is it a number? based on the regexp is has to be ...
	let _maxAge;
	try {
		_maxAge = Number(_exec[1]);
	} catch (err) {
		/* istanbul ignore next */
		throw new Error();
	}
	// but it could be empty ...
	return Number(now + _maxAge);
};

/**
 * Calculates the value from the Expires Header.
 * Throws an Error if this is not possible.
 * @sync
 * @memberof cache/calculate-validity
 * @param {String} expiresHeaderValue the value of the Expires Header
 * @return {Number|Error} the timestamp until the request should be cached or an Error
 */
const _fromExpiresHeader = (expiresHeaderValue) => {
	if (!expiresHeaderValue || Number(expiresHeaderValue) <= 0) {
		throw new Error();
	}
	// convert datestring to timestamp
	let _expiresTimestamp = new Date(expiresHeaderValue).getTime();
	// check conversion: needs to be numberic, a number, and bigger than zero
	if (new RegExp("/^[0-9]*$/gm").test(_expiresTimestamp) || isNaN(_expiresTimestamp) || _expiresTimestamp < 0) {
		throw new Error();
	}
	return _expiresTimestamp;
};


/**
 * Calculates the value until this request should be cached.
 * Looks at the Cache-Control Header (max-age), the Expires Header
 * and falls back to the default validity from the config
 * @sync
 * @memberof cache/calculate-validity
 * @param {String} cacheControlHeaderValue the value of the Cache-Control Header
 * @param {String} expiresHeaderValue the value of the Expires Header
 * @param {String} defaultValidity the value of the default validity from the configuration
 * @return {Number|Error} the timestamp until the request should be cached
 */
const main = (cacheControlHeaderValue, expiresHeaderValue, defaultValidity) => {
	// return new Date().getTime() + defaultValidity;
	let _now = new Date().getTime();

	// cache-control header
	try {
		return _fromCacheControlHeader(cacheControlHeaderValue, _now)
	} catch (err) {
		// eslint-disable-line no-empty
		// catch error, nothing to see, move on
	}

	// expires header
	try {
		return _fromExpiresHeader(expiresHeaderValue);
	} catch (err) {
		// eslint-disable-line no-empty
		// catch error, nothing to see, move on
	}

	// no success - use default value
	return Number(_now + defaultValidity);
};

export default main;