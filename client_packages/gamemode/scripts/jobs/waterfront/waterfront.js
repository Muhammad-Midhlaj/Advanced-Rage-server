const JobWaterFront = {
  job_colshape: undefined,
  job_marker: undefined,
  job_gmarker: undefined,
  job_blip: undefined,
  clothes_marker: undefined,
  keyDownE: undefined,
  job_status: -1,
  timeout: undefined,
  item: undefined
};

mp.events.add("time.add.back.watefront", (player) => {
    try
    {
      if (JobWaterFront.timeout === undefined) {
         JobWaterFront.timeout = setTimeout(() => {
            mp.events.callRemote("leave.watefront.job");
         }, 60000);
      }
    }
    catch (err) {
        mp.game.graphics.notify(err);
        return;
    }
});
mp.events.add("time.remove.back.waterfront", (player) => {
    try
    {
      if (JobWaterFront.timeout !== undefined) {
           clearTimeout(JobWaterFront.timeout);
           delete JobWaterFront.timeout;
      }
    }
    catch (err) {
        mp.game.graphics.notify(err);
        return;
    }
});

mp.events.add('create.waterfront.clothmarker', (type) => {
	try
	{
		if (type === false)
			JobWaterFront.job_marker.destroy();
		else
			JobWaterFront.job_marker = mp.markers.new(20, new mp.Vector3(-413.36, -2699.29, 6.00), 1, { visible: true, color: [255, 0, 0, 180], rotation: 180 });
	} catch (err) {
		mp.game.graphics.notify("~r~" + err);
		return;
	}
});

mp.events.add('setWaterFrontJobStatus', (status) => { JobWaterFront.keyDownE = status; });
mp.events.add('getWaterFrontJobStatus', (status) => {
  if (status !== "cancel") {
    mp.events.call("prompt.show", `Press <span>Е</span> for interaction`);
    JobWaterFront.keyDownE = status;
  } else {
    JobWaterFront.keyDownE = null;
  }
});
mp.keys.bind(0x45, false, function () { // E key
	if (JobWaterFront.keyDownE !== undefined) {
		if (mp.game.gameplay.getDistanceBetweenCoords(mp.players.local.position.x, mp.players.local.position.y, mp.players.local.position.z, -410.083, -2700.001, 6.000, true) < 1.75){
      mp.gui.cursor.show(true, true);
      if (JobWaterFront.keyDownE === true) {
          mp.events.call("choiceMenu.show", "accept_job_waterfront", {name: "Leave the Port?"});
      } else {
					mp.events.call("choiceMenu.show", "accept_job_waterfront", {name: "Get a job in the Port?"});
      }
		}
	}
});
mp.events.add('playerEnterColshape', (shape) => {
    if (shape === JobWaterFront.job_colshape) if (JobWaterFront.job_status !== -1) mp.events.callRemote("use.watefrontfunctions.job",  JobWaterFront.job_status);
});

mp.events.add('create.watefront.boxveh', (entity) => {
  try
	{
    JobWaterFront.item = mp.objects.new(mp.game.joaat("prop_boxpile_06b"), new mp.Vector3(entity.position.x, entity.position.y, entity.position.z), { rotation: 0.0 });
    JobWaterFront.item.attachTo(entity.handle, 4, 0.0, 0.075, 0.075, 0.0, 0.0, 0.0, true, true, true, false, 0, true);
	} catch (err) {
		mp.game.graphics.notify("~r~" + err);
		return;
	}
});
mp.events.add('create.watefront.loader', (posx, posy, posz, contin, status) => {
  try
	{
    JobWaterFront.job_status = status;
		if (JobWaterFront.job_gmarker !== undefined) {
			JobWaterFront.job_gmarker.destroy();
			JobWaterFront.job_blip.destroy();
      JobWaterFront.job_colshape.destroy();
      delete JobWaterFront.job_gmarker, delete JobWaterFront.job_blip, delete JobWaterFront.job_colshape;
		}
    if (JobWaterFront.item !== undefined) {
      JobWaterFront.item.destroy();
      delete JobWaterFront.item;
    }
		if (contin === true) {
			JobWaterFront.job_gmarker = mp.markers.new(1, new mp.Vector3(posx, posy, posz - 1.35), 0.65, { visible: true, dimension: 0, color: [255, 0, 0, 190] });
			JobWaterFront.job_blip = mp.blips.new(1, new mp.Vector3(posx, posy), { alpha: 255, color: 1 });
      JobWaterFront.job_colshape = mp.colshapes.newSphere(posx, posy, posz, 2);
		}
	} catch (err) {
		mp.game.graphics.notify("~r~" + err);
		return;
	}
});

mp.events.add('create.watefront.item', (contin, create, status, posx, posy, posz) => {
  try
	{
    JobWaterFront.job_status = status;
		if (JobWaterFront.job_gmarker !== undefined) {
			JobWaterFront.job_gmarker.destroy();
			JobWaterFront.job_blip.destroy();
      JobWaterFront.job_colshape.destroy();
      delete JobWaterFront.job_gmarker, delete JobWaterFront.job_blip, delete JobWaterFront.job_colshape;
		}
    if (JobWaterFront.item !== undefined) {
      JobWaterFront.item.destroy();
      delete JobWaterFront.item;
    }
		if (contin === true) {
			JobWaterFront.job_gmarker = mp.markers.new(1, new mp.Vector3(posx, posy, posz - 1.2), 1, { visible: true, dimension: 0, color: [255, 0, 0, 180] });
			JobWaterFront.job_blip = mp.blips.new(1, new mp.Vector3(posx, posy), { alpha: 255, color: 1 });
      JobWaterFront.job_colshape = mp.colshapes.newSphere(posx, posy, posz, 1);
		}
	} catch (err) {
		mp.game.graphics.notify("~r~" + err);
		return;
	}
});

/*mp.events.add('entityStreamIn', (entity) => {
	if (entity.type == 'vehicle') {
		if (entity.getVariable('syncWaterFront') == true) {
			let itm = mp.objects.new(mp.game.joaat("prop_boxpile_06b"), new mp.Vector3(entity.position.x, entity.position.y, entity.position.z), { rotation: 0.0 });
			itm.attachTo(entity.handle, 4, 0.0, 0.075, 0.075, 0.0, 0.0, 0.0, true, true, true, false, 0, true);
			entity.item_wfront = itm;
		}
	}
});

mp.events.add('entityStreamOut', (entity) => {
	if (entity.type == 'vehicle') {
		if (entity.getVariable('syncWaterFront')) if (entity.item_wfront) entity.item_wfront.destroy();
	}
});
*/
