const controlsDisabler = require("gamemode/scripts/helpers/controlsDisabler.js");

const controlsToDisable = [ /*21,*/ 22, 37, 44, 157, 158, 159, 160, 161, 162, 163, 164, 165,
	14, 15, 16, 17, 53, 54, 140, 141, 142, 143, 143, 47, 38, 69, 70, 68, 92, 99, 115, 46, 25, 36];

let interiorZones = new Set();
let isInGreenZone = false;

mp.events.add("custom_event:interiorChanged", onInteriorChanged);

mp.events.add("green_zone::load", (rawData) => {
	interiorZones = new Set(JSON.parse(rawData));
});

mp.events.add("green_zone::addRemove", (isAdd) => {
	const eventName = `green_zone::${isAdd ? "add": "remove"}`;

	mp.events.callRemote(eventName, getCurrentInterior());
});

mp.events.add("green_zone::add", (interior) => {
	addInteriorZone(interior);
});

mp.events.add("green_zone::remove", (interior) => {
	removeInteriorZone(interior);
});

function onInteriorChanged(newInterior) {
	if (newInterior === 0) {
		if (isInGreenZone) {
			onExitGreenZone();
		}

		return;
	}

	for (const interiorZone of interiorZones) {
		if (newInterior !== interiorZone) {
			continue;
		}

		onEnterGreenZone();

		return;
	}

	if (isInGreenZone) {
		onExitGreenZone();
	}
}

function onEnterGreenZone() {
	isInGreenZone = true;

	mp.game.invoke("0xADF692B254977C0C", localPlayer.handle, mp.game.joaat("weapon_unarmed") >> 0, true);
	localPlayer.setStealthMovement(false, "DEFAULT_ACTION");
	localPlayer.setMaxMoveBlendRatio(1.35);
	controlsDisabler.addRange(controlsToDisable);
}

function onExitGreenZone() {
	isInGreenZone = false;
	localPlayer.setMaxMoveBlendRatio(1);
	controlsDisabler.removeRange(controlsToDisable);
}

function addInteriorZone(interiorId) {
	interiorZones.add(interiorId);

	const currentInterior = getCurrentInterior();

	if (currentInterior === interiorId && !isInGreenZone) {
		onEnterGreenZone();
	}
}

function removeInteriorZone(interiorId) {
	interiorZones.delete(interiorId);

	const currentInterior = getCurrentInterior();

	if (currentInterior === interiorId && isInGreenZone) {
		onExitGreenZone();
	}
}

function getCurrentInterior() {
	return mp.game.invoke("0x2107BA504071A6BB", mp.players.local.handle);
}

exports = {
	addInteriorGreenZone: addInteriorZone,
	removeInteriorGreenZone: removeInteriorZone,
	isLocalPlayerInGreenZone: () => isInGreenZone
};
