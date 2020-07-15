mp.keys.bind(0x45, false, function () { // E key
	if (mp.players.local.getVariable("keydownevariable2") != undefined) if (mp.players.local.getVariable("keydownevariable2") === true && !openMenu) mp.events.call("showRooberMenu");
});
let openMenu;
const natives = {
	SET_BLIP_SPRITE: "0xDF735600A4696DAF",
	SET_BLIP_ALPHA: "0x45FF974EEE1C8734",
	SET_BLIP_COLOUR: "0x03D7FB09E75D6B7E"
};

let blipz, blipz2, bmark, time = -1, timer, timebar, vehic, find = false, vehname, hack = -1, hacktimer, gmoney, gtimer;
const timerBarLib = require("gamemode/scripts/timebar.js");
let rooberVehColShape = mp.colshapes.newSphere(126.815, -3105.666, 5.595, 4); // Colshapes for delivery of the stolen CU

mp.events.add('createRooberPlace', (x, y, z, sec, vname, veh, givemoneys) => {
	try
	{
		blipz = mp.game.ui.addBlipForRadius(x, y, z, 250);
		mp.game.invoke(natives.SET_BLIP_ALPHA, blipz, 175);
		mp.game.invoke(natives.SET_BLIP_COLOUR, blipz, 1);
		mp.game.ui.notifications.showWithPicture("message", "Simon", "You have to find ~b~" + vname + " ~w~and to bring it to the port!", "CHAR_SIMEON", 2);
		time = sec;
		vehic = veh;
		vehname = vname;
		gmoney = givemoneys;
		timeBar = new timerBarLib.TimerBar("LEFT");
		gtimer = new timerBarLib.TimerBar("Profit");
    gtimer.text = "$" + givemoneys;
		gtimer.textColor = [114, 204, 114, 255];
	  let moneylock = (gmoney / 100) * 30;
		timer = setInterval(function() {
		   if (time > -1) {
			   time--;

			   if (vehic === undefined) {
				   mp.events.callRemote("destroy.roober.place");
					 mp.game.ui.notifications.showWithPicture("message", "Simon", "~r~You failed the task!", "CHAR_SIMEON", 2);
				   return;
			   }

			    timeBar.text = getSynsedTimeBar(time);
					if (moneylock < gmoney) getHealthMoney(givemoneys);
			    if (find == false)  {
				     let dist = mp.game.gameplay.getDistanceBetweenCoords(mp.players.local.position.x, mp.players.local.position.y, mp.players.local.position.z, vehic.position.x, vehic.position.y, vehic.position.z, true);
				     if (dist < 10.0) {
					      mp.game.graphics.notify("You found ~b~" + vehname);
					      mp.game.ui.removeBlip(blipz);
					      blipz = null;
					      blipz = mp.blips.new(669, new mp.Vector3(x, y, z), { alpha: 255, color: 74, name: vehname });
				        blipz2 = mp.blips.new(473, new mp.Vector3(126.815, -3105.666, 5.595), { alpha: 255, color: 74, scale: 0.8, name: "warehouse" });
				        bmark = mp.markers.new(1, new mp.Vector3(126.815, -3105.666, 4.095), 4, { visible: true, color: [0, 125, 255, 175] });
					      blipz2.setRoute(true);
					      blipz2.setRouteColour(74);
					      find = true;
				     }
			    } else {
					if (mp.players.local.vehicle == vehic) {
						if (blipz.getAlpha() !== 0) blipz.setAlpha(0);
					} else {
						if (blipz.getAlpha() !== 255) blipz.setAlpha(255);
					}
				}

		   }
	     if (hack > 0) {
			   hacktimer.progress += 0.01;
			   hack--;
		   }
			 if (hack == 0) {
				 mp.players.local.freezePosition(false);
				 mp.game.graphics.notify("~r~You finished breaking of transport!");
				 hacktimer.visible = false;
				 hacktimer = null;
				 mp.players.local.stopAnimTask("veh@break_in@0h@p_m_one@", "low_force_entry_ps", 0);
				 hack = -1;
			 }
		   if (time == 0) {
			   mp.events.callRemote("destroy.roober.place");
			   mp.game.ui.notifications.showWithPicture("message", "Simon", "~r~You failed the task!", "CHAR_SIMEON", 2);
		   }
		}, 1000);
	} catch (err) {
		mp.game.graphics.notify("~r~" + err);
		return;
	}
});

