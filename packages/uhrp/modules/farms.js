module.exports = {
    Init: () => {
        loadFarmsFromDB();
        loadFarmFieldsFromDB();
    }
}

var cropNames = ["-", "Pumpkin", "Cabbage", "Grass"];

function loadFarmsFromDB() {
    mp.farms = [];
    DB.Handle.query("SELECT * FROM farms", (e, result) => {
        for (var i = 0; i < result.length; i++) {
            var pos = new mp.Vector3(result[i].x, result[i].y, result[i].z);
            var marker = mp.markers.new(1, pos, 1, {
                color: [0, 187, 255, 100],
                visible: false
            });
            marker.sqlId = result[i]["id"];
            marker.owner = result[i]["owner"];
            marker.grains = result[i]["grains"];
            marker.pumpkins = result[i]["pumpkins"];
            marker.cabbages = result[i]["cabbages"];
            marker.weeds = result[i]["weeds"];
            marker.pumpkinPrice = result[i]["pumpkinPrice"];
            marker.cabbagePrice = result[i]["cabbagePrice"];
            marker.weedPrice = result[i]["weedPrice"];
            marker.grainPrice = result[i]["grainPrice"];
            marker.price = result[i]["price"];
            marker.balance = result[i]["balance"];
            marker.taxBalance = result[i]["taxBalance"];
            marker.pay = result[i]["pay"];

            var colshape = mp.colshapes.newCircle(pos["x"], pos["y"], 60);
            colshape.marker = marker;
            marker.showColshape = colshape;

            //дл¤ отловки событи¤ входа в маркер
            var colshape = mp.colshapes.newSphere(pos["x"], pos["y"], pos["z"] + 1, 1); //+1 to fix bug
            colshape.farm = marker;
            marker.colshape = colshape;
            colshape.menuName = `enter_farm`;

            var blip = mp.blips.new(88, pos, {
                color: 60,
                name: `Farm No.${result[i]["id"]}`,
                shortRange: 10,
                scale: 0.7
            });
            marker.blip = blip;

            initFarmLabels(marker);
            initFarmWarehouse(marker);
            initFarmUtils(marker);
            mp.farms.push(marker);
        }

        console.log(`Farms loaded: ${i} units.`);
    });
    initFarmsUtils();
}

function initFarmsUtils() {
    mp.farms.getBySqlId = (sqlId) => {
        if (!sqlId) return null;
        var result;
        mp.farms.forEach((farm) => {
            if (farm.sqlId == sqlId) {
                result = farm;
                return;
            }
        });
        return result;
    };
    mp.farms.getJobTypeByModel = (model) => {
        var types = {
            "bodhi2": 1,
            "rebel": 1,
            "tractor2": 2,
            "duster": 3,
        };
        if (!types[model]) return -1;
        return types[model];
    };
    mp.farms.getJobName = (jobType) => {
        var names = ["Working", "Farmer", "Tractor driver", "Pilot"];
        jobType = Math.clamp(jobType, 0, names.length - 1);
        return names[jobType];
    };
    mp.farms.getNearTractor = (pos, range) => {
        var nearVehicle;
        var minDist = 99999;
        mp.vehicles.forEachInRange(pos, range, (veh) => {
            if (!mp.isFarmVehicle(veh) || mp.farms.getJobTypeByModel(veh.name) != 2) return;
            var distance = veh.dist(pos);
            if (distance < minDist) {
                nearVehicle = veh;
                minDist = distance;
            }
        });
        return nearVehicle;
    }
    mp.farms.getNearPickup = (pos, range) => {
        var nearVehicle;
        var minDist = 99999;
        mp.vehicles.forEachInRange(pos, range, (veh) => {
            if (!mp.isFarmVehicle(veh) || mp.farms.getJobTypeByModel(veh.name) != 1) return;
            var distance = veh.dist(pos);
            if (distance < minDist) {
                nearVehicle = veh;
                minDist = distance;
            }
        });
        return nearVehicle;
    }
}

