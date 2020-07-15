exports = (menu) => {

    mp.keys.bind(0x45, true, function() { // E key
        if (isFlood()) return;
        //if (mp.chatActive || mp.consoleActive || mp.inventoryActive || mp.tradeActive || mp.playerMenuActive) return;
        mp.events.callRemote("houseHandler");
    });

    mp.keys.bind(0x48, true, function() { // E key
        if (isFlood()) return;
        //if (mp.chatActive || mp.consoleActive || mp.inventoryActive || mp.tradeActive || mp.playerMenuActive) return;
        mp.events.callRemote("houseMenuHandler");
    });

    mp.events.add("setHouseMenuActive", (enable) => {
        mp.houseMenuActive = enable;
    });

    mp.events.add("houseMenu.show", (params) => {
        //var values = [house.sqlId, house.class, house.interior, house.ownerName, house.garage, house.closed, house.price, house.position];
        JSON.stringify(params);

        var houseOwner = "";
        if (params[3]) houseOwner = params[3];

        var haveGarage = "Missing";
        if (params[4]) haveGarage = "Присутствует";

        var garagePlace = "";
        if (params[4]) garagePlace = "1";
        else garagePlace = "Missing";

        let getStreet = mp.game.pathfind.getStreetNameAtCoord(params[7].x, params[7].y, params[7].z, 0, 0);
        let streatName = mp.game.ui.getStreetNameFromHashKey(getStreet["streetName"]);

        //menu.execute(`houseMenu.__vue__.showMenu(0, "", 0, 0, 0, 0, 12);`); //
        menu.execute(`houseMenu.__vue__.showMenu(${params[0]},${params[2]},"${houseOwner}","${streatName}",${params[1]},${params[5]},1,"${haveGarage}","${garagePlace}",${params[6]},${params[8]},${params[9]});`);
        setCursor(true);
    });

    mp.events.add("houseMenu.hide", () => {
        menu.execute(`houseMenu.__vue__.exitMenu();`);
    });

    var houseMenuStatus = false;
    mp.events.add("houseOwnerMenu.update", (update, lock) => {

        if (!update) {
            if (!houseMenuStatus) menu.execute(`houseMenu.__vue__.showOwnerMenu(${lock});`);
            else menu.execute(`houseMenu.__vue__.hideOwnerMenu();`);

            houseMenuStatus = !houseMenuStatus;
            setCursor(houseMenuStatus);
        } else {
            menu.execute(`houseMenu.__vue__.showOwnerMenu(${lock});`);
        }
    });

    mp.events.add("inspectHouse", () => {
        if (!isFlood()) mp.events.callRemote("goEnterHouse"); //goInspectHouse");
    });

    mp.events.add("lockUnlockHouse", () => {
        if (!isFlood()) mp.events.callRemote("goLockUnlockHouse");
    });

    mp.events.add("enterHouse", () => {
        if (!isFlood()) mp.events.callRemote("goEnterHouse");
    });

    mp.events.add("enterGarage", () => {
        if (!isFlood()) mp.events.callRemote("goEnterGarage");
    });

    mp.events.add("exitHouse", () => {
        if (!isFlood()) mp.events.callRemote(`goEnterStreet`);
    });

    mp.events.add("buyHouse", () => {
        if (!isFlood()) mp.events.callRemote(`goBuyHouse`);
    });

    mp.events.add("invitePlayer", () => {
        if (!isFlood()) mp.events.call(`modal.show`, "invite_player_inhouse", {});
    });

    mp.events.add("sellHouseToGov", () => {
        if (!isFlood()) mp.events.callRemote(`sellHouseToGov`);
    });

    mp.events.add("sellHouseToPlayer", () => {

        if (!isFlood()) mp.events.call(`modal.show`, "sell_player_house", {});
    });

    mp.events.add("exitHouseMenu", (hidemenu) => {
        if (hidemenu) menu.execute(`houseMenu.__vue__.exitMenu();`);
        setCursor(false);
    });
};
