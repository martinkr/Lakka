/**
 * Specs for setting a specific item from a given cache
 *
 * @copyright 2017 Martin Krause <github@mkrause.info> (http://martinkr.github.io)
 * @license MIT license: https://opensource.org/licenses/MIT
 *
 * @author Martin Krause <github@mkrause.info>
 */

/* eslint-env mocha */

import * as thisModule from "./../app/main";

const thisModulePath = "main";

describe(`The module "${thisModulePath}"`, () => {



    before((done) => {
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

});
