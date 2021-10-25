/**
 *
 * The Specs for a small utility function that throws an error if the value evalutes to false
 *
 * @copyright 2017 Martin Krause <github@mkrause.info> (http://martinkr.github.io)
 * @license MIT license: https://opensource.org/licenses/MIT
 *
 * @author Martin Krause <github@mkrause.info>
 */

/* eslint-env mocha */

import thisModule from "./../../app/utils/throw-invalid";
const thisModulePath = "utils/throw-invalid";
describe(`The module "${thisModulePath}"`, () => {

	describe("should provide an unified API. It:", () => {

		it("should export a sync function ", () => {
			thisModule.should.be.a("function");
		});
	});

	describe("should work as expected. It:", () => {

		it("should throw if the value is \"false\"", (() => {
			try {
				thisModule(false);
			} catch (err) {
				err.should.be.an("error");
				return true;
			}
			throw new Error("Failed");
		}));

		it("should throw if the value is \"undefined\"", (() => {
			try {
				thisModule(undefined);
			} catch (err) {
				err.should.be.an("error");
				return true;
			}
			throw new Error("Failed");
		}));

		it("should throw if the value is \"null\"", (() => {
			try {
				thisModule(null);
			} catch (err) {
				err.should.be.an("error");
				return true;
			}
			throw new Error("Failed");
		}));

		it("should throw if the value is \"\"", (() => {
			try {
				thisModule();
			} catch (err) {
				err.should.be.an("error");
				return true;
			}
			throw new Error("Failed");
		}));

		it("should throw if the value is an \"Error\"", (() => {
			try {
				thisModule(new Error());
			} catch (err) {
				err.should.be.an("error");
				return true;
			}
			throw new Error("Failed");
		}));

		it("should not throw if the value is \"true\"", (() => {
			try {
				thisModule(true);
			} catch (err) {
				throw new Error("Failed");
			}
			return true;
		}));

		it("should not throw if the value is a \"Number\"", (() => {
			try {
				thisModule(100);
			} catch (err) {
				throw new Error("Failed");
			}
			return true;
		}));

		it("should not throw if the value is a \"String\"", (() => {
			try {
				thisModule("string");
			} catch (err) {
				throw new Error("Failed");
			}
			return true;
		}));

		it("should not throw if the value is an \"Array\"", (() => {
			try {
				thisModule([]);
			} catch (err) {
				throw new Error("Failed");
			}
			return true;
		}));

		it("should not throw if the value is an \"Object\"", (() => {
			try {
				thisModule({});
			} catch (err) {
				throw new Error("Failed");
			}
			return true;
		}));

		it("should not throw if the value is 0", (() => {
			try {
				thisModule(0);
			} catch (err) {
				throw new Error("Failed");
			}
			return true;
		}));


	});

});
