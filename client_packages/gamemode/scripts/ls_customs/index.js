const cameraRotator = require("gamemode/scripts/helpers/cameraRotator");
const loadingPrompt = require("gamemode/scripts/helpers/loadingPrompt");
const { getVehicleCharacteristics } = require("gamemode/scripts/helpers/vehicleHelper");
const { escapeHtml } = require("gamemode/scripts/helpers/stringHelper");

const controlsToDisable = [ 71, 72, 76, 73, 59, 60, 75, 80, 69, 70, 68, 74, 86, 81, 82, 138, 136, 114,
	107, 110, 89, 89, 87, 88, 113, 115, 116, 117, 118, 119, 131, 132, 123, 126, 129, 130, 133, 134 ];

const neonColors = [
	[ 222, 222, 255],
	[ 2, 21, 255],
	[ 3, 83, 255],
	[ 0, 255, 140],
	[ 94, 255, 1],
	[ 255, 255, 0],
	[ 255, 150, 5],
	[ 255, 62, 0],
	[ 255, 1, 1],
	[ 255, 50, 100 ],
	[ 255, 5, 190 ],
	[ 35, 1, 255 ],
	[ 15, 3, 255 ]
];

const neonColorNames = ["White", "Blue", '"Electric blue"', '"Mint-green"', "Lime", "Yellow", '"Golden shower"', "Orange", "Red", '"Pink pony"', "Bright pink", "Violet", '"Black light"'];
const numberPlateTypeValues = ["Blue on white 1", "Blue on white 2", "Blue on white 3", "Yellow on blue", "Yellow on black"];

let customsInfo = undefined;
let vehiclesSyncData = new Map();
let vehiclePrice;

let enterInteractionColshape = undefined;
let camera = undefined;
let isControlsDisabled = false;
let lampObj = undefined;
let invisibleVehicle = undefined;

mp.events.add("render", () => {
	if (customsInfo === undefined) {
		return;
	}

	if (isControlsDisabled) {
		mp.game.invoke("0x719FF505F097FD20"); // Hide Hud & Radar
		disableControls();
	}

	if (!isValidVehicle()) {
		return;
	}

	const placeIndex = getCurrentPlaceIndex();

	if (placeIndex !== -1 && customsInfo.currentPlace !== placeIndex) {
		startEnterInteraction(placeIndex);
	} else if (placeIndex === -1 && customsInfo.currentPlace !== -1) {
		stopEnterInteraction();
	}

	customsInfo.currentPlace = placeIndex;
});

mp.events.add("playerEnterColshape", (colshape) => {
	if (colshape !== enterInteractionColshape || customsInfo.currentPlace === -1) {
		return;
	}

	currentModType = -1;

	mp.events.callRemote("ls_customs::init", customsInfo.currentPlace);
});

mp.events.add("ls_customs::occupant_init", () => {
	isControlsDisabled = true;

	fadeScreen(true, 50);
}),

mp.events.add("ls_customs::start", (driverId, vehicleId, placeId, vehPrice) => {
	const vehicle = mp.vehicles.atRemoteId(vehicleId);
	const place = customsInfo.places[placeId];

	vehiclePrice = vehPrice;

	setUiElementsState(false);

	vehicle.position = place.startVehInfo.position;
	vehicle.setHeading(place.startVehInfo.heading);
	vehicle.setOnGroundProperly();
	vehicle.setDoorsShut(true);
	vehicle.setForwardSpeed(2);
	mp.game.invoke("0x3B988190C0AA6C0B", vehicle.handle, false); // Radio

	createLamp(place);
	camera = mp.cameras.new("default");

	if (driverId === mp.players.local.remoteId) {
		if (place.waypointRecord) {
			fadeScreen(false, 50);
			const camParams = place.startCamParams;

			camera.setActive(true);

			vehicleFollowWaypoint(vehicle, place.waypointRecord, 262144, 0, 0, -1, 3, false, 2.1).then(vehicleReachPoint);
			setCamParams(camera, camParams.from.position, camParams.from.rotation, camParams.from.fov, camParams.from.duration, camParams.from.unk);
			setCamParams(camera, camParams.to.position, camParams.to.rotation, camParams.to.fov, camParams.to.duration, camParams.to.unk);
			mp.game.cam.renderScriptCams(true, false, 3000, true, false);
		} else {
			setTimeout(() => {
				fadeScreen(false, 50);
				camera.setActive(true);
				vehicleReachPoint(vehicle);
				mp.game.cam.renderScriptCams(true, false, 3000, true, false);
			}, 1000);
		}

		mp.game.invoke("0xE65F427EB70AB1ED", -1, "MOD_SHOPS_ENTER_ENGINE_BLIP", vehicle.handle, 0, 0, 0); // Engine sound
	}
});

mp.events.add("ls_customs::show_vehicle", (rawPosition, heading) => {
	const vehicle = mp.players.local.vehicle;
	const position = JSON.parse(rawPosition);

	vehicle.position = new mp.Vector3(position.x, position.y, position.z);
	vehicle.setHeading(heading);

	onStartTuning(vehicle, true);
})

mp.events.add("ls_customs::end_occupant", () => {
	fadeScreen(false, 50);
	endOfTuning(true);
});

mp.events.add("ls_customs::end_driver", () => {
	endOfTuning(false, true);
});

function vehicleReachPoint(vehicle) {
	const vehPosition = vehicle.position;
	const vehHeading = vehicle.getHeading();

	mp.events.callRemote("ls_customs::vehicle_reach_point", JSON.stringify(vehPosition), vehHeading);
	onStartTuning(vehicle, false);

	invisibleVehicle = mp.vehicles.new(vehicle.model, vehPosition, {
		dimension: vehicle.dimension,
		heading: vehHeading
	});
	invisibleVehicle.freezePosition(true);
	invisibleVehicle.setCollision(false, false);
	invisibleVehicle.setVisible(false, false);
}

function startEnterInteraction(placeIndex) {
	const place = customsInfo.places[placeIndex];
	const localPlayer = mp.players.local;
	const vehicle = localPlayer.vehicle;

	doorControl(false, place.door.model, place.door.position);

	if (vehicle.getPedInSeat(-1) === localPlayer.handle) {
		enterInteractionColshape = mp.colshapes.newSphere(place.enterPosition.x, place.enterPosition.y, place.enterPosition.z, 2);
	}
}

let mainMenuIndex = 0;
let currentModType = -1;
let isXenonEnabled;
let neonLightStates;
let currentNeonColor;
let currentHornType = -1;
let currentHornValue;
let currentNumberPlateType;
let isCurrentColorPrimary = false;
let currentColorGroup = -1;
let currentPrimaryColor;
let currentSecondaryColor;
let currentWheelType;
let selectedWheelType = -1;
let selectedWheelTypeIndex;
let currentWheelModType;
let currentWheelModIndex;
let currentWheelColor;
let currentTiresDesign;
let currentTiresSmokeColor;
let currentWheelChunk = [];
let currentModKit;
let currentWindowTint;
let currentRepairPrice;
let currentWheelChunkIndex;

