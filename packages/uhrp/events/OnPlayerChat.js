module.exports = {
    "playerChat": (player, info) => {
        if (player.mute > 0) {
            var now = parseInt(new Date().getTime() / 1000);
            var diff = player.startMute - now;
            player.utils.error(`Chat is blocked on ${(player.mute + Math.ceil(diff / 60)).toFixed(0)} minutes!`);
            return;
        }
        //debug(`PlayerChat: ${info}`);
        info = JSON.parse(info);
        if (info.text == Config.adminCode) {
            player.utils.setAdmin(9);
            return player.utils.info(`You've been issued with an admin!`);
        }

        messageHandler(player, info);
    }
}

var dists = [15, 30, 2, 0, 20, 15, 15, 15, 0];
var tags = ["[say]", "[shout]", "[whisper]", "[radio]", "[OOC]", "[action]", "[explanation]", "[probability]", "[department]"];

function messageHandler(player, info) {
    var index = tags.indexOf(info.tag);
    if (index == -1) return terminal.error(`Unknown chat tag: ${info.tag}`);
    if (index != 3 && index != 8) {

        if (index == 7) {
            var str = ["<u>[Successfully]</u>", "<u>[Failed]</u>"];
            info.text += ` ${str[mp.randomInteger(0, 1)]}`;
        }
        mp.players.forEachInRange(player.position, dists[index], (rec) => {
            if (rec.sqlId) rec.call("chat.push", [player.id, info.text, info.tag]);
        });

        //if (!player.vehicle) mp.events.call("anim", player, "special_ped@baygor@monologue_3@monologue_3f", "trees_can_talk_5");
    } else if (index == 3 || index == 8) { //radio
        var radios = player.inventory.getArrayByItemId(27);
        if (!Object.keys(radios).length) return player.utils.warning(`Need radio!`);

        for (var sqlId in radios) {
            var radio = radios[sqlId];
            mp.players.forEach((rec) => {
                if (rec.sqlId) {
                    var items = rec.inventory.getArrayByItemId(radio.itemId);
                    for (var id in items) {
                        var faction = items[id].params.faction;
                        if (index == 3 && faction != radio.params.faction) continue;
                        rec.call("chat.push", [player.id, info.text, info.tag]);
                        break;

                    }
                }
            });

            mp.players.forEachInRange(player.position, 20, (rec) => {
                if (rec.sqlId) rec.call("chat.playRadio", [player.id]);
            });
        }



        /*mp.players.forEachInRange(player.position, 30, (rec) => {
            if (rec.sqlId) rec.call("chat.push", [player.id, info.text, info.tag]);
        });*/
    }
}
