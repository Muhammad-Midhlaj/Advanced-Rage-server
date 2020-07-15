const BankInfo = {
  blip: mp.blips.new(207, new mp.Vector3(235.43, 216.95, 106.29), { alpha: 255, scale: 0.7, color: 25, name: "Bank", shortRange: true }),
  colshapes: [
    mp.colshapes.newSphere(241.36, 225.22, 106.29, 1.0),
    mp.colshapes.newSphere(243.20, 224.54, 106.29, 1.0),
    mp.colshapes.newSphere(246.55, 223.38, 106.29, 1.0),
    mp.colshapes.newSphere(248.39, 222.71, 106.29, 1.0),
    mp.colshapes.newSphere(251.75, 221.49, 106.29, 1.0),
    mp.colshapes.newSphere(253.57, 220.83, 106.29, 1.0)
  ],
  keydown_E: false,
  enter: 0,
  main_show: false,
  balance: 0,
  hbalance: [],
  houses: [],
  buttons: [
  { text: "Top up your balance" },
  { text: "Remove from balance" },
  { text: "Transfer to another account" },
  { text: "Top up your balance home" },
  { text: "Remove from balance home" },
  { text: "Close"}]
}

mp.events.add('playerEnterColshape', (shape) => {
 if (BankInfo.colshapes.includes(shape) && !mp.players.local.vehicle) {
   mp.events.call("prompt.show", `Press <span>Е</span> to interact`);
   BankInfo.keydown_E = true;
   BankInfo.enter++;
 }
});
mp.events.add('playerExitColshape', (shape) => {
  if (BankInfo.colshapes.includes(shape)) {
    if (BankInfo.enter === 1) {
      BankInfo.keydown_E = false;
      BankInfo.main_show = false;
      BankInfo.enter = 0;
      mp.events.call("selectMenu.hide", "bank_menu");
    }
    else BankInfo.enter--;
  }
});

mp.keys.bind(0x45, false, function () { // E key
  if (BankInfo.keydown_E && !BankInfo.main_show && !mp.players.local.vehicle) {
       mp.events.callRemote("show.bank.menu");
       BankInfo.main_show = true;
  }
});

mp.events.add('show.bank.menu', (money, bmoney, houses, isAtm = false) => {
  BankInfo.balance = money;
  BankInfo.hbalance = bmoney;
  if (houses.length > 0) {
    BankInfo.buttons[3] = { text: "Top up your balance home", values: houses };
    BankInfo.buttons[4] = { text: "Remove from balance home", values: houses };
    BankInfo.houses = houses;
  }
  else {
    BankInfo.buttons[3] = { text: "Top up your balance home" };
    BankInfo.buttons[4] = { text: "Remove from balance home" };
    BankInfo.houses = -1;
  }
	mp.events.call("selectMenu.setHeader", "bank_menu", "Your Balance $" + money);

	if (isAtm) {
		const items = [ BankInfo.buttons[0], BankInfo.buttons[1], BankInfo.buttons[BankInfo.buttons.length - 1] ];

		mp.events.call("selectMenu.setSpecialItems", "bank_menu", items);
	} else {
		mp.events.call("selectMenu.setSpecialItems", "bank_menu", BankInfo.buttons);
	}

  mp.events.call("selectMenu.show", "bank_menu");
});

mp.events.add("selectMenu.itemSelected", (menuName, itemName, itemValues, itemIndex) => {
	if (menuName === "bank_menu") {
    mp.events.call("selectMenu.hide", "bank_menu");
    switch (itemName) {
      case "Close":
        BankInfo.main_show = false;
        break;
      case "Top up your balance":
        mp.events.call("modal.show", "bank_money_put", { money: BankInfo.balance });
        break;
      case "Remove from balance":
        mp.events.call("modal.show", "bank_money_take", { money: BankInfo.balance });
        break;
      case "Transfer to another account":
        mp.events.call("modal.show", "bank_money_transfer", { money: BankInfo.balance });
        break;
      case "Top up your balance home":
        if (checkHouse()) mp.events.call("modal.show", "bank_money_house_give", { money: BankInfo.balance, house: itemValues, bhouse: BankInfo.hbalance[BankInfo.houses.indexOf(itemValues)] });
        break;
      case "Remove from balance home":
        if (checkHouse()) mp.events.call("modal.show", "bank_money_house_take", { money: BankInfo.balance, house: itemValues, bhouse: BankInfo.hbalance[BankInfo.houses.indexOf(itemValues)] });
        break;
      default:
    }
  }
});

mp.events.add('update.bank.main.open', (status) => { BankInfo.main_show = status; });
mp.events.add('put.bank.money', (money) => {
  let newMoney = simpleCheck(money);
  if (newMoney !== false) mp.events.callRemote("put.bank.money", newMoney);
});
mp.events.add('take.bank.money', (money) => {
  let newMoney = simpleCheck(money);
  if (newMoney !== false) mp.events.callRemote("take.bank.money", newMoney);
});
mp.events.add('give.bank.money.house', (money, id) => {
  let newMoney = simpleCheck(money);
  var house = id.split("№");
  if (newMoney !== false) mp.events.callRemote("give.bank.money.house", money, parseInt(house[1], 10));
});
mp.events.add('take.bank.money.house', (money, id) => {
  let newMoney = simpleCheck(money);
  var house = id.split("№");
  if (newMoney !== false) mp.events.callRemote("take.bank.money.house", money, parseInt(house[1], 10));
});
mp.events.add('transfer.bank.money', (name, money) => {
  if (name.toLowerCase() === mp.players.local.name.toLowerCase()) {
    mp.events.call("nWarning", "You can't transfer money into your account!");
    return;
  }
  let newMoney = simpleCheck(money);
  if (newMoney !== false) mp.events.callRemote("transfer.bank.money", name, newMoney);
});
function checkHouse() {
  if (BankInfo.houses === -1) {
    mp.events.call("nWarning", "You don't have a home!");
    BankInfo.main_show = false;
    return false;
  }
  return true;
}
function simpleCheck(value) {
  let num = parseInt(value, 10);
  if (isNaN(num)) {
    mp.events.call("nWarning", "Fill the field correctly!");
    return false;
  }
  return num;
}