mp.events.add("selectMenu.itemSelected", async (menuName, itemName, itemValue, itemIndex) => {
	if (menuName === "ls_customs_repair") {
		if (itemName === "Repair") {
			if (!await checkPrice("repair", 0, 0, currentRepairPrice)) {
				return;
			}

			mp.players.local.vehicle.setDirtLevel(0);
			mp.events.callRemote("ls_customs::repair");

			showMenu(mp.players.local.vehicle, true);
		} else if (itemName === "Exit") {
			endOfTuning(false);
		}
	} else if (menuName === "ls_customs_main") {
		mainMenuIndex = itemIndex;

		if (itemName === "Exit") {
			endOfTuning(false);
		} else if (itemName === "Headlights") {
			const items = [ { text: "Headlights" }];

			if (mp.game.vehicle.isThisModelACar(mp.players.local.vehicle.model)) {
				items.push({ text: "Neon sets" });
			}

			mp.events.call("selectMenu.setSpecialItems", "ls_customs_headlightsMenu", items);
			mp.events.call("selectMenu.show", "ls_customs_headlightsMenu");
		} else if (itemName === "Horns") {
			currentHornValue = mp.players.local.vehicle.getMod(14);
			currentHornType = -1;
			mp.events.call("selectMenu.show", "ls_customs_hornsMenu");
		} else if (itemName === "Numbers") {
			showNumberPlateMenu();
		} else if (itemName === "Coloring") {
			mp.events.call("selectMenu.show", "ls_customs_colorMenu");
		} else if (itemName === "Wheels") {
			mp.events.call("selectMenu.show", "ls_customs_wheelsMenu");
		} else if (itemName === "Turbo-Supercharging") {
			showTurboMenu();
		} else if (itemName === "Glass") {
			currentWindowTint = mp.players.local.vehicle.getWindowTint();

			showWindowTintMenu();
		} else if (menuMap.has(itemName)) {
			currentModType = menuMap.get(itemName).modType;
			showConcreteMenu(currentModType);
		}
	} else if (menuName === "ls_customs_concreteMod") {
		if (currentActiveMod === itemIndex - 1) {
			return;
		}

		if (!await checkPrice("mods", currentModType, itemIndex, undefined, itemIndex)) {
			return;
		}

		currentActiveMod = itemIndex - 1;
		mp.events.callRemote("ls_customs::setMod", currentModType, currentActiveMod);
		showModificationSetMessage(itemName);
	} else if (menuName === "ls_customs_headlightsMenu") {
		if (itemName === "Headlights") {
			showHeadlightsMenu();
		} else if (itemName === "Neon Sets") {
			mp.events.call("selectMenu.show", "ls_customs_neonMenu");
		}
	} else if (menuName === "ls_customs_neonMenu") {
		if (itemName === "Neon Tubes") {
			showNeonPositionMenu();
		} else if (itemName === "Color of  Neon") {
			showNeonColorMenu();
		}
	} else if (menuName === "ls_customs_headlights") {
		if (isXenonEnabled === (itemIndex === 1)) {
			return;
		}

		if (!await checkPrice("mods", 22, itemIndex, undefined, itemIndex)) {
			return;
		}

		isXenonEnabled = itemIndex === 1;
		mp.events.callRemote("ls_customs::toggleMod", 22, isXenonEnabled);
		showModificationSetMessage(itemName);
	} else if (menuName === "ls_customs_neonPosition") {
		const states = getNeonValuesByIndex(itemIndex);
		let isOldValue = states.length === neonLightStates.length;

		for (const state of states) {
			if (neonLightStates.indexOf(state) < 0) {
				isOldValue = false;
				break;
			}
		}

		if (isOldValue) {
			return;
		}

		if (!await checkPrice("neonPosition", 0, itemIndex, undefined, itemIndex)) {
			return;
		}

		neonLightStates = states;
		mp.events.callRemote("ls_customs::enableNeon", JSON.stringify(neonLightStates));
		showModificationSetMessage(itemName);
	} else if (menuName === "ls_customs_neonColor") {
		const color = neonColors[itemIndex];

		if (currentNeonColor[0] === color[0] && currentNeonColor[1] === color[1] && currentNeonColor[2] === color[2]) {
			return;
		}

		if (!await checkPrice("neonColor", 0, itemIndex, undefined, itemIndex)) {
			return;
		}

		currentNeonColor = [ color[0], color[1], color[2] ];
		mp.events.callRemote("ls_customs::neonColor", color[0], color[1], color[2]);
		showModificationSetMessage(itemName);
	} else if (menuName === "ls_customs_hornsMenu") {
		currentHornType = itemIndex;
		showHornsMenu();
	} else if (menuName === "ls_customs_hornsConcrete") {
		const value = customsInfo.horns[currentHornType][itemIndex].value;

		if (currentHornValue === value) {
			return;
		}

		if (!await checkPrice("mods", 14, itemIndex, undefined, itemIndex)) {
			return;
		}

		currentHornValue = value;
		mp.events.callRemote("ls_customs::setMod", 14, currentHornValue);
		showModificationSetMessage(itemName);
	} else if (menuName === "ls_customs_numberPlate") {
		const value = getNumberPlateValueByIndex(itemIndex);

		if (currentNumberPlateType === value) {
			return;
		}

		if (!await checkPrice("numberPlateType", 0, itemIndex, undefined, itemIndex)) {
			return;
		}

		currentNumberPlateType = value;
		mp.events.callRemote("ls_customs::numberPlateType", currentNumberPlateType);
		showModificationSetMessage(itemName);
	} else if (menuName === "ls_customs_colorMenu") {
		isCurrentColorPrimary = itemIndex === 0;
		mp.events.call("selectMenu.show", "ls_customs_colorGroup");
	} else if (menuName === "ls_customs_colorGroup") {
		currentColorGroup = itemIndex;

		showConcreteColorMenu();
	} else if (menuName === "ls_customs_colorConcrete") {
		const value = customsInfo.colors[currentColorGroup][itemIndex];

		if (isCurrentColorPrimary) {
			if (currentPrimaryColor === value.color) {
				return;
			}

			if (!await checkPrice("color", 0, currentColorGroup, undefined, itemIndex)) {
				return;
			}

			currentPrimaryColor = value.color;
		} else {
			if (currentSecondaryColor === value.color) {
				return;
			}

			if (!await checkPrice("color", 0, currentColorGroup, undefined, itemIndex)) {
				return;
			}

			currentSecondaryColor = value.color;
		}

		mp.events.callRemote("ls_customs::setColor", currentPrimaryColor, currentSecondaryColor);
		showModificationSetMessage(itemName);
	} else if (menuName === "ls_customs_wheelsMenu") {
		currentTiresDesign = mp.players.local.vehicle.getModVariation(23);

		if (itemName === "Wheels") {
			const vehicle = mp.players.local.vehicle;
			let wheelMenu = "motoMenu";
			let selectedIndex = 0;

			if (mp.game.vehicle.isThisModelACar(vehicle.model)) {
				currentWheelType = vehicle.getWheelType();
				wheelMenu = "carMenu";
				selectedIndex = getWheelTypeIndexByValue(currentWheelType);
			} else {
				currentWheelType = 6;
			}

			mp.events.call("selectMenu.show", `ls_customs_wheels_${wheelMenu}`, selectedIndex);
		} else if (itemName === "Color of wheels") {
			showWheelsColorMenu();
		} else if (itemName === "Tires") {
			mp.events.call("selectMenu.show", `ls_customs_wheels_tiresMenu`);
		}
	} else if (menuName === "ls_customs_wheels_carMenu") {
		currentWheelModType = 23;
		selectedWheelType = getWheelTypeValueByIndex(itemIndex);
		selectedWheelTypeIndex = itemIndex;
		mp.players.local.vehicle.setWheelType(selectedWheelType);
		mp.events.call("selectMenu.show", "ls_customs_wheels_typeMenu");
	} else if (menuName === "ls_customs_wheels_motoMenu") {
		currentWheelModType = 23 + itemIndex;
		selectedWheelType = 6;
		selectedWheelTypeIndex = 0;
		mp.events.call("selectMenu.show", "ls_customs_wheels_typeMenu");
	} else if (menuName === "ls_customs_wheels_typeMenu") {
		currentWheelChunkIndex = itemIndex;

		showWheelsConcreteMenu();
	} else if (menuName === "ls_customs_wheels_concreteMenu") {
		const index = currentWheelChunk[itemIndex];

		if (currentWheelModIndex === index && selectedWheelType === currentWheelType) {
			return;
		}

		let priceKey;
		let priceIndex;

		if (mp.game.vehicle.isThisModelACar(mp.players.local.vehicle.model)) {
			priceKey = "carWheels";
			priceIndex = selectedWheelTypeIndex;
		} else {
			priceKey = "motoWheels";
			priceIndex = itemIndex;
		}

		if (!await checkPrice(priceKey, 0, priceIndex, undefined, itemIndex)) {
			return;
		}

		currentWheelModIndex = index;
		currentWheelType = selectedWheelType;
		mp.events.callRemote("ls_customs::setWheel", selectedWheelType, currentWheelModIndex, currentWheelModType === 24);
		showModificationSetMessage(itemName);
	} else if (menuName === "ls_customs_wheels_colors") {
		const color = customsInfo.wheelColors[itemIndex];

		if (currentWheelColor === color) {
			return;
		}

		if (!await checkPrice("wheelColor", 0, itemIndex, undefined, itemIndex)) {
			return;
		}

		currentWheelColor = color;
		mp.events.callRemote("ls_customs::setWheelColor", currentWheelColor);
		showModificationSetMessage(itemName);
	} else if (menuName === "ls_customs_wheels_tiresMenu") {
		if (itemName === "Tires Design") {
			const vehicle = mp.players.local.vehicle;

			if (isVehicleWheelsAreDefault(vehicle)) {
				mp.game.ui.notifications.show(mp.game.ui.getLabelText("CMOD_NOWHE"));
				return;
			}

			showTiresDesignMenu();
 		} else if (itemName === "Tire Improvement") {
			showTiresUpgradeMenu();
		} else if (itemName === "Tire Smoke") {
			showTiresSmokeColorMenu();
		}
	} else if (menuName === "ls_customs_wheels_tiresDesign") {
		if (currentTiresDesign === (itemIndex === 1)) {
			return;
		}

		if (!await checkPrice("tiresDesign", 0, itemIndex, undefined, itemIndex)) {
			return;
		}

		currentTiresDesign = itemIndex === 1;
		mp.events.callRemote("ls_customs::setCustomTires", currentTiresDesign);
		showModificationSetMessage(itemName);
	} else if (menuName === "ls_customs_wheels_tiresUpgrade") {
		const vehicle = mp.players.local.vehicle;

		if (!vehicle.getTyresCanBurst()) {
			return;
		}

		if (!await checkPrice("tiresBurst", 0, itemIndex, undefined, itemIndex)) {
			return;
		}

		vehicle.setTyresCanBurst(false);
		mp.events.callRemote("ls_customs::setTiresBurst", false);
		showModificationSetMessage(itemName);
	} else if (menuName === "ls_customs_wheels_tiresSmokeColor") {
		const color = customsInfo.tiresSmokeColors[itemIndex].color;

		if (currentTiresSmokeColor[0] === color[0] && currentTiresSmokeColor[1] === color[1] && currentTiresSmokeColor[2] === color[2]) {
			return;
		}

		if (!await checkPrice("tiresSmokeColor", 0, itemIndex, undefined, itemIndex)) {
			return;
		}

		currentTiresSmokeColor = [ color[0], color[1], color[2] ];
		mp.events.callRemote("ls_customs::setTiresSmokeColor", color[0], color[1], color[2]);
		showModificationSetMessage(itemName);
	} else if (menuName === "ls_customs_turbo") {
		const value = itemIndex === 1;

		if (isVehicleToggleModOn(mp.players.local.vehicle, 18) === value) {
			return;
		}

		if (!await checkPrice("mods", 18, itemIndex, undefined, itemIndex)) {
			return;
		}

		mp.players.local.vehicle.toggleMod(18, value);
		mp.events.callRemote("ls_customs::toggleMod", 18, value);
		showModificationSetMessage(itemName);
	} else if (menuName === "ls_customs_windows") {
		const windowTint = getWindowTintValueByIndex(itemIndex);

		if (currentWindowTint === windowTint) {
			return;
		}

		if (!await checkPrice("windowTint", 0, itemIndex, undefined, itemIndex)) {
			return;
		}

		currentWindowTint = windowTint;
		mp.events.callRemote("ls_customs::setWindowTint", currentWindowTint);
		showModificationSetMessage(itemName);
	}
});

