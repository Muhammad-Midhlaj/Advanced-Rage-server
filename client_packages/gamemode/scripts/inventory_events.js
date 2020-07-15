exports = (menu) => {

    mp.events.add("inventory.enable", (enable) => {
        menu.execute(`inventoryAPI.enable(${enable})`);
    });

    mp.events.add("inventory.add", (items) => {
        var items = convertIndexesToSqlId(items);
        for (var key in items) {
            menu.execute(`inventoryAPI.add('${key}', '${JSON.stringify(items[key])}')`);
        }
    });

    mp.events.add("inventory.vehAdd", (items) => {
        for (var key in items) {
            menu.execute(`inventoryAPI.vehAdd('${key}', '${JSON.stringify(items[key])}')`);
        }
    });

    mp.events.add("inventory.delete", (sqlId) => {
        menu.execute(`inventoryAPI.delete('${sqlId}')`);
    });

    mp.events.add("inventory.vehDelete", (sqlId) => {
        menu.execute(`inventoryAPI.vehDelete('${sqlId}')`);
    });

    mp.events.add("inventory.updateParams", (sqlId, params) => {
        menu.execute(`inventoryAPI.updateParams('${sqlId}', '${JSON.stringify(params)}')`);
    });

    mp.events.add("inventory.updateSqlId", (sqlId, newSqlId) => {
        //debug(`inventory.updateSqlId: ${sqlId} ${newSqlId}`)
        menu.execute(`inventoryAPI.updateSqlId(${sqlId}, ${newSqlId})`);
    });

    mp.events.add("setInventoryActive", (enable) => {
        mp.inventoryActive = enable;
    });

    mp.events.add("itemLabel.destroy", (itemSqlId) => {
        mp.labels.forEach((label) => {
            if (label.data && label.data.inventoryItemSqlId == itemSqlId) label.destroy();
        });
    });

    mp.events.add("inventory.setMoney", (value) => {
        menu.execute(`inventoryAPI.setMoney('${value}')`);
    });

    mp.events.add("inventory.setBankMoney", (value) => {
        menu.execute(`inventoryAPI.setBankMoney('${value}')`);
    });

    mp.events.add("inventory.setHealth", (value) => {
        menu.execute(`inventoryAPI.setHealth('${value}')`);
    });

    mp.events.add("inventory.setSatiety", (value) => {
        menu.execute(`inventoryAPI.setSatiety('${value}')`);
    });

    mp.events.add("inventory.setThirst", (value) => {
        menu.execute(`inventoryAPI.setThirst('${value}')`);
    });

    mp.events.add("inventory.setArmour", (value) => {
        menu.execute(`inventoryAPI.setArmour('${value}')`);
    });

    mp.events.add("inventory.addVehicleItems", (items, veh, rows, cols) => {
        return;
        menu.execute(`inventoryAPI.addVehicleItems('${JSON.stringify(items)}', '${JSON.stringify(veh)}', ${rows}, ${cols})`);
    });

    mp.events.add("inventory.deleteVehicleItems", () => {
        return;
        menu.execute(`inventoryAPI.deleteVehicleItems()`);
    });
}

/* Конвертируем новую серверную структуру в старую. */
function convertIndexesToSqlId(items) {
    var result = {};
    for (var index in items) {
        var item = items[index];
        if (item.items) item.items = convertIndexesToSqlId(item.items);
        result[item.id] = item;
    }
    items = null;
    return result;
}
