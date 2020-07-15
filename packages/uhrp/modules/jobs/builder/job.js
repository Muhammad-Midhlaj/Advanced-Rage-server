// Дополнительный элементы: player.jobubildercloth - статус ( одет / не одет ), player.money - деньги, player.emoney - деньги, которые накапливается при сдаче коробки, player.jobbuilderfloor - отметка полученного значения.

const JobBuilder = {
    storage: 1000,
    boxes: [10, 15],
    place_1: new mp.Vector3(382.85, 2909.74, 49.30), // Самосвал
    place_2: new mp.Vector3(1225.19, 1880.16, 78.89), // Цемент
    place_3: new mp.Vector3(-147.62, -952.64, 21.28), // Самосвал
    place_4: new mp.Vector3(-175.82, -1029.61, 27.27), // Цемент
    out_boxes_positions: [
      { x: -149.93, y: -1072.59, z: 30.14, xs: 1.0, floor: 1 },
      { x: -176.97, y: -1102.98, z: 30.14, xs: 1.0, floor: 1 },
      { x: -173.96, y: -1065.82, z: 30.14, xs: 1.0, floor: 1 },
      { x: -175.99, y: -1103.14, z: 36.14, xs: 1.25, floor: 2 },
      { x: -150.16, y: -1072.50, z: 36.14, xs: 1.25, floor: 2 },
      { x: -169.62, y: -1064.14, z: 36.14, xs: 1.25, floor: 2 },
      { x: -165.28, y: -1094.82, z: 42.14, xs: 1.5, floor: 3 },
      { x: -180.80, y: -1061.41, z: 42.14, xs: 1.5, floor: 3 },
      { x: -162.07, y: -1099.03, z: 42.14, xs: 1.5, floor: 3 }
    ],
    out_boxes_colshapes: [
        mp.colshapes.newSphere(-149.93, -1072.59, 30.14, 1.0),
        mp.colshapes.newSphere(-176.97, -1102.98, 30.14, 1.0),
        mp.colshapes.newSphere(-173.96, -1065.82, 30.14, 1.0),
        mp.colshapes.newSphere(-175.99, -1103.14, 36.14, 1.0),
        mp.colshapes.newSphere(-150.16, -1072.50, 36.14, 1.0),
        mp.colshapes.newSphere(-169.62, -1064.14, 36.14, 1.0),
        mp.colshapes.newSphere(-165.28, -1094.82, 42.14, 1.0),
        mp.colshapes.newSphere(-180.80, -1061.41, 42.14, 1.0),
        mp.colshapes.newSphere(-162.07, -1099.03, 42.14, 1.0)
    ]
};

mp.blips.new(566, new mp.Vector3(-95.052, -1014.401, 27.275), { name: 'Construction', scale: 0.7, shortRange: true}); // Блип на карте
let jobcolshape = mp.colshapes.newSphere(-95.052, -1014.401, 27.275, 1.5); // Колшейп для устройства на работу
let jobclothcolshape = mp.colshapes.newSphere(-97.220, -1014.106, 27.275, 1.0); // Колшейп для раздевалки
let jobstoragebitemcolshape = mp.colshapes.newSphere(-154.730, -1077.751, 21.685, 1.0); // Колшейп для раздевалки

