"use strict";

let chai = require("chai");
chai.should();

/* jshint expr: true */

describe("hosts", () => {
    let defaults = require("../../lib/defaults");
    let utils = require("../../lib/utils");
    let extIP = require("../../index");

    defaults.services.forEach(url => {
        it("should be a valid url by service " + url, () => {
            utils.isURL(url).should.be.true;
        });

        it("should return a ip by " + url, function() { // use function for 'this'
            this.slow(5000);
            this.timeout(5500);

            let instance = extIP({
                replace: true,
                services: [url],
                timeout: 5000
            });

            return instance();
        });
    });
});
