module.exports = {
    "ServerInit": () => {
        console.log("Start of the server...");
        initMpUtils();
        initPoliceCells();

        require('../modules/economy.js').Init(async () => {
            mp.updateWorldTime();
            require('../modules/mailSender.js').Init();
            require('../modules/houses.js').Init();
            require('../modules/interiors.js').Init();
            require('../modules/garages.js').Init();
            require('../modules/timers.js').InitPayDay();
            require('../modules/bizes.js').Init();
            require('../modules/inventory.js').Init();
            require(`../modules/achievements.js`).Init();
            require('../modules/factions.js').Init();
            require('../modules/vehicles.js').Init();
            //require('../modules/objects.js').Init(); //wait sync fix
            // require('../modules/routep.js').Init();
            require('../modules/jobs/trash/trash.js').Init();
            require('../modules/jobs/gopostal/gopostal.js');
            require('../modules/jobs/pizza/index.js');
            require('../modules/jobs/waterfront/index.js');
            require('../modules/jobs/builder/index.js');
            require('../modules/jobs/autoroober/index.js');
            require('../modules/jobs/taxi/index.js');
            require('../modules/jobs/smuggling/index.js');
            require('../modules/clothes.js').Init();
            require('../modules/ls_customs/index.js');
            require('../modules/rent_veh.js');
            require('../modules/logs.js').Init();
            require('../modules/reports.js').Init();
            require('../modules/v2_reports.js').Init();
            require('../modules/parkings.js').Init();
            require('../modules/donate.js').Init();
            require('../modules/autosaloons.js').Init();
            require('../modules/bank.js');
            require(`../modules/jobs.js`).Init();
            require(`../modules/driving_school.js`).Init();
            require(`../modules/jobs/trucker/trucker.js`).Init();
            require('../modules/barbershop/index.js');
            require(`../modules/markers.js`).Init();
            require(`../modules/peds.js`).Init();
            require(`../modules/farms.js`).Init();
            require('../modules/doorControl.js');
            require('../modules/cutscenes.js').Init();
            require('../modules/spawn.js').Init();
            require('../modules/ipl.js').Init();
            require('../modules/whitelist.js').Init();
            await require('../modules/green_zones.js').Init();
            require('../modules/phone.js').Init();
        });

        require('../modules/forefinger.js');
        console.log("The server is up and running!");
    }
}