function initFarmFieldsUtils() {
    mp.farmFields.getBySqlId = (sqlId) => {
        for (var i = 0; i < mp.farmFields.length; i++) {
            var field = mp.farmFields[i];
            if (field.sqlId == sqlId) return field;
        }
        return null;
    };
}

function loadFarmFieldsFromDB() {
    mp.farmFields = [];
    DB.Handle.query("SELECT * FROM farms_fields", (e, result) => {
        for (var i = 0; i < result.length; i++) {
            result[i].p1 = JSON.parse(result[i].p1);
            result[i].p2 = JSON.parse(result[i].p2);
            result[i].p3 = JSON.parse(result[i].p3);
            result[i].p4 = JSON.parse(result[i].p4);
            result[i].labelPos = JSON.parse(result[i].labelPos);
            result[i].sqlId = result[i].id;
            result[i].cropType = result[i].type;
            result[i].state = 3;
            delete result[i].id;
            delete result[i].type;

            /*result[i].label = mp.labels.new(`~y~Farm ~w~№${result[i].sqlId}\n ~b~Pay: ~w~${data[i].pay}$`, new mp.Vector3(pos.x, pos.y, pos.z + 2), {
                los: true,
                font: 4,
                drawDistance: 30,
                color: [0, 187, 255, 255],
            });*/

            initFarmFieldUtils(result[i]);
            initFarmFieldObjects(result[i]);
            initFarmFieldLabels(result[i]);
            mp.farmFields.push(result[i]);
        }
        console.log(`Farm fields loaded: ${i} units.`);
    });
    initFarmFieldsUtils();
}

function getWarehousePosByFarmId(farmId) {
    var positions = [
        [
            new mp.Vector3(1981.6806640625, 5029.39892578125, 42.03016662597656),
            new mp.Vector3(1985.9840087890625, 5023.95458984375, 42.088829040527344),
            new mp.Vector3(1991.2686767578125, 5018.3994140625, 42.13268280029297),
            new mp.Vector3(1982.4197998046875, 5020.7783203125, 42.205257415771484)
        ],
        [
            new mp.Vector3(0, 0, 0),
            new mp.Vector3(0, 0, 0),
            new mp.Vector3(0, 0, 0),
            new mp.Vector3(0, 0, 0),
        ],
    ];
    farmId = Math.clamp(farmId, 1, positions.length);
    return positions[farmId - 1];
}

