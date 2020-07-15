const HelperInfo = {
  main: {
    open: false,
    file: "helper_main",
    head: "Help",
    buttons: [{ text: "Beginning of the game"}, { text: "Works"}, { text: "Organizations"}, { text: "Close"}]
  },
  second: {
    file: "help_menu",
    buttons: [
     { head: "Beginning of the game", text: "To begin, you should buy a car in a premium car dealership." },
     { head: "Works", text: "Works sit and wait for you with care, hurry!"},
     { head: "Organizations", text: "Organizations for real workers, go."},
     { head: "Beginning of the game", text: "Hola amigo! Сomo estuvo tu vuelo? All right, all right do not worry … I welcome you in our solar state! For full convenience of residence at us in the state, you can use the menu on key M. Exactly there, you can find all necessary information and also use additional settings of the character. Will you ask and how I will be able to open stock? The answer will be very simple, you need to press key I. If money is necessary for you, you can get a job, can find information on all works also in the menu. All right, I will not detain you if you need transport, then across the road you can rent the scooter. A pleasant travel on our state." }
    ]
  },
  blips: [
    mp.blips.new(280, new mp.Vector3(-1028.10, -2738.47, 13.80), { alpha: 255, scale: 0.7, color: 3, name: "Assistant", shortRange: true }),
    mp.blips.new(280, new mp.Vector3(562.88, -1750.25, 29.28), { alpha: 255, scale: 0.7, color: 3, name: "Assistant", shortRange: true }),
    mp.blips.new(280, new mp.Vector3(1538.44, 3766.79, 34.06), { alpha: 255, scale: 0.7, color: 3, name: "Assistant", shortRange: true }),
    mp.blips.new(280, new mp.Vector3(-169.76, 6439.63, 31.92), { alpha: 255, scale: 0.7, color: 3, name: "Assistant", shortRange: true }),
  ],
  peds: [
    mp.peds.new(-1382092357, new mp.Vector3(-1028.10, -2738.47, 13.80), 106.0, (streamPed) => { streamPed.setAlpha(50); }, 0),
    mp.peds.new(-1382092357, new mp.Vector3(562.88, -1750.25, 29.28), 230.38, (streamPed) => { streamPed.setAlpha(50); }, 0),
    mp.peds.new(-1382092357, new mp.Vector3(1538.44, 3766.79, 34.06), 32.22, (streamPed) => { streamPed.setAlpha(50); }, 0),
    mp.peds.new(-1382092357, new mp.Vector3(-169.76, 6439.63, 31.92), 188.19, (streamPed) => { streamPed.setAlpha(50); }, 0),
  ],
  colshape: [
    mp.colshapes.newSphere(-1028.10, -2738.47, 13.80, 1.5),
    mp.colshapes.newSphere(562.88, -1750.25, 29.28, 1.5),
    mp.colshapes.newSphere(1538.44, 3766.79, 34.06, 1.5),
    mp.colshapes.newSphere(-169.76, 6439.63, 31.92, 1.5),
  ],
  keydown_E: false
};

mp.events.add('playerEnterColshape', (shape) => {
 if (HelperInfo.colshape.includes(shape) && !mp.players.local.vehicle) {
   mp.events.call("prompt.show", `Press <span>Е</span> for interaction`);
   HelperInfo.keydown_E = true;
 }
});
mp.events.add('playerExitColshape', (shape) => {
  if (HelperInfo.colshape.includes(shape)) {
    HelperInfo.keydown_E = false;
    if (HelperInfo.main.open) {
      mp.events.call("selectMenu.hide", HelperInfo.main.file);
      HelperInfo.main.open = false;
    }
  }
});

mp.keys.bind(0x45, false, function () { // E key
  if (!mp.players.local.vehicle && HelperInfo.keydown_E && !HelperInfo.main.open) {
    // fastShow(HelperInfo.main.file, HelperInfo.main.head, HelperInfo.main.buttons);
    HelperInfo.main.open = true;
    mp.events.call("modal.show", HelperInfo.second.file, HelperInfo.second.buttons[3]);
  }
});

mp.events.add('update.help.main.open', (status) => {
    HelperInfo.main.open = status;
});

mp.events.add("selectMenu.itemSelected", (menuName, itemName, itemValue, itemIndex) => {
	if (menuName === HelperInfo.main.file) {
    if (itemName === HelperInfo.main.buttons[3].text) {
      mp.events.call("selectMenu.hide", HelperInfo.main.file);
      HelperInfo.main.open = false;
      return;
    }
    for (let i = 0; i < HelperInfo.main.buttons.length; i++) {
      if (itemName === HelperInfo.main.buttons[i].text) {
        // HelperInfo.main.open = false;
        mp.events.call("selectMenu.hide", HelperInfo.main.file);
        mp.events.call("modal.show", HelperInfo.second.file, HelperInfo.second.buttons[i]);
      }
    }
	}
});

function fastShow(file, head, buttons) {
  mp.events.call("selectMenu.setHeader", file, head);
  mp.events.call("selectMenu.setSpecialItems", file, buttons);
  mp.events.call("selectMenu.show", file);
}
