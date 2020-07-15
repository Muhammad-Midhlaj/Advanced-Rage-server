module.exports = {
    "armyStorage.takeClothes": (player, index) => {
        if (!player.colshape || !player.colshape.armyStorage) return player.utils.error(`You're not at the Army warehouse!`);
        var armyStorageMarker = player.colshape.armyStorage;
        if (!mp.factions.isArmyFaction(player.faction)) return player.utils.error(`You are not a military man!`);

        var faction = mp.factions.getBySqlId(player.faction);
        if (!faction) return player.utils.error(`Organization with ID: ${player.faction} Not found!`);
        var army = faction.name;

        if (faction.products < mp.economy["army_mainclothes_products"].value) return player.utils.error(`Insufficient ammunition!`);
        var hats = player.inventory.getArrayByItemId(6);
        var tops = player.inventory.getArrayByItemId(7);
        var legs = player.inventory.getArrayByItemId(8);
        var feets = player.inventory.getArrayByItemId(9);
        var masks = player.inventory.getArrayByItemId(14);
        var glasses = player.inventory.getArrayByItemId(1);

        for (var key in hats)
            if (mp.factions.isArmyFaction(hats[key].params.faction)) return player.utils.error(`You already have a hat ${army}!`);
        for (var key in tops)
            if (mp.factions.isArmyFaction(tops[key].params.faction)) return player.utils.error(`You already have a shirt ${army}!`);
        for (var key in legs)
            if (mp.factions.isArmyFaction(legs[key].params.faction)) return player.utils.error(`You already have pants ${army}!`);
        for (var key in feets)
            if (mp.factions.isArmyFaction(feets[key].params.faction)) return player.utils.error(`You already have shoes ${army}!`);
        for (var key in masks)
            if (mp.factions.isArmyFaction(masks[key].params.faction)) return player.utils.error(`You already have a helmet ${army}!`);
        for (var key in glasses)
            if (mp.factions.isArmyFaction(glasses[key].params.faction)) return player.utils.error(`You already have points ${army}!`);

        mp.fullDeleteItemsByParams(6, ["faction", "owner"], [player.faction, player.sqlId]);
        mp.fullDeleteItemsByParams(7, ["faction", "owner"], [player.faction, player.sqlId]);
        mp.fullDeleteItemsByParams(8, ["faction", "owner"], [player.faction, player.sqlId]);
        mp.fullDeleteItemsByParams(9, ["faction", "owner"], [player.faction, player.sqlId]);
        mp.fullDeleteItemsByParams(10, ["faction", "owner"], [player.faction, player.sqlId]);
        mp.fullDeleteItemsByParams(2, ["faction", "owner"], [player.faction, player.sqlId]);
        mp.fullDeleteItemsByParams(14, ["faction", "owner"], [player.faction, player.sqlId]);
        mp.fullDeleteItemsByParams(1, ["faction", "owner"], [player.faction, player.sqlId]);

        var hatParams, topParams, legsParams, feetsParams, masksParams, glassesParams;
        var f = player.faction - 6;
        if (player.sex == 1) {
            hatParams = {
                sex: 1,
                variation: [
                    [-1, 117, 107, 107, 39, -1, -1, -1],
                    [124, 114, 114, 113, -1]
                ][f][index],
                texture: [
                    [0, 13, 3, 0, 0, 0, 0, 0],
                    [10, 4, 9, 4, -1]
                ][f][index]
            };
            topParams = {
                sex: 1,
                torso: [
                    [0, 136, 5, 5, 5, 4, 20, 42],
                    [60, 1, 94, 1, 36]
                ][f][index],
                tTexture: [
                    [-1, 5, -1, -1, -1, -1, -1, -1],
                    [-1, -1, -1, -1, -1, -1, -1, -1],
                ][f][index],
                variation: [
                    [208, 50, 239, 239, 251, 248, 209, 209],
                    [220, 192, 192, 221, 228]
                ][f][index],
                texture: [
                    [4, 0, 3, 0, 1, 0, 11, 10],
                    [11, 0, 0, 10, 0]
                ][f][index],
                undershirt: [
                    [-1, -1, -1, -1, -1, -1, -1, -1],
                    [-1, 101, 101, 130, -1]
                ][f][index],
                uTexture: [
                    [-1, -1, -1, -1, -1, -1, -1, -1],
                    [0, 10, 10, 0, 0]
                ][f][index],
            };
            legsParams = {
                sex: 1,
                variation: [
                    [86, 86, 86, 86, 98, 98, 86, 86],
                    [86, 86, 86, 86, 92]
                ][f][index],
                texture: [
                    [4, 5, 3, 0, 1, 1, 11, 10],
                    [16, 10, 10, 10, 0]
                ][f][index]
            };
            feetsParams = {
                sex: 1,
                variation: [
                    [35, 72, 24, 24, 24, 60, 60, 60],
                    [50, 27, 27, 27, 51]
                ][f][index],
                texture: [
                    [0, 5, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0]
                ][f][index]
            };
            masksParams = {
                sex: 1,
                variation: [
                    [-1, 114, -1, -1, -1, -1, -1, -1],
                    [-1, -1, -1, -1, -1]
                ][f][index],
                texture: [
                    [-1, 9, -1, -1, -1, -1, -1, -1],
                    [0, 0, 0, 0, 0]
                ][f][index]
            };
            glassesParams = {
                sex: 1,
                variation: [
                    [-1, -1, -1, -1, -1, -1, -1, -1],
                    [-1, -1, -1, -1, -1]
                ][f][index],
                texture: [
                    [0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0]
                ][f][index]
            };
        } else {
            hatParams = {
                sex: 0,
                variation: [
                    [-1, -1, 106, 106, 38, -1, -1, -1],
                    [123, 113, 113, 113, -1]
                ][f][index],
                texture: [
                    [0, 0, 0, 0, 0, 0, 0, 0],
                    [12, 0, 7, 6, 0]
                ][f][index]
            };
            topParams = {
                sex: 0,
                torso: [
                    [14, 3, 14, 14, 14, 20, 20, 42],
                    [60, 67, 57, 31, 67]
                ][f][index],
                variation: [
                    [212, 54, 212, 212, 213, 212, 213, 213],
                    [230, 194, 194, 224, 232]
                ][f][index],
                texture: [
                    [4, 0, 0, 0, 3, 0, 11, 10],
                    [17, 0, 10, 10, 10]
                ][f][index],
                undershirt: [
                    [-1, -1, -1, -1, -1, -1, -1, -1],
                    [-1, 127, 136, -1, -1]
                ][f][index],
                uTexture: [
                    [-1, -1, -1, -1, -1, -1, -1, -1],
                    [0, 10, 10, 0, 0]
                ][f][index],
            };
            legsParams = {
                sex: 0,
                variation: [
                    [90, 89, 89, 89, 89, 92, 89, 89],
                    [89, 89, 89, 89, 86]
                ][f][index],
                texture: [
                    [4, 5, 3, 0, 3, 0, 11, 10],
                    [15, 10, 10, 10, 8]
                ][f][index]
            };
            feetsParams = {
                sex: 0,
                variation: [
                    [36, 62, 55, 55, 55, 55, 55, 55],
                    [25, 77, 26, 25, 70]
                ][f][index],
                texture: [
                    [0, 1, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0]
                ][f][index]
            };
            masksParams = {
                sex: 0,
                variation: [
                    [-1, 114, -1, -1, -1, -1, -1, -1],
                    [-1, -1, -1, -1, -1]
                ][f][index],
                texture: [
                    [0, 9, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0]
                ][f][index]
            };
            glassesParams = {
                sex: 0,
                variation: [
                    [-1, -1, -1, -1, 27, -1, -1, -1],
                    [-1, -1, -1, -1, -1]
                ][f][index],
                texture: [
                    [0, 0, 0, 0, 4, 0, 0, 0],
                    [0, 0, 0, 0, 0]
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
        masksParams.faction = player.faction;
        glassesParams.faction = player.faction;

        topParams.rows = 4;
        topParams.cols = 4;
        legsParams.rows = 3;
        legsParams.cols = 5;
        topParams.name = army;
        legsParams.name = army;

        hatParams.owner = player.sqlId;
        topParams.owner = player.sqlId;
        legsParams.owner = player.sqlId;
        feetsParams.owner = player.sqlId;
        masksParams.owner = player.sqlId;
        glassesParams.owner = player.sqlId;

        var response = (e) => {
            if (e) player.utils.error(e);
        };
        if (hatParams.variation != -1) player.inventory.add(6, hatParams, {});
        if (topParams.variation != -1) player.inventory.add(7, topParams, {});
        if (legsParams.variation != -1) player.inventory.add(8, legsParams, {});
        if (feetsParams.variation != -1) player.inventory.add(9, feetsParams, {});
        if (masksParams.variation != -1) player.inventory.add(14, masksParams, {});
        if (glassesParams.variation != -1) player.inventory.add(1, glassesParams, {});

        player.utils.success(`You have been issued with a form ${army}!`);


        faction.setProducts(faction.products - mp.economy["army_mainclothes_products"].value);
        mp.logs.addLog(`${player.name} taken from the warehouse Form Army`, 'faction', player.account.id, player.sqlId, {
            faction: player.faction,
            count: 1
        });
    },

    "armyStorage.takeArmour": (player) => {
        if (!player.colshape || !player.colshape.armyStorage) return player.utils.error(`You're not at the Army warehouse!`);
        var armyStorageMarker = player.colshape.armyStorage;
        if (!mp.factions.isArmyFaction(player.faction)) return player.utils.error(`You are not a military man!`);

        var faction = mp.factions.getBySqlId(player.faction);
        if (!faction) return player.utils.error(`Organization with ID: ${player.faction} Not found!`);
        var army = faction.name;

        if (faction.products < mp.economy["army_armour_products"].value) return player.utils.error(`Insufficient ammunition!`);
        var items = player.inventory.getArrayByItemId(3);

        for (var sqlId in items)
            if (mp.factions.isArmyFaction(items[sqlId].params.faction)) return player.utils.error(`You already have a bulletproof vest ${army}!`);

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
            player.utils.success(`You've been given a bulletproof vest ${army}!`);
            faction.setProducts(faction.products - mp.economy["army_armour_products"].value);
            mp.logs.addLog(`${player.name} taken from the warehouse of the Army Armored`, 'faction', player.account.id, player.sqlId, {
                faction: player.faction,
                count: 1
            });
        });

    },

    "armyStorage.takeGun": (player, index) => {
        if (!player.colshape || !player.colshape.armyStorage) return player.utils.error(`You're not at the Army warehouse!`);
        var armyStorageMarker = player.colshape.armyStorage;
        if (!mp.factions.isArmyFaction(player.faction)) return player.utils.error(`You are not a military man!`);

        var faction = mp.factions.getBySqlId(player.faction);
        if (!faction) return player.utils.error(`Organization with ID: ${player.faction} Not found!`);

        if (faction.products < mp.economy["army_armour_products"].value) return player.utils.error(`Insufficient ammunition!`);

        var itemIds = [20, 21, 22, 23];
        var weaponIds = ["weapon_combatpistol", "weapon_pumpshotgun", "weapon_carbinerifle", "weapon_sniperrifle"];
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
            player.utils.success(`You've been given a gun. ${mp.inventory.getItem(itemId).name}!`);
            faction.setProducts(faction.products - mp.economy["army_armour_products"].value);
            mp.events.call('army.getInfoWareHouse');
            mp.logs.addLog(`${player.name} took a gun from the warehouse ${mp.inventory.getItem(itemId).name}`, 'faction', player.account.id, player.sqlId, {
                faction: player.faction,
                item: mp.inventory.getItem(itemId).name,
                count: 1
            });
        });
    },

    "armyStorage.takeAmmo": (player, index, ammo) => {
        //debug(`policeStorage.takeAmmo: ${index} ${ammo}`);
        if (!player.colshape || !player.colshape.armyStorage) return player.utils.error(`You're not at the Army warehouse!`);
        var armyStorageMarker = player.colshape.armyStorage;
        if (!mp.factions.isArmyFaction(player.faction)) return player.utils.error(`You are not a military man!`);

        var faction = mp.factions.getBySqlId(player.faction);
        if (!faction) return player.utils.error(`Organization with ID: ${player.faction} Not found!`);

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
            player.utils.success(`You have been issued ${mp.inventory.getItem(itemIds[index]).name}!`);
            faction.setProducts(faction.products - products);
            mp.events.call('army.getInfoWareHouse');
            mp.logs.addLog(`${player.name} taken from the warehouse ${mp.inventory.getItem(itemIds[index]).name}. Quantity: ${ammo}`, 'faction', player.account.id, player.sqlId, {
                faction: player.faction,
                item: mp.inventory.getItem(itemIds[index]).name,
                count: ammo
            });
        });
    },

    "armyStorage.takeItem": (player, index) => {
        if (!player.colshape || !player.colshape.armyStorage) return player.utils.error(`You're not at the Army warehouse!`);
        var armyStorageMarker = player.colshape.armyStorage;
        if (!mp.factions.isArmyFaction(player.faction)) return player.utils.error(`You are not a military man!`);

        var faction = mp.factions.getBySqlId(player.faction);
        if (!faction) return player.utils.error(`Organization with ID: ${player.faction} Not found!`);

        if (faction.products < mp.economy["army_armour_products"].value) return player.utils.error(`Insufficient ammunition!`);

        var itemIds = [60, 27];
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
            player.utils.success(`You have been issued ${mp.inventory.getItem(itemId).name}!`);
            faction.setProducts(faction.products - mp.economy["army_armour_products"].value);
            mp.events.call('army.getInfoWareHouse');
            mp.logs.addLog(`${player.name} taken from the warehouse ${mp.inventory.getItem(itemId).name}`, 'faction', player.account.id, player.sqlId, {
                faction: player.faction,
                item: mp.inventory.getItem(itemId).name,
                count: 1
            });
        });
    },

    "army.transferProducts": (player, recId) => {
        var rec = mp.players.at(recId);
        if (!rec) return player.utils.error(`No citizen found!`);
        var dist = player.dist(rec.position);
        if (dist > Config.maxInteractionDist) return player.utils.error(`Citizen far away!`);
        if (rec.faction != player.faction) return player.utils.error(`A citizen is not in your organization!`);
        var model = player.getVariable("attachedObject");
        var haveProducts = (model == "prop_box_ammo04a" || model == "ex_office_swag_pills4");
        if (!haveProducts) return player.utils.error(`You don't have the goods!`);

        var recModel = rec.getVariable("attachedObject");
        var haveProducts = (recModel == "prop_box_ammo04a" || recModel == "ex_office_swag_pills4");
        if (haveProducts) return player.utils.error(`${rec.name} already has a product!`);

        player.utils.putObject();
        rec.utils.takeObject(model);
    },

    "army.getInfoWareHouse": (player) => {
        if (!mp.factions.isArmyFaction(player.faction)) return player.utils.error(`You are not a military man!`);
        var army = mp.factions.getBySqlId(6);
        var navy = mp.factions.getBySqlId(7);
        player.call(`tablet.army.setInfoWareHouse`, [{
            warehouse_1: army.products + '/' + army.maxProducts,
            warehouse_2: navy.products + '/' + navy.maxProducts
        }]);
    },

    "army.advert": (player, text) => {
        if (!mp.factions.isArmyFaction(player.faction)) return player.utils.error(`You are not a military man!`);
        // TODO: Уведомление всем игрокам, у которых есть телефон.
        text = text.substr(0, 100);
        mp.players.forEach((rec) => {
            if (rec.sqlId) {
                rec.call("BN_ShowWithPicture", ["ARMY", player.name, text, "CHAR_ARTHUR", 2]);
            }
        });
    }
}
