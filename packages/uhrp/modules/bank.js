const BankInfo = {
  minimal_summa: 1, // Minimum top-up|снятия
  maximum_summa: 1000000, // Макисмальная сумма пополнения|снятия
  functions: {
    updateBalanceMoney(player, isAtm = false) {
			if (isAtm) {
				player.call("show.bank.menu", [player.bank, [], [], true]);
				return;
			}

			let houses = mp.houses.getArrayByOwner(player.sqlId);
			let id_houses = [], houses_balance = [];

			for (let i = 0; i < houses.length; i++) {
				let hprice = houses[i].getTax();

				id_houses.push("No." + houses[i].sqlId);
				houses_balance.push("$" + houses[i].balance + " из " + Math.round(hprice * 24 * 14));
			}

			player.call("show.bank.menu", [player.bank, houses_balance, id_houses]);
    },
    putBalanceMoney(player, money) {
      if (money < BankInfo.minimal_summa) {
        player.utils.warning("Minimum top-up $" + BankInfo.minimal_summa);
        return;
      }

      if (money > BankInfo.maximum_summa) {
        player.utils.warning("Maximum top-up $" + BankInfo.maximum_summa);
        return;
      }

      if (player.money < money) {
        player.utils.warning("You don't have enough money!");
        return;
      }

      // let bmoney = player.bank + money;
      player.utils.setMoney(player.money - money);
      player.utils.setBankMoney(player.bank + money);
      player.utils.bank("Top-up", "You've been credited with ~g~$" + money);
      player.call("modal.hide");
    },
    takeBalanceMoney(player, money) {
      if (money < BankInfo.minimal_summa) {
        player.utils.warning("Minimum withdrawal $" + BankInfo.minimal_summa);
        return;
      }

      if (money > BankInfo.maximum_summa) {
        player.utils.warning("Maximum withdrawal $" + BankInfo.maximum_summa);
        return;
      }

      if (player.bank < money) {
        player.utils.warning("There's not enough money on the balance sheet!");
        return;
      }

      player.utils.setMoney(player.money + money);
      player.utils.setBankMoney(player.bank - money);
      player.utils.bank("Withdrawal from the account", "It's been taken from your account. ~r~$" + money);
      player.call("modal.hide");
    },
    giveBankMoneyHouse(player, money, house) {
      return player.utils.error("House taxes off!");
      let houses = mp.houses.getArrayByOwner(player.sqlId);
      let id_houses = [], myhouse;
      for (let i = 0; i < houses.length; i++) id_houses.push(houses[i].sqlId);

      if (id_houses.includes(house)) {
        myhouse = houses[id_houses.indexOf(house)];
      } else {
        player.utils.warning("You don't own House No." + house);
        return;
      }

      if (money < BankInfo.minimal_summa) {
        player.utils.warning("Minimum top-up $" + BankInfo.minimal_summa);
        return;
      }

      if (money > BankInfo.maximum_summa) {
        player.utils.warning("Maximum top-up $" + BankInfo.maximum_summa);
        return;
      }

      if (player.bank < money) {
        player.utils.warning("There's not enough money on the balance sheet!");
        return;
      }

      let hprice = myhouse.getTax() * 24 * 14;
      let hbalance = parseInt(myhouse.balance, 10) + parseInt(money, 10);
      if (hbalance > hprice) {
        player.utils.warning("You can't put that much money into an account!");
        return;
      }

      myhouse.setBalance(hbalance);
      player.utils.setBankMoney(player.bank - parseInt(money, 10));
      player.utils.bank("Top-up", "At your home ~g~No." + house + " ~w~credited ~g~$" + money);
      player.call("modal.hide");
    },
    takeBankMoneyHouse(player, money, house) {
      return player.utils.error("House taxes off!");
      let houses = mp.houses.getArrayByOwner(player.sqlId);
      let id_houses = [], myhouse;
      for (let i = 0; i < houses.length; i++) id_houses.push(houses[i].sqlId);

      if (id_houses.includes(house)) {
        myhouse = houses[id_houses.indexOf(house)];
      } else {
        player.utils.warning("You don't own House No." + house);
        return;
      }

      if (money < BankInfo.minimal_summa) {
        player.utils.warning("Minimum withdrawal $" + BankInfo.minimal_summa);
        return;
      }

      if (money > BankInfo.maximum_summa) {
        player.utils.warning("Maximum withdrawal $" + BankInfo.maximum_summa);
        return;
      }

      if (myhouse.balance < money) {
        player.utils.warning("There's not enough money on the balance of the house!");
        return;
      }

      let hbalance = parseInt(myhouse.balance, 10) - parseInt(money, 10);
      myhouse.setBalance(hbalance);
      player.utils.setBankMoney(player.bank + parseInt(money, 10));
      player.utils.bank("Top-up", "You've been credited with ~g~$" + money);
      player.call("modal.hide");
    },
    transferBalanceMoney(player, name, money) {
      if (mp.convertMinutesToLevelRest(player.minutes).level < 2) return player.utils.error("Вы не достигли 2 уровня!");
      DB.Handle.query("SELECT * FROM characters WHERE name=?", [name], (e, result) => {
          if (e) {
            callback("Error in the execution of a request in the database!");
            return terminal.error(e);
          }
          if (result.length < 1) {
            player.utils.warning("There is no player with that name!");
            return;
          }

          let dbplayer = result[0];

          if (money < BankInfo.minimal_summa) {
            player.utils.warning("Minimum transfer amount $" + BankInfo.minimal_summa);
            return;
          }

          if (money > BankInfo.maximum_summa) {
            player.utils.warning("Maximum transfer amount $" + BankInfo.maximum_summa);
            return;
          }

          if (player.bank < money) {
            player.utils.warning("There's not enough money on the balance sheet!");
            return;
          }

          let target = mp.players.getBySqlId(dbplayer.id);
          if (target === undefined) {
            DB.Handle.query("UPDATE characters SET bank=bank+? WHERE id=?", [money, dbplayer.id], (e, result) => {
                if (e) {
                    callback("Error in the execution of a request in the database!");
                    return terminal.error(e);
                  }
                });
          } else {
            target.utils.setBankMoney(target.bank + money);
            target.utils.bank("Top-up", "~g~" + player.name + " ~w~listed in your account ~g~$" + money);
          }

          player.utils.setBankMoney(player.bank - money);
          player.utils.bank("Transfer of funds", "You've translated " + dbplayer.name + " ~g~$" + money);
          player.call("modal.hide");
          return;
      });
    }
  }
}

