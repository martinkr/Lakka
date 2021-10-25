/**
 * Specs for setting a specific item from a given cache
 *
 * @copyright 2017 Martin Krause <github@mkrause.info> (http://martinkr.github.io)
 * @license MIT license: https://opensource.org/licenses/MIT
 *
 * @author Martin Krause <github@mkrause.info>
 */

/* eslint-env mocha */

import thisModule, { $imports } from "./../../app/api/main";

const thisModulePath = "api/main";

let stubConfiguration;
let spyConfiguration;
let stubAfter;
let stubCache;
let spyAfter;
let stubBefore;
let spyBefore;
let spyCacheFlush;
let spyCacheDel;

describe(`The module "${thisModulePath}"`, () => {

	before((done) => {

		// create stubs for spying on them
		stubConfiguration = { "set": () => true };
		spyConfiguration = sinon.spy(stubConfiguration, "set");

		stubCache = { "flush": () => true, "del": () => true };
		spyCacheFlush = sinon.spy(stubCache, "flush");
		spyCacheDel = sinon.spy(stubCache, "del");


		stubAfter = sinon.spy();
		spyAfter = stubAfter;

		stubBefore = sinon.spy();
		spyBefore = stubBefore;

		// $imports.$mock((source, symbol, value) => {
		// 	console.log("source: '", source, "', symbol: '", symbol, "', value: '", value, "' ")
		// })
		// mock imports
		// import after from "./../api/after";
		// import before from "./../api/before";
		// import cacheFacade from "./../facade/localstorage";
		// import configuration from "./../configuration/main";
		$imports.$mock({
			// replace dependencies mit spied on stubs
			"./../configuration/main": {
				default: stubConfiguration
			},
			"./../api/after": {
				default: stubAfter
			},
			"./../api/before": {
				default: stubBefore
			},
			"./../facade/localstorage": {
				default: stubCache
			},
		});

		// thisModule = proxyquire("./../../app/" + thisModulePath, {
		// 	// replace dependencies mit spied on stubs
		// 	"./../configuration/main.js": stubConfiguration,
		// 	"./../api/after.js": stubAfter,
		// 	"./../api/before.js": stubBefore,
		// 	"./../facade/localstorage.js": stubCache
		// });
		// console.log(`${thisModulePath} thisModule => ${thisModule}`)
		done();
	});

	beforeEach((done) => {

		done();
	});

	afterEach((done) => {
		stubAfter.resetHistory();
		stubBefore.resetHistory();
		spyConfiguration.resetHistory();
		spyConfiguration.resetHistory();
		done();
	});

	after((done) => {
		done();
	});

	describe("should provide an unified API. It:", () => {

		it("should export a sync function \"configuration\"", () => {
			thisModule.configuration.should.be.a("function");
		});

		it("should export a sync function \"time\"", () => {
			thisModule.time.should.be.a("function");
		});

		it("should export a sync function \"recognize\"", () => {
			thisModule.recognize.should.be.a("function");
		});

		it("should export a sync function \"ignore\"", () => {
			thisModule.ignore.should.be.a("function");
		});

		it("should export a sync function \"flush\"", () => {
			thisModule.flush.should.be.a("function");
		});

		it("should export a sync function \"after\"", () => {
			thisModule.after.should.be.a("function");
		});

		it("should export a sync function \"before\"", () => {
			thisModule.before.should.be.a("function");
		});

	});

	describe("should have a working API \"time\". It:", () => {

		it("should call the \".set\"-function on the \"configuration\"-module with the correct - passed through - parameters", () => {
			thisModule.time(10)
			spyConfiguration.should.have.been.calledWith("minutes", 10);
		});

	});

	describe("should have a working API \"recognize\". It:", () => {

		it("should call the \".set\"-function on the \"configuration\"-module with the correct - passed through - parameters", () => {
			thisModule.recognize("testpattern")
			spyConfiguration.should.have.been.calledWith("include", "testpattern");
		});

	});

	describe("should have a working API \"ignore\". It:", () => {

		it("should call the \".set\"-function on the \"configuration\"-module with the correct - passed through - parameters", () => {
			thisModule.ignore("testpattern")
			spyConfiguration.should.have.been.calledWith("exclude", "testpattern");
		});

	});

	describe("should have a working API \"configuration\". It:", () => {

		it("should call the \".set\"-function on the \"configuration\"-module with the correct - passed through - parameters", () => {
			thisModule.configuration({})
			spyConfiguration.should.have.been.calledWith({});
		});

	});

	describe("should have a working API \"remove\". It:", () => {

		it("should call the \".del\"-function on the \"cache\"-module with the correct - passed through - parameters", () => {
			thisModule.remove("string")
			spyCacheDel.should.have.been.calledWith("string");
		});

	});

	describe("should have a working API \"flush\". It:", () => {

		it("should call the \".flush\"-function on the \"cache\"-module", () => {
			thisModule.flush()
			spyCacheFlush.should.have.been.called;
		});

	});

	describe("should have a working API \"after\". It:", () => {

		it("should call the  \"api/after\"-module with the correct - passed through - parameters", () => {
			thisModule.after("uri", "responseText", 200, {});
			spyAfter.should.have.been.calledWithExactly("uri", "responseText", 200, {});
		});

	});

	describe("should have a working API \"before\". It:", () => {

		it("should call the  \"api/before\"-module with the correct - passed through - parameters", () => {
			thisModule.before("uri", {});
			spyBefore.should.have.been.calledWith("uri", {});
		});

	});

});
