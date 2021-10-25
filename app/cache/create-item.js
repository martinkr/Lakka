
/**
 * @module cache/create-item
 * @exports a sync function
 *
 * @description
 *
 * Creates a cache-item with
 *
 * "key": create-key(uri)
 * "until": freshness([default, "cache-control", "expires"])
 * "headers" :
 * 		"X-Status-Code": 200
 * 		"Cache-Control":
 * 		"Expires":
 * 		"Content-Type": application-type
 * 		"Status": "200 from cache"
 * "responseText": string
 *
 * @copyright 2017 Martin Krause <github@mkrause.info> (http://martinkr.github.io)
 * @license MIT license: https://opensource.org/licenses/MIT
 *
 * @author Martin Krause <github@mkrause.info>
 */
import configuration from "./../configuration/main";
import createKey from "./../cache/create-key";
import calculateValidity from "./../cache/calculate-validity.js";
import getHeaderValue from "./../header/utils/get-value.js";

const defaultMinutes = configuration.get("minutes");
const defaultMiliseconds = defaultMinutes * 60000;


/**
 * Creates the item for the lakka-cache from the URI, responseString and the headers opbject
 * @sync
 * @memberof cache/create-item
 * @param {String} uri the uri
 * @param {String} responseString the response
 * @param {Object} [headers] the optional header object
 * @return {Object} a cache item
 */
const main = (uri, responseString, headers) => {
	// we're only accepting strings as the first and second and an optional object as third parameter
	if (typeof (uri) !== "string" || typeof (responseString) !== "string" || (headers && headers instanceof Object && headers.constructor === Object) === false) {
		throw new Error();
	}
	let _item = { "headers": {} };
	try {
		_item.key = createKey(uri);
		_item.status = 200;
		_item.statusText = "cache"
		_item.responseText = responseString;
		_item.until = calculateValidity(getHeaderValue(headers)("Cache-Control")(null), getHeaderValue(headers)("Expires")(null), defaultMiliseconds);
		_item.headers["Status"] = `${_item.status} ${_item.statusText}`;
		_item.headers["Content-Type"] = getHeaderValue(headers)("Content-Type")("text/plain");
		_item.headers["Cache-Control"] = getHeaderValue(headers)("Cache-Control")(null);
		_item.headers["Expires"] = getHeaderValue(headers)("Expires")(null);
		// purge
		Object.keys(_item.headers).forEach((key) => (_item.headers[key] == null) && delete _item.headers[key]);
	} catch (err) {
		// safety net ...
		/* istanbul ignore next */
		throw new Error();
	}
	return _item;
};

export default main;
