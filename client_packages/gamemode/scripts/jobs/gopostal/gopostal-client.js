const PostalJob = {
  colshape: mp.colshapes.newSphere(78.92, 112.55, 81.17, 1.60),
  keyDownE: undefined,
  blip: undefined,
  timeout: undefined,
  vehicle: undefined,
  arr: undefined,
  hasbox: false,
  storage: {
    marker: undefined,
    omarker: undefined,
    shape: undefined,
    oshape: undefined
  },
  blips: [],
  markers: [],
  colshapes: [],
}

mp.events.add('delete.gopostal.colshape', (i, type) => {
  PostalJob.blips[i].destroy(), PostalJob.colshapes[i].destroy(), PostalJob.markers[i].destroy();
  delete PostalJob.blips[i], delete PostalJob.colshapes[i], delete PostalJob.markers[i];
  if (type === 0) {
    PostalJob.blips = [], PostalJob.colshapes = [], PostalJob.markers = [];
    PostalJob.blip = mp.blips.new(615, new mp.Vector3(78.92, 112.55, 81.17), { alpha: 255, scale: 1.0, color: 2, name: "Warehouse Go Postal", shortRange: false });
    PostalJob.blip.setRoute(true);
    PostalJob.blip.setRouteColour(2);
    mp.events.call("prompt.show", `Go to a warehouse and take the order then load the van.`);
  }
});

mp.events.add('playerEnterColshape', (shape) => {
    if (shape === PostalJob.colshape) {
      if (mp.players.local.vehicle) return;
      mp.events.call("prompt.show", `Press <span>Е</span> to take the order!`);
      PostalJob.keyDownE = true;
    } else if (shape === PostalJob.storage.shape || shape == PostalJob.storage.oshape) {
       if (mp.players.local.vehicle) {
         mp.events.call("nError", "Go out of the vehicle!");
       } else {
         if (!PostalJob.vehicle) {
            mp.events.call("nError", "You have no van to load mail!");
            return;
         }
         mp.events.callRemote("take.gopostal.object");
         PostalJob.hasbox = true;
       }
    } else if (PostalJob.colshapes.includes(shape)) {
      if (mp.players.local.vehicle) return;
      mp.takeObject(mp.players.local, "v_ind_cs_box02");
      mp.players.local.freezePosition(true);
      setTimeout(() => {
        mp.events.callRemote("give.gopostal.item", PostalJob.colshapes.indexOf(shape));
        mp.putObject(mp.players.local, "v_ind_cs_box02");
        mp.players.local.freezePosition(false);
      }, 500);
    }
});
mp.events.add('playerExitColshape', (shape) => {
    if (shape === PostalJob.colshape) delete PostalJob.keyDownE;
});

