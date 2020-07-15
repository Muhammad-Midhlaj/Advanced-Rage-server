"use strict";

let extIP = require("../index")();

extIP.on("ip", ip => {
    console.log(ip);
});

extIP.on("err", err => {
    console.error(err);
});

extIP();
