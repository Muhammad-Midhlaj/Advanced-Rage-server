module.exports = {
    log: (text, player) => {
        if (player) return player.call(`console.push`, ['log', text]);
        mp.players.forEach((rec) => {
            if (rec.admin) rec.call(`console.push`, ['log', text]);
        });
        console.log(text);
    },

    info: (text, player) => {
        if (player) return player.call(`console.push`, ['info', text]);
        mp.players.forEach((rec) => {
            if (rec.admin) rec.call(`console.push`, ['info', text]);
        });
        console.log(text);
    },

    warning: (text, player) => {
        if (player) return player.call(`console.push`, ['warning', text]);
        mp.players.forEach((rec) => {
            if (rec.admin) rec.call(`console.push`, ['warning', text]);
        });
        console.log(text);
    },

    error: (text, player) => {
        if (player) return player.call(`console.push`, ['error', text]);
        mp.players.forEach((rec) => {
            if (rec.admin) rec.call(`console.push`, ['error', text]);
        });
        console.log(text);
    },

    debug: (text, player) => {
        if (player) return player.call(`console.push`, ['debug', text]);
        mp.players.forEach((rec) => {
            if (rec.admin) rec.call(`console.push`, ['debug', text]);
        });
        console.log(text);
    },

    disable: (player, enable) => {
        player.call(`console.disable`, [enable]);
    },
}
