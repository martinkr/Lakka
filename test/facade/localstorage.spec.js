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
let spyFlush;


describe(`The module "${thisModulePath}"`, () => {

	afterEach((done) => {
		global.window.localStorage.clear();
		spySet.restore();
		spyGet.restore();
		spyDel.restore();
		spyFlush.restore();
		done();
	});


	before((done) => {
		done();
	});
	beforeEach((done) => {
		spySet = sinon.spy(global.window.localStorage, "setItem");
		spyGet = sinon.spy(global.window.localStorage, "getItem");
		spyDel = sinon.spy(global.window.localStorage, "removeItem");
		spyFlush = sinon.spy(global.window.localStorage, "clear");
		done();
	});

	after((done) => {
		spySet.resetHistory();
		spyGet.resetHistory();
		spyDel.resetHistory();
		spyFlush.resetHistory();
		done();
	});


	describe("should provide an unified API. It:", () => {

		it("should export a function \"set\" which is sync", () => {
			(Object.getPrototypeOf(thisModule.set).constructor.name === "Function").should.be.ok;
		});

		it("should export a function \"get\" which is sync", () => {
			(Object.getPrototypeOf(thisModule.get).constructor.name === "Function").should.be.ok;
		});

		it("should export a function \"del\" which is sync", () => {
			(Object.getPrototypeOf(thisModule.del).constructor.name === "Function").should.be.ok;
		});

	});



	describe("should have an API \"set\". It:", () => {

		it("should return true if everything is fine", (() => {
			let _result;
			try {
				_result = thisModule.set("foo", "bar");
			} catch (err) {
				console.error("error: ", err)
			}
			_result.should.be.ok;
			return true;
		}));

		it("should call \"window.localStorage.setItem\" and save the values unter \"lakka\"", (() => {
			try {
				thisModule.set("foo", "bar");
			} catch (err) {
				console.error("error: ", err)
			}
			spySet.should.have.been.calledWith("lakka", JSON.stringify({
				"foo": "bar"
			}));
			return true;
		}));


		it("should call \"window.localStorage.setItem\" and save the values unter \"lakka\" even if there are already values", (() => {
			try {
				thisModule.set("foo", "foofoo");
				thisModule.set("bar", "barfoo");
				thisModule.set("baz", "bazfoo");
			} catch (err) {
				console.error("error: ", err)
			}
			spySet.should.have.been.calledWith("lakka", JSON.stringify({
				"foo": "foofoo",
				"bar": "barfoo",
				"baz": "bazfoo"
			}));
			return true;
		}));


		it("should save Strings only (stringify an Object)", (() => {
			try {
				thisModule.set("foo", {
					"bar": "baz"
				});
			} catch (err) {
				console.error("error: ", err)
			}
			spySet.should.have.been.calledWith("lakka", JSON.stringify({
				"foo": {
					"bar": "baz"
				}
			}));
			return true;
		}));

		it("should save Strings only (stringify an Array)", (() => {
			try {
				thisModule.set("foo", ["bar", "baz"]);
			} catch (err) {
				console.error("error: ", err)
			}
			spySet.should.have.been.calledWith("lakka", JSON.stringify({
				"foo": ["bar", "baz"]
			}));
			return true;
		}));

		it("should save Strings only (stringify a Number)", (() => {
			try {
				thisModule.set("foo", 10);
			} catch (err) {
				console.error("error: ", err)
			}
			spySet.should.have.been.calledWith("lakka", JSON.stringify({
				"foo": 10
			}));
			return true;
		}));

		it("should save Strings only (stringify a Boolean true)", (() => {
			try {
				thisModule.set("foo", true);
			} catch (err) {
				console.error("error: ", err)
			}
			spySet.should.have.been.calledWith("lakka", JSON.stringify({
				"foo": true
			}));
			return true;
		}));

		it("should throw if the value evaluates to false (false)", (() => {
			try {
				thisModule.set("foo", false);
			} catch (err) {
				err.should.be.an("error");
				return true;
			}
			throw new Error("Failed");
		}));


		it("should create a fresh \"lakka\"-object if the storage is blank ", (() => {
			global.window.localStorage.clear();
			try {
				thisModule.set("foo", "bar");
			} catch (err) {
				console.error("error: ", err)
			}
			spySet.should.have.been.calledWith("lakka", JSON.stringify({
				"foo": "bar"
			}));
		}));


		it("should throw if the value evaluates to false (0)", (() => {
			try {
				thisModule.set("foo", 0);
			} catch (err) {
				err.should.be.an("error");
				return true;
			}
			throw new Error("Failed");
		}));

		it("should not throw if the value is an empty string (\"\")", (() => {
			try {
				thisModule.set("foo", "");
			} catch (err) {
				console.error("error: ", err)
			}
			spySet.should.have.been.calledWith("lakka", JSON.stringify({
				"foo": ""
			}));
			return true;
		}));


		it("should throw if \"window.localStorage.setItem\" is not available", (() => {
			spySet.resetHistory();
			window.localStorage.setItem = undefined;

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

		it("should call \"window.localStorage.getItem\" and get the \"lakka\" object", (() => {
			try {
				thisModule.get("foo");
			} catch (err) {
				// console.error("error: ", err)
			}
			spyGet.should.have.been.calledWith("lakka");
			return true;
		}));

		it("should throw if \"window.localStorage.getItem\" is not available", (() => {
			spyGet.resetHistory();
			window.localStorage.getItem = undefined;

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

		it("should return the value from the \"lakka\" object stored at window.localStorage", (() => {
			window.localStorage.setItem("lakka", JSON.stringify({
				"foo": {
					"bar": "baz"
				}
			}));
			let _result = thisModule.get("foo");
			_result.should.deep.equal({
				"bar": "baz"
			});
			return true;
		}));

		it("should return the value from the \"lakka\" object stored at window.localStorage even if there are a multiple items", (() => {

			thisModule.set("foo", "foofoo");
			thisModule.set("bar", {
				"foo": "bar"
			});
			thisModule.set("baz", ["foo", "baz"]);
			spySet.should.have.been.calledWith("lakka", JSON.stringify({
				"foo": "foofoo",
				"bar": {
					"foo": "bar"
				},
				"baz": ["foo", "baz"]
			}));

			let _result = thisModule.get("bar");
			_result.should.deep.equal({
				"foo": "bar"
			});
			return true;
		}));


		it("should return the value from window.localStorage - \"null\" if there's no value for the key", (() => {
			window.localStorage.setItem("lakka", JSON.stringify({
				"foo": null
			}));
			let _result = thisModule.get("foo");
			(_result === null).should.be.true;
			return true;
		}));

		it("should return the value from window.localStorage - \"null\" if there's no item for the key", (() => {
			window.localStorage.setItem("lakka", JSON.stringify({
				"foo": null
			}));
			let _result = thisModule.get("bar");
			(_result === null).should.be.true;
			return true;
		}));

	});


	describe("should have an API \"del\". It:", () => {

		it("should return true if everything is fine", (() => {
			let _result;
			try {
				thisModule.set("foo", "foofoo");
				spySet.resetHistory();
				_result = thisModule.del("foo");
			} catch (err) {
				console.error("error: ", err)
			}
			_result.should.be.ok;
			return true;
		}));

		it("should call \"window.localStorage.setItem\" with a \"lakka\" object cleaned of the item", (() => {
			try {
				thisModule.set("foo", "foofoo");
				spySet.resetHistory();
				thisModule.del("foo");
			} catch (err) {
				console.error("error: ", err)
			}
			spySet.should.have.been.calledWith("lakka", JSON.stringify({}));
			return true;
		}));

		it("should call \"window.localStorage.setItem\" with a \"lakka\" object cleaned of the item and preserve existing", (() => {
			try {
				thisModule.set("foo", "foofoo");
				thisModule.set("bar", {
					"foo": "bar"
				});
				thisModule.set("baz", ["foo", "baz"]);
				spySet.should.have.been.calledWith("lakka", JSON.stringify({
					"foo": "foofoo",
					"bar": {
						"foo": "bar"
					},
					"baz": ["foo", "baz"]
				}));

				thisModule.del("foo");
			} catch (err) {
				console.error("error: ", err)
			}
			spySet.should.have.been.calledWith("lakka", JSON.stringify({
				"bar": {
					"foo": "bar"
				},
				"baz": ["foo", "baz"]
			}));
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

	describe("should have an API \"flush\". It:", () => {

		it("should return true if everything is fine", (() => {
			let _result;
			try {
				thisModule.set("foo", "foofoo");
				spySet.resetHistory();
				_result = thisModule.flush();
			} catch (err) {
				console.error("error: ", err)
			}
			_result.should.be.ok;
			return true;
		}));

		it("should not call \"window.localStorage.clear\"", (() => {
			try {
				thisModule.flush();
			} catch (err) {
				console.error("error: ", err)
			}
			spyFlush.should.not.have.been.called;
			return true;
		}));

		it("should call \"window.localStorage.setItem\" with an empty \"lakak\" object", (() => {
			try {
				thisModule.set("foo", "foofoo");
				thisModule.set("bar", {
					"foo": "bar"
				});
				thisModule.set("baz", ["foo", "baz"]);
				spySet.should.have.been.calledWith("lakka", JSON.stringify({
					"foo": "foofoo",
					"bar": {
						"foo": "bar"
					},
					"baz": ["foo", "baz"]
				}));
				spySet.resetHistory();
				thisModule.flush();
			} catch (err) {
				console.error("error: ", err)
			}
			spySet.should.have.been.calledWith("lakka", JSON.stringify({}));
			return true;
		}));
	});


});
