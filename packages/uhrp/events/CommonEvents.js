module.exports = {
    "get.players.ping": (player) => {
        var pings = [];
        mp.players.forEach((rec) => {
            if (rec.sqlId) pings.push(rec.ping);
        });

        player.call("setLocalVar", ["playerPings", pings]);
    },
    "playAnimation": (player, animIndex) => {
        var list = require('../anim_list.js');
        var params = list[animIndex].split(' ');
        if (animIndex < 0) animIndex = 0;
        if (animIndex >= list.length) animIndex = list.length - 1;
        player.playAnimation(params[0], params[1], 1, 1);
        player.call("setLocalVar", ["animName", list[animIndex]]);
    },
    "cancelAnimation": (player) => {
        player.playAnimation("missheist_agency2aig_13", "pickup_briefcase_upperbody", 1, 0);
    },
    "anim": (player, animDict, animName, flag = 0, time = 3000) => {
        player.playAnimation(animDict, animName, 1, 1);
        var playerId = player.id;
        setTimeout(() => {
            try {
                player = mp.players.at(playerId);
                if (!player) return -1;
                player.playAnimation("missheist_agency2aig_13", "pickup_briefcase_upperbody", 1, flag);
            } catch (e) {
                console.log(e);
            }
        }, time);
    },
    "voice.add": (player, target) => {
        //debug(`voice.add: ${player.name} => ${target.name}`);
        if (target) player.enableVoiceTo(target);
    },
    "voice.remove": (player, target) => {
        //debug(`voice.remove: ${player.name} => ${target.name}`);
        if (target) player.disableVoiceTo(target);
    },
    "mpStorage.update": (player, hashes) => {
        //debug(`${player.name} called mpStorage.update: ${hashes}`);
        hashes = JSON.parse(hashes);
        var keys = {
            "inventoryItems": () => {
                return mp.inventory.items;
            }
        };
        for (var key in hashes) {
            var value = keys[key]();
            var hash = getHash(JSON.stringify(value));
            if (hash != hashes[key]) player.call("setMpStorageVar", [key, value]);
        }
    },
    "item.eat": (player, sqlId) => {
        var item = player.inventory.getItem(sqlId);
        if (!item) return player.utils.error(`No item found!`);
        if (!item.params.satiety && !item.params.thirst) return player.utils.error(`The item is inedible!`);

        player.utils.setSatiety(player.satiety + item.params.satiety);
        player.utils.setThirst(player.thirst + item.params.thirst);
        player.utils.info(`Satiety ${player.satiety}/100 Units.`);
        player.utils.info(`Thirst ${player.thirst}/100 Units.`);

        player.inventory.delete(sqlId);
    },
    "item.fuelCar": (player, vehId) => {
        var veh = mp.vehicles.at(vehId);
        if (!veh) return player.utils.error(`No car found!`);
        var dist = player.dist(veh.position);
        if (dist > Config.maxInteractionDist) return player.utils.error(`Cars are far away!`);

        var canisters = player.inventory.getArrayByItemId(36);
        if (!Object.keys(canisters).length) return player.utils.error(`The canister has not been found!`);

        for (var key in canisters) {
            var item = canisters[key];
            var fuel = Math.clamp(item.params.count, 0, veh.vehPropData.maxFuel - veh.vehPropData.fuel);
            if (!fuel) continue;
            item.params.count -= fuel;
            player.inventory.updateParams(item.id, item);
            veh.utils.setFuel(veh.vehPropData.fuel + fuel);
            return player.utils.success(`Tank ${veh.vehPropData.fuel}/${veh.vehPropData.maxFuel} L.`);
        }
        return player.utils.error(`Canisters empty!`);
    },
    "item.throwfromvehicle": (player, vehId, playerId) => {
        var veh = mp.vehicles.at(vehId);
        if (!veh) return player.utils.error(`No car found!`);
        var dist = player.dist(veh.position);
        if (dist > Config.maxInteractionDist && !player.vehicle) return player.utils.error(`Cars are far away!`);

        var keys = player.inventory.getArrayByItemId(54);
        if (!keys) return player.utils.error(`Car keys not found!`);
        for (var key in keys) {
            if (keys[key].params.car == veh.sqlId) {
                var rec = mp.players.at(playerId);
                if (!rec) return player.utils.error(`Пассажир не найден!`, player);
                if (rec.vehicle == veh) {
                    player.utils.success("Вы выкинули пассажира из транспорта!");
                    rec.removeFromVehicle();
                    rec.utils.error("Водитель выкинул вас из транспорта!");
                    return;
                } else {
                    return player.utils.error("Пассажир не в вашем транспорте!");
                }
            }
        }
        player.utils.error(`Keys to ${veh.name} not found!`);
    },
    "item.lockCar": (player, vehId) => {
        var veh = mp.vehicles.at(vehId);
        if (!veh) return player.utils.error(`No car found!`);
        var dist = player.dist(veh.position);
        if (dist > Config.maxInteractionDist && !player.vehicle) return player.utils.error(`Cars are far away!`);

        var keys = player.inventory.getArrayByItemId(54);
        if (!keys) return player.utils.error(`Car keys not found!`);
        for (var key in keys) {
            if (keys[key].params.car == veh.sqlId) {
                veh.locked = !veh.locked;
                if (veh.locked) return player.utils.info(`${veh.name} Locked`);
                else return player.utils.info(`${veh.name} Unlocked`);
            }
        }
        player.utils.error(`Keys to ${veh.name} not found!`);
    },
    "item.lockCarByKeys": (player, keysSqlId) => {
        var keys = player.inventory.getItem(keysSqlId);
        if (!keys) return player.utils.error(`Car keys not found!`);
        if (!keys.params.car) return player.utils.error(`Auto from the keys unknown!`);

        var veh = mp.vehicles.getBySqlId(keys.params.car);
        if (!veh) return player.utils.error(`No car found!`);
        var dist = player.dist(veh.position);
        if (dist > Config.maxInteractionDist) return player.utils.error(`Cars are far away!`);

        veh.locked = !veh.locked;
        if (veh.locked) return player.utils.info(`${veh.name} Locked`);
        else return player.utils.info(`${veh.name} Unlocked`);
    },
    "item.searchCarByKeys": (player, keysSqlId) => {
        var keys = player.inventory.getItem(keysSqlId);
        if (!keys) return player.utils.error(`Car keys not found!`);
        if (!keys.params.car) return player.utils.error(`Auto from the keys unknown!`);

        var veh = mp.vehicles.getBySqlId(keys.params.car);
        if (!veh) return player.utils.error(`No car found!`);

        player.call("setNewWaypoint", [veh.position.x, veh.position.y]);
        player.utils.success(`${veh.name} marked on the map`);
    },
    "item.fixCarByKeys": (player, keysSqlId, outPosition, outHeading) => {
        var keys = player.inventory.getItem(keysSqlId);
        if (!keys.params.car) return player.utils.error(`Auto from the keys unknown!`);

        var veh = mp.vehicles.getBySqlId(keys.params.car);
        if (!veh) return player.utils.error(`No car found!`);

        var pos = JSON.parse(outPosition);

        veh.repair();
        veh.dimension = 0;
        veh.position = new mp.Vector3(pos.x, pos.y - 8, pos.z);
        veh.rotation = new mp.Vector3(0, 0, parseFloat(outHeading));
        veh.engine = false;

        veh.setVariable("leftSignal", false);
        veh.setVariable("rightSignal", false);
        if (veh.getVariable("engine"))
            veh.utils.engineOn();

        player.call("setNewWaypoint", [veh.position.x, veh.position.y]);
        player.utils.setMoney(player.money - 50);
        player.utils.success(`${veh.name} marked on the map`);
    },
    "item.searchHouseByKeys": (player, keysSqlId) => {
        var keys = player.inventory.getItem(keysSqlId);
        if (!keys) return player.utils.error(`Keys not found!`);
        if (!keys.params.house) return player.utils.error(`The house from the keys is unknown!`);

        var house = mp.houses.getBySqlId(keys.params.house);
        if (!house) return player.utils.error(`No house found!`);

        player.call("setNewWaypoint", [house.position.x, house.position.y]);
        player.utils.success(`House No.${house.sqlId} marked on the map`);
    },
    "item.parkCarByKeys": (player, keysSqlId) => {
        var keys = player.inventory.getItem(keysSqlId);
        if (!keys) return player.utils.error(`Car keys not found!`);
        if (!keys.params.car) return player.utils.error(`Auto from the keys unknown!`);

        var veh = mp.vehicles.getBySqlId(keys.params.car);
        if (!veh) return player.utils.error(`No car found!`);
        var dist = player.dist(veh.position);
        if (dist > Config.maxInteractionDist) return player.utils.error(`Cars are far away!`);

        var pos = veh.position;
        pos.h = veh.rotation.z;
        veh.utils.setSpawnPos(pos);
        player.utils.success(`${veh.name} Parked!`);
    },
    "requestClothes": (player, clientCounts) => {
        // debug(`requestClothes: ${player.name} ${clientCounts}`)
        clientCounts = JSON.parse(clientCounts);
        var serverCounts = mp.getArrayClothesCounts();
        // debug(`serverCounts: ${serverCounts}`);
        var names = ["bracelets", "ears", "feets", "glasses", "hats", "legs", "masks", "ties", "top", "watches"];
        for (var i = 0; i < serverCounts.length; i++) {
            if (clientCounts[i] != serverCounts[i]) {
                // debug(`send to client ${names[i]}`);
                player.call(`setMpStorageVarClothes`, [names[i], mp.clothes[names[i]]]);
            }
        }
    },
    "drivingSchool.buyLic": (player, licType) => {
        if (!player.colshape || !player.colshape.drivingSchool) return player.utils.error(`You're not at the licensing center!`);
        var types = [1, 2, 3, 4, 11, 12];
        var prices = [500, 700, 1000, 5000, 2000, 3000];
        var index = types.indexOf(licType);
        if (index == -1) return player.utils.error(`Wrong type of license!`);
        if (player.money < prices[index]) return player.utils.error(`Need: ${prices[index]}$`);

        var docs = player.inventory.getArrayByItemId(16);
        for (var key in docs) {
            var doc = docs[key];
            if (doc.params.owner == player.sqlId) {
                if (doc.params.licenses.indexOf(licType) != -1) return player.utils.error(`You already have ${mp.getLicName(licType)}!`);
                player.utils.setMoney(player.money - prices[index]);
                doc.params.licenses.push(licType);
                player.inventory.updateParams(doc.id, doc);
                return player.utils.success(`You've got a license!`);
            }
        }

        return player.utils.error(`Your documents not found!`);
    },
    "vehicle.hood": (player, vehId) => {
        var veh = mp.vehicles.at(vehId);
        if (!veh) return player.utils.error(`No car found!`);
        var dist = player.dist(veh.position);
        if (dist > 10) return player.utils.error(`Cars are far away!`);
        if (!veh.getVariable("hood") && veh.locked) return player.utils.error(`Auto Locked!`);


        if (!veh.sqlId || mp.isFactionVehicle(veh) || mp.isJobVehicle(veh)) {
            veh.setVariable("hood", !veh.getVariable("hood"));
            if (veh.getVariable("hood")) return player.utils.info(`Hood Unlocked`);
            else return player.utils.info(`Hood Locked`);
        }

        var keys = player.inventory.getArrayByItemId(54);
        if (Object.keys(keys).length == 0) return player.utils.error(`Car keys not found!`);
        for (var sqlId in keys) {
            if (keys[sqlId].params.car == veh.sqlId) {
                veh.setVariable("hood", !veh.getVariable("hood"));
                if (veh.getVariable("hood")) return player.utils.info(`Hood Unlocked`);
                else return player.utils.info(`Hood Locked`);
            }
        }
        player.utils.error(`Keys to ${veh.name} not found!`);
    },
    "vehicle.boot": (player, vehId) => {
        var veh = mp.vehicles.at(vehId);
        if (!veh) return player.utils.error(`No car found!`);
        var dist = player.dist(veh.position);
        if (dist > 10) return player.utils.error(`Cars are far away!`);
        if (veh.bootPlayerId != null && veh.bootPlayerId != player.id && veh.getVariable("boot")) return player.utils.error(`You can't locked the trunk in time for another citizen's interaction!`);
        if (!veh.inventory) return player.utils.error(`Auto Doesn't have a trunk!`);
        if (!veh.getVariable("boot") && veh.locked) return player.utils.error(`Auto Locked!`);

        if (!veh.sqlId || mp.isFactionVehicle(veh) || mp.isJobVehicle(veh)) {
            if (mp.isFactionVehicle(veh)) {
                if (player.faction != veh.owner) {
                    return player.utils.error(`You are not a member of the ${mp.factions.getBySqlId(veh.owner).name}`);
                } else {
                    veh.setVariable("boot", !veh.getVariable("boot"));
                    if (veh.getVariable("boot")) return player.utils.info(`Trunk Unlocked`);
                    else return player.utils.info(`Trunk Locked`);
                }
            } else {
                veh.setVariable("boot", !veh.getVariable("boot"));
                if (veh.getVariable("boot")) return player.utils.info(`Trunk Unlocked`);
                else return player.utils.info(`Trunk Locked`);
            }
        }
        if (mp.isFarmVehicle(veh)) {
            if (!player.farmJob) return player.utils.error(`You don't work on a farm!`);
            var jobName = mp.farms.getJobName(1);
            if (player.farmJob.type != 1) return player.utils.error(`You don't ${jobName}!`);
            veh.setVariable("boot", !veh.getVariable("boot"));
            if (veh.getVariable("boot")) return player.utils.info(`Trunk Unlocked`);
            else return player.utils.info(`Trunk Locked`);
        }

        var keys = player.inventory.getArrayByItemId(54);
        if (Object.keys(keys).length == 0) return player.utils.error(`Car keys not found!`);
        for (var sqlId in keys) {
            if (keys[sqlId].params.car == veh.sqlId) {
                veh.setVariable("boot", !veh.getVariable("boot"));
                if (veh.getVariable("boot")) return player.utils.info(`Trunk Unlocked`);
                else return player.utils.info(`Trunk Locked`);
            }
        }
        player.utils.error(`Keys to ${veh.name} not found!`);
    },
    "vehicle.products": (player, vehId) => {
        var veh = mp.vehicles.at(vehId);
        if (!veh) return player.utils.error(`No car found!`);
        var dist = player.dist(veh.position);
        if (dist > 10) return player.utils.error(`Cars are far away!`);
        if (!veh.getVariable("boot")) return player.utils.error(`Trunk Locked!`);
        if (mp.isFactionVehicle(veh)) {
            var attachedObject = player.getVariable("attachedObject");
            if (!veh.products) veh.products = 0;
            var models = ["prop_box_ammo04a", "ex_office_swag_pills4"];
            var index = models.indexOf(attachedObject);
            var max = mp.economy["faction_products_veh_maxcount"].value;
            if (index != -1) {
                player.utils.putObject();
                if (index == 0 && !mp.factions.isArmyFaction(veh.owner)) return player.utils.error(`Wrong type of product!`);
                if (index == 1 && !mp.factions.isHospitalFaction(veh.owner)) return player.utils.error(`Wrong type of product!`);
                if (veh.products > max) return player.utils.error(`Trunk Filled!`);
                veh.products += mp.economy["faction_products_count"].value;
                if (veh.products > max) veh.products = max;
            } else {
                if (!veh.products || veh.products < mp.economy["faction_products_count"].value)
                    return player.utils.error(`Goods are finally in the car!`);

                var model = null;
                if (mp.factions.isArmyFaction(veh.owner)) model = models[0];
                if (mp.factions.isHospitalFaction(veh.owner)) model = models[1];
                if (!model) return player.utils.error(`Prohibited goods in the trunk!`);

                veh.products -= mp.economy["faction_products_count"].value;
                if (veh.products < 0) veh.products = mp.economy["faction_products_count"].value;

                player.utils.takeObject(model);
            }
            player.utils.info(`Product: ${veh.products} of ${max} Units.`);
        } else if (mp.isFarmVehicle(veh)) {
            if (!player.farmJob) return player.utils.error(`You don't work on a farm!`);
            var jobName = mp.farms.getJobName(player.farmJob.type);
            if (player.farmJob.type != 0 && player.farmJob.type != 1) return player.utils.error(`Post ${jobName} don't harvest!`);


            var attachedObject = player.getVariable("attachedObject");
            var models = ["prop_veg_crop_03_pump", "prop_veg_crop_03_cab", "prop_weed_02"];
            var index = models.indexOf(attachedObject);
            var max = 200;
            if (index != -1) {
                if (!veh.crop) veh.crop = {
                    type: index + 1,
                    count: 0
                };
                player.utils.putObject();
                if (veh.crop.type != index + 1) return player.utils.error(`Wrong type of crop!`);
                if (veh.crop.count > max) return player.utils.error(`Trunk Filled!`);
                veh.crop.count++;
            } else {
                /*if (veh.crop.count <= 0) return player.utils.error(`В авто нUnitsостаточно урожая!`);

                var model = models[veh.crop.type - 1];
                if (!model) return player.utils.error(`Prohibited goods in the trunk!`);

                veh.crop.count--;
                if (veh.crop.count < 0) veh.crop.count = 0;

                player.utils.takeObject(model);*/
                return player.utils.error(`Harvest!`);
            }
            setVehCropLoad(veh);
            player.utils.info(`Harvest: ${veh.crop.count} of ${max} Units.`);
        } else {
            player.utils.error(`You can't put a product in a car!`);
        }
    },
    "knockDown": (player, enable) => {
        if (enable) mp.events.call("hospital.addCall", player, "Resuscitation is needed.");
        else {
            mp.players.forEach((rec) => {
                if (mp.factions.isHospitalFaction(rec.faction)) {
                    rec.call(`tablet.medic.removeCall`, [player.id]);
                }
            });
            delete player.hospitalCallTime;
        }
        player.setVariable("knockDown", enable);
    },
    "familiar.createOffer": (player, recId) => {
        // debug(`familiar.createOffer: ${player.name} ${recId}`);
        var rec = mp.players.at(recId);
        if (!rec) return player.utils.error(`Citizen not found!`);
        var dist = player.dist(rec.position);
        if (dist > Config.maxInteractionDist) return player.utils.error(`Citizen far away!`);
        if (player.hasCuffs) return player.utils.error(`You're are handcuffed!`);
        if (rec.hasCuffs) return player.utils.error(`Citizen is handcuffed!`);

        rec.offer = {
            playerId: player.id
        };
        rec.call(`choiceMenu.show`, ["accept_familiar"]);
        player.utils.success(`You've got to get to know each other.`);
    },
    "familiar.offer.agree": (player) => {
        if (!player.offer) return player.utils.error(`No addition has been found!`);

        var rec = mp.players.at(player.offer.playerId);
        if (!rec) return player.utils.error(`Citizen not found!`);

        var dist = player.dist(rec.position);
        if (dist > Config.maxInteractionDist) return player.utils.error(`Citizen far away!`);
        if (player.hasCuffs) return player.utils.error(`You're in handcuffs!`);
        if (rec.hasCuffs) return player.utils.error(`Citizen in handcuffs!`);


        delete player.offer;

        player.call(`familiar.add`, [rec.name, rec.id]);
        rec.call(`familiar.add`, [player.name, player.id]);
    },
    "familiar.offer.cancel": (player) => {
        if (!player.offer) return player.utils.error(`No addition has been found!`);

        var rec = mp.players.at(player.offer.playerId);
        delete player.offer;
        player.utils.info(`Dating rejected`);
        if (!rec) return;
        delete rec.offer;

        rec.utils.info(`Citizen rejected acquaintance`);
    },
    "attachedObject.throw": (player) => {
        if (player.job === 9 && player.getVariable("attachedObject") === "hei_prop_heist_binbag") return;
        // debug(`attachedObject.throw: ${player.name}`)
        if (player.job === 7) {
            let jobOpen = require("../modules/jobs/builder/job.js");
            if (player.builder) jobOpen.stopBringingLoad(player);
            else if (player.getVariable("attachedObject") === "hei_prop_heist_wooden_box" && player.jobbuilderfloor > -1) jobOpen.stopBringingBox(player);
        }
        if (player.job === 8) {
            let jobOpen = require("../modules/jobs/waterfront/waterfront.js");
            if (player.getVariable("attachedObject") === "hei_prop_heist_wooden_box" && player.boxwaterfront) jobOpen.stopBringingBox(player);
        }
        player.utils.putObject();
        player.utils.info(`Вы уронили груз!`);
    },
    "emotions.set": (player, index) => {
        // debug(`emotions.set: ${player.name} ${index}`)
        var emotions = [null, "mood_aiming_1", "mood_angry_1", "mood_happy_1", "mood_stressed_1", "mood_sulk_1"];
        index = Math.clamp(index, 0, emotions.length - 1);
        player.setVariable("emotion", emotions[index]);
    },
    "walking.set": (player, index) => {
        // debug(`walking.set: ${player.name} ${index}`)
        var walkings = [null, "move_m@brave", "move_m@confident", "move_m@shadyped@a", "move_m@quick", "move_m@sad@a", "move_m@fat@a"];
        index = Math.clamp(index, 0, walkings.length - 1);
        player.setVariable("walking", walkings[index]);
    },
    "animation.set": (player, index) => {
        if (player.getVariable("attachedObject")) return;
        if (player.getVariable("animation") === index) index = null;
        player.setVariable("animation", index);
    },
    'toggleSmoke': (player) => {
        // debug(`toggleSmoke: ${player.name}`);
        if (player && player.vehicle && player.seat === -1) player.vehicle.setVariable('smokeActive', !player.vehicle.getVariable('smokeActive'));
    },
    'admin.chat.push': (player, data) => {
        // debug(`admin.chat.push: ${player.name} ${data}`)
        data = JSON.parse(data);
        var message = data[0].substr(0, 100).trim();
        mp.players.forEach((rec) => {
            if (rec.sqlId && rec.admin) rec.call(`console.chat`, [{
                admin: player.admin,
                name: player.name,
                id: player.id
            }, message]);
        });
    },
}