mp.events.add("selectMenu.itemFocusChanged", (menuName, itemName, itemValue, itemIndex, valueIndex) => {
	if (menuName === "ls_customs_concreteMod") {
		if (currentModType === -1) {
			return;
		}

		mp.players.local.vehicle.setMod(currentModType, itemIndex - 1);
	} else if (menuName === "ls_customs_headlights") {
		mp.players.local.vehicle.toggleMod(22, itemIndex === 1);
	} else if (menuName === "ls_customs_neonPosition") {
		setNeonLight(mp.players.local.vehicle, getNeonValuesByIndex(itemIndex));
	} else if (menuName === "ls_customs_neonColor") {
		const color = neonColors[itemIndex];

		mp.players.local.vehicle.setNeonLightsColour(color[0], color[1], color[2]);
	} else if (menuName === "ls_customs_hornsConcrete") {
		const currentHorn = customsInfo.horns[currentHornType][itemIndex];
		let value = currentHorn.value;

		if (value === 42 || value === 44) {
			value++;
		}

		invisibleVehicle.setMod(14, value);
		invisibleVehicle.startHorn(currentHorn.duration, mp.game.joaat("HELDDOWN"), false);
	} else if (menuName === "ls_customs_numberPlate") {
		const value = getNumberPlateValueByIndex(itemIndex);

		mp.players.local.vehicle.setNumberPlateTextIndex(value);
	} else if (menuName === "ls_customs_colorConcrete") {
		const vehicle = mp.players.local.vehicle;
		const value = customsInfo.colors[currentColorGroup][itemIndex];

		if (isCurrentColorPrimary) {
			vehicle.setColours(value.color, currentSecondaryColor);
		} else {
			vehicle.setColours(currentPrimaryColor, value.color);
		}
	} else if (menuName === "ls_customs_wheels_concreteMenu") {
		setVehicleWheel(mp.players.local.vehicle, currentWheelModType, currentWheelChunk[itemIndex], currentTiresDesign);
	} else if (menuName === "ls_customs_wheels_colors") {
		setVehicleWheelColor(mp.players.local.vehicle, customsInfo.wheelColors[itemIndex]);
	} else if (menuName === "ls_customs_wheels_tiresDesign") {
		setVehicleTiresDesign(mp.players.local.vehicle, itemIndex === 1);
	} else if (menuName === "ls_customs_windows") {
		mp.players.local.vehicle.setWindowTint(getWindowTintValueByIndex(itemIndex));
	}
});

mp.events.add("selectMenu.backspacePressed", (menuName) => {
	if (menuName === "ls_customs_concreteMod") {
		mp.events.call("selectMenu.show", "ls_customs_main", mainMenuIndex);
		mp.players.local.vehicle.setMod(currentModType, currentActiveMod);
		currentModType = -1;
	} else if (menuName === "ls_customs_headlightsMenu") {
		mp.events.call("selectMenu.show", "ls_customs_main", mainMenuIndex);
	} else if (menuName === "ls_customs_headlights") {
		const vehicle = mp.players.local.vehicle;

		mp.events.call("selectMenu.show", "ls_customs_headlightsMenu");
		vehicle.setLights(1);
		vehicle.setLights(0);
		vehicle.toggleMod(22, isXenonEnabled);
	} else if (menuName === "ls_customs_neonMenu") {
		mp.events.call("selectMenu.show", "ls_customs_headlightsMenu");
	} else if (menuName === "ls_customs_neonPosition") {
		mp.events.call("selectMenu.show", "ls_customs_neonMenu");
		setNeonLight(mp.players.local.vehicle, neonLightStates);
	} else if (menuName === "ls_customs_neonColor") {
		mp.events.call("selectMenu.show", "ls_customs_neonMenu");
		mp.players.local.vehicle.setNeonLightsColour(currentNeonColor[0], currentNeonColor[1], currentNeonColor[2]);
	} else if (menuName === "ls_customs_hornsMenu") {
		mp.events.call("selectMenu.show", "ls_customs_main", mainMenuIndex);
	} else if (menuName === "ls_customs_hornsConcrete") {
		mp.players.local.vehicle.setMod(14, currentHornValue);
		mp.events.call("selectMenu.show", "ls_customs_hornsMenu");
	} else if (menuName === "ls_customs_numberPlate") {
		mp.players.local.vehicle.setNumberPlateTextIndex(currentNumberPlateType);
		mp.events.call("selectMenu.show", "ls_customs_main", mainMenuIndex);
	} else if (menuName === "ls_customs_colorMenu") {
		mp.events.call("selectMenu.show", "ls_customs_main", mainMenuIndex);
	} else if (menuName === "ls_customs_colorGroup") {
		mp.events.call("selectMenu.show", "ls_customs_colorMenu");
	} else if (menuName === "ls_customs_colorConcrete") {
		mp.players.local.vehicle.setColours(currentPrimaryColor, currentSecondaryColor);
		mp.events.call("selectMenu.show", "ls_customs_colorGroup");
	} else if (menuName === "ls_customs_wheelsMenu") {
		mp.events.call("selectMenu.show", "ls_customs_main", mainMenuIndex);
	} else if (menuName === "ls_customs_wheels_motoMenu") {
		mp.events.call("selectMenu.show", "ls_customs_wheelsMenu");
	} else if (menuName === "ls_customs_wheels_carMenu") {
		mp.events.call("selectMenu.show", "ls_customs_wheelsMenu");
	} else if (menuName === "ls_customs_wheels_typeMenu") {
		if (mp.game.vehicle.isThisModelACar(mp.players.local.vehicle.model)) {
			mp.events.call("selectMenu.show", "ls_customs_wheels_carMenu", getWheelTypeIndexByValue(selectedWheelType));
		} else {
			mp.events.call("selectMenu.show", "ls_customs_wheels_motoMenu");
		}
	} else if (menuName === "ls_customs_wheels_concreteMenu") {
		setVehicleWheel(mp.players.local.vehicle, currentWheelModType, currentWheelModIndex, currentTiresDesign);
		mp.events.call("selectMenu.show", "ls_customs_wheels_typeMenu");
	} else if (menuName === "ls_customs_wheels_colors") {
		setVehicleWheelColor(mp.players.local.vehicle, currentWheelColor);
		mp.events.call("selectMenu.show", "ls_customs_wheelsMenu");
	} else if (menuName === "ls_customs_wheels_tiresMenu") {
		mp.events.call("selectMenu.show", "ls_customs_wheelsMenu");
	} else if (menuName === "ls_customs_wheels_tiresDesign") {
	 	setVehicleTiresDesign(mp.players.local.vehicle, currentTiresDesign);
		mp.events.call("selectMenu.show", "ls_customs_wheels_tiresMenu");
	} else if (menuName === "ls_customs_wheels_tiresUpgrade") {
		mp.events.call("selectMenu.show", "ls_customs_wheels_tiresMenu");
	} else if (menuName === "ls_customs_wheels_tiresSmokeColor") {
		mp.players.local.vehicle.setTyreSmokeColor(currentTiresSmokeColor[0], currentTiresSmokeColor[1], currentTiresSmokeColor[2]);
		mp.events.call("selectMenu.show", "ls_customs_wheels_tiresMenu");
	} else if (menuName === "ls_customs_turbo") {
		mp.events.call("selectMenu.show", "ls_customs_main", mainMenuIndex);
	} else if (menuName === "ls_customs_windows") {
		mp.players.local.vehicle.setWindowTint(currentWindowTint);
		mp.events.call("selectMenu.show", "ls_customs_main", mainMenuIndex);
	}
});

