
/**
 * @module cache/check-freshness
 * @exports a sync function
 *
 * @description
 *  Checks if a cache item is still fresh
 *
 * @copyright 2017 Martin Krause <github@mkrause.info> (http://martinkr.github.io)
 * @license MIT license: https://opensource.org/licenses/MIT
 *
 * @author Martin Krause <github@mkrause.info>
 */


/**
 * Checks if a cache item is still fresh
 * @sync
 * @api
 * @param {Object} cacheItem che cache item
 * @return {Boolean} true if still fresh
 */
module.exports = (cacheItem) => !!(cacheItem && cacheItem.until && cacheItem.until >= Date.now());
