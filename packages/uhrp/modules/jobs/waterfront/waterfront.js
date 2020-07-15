const i18n = require('../../uI18n');

// Создание BLIP
mp.blips.new(351, new mp.Vector3(-410.083, -2700.001, 6.000), {
    name: 'Port job',
    color: 5,
    scale: 0.7,
    shortRange: true
}); // Блип на карте
let jobWaterFrontColShape = mp.colshapes.newSphere(-410.083, -2700.001, 6.000, 1.5);
let jobWaterFrontColShapeClothes = mp.colshapes.newSphere(-413.36, -2699.29, 6.00, 1);
let radiusColShape = mp.colshapes.newSphere(-429.05, -2738.54, 4.80, 190);
const JobWaterFront = {
    markers: [{
            pos: new mp.Vector3(-471.43, -2687.80, 8.76),
            money_x: 1
        },
        {
            pos: new mp.Vector3(-469.09, -2685.48, 8.76),
            money_x: 1
        },
        {
            pos: new mp.Vector3(-466.62, -2682.96, 8.76),
            money_x: 1
        },
        {
            pos: new mp.Vector3(-464.37, -2680.49, 8.76),
            money_x: 1
        },
        {
            pos: new mp.Vector3(-461.86, -2678.06, 8.76),
            money_x: 1
        },
        {
            pos: new mp.Vector3(-459.39, -2675.72, 8.76),
            money_x: 1
        },

        {
            pos: new mp.Vector3(-450.38, -2666.83, 8.76),
            money_x: 1.20
        },
        {
            pos: new mp.Vector3(-448.02, -2664.47, 8.76),
            money_x: 1.20
        },
        {
            pos: new mp.Vector3(-445.50, -2661.89, 8.76),
            money_x: 1.20
        },
        {
            pos: new mp.Vector3(-442.84, -2659.54, 8.76),
            money_x: 1.20
        },
        {
            pos: new mp.Vector3(-440.51, -2657.30, 8.76),
            money_x: 1.20
        },
        {
            pos: new mp.Vector3(-438.12, -2654.82, 8.76),
            money_x: 1.20
        },

        {
            pos: new mp.Vector3(-431.08, -2643.24, 8.76),
            money_x: 1.35
        },
        {
            pos: new mp.Vector3(-428.64, -2640.60, 8.76),
            money_x: 1.35
        },
        {
            pos: new mp.Vector3(-426.16, -2638.14, 8.76),
            money_x: 1.35
        },
        {
            pos: new mp.Vector3(-423.81, -2635.63, 8.76),
            money_x: 1.35
        },
        {
            pos: new mp.Vector3(-421.28, -2633.02, 8.76),
            money_x: 1.35
        },
        {
            pos: new mp.Vector3(-418.80, -2630.59, 8.76),
            money_x: 1.35
        },

        {
            pos: new mp.Vector3(-410.04, -2621.99, 8.76),
            money_x: 1.5
        },
        {
            pos: new mp.Vector3(-407.63, -2619.45, 8.76),
            money_x: 1.5
        },
        {
            pos: new mp.Vector3(-405.08, -2617.03, 8.76),
            money_x: 1.5
        },
        {
            pos: new mp.Vector3(-402.64, -2614.43, 8.75),
            money_x: 1.5
        },
        {
            pos: new mp.Vector3(-400.10, -2612.02, 8.80),
            money_x: 1.5
        },
        {
            pos: new mp.Vector3(-397.59, -2609.45, 8.81),
            money_x: 1.5
        },
    ],
    storage: new mp.Vector3(-381.40, -2677.20, 6.02),
    markers_2: [{
            pos: new mp.Vector3(-443.06, -2793.09, 6.00),
            money_x: 1
        },
        {
            pos: new mp.Vector3(-452.34, -2801.94, 6.00),
            money_x: 1
        },
        {
            pos: new mp.Vector3(-461.55, -2810.76, 6.00),
            money_x: 1
        },
        {
            pos: new mp.Vector3(-478.93, -2829.16, 6.00),
            money_x: 1.10
        },
        {
            pos: new mp.Vector3(-497.23, -2846.97, 6.00),
            money_x: 1.10
        },
        {
            pos: new mp.Vector3(-506.39, -2856.06, 6.00),
            money_x: 1.15
        },
        {
            pos: new mp.Vector3(-524.12, -2874.18, 6.00),
            money_x: 1.15
        }
    ],
    load_num: [11, 12, 13, 15, 17, 18, 20],
    storage_2: [{
            pos: new mp.Vector3(-366.65, -2668.36, 6.00)
        },
        {
            pos: new mp.Vector3(-374.54, -2676.27, 6.00)
        }
    ]
};

