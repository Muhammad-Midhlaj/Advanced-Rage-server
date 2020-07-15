exports = (menu) => {

    let UI = true;

    if(!mp.storage.data["hud"] && !mp.storage.data["chat"] && !mp.storage.data["nickname"] && !mp.storage.data["nickId"]) {
        mp.storage.data["hud"] = true;
        mp.storage.data["nickname"] = true;
        mp.storage.data["nickId"] = true;
        mp.storage.data["chat"] = 2;
    }

    mp.events.add("playerMenu.Hud", (enable) => {
        if (enable == false) {
            UI = false;
            menu.execute(`mp.events.call('hudControl', { status: ${false}, event: 'enable' })`);
            mp.storage.data["hud"] = enable;
            mp.game.ui.displayHud(false);
            mp.gui.chat.show(false);
            mp.game.ui.displayRadar(false);
            mp.events.call("control.player.hud", false);
        } else {
            UI = true;
            menu.execute(`mp.events.call('hudControl', { status: ${true}, event: 'enable' })`);
            mp.storage.data["hud"] = enable;
            mp.game.ui.displayHud(true);
            mp.gui.chat.show(true);
            mp.game.ui.displayRadar(true);
            mp.events.call("control.player.hud", true);
        }
    });

    mp.events.add("playerMenu.Chat", (set) => {
        mp.storage.data["chat"] = set;
    });

    mp.events.add("playerMenu.skills", (data) => {
        menu.execute(`mp.events.call('playerMenu', { skills: ${data}, event: 'skills' })`);
    });

    mp.events.add("playerMenu.houses", (data, value) => {
        var houses = [];
        if(data === undefined) {

        } else {
            for (var i = 0; i < data.length; i++) {
                var h = data[i];
                var pos = new mp.Vector3(h.x, h.y, h.z);
                var getStreet = mp.game.pathfind.getStreetNameAtCoord(pos.x, pos.y, pos.z, 0, 0);
                var adress = mp.game.ui.getStreetNameFromHashKey(getStreet["streetName"]);
                houses.push({ sqlId: h.sqlId, class: h.class, garage: h.garage, rentPrice: parseInt(h.price / 100) * value, adress: adress });
            }
            menu.execute(`mp.events.call('playerMenu', { houses: ${JSON.stringify(houses)}, event: 'houses' })`);
        }
    });

    mp.events.add("playerMenu.bizes", (data, value) => {
        var bizes = [];
        if(data === undefined) {
            
        } else {
            for (var i = 0; i < data.length; i++) {
                var b = data[i];
                var pos = new mp.Vector3(b.x, b.y, b.z);
                var getStreet = mp.game.pathfind.getStreetNameAtCoord(pos.x, pos.y, pos.z, 0, 0);
                var adress = mp.game.ui.getStreetNameFromHashKey(getStreet["streetName"]);
                bizes.push({ sqlId: b.sqlId, name: b.name, bizType: b.bizType, rentPrice: parseInt(b.price / 100) * value, adress: adress });
            }
            menu.execute(`mp.events.call('playerMenu', { bizes: ${JSON.stringify(bizes)}, event: 'bizes' })`);
        }
    });

    mp.events.add("playerMenu.addHouse", (data) => {
        if(data === undefined) {

        } else {
            var pos = new mp.Vector3(data.x, data.y, data.z);
            var getStreet = mp.game.pathfind.getStreetNameAtCoord(pos.x, pos.y, pos.z, 0, 0);
            var adress = mp.game.ui.getStreetNameFromHashKey(getStreet["streetName"]);
            var houses = { sqlId: data.sqlId, class: data.class, garage: data.garage, rentPrice: data.rentPrice, adress: adress };
            menu.execute(`mp.events.call('playerMenu', { addHouse: ${JSON.stringify(houses)}, event: 'addHouse' })`);
        }
    });

    mp.events.add("playerMenu.removeHouse", (Id) => {
        menu.execute(`mp.events.call('playerMenu', { removeHouse: ${Id}, event: 'removeHouse' })`);
    });

    mp.events.add("playerMenu.removeBiz", (Id) => {
        menu.execute(`mp.events.call('playerMenu', { removeBiz: ${Id}, event: 'removeBiz' })`);
    });

    mp.events.add("playerMenu.addBiz", (data) => {
        if(data === undefined) {

        } else {
            var pos = new mp.Vector3(data.x, data.y, data.z);
            var getStreet = mp.game.pathfind.getStreetNameAtCoord(pos.x, pos.y, pos.z, 0, 0);
            var adress = mp.game.ui.getStreetNameFromHashKey(getStreet["streetName"]);
            var bizes = { sqlId: data.sqlId, name: data.name, bizType: data.bizType, rentPrice: data.rentPrice, adress: adress };
            menu.execute(`mp.events.call('playerMenu', { addBiz: ${JSON.stringify(bizes)}, event: 'addBiz' })`);
        }
    });
    
    mp.events.add("playerMenu.setSpawn", (set, event) => {
        if(event === 'client') {
            mp.events.callRemote('setSpawn', set);
        } else {
            menu.execute(`mp.events.call('playerMenu', { spawn: ${set}, event: 'spawn' })`);
        }
    });

    mp.events.add("playerMenu.setHouseId", (set, event) => {
        if(event === 'client') {
            mp.events.callRemote('setHouseId', set);
        } else {
            menu.execute(`mp.events.call('playerMenu', { houseId: ${set}, event: 'houseId' })`);
        }
    });

    mp.events.add("playerMenu.enable", (enable) => {
        menu.execute(`mp.events.call('playerMenu', { chat: ${mp.storage.data["chat"]}, event: 'chat' })`);
        menu.execute(`mp.events.call('playerMenu', { hud: ${mp.storage.data["hud"]}, event: 'hud' })`);
        menu.execute(`mp.events.call('playerMenu', { nickname: ${mp.storage.data["nickname"]}, event: 'nickname' })`);
        menu.execute(`mp.events.call('playerMenu', { nickId: ${mp.storage.data["nickId"]}, event: 'nickId' })`);
        menu.execute(`mp.events.call('playerMenu', { status: ${enable}, event: 'enable' })`);

        if (mp.storage.data["hud"] == false) {
            UI = false;
            menu.execute(`mp.events.call('hudControl', { status: ${false}, event: 'enable' })`);
            mp.storage.data["hud"] = false;
            mp.game.ui.displayHud(false);
            mp.gui.chat.show(false);
            mp.game.ui.displayRadar(false);
            mp.events.call("control.player.hud", false);
        } else {
            UI = true;
            menu.execute(`mp.events.call('hudControl', { status: ${true}, event: 'enable' })`);
            mp.storage.data["hud"] = true;
            mp.game.ui.displayHud(true);
            mp.gui.chat.show(true);
            mp.game.ui.displayRadar(true);
            mp.events.call("control.player.hud", true);
        }
    });

    mp.events.add("playerMenu.achievements", (achievements) => {
        if(achievements === undefined) {
            
        } else {
            menu.execute(`mp.events.call('playerMenu', {achievements: ${JSON.stringify(achievements)}, event: 'achievements' })`);
        }
    });

    mp.events.add("playerMenu.achievementsPlayer", (achievements) => {
        if(achievements === undefined) {
            
        } else {
            menu.execute(`mp.events.call('playerMenu', {achievementsPlayer: ${JSON.stringify(achievements)}, event: 'achievementsPlayer' })`);
        }
    });

    mp.events.add("playerMenu.cars", (cars) => {
        var list = [];
        if(cars === undefined) {

        } else {
            for (var i = 0; i < cars.length; i++) {
                var c = cars[i];
                list.push({
                    name: c.name,
                    maxSpeed: mp.game.vehicle.getVehicleModelMaxSpeed(mp.game.joaat(c.name)), 
                    braking: (mp.game.vehicle.getVehicleModelMaxBraking(mp.game.joaat(c.name)) * 100).toFixed(2), 
                    acceleration: (mp.game.vehicle.getVehicleModelAcceleration(mp.game.joaat(c.name)) * 100).toFixed(2), 
                    controllability: mp.game.vehicle.getVehicleModelMaxTraction(mp.game.joaat(c.name)).toFixed(2),
                    maxSpeedKm: ((mp.game.vehicle.getVehicleModelMaxSpeed(mp.game.joaat(c.name)) * 3.6).toFixed(0))
                });
            }
            menu.execute(`mp.events.call('playerMenu', { cars: ${JSON.stringify(list)}, event: 'cars' })`);
        }
    });

    mp.events.add("render", () => {
        var player = mp.players.local;
        if (UI) {
          if (mp.clientStorage["admin"] > 0) {
              const pos = player.position;
              const heading = player.getHeading();

              mp.game.graphics.drawText(`x: ${pos.x.toFixed(2)}, y: ${pos.y.toFixed(2)}, z: ${pos.z.toFixed(2)}, h: ${heading.toFixed(2)}`, [0.30, 0.965], {
                  font: 0,
                  color: [255, 255, 255, 230],
                  scale: [0.4, 0.4],
                  outline: true
              });
          }
          /*drawFPS();*/
        }
    });
    
    mp.events.add("setPlayerMenuActive", (enable) => {
        mp.playerMenuActive = enable;
    });
}
