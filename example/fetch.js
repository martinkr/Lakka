/**
 * This function fetches remote data
 * if there's no item in the lakka-cache and
 * stores the received data afterwards.
 * It's a basic example how to integrate lakka
 * into your scripts using fetch().
 * Assumes you already included "../dist/lakka.js"
 * so window.lakka is available.
 * @param {String} The URI to call
 * @return {Promise} A promise of a lakka item
 */
var lakkaFetch = function (uri) {
	var _request;
	var _response;
	var _options;
	var _headers;
	// setup the fetch
	_headers = new Headers();
	_headers.append("Accept", "text/plain");
	_options = {
		method: "GET",
		headers: _headers,
		mode: "cors"
	};
	// get the cached content from lakka
	try {
		// yay! content from the cache
		_response = window.lakka.before(uri, {});
		// retun a resolved promise
		return Promise.resolve(_response);
	} catch (err) {
		// lakka throws an error if it can not return a fresh cache item
		// don't worry, just proceed to the request
		_request = new Request(uri);

		// return the fetch promise
		return fetch(_request, _options)

			/** Extract the response text, preserve the response */
			.then(function (response) {
				return response.text()
					.then(function (content) {
						return {
							"responseText": content,
							"response": response
						}
					});
			})

			/** Handle the response, push it throught the lakka cache */
			.then(function (data) {
				var _uri, _statusCode, _responseText, _options, _cacheItem;

				// collect all data for lakka
				_uri = data.response.url;
				_statusCode = data.response.status;
				_responseText = data.responseText;
				_options = {
					"headers": {
						"Cache-Control": data.response.headers.get("Cache-Control"),
						"Content-Type": data.response.headers.get("Content-Type"),
						"Expires": data.response.headers.get("Expires")
					}
				};
				try {
					// yay! the content from the remote location is stored it in the cache
					_cacheItem = window.lakka.after(_uri, _responseText, _statusCode, _options);
					_cacheItem.statusText = "remote";
					return _cacheItem;
				} catch (err) {
					// oh :( it's not cachable
					// create an object mimicing the lakka cache item
					// include the original response object
					_cacheItem = {
						"response": data.response,
						"status": _statusCode,
						"responseText": data.responseText,
						"statusText": "remote"
					};
					return _cacheItem;

				}
			});
	}
};

// define a friendly location with CORS headers
// proxy from https://github.com/martinkr/corsify
var uri = 'http://localhost:3001/http:/shaky-library.surge.sh';

// make the lakka-enhanced request
lakkaFetch(uri).then(function callback(response) {
	console.log("Received response from " + response.statusText, ": ", response.responseText.slice(0, 45) + "... ");
});
