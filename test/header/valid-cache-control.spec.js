/**
 * Specs for checking if the "Cache-Control" HTTP-Header content prevents us from caching the request
 * (inbound and outbound)
 *
 * LAKKA is agressive. We're caching everything except if the header contains:
 * "must-revalidate"
 *	The cache must verify the status of the stale resources before using it and expired ones should not be used.
 * "no-store"
 * 	The cache should not store anything about the client request or server response.
 * "no-cache"
 * 	Forces caches to submit the request to the origin server for validation before releasing a cached copy.
 *
 * @copyright 2017 Martin Krause <github@mkrause.info> (http://martinkr.github.io)
 * @license MIT license: https://opensource.org/licenses/MIT
 *
 * @author Martin Krause <github@mkrause.info>
 */

/* eslint-env mocha */


import thisModule from "./../../app/header/valid-cache-control";
const thisModulePath = "header/valid-cache-control";

const headersIgnore = [{
	"pattern": "must-revalidate",
	"content": "must-revalidate"
},
{
	"pattern": "no-store",
	"content": "no-store"
},
{
	"pattern": "no-cache",
	"content": "no-store"
},
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

		it("should return true if there's no argument", () => {
			thisModule().should.be.true;
		});

		it("should return true if the first argument is not a String", () => {
			thisModule([]).should.be.true;
		});

		it(`should return true if the string contains does not contain an ignore pattern`, () => {
			thisModule("immutable, max-age=500, s-maxage=500").should.be.true;
		});

		headersIgnore.forEach((obj) => {
			it(`should return false if the string contains "${obj.pattern}"`, () => {
				thisModule(obj.content).should.be.false;
			});
		});

	});
});
