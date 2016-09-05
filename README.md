# cookie
 A simple es6 module with an convenient api for CRUD cookie handling.

## Example
```Javascript
    // ... as ES5 + requirejs
    define(["./dist/main.js"], function(cookie) {

    // ... as ES6 import
    import * as cookie from "./dist/main.js";

    // to set a session cookie
    cookie.set( "name", "value");

    // to get a cookie
    console.log(cookie.get( "name"));

    // to remove a cookie
    cookie.remove( "name");

```

## API

### set
 - __Description__: Set a cookie with all it properties
 - __Param__: {String} name, the cookie name
 - __Param__: {Object} value, the cokie value
 - __Param__: {String, Number} [expires], the expire date as string ('session') or number of days
 - __Param__: {Object} [options], additional cookie options { path: {String}, domain: {String}, secure {Bool} }
 - __Return__ {String} The complete cookie string as resent in document.cookie

### get
 - __Description__: Get a cookie value
 - __Param__: {String} name, the cookie name
 - __Return__ {String, Undefined} the value or undefined

### remove
 - __Description__: Delete a cookie
 - __Param__: {String} name, the cookie name
 - __Return__ {String} The complete cookie string as resent in document.cookie


/** define the api  */
export {

     */
    _set as set,

    /**
     * Get's a cookie value
     * @param {String} name, the cookie name
     * @return {String, Undefined} the value or undefined
     */
    _get as get,

    /**
     * Delete a cookie
     * @param {String} name, the cookie name
     * @return {String} The complete cookie string as resent in document.cookie
     */
    _remove as remove
};
## Tests
Run tests with `$ npm test`. Requires `mocha, `chai`, `babel`.


## License
Dual licensed under the MIT and GPL licenses.

* MIT - http://www.opensource.org/licenses/mit-license.php
* GNU - http://www.gnu.org/licenses/gpl-3.0.html


Copyright (c) 2015 Martin Krause (mkrause.info)

