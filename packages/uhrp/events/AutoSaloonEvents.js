function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

var spawn = 0;

module.exports = {
    'autoSaloon.openBuyerMenu': (player) => {
        if (!player.colshape || !player.colshape.biz) return player.utils.error(`You're not at the car dealership!`);
        var biz = player.colshape.biz;
        if (biz.bizType != 9) return player.utils.error(`Wrong type of business!`);
        //if (!biz.status) return player.utils.error(`Бизнес закрыт!`);
		if (player.vehicle) return;
        
        const dim = player.sqlId + 10;

        player.cancelPos = player.position;
        player.dimension = dim;
        player.autoSaloon = true;

        var data = { bizId: biz.sqlId, vehicles: mp.autosaloons.vehicles, colorsCFG: mp.autosaloons.colorsCFG, dim: dim };

		player.call("autoSaloon.openBuyerMenu", [data]);
    },
    
    'autoSaloon.buyNewCar': (player, str) => {
        const d = JSON.parse(str);
        //var biz = mp.bizes.getBySqlId(d.bizId);
        
        if(player.money < d.price) {
            mp.events.call("autoSaloon.cancel", player);
            return player.utils.error(`Need ${d.price}$`);
        }

        var houses = mp.houses.getArrayByOwner(player.sqlId);

        if(d.price >= 30000 && houses.length == 0) {
            mp.events.call("autoSaloon.cancel", player);
            return player.utils.error(`To buy a transport worth more than $30,000, you need to buy a home`);
        }

        
        if(player.cars.length >= player.donateCars) {
            mp.events.call("autoSaloon.cancel", player);
            return player.utils.error(`You have the maximum number of cars`);
        }

        //if (biz.products < 10) {
            //mp.events.call("autoSaloon.cancel");
            //return player.utils.error(`У бизнеса недостаточно товара!`);
        //}

        var pos;

        for (var i = 0; i < mp.autosaloons.saloons.length; i++) {
            var a = mp.autosaloons.saloons[i];
            if(a.sqlId == d.bizId) {
                pos = a.newCarCoord[spawn];
                
                spawn += 1;

                if(a.newCarCoord.length - 1 == spawn) {
                    spawn = 0;
                }

                mp.autosaloons.vehicles[d.id - 1].buyed += 1;
                DB.Handle.query("UPDATE configvehicle SET buyed = buyed + 1 WHERE model = ?", [d.model]);
            }
        }

        var freeSlot = player.inventory.findFreeSlot(54);
        if (!freeSlot)  {
            mp.events.call("autoSaloon.cancel", player);
            return player.utils.error(`Make room for the keys!`);
        }

        var newVehicle = mp.vehicles.new(mp.joaat(d.model), new mp.Vector3(pos.x, pos.y, pos.z), {
            engine: false,
            heading: pos.rot,
            dimension: pos.dim,
            locked: true
        });

        DB.Handle.query("INSERT INTO vehicles (owner,model,color1,color2,x,y,z,h) VALUES (?,?,?,?,?,?,?,?)",
            [player.sqlId + 2000, d.model, d.color.sqlId, 0,
            newVehicle.position.x, newVehicle.position.y, newVehicle.position.z,
            newVehicle.rotation.z
        ], (e, result) => {
            if(e) console.log(e);
            newVehicle.setColor(d.color.sqlId, 0);
            newVehicle.sqlId = result.insertId;
            newVehicle.utils.setFuel(30);
            newVehicle.maxFuel = 70;
            newVehicle.owner = player.sqlId + 2000;
            newVehicle.name = d.model.toLowerCase();
            newVehicle.spawnPos = newVehicle.position;

            var params = {
                owner: player.sqlId,
                car: result.insertId,
                model: d.model
            };

            player.inventory.add(54, params, null, (e) => {
                if (e) {
                    mp.events.call("autoSaloon.cancel", player);
                    newVehicle.destroy();
                    return player.utils.error(e);
                }
                player.carIds.push(newVehicle.id);
                player.cars.push({ name: d.model });
                mp.logs.addLog(`${player.name} bought a car ${d.model} for ${d.price} from Auto Show`, 'main', player.account.id, player.sqlId, { model: d.model, price: d.price });
                player.utils.success(`You have successfully purchased "${d.model}" за ${d.price}$`);
                player.utils.setMoney(player.money - d.price);
                player.call(`playerMenu.cars`, [player.cars]);
                //biz.setProducts(biz.products - 10);
                //biz.setBalance(biz.balance + price / 1000);
            });

            initVehicleInventory(newVehicle);
        });
    },

    'autoSaloon.startTestDrive': (player, str) => {
        const d = JSON.parse(str);

        if (!d.color) d.color.sqlId = 0;

        const dim = player.sqlId + 33;

        if(player.testDrive > Math.floor(Date.now() / 1000)) {
            mp.events.call("autoSaloon.cancel", player);
            return player.utils.error(`Wait a while to test the machine again!`);
        }

        let car;

        for (var i = 0; i < mp.autosaloons.saloons.length; i++) {
            var a = mp.autosaloons.saloons[i];
            if(a.sqlId == d.bizId) {
                car = a.newCarCoord[getRandom(0, a.newCarCoord.length)];
            }
        }

        var vehicle = mp.vehicles.new(mp.joaat(d.model), new mp.Vector3(car.x, car.y, car.z), {
            locked: true,
            engine: false,
            heading: car.rot
        });

        vehicle.name = d.model;
        vehicle.owner = 0;
        vehicle.setColor(d.color.sqlId, 0);
        vehicle.utils.setFuel(30);
        vehicle.maxFuel = 70;
        vehicle.license = 0;
        vehicle.dimension = dim;

        player.dimension = dim;
        player.position = new mp.Vector3(car.x, car.y, car.z);
        player.isGodmode = !player.isGodmode;
        player.utils.setLocalVar("godmode", player.isGodmode);
        player.testDriveVeh = vehicle;
        player.putIntoVehicle(vehicle, -1);
        player.testDrive = Math.floor(Date.now() / 1000) + 3600;
        
        player.call(`autoSaloon.deleteVehicle`);
        player.call(`autoSaloon.testDriveStart`);

        DB.Handle.query("UPDATE characters SET testDrive = ? WHERE id = ?", [Math.floor(Date.now() / 1000) + 3600, player.sqlId]);
    },

    'autoSaloon.endTestDrive': (player) => {
        player.dimension = 0;
        player.position = new mp.Vector3(38.23, -1121.47, 26.29);
        player.isGodmode = !player.isGodmode;
        player.utils.setLocalVar("godmode", player.isGodmode);
        if(player.testDriveVeh) player.testDriveVeh.destroy();
    },

    "autoSaloon.exit": (player) => {
        player.autoSaloon = false;
		player.position = player.cancelPos;
        player.dimension = 0;
    },
    
    "autoSaloon.cancel": (player) => {
        player.dimension = 0;
        player.autoSaloon = false;
        player.position = player.cancelPos;
        player.call('autoSaloon.deleteVehicle');
        player.call("autoSaloon.setStatusMenu", false);
    }
};
