// /**
//  * The Specs for a curried function returning the value or "defaultValue"
//  * for the header-property "which" from the "headers" object.
//  * Handles the the default value fallback and lowercase properties
//  *
//  *
//  * @copyright 2017 Martin Krause <github@mkrause.info> (http://martinkr.github.io)
//  * @license MIT license: https://opensource.org/licenses/MIT
//  *
//  * @author Martin Krause <github@mkrause.info>
//  */
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

const thisModulePath = "header/utils/get-value";
const thisModule = require("./../../../app/" + thisModulePath);


let	headers = {
	"X-Foo": "foo",
	"X-Bar": "bar"
};

const foobar = "foobar";

describe(`The module "${thisModulePath}"`, () => {


	afterEach((done) => {
		done();
	});

	beforeEach((done) => {
		headers = {
			"X-Foo": "foo",
			"X-Bar": "bar"
		};
		done();
	});

	describe("should provide an unified API. It:", () => {

		it("should export a sync function ", () => {
			thisModule.should.be.a("function");
		});
	});

	describe("should take up to three parameters (curried function). It:", () => {

		it("should return \"null\" if the second curried function's param is omitted", (() => {
			let _result = thisModule(headers)()(foobar);
			(_result === null).should.be.true;
		}));

		it("should return \"null\" if the first curried function's param and the third curried function's param are omitted", (() => {
			let _result = thisModule()("X-Foo")();
			(_result === null).should.be.true;
		}));

		it("should return \"null\" if the first curried function's param and the second curried function's param and the third curried function's param are omitted", (() => {
			let _result = thisModule()()();
			(_result === null).should.be.true;
		}));

	});

	describe("should use the thirds function's param as default value. It:", () => {

		it("should return the default value if there's one and the first curried function's param is omitted", (() => {
			thisModule()("X-Foo")(foobar).should.equal(foobar);
		}));

		it("should return the default value if there's one and the first curried function's param and the second curried function's param are omitted", (() => {
			thisModule()()(foobar).should.equal(foobar);
		}));


	});

	describe("should work as expected. It:", () => {

		it("should return the value if there's a value at the first curried function's parameters object under the seconds curried function's parameter as key", (() => {
			thisModule(headers)("X-Bar")().should.be.equal(headers["X-Bar"]);
		}));

		it("should return the value if there's a value and the value passes the first curried function's parameter condition ", (() => {
			delete headers["X-Bar"];
			headers["x-bar"] = "foo";
			thisModule(headers)("X-Bar")().should.be.equal(headers["x-bar"]);
		}));


		it("should return the default value if there's a third curried function parameter and no value at the first curried function's parameters object under the seconds curried function's parameter as key", (() => {
			delete headers["X-Bar"];
			thisModule(headers)("X-Bar")(foobar).should.be.equal(foobar);
		}));

		it("should return null if there's no third curried function parameter and no value at the first curried function's parameters object under the seconds curried function's parameter as key", (() => {
			delete headers["X-Bar"];
			let _result = thisModule(headers)("X-Bar")();
			(_result === null).should.be.true;
		}));


	});
});