mp.events.add('setPostalJobStatus', (status) => { PostalJob.keyDownE = status; });
mp.events.add('getPostalJobStatus', (status) => {
  if (status !== "cancel") {
    mp.events.call("prompt.show", `Press <span>Е</span> for interaction`);
    PostalJob.keyDownE = status;
  } else {
    PostalJob.keyDownE = null;
  }
});
mp.events.add('clear.storage.gopostal', () => {
  deleteStorage();
  deleteMainBlip();
  PostalJob.hasbox = false;
  let arr = PostalJob.arr;
  for (let i = 0; i < arr.length; i++) {
      PostalJob.blips.push(mp.blips.new(1, new mp.Vector3(arr[i].x, arr[i].y), { alpha: 255, scale: 1.1, name: "Point of delivery of mail", color: 3 }));
      PostalJob.colshapes.push(mp.colshapes.newSphere(arr[i].x, arr[i].y, arr[i].z + 1.0, 1.0));
      PostalJob.markers.push(mp.markers.new(20, new mp.Vector3(arr[i].x, arr[i].y, arr[i].z + 1.0), 1, { visible: true, color: [66, 170, 255, 180], rotation: 180 }));
  }
  delete PostalJob.arr;
});
mp.events.add('time.add.back.gopostal', (player) => {
    try
    {
      if (PostalJob.timeout === undefined) {
         PostalJob.timeout = setTimeout(() => {
            mp.events.callRemote("leave.gopostal.job");
         }, 180000);
      }
    }
    catch (err) {
        mp.game.graphics.notify(err);
        return;
    }
});
mp.events.add('remove.all.gopostal.data', (player) => {
    try
    {
      delete PostalJob.arr; // Удаление хранения заказов
      deleteJobTimer();
      deleteMainBlip();
      deleteJobVehicle();
      deleteStorage();
      deleteUsebleBlips();
    }
    catch (err) {
        mp.game.graphics.notify(err);
        return;
    }
});
mp.events.add('setPostalJobStatus', (status) => { PostalJob.keyDownE = status; });
mp.events.add('set.gopostal.vehicle', (vehicle) => { PostalJob.vehicle = vehicle; });
mp.events.add('control.gopostal.blip', (num) => {
  try
  {
    deleteMainBlip();
    if (num === "cancel") return;
    switch (num) {
      case 1:
        PostalJob.blip = mp.blips.new(501, new mp.Vector3(-321.17, -887.45, 31.07), { alpha: 255, scale: 1.0, color: 2, name: "Parking Go Postal", shortRange: false });
        mp.events.call("prompt.show", `Proceed on the parking and take the working van.`);
        break;
      case 2:
        PostalJob.blip = mp.blips.new(615, new mp.Vector3(78.92, 112.55, 81.17), { alpha: 255, scale: 1.0, color: 2, name: "Warehouse Go Postal", shortRange: false });
        PostalJob.blip.setRoute(true);
        PostalJob.blip.setRouteColour(2);
        mp.events.call("prompt.show", `Go to a warehouse and take the order then load the van.`);
        break;
      case 3:
        PostalJob.blip = mp.blips.new(615, new mp.Vector3(69.25, 127.65, 79.21), { alpha: 255, scale: 1.0, color: 1, name: "Warehouse Go Postal", shortRange: false });
        mp.events.call("prompt.show", `You have 5 minutes to load mail into the van.`);
    }
  }
  catch (err) {
      mp.game.graphics.notify(err);
      return;
  }
});
mp.events.add('create.gopostal.day', (arr) => {
  deleteJobTimer();
  PostalJob.timeout = setTimeout(() => {
     mp.events.callRemote("leave.gopostal.job");
  }, 300000);

  PostalJob.storage.marker = mp.markers.new(1, new mp.Vector3(63.28, 128.00, 79.21 - 1.8), 2.5, { visible: true, dimension: 0, color: [255, 0, 0, 130] });
  PostalJob.storage.omarker = mp.markers.new(1, new mp.Vector3(74.27, 124.64, 79.21 - 1.8), 2.5, { visible: true, dimension: 0, color: [255, 0, 0, 130] });
  PostalJob.storage.shape = mp.colshapes.newSphere(63.29, 127.92, 79.21, 2.5);
  PostalJob.storage.oshape = mp.colshapes.newSphere(74.27, 124.64, 79.21, 2.5);
  PostalJob.arr = JSON.parse(arr);
});
mp.events.add('time.remove.back.gopostal', () => {
    try
    {
      deleteJobTimer();
    }
    catch (err) {
        mp.game.graphics.notify(err);
        return;
    }
});
mp.keys.bind(0x45, false, function () { // E key
	if (PostalJob.keyDownE !== undefined) {
		if (mp.game.gameplay.getDistanceBetweenCoords(mp.players.local.position.x, mp.players.local.position.y, mp.players.local.position.z, -258.56, -841.53, 31.42, true) < 1.75) {
      mp.gui.cursor.show(true, true);
      if (PostalJob.keyDownE === true) {
          mp.events.call("choiceMenu.show", "accept_job_postal", {name: "Leave from Go Postal?"});
      } else {
					mp.events.call("choiceMenu.show", "accept_job_postal", {name: "Enter in Go Postal?"});
      }
		} else if (mp.game.gameplay.getDistanceBetweenCoords(mp.players.local.position.x, mp.players.local.position.y, mp.players.local.position.z, 78.92, 112.55, 81.17, true) < 1.60) {
      mp.events.callRemote("gopostal.team.startday");
    }
	}
  if (PostalJob.vehicle !== undefined) {
    let bonePos = PostalJob.vehicle.getWorldPositionOfBone(PostalJob.vehicle.getBoneIndexByName('platelight'));
    let distance = vdist(mp.players.local.position, bonePos);
    if (distance < 1.0) {
      if (PostalJob.hasbox === true) {
        PostalJob.hasbox = false;
        // mp.players.local.taskPlayAnim("anim@narcotics@trash", "drop_front", 8.0, 0.0, -1, 49, 0, false, false, false);
        mp.players.local.freezePosition(true);
        setTimeout(() => {
           mp.players.local.freezePosition(false);
           mp.events.callRemote("put.gopostal.object");
        }, 150); // 1500
        return;
      }
    }
  }
});

function deleteJobTimer() {
  if (PostalJob.timeout !== undefined) {
       clearTimeout(PostalJob.timeout);
       delete PostalJob.timeout;
  }
}
function deleteStorage() {
  if (PostalJob.storage.marker !== undefined) {
    PostalJob.storage.marker.destroy(), PostalJob.storage.omarker.destroy(), PostalJob.storage.shape.destroy(), PostalJob.storage.oshape.destroy();
    delete PostalJob.storage.marker, delete PostalJob.storage.omarker, delete PostalJob.storage.shape, delete PostalJob.storage.oshape;
  }
}
function deleteJobVehicle() {
  if (PostalJob.vehicle !== undefined) delete PostalJob.vehicle;
}
function deleteUsebleBlips() {
  for (let i = 0; i < PostalJob.blips.length; i++) if (PostalJob.blips[i] !== undefined) PostalJob.blips[i].destroy(), PostalJob.colshapes[i].destroy(), PostalJob.markers[i].destroy();
  PostalJob.blips = [], PostalJob.colshapes = [], PostalJob.markers = [];
}
function deleteMainBlip() {
  if (PostalJob.blip !== undefined) {
       PostalJob.blip.setRoute(false);
       PostalJob.blip.destroy();
       delete PostalJob.blip;
  }
}
