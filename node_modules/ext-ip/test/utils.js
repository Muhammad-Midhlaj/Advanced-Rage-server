"use strict";

let chai = require("chai");
chai.should();

/* jshint expr: true */

describe("utils.js", () => {
    let http = require("http");
    let utils = require("../lib/utils");

    it("should be able to validate IPv4 and IPv6 addresses", () => {
        utils.isIP("192.168.1.1").should.be.true;
        utils.isIP("94.65.128.173").should.be.true;
        utils.isIP("FE80:0000:0000:0000:0202:B3FF:FE1E:8329").should.be.true;
        utils.isIP("FE80::0202:B3FF:FE1E:8329").should.be.true;

        // noinspection JSCheckFunctionSignatures
        utils.isIP(111111).should.be.false;
        utils.isIP("192..1.1").should.be.false;
        utils.isIP("94.65.128.1A3").should.be.false;
        utils.isIP("FE80:0000:0000:0000:0202:B3FF:FE1E:").should.be.false;
        utils.isIP("localhost").should.be.false;
    });

    it("should only validate correct http(s) urls", () => {
        utils.isURL("https://www.test.com").should.be.true;
        utils.isURL("http://www.test.com").should.be.true;
        utils.isURL("https://test.com").should.be.true;
        utils.isURL("http://test.com").should.be.true;
        utils.isURL("https://sub.test.com").should.be.true;
        utils.isURL("http://sub.test.com").should.be.true;
        utils.isURL("http://test.net").should.be.true;
        utils.isURL("http://test.org").should.be.true;
        utils.isURL("http://test.co.uk").should.be.true;

        utils.isURL("http://").should.be.false;
        utils.isURL("//test.com").should.be.false;
        utils.isURL("ftp://www.test.com").should.be.false;
        utils.isURL("git://test.com").should.be.false;
        utils.isURL("https://testcom").should.be.false;
        utils.isURL("http://testcom").should.be.false;
    });

    it("should allow valid config", () => {
        let configA = {
            replace        : false,
            services       : ["http://ifconfig.co/x-real-ip", "http://ifconfig.io/ip"],
            timeout        : 500,
            mode           : "sequential"
        };

        let configB = {
            services       : ["http://ifconfig.co/x-real-ip", "http://ifconfig.io/ip"],
            timeout        : 500,
            mode           : "parallel"
        };

        let configC = {
            timeout        : 500
        };

        let configD = {
            agent          : new http.Agent(),
            userAgent      : "test",
            followRedirect : false,
            maxRedirects   : 0
        };

        let configE = {};

        utils.validateConfig(configA).should.be.true;
        utils.validateConfig(configB).should.be.true;
        utils.validateConfig(configC).should.be.true;
        utils.validateConfig(configD).should.be.true;
        utils.validateConfig(configE).should.be.true;
    });

    it("should reject invalid config", () => {
        utils.validateConfig({ mode: "test" }).should.not.be.true;
        utils.validateConfig({ replace: "test" }).should.not.be.true;
        utils.validateConfig({ replace: true }).should.not.be.true;
        utils.validateConfig({ services: ["test"] }).should.not.be.true;
        utils.validateConfig({ services: [] }).should.not.be.true;
        utils.validateConfig({ services: "test" }).should.not.be.true;
        utils.validateConfig({ timeout: "test" }).should.not.be.true;
        utils.validateConfig({ timeout: 1.1 }).should.not.be.true;
        utils.validateConfig({ agent: {} }).should.not.be.true;
        utils.validateConfig({ userAgent: "" }).should.not.be.true;
        utils.validateConfig({ userAgent: true }).should.not.be.true;
        utils.validateConfig({ followRedirect: "test" }).should.not.be.true;
        utils.validateConfig({ maxRedirects: "test" }).should.not.be.true;
        utils.validateConfig({ maxRedirects: 1.1 }).should.not.be.true;
    });

    it("should merge a valid configuration with default configuration", () => {
        let configDefault = {
            replace        : false,
            services       : ["http://ifconfig.co/x-real-ip", "http://ifconfig.io/ip"],
            timeout        : 500,
            mode           : "sequential",
            agent          : null,
            userAgent      : "curl/",
            followRedirect : true,
            maxRedirects   : 10
        };

        let configA = {};

        let configB = {
            services       : ["http://ifconfig.co/x-real-ip", "http://ifconfig.io/ip"],
            timeout        : 1000,
            mode           : "parallel"
        };

        let configC = {
            replace        : true,
            services       : ["http://ifconfig.co/x-real-ip"]
        };

        let agent = new http.Agent();
        let configD = {
            replace        : true,
            services       : ["http://ifconfig.co/x-real-ip"],
            agent          : agent,
            userAgent      : "test",
            followRedirect : false,
            maxRedirects   : 1
        };

        let merged = utils.mergeConfig(configA, configDefault);
        merged.should.be.deep.equal(configDefault);

        merged = utils.mergeConfig(configB, configDefault);
        merged.should.be.deep.equal({
            replace        : false,
            services       : ["http://ifconfig.co/x-real-ip", "http://ifconfig.io/ip", "http://ifconfig.co/x-real-ip", "http://ifconfig.io/ip"],
            timeout        : 1000,
            mode           : "parallel",
            agent          : null,
            userAgent      : "curl/",
            followRedirect : true,
            maxRedirects   : 10
        });

        merged = utils.mergeConfig(configC, configDefault);
        merged.should.be.deep.equal({
            replace        : true,
            services       : ["http://ifconfig.co/x-real-ip"],
            timeout        : 500,
            mode           : "sequential",
            agent          : null,
            userAgent      : "curl/",
            followRedirect : true,
            maxRedirects   : 10
        });

        merged = utils.mergeConfig(configD, configDefault);
        merged.should.be.deep.equal({
            replace        : true,
            services       : ["http://ifconfig.co/x-real-ip"],
            timeout        : 500,
            mode           : "sequential",
            agent          : agent,
            userAgent      : "test",
            followRedirect : false,
            maxRedirects   : 1
        });
    });

    it("should extend services", () => {
        let configDefault = {
            replace        : false,
            services       : ["test"],
            timeout        : 500,
            mode           : "sequential",
            agent          : null,
            userAgent      : "curl/",
            followRedirect : true,
            maxRedirects   : 10
        };

        let configA = {
            replace        : true,
            services       : ["test"]
        };

        let configB = {
            services       : ["test"]
        };

        let merged = utils.mergeConfig(configA, configDefault);
        merged.should.be.deep.equal({
            replace        : true,
            services       : ["test"],
            timeout        : 500,
            mode           : "sequential",
            agent          : null,
            userAgent      : "curl/",
            followRedirect : true,
            maxRedirects   : 10
        });

        merged = utils.mergeConfig(configB, configDefault);
        merged.should.be.deep.equal({
            replace        : false,
            services       : ["test", "test"],
            timeout        : 500,
            mode           : "sequential",
            agent          : null,
            userAgent      : "curl/",
            followRedirect : true,
            maxRedirects   : 10
        });
    });

    it("should race resolve correctly", () => {
        let promises = [
            new Promise((resolve, reject) => {
                setTimeout(reject, 10, "err");
            }),
            new Promise(resolve => {
                setTimeout(resolve, 40, 1);
            }),
            new Promise(resolve => {
                setTimeout(resolve, 30, 2);
            }),
            new Promise(resolve => {
                setTimeout(resolve, 20, 3);
            })
        ];

        return utils.promiseRace(promises).then(index => {
            index.should.be.equal(3);
        });
    });

    it("should return all race errors", done => {
        let promises = [
            Promise.reject(1),
            Promise.reject(2),
            Promise.reject(3),
            Promise.reject(4),
            Promise.reject(5)
        ];

        utils.promiseRace(promises).catch(err => {
            err.should.be.equal("1\n2\n3\n4\n5");
            done();
        });
    });

    it("should run promises parallel", () => {
        let running = [];
        let services = [
            () => Promise.resolve((() => { running.push(1); return 1; })()),
            () => Promise.resolve((() => { running.push(2); })()),
            () => Promise.resolve((() => { running.push(3); })()),
            () => Promise.resolve((() => { running.push(4); })()),
            () => Promise.resolve((() => { running.push(5); })()),
        ];

        return utils.promiseParallel(services).then(result => {
            result.should.be.equal(1);
            running.join("").should.be.deep.equal("12345");
        });
    });

    it("should return all errors after parallel run", () => {
        let services = [
            () => Promise.reject(1),
            () => Promise.reject(2),
            () => Promise.reject(3),
            () => Promise.reject(4),
            () => Promise.reject(5)
        ];

        return utils.promiseParallel(services).catch(err => {
            err.should.be.equal("1\n2\n3\n4\n5");
        });
    });

    it("should run promises sequential", () => {
        let errors = [];
        let services = [
            () => Promise.reject((() => { errors.push(1); })()),
            () => Promise.reject((() => { errors.push(2); })()),
            () => Promise.reject((() => { errors.push(3); })()),
            () => Promise.resolve(4),
            () => Promise.resolve(5)
        ];

        return utils.promiseSequential(services).then(result => {
            result.should.be.equal(4);
            errors.join("").should.be.equal("123");
        });
    });

    it("should return all errors after sequential run", () => {
        let services = [
            () => Promise.reject(1),
            () => Promise.reject(2),
            () => Promise.reject(3),
            () => Promise.reject(4),
            () => Promise.reject(5)
        ];

        return utils.promiseSequential(services).catch(err => {
            err.should.be.equal("1\n2\n3\n4\n5");
        });
    });
});