function putBox(player) {
  try {
    if (player.waterfrontfloor === undefined) return;
    player.utils.putObject();
    let money = Math.round(mp.economy["waterfront_salary"].value * JobWaterFront.markers[player.waterfrontfloor].money_x);
    player.utils.success(`${i18n.get('basic', 'earned1', player.lang)} ${money}$`);
    player.utils.setMoney(player.money + money);
    player.utils.setJobSkills(8, player.jobSkills[8 - 1] + 1);
    if (player.jobSkills[8 - 1] === 50) player.utils.warning(`${i18n.get('uJobs', 'youOpen2ndStageJob', player.lang)}`);
    delete player.waterfrontfloor;
    delete player.boxwaterfront;
    sendBox(player);
  } catch (err) {
      console.log(err);
      return;
  }
}

function takeBox(player) {
    if (player.waterfrontfloor === undefined) return;
    player.utils.takeObject("hei_prop_heist_wooden_box");
    player.call("create.watefront.item", [true, true, 2, JobWaterFront.storage.x, JobWaterFront.storage.y, JobWaterFront.storage.z]);
    player.utils.error(`${i18n.get('uJobs', 'takeBoxToWarehouse', player.lang)}`);
    player.boxwaterfront = true;
}

function sendBox(player) {
    if (player.waterfrontfloor !== undefined) return;
    let place = getRandomNumber(0, JobWaterFront.markers.length);
    player.call("create.watefront.item", [true, false, 1, JobWaterFront.markers[place].pos.x, JobWaterFront.markers[place].pos.y, JobWaterFront.markers[place].pos.z]);
    player.waterfrontfloor = place;
    player.utils.error(`${i18n.get('uJobs', 'takeCrateToPlatform', player.lang)} ` + (place + 1) + " !");
}
mp.events.add("playerStartEnterVehicle", function playerStartEnterVehicleHandler(player, vehicle, seat) {
    if (player.job === 8) if (player.boxwaterfront) stopBringingBox(player);
});

function stopBringingBox(player) {
  try {
    let place = getRandomNumber(0, JobWaterFront.markers.length);
    player.call("create.watefront.item", [true, false, 1, JobWaterFront.markers[place].pos.x, JobWaterFront.markers[place].pos.y, JobWaterFront.markers[place].pos.z]);
    player.waterfrontfloor = place;
    delete player.boxwaterfront;
  } catch (err) {
      console.log(err);
      return;
  }
}
module.exports.stopBringingBox = stopBringingBox;

function mustTakeBoxLoader(player) {
  try {
    if (!player.porter) return;
    let place = getRandomNumber(0, JobWaterFront.storage_2.length);
    player.call("create.watefront.loader", [JobWaterFront.storage_2[place].pos.x, JobWaterFront.storage_2[place].pos.y, JobWaterFront.storage_2[place].pos.z, true, 1]);
    player.utils.error(`${i18n.get('uJobs', 'takeCrateFromWarehouse', player.lang)}`);
  } catch (err) {
      console.log(err);
      return;
  }
}

function takeBoxLoader(player) {
  try {
    if (!player.porter) return;
    // player.utils.takeObject("hei_prop_heist_wooden_box");
    let place = getRandomNumber(0, JobWaterFront.markers_2.length);
    player.call("create.watefront.loader", [JobWaterFront.markers_2[place].pos.x, JobWaterFront.markers_2[place].pos.y, JobWaterFront.markers_2[place].pos.z, true, 2]);
    player.call("create.watefront.boxveh", [player.porter]);
    player.utils.error(`${i18n.get('uJobs', 'unloadCrateToPlatform', player.lang)} ` + JobWaterFront.load_num[place] + " !");
    player.waterfrontfloor = place;
    // player.porter.setVariable("syncWaterFront", true);
  } catch (err) {
      console.log(err);
      return;
  }
}

function putBoxLoader(player) {
  try {
    if (!player.porter) return;
    let money = Math.round(mp.economy["waterfront_salary_sec"].value * JobWaterFront.markers_2[player.waterfrontfloor].money_x);
    player.utils.success(`${i18n.get('basic', 'earned1', player.lang)} ${money}$`);
    player.utils.setMoney(player.money + money);
    // player.porter.setVariable("syncWaterFront", null);
    delete player.waterfrontfloor;
    mustTakeBoxLoader(player);
  } catch (err) {
      console.log(err);
      return;
  }
}

