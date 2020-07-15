const JobBuilder = {
  timeout: undefined,
	blip: undefined,
	marker: undefined,
	colshape: undefined,
	vehicle: undefined
};

mp.events.add("time.remove.back.builder", (player) => {
    try
    {
      if (JobBuilder.timeout !== undefined) {
           clearTimeout(JobBuilder.timeout);
           delete JobBuilder.timeout;
      }
    }
    catch (err) {
        mp.game.graphics.notify(err);
        return;
    }
});
let oshape = mp.colshapes.newSphere(-95.052, -1014.401, 27.275, 1);
let marker;

mp.events.add('createJobBuilderRoom', (type) => {
	try
	{
		if (type === false)
			marker.destroy();
		else
			marker = mp.markers.new(20, new mp.Vector3(-97.220, -1014.106, 27.075), 1, { visible: true, color: [255, 0, 0, 180], rotation: 180 });
	} catch (err) {
		mp.game.graphics.notify("~r~" + err);
		return;
	}
});
mp.events.add('create.job.builder.vehicle', (vehicle) => {
	try
	{
     JobBuilder.vehicle = vehicle;
	} catch (err) {
		mp.game.graphics.notify("~r~" + err);
		return;
	}
});
mp.events.add('time.add.back.builder', (time) => {
    try
    {
      if (JobBuilder.timeout === undefined) {
         JobBuilder.timeout = setTimeout(() => {
            mp.events.callRemote("leave.builder.job");
         }, time);
      }
    }
    catch (err) {
        mp.game.graphics.notify(err);
        return;
    }
});
mp.events.add('create.job.builder.mark', (posx, posy, posz, type) => {
	try
	{
    deleteData();
		if (type === true) {
			JobBuilder.blip = mp.blips.new(1, new mp.Vector3(posx, posy), { alpha: 255, color: 1, name: "Point appoinments" });
      JobBuilder.blip.setRoute(true);
			JobBuilder.blip.setRouteColour(1);
			JobBuilder.marker = mp.markers.new(1, new mp.Vector3(posx, posy, posz - 1.3), 0.8, { visible: true, dimension: 0, color: [255, 0, 0, 180] });
			JobBuilder.colshape = mp.colshapes.newSphere(posx, posy, posz, 1);
		}
	} catch (err) {
		mp.game.graphics.notify("~r~" + err);
		return;
	}
});
mp.events.add('createJobNeedBuilderMarkBlip', (posx, posy, posz) => {
	try
	{
    deleteData();
		JobBuilder.marker = mp.markers.new(1, new mp.Vector3(posx, posy, posz - 1.4), 4, { visible: true, dimension: 0, color: [255, 0, 0, 110] });
		JobBuilder.blip = mp.blips.new(1, new mp.Vector3(posx, posy), { alpha: 255, color: 1 });
		JobBuilder.blip.setRoute(true);
		JobBuilder.blip.setRouteColour(1);
		JobBuilder.colshape = mp.colshapes.newSphere(posx, posy, posz, 2);
	} catch (err) {
		mp.game.graphics.notify("~r~" + err);
		return;
	}
});
mp.events.add('createJobBuilderMarkBlip', (type, type2, posx, posy, posz) => {
	try
	{
    deleteData();
		if (type === true) {
			JobBuilder.marker = mp.markers.new(1, new mp.Vector3(posx, posy, posz - 1.2), 1, { visible: true, dimension: 0, color: [255, 0, 0, 180] });
			JobBuilder.blip = mp.blips.new(1, new mp.Vector3(posx, posy), { alpha: 255, color: 1 });
		}
	} catch (err) {
		mp.game.graphics.notify("~r~" + err);
		return;
	}
});

function deleteData() {
	if (JobBuilder.marker !== undefined) {
	  	JobBuilder.marker.destroy();
	  	JobBuilder.blip.setRoute(false);
	  	JobBuilder.blip.destroy();
		  delete JobBuilder.marker, delete JobBuilder.blip;
	}
	if (JobBuilder.colshape !== undefined) {
			JobBuilder.colshape.destroy();
			delete JobBuilder.colshape;
	}
}
mp.events.add('create.job.builder.load', () => {
	try
	{
		if (!JobBuilder.vehicle) {
			mp.game.graphics.notify("~r~TRANSPORT IS NOT FOUND!");
			return;
		}
    deleteData();
		let bonePos = JobBuilder.vehicle.getWorldPositionOfBone(JobBuilder.vehicle.getBoneIndexByName('platelight'));
		JobBuilder.blip = mp.blips.new(1, new mp.Vector3(bonePos.x, bonePos.y), { alpha: 255, color: 1, name: "Point appoinments" });
		JobBuilder.marker = mp.markers.new(1, new mp.Vector3(bonePos.x, bonePos.y, bonePos.z - 1.25), 1.35, { visible: true, dimension: 0, color: [255, 0, 0, 180] });
		JobBuilder.colshape = mp.colshapes.newSphere(bonePos.x, bonePos.y, bonePos.z, 1.35);
	} catch (err) {
		mp.game.graphics.notify("~r~" + err);
		return;
	}
});
mp.events.add('startBuilderUnload', () => {
  if (JobBuilder.vehicle) {
		JobBuilder.vehicle.freezePosition(true);
		setTimeout(() => {
			 if (JobBuilder.vehicle) JobBuilder.vehicle.freezePosition(false);
			 mp.events.callRemote("stop.builder.unload");
		}, 7000);
	}
});
mp.events.add('playerEnterColshape', (shape) => {
    if (shape === oshape) mp.events.call("prompt.show", `Press <span>Е</span> for interaction`);
		else if (shape === JobBuilder.colshape) mp.events.callRemote("use.builderfunctions.job");
});
mp.events.add('client.job.cursor.cancel', () => {
     mp.gui.cursor.show(false, false);
});
mp.keys.bind(0x45, false, function () { // E key
	if (mp.players.local.getVariable("keydownevariable") != undefined) {
		if (mp.game.gameplay.getDistanceBetweenCoords(mp.players.local.position.x, mp.players.local.position.y, mp.players.local.position.z, -95.052, -1014.401, 27.275, true) < 4){
      mp.gui.cursor.show(true, true);
			if (mp.players.local.getVariable("keydownevariable") === true)
					mp.events.call("choiceMenu.show", "accept_job_builder", {name: "to leave building?"});
			else
					mp.events.call("choiceMenu.show", "accept_job_builder", {name: "to enter building?"});
		}
	}
});