function initMpUtils() {
    mp.randomInteger = (min, max) => {
        var rand = min - 0.5 + Math.random() * (max - min + 1)
        rand = Math.round(rand);
        return rand;
    }

    mp.players.getBySqlId = (sqlId) => {
        if (!sqlId) return null;
        var result;
        mp.players.forEach((recipient) => {
            if (recipient.sqlId == sqlId) {
                result = recipient;
                return;
            }
        });
        return result;
    }

    mp.players.getByLogin = (login) => {
        if (!login) return null;
        var result;
        mp.players.forEach((recipient) => {
            if (recipient.account.login == login) {
                result = recipient;
                return;
            }
        });
        return result;
    }

    mp.players.getBySocialClub = (socialClub) => {
        if (!socialClub) return null;
        var result;
        mp.players.forEach((recipient) => {
            if (recipient.socialClub == socialClub) {
                result = recipient;
                return;
            }
        });
        return result;
    }

    mp.players.getByName = (name) => {
        if (!name) return null;
        var result;
        mp.players.forEach((recipient) => {
            if (recipient.name == name) {
                result = recipient;
                return;
            }
        });
        return result;
    }

    mp.vehicles.getBySqlId = (sqlId) => {
        if (!sqlId) return null;
        var result;
        mp.vehicles.forEach((veh) => {
            if (veh.sqlId == sqlId) {
                result = veh;
                return;
            }
        });
        return result;
    }

    /* Полное удаление предметов инвентаря с сервера. */
    mp.fullDeleteItemsByParams = (itemId, keys, values) => {
        //debug(`fullDeleteItemsByParams: ${itemId} ${keys} ${values}`);
        /* Для всех игроков. */
        mp.players.forEach((rec) => {
            if (rec.sqlId) rec.inventory.deleteByParams(itemId, keys, values);
        });
        /* Для всех объектов на полу. */
        mp.objects.forEach((obj) => {
            if (obj.getVariable("inventoryItemSqlId") > 0) {
                var item = obj.item;
                var doDelete = true;
                for (var i = 0; i < keys.length; i++) {
                    var param = item.params[keys[i]];
                    if (!param) {
                        doDelete = false;
                        break;
                    }
                    if (param && param != values[i]) {
                        doDelete = false;
                        break;
                    }
                }
                if (doDelete) {
                    DB.Handle.query(`DELETE FROM inventory_players WHERE id=?`, obj.getVariable("inventoryItemSqlId"));
                    obj.destroy();
                }
            }
        });
        /* Для всех игроков из БД. */
        // TODO: ^^
    }

    mp.fullDeleteItemsByFaction = (playerSqlId, factionId) => {
        // debug(`fullDeleteItemsByFaction: ${playerSqlId} ${factionId}`);
        var items = {
            "2": [1, 2, 3, 6, 7, 8, 9, 10, 14, 17, 18, 19, 20, 21, 22, 23, 27, 29], // LSPD
            "3": [1, 2, 3, 6, 7, 8, 9, 10, 14, 17, 18, 19, 20, 21, 22, 23, 27, 29], // BCSO
            "4": [1, 2, 3, 6, 7, 8, 9, 10, 14, 17, 18, 19, 20, 21, 22, 23, 29, 61], // FIB
            "5": [1, 2, 3, 6, 7, 8, 9, 10, 14, 24, 25, 27, 63], // EMC
            "6": [1, 2, 3, 6, 7, 8, 9, 10, 14, 20, 21, 22, 23, 27, 60], // Fort Zancudo
            "7": [1, 2, 3, 6, 7, 8, 9, 10, 14, 20, 21, 22, 23, 27, 60], // Air Army
        };
        if (items[factionId]) {
            items[factionId].forEach((itemId) => {
                mp.fullDeleteItemsByParams(itemId, ["owner", "faction"], [playerSqlId, factionId]);
            });
        }
    }

    mp.getNearVehicle = (pos, range) => {
        var nearVehicle;
        var minDist = 99999;
        mp.vehicles.forEachInRange(pos, range, (veh) => {
            var distance = veh.dist(pos);
            if (distance < minDist) {
                nearVehicle = veh;
                minDist = distance;
            }
        });
        return nearVehicle;
    }

    mp.setVehSpawnTimer = (vehicle) => {
        var havePlayers = vehicle.getOccupants().length > 0;
        if (!havePlayers) vehicle.utils.setSpawnTimer(mp.economy["car_spawn_time"].value);
    }

    mp.updateWorldTime = () => {
        var speed = mp.economy["world_time_speed"].value;
        var worldHour = new Date().getHours() * speed % 24;
        worldHour += parseInt(new Date().getMinutes() / (60 / speed));
        if (worldHour != mp.world.time.hour) {
            mp.world.time.hour = worldHour;
            //debug(`Игровое время обновлено: ${mp.world.time.hour} ч. `);
        }
    }


    /* Оповещаем членов организации о том, что вошел коллега. */
    mp.broadcastEnterFactionPlayers = (player) => {
        if (!player.faction) return;
        var rankName = mp.factions.getRankName(player.faction, player.rank);
        if (mp.factions.isHospitalFaction(player.faction)) {
            mp.players.forEach((rec) => {
                if (rec.faction == player.faction) {
                    if (rec.sqlId != player.sqlId) rec.call(`tablet.medic.addTeamPlayer`, [{
                        id: player.id,
                        name: player.name,
                        rank: rankName
                    }]);
                    player.call(`tablet.medic.addTeamPlayer`, [{
                        id: rec.id,
                        name: rec.name,
                        rank: mp.factions.getRankName(rec.faction, rec.rank)
                    }]);
                }
            });
        } else if (player.faction == 2) {
            mp.players.forEach((rec) => {
                if (rec.faction == player.faction) {
                    if (rec.sqlId != player.sqlId) rec.call(`tablet.police.addTeamPlayer`, [{
                        id: player.id,
                        name: player.name,
                        rank: rankName
                    }]);
                    player.call(`tablet.police.addTeamPlayer`, [{
                        id: rec.id,
                        name: rec.name,
                        rank: mp.factions.getRankName(rec.faction, rec.rank)
                    }]);
                }
            });
        } else if (player.faction == 3) {
            mp.players.forEach((rec) => {
                if (rec.faction == player.faction) {
                    if (rec.sqlId != player.sqlId) rec.call(`tablet.sheriff.addTeamPlayer`, [{
                        id: player.id,
                        name: player.name,
                        rank: rankName
                    }]);
                    player.call(`tablet.sheriff.addTeamPlayer`, [{
                        id: rec.id,
                        name: rec.name,
                        rank: mp.factions.getRankName(rec.faction, rec.rank)
                    }]);
                }
            });
        } else if (player.faction == 4) {
            mp.players.forEach((rec) => {
                if (rec.faction == player.faction) {
                    if (rec.sqlId != player.sqlId) rec.call(`tablet.fib.addTeamPlayer`, [{
                        id: player.id,
                        name: player.name,
                        rank: rankName
                    }]);
                    player.call(`tablet.fib.addTeamPlayer`, [{
                        id: rec.id,
                        name: rec.name,
                        rank: mp.factions.getRankName(rec.faction, rec.rank)
                    }]);
                }
            });
        } else if (mp.factions.isArmyFaction(player.faction)) {
            mp.players.forEach((rec) => {
                if (rec.faction == player.faction) {
                    if (rec.sqlId != player.sqlId) rec.call(`tablet.army.addTeamPlayer`, [{
                        id: player.id,
                        name: player.name,
                        rank: rankName
                    }]);
                    player.call(`tablet.army.addTeamPlayer`, [{
                        id: rec.id,
                        name: rec.name,
                        rank: mp.factions.getRankName(rec.faction, rec.rank)
                    }]);
                }
            });
        }
    }

    /* Оповещаем членов организации о том, что вышел коллега. */
    mp.broadcastExitFactionPlayers = (player) => {
        if (!player.faction) return;
        if (mp.factions.isHospitalFaction(player.faction)) {
            mp.players.forEach((rec) => {
                if (rec.faction == player.faction) rec.call(`tablet.medic.removeTeamPlayer`, [player.id]);
            });
        } else if (player.faction == 2) {
            mp.players.forEach((rec) => {
                if (rec.faction == player.faction) rec.call(`tablet.police.removeTeamPlayer`, [player.id]);
            });
        } else if (player.faction == 3) {
            mp.players.forEach((rec) => {
                if (rec.faction == player.faction) rec.call(`tablet.sheriff.removeTeamPlayer`, [player.id]);
            });
        } else if (player.faction == 4) {
            mp.players.forEach((rec) => {
                if (rec.faction == player.faction) rec.call(`tablet.fib.removeTeamPlayer`, [player.id]);
            });
        } else if (mp.factions.isArmyFaction(player.faction)) {
            mp.players.forEach((rec) => {
                if (rec.faction == player.faction) rec.call(`tablet.army.removeTeamPlayer`, [player.id]);
            });
        }
    }

    mp.updateFactionPlayers = (player) => {
        if (!player.faction) return;
        if (mp.factions.isHospitalFaction(player.faction)) {
            mp.players.forEach((rec) => {
                if (rec.faction == player.faction) {
                    rec.call(`tablet.medic.removeTeamPlayer`, [player.id]);
                    rec.call(`tablet.medic.addTeamPlayer`, [{
                        id: player.id,
                        name: player.name,
                        rank: mp.factions.getRankName(player.faction, player.rank)
                    }]);
                }
            });
        } else if (player.faction == 2) {
            mp.players.forEach((rec) => {
                if (rec.faction == player.faction) {
                    rec.call(`tablet.police.removeTeamPlayer`, [player.id]);
                    rec.call(`tablet.police.addTeamPlayer`, [{
                        id: player.id,
                        name: player.name,
                        rank: mp.factions.getRankName(player.faction, player.rank)
                    }]);
                }
            });
        } else if (player.faction == 3) {
            mp.players.forEach((rec) => {
                if (rec.faction == player.faction) {
                    rec.call(`tablet.sheriff.removeTeamPlayer`, [player.id]);
                    rec.call(`tablet.sheriff.addTeamPlayer`, [{
                        id: player.id,
                        name: player.name,
                        rank: mp.factions.getRankName(player.faction, player.rank)
                    }]);
                }
            });
        } else if (player.faction == 4) {
            mp.players.forEach((rec) => {
                if (rec.faction == player.faction) {
                    rec.call(`tablet.fib.removeTeamPlayer`, [player.id]);
                    rec.call(`tablet.fib.addTeamPlayer`, [{
                        id: player.id,
                        name: player.name,
                        rank: mp.factions.getRankName(player.faction, player.rank)
                    }]);
                }
            });
        } else if (mp.factions.isArmyFaction(player.faction)) {
            mp.players.forEach((rec) => {
                if (rec.faction == player.faction) {
                    rec.call(`tablet.army.removeTeamPlayer`, [player.id]);
                    rec.call(`tablet.army.addTeamPlayer`, [{
                        id: player.id,
                        name: player.name,
                        rank: mp.factions.getRankName(player.faction, player.rank)
                    }]);
                }
            });
        }
    }

    mp.clearFactionPlayers = (player) => {
        if (!player.faction) return;
        if (mp.factions.isHospitalFaction(player.faction)) {
            mp.players.forEach((rec) => {
                if (rec.faction == player.faction) player.call(`tablet.medic.removeTeamPlayer`, [rec.id]);
            });
        } else if (player.faction == 2) {
            mp.players.forEach((rec) => {
                if (rec.faction == player.faction) player.call(`tablet.police.removeTeamPlayer`, [rec.id]);
            });
        } else if (player.faction == 3) {
            mp.players.forEach((rec) => {
                if (rec.faction == player.faction) player.call(`tablet.sheriff.removeTeamPlayer`, [rec.id]);
            });
        } else if (player.faction == 4) {
            mp.players.forEach((rec) => {
                if (rec.faction == player.faction) player.call(`tablet.fib.removeTeamPlayer`, [rec.id]);
            });
        } else if (mp.factions.isArmyFaction(player.faction)) {
            mp.players.forEach((rec) => {
                if (rec.faction == player.faction) player.call(`tablet.army.removeTeamPlayer`, [rec.id]);
            });
        }
    }

    mp.getLicName = (license) => {
        var names = {
            1: "Car license",
            2: "Motor vehicle license",
            3: "Boat license",
            4: "Yacht license",
            11: "Helicopter license",
            12: "Aircraft license",
        };
        if (!names[license]) return "License";
        return names[license];
    }

    mp.convertMinutesToLevelRest = (minutes) => {
        var exp = parseInt(minutes / 60);
        if (exp < 8) return {
            level: 1,
            nextLevel: 8,
            rest: exp
        };
        var i = 2;
        var add = 16;
        var temp = 24;
        while (i < 200) {
            if (exp < temp) {
                return {
                    level: i,
                    nextLevel: temp - add,
                    rest: exp - (temp - add)
                };
            }
            i++;
            add += 8;
            temp += add;
        }
        return -1;
    }

    mp.getPointsOnInterval = (point1, point2, step) => {
        var vectorX = point2.x - point1.x;
        var vectorY = point2.y - point1.y;

        var vectorLenght = Math.sqrt(Math.pow(vectorX, 2) + Math.pow(vectorY, 2));
        var countOfPoint = parseInt(vectorLenght / step);

        var stepX = vectorX / countOfPoint;
        var stepY = vectorY / countOfPoint;

        var pointsOnInterval = [];

        for (var i = 1; i < countOfPoint; i++) {
            var point = {
                x: point1.x + stepX * i,
                y: point1.y + stepY * i
            }
            pointsOnInterval.push(point);
        }

        return pointsOnInterval;
    }

    mp.broadcastAdmins = (text) => {
        mp.players.forEach((rec) => {
            if (rec.sqlId && rec.admin) rec.call("chat.custom.push", [text]);
            // chatAPI.custom_push(`<a style="color: #FF0000">[A] Tomat Petruchkin:</a> всем доброго времени суток!`);
        });
    }

}

function initPoliceCells() {
    var cellOne = new mp.Vector3(460.03, -994.1, 24.91);
    cellOne.h = 268.34;

    var cellTwo = new mp.Vector3(460.09, -998.03, 24.91);
    cellTwo.h = 268.34;

    var cellThree = new mp.Vector3(460.02, -1001.57, 24.91);
    cellThree.h = 268.34;

    var cellsExit = new mp.Vector3(461.64, -989.16, 24.91);
    cellsExit.h = 93.45;

    mp.policeCells = [cellOne, cellTwo, cellThree];
    mp.policeCellsExit = cellsExit;
}
