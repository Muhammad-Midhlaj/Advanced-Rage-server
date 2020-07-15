require("gamemode/scripts/jobs/smuggling/objectsStreamer");

const dealerInfo = {
	colshapeOffset: new mp.Vector3(1.9, -4, -1),
	pedOffset: new mp.Vector3(1.9, -3, 0.15),
	pedModel: 0xF0EC56E2,
	objectsData: [
		{ model: mp.game.joaat("prop_box_ammo03a"), offset: new mp.Vector3(0, -1.3, -0.3), rotation: new mp.Vector3(0, 0, 0) },
		{ model: mp.game.joaat("prop_box_ammo03a"), offset: new mp.Vector3(0, -1.25, 0.15), rotation: new mp.Vector3(0, 0, 0) },
		{ model: mp.game.joaat("ex_office_swag_guns02"), offset: new mp.Vector3(-0.2, -2, -0.3), rotation: new mp.Vector3(0, 0, 45) }
	],
	vehicles: new Map(), // Key: vehicle remoteId
	pedIds: [],
	colshapes: new Map() // Key: colshape id
}
const blackMarketInfo = {
	places: [
		{ position: new mp.Vector3(1193.7048, -3250.6465, 7.0952), heading: 90, model: 0xA2E86156, scenario: "WORLD_HUMAN_GUARD_STAND_CLUBHOUSE" },
		{ position: new mp.Vector3(1196.6531, -3249.2712, 7.0952), heading: 136.5924, model: 0x681BD012, scenario: "WORLD_HUMAN_STAND_MOBILE" },
		{ position: new mp.Vector3(1197.1665, -3250.9695, 7.0952), heading: 66.4661, model: 0xEF785A6A, scenario: "WORLD_HUMAN_AA_SMOKE" }
	],
	peds: [],
	colshape: undefined
};

mp.events.add("smuggling::createPeds", (rawVehiclesData) => {
	const vehiclesData = JSON.parse(rawVehiclesData);

	for (const vehicleData of vehiclesData) {
		const vehicle = mp.vehicles.atRemoteId(vehicleData.id);

		dealerInfo.vehicles.set(vehicleData.id, {
			position: vehicleData.position,
			heading: vehicleData.heading,
			ped: undefined
		});

		if (vehicle && vehicle.handle === 0) {
			continue;
		}

		createEntitiesByVehicle(vehicle);
	}
});

mp.events.add("entityStreamIn", (entity) => {
	if (entity.type === "vehicle" && dealerInfo.vehicles.has(entity.remoteId)) {
		vehicleStreamIn(entity);
	} else if (entity.type === "ped") {
		if (dealerInfo.pedIds.indexOf(entity.id) >= 0) {
			dealerPedStreamIn(entity);
		} else if (blackMarketInfo.peds.indexOf(entity) >= 0) {
			blackMarketPedStreamIn(entity);
		}
	} else if (entity.type === "object") { // Doesnt work without 'objectsStreamer.js'
		entity.setCanBeDamaged(false);
	}
});

mp.events.add("playerEnterColshape", (colshape) => {
	if (mp.players.local.isInAnyVehicle()) {
		return;
	}

	if (dealerInfo.colshapes.has(colshape.id)) {
		playerEnterInDealerColshape(colshape);
	} else if (blackMarketInfo.colshape.id === colshape.id) {
		playerEnterInBlackMarketColshape(colshape);
	}
});

mp.events.add("playerExitColshape", (colshape) => {
	if (mp.players.local.isInAnyVehicle()) {
		return;
	}

	if (dealerInfo.colshapes.has(colshape.id)) {
		playerExitFromDealerColshape(colshape);
	} else if (blackMarketInfo.colshape.id === colshape.id) {
		playerExitFromBlackMarketColshape(colshape);
	}
});

function vehicleStreamIn(vehicle) {
	vehicle.freezePosition(true);

	const vehicleData = dealerInfo.vehicles.get(vehicle.remoteId);

	vehicle.position = vehicleData.position;
	vehicle.heading = vehicleData.heading;
	vehicle.setDoorOpen(2, false, true);
	vehicle.setDoorOpen(3, false, true);
	vehicle.setDoorBreakable(2, false);
	vehicle.setDoorBreakable(3, false);

	if (vehicleData.ped !== undefined) {
		return;
	}

	createEntitiesByVehicle(vehicle);
}

