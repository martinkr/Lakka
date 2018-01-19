/**
 * Specs for the module checking for freshness
 *
 * @copyright 2017 Martin Krause <github@mkrause.info> (http://martinkr.github.io)
 * @license MIT license: https://opensource.org/licenses/MIT
 *
 * @author Martin Krause <github@mkrause.info>
 */

/* eslint-env mocha */

const thisModulePath = "cache/check-freshness";
const thisModule = require("./../../app/" + thisModulePath);

describe(`The module "${thisModulePath}"`, () => {


	describe("should provide an unified API. It:", () => {

		it("should be a sync function", () => {
			(Object.getPrototypeOf(thisModule).constructor.name === "Function").should.be.ok;
		});
	});

	describe("should consume one argument. It:", () => {

		it("should return false if there are no arguments", (() => {
			thisModule().should.be.false;
		}));

		it("should return false if the first argument is a \"String\" and not an \"Object\"", (() => {
			thisModule("string").should.be.false;
		}));

		it("should return false if the first argument is an \"Array\" and not an \"Object\"", (() => {
			thisModule([]).should.be.false;
		}));

		it("should return false if the first argument is a \"Number\" and not an \"Object\"", (() => {
			thisModule(1).should.be.false;
		}));

		it("should return false if the first argument is a boolean \"false\" and not an \"Object\"", (() => {
			thisModule(false).should.be.false;
		}));

		it("should return false if the first argument is a boolean \"true\" and not an \"Object\"", (() => {
			thisModule(true).should.be.false;
		}));

		it("should return false if the first argument is an \"Object\" without \".until\"", (() => {
			thisModule({ "foo": "bar" }).should.be.false;
		}));


	});

	describe("should work as expected. It:", () => {

		it("should return false if there item is stale", (() => {
			thisModule({"until": Date.now() - 10000}).should.be.false;
		}));

		it("should return true if there item is fresh", (() => {
			thisModule({"until": Date.now() + 10000}).should.be.true;
		}));

	});

});
