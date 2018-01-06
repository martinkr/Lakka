/**
 * Specs for calculatingthe validtiy item of a cache item
 *
 * Calculates the timestamp until this cache entry is valid
 * Looks at the cache-control Header, the expires header and finally the default value.
 * Returns a timestamp in ms.
 *
 * Should Calculate the expires valure from  "max-age=<seconds>" and "Expires" header.
 * If both Expires and max-age are set max-age will take precedence

 *
 * @copyright 2017 Martin Krause <github@mkrause.info> (http://martinkr.github.io)
 * @license MIT license: https://opensource.org/licenses/MIT
 *
 * @author Martin Krause <github@mkrause.info>
 */

/* eslint-env amd, mocha */


const thisModulePath = "cache/calculate-validity";
const thisModule = require("./../../app/" + thisModulePath);
const oneHour = 1000 * 60 * 60;
let cacheControlHeader;
let expiresHeader;
let defaultValidity;


const inTwoHours = () => {
	let now = new Date();
	return new Date(now.getTime() + oneHour + oneHour).getTime();
};

describe(`The module "${thisModulePath}"`, () => {

	afterEach((done) => {
		done();
	});

	beforeEach((done) => {
		cacheControlHeader =  "public, max-age=" + (60*60*60*60) + ", must-validate" // one hour
		expiresHeader = "" + new Date(inTwoHours());
		defaultValidity = oneHour;
		done();
	});

	describe("should provide an unified API. It:", () => {

		it("should export a sync function ", () => {
			thisModule.should.be.a("function");
		});

		it("should return the timestamp in ms", () => {
			thisModule(cacheControlHeader, expiresHeader, defaultValidity).should.be.a("Number");
		});

		it("should calculate the value from the Cache-Control HTTP-Header (first argument) if given and max-age is the first item", () => {
			const _seed = Math.floor(Math.random() * 999999999999);
			const _resultBase = new Date().getTime() + _seed;
			cacheControlHeader =  "max-age=" + _seed + ", must-validate";
			// max-age contains now + the msseconds for an hour: the validity should be the seeded number plus a bit for runtime
			thisModule(cacheControlHeader, expiresHeader, defaultValidity).should.be.within(Number( _resultBase), Number(_resultBase + 100) );
		});

		it("should calculate the value from the Cache-Control HTTP-Header (first argument) if given and max-age is an item", () => {
			const _seed = Math.floor(Math.random() * 999999999999);
			const _resultBase = new Date().getTime() + _seed;
			cacheControlHeader =  "public, max-age=" + _seed + ", must-validate";
			// max-age contains now + the msseconds for an hour: the validity should be around one hour (+/- 60sec)
			thisModule(cacheControlHeader, expiresHeader, defaultValidity).should.be.within(Number( _resultBase), Number(_resultBase + 100) );
		});

		it("should calculate the value from the Cache-Control HTTP-Header (first argument) if given and max-age is the last item", () => {
			const _seed = Math.floor(Math.random() * 999999999999);
			const _resultBase = new Date().getTime() + _seed;
			cacheControlHeader =  "public, max-age=" + _seed;
			// max-age contains now + the msseconds for an hour: the validity should be around one hour (+/- 60sec)
			thisModule(cacheControlHeader, expiresHeader, defaultValidity).should.be.within(Number( _resultBase), Number(_resultBase + 100) );
		});

		it("should calculate the value from the Expires HTTP-Header (second argument) if the Cache-Control HTTP-Header has no \"max-age\" ", () => {
			cacheControlHeader =  "public";
			// Expires contains a future timestamp: the validity should be around two hours (+/- 60sec)
			thisModule(cacheControlHeader, expiresHeader, defaultValidity).should.be.within(inTwoHours() - (1000 * 60), inTwoHours() + (1000 * 60));
		});

		it("should calculate the value from the Expires HTTP-Header (second argument) if the Cache-Control HTTP-Header is empty ", () => {
			// Expires contains a timestamp in two hours : the validity should be around two hours (+/- 60sec)
			thisModule(null, expiresHeader, defaultValidity).should.be.within(inTwoHours() - (1000 * 60), inTwoHours() + (1000 * 60));
		});

		it("should calculate the value from the Expires HTTP-Header (second argument) if the Cache-Control HTTP-Header is not a number ", () => {
			cacheControlHeader =  "public, max-age=foo";
			// Expires contains a timestamp in two hours : the validity should be around two hours (+/- 60sec)
			thisModule(cacheControlHeader, expiresHeader, defaultValidity).should.be.within(inTwoHours() - (1000 * 60), inTwoHours() + (1000 * 60));
		});

		it("should calculate the value from the default value if the Expires HTTP-Header is not evaluable (0) and the Cache-Control HTTP-Header is empty", () => {
			// expires contains a timestamp not a valid datestring
			expiresHeader = "" + "0";
			const _resultBase = new Date().getTime();
			// default is one hour : the validity should be around one hour (+/- 60sec)
			thisModule(null, expiresHeader, defaultValidity).should.be.within(_resultBase + oneHour - (1000 * 60), _resultBase + oneHour + (1000 * 60));
		});

		it("should calculate the value from the default value if the Expires HTTP-Header is not evaluable (1234) and the Cache-Control HTTP-Header is empty", () => {
			// expires contains a timestamp not a valid datestring
			expiresHeader = "" + "1234";
			const _resultBase = new Date().getTime();
			// default is one hour : the validity should be around one hour (+/- 60sec)
			thisModule(null, expiresHeader, defaultValidity).should.be.within(_resultBase + oneHour - (1000 * 60), _resultBase + oneHour + (1000 * 60));
		});

		it("should calculate the value from the default value if the Expires HTTP-Header is not evaluable (foobar) and the Cache-Control HTTP-Header is empty", () => {
			// expires contains a timestamp not a valid datestring
			expiresHeader = "" + "foobar";
			const _resultBase = new Date().getTime();
			// default is one hour : the validity should be around one hour (+/- 60sec)
			thisModule(null, expiresHeader, defaultValidity).should.be.within(_resultBase + oneHour - (1000 * 60), _resultBase + oneHour + (1000 * 60));
		});

		it("should calculate the value from the default value if the Expires HTTP-Header (second argument) and the Cache-Control HTTP-Header are empty", () => {
			const _resultBase = new Date().getTime();
			// default is one hour : the validity should be around one hour (+/- 60sec)
			thisModule(null, null, defaultValidity).should.be.within(_resultBase + oneHour - (1000 * 60), _resultBase + oneHour + (1000 * 60));
		});

		it("should calculate the value from the default value if the Expires HTTP-Header (second argument)is empty and the Cache-Control HTTP-Header has no max-age", () => {
			cacheControlHeader =  "public"
			const _resultBase = new Date().getTime();
			// default is one hour : the validity should be around one hour (+/- 60sec)
			thisModule(cacheControlHeader, null, defaultValidity).should.be.within(_resultBase + oneHour - (1000 * 60), _resultBase + oneHour + (1000 * 60));
		});


	});

});
