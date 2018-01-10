/**
 * Specs for the window.sessionstorage facade
 * This module provides a facade for accessing the internal private cache.
 * In this case: we're using the sessionStorage
 *
 * @copyright 2017 Martin Krause <github@mkrause.info> (http://martinkr.github.io)
 * @license MIT license: https://opensource.org/licenses/MIT
 *
 * @author Martin Krause <github@mkrause.info>
 */

/* eslint-env mocha */

const thisModulePath = "facade/sessionstorage";
const thisModule = require("./../../app/" + thisModulePath);

let spySet;
let spyGet;
let spyDel;


describe(`The module "${thisModulePath}"`, () => {

	afterEach((done) => {
		spySet.restore();
		spyGet.restore();
		spyDel.restore();
		done();
	});

	beforeEach((done) => {
		if (!global.window) {
			global.window = {};
		}
		if (!global.window.sessionStorage) {
			global.window.sessionStorage = {
				getItem() {
					return "stub";
				},
				setItem() {},
				removeItem() {},
			};
		}
		spySet = sinon.spy(global.window.sessionStorage, "setItem");
		spyGet = sinon.spy(global.window.sessionStorage, "getItem");
		spyDel = sinon.spy(global.window.sessionStorage, "removeItem");
		done();
	});


	after((done) => {
		spySet.reset();
		spyGet.reset();
		spyDel.reset();
		done();
	});

	describe("should provide an unified API. It:", () => {

		it("should export a function \"set\" which is sync", () => {
			(Object.getPrototypeOf(thisModule.set).constructor.name === "Function").should.be.ok;
		});

		it("should export a function \"get\" which is sync", () => {
			(Object.getPrototypeOf(thisModule.get).constructor.name === "Function").should.be.ok;
		});

		it("should export a function \"has\" which is ", () => {
			(Object.getPrototypeOf(thisModule.has).constructor.name === "Function").should.be.ok;
		});

		it("should export a function \"del\" which is ", () => {
			(Object.getPrototypeOf(thisModule.del).constructor.name === "Function").should.be.ok;
		});

	});

	describe.skip("should handle Errors. It:", () => {

		it("should throw if there's no \"window.sessionStorage\"", (() => {
			// delete global.window.sessionStorage;
		}));

	});

	describe("should have an API \"set\". It:", () => {

		it("should call \"window.sessionStorage.setItem\"", (() => {
			try {
				thisModule.set("foo", "bar");
			} catch (err) {
				console.error("error: ", err)
			}
			spySet.should.have.been.calledWith("foo", "bar");
			return true;
		}));

		it("should throw if \"window.sessionStorage.setItem\" is not available", (() => {
			spySet.restore();
			window.sessionStorage.setItem = undefined;

			try {
				thisModule.set("foo", "bar");
			} catch (err) {
				err.should.be.an("error");
			}
			return true;
		}));

		it("should throw if we're missing both arguments", (() => {
			try {
				thisModule.set();
			} catch (err) {
				err.should.be.an("error");
				return true;
			}
			throw new Error("Failed");
		}));

		it("should throw if we're missing one arguments", (() => {
			try {
				thisModule.set("foo");
			} catch (err) {
				err.should.be.an("error");
				return true;
			}
			throw new Error("Failed");
		}));

	});


	describe("should have an API \"get\". It:", () => {

		it("should call \"window.sessionStorage.getItem\"", (() => {
			try {
				thisModule.get("foo");
			} catch (err) {
				console.error("error: ", err)
			}
			spyGet.should.have.been.calledWith("foo");
			return true;
		}));

		it("should throw if \"window.sessionStorage.getItem\" is not available", (() => {
			spyGet.restore();
			window.sessionStorage.getItem = undefined;

			try {
				thisModule.get("foo");
			} catch (err) {
				err.should.be.an("error");
			}
			return true;
		}));

		it("should throw if we're missing the arguments", (() => {
			try {
				thisModule.get();
			} catch (err) {
				err.should.be.an("error");
				return true;
			}
			throw new Error("Failed");
		}));

		it("should return the value from window.sessionStorage", (() => {
			window.sessionStorage.getItem = () => {
				return "baz";
			};
			let _result = thisModule.get("foo");
			_result.should.equal("baz");
			return true;
		}));

		it("should return the value from window.sessionStorage - \"null\" if there's no value for the key", (() => {
			window.sessionStorage.getItem = () => {
				return null;
			};
			let _result = thisModule.get("foo");
			(_result === null).should.be.true;
			return true;
		}));

	});


	describe("should have an API \"del\". It:", () => {

		it("should call \"window.sessionStorage.removeItem\"", (() => {
			try {
				thisModule.del("foo");
			} catch (err) {
				console.error("error: ", err)
			}
			spyDel.should.have.been.calledWith("foo");
			return true;
		}));

		it("should throw if \"window.sessionStorage.removeItem\" is not available", (() => {
			spyDel.restore();
			window.sessionStorage.removeItem = undefined;

			try {
				thisModule.del("foo");
			} catch (err) {
				err.should.be.an("error");
			}
			return true;
		}));


		it("should throw if we're missing the arguments", (() => {
			try {
				thisModule.del();
			} catch (err) {
				err.should.be.an("error");
				return true;
			}
			throw new Error("Failed");
		}));

	});

	describe("should have an API \"has\". It:", () => {

		it("should call \"window.sessionStorage.getItem\"", (() => {
			try {
				thisModule.has("foo");
			} catch (err) {
				console.error("error: ", err)
			}
			spyGet.should.have.been.calledWith("foo");
			return true;
		}));

		it("should throw if \"window.sessionStorage.getItem\" is not available", (() => {
			spyGet.restore();
			window.sessionStorage.getItem = undefined;

			try {
				thisModule.has("foo");
			} catch (err) {
				err.should.be.an("error");
			}
			return true;
		}));

		it("should throw if we're missing the arguments", (() => {
			try {
				thisModule.has();
			} catch (err) {
				err.should.be.an("error");
				return true;
			}
			throw new Error("Failed");
		}));

		it("should return true if there's an entry for the key", (() => {
			window.sessionStorage.getItem = () => {
				return "baz";
			};
			let _result = thisModule.has("foo");
			_result.should.be.ok;
			return true;
		}));

		it("should return false if there's no entry for the key", (() => {
			window.sessionStorage.getItem = () => {
				return null;
			};
			let _result = thisModule.has("foo");
			_result.should.not.be.ok;
			return true;
		}));

	});

});
