module.exports = {
    "playerDeath": (player, reason, killer) => {
        const TIME_WAIT = (player.admin > 0) ? 1000 : 5000;
        var playerId = player.id;
        var playerSqlId = player.sqlId;

        var killerId = -1,
            killerSqlId = -1;
        if (killer) {
            killerId = killer.id;
            killerSqlId = killer.sqlId;
            if (player.id != killer.id) giveWantedHandler(killer);
        }

        var hospital = mp.factions.getBySqlId(5);
        player.hospital = true;
        player.spawnPos = hospital.position;
        player.spawnPos.h = hospital.h;

        var timerId = setTimeout(() => {
            try {
                var player = mp.players.at(playerId);
                if (!player || player.sqlId != playerSqlId) return clearTimeout(timerId);

                if (killerId != -1) {
                    var killer = mp.players.at(killerId);
                    if (killer && killer.sqlId == killerSqlId) {
                        doArrestHandler(player, killer);
                    }
                }

                if (player.hasCuffs) player.utils.setCuffs(false);
                if (player.getVariable("attachedObject")) player.setVariable("attachedObject", null);
                clearJobHandler(player);
                player.body.loadItems();
                player.utils.spawn(100);
            } catch (err) {
                console.log(err);
            }
        }, TIME_WAIT);
    }
}

function giveWantedHandler(player) {
    var wanted = mp.economy["wanted_level"].value;
    if (player.faction != 2 && wanted) {
        player.utils.setWanted(player.wanted + wanted);
        player.utils.warning(`Your crime rate has gone up!`);
        //todo оповещаем всех ПД
        /*mp.players.forEach((rec) => {
        	if (rec.faction == 6) {
        		rec.outputChatBox(`!{#f79} Неизвестный: Произошло убийство. Подозреваемый: ${player.name}. Место помечено на карте. Тревога: ${player.wanted} ур.`);
        		rec.call("markKilling", [player.position.x, player.position.y, player.wanted]);
        	}
        	if (player.wanted > 3 && rec.faction == 11) {
        		rec.outputChatBox(`!{#f79} Неизвестный: Произошло убийство. Подозреваемый: ${player.name}. Место помечено на карте. Тревога: ${player.wanted} ур.`);
        		rec.call("markKilling", [player.position.x, player.position.y, player.wanted]);
        	}
        });*/
    }
}

function doArrestHandler(player, killer) {
    if (player.id == killer.id) return;
    if (killer.faction != 2 || player.wanted <= 0) return;

    var rand = mp.randomInteger(0, 2);
    player.utils.doArrest(rand, (mp.economy["wanted_arrest_time"].value / 1000) * player.wanted);
    player.utils.setWanted(0);

    player.utils.info(`${killer.name} put you in jail!`);
    killer.utils.success(`${player.name} put in jail!`);
}

function clearJobHandler(player) {
    if (player.farmJob) mp.events.call("farm.stopJob", player, true);
    // TODO: Перенести увольнение с других работа сюда.
}