mp.events.add("entityStreamIn", (entity) => {
	if (entity.type !== "vehicle") {
		return;
	}

	if (mp.game.vehicle.isThisModelABike(entity.model)) {
		entity.setWheelType(6);
	}

	if (vehiclesSyncData.has(entity.remoteId)) {
		syncVehicle(entity, vehiclesSyncData.get(entity.remoteId));
	}
});

mp.events.add("ls_customs::sync", (vehicleId, rawData) => {
	let data = vehiclesSyncData.get(vehicleId);
	const newData = JSON.parse(rawData);

	if (data === undefined) {
		vehiclesSyncData.set(vehicleId, newData);
	} else {
		for (const key of Object.keys(newData)) {
			data[key] = newData[key];
		}
	}

	const vehicle = mp.vehicles.atRemoteId(vehicleId);

	if (!vehicle || vehicle.handle === 0) {
		return;
	}

	syncVehicle(vehicle, vehiclesSyncData.get(vehicleId));
});

mp.events.add("ls_customs::sync_all", (rawCustomsInfo, rawData) => {
	customsInfo = JSON.parse(rawCustomsInfo);

	for (const place of customsInfo.places) {
		doorControl(true, place.door.model, place.door.position);

	}

	vehiclesSyncData = rawData === undefined ? new Map() : new Map(JSON.parse(rawData));

	for (const vehicleSyncData of vehiclesSyncData) {
		const vehicle = mp.vehicles.atRemoteId(vehicleSyncData[0]);

		if (!vehicle ||  vehicle.handle === 0) {
			continue;
		}

		syncVehicle(vehicle, vehicleSyncData[1]);
	}
});

mp.events.add("ls_customs::remove_sync_vehicle", (vehicleId) => {
	if (!vehiclesSyncData || !vehiclesSyncData.has(vehicleId)) {
		return;
	}

	vehiclesSyncData.delete(vehicleId);
});

function syncVehicle(vehicle, data) {
	const modKit = vehicle.getModKit();

	vehicle.setModKit(0);
	vehicle.toggleMod(18, data.turbo);
	vehicle.toggleMod(22, data.isXenon);
	vehicle.setTyresCanBurst(data.tiresCanBurst);

	if (Array.isArray(data.enabledNeons)) {
		setNeonLight(vehicle, data.enabledNeons);
	}

	if (Array.isArray(data.neonColor)) {
		vehicle.setNeonLightsColour(data.neonColor[0], data.neonColor[1], data.neonColor[2]);
	}

	if (typeof(data.wheelType) === "number") {
		vehicle.setWheelType(data.wheelType);
	}

	if (typeof(data.wheel) === "number") {
		setVehicleWheel(vehicle, 23, data.wheel, data.tiresCustomDesign);
	} else {
		setVehicleTiresDesign(vehicle, data.tiresCustomDesign);
	}

	if (typeof(data.backWheel) === "number") {
		setVehicleWheel(vehicle, 24, data.backWheel, data.tiresCustomDesign);
	} else {
		setVehicleTiresDesign(vehicle, data.tiresCustomDesign);
	}

	if (Array.isArray(data.tiresSmokeColor)) {
		vehicle.toggleMod(20, true);
		vehicle.setTyreSmokeColor(data.tiresSmokeColor[0], data.tiresSmokeColor[1], data.tiresSmokeColor[2]);
	} else {
		vehicle.toggleMod(20, false);
	}

	if (Array.isArray(data.mods) && data.mods.length > 0) {
		for (const mod of data.mods) {
			setVehicleMod(vehicle, mod[0], mod[1]);
		}
	}

	if (typeof(data.numberPlateType) === "number") {
		vehicle.setNumberPlateTextIndex(data.numberPlateType);
	}

	if (typeof(data.wheelColor) === "number") {
		setVehicleWheelColor(vehicle, data.wheelColor);
	}

	if (typeof(data.windowTint) === "number") {
		vehicle.setWindowTint(data.windowTint);
	}

	vehicle.setModKit(modKit);
}

function stopEnterInteraction() {
	const place = customsInfo.places[customsInfo.currentPlace];

	doorControl(true, place.door.model, place.door.position);

	if (enterInteractionColshape !== undefined) {
		enterInteractionColshape.destroy();
		enterInteractionColshape = undefined;
	}
}

function onStartTuning(vehicle, isOccupant) {
	const vehPosition = vehicle.position;
	const vehHeading = vehicle.getHeading();

	currentModKit = vehicle.getModKit();
	vehicle.setModKit(0);

	let cameraOffset = new mp.Vector3(-3.5, 4, 0.5);

	const interior = mp.game.interior.getInteriorAtCoords(vehPosition.x, vehPosition.y, vehPosition.z);

	if (interior === 179457 || interior === 201729) {
		doorControl(false, -822900180, new mp.Vector3(110.594, 6628.001, 32.26));
		doorControl(false, -822900180, new mp.Vector3(1174.656, 2644.159, 40.50673));
		cameraOffset = new mp.Vector3(-2.5, 3.5, 0.5);
	}

	cameraRotator.start(camera, vehPosition, vehPosition, cameraOffset, vehHeading, 42.5);
	cameraRotator.setZBound(-0.8, 1.8);
	cameraRotator.setZUpMultipler(5);

	mp.gui.cursor.visible = true;
	mp.game.ui.requestAdditionalText("MOD_MNU", 9);

	if (isOccupant) {
		fadeScreen(false, 50);
	} else {
		showMenu(vehicle);
	}

	showSpecMenu(true);
}

function disableControls() {
	for (const control of controlsToDisable) {
		mp.game.controls.disableControlAction(0, control, true);
	}
}

// TODO
function isValidVehicle() {
	const localPlayer = mp.players.local;
	const vehicle = localPlayer.vehicle;

	if (!vehicle) {
		return false;
	}

	const vehModel = vehicle.model;

	return mp.game.vehicle.isThisModelABike(vehModel) || mp.game.vehicle.isThisModelACar(vehModel);
}

function getCurrentPlaceIndex() {
	const localPlayer = mp.players.local;
	const heading = localPlayer.vehicle.getHeading();
	let index = 0;

	for (const place of customsInfo.places) {
		if (
			isEntityInAngledArea(localPlayer, place.angledArea.origin, place.angledArea.edge, place.angledArea.angle)
			&& (isHeadingBound(heading, place.angledArea.headingBound[0], place.angledArea.headingBound[1]) || index === 4)
		) {
				return index;
			}

		index++;
	}

	return -1;
}

function createLamp(place) {
	lampObj = mp.objects.new(place.lampObj.model, place.lampObj.position, {
		rotation: place.lampObj.rotation,
		dimension: mp.players.local.dimension
	});

	lampObj.setCollision(false, false);
	lampObj.freezePosition(true);
}

function isEntityInAngledArea(entity, origin, edge, angle) {
	return entity.isInAngledArea(origin.x, origin.y, origin.z, edge.x, edge.y, edge.z, angle, false, true, 0);
}

function doorControl(locked, model, position) {
	mp.game.object.doorControl(model, position.x, position.y, position.z, locked, 0, 0, 0);
}

function setCamParams(camera, position, rotation, fov, duration, unk) {
	camera.setParams(position.x, position.y, position.z, rotation.x, rotation.y, rotation.z, fov, duration, unk, 1, 2);
}

function vehicleFollowWaypoint(vehicle, waypointRecord, unk1, unk2, unk3, unk4, unk5, unk6, unk7) {
	requestWaipointRecording(waypointRecord);
	mp.players.local.taskVehicleFollowWaypointRecording(vehicle.handle, waypointRecord, unk1, unk2, unk3, unk4, unk5, unk6, unk7);

	return new Promise((resolve, reject) => {
		let counter = 0;
		const interval = setInterval(() => {
			if (mp.game.invoke("0xF5134943EA29868C", vehicle.handle) === 0) {
				clearInterval(interval);
				resolve(vehicle);
			}

			if (counter++ > 100000) {
				clearInterval(interval);
				reject(new Error("Vehicle follow failed"));
			}
		}, 10);
	});
}