mp.events.add("show.bank.menu", (player, isAtm = false) => {
    try
    {
       BankInfo.functions.updateBalanceMoney(player, isAtm);
    }
    catch (err) {
        console.log(err);
        return;
    }
});
mp.events.add("take.bank.money", (player, money) => {
    try
    {
       BankInfo.functions.takeBalanceMoney(player, money);
    }
    catch (err) {
        console.log(err);
        return;
    }
});
mp.events.add("put.bank.money", (player, money) => {
    try
    {
       BankInfo.functions.putBalanceMoney(player, money);
    }
    catch (err) {
        console.log(err);
        return;
    }
});
mp.events.add("transfer.bank.money", (player, name, money) => {
    try
    {
       BankInfo.functions.transferBalanceMoney(player, name, money);
    }
    catch (err) {
        console.log(err);
        return;
    }
});
mp.events.add("give.bank.money.house", (player, money, house) => {
    try
    {
       BankInfo.functions.giveBankMoneyHouse(player, money, house);
    }
    catch (err) {
        console.log(err);
        return;
    }
});
mp.events.add("take.bank.money.house", (player, money, house) => {
    try
    {
       BankInfo.functions.takeBankMoneyHouse(player, money, house);
    }
    catch (err) {
        console.log(err);
        return;
    }
});
