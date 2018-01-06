/**
 * @description
 * Specs for the configuration functionality
 * This module provides the funcitonality to configure the lakka-cache.
 * @exports get ()
 * @exports set ()
 *
 * @copyright 2017 Martin Krause <github@mkrause.info> (http://martinkr.github.io)
 * @license MIT license: https://opensource.org/licenses/MIT
 *
 * @author Martin Krause <github@mkrause.info>
 */

 /* eslint-env mocha */

const thisModulePath = "configuration/main";
const thisModule = require("./../../app/" + thisModulePath);

describe(`The module "${thisModulePath}"`, () => {

	afterEach((done) => {
		done();
	});

	beforeEach(() => {
		let _object = {
			"include": [],
			"exclude": [],
			"minutes": 60
		};
		thisModule.set(_object);

	});


	describe("should provide an API. It:", () => {

		it("should export a function \"set\" which is sync", () => {
			(Object.getPrototypeOf(thisModule.set).constructor.name === "Function").should.be.ok;
		});

		it("should export a function \"get\" which is sync", () => {
			(Object.getPrototypeOf(thisModule.get).constructor.name === "Function").should.be.ok;
		});

	});


	describe("should have a default configuration. It:", () => {

		it("should cache items for 60minutes", (() => {
			let _result = thisModule.get("minutes");
			_result.should.equal(60);
		}));

		it("should not has an include pattern set", (() => {
			let _result = thisModule.get("include");
			_result.should.deep.equal([]);
		}));

		it("should not has an exclude pattern set", (() => {
			let _result = thisModule.get("exclude");
			_result.should.deep.equal([]);
		}));

	});

	describe("should have an API \"set\". It:", () => {

		it("should throw if we're missing one string arguments", (() => {
			try {
				thisModule.set("foo");
			} catch (err) {
				err.should.be.an("error");
				return true;
			}
			throw new Error("Failed");
		}));

		it("should throw if we're missing all arguments", (() => {
			try {
				thisModule.set();
			} catch (err) {
				err.should.be.an("error");
				return true;
			}
			throw new Error("Failed");
		}));

		it("should take a configuration object and store it", (() => {
			let _object = {
				"include": ["include/*"],
				"exclude": ["exclude/*"],
				"minutes": 200
			};
			thisModule.set(_object);
			let _result = thisModule.get("minutes");
			_result.should.equal(_object.minutes);
		}));

		it("should take a partial configuration object and merge it", (() => {
			let _object = {
				"include": ["include/*"],
				"minutes": 200
			};

			thisModule.set(_object);
			let _result = thisModule.get("minutes");

			_result.should.equal(_object.minutes);
			_result = thisModule.get("include");
			_result.should.equal(_object.include);

			// exclude should be the unmodified default
			_result = thisModule.get("exclude");
			_result.should.deep.equal([]);
		}));

		it("should throw if the object has invalid properties", (() => {
			try {
				thisModule.set({
					"foo": "bar"
				});
			} catch (err) {
				err.should.be.an("error");
				return true;
			}
			throw new Error("Failed");
		}));

		it("should take a configuration key-value pair and store the value", (() => {
			thisModule.set("minutes", 100);
			thisModule.set("minutes", 200);
			let _result = thisModule.get("minutes");
			_result.should.deep.equal(200);
		}));

		it("should throw if the key-value pair's key is invalid", (() => {
			try {
				thisModule.set("foo", "bar");
			} catch (err) {
				err.should.be.an("error");
				return true;
			}
			throw new Error("Failed");
		}));

		it("should throw if the key or a pair is not a string", (() => {
			try {
				thisModule.set(true, "value");
			} catch (err) {
				err.should.be.an("error");
				return true;
			}
			throw new Error("Failed");
		}));

		it("should throw if the value is an Object", (() => {
			try {
				thisModule.set("inlcude", {"foo": "bar"});
			} catch (err) {
				err.should.be.an("error");
				return true;
			}
			throw new Error("Failed");
		}));

		it("should throw if the value is an Array", (() => {
			try {
				thisModule.set("include", ["string"]);
			} catch (err) {
				err.should.be.an("error");
				return true;
			}
			throw new Error("Failed");
		}));

		it("should throw if the value is an Object", (() => {
			try {
				thisModule.set("include", {"foo": "bar"});
			} catch (err) {
				err.should.be.an("error");
				return true;
			}
			throw new Error("Failed");
		}));

		it("should throw if the value is a Function", (() => {
			try {
				thisModule.set("include", () => false );
			} catch (err) {
				err.should.be.an("error");
				return true;
			}
			throw new Error("Failed");
		}));

		it("should not throw if the value for \"minutes\" is a number ", (() => {
			let _result = thisModule.set("minutes", 999);
			_result.should.be.true;
		}));

		it("should throw if the value for \"minutes\" is not a parsable to a number ", (() => {
			try {
				thisModule.set("minutes", "bar");
			} catch (err) {
				err.should.be.an("error");
				return true;
			}
			throw new Error("Failed");
		}));

		it("should throw if the value for \"minutes\" is a boolean", (() => {
			try {
				thisModule.set("minutes", true);
			} catch (err) {
				err.should.be.an("error");
				return true;
			}
			throw new Error("Failed");
		}));

		it("should throw if the value for \"minutes\" is an Array", (() => {
			try {
				thisModule.set("minutes", [1]);
			} catch (err) {
				err.should.be.an("error");
				return true;
			}
			throw new Error("Failed");
		}));

		it("should throw if the value for \"minutes\" is an Object", (() => {
			try {
				thisModule.set("minutes", {"foo": "bar"});
			} catch (err) {
				err.should.be.an("error");
				return true;
			}
			throw new Error("Failed");
		}));

		it("should throw if the value for \"minutes\" is a Function", (() => {
			try {
				thisModule.set("minutes", () => false );
			} catch (err) {
				err.should.be.an("error");
				return true;
			}
			throw new Error("Failed");
		}));

		it("should not set a value twice for \"include\"", ( () => {
			thisModule.set("include", ".?");
			thisModule.set("include", ".?");
			let _result = thisModule.get("include");
			_result.should.have.a.lengthOf(1);
		}));

		it("should not set a value twice for \"exclude\"", ( () => {
			thisModule.set("exclude", ".?");
			thisModule.set("exclude", ".?");
			let _result = thisModule.get("exclude");
			_result.should.have.a.lengthOf(1);
		}));

		it("should convert the value for \"include\" to a regexp", ( () => {
			thisModule.set("include", ".?");
			let _result = thisModule.get("include");
			_result[0].should.be.a("RegExp");
		}));

		it("should convert the value for \"exclude\" to a regexp", ( () => {
			thisModule.set("exclude", ".?");
			let _result = thisModule.get("exclude");
			_result[0].should.be.a("RegExp");
		}));

	});

	describe("should have an API \"get\". It:", () => {


		it("should take one string argument", (() => {
			thisModule.get("minutes");
			(true).should.be.ok;
		}));

		it("should throw if we're missing all arguments", (() => {
			try {
				thisModule.get();
			} catch (err) {
				err.should.be.an("error");
				return true;
			}
			throw new Error("Failed");
		}));

		it("should throw if the key is a boolean", (() => {
			try {
				thisModule.get(true);
			} catch (err) {
				err.should.be.an("error");
				return true;
			}
			throw new Error("Failed");
		}));

		it("should throw if the key is an Array", (() => {
			try {
				thisModule.get([1]);
			} catch (err) {
				err.should.be.an("error");
				return true;
			}
			throw new Error("Failed");
		}));

		it("should throw if the key is an Object", (() => {
			try {
				thisModule.get({"foo": "bar"});
			} catch (err) {
				err.should.be.an("error");
				return true;
			}
			throw new Error("Failed");
		}));

		it("should throw if the key is not valid", (() => {
			try {
				thisModule.get("foo");
			} catch (err) {
				err.should.be.an("error");
				return true;
			}
			throw new Error("Failed");
		}));

		it("should return a number for \"minutes\"", (() => {
			let _result = thisModule.get("minutes");
			_result.should.be.a("number");
		}));

		it("should return an array for \"include\"", ( () => {
			let _result = thisModule.get("include");
			_result.should.be.an("array");
		}));

		it("should return an array with regexp for \"include\"", ( () => {
			thisModule.set("include", ".?");
			let _result = thisModule.get("include");
			_result[0].should.be.a("RegExp");
		}));

		it("should return an array for \"exclude\"", ( () => {
			let _result = thisModule.get("exclude");
			_result.should.be.an("array");
		}));

		it("should return an array with regexp for \"exclude\"", ( () => {
			thisModule.set("exclude", ".?");
			let _result = thisModule.get("exclude");
			_result[0].should.be.a("RegExp");
		}));


	});




});