function requestWaipointRecording(name) {
	mp.game.invoke("0x9EEFB62EB27B5792", name);

	while(!mp.game.invoke("0xCB4E8BE8A0063C5D", name)) {
		mp.game.wait(0);
	}
}

function isHeadingBound(heading, bound1, bound2) {
	let dBound1 = (bound1 - bound2);

	if (dBound1 < 0) {
		dBound1 = (dBound1 + 360);
	}

	let dbound2 = (bound1 + bound2);

	if (dbound2 >= 360) {
		dbound2 = (dbound2 - 360);
	}

	return dbound2 > dBound1 ? (heading < dbound2 && heading > dBound1) : (heading < dbound2 || heading > dBound1);
}

function fadeScreen(state, duration) {
	if (state) {
		mp.game.cam.doScreenFadeOut(duration);
	} else {
		mp.game.cam.doScreenFadeIn(duration);
	}
}

function getRepairCost(vehicle) {
	const model = vehicle.model;
	let sum = 0;

	const dirtLevel = vehicle.getDirtLevel();

	if (dirtLevel > 10) {
		sum += 8;
	} else if (dirtLevel > 5) {
		sum += 4;
	}

	const engineHealth = vehicle.getEngineHealth() / 1000;

	if (engineHealth <= 0.99) {
		if (engineHealth > 0.8) {
			sum += 20;
		} else if (engineHealth > 0.6) {
			sum += 40;
		} else if (engineHealth > 0.4) {
			sum += 80;
		} else {
			sum += 100;
		}
	}

	const petrolTankHealth = vehicle.getPetrolTankHealth() / 1000;

	if (petrolTankHealth <= 0.99) {
		if (petrolTankHealth > 0.8) {
			sum += 20;
		} else if (petrolTankHealth > 0.6) {
			sum += 40;
		} else if (petrolTankHealth > 0.4) {
			sum += 60;
		} else {
			sum += 75;
		}
	}

	const health = vehicle.getHealth() / 1000;

	if (health <= 0.99) {
		if (health > 0.8) {
			sum += 40;
		} else if (health > 0.6) {
			sum += 80;
		} else if (health > 0.4) {
			sum += 150;
		} else {
			sum += 200;
		}
	}

	if (vehicle.isDamaged()) {
		sum += 50;
	}

	for (let i = 0; i < 2; i ++) {
		const value = i === 1;

		if (vehicle.isBumperBrokenOff(value)) {
			sum += 50;
		}

		if (mp.game.invoke("0x27B926779DEB502D", vehicle.handle, value)) {
			sum += 50;
		}
	}

	if (!vehicle.areAllWindowsIntact()) {
		sum += 20;

		if (!vehicle.isWindowIntact(6)) {
			sum += 40;
		}

		if (!vehicle.isWindowIntact(7)) {
			sum += 40;
		}
	}

	if (mp.game.vehicle.isThisModelACar(model)) {
		for (let i = 0; i < 6; i++) {
			if (vehicle.isDoorDamaged(i)) {
				sum += 25;
			}
		}
	}

	if (vehicle.getIsLeftHeadlightDamaged()) {
		sum += 15;
	}

	if (vehicle.getIsRightHeadlightDamaged()) {
		sum += 15;
	}

	for (let i = 0; i < 8; i++) {
		if (vehicle.isTyreBurst(i, false)) {
			sum += 25;
		}
	}

	if (mp.game.invoke("0x5DB8010EE71FDEF2", vehicle.handle)) {
		sum += 50;
	}

	return sum;
}

function showMenu(vehicle, forceMain = false) {
	if (!forceMain) {
		const repairCost = getRepairCost(vehicle);

		if (repairCost > 0) {
			showRepairMenu(repairCost);
			return;
		}
	}

	const menuItems = [];

	addSubmenuItem(vehicle, 16, menuItems);
	addSubmenuItem(vehicle, 12, menuItems);
	addSubmenuItem(vehicle, 1, menuItems);
	addSubmenuItem(vehicle, 2, menuItems);
	addSubmenuItem(vehicle, 11, menuItems);
	addSubmenuItem(vehicle, 4, menuItems);
	addSubmenuItem(vehicle, 6, menuItems);
	addSubmenuItem(vehicle, 7, menuItems);
	addSubmenuItem(vehicle, 10, menuItems);

	// Horns
	menuItems.push({ text: "Horns" });
	// Headlights
	menuItems.push({ text: "Headlights" });
	// NumberPlate
	menuItems.push({ text: "Numbers" });
	// Color
	menuItems.push({ text: "Coloring" });

	addSubmenuItem(vehicle, 5, menuItems);
	addSubmenuItem(vehicle, 3, menuItems);
	addSubmenuItem(vehicle, 0, menuItems);
	addSubmenuItem(vehicle, 15, menuItems);
	addSubmenuItem(vehicle, 13, menuItems);

	// Turbo
	menuItems.push({ text: "Turbo-Supercharging" });
	// Wheels
	menuItems.push({ text: "Wheels" });

	// WindowTint
	if (mp.game.vehicle.isThisModelACar(vehicle.model)) {
		menuItems.push({ text: "Glass" });
	}

	menuItems.push({text: "Exit"})

	mp.events.call("selectMenu.setSpecialItems", "ls_customs_main", menuItems);
	mp.events.call("selectMenu.show", "ls_customs_main");
}

const menuMap = new Map();

function addSubmenuItem(vehicle, modType, collection) {
	const mods = vehicle.getNumMods(modType);

	if (mods <= 0) {
		return;
	}

	const text = getModSlotName(modType);

	if (!menuMap.has(text)) {
		menuMap.set(text, { modType });
	}

	collection.push({text});
}

let currentActiveMod;

const blockedModLabels = [ "WTD_V_COM_MG", "WT_V_AKU_MN" ];

function showConcreteMenu(modType) {
	if (checkPriceMenuItemIndex !== undefined) {
		return mp.events.call("selectMenu.show", "ls_customs_concreteMod", checkPriceMenuItemIndex);
	}

	const vehicle = mp.players.local.vehicle;

	currentActiveMod = vehicle.getMod(modType);

	mp.events.call("selectMenu.setHeader", "ls_customs_concreteMod", `LS Customs: ${getModSlotName(modType)}`);

	const modsCount = vehicle.getNumMods(modType);
	const items = [];
	const stockValue = getStockValue(modType);
	let selectedIndex = 0;
	let itemIdx = 0;

	if(stockValue) {
		items.push({text: escapeHtml(mp.game.ui.getLabelText(stockValue)), values: [getModPrice(modType, 0)]});
		itemIdx++;
	}

	for (let i = 0; i < modsCount; i++) {
		if (currentActiveMod === i) {
			selectedIndex = i + 1;
		}

		let label = vehicle.getModTextLabel(modType, i);

		if (blockedModLabels.indexOf(label) >= 0) {
			continue;
		}

		if (typeof(label) !== "string" || label.length < 1) {
			label = getModLabel(modType, i);
		}

		items.push({text: escapeHtml(mp.game.ui.getLabelText(label)), values: [getModPrice(modType, itemIdx++)]});
	}

	mp.events.call("selectMenu.setSpecialItems", "ls_customs_concreteMod", items);
	mp.events.call("selectMenu.show", "ls_customs_concreteMod", selectedIndex);
}

function showHeadlightsMenu() {
	if (checkPriceMenuItemIndex !== undefined) {
		return mp.events.call("selectMenu.show", "ls_customs_headlights", checkPriceMenuItemIndex);
	}

	const vehicle = mp.players.local.vehicle;

	currentModType = 22;
	isXenonEnabled = isVehicleToggleModOn(vehicle, 22);

	const items = [
		{ text: "Standard Headlights", values: [getModPrice(22, 0)] },
		{ text: "Xenon Headlights", values: [getModPrice(22, 1)] }
	];

	mp.events.call("selectMenu.setSpecialItems", "ls_customs_headlights", items);
	mp.events.call("selectMenu.show", "ls_customs_headlights", isXenonEnabled ? 1 : 0);
	vehicle.setLights(2);
}

