/*
	25.01.2019 created by Carter.

	События для управления торговлей между игроками.
*/

exports = (menu) => {

    mp.events.add("setTradeActive", (enable) => {
        mp.tradeActive = enable;
    });

    mp.events.add("trade.show", (traderName) => {
        menu.execute(`tradeAPI.show('true', '${traderName}')`);
    });

    mp.events.add("trade.hide", () => {
        menu.execute(`tradeAPI.show('false')`);
    });

    mp.events.add("trade.pushChat", (name, text) => {
        menu.execute(`tradeAPI.pushChat('${name}', '${text}')`);
    });

    mp.events.add("trade.sendChat", (text) => {
        if (!isFlood()) mp.events.callRemote(`trade.sendChat`, text);
    });

    /* Игрок добавил предмет для торговли. */
    mp.events.add("trade.queryAddItem", (sqlId, index) => {
        //if (!isFlood()) {
        mp.events.callRemote(`trade.queryAddItem`, sqlId, index);
        //}
    });

    /* Игрок удалил предмет из торговли. */
    mp.events.add("trade.queryDeleteItem", (sqlId) => {
        //if (!isFlood()) {
        mp.events.callRemote(`trade.queryDeleteItem`, sqlId);
        //}
    });

    /* Второй продавец добавил предмет для торговли. */
    mp.events.add("trade.addTraderItem", (sqlId, item, index) => {
        menu.execute(`tradeAPI.addTraderItem('${sqlId}', '${item}', '${index}')`);
    });

    /* Второй продавец удалил предмет из торговли. */
    mp.events.add("trade.deleteTraderItem", (sqlId) => {
        menu.execute(`tradeAPI.deleteTraderItem('${sqlId}')`);
    });

    /* Игрок принял торговлю. */
    mp.events.add("trade.accept", () => {
        menu.execute(`tradeAPI.accept()`);
    });

    /* Игрок отменил торговлю. */
    mp.events.add("trade.cancel", () => {
        menu.execute(`tradeAPI.cancel()`);
    });

    /* Второй продавец принял торвговлю. */
    mp.events.add("trade.acceptTrader", () => {
        menu.execute(`tradeAPI.acceptTrader()`);
    });

    /* Второй продавец отменил торговлю. */
    mp.events.add("trade.cancelTrader", () => {
        menu.execute(`tradeAPI.cancelTrader()`);
    });

    /* Игрок запрашивает принятие торговли. */
    mp.events.add("trade.queryAccept", () => {
        /*if (!interactionEntity) {
              return nError(`Торговец не найден!`);
        }*/
        if (!isFlood()) {
            mp.events.callRemote(`trade.queryAccept`);
        }
    });

    /* Игрок запрашивает отмену торговли. */
    mp.events.add("trade.queryCancel", (itemIds) => {
        /*if (!interactionEntity) {
              return nError(`Торговец не найден!`);
        }*/
        if (!isFlood()) {
            mp.events.callRemote(`trade.queryCancel`, itemIds);
        }
    });

    /* Игрок запрашивает старт торговли с другим игроком. */
    mp.events.add("trade.createOffer", () => {
        /*if (!interactionEntity) {
              return nError(`Торговец не найден!`);
        }*/
        if (!isFlood() && interactionEntity) {
            mp.events.callRemote(`trade.createOffer`, interactionEntity.remoteId);
        }
    });
}
