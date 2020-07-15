"use strict";

let net = require("net");
let http = require("http");
let https = require("https");

exports = module.exports = {
    /**
     * check if given ip valid
     * @param {string} ip
     * @return {boolean}
     */
    isIP: ip => {
        return net.isIP(ip) !== 0;
    },

    /**
     * check if given url valid
     * @param {string} url
     * @return {boolean}
     */
    isURL: url => {
        return !!url.match( /^(http(s)?:)\/\/([^\s.]+\.\S{2}|localhost[:?\d]*)\S*$/);
    },

    /**
     * validate user given configuration
     * @param {object} config
     * @return {boolean|Array}
     */
    validateConfig: config => {
        let errors = [];

        // config object
        if( config.constructor !== Object ) {
            return ["configuration is not an object"];
        }

        // mode
        if( config.hasOwnProperty("mode") && config.mode !== "parallel" && config.mode !== "sequential" ) {
            errors.push("mode must be 'parallel' or 'sequential'");
        }

        // replace
        if( config.hasOwnProperty("replace") ) {
            if( typeof config.replace !== "boolean" ) {
                errors.push("replace needs to be an boolean");
            }

            else if( config.replace === true && !config.hasOwnProperty("services") ) {
                errors.push("if replace is enabled there must be new services added");
            }
        }

        // services
        if( config.hasOwnProperty("services") ) {
            if( !Array.isArray(config.services) ) {
                errors.push("services needs to be an array");
            }

            else if( !config.services.length ) {
                errors.push("services needs to have at least one entry");
            }

            else {
                config.services.forEach(url => {
                    if( !exports.isURL(url) ) {
                        errors.push(url + " is not a valid url");
                    }
                });
            }
        }

        // timeout
        if( config.hasOwnProperty("timeout") ) {
            if( typeof config.timeout !== "number" ) {
                errors.push("timeout needs to be numeric");
            }

            else if( config.timeout !== Math.floor(config.timeout) ) {
                errors.push("timeout needs to be an integer value");
            }
        }

        // agent
        if( config.hasOwnProperty("agent") && !(config.agent instanceof http.Agent) && !(config.agent instanceof https.Agent) ) {
            errors.push("agent needs to be an instance of http.Agent or https.Agent");
        }

        // userAgent
        if( config.hasOwnProperty("userAgent") ) {
            if( typeof config.userAgent !== "string" ) {
                errors.push("userAgent needs to be a string");
            }

            else if( config.userAgent === "" ) {
                errors.push("userAgent should not be empty");
            }
        }
        
        // followRedirect
        if( config.hasOwnProperty("followRedirect") && typeof config.followRedirect !== "boolean" ) {
            errors.push("followRedirect needs to be an boolean");
        }

        // maxRedirects
        if( config.hasOwnProperty("maxRedirects") ) {
            if( typeof config.maxRedirects !== "number" ) {
                errors.push("maxRedirects needs to be numeric");
            }

            else if( config.maxRedirects !== Math.floor(config.maxRedirects) ) {
                errors.push("maxRedirects needs to be an integer value");
            }
        }

        return errors.length ? errors : true;
    },

    /**
     * merge user given configuration into default configuration
     * @param {object} config
     * @param {object} defaults
     * @return {*}
     */
    mergeConfig: (config, defaults) => {
        return {
            mode           : config.mode || defaults.mode,
            replace        : config.replace === true || config.replace === false ? config.replace : defaults.replace,
            services       : config.replace ? config.services : config.services && defaults.services.concat(config.services) || defaults.services,
            timeout        : config.timeout || defaults.timeout,
            agent          : config.agent || defaults.agent,
            userAgent      : config.userAgent || defaults.userAgent,
            followRedirect : config.followRedirect === true || config.followRedirect === false ? config.followRedirect : defaults.followRedirect,
            maxRedirects   : config.maxRedirects || defaults.maxRedirects
        };
    },

    /**
     * fixed promise race function
     * @param {Array} promises
     * @param {Array} [errors]
     * @return {Promise}
     */
    promiseRace: (promises, errors) => {
        errors = errors || [];

        if( promises.length <= 0 ) {
            return Promise.reject(errors.join("\n"));
        }

        let racePromises = promises.map((promise, index) => promise.catch(err => {
            throw {
                index: index,
                message: err
            };
        }));

        return Promise.race(racePromises).catch(err => {
            errors.push(err.message);
            promises.splice(err.index, 1);
            return exports.promiseRace(promises, errors);
        });
    },

    /**
     * executes promises parallel and return first resolve or all rejects
     * @param {Array} services
     * @return {Promise}
     */
    promiseParallel: services => {
        let requests = services.map(service => service());
        return exports.promiseRace(requests);
    },

    /**
     * executes promises sequential and return first resolve or all rejects
     * @param {Array} services
     * @return {Promise}
     */
    promiseSequential: services => {
        return new Promise((resolve, reject) => {
            let current = 0;
            let errors = [];

            (function next() {
                if( current < services.length ) {
                    services[current]().then(ip => {
                        resolve(ip);
                    })
                    .catch(err => {
                        errors.push(err);
                        next();
                    });

                    ++current;
                }
                else {
                    reject(errors.join("\n"));
                }
            })();
        });
    }
};