mp.events.add("playerDeath", function playerDeathHandler(player, reason, killer) {
    if (player.job === 7) {
        /*if (player.jobubildercloth == true) {
            player.utils.info("Вы уволились of стройки!");
            if (player.emoney > 0) {
              player.utils.setMoney(player.money + player.emoney);
              player.utils.info(`Заработано: ${player.emoney}$`);
            }
            delete player.emoney;
            player.utils.changeJob(0);
            delete player.jobubildercloth;
            delete player.jobbuilderfloor;
            delete player.body.denyUpdateView;
            player.call('createJobBuilderRoom', [false]);
            player.call("createJobBuilderMarkBlip", [ false, false, -154.730, -1077.751, 21.685 ]);
        }*/
        stopJobDay(player);
        leaveJob(player);
    }
});
mp.events.add("playerQuit", function playerQuitHandler(player, exitType, reason) {
  if (player.job === 7) {
    leaveVehicle(player);
  }
});
mp.events.add("playerStartEnterVehicle", function playerStartEnterVehicleHandler(player, vehicle, seat) {
   if (player.jobbuilderfloor > -1 && !player.builder) stopBringingBox(player);
});
function stopBringingBox(player) {
  player.call("createJobBuilderMarkBlip", [ true, false, -154.730, -1077.751, 21.685 ] );
  player.jobbuilderfloor = -1;
}
module.exports.stopBringingBox = stopBringingBox;
mp.events.add("playerEnterColshape", function onPlayerEnterColShape(player, shape) {
    try
    {
        if (shape == jobcolshape && !player.vehicle) {
            if (player.job === 7)
                player.setVariable("keydownevariable", true);
            else
                player.setVariable("keydownevariable", false);
        }
        else if (shape == jobclothcolshape && player.job === 7) {
          if (player.jobbuilderfloor != -1) {
              player.utils.error("First, take the box to the warehouse!");
              return;
          }

          if (player.jobubildercloth == true) {
              player.utils.success("You've finished your day!");
              leaveVehicle(player);
          }
          changeBuilderClothes(player);
        }
        else if (shape == jobstoragebitemcolshape && player.jobubildercloth == true && player.job === 7) takeBoxBuilder(player);
        else if (JobBuilder.out_boxes_colshapes.includes(shape) && player.job === 7 && player.jobubildercloth == true) {
            let num = JobBuilder.out_boxes_colshapes.indexOf(shape);
            if (num == player.jobbuilderfloor) putBoxBuilder(player);
        }
    }
    catch (err){
        console.log(err);
        return;
    }
});
mp.events.add("playerExitColshape", function onPlayerExitColShape(player, shape) {
    if (shape === jobcolshape) player.setVariable("keydownevariable", undefined);
});

