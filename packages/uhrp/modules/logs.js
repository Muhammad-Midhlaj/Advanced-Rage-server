//const Discord = require('discord.js');

module.exports.Init = function() {
    mp.logs = [];
    initLogsUtils();
    console.log("The system of lairs is loaded");
}

function initLogsUtils() {
    mp.logs.addLog = (message, type, accountId, characterId, data) => {
        DB.Handle.query("INSERT INTO logs (type,accountId,characterId,message,data) VALUES (?,?,?,?,?)", [type, accountId, characterId, message, JSON.stringify(data)]);
    };
}
