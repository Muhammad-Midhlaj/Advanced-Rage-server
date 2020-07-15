const localPlayer = mp.players.local;
const searchRadius = 0.6;
const atmModels = [ 0xCC179926, 0xBCDEFAB5, 0xAEA85E48, 0x1E34B5C2 ];

let isNearAtm = false;
let isAtmUsing = false;

mp.events.add("render", () => {
	if (localPlayer.isInAnyVehicle()) {
		return;
	}

	const position = localPlayer.position;
	let found = false;

	for (const atmModel of atmModels) {
		const obj = mp.game.object.getClosestObjectOfType(position.x, position.y, position.z, searchRadius, atmModel, false, false, false);

		if (typeof(obj) === "number" && obj > 0) {
			found = true;
			break;
		}
	}

	if (!found) {
		if (isNearAtm) {
			onStopInteraction();
		}

		return;
	}

	if (!isNearAtm) {
		onStartInteraction();
	}
});

mp.events.add("playerDeath", (player) => {
	if (player.remoteId === localPlayer.remoteId) {
		onStopInteraction();
	}
});

mp.events.add("selectMenu.itemSelected", (menuName, itemName) => {
	if (menuName === "bank_menu" && itemName === "Close") {
		isAtmUsing = false;
	}
});

mp.events.add("update.bank.main.open", (status) => {
	isAtmUsing = status;
});

mp.keys.bind(0x45, false, () => {
	if (!isNearAtm || isAtmUsing) {
		return;
	}

	isAtmUsing = true;
	mp.events.call("atmMenu.open", true);
	mp.events.call("prompt.hide");
});

function onStartInteraction() {
	if (localPlayer.isDeadOrDying(true)) {
		return;
	}

	isNearAtm = true;
	isAtmUsing = false;

	mp.events.call("prompt.show", "Press <span>Е</span> to interact with an ATM");
}

function onStopInteraction() {
	isNearAtm = false;
	isAtmUsing = false;

	mp.events.call("prompt.hide");
	mp.events.call("selectMenu.hide");
}

