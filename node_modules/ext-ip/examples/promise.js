"use strict";

let extIP = require("../index")();

extIP.get().then(ip => {
    console.log(ip);
})
.catch(err => {
    console.error(err);
});