function showNeonPositionMenu() {
	if (checkPriceMenuItemIndex !== undefined) {
		return mp.events.call("selectMenu.show", "ls_customs_neonPosition", checkPriceMenuItemIndex);
	}

	const vehicle = mp.players.local.vehicle;

	currentModType = 200;
	neonLightStates = [];

	for (let i = 0; i < 4; i++) {
		if (!isVehicleNeonLightEnabled(vehicle, i)) {
			continue;
		}

		neonLightStates.push(i);
	}

	const items = [
		{ text: "Not", values: [getModPrice(0, 0, "neonPosition")] },
		{ text: "Front", values: [getModPrice(0, 1, "neonPosition")] },
		{ text: "Back", values: [getModPrice(0, 2, "neonPosition")] },
		{ text: "Sides", values: [getModPrice(0, 3, "neonPosition")] },
		{ text: "Front & Back", values: [getModPrice(0, 4, "neonPosition")] },
		{ text: "Front & Sides", values: [getModPrice(0, 5, "neonPosition")] },
		{ text: "Back & Sides", values: [getModPrice(0, 6, "neonPosition")] },
		{ text: "Front, back and sides", values: [getModPrice(0, 7, "neonPosition")] },
	];

	mp.events.call("selectMenu.setSpecialItems", "ls_customs_neonPosition", items);
	mp.events.call("selectMenu.show", "ls_customs_neonPosition", getIndexByNeonValues(neonLightStates));
}

function showNeonColorMenu() {
	if (checkPriceMenuItemIndex !== undefined) {
		return mp.events.call("selectMenu.show", "ls_customs_neonColor", checkPriceMenuItemIndex);
	}

	const colorObj = mp.players.local.vehicle.getNeonLightsColour(0, 0, 0);

	currentModType = 201;
	currentNeonColor = [ colorObj.r, colorObj.g, colorObj.b ];

	const items = [];

	for(let i = 0; i < neonColorNames.length; i++) {
		items.push({ text: escapeHtml(neonColorNames[i]), values: [ getModPrice(0, i, "neonColor") ] });
	}

	mp.events.call("selectMenu.setSpecialItems", "ls_customs_neonColor", items);
	mp.events.call("selectMenu.show", "ls_customs_neonColor", getNeonColorIndexByColor(colorObj.r, colorObj.g, colorObj.b));
}

function showHornsMenu() {
	if (checkPriceMenuItemIndex !== undefined) {
		return mp.events.call("selectMenu.show", "ls_customs_hornsConcrete", checkPriceMenuItemIndex);
	}

	currentModType = 14;

	if (currentHornType === 0) {
		mp.events.call("selectMenu.setHeader", "ls_customs_hornsConcrete", "Horns: Стандартные");
	} else if (currentHornType === 1) {
		mp.events.call("selectMenu.setHeader", "ls_customs_hornsConcrete", "Horns: Музыкальные");
	} else {
		mp.events.call("selectMenu.setHeader", "ls_customs_hornsConcrete", "Horns: С повтором");
	}

	const items = [];
	const currentHorns = customsInfo.horns[currentHornType];
	let selectedIndex = 0;

	for (let i = 0; i < currentHorns.length; i++) {
		if (currentHorns[i].value === currentHornValue) {
			selectedIndex = i;
		}

		items.push({ text: currentHorns[i].label, values: [getModPrice(14, i)] });
	}

	mp.events.call("selectMenu.setSpecialItems", "ls_customs_hornsConcrete", items);
	mp.events.call("selectMenu.show", "ls_customs_hornsConcrete", selectedIndex);
}

function showNumberPlateMenu() {
	if (checkPriceMenuItemIndex !== undefined) {
		return mp.events.call("selectMenu.show", "ls_customs_numberPlate", checkPriceMenuItemIndex);
	}

	const items = [];

	currentModType = 202;
	currentNumberPlateType = mp.players.local.vehicle.getNumberPlateTextIndex();

	for (let i = 0; i < numberPlateTypeValues.length; i++) {
		items.push({ text: numberPlateTypeValues[i], values: [ getModPrice(0, i, "numberPlateType") ] });
	}

	mp.events.call("selectMenu.setSpecialItems", "ls_customs_numberPlate", items);
	mp.events.call("selectMenu.show", "ls_customs_numberPlate", getNumberPlateIndexByValue(currentNumberPlateType));
}

function showConcreteColorMenu() {
	if (checkPriceMenuItemIndex !== undefined) {
		return mp.events.call("selectMenu.show", "ls_customs_colorConcrete", checkPriceMenuItemIndex);
	}

	const { colorPrimary, colorSecondary } = mp.players.local.vehicle.getColours(0, 0);

	currentModType = 203;
	currentPrimaryColor = colorPrimary;
	currentSecondaryColor = colorSecondary;

	const items = [];
	const colorGroup = customsInfo.colors[currentColorGroup];
	const price = getModPrice(0, currentColorGroup, "color");
	let selectedIndex = 0;

	for (let i = 0; i < colorGroup.length; i++) {
		if ((isCurrentColorPrimary && currentPrimaryColor === colorGroup[i].color)
			|| (!isCurrentColorPrimary && currentSecondaryColor === colorGroup[i].color)) {
			selectedIndex = i;
		}

		items.push({
			text: mp.game.ui.getLabelText(colorGroup[i].text),
			values: [price]
		});
	}

	mp.events.call("selectMenu.setSpecialItems", "ls_customs_colorConcrete", items);
	mp.events.call("selectMenu.show", "ls_customs_colorConcrete", selectedIndex);

	if (currentColorGroup === 0) {
		if (isCurrentColorPrimary) {
			mp.players.local.vehicle.setColours(colorGroup[0].color, currentSecondaryColor);
		} else {
			mp.players.local.vehicle.setColours(currentPrimaryColor, colorGroup[0].color);
		}
	}
}

function showWheelsConcreteMenu() {
	if (checkPriceMenuItemIndex !== undefined) {
		return mp.events.call("selectMenu.show", "ls_customs_wheels_concreteMenu", checkPriceMenuItemIndex);
	}

	const vehicle = mp.players.local.vehicle;
	let selectedIndex = 0;
	const modsCount = vehicle.getNumMods(currentWheelModType);
	const items = [ { text: mp.game.ui.getLabelText("CMOD_WHE_0") } ];
	const allValues = Array.range(modsCount);

	if (mp.game.vehicle.isThisModelACar(vehicle.model)) {
		currentWheelChunk = [-1, ...allValues.chunk(modsCount / 2)[currentWheelChunkIndex]];
	} else {
		const firstPart = allValues.chunk(13);
		const secondPart = allValues.slice(26).chunk(23);

		currentWheelChunk = [-1, ...firstPart[currentWheelChunkIndex], ...secondPart[currentWheelChunkIndex]];
	}

	currentModType = 204;
	currentWheelModIndex = vehicle.getMod(currentWheelModType);

	let priceKey;
	let priceIndex;

	if (mp.game.vehicle.isThisModelACar(mp.players.local.vehicle.model)) {
		priceKey = "carWheels";
		priceIndex = selectedWheelTypeIndex;
	} else {
		priceKey = "motoWheels";
		priceIndex = itemIndex;
	}

	const price = getModPrice(0, priceIndex, priceKey);

	for (let i = 1; i < currentWheelChunk.length; i++) {
		const value = currentWheelChunk[i];

		if (selectedWheelType === currentWheelType && currentWheelModIndex === value) {
			selectedIndex = i;
		}

		let label = vehicle.getModTextLabel(currentWheelModType, value);

		items.push({text: mp.game.ui.getLabelText(label), values: [price]});
	}

	mp.events.call("selectMenu.setSpecialItems", "ls_customs_wheels_concreteMenu", items);
	mp.events.call("selectMenu.show", "ls_customs_wheels_concreteMenu", selectedIndex);
}

function showTurboMenu() {
	if (checkPriceMenuItemIndex !== undefined) {
		return mp.events.call("selectMenu.show", "ls_customs_turbo", checkPriceMenuItemIndex);
	}

	currentModType = 18;

	const items = [
		{
			text: "Not",
			values: [getModPrice(18, 0)]
		}, {
			text: "Turbo Tuning",
			values: [getModPrice(18, 1)]
		}
	];

	mp.events.call("selectMenu.setSpecialItems", "ls_customs_turbo", items);
	mp.events.call("selectMenu.show", "ls_customs_turbo", mp.players.local.vehicle.isToggleModOn(18) ? 1 : 0);
}

