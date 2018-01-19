/**
 * Specs for getting a specific item from a given cache
 *
 * @copyright 2017 Martin Krause <github@mkrause.info> (http://martinkr.github.io)
 * @license MIT license: https://opensource.org/licenses/MIT
 *
 * @author Martin Krause <github@mkrause.info>
 */

/* eslint-env mocha */

const thisModulePath = "cache/get-item";
const thisModule = require("./../../app/" + thisModulePath);

// mock the cache object
// spy on the call, check parameters passed to cache

let facade;
let spyFacade;

describe(`The module "${thisModulePath}"`, () => {

	before(() => {

		if (!global.window) {
			global.window = {};
		}
		global.window._localStorage = global.window.localStorage;

		global.window.localStorage = {
			_data: {},
			getItem(key) {

			},
			setItem(key, value) {

			},
			removeItem(key) {

			},
		};
		facade = { _data: {}, "get": (key) => facade._data[key] };
		spyFacade = sinon.spy(facade, "get");

	});

	beforeEach(() => {
		facade._data = {};
	})

	after(() => {
		spyFacade.restore();
		global.window.localStorage = global.window._localStorage;
		delete global.window._localStorage;
	})
	afterEach(() => {
		spyFacade.reset();
	});



	describe("should provide an unified API. It:", () => {

		it("should export a sync function ", () => {
			thisModule.should.be.a("function");
		});

		it("should call the underlying cache with the correct parameters", () => {
			try {
			thisModule(facade)("key");
				spyFacade.should.have.been.called.with(facade, "key");
			} catch (err) {
				return true;
			}
			return true;
		});

		it("should return a fresh item", () => {
			facade._data["key"] = {
				"foo": "fresh",
				"until": Date.now() + 1000
			};
			thisModule(facade)("key").foo.should.equal("fresh");
		});

		it("should throw if there's no item for this key", () => {
			delete facade._data["key"];

			try {
				thisModule(facade)("key");
			} catch (err) {
				err.should.be.an("error");
				return true;
			}
			throw new Error("Failed");
		});

		it("should throw if there's a stale item for this key", () => {
			facade._data["key"] = {
				"foo": "fresh",
				"until": Date.now() - 1000
			};
			try {
				thisModule(facade)("key");
			} catch (err) {
				err.should.be.an("error");
				return true;
			}
			throw new Error("Failed");
		});

		it("should remote the item from the cache if the item is stale", () => {
			facade._data["key"] = {
				"foo": "fresh",
				"until": Date.now() - 1000
			};
			try {
				thisModule(facade)("key");
			} catch (err) {
				(global.window.localStorage._data["key"] === undefined).should.be.true;
				return true;
			}
			throw new Error("Failed");
		});

	});

});


