module.exports = {
    "policeStorage.takeClothes": (player, index) => {
        if (!player.colshape || !player.colshape.policeStorage) return player.utils.error(`You're not at the Police warehouse!`);
        var policeStorageMarker = player.colshape.policeStorage;
        if (!mp.factions.isPoliceFaction(player.faction)) return player.utils.error(`You are not an officer on duty!`);

        var faction = mp.factions.getBySqlId(player.faction);
        if (!faction) return player.utils.error(`Organization with ID: ${player.faction} not found!`);
        var police = faction.name;

        if (faction.products < mp.economy["police_mainclothes_products"].value) return player.utils.error(`Insufficient ammunition!`);
        var hats = player.inventory.getArrayByItemId(6);
        var tops = player.inventory.getArrayByItemId(7);
        var legs = player.inventory.getArrayByItemId(8);
        var feets = player.inventory.getArrayByItemId(9);
        var ties = player.inventory.getArrayByItemId(2);
        var masks = player.inventory.getArrayByItemId(14);
        var glasses = player.inventory.getArrayByItemId(1);

        for (var key in hats)
            if (mp.factions.isPoliceFaction(hats[key].params.faction)) return player.utils.error(`You already have headpiece ${police}!`);
        for (var key in tops)
            if (mp.factions.isPoliceFaction(tops[key].params.faction)) return player.utils.error(`You already have shirt ${police}!`);
        for (var key in legs)
            if (mp.factions.isPoliceFaction(legs[key].params.faction)) return player.utils.error(`You already have pants ${police}!`);
        for (var key in feets)
            if (mp.factions.isPoliceFaction(feets[key].params.faction)) return player.utils.error(`You already have shoes ${police}!`);
        for (var key in ties)
            if (mp.factions.isPoliceFaction(ties[key].params.faction)) return player.utils.error(`You already have accessory ${police}!`);
        for (var key in masks)
            if (mp.factions.isPoliceFaction(masks[key].params.faction)) return player.utils.error(`You already have helmet ${police}!`);
        for (var key in glasses)
            if (mp.factions.isPoliceFaction(glasses[key].params.faction)) return player.utils.error(`You already have glasses ${police}!`);

        mp.fullDeleteItemsByParams(6, ["faction", "owner"], [player.faction, player.sqlId]);
        mp.fullDeleteItemsByParams(7, ["faction", "owner"], [player.faction, player.sqlId]);
        mp.fullDeleteItemsByParams(8, ["faction", "owner"], [player.faction, player.sqlId]);
        mp.fullDeleteItemsByParams(9, ["faction", "owner"], [player.faction, player.sqlId]);
        mp.fullDeleteItemsByParams(10, ["faction", "owner"], [player.faction, player.sqlId]);
        mp.fullDeleteItemsByParams(2, ["faction", "owner"], [player.faction, player.sqlId]);
        mp.fullDeleteItemsByParams(14, ["faction", "owner"], [player.faction, player.sqlId]);
        mp.fullDeleteItemsByParams(1, ["faction", "owner"], [player.faction, player.sqlId]);

        var hatParams, topParams, legsParams, feetsParams, tiesParams, masksParams, glassesParams;
        var f = player.faction - 2;
        if (player.sex == 1) {
            hatParams = {
                sex: 1,
                variation: [
                    [46, 124, 46],
                    [117, -1, -1, 58, -1, -1, 13]
                ][f][index],
                texture: [
                    [0, 15, 0],
                    [0, 0, 0, 1, 0, 0, 0]
                ][f][index]
            };
            topParams = {
                sex: 1,
                torso: [
                    [0, 108, 11],
                    [17, 0, 11, 11, 11, 11, 6]
                ][f][index],
                tTexture: [
                    [-1, 9, -1],
                    [-1, -1, -1, -1, -1, -1, -1]
                ][f][index],
                variation: [
                    [55, 89, 13],
                    [53, 242, 13, 13, 13, 13, 156]
                ][f][index],
                texture: [
                    [0, 0, 1],
                    [3, 2, 1, 1, 1, 2, 0]
                ][f][index],
                undershirt: [
                    [58, 129, -1],
                    [122, 129, 58, 58, 122, 130, 115]
                ][f][index]
            };
            legsParams = {
                sex: 1,
                variation: [
                    [35, 59, 35],
                    [47, 22, 22, 22, 37, 37, 25]
                ][f][index],
                texture: [
                    [0, 9, 0],
                    [1, 1, 1, 1, 1, 1, 6]
                ][f][index]
            };
            feetsParams = {
                sex: 1,
                variation: [
                    [25, 25, 10],
                    [25, 25, 25, 25, 25, 10, 10, 10]
                ][f][index],
                texture: [
                    [0, 0, 0],
                    [0, 0, 0, 0, 12, 0, 12]
                ][f][index]
            };
            tiesParams = {
                sex: 1,
                variation: [
                    [-1, -1, 21],
                    [-1, -1, 38, -1, 38, 38, -1]
                ][f][index],
                texture: [
                    [0, 0, 1],
                    [0, 0, 0, 0, 0, 1, 0]
                ][f][index]
            };
            masksParams = {
                sex: 1,
                variation: [
                    [-1, 35, -1],
                    [52, -1, -1, -1, -1, -1, -1]
                ][f][index],
                texture: [
                    [-1, 0, -1],
                    [0, 0, 0, 0, 0, 0, 0]
                ][f][index]
            };
            glassesParams = {
                sex: 1,
                variation: [
                    [-1, -1, -1],
                    [-1, -1, -1, -1, -1, -1, -1]
                ][f][index],
                texture: [
                    [0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0]
                ][f][index]
            };
        } else {
            hatParams = {
                sex: 0,
                variation: [
                    [45, 124, 45],
                    [116, -1, -1, 58, -1, -1, 20]
                ][f][index],
                texture: [
                    [0, 0, 0],
                    [0, 0, 0, 1, 0, 0, 1]
                ][f][index]
            };
            topParams = {
                sex: 0,
                torso: [
                    [31, 23, 31],
                    [18, 0, 0, 20, 20, 20, 20]
                ][f][index],
                variation: [
                    [48, 103, 48],
                    [46, 165, 27, 27, 27, 27, 183]
                ][f][index],
                texture: [
                    [0, 0, 0],
                    [3, 0, 2, 2, 2, 2, 2]
                ][f][index],
                undershirt: [
                    [-1, -1, 35],
                    [160, 78, 35, 35, 152, 152, 37]
                ][f][index]
            };
            legsParams = {
                sex: 0,
                variation: [
                    [34, 33, 34],
                    [49, 41, 64, 64, 41, 37, 37]
                ][f][index],
                texture: [
                    [0, 0, 0],
                    [1, 1, 2, 2, 1, 6, 6]
                ][f][index]
            };
            feetsParams = {
                sex: 0,
                variation: [
                    [29, 25, 29],
                    [25, 13, 55, 55, 29, 29, 29]
                ][f][index],
                texture: [
                    [0, 0, 0],
                    [0, 0, 0, 0, 0, 2, 2]
                ][f][index]
            };
            tiesParams = {
                sex: 1,
                variation: [
                    [-1, -1, -1],
                    [-1, -1, -1, -1, -1, -1, 95]
                ][f][index],
                texture: [
                    [0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0]
                ][f][index]
            };
            masksParams = {
                sex: 0,
                variation: [
                    [-1, -1, -1],
                    [57, -1, -1, -1, -1, -1, -1]
                ][f][index],
                texture: [
                    [0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0]
                ][f][index]
            };
            glassesParams = {
                sex: 0,
                variation: [
                    [-1, -1, -1, -1, 27, -1, -1, -1],
                    [-1, -1, -1, -1, -1, -1, -1]
                ][f][index],
                texture: [
                    [0, 0, 0, 0, 4, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0]
                ][f][index]
            };
        }
        if (topParams.undershirt == -1) delete topParams.undershirt;
        if (topParams.uTexture == -1) delete topParams.uTexture;
        if (topParams.tTexture == -1) delete topParams.tTexture;

        hatParams.faction = player.faction;
        topParams.faction = player.faction;
        legsParams.faction = player.faction;
        feetsParams.faction = player.faction;
        tiesParams.faction = player.faction;
        masksParams.faction = player.faction;
        glassesParams.faction = player.faction;

        topParams.rows = 4;
        topParams.cols = 4;
        legsParams.rows = 3;
        legsParams.cols = 5;
        topParams.name = police;
        legsParams.name = police;

        hatParams.owner = player.sqlId;
        topParams.owner = player.sqlId;
        legsParams.owner = player.sqlId;
        feetsParams.owner = player.sqlId;
        tiesParams.owner = player.sqlId;
        masksParams.owner = player.sqlId;
        glassesParams.owner = player.sqlId;

        var response = (e) => {
            if (e) player.utils.error(e);
        };
        if (hatParams.variation != -1) player.inventory.add(6, hatParams, {});
        if (topParams.variation != -1) player.inventory.add(7, topParams, {});
        if (legsParams.variation != -1) player.inventory.add(8, legsParams, {});
        if (feetsParams.variation != -1) player.inventory.add(9, feetsParams, {});
        if (tiesParams.variation != -1) player.inventory.add(2, tiesParams, {});
        if (masksParams.variation != -1) player.inventory.add(14, masksParams, {});
        if (glassesParams.variation != -1) player.inventory.add(1, glassesParams, {});

        player.utils.success(`You have been issued with a form ${police}!`);


        faction.setProducts(faction.products - mp.economy["police_mainclothes_products"].value);
        mp.logs.addLog(`${player.name} taken from the warehouse Form Police`, 'faction', player.account.id, player.sqlId, {
            faction: player.faction,
            count: 1
        });
    },

    "policeStorage.takeArmour": (player) => {
        if (!player.colshape || !player.colshape.policeStorage) return player.utils.error(`You're not at the PD warehouse!`);
        var policeStorageMarker = player.colshape.policeStorage;
        if (!mp.factions.isPoliceFaction(player.faction)) return player.utils.error(`You are not an officer on duty!`);

        var faction = mp.factions.getBySqlId(player.faction);
        if (!faction) return player.utils.error(`Organization with ID: ${player.faction} not found!`);
        var pd = faction.name;

        if (faction.products < mp.economy["police_armour_products"].value) return player.utils.error(`Insufficient ammunition!`);
        var items = player.inventory.getArrayByItemId(3);

        for (var sqlId in items)
            if (mp.factions.isPoliceFaction(items[sqlId].params.faction)) return player.utils.error(`You already have body armor ${pd}!`);

        mp.fullDeleteItemsByParams(3, ["faction", "owner"], [player.faction, player.sqlId]);
        var params;
        if (player.sex == 1) {
            params = {
                variation: 16,
                texture: 2
            };
        } else {
            params = {
                variation: 18,
                texture: 2
            };
        }

        params.faction = player.faction;
        params.owner = player.sqlId;
        params.armour = 100;
        params.sex = player.sex;


        player.inventory.add(3, params, {}, (e) => {
            if (e) return player.utils.error(e);
            player.utils.success(`You've been issued body armor ${pd}!`);
            faction.setProducts(faction.products - mp.economy["police_armour_products"].value);
            mp.logs.addLog(`${player.name} taken from the warehouse form armored vest LSPD`, 'faction', player.account.id, player.sqlId, {
                faction: player.faction,
                count: 1
            });
        });

    },

    "policeStorage.takeGun": (player, index) => {
        if (!player.colshape || !player.colshape.policeStorage) return player.utils.error(`You're not at the PD warehouse!`);
        var policeStorageMarker = player.colshape.policeStorage;
        if (!mp.factions.isPoliceFaction(player.faction)) return player.utils.error(`You are not an officer on duty!`);

        var faction = mp.factions.getBySqlId(player.faction);
        if (!faction) return player.utils.error(`Organization with ID: ${player.faction} not found!`);

        if (faction.products < mp.economy["police_armour_products"].value) return player.utils.error(`Insufficient ammunition!`);


        var itemIds = [17, 18, 19, 20, 21, 22, 23];
        var weaponIds = ["weapon_nightstick", "weapon_flashlight", "weapon_stungun", "weapon_combatpistol", "weapon_pumpshotgun", "weapon_carbinerifle", "weapon_sniperrifle"];
        index = Math.clamp(index, 0, itemIds.length - 1);
        var itemId = itemIds[index];

        var guns = player.inventory.getArrayByItemId(itemId);
        if (Object.keys(guns).length > 0) return player.utils.error(`You already have ${mp.inventory.getItem(itemId).name}!`);

        mp.fullDeleteItemsByParams(itemId, ["faction", "owner"], [player.faction, player.sqlId]);
        var params = {
            weaponHash: mp.joaat(weaponIds[index]),
            ammo: 0,
            faction: player.faction,
            owner: player.sqlId
        };

        player.inventory.add(itemId, params, {}, (e) => {
            if (e) return player.utils.error(e);
            player.utils.success(`You've been issued weapons ${mp.inventory.getItem(itemId).name}!`);
            faction.setProducts(faction.products - mp.economy["police_armour_products"].value);
            mp.logs.addLog(`${player.name} taken from the warehouse weapons ${mp.inventory.getItem(itemId).name}`, 'faction', player.account.id, player.sqlId, {
                faction: player.faction,
                item: mp.inventory.getItem(itemId).name,
                count: 1
            });

        });
    },

    "policeStorage.takeAmmo": (player, index, ammo) => {
        //debug(`policeStorage.takeAmmo: ${index} ${ammo}`);
        if (!player.colshape || !player.colshape.policeStorage) return player.utils.error(`You're not at the PD warehouse!`);
        var policeStorageMarker = player.colshape.policeStorage;
        if (!mp.factions.isPoliceFaction(player.faction)) return player.utils.error(`You are not an officer on duty!`);

        var faction = mp.factions.getBySqlId(player.faction);
        if (!faction) return player.utils.error(`Organization with ID: ${player.faction} not found!`);

        var itemIds = [37, 38, 40, 39];
        index = Math.clamp(index, 0, itemIds.length - 1);
        var products = [0, 1, 3, 2];
        products = mp.economy[`ammo_${products[index]}_products_price`].value * ammo;
        if (faction.products < products) return player.utils.error(`Insufficient ammunition!`);

        // mp.fullDeleteItemsByParams(itemIds[index], ["faction", "owner"], [player.faction, player.sqlId]);
        var params = {
            ammo: ammo,
            faction: player.faction,
            owner: player.sqlId
        };
        player.inventory.add(itemIds[index], params, {}, (e) => {
            if (e) return player.utils.error(e);
            player.utils.success(`You've been issued ${mp.inventory.getItem(itemIds[index]).name}!`);
            faction.setProducts(faction.products - products);
            mp.logs.addLog(`${player.name} taken from the warehouse ${mp.inventory.getItem(itemIds[index]).name}. Quantity: ${ammo}`, 'faction', player.account.id, player.sqlId, {
                faction: player.faction,
                item: mp.inventory.getItem(itemIds[index]).name,
                count: ammo
            });
        });
    },

    "policeStorage.takeItem": (player, index) => {
        if (!player.colshape || !player.colshape.policeStorage) return player.utils.error(`You're not at the PD warehouse!`);
        var policeStorageMarker = player.colshape.policeStorage;
        if (!mp.factions.isPoliceFaction(player.faction)) return player.utils.error(`You are not an officer on duty!`);

        var faction = mp.factions.getBySqlId(player.faction);
        if (!faction) return player.utils.error(`Organization with ID: ${player.faction} not found!`);

        if (faction.products < mp.economy["police_armour_products"].value) return player.utils.error(`Insufficient ammunition!`);

        var itemIds = [29, 27, 28];
        index = Math.clamp(index, 0, itemIds.length - 1);
        var itemId = itemIds[index];

        var items = player.inventory.getArrayByItemId(itemId);
        if (Object.keys(items).length > 0) return player.utils.error(`You already have ${mp.inventory.getItem(itemId).name}!`);

        mp.fullDeleteItemsByParams(itemId, ["faction", "owner"], [player.faction, player.sqlId]);
        var params = {
            faction: player.faction,
            owner: player.sqlId
        };

        player.inventory.add(itemId, params, {}, (e) => {
            if (e) return player.utils.error(e);
            player.utils.success(`You've been issued ${mp.inventory.getItem(itemId).name}!`);
            faction.setProducts(faction.products - mp.economy["police_armour_products"].value);
            mp.logs.addLog(`${player.name} taken from the warehouse ${mp.inventory.getItem(itemId).name}. Quantity: ${ammo}`, 'faction', player.account.id, player.sqlId, {
                faction: player.faction,
                item: mp.inventory.getItem(itemId).name,
                count: 1
            });

        });
    },

    "policeService.recovery.documents": (player) => {
        if (!player.colshape || !player.colshape.factionService) return player.utils.error(`You're not near PD services!`);

        var docs = player.inventory.getArrayByItemId(16);
        for (var sqlId in docs) {
            if (docs[sqlId].params.owner == player.sqlId) return player.utils.error(`You already have documents!`);
        }
        var price = mp.economy["police_recovery_price"].value;
        if (player.money < price) return player.utils.error(`Need: ${price}$`);

        mp.fullDeleteItemsByParams(16, ["owner"], [player.sqlId]);
        var params = {
            owner: player.sqlId,
            licenses: [],
            weapon: [0, 0, 0, 0, 0, 0, 0],
            work: []
        };
        player.inventory.add(16, params, null, (e) => {
            if (e) return player.utils.error(e);

            player.utils.setMoney(player.money - price);
            player.utils.success(`Documents restored!`);
        });
    },

    "policeService.recovery.carKeys": (player) => {
        if (!player.colshape || !player.colshape.factionService) return player.utils.error(`You're not near PD services!`);

        var keys = player.inventory.getArrayByItemId(54);
        var tempCarIds = Object.create(player.carIds);
        for (var sqlId in keys) {
            var veh = mp.vehicles.getBySqlId(keys[sqlId].params.car);
            if (!veh) continue;
            var index = tempCarIds.indexOf(veh.id);
            if (index != -1) tempCarIds.splice(index, 1);
        }
        // debug(`tempCarIds: ${tempCarIds}`);
        if (!tempCarIds.length) return player.utils.error(`No cars available to restore keys!`);

        for (var i = 0; i < tempCarIds.length; i++) {
            var veh = mp.vehicles.at(tempCarIds[i]);
            var dist = player.dist(veh.position);
            // if (dist < 50) {
            if (player.sqlId + 2000 != veh.owner) continue;
            var price = mp.economy["police_recovery_price"].value;
            if (player.money < price) continue;

            mp.fullDeleteItemsByParams(54, ["car"], [veh.sqlId]);
            var params = {
                owner: player.sqlId,
                car: veh.sqlId,
                model: veh.name
            };
            player.inventory.add(54, params, null, (e) => {
                if (e) return player.utils.error(e);

                player.utils.setMoney(player.money - price);
                player.utils.success(`Car keys restored!`);
            });
            return;
            // }

        }


        player.call(`prompt.showByName`, [`police_service_recovery_carkeys`]);
        return player.utils.error(`No car found!`);
    },

    "policeService.recovery.houseKeys": (player, houseSqlId) => {
        // debug(`recovery.houseKeys: ${player.name} ${houseSqlId}`)
        if (!player.colshape || !player.colshape.factionService) return player.utils.error(`You're not near PD services!`);

        var house = mp.houses.getBySqlId(houseSqlId);
        if (!house) return player.utils.error(`Home with ID: ${houseSqlId} not found!`);
        if (house.owner != player.sqlId) return player.utils.error(`You're not the owner of the house!`);

        var keys = player.inventory.getArrayByItemId(59);
        for (var index in keys)
            if (keys[index].params.house == house.sqlId) return player.utils.error(`You already have the keys to House No.${houseSqlId}!`);

        mp.fullDeleteItemsByParams(59, ["house"], [house.sqlId]);
        var params = {
            owner: player.sqlId,
            house: house.sqlId
        };
        player.inventory.add(59, params, null, (e) => {
            if (e) return player.utils.error(e);

            player.utils.setMoney(player.money - mp.economy["police_recovery_price"].value);
            player.utils.success(`The keys to the house have been restored!`);
        });
    },

    "policeService.showClearFine": (player) => {
        // debug(`showClearFine: ${player.name}`)
        if (!player.colshape || !player.colshape.factionService) return player.utils.error(`You're not near PD services!`);
        if (player.fines < 1) return player.utils.error(`You don't have fines!`);
        DB.Handle.query("SELECT * FROM fines WHERE recipient=? LIMIT 1", player.sqlId, (e, result) => {
            if (!result.length) {
                player.fines = 0;
                return player.utils.error(`Fines not found!`);
            }
            player.clearFine = result[0];
            player.call(`modal.show`, [`clear_fine`, result[0]]);
        });
    },

    "policeService.clearFine": (player) => {
        if (!player.colshape || !player.colshape.factionService) return player.utils.error(`You're not near PD services!`);
        if (!player.clearFine) return player.utils.error(`Fine not found!`);
        if (player.money < player.clearFine.price) return player.utils.eror(`Need: $${player.clearFine.price}`);

        player.utils.setMoney(player.money - player.clearFine.price);
        DB.Handle.query(`DELETE FROM fines WHERE id=?`, [player.clearFine.id]);
        player.fines = Math.clamp(player.fines - 1, 0, Number.MAX_VALUE);
        player.utils.success(`You paid the fine No.${player.clearFine.id}`);
        delete player.clearFine;
    },

    "police.searchPlayer": (player, event, param) => {
        //debug(`police.searchPlayer: ${player.name} ${event} ${param}`);
        if (mp.factions.isPoliceFaction(player.faction)) {
            if (event == 'name') {
                DB.Characters.getSqlIdByName(param.toString(), (sqlId) => {
                    if (sqlId) {
                        var rec = mp.players.getBySqlId(sqlId);
                        if (rec.faction !== 0) {
                            var faction = mp.factions.getBySqlId(rec.faction);
                        } else {
                            var faction = "Безработный";
                        }
                        if (rec) {
                            DB.Handle.query("SELECT id,x,y,z FROM houses WHERE owner=?", [rec.sqlId], (e, result) => {
                                var houses = [];
                                for (var i = 0; i < result.length; i++) {
                                    var h = result[i];
                                    var pos = new mp.Vector3(h.x, h.y, h.z);
                                    houses.push({
                                        sqlId: h.id,
                                        adress: '',
                                        pos: pos
                                    });
                                }
                                var data = {
                                    playerId: rec.id,
                                    name: rec.name,
                                    crimes: rec.crimes,
                                    faction: faction.name,
                                    houses: houses
                                }

                                if(rec.faction == 2) {
                                    player.call(`tablet.police.addSearchPlayer`, [data]);
                                } else {
                                    player.call(`tablet.sheriff.addSearchPlayer`, [data]);
                                }
                            });

                        } else {
                            return player.utils.error(`Citizen not found!`);
                        }
                    } else {
                        return player.utils.error(`Citizen not found!`);
                    }
                });
            } else {
                var rec = mp.players.at(param);
                if (rec) {
                    if (rec.faction !== 0) {
                        var faction = mp.factions.getBySqlId(rec.faction);
                    } else {
                        var faction = "Безработный";
                    }
                    DB.Handle.query("SELECT id,x,y,z FROM houses WHERE owner=?", [rec.sqlId], (e, result) => {
                        var houses = [];
                        for (var i = 0; i < result.length; i++) {
                            var h = result[i];
                            var pos = new mp.Vector3(h.x, h.y, h.z);
                            houses.push({
                                sqlId: h.id,
                                adress: '',
                                pos: pos
                            });
                        }
                        var data = {
                            playerId: rec.id,
                            name: rec.name,
                            crimes: rec.crimes,
                            faction: faction.name,
                            houses: houses
                        }

                        if(rec.faction == 2) {
                            player.call(`tablet.police.addSearchPlayer`, [data]);
                        } else {
                            player.call(`tablet.sheriff.addSearchPlayer`, [data]);
                        }
                    });
                } else {
                    return player.utils.error(`Citizen not found!`);
                }
            }
        }
    },

    "police.giveFine": (player, data) => {
        //debug(`giveWanted: ${data}`);
        data = JSON.parse(data);
        console.log(JSON.stringify(data));
        var recId = data.playerId,
            sum = data.summ,
            reason = data.reason;
        sum = Math.clamp(sum, 1, mp.economy["max_fine_sum"].value);
        var rec = mp.players.at(recId);
        if (!rec) return player.utils.error(`Citizen not found!`);
        //var dist = player.dist(rec.position);
        //if (dist > Config.maxInteractionDist) return player.utils.error(`Citizen далеко!`);
        if (!mp.factions.isPoliceFaction(player.faction)) return player.utils.error(`You are not an officer of the order!`);
        if (rec.id === player.id) return player.utils.error(`You can't give yourself a fine!`);

        rec.fines++;
        DB.Handle.query("INSERT INTO fines (cop,recipient,reason,price,date) VALUES (?,?,?,?,?)",
            [player.sqlId, rec.sqlId, reason, sum, new Date().getTime() / 1000], (e) => {
                if (e) terminal.error(e);
            });

        player.utils.success(`${rec.name} received a fine of ${sum}$`);
        rec.utils.warning(`${player.name} i fine you ${sum}$`);
        mp.logs.addLog(`${player.name} issued a fine to the player ${rec.name}. Reason: ${reason}, amount: ${sum}`, 'faction', player.account.id, player.sqlId, {
            faction: player.faction,
            reason: reason,
            sum: sum
        });
        mp.logs.addLog(`${rec.name} был выписан штраф игроком ${player.name}. Reason: ${reason}, amount: ${sum}`, 'faction', rec.account.id, rec.sqlId, {
            faction: rec.faction,
            reason: reason,
            sum: sum
        });
    },

    "police.giveWanted": (player, data) => {
        //debug(`giveWanted: ${data}`);
        data = JSON.parse(data);
        console.log(JSON.stringify(data));
        var recId = data.playerId,
            wanted = data.stars;
        var rec = mp.players.at(recId);
        if (!rec) return player.utils.error(`Citizen not found!`);
        //var dist = player.dist(rec.position);
        //if (dist > Config.maxInteractionDist) return player.utils.error(`Citizen далеко!`);
        if (!mp.factions.isPoliceFaction(player.faction)) return player.utils.error(`You are not an officer of the order!`);
        if (wanted > Config.maxWantedLevel) return player.utils.error(`Choose from 1 to ${Config.maxWantedLevel} wanted  level!`);
        if (rec.wanted >= Config.maxWantedLevel) return player.utils.error(`${rec.name} has the maximum wanted level!`);
        if (rec.id === player.id) return player.utils.error(`You can't give yourself a search!`);

        rec.utils.setWanted(rec.wanted + wanted);
        player.utils.success(`${rec.name} wanted`);
        rec.utils.warning(`${player.name} declared you wanted`);
        mp.logs.addLog(`${player.name} announced player ${rec.name} wanted. Stars: ${wanted}`, 'faction', player.account.id, player.sqlId, {
            faction: player.faction,
            wanted: wanted
        });
        mp.logs.addLog(`${rec.name} был объявлен игроком ${player.name} wanted. Stars: ${wanted}`, 'faction', rec.account.id, rec.sqlId, {
            faction: rec.faction,
            wanted: wanted
        });
        //todo broadcast for radio
    },

    "police.callFibHelp": (player) => {
        //debug(`police.callFibHelp: ${player.name}`)
    },

    "police.callTeamHelp": (player) => {
        //debug(`police.callTeamHelp: ${player.name}`)
    },

    "police.callHospitalHelp": (player) => {
        //debug(`police.callHospitalHelp: ${player.name}`)
    },

    "police.addCall": (player, text) => {
        // TODO: Проверка на наличие мобилы.
        mp.players.forEach((rec) => {
            if (mp.factions.isPoliceFaction(rec.faction)) {
                rec.call(`tablet.police.addCall`, [{
                    id: player.id,
                    name: player.name,
                    pos: player.position,
                    message: text
                }]);
            }
        });
        player.policeCallTime = new Date().getTime();
        player.utils.success(`The call has been sent!`);
    },

    "police.acceptCall": (player, playerId) => {
        if (!mp.factions.isPoliceFaction(player.faction)) return player.utils.error(`You are not an officer of the order!`);
        var rec = mp.players.at(playerId);
        if (!rec) return player.utils.error(`Citizen not found!`);
        if (!rec.policeCallTime) return player.utils.error(`Call accepted/rejected by other police officers!`);

        mp.players.forEach((rec) => {
            if (mp.factions.isPoliceFaction(rec.faction)) {
                rec.call(`tablet.police.removeCall`, [playerId]);
            }
        });

        delete rec.policeCallTime;
        player.utils.success(`Call accepted!`);
        rec.utils.success(`${player.name} accepted your challenge!`);
    },

}
