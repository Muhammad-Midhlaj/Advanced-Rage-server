"use strict";

let extIP = require("../index")();

extIP((err, ip) => {
    if( err ){
        throw err;
    }

    console.log(ip);
});
