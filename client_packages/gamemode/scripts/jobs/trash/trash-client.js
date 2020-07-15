const JobTrash = {
  keyDownE: undefined,
  blip: undefined,
  colshape: undefined,
  object: undefined,
  marker: undefined,
  smarker: undefined,
  vehicle: undefined,
  timeout: undefined,
  trashinfo: undefined,
  count: 0,
  request: false,
  jobtype: 0
}
const timerBarLib = require("gamemode/scripts/timebar.js");

mp.events.add('setTrashJobStatus', (status) => { JobTrash.keyDownE = status; });
mp.events.add('getTrashJobStatus', (status) => {
  if (status !== "cancel") {
    mp.events.call("prompt.show", `Press <span>Е</span> for interaction`);
    JobTrash.keyDownE = status;
  } else {
    JobTrash.keyDownE = null;
  }
});
mp.keys.bind(0x45, false, function () { // E key
	if (JobTrash.keyDownE !== undefined) {
		if (mp.game.gameplay.getDistanceBetweenCoords(mp.players.local.position.x, mp.players.local.position.y, mp.players.local.position.z, -629.18, -1634.45, 26.04, true) < 1.75){
      mp.gui.cursor.show(true, true);
      if (JobTrash.keyDownE === true) {
          mp.events.call("choiceMenu.show", "accept_job_trash", {name: "Quit the Recycling Center?"});
      } else {
					mp.events.call("choiceMenu.show", "accept_job_trash", {name: "Get a job at a Recycling Center?"});
      }
		}
	}

  if (JobTrash.jobtype === 1) {
    if (JobTrash.vehicle !== undefined && JobTrash.request === false) {
      let bonePos = JobTrash.vehicle.getWorldPositionOfBone(JobTrash.vehicle.getBoneIndexByName('boot'));
      let distance = vdist(mp.players.local.position, bonePos);
      if (distance < 3) {
        JobTrash.request = true;
        mp.players.local.taskPlayAnim("anim@narcotics@trash", "drop_front", 8.0, 0.0, -1, 49, 0, false, false, false);
        mp.players.local.freezePosition(true);
        setTimeout(() => {
           mp.players.local.freezePosition(false);
           mp.events.callRemote("send.trash.end");
        }, 1500);
        return;
      }
    }
  }
});

mp.events.add('createPlaceTrasher', (x, y, z, status) => {
  deleteDefaultData(true);
  if (status === true) {
    JobTrash.marker = mp.markers.new(1, new mp.Vector3(x, y, z), 1, { visible: true, color: [255, 0, 0, 40], rotation: 180 });
		JobTrash.object = mp.objects.new(mp.game.joaat("hei_prop_heist_binbag"), new mp.Vector3(x, y, z + 0.5), { rotation: 0.0 });
    JobTrash.blip = mp.blips.new(1, new mp.Vector3(x, y), { alpha: 255, color: 3, name: "Garbage Tank" });
    JobTrash.blip.setRoute(true);
    JobTrash.blip.setRouteColour(3);
    JobTrash.colshape = mp.colshapes.newSphere(x, y, z + 1.0, 1);
  }
});

mp.events.add('update.trash.vehicle', (vehicle, min, max) => {
  try {
    if (vehicle === "cancel") {
      if (JobTrash.timeout !== undefined) {
           clearTimeout(JobTrash.timeout);
           delete JobTrash.timeout;
      }
      if (JobTrash.smarker) JobTrash.smarker.destroy();
      if (JobTrash.trashinfo) JobTrash.trashinfo.visible = false;
      delete JobTrash.vehicle, delete JobTrash.trashinfo, delete JobTrash.smarker;
      return;
    }
    JobTrash.vehicle = vehicle;
    if (!JobTrash.smarker) JobTrash.smarker = mp.markers.new(1, new mp.Vector3(-467.69, -1719.06, 18.69 - 1.30), 6, { visible: true, color: [255, 0, 0, 50], rotation: 180 });
    if (!JobTrash.trashinfo) JobTrash.trashinfo = new timerBarLib.TimerBar("CAPACITY");
    JobTrash.trashinfo.text = min + "/" + max;
    JobTrash.count = min;
  }
  catch (err) {
      mp.game.graphics.notify(err);
      return;
  }
});
mp.events.add("time.add.back.trash", (player) => {
    try
    {
      if (JobTrash.timeout === undefined) {
         JobTrash.timeout = setTimeout(() => {
            mp.events.callRemote("leave.trash.job");
         }, 180000);
      }
    }
    catch (err) {
        mp.game.graphics.notify(err);
        return;
    }
});
mp.events.add("time.remove.back.trash", (player) => {
    try
    {
      if (JobTrash.timeout !== undefined) {
           clearTimeout(JobTrash.timeout);
           delete JobTrash.timeout;
      }
    }
    catch (err) {
        mp.game.graphics.notify(err);
        return;
    }
});
mp.events.add('playerEnterColshape', (shape) => {
   if (shape === JobTrash.colshape && !mp.players.local.vehicle && JobTrash.jobtype !== 1) {
     if (JobTrash.count >= 30) {
       mp.events.call("nWarning", "Your transport is full, dump the garbage in a dump!");
       return;
     }
     JobTrash.jobtype = 1;
     mp.players.local.taskPlayAnim("anim@move_m@trash", "pickup", 8.0, 0.0, -1, 48, 0, false, false, false);
     mp.players.local.freezePosition(true);
     setTimeout(() => {
       mp.players.local.freezePosition(false);
       mp.events.call("nWarning", "Put the bag in the back of the garbage truck!");
       mp.events.call("prompt.show", `Press <span>E</span> to trow the bag in the back of the truck!`);
       deleteDefaultData(false);
       mp.events.callRemote("take.trash.box");
     }, 650);
   }
});

function deleteDefaultData(type) {
  try {
    if (JobTrash.blip !== undefined) {
      JobTrash.blip.setRoute(false);
      JobTrash.blip.destroy();
      JobTrash.colshape.destroy();
      JobTrash.object.destroy();
      JobTrash.marker.destroy();
      delete JobTrash.blip, delete JobTrash.colshape, delete JobTrash.object, JobTrash.marker
    }
    JobTrash.request = false;
    if (type === true) JobTrash.jobtype = 0;
  }
  catch (err) {
      mp.game.graphics.notify(err);
      return;
  }
}
// Animations
mp.game.streaming.requestAnimDict("anim@narcotics@trash");
mp.game.streaming.requestAnimDict("anim@move_m@trash");
/*while (!mp.game.streaming.hasAnimDictLoaded("anim@narcotics@trash")) mp.game.wait(0);
while (!mp.game.streaming.hasAnimDictLoaded("anim@move_m@trash")) mp.game.wait(0);*/
