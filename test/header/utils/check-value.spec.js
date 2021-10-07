/**
 *
 * The Specs for a curried function returning if the value for a "header" property
 * inside the "options.headers" object is valid as decided by "fn"
 *
 *
 * @copyright 2017 Martin Krause <github@mkrause.info> (http://martinkr.github.io)
 * @license MIT license: https://opensource.org/licenses/MIT
 *
 * @author Martin Krause <github@mkrause.info>
 */

/* eslint-env mocha */

const thisModulePath = "header/utils/check-value";
const thisModule = require("./../../../app/" + thisModulePath);

let fn = {
	"fooFn": (value) => value === "foo"
}

let options = {
	"headers": {
		"X-Foo": "foo",
		"X-Bar": "bar",
	}
}

describe(`The module "${thisModulePath}"`, () => {

	let spy = sinon.spy(fn, "fooFn");

	afterEach((done) => {
		spy.resetHistory();
		done();
	});

	after((done) => {
		spy.restore();
		done();
	});

	beforeEach((done) => {
		options = {
			"headers": {
				"X-Foo": "foo",
				"X-Bar": "bar",
			}
		};
		done();
	});

	describe("should provide an unified API. It:", () => {

		it("should export a sync function ", () => {
			thisModule.should.be.a("function");
		});
	});

	describe("should take up to three parameters (curried function). It:", () => {

		it("should throw if the first curried function's param is omitted", (() => {
			try {
				thisModule()()();
			} catch (err) {
				err.should.be.an("error");
				return true;
			}
			throw new Error("Failed");
		}));

		it("should throw if the first curried function's param is not a \"Function\"", (() => {
			try {
				thisModule(1)()();
			} catch (err) {
				err.should.be.an("error");
				return true;
			}
			throw new Error("Failed");
		}));

		it("should return \"true\" if the second curried function's param is omitted", (() => {
			thisModule(fn.fooFn)()("X-Foo").should.be.true;
			thisModule(fn.fooFn)()().should.be.true;
		}));

		it("should return \"true\" if the second curried function's param does not have a headers-propertry", (() => {
			delete options.headers;
			thisModule(fn.fooFn)(options)("X-Foo").should.be.true;
		}));

		it("should return \"true\" if the third curried function's param is omitted", (() => {
			thisModule(fn.fooFn)(options)().should.be.true;
			thisModule(fn.fooFn)()().should.be.true;
		}));
	});

	describe("should work as expected. It:", () => {

		it("should call the first curried function's parameter with the value in the second function's parameter's object stored under the third function's parameter as key", (() => {
			thisModule(fn.fooFn)(options)("X-Foo");
			spy.should.have.been.calledWith(options.headers["X-Foo"]);
		}));

		it("should return \"true\" and not throw if there's a value and the value passes the first curried function's parameter condition ", (() => {
			thisModule(fn.fooFn)(options)("X-Foo").should.be.true;
		}));

		it("should return \"true\" if there's no value from the second and third parameter", (() => {
			options.headers["X-Empty"] = null;
			thisModule(fn.fooFn)(options)("X-Empty").should.be.true;
		}));

		it("should return \"true\" if there's no property with third parameter at the second parameter's object", (() => {
			delete options.headers["X-Empty"];
			thisModule(fn.fooFn)(options)("X-Empty").should.be.true;
		}));

		it("should return \"true\" if there's a value and the value passes the first curried function's parameter condition and the key is lowercase ", (() => {
			delete options.headers["X-Bar"];
			options.headers["x-bar"] = "foo";
			thisModule(fn.fooFn)(options)("X-Bar").should.be.true;
		}));

		it("should not throw if there's a value and the value does not pass the first curried function's parameter condition ", (() => {
			try {
				thisModule(fn.fooFn)(options)("X-Bar");
			} catch (err) {
				err.should.be.an("error");
				return true;
			}
			throw new Error("Failed");
		}));

	});


});
