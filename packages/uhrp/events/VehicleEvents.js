module.exports = {

    "vehicle.engine.on": (player) => {
        if (!player.vehicle) return;
        player.vehicle.utils.engineOn();
    },

    "setLeftSignal": (player, enable) => {
        if (!player.vehicle) return;
        player.vehicle.setVariable("leftSignal", enable);
        player.vehicle.setVariable("rightSignal", false);
    },

    "setRightSignal": (player, enable) => {
        if (!player.vehicle) return;
        player.vehicle.setVariable("rightSignal", enable);
        player.vehicle.setVariable("leftSignal", false);
    },

    "setEmergencySignal": (player, enable) => {
        if (!player.vehicle) return;
        player.vehicle.setVariable("rightSignal", enable);
        player.vehicle.setVariable("leftSignal", enable);
    },

    "belt.putOn": (player, enable) => {
        if (!player.vehicle) return;
        //if (enable) player.utils.drawTextOverPlayer(`пристегнул ремень`);
        //else player.utils.drawTextOverPlayer(`отстегнул ремень`);
    },

    "sirenSound.on": (player) => {
        //debug(`sirenSound.on`)
        if (!player.vehicle) return;
        var sirenSound = player.vehicle.getVariable("sirenSound");
        player.vehicle.setVariable("sirenSound", !sirenSound);
    },

    "addMileage": (player, value) => {
        debug(`addMileage: ${value}`)
        if (!player.vehicle) return terminal.error(`event "addMileage": ${player.name} not in the car, but the mileage update timer worked!`);
        player.vehicle.utils.addMileage(value);
    },

    "radio.set": (player, radio) => {
        //debug(`radio.set: ${radio}`)
        if (!player.vehicle) return;
        player.vehicle.utils.setRadio(radio);
    },

    "sellCarPlayer": (player, params) => {
        params = JSON.parse(params);

        var invitePlayer = null;
        if (parseInt(params[0]) >= 0) invitePlayer = mp.players.at(parseInt(params[0]));
        else invitePlayer = mp.players.getByName(params[0]);
        if (!invitePlayer) return player.utils.error("Citizen not found!");
        if(player.id === invitePlayer.id) return player.utils.error("You can't sell a car to yourself!");
        var dist = player.dist(invitePlayer.position);
        if (dist > Config.maxInteractionDist) return player.utils.error(`Citizen too far away!`);

        var price = parseInt(params[1]);
        if (price <= 0) return player.utils.error(`Wrong price!`);

        var keys = player.inventory.getItem(params[2]);
        if (!keys) return player.utils.error(`No car keys found!`);
        if (player.sqlId != keys.params.owner) return player.utils.error(`You are not the owner of a car!`);

        var veh = mp.vehicles.getBySqlId(keys.params.car);
        if (!veh) return player.utils.error(`No car found!`);

        var dist = player.dist(veh.position);
        if (dist > 10) return player.utils.error(`Auto too far!`);

        player.call("choiceMenu.show", ["sellcarplayer_confirm", {
            name: invitePlayer.name,
            price: price,
            model: keys.params.model
        }]);

        player.sellCarOffer = {
            invitePlayerId: invitePlayer.id,
            price: price,
            keysSqlId: params[2],
            model: keys.params.model,
        };
    },

    "car.sellplayer.agree": (player) => {
        if (!player.sellCarOffer) return player.utils.error(`No offer found!`);

        var invitePlayer = mp.players.at(player.sellCarOffer.invitePlayerId);
        if (!invitePlayer) return player.utils.error(`The buyer has not been found!`);

        var dist = player.dist(invitePlayer.position);
        if (dist > Config.maxInteractionDist) return player.utils.error(`Buyer away!`);
        if (player.id == invitePlayer.id) return player.utils.error(`You can't sell a car to yourself!`);


        invitePlayer.call("choiceMenu.show", ["buycarplayer_confirm", {
            name: player.name,
            price: player.sellCarOffer.price,
            model: player.sellCarOffer.model,
        }]);

        invitePlayer.sellCarOffer = {
            ownerId: player.id,
            price: player.sellCarOffer.price
        };
    },

    "car.sellplayer.cancel": (player) => {
        delete player.sellCarOffer;
    },

    "car.fix.accept": (player, sqlId) => {
        if (player.money < 50) return player.utils.error(`Not enough money!`);
        player.call("item.fixCarByKeys", [sqlId]);
    },

    "car.buycarplayer.agree": (player) => {
        if (!player.sellCarOffer) return player.utils.error(`No offer found!`);
        if (player.carIds.length + 1 > player.donateCars) return player.utils.error(`You can't buy more!`);
        var owner = mp.players.at(player.sellCarOffer.ownerId);
        if (!owner) return player.utils.error(`The seller has not been found!`);

        var dist = player.dist(owner.position);
        if (dist > Config.maxInteractionDist) return player.utils.error(`Seller away!`);
        // if (player.id == owner.id) return player.utils.error(`Нельзя продать дом самому себе!`);

        if (!owner.sellCarOffer) return player.utils.error(`No offer found from the seller!`);

        var keys = owner.inventory.getItem(owner.sellCarOffer.keysSqlId);
        if (!keys) {
            player.utils.error(`The seller has no car keys!`);
            return owner.utils.error(`No car keys found!`);
        }
        if (owner.sqlId != keys.params.owner) return owner.utils.error(`Citizen does not own a car!`);

        var veh = mp.vehicles.getBySqlId(keys.params.car);
        if (!veh) return player.utils.error(`No car found!`);

        var dist = player.dist(veh.position);
        if (dist > 10) return player.utils.error(`Auto too far!`);

        if (veh.owner - 2000 != owner.sqlId) return player.utils.error(`Car owner - another citizen!`);

        var freeSlot = player.inventory.findFreeSlot(54);
        if (!freeSlot) {
            player.utils.error(`Make room for the keys!`);
            return owner.utils.error(`Citizen needs a place for keys!`);
        }

        var price = player.sellCarOffer.price;
        if (player.money < price) {
            owner.utils.error(`${player.name} doesn't have ${price}$`);
            return player.utils.error(`Need: ${price}$`);
        }

        var params = {
            owner: player.sqlId,
            car: veh.sqlId,
            model: owner.sellCarOffer.model
        };


        player.inventory.add(54, params, null, (e) => {
            if (e) return player.utils.error(e);
            owner.utils.setMoney(owner.money + price);
            player.utils.setMoney(player.money - price);
            veh.utils.setOwner(player.sqlId + 2000);

            mp.logs.addLog(`${owner.name} sold car ${params.model} for ${price} to ${player.name}`, 'main', owner.account.id, owner.sqlId, { model: params.model, price: price });
            mp.logs.addLog(`${player.name} bought a car ${params.model} for ${price} from ${owner.name}`, 'main', player.account.id, player.sqlId, { model: params.model, price: price });

            owner.utils.success(`Auto ${veh.name} sold`);
            player.utils.success(`Auto ${veh.name} bought`);

            var index = owner.carIds.indexOf(veh.id);
            if (index != -1) owner.carIds.splice(index, 1);
            player.cars.push({ name: params.model });
            player.carIds.push(veh.id);

            owner.inventory.delete(owner.sellCarOffer.keysSqlId);
            delete player.sellCarOffer;
            delete owner.sellCarOffer;

            for (var i = 0; i < owner.cars.length; i++) {
                if (owner.cars[i].name == params.model) {
                    owner.cars.splice(i, 1);
                    i--;
                }
            }

            player.call(`playerMenu.cars`, [player.cars]);
            owner.call(`playerMenu.cars`, [owner.cars]);
        });
    },

    "car.buycarplayer.cancel": (player) => {
        if (!player.sellCarOffer) return;
        var owner = mp.players.at(player.sellCarOffer.ownerId);
        if (owner) {
            owner.utils.info(`${player.name} canceled the offer`);
            delete owner.sellCarOffer;
        }
        delete player.sellCarOffer;
    }
}
