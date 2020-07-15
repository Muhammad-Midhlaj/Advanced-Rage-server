var menuHandlers = {
    "enter_garage": (player, colshape) => {
        var house = mp.houses.getBySqlId(player.inHouse);
        if (!player.inHouse) {
            if(player.colshape.garage.houseSqlId) {
                house = mp.houses.getBySqlId(player.colshape.garage.houseSqlId); // с улицы в гараж
            }
        } else {
            house = mp.houses.getBySqlId(player.inHouse); // из дома в гараж
        }

        if (!house) return player.utils.error(`No house found!`);

        if (house.garage) player.call("selectMenu.show", ["enter_garage"]);
    },
    "police_storage": (player, colshape) => {
        if (player.faction !== colshape.policeStorage.faction) return player.utils.error(`No access!`);
        player.call("selectMenu.show", ["police_storage"]);
    },
    "police_storage_2": (player, colshape) => {
        if (player.faction !== colshape.policeStorage.faction) return player.utils.error(`No access!`);
        player.call("selectMenu.show", ["police_storage_2"]);
    },
    "army_storage": (player, colshape) => {
        if (player.faction != colshape.armyStorage.faction) return player.utils.error(`No access!`);
        player.call("selectMenu.show", ["army_storage"]);
    },
    "army_storage_2": (player, colshape) => {
        if (player.faction != colshape.armyStorage.faction) return player.utils.error(`No access!`);
        player.call("selectMenu.show", ["army_storage_2"]);
    },
    "hospital_storage": (player, colshape) => {
        if (player.faction != colshape.hospitalStorage.faction) return player.utils.error(`No access!`);
        player.call("selectMenu.show", ["hospital_storage"]);
    },
    "police_service": (player, colshape) => {
        var list = mp.houses.getArrayByOwner(player.sqlId);
        var ids = [];
        list.forEach((h) => {
            ids.push(h.sqlId)
        });
        if (!ids.length) ids = null;
        player.call("selectMenu.show", ["police_service", 0, ids]);
    },
    "police_service_2": (player, colshape) => {
        var list = mp.houses.getArrayByOwner(player.sqlId);
        var ids = [];
        list.forEach((h) => {
            ids.push(h.sqlId)
        });
        if (!ids.length) ids = null;
        player.call("selectMenu.show", ["police_service_2", 0, ids]);
    },
    "fib_storage": (player, colshape) => {
        if (player.faction !== colshape.fibStorage.faction) return player.utils.error(`No access!`);
        player.call("selectMenu.show", ["fib_storage"]);
    },
};
for (var i = 1; i <= 11; i++)
    menuHandlers[`enter_biz_${i}`] = (player, colshape) => {
        var biz = colshape.biz;
        var isOwner = biz.owner === player.sqlId;
        player.call("selectMenu.show", [`enter_biz_${biz.bizType}`, 0, {
            isOwner: isOwner,
            owner: biz.owner
        }]);
        if (biz.bizType == 6) {
          let biz6INfo = [10, 8, 12, 5, 15, 20, 40, 20, 30, 20];
          let prices = [];
          for (let i = 0; i < biz6INfo.length; i++) {
            let price = biz6INfo[i] * biz.productPrice;
            prices.push(price);
          }
          player.call("food.shop.setFoodShopName", [prices, biz.productPrice]);
        } else if (biz.bizType == 8) {
          let biz8INfo = [60, 50, 70, 180, 240, 280, 300, 350];
          let prices = [];
          for (let i = 0; i < biz8INfo.length; i++) {
            let price = biz8INfo[i] * biz.productPrice;
            prices.push(price);
          }
          player.call("weapon.shop.setAmmoShopName", [prices, biz.productPrice]);
        }
    };

