const RentInfo = {
   timer: undefined
}

mp.events.add('start.rent.vehicle', (price) => {
 let vehicle = mp.players.local.vehicle;
 if (vehicle) {
   vehicle.freezePosition(true);
   let items = [{ text: "Rent a car - $" + price }, { text: "Close" } ];
   mp.events.call("selectMenu.setSpecialItems", "rent_faggio", items);
   mp.events.call("selectMenu.show", "rent_faggio");
 }
});

mp.events.add('stop.rent.vehicle', (type) => { stopRent(type); });

function stopRent(status) {
  let vehicle = mp.players.local.vehicle;
  mp.events.call("selectMenu.hide", "rent_faggio");
  if (vehicle) {
    vehicle.freezePosition(false);
    if (status) mp.players.local.taskLeaveVehicle(vehicle.handle, 16);
  }
}

mp.events.add("selectMenu.itemSelected", (menuName, itemName, itemValue, itemIndex) => {
	if (menuName === "rent_faggio") {
    if (itemName === "Close") {
      stopRent(true);
      mp.events.call("selectMenu.hide", "rent_faggio");
    } else {
      mp.events.call("selectMenu.hide", "rent_faggio");
      mp.events.callRemote("rent.vehicle.faggio");
    }
	}
});
mp.events.add('control.rent.vehicle.time', (time) => {
  if (time === 0) {
    if (RentInfo.timer !== undefined) {
      clearTimeout(RentInfo.timer);
      delete RentInfo.timer;
    }
    return;
  }

  if (RentInfo.timer === undefined) {
    RentInfo.timer = setTimeout(() => {
      mp.events.callRemote("delete.vehicle.faggio.rent");
    }, time);
  }
});