function haveLicense(player, vehicle) {
    if (!vehicle.license) return true;
    var docs = player.inventory.getArrayByItemId(16);
    for (var sqlId in docs) {
        if (docs[sqlId].params.licenses.indexOf(vehicle.license) != -1) return true;
    }
    return false;
}

mp.events.add("use.watefrontfunctions.job", (player, num) => {
    try {
        switch (num) {
            case 1:
                if (player.vehicle) {
                    if (player.vehicle === player.porter && player.st_porter) takeBoxLoader(player);
                } else {
                    if (!player.st_porter) takeBox(player);
                }
                break;
            case 2:
                if (player.vehicle && player.st_porter) {
                    if (player.vehicle === player.porter) putBoxLoader(player);
                } else {
                    if (!player.st_porter) putBox(player);
                }
                break;
        }
    } catch (err) {
        console.log(err);
        return;
    }
});
mp.events.add("playerEnterVehicle", function playerEnterVehicleHandler(player, vehicle, seat) {
    if (vehicle.owner === -8 && player.job === 8 && seat === -1) {
        if (player.jobcloth) {
            let skill = player.jobSkills[8 - 1];
            if (skill < 50) {
                player.notify(`${i18n.get('basic', 'experience', player.lang)}` + skill + ` ~w~${i18n.get('basic', 'outOf', player.lang)} ~r~` + 50);
                player.removeFromVehicle();
                return;
            }

            if (player.porter && player.porter !== vehicle) {
                player.utils.error(`${i18n.get('uJobs', 'youAlreadyTakenVeh', player.lang)}`);
                player.removeFromVehicle();
                return;
            }

            if (vehicle.porter) {
                if (!mp.players.exists(vehicle.porter)) delete vehicle.porter;
                else if (vehicle.porter.porter != vehicle) delete vehicle.porter;
                else if (vehicle.porter !== player) {
                    player.utils.error(`${i18n.get('uJobs', 'vehAlreadyTaken', player.lang)}`);
                    player.removeFromVehicle();
                    return;
                } else {
                    player.call("time.remove.back.waterfront");
                    return;
                }
            }
            if (!haveLicense(player, vehicle)) return;

            vehicle.porter = player;
            player.porter = vehicle;
            player.st_porter = true;
            mustTakeBoxLoader(player);
            vehicle.utils.setFuel(vehicle.vehPropData.maxFuel);
            delete player.boxwaterfront;
        } else {
            player.utils.error(`${i18n.get('uJobs', 'noShiftStart', player.lang)}`);
            player.removeFromVehicle();
        }
    }
});
mp.events.add("playerExitVehicle", function playerExitVehicleHandler(player, vehicle) {
    if (vehicle.owner === -8 && player.job === 8) {
        if (vehicle === player.porter) {
            player.call("time.add.back.watefront");
            player.utils.warning(`${i18n.get('uJobs', 'returnToYourVehicle', player.lang)}`);
        }
    }
});
mp.events.add("playerEnterColshape", function onPlayerEnterColShape(player, shape) {
    try {
        if (!player.vehicle) {
            if (shape === jobWaterFrontColShape) player.call("getWaterFrontJobStatus", [player.job !== 8 ? false : true]);
            else if (shape === jobWaterFrontColShapeClothes) {
                if (player.job === 8) {
                    if (player.jobcloth === undefined) {
                        if (player.vehicle) return;
                        player.utils.success(`${i18n.get('uJobs', 'shiftStart', player.lang)}`);
                        player.jobcloth = true;
                        sendBox(player);
                        player.body.clearItems();
                        player.body.denyUpdateView = true;
                        if (player.sex === 1) {
                            // Одежда мужская
                            player.setClothes(3, 52, 0, 2);
                            player.setClothes(4, 36, 0, 2);
                            player.setClothes(6, 12, 0, 2);
                            player.setClothes(8, 59, 1, 2);
                            player.setClothes(11, 56, 0, 2);
                            player.setProp(0, 2, 0);
                        } else {
                            // Одежда женская
                            player.setClothes(3, 70, 0, 2);
                            player.setClothes(4, 35, 0, 2);
                            player.setClothes(6, 26, 0, 2);
                            player.setClothes(8, 36, 0, 2);
                            player.setClothes(11, 49, 0, 2);
                            player.setProp(0, 12, 0);
                        }
                    } else {
                        if (player.boxwaterfront === true) {
                            player.utils.error(`${i18n.get('uJobs', 'moveBoxToWarehouseFirst', player.lang)}`);
                            return;
                        }

                        delete player.body.denyUpdateView;
                        player.body.loadItems();
                        leaveVehicle(player);
                        player.utils.success(`${i18n.get('uJobs', 'finishedShift', player.lang)}`);
                        player.utils.warning(`${i18n.get('uJobs', 'noForgetProfit', player.lang)}`);
                        delete player.jobcloth;
                        delete player.waterfrontfloor;
                        delete player.boxwaterfront;
                        delete player.st_porter;
                        player.call("create.watefront.item", [false, false, -1, 0, 0, 0]);
                    }
                }
            }
        }
    } catch (err) {
        console.log(err);
        return;
    }
});
mp.events.add("playerDeath", function playerDeathHandler(player, reason, killer) {
    /*
    if (player.job === 8) {
      if (player.jobcloth !== undefined) {
        player.utils.success("Вы уволились с порта!");
        if (player.emoney > 0) {
          player.utils.setMoney(player.money + player.emoney);
          player.utils.info(`Заработано: ${player.emoney}$`);
        }
        delete player.body.denyUpdateView;
        player.body.loadItems();
        leaveVehicle(player);
        player.call("create.waterfront.clothmarker", [ false ]);
        player.call("create.watefront.item", [ false, false, -1, 0, 0, 0]);
        player.utils.changeJob(0);
        delete player.emoney, delete player.jobcloth, delete player.waterfrontfloor, delete player.boxwaterfront, delete player.st_porter;
      }
    }*/
    leavePort(player);
});
mp.events.add("playerExitColshape", function onPlayerExitColShape(player, shape) {
    try {
        if (shape === jobWaterFrontColShape) player.call("getWaterFrontJobStatus", ["cancel"]);
        else if (shape === radiusColShape) leavePort(player);
    } catch (err) {
        console.log(err);
        return;
    }
});

