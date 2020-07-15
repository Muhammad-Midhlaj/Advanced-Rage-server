mp.events.add('playerJoin', player => {
    try
    {
        player.skill = 0;
    } catch (err){
        console.log(err);
        return;
    }
});

// Вся система готова, playerJoin удаляешь, и подставляешь свои деньги и скилл.

// mp.blips.new(669, new mp.Vector3(158.976, -3082.372, 6.014), { name: 'Автоугон', color: 1, shortRange: true}); // Блип на карте
let rooberColShape = mp.colshapes.newSphere(158.976, -3082.372, 6.014, 1.5); // Колшейп для взаимодействия с NPC

const rooberinfo = {
  vehicles: {
    low_vehicles: ["dilettante", "blade", "picador", "virgo", "voodoo"],
    mid_vehicles: ["blista", "prairie", "oracle", "sentinel", "rancherxl"],
    high_vehicles: ["baller", "dubsta", "cog55", "alpha", "buffalo"],
    best_vehicles: ["bestiagts", "ninef", "raiden", "bullet", "carbonizzare"]
  },
  earnmoney: {
    low_vehicles: [100, 100, 100, 100, 100],
    mid_vehicles: [200, 200, 200, 200, 200],
    high_vehicles: [300, 300, 300, 300, 300],
    best_vehicles: [400, 400, 400, 400, 400]
  },
  experience: [ 0.5, 0.25, 0.125, 0.0625 ],
  positions: [
    { x: 1691.173, y: 3288.316, z: 40.311, rot: 34 },
    { x: 1716.905, y: 3322.305, z: 40.387, rot: 13.366 },
    { x: 1747.404, y: 3323.445, z: 40.314, rot: 298.102 },
    { x: 1551.363, y: 3515.973, z: 35.155, rot: 114.643 },
    { x: 1357.610, y: 3616.541, z: 34.051, rot: 107.543 },
    { x: 895.187, y: 3571.604, z: 32.760, rot: 270.973 },
    { x: 384.396, y: 3562.908, z: 32.461, rot: 82.017 },
    { x: 347.199, y: 3392.124, z: 35.567, rot: 292.020 },
    { x: 523.885, y: 3090.019, z: 39.629, rot: 64.248 },
    { x: 638.094, y: 2776.056, z: 41.150, rot: 183.798 },
    { x: 1040.390, y: 2239.356, z: 43.379, rot: 182.525 },
    { x: 1138.514, y: 2098.512, z: 54.959, rot: 89.474 },
    { x: 1238.329, y: 1858.193, z: 78.520, rot: 133.736 },
    { x: 809.592, y: 2154.420, z: 51.442, rot: 155.947 },
    { x: 355.224, y: 2558.453, z: 42.684, rot: 294.981 },
    { x: 193.499, y: 2760.367, z: 42.591, rot: 6.786 },
    { x: 110.345, y: 3679.376, z: 38.919, rot: 359.544 },
    { x: 95.940, y: 3761.342, z: 38.634, rot: 246.872 },
    { x: 22.464, y: 3658.412, z: 38.977, rot: 62.389 },
    { x: -2175.584, y: 4274.257, z: 48.213, rot: 330.808 },
    { x: -3045.681, y: 538.530, z: 2.534, rot: 90.183 },
    { x: -805.454, y: 5389.937, z: 33.681, rot: 172.446 },
    { x: -394.259, y: 6076.446, z: 30.665, rot: 47.557 },
    { x: -442.120, y: 6137.016, z: 30.643, rot: 45.888 },
    { x: -106.528, y: 6365.910, z: 30.643, rot: 134.375 },
    { x: -116.051, y: 6351.192, z: 30.655, rot: 315.253 },
    { x: -193.962, y: 6268.169, z: 30.653, rot: 133.055 },
    { x: -290.214, y: 6182.125, z: 30.656, rot: 46.037 },
    { x: -287.745, y: 6303.367, z: 30.656, rot: 315.167 },
    { x: 2907.129, y: 4340.364, z: 49.457, rot: 204.615 },
    { x: 2975.161, y: 3484.954, z: 70.606, rot: 93.334 },
    { x: 2652.140, y: 3499.742, z: 53.067, rot: 337.748 },
    { x: 2572.875, y: 3174.467, z: 49.992, rot: 323.644 },
    { x: 2409.457, y: 3034.031, z: 47.317, rot: 181.019 },
    { x: 2343.236, y: 3142.560, z: 47.372, rot: 169.008 },
    { x: 1297.765, y: 323.534, z: 81.155, rot: 236.246 },
    { x: 1034.477, y: -144.587, z: 73.352, rot: 133.289 },
    { x: 981.823, y: -147.005, z: 73.403, rot: 237.107 },
    { x: 955.839, y: -197.941, z: 72.351, rot: 58.122 },
    { x: 875.283, y: -961.174, z: 25.448, rot: 270.229 }
  ],
  max_orders: [ 20, 15, 10, 5 ],
  count_skill: [
    { low: 0, max: 25 },
    { low: 26, max: 50 },
    { low: 51, max: 75 },
    { low: 76, max: 100 }
  ],
  max_range: [
    { range: 270.0, time: 1200 },
    { range: 350.0, time: 1500 },
    { range: 400.0, time: 1800 }
  ]
};
let rooberstorage = {
    max_orders: [ 20, 15, 10, 5 ],
    unfree_positions: []
};
let roobersplaces = [];
class RooberPlace {
    constructor(owner, vehicle, position, time, range, skill, number, vtype, money) {
        this.owner = owner;
        this.vehicle = vehicle;
        this.position = position;
        this.time = time;
        this.range = range;
        this.skill = skill;
        this.number = number;
        this.vtype = vtype;
        this.money = money;
    }
}
function getRandomNumber(min, max) {
    try
    {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    } catch (err){
        console.log(err);
        return -1;
    }
}
function findinArray(array, value) {
    try
    {
        if (array.indexOf) {
            return array.indexOf(value);
          }
          for (var i = 0; i < array.length; i++) {
            if (array[i] === value) return i;
          }
          return -1;
    } catch (err){
        console.log(err);
        return -1;
    }
}
function getRooberPlace(player) {
    try
    {
        for (let i = 0; i < roobersplaces.length; i++) {
            if (roobersplaces[i].owner == player) {
                return roobersplaces[i];
            }
        }
        return undefined;
    } catch (err) {
        console.log(err);
        return undefined;
    }
}
function getPlayerSkill(player) {
    try
    {
        for (let i = 0; i < rooberinfo.count_skill.length; i++) if (player.skill >= rooberinfo.count_skill[i].low && player.skill <= rooberinfo.count_skill[i].max) return i;
    } catch (err) {
        console.log(err);
        return 0;
    }
}
function getAllOrders() {
    try
    {
        let num = rooberstorage.max_orders[0] + rooberstorage.max_orders[1] + rooberstorage.max_orders[2] + rooberstorage.max_orders[3];
        return num;
    } catch (err){
        console.log(err);
        return -1;
    }
}
function getFreeOrders(player) {
    try
    {
        if (getAllOrders < 1) return -1;
        let updskill = getPlayerSkill(player);
        if (rooberstorage.max_orders[updskill] >= 1) return updskill;
        switch (updskill) {
            case 0:
               return -1;
            case 1:
               if (rooberstorage.max_orders[0] >= 1) return 0;
               return -1;
            case 2:
               if (rooberstorage.max_orders[1] >= 1) return 1;
               if (rooberstorage.max_orders[0] >= 1) return 0;
               return -1;
            case 3:
               if (rooberstorage.max_orders[2] >= 1) return 2;
               if (rooberstorage.max_orders[1] >= 1) return 1;
               if (rooberstorage.max_orders[0] >= 1) return 0;
               return -1;
        }
    } catch (err){
        console.log(err);
        return -1;
    }
}
function getFreePosition() {
    try
    {
        if (rooberstorage.unfree_positions.length >= rooberinfo.positions.length) return -1;
        if (rooberstorage.unfree_positions.length < 20) {
            let isnum = getRandomNumber(0, rooberinfo.positions.length);
            if (!rooberstorage.unfree_positions.includes(isnum)) return isnum;
        }
        for (let i = 0; i < rooberstorage.unfree_positions.length; i++) if (findinArray(rooberstorage.unfree_positions, i) === -1) return i;
    } catch (err){
        console.log(err);
        return -1;
    }
}
function getSkillVeh(sk, num) {
    try
    {
        switch (sk) {
            case 0:
               return rooberinfo.vehicles.low_vehicles[num];
            case 1:
               return rooberinfo.vehicles.mid_vehicles[num];
            case 2:
               return rooberinfo.vehicles.high_vehicles[num];
            case 3:
               return rooberinfo.vehicles.best_vehicles[num];
        }
    } catch (err){
        console.log(err);
        return -1;
    }
}
function getSkillMoney(sk, num) {
    switch (sk) {
        case 0:
           return rooberinfo.earnmoney.low_vehicles[num];
        case 1:
           return rooberinfo.earnmoney.mid_vehicles[num];
        case 2:
           return rooberinfo.earnmoney.high_vehicles[num];
        case 3:
           return rooberinfo.earnmoney.best_vehicles[num];
    }
}
function PassRooberVehicle(player, money) {
    try
    {
        if (getRooberPlace(player) === undefined) return;
        if (money > getRooberPlace(player).money) return;
        player.utils.setMoney(player.money + money); // Выдаём деньги
        player.skill += rooberinfo.experience[getRooberPlace(player).skill]; // Выдаём опыт
        DestoryRooberPlace(player);
        player.notify("You've earned ~g~$" + money);
    } catch (err){
        console.log(err);
        return -1;
    }
}
function DestoryRooberPlace(player) {
    try
    {
        if (getRooberPlace(player) !== undefined) {
            player.call("destroyRooberPlace");
            if (getRooberPlace(player).vehicle !== undefined) {
                if (player.vehicle) if (player.vehicle.roober !== undefined) if (player.vehicle.roober === player) player.removeFromVehicle();
                getRooberPlace(player).vehicle.destroy();
            }
            rooberstorage.unfree_positions.splice(rooberstorage.unfree_positions.indexOf(getRooberPlace(player).number), 1);
            roobersplaces.splice(roobersplaces.indexOf(getRooberPlace(player)), 1);
        }
    } catch (err){
        console.log(err);
        return -1;
    }
}
function CreateRooberPlace(player) {
    try
    {
        if (getRooberPlace(player) !== undefined) {
            player.notify("~r~First, finish the previous order!");
            return;
        }

        if (getFreeOrders(player) == -1 || getFreePosition() == -1) {
            player.notify("~r~No free orders!");
            return;
        }

        player.notify("Wait for information from ~r~Simon!");
        let sk = getPlayerSkill(player);
        let col = getRandomNumber(0, 255);
        let ii = getFreePosition();
        let pos = rooberinfo.positions[ii];
        let vehrand = getRandomNumber(0, rooberinfo.vehicles.low_vehicles.length);
        let rangenum = getRandomNumber(0, 2);
        let vehname = getSkillVeh(sk, vehrand);
        let savemoney = getSkillMoney(sk, vehrand);
        let veh = mp.vehicles.new(mp.joaat(vehname), new mp.Vector3(pos.x, pos.y, pos.z), { heading: pos.rot, numberPlate: "Union", color: [[col, col, col],[col, col, col]] });
        veh.roober = player;
        let roober = new RooberPlace(player, veh, pos, rooberinfo.max_range[rangenum].time, rooberinfo.max_range[rangenum].range, sk, ii, vehrand, savemoney);
        roobersplaces.push(roober);
        rooberstorage.unfree_positions.push(ii);
        setTimeout(function() {
          try {
            if (player === undefined) {
                if (veh !== undefined) veh.destroy();
                rooberstorage.unfree_positions.splice(rooberstorage.unfree_positions.indexOf(ii), 1);
                roobersplaces.splice(roobersplaces.indexOf(getRooberPlace(player)), 1);
                return;
            }
            player.call("createRooberPlace", [ pos.x, pos.y, pos.z, rooberinfo.max_range[rangenum].time,  vehname, veh, savemoney ]);
          } catch (err) {
              console.log(err);
              return;
          }
        }, 15000);
    } catch (err){
        console.log(err);
        return;
    }
}

