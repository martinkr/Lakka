
			window.lakkaXHR = function (uri, callback) {
				var httpRequest;
				var response;
				// get cached content
				try {
					// got content from the cache
					response = window.lakka.before(uri, {});
					return callback(response);
				} catch (err)  {
					// we throw an error if there's no cache item,
					// proceed to request
				}

				// create the XHR-object
				try {
					httpRequest = new XMLHttpRequest();
				} catch (err) {
					console.error("Error: failed on creating the XMLHttpRequest-object :(. ");
					return false;
				}

				// set up the request
				httpRequest.onreadystatechange = function () {
					// finished the request
					if (httpRequest.readyState === XMLHttpRequest.DONE) {
						// grab items for the lakka query
						var statusCode = httpRequest.status;
						var responseText = httpRequest.responseText;
						var options = {
							"headers": {
								"Cache-Control": httpRequest.getResponseHeader("Cache-Control"),
								"Content-Type": httpRequest.getResponseHeader("Content-Type"),
								"Expires": httpRequest.getResponseHeader("Expires")
							}
						}
						try {
							// got content from the remote location and stored it in the cache
							response = window.lakka.after(uri, responseText, statusCode, options);
						} catch (err) {
							// it's not cachable
							// return original response object
							response = {
								"httpRequest": httpRequest,
								"status": httpRequest.status,
								"statusText": "remote"
							};

						}
						return callback(response);
					}
				};
				httpRequest.open("GET", uri);
				httpRequest.send();
			};


window.lakkaXHR('http://www.corsify.me/http:/shaky-library.surge.sh', function callback(response) { console.log("Received response from " + response.statusText); } );