mp.events.add('startRoobingVehicle', (time) => {
	mp.players.local.clearTasksImmediately();
  mp.players.local.freezePosition(true);
	mp.players.local.taskPlayAnim("veh@break_in@0h@p_m_one@", "low_force_entry_ps", 8.0, 0.0, -1, 49, 0, false, false, false);
	mp.game.graphics.notify("~r~You began breaking of transport!");
	hacktimer = new timerBarLib.TimerBar("Breaking", true);
	hacktimer.progress = 0;
	hacktimer.pbarFgColor = [0, 125, 255, 220];
	hacktimer.pbarBgColor = [255, 255, 255, 255];
	hack = time;
});

mp.events.add("showRooberMenu", () => {
	openMenu = true;
	mp.events.call("selectMenu.show", "rooberauto_menu");
});
mp.events.add("hideRooberMenu", () => {
	openMenu = false;
	mp.events.call("selectMenu.hide", "rooberauto_menu");
});
mp.events.add("selectMenu.itemSelected", (menuName, itemName, itemValues, itemIndex) => {
	if (menuName === "rooberauto_menu") {
    mp.events.call("hideRooberMenu");
    if (itemName === "Автоугон") mp.events.callRemote("create.roober.place");
    //else
	}
});
mp.events.add('destroyRooberPlace', () => {
	destroyInfo();
});

function getSynsedTimeBar(time) {
	try
	{
    let minute, second;
    minute = Math.trunc(time / 60);
    second = time - minute * 60;
    if (second < 10) second = "0" + second;
    if (minute < 10) minute = "0" + minute;
    let text = minute + ":" + second;
    return text;
  }
  catch (err) {
    mp.game.graphics.notify("~r~" + err);
    return;
  }
}

function destroyInfo() {
	find = false;
	clearInterval(timer);
	blipz.destroy();
	timeBar.visible = false;
	gtimer.visible = false
	if (hack > -1) {
		hacktimer.visible = false;
		hack = -1;
		mp.players.local.stopAnimTask("veh@break_in@0h@p_m_one@", "low_force_entry_ps", 0);
	}
	if (blipz2 !== undefined) {
		blipz2.setRoute(false);
		blipz2.destroy();
		bmark.destroy();
		blipz2 = null, bmark = null;
  }
	timer = null, timebar = null, gtimer = null, hacktimer = null, blipz = null, vehname = null, vehic = null, time = -1, gmoney = null;
}

function getHealthMoney(gmoneys) {
	try
	{
		if (vehic !== undefined) {
			let countback = gmoneys / 1000;
			gmoney = Math.round(vehic.getBodyHealth() * countback);
			gtimer.text = "$" + gmoney;
		}
	}
	catch (err) {
		mp.game.graphics.notify("~r~" + err);
		return;
	}
}

mp.events.add('render', () => {
   if (find == true) {
	   blipz.setCoords(vehic.position);
	   mp.game.graphics.drawText(`Get to ~b~places of elimination of transport`, [0.5, 0.95], { scale: 0.9, color: [255, 255, 255, 255], font: 4, outline: true });
    } else if (find == false && blipz != undefined) {
	  mp.game.graphics.drawText(`Steal ~b~` + vehname, [0.5, 0.95], { scale: 0.9, color: [255, 255, 255, 255], font: 4, outline: true });
    }
});

mp.events.add('playerEnterColshape', (shape) => {
    if (shape === rooberVehColShape) {
		if (mp.players.local.vehicle && vehic !== undefined) {
			if (mp.players.local.vehicle == vehic) {
				mp.events.call("ShowMidsizedShardMessage", "STEALING IS COMPLETE", "You earned ~g~$" + gmoney, 2, false, true, 6000);
				mp.events.callRemote("pass.roober.place", gmoney);
			}
		}
    }
});
