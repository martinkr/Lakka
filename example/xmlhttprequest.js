/**
 * This function makes the XHR-call
 * if there's no item in the lakka-cache and
 * stores the received data afterwards.
 * It's a basic example how to integrate lakka
 * into your scripts using the XMLHttpRequest-Object.
 * Assumes you already included "../dist/lakka.js"
 * so window.lakka is available.
 * @param {String} The URI to call
 * @param {Function} A traditional oncomplete-callback
 */
var lakkaXHR = function (uri, callback) {
	var _httpRequest;
	var _response;
	// get the cached content from lakka
	try {
		// yay! content from the cache
		_response = window.lakka.before(uri, {});
		// pass it to the callback
		return callback(_response);
	} catch (err) {
		// lakka throws an error if it can not return a fresh cache item
		// don't worry, just proceed to the request
	}

	// create the XHR-object
	try {
		_httpRequest = new XMLHttpRequest();
	} catch (err) {
		console.error("Error: failed on creating the XMLHttpRequest-object :(. ");
		return false;
	}

	// set up the request
	_httpRequest.onreadystatechange = function () {
		var _statusCode, _responseText, _options, _cacheItem;

		// look, when the request is done
		if (_httpRequest.readyState === XMLHttpRequest.DONE) {
			// collect all data for lakka
			_statusCode = _httpRequest.status;
			_responseText = _httpRequest.responseText;
			_options = {
				"headers": {
					"Cache-Control": _httpRequest.getResponseHeader("Cache-Control"),
					"Content-Type": _httpRequest.getResponseHeader("Content-Type"),
					"Expires": _httpRequest.getResponseHeader("Expires")
				}
			}
			try {
				// yay! the content from the remote location is stored it in the cache
				_cacheItem = window.lakka.after(uri, _responseText, _statusCode, _options);
				_cacheItem.statusText = "remote";
			} catch (err) {
				// oh :( it's not cachable
				// create an object mimicing the lakka cache item
				// include the original response object
				_cacheItem = {
					"httpRequest": _httpRequest,
					"status": _httpRequest.status,
					"responseText": _httpRequest.responseText,
					"statusText": "remote"
				};
			}
			// pass the lakka item (or its look-alike) to the callback
			return callback(_cacheItem);
		}
	};

	_httpRequest.open("GET", uri);
	_httpRequest.send();
};

// define a friendly location with CORS headers
// proxy from https://github.com/martinkr/corsify
var uri = 'http://localhost:3001/http:/shaky-library.surge.sh';

// make the lakka-enhanced request
lakkaXHR(uri, function callback(response) {
	console.log("Received response from " + response.statusText, ": ", response.responseText.slice(0, 45) + "... ");
});
