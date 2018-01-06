/**
 * Specs for the pattern match function
 * This module provides the specs for the
 * pattern match functionality
 *
 * @copyright 2017 Martin Krause <github@mkrause.info> (http://martinkr.github.io)
 * @license MIT license: https://opensource.org/licenses/MIT
 *
 * @author Martin Krause <github@mkrause.info>
 */

/* eslint-env mocha */

const thisModulePath = "pattern-match/main";
const thisModule = require("./../../app/" + thisModulePath);

const uri = "protocol://path/to/my/resouce";
let patterns;

describe(`The module "${thisModulePath}"`, () => {

	afterEach((done) => {
		done();
	});

	beforeEach((done) => {
		patterns = [];
		done();
	});

	describe("should provide an unified API. It:", () => {

		it("should export a sync function ", () => {
			thisModule.should.be.a("function");
		});

		it("should throw an error if the first argument is not a string", () => {
			try {
				thisModule(true, patterns);
			} catch (e) {
				e.should.be.an("error");
				return true;
			}
			(true).should.not.be.true;
		});

		it("should throw an error if the second argument is not an array", () => {
			try {
				thisModule(uri, {});
			} catch (e) {
				e.should.be.an("error");
				return true;
			}
			(true).should.not.be.true;
		});

		it("should throw an error if one argument is missing", () => {
			try {
				thisModule("foo");
			} catch (e) {
				e.should.be.an("error");
				return true;
			}
			(true).should.not.be.true;
		});

		it("should throw an error if both arguments are missing", () => {
			try {
				thisModule();
			} catch (e) {
				e.should.be.an("error");
				return true;
			}
			(true).should.not.be.true;
		});

		it("should return true if the regular expression does match the uri", (async() => {
			patterns.push(new RegExp("path"));
			thisModule(uri, patterns).should.be.true;
		}));

		it("should return false if the regular expression does not match the uri", (async() => {
			patterns.push(new RegExp("fail"));
			thisModule(uri, patterns).should.be.false;
		}));


	});

});
