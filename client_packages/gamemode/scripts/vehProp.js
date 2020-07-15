var mileageTimer, mileageUpdater, lastPos, hashDist = 0;
var vehPropActive = false;

function startMileageCounter(menu) {
    //debug(`startMileageCounter`)
    var player = mp.players.local;
    lastPos = player.position;
    stopMileageCounter();
    mileageTimer = setInterval(() => {
        //debug(`mileageTimer tick!`);
        var veh = player.vehicle;
        if (!veh) return stopMileageCounter();

        var dist = (veh.position.x - lastPos.x) * (veh.position.x - lastPos.x) + (veh.position.y - lastPos.y) * (veh.position.y - lastPos.y) +
            (veh.position.z - lastPos.z) * (veh.position.z - lastPos.z);
        dist = Math.sqrt(dist);
        if (dist > 200) dist = 50;
        dist /= 1000;

        hashDist += dist;
        lastPos = veh.position;

        var mileage = veh.mileage + hashDist;
        //menu.execute(`MileageHandler(${mileage});`);
        menu.execute(`mp.events.call('carSystem', { mileage: ${mileage}, event: 'MileageHandler' })`);


    }, 1000);
    mileageUpdater = setInterval(() => {
        var veh = player.vehicle;
        if (!veh) return stopMileageCounter();
        if (hashDist < 0.1) return;
        mp.events.callRemote(`addMileage`, hashDist.toFixed(1));
        veh.mileage += hashDist;
        hashDist = 0;
    }, 60000);
};

function stopMileageCounter() {
    //debug(`stopMileageCounter`)
    clearInterval(mileageTimer);
    clearInterval(mileageUpdater);

    mileageTimer = 0;
    mileageUpdater = 0;

    if (hashDist < 0.1) return;
    mp.events.callRemote(`addMileage`, hashDist.toFixed(1));
    hashDist = 0;
};

