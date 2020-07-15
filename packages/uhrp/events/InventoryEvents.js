module.exports = {
    "item.throw": (player, sqlId) => {
        // //debug(`${player.name} called item.throw: ${sqlId}`);
        var item = player.inventory.getItem(sqlId);
        if (!item) {
            player.call(`inventory.delete`, [sqlId]);
            return player.utils.error(`There's nothing to throw away!`);
        }
        if (player.vehicle) return player.utils.error(`Get out of the car!`);
        if (player.hasCuffs) return player.utils.error(`You're in handcuffs!`);
        // TODO: Поумнее сделать.
        var level = mp.convertMinutesToLevelRest(player.minutes).level;
        // if (item.itemId == 4 && level < 100) return player.utils.error(`Временно выключено!`);

        player.inventory.delete(sqlId, (e) => {
            if (e) return player.utils.error(e);
            var info = mp.inventory.getItem(item.itemId);
            var pos = player.position;
            pos.z--;
            pos.z += info.deltaZ;
            var newObj = mp.objects.new(mp.joaat(info.model), pos, {
                rotation: new mp.Vector3(info.rX, info.rY, player.heading),
                dimension: player.dimension
            });
            newObj.item = item;
            newObj.setVariable("inventoryItemSqlId", sqlId);

            pos.z += 0.5;
            /*player.call("label.create", ["E", pos, {
                "inventoryItemSqlId": sqlId
            }, null, 2]);*/
            player.utils.success(`You threw away the object!`);
            mp.logs.addLog(`${player.name} thrown to the ground ${mp.inventory.getItem(item.itemId).name}`, 'inventory', player.account.id, player.sqlId, { socialClub: player.socialClub, item: mp.inventory.getItem(item.itemId).name, coord: newObj.pos, obj: newObj });

            var id = newObj.id;
            newObj.timerId = setTimeout(() => {
                try {
                    var o = mp.objects.at(id);
                    if (!o || o.getVariable("inventoryItemSqlId") != sqlId) return;

                    o.destroy();
                } catch (e) {
                    console.log(e);
                }
            }, mp.economy["alive_ground_item"].value);

            for (var i = 0; i < player.inventory.ground.length; i++) {
                var gr = player.inventory.ground[i];
                if (gr == sqlId) {
                    player.inventory.ground.splice(i, 1);
                    i--;
                }
            }

            player.inventory.ground.push(sqlId);
            if (player.inventory.ground.length > mp.economy["ground_items_count"].value) {
                var gr = player.inventory.ground.shift();
                mp.objects.forEach((o) => {
                    if (o.getVariable("inventoryItemSqlId") == gr) {
                        clearTimeout(o.timerId);
                        o.destroy();
                    }
                });
            }
            // //debug(JSON.stringify(player.inventory.ground));

        });
    },

    "item.pickUp": (player, objId) => {
        ////debug(`${player.name} called item.pickUp: ${objId}`);
        var itemObj = mp.objects.at(objId);
        if (!itemObj) return player.utils.error(`No object found!`);
        if (!itemObj.getVariable("inventoryItemSqlId") || !itemObj.item) return player.utils.error(`The object is not the subject!`);
        if (itemObj.denyPickUp) return player.utils.error(`Another citizen began to raise the first!`);
        if (player.hasCuffs) return player.utils.error(`You're in handcuffs!`);
        var dist = player.dist(itemObj.position);
        if (dist > Config.maxPickUpItemDist) return player.utils.error(`You're too far away from the subject!`);
        var freeSlot = player.inventory.findFreeSlot(itemObj.item.itemId);
        if (!freeSlot) {
            //ищем предметы с вместимостью
            mp.objects.forEachInRange(player.position, Config.maxPickUpItemDist, (obj) => {
                if (obj.getVariable("inventoryItemSqlId") && !obj.denyPickUp) {
                    var item = obj.item;
                    // TODO: Чекнуть, возможно, здесь не нужно условие.
                    if (item.itemId == 7 || item.itemId == 8 || item.itemId == 13) {
                        var slot = player.inventory.findFreeSlot(item.itemId);
                        if (slot) itemObj = obj;
                        return;
                    }
                }
            });
        }
        // TODO: Разрешить поднимать одежду противоположного пола.
        if (itemObj.item.params.sex != null && itemObj.item.params.sex != player.sex) return player.utils.error(`Clothes don't fit!`);

        itemObj.denyPickUp = true;
        player.inventory.addOld(itemObj.item.id, itemObj.item, (e) => {
            delete itemObj.denyPickUp;
            if (e) return player.utils.error(e);
            mp.events.call("anim", player, "random@domestic", "pickup_low", 0, 1000);
            player.utils.success(`Item added!`);
            //player.call(`itemLabel.destroy`, [itemObj.getVariable("inventoryItemSqlId")]);
            clearTimeout(itemObj.timerId);
            itemObj.destroy();
        });
    },

    "item.updatePos": (player, data) => {
        // //debug(`${player.name} called item.updatePos: ${data}`);
        data = JSON.parse(data);
        var sqlId = data[0];
        var parentSqlId = data[1];
        var index = data[2];
        var inVehicle = data[3] || false;

        if (inVehicle) {
            if (player.bootVehicleId == null) return player.utils.error(`You don't interact with the trunk of the car!`);
            var veh = mp.vehicles.at(player.bootVehicleId);
            if (!veh) return player.utils.error(`Auto with ID: ${vehId} not found!`);
            var dist = player.dist(veh.position);
            if (dist > Config.maxInteractionDist * 2) return player.utils.error(`Auto too far!`);
            if (!veh.getVariable("boot")) return player.utils.error(`The trunk is closed!`);
            if (!veh.inventory) return player.utils.error(`Auto has no inventory!`);
            if (!veh.sqlId) return player.utils.error(`The car is not in the database!`);
            if (!parentSqlId) {
                //debug(`Move inside the trunk.`);
                return veh.inventory.updatePos(sqlId, parentSqlId, index);
            }
            if (parentSqlId == -1) {
                // надели на игрока
                var item = veh.inventory.getItem(sqlId);
                if (!item) return player.utils.error(`No item found!`);
                veh.inventory.delete(sqlId, (e) => {
                    if (e) return player.utils.error(e);

                    player.inventory.add(item.itemId, item.params, item.items || {}, (e) => {
                        if (e) return player.utils.error(e);

                        player.utils.info(`You took the item from the trunk.`);
                        //debug(`Moved from the trunk to the player's body.`);
                    });
                });
            } else {
                // из Sullenажника в вещь игрока
                var item = veh.inventory.getItem(sqlId);
                if (!item) return player.utils.error(`No item found!`);
                veh.inventory.delete(sqlId, (e) => {
                    if (e) return player.utils.error(e);

                    var parentItem = player.inventory.getItem(parentSqlId);
                    if (!parentItem) return player.utils.error(`Item has not been found!`);

                    player.inventory.addToItem(item, parentSqlId, index, (e, insertId) => {
                        if (e) return player.utils.error(e);
                        player.call("inventory.updateSqlId", [sqlId, insertId]);
                        player.utils.info(`You took the item from the trunk.`);
                        //debug(`Moved from the trunk to the player's item.`);
                    });
                });
            }
        } else {
            if (parentSqlId == -2) {
                /* Перетащили из инвентаря игрока в Sullenажник. */
                if (player.bootVehicleId == null) return player.utils.error(`You don't interact with the trunk of the car!`);
                var veh = mp.vehicles.at(player.bootVehicleId);
                if (!veh) return player.utils.error(`Auto with ID: ${vehId} not found!`);
                var dist = player.dist(veh.position);
                if (dist > Config.maxInteractionDist * 2) return player.utils.error(`Auto too far!`);
                if (!veh.getVariable("boot")) return player.utils.error(`The trunk is closed!`);
                if (!veh.inventory) return player.utils.error(`Auto has no inventory!`);
                if (!veh.sqlId) return player.utils.error(`The car is not in the database!`);

                var item = player.inventory.getItem(sqlId);
                if (!item) return player.utils.error(`No item found!`);
                if (item.items && Object.keys(item.items).length > 0) return player.utils.error(`Free your pockets!`);

                player.inventory.delete(sqlId);
                veh.inventory.add(item.itemId, item.params, item.items || {}, (e, insertId) => {
                    if (e) return player.utils.error(e);
                    item.index = index;
                    delete item.parentId;
                    var i = {};
                    i[insertId] = item;
                    player.call("inventory.vehAdd", [i]);
                    player.call("inventory.updateSqlId", [sqlId, insertId]);
                    player.utils.info(`You put the item in the trunk`);
                    //debug(`We move from the player to the trunk.`);
                }, false, index);
            } else {
                player.inventory.updatePos(sqlId, parentSqlId, index, (e) => {
                    if (e) return player.utils.error(e);

                    //debug(`Move inside the player.`);
                });
            }
        }

    },

    "items.merge": (player, data) => {
        data = JSON.parse(data);
        // //debug(`items.merge: ${player.name} ${data}`);
        var item = player.inventory.getItem(data[0]);
        var targetItem = player.inventory.getItem(data[1]);
        if (!item || !targetItem) return player.utils.error(`One of the objects for the merger has not been found!`);
        var drugsIds = [55, 56, 57, 58];

        if (item.itemId == 4 && targetItem.itemId == 4) { // слияние денег
            targetItem.params.count += item.params.count;
            item.params.count = 0;
            //player.utils.setMoney(player.money + item.params.count);
            player.inventory.delete(data[0]);
            player.inventory.updateParams(data[1], targetItem);
        } else if (item.params.ammo && !item.params.weaponHash && targetItem.params.ammo && !targetItem.params.weaponHash && item.itemId == targetItem.itemId) { //слияние патрон
            targetItem.params.ammo += item.params.ammo;
            item.params.ammo = 0;
            //player.utils.setMoney(player.money + item.params.count);
            player.inventory.delete(data[0]);
            player.inventory.updateParams(data[1], targetItem);
        } else if (item.params.ammo != null && !item.params.weaponHash && targetItem.params.weaponHash) {
            var weaponAmmo = {
                "20": 37, //9mm
                "21": 38, //12mm
                "22": 40, //5.56mm
                "23": 39, //7.62mm
                "44": 37,
                "45": 37,
                "46": 37,
                "47": 37,
                "48": 37,
                "49": 38,
                "50": 39,
                "51": 40,
                "52": 39,
                "53": 39,
            };
            if (item.itemId != weaponAmmo[targetItem.itemId]) return player.utils.error(`Wrong type of cartridge!`);

            targetItem.params.ammo += item.params.ammo;
            //player.call(`addWeaponAmmo`, [targetItem.params.weaponHash, item.params.ammo]);
            player.setWeaponAmmo(targetItem.params.weaponHash, parseInt(targetItem.params.ammo));
            player.inventory.delete(data[0]);
            player.inventory.updateParams(data[1], targetItem);
        } else if (item.itemId == targetItem.itemId && drugsIds.indexOf(item.itemId) != -1) {
            targetItem.params.count += item.params.count;
            item.params.count = 0;
            player.inventory.delete(data[0]);
            player.inventory.updateParams(data[1], targetItem);
        } else if (item.itemId == 62 && targetItem.itemId == 34) {
            if (targetItem.params.count >= 20) return player.utils.error(`The bag is full!`);
            targetItem.params.count++;
            player.inventory.delete(data[0]);
            player.inventory.updateParams(data[1], targetItem);
        }
    },

    "item.split": (player, data) => {
        // //debug(`item.split: ${player.name} ${data}`);
        return player.utils.error(`Separation is off!`);
        data = JSON.parse(data);
        var item = player.inventory.getItem(data[0]);

        if (!item) return player.utils.error(`No item found!`);
        var itemIds = [4, 37, 38, 39, 40, 55, 56, 57, 58];
        if (itemIds.indexOf(item.itemId) == -1) return player.utils.error(`Wrong type of item!`);

        if (item.params.ammo) { // разделение патрон
            var count = Math.clamp(data[1], 0, item.params.ammo - 1);
            var freeSlot = player.inventory.findFreeSlot(item.itemId);
            if (!freeSlot) return player.utils.error(`No free slot found!`);
            if (count >= item.params.ammo) return player.utils.error(`Wrong number!`);
            item.params.ammo -= count;
            player.inventory.updateParams(data[0], item);
            player.inventory.add(item.itemId, {
                ammo: count
            });
        } else {
            var count = Math.clamp(data[1], 0, item.params.count - 1);
            var freeSlot = player.inventory.findFreeSlot(item.itemId);
            if (!freeSlot) return player.utils.error(`No free slot found!`);
            if (count >= item.params.count) return player.utils.error(`Wrong number!`);
            item.params.count -= count;
            player.inventory.updateParams(data[0], item);
            player.inventory.add(item.itemId, {
                count: count
            }, null, null, true);
        }

        player.utils.success(`Item divided!`);
    },

    "weapon.throw": (player, itemSqlId, ammo) => {
        ////debug(`weapon.throw: ${itemSqlId} ${ammo}`);
        var item = player.inventory.getItem(itemSqlId);
        if (!item) return player.utils.error(`Weapons not found!`);
        ammo = Math.clamp(ammo, 0, 10000);
        item.params.ammo = ammo;
        player.inventory.updateParams(itemSqlId, item);
        mp.events.call("item.throw", player, itemSqlId, ammo);
    },

    "weapon.updateAmmo": (player, weaponHash, ammo) => {
        ////debug(`weapon.updateAmmo: ${weaponHash} ${ammo}`);
        ////debug(mp.joaat("weapon_carbinerifle"));
        var weapons = player.inventory.getArrayWeapons();
        var fixHashes = {
            "-2084633992": "2210333304",
            "-1569615261": "2210333304",
            "-1045183535": "2210333304",
            "-1786099057": "2210333304",
            "-656458692": "2210333304",
            "-1716189206": "2210333304",
            "453432689": "2210333304",
            "584646201": "2210333304",
            "324215364": "2210333304",
            "736523883": "2210333304",
            "487013001": "2210333304",
            "2017895192": "2210333304",
            "-1074790547": "2210333304",
            "2132975508": "2210333304",
            "1649403952": "2210333304",
            "-1660422300": "2210333304",
            "100416529": "2210333304",
            "1737195953": "2210333304",
            "-1951375401": "2210333304",
            "911657153": "2210333304",
            "1593441988": "2210333304",
        }; //to do дополнить
        for (var key in weapons) {
            var item = weapons[key];
            var invWeaponHash = item.params.weaponHash;
            var fixHash = fixHashes[weaponHash];
            ////debug(`weaponHash: ${weaponHash}`);
            ////debug(`invWeaponHash: ${invWeaponHash}`);
            ////debug(`fixHash: ${fixHash}`);
            if (invWeaponHash == weaponHash || (fixHash && fixHash == invWeaponHash)) {
                ////debug(`updateAmmo ok!`);
                ammo = Math.clamp(ammo, 0, 10000);
                item.params.ammo = ammo;
                player.inventory.updateParams(item.id, item);
                return;
            }
        }

        // Перепишу, отвечаю, 27 апреля 2019 | Tomat
        /*player.removeAllWeapons();
        player.utils.error(`Weapons с HASH: ${weaponHash} not found!`);

        // TODO: Сделать лучше.
        var adm_color = "#ff6666"; // Цвет для реальных пацанов: #FF0000
        mp.players.forEach((rec) => {
            if (rec.sqlId && rec.admin) rec.call("chat.custom.push", [`<a style="color: ${adm_color}">[A] ${player.name}</a> использует неизвестное оружие ${weaponHash}`]);
            // chatAPI.custom_push(`<a style="color: #FF0000">[A] Tomat Petruchkin:</a> всем доброго времени суток!`);
        });*/
    },

    /* Игрок начал взаимодействие с Sullenажником. */
    "vehicle.requestItems": (player, vehId) => {
        // //debug(`vehicle.requestItems: ${player.name} ${vehId}`)
        var veh = mp.vehicles.at(vehId);
        if (!veh) return player.utils.error(`Auto with ID: ${vehId} not found!`);
        var dist = player.dist(veh.position);
        if (dist > Config.maxInteractionDist * 2) return player.utils.error(`Auto too far!`);
        if (!veh.getVariable("boot")) return player.utils.error(`The trunk is closed!`);
        if (!veh.inventory) return player.utils.error(`The car does not have a trunk!`);
        if (!veh.sqlId) return player.utils.error(`The car is not in the database!`);
        if (veh.bootPlayerId != null) return player.utils.error(`Another citizen interacts with the trunk!`);

        veh.bootPlayerId = player.id;
        player.bootVehicleId = veh.id;
        player.call(`inventory.addVehicleItems`, [veh.inventory.items, {
            name: veh.name,
            sqlId: veh.sqlId
        }, 5, 10]);
        // console.log(veh);
    },

    /* Игрок закончил взаимодействие с Sullenажником. */
    "vehicle.requestClearItems": (player, vehId) => {
        // //debug(`vehicle.requestClearItems: ${player.name} ${vehId}`)
        var veh = mp.vehicles.at(vehId);
        player.call(`inventory.deleteVehicleItems`);
        delete player.bootVehicleId;

        if (veh && player.id == veh.bootPlayerId) {
            delete veh.bootPlayerId;
        }
    },


    /* Индивидуальная Функциональность предметов инвентаря. */
    "showDocuments": (player, itemSqlId) => {
        ////debug(`showDocuments: ${itemSqlId}`);
        var item = player.inventory.getItem(itemSqlId);
        if (!item || item.itemId != 16) {
            player.call("inventory.delete", [itemSqlId]);
            return player.utils.error(`No item found!`);
        }
        if (!item.params.owner) return player.utils.error(`The owner of the item has not been found!`);
        DB.Handle.query(`SELECT id,name,sex,minutes,law,relationshipName,relationshipDate
                  FROM characters WHERE id=?`, [item.params.owner], (e, result) => {
            if (result.length == 0) return player.utils.error(`Player with ID: ${item.params.owner} not found!`);

            var data = {};
            for (var key in result[0]) data[key] = result[0][key];
            data.houses = convertHousesToDocHouses(mp.houses.getArrayByOwner(item.params.owner));
            data.licenses = JSON.parse(JSON.stringify(item.params.licenses || []));
            data.weapon = JSON.parse(JSON.stringify(item.params.weapon || []));
            data.work = JSON.parse(JSON.stringify(item.params.work || []));

            for (var i = 0; i < data.work.length; i++) {
                var faction = mp.factions.getBySqlId(data.work[i].faction);
                data.work[i].faction = faction.name;
                data.work[i].rank = mp.factions.getRankName(faction.sqlId, data.work[i].rank);
            }

            player.call(`documents.showAll`, [data]);
        });
    },

    "documents.show": (player, recId, docType) => {
        var rec = mp.players.at(recId);
        if (!rec) return player.utils.error(`Citizen not found!`);
        var dist = player.dist(rec.position);
        if (dist > Config.maxInteractionDist) return player.utils.error(`Citizen far away!`);

        var items = player.inventory.getArrayByItemId(16); // документы
        var keys = Object.keys(items);
        if (keys.length == 0) return player.utils.error(`Documents not found!`);
        var item = items[keys[0]];
        if (!item.params.owner) return player.utils.error(`The owner of the item has not been found!`);

        var data = {};
        switch (docType) {
            case "passport":
                DB.Handle.query(`SELECT id,name,sex,minutes,law,relationshipName,relationshipDate,houses FROM characters WHERE id=?`,
                    [item.params.owner], (e, result) => {

                        if (result.length == 0) return player.utils.error(`Player with ID: ${item.params.owner} not found!`);

                        for (var key in result[0]) data[key] = result[0][key];
                        data.houses = JSON.parse(data.houses);

                        rec.call(`documents.showPassport`, [data]);
                    });
                break;
            case "licenses":
                data.licenses = JSON.parse(JSON.stringify(item.params.licenses || []));
                rec.call(`documents.showLicenses`, [data]);
                break;
            case "weapon":
                data.weapon = JSON.parse(JSON.stringify(item.params.weapon || []));
                rec.call(`documents.showWeapon`, [data]);
                break;
            case "work":
                data.work = JSON.parse(JSON.stringify(item.params.work || []));

                for (var i = 0; i < data.work.length; i++) {
                    var faction = mp.factions.getBySqlId(data.work[i].faction);
                    data.work[i].faction = faction.name;
                    data.work[i].rank = mp.factions.getRankName(faction.sqlId, data.work[i].rank);
                }
                rec.call(`documents.showWork`, [data]);
                break;
            default:
                player.utils.error(`Type of document is not identified!`);
                return;
        }

        player.utils.info(`You showed the documents.`);
        rec.utils.info(`${player.name} showed you the documents`);
    },

    "documents.showFaction": (player, recId) => {
        // //debug(`documents.showFaction: ${player.name} ${recId}`);
        if (recId == -1) recId = player.id;
        var rec = mp.players.at(recId);
        if (!rec) return player.utils.error(`Citizen not found!`);
        var dist = player.dist(rec.position);
        if (dist > Config.maxInteractionDist) return player.utils.error(`Citizen far away!`);

        if (!player.faction) return player.error(`You are not a member of the organization!`);
        var itemId;
        if (mp.factions.isPoliceFaction(player.faction)) itemId = 29;
        else if (mp.factions.isFibFaction(player.faction)) itemId = 61;
        else if (mp.factions.isHospitalFaction(player.faction)) itemId = 63;
        else if (mp.factions.isArmyFaction(player.faction)) itemId = 60;

        var items = player.inventory.getArrayByItemId(itemId); // удостоверение
        var keys = Object.keys(items);
        if (keys.length == 0) return player.utils.error(`Identity not found!`);
        var item = items[keys[0]];
        if (!item.params.owner) return player.utils.error(`The owner of the item has not been found!`);
        if (item.params.owner != player.sqlId) return player.utils.error(`You can't show someone else's ID!`);
        if (item.params.faction != player.faction) return player.utils.error(`You can't show your identity to another organization!`);

        var data = {
            Name: player.name,
            Sex: player.sex,
            Minutes: player.minutes,
            Rank: mp.factions.getRankName(player.faction, player.rank),
            ID: player.sqlId,
            Area: '#1',
            faction: player.faction
        };

        rec.call(`documents.showFaction`, [data]);

        if (recId != player.id) {
            player.utils.info(`You showed your ID.`);
            rec.utils.info(`${player.name} showed you your ID`);
        }
    },

    /* События копов. */
    "cuffsOnPlayer": (player, recId) => { // надеть/снять наручники
        var rec = mp.players.at(recId);
        if (!rec) return player.utils.error(`Citizen not found!`);
        var dist = player.dist(rec.position);
        if (dist > Config.maxInteractionDist) return player.utils.error(`Citizen far away!`);
        if (!mp.factions.isPoliceFaction(player.faction) && !mp.factions.isFibFaction(player.faction)) return player.utils.error(`You are not an officer on duty!`);
        if (rec.vehicle) return player.utils.error(`Citizen в авто!`);

        if (!rec.hasCuffs) {
            var cuffsItems = player.inventory.getArrayByItemId(28);
            if (!Object.keys(cuffsItems).length) return player.utils.error(`You don't have handcuffs!`);
            player.inventory.delete(Object.values(cuffsItems)[0].id);

            rec.utils.info(`${player.name} Handcuffed you`);
            player.utils.success(`${rec.name} handcuffed`);
        } else {
            var params = {
                faction: player.faction,
                owner: player.sqlId
            };
            player.inventory.add(28, params, {}, (e) => {
                if (e) return player.utils.error(e);
            });

            rec.utils.info(`${player.name} took off your handcuffs`);
            player.utils.info(`${rec.name} no handcuffs`);

            delete rec.isFollowing;
            rec.call(`stopFollowToPlayer`);
        }

        rec.utils.setCuffs(!rec.hasCuffs);
    },

    "showWantedModal": (player, recId) => { // показать окно выдачи розыска
        var rec = mp.players.at(recId);
        if (!rec) return player.utils.error(`Citizen not found!`);
        //var dist = player.dist(rec.position);
        //if (dist > Config.maxInteractionDist) return player.utils.error(`Citizen far away!`);
        if (!mp.factions.isPoliceFaction(player.faction) && !mp.factions.isFibFaction(player.faction)) return player.utils.error(`You are not an officer on duty!`);
        if (rec.wanted >= Config.maxWantedLevel) return player.utils.error(`${rec.name} has the maximum level of wanted!`);

        player.call(`modal.show`, ["give_wanted", {
            "playerId": recId,
            "playerName": rec.name,
            "wanted": rec.wanted
        }]);
    },

    "giveWanted": (player, data) => {
        ////debug(`giveWanted: ${data}`);
        data = JSON.parse(data);
        var recId = data[0],
            wanted = data[1],
            reason = data[2];
        var rec = mp.players.at(recId);
        if (!rec) return player.utils.error(`Citizen not found!`);
        //var dist = player.dist(rec.position);
        //if (dist > Config.maxInteractionDist) return player.utils.error(`Citizen far away!`);
        if (!mp.factions.isPoliceFaction(player.faction) && !mp.factions.isFibFaction(player.faction)) return player.utils.error(`You are not an officer on duty!`);
        if (wanted > Config.maxWantedLevel) return player.utils.error(`Choose from 1 to ${Config.maxWantedLevel} wanted level!`);
        if (rec.wanted >= Config.maxWantedLevel) return player.utils.error(`${rec.name} has the maximum level of wanted!`);

        rec.utils.setWanted(rec.wanted + wanted);
        player.utils.success(`${rec.name} wanted`);
        rec.utils.warning(`${player.name} declared you wanted`);
        mp.logs.addLog(`${player.name} announced player ${rec.name} wanted. Stars: ${wanted}`, 'faction', player.account.id, player.sqlId, { faction: player.faction, wanted: wanted });
        mp.logs.addLog(`${rec.name} was declared a player ${player.name} wanted. Stars: ${wanted}`, 'faction', rec.account.id, rec.sqlId, { faction: rec.faction, wanted: wanted });


        //todo broadcast for radio
    },

    "showFinesModal": (player, recId) => { // показать окно выписки штрафа
        var rec = mp.players.at(recId);
        if (!rec) return player.utils.error(`Citizen not found!`);
        //var dist = player.dist(rec.position);
        //if (dist > Config.maxInteractionDist) return player.utils.error(`Citizen far away!`);
        if (!mp.factions.isPoliceFaction(player.faction)) return player.utils.error(`You are not an officer on duty!`);

        player.call(`modal.show`, ["give_fine", {
            "playerId": recId,
            "playerName": rec.name,
            "wanted": rec.wanted
        }]);
    },

    "giveFine": (player, data) => {
        ////debug(`giveWanted: ${data}`);
        data = JSON.parse(data);
        var recId = data[0],
            sum = data[1],
            reason = data[2].trim();
        sum = Math.clamp(sum, 1, mp.economy["max_fine_sum"].value);
        var rec = mp.players.at(recId);
        if (!rec) return player.utils.error(`Citizen not found!`);
        //var dist = player.dist(rec.position);
        //if (dist > Config.maxInteractionDist) return player.utils.error(`Citizen far away!`);
        if (!mp.factions.isPoliceFaction(player.faction)) return player.utils.error(`You are not an officer on duty!`);

        rec.fines++;
        DB.Handle.query("INSERT INTO fines (cop,recipient,reason,price,date) VALUES (?,?,?,?,?)",
            [player.sqlId, rec.sqlId, reason, sum, new Date().getTime() / 1000], (e) => {
                if (e) terminal.error(e);
            });

        player.utils.success(`${rec.name} received a fine on ${sum}$`);
        rec.utils.warning(`${player.name} fine you ${sum}$`);
        mp.logs.addLog(`${player.name} issued a fine to the player ${rec.name}. Reason: ${reason}, Amount: ${sum}`, 'faction', player.account.id, player.sqlId, { faction: player.faction, reason: reason, sum: sum });
        mp.logs.addLog(`${rec.name} was issued a fine by the player ${player.name}. Reason: ${reason}, Amount: ${sum}`, 'faction', rec.account.id, rec.sqlId, { faction: rec.faction, reason: reason, sum: sum });

    },

    "startFollow": (player, recId) => {
        // //debug(`startFollow: ${recId}`)
        var rec = mp.players.at(recId);
        if (!rec) return player.utils.error(`Citizen not found!`);
        //var dist = player.dist(rec.position);
        //if (dist > Config.maxInteractionDist) return player.utils.error(`Citizen far away!`);
        if (!mp.factions.isPoliceFaction(player.faction) && !mp.factions.isFibFaction(player.faction)) return player.utils.error(`You are not an officer on duty!`);

        if (!rec.isFollowing) {
            if (!rec.hasCuffs) return player.utils.error(`Citizen не handcuffed!`);
            rec.isFollowing = true;
            rec.call(`startFollowToPlayer`, [player.id]);
        } else {
            delete rec.isFollowing;
            rec.call(`stopFollowToPlayer`);
        }
    },

    "putIntoVehicle": (player, recId, vehId) => {
        ////debug(`putIntoVehicle ${recId} ${vehId}`);
        var rec = mp.players.at(recId);
        if (!rec) return player.utils.error(`Citizen not found!`);
        if (rec.vehicle) return player.utils.error(`Citizen driving!`);
        //var dist = player.dist(rec.position);
        //if (dist > Config.maxInteractionDist) return player.utils.error(`Citizen far away!`);
        if (!mp.factions.isPoliceFaction(player.faction) && !mp.factions.isFibFaction(player.faction)) return player.utils.error(`You are not an officer on duty!`);

        var veh = mp.vehicles.at(vehId);
        if (!veh) return player.utils.error(`Auto not found!`);
        var freeSeat = [0, 1, 2];
        var occupants = veh.getOccupants();
        for (var i = 0; i < occupants.length; i++) {
            var occ = occupants[i];
            var index = freeSeat.indexOf(occ.seat);
            if (index != -1) freeSeat.splice(index, 1);
        }

        if (freeSeat.length == 0) return player.utils.error(`There's no room in the car!`);
        rec.call(`stopFollowToPlayer`);
        rec.putIntoVehicle(veh, freeSeat[0]);
        player.utils.success(`${rec.name} In the car!`);
        rec.utils.info(`${player.name} put you in the car!`);
    },

    "removeFromVehicle": (player, recName) => {
        ////debug(`removeFromVehicle: ${recName}`);
        var rec = mp.players.getByName(recName);
        if (!rec) return player.utils.error(`Citizen not found!`);

        if (rec.vehicle) rec.removeFromVehicle();

        rec.utils.info(`${player.name} pulled you out!`);
        player.utils.info(`${rec.name} pulled out`);
    },

    "arrestPlayer": (player, recId) => {
        var rec = mp.players.at(recId);
        if (!rec) return player.utils.error(`Citizen not found!`);
        //var dist = player.dist(rec.position);
        //if (dist > Config.maxInteractionDist) return player.utils.error(`Citizen far away!`);
        if (!mp.factions.isPoliceFaction(player.faction) && !mp.factions.isFibFaction(player.faction)) return player.utils.error(`You are not an officer on duty!`);
        if (rec.arrestTime > 0) {
            rec.utils.clearArrest();
            return rec.utils.info(`${player.name} released you`);
        }
        if (rec.wanted < 1) return player.utils.error(`Citizen is not a criminal!`);

        var dist = player.dist(mp.policeCells[0]);
        var cellIndex = 0;
        for (var i = 1; i < mp.policeCells.length; i++) {
            if (player.dist(mp.policeCells[i]) < dist) {
                dist = player.dist(mp.policeCells[i]);
                cellIndex = i;
            }
        }
        if (dist > 5) return player.utils.error(`You have to be at the camera!`);
        if (rec.hasCuffs) {
            var params = {
                faction: player.faction,
                owner: player.sqlId
            };
            player.inventory.add(28, params, {}, (e) => {
                if (e) return player.utils.error(e);
            });
        }

        DB.Handle.query("UPDATE characters SET arrestCell=? WHERE id=?", [cellIndex, rec.sqlId]);

        rec.utils.doArrest(cellIndex, rec.wanted * (mp.economy["wanted_arrest_time"].value / 1000));
        rec.utils.setWanted(0);

        rec.utils.info(`${player.name} put you in jail!`);

        player.utils.setMoney(player.money + mp.economy["police_arrest_pay"].value);
        player.utils.success(`You've planted ${rec.name}!`);
        mp.logs.addLog(`${player.name} arrested a player ${rec.name}. Time of arrest: ${rec.wanted * (mp.economy["wanted_arrest_time"].value / 1000)}`, 'faction', player.account.id, player.sqlId, { faction: player.faction, time: rec.wanted * (mp.economy["wanted_arrest_time"].value / 1000) });
        mp.logs.addLog(`${rec.name} was arrested by a player ${player.name}. Time of arrest: ${rec.wanted * (mp.economy["wanted_arrest_time"].value / 1000)}`, 'faction', rec.account.id, rec.sqlId, { faction: rec.faction, time: rec.wanted * (mp.economy["wanted_arrest_time"].value / 1000) });

        //player.utils.drawTextOverPlayer(`посадил ${rec.name}`);

        //todo broadcast to radio
    },

    "police.lockVeh": (player, vehId) => {
        var veh = mp.vehicles.at(vehId);
        if (!veh) return player.utils.error(`Auto not found!`);
        if (!mp.factions.isPoliceFaction(player.faction) && !mp.factions.isFibFaction(player.faction)) return player.utils.error(`You are not an officer on duty!`);
        if (!veh.locked) return player.utils.warning(`Auto doesn't need to be opened!`);
        if (veh.isSmuggling) return player.utils.error(`You can't open a dealer car!`);
        veh.locked = false;
        player.utils.success(`Auto uncovered!`);
    },

    "item.useDrugs": (player, sqlId) => {
        var drugs = player.inventory.getItem(sqlId);
        if (!drugs) return player.utils.error(`Drug not found!`);
        var drugsIds = [55, 56, 57, 58];
        var effects = ["DrugsDrivingOut", "DrugsMichaelAliensFightOut", "DrugsTrevorClownsFightOut", "DrugsTrevorClownsFightOut"];
        var index = drugsIds.indexOf(drugs.itemId);
        if (index == -1) return player.utils.error(`The subject is not a drug!`);
        if (!drugs.params.count) {
            player.inventory.delete(sqlId);
            return player.utils.error(`Left 0 grams!`);
        }

        var count = Math.clamp(drugs.params.count, 1, 5);
        player.health = Math.clamp(player.health + count * 15, 15, 100);
        drugs.params.count -= count;
        if (drugs.params.count <= 0) player.inventory.delete(sqlId);
        else player.inventory.updateParams(sqlId, drugs);

        player.call("effect", [effects[index], count * mp.economy["drugs_effect_time"].value]);
        player.utils.success(`You've used the drug!`);
    },

    "item.useSmoke": (player, sqlId) => {
        var smoke = player.inventory.getItem(sqlId);
        if (!smoke) return player.utils.error(`Cigarette not found!`);
        player.health = Math.clamp(player.health + 2, 2, 100);
        player.inventory.delete(sqlId);
        player.call("effect", ["DrugsDrivingOut", 10000]);
        if (player.vehicle) return;
        mp.players.forEachInRange(player.position, 20, (rec) => {
            rec.call(`playAnim`, [player.id, 31]);
        });
    },

    "item.takeSmoke": (player, sqlId) => {
        var smokeBox = player.inventory.getItem(sqlId);
        if (!smokeBox) return player.utils.error(`Smoke box not found!`);
        if (smokeBox.params.count <= 0) return player.utils.error(`Smoke box empty!`);

        player.inventory.add(62, {}, {}, (e) => {
            if (e) return player.utils.error(e);

            smokeBox.params.count--;
            player.inventory.updateParams(sqlId, smokeBox);
        });
    },

    "item.useHealth": (player, sqlId) => {
        var item = player.inventory.getItem(sqlId);
        if (!item || item.itemId != 25) return player.utils.error(`Plaster not found!`);
        if (player.health + item.params.count > 100) return player.utils.error(`You're healthy!`);
        if (player.getVariable("knockDown")) return player.utils.error(`You are not able to recover yourself!`);
        player.health = Math.clamp(player.health + item.params.count, 15, 100);
        player.inventory.delete(sqlId);
        player.utils.success(`Plaster used!`);
        // TODO: Анимку usedия пластыря.
    },
}

/* Конвертирует дома в простые данные для документов. */
function convertHousesToDocHouses(houses) {
    var data = [];
    console.log(`a`)
    console.log(houses)
    houses.forEach((house) => {
        console.log(`b`)
        data.push({
            id: house.id,
            position: house.position
        });
        console.log(`c`)
    });
    console.log(data)
    return data;
}
