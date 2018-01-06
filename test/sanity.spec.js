/* eslint-env mocha */

const fs = require("fs-extra-plus");

const timeout = (fn) => new Promise((resolve) => setTimeout(() => resolve(fn()), 250));


describe("sanity checks for the mocha test suite", () => {
	describe("the mocha async wrapper should work as expected", () => {

		it("Simple async/await mocha test", (async () => {
			let x = await timeout(() => "Hello World!");
			(x).should.equal("Hello World!");
		}));

		it("the mocha async wrapper should work as expected with mutliple async / awaits", (async () => {
			let x = await timeout(() => "Hello World!x");
			let y = await timeout(() => "Hello World!y");
			let z = await timeout(() => "Hello World!z");
			(x).should.equal("Hello World!x");
			(y).should.equal("Hello World!y");
			(z).should.equal("Hello World!z");
		}));

		it("the mocha async wrapper should work with the filesystem", (async () => {
			let _fileTrue = "./test/sanity.spec.js";
			let _fileFalse = "./test/none.txt";
			let x = await timeout(() => fs.pathExists(_fileTrue));
			let y = await timeout(() => fs.pathExists(_fileFalse));
			(x).should.be.ok;
			(y).should.not.be.ok;
		}));

	});
});
