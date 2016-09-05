/**
 *
 * Specs for Lakka.
 *
 * Copyright (c) 2016 Martin Krause (mkrause.info)
 * Licensed under the MIT licenses.
 *
 * $ npm test
 * $ npm run coverage
 *
 **/

/*eslint-env node, mocha */

// import chai: the assertion framework (http://chaijs.com)
import chai from "../node_modules/chai/chai";

// import chai-plugin: assertions for promises (https://github.com/domenic/chai-as-promised)
import chaiAsPromised from "../node_modules/chai-as-promised/lib/chai-as-promised";

// import sinon: test spies, stubs and mocks (http://sinonjs.org/)
import sinon from "../node_modules/sinon/lib/sinon";
// import chai-plugin: assertions for sinon (https://github.com/domenic/sinon-chai)
import sinonChai from "../node_modules/sinon-chai/lib/sinon-chai";



// chai: setup assertion style and plugins
chai.should();
// chai.expect();
chai.use(sinonChai);
chai.use(chaiAsPromised);



const
	// module under test
	moduleName = "Lakka",
	moduleLocation = "./../src/main.js"
	;


const
	module = require(moduleLocation);

const
	keyOne = "http://localhost:3000/json/one",
	keyTwo = "http://localhost:3000/json/two",
	mockOne = JSON.stringify({"mock":"data", "id": 1})
;


/**! API test suite */
describe(`${moduleName}'s API:`, () => {

	before(() => { });
	beforeEach(() => { });
	afterEach(() => { });
	after(() => { });

	it("should expose a function 'set'", () => {
		module.set.should.be.a.function;
	});

	it("should expose a function 'get'", () => {
		module.get.should.be.a.function;
	});

	it("should expose a function 'clear'", () => {
		module.clear.should.be.a.function;
	});

	it("should expose a function 'length'", () => {
		module.length.should.be.a.function;
	});

});


/** API: set() */
describe(`${moduleName}'.set() `, () => {

	before(() => { });
	beforeEach(() => {
		module.clear();
	});
	afterEach(() => { });
	after(() => { });

	it("should return a promise'", () => {
		module.set(keyOne,mockOne).should.be.a("promise");
	});

	it("should be resolved with the stored data", () => {
		return module.set(keyOne,mockOne, {validity: 1}).should.become( mockOne );
	});

	it("should write an entry to the storage and be resolved", ( done ) => {
		let _count = module.length();
		module.set(keyOne,mockOne, {validity: 1}).should.be.fulfilled
			.then(function () {
				module.length().should.equal( _count + 1 );
			})
			.should.notify(done);
	});


	it("should write an string to the storage if the value is an JSON object", ( done ) => {
		let _count = module.length();
		module.set(keyOne, JSON.parse(mockOne), {validity: 1}).should.be.fulfilled
			.then(function () {
				module.length().should.equal( _count + 1 );
			})
			.should.notify(done);
	});

	it("should write an entry to the storage and be resolved with a string if the value is an JSON object", ( ) => {
		return module.set(keyOne, JSON.parse(mockOne), {validity: 1}).should.become( mockOne );
	});

	it("should be rejected with the stored data if the validity is '0' ", () => {
		return module.set(keyOne,mockOne, {validity: 0}).should.be.rejectedWith( mockOne );
	});

	it("should not write an entry to the storage and be rejected with the stored data if the validity is '0' ", ( done ) => {
		let _count = module.length();
		module.set(keyOne,mockOne, {validity: 0}).should.be.rejected
			.then(function () {
				module.length().should.equal( _count );
			})
			.should.notify(done);
	});

});



/** API: get() */
describe(`${moduleName}'.get() `, () => {

	before(() => { });
	beforeEach(( done ) => {
		module.clear();
		module.set(keyOne,mockOne, {validity: 1}).should.be.fulfilled.should.notify(done);
	});
	afterEach(() => { });
	after(() => { });

	it("should return a promise'", () => {
		return module.get(keyOne).should.be.a("promise");
	});

	it("should be resolved with the stored data ", () => {
		return module.get(keyOne,mockOne, {validity: 1}).should.eventually.become( mockOne );
	});

	it("should be rejected with the key if there is no item for this key", () => {
		return module.get(keyTwo).should.be.rejectedWith( keyTwo );
	});

	it("should be rejected with the key if the item's validity has expired", function ( done ) {
		this.timeout(65000);
		setTimeout(function () {
			return module.get(keyOne).should.be.rejectedWith( keyOne ).should.notify(done);
		},61000);
	});

});



/** API: length() */
describe(`${moduleName}'.length() `, () => {

	before(() => { });
	beforeEach(( ) => {
		module.clear();
	});
	afterEach(() => { });
	after(() => { });

	it("should return a number", () => {
		(module.length()).should.be.a("number");
	});

	it("should return the number of items", (done) => {
		module.set(keyOne,mockOne, {validity: 1}).should.be.fulfilled
			.then(function () {
				module.length().should.equal(  1 );
			})
			 .should.notify(done);
	});

});


/** API: clear() */
describe(`${moduleName}'.clear() `, () => {

	before(() => { });
	beforeEach(( done ) => {
		module.clear();
		module.set(keyOne,mockOne, {validity: 1}).should.be.fulfilled.should.notify(done);
	});
	afterEach(() => { });
	after(() => { });

	it("should clear all entries", () => {
		module.length().should.be.above(0);
		module.clear();
		module.length().should.be.equal(0);
	});

});