mp.events.add("job.builder.agree", (player) => {
    try
    {
        if (player.job !== 0 && player.job !== 7) {
          player.utils.warning("You're already working somewhere!");
          return;
        }
        if (player.job === 7) {
            if (player.jobubildercloth == true) {
                player.utils.error("You're not done yet!");
                return;
            }

            leaveJob(player);
        } else {
            player.utils.success("You've got a job on a construction site!");
            player.utils.warning("Now get refreshed for the start of the day!");
            player.utils.changeJob(7);
            player.jobbuilderfloor = -1;
            player.call('createJobBuilderRoom', [true]);
            player.setVariable("keydownevariable", true);
        }
    } catch (err){
        console.log(err);
        return;
    }
});
function leaveJob(player) {
  player.utils.info("You quit the construction site!");
  leaveVehicle(player);
  player.call('createJobBuilderRoom', [false]);
  player.setVariable("keydownevariable", false);
  player.utils.putObject();
  player.utils.changeJob(0);
  delete player.jobubildercloth;
  delete player.jobbuilderfloor;
  delete player.jobbuilderveh;
}
function mustTakeBoxLoader(player, id) {
  let pos = id === 3347205726 ? JobBuilder.place_1 : JobBuilder.place_2;
  player.call("create.job.builder.mark", [ pos.x, pos.y, pos.z, true ]);
  player.utils.error("Head to the boot site!");
}
function stopBringingLoad(player) {
  let pos = player.builder.model === 3347205726 ? JobBuilder.place_1 : JobBuilder.place_2;
  player.call("create.job.builder.mark", [ pos.x, pos.y, pos.z, true ]);
}
module.exports.stopBringingLoad = stopBringingLoad;
mp.events.add("use.builderfunctions.job", (player) => {
    try
    {
      if (!player.builder) return;
      if (player.job === 7) {
        let vehicle = player.builder;
        if (!player.vehicle) {
          if (player.getVariable("attachedObject")) {
             player.utils.putObject();
             vehicle.buildernum++;
             player.notify("Filled: ~r~" + vehicle.buildernum + " ~w~of ~r~" + vehicle.buildermax);
             if (vehicle.buildernum === vehicle.buildermax) {
               player.utils.success("Head to the unloading site!");
               let pos = vehicle.model === 3347205726 ? JobBuilder.place_3 : JobBuilder.place_4;
               player.call("createJobNeedBuilderMarkBlip", [ pos.x, pos.y, pos.z ]);
               return;
             }
             let pos = vehicle.model === 3347205726 ? JobBuilder.place_1 : JobBuilder.place_2;
             player.call("create.job.builder.mark", [ pos.x, pos.y, pos.z, true ]);
          } else {
             if (player.dist(vehicle.position) > 500) return player.utils.error("Your transport is too far away!");
             if (player.dist(vehicle.position) < 9) return player.utils.error("Your transport is too close!");
             let box = vehicle.model === 3347205726 ? "prop_bucket_01a" : "prop_feed_sack_01";
             player.utils.takeObject(box);
             player.utils.warning("Put the box in the rear transport sector!");
             player.call("create.job.builder.load");
          }
        } else {
          if (vehicle.buildernum === vehicle.buildermax) {
            player.utils.info("Wait for the unloading to end!");
            player.call("startBuilderUnload");
          }
        }
      }
    }
    catch (err) {
        console.log(err);
        return;
    }
});
mp.events.add("stop.builder.unload", (player) => {
    try
    {
      if (!player.builder) return;
      if (player.job === 7) {
        let vehicle = player.builder;
        if (vehicle.buildermax < 1) return player.utils.error("You're not loaded!");
        if (vehicle.buildernum === vehicle.buildermax) {
          let mon = vehicle.model === 3347205726 ? mp.economy["build_salary_sec"].value : mp.economy["build_salary_third"].value;
          let money = (vehicle.buildernum * mp.economy["build_salary_box"].value) + mon;
          if (isNaN(money)) return player.utils.error("You're not loaded!");
          player.utils.success("Unloading is overlooked, you earned $" + money);
          player.utils.setMoney(player.money + money);
          vehicle.buildermax = getRandomNumber(JobBuilder.boxes[0], JobBuilder.boxes[1]);
          vehicle.buildernum = 0;
          mustTakeBoxLoader(player, vehicle.model);
        }
      }
    }
    catch (err) {
        console.log(err);
        return;
    }
});
mp.events.add("playerEnterVehicle", function playerEnterVehicleHandler(player, vehicle, seat) {
	if (vehicle.owner === -7 && player.job === 7 && seat === -1) {
     if (player.jobubildercloth) {
       let skill = player.jobSkills[7 - 1];
       if (skill < 50) {
          player.notify("Experience: ~r~" + skill + " ~w~of ~r~" + 50);
          player.removeFromVehicle();
          return;
       }

       if (player.builder && player.builder !== vehicle)  {
          player.utils.error("You've already taken one vehicle!");
          player.removeFromVehicle();
          return;
       }

       if (vehicle.builder) {
         if (!mp.players.exists(vehicle.builder)) delete vehicle.builder;
         else if (vehicle.builder.builder != vehicle) delete vehicle.builder;
         else if (vehicle.builder !== player) {
           player.utils.error("This transport is already occupied by other workers!");
           player.removeFromVehicle();
         } else {
           player.call("time.remove.back.builder");
         }
         return;
       }
       if (!haveLicense(player, vehicle)) return;
       if (mp.convertMinutesToLevelRest(player.minutes).level < 2) {
         player.removeFromVehicle();
         return player.utils.error("You haven't reached level 2!");
       }
       vehicle.builder = player;
       player.builder = vehicle;
       player.call("create.job.builder.vehicle", [ vehicle ]);
       mustTakeBoxLoader(player, vehicle.model);
       vehicle.utils.setFuel(vehicle.vehPropData.maxFuel);
       vehicle.buildermax = getRandomNumber(JobBuilder.boxes[0], JobBuilder.boxes[1]);
       vehicle.buildernum = 0;
       /*
         vehicle.position = new mp.Vector3(1208.90, 1887.56, 77.66);
         vehicle.rotation = 360;
         player.builder.model; 3347205726 - самосвал | 475220373 - бетон
       */
     } else {
       player.utils.error("You haven't started the day!");
       player.removeFromVehicle();
     }
  }
});
mp.events.add("playerExitVehicle", function playerExitVehicleHandler(player, vehicle) {
  if (vehicle.owner === -7 && player.job === 7) {
    if (vehicle === player.builder) {
      if (player.dist(JobBuilder.place_1) < 100 || player.dist(JobBuilder.place_2) < 100) {
         player.call("time.add.back.builder", [300000]);
         player.utils.warning("You have 5 minutes to get back in transport.");
         return;
      }
      player.call("time.add.back.builder", [60000]);
      player.utils.warning("You have 1 minute to get back in transport.");
    }
  }
});
mp.events.add("leave.builder.job", (player) => {
    try
    {
      changeBuilderClothes(player);
      leaveJob(player);
    }
    catch (err) {
        console.log(err);
        return;
    }
});
function leaveVehicle(player) {
  let vehicle = player.builder;
  delete player.builder;
  if (vehicle) {
    // forks_attach
    if (vehicle === vehicle) player.removeFromVehicle();
    player.call("time.remove.back.builder");
    setTimeout(() => {
      try {
        vehicle.repair();
        vehicle.dimension = 0;
        vehicle.position = vehicle.spawnPos;
        vehicle.rotation = new mp.Vector3(0, 0, vehicle.spawnPos.h);
        vehicle.utils.setFuel(vehicle.vehPropData.maxFuel);
        vehicle.engine = false;
        delete vehicle.builder, delete vehicle.buildermax, delete vehicle.buildernum;
      } catch (err) {
          console.log(err);
          return;
      }
    }, 200);
  }
};
function haveLicense(player, vehicle) {
    if (!vehicle.license) return true;
    var docs = player.inventory.getArrayByItemId(16);
    for (var sqlId in docs) {
        if (docs[sqlId].params.licenses.indexOf(vehicle.license) != -1) return true;
    }
    return false;
}
function stopJobDay(player) {
  if (player.jobubildercloth === false) return;
  player.jobubildercloth = false;
  player.call("createJobBuilderMarkBlip", [ false, false, -154.730, -1077.751, 21.685 ]);
  // Возвращаем одежду character
  delete player.body.denyUpdateView;
  player.body.loadItems();
}
function changeBuilderClothes(player){
    try
    {
        if (player.job !== 7) return;
        if (player.jobubildercloth == true) {
          stopJobDay(player);
        } else {
            if (player.vehicle) return;
            player.utils.success("You started the day!");
            player.jobubildercloth = true;
            player.call("createJobBuilderMarkBlip", [ true, false, -154.730, -1077.751, 21.685 ]);
            player.body.clearItems();
            player.body.denyUpdateView = true;
            if (player.sex === 1) {
              // Одежда мужская
              player.setClothes(3, 61, 0, 2);
              player.setClothes(4, 36, 0, 2);
              player.setClothes(6, 12, 0, 2);
              player.setClothes(8, 59, 1, 2);
              player.setClothes(11, 57, 0, 2);
              // player.setProp(0, 0, 0); - Голова ( наушники )
            } else {
              // Одежда женская
              player.setClothes(3, 62, 0, 2);
              player.setClothes(4, 35, 0, 2);
              player.setClothes(6, 26, 0, 2);
              player.setClothes(8, 36, 1, 2);
              player.setClothes(11, 50, 0, 2);
              // player.setProp(0, 0, 0); - Голова ( наушники )
            }
        }
    } catch (err){
        console.log(err);
        return;
    }
};

