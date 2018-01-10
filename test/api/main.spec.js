/**
 * Specs for setting a specific item from a given cache
 *
 * @copyright 2017 Martin Krause <github@mkrause.info> (http://martinkr.github.io)
 * @license MIT license: https://opensource.org/licenses/MIT
 *
 * @author Martin Krause <github@mkrause.info>
 */

 /* eslint-env mocha */

const thisModulePath = "api/main";
const proxyquire = require("proxyquire").noCallThru();
let thisModule;

let stubConfiguration;
let spyConfiguration;
let stubAfter;
let spyAfter;
let stubBefore;
let spyBefore;

describe(`The module "${thisModulePath}"`, () => {

	before((done) => {

		// create stubs for spying on them
		stubConfiguration = { "set": () => true };
		spyConfiguration = sinon.spy(stubConfiguration, "set");

		stubAfter = sinon.spy();
		spyAfter = stubAfter;

		stubBefore = sinon.spy();
		spyBefore = stubBefore;

		thisModule = proxyquire("./../../app/" + thisModulePath, {
			// replace dependencies mit spied on stubs
			"./../configuration/main.js": stubConfiguration,
			"./../api/after.js": stubAfter,
			"./../api/before.js": stubBefore
		});

		done();
	});

	beforeEach((done) => {

		done();
	});

	afterEach((done) => {
		stubAfter.reset();
		stubBefore.reset();
		spyConfiguration.reset();
		done();
	});

	after((done) => {
		done();
	});

	describe("should provide an unified API. It:", () => {

		it("should export a sync function \"configuration\"", () => {
			thisModule.configuration.should.be.a("function");
		});

		it("should export a sync function \"ignore\"", () => {
			thisModule.ignore.should.be.a("function");
		});

		it("should export a sync function \"after\"", () => {
			thisModule.after.should.be.a("function");
		});

		it("should export a sync function \"before\"", () => {
			thisModule.before.should.be.a("function");
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
