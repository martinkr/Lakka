/**
 * @module api/main
 * @exports a sync function "ignore"
 * @exports a sync function "configuration"
 *
 * @exports a sync function "after"
 * @exports a sync function "before"
 *
 * @description
 * Defines the publicly exposed API
 * - ignore:
 * 		Add an ignore pattern to the existing / default configuraiton
 * 		urls matching this pattern will be ignored by the lakka cache and passed throught
 * - configuraiton:
 * 		Add a complete configuration object with "ignore", "exclude", "minutes"
 * - after:
 * 		Call this before the actual request. Checks for and returns a fresh cache item or an error.
 * - before:
 * 		Call this after the actual request. Checks the response and store it at the cache. Retruns the cache item or an error.
 *
 * @copyright 2017 Martin Krause <github@mkrause.info> (http://martinkr.github.io)
 * @license MIT license: https://opensource.org/licenses/MIT
 *
 * @author Martin Krause <github@mkrause.info>
 */

const after = require("./../api/after.js");
const before = require("./../api/before.js");
const configuration = require("./../configuration/main.js");

// API
module.exports = {

	/**
	 * TODO: add a second flag for add/remove
	 * Dynamically add an "exclude" pattern to the lakka cache.
	 * Any matches for this pattern will be ignored by the lakka cache.
	 * @sync
	 * @public
	 * @memberof api/ignore
	 * @param {String} pattern the pattern or regexp to check the uri against. Any matches will be ignored by the lakka cache.
	 * @return {Any} the configuration value
	 */
	"ignore": (pattern) => configuration.set("exclude", pattern),

	/**
	 * Dynamically merge a configuration object into the current / default configuraiton object.
	 * "include"/"exclude" will be merged, "minutes" will be replaced
	 * @sync
	 * @public
	 * @memberof api/ignore
	 * @param {String} pattern the pattern or regexp to check the uri against.
	 * Any matches will be ignored by the lakka cache.
	 * @return {Any} the configuration value
	 */
	"configuration": (obj) => configuration.set(obj),


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
	* @sync
	* @public
	* @memberof api/after
	* @param {String} uri the uri
	* @param {Object} options the options for this request. eg options.headers.Content-Type
	* @return {Object|Error} the cached item or an Error if this url does not have an item which is stil fresh
	*/
	"after": (uri, responseText, statusCode, options) => after(uri, responseText, statusCode, options),


	/**
	 * Handles all the caching steps to be done BEFORE sending a request:
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
	 * @sync
	 * @public
	 * @memberof api/before
	 * @param {String} uri the uri
	 * @param {Object} options the options for this request. eg options.headers.Content-Type
	 * @return {Object|Error} the cached item or an Error if this url does not have an item which is stil fresh
	 */
	"before": (uri, options) => before(uri, options)

};