function initFarmUtils(farm) {
    farm.setBalance = (balance) => {
        if (balance < 0) balance = 0;
        farm.balance = balance;
        DB.Handle.query("UPDATE farms SET balance=? WHERE id=?", [farm.balance, farm.sqlId]);
    }
    farm.setTaxBalance = (newTaxBalance) => {
        farm.taxBalance = Math.clamp(newTaxBalance, 0, 1200);
        DB.Handle.query("UPDATE farms SET taxBalance=? WHERE id=?", [farm.taxBalance, farm.sqlId]);
    }
    farm.sellToGos = () => {
        var oldOwner = mp.players.getBySqlId(farm.owner);
        var fullSum = farm.balance + farm.price * 0.8;
        if (oldOwner) {
            oldOwner.utils.info(`Your farm is sold! Money from the balance sheet and 80% of the value of the business returned!`);
            oldOwner.utils.setBankMoney(oldOwner.bank + price);
            oldOwner.utils.bank(`Farm`, `Awarded: ~g~$${fullSum}`);
        } else {
            DB.Handle.query(`UPDATE characters SET bank=bank+? WHERE id=?`, [fullSum, farm.owner]);
        }

        farm.owner = 0;
        farm.ownerName = "";
        farm.grains = 0;
        farm.pumpkins = 0;
        farm.cabbages = 0;
        farm.weeds = 0;
        farm.pumpkinPrice = 10;
        farm.cabbagePrice = 10;
        farm.weedPrice = 10;
        farm.grainPrice = 4;
        farm.balance = 0;
        farm.taxBalance = 100;
        farm.pay = 5;

        var query = "UPDATE farms SET grains=?,pumpkins=?,cabbages=?,weeds=?,pumpkinPrice=?,cabbagePrice=?,weedPrice=?,grainPrice=?,owner=?,balance=?,taxBalance=?,pay=? WHERE id=?";
        DB.Handle.query(query, [0, 0, 0, 0, 10, 10, 10, 4, 0, 0, 100, 5, farm.sqlId]);

        // TODO: Init Labels.

        mp.log(`Farm ${farm.sqlId} sold to the state!`);
    }
    farm.setGrains = (grains) => {
        farm.grains = Math.clamp(grains, 0, 8000);
        DB.Handle.query("UPDATE farms SET grains=? WHERE id=?", [farm.grains, farm.sqlId]);
        farm.grainLabel.text = `~b~Grain intake: ~w~${farm.grains} out of 8000 units.\n~g~Price: ~w~${farm.grainPrice}$`;
    }
    farm.setPumpkins = (count) => {
        farm.pumpkins = Math.clamp(count, 0, 2000);
        DB.Handle.query("UPDATE farms SET pumpkins=? WHERE id=?", [farm.pumpkins, farm.sqlId]);
        farm.pumpkinLabel.text = `~y~Pumpkin: ~w~${farm.pumpkins} out of 2000 units.\n~g~Price: ~w~${farm.pumpkinPrice}$`;
    }
    farm.setCabbages = (count) => {
        farm.cabbages = Math.clamp(count, 0, 2000);
        DB.Handle.query("UPDATE farms SET cabbages=? WHERE id=?", [farm.cabbages, farm.sqlId]);
        farm.cabbageLabel.text = `~y~Cabbage: ~w~${farm.cabbages} out of 2000 units.\n~g~Price: ~w~${farm.cabbagePrice}$`;
    }
    farm.setWeeds = (count) => {
        farm.weeds = Math.clamp(count, 0, 2000);
        DB.Handle.query("UPDATE farms SET weeds=? WHERE id=?", [farm.weeds, farm.sqlId]);
        farm.weedLabel.text = `~y~Grass: ~w~${farm.weeds} out of 2000 units.\n~g~Price: ~w~${farm.weedPrice}$`;
    }

}