function leavePort(player) {
    if (player.job === 8) {
        player.utils.success(`${i18n.get('uJobs', 'youQuitJob', player.lang)}`);
        delete player.body.denyUpdateView;
        player.body.loadItems();
        player.utils.putObject();
        leaveVehicle(player);
        player.call("create.waterfront.clothmarker", [false]);
        player.call("create.watefront.item", [false, false, -1, 0, 0, 0]);
        player.utils.changeJob(0);
        delete player.jobcloth, delete player.waterfrontfloor, delete player.boxwaterfront, delete player.st_porter;
    }
}
mp.events.add("leave.watefront.job", (player) => {
    try {
        leavePort(player);
    } catch (err) {
        console.log(err);
        return;
    }
});

function leaveVehicle(player) {
    let vehicle = player.porter;
    delete player.porter;
    if (vehicle) {
        // forks_attach
        if (player.vehicle === vehicle) player.removeFromVehicle();
        player.call("time.remove.back.waterfront");
        setTimeout(() => {
            try {
                // vehicle.setVariable("syncWaterFront", null);
                vehicle.repair();
                vehicle.dimension = 0;
                vehicle.position = vehicle.spawnPos;
                vehicle.rotation = new mp.Vector3(0, 0, vehicle.spawnPos.h);
                vehicle.utils.setFuel(vehicle.vehPropData.maxFuel);
                vehicle.engine = false;
                delete vehicle.porter;
            } catch (err) {
                console.log(err);
                return;
            }
        }, 200);
    }
};
mp.events.add("playerQuit", function playerQuitHandler(player, exitType, reason) {
    if (player.job === 8) leaveVehicle(player); // leaveVehicle(player);
});
mp.events.add("job.waterfront.agree", (player) => {
    try {
        if (player.job !== 0 && player.job !== 8) {
            player.utils.warning(`${i18n.get('uJobs', 'youHaveJob', player.lang)}`);
            return;
        }

        if (player.job === 8) {
            if (player.jobcloth !== undefined) {
                player.utils.error("You did not finish your shift!");
                return;
            }
            player.utils.success(`${i18n.get('uJobs', 'youQuitJob', player.lang)}`);
            player.call("setWaterFrontJobStatus", [false]);
            player.call("create.waterfront.clothmarker", [false]);
            player.utils.changeJob(0);
        } else {
            player.utils.success(`${i18n.get('uJobs', 'youGotJob', player.lang)}`);
            player.utils.changeJob(8);
            player.utils.info(`${i18n.get('uJobs', 'changeClothesJob', player.lang)}`);
            player.call("setWaterFrontJobStatus", [true]);
            player.call("create.waterfront.clothmarker", [true]);
        }
    } catch (err) {
        console.log(err);
        return;
    }
});

function getRandomNumber(min, max) {
    try {
        return Math.floor(Math.random() * (max - min)) + min;
    } catch (err) {
        console.log(err);
        return -1;
    }
}
