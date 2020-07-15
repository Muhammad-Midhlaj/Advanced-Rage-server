const PizzaJob = {
  keyDownE: undefined,
	storage_blip: undefined,
	storage_marker: undefined,
	blips: [],
	colshapes: [],
	markers: []
};

mp.events.add('create.pizza.storagemarker', (type) => {
		if (type === false) {
			PizzaJob.storage_marker.destroy();
      delete PizzaJob.storage_marker;
			if (PizzaJob.storage_blip !== undefined) {
        PizzaJob.storage_blip.setRoute(false);
				PizzaJob.storage_blip.destroy();
			  delete PizzaJob.storage_blip;
			}
      for (let i = 0; i < PizzaJob.blips.length; i++) if (PizzaJob.blips[i] !== undefined) PizzaJob.blips[i].destroy(), PizzaJob.colshapes[i].destroy(), PizzaJob.markers[i].destroy();
      PizzaJob.blips = [], PizzaJob.colshapes = [], PizzaJob.markers = [];
		} else {
			PizzaJob.storage_marker = mp.markers.new(20, new mp.Vector3(573.03, 128.86, 99.47), 1, { visible: true, color: [255, 0, 0, 180], rotation: 180 });
      PizzaJob.storage_blip = mp.blips.new(473, new mp.Vector3(573.03, 128.86), { alpha: 255, name: "Pizzeria Warehouse", scale: 0.8, color: 1 });
			PizzaJob.storage_blip.setRoute(true);
			PizzaJob.storage_blip.setRouteColour(1);
		}
});
mp.events.add('create.pizza.places', (arg, arg1, arg2) => {
  if (PizzaJob.storage_blip !== undefined) {
    PizzaJob.storage_blip.setRoute(false);
    PizzaJob.storage_blip.destroy();
    delete PizzaJob.storage_blip;
  }

  let arr = [arg, arg1, arg2];
  for (let i = 0; i < arr.length; i++) {
      PizzaJob.blips.push(mp.blips.new(1, new mp.Vector3(arr[i].x, arr[i].y), { alpha: 255, scale: 1.1, name: "Точка сдачи пиццы", color: 1 }));
      PizzaJob.colshapes.push(mp.colshapes.newSphere(arr[i].x, arr[i].y, arr[i].z + 1.0, 1.0));
      PizzaJob.markers.push(mp.markers.new(20, new mp.Vector3(arr[i].x, arr[i].y, arr[i].z + 1.0), 1, { visible: true, color: [255, 0, 0, 180], rotation: 180 }));
  }
});

mp.events.add('setPizzaJobStatus', (status) => { PizzaJob.keyDownE = status; });
mp.events.add('getPizzaJobStatus', (status) => {
  if (status !== "cancel") {
    mp.events.call("prompt.show", `Press <span>Е</span> for interaction`);
    PizzaJob.keyDownE = status;
  } else {
    PizzaJob.keyDownE = null;
  }
});
mp.events.add('delete.pizza.colshape', (i, pizza) => {
  PizzaJob.blips[i].destroy(), PizzaJob.colshapes[i].destroy(), PizzaJob.markers[i].destroy();
  delete PizzaJob.blips[i], delete PizzaJob.colshapes[i], delete PizzaJob.markers[i];
  if (pizza < 1) {
    PizzaJob.blips = [], PizzaJob.colshapes = [], PizzaJob.markers = [];
    PizzaJob.storage_blip = mp.blips.new(473, new mp.Vector3(573.03, 128.86), { alpha: 255, name: "Склад Пиццерии", scale: 0.8, color: 1 });
    PizzaJob.storage_blip.setRoute(true);
    PizzaJob.storage_blip.setRouteColour(1);
  }
});
mp.keys.bind(0x45, false, function () { // E key
	if (PizzaJob.keyDownE !== undefined) {
		if (mp.game.gameplay.getDistanceBetweenCoords(mp.players.local.position.x, mp.players.local.position.y, mp.players.local.position.z, 538.54, 101.79, 96.54, true) < 1.75) {
      mp.gui.cursor.show(true, true);
      if (PizzaJob.keyDownE === true) {
          mp.events.call("choiceMenu.show", "accept_job_pizza", {name: "Quit from Pizzeria?"});
      } else {
					mp.events.call("choiceMenu.show", "accept_job_pizza", {name: "Get a pizzeria?"});
      }
		}
	}
});
mp.events.add('playerEnterColshape', (shape) => {
    if (PizzaJob.colshapes.includes(shape) && !mp.players.local.vehicle) {
      mp.takeObject(mp.players.local, "prop_pizza_box_02");
      mp.players.local.freezePosition(true);
      setTimeout(() => {
        mp.events.callRemote("give.pizza.item", PizzaJob.colshapes.indexOf(shape));
        mp.putObject(mp.players.local, "prop_pizza_box_02");
        mp.players.local.freezePosition(false);
      }, 750);
    }
});