function initFarmFieldUtils(field) {
    field.setCount = (count) => {
        field.count = Math.clamp(count, 0, 600);
        if (field.count % 20 == 0) DB.Handle.query("UPDATE farms_fields SET count=? WHERE id=?", [field.count, field.sqlId]);
        if (field.count == 0) field.setCropType(0);
    };
    field.setCropType = (cropType) => {
        field.cropType = Math.clamp(cropType, 0, cropNames.length - 1);
        field.label.text = `~y~Поле ~w~№${field.sqlId}\n ~y~Урожай: ~w~${cropNames[field.cropType]}`;
        DB.Handle.query("UPDATE farms_fields SET type=? WHERE id=?", [field.cropType, field.sqlId]);
    };
    field.fill = (type) => {
        // debug(`field.fill: ${type}`)
        // debug(`Зерно посеяно на поле ${field.sqlId}`);
        if (field.objects) {
            field.objects.forEach((object) => {
                object.destroy();
            });
        }
        field.state = 0;
        field.objects = [];
        field.cropType = Math.clamp(type, 0, 3);
        field.count = 600;
        DB.Handle.query("UPDATE farms_fields SET type=?,count=? WHERE id=?", [field.cropType, field.count, field.sqlId]);
        field.label.text = `~y~Поле ~w~№${field.sqlId}\n ~y~Урожай: ~w~${cropNames[field.cropType]}`;
        var timerId = setInterval(() => {
            try {
                field.state++;
                // debug(`Поле ${field.sqlId} созревает. Этап: ${field.state}`);
                if (field.state == 1) {
                    var objPositions = field.getObjPositions();
                    for (var i = 0; i < objPositions.length; i++) {
                        objPositions[i].z = field.p1.z - 0.5;
                        var object = mp.objects.new(mp.joaat("prop_veg_crop_04"), objPositions[i], {
                            rotation: new mp.Vector3(0, 0, 0),
                            alpha: 255,
                            heading: 90
                        });
                        object.count = parseInt(600 / objPositions.length);
                        object.field = field;
                        field.objects.push(object);
                    }
                    // debug(`Поле ${field.sqlId} проросло!`)
                } else if (field.state == 2) {
                    for (var i = 0; i < field.objects.length; i++) {
                        var pos = field.objects[i].position;
                        pos.z += 0.25;
                        field.objects[i].position = pos;
                    }
                    // debug(`Поле ${field.sqlId} почти созрело!`)
                } else if (field.state == 3) {
                    for (var i = 0; i < field.objects.length; i++) {
                        var pos = field.objects[i].position;
                        pos.z += 0.25;
                        field.objects[i].position = pos;
                    }

                    // debug(`Поле ${field.sqlId} созрело!`)
                    clearInterval(timerId);
                }
            } catch (e) {
                console.log(e);
            }
        }, mp.economy["wait_farm_field_time"].value);
    };
    field.startFilling = (player, vehicle) => {
        if (field.count > 0) return player.utils.error(`Поле уже засеяно!`);
        if (vehicle.products.count < 200) return player.utils.error(`В авто нunitsостаточно зерна!`);
        player.call("checkpoint.clearForTractor");

        var pointsLeft = mp.getPointsOnInterval(field.p1, field.p3, 4);
        var pointsRight = mp.getPointsOnInterval(field.p2, field.p4, 4);
        if (pointsLeft.length > pointsRight.length) pointsLeft.splice(pointsRight.length);
        if (pointsLeft.length < pointsRight.length) pointsRight.splice(pointsLeft.length);
        var route = [];
        var k = 0;
        pointsLeft.forEach((point) => {
            point.z = field.p1.z - 1;
            route[k] = point;
            k += 2;
        });
        k = 1;
        pointsRight.forEach((point) => {
            point.z = field.p1.z - 1;
            route[k] = point;
            k += 2;
        });

        // route.splice(2); //for test

        player.farmJob.routeIndex = 0;
        player.farmJob.route = route;

        var pos = player.farmJob.route[player.farmJob.routeIndex];
        var data = {
            position: pos,
            type: 1,
            scale: 4,
            params: {
                isForTractor: true
            },
            color: [0, 187, 255, 255],
            direction: route[1]
        };

        player.call("checkpoint.create", [JSON.stringify(data)]);
        player.call("setNewWaypoint", [pos.x, pos.y]);

        //дл¤ отловки событи¤ входа в маркер
        var colshape = mp.colshapes.newSphere(pos["x"], pos["y"], pos["z"] + 1, 3); //+1 to fix bug
        colshape.isForTractor = true;
        player.farmJob.tractorField = field;
        player.farmJob.tractorColshape = colshape;

        player.utils.success(`Рабочее поле выбрано!`);
        player.utils.info(`Слunitsуйте к метке для начала посева!`);
    };
    field.getObjPositions = () => {
        var step = 5;
        var pointsLeft = mp.getPointsOnInterval(field.p1, field.p3, 5);
        var pointsRight = mp.getPointsOnInterval(field.p2, field.p4, 5);
        if (pointsLeft.length > pointsRight.length) pointsLeft.splice(pointsRight.length);
        if (pointsLeft.length < pointsRight.length) pointsRight.splice(pointsLeft.length);

        var objPositions = [];
        for (var i = 0; i < pointsLeft.length; i++) {
            var points = mp.getPointsOnInterval(pointsLeft[i], pointsRight[i], 5);
            objPositions = objPositions.concat(points);
        }
        return objPositions;
    };
}

