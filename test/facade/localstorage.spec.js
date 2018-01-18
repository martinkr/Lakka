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

const thisModulePath = "facade/localstorage";
const thisModule = require("./../../app/" + thisModulePath);

let spySet;
let spyGet;
let spyDel;


describe(`The module "${thisModulePath}"`, () => {

	afterEach((done) => {
		global.window.localStorage._data = {};
		spySet.restore();
		spyGet.restore();
		spyDel.restore();
		done();
	});


	before((done) => {
		if (!global.window) {
			global.window = {};
		}

		done();
	});
	beforeEach((done) => {
		if (!global.window.localStorage) {
			global.window.localStorage = {
				_data: {},
				getItem(key) {
					return global.window.localStorage._data[key];
				},
				setItem(key, value) {
					return global.window.localStorage._data[key] = value;
				},
				removeItem() {},
			};
		}
		spySet = sinon.spy(global.window.localStorage, "setItem");
		spyGet = sinon.spy(global.window.localStorage, "getItem");
		spyDel = sinon.spy(global.window.localStorage, "removeItem");
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

		it("should export a function \"has\" which is sync", () => {
			(Object.getPrototypeOf(thisModule.has).constructor.name === "Function").should.be.ok;
		});

		it("should export a function \"del\" which is sync", () => {
			(Object.getPrototypeOf(thisModule.del).constructor.name === "Function").should.be.ok;
		});

	});

	describe.skip("should handle Errors. It:", () => {

		it("should throw if there's no \"window.localStorage\"", ( () => {
			// delete global.window.localStorage;
		}));

	});

	describe("should have an API \"set\". It:", () => {

		it("should call \"window.localStorage.setItem\"", ( () => {
			try {
				thisModule.set("foo", "bar");
			} catch (err) {
				console.error("error: ", err)
			}
			spySet.should.have.been.calledWith("foo", "bar");
			return true;
		}));

		it("should save Strings only (stringify an Object)", ( () => {
			try {
				thisModule.set("foo", {"bar": "baz"});
			} catch (err) {
				console.error("error: ", err)
			}
			spySet.should.have.been.calledWith("foo", JSON.stringify({"bar": "baz"}));
			return true;
		}));

		it("should save Strings only (stringify an Array)", ( () => {
			try {
				thisModule.set("foo", ["bar", "baz"]);
			} catch (err) {
				console.error("error: ", err)
			}
			spySet.should.have.been.calledWith("foo", JSON.stringify( ["bar", "baz"] ));
			return true;
		}));

		it("should save Strings only (stringify a Number)", ( () => {
			try {
				thisModule.set("foo", 10);
			} catch (err) {
				console.error("error: ", err)
			}
			spySet.should.have.been.calledWith("foo", JSON.stringify( 10));
			return true;
		}));

		it("should save Strings only (stringify a Boolean true)", ( () => {
			try {
				thisModule.set("foo", true);
			} catch (err) {
				console.error("error: ", err)
			}
			spySet.should.have.been.calledWith("foo", JSON.stringify( true ));
			return true;
		}));

		it("should throw if the value evaluates to false (false)", ( () => {
			try {
				thisModule.set("foo", false);
			} catch (err) {
				err.should.be.an("error");
				return true;
			}
			throw new Error("Failed");
		}));

		it("should throw if the value evaluates to false (null)", ( () => {
			try {
				thisModule.set("foo", null);
			} catch (err) {
				err.should.be.an("error");
				return true;
			}
			throw new Error("Failed");
		}));

		it("should throw if the value evaluates to false (0)", ( () => {
			try {
				thisModule.set("foo", 0);
			} catch (err) {
				err.should.be.an("error");
				return true;
			}
			throw new Error("Failed");
		}));

		it("should not throw if the value is an empty string (\"\")", ( () => {
			try {
				thisModule.set("foo", "");
			} catch (err) {
				console.error("error: ", err)
			}
			spySet.should.have.been.calledWith("foo", "");
			return true;
		}));


		it("should throw if \"window.localStorage.setItem\" is not available", ( () => {
			spySet.restore();
			window.localStorage.setItem = undefined;

			try {
				thisModule.set("foo", "bar");
			} catch (err) {
				err.should.be.an("error");
			}
			return true;
		}));

		it("should throw if we're missing both arguments", ( () => {
			try {
				thisModule.set();
			} catch (err) {
				err.should.be.an("error");
				return true;
			}
			throw new Error("Failed");
		}));

		it("should throw if we're missing one arguments", ( () => {
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

		it("should call \"window.localStorage.getItem\"", ( () => {
			try {
				thisModule.get("foo");
			} catch (err) {
				console.error("error: ", err)
			}
			spyGet.should.have.been.calledWith("foo");
			return true;
		}));

		it("should throw if \"window.localStorage.getItem\" is not available", ( () => {
			spyGet.restore();
			window.localStorage.getItem = undefined;

			try {
				thisModule.get("foo");
			} catch (err) {
				err.should.be.an("error");
			}
			return true;
		}));

		it("should throw if we're missing the arguments", ( () => {
			try {
				thisModule.get();
			} catch (err) {
				err.should.be.an("error");
				return true;
			}
			throw new Error("Failed");
		}));

		it("should return the value from window.localStorage", (() => {
			window.localStorage.setItem("foo", JSON.stringify("baz"));
			let _result = thisModule.get("foo");
			_result.should.be.ok;
			return true;
		}));


		it("should always return an object", ( () => {
			window.localStorage.setItem("foo", JSON.stringify({"bar": "baz"}));
			let _result = thisModule.get("foo");
			_result.should.be.an("object");
			return true;
		}));

		it("should return the value from window.localStorage - \"null\" if there's no value for the key", ( () => {
			window.localStorage.setItem("foo", JSON.stringify(null));
			let _result = thisModule.get("foo");
			(_result === null).should.be.true;
			return true;
		}));

	});


	describe("should have an API \"del\". It:", () => {

		it("should call \"window.localStorage.removeItem\"", ( () => {
			try {
				thisModule.del("foo");
			} catch (err) {
				console.error("error: ", err)
			}
			spyDel.should.have.been.calledWith("foo");
			return true;
		}));

		it("should throw if \"window.localStorage.removeItem\" is not available", ( () => {
			spyDel.restore();
			window.localStorage.removeItem = undefined;

			try {
				thisModule.del("foo");
			} catch (err) {
				err.should.be.an("error");
			}
			return true;
		}));


		it("should throw if we're missing the arguments", ( () => {
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

		it("should call \"window.localStorage.getItem\"", ( () => {
			try {
				thisModule.has("foo");
			} catch (err) {
				console.error("error: ", err)
			}
			spyGet.should.have.been.calledWith("foo");
			return true;
		}));

		it("should throw if \"window.localStorage.getItem\" is not available", ( () => {
			spyGet.restore();
			window.localStorage.getItem = undefined;

			try {
				thisModule.has("foo");
			} catch (err) {
				err.should.be.an("error");
			}
			return true;
		}));

		it("should throw if we're missing the arguments", ( () => {
			try {
				thisModule.has();
			} catch (err) {
				err.should.be.an("error");
				return true;
			}
			throw new Error("Failed");
		}));

		it("should return true if there's an entry for the key", ( () => {
			window.localStorage.getItem = () => {
				return "baz";
			};
			let _result = thisModule.has("foo");
			_result.should.be.ok;
			return true;
		}));

		it("should return false if there's no entry for the key", ( () => {
			window.localStorage.getItem = () => {
				return null;
			};
			let _result = thisModule.has("foo");
			_result.should.not.be.ok;
			return true;
		}));

	});

});