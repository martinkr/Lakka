/*!lakka*/
!function(t,r){"object"==typeof exports&&"object"==typeof module?module.exports=r():"function"==typeof define&&define.amd?define([],r):"object"==typeof exports?exports.lakka=r():t.lakka=r()}("undefined"!=typeof self?self:this,function(){return function(t){function r(n){if(e[n])return e[n].exports;var o=e[n]={i:n,l:!1,exports:{}};return t[n].call(o.exports,o,o.exports,r),o.l=!0,o.exports}var e={};return r.m=t,r.c=e,r.d=function(t,e,n){r.o(t,e)||Object.defineProperty(t,e,{configurable:!1,enumerable:!0,get:n})},r.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return r.d(e,"a",e),e},r.o=function(t,r){return{}.hasOwnProperty.call(t,r)},r.p="",r(r.s=10)}([function(t,r,e){"use strict";var n=e(12),o=["include","exclude","minutes"];t.exports={get:function(t){return function(t){if(!t||"string"!=typeof t||!0!==o.includes(t))throw Error();return n[t]}(t)},set:function(t,r){return function(t,r){var e,u=[t,r].filter(function(t){return t});if(0===(e=u).length||1===e.length&&e[0]!==Object(e[0])||(1===e.length&&e[0]===Object(e[0])?!Object.keys(e[0]).every(function(t){return o.includes(t)}):2===e.length&&"minutes"===e[0]?"number"!=typeof+e[1]||!1!==Number.isNaN(+e[1])||!1!==Array.isArray(e[1])||"boolean"==typeof e[1]:2!==e.length||"string"!=typeof e[0]||"string"!=typeof e[1]||!o.includes(e[0])))throw Error();return u[0]===Object(u[0])?(n=Object.assign(n,u[0]),!0):"include"===t||"exclude"===t?("string"==typeof r&&(r=RegExp(r)),!!n[t].some(function(t){return t.source===r.source})||(n[t].push(r),!0)):(n[t]=r,!0)}(t,r)}}},function(t,r,e){"use strict";var n=function t(r,e,n){var o=void 0;if(!r||!e)throw Error();try{switch(r){case"set":try{o=JSON.parse(window.localStorage.getItem("lakka"))}catch(t){}if(o||(o={}),!n&&"string"!=typeof n&&null!==n)throw Error();return null===n?delete o[e]:o[e]=n,window.localStorage.setItem("lakka",JSON.stringify(o)),!0;case"get":try{o=JSON.parse(window.localStorage.getItem("lakka"))}catch(t){return o={},null}return o[e]||null;case"del":return t("set",e,null);case"flush":return window.localStorage.setItem("lakka",JSON.stringify({}))}}catch(t){throw Error(t)}};t.exports={get:function(t){return n("get",t)},set:function(t,r){return n("set",t,r)},del:function(t){return n("del",t)},flush:function(){return n("flush","*")}}},function(t,r,e){"use strict";t.exports=function(t){if("string"!=typeof t)throw Error();return escape(t)}},function(t,r,e){"use strict";t.exports=function(t){if(!t&&0!==t||t instanceof Error)throw Error()}},function(t,r,e){"use strict";var n=[/must-revalidate/,/no-store/,/no-cache/];t.exports=function(t){return"string"!=typeof t||!t||n.map(function(r){return r.test(t)}).every(function(t){return!1===t})}},function(t,r,e){"use strict";t.exports=function(t,r,e){var n=(new Date).getTime();try{return function(t,r){if(!t||!r)throw Error();var e=/max-age=([0-9]*)/g.exec(t);if(!e||!e[1])throw Error();var n=void 0;try{n=+e[1]}catch(t){throw Error()}return+(r+n)}(t,n)}catch(t){}try{return function(t){if(!t||0>=+t)throw Error();var r=new Date(t).getTime();if(/\/^[0-9]*$\/gm/.test(r)||isNaN(r)||0>r)throw Error();return r}(r)}catch(t){}return+(n+e)}},function(t,r,e){"use strict";var n=[/application\/json/,/text\/x-json/,/text\/plain/,/text\/html/];t.exports=function(t){return!("string"!=typeof t||!t)&&n.map(function(r){return r.test(t)}).some(function(t){return!0===t})}},function(t,r,e){"use strict";t.exports=function(t){return function(r){return function(e){if(!t&&e)return e;if(!t&&!e||!r)return null;var n=t[r]||t[r.toLowerCase()];return n||(!n&&e?e:null)}}}},function(t,r,e){"use strict";var n=e(3);t.exports=function(t){return function(r){return function(e){if(!t||"function"!=typeof t)throw Error();if(!r||!r.headers||!e)return!0;var o=r.headers[e]||r.headers[e.toLowerCase()];return!o||(n(t(o)),!0)}}}},function(t,r,e){"use strict";t.exports=function(t,r){if("string"!=typeof t||!0!==Array.isArray(r))throw Error();return r.map(function(r){return r.test(t)}).some(function(t){return!0===t})}},function(t,r,e){"use strict";var n=e(11),o=e(16),u=e(1),i=e(0);t.exports={time:function(t){return i.set("minutes",t)},ignore:function(t){return i.set("exclude",t)},recognize:function(t){return i.set("include",t)},configuration:function(t){return i.set(t)},remove:function(t){return u.del(t)},flush:function(){return u.flush()},after:function(t,r,e,o){return n(t,r,e,o)},before:function(t,r){return o(t,r)}}},function(t,r,e){"use strict";var n=e(0),o=6e4*n.get("minutes"),u=e(13),i=e(4),c=e(5),s=e(6),f=e(1),a=e(2),l=e(14),p=e(3),h=e(7),d=e(8),g=e(15),y=e(9);t.exports=function(t,r,e,x){if("string"!=typeof t||"string"!=typeof r||"number"!=typeof e&&"string"!=typeof e||0==(x instanceof Object&&x.constructor===Object))throw Error();var w=e+"";try{(function(t){var r=n.get("include"),e=n.get("exclude");if(e.length&&y(t,e))throw Error();if(r.length&&!1===y(t,r))throw Error()})(t),p(u(w)),d(i)(x)("Cache-Control"),d(s)(x)("Content-Type"),p(c("",h(x.headers)("Expires")(null),o)>=Date.now())}catch(t){throw Error()}var v=void 0;try{v=l(t,r,x.headers),g(f)(a(t))(v)}catch(t){throw Error()}return v}},function(t,r,e){"use strict";t.exports={include:[],exclude:[],minutes:60}},function(t,r,e){"use strict";t.exports=function(t){return["200","203","226"].includes(t)}},function(t,r,e){"use strict";var n=6e4*e(0).get("minutes"),o=e(2),u=e(5),i=e(7);t.exports=function(t,r,e){if("string"!=typeof t||"string"!=typeof r||!1===(e&&e instanceof Object&&e.constructor===Object))throw Error();var c={headers:{}};try{c.key=o(t),c.status=200,c.statusText="cache",c.responseText=r,c.until=u(i(e)("Cache-Control")(null),i(e)("Expires")(null),n),c.headers.Status=c.status+" "+c.statusText,c.headers["Content-Type"]=i(e)("Content-Type")("text/plain"),c.headers["Cache-Control"]=i(e)("Cache-Control")(null),c.headers.Expires=i(e)("Expires")(null),Object.keys(c.headers).forEach(function(t){return null==c.headers[t]&&delete c.headers[t]})}catch(t){throw Error()}return c}},function(t,r,e){"use strict";var n=e(3);t.exports=function(t){return function(r){return function(e){n(t.set(r,e))}}}},function(t,r,e){"use strict";var n=e(0),o=e(9),u=e(4),i=e(6),c=e(1),s=e(2),f=e(8),a=e(17);t.exports=function(t,r){if("string"!=typeof t||!1===(r&&r instanceof Object&&r.constructor===Object))throw Error();try{return function(t){var r=n.get("include"),e=n.get("exclude");if(e.length&&o(t,e))throw Error();if(r.length&&!1===o(t,r))throw Error()}(t),f(u)(r)("Cache-Control"),f(i)(r)("Accept"),f(i)(r)("Content-Type"),a(c)(s(t))}catch(t){throw Error()}}},function(t,r,e){"use strict";var n=e(18);t.exports=function(t){return function(r){var e=t.get(r);if(!n(e))throw t.del(r),Error();return e}}},function(t,r,e){"use strict";t.exports=function(t){return!(!t||!t.until||t.until<Date.now())}}])});