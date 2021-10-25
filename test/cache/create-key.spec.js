/**
 * Specs for creating the key out of the uri
 *
 * @copyright 2017 Martin Krause <github@mkrause.info> (http://martinkr.github.io)
 * @license MIT license: https://opensource.org/licenses/MIT
 *
 * @author Martin Krause <github@mkrause.info>
 */

/* eslint-env mocha */

import thisModule from "./../../app/cache/create-key";
const thisModulePath = "cache/create-key";

const uri = "protocol://path/to/my/resouce";
const validKey = escape(uri);

describe(`The module "${thisModulePath}"`, () => {

	afterEach((done) => {
		done();
	});

	beforeEach((done) => {
		done();
	});

	describe("should provide an unified API. It:", () => {

		it("should export a sync function ", () => {
			thisModule.should.be.a("function");
		});

		it("should throw an error if the first argument is not a string", () => {
			try {
				thisModule(true);
			} catch (e) {
				e.should.be.an("error");
				return true;
			}
			(true).should.not.be.true;
		});

		it("should return the key", () => {
			thisModule(uri).should.equal(validKey);
		});

	});

});
