module.exports = {
    "trade.createOffer": (player, recipientId) => {
        var trader = mp.players.at(recipientId);
        if (!trader) return player.utils.error(`Seller not found!`);

        var dist = player.dist(trader.position);
        if (dist > Config.maxInteractionDist) return player.utils.error(`The seller is too far away!`);

        trader.offer = {
            traderId: player.id
        };

        player.utils.info(`You offered to start the exchange`);
        trader.utils.info(`Exchange offer received`);
        trader.call("choiceMenu.show", ["accept_trade", {
            name: player.name
        }]);
    },

    "trade.offer.agree": (player) => {
        if (!player.offer) return player.utils.error(`No offer found!`);

        var trader = mp.players.at(player.offer.traderId);
        if (!trader) return player.utils.error(`Seller not found!`);

        var dist = player.dist(trader.position);
        if (dist > Config.maxInteractionDist) return player.utils.error(`The seller is too far away!`);

        delete player.offer;
        mp.events.call(`trade.start`, player, trader.id);

        player.utils.info(`The exchange has begun`);
        trader.utils.info(`The exchange has begun`);
    },

    "trade.offer.cancel": (player) => {
        if (!player.offer) return player.utils.error(`No offer found!`);

        var trader = mp.players.at(player.offer.traderId);
        delete player.offer;
        player.utils.info(`Exchange rejected`);
        if (!trader) return;
        delete trader.offer;

        trader.utils.info(`${player.name} rejected exchange`);
    },

    "trade.start": (player, recipientId) => {
        //debug(`trade.start: ${player.name} ${recipientId}`);

        var trader = mp.players.at(recipientId);
        if (!trader) return player.utils.error(`Seller not found!`);

        var dist = player.dist(trader.position);
        if (dist > Config.maxInteractionDist) return player.utils.error(`The seller is too far away!`);

        player.trade = {
            itemsData: {},
            traderId: recipientId,
            isReady: false,
        };

        trader.trade = {
            itemsData: {},
            traderId: player.id,
            isReady: false,
        };

        player.call(`trade.show`, [trader.name]);
        trader.call(`trade.show`, [player.name]);
    },

    "trade.queryTradeCancel": (player) => {
        if (!player.trade) return player.utils.error(`You didn't join the exchange!`);

        var trader = mp.players.at(player.trade.traderId);
        delete player.trade;
        player.utils.info(`The exchange is over`);
        if (!trader) return player.utils.error(`Seller not found!`);
        var dist = player.dist(trader.position);
        if (dist > Config.maxInteractionDist) return player.utils.error(`The seller is too far away!`);

        delete trader.trade;

        trader.call(`trade.hide`);
        trader.utils.info(`The exchange is over`);
    },

    "trade.queryAddItem": (player, itemSqlId, index) => {
        //debug(`trade.queryAddItem: ${player.name} ${itemSqlId} ${index}`);
        if (!player.trade) return player.utils.error(`You didn't join the exchange!`);

        var trader = mp.players.at(player.trade.traderId);
        if (!trader) return player.utils.error(`Seller not found!`);
        var dist = player.dist(trader.position);
        if (dist > Config.maxInteractionDist) return player.utils.error(`The seller is too far away!`);

        var item = player.inventory.getItem(itemSqlId);
        if (!item) {
            player.call("inventory.delete", [itemSqlId]);
            return player.utils.error(`No item found!`);
        }

        player.trade.itemsData[itemSqlId] = index;

        trader.call(`trade.addTraderItem`, [itemSqlId, JSON.stringify(item), index]);

        player.trade.isReady = false;
        trader.trade.isReady = false;
        player.call(`trade.cancel`);
        player.call(`trade.cancelTrader`);
        trader.call(`trade.cancel`);
        trader.call(`trade.cancelTrader`);
    },

    "trade.queryDeleteItem": (player, itemSqlId) => {
        //debug(`trade.queryDeleteItem: ${player.name} ${itemSqlId}`);
        if (!player.trade) return player.utils.error(`You didn't join the exchange!`);

        var trader = mp.players.at(player.trade.traderId);
        if (!trader) return player.utils.error(`Seller not found!`);
        var dist = player.dist(trader.position);
        if (dist > Config.maxInteractionDist) return player.utils.error(`The seller is too far away!`);

        delete player.trade.itemsData[itemSqlId];
        trader.call(`trade.deleteTraderItem`, [itemSqlId]);

        player.trade.isReady = false;
        trader.trade.isReady = false;
        player.call(`trade.cancel`);
        player.call(`trade.cancelTrader`);
        trader.call(`trade.cancel`);
        trader.call(`trade.cancelTrader`);
    },

    "trade.queryAccept": (player) => {
        //debug(`trade.queryAccept: ${player.name}`);
        if (!player.trade) return player.utils.error(`You didn't join the exchange!`);

        if (player.trade.isReady) return player.utils.error(`You're ready!`);

        var trader = mp.players.at(player.trade.traderId);
        if (!trader) {
            delete player.trade;
            return player.utils.error(`Seller not found!`);
        }
        var dist = player.dist(trader.position);
        if (dist > Config.maxInteractionDist) {
            delete player.trade;
            return player.utils.error(`The seller is too far away!`);
        }

        var itemsData = player.trade.itemsData;
        var playerItems = {};
        for (var id in itemsData) {
            var item = player.inventory.getItem(id);
            if (item) {
                playerItems[id] = item;
                // TODO: Временно.
                var level = mp.convertMinutesToLevelRest(player.minutes).level;
                if (item.itemId == 4 && level < 100) return player.utils.error(`Available with a trail. Level!`);
            }
        }
        if (Object.keys(playerItems).length != Object.keys(itemsData).length) {
            player.call(`trade.hide`);
            trader.call(`trade.hide`);
            delete player.trade;
            delete trader.trade;
            return player.utils.error(`One of the items has not been found!`);
        }

        player.trade.isReady = true;
        player.call(`trade.accept`);
        trader.call(`trade.acceptTrader`);

        if (trader.trade.isReady) {
            var traderItemsData = trader.trade.itemsData;
            var traderItems = {};
            for (var id in traderItemsData) {
                var item = trader.inventory.getItem(id);
                if (item) {
                    traderItems[id] = item;
                }
            }
            if (Object.keys(traderItems).length != Object.keys(traderItemsData).length) {
                player.call(`trade.hide`);
                trader.call(`trade.hide`);
                delete player.trade;
                delete trader.trade;
                return trader.utils.error(`One of the items has not been found!`);
            }

            //debug(`Делаем обмен предметами между ${player.name} и ${trader.name}`);
            //debug(`1-ый игрок items: ${JSON.stringify(playerItems)}`);
            //debug(`2-ой игрок items: ${JSON.stringify(traderItems)}`);

            var playerItemSqlIds = Object.keys(playerItems);
            var traderItemSqlIds = Object.keys(traderItems);

            //debug(`1-ый игрок itemSqlIds: ${JSON.stringify(playerItemSqlIds)}`);
            //debug(`2-ой игрок itemSqlIds: ${JSON.stringify(traderItemSqlIds)}`);

            var playerSlots = player.inventory.findFreeSlots(mp.inventory.itemsToItemIds(traderItems), playerItems);
            var traderSlots = trader.inventory.findFreeSlots(mp.inventory.itemsToItemIds(playerItems), traderItems);

            //debug(`playerSlots: ${JSON.stringify(playerSlots)}`);
            //debug(`traderSlots: ${JSON.stringify(traderSlots)}`);

            if (playerSlots.length < traderItemSqlIds.length) {
                player.utils.error(`Not enough space!`);
                return trader.utils.error(`The citizen lacks space!`);
            }
            if (traderSlots.length < playerItemSqlIds.length) {
                trader.utils.error(`Not enough space!`);
                return player.utils.error(`The citizen lacks space!`);
            }

            // Проверка на существующие ганы.
            for (var sqlId in playerItems) {
                var item = playerItems[sqlId];
                if (item.params.weaponHash) {
                    var alreadyExists = Object.keys(trader.inventory.getArrayByItemId(item.itemId)).length > 0;
                    if (alreadyExists) {
                        trader.utils.error(`Citizen has a gun ${mp.inventory.getItem(item.itemId).name} already available!`);
                        return player.utils.error(`Weapons ${mp.inventory.getItem(item.itemId).name} already available!`);
                    }
                }
            }
            for (var sqlId in traderItems) {
                var item = traderItems[sqlId];
                if (item.params.weaponHash) {
                    var alreadyExists = Object.keys(player.inventory.getArrayByItemId(item.itemId)).length > 0;
                    if (alreadyExists) {
                        player.utils.error(`Citizen has a gun ${mp.inventory.getItem(item.itemId).name} already available!`);
                        return trader.utils.error(`Weapons ${mp.inventory.getItem(item.itemId).name} already available!`);
                    }
                }
            }

            var playerItemsWeight = 0;
            var traderItemsWeight = 0;
            var playerWeight = player.inventory.getCommonWeight();
            var traderWeight = trader.inventory.getCommonWeight();
            for (var sqlId in playerItems) {
                var weight = mp.inventory.items[playerItems[sqlId].itemId - 1];
                playerItemsWeight += weight;
            }
            for (var sqlId in traderItems) {
                var weight = mp.inventory.items[traderItems[sqlId].itemId - 1];
                traderItemsWeight += weight;
            }

            //debug(`player.getCommonWeight: ${playerWeight}`);
            //debug(`trader.getCommonWeight: ${traderWeight}`);

            //debug(`playerItemsWeight: ${playerItemsWeight}`);
            //debug(`traderItemsWeight: ${traderItemsWeight}`);


            if (playerWeight - playerItemsWeight + traderItemsWeight > Config.maxInventoryWeight) {
                player.utils.error(`Not enough stamina!`);
                return trader.utils.error(`Citizen not enough stamina!`);
            }

            if (traderWeight - traderItemsWeight + playerItemsWeight > Config.maxInventoryWeight) {
                trader.utils.error(`Not enough stamina!`);
                return player.utils.error(`Citizen not enough stamina!`);
            }

            player.inventory.swapItems(trader.id, playerItems, traderItems, playerSlots, traderSlots);

            player.call(`trade.hide`);
            trader.call(`trade.hide`);

            mp.events.call(`anim`, player, "anim@mp_player_intincarthumbs_uplow@ps@", "enter", 1500);
            mp.events.call(`anim`, trader, "anim@mp_player_intincarthumbs_uplow@ps@", "enter", 1500);
            mp.logs.addLog(`${player.name} exchanged with the player ${trader.name}`, 'trade', player.account.id, player.sqlId, { playerItems: playerItems, socialClub: player.socialClub });
            mp.logs.addLog(`${trader.name} exchanged with the player ${player.name}`, 'trade', trader.account.id, trader.sqlId, { playerItems: traderItems, socialClub: trader.socialClub });

            player.utils.success(`Successful exchange!`);
            trader.utils.success(`Successful exchange!`);
        }
    },

    "trade.queryCancel": (player) => {
        //debug(`trade.queryCancel: ${player.name}`);
        if (!player.trade) return player.utils.error(`You didn't join the exchange!`);

        if (!player.trade.isReady) return player.utils.error(`You're not ready!`);

        var trader = mp.players.at(player.trade.traderId);
        if (!trader) {
            delete player.trade;
            return player.utils.error(`Seller not found!`);
        }
        var dist = player.dist(trader.position);
        if (dist > Config.maxInteractionDist) {
            delete player.trade;
            return player.utils.error(`The seller is too far away!`);
        }

        player.trade.isReady = false;
        trader.trade.isReady = false;
        player.call(`trade.cancel`);
        player.call(`trade.cancelTrader`);
        trader.call(`trade.cancel`);
        trader.call(`trade.cancelTrader`);
    },

    "trade.sendChat": (player, text) => {
        //debug(`trade.sendChat: ${player.name} ${text}`);
        if (!player.trade) return player.utils.error(`You didn't join the exchange!`);

        var trader = mp.players.at(player.trade.traderId);
        if (!trader) {
            delete player.trade;
            return player.utils.error(`Seller not found!`);
        }
        var dist = player.dist(trader.position);
        if (dist > Config.maxInteractionDist) {
            delete player.trade;
            return player.utils.error(`The seller is too far away!`);

        }

        player.call("trade.pushChat", [player.name, text]);
        trader.call("trade.pushChat", [player.name, text]);

    },
}
