
/**
 * @module header/valid-status-code
 * @exports a sync function
 *
 * @description
 * Checks if the status-code of the response indicates cachable content
 *
 * 200 OK
 * 	Standard response for successful HTTP requests. The actual response will depend on the request method used. In a GET request, the response will contain an entity corresponding to the requested resource. In a POST request, the response will contain an entity describing or containing the result of the action.[8]
 * 203 Non-Authoritative Information (since HTTP/1.1)
 * 	The server is a transforming proxy (e.g. a Web accelerator) that received a 200 OK from its origin, but is returning a modified version of the origin's response.[11][12]
 * 226 IM Used (RFC 3229)
 * 	The server has fulfilled a request for the resource, and the response is a representation of the result of one or more instance-manipulations applied to the current instance.[17]
 *
 * TODO  think about these
 * 301 Moved Permanently
 * 	This and all future requests should be directed to the given URI.[20]
 * 302 Found
 * 303 See Other (since HTTP/1.1)
 * 	The response to the request can be found under another URI using the GET method.
 * 304 Not Modified (RFC 7232)
 * 	Indicates that the resource has not been modified since the version specified by the request headers If-Modified-Since or If-None-Match. In such case, there is no need to retransmit the resource since the client still has a previously-downloaded copy.[25]
 * 308 Permanent Redirect (RFC 7538)
 * 	The request and all future requests should be repeated using another URI. 307 and 308 parallel the behaviors of 302 and 301, but do not allow the HTTP method to change. So, for example, submitting a form to a permanently redirected resource may continue smoothly.[30]
 *
 * @copyright 2017 Martin Krause <github@mkrause.info> (http://martinkr.github.io)
 * @license MIT license: https://opensource.org/licenses/MIT
 *
 * @author Martin Krause <github@mkrause.info>
 */

/**
 * Checks if the status-code of the response indicates a cachable content
 * @memberof header/valid-status-code
 * @sync
 * @param {String} element the content of the Status-Code of the response
 * @return {Boolean} true if cachable
 */
module.exports = (element) => ["200", "203", "226"] .includes(element);

