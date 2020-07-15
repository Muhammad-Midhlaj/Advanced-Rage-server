"use strict";

let chai = require("chai");
let cap = require("chai-as-promised");
let expect = chai.expect;

chai.use(cap);
chai.should();

/* jshint expr: true */

describe("requests.js", () => {
    let requests = require("../lib/requests");

    beforeEach(() => {
        requests.setup({
            replace: false,
            services: [
                "http://icanhazip.com",
                "http://ifconfig.io/ip"
            ],
            timeout: 500
        });
    });

    it("should initialize correctly", () => {
        requests.services.length.should.be.equal(2);
    });

    it("should have correct request config and return without errors", () => {
        let request = {
            get: (opts, cb) => {
                opts.url.should.be.equal("test");
                opts.timeout.should.be.equal(100);
                opts.headers.should.be.deep.equal({"User-Agent": "test"});

                expect(opts.agent).to.be.undefined;

                cb(null, null, "test");
            }
        };

        return requests.requestBody(request, {timeout: 100, userAgent: "test"}, "test").then(body => {
            body.should.be.equal("test");
        });
    });

    it("should the an agent instance to request module", () => {
        let request = {
            get: (opts, cb) => {
                opts.agent.should.be.equal("test");
                cb(null, null, "test");
            }
        };

        return requests.requestBody(request, {agent: "test"}, "test").then(body => {
            body.should.be.equal("test");
        });
    });

    it("should reject with an error in body request", done => {
        let request = {
            get: (opts, cb) => {
                cb(new Error("test"));
            }
        };

        requests.requestBody(request, {timeout: 100}, "test").catch(err => {
            err.should.be.a("string");
            err.should.be.equal("test");
            done();
        });
    });

    it("should reject with even with string error in body request", done => {
        let request = {
            get: (opts, cb) => {
                cb("test");
            }
        };

        requests.requestBody(request, {timeout: 100}, "test").catch(err => {
            err.should.be.a("string");
            err.should.be.equal("test");
            done();
        });
    });

    it("should reject with an error in factory", done => {
        requests.factory({}, "")().catch(err => {
            err.should.be.a("string");
            done();
        });
    });

    it("should return an validate response body correctly to be an ip", () => {
        // noinspection BadExpressionStatementJS, JSUnresolvedVariable
        requests.validateBody("127.0.0.1").should.be.resolved;
        // noinspection BadExpressionStatementJS, JSUnresolvedVariable
        requests.validateBody("localhost").should.be.rejected;
        // noinspection BadExpressionStatementJS, JSUnresolvedVariable
        requests.validateBody("").should.be.rejected;
        // noinspection BadExpressionStatementJS, JSUnresolvedVariable, JSCheckFunctionSignatures
        requests.validateBody().should.be.rejected;
    });
});