function takeBoxBuilder(player){
    try
    {
        if (player.jobbuilderfloor == -1) {
          player.utils.takeObject("hei_prop_heist_wooden_box");
          player.jobbuilderfloor = getRandomNumber(0, 8);
          player.notify("You started the day ... ~r~ " + JobBuilder.out_boxes_positions[player.jobbuilderfloor].floor + " ~w~этаж!");
          player.call("createJobBuilderMarkBlip", [ true, true, JobBuilder.out_boxes_positions[player.jobbuilderfloor].x, JobBuilder.out_boxes_positions[player.jobbuilderfloor].y, JobBuilder.out_boxes_positions[player.jobbuilderfloor].z ]);
        } else {
            player.utils.error("You've already taken the box from the warehouse!");
        }
    } catch (err){
        console.log(err);
        return;
    }
};

function putBoxBuilder(player){
    try
    {
        player.utils.putObject();
        let money = Math.round(mp.economy["build_salary"].value * JobBuilder.out_boxes_positions[player.jobbuilderfloor].xs);
        player.utils.setMoney(player.money + money);
        player.call("createJobBuilderMarkBlip", [ true, false, -154.730, -1077.751, 21.685 ] );
        player.utils.setJobSkills(7, player.jobSkills[7 - 1] + 1);
        if (player.jobSkills[7 - 1] === 50) player.utils.warning("You have opened the 2nd stage of work!");
        player.utils.success(`Заработано: ${money}$`);
        player.jobbuilderfloor = -1;
    } catch (err){
        console.log(err);
        return;
    }
};

function getRandomNumber(min, max) {
    try
    {
        return Math.floor(Math.random() * (max - min)) + min;
    } catch (err){
        console.log(err);
        return -1;
    }
}
