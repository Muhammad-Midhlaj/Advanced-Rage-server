mp.blips.new(103, new mp.Vector3(538.54, 101.79, 96.54), { name: 'Pizzeria Courier', color: 1, scale: 0.7, shortRange: true}); // Блип на карте
/*
 player.havepizza - кол-во пиццы у игрока
*/
const PizzaJob = {
  salary_min: 10, // Минимальная сумма прибыли
  salary_max: 1000, // Макисмальная сумма прибыли
  colshapes: {
    joinjob: mp.colshapes.newSphere(538.54, 101.79, 96.54, 1.5),
    storage: mp.colshapes.newSphere(573.03, 128.86, 99.47, 1.0)
  },
  functions: {
    leavePizzaJob(player) {
      player.utils.success("You quit the pizzeria!");
      player.utils.changeJob(0);
      delete player.body.denyUpdateView;
      player.body.loadItems();
      player.setClothes(2, player.savehead.drawable, player.savehead.texture, player.savehead.palette);
      player.call("setPizzaJobStatus", [ false ]);
      player.call("create.pizza.storagemarker", [ false ]);
      delete player.havepizza, delete player.savehead;
    },
    joinPizzaJob(player) {
      player.utils.success("You're in a pizzeria!");
      player.havepizza = 0;
      player.utils.changeJob(4);
      player.utils.info("Take pizza from the warehouse!");
      player.call("setPizzaJobStatus", [ true ]);
      player.call("create.pizza.storagemarker", [ true ]);
      let skill = player.jobSkills[4 - 1];
      player.savehead = player.getClothes(2);
      if (skill < 60) {
        player.body.clearItems();
        player.body.denyUpdateView = true;
        player.setClothes(2, 0, 0, 2);
        if (player.sex === 1) {
          // Одежда мужская
          player.setClothes(1, 145, 0, 2);
          player.setClothes(3, 1, 0, 2);
          player.setClothes(4, 8, 3, 2);
          player.setClothes(6, 4, 4, 2);
          player.setClothes(8, 9, 5, 2);
          player.setClothes(11, 88, 0, 2);
        } else {
          // Одежда женская
          player.setClothes(1, 145, 0, 2);
          player.setClothes(3, 1, 0, 2);
          player.setClothes(4, 27, 2, 2);
          player.setClothes(6, 3, 2, 2);
          player.setClothes(11, 81, 0, 2);
        }
      } else {
        if (player.sex === 1) {
          // Одежда мужская
          player.setClothes(3, 1, 0, 2);
          player.setClothes(8, 9, 5, 2);
          player.setClothes(11, 88, 0, 2);
        } else {
          // Одежда женская
          player.setClothes(3, 1, 0, 2);
          player.setClothes(11, 81, 0, 2);
        }
      }
    },
    takePizzaFromStorage(player) {
      if (player.havepizza > 0) {
        player.utils.error("First, scatter the previous pizza!");
        return;
      } else if (player.havepizza === 0) {
          player.utils.success("You took 3 pizzas from the warehouse!");
          player.setClothes(5, 45, 0, 2);
          player.havepizza = 3;
          let arr = getFreeHousePos();
          player.call("create.pizza.places", [ mp.houses[arr[0]].position, mp.houses[arr[1]].position, mp.houses[arr[2]].position ]);
      }
    }
  }
};

mp.events.add("playerEnterColshape", function onPlayerEnterColShape(player, shape) {
    try
    {
        if (!player.vehicle) {
          if (shape === PizzaJob.colshapes.joinjob) player.call("getPizzaJobStatus", [player.job !== 4 ? false : true]);
          else if (shape === PizzaJob.colshapes.storage && player.job === 4) PizzaJob.functions.takePizzaFromStorage(player);
        }
    } catch (err) {
        console.log(err);
        return;
    }
});
mp.events.add("playerExitColshape", function onPlayerExitColShape(player, shape) {
    try
    {
      if (shape === PizzaJob.colshapes.joinjob) player.call("getPizzaJobStatus", ["cancel"]);
    } catch (err) {
        console.log(err);
        return;
    }
});
mp.events.add("job.pizza.agree", (player) => {
    try
    {
      if (player.job !== 0 && player.job !== 4) {
        player.utils.warning("You're already working somewhere!");
        return;
      }

      if (player.job === 4)
        PizzaJob.functions.leavePizzaJob(player);
      else
        PizzaJob.functions.joinPizzaJob(player);
    }
    catch (err) {
        console.log(err);
        return;
    }
});
mp.events.add("playerDeath", function playerDeathHandler(player, reason, killer) {
    if (player.job === 4) PizzaJob.functions.leavePizzaJob(player);
});
mp.events.add("give.pizza.item", (player, i) => {
    try
    {
      if (player.job !== 4) return;

      if (player.havepizza < 1) {
        player.utils.warning("You don't have enough pizza!");
        return;
      }

      let money = 0;
      if (player.jobSkills[4 - 1] < 60) money = Math.trunc(player.dist(PizzaJob.colshapes.storage) * mp.economy["pizza_salary"].value);
      else money = Math.trunc(player.dist(PizzaJob.colshapes.storage) * mp.economy["pizza_salary_sec"].value);

      if (money < PizzaJob.salary_min) money = PizzaJob.salary_min;
      else if (money > PizzaJob.salary_max) money = PizzaJob.salary_max;

      player.havepizza--;
      if (player.havepizza < 1) {
        player.utils.warning("You've run out of pizza, go to the warehouse!");
        player.setClothes(5, 44, 0, 2);
      }
      player.call("delete.pizza.colshape", [ i, player.havepizza ]);
      player.utils.setMoney(player.money + money);
      player.utils.success("You've earned $" + money);
      player.utils.setJobSkills(4, player.jobSkills[4 - 1] + 1);

    }
    catch (err) {
        console.log(err);
        return;
    }
});

mp.events.add("playerEnterVehicle", function playerEnterVehicleHandler(player, vehicle, seat) {
  // player.notify("Модель: ~r~" + vehicle.model);
	if (vehicle.owner === -4 && player.job === 4 && seat === -1) {
    let skill = player.jobSkills[4 - 1];
    if (skill < 60 && vehicle.model === 841808271) {
       player.notify("Experience: ~r~" + skill + " ~w~for ~r~" + 60);
       player.removeFromVehicle();
       return;
    }
    if (!haveLicense(player, vehicle)) return;
  }
});
function haveLicense(player, vehicle) {
    if (!vehicle.license) return true;
    var docs = player.inventory.getArrayByItemId(16);
    for (var sqlId in docs) {
        if (docs[sqlId].params.licenses.indexOf(vehicle.license) != -1) return true;
    }
    return false;
}
// Functions
function getFreeHousePos() {
  try
  {
    let arr = [-1, -1, -1];
    for (let i = 0; i < arr.length; i++) {
       let num = getRandomNumber(0, mp.houses.length - 1, arr);
       arr[i] = num;
    }
    return arr;
  } catch (err){
      console.log(err);
      return undefined;
  }
}
function getRandomNumber(min, max, arr) {
    try
    {
        let massive = 1, num = 0;
        for (let i = 0; i < massive; i++) {
          num = Math.floor(Math.random() * (max - min)) + min;
          if (arr.includes(num)) massive++;
        }
        return num;
    } catch (err){
        console.log(err);
        return -1;
    }
}