function showWheelsColorMenu() {
	if (checkPriceMenuItemIndex !== undefined) {
		return mp.events.call("selectMenu.show", "ls_customs_wheels_colors", checkPriceMenuItemIndex);
	}

	const vehicle = mp.players.local.vehicle;

	if (isVehicleWheelsAreDefault(vehicle)) {
		mp.game.ui.notifications.show(mp.game.ui.getLabelText("CMOD_NOWHE"));
		return;
	}

	if (isVehicleWheelsAreChrome(vehicle)) {
		mp.game.ui.notifications.show(mp.game.ui.getLabelText("CMOD_CHRWHE"));
		return;
	}

	const { wheelColor } = vehicle.getExtraColours(0, 0);
	const items = [];
	let selectedIndex = 0;

	currentModType = 205;
	currentWheelColor = wheelColor;

	for (let i = 0; i < customsInfo.wheelColors.length; i++) {
		if (customsInfo.wheelColors[i] === currentWheelColor) {
			selectedIndex = i;
		}

		items.push({ text: mp.game.ui.getLabelText(`CMOD_COL5_${i}`), values: [getModPrice(0, i, "wheelColor")] });
	}

	mp.events.call("selectMenu.setSpecialItems", "ls_customs_wheels_colors", items);
	mp.events.call("selectMenu.show", "ls_customs_wheels_colors", selectedIndex);
}

function showTiresDesignMenu() {
	if (checkPriceMenuItemIndex !== undefined) {
		return mp.events.call("selectMenu.show", "ls_customs_wheels_tiresDesign", checkPriceMenuItemIndex);
	}

	currentModType = 206;

	const items = [
		{ text: "Usual tires", values: [getModPrice(0, 0, "tiresDesign")] },
		{ text: "Custom tires", values: [getModPrice(0, 1, "tiresDesign")] }
	];

	mp.events.call("selectMenu.setSpecialItems", "ls_customs_wheels_tiresDesign", items);
	mp.events.call("selectMenu.show", "ls_customs_wheels_tiresDesign", mp.players.local.vehicle.getModVariation(23) ? 1 : 0);
}

function showTiresUpgradeMenu() {
	if (checkPriceMenuItemIndex !== undefined) {
		return mp.events.call("selectMenu.show", "ls_customs_wheels_tiresUpgrade", checkPriceMenuItemIndex);
	}

	currentModType = 207;

	const items = [
		{ text: "Bulletproof tires", values: [getModPrice(0, 0, "tiresBurst")] }
	];

	mp.events.call("selectMenu.setSpecialItems", "ls_customs_wheels_tiresUpgrade", items);
	mp.events.call("selectMenu.show", "ls_customs_wheels_tiresUpgrade");
}

function showTiresSmokeColorMenu() {
	if (checkPriceMenuItemIndex !== undefined) {
		return mp.events.call("selectMenu.show", "ls_customs_wheels_tiresSmokeColor", checkPriceMenuItemIndex);
	}

	const items = [];
	const { r, g, b } = mp.players.local.vehicle.getTyreSmokeColor(0, 0, 0);
	let selectedIndex = 0;

	currentModType = 208;
	currentTiresSmokeColor = [ r, g, b ];

	for (let i = 0; i < customsInfo.tiresSmokeColors.length; i++) {
		const color = customsInfo.tiresSmokeColors[i];

		if (color[0] === r && color[1] === g && color[2] === b) {
			selectedIndex = i;
		}

		items.push({ text: mp.game.ui.getLabelText(color.text), values: [getModPrice(0, i, "tiresSmokeColor")] });
	}

	mp.events.call("selectMenu.setSpecialItems", "ls_customs_wheels_tiresSmokeColor", items);
	mp.events.call("selectMenu.show", "ls_customs_wheels_tiresSmokeColor", selectedIndex);
}

function showWindowTintMenu() {
	if (checkPriceMenuItemIndex !== undefined) {
		return mp.events.call("selectMenu.show", "ls_customs_windows", checkPriceMenuItemIndex);
	}

	const items = [
		{ text: "Not", values: [getModPrice(0, 0, "windowTint")] },
		{ text: "Weak blackout", values: [getModPrice(0, 1, "windowTint")] },
		{ text: "Average blackout", values: [getModPrice(0, 2, "windowTint")] },
		{ text: "Limousine", values: [getModPrice(0, 3, "windowTint")] }
	];

	currentModType = 209;

	mp.events.call("selectMenu.setSpecialItems", "ls_customs_windows", items);
	mp.events.call("selectMenu.show", "ls_customs_windows", getWindowTintIndexByValue(currentWindowTint));
}

function getModPrice(modType, index, subKey = "mods") {
	let price;

	if (subKey === "mods") {
		if (Array.isArray(customsInfo.prices[subKey][modType])) {
			price = customsInfo.prices[subKey][modType][index];
		} else if (typeof(customsInfo.prices[subKey][modType]) === "object") {
			price = customsInfo.prices[subKey][modType].base + (index * customsInfo.prices[subKey][modType].add);
		}
	} else {
		if (Array.isArray(customsInfo.prices[subKey])) {
			price = customsInfo.prices[subKey][index];
		} else if (typeof(customsInfo.prices[subKey]) === "object") {
			price = customsInfo.prices[subKey].base + (index * customsInfo.prices[subKey].add);
		}
	}

	return Math.round(price * vehiclePrice);
}

function getModSlotName(modType) {
	switch(modType) {
		case 0:
			return "Spoilers";
		case 1:
			return "Front bumpers";
		case 2:
			return "Rear bumpers";
		case 3:
			return "Rapids";
		case 4:
			return "Muffler";
		case 5:
			return "Safety cage";
		case 6:
			return "Grille";
		case 7:
			return "Hood";
		case 10:
			return "Roof";
		case 11:
			return "Engine";
		case 12:
			return "Brakes";
		case 13:
			return "Transmission";
		case 15:
			return "Suspension";
		case 16:
			return "Armor";
		default:
			return "UNKNOWN";
	}
}

function getModLabel(modType, modIndex) {
	switch(modType) {
		case 3:
			return `CMOD_SKI_${modIndex + 1}`;
		case 11:
			return modIndex === 0 ? "collision_55wey9g" : `CMOD_ENG_${modIndex + 2}`;
		case 12:
			return `CMOD_BRA_${modIndex + 1}`;
		case 13:
			return `CMOD_GBX_${modIndex + 1}`;
		case 15:
			return modIndex === 3 ? "collision_84hts2y" : `CMOD_SUS_${modIndex + 1}`;
		case 16:
			return `CMOD_ARM_${modIndex + 1}`;
	}
}

function getStockValue(modType) {
	switch (modType) {
		case 1:
			return "CMOD_BUM_0";
		case 2:
			return "CMOD_BUM_3";
		case 3:
			return "CMOD_SKI_0";
		case 4:
			return "CMOD_EXH_0";
		case 5:
			return "CMOD_DEF_RC";
		case 6:
			return "CMOD_GRL_0";
		case 7:
			return "CMOD_BON_0";
		case 10:
			return "CMOD_ROF_0";
		case 12:
			return "collision_9ld0k5x";
		case 13:
			return "collision_34vak0";
		case 15:
			return "CMOD_SUS_0";
		case 16: case 0:
			return "HO_NONE";
		default:
			return undefined;
	}
}

function showRepairMenu(price) {
	currentRepairPrice = price;

	const items = [
		{
			text: "Repair",
			values: [Math.round(price / 7 + vehiclePrice * 0.001)]
		},
		{ text: "Exit" }
	];

	mp.events.call("selectMenu.setSpecialItems", "ls_customs_repair", items);
	mp.events.call("selectMenu.show", "ls_customs_repair");
}

function setUiElementsState(state) {
	mp.events.call("chat.enable", state);
	mp.events.call("nametags::show", state);
	mp.events.call("vehicle::engineToggleEnable", state);
}

function endOfTuning(isOccupant, forceEnd = false) {
	mp.gui.cursor.visible = false;

	setUiElementsState(true);
	showSpecMenu(false);

	const vehicle = mp.players.local.vehicle;

	if (vehicle) {
		vehicle.setModKit(currentModKit);
	}

	if (camera !== undefined) {
		cameraRotator.stop();
		camera.destroy(true);
		camera = undefined;
	}

	mp.game.cam.renderScriptCams(false, false, 0, true, false);

	isControlsDisabled = false;

	if (lampObj !== undefined) {
		lampObj.destroy();
		lampObj = undefined;
	}

	if (!isOccupant) {
		mp.events.call("selectMenu.hide");

		if (!forceEnd) {
			mp.events.callRemote("ls_customs::end");
		}

		if (invisibleVehicle !== undefined) {
			invisibleVehicle.destroy();
			invisibleVehicle = undefined;
		}
	}

	doorControl(true, -822900180, new mp.Vector3(110.594, 6628.001, 32.26));
	doorControl(true, -822900180, new mp.Vector3(1174.656, 2644.159, 40.50673));
}

function isVehicleToggleModOn(vehicle, modType) {
	const result = vehicle.isToggleModOn(modType);

	return typeof (result) === "boolean" ? result : result === 1;
}

function isVehicleNeonLightEnabled(vehicle, index) {
	const result = vehicle.isNeonLightEnabled(index);

	return typeof (result) === "boolean" ? result : result === 1;
}

