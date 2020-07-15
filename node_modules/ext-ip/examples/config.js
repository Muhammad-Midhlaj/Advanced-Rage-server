"use strict";

let extIP = require("../index")({
    mode: "parallel",
    replace: true,
    services: [
        "http://ifconfig.co/x-real-ip",
        "http://ifconfig.io/ip"
    ],
    timeout: 600
});

extIP.get().then(ip => {
    console.log(ip);
});
