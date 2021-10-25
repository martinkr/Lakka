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
 * 		Adds an ignore pattern (a string / RegEx) to the existing / default configuration
 * 		urls matching this pattern will be ignored by the lakka cache and passed throught
 * - recognize:
 * 		Adds an include pattern (a string / RegEx) to the existing / default configuration
 * 		urls matching this pattern will be recognized by the lakka cache and passed throught
 * 		ig this is empty, all URIs will be recognized
 * - time:
 * 		Sets the minutes (Number) we should cache items for. Defaut value is 60 minutes.
 * 		Will be overwritten by the "max-age" - value of the Cache-Control Header or the Expires Header
 * 		of the response.
 * - configuration:
 * 		Adds a complete configuration object with "ignore", "exclude", "minutes"
 * - after:
 * 		Call this after the actual request. Checks the response and store it at the cache. Returns the cache item or an error.
 * - before:
 * 		Call this before the actual request. Checks for and returns a fresh cache item or an error.
 *
 * @copyright 2017 Martin Krause <github@mkrause.info> (http://martinkr.github.io)
 * @license MIT license: https://opensource.org/licenses/MIT
 *
 * @author Martin Krause <github@mkrause.info>
 */

import after from "./../api/after";
import before from "./../api/before";
import cacheFacade from "./../facade/localstorage";
import configuration from "./../configuration/main";

// API
const api = {

	/**
	 * Sets the minutes (Number) we should cache items for. Defaut value is 60 minutes.
	 * Will be overwritten by the "max-age" - value of the Cache-Control Header or the Expires Header
	 * of the response.
	 * @sync
	 * @public
	 * @memberof api/time
	 * @param {Number} value the default caching time
	 * @return {Any} the configuration value
	 */
	"time": (value) => configuration.set("minutes", value),

	/**
	 * Dynamically add an "exclude" pattern to the lakka cache.
	 * Any matches for this pattern will be ignored by the lakka cache.
	 * @sync
	 * @public
	 * @memberof api/ignore
	 * @param {String|Regex} pattern the pattern or regexp to check the uri against. Any matches will be ignored by the lakka cache.
	 * @return {Any} the configuration value
	 */
	"ignore": (pattern) => configuration.set("exclude", pattern),

	/**
	 * Dynamically add an "include" pattern to the lakka cache.
	 * Any matches for this pattern will be ignored by the lakka cache.
	 * @sync
	 * @public
	 * @memberof api/recognize
	 * @param {String|Regex} pattern the pattern or regexp to check the uri against. Any matches will be recognized and handled by the lakka cache.
	 * @return {Any} the configuration value
	 */
	"recognize": (pattern) => configuration.set("include", pattern),

	/**
	 * Dynamically merge a configuration object into the current / default configuraiton object.
	 * "include"/"exclude" will be merged, "minutes" will be replaced
	 * @sync
	 * @public
	 * @memberof api/configuration
	 * @param {Object} obj a configuration object
	 * @return {Any} the configuration value
	 */
	"configuration": (obj) => configuration.set(obj),

	/**
	 * Force clear an item from the cache.
	 * @sync
	 * @public
	 * @memberof api/remove
	 * @param {String} uri the uri to remove
	 * @return {Any} the configuration value
	 */
	"remove": (uri) => cacheFacade.del(uri),


	/**
	 * Flush the lakka cache. Remove all items
	 * @sync
	 * @public
	 * @memberof api/configuration
	 * @return {Any} the configuration value
	 */
	"flush": () => cacheFacade.flush(),


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


export default api;