let CEF; // ЗАМЕНИТЬ ПРИ ПОДКЛЮЧЕНИИ К БРАУЗЕРУ.
let keyDownE;
const JobTaxi = {
  type: true,
  colshape: undefined,
  colshape_go: undefined,
  marker: undefined,
  blip: undefined,
  blacklist: [],
  orders_today: 0,
  earnmoney_today: 0,
  stats_today: 0,
  interval: undefined,
  time: -1
};
const Natives = {
    GET_BLIP_INFO_ID_ITERATOR: '0x186E5D252FA50E7D',
    GET_FIRST_BLIP_INFO_ID: '0x1BEDE233E6CD2A1F',
    GET_BLIP_INFO_ID_TYPE: '0xBE9B0959FFD0779B',
    GET_NEXT_BLIP_INFO_ID: '0x14F96AA50D6FBEA7',
    DOES_BLIP_EXIST: '0xA6DB27D19ECBB7DA',
};

mp.events.add('setTaxiJobStatus', (status) => { keyDownE = status; });
mp.events.add('getTaxiJobStatus', (status) => {
  if (status !== "cancel") {
    mp.events.call("prompt.show", `Press <span>Е</span> for interaction`);
    keyDownE = status;
  } else {
    keyDownE = null;
  }
});
mp.events.add('update.taxi.stats', (money) => {
 JobTaxi.orders_today++;
 JobTaxi.earnmoney_today += money;
 if (CEF) CEF.execute(`app.updateTaxiStats(${JobTaxi.orders_today}, ${JobTaxi.earnmoney_today});`);
});
mp.events.add('clear.taxi.filtration', (type) => {
  JobTaxi.blacklist = [];
  mp.game.ui.notifications.showWithPicture('Information', 'Downtown Cab Co.', 'You ~y~dumped ~w~filtration of orders.', 'CHAR_TAXI');
});
mp.events.add('add.taxi.filtration', (name) => {
  if (!JobTaxi.blacklist.includes(name)) {
    JobTaxi.blacklist.push(name);
    mp.game.ui.notifications.showWithPicture('Information', 'Downtown Cab Co.',  '~y~' + name + ' ~w~it is added to filtration and it will not be displayed.', 'CHAR_TAXI');
  }
});
mp.events.add('show.taxi.menu', (name) => {
  if (!CEF) {
    CEF = mp.browsers.new("package://gamemode/scripts/jobs/taxi/ui/panel/index.html");
    CEF.execute(`app.setNameForPassword('${name}')`);
  }
});
mp.events.add('control.taxi.menu', (type, del) => {
  if (type === true) {
    if (CEF) CEF.execute("document.getElementById('app').style.display = 'block';");
    if (del === true) JobTaxi.time = -1;
  } else {
    if (CEF) CEF.execute("document.getElementById('app').style.display = 'none';");
    if (del === false) JobTaxi.time = 10; // 10 * 6 = 60 секунд
  }
});
mp.events.add('cant.finish.taxi.job', () => {
  mp.game.ui.notifications.showWithPicture('Information', 'Downtown Cab Co.', 'You ~y~did not finish ~w~call.', 'CHAR_TAXI');
});
mp.events.add('remove.taxi.order', (name) => {
  if (CEF) CEF.execute(`app.removeFromTaxi('${name}')`);
});
mp.events.add('take.taxi.order', (name) => {
  mp.events.callRemote('take.taxi.order', name);
});
mp.events.add('accept.taxi.order', (pos) => {
    JobTaxi.blip = mp.blips.new(280, pos, { alpha: 255, color: 5, scale: 0.9, name: "Клиент" });
    JobTaxi.blip.setRoute(true);
    JobTaxi.blip.setRouteColour(5);
    JobTaxi.colshape = mp.colshapes.newSphere(pos.x, pos.y, pos.z, 6);
    JobTaxi.marker = mp.markers.new(1, new mp.Vector3(pos.x, pos.y, pos.z - 1.5), 12, { visible: true, dimension: 0, color: [255, 0, 0, 40] });
    if (CEF) {
       CEF.execute(`app.setselect();`);
       CEF.execute(`app.startTime(${0}, "${getZoneName(pos)}");`);
    }
});
mp.events.add('destroy.taxi.colshape', () => {
  if (JobTaxi.blip !== undefined) {
    JobTaxi.blip.setRoute(false);
    JobTaxi.blip.destroy();
  }
  if (JobTaxi.colshape_go !== undefined) JobTaxi.colshape_go.destroy();
  if (JobTaxi.marker !== undefined) JobTaxi.marker.destroy();
  if (JobTaxi.colshape !== undefined) JobTaxi.colshape.destroy();
  delete JobTaxi.blip, delete JobTaxi.colshape, delete JobTaxi.colshape_go, delete JobTaxi.marker;
});
mp.keys.bind(0x60, false, function () { // Numpad 0
  if (mp.players.local.vehicle && JobTaxi.interval !== undefined) mp.events.callRemote("key.taxi.down.numpad_zero");
});
mp.events.add('playerEnterColshape', (shape) => {
    if (shape === JobTaxi.colshape && mp.players.local.vehicle) mp.events.callRemote("enter.taxi.colshape");
});
mp.events.add('playerExitColshape', (shape) => {
    if (shape === JobTaxi.colshape_go) mp.events.callRemote("cancel.taxi.player");
});
mp.events.add('displace.taxi.menu', () => {
  if (JobTaxi.type === true) {
     if (CEF) CEF.execute('app.taxiPage = false;');
     JobTaxi.type = false;
  } else {
     if (CEF) CEF.execute('app.taxiPage = true;');
     JobTaxi.type = true;
  }
});
mp.events.add('delete.taxi.player.colshape', () => {
  if (JobTaxi.colshape_go !== undefined) JobTaxi.colshape_go.destroy();
  if (JobTaxi.marker !== undefined) JobTaxi.marker.destroy();
  delete JobTaxi.colshape_go, delete JobTaxi.marker;
});
mp.events.add('create.taxi.player.colshape', () => {
  JobTaxi.marker = mp.markers.new(1, new mp.Vector3(mp.players.local.position.x, mp.players.local.position.y, mp.players.local.position.z - 1.5), 12, { visible: true, dimension: 0, color: [255, 0, 0, 40] });
  JobTaxi.colshape_go = mp.colshapes.newSphere(mp.players.local.position.x, mp.players.local.position.y, mp.players.local.position.z, 6);
});
mp.events.add('update.taxi.interval', (type) => {
  if (type) {
    JobTaxi.interval = setInterval(function() {
       mp.events.callRemote("update.taxi.orders");
       if (JobTaxi.time > -1) JobTaxi.time--;
       if (JobTaxi.time === 0) {
         mp.events.callRemote("end.taxi.day");
         return;
       }
    }, 6000);
  } else {
    clearInterval(JobTaxi.interval);
    delete JobTaxi.interval;
  }
});
mp.events.add('update.taxi.orders', (arr) => {
  let orders = JSON.parse(arr);
  orders.forEach(function(order) {
    if (!JobTaxi.blacklist.includes(order.client_name) && order.taxist_name === undefined) {
      if (CEF) CEF.execute(`app.addToTaxi('${order.client_name}', '${Math.trunc(mp.game.gameplay.getDistanceBetweenCoords(mp.players.local.position.x, mp.players.local.position.y, mp.players.local.position.z, order.start_position.x, order.start_position.y, order.start_position.z, true))}');`);
    }
  });
});
mp.events.add('get.taxi.waypoint.driver', (name, money, pos) => {
     if (JobTaxi.blip !== undefined) {
       JobTaxi.blip.setRoute(false);
       JobTaxi.blip.destroy();
     }
     if (JobTaxi.colshape !== undefined) JobTaxi.colshape.destroy();
     if (JobTaxi.marker !== undefined) JobTaxi.marker.destroy();
     delete JobTaxi.blip, delete JobTaxi.colshape, delete JobTaxi.marker;

     JobTaxi.blip = mp.blips.new(1, pos, { alpha: 255, color: 5, scale: 0.9, name: "Пункт назначения" });
     JobTaxi.blip.setRoute(true);
     JobTaxi.blip.setRouteColour(5);

     if (CEF) CEF.execute(`app.setInfo("${name}", ${money}, "${getZoneName(pos)}");`);
});
mp.events.add('get.taxi.waypoint', (target) => {
   let pos = getWaypointPosition();
   if (pos === undefined) {
     mp.game.ui.notifications.showWithPicture('Information', 'Downtown Cab Co.', 'You ~y~did not establish ~w~tag on the card.', 'CHAR_TAXI');
     return;
   }

   let dist = mp.game.gameplay.getDistanceBetweenCoords(mp.players.local.position.x, mp.players.local.position.y, mp.players.local.position.z, pos.x, pos.y, 0, false);
   mp.events.callRemote("set.taxi.waypoint", target, dist, pos.x, pos.y, mp.players.local.position.z);
});
mp.events.add('cancel.taxi.order', (type) => {
  if (JobTaxi.blip !== undefined) {
    JobTaxi.blip.setRoute(false);
    JobTaxi.blip.destroy();
  }
  if (JobTaxi.colshape !== undefined) JobTaxi.colshape.destroy();
  if (JobTaxi.marker !== undefined) JobTaxi.marker.destroy();
  if (JobTaxi.interval !== undefined && type === true) clearInterval(JobTaxi.interval);
  JobTaxi.type = true;
  if (type === true) {
    JobTaxi.blacklist = [];
    JobTaxi.time = -1;
  }
  delete JobTaxi.blip, delete JobTaxi.colshape, delete JobTaxi.marker, delete JobTaxi.interval;
});
mp.events.add('close.taxi.control', () => {
  if (CEF) CEF.execute(`app.deleteselect()`);
});
mp.events.add('close.taxi.menu', () => {
  if (CEF) {
    CEF.destroy();
    CEF = null;
    // При подключение в браузер удалять все бесполезное с меню.
  }
});
mp.keys.bind(0x45, false, function () { // E key
	if (keyDownE !== undefined) {
		if (mp.game.gameplay.getDistanceBetweenCoords(mp.players.local.position.x, mp.players.local.position.y, mp.players.local.position.z, 894.892, -179.171, 74.700, true) < 4){
      mp.gui.cursor.show(true, true);
      if (keyDownE === true) {
          mp.events.call("choiceMenu.show", "accept_job_taxi", {name: "to leave the Taxi?"});
      } else {
					mp.events.call("choiceMenu.show", "accept_job_taxi", {name: "to enter the Taxi?"});
      }
		}
	}
  if (mp.players.local.vehicle) mp.events.callRemote("key.taxi.down.e");
});