exports = (menu) => {
    var player = mp.players.local;

    mp.events.add('playerEnterVehicle', (vehicle, seat) => {
        //menu.execute(`mp.events.call('carSystem', { enable: ${true}, event: 'vehEnable' })`);
    });

    mp.events.add('playerLeaveVehicle', () => {
        stopMileageCounter();
    });

    mp.events.add('vehicleEngineHandler', () => {
        mp.events.call("prompt.hide");
        var player = mp.players.local;
        if (!player.vehicle) return;
        if (player.vehicle.getPedInSeat(-1) != player.handle) return;
        if (isFlood()) return;
        var engine = player.vehicle.getVariable("engine");

        if (!engine) {
            var engineBroken = player.vehicle.engineBroken;
            var oilBroken = player.vehicle.oilBroken;
            var accumulatorBroken = player.vehicle.accumulatorBroken;
            if (player.vehicle.fuel <= 0) return mp.events.call(`nError`, "No fuel!");
            if (engineBroken) return mp.events.call(`nError`, "The engine's broken!");
            if (oilBroken) return mp.events.call(`nError`, "Fill up the oil");
            if (accumulatorBroken) return mp.events.call(`nError`, "Battery's broken!");
        }

        mp.events.callRemote(`vehicle.engine.on`);
    });

    mp.events.addDataHandler("leftSignal", (entity) => {
        var left = entity.getVariable('leftSignal');
        entity.setIndicatorLights(1, left);

        if (player.vehicle && entity.remoteId == player.vehicle.remoteId) {
            // var left = player.vehicle.getVariable("leftSignal");
            var right = entity.getVariable("rightSignal");
            var engine = entity.getVariable("engine");
            if (engine) {
                if (!left || !right) {
                    menu.execute(`mp.events.call('carSystem', { left: ${left}, event: 'LeftSignalHandler' })`);
                    menu.execute(`mp.events.call('carSystem', { right: ${right}, event: 'RightSignalHandler' })`);
                    menu.execute(`mp.events.call('carSystem', { emergency: ${false}, event: 'EmergencyHandler' })`);
                } else {
                    menu.execute(`mp.events.call('carSystem', { emergency: ${true}, event: 'EmergencyHandler' })`);
                }
            } else {
                menu.execute(`mp.events.call('carSystem', { left: ${false}, event: 'LeftSignalHandler' })`);
                menu.execute(`mp.events.call('carSystem', { right: ${false}, event: 'RightSignalHandler' })`);
                menu.execute(`mp.events.call('carSystem', { emergency: ${false}, event: 'EmergencyHandler' })`);
            }
        }
    });

    mp.events.addDataHandler("rightSignal", (entity) => {
        var right = entity.getVariable('rightSignal');
        entity.setIndicatorLights(0, right);

        if (player.vehicle && entity.remoteId == player.vehicle.remoteId) {
            var left = player.vehicle.getVariable("leftSignal");
            // var right = entity.getVariable("rightSignal");
            var engine = entity.getVariable("engine");
            if (engine) {
                if (!left || !right) {
                    menu.execute(`mp.events.call('carSystem', { left: ${left}, event: 'LeftSignalHandler' })`);
                    menu.execute(`mp.events.call('carSystem', { right: ${right}, event: 'RightSignalHandler' })`);
                    menu.execute(`mp.events.call('carSystem', { emergency: ${false}, event: 'EmergencyHandler' })`);
                } else {
                    menu.execute(`mp.events.call('carSystem', { emergency: ${true}, event: 'EmergencyHandler' })`);
                }
            } else {
                menu.execute(`mp.events.call('carSystem', { left: ${false}, event: 'LeftSignalHandler' })`);
                menu.execute(`mp.events.call('carSystem', { right: ${false}, event: 'RightSignalHandler' })`);
                menu.execute(`mp.events.call('carSystem', { emergency: ${false}, event: 'EmergencyHandler' })`);
            }
        }
    });

    mp.events.addDataHandler("hood", (entity) => {
        var hood = entity.getVariable('hood');
        if (hood) entity.setDoorOpen(4, false, false);
        else entity.setDoorShut(4, false);
    });

    mp.events.addDataHandler("boot", (entity) => {
        var boot = entity.getVariable('boot');
        if (boot) entity.setDoorOpen(5, false, false);
        else entity.setDoorShut(5, false);
    });

    mp.events.addDataHandler("engine", (entity) => {
        var engine = entity.getVariable('engine');
        entity.setUndriveable(!engine);
        entity.setEngineOn(engine, true, true);

        if (player.vehicle && player.vehicle.remoteId == entity.remoteId) {
            var left = entity.getVariable("leftSignal");
            var right = entity.getVariable("rightSignal");
            var engine = entity.getVariable("engine");
            if (engine) {
                if (!left || !right) {
                    menu.execute(`mp.events.call('carSystem', { left: ${left}, event: 'LeftSignalHandler' })`);
                    menu.execute(`mp.events.call('carSystem', { right: ${right}, event: 'RightSignalHandler' })`);
                    menu.execute(`mp.events.call('carSystem', { emergency: ${false}, event: 'EmergencyHandler' })`);

                    menu.execute(`mp.events.call('carSystem', { engine: ${true}, event: 'engineStatus' })`);
                    menu.execute(`mp.events.call('carSystem', { accumulator: ${true}, event: 'accumulatorStatus' })`);
                    menu.execute(`mp.events.call('carSystem', { oil: ${true}, event: 'OilBrokenHandler' })`);
                } else {
                    menu.execute(`mp.events.call('carSystem', { emergency: ${true}, event: 'EmergencyHandler' })`);
                }
            } else {
                menu.execute(`mp.events.call('carSystem', { left: ${false}, event: 'LeftSignalHandler' })`);
                menu.execute(`mp.events.call('carSystem', { right: ${false}, event: 'RightSignalHandler' })`);
                menu.execute(`mp.events.call('carSystem', { emergency: ${false}, event: 'EmergencyHandler' })`);

                menu.execute(`mp.events.call('carSystem', { engine: ${false}, event: 'engineStatus' })`);
                menu.execute(`mp.events.call('carSystem', { accumulator: ${false}, event: 'accumulatorStatus' })`);
                menu.execute(`mp.events.call('carSystem', { oil: ${false}, event: 'OilBrokenHandler' })`);
            }
        }
    });

    mp.events.addDataHandler("engineBroken", (entity) => {
        if (entity.getPedInSeat(-1) != player.handle) return;
        menu.execute(`mp.events.call('carSystem', { engine: ${engineBroken}, event: 'engineStatus' })`);
    });

    mp.events.addDataHandler("oilBroken", (entity) => {
        if (entity.getPedInSeat(-1) != player.handle) return;
        menu.execute(`mp.events.call('carSystem', { oil: ${oilBroken}, event: 'OilBrokenHandler' })`);
    });

    mp.events.addDataHandler("accumulatorBroken", (entity) => {
        if (entity.getPedInSeat(-1) != player.handle) return;
       menu.execute(`mp.events.call('carSystem', { accumulator: ${accumulatorBroken}, event: 'accumulatorStatus' })`);

    });

    mp.events.addDataHandler("sirenSound", (entity) => {
        var sirenSound = entity.getVariable("sirenSound");
        entity.setSirenSound(sirenSound);
    });
    /*mp.events.add('entityDataChange', (entity, key) => {
          if (entity.type == "vehicle") {
                var engine = entity.getVariable('engine');
                switch (key) {
                      case "engine":
                      	entity.setUndriveable(!engine);
                      	entity.setEngineOn(engine, true, true);
                      	break;
                      case "leftSignal":
                      	var leftSignal = entity.getVariable('leftSignal');
                      	entity.setIndicatorLights(1, leftSignal);
                      	break;
                      case "rightSignal":
                      	var rightSignal = entity.getVariable('rightSignal');
                      	entity.setIndicatorLights(0, rightSignal);
                      	break;
                      case "engineBroken":
                      	if (entity.getPedInSeat(-1) != player.handle) return;
                      	menu.execute(`EngineBrokenHandler(${engineBroken})`);
                      	break;
                      case "oilBroken":
                      	if (entity.getPedInSeat(-1) != player.handle) return;
                      	menu.execute(`OilBrokenHandler(${oilBroken})`);
                      	break;
                      case "accumulatorBroken":
                      	if (entity.getPedInSeat(-1) != player.handle) return;
                      	menu.execute(`AccumulatorBrokenHandler(${accumulatorBroken})`);
                      	break;
                      case "sirenSound":
                            var sirenSound = entity.getVariable("sirenSound");
                            entity.setSirenSound(sirenSound);
                            break;
                }
          }
    });*/

    mp.events.add('entityStreamIn', (entity) => {
        if (entity.type == 'vehicle') {
            var engine = entity.getVariable("engine") || false;
            var leftSignal = entity.getVariable("leftSignal") || false;
            var rightSignal = entity.getVariable("rightSignal") || false;
            var sirenSound = entity.getVariable("sirenSound") || false;
            var hood = entity.getVariable("hood") || false;
            var boot = entity.getVariable("boot") || false;

            entity.setUndriveable(!engine);
            entity.setEngineOn(engine, true, true);

            entity.setIndicatorLights(1, leftSignal);
            entity.setIndicatorLights(0, rightSignal);

            entity.setSirenSound(sirenSound);

            if (hood) entity.setDoorOpen(4, false, false);
            else entity.setDoorShut(4, false);

            if (boot) entity.setDoorOpen(5, false, false);
            else entity.setDoorShut(5, false);
        }
    });

    var data = {
        lastLocked: false,
        lastLights: 0
    };

    mp.events.add("render", () => {
        if (player.vehicle && player.vehicle.getPedInSeat(-1) == player.handle) {
            var veh = player.vehicle;
            var engine = veh.getVariable("engine");
            if (!vehPropActive) {
                //menu.execute(`$('#vehProp').fadeIn(0)`);
                vehPropActive = true;

                var left = veh.getVariable("leftSignal");
                var right = veh.getVariable("rightSignal");
                if (engine) {
                    if (!left || !right) {
                        
                        menu.execute(`mp.events.call('carSystem', { engine: ${true}, event: 'engineStatus' })`);
                        menu.execute(`mp.events.call('carSystem', { accumulator: ${true}, event: 'accumulatorStatus' })`);
                        menu.execute(`mp.events.call('carSystem', { oil: ${true}, event: 'OilBrokenHandler' })`);

                        menu.execute(`mp.events.call('carSystem', { left: ${left}, event: 'LeftSignalHandler' })`);
                        menu.execute(`mp.events.call('carSystem', { right: ${right}, event: 'RightSignalHandler' })`);
                        menu.execute(`mp.events.call('carSystem', { emergency: ${false}, event: 'EmergencyHandler' })`);
                    } else {
                        menu.execute(`mp.events.call('carSystem', { emergency: ${true}, event: 'EmergencyHandler' })`);
                    }
                } else {
                    menu.execute(`mp.events.call('carSystem', { engine: ${false}, event: 'engineStatus' })`);
                    menu.execute(`mp.events.call('carSystem', { accumulator: ${false}, event: 'accumulatorStatus' })`);
                    menu.execute(`mp.events.call('carSystem', { oil: ${false}, event: 'OilBrokenHandler' })`);

                    menu.execute(`mp.events.call('carSystem', { left: ${false}, event: 'LeftSignalHandler' })`);
                    menu.execute(`mp.events.call('carSystem', { right: ${false}, event: 'RightSignalHandler' })`);
                    menu.execute(`mp.events.call('carSystem', { emergency: ${false}, event: 'EmergencyHandler' })`);
                }
                menu.execute(`mp.events.call('carSystem', { enable: ${true}, event: 'vehEnable' })`);
            }

            var lights = player.vehicle.getLightsState(1, 1);
            var locked = player.vehicle.getDoorLockStatus();

            let velocity = veh.getVelocity();
            velocity = Math.sqrt(velocity.x * velocity.x + velocity.y * velocity.y) * 3;
            if (!velocity) velocity = 0;
            let fuel = veh.fuel;
            if (!fuel) fuel = 0;
            else if (fuel <= 0 && engine) {
                mp.events.callRemote(`vehicleEngineOn`);
            }

            locked = (locked == 1) ? true : false;
            if (data.lastLocked != locked) {
                menu.execute(`mp.events.call('carSystem', { locked: ${locked}, event: 'LockedHandler' })`);
                data.lastLocked = locked;
            }

            if (engine) {
                if (veh.engineBroken || veh.oilBroken || veh.accumulatorBroken) mp.events.callRemote(`vehicle.engine.on`);

                var lightsType = 0;
                var a = lights.lightsOn;
                var b = lights.highbeamsOn;
                if (a == 0 && b == 1) lightsType = 1;
                if (a == 1 && b == 0) lightsType = 2;
                if (a == 1 && b == 1) lightsType = 3;
                if (data.lastLights != lightsType) {
                    menu.execute(`mp.events.call('carSystem', { lights: ${lightsType}, event: 'LightsHandler' })`);
                    data.lastLights = lightsType;
                }
            } else if (data.lastLights != 0) {
                menu.execute(`mp.events.call('carSystem', { lights: ${0}, event: 'LightsHandler' })`);
                data.lastLights = 0;
            }

            menu.execute(`mp.events.call('carSystem', { oil: ${veh.oilBroken}, event: 'OilBrokenHandler' })`);
            menu.execute(`mp.events.call('carSystem', { accumulator: ${veh.accumulatorBroken}, event: 'accumulatorStatus' })`);
            
            if (!player.vehicle.getIsEngineRunning()) {
                var test = { velocity: velocity, fuel: 0, rpm: 0, gear: veh.gear };
                menu.execute(`mp.events.call('carSystem', { data: ${JSON.stringify(test)}, event: 'VehPropHandler' })`);
            } else {
                var test = { velocity: velocity, fuel: fuel, rpm: veh.rpm, gear: veh.gear };
                menu.execute(`mp.events.call('carSystem', { data: ${JSON.stringify(test)}, event: 'VehPropHandler' })`);
            }


            /*mp.game.graphics.drawText(`Rpm: ~w~${player.vehicle.rpm}`, [0.8, 0.56], {
                        font: 1,
                        color: [12,144,12,230],
                        scale: [0.6,0.6],
                        outline: true
                  });
                  mp.game.graphics.drawText(`Mileage: ~w~${player.vehicle.mileage}`, [0.8, 0.66], {
                        font: 1,
                        color: [12,144,12,230],
                        scale: [0.6,0.6],
                        outline: true
                  });
                  mp.game.graphics.drawText(`HashDist: ~w~${hashDist}`, [0.8, 0.76], {
      			font: 1,
      			color: [12,144,12,230],
      			scale: [0.6,0.6],
      			outline: true
      		});*/
        } else if (vehPropActive) {
            //menu.execute(`HideVehProp()`);
            menu.execute(`mp.events.call('carSystem', { left: ${false}, event: 'LeftSignalHandler' })`);
            menu.execute(`mp.events.call('carSystem', { right: ${false}, event: 'RightSignalHandler' })`);
            menu.execute(`mp.events.call('carSystem', { emergency: ${false}, event: 'EmergencyHandler' })`);
            menu.execute(`mp.events.call('carSystem', { locked: ${true}, event: 'LockedHandler' })`);
            menu.execute(`mp.events.call('carSystem', { belt: ${true}, event: 'BeltHandler' })`);
            menu.execute(`mp.events.call('carSystem', { oil: ${false}, event: 'OilBrokenHandler' })`);
            menu.execute(`mp.events.call('carSystem', { accumulator: ${false}, event: 'accumulatorStatus' })`);
            menu.execute(`mp.events.call('carSystem', { engine: ${false}, event: 'engineStatus' })`);
            menu.execute(`mp.events.call('carSystem', { mileage: ${0}, event: 'MileageHandler' })`);
            menu.execute(`mp.events.call('carSystem', { enable: ${false}, event: 'vehEnable' })`);
            menu.execute(`mp.events.call('carSystem', { belt: ${true}, event: 'BeltHandler' })`);
            menu.execute(`mp.events.call('carSystem', { lights: ${0}, event: 'LightsHandler' })`);
            player.belt = false;
            vehPropActive = false;
            data.lastLocked = true;
            data.lastLights = 0;
        }

        //синхронизация двигателя
        if (player.vehicle && mp.vehicles.exists(player.vehicle)) {
            var engine = player.vehicle.getVariable('engine');

            player.vehicle.setUndriveable(!engine);
            player.vehicle.setEngineOn(engine, true, true);
        }
    });
}
