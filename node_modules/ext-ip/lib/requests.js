"use strict";

let request = require("request");
let utils = require("./utils");

exports = module.exports = {
    /**
     * initialized services
     * @type {Array}
     */
    services: [],

    /**
     * setup services by configuration
     * @param {*} config
     * @return {Array}
     */
    setup: config => {
        return (exports.services = exports.initializeServices(config));
    },

    /**
     * initialize services and create a call wrapper
     * @param {*} config
     * @return {Array}
     */
    initializeServices: config => {
        return config.services.map(url => exports.factory(config, url));
    },

    /**
     * factory helper to create wrapper for each service
     * @param {object} config
     * @param {string} url
     * @return {function}
     */
    factory: (config, url) => {
        return () => {
            return exports
                .requestBody(request, config, url)
                .then(exports.validateBody)
                .catch(err => {
                    return Promise.reject(err + " (" + url + ")");
                });
        };
    },

    /**
     * request body from service
     * @param {object} request
     * @param {object} config
     * @param {string} url
     * @return {Promise}
     */
    requestBody: (request, config, url) => {
        return new Promise((resolve, reject) => {
            request.get({
                url     : url,
                timeout : config.timeout,
                agent   : config.agent || undefined,
                headers : {
                    "User-Agent": config.userAgent
                }
            }, (err, res, body) => {
                if( err ) {
                    reject(err.message || err);
                }
                else {
                    resolve(body);
                }
            });
        });
    },

    /**
     * validate response body to be an ip address
     * @param {string|*} body
     * @return {Promise}
     */
    validateBody: body => {
        return new Promise((resolve, reject) => {
            // if the body is null use an empty string
            body = (body || "").toString().replace("\n", "");

            if( utils.isIP(body) ) {
                resolve(body);
            }
            else {
                reject("invalid response (it's not an IP)");
            }
        });
    }
};