mp.events.add("create.roober.place", (player) => {
    try
    {
        CreateRooberPlace(player);
    } catch (err){
        console.log(err);
        return;
    }
});
mp.events.add("pass.roober.place", (player, money) => {
    try
    {
        PassRooberVehicle(player, money);
    } catch (err){
        console.log(err);
        return;
    }
});
mp.events.add("destroy.roober.place", (player) => {
    try
    {
        DestoryRooberPlace(player);
    } catch (err){
        console.log(err);
        return;
    }
});
mp.events.add("playerQuit", function playerQuitHandler(player, exitType, reason) {
    try
    {
        if (getRooberPlace(player) !== undefined) DestoryRooberPlace(player);
    } catch (err) {
        console.log(err);
        return;
    }
});
mp.events.add("playerStartEnterVehicle", function playerStartEnterVehicleHandler(player, vehicle, seat) {
    try
    {
        if (vehicle.roober !== undefined) {
            if (vehicle.roober === player) {
               if (vehicle.rooberlock === undefined) {
                   player.call("startRoobingVehicle", [getRandomNumber(50, 100)]);
                   vehicle.rooberlock = true;
               }
            }
        }
    } catch (err) {
        console.log(err);
        return;
    }
});
mp.events.add("playerEnterVehicle", function playerEnterVehicleHandler(player, vehicle, seat) {
    try
    {
        if (vehicle.roober !== undefined)  {
            if (vehicle.roober !== player) {
                player.notify("~r~У You don't have the keys to this ts!");
                player.removeFromVehicle();
            }
        }
    } catch (err) {
        console.log(err);
        return;
    }
});
mp.events.add("playerEnterColshape", function onPlayerEnterColShape(player, shape) {
    try
    {
        if (!player.vehicle) {
            if (shape == rooberColShape) {
                return;
                player.notify("~g~Press E for interaction!");
                player.setVariable("keydownevariable2", true);
            }
        } else {
            // if (shape == rooberVehColShape) if (player.vehicle.roober !== undefined) if (player.vehicle.roober === player) PassRooberVehicle(player, 9999);
        }
    }
    catch (err){
        console.log(err);
        return;
    }
});
mp.events.add("playerExitColshape", function onPlayerExitColShape(player, shape) {
    try
    {
      if (shape == rooberColShape) {
        player.setVariable("keydownevariable2", undefined);
        player.call("hideRooberMenu");
      }
    } catch (err) {
        console.log(err);
        return;
    }
});

console.log("[CarRoober] CarRoober in Los Santos started!");