function getNeonValuesByIndex(index) {
	switch (index) {
		case 0: // None
			return [];
		case 1: // Front
			return [ 2 ];
		case 2: // Back
			return [ 3 ];
		case 3: // Sides
			return [ 0, 1 ];
		case 4: // Front + Back
			return [ 2, 3 ];
		case 5: // Front + Sides
			return [ 0, 1, 2 ];
		case 6: // Back + Sides
			return [ 0, 1, 3 ];
		case 7: // All
			return [ 0, 1, 2, 3 ];
		default:
			return [];
	}
}

function getIndexByNeonValues(values) {
	if(values.length === 0) {
		return 0;
	} else if (values.length === 1) {
		return values.indexOf(2) >= 0 ? 1 : 2;
	} else if (values.length === 2) {
		return values.indexOf(0) >= 0 ? 3 : 4;
	} else if (values.length === 3) {
		return values.indexOf(2) >= 0 ? 5 : 6;
	}

	return 7;
}

function setNeonLight(vehicle, enabledValues) {
	for (let i = 0; i < 4; i++) {
		vehicle.setNeonLightEnabled(i, enabledValues.indexOf(i) >= 0);
	}
}

function getNeonColorIndexByColor(r, g, b) {

	for (let i = 0; i < neonColors.length; i++) {
		const neonColor = neonColors[i];

		if (neonColor[0] === r && neonColor[1] === g && neonColor[2] === b) {
			return i;
		}
	}

	return 0;
}

function getNumberPlateIndexByValue(value) {
	switch (value) {
		case 3:
			return 0;
		case 0:
			return 1;
		case 4:
			return 2;
		case 2:
			return 3;
		case 1:
			return 4;
		default:
			return 0;
	}
}

function getNumberPlateValueByIndex(index) {
	switch (index) {
		case 0:
			return 3;
		case 1:
			return 0;
		case 2:
			return 4;
		case 3:
			return 2;
		case 4:
			return 1;
		default:
			return 3;
	}
}

function getWheelTypeIndexByValue(value) {
	switch (value)  {
		case 7:
			return 0;
		case 2:
			return 1;
		case 1:
			return 2;
		case 3:
			return 3;
		case 0:
			return 4;
		case 4:
			return 5;
		case 5:
			return 6;
		default:
			return 0;
	}
}

function getWheelTypeValueByIndex(index) {
	switch (index)  {
		case 0:
			return 7;
		case 1:
			return 2;
		case 2:
			return 1;
		case 3:
			return 3;
		case 4:
			return 0;
		case 5:
			return 4;
		case 6:
			return 5;
		default:
			return 7;
	}
}

function getWindowTintIndexByValue(value) {
	switch (value) {
		case 0:
			return 0;
		case 3:
			return 1;
		case 2:
			return 2;
		case 1:
			return 3;
		default:
			return 0;
	}
}

function getWindowTintValueByIndex(index) {
	switch (index) {
		case 0:
			return 0;
		case 1:
			return 3;
		case 2:
			return 2;
		case 3:
			return 1;
		default:
			return 0;
	}
}

function setVehicleWheel(vehicle, modType, modIndex, customTires = undefined) {
	if (typeof(customTires) !== "boolean") {
		customTires = vehicle.getModVariation(23);
	}

	setVehicleMod(vehicle, modType, modIndex, customTires);
}

function setVehicleWheelColor(vehicle, color) {
	const { pearlescentColor } = vehicle.getExtraColours(0, 0);

	vehicle.setExtraColours(pearlescentColor, color);
}

function setVehicleTiresDesign(vehicle, isCustom) {
	for (let modType = 23; modType < 25; modType++) {
		const modIndex = vehicle.getMod(modType);

		setVehicleMod(vehicle, modType, modIndex, isCustom);

		if (mp.game.vehicle.isThisModelACar(vehicle.model)) {
			break;
		}
	}
}

function setVehicleMod(vehicle, modType, modIndex, customTires = false) {
	mp.game.invoke("0x6AF0636DDEDCB6DD", vehicle.handle, modType, modIndex, customTires);
}

function isVehicleWheelsAreChrome(vehicle) {
	for (let modType = 23; modType < 25; modType++) {
		const modsCount = vehicle.getNumMods(modType);
		const modIndex = vehicle.getMod(modType);

		if (mp.game.vehicle.isThisModelACar(vehicle.model)) {
			if (modIndex >= modsCount / 2) {
				return true;
			}

			break;
		}

		if ((modIndex >= 13 && modIndex <= 25) || (modIndex >= 49 && modIndex <= 72)) {
			return true;
		}
	}

	return false;
}

function isVehicleWheelsAreDefault(vehicle) {
	for (let modType = 23; modType < 25; modType++) {
		const modsCount = vehicle.getNumMods(modType);
		const modIndex = vehicle.getMod(modType);

		if (modIndex < 0 || modIndex >= modsCount) {
			return true;
		}

		if (mp.game.vehicle.isThisModelACar(vehicle.model)) {
			break;
		}
	}

	return false;
}

Array.range = function(n) {
	return Array.apply(null, Array(n)).map((_x, i) => i);
}

Object.defineProperty(Array.prototype, "chunk", {
  value: function(n) {
    return Array.range(Math.ceil(this.length/n)).map((_x, i) => this.slice(i*n, i*n+n));
  }
});

function showSpecMenu(state) {
	if (state) {
		const characteristics = getVehicleCharacteristics(mp.players.local.vehicle);

		browserMenu.execute(`mp.events.call('carSystem', {specMenu: [${characteristics.join(',')}], event: 'specMenu' })`);
	}

	browserMenu.execute(`mp.events.call('carSystem', {enable: ${state}, event: 'enable' })`);
}

function showModificationSetMessage(itemName) {
	mp.game.ui.notifications.show(`Modification ~g~${itemName}~w~ successfully installed`, true);
	mp.game.invoke("0xE65F427EB70AB1ED", -1, "MOD_SHOPS_UPGRADE_BLIP", mp.players.local.vehicle.handle, 0, 0, 0);
	showSpecMenu(true);
}

let checkPriceResolver;
let checkPriceMenuItemIndex;

function checkPrice(keyItem, modType, itemIndex = 0, repairPrice = undefined, currentIndex = 0) {
	cameraRotator.pause(true);

	checkPriceMenuItemIndex = currentIndex;

	return new Promise((resolve, reject) => {
		if (checkPriceResolver) {
			return reject("CheckPrice is already requested");
		}

		mp.events.call("selectMenu.hide");
		loadingPrompt.show("HUD_TRANSP", 4);

		checkPriceResolver = {
			resolve: (result) => {
				clearPriceCheck(result);
				resolve(result);
			},
			reject: (message) => {
				clearPriceCheck(false);
				reject(message);
			}
		}

		checkPriceResolver.timeout = setTimeout(() => {
			if (checkPriceResolver) {
				checkPriceResolver.reject("CheckPrice timeout");
			}
		}, 10000);

		mp.events.callRemote("ls_customs::checkPrice", keyItem, modType, itemIndex, repairPrice);
	});
}

function clearPriceCheck(isSucces) {
	clearTimeout(checkPriceResolver.timeout);
	checkPriceResolver = undefined;
	loadingPrompt.hide();
	cameraRotator.pause(false);

	if (currentModType !== -1) {
		if (currentModType === 22) {
			showHeadlightsMenu();
		} else if (currentModType === 200) {
			showNeonPositionMenu();
		} else if (currentModType === 201) {
			showNeonColorMenu();
		} else if (currentModType === 202) {
			showNumberPlateMenu();
		} else if (currentModType === 203) {
			showConcreteColorMenu();
		} else if (currentModType === 204) {
			showWheelsConcreteMenu();
		} else if (currentModType === 205) {
			showWheelsColorMenu();
		} else if (currentModType === 206) {
			showTiresDesignMenu();
		} else if (currentModType === 207) {
			showTiresUpgradeMenu();
		} else if (currentModType === 208) {
			showTiresSmokeColorMenu();
		} else if (currentModType === 209) {
			showWindowTintMenu();
		} else if (currentModType === 14) {
			showHornsMenu();
		} else if (currentModType === 18) {
			showTurboMenu();
		} else {
			showConcreteMenu(currentModType);
		}
	} else {
		showMenu(mp.players.local.vehicle, false);
	}

	checkPriceMenuItemIndex = undefined;
}

mp.events.add("ls_customs::checkPriceResponse", (result) => {
	if(!checkPriceResolver || typeof(result) !== "boolean") {
		return;
	}

	if (isControlsDisabled) {
		checkPriceResolver.resolve(result);
	} else {
		checkPriceResolver.resolve(false);
	}
});

let browserMenu;

exports = (menu) => {
	browserMenu = menu;
};
