/**
 * Specs for determining if the content is cachable by lakka.
 * Lakka agressively caches json, html and text responses
 * We're looking at the content-type to find
 *
 * json
 * - "application/json",
 * - "text/x-json",
 *
 * text
 * - "text/plain"
 *
 * html
 * - "text/html"
 *
 * @copyright 2017 Martin Krause <github@mkrause.info> (http://martinkr.github.io)
 * @license MIT license: https://opensource.org/licenses/MIT
 *
 * @author Martin Krause <github@mkrause.info>
 */

/* eslint-env mocha */

import thisModule from "./../../app/header/valid-status-code";
const thisModulePath = "header/valid-status-code";

// these are the ones being detested
const validTyes = [
	"200",
	"203",
	"226"
];

// this is just an arbitrary list
const invalidTyes = [
	"100",
	"300",
	"400"
];



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

		it("should return false if there's no argument", () => {
			thisModule().should.be.false;
		});

		invalidTyes.forEach((obj) => {
			it(`should return false if the Content-Type is "${obj}"`, () => {
				thisModule(obj).should.be.false;
			});
		});

		validTyes.forEach((obj) => {
			it(`should return true if the Content-Type is "${obj}"`, () => {
				thisModule(obj).should.be.true;
			});
		});

	});
});
