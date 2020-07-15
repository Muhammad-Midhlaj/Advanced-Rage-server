"use strict";

let chai = require("chai");
let expect = chai.expect;

chai.should();

/* jshint expr: true */

describe("defaults.js", () => {
    let defaults = require("../lib/defaults");
    let utils = require("../lib/utils");

    it("should have all necessary properties", () => {
        defaults.mode.should.not.be.undefined;
        defaults.replace.should.not.be.undefined;
        defaults.services.should.not.be.undefined;
        defaults.timeout.should.not.be.undefined;
        defaults.userAgent.should.not.be.undefined;
        defaults.followRedirect.should.not.be.undefined;
        defaults.maxRedirects.should.not.be.undefined;

        expect(defaults.agent).to.not.be.undefined;
    });

    it("should have all properties in correct type", () => {
        defaults.mode.should.be.a("string");
        defaults.replace.should.be.a("boolean");
        defaults.services.should.be.a("array");
        defaults.timeout.should.be.a("number");
        defaults.userAgent.should.be.a("string");
        defaults.followRedirect.should.be.a("boolean");
        defaults.maxRedirects.should.be.a("number");

        expect(defaults.agent).to.be.null;
    });

    it("should have at least one service as default", () => {
        defaults.services.length.should.be.greaterThan(0);
    });

    // test each service individually
    defaults.services.forEach(url => {
        it("should be a valid url by service " + url, () => {
            utils.isURL(url).should.be.true;
        });
    });
});
