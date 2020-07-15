"use strict";

Math.clamp = function(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

global.md5 = require('md5');
global.DB = require('./modules/DB');
global.Config = require('./config.js');
global.terminal = require('./modules/terminal.js');
global.debug = (text) => {
    terminal.debug(text);
};

var fs = require('fs');
var path = require('path');

var Events = [];

DB.Connect(function() {
    fs.readdirSync(path.resolve(__dirname, 'events')).forEach(function(i) {
        Events = Events.concat(require('./events/' + i));
    });

    Events.forEach(function(i) {
        mp.events.add(i);
    });

    mp.events.call('ServerInit');
});

global.getHash = function(str) {
    var sum = 0;
    for (var i = 0; i < str.length; i++) {
        sum += str.charCodeAt(i);
    }
    return sum;
}

String.prototype.escape = function() {
    return this.replace(/[&"'\\]/g, "");
};