function dealerPedStreamIn(ped) {
	ped.freezePosition(false);

	// Wait until ped stands to feet
	const interval = setInterval(() => {
		if (ped.handle === 0) {
			clearInterval(interval);
			return;
		}

		if (!ped.isOnFoot()) {
			return;
		}

		clearInterval(interval);

		ped.freezePosition(true);
		ped.taskStartScenarioInPlace("WORLD_HUMAN_SMOKING", 0, false);
	}, 50);
}

function blackMarketPedStreamIn(ped) {
	const place = blackMarketInfo.places[blackMarketInfo.peds.indexOf(ped)];

	ped.taskStartScenarioInPlace(place.scenario, 0, false);
}

function createEntitiesByVehicle(vehicle) {
	if (!vehicle) return;
	const vehicleData = dealerInfo.vehicles.get(vehicle.remoteId);
	const position = vehicle.position;
	const heading = vehicle.getHeading();
	const ped = createPed(position, heading);

	vehicleData.ped = ped;
	createObjects(position, heading);

	const colshape = createColshape(position, heading);

	dealerInfo.colshapes.set(colshape.id, { ped });
}

function createPed(vehiclePosition, heading) {
	const pedPosition = getObjectOffsetFromCoords(vehiclePosition, heading, dealerInfo.pedOffset);
	const ped = mp.peds.new(dealerInfo.pedModel, pedPosition, heading + 180);

	if (ped.handle !== 0) {
		dealerPedStreamIn(ped);
	}

	dealerInfo.pedIds.push(ped.id);

	return ped;
}

function createObjects(vehiclePosition, heading) {
	for (const objectData of dealerInfo.objectsData) {
		const position = getObjectOffsetFromCoords(vehiclePosition, heading, objectData.offset);
		const obj = mp.objects.new(objectData.model, position, {
			rotation: new mp.Vector3(0, 0, heading).add(objectData.rotation)
		});

		mp.events.call("smuggling:addObjectToStreamer", obj);
	}
}

function createColshape(vehiclePosition, heading) {
	const position = getObjectOffsetFromCoords(vehiclePosition, heading, dealerInfo.colshapeOffset);
	const colshape = mp.colshapes.newSphere(position.x, position.y, position.z, 2);

	return colshape;
}

createBlackMarket();

function createBlackMarket() {
	for (const place of blackMarketInfo.places) {
		const ped = mp.peds.new(place.model, place.position, place.heading);

		blackMarketInfo.peds.push(ped);

		if (ped.handle !== 0) {
			blackMarketPedStreamIn(ped);
		}
	}

	blackMarketInfo.colshape = mp.colshapes.newSphere(1195.6638, -3250.7002, 7.0952, 2);
}

let factions = [9, 10, 11, 12, 13];
function playerEnterInDealerColshape(colshape) {
	if (!factions.includes(mp.clientStorage["faction"])) return mp.events.call("nWarning", "Possibilities of the dealer are inaccessible to you!");
	mp.events.call("selectMenu.show", "band_dealer_menu");

	const colshapeData = dealerInfo.colshapes.get(colshape.id);

	if (colshapeData.ped === undefined || colshapeData.ped.handle === 0) {
		return;
	}

	mp.game.audio.playAmbientSpeechWithVoice(colshapeData.ped.handle, "BLOCKED_GENERIC", "A_M_M_MALIBU_01_LATINO_FULL_01",
		"SPEECH_PARAMS_FORCE", false);
	colshapeData.ped.taskLookAt(mp.players.local.handle, -1, 2048, 3);
}

function playerExitFromDealerColshape(colshape) {
	mp.events.call("selectMenu.hide");
}

function playerEnterInBlackMarketColshape() {
	mp.events.call("selectMenu.show", "band_black_market");
}

function playerExitFromBlackMarketColshape(colshape) {
	// TODO: Васин код.
	mp.events.call("selectMenu.hide");
}

function getObjectOffsetFromCoords(position, heading, offset) {
	return mp.game.object.getObjectOffsetFromCoords(position.x, position.y, position.z, heading, offset.x, offset.y, offset.z);
}
