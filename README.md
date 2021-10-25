# lakka [![Build Status](https://travis-ci.org/martinkr/Lakka.svg?branch=master)](https://travis-ci.org/martinkr/Lakka)
lakka. An asynchronous request accelerator.

lakka is an accelerator for asyncronous requests. It works by caching the request's response in your users local storage. It caches JSON, text and HTML requests and considers the ```Cache-Control``` and ```Expires``` Headers of your requests and responses.
Usualy, the content of an AJAX-request does not change so often. In the best case, the backend-environemnt either caches them or responds with a "not-modified"-like header. But the client still need to wait for this response and the network roundtrip + response time + connection speed makes your website feels "slow". This is where ```lakka``` enhances your website's snappiness: no more waiting, instant responses!

## Installation

Install from npm ```$ yarn add lakka```

## Quick start

Add  ```dist/wrapper/lakka.js``` to your project.

## Core Concept

Basically you need to call two functions:
- ```before()``` with the uri before making your request
- ```after()``` with the response afterwards

#### .before()

Call this function before the actual request. It checks the cache and returns a fresh cache item or throws an error.

#### .after()

Call this after the actual request. Checks the response and store it at the cache. Returns the cache item or throws an error.

## UMD-Module: ```lakka```

This is an UMD-Module working in your browser, server, requirejs, browserify, commonjs or nodejs setup.
Load ```./dist/lakka.js``` to use the lakka accelerator in your code. This  will give you access to the complete lakka-API. It exposes ```window.lakka```for your convienence.

## Examples

Take a look ```example``` folder:

#### ```example/xmlhttprequest.js```

For a simple example how to use ```lakka``` with  ```window.XMLHTTPRequest()```

#### ```example/fetch.js```

For a simple example how to use ```lakka``` with ```window.fetch()```

## Configuration

Lakka let's you define basic options:

- ```exclude```: Adds a regular-expressions to ignore certain URIs. This can be part of the configuration object or directly set using ``.ignore()```. If an URI matches an ```exclude``` and ```include```pattern, the ```exclude```pattern takes precedence and the URI will be ignored. Default: empty
- ```include```: Adds a regular-expressions to include certain URIs. This can be part of the configuration object or directly set using ``.recognize()```. If this is set, all non-matching URIs will be ignored. Default: empty
- ```minutes```: sets the time a cache item is considered "fresh" if the response does not contain a ```Cache-Control Header``` or  ```Expires Header```. Default: 60 minutes

## API

### ```ignore(String|RegEx)```

Adds an ignore pattern (a string / RegEx) to the existing / default configuration. URIs matching this pattern will be ignored by lakka and passed throught to the remote location.

#### Arguments

- *String|RegEx*: The pattern to look for

### ```recognize(String|RegEx)```

Adds an include pattern (a string / RegEx) to the existing / default configuration. URIs matching this pattern will be recognized and handled by lakka. If none is set, all URIs will be handled.

#### Arguments

- *String|RegEx*: The pattern to look for

### ```time(Number)```

Sets the minutes (Number) we should cache items for. Defaut value is 60 minutes. It will be overwritten by the ```max-age``` - value of the response's ```Cache-Control Header``` or the response's ```Expires Header```.

#### Arguments

- *Number*: The value the default caching time

### ```configuration(Object)```

Dynamically merge a configuration object into the current / default configuration object. ```include``` and ```exclude``` will be merged, ```minutes``` will be replaced.

#### Arguments

- *Object*: A configuration object

```JavaScript
{
  "include":["/include-me/"],
  "exclude":["/exclude-me/"],
  "minutes": 120
}
```

### ```after()```
Call this after the actual request. Checks the response and store it at the cache. Returns the cache item or an error.

* Checks the ```status code``` for success or throws an error.
* Checks the ```include```and ```exclude```patterns to see if this should be handled by lakka or throws an error.
* Checks for a cachable ```Cache-Control Header``` or throws an error.
	- Cachable: ```public```, ```private```, ```Immutable```, ```proxy-revalidate```
	- Non-cachable ```must-revalidate```, ```no-cache```, ```no-store```,
* Checks the "Content-Type" or throws an error.
	- Valid content types are: ```application/json```, ```text/x-json```, ```text/plain```, ```text/html```
* Checks the ```Expires Header``` and the ```Cache-Control Header``` to see if the content is not already stale or throws an error.
* Creates and saves the cache item
* Returns the cache item or the thrown error
#### Arguments

#### Returns
Returns the cache item or an error if there's no cache-item for this request.

### ```before()```
Call this before the actual request. Checks for and returns a fresh cache item or an error.

* Checks the ```include```and ```exclude```patterns to see if this should be handled by lakka or throws an error.
* Checks the ```Cache-Control Header``` or throws an Error
	- Cachable: ```public```, ```private```, ```Immutable```, ```proxy-revalidate```
	- Non-cachable ```must-revalidate```, ```no-cache```, ```no-store```,
* Checks the ```Accept Header``` or throws an Error
	- Valid content types are: ```application/json```, ```text/x-json```, ```text/plain```, ```text/html``
* Checks the ```Content Type Header``` or throws an Error
	- Valid content types are: ```application/json```, ```text/x-json```, ```text/plain```, ```text/html```
* Checks there's a fresh item for this URI or throws an Error.
* Returns the cache item or an error if there's no cache-item for this request.

#### Arguments

#### Returns
Returns a fresh cache item or an error if there's no cache-item for this request.

### ```remove(String)```

Force clear an item from lakka. Removes all stored content for this URI.

#### Arguments

- *String*: The URI to clear from lakka

### ```flush()```

Flush the lakka cache. Remove all items.



# Tech Stack
- Writen in ECMAScript 2018 on ```nodejs v9.0.0``
- Transpiled```babel v6.26.0```
- Bundled with ```webpack v3.10.0```
- 100% code coverage using ```mocha v3.5.0```, ```chai v4.1.1``` and ```nyc v11.2.1```


## License
Licensed under the [MIT license](http://www.opensource.org/licenses/mit-license.php).

Copyright (c) 2016 - 2021 Martin Krause <github@mkrause.info> [http://martinkr.github.io)](http://martinkr.github.io)
