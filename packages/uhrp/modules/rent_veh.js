const RentInfo = {
    price: 0,
    time: 60000 // 1 минута
}

mp.events.add("playerQuit", function playerQuitHandler(player, exitType, reason) {
    if (player.rent_owner) leaveRent(player);
});
mp.events.add("playerEnterVehicle", function playerEnterVehicleHandler(player, vehicle, seat) {
    try {
        if (vehicle.owner === -4001 && seat === -1) {
            if (vehicle.rent_owner) {
                if (!mp.players.exists(vehicle.rent_owner)) {
                  delete vehicle.rent_owner;
                  return;
                } else if (vehicle.rent_owner.rent_owner != vehicle) {
                  delete vehicle.rent_owner;
                  return;
                } else if (vehicle.rent_owner === player) {
                  player.call("control.rent.vehicle.time", [0]);
                  return;
                } else {
                    player.removeFromVehicle();
                    player.utils.error("This transport has already been rented!");
                    return;
                }
            }
            player.call("start.rent.vehicle", [RentInfo.price]);
        }
    } catch (err) {
        console.log(err);
        return;
    }
});
mp.events.add("playerExitVehicle", function playerExitVehicleHandler(player, vehicle) {
    try {
        if (vehicle.owner === -4001 && player.seat === -1) {
            if (vehicle.rent_owner === player) {
                player.call("control.rent.vehicle.time", [RentInfo.time]);
                player.utils.error("You have 60 seconds to get back in transport!");
            } else {
                player.call("stop.rent.vehicle", [false]);
            }
        }
    } catch (err) {
        console.log(err);
        return;
    }
});

function leaveRent(player) {
    let vehicle = player.rent_owner;
    if (vehicle) {
        delete player.rent_owner;
        delete vehicle.rent_owner;
        removePlayersFromVehicle(vehicle);
        player.utils.error("Your scooter is towed!");
        setTimeout(() => {
            try {
                vehicle.repair();
                vehicle.dimension = 0;
                vehicle.position = vehicle.spawnPos;
                vehicle.rotation = new mp.Vector3(0, 0, vehicle.spawnPos.h);
                vehicle.utils.setFuel(vehicle.vehPropData.maxFuel);
                vehicle.engine = false;
            } catch (err) {
                console.log(err);
                return;
            }
        }, 200);
    }
}
mp.events.add("delete.vehicle.faggio.rent", (player) => {
    leaveRent(player);
});

function rentVehicle(player) {
  let vehicle = player.vehicle;
  if (vehicle) {
    if (player.money < RentInfo.price) {
      player.utils.warning("You don't have enough money!");
      player.removeFromVehicle();
      return;
    }

    if (player.rent_owner !== undefined) {
      player.utils.warning("You've already rented a scooter!");
      player.removeFromVehicle();
      return;
    }

        player.utils.setMoney(player.money - RentInfo.price);
        player.utils.success("You rented a scooter for $" + RentInfo.price);
        player.rent_owner = vehicle, vehicle.rent_owner = player;
        vehicle.utils.setFuel(vehicle.vehPropData.maxFuel);
        player.call("stop.rent.vehicle", [false]);
    }
}
mp.events.add("rent.vehicle.faggio", (player) => {
    rentVehicle(player);
});

function removePlayersFromVehicle(vehicle) {
    try {
        let array = vehicle.getOccupants();
        for (let i = 0; i < array.length; i++) array[i].removeFromVehicle();
    } catch (err) {
        console.log(err);
        return;
    }
}
