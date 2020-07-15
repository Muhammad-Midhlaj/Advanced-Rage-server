module.exports = {
    "playerExitColshape": (player, colshape) => {
        if (!colshape) return;
        if (colshape.marker) colshape.marker.hideFor(player);
        else delete player.colshape;

        if (colshape.menuName) {
            if (colshape.biz && colshape.biz.bizType == 3) player.body.loadItems(); // для магазина одежды
            else if (colshape.factionService) delete player.clearFine;
            return player.call("selectMenu.hide");
        }

        if (colshape.factionProducts) {
            player.utils.setLocalVar("insideProducts", false);
            delete player.factionProducts;
        } else if (colshape.warehouse) {
            player.utils.setLocalVar("insideWarehouseProducts", false);
        } else if (colshape.house) {
            player.call("exitHouseMenu", [true]);
        } else if (colshape.tpMarker && player.lastTpMarkerId != colshape.tpMarker.id) {
            delete player.lastTpMarkerId;
        }
    }
}