module.exports = {
    "playerEnterColshape": (player, colshape) => {
        if (colshape.marker) colshape.marker.showFor(player);
        else player.colshape = colshape;

        if (colshape.menuName) {
            if (player.vehicle) return player.utils.error(`Get out of the car!`);
            if (menuHandlers[colshape.menuName]) menuHandlers[colshape.menuName](player, colshape);
            else player.call("selectMenu.show", [colshape.menuName]);
        }

        if (colshape.routep) {
            if (colshape.routep === player.route[player.currentRoutepIndex]) { //currentRoutepIndex - index в массиве маршрута

                if (player.currentRoutepIndex < player.route.length - 1) {
                    var index = ++player.currentRoutepIndex;
                    var direction = (index + 1 < player.route.length) ? new mp.Vector3(player.route[index + 1].x, player.route[index + 1].y, player.route[index + 1].z, ) : null;

                    player.call("checkpoint.create", [player.route[index], direction]);

                } else {
                    player.call("checkpoint.create", []);
                }
            }
        } else if (colshape.factionProducts) {
            var index = colshape.factionProducts.factionIds.indexOf(player.faction);
            if (index == -1 || player.getVariable("attachedObject")) return;
            player.utils.setLocalVar("insideProducts", true);
            player.factionProducts = colshape.factionProducts;
        } else if (colshape.warehouse) {
            if (!player.getVariable("attachedObject")) return;
            player.utils.setLocalVar("insideWarehouseProducts", true);
        } else if (colshape.tpMarker) {
            if (player.lastTpMarkerId != null) return;
            var pos = colshape.targetMarker.position;
            pos.z++;
            player.position = pos;
            player.heading = colshape.targetMarker.h;
            player.lastTpMarkerId = colshape.tpMarker.id;
        } else if (colshape.isForTractor) {
            var veh = player.vehicle;
            if (!veh || !mp.isFarmVehicle(veh)) return;
            colshape.destroy();

            if (player.farmJob.routeIndex == player.farmJob.route.length - 1) {
                var farmField = player.farmJob.tractorField;
                farmField.fill(veh.products.type);

                player.utils.success(`You have successfully sown the field!`);
                player.utils.info(`The harvest is maturing...`);
                player.call("checkpoint.clearForTractor");
                player.call("removeWaypoint");
                veh.products.type = 0;
                veh.products.count = 0;
                delete player.farmJob.routeIndex;
                delete player.farmJob.route;
                var farm = player.farmJob.farm;
                var pay = farm.pay * mp.economy["farm_tractor_pay"].value;
                if (farm.balance < pay) player.utils.warning(`The farm does not have enough money to pay! Contact the owner of the farm!`);
                else {
                    farm.setBalance(farm.balance - pay);
                    player.utils.setMoney(player.money + pay);
                }
            } else {
                player.farmJob.routeIndex++;

                var pos = player.farmJob.route[player.farmJob.routeIndex];
                var data = {
                    position: pos,
                    type: 1,
                    scale: 4,
                    params: {
                        isForTractor: true
                    },
                    color: [255, 255, 255, 255]
                }
                if (player.farmJob.routeIndex < player.farmJob.route.length - 1) data.direction = player.farmJob.route[player.farmJob.routeIndex + 1];
                //дл¤ отловки событи¤ входа в маркер
                var colshape = mp.colshapes.newSphere(pos["x"], pos["y"], pos["z"] + 1, 3); //+1 to fix bug
                colshape.isForTractor = true;
                player.farmJob.tractorColshape = colshape;
                player.call("checkpoint.create", [JSON.stringify(data)]);
                player.call("setNewWaypoint", [pos.x, pos.y]);
            }
        }

    },
    "houseHandler": (player) => {
        if (player.colshape) {
            if (player.colshape.house) {
                let house = player.colshape.house;
                if (house) {
                    var interior = mp.interiors.getBySqlId(house.interior);
                    if (!interior) return player.utils.error(`The interior has not been found!`);
                    var values = [house.sqlId, house.class, house.interior, house.ownerName, house.garage, house.closed, house.price, house.position, interior.rooms, interior.square];
                    //player.call("infoTable.show", ["house_info", house.sqlId]);
                    player.call("houseMenu.show", [values]);
                }
            } else if (player.colshape.menuName === "exit_house") {
                player.call("exitHouse");
            } else if (player.colshape.menuName === "exit_garage") {
                mp.events.call("goExitGarage", player);
            }
        }
    },
    "houseMenuHandler": (player) => {
        var house = mp.houses.getBySqlId(player.inHouse);
        if (house && house.owner === player.sqlId) {
            player.call("houseOwnerMenu.update", [false, house.closed]);
        } else if (player.colshape && player.colshape.house && player.colshape.house.owner === player.sqlId) {
            player.call("houseOwnerMenu.update", [false, player.colshape.house.closed]);
        }
    },
};
