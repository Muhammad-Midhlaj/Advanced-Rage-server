"use strict";

let utils = require("./utils");
let requests = require("./requests");
let defaults = require("./defaults");
let events = require("events");
let EventEmitter = events.EventEmitter;

/**
 * external-ip module
 * @param {object} [config]
 * @return {function(Promise)|{addListener:*, on:*, once:*, removeListener:*}}
 */
module.exports = config => {
    config = config || {};

    // make config compatible to old 'external-ip' module
    if( config.hasOwnProperty("getIP") && !config.hasOwnProperty("mode") ) {
        config.mode = config.getIP;
        console.info("ext-ip: config parameter 'getIP' is deprecated, use 'mode' instead");
    }

    // validate an build config
    let validation = utils.validateConfig(config);
    if( validation !== true ) {
        let message = "ext-ip config validation:\n- ";
        message += validation.join("\n- ");

        throw new Error(message);
    }

    config = utils.mergeConfig(config, defaults);

    // create instance wrapper
    let emitter = new EventEmitter();
    let services = requests.setup(config);

    /**
     * wrapper function for execution after instance creation
     * @param {function} [cb]
     * @return {Promise}
     */
    let extIP = cb => {
        cb = cb || (() => {});

        let handling = config.mode === "parallel" ? utils.promiseParallel : utils.promiseSequential;
        let promise = handling(services);

        promise.then(ip => {
            cb(null, ip);
            emitter.emit("ip", ip);
            return Promise.resolve(ip);
        }, err => {
            let error = new Error(err);
            cb(error);
            emitter.emit("err", error);
            return error;
        });

        return promise;
    };

    // extend wrapper with event emitter methods
    Object.assign(extIP, emitter, {
        on             : emitter.on,
        once           : emitter.once,
        removeListener : emitter.removeListener,
        addListener    : emitter.addListener
    });

    // wrapper function for use of promises on response
    // it's used to prevent 'unhandled promise rejection' warning on normal use 
    extIP.get = cb => {
        return new Promise((resolve, reject) => {
            extIP(cb).then(ip => resolve(ip), err => reject(new Error(err)));
        });
    };

    return extIP;
};
