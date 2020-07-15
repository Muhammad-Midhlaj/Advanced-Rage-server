module.exports = {
    "goInspectHouse": (player) => {
        console.log(`goInspectHouse: ${player.name}`);
    },
    "goLockUnlockHouse": (player) => {
        var house;
        if (player.colshape) house = player.colshape.house;
        if (!house) house = mp.houses.getBySqlId(player.inHouse);
        if (!house) return player.utils.error(`You're far from home!`);

        var keys = player.inventory.getArrayByItemId(59);
        for (var sqlId in keys) {
            if (keys[sqlId].params.house == house.sqlId) {
                if (house.closed) house.setClosed(0);
                else house.setClosed(1);
                player.call("houseOwnerMenu.update", [true, house.closed]);
                return;
            }
        }
        player.utils.error(`The key to the house has not been found!`);
    },
    "goBuyHouse": (player) => {
        const houses = mp.houses.getArrayByOwner(player.sqlId);
        if (!player.colshape || !player.colshape.house) return player.utils.error(`You're not at home!`);
        let house = player.colshape.house;
        if (house.owner) return player.utils.error(`The house has already been bought!`);

        if (player.money < house.price) return player.utils.error(`Need: ${house.price}$`);
        if (houses.length >= player.donateHouse) return player.utils.error(`You have the maximum amount of housing`);
        var freeSlot = player.inventory.findFreeSlot(59);
        if (!freeSlot) return player.utils.error(`Make room for the keys!`);

        mp.fullDeleteItemsByParams(59, ["house"], [house.sqlId]);
        player.inventory.add(59, {
            owner: player.sqlId,
            house: house.sqlId
        }, null, (e) => {
            if (e) return player.utils.error(e);

            player.utils.setMoney(player.money - house.price);
            house.setOwner(player.sqlId, player.name);
            player.utils.addHouse(house);

            player.utils.setSpawn(1);
            player.utils.setHouseId(house.sqlId);

            player.utils.success(`House ${house.sqlId} bought`);
            mp.logs.addLog(`${player.name} bought a house ${house.sqlId}. Price: ${house.price}`, 'house', player.account.id, player.sqlId, { houseId: house.sqlId, price: house.price });
            player.call("exitHouseMenu", [true]);
        });
    },
    "goEnterHouse": (player) => {
        if (!player.colshape || !player.colshape.house) return player.utils.error(`You're not at home!`);
        let house = player.colshape.house;

        if (house.closed) return player.utils.warning(`Closed!`);
        player.inHouse = house.sqlId;

        var interior = mp.interiors.getBySqlId(house.interior);
        if (!interior) return player.utils.error(`The interior has not been found!`);
        if (interior.garageMarker && house.garage) interior.garageMarker.showFor(player);
        //interior.exitMarker.showFor(player);

        if (house.closed) return player.utils.error(`Closed!`);

        var pos = new mp.Vector3(interior.x, interior.y, interior.z);
        player.dimension = house.sqlId;
        player.position = pos;
        player.heading = interior.h;
        player.call("exitHouseMenu", [true]);
    },
    "goEnterStreet": (player) => {
        if (!player.inHouse) return player.utils.error(`You're not in the house!`);
        var house = mp.houses.getBySqlId(player.inHouse);
        if (house.closed) return player.utils.warning(`Closed!`);

        player.position = house.position;
        player.heading = house.h;
        player.dimension = 0;

        var interior = mp.interiors.getBySqlId(house.interior);
        if (!interior) return player.utils.error(`The interior has not been found!`);
        if (interior.garageMarker) interior.garageMarker.hideFor(player);
        //interior.exitMarker.hideFor(player);

        delete player.inHouse;
    },
    "goEnterGarage": (player) => {
        var enterHouse = mp.houses.getBySqlId(player.inHouse);
        if (!enterHouse) return player.utils.error(`You have to be in the house!`);

        if (!enterHouse.garage) return player.utils.error(`House doesn't have a garage!`);
        if (enterHouse.garageClosed) return player.utils.warning(`Garage closed!`);

        var garage = mp.garages.getBySqlId(enterHouse.garage);
        if (!garage) return player.utils.error(`House doesn't have a garage!`);

        delete player.inHouse;
        player.inGarage = enterHouse.sqlId;
        var pos = new mp.Vector3(garage.x, garage.y, garage.z);

        player.dimension = enterHouse.sqlId;
        player.position = pos;
        player.heading = garage.h;

        var interior = mp.interiors.getBySqlId(enterHouse.interior);
        if (!interior) return player.utils.error(`The interior has not been found!`);
        if (interior.garageMarker) interior.garageMarker.hideFor(player);
        //interior.exitMarker.hideFor(player);

        player.call("exitHouseMenu", [true]);
    },

    "goExitGarage": (player) => {
        if (!player.inGarage) return player.utils.error(`You're not in the garage!`);

        var house = mp.houses.getBySqlId(player.inGarage);
        if (!house) return player.utils.error(`House Not found!`);

        var interior = mp.interiors.getBySqlId(house.interior);
        if (!interior) return player.utils.error(`Interior from home Not found!`);

        var pos = new mp.Vector3(interior.garageX, interior.garageY, interior.garageZ);
        player.dimension = house.sqlId;
        //interior.exitMarker.showFor(player);
        interior.garageMarker.showFor(player);
        player.position = pos;
        player.heading = interior.garageH;
        player.inHouse = player.inGarage;
        delete player.inGarage;
    },

    "goEnterStreetFromGarage": (player) => {
        if (!player.inGarage) return player.utils.error(`You're not in the garage!`);

        var exitHouse = mp.houses.getBySqlId(player.inGarage);
        if (exitHouse.garageClosed) return player.utils.warning(`Garage closed!`);
        if (!exitHouse.garageH && !exitHouse.garageZ) return player.utils.error(`No way out!`);

        var pos = new mp.Vector3(exitHouse.garageX, exitHouse.garageY, exitHouse.garageZ);
        player.dimension = 0;
        player.position = pos;
        player.heading = exitHouse.garageH;

        delete player.inGarage;
    },

    "getHouseInfo": (player) => {
        if (!player.colshape || !player.colshape.house) return player.utils.error(`You're not at home!`);
        let house = player.colshape.house;

        var values = [house.sqlId, house.class, house.interior, house.ownerName, house.garage, house.closed, house.price];
        player.call("infoTable.show", ["house_info", values]);
    },

    "getGarageInfo": (player) => {
        var house;
        if (!player.inHouse) house = mp.houses.getBySqlId(player.colshape.garage.houseSqlId); // с улицы смотрим инфо
        else house = mp.houses.getBySqlId(player.inHouse); // из дома смотрим инфо

        if (!house) return player.utils.error(`House garage not found!`);

        player.call("infoTable.show", ["garage_info", [house.sqlId, house.garage, house.garageClosed]]);
    },

    "invitePlayerInHouse": (player, params) => {
        params = JSON.parse(params);
        if (!player.colshape || !player.colshape.house) return player.utils.error(`You're not at home!`);
        var house = player.colshape.house;
        if (house.owner != player.sqlId) return player.utils.error(`You're not the owner of the house!`);

        var invitePlayer = null;
        if (parseInt(params[0]) >= 0) invitePlayer = mp.players.at(parseInt(params[0]));
        else invitePlayer = mp.players.getByName(params[0]);
        if (!invitePlayer) return player.utils.error("Citizen Not found!");
        else if (player.id === invitePlayer.id) return player.utils.error("You can't invite yourself!");
        var dist = player.dist(invitePlayer.position);
        if (dist > Config.maxInteractionDist) return player.utils.error(`The citizen is too far away!`);

        invitePlayer.call("choiceMenu.show", ["invite_inhouse_confirm", {
            name: player.name
        }]);
        // invitePlayer.call("exitHouseMenu", [true]);
        invitePlayer.inviteInHouse = house;
    },

    "house.invite.agree": (player) => {
        if (!player.inviteInHouse) return player.utils.error(`You weren't invited into the house!`);

        // player.call("exitHouseMenu", [true]);
        var house = player.inviteInHouse;
        var interior = mp.interiors.getBySqlId(house.interior);
        if (!interior) return player.utils.error(`The interior has not been found!`);
        if (interior.garageMarker && house.garage) interior.garageMarker.showFor(player);
        //interior.exitMarker.showFor(player);

        var pos = new mp.Vector3(interior.x, interior.y, interior.z);
        player.inHouse = house.sqlId;
        player.dimension = house.sqlId;
        player.position = pos;
        player.heading = interior.h;

        delete player.inviteInHouse;
    },

    "house.invite.cancel": (player) => {
        delete player.inviteInHouse;
    },

    "sellHouseToGov": (player) => {
        if (!player.inHouse) return player.utils.error(`The sale is carried out in the house!`);
        var house = mp.houses.getBySqlId(player.inHouse);
        if (!house) return player.utils.error(`House Not found!`);
        if (house.owner != player.sqlId) return player.utils.error(`You're not the owner of the house!`);

        var balance = house.balance;
        if (balance <= 1000) balance = 0;
        var price = parseInt(house.price * mp.economy["house_sell"].value) + balance;
        player.call("choiceMenu.show", ["sellhousegov_confirm", {
            price: price
        }]);
    },

    "house.sellgov.agree": (player) => {
        if (!player.inHouse) return player.utils.error(`The sale is carried out in the house!`);
        var house = mp.houses.getBySqlId(player.inHouse);
        if (!house) return player.utils.error(`House Not found!`);
        if (house.owner != player.sqlId) return player.utils.error(`You're not the owner of the house!`);

        var balance = house.balance;
        if (balance <= 1000) balance = 0;
        var price = parseInt(house.price * mp.economy["house_sell"].value) + balance;
        player.utils.setBankMoney(player.bank + price);
        house.setOwner(0);
        player.utils.removeHouse(house);
        if(player.houseId == house.sqlId) {
            player.utils.setSpawn(3);
            player.utils.setHouseId(0);
        }
        player.utils.bank(`Property`, `Awarded: ~g~$${price}`);
        player.utils.success(`House ${house.sqlId} Sold to the state!`);
        mp.logs.addLog(`${player.name} sold house ${house.sqlId} state. Price: ${house.price}`, 'house', player.account.id, player.sqlId, { houseId: house.sqlId, price: house.price });
    },

    "sellHousePlayer": (player, params) => {
        params = JSON.parse(params);
        if (!player.inHouse) return player.utils.error(`The sale is carried out in the house!`);
        var house = mp.houses.getBySqlId(player.inHouse);
        if (!house) return player.utils.error(`House Not found!`);
        if (house.owner != player.sqlId) return player.utils.error(`You're not the owner of the house!`);

        var invitePlayer = null;
        if (parseInt(params[0]) >= 0) invitePlayer = mp.players.at(parseInt(params[0]));
        else invitePlayer = mp.players.getByName(params[0]);
        if (!invitePlayer) return player.utils.error("Гражданин Not found!");
        const houses = mp.houses.getArrayByOwner(invitePlayer.sqlId);
        if(houses.length >= invitePlayer.donateHouse) return player.utils.error("Игрок имеет максимальное количество жилья");
        if(player.id === invitePlayer.id) return player.utils.error("You can't sell a house to yourself!");

        var price = parseInt(params[1]);
        if (price <= 0) return player.utils.error(`Wrong price!`);

        player.call("choiceMenu.show", ["sellhouseplayer_confirm", {
            name: invitePlayer.name,
            price: price
        }]);

        player.sellHouseOffer = {
            invitePlayerId: invitePlayer.id,
            price: price
        };
    },

    "house.sellplayer.agree": (player) => {
        if (!player.inHouse) return player.utils.error(`The sale is carried out in the house!`);
        var house = mp.houses.getBySqlId(player.inHouse);
        if (!house) return player.utils.error(`House Not found!`);
        if (house.owner != player.sqlId) return player.utils.error(`You're not the owner of the house!`);
        if (!player.sellHouseOffer) return player.utils.error(`Offer Not found!`);

        var invitePlayer = mp.players.at(player.sellHouseOffer.invitePlayerId);
        if (!invitePlayer) return player.utils.error(`Buyer Not found!`);

        var dist = player.dist(invitePlayer.position);
        if (dist > Config.maxInteractionDist) return player.utils.error(`Buyer far away!`);
        if (player.id == invitePlayer.id) return player.utils.error(`You can't sell a house to yourself!`);

        invitePlayer.call("choiceMenu.show", ["buyhouseplayer_confirm", {
            name: player.name,
            houseid: house.id,
            price: player.sellHouseOffer.price,
        }]);

        invitePlayer.sellHouseOffer = {
            ownerId: player.id,
            price: player.sellHouseOffer.price
        };
    },

    "house.sellplayer.cancel": (player) => {
        delete player.sellHouseOffer;
    },

    "house.buyhouseplayer.agree": (player) => {
        if (!player.sellHouseOffer) return player.utils.error(`Offer Not found!`);
        var owner = mp.players.at(player.sellHouseOffer.ownerId);
        if (!owner) return player.utils.error(`Seller Not found!`);

        var dist = player.dist(owner.position);
        if (dist > Config.maxInteractionDist) return player.utils.error(`Seller far away!`);
        if (player.id == owner.id) return player.utils.error(`You can't sell a house to yourself!`);

        if (!owner.inHouse) return player.utils.error(`The sale is carried out in the house!`);
        var house = mp.houses.getBySqlId(owner.inHouse);
        if (!house) return player.utils.error(`House Not found!`);
        if (house.owner != owner.sqlId) return player.utils.error(`Seller is not the owner of the house!`);
        var price = player.sellHouseOffer.price;
        if (player.money < price) {
            owner.utils.info(`${player.name} doesn't have ${price}$`);
            return player.utils.error(`Need: ${price}$`);
        }
        // TODO: Проверка на наличие домов.
        owner.utils.setMoney(owner.money + price);
        player.utils.setMoney(player.money - price);
        house.setOwner(player.sqlId, player.name);

        owner.utils.success(`House ${house.sqlId} sold`);
        player.utils.success(`House ${house.sqlId} bought`);
        
        mp.logs.addLog(`${owner.name} sold house ${house.sqlId} player ${player.name}. Price: ${price}`, 'house', owner.account.id, owner.sqlId, { houseId: house.sqlId, price: price });
        mp.logs.addLog(`${player.name} bought a house ${house.sqlId} from player ${owner.name}. Price: ${price}`, 'house', player.account.id, player.sqlId, { houseId: house.sqlId, price: price });

        player.utils.setSpawn(1);
        player.utils.setHouseId(house.sqlId);

        owner.utils.setHouseId(0);
        owner.utils.setSpawn(3);

        owner.utils.removeHouse(house);
        player.utils.addHouse(house);
    },

    "house.buyhouseplayer.cancel": (player) => {
        if (!player.sellHouseOffer) return;
        var owner = mp.players.at(player.sellHouseOffer.ownerId);
        if (owner) {
            owner.utils.info(`${player.name} canceled the offer`);
            delete owner.sellHouseOffer;
        }
        delete player.sellHouseOffer;
    }
};