function initFarmLabels(farm) {
    var pos = farm.position;
    pos.z++;
    farm.label = mp.labels.new(`~y~Farm ~w~№${farm.sqlId}\n ~b~Pay: ~w~${farm.pay}$`, pos, {
        los: true,
        font: 4,
        drawDistance: 30,
        color: [0, 187, 255, 255],
    });

    var positions = getWarehousePosByFarmId(farm.sqlId);
    farm.pumpkinLabel = mp.labels.new(`~y~Pumpkin: ~w~${farm.pumpkins} из 2000 units.\n~g~Price: ~w~${farm.pumpkinPrice}$`, positions[0], {
        los: false,
        font: 4,
        drawDistance: 30,
        color: [0, 187, 255, 255],
    });

    farm.cabbageLabel = mp.labels.new(`~y~Cabbage: ~w~${farm.cabbages} из 2000 units.\n~g~Price: ~w~${farm.cabbagePrice}$`, positions[1], {
        los: false,
        font: 4,
        drawDistance: 30,
        color: [0, 187, 255, 255],
    });

    farm.weedLabel = mp.labels.new(`~y~Grass: ~w~${farm.weeds} из 2000 units.\n~g~Price: ~w~${farm.weedPrice}$`, positions[2], {
        los: false,
        font: 4,
        drawDistance: 30,
        color: [0, 187, 255, 255],
    });

    farm.grainLabel = mp.labels.new(`~b~Grain intake: ~w~${farm.grains} out of 8000 units.\n~g~Price: ~w~${farm.grainPrice}$`, positions[3], {
        los: false,
        font: 4,
        drawDistance: 30,
        color: [0, 187, 255, 255],
    });
}

function initFarmWarehouse(farm) {
    var pos = getWarehousePosByFarmId(farm.sqlId)[3];
    pos.z -= 2;
    var marker = mp.markers.new(1, pos, 1, {
        color: [187, 255, 0, 80],
        visible: false
    });

    //для стриминга
    var colshape = mp.colshapes.newCircle(pos["x"], pos["y"], mp.economy["markers_stream_dist"].value);
    colshape.marker = marker;
    marker.showColshape = colshape;

    //для отловки события входа
    var colshape = mp.colshapes.newSphere(pos["x"], pos["y"], pos["z"], 2);
    colshape.warehouse = marker;
    colshape.farm = farm;
    marker.colshape = colshape;
    colshape.menuName = `farm_warehouse`;
}

function initFarmFieldLabels(field) {
    var pos = field.labelPos;
    pos.z++;
    field.label = mp.labels.new(`~y~Поле ~w~№${field.sqlId}\n ~y~Урожай: ~w~${cropNames[field.cropType]}`, pos, {
        font: 4,
        drawDistance: 30,
        color: [0, 187, 255, 255],
    });
}

function initFarmFieldObjects(field) {
    var count = field.count;
    var objPositions = field.getObjPositions();
    field.objects = [];
    for (var j = 0; j < objPositions.length; j++) {
        var fieldCount = Math.clamp(parseInt(600 / objPositions.length), 0, count);
        count -= fieldCount;
        if (fieldCount <= 0) break;
        objPositions[j].z = field.p1.z;
        var object = mp.objects.new(mp.joaat("prop_veg_crop_04"), objPositions[j], {
            rotation: new mp.Vector3(0, 0, 0),
            alpha: 255,
            heading: 90
        });
        object.count = fieldCount;
        object.field = field;
        field.objects.push(object);

    }
}

global.saveFarmFieldsDBParams = () => {
    for (var i = 0; i < mp.farmFields.length; i++) {
        var field = mp.farmFields[i];
        DB.Handle.query("UPDATE farms_fields SET type=?,count=? WHERE id=?", [field.cropType, field.count, field.sqlId]);
    }
}
