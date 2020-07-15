module.exports = {
    Init: () => {
        loadVehiclesFromDB();
    }
}

function loadVehiclesFromDB() {
    DB.Handle.query("SELECT * FROM vehicles WHERE owner < ?", [1000], (e, result) => {
        for (var i = 0; i < result.length; i++) {
            var v = result[i];
            if (!v.x && !v.y) continue;
            var pos = new mp.Vector3(v.x, v.y, v.z);
            pos.h = v.h;
            var vehicle = mp.vehicles.new(mp.joaat(v.model), pos, {
                locked: false,
                engine: false,
                heading: pos.h,
            });
            vehicle.spawnPos = pos;
            vehicle.name = v.model.toLowerCase();
            vehicle.sqlId = v.id;
            vehicle.setColor(v["color1"], v["color2"]);
            //vehicle.rotation = new mp.Vector3(0, 0, pos.h);
            vehicle.vehPropData.engineBroken = v.engineBroken;
            vehicle.vehPropData.oilBroken = v.oilBroken;
            vehicle.vehPropData.accumulatorBroken = v.accumulatorBroken;
            vehicle.vehPropData.fuel = v.fuel;
            vehicle.vehPropData.maxFuel = v.maxFuel;
            vehicle.vehPropData.consumption = v.consumption;
            vehicle.vehPropData.mileage = v.mileage;
            vehicle.bodyHealth = v.health;
            vehicle.license = v.license;
            vehicle.owner = v.owner;
            vehicle.dbData = JSON.parse(v.data);

            initVehicleInventory(vehicle);
            initAddictiveVehicleParams(vehicle);
            initJobVehicleFuel(vehicle);

            /*vehicle.setVariable("name", vehicle.name);
            vehicle.setVariable("sqlId", vehicle.sqlId);
            vehicle.setVariable("engineBroken", result[i].engineBroken);
            vehicle.setVariable("oilBroken", result[i].oilBroken);
            vehicle.setVariable("accumulatorBroken", result[i].accumulatorBroken);*/
            //if (vehicle.faction != -2000) vehicle.fuel = vehicle.maxFuel;

            //InitVehicleInventory(vehicle);

            /*if (vehicle.faction == -2) {//работа автобусника
            	if (vehicle.name == "coach") vehicle.routeType = 1;
            	else if (vehicle.name == "airbus") vehicle.routeType = 3;
            	else if (vehicle.name == "bus") vehicle.routeType = 2;
            } else if (vehicle.faction == -5) {//дальнобой
            	if (vehicle.name == "phantom") {
            		vehicle.minTruckerLevel = 1;
            		vehicle.maxLoad = 15;
            	}
            	else if (vehicle.name == "packer") {
            		vehicle.minTruckerLevel = 15;
            		vehicle.maxLoad = 30;
            	}
            	else if (vehicle.name == "hauler") {
            		vehicle.minTruckerLevel = 25;
            		vehicle.maxLoad = 60;
            	}
            }*/
        }
        console.log(`Auto loaded: ${i} units.`);
    });
}

function initAddictiveVehicleParams(vehicle) {
    if (mp.isFarmVehicle(vehicle)) {
        vehicle.products = {
            type: 0,
            count: 0,
            maxCount: 600,
        };
    }
}

function initJobVehicleFuel(vehicle) {
    if (mp.isJobVehicle(vehicle) && vehicle.vehPropData.fuel < mp.economy["jobveh_count_fuel"].value) {
        vehicle.utils.setFuel(mp.economy["jobveh_count_fuel"].value);
    }
}
