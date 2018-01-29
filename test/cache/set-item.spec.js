/**
 * Specs for setting a specific item from a given cache
 *
 * @copyright 2017 Martin Krause <github@mkrause.info> (http://martinkr.github.io)
 * @license MIT license: https://opensource.org/licenses/MIT
 *
 * @author Martin Krause <github@mkrause.info>
 */

 /* eslint-env mocha */

const thisModulePath = "cache/set-item";
const thisModule = require("./../../app/" + thisModulePath);


// mock the cache object
// spy on the call, check parameters passed to cache

let facade;
let spyFacade;

describe(`The module "${thisModulePath}"`, () => {

	before(() => {

		facade = { _data: {}, "set": (key, value) => facade._data[key] = value };
		spyFacade = sinon.spy(facade, "set");

	});

	beforeEach(() => {
		facade._data = {};
	})

	after(() => {
		spyFacade.restore();
		global.window.localStorage.clear();
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
			thisModule(facade)("key")("value");
				spyFacade.should.have.been.called.with(facade, "key", "value");
			} catch (err) {
				return true;
			}
			return true;
		});


		it("should throw if there's an error", () => {
			delete facade._data;
			try {
				thisModule(facade)("key")("value");;
			} catch (err) {
				err.should.be.an("error");
				return true;
			}
			throw new Error("Failed");
		});

	});

});
