module.exports = {
    Init: () => {
        mp.autosaloons = {
            saloons: [],
            vehicles: [],
            colorsCFG: []
        };

        DB.Handle.query("SELECT * FROM autosaloons", (e, result) => {
            for (var i = 0; i < result.length; i++) {
                var h = result[i];
                mp.autosaloons.saloons.push({
                    sqlId: h.id,
                    newCarCoord: JSON.parse(h.newCarCoord)
                });
            }
            console.log(`Auto shows loaded: ${i} units.`);
        });

        DB.Handle.query("SELECT * FROM configvehicle ORDER BY price ASC", (e, result) => {
            for (var i = 0; i < result.length; i++) {
                var h = result[i];
                mp.autosaloons.vehicles.push({
                    sqlId: h.id,
                    model: h.model,
                    modelHash: h.modelHash,
                    brend: h.brend,
                    title: h.title,
                    fuelTank: h.fuelTank,
                    fuelRate: h.fuelRate,
                    price: h.price,
                    max: h.max,
                    buyed: h.buyed
                });
            }
            console.log(`Car dealership cars loaded: ${i} units.`);
        });

        DB.Handle.query("SELECT * FROM configvehiclecolors", (e, result) => {
            for (var i = 0; i < result.length; i++) {
                var h = result[i];
                mp.autosaloons.colorsCFG.push({
                    sqlId: h.id,
                    gameColor: h.color
                });
            }
            console.log(`The colors of the car dealership are loaded: ${i} units.`);
        });
    }
}
