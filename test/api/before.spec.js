/**
 * Specs for the window.localstorage facade
 * This module provides a facade for accessing the internal private cache.
 * In this case: we're using the localStorage
 *
 * @copyright 2017 Martin Krause <github@mkrause.info> (http://martinkr.github.io)
 * @license MIT license: https://opensource.org/licenses/MIT
 *
 * @author Martin Krause <github@mkrause.info>
 */

/* eslint-env mocha */

const thisModulePath = "api/before";
// let thisModule;
const thisModule = require("./../../app/" + thisModulePath);
const thisConfig = require("./../../app/configuration/main.js");
const thisCreateKey = require("./../../app/cache/create-key.js");
const thisCreateItem = require("./../../app/cache/create-item.js");


// // mock dependencies
// const proxyquire = require("proxyquire").noCallThru();
// const stubAndReturn = ((value) => {
// 	thisModule = proxyquire("./../../app/" + thisModulePath,
// 		{
// 			// "./../adapter/puppeteer": (item) => { return new Promise((resolve, reject) => {item.screenshot = value; resolve(item); }); }
// 		}
// 	);
// });

describe(`The module "${thisModulePath}"`, () => {

	before(() => {

		if (!global.window) {
			global.window = {};
		}
		global.window._localStorage = global.window.localStorage;

		global.window.localStorage = {
			_data: {},
			getItem(key) {
				let item = global.window.localStorage._data[key];
				// some kind of safety net...
				/* istanbul ignore next */
				if (typeof (item) === "string") {
					item = JSON.parse(item);
				}
				return item;
			},
			setItem(key, value) {
				if (typeof (value) !== "string") {
					value = JSON.stringify(value);
				}
				return global.window.localStorage._data[key] = value;
			},
			removeItem(key) {
				delete global.window.localStorage._data[key];
			},
		};

		global.window.localStorage.setItem(thisCreateKey("string"), thisCreateItem("string", "value-HTML"));
		global.window.localStorage.setItem(thisCreateKey("/matchMe.html"), thisCreateItem("/matchMe.html", "matchMe-HTML"));
		// global.window.localStorage.setItem("/noMatch.html", "noMatch-HTML");
	});

	beforeEach(() => {
		// stubAndReturn(true);
	})

	after(() => {
		global.window.localStorage = global.window._localStorage;
		delete global.window._localStorage;
	})


	describe("should provide an unified API. It:", () => {

		it("should be a sync function", () => {
			(Object.getPrototypeOf(thisModule).constructor.name === "Function").should.be.ok;
		});
	});

	describe("should consume one argument. It:", () => {

		it("should take one argument, a \"String\"", (() => {
			try {
				thisModule("string");
			} catch (err) {
				throw new Error("Failed");
			}
			return true;
		}));

		it("should throw if the first argument is a boolean \"true\" and not a \"String\"", (() => {
			try {
				thisModule(true);
			} catch (err) {
				err.should.be.an("error");
				return true;
			}
			throw new Error("Failed");
		}));

		it("should throw if the first argument is a boolean \"false\" and not a \"String\"", (() => {
			try {
				thisModule(false);
			} catch (err) {
				err.should.be.an("error");
				return true;
			}
			throw new Error("Failed");
		}));

		it("should throw if the first argument is an \"Array\" and not a \"String\"", (() => {
			try {
				thisModule([]);
			} catch (err) {
				err.should.be.an("error");
				return true;
			}
			throw new Error("Failed");
		}));

		it("should throw if the first argument is an \"Object\" and not a \"String\"", (() => {
			try {
				thisModule({});
			} catch (err) {
				err.should.be.an("error");
				return true;
			}
			throw new Error("Failed");
		}));

		it("should throw if the first argument is a \"Number\" and not a \"String\"", (() => {
			try {
				thisModule(1);
			} catch (err) {
				err.should.be.an("error");
				return true;
			}
			throw new Error("Failed");
		}));
	});

	describe("should consume two arguments. It:", () => {

		it("should take two arguments, a \"String\" and an \"Object\"", (() => {
			try {
				thisModule("string", {});
			} catch (err) {
				throw new Error("Failed");
			}
			return true;
		}));

		it("should ignore the second if the second is \"null\"", (() => {
			try {
				thisModule("string", null);
			} catch (err) {
				throw new Error("Failed");
			}
			return true;
		}));

		it("should ignore the second if the second is \"undefined\" ", (() => {
			try {
				thisModule("string", undefined);
			} catch (err) {
				throw new Error("Failed");
			}
			return true;
		}));


		it("should throw if the second argument is a boolean \"true\" and not an \"Object\"", (() => {
			try {
				thisModule("string", true);
			} catch (err) {
				err.should.be.an("error");
				return true;
			}
			throw new Error("Failed");
		}));

		it("should throw if the second argument is a boolean \"false\" and not an \"Object\"", (() => {
			try {
				thisModule("string", false);
			} catch (err) {
				err.should.be.an("error");
				return true;
			}
			throw new Error("Failed");
		}));

		it("should throw if the second argument is an \"Array\" and not an \"Object\"", (() => {
			try {
				thisModule("string", []);
			} catch (err) {
				err.should.be.an("error");
				return true;
			}
			throw new Error("Failed");
		}));

		it("should throw if the second argument is a \"String\" and not an \"Object\"", (() => {
			try {
				thisModule("string", "string");
			} catch (err) {
				err.should.be.an("error");
				return true;
			}
			throw new Error("Failed");
		}));

		it("should throw if the second argument is a \"Number\" and not an \"Object\"", (() => {
			try {
				thisModule("string", 1);
			} catch (err) {
				err.should.be.an("error");
				return true;
			}
			throw new Error("Failed");
		}));

	});

	describe("should work with \"exclude\" & \"include\" patterns. It:", () => {

		beforeEach(() => {
			let _object = {
				"include": [],
				"exclude": [],
				"minutes": 60
			};
			thisConfig.set(_object);
		});

		after(() => {
			let _object = {
				"include": [],
				"exclude": [],
				"minutes": 60
			};
			thisConfig.set(_object);
		});

		it("should not throw if no pattern is set", (() => {
			try {
				thisModule("string");
			} catch (err) {
				throw new Error("Failed");
			}
			return true;
		}));

		it("should throw if the uri matches the \"exclude\" pattern", (() => {
			thisConfig.set("exclude", "matchMe");
			try {
				thisModule("/matchMe.html");
			} catch (err) {
				err.should.be.an("error");
				return true;
			}
			throw new Error("Failed");
		}));

		it("should throw if the uri matches the \"exclude\" pattern and not the \"include\" pattern", (() => {
			thisConfig.set("exclude", "matchMe");
			thisConfig.set("include", "includeMe");
			try {
				thisModule("/matchMe.html");
			} catch (err) {
				err.should.be.an("error");
				return true;
			}
			throw new Error("Failed");
		}));

		it("should throw if the uri matches the \"exclude\" pattern and the \"include\" pattern (\"exclude\" takes precedence)", (() => {
			thisConfig.set("exclude", "matchMe");
			thisConfig.set("include", "matchMe");
			try {
				thisModule("/matchMe.html");
			} catch (err) {
				err.should.be.an("error");
				return true;
			}
			throw new Error("Failed");
		}));


		it("should not throw if the uri matches the \"include\" pattern", (() => {
			thisConfig.set("include", "matchMe");
			try {
				thisModule("/matchMe.html");
			} catch (err) {
				throw new Error("Failed");
			}
			return true;
		}));

		it("should throw if the uri does matches the \"include\" pattern", (() => {
			thisConfig.set("include", "matchMe");
			try {
				thisModule("/noMatch.html");
			} catch (err) {
				err.should.be.an("error");
				return true;
			}
			throw new Error("Failed");
		}));

	});

	describe("should consider the cache-control header. It:", () => {
		let _options;
		beforeEach(() => {
			_options = {
				"headers": {
					"Cache-Control": ""
				}
			};
		});

		after(() => { });

		it("should not throw if there's no headers-property", (() => {
			try {
				delete _options.headers;
				thisModule("string", _options);
			} catch (err) {
				throw new Error("Failed");
			}
			return true;
		}));

		it("should not throw if there's no Cache-Control-Header", (() => {
			try {
				delete _options.headers["Cache-Control"];
				thisModule("string", _options);
			} catch (err) {
				throw new Error("Failed");
			}
			return true;
		}));

		it("should not throw if the Cache-Control-Header is set to \"only-if-cached\"", (() => {
			try {
				_options.headers["Cache-Control"] = "only-if-cached";
				thisModule("string", _options);
			} catch (err) {
				throw new Error("Failed");
			}
			return true;

		}));

		it("should not throw if the Cache-Control-Header is set to \"immutable\"", (() => {
			try {
				_options.headers["Cache-Control"] = "immutable";
				thisModule("string", _options);
			} catch (err) {
				throw new Error("Failed");
			}
			return true;
		}));

		it("should not throw if the Cache-Control-Header is set to \"public\"", (() => {
			try {
				_options.headers["Cache-Control"] = "public";
				thisModule("string", _options);
			} catch (err) {
				throw new Error("Failed");
			}
			return true;
		}));

		it("should not throw if the Cache-Control-Header is set to \"private\"", (() => {
			try {
				_options.headers["Cache-Control"] = "private";
				thisModule("string", _options);
			} catch (err) {
				throw new Error("Failed");
			}
			return true;
		}));



		it("should throw if the Cache-Control-Header is set to \"must-revalidate\"", (() => {
			try {
				_options.headers["Cache-Control"] = "must-revalidate";
				thisModule("string", _options);
			} catch (err) {
				err.should.be.an("error");
				return true;
			}
			throw new Error("Failed");
		}));

		it("should throw if the Cache-Control-Header is set to \"no-store\"", (() => {
			try {
				_options.headers["Cache-Control"] = "no-store";
				thisModule("string", _options);
			} catch (err) {
				err.should.be.an("error");
				return true;
			}
			throw new Error("Failed");
		}));

		it("should throw if the Cache-Control-Header is set to \"no-cache\"", (() => {
			try {
				_options.headers["Cache-Control"] = "no-cache";
				thisModule("string", _options);
			} catch (err) {
				err.should.be.an("error");
				return true;
			}
			throw new Error("Failed");
		}));

		it("should ignore upper/lowercase", (() => {
			try {
				delete _options.headers["Cache-Control"];
				_options.headers["cache-control"] = "no-cache";
				thisModule("string", _options);
			} catch (err) {
				err.should.be.an("error");
				return true;
			}
			throw new Error("Failed");
		}));

	});


	// "application/json", "text/x-json", "text/plain", "text/html"
	describe("should consider the content-type header. It:", () => {
		let _options;
		beforeEach(() => {
			_options = {
				"headers": {
					"Content-Type": ""
				}
			};
		});

		after(() => { });
		it("should not throw if the Content-Type-Header is set to \"application/json\"", (() => {
			try {
				_options.headers["Content-Type"] = "application/json";
				thisModule("string", _options);
			} catch (err) {
				throw new Error("Failed");
			}
			return true;
		}));

		it("should not throw if the Content-Type-Header is set to \"text/x-json\"", (() => {
			try {
				_options.headers["Content-Type"] = "text/x-json";
				thisModule("string", _options);
			} catch (err) {
				throw new Error("Failed");
			}
			return true;
		}));

		it("should not throw if the Content-Type-Header is set to \"text/plain\"", (() => {
			try {
				_options.headers["Content-Type"] = "text/plain";
				thisModule("string", _options);
			} catch (err) {
				throw new Error("Failed");
			}
			return true;
		}));

		it("should not throw if the Content-Type-Header is set to \"text/html\"", (() => {
			try {
				_options.headers["Content-Type"] = "text/html";
				thisModule("string", _options);
			} catch (err) {
				throw new Error("Failed");
			}
			return true;
		}));


		it("should throw if the Content-Type-Header is set to \"x-anything-else\"", (() => {
			try {
				_options.headers["Content-Type"] = "x-anything-else";
				thisModule("string", _options);
			} catch (err) {
				err.should.be.an("error");
				return true;
			}
			throw new Error("Failed");
		}));


		it("should ignore upper/lowercase", (() => {
			try {
				delete _options.headers["Content-Type"];
				_options.headers["content-type"] = "x-anything-else";
				thisModule("string", _options);
			} catch (err) {
				err.should.be.an("error");
				return true;
			}
			throw new Error("Failed");
		}));
	});


	// "application/json", "text/x-json", "text/plain", "text/html"
	describe("should consider the Accept header. It:", () => {
		let _options;
		beforeEach(() => {
			_options = {
				"headers": {
					"Accept": ""
				}
			};
		});

		after(() => { });

		it("should not throw if the Accept-Header is set to \"application/json\"", (() => {
			try {
				_options.headers["Accept"] = "application/json";
				thisModule("string", _options);
			} catch (err) {
				throw new Error("Failed");
			}
			return true;
		}));

		it("should not throw if the Accept-Header is set to \"text/x-json\"", (() => {
			try {
				_options.headers["Accept"] = "text/x-json";
				thisModule("string", _options);
			} catch (err) {
				throw new Error("Failed");
			}
			return true;
		}));

		it("should not throw if the Accept-Header is set to \"text/plain\"", (() => {
			try {
				_options.headers["Accept"] = "text/plain";
				thisModule("string", _options);
			} catch (err) {
				throw new Error("Failed");
			}
			return true;
		}));

		it("should not throw if the Accept-Header is set to \"text/html\"", (() => {
			try {
				_options.headers["Accept"] = "text/html";
				thisModule("string", _options);
			} catch (err) {
				throw new Error("Failed");
			}
			return true;
		}));


		it("should throw if the Accept-Header is set to \"x-anything-else\"", (() => {
			try {
				_options.headers["Accept"] = "x-anything-else";
				thisModule("string", _options);
			} catch (err) {
				err.should.be.an("error");
				return true;
			}
			throw new Error("Failed");
		}));

		it("should ignore upper/lowercase", (() => {
			try {
				delete _options.headers["Accept"];
				_options.headers["accept"] = "x-anything-else";
				thisModule("string", _options);
			} catch (err) {
				err.should.be.an("error");
				return true;
			}
			throw new Error("Failed");
		}));
	});


	describe("should read and write from localStorage. It:", () => {


		beforeEach(() => {
			global.window.localStorage._data = {};
		});

		after(() => {
			global.window.localStorage._data = {};
		});

		it("should throw if there is no item for this uri", (() => {
			global.window.localStorage.removeItem(thisCreateKey("string"), "value");
			// global.window.localStorage._data = { string: "value" };
			try {
				thisModule("string");
			} catch (err) {
				err.should.be.an("error");
				return true;
			}
			throw new Error("Failed");
		}));

		it("should return the item for this uri if it's fresh", (() => {
			global.window.localStorage.setItem(thisCreateKey("string"), thisCreateItem("string", "value-HTML"));
			thisModule("string").should.be.an("object");
		}));

		it("should throw if the item for this uri is stale", (() => {
			global.window.localStorage.setItem(thisCreateKey("string"), thisCreateItem("string", "value-HTML", { "Expires": (new Date(new Date(new Date().getTime() - (1000 * 60 * 60)).getTime())) }));
			try {
				thisModule("string");
			} catch (err) {
				err.should.be.an("error");
				return true;
			}
			throw new Error("Failed");
		}));

	});

});
