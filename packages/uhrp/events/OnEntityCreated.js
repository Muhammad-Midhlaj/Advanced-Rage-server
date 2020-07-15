module.exports = {
    "entityCreated": (entity) => {
        if (entity.type == "vehicle") {
            entity.setVariable("engine", false);
            entity.setVariable("leftSignal", false);
            entity.setVariable("rightSignal", false);
            entity.setVariable("hood", false);
            entity.setVariable("boot", false);

            entity.vehPropData = {
                engineBroken: false,
                oilBroken: false,
                accumulatorBroken: false,
                fuel: 5,
                maxFuel: 70,
                consumption: 1,
                mileage: 0,
                radio: 0,
            };

            entity.utils = {
                addMileage: (add) => {
                    add = parseFloat(add);
                    if (add < 0.1) return;
                    entity.vehPropData.mileage += add;
                    if (entity.sqlId)
                        DB.Handle.query(`UPDATE vehicles SET mileage=? WHERE id=?`, [entity.vehPropData.mileage, entity.sqlId]);
                },
                setEngineBroken: (enable) => {
                    entity.vehPropData.engineBroken = enable;
                    if (enable) {
                        if (entity.player) {
                            entity.player.utils.warning(`Engine broken!`);
                            entity.player.call("prompt.showByName", ["vehicle_repair"]);

                        }
                        if (entity.getVariable("engine")) entity.utils.engineOn();
                    }
                    if (entity.player) entity.player.call("setVehicleVar", [entity, "engineBroken", enable]);
                    if (entity.sqlId) {
                        enable = (enable) ? 1 : 0;
                        DB.Handle.query(`UPDATE vehicles SET engineBroken=? WHERE id=?`, [enable, entity.sqlId]);
                    }
                },
                setOilBroken: (enable) => {
                    entity.vehPropData.oilBroken = enable;
                    if (enable) {
                        if (entity.player) {
                            entity.player.utils.warning(`Motor oil has lost its properties!`);
                            entity.player.call("prompt.showByName", ["vehicle_repair"]);
                        }
                        if (entity.getVariable("engine")) entity.utils.engineOn();
                    }
                    if (entity.player) entity.player.call("setVehicleVar", [entity, "oilBroken", enable]);
                    if (entity.sqlId) {
                        enable = (enable) ? 1 : 0;
                        DB.Handle.query(`UPDATE vehicles SET oilBroken=? WHERE id=?`, [enable, entity.sqlId]);
                    }
                },
                setAccumulatorBroken: (enable) => {
                    entity.vehPropData.accumulatorBroken = enable;
                    if (enable) {
                        if (entity.player) {
                            entity.player.utils.warning(`Battery broken!`);
                            entity.player.call("prompt.showByName", ["vehicle_repair"]);
                        }
                        if (entity.getVariable("engine")) entity.utils.engineOn();
                    }
                    if (entity.player) entity.player.call("setVehicleVar", [entity, "accumulatorBroken", enable]);
                    if (entity.sqlId) {
                        enable = (enable) ? 1 : 0;
                        DB.Handle.query(`UPDATE vehicles SET accumulatorBroken=? WHERE id=?`, [enable, entity.sqlId]);
                    }
                },
                setFuel: (fuel) => {
                    //debug(`setFuel: ${fuel}`)
                    fuel = parseFloat(fuel);
                    fuel = Math.clamp(fuel, 0, entity.vehPropData.maxFuel);
                    entity.vehPropData.fuel = fuel;
                    if (entity.sqlId)
                        DB.Handle.query(`UPDATE vehicles SET fuel=? WHERE id=?`, [fuel, entity.sqlId]);

                    if (entity.player) {
                        entity.player.call("setVehicleVar", [entity, "fuel", fuel]);
                    }

                    if (fuel <= 0) {
                        if (entity.player) {
                            entity.player.utils.warning(`Fill the car!`);
                        }
                        entity.setVariable("engine", false);
                    }
                },
                engineOn: () => {
                    if (entity.faction == -2000) {
                        /*var keyItems = player.inv.getArrayByItemId(7);
                        var isFind = false;
                        keyItems.forEach((keys) => {
                        	if (keys.params.car == entity.sqlId) isFind = true;
                        });
                        if (!isFind) return player.utils.error(`Нет ключей от авто!`);*/
                    }

                    var vehBroken = (entity.vehPropData.engineBroken || entity.vehPropData.oilBroken || entity.vehPropData.accumulatorBroken);


                    var engine = entity.getVariable("engine");
                    if (vehBroken) engine = true;
                    entity.setVariable("engine", !engine);

                    if (entity.fuelTimerId) clearInterval(entity.fuelTimerId);
                    if (engine) {
                        delete entity.fuelTimerId;
                    } else {
                        var consumption = entity.consumption;
                        if (!consumption) consumption = 1;

                        var vehId = entity.id;
                        var timerId;
                        entity.fuelTimerId = timerId = setInterval(() => {
                            try {
                                var veh = mp.vehicles.at(vehId);
                                if (!veh) return clearInterval(timerId);

                                var engine = veh.getVariable("engine");
                                if (!engine) return clearInterval(timerId);

                                // var possibilities = [500, 400, 300]; //engine,oil,accumulator
                                //possibilities = [1,1,1]; //for test
                                var possibilities = [Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE]; // TODO: Реализвать систему поломки авто.
                                var engineBroken = mp.randomInteger(0, possibilities[0]);
                                var oilBroken = mp.randomInteger(0, possibilities[1]);
                                var accumulatorBroken = mp.randomInteger(0, possibilities[2]);
                                if (engineBroken == 0) veh.utils.setEngineBroken(true);
                                if (oilBroken == 0) veh.utils.setOilBroken(true);
                                if (accumulatorBroken == 0) veh.utils.setAccumulatorBroken(true);

                                veh.utils.setFuel(veh.vehPropData.fuel - 1);
                                if (veh.vehPropData.fuel <= 0) clearInterval(timerId);
                            } catch (err) {
                                terminal.error(err);
                            }
                        }, 60000 / consumption);
                    }
                },
                setRadio: (radio) => {
                    entity.vehPropData.radio = radio;
                    entity.getOccupants().forEach((rec) => {
                        rec.call("setVehicleVar", [entity, "radio", radio]);
                    });
                },
                setSpawnPos: (pos) => {
                    entity.spawnPos = pos;
                    if (entity.sqlId) DB.Handle.query(`UPDATE vehicles SET x=?,y=?,z=?,h=? WHERE id=?`,
                        [pos.x, pos.y, pos.z, pos.h, entity.sqlId]);
                },
                setLicense: (license) => {
                    var types = [1, 2, 3, 4, 11, 12];
                    if (license && types.indexOf(license) == -1) return;
                    entity.license = parseInt(license);
                    if (entity.sqlId) DB.Handle.query(`UPDATE vehicles SET license=? WHERE id=?`,
                        [entity.license, entity.sqlId]);
                },
                setOwner: (owner) => {
                    entity.owner = owner;
                    DB.Handle.query("UPDATE vehicles SET owner=? WHERE id=?", [owner, entity.sqlId]);
                },
                setSpawnTimer: (ms) => {
                    var vehicleId = entity.id;
                    if (entity.spawnTimerId) clearTimeout(entity.spawnTimerId);
                    entity.spawnTimerId = timerId = setTimeout(function() {
                        try {
                            let vehicle = mp.vehicles.at(vehicleId);
                            if (!vehicle) {
                                clearTimeout(timerId);
                                return 0;
                            }
                            var havePlayers = vehicle.getOccupants().length > 0;
                            if (!havePlayers) {
                                if (!vehicle.sqlId) return vehicle.destroy();
                                if (mp.isOwnerVehicle(vehicle)) {
                                    clearTimeout(timerId);
                                    delete vehicle.spawnTimerId;
                                    return 0;
                                }

                                if (vehicle.spawnPos) {
                                    let pos = vehicle.spawnPos;
                                    var dist = (vehicle.position["x"] - pos["x"]) * (vehicle.position["x"] - pos["x"]) + (vehicle.position["y"] - pos["y"]) * (vehicle.position["y"] - pos["y"]) +
                                        (vehicle.position["z"] - pos["z"]) * (vehicle.position["z"] - pos["z"]);

                                    if (dist < 10) return;
                                    vehicle.repair();
                                    vehicle.position = pos;
                                    vehicle.rotation = new mp.Vector3(0, 0, pos.h);
                                    vehicle.engine = false;
                                    if (vehicle.vehPropData.fuel < 10) vehicle.vehPropData.fuel = 10;
                                }
                            }
                        } catch (err) {
                            console.log(err);
                        }
                    }, ms);
                },
                spawn: () => {
                    //todo не спавнить тачки, в которые загружают продукты
                    var players = entity.getOccupants();
                    if (players.length == 0) {
                        if (entity.spawnPos) {
                            let pos = entity.spawnPos;
                            var dist = (entity.position["x"] - pos["x"]) * (entity.position["x"] - pos["x"]) + (entity.position["y"] - pos["y"]) * (entity.position["y"] - pos["y"]) +
                                (entity.position["z"] - pos["z"]) * (entity.position["z"] - pos["z"]);

                            if (dist >= 10) {
                                entity.repair();
                                entity.utils.setFuel(30);
                                entity.maxFuel = 70;
                                entity.position = pos;
                                entity.rotation = new mp.Vector3(0, 0, pos.h);
                                entity.setVariable("leftSignal", false);
                                entity.setVariable("rightSignal", false);
                                if (entity.getVariable("engine"))
                                    entity.utils.engineOn();
                                return 0; // spawned
                            }
                        } else {
                            entity.destroy();
                            return 2; // destroyed
                        }
                    }
                    return 1; // not spawned
                },
            };

        }
    }
}
