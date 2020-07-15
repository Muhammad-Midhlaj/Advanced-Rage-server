"use strict";

// set custom configuration options for this instance
let extIP = require("../index")({
    replace: true,
    services: [
        "http://icanhazip.com/",
        "http://ifconfig.io/ip"
    ]
});

// register listeners
extIP.on("ip", ip => {
    console.log("event ip: " + ip);
});

extIP.on("err", err => {
    console.error("event error: " + err);
});

// use a callback function
extIP.get((err, ip) => {
    if( err ) {
        console.error("callback error: " + err);
    }
    else {
        console.log("callback ip: " + ip);
    }
})

// listen on promise resolve and reject
.then(ip => {
    console.log("promise ip: " + ip);
}, err => {
    console.error("promise error: " + err);
})
.catch(err => {
    console.error("promise error: " + err);
});