// Functions
function getZoneName(vector) {
    const getStreet = mp.game.pathfind.getStreetNameAtCoord(vector.x, vector.y, vector.z, 0, 0);
    zoneName = mp.game.ui.getLabelText(mp.game.zone.getNameOfZone(vector.x, vector.y, vector.z));
    streetName = mp.game.ui.getStreetNameFromHashKey(getStreet.streetName);
    if (getStreet.crossingRoad && getStreet.crossingRoad !== getStreet.streetName) streetName += ` / ${mp.game.ui.getStreetNameFromHashKey(getStreet.crossingRoad)}`;
    return zoneName;
}
function getWaypointPosition() {
    const interator = mp.game.invoke(Natives.GET_BLIP_INFO_ID_ITERATOR);
    let blipHandle = mp.game.invoke(Natives.GET_FIRST_BLIP_INFO_ID, interator);
    do {
        if (mp.game.invoke(Natives.GET_BLIP_INFO_ID_TYPE, blipHandle)) {
            return mp.game.ui.getBlipInfoIdCoord(blipHandle);
        }
        blipHandle = mp.game.invoke(Natives.GET_NEXT_BLIP_INFO_ID, interator);
    } while (mp.game.invoke(Natives.DOES_BLIP_EXIST, blipHandle));
    return undefined;
}
