module.exports.Init = function() {
    DB.Handle.query("SELECT * FROM houses WHERE closed != ?", [-1], function(e, result) {
        mp.houses = [];
        initHousesUtils();
        for (var i = 0; i < result.length; i++) {
            var marker = mp.createHouseMarker(result[i]);
            result[i].sqlId = result[i].id;
            delete result[i].id;
            if (marker.garage) marker.garageMarker = mp.createHouseGarageMarker(result[i]);
            mp.houses.push(marker);
        }
        console.log(`Homes loaded: ${i} units.`);
    });

    function initHouseUtils(house) {
        house.setInterior = (newInterior) => {
            if (newInterior < 1) newInterior = 1;
            house.interior = newInterior;
            DB.Handle.query("UPDATE houses SET interior=? WHERE id=?",
                [house.interior, house.sqlId]);
        };
        house.setPrice = (price) => {
            house.price = Math.clamp(price, 1000, Number.MAX_VALUE);
            DB.Handle.query("UPDATE houses SET price=? WHERE id=?",
                [house.price, house.sqlId]);
        };
        house.setClass = (newClass) => {
            if (newClass < 1) newClass = 1;
            house.class = newClass;
            DB.Handle.query("UPDATE houses SET class=? WHERE id=?",
                [house.class, house.sqlId]);
        };
        house.setClosed = (closed) => {
            house.closed = Math.clamp(closed, 0, 1);
            DB.Handle.query("UPDATE houses SET closed=? WHERE id=?",
                [house.closed, house.sqlId]);
        };
        house.setOwner = (ownerSqlId, ownerName) => {
            if (ownerSqlId < 1) {
                ownerSqlId = 0;
                ownerName = "";

                house.setColor(0, 187, 255, 70);
                house.blip.color = 2;
                mp.fullDeleteItemsByParams(59, ["house"], [house.sqlId]);
            } else {
                house.setColor(255, 0, 0, 70);
                house.blip.color = 49;
            }
            house.owner = ownerSqlId;
            house.ownerName = ownerName;
            DB.Handle.query("UPDATE houses SET owner=?,ownerName=? WHERE id=?",
                [house.owner, house.ownerName, house.sqlId]);
            house.setClosed(0);
            // house.setBalance(house.getTax() * 24);
            house.setBalance(0);
        };
        house.setGarage = (newGarage) => {
            //console.log(`house.setGarage: ${newGarage}`)
            newGarage = Math.clamp(newGarage, 0, 3);
            house.garage = newGarage;
            DB.Handle.query("UPDATE houses SET garage=? WHERE id=?",
                [house.garage, house.sqlId]);

            if (newGarage === 0) {
                if (house.garageMarker) {
                    mp.players.forEachInRange(house.garageMarker.position, 2, (rec) => {
                        if (house.garageMarker.colshape.isPointWithin(rec.position)) rec.call("selectMenu.hide");
                    });

                    house.garageMarker.showColshape.destroy();
                    house.garageMarker.colshape.destroy();
                    house.garageMarker.destroy();
                    delete house.garageMarker;
                }
                mp.players.forEachInDimension(house.sqlId, (rec) => {
                    var interior = mp.interiors.getBySqlId(house.interior);
                    if (interior.garageMarker) {
                        interior.garageMarker.hideFor(rec);
                        if (interior.garageMarker.colshape.isPointWithin(rec.position)) rec.call("selectMenu.hide");
                    }
                });
            } else {
                if (!house.garageMarker) house.garageMarker = mp.createHouseGarageMarker(house);

                mp.players.forEachInDimension(house.sqlId, (rec) => {
                    var interior = mp.interiors.getBySqlId(house.interior);
                    if (interior.garageMarker) interior.garageMarker.showFor(rec);
                });
            }
        };
        house.setVehSpawn = (newSpawn) => {
            house.vehX = newSpawn.x;
            house.vehY = newSpawn.y;
            house.vehZ = newSpawn.z;
            house.vehH = newSpawn.h;
            DB.Handle.query("UPDATE houses SET vehX=?,vehY=?,vehZ=?,vehH=? WHERE id=?",
                [house.vehX, house.vehY, house.vehZ, house.vehH, house.sqlId]);
        };
        house.setGarageEnter = (pos) => {
            house.garageX = pos.x;
            house.garageY = pos.y;
            house.garageZ = pos.z;
            house.garageH = pos.h;
            DB.Handle.query("UPDATE houses SET garageX=?,garageY=?,garageZ=?,garageH=? WHERE id=?",
                [house.garageX, house.garageY, house.garageZ, house.garageH, house.sqlId]);

            if (house.garageMarker) {
                mp.players.forEachInRange(house.garageMarker.position, 2, (rec) => {
                    if (house.garageMarker.colshape.isPointWithin(rec.position)) rec.call("selectMenu.hide");
                });

                house.garageMarker.showColshape.destroy();
                house.garageMarker.colshape.destroy();
                house.garageMarker.destroy();
                delete house.garageMarker;
            }
            house.garageMarker = mp.createHouseGarageMarker(house);
        };
        house.changeCoord = (pos) => {
            house.x = pos.x;
            house.y = pos.y;
            house.z = pos.z;
            house.h = pos.h;
            DB.Handle.query("UPDATE houses SET x=?,y=?,z=?,h=? WHERE id=?",
                [house.x, house.y, house.z, house.h, house.sqlId]);

            house.colshape.destroy();
            house.showColshape.destroy();

            house.colshape = mp.createHouseMarker(house);
        };
        house.setBalance = (balance) => {
            if (balance < 0) balance = 0;
            house.balance = balance;
            DB.Handle.query("UPDATE houses SET balance=? WHERE id=?", [balance, house.sqlId]);
        };
        house.sellToPlayer = (buyer) => {
            if (!buyer) return;
            house.owner = buyer.sqlId;
            house.ownerName = buyer.name;
            house.blip.color = 49;
            house.balance = 1000;
            house.closed = 0;
            house.garageClosed = 0;

            DB.Handle.query("UPDATE houses SET owner=?,ownerName=?,balance=?,closed=0,garageClosed=? WHERE id=?",
                [house.owner, house.ownerName, house.balance, 0, 0, house.sqlId]);

            player.utils.removeHouse(house);
            buyer.utils.addHouse(house);
            //buyer.markerEnterHouseId = house.id;
        };
        house.getTax = () => {
            return parseInt(house.price / 100) * mp.economy["house_tax"].value;
        };
    }

    function initHousesUtils() {
        mp.houses.getBySqlId = (sqlId) => {
            if (!sqlId) return null;
            var result;
            mp.houses.forEach((house) => {
                if (house.sqlId == sqlId) {
                    result = house;
                    return;
                }
            });
            return result;
        };
        mp.houses.getArrayByOwner = (owner) => {
            if (!owner) return [];
            var array = [];
            mp.houses.forEach((house) => {
                if (house.owner == owner) {
                    array.push(house);
                }
            });
            return array;
        };
        mp.houses.getHouseArrayByOwner = (owner) => {
            if (!owner) return [];
            var array = [];
            mp.houses.forEach((house) => {
                if (house.owner == owner) {
                    array.push({
                        sqlId: house.sqlId,
                        balance: house.balance,
                        owner: house.owner,
                        ownerName: house.ownerName,
                        price: house.price,
                        closed: house.closed,
                        garageClosed: house.garageClosed,
                        interior: house.interior,
                        garage: house.garage,
                        class: house.class,
                        x: house.h,
                        y: house.y,
                        z: house.z,
                        h: house.h,
                        garageX: house.garageX,
                        garageY: house.garageY,
                        garageZ: house.garageZ,
                        garageH: house.garageH
                    });
                }
            });
            return array;
        };
        mp.houses.delete = (house, callback) => {
            var i = mp.houses.indexOf(house);
            if (i == -1) return callback("No house found!");
            mp.houses.splice(i, 1);
            house.blip.destroy();
            house.colshape.destroy();
            house.showColshape.destroy();
            house.destroy();
            if (house.garageMarker) {
                mp.players.forEachInRange(house.garageMarker.position, 2, (rec) => {
                    if (house.garageMarker.colshape.isPointWithin(rec.position)) rec.call("selectMenu.hide");
                });

                house.garageMarker.showColshape.destroy();
                house.garageMarker.colshape.destroy();
                house.garageMarker.destroy();
                delete house.garageMarker;
            }
            //DB.Handle.query("DELETE FROM houses WHERE id=?", house.sqlId);
            DB.Handle.query("UPDATE houses SET closed=? WHERE id=?", [-1, house.sqlId]);
            if (house.owner) {
                DB.Handle.query("UPDATE characters SET house=? WHERE id=?", [0, house.owner]);
                var owner = mp.players.getBySqlId(house.owner);
                if (owner) owner.house = 0;

                //todo удаление предметов
                //mp.fullDeleteHouseKeys(house.sqlId);
            }
            callback();
            delete house;
        };
    }

    mp.createHouseMarker = (data) => {
        var pos = new mp.Vector3(data["x"], data["y"], data["z"] - 1);
        pos.z += mp.economy["markers_deltaz"].value;

        var alpha = mp.economy["markers_alpha"].value;
        var color = [0, 255, 0, alpha];
        if (data["owner"] != 0)
            color = [255, 0, 0, alpha];

        //var marker = mp.markers.new(0, pos, new mp.Vector3(0,0,0), new mp.Vector3(0,0,0), 1, r, g, b, 255, false);
        //var marker = mp.markers.new(0, pos, 1);
        var marker = mp.markers.new(1, pos, mp.economy["markers_scale"].value, {
            color: color,
            visible: false
        });
        marker.sqlId = data["id"];
        marker.balance = data["balance"];
        marker.owner = data["owner"];
        if (marker.owner != 0)
            marker.ownerName = data["ownerName"];

        marker.price = data["price"];
        marker.closed = data["closed"];
        marker.garageClosed = data["garageClosed"];
        marker.interior = data["interior"];
        marker.garage = data["garage"];
        marker.cars = JSON.parse(data["cars"]);
        marker.class = data["class"];
        marker.x = data["x"];
        marker.y = data["y"];
        marker.z = data["z"];
        marker.h = data["h"];
        marker.garageX = data.garageX;
        marker.garageY = data.garageY;
        marker.garageZ = data.garageZ;
        marker.garageH = data.garageH;

        initHouseUtils(marker);

        var color = 0;

        if (data["owner"] == 0) color = 2;
        else color = 1;

        var type = (data.owner) ? 40 : 374;
        //if (data["vehX"] == 0 && data["vehY"] == 0) color = 67;

        var houseClasses = ["-", "A", "B", "C", "D", "N"];


        var blip = mp.blips.new(type, pos, {
            color: color,
            name: "",
            shortRange: true,
            scale: 0.7
        });

        marker.blip = blip;

        //для стриминга домов для игроков, которые в радиусе
        var colshape = mp.colshapes.newCircle(pos["x"], pos["y"], mp.economy["markers_stream_dist"].value);
        colshape.marker = marker;
        marker.showColshape = colshape;

        //для отловки события входа в дом
        var colshape = mp.colshapes.newSphere(pos["x"], pos["y"], pos["z"], 2);
        colshape.house = marker;
        marker.colshape = colshape;
        // colshape.menuName = "enter_house";

        return marker;
    }

    mp.createHouseGarageMarker = (data) => {
        var pos = new mp.Vector3(data["garageX"], data["garageY"], data["garageZ"] - 1);

        var color = [0, 187, 255, 70];
        var marker = mp.markers.new(1, pos, 1, {
            color: color,
            visible: false
        });
        marker.houseSqlId = data.sqlId;

        //для стриминга домов для игроков, которые в радиусе
        var colshape = mp.colshapes.newCircle(pos["x"], pos["y"], 60);
        colshape.marker = marker;
        marker.showColshape = colshape;
        //для отловки события входа в дом
        var colshape = mp.colshapes.newSphere(pos["x"], pos["y"], pos["z"], 2);
        colshape.garage = marker;
        marker.colshape = colshape;
        colshape.menuName = "enter_garage";

        return marker;
    }
}
