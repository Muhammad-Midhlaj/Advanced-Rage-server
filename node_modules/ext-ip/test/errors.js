"use strict";

let chai = require("chai");
let sinon = require("sinon");
chai.should();

/* jshint expr: true */

describe("errors", () => {
    let extIP = require("../index");

    it("should have deprecated message", () => {
        let consoleInfo = console.info;
        console.info = () => {};

        let spy = sinon.spy(console, "info");
        extIP({getIP: "parallel"});

        // noinspection JSUnresolvedFunction
        spy.calledWith("ext-ip: config parameter 'getIP' is deprecated, use 'mode' instead").should.be.true;

        // noinspection JSUnresolvedFunction
        spy.restore();
        console.info = consoleInfo;
    });

    it("should have correct timeout message", function(done) { // use function for 'this'
        this.slow(500);

        let getIP = extIP({
            replace  : true,
            timeout  : 1,
            services : ["http://google.com"],
        });

        getIP.get().then(ip => {
            console.log("ip: " + ip);
        }, err => {
            err.message.should.be.oneOf([
                "ETIMEDOUT (http://google.com)",
                "ESOCKETTIMEDOUT (http://google.com)"
            ]);
            done();
        });
    });

    it("should have correct unknown host message", function(done) { // use function for 'this'
        this.slow(6000);
        this.timeout(6500);

        let getIP = extIP({
            replace  : true,
            timeout  : 3000,
            services : ["http://test-extip-fail.com"],
        });

        getIP.get().catch(err => {
            err.message.should.be.equal("getaddrinfo ENOTFOUND test-extip-fail.com test-extip-fail.com:80 (http://test-extip-fail.com)");
            done();
        });
    });

    it("should have invalid response message on sequential", function(done) { // use function for 'this'
        this.slow(6000);
        this.timeout(6500);

        let getIP = extIP({
            replace  : true,
            services : ["http://google.com"],
            timeout  : 3000
        });

        getIP.get().catch(err => {
            err.message.should.be.equal("invalid response (it's not an IP) (http://google.com)");
            done();
        });
    });

    it("should have invalid response message on parallel", function(done) { // use function for 'this'
        this.slow(6000);
        this.timeout(6500);

        let getIP = extIP({
            mode     : "parallel",
            replace  : true,
            services : ["http://google.com"],
            timeout  : 3000
        });

        getIP.get().catch(err => {
            err.message.should.be.equal("invalid response (it's not an IP) (http://google.com)");
            done();
        });
    });

    it("should have timeout response messages on sequential", function(done) { // use function for 'this'
        this.slow(6000);
        this.timeout(6500);

        let getIP = extIP({
            replace  : true,
            services : ["http://google.com", "http://google.com"],
            timeout  : 1
        });

        getIP.get().catch(err => {
            err.message.should.be.oneOf([
                "ETIMEDOUT (http://google.com)\nETIMEDOUT (http://google.com)",
                "ESOCKETTIMEDOUT (http://google.com)\nETIMEDOUT (http://google.com)",
                "ETIMEDOUT (http://google.com)\nESOCKETTIMEDOUT (http://google.com)",
                "ESOCKETTIMEDOUT (http://google.com)\nESOCKETTIMEDOUT (http://google.com)"
            ]);
            done();
        });
    });

    it("should have timeout response messages on parallel", function(done) { // use function for 'this'
        this.slow(6000);
        this.timeout(6500);

        let getIP = extIP({
            mode     : "parallel",
            replace  : true,
            services : ["http://google.com", "http://google.com"],
            timeout  : 1
        });

        getIP.get().catch(err => {
            err.message.should.be.oneOf([
                "ETIMEDOUT (http://google.com)\nETIMEDOUT (http://google.com)",
                "ESOCKETTIMEDOUT (http://google.com)\nETIMEDOUT (http://google.com)",
                "ETIMEDOUT (http://google.com)\nESOCKETTIMEDOUT (http://google.com)",
                "ESOCKETTIMEDOUT (http://google.com)\nESOCKETTIMEDOUT (http://google.com)"
            ]);
            done();
        });
    });
});
