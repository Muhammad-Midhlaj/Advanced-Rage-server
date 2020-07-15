"use strict";

let sinon = require("sinon");
let chai = require("chai");
let expect = chai.expect;
chai.should();

/* jshint expr: true */

describe("index.js", () => {
    let extIP = require("../index");
    let utils = require("../lib/utils");
    let timeout = 3000;

    it("should throw error on invalid config", () => {
        let fn = () => {
            extIP("invalid").should.throw(Error);
        };

        fn.should.throw(Error);
    });

    it("should return an IP with default configuration", function(done) { // use function for 'this'
        this.slow(timeout * 2);
        this.timeout(timeout * 2 + 500);

        let getIP = extIP();

        getIP((err, ip) => {
            expect(err).to.be.null;
            utils.isIP(ip).should.be.true;
            done();
        });
    });

    it("should return an IP with callback", function(done) { // use function for 'this'
        this.slow(timeout * 2);
        this.timeout(timeout * 2 + 500);

        let getIP = extIP({
            mode: "parallel",
            timeout: timeout
        });

        getIP((err, ip) => {
            expect(err).to.be.null;
            utils.isIP(ip).should.be.true;
            done();
        });
    });

    it("should return an IP with events", function(done) { // use function for 'this'
        this.slow(timeout * 2);
        this.timeout(timeout * 2 + 500);

        let getIP = extIP({
            mode: "parallel",
            timeout: timeout
        });

        getIP.on("ip", ip => {
            utils.isIP(ip).should.be.true;
            done();
        });

        getIP();
    });

    it("should return an IP with promise", function() { // use function for 'this'
        this.slow(timeout * 2);
        this.timeout(timeout * 2 + 500);

        let getIP = extIP({
            mode: "parallel",
            timeout: timeout
        });

        return getIP.get().then(ip => {
            utils.isIP(ip).should.be.true;
        });
    });

    it("should return an IP with custom configuration", function() { // use function for 'this'
        this.slow(timeout * 2);
        this.timeout(timeout * 2 + 500);

        let getIP = extIP({
            mode     : "parallel",
            replace  : true,
            services : ["http://ifconfig.co/x-real-ip", "http://ifconfig.io/ip"],
            timeout  : timeout
        });

        return getIP(function (err, ip) {
            expect(err).to.be.null;
            utils.isIP(ip).should.be.true;
        });
    });

    it("should be able to use old getIP config parameter", () => {
        let consoleInfo = console.info;
        console.info = () => {};

        let spy = sinon.spy(console, "info");
        let config = {getIP: "sequential"};

        extIP(config);

        spy.calledOnce.should.be.true;
        config.mode.should.be.equal(config.getIP);

        // noinspection JSUnresolvedFunction
        spy.restore();
        console.info = consoleInfo;
    });

    it("should reject on handling error", done => {
        let getIP = extIP({
            replace  : true,
            services : ["http://test.com"],
            timeout  : 1
        });

        getIP.get().catch(() => done());
    });
});
