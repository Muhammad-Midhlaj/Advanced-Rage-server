const customsInfo = require("./customs_info");

const rawCustomsInfo = JSON.stringify(customsInfo);
const interactionInfo = new Map();
const vehiclesSyncData = new Map();

mp.events.add("playerQuit", (player) => { playerDeathOrQuit(player, false); });
mp.events.add("playerDeath",(player) => { playerDeathOrQuit(player, true); });

mp.events.add("playerBrowserReady", (player) => {
	player.call("ls_customs::sync_all", [ rawCustomsInfo, JSON.stringify([...vehiclesSyncData]) ]);
});

mp.events.add("entityDestroyed", (entity) => {
  if (entity.type !== "vehicle") {
		return;
	}

	deleteVehicleFromSync(entity);
});

mp.events.add("ls_customs::init", (player, placeId) => {
	const safePosition = customsInfo.places[placeId].exitVehInfo[0].position;
	const vehicle = player.vehicle;
	const occupants = vehicle.getOccupants();
	const dimension = player.id + 1;

	mp.players.call(occupants, "ls_customs::occupant_init");

	let vehiclePrice = 1;

	if (Array.isArray(mp.autosaloons.vehicles)) {
		const vehicleModel = vehicle.model;

		vehiclePrice = mp.autosaloons.vehicles.filter((v) => v.model === vehicleModel).map((v) => v.price)[0] || 10000;
	}
	
	interactionInfo.set(player.id, {
		dimension,
		vehicle,
		placeId,
		vehiclePrice
	});

	const seats = [];

	for (const occupant of occupants) {
		seats.push(occupant.seat)
		occupant.dimension = dimension;
		occupant.utils.setSafeQuitPosition(safePosition);
	}

	vehicle.dimension = dimension;

	occupants.forEach((occupant, index) => {
		occupant.putIntoVehicle(vehicle, seats[index]);
	});

	mp.players.call(occupants, "ls_customs::start", [player.id, vehicle.id, placeId, vehiclePrice]);
});

mp.events.add("ls_customs::end", (player) => {
	endOfTuning(player);
});

mp.events.add("ls_customs::vehicle_reach_point", (player, rawPosition, heading) => {
	const occupants = player.vehicle.getOccupants();

	if (occupants.length === 1) {
		return;
	}

	mp.players.call(occupants.filter(p => p.id !== player.id), "ls_customs::show_vehicle", [rawPosition, heading]);
});

mp.events.add("ls_customs::repair", (player) => {
	const vehicle = player.vehicle;

	vehicle.repair();

	if (isVehicleTuningSave(vehicle)) {
		DB.Handle.query("UPDATE vehicles SET health=1000, engineBroken=0, oilBroken=0, accumulatorBroken=0 WHERE id = ?", [vehicle.sqlId]);
	}
});

mp.events.add("ls_customs::setMod", (player, modType, modIndex) => {
	const vehicle = player.vehicle;
	const data = getOrCreateSyncData(vehicle);

	// vehicle.setMod(modType, modIndex);
	data.mods.push([modType, modIndex]);

	mp.players.callInDimension(player.dimension, "ls_customs::sync", [ vehicle.id, JSON.stringify(data) ]);

	if (isVehicleTuningSave(vehicle)) {
		DB.Handle.query(
			"INSERT INTO vehicles_mods (vehicle_id, `type`, `index`) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE `type`=?, `index`=?;",
			[vehicle.sqlId, modType, modIndex, modType, modIndex]);
	}
});

mp.events.add("ls_customs::toggleMod", (player, modType, state) => {
	const vehicle = player.vehicle;
	const data = getOrCreateSyncData(vehicle);

	if (modType === 22) { // Xenon
		data.isXenon = state;

		if (isVehicleTuningSave(vehicle)) {
			DB.Handle.query("UPDATE vehicles SET hasXenon=? WHERE id = ?", [Number(state), vehicle.sqlId]);
		}
	} else if (modType === 18) { // Turbo
		data.turbo = state;

		if (isVehicleTuningSave(vehicle)) {
			DB.Handle.query("UPDATE vehicles SET turbo=? WHERE id = ?", [Number(state), vehicle.sqlId]);
		}
	} else {
		return;
	}

	mp.players.callInDimension(player.dimension, "ls_customs::sync", [ vehicle.id, JSON.stringify(data) ]);
});

mp.events.add("ls_customs::enableNeon", (player, rawValues) => {
	const vehicle = player.vehicle;
	const values = JSON.parse(rawValues);
	const data = getOrCreateSyncData(vehicle);

	data.enabledNeons = values;

	mp.players.callInDimension(player.dimension, "ls_customs::sync", [ vehicle.id, JSON.stringify(data) ]);

	if (isVehicleTuningSave(vehicle)) {
		DB.Handle.query("UPDATE vehicles SET enabledNeons=? WHERE id = ?", [JSON.stringify(values), vehicle.sqlId]);
	}
});

mp.events.add("ls_customs::neonColor", (player, r, g, b) => {
	const vehicle = player.vehicle;
	const data = getOrCreateSyncData(vehicle);

	data.neonColor = [ r, g, b ];

	mp.players.callInDimension(player.dimension, "ls_customs::sync", [ vehicle.id, JSON.stringify(data) ]);

	if (isVehicleTuningSave(vehicle)) {
		DB.Handle.query("UPDATE vehicles SET neonColor=? WHERE id = ?", [JSON.stringify(data.neonColor), vehicle.sqlId]);
	}
});

mp.events.add("ls_customs::numberPlateType", (player, type) => {
	const vehicle = player.vehicle;
	const data = getOrCreateSyncData(vehicle);

	// vehicle.numberPlateType = type;
	data.numberPlateType = type;

	mp.players.callInDimension(player.dimension, "ls_customs::sync", [ vehicle.id, JSON.stringify(data) ]);

	if (isVehicleTuningSave(vehicle)) {
		DB.Handle.query("UPDATE vehicles SET numberPlateType=? WHERE id = ?", [type, vehicle.sqlId]);
	}
});

mp.events.add("ls_customs::setColor", (player, primaryColor, secondaryColor) => {
	const vehicle = player.vehicle;
	
	vehicle.setColor(primaryColor, secondaryColor);

	if (isVehicleTuningSave(vehicle)) {
		DB.Handle.query("UPDATE vehicles SET color1=?, color2=? WHERE id = ?", [primaryColor, secondaryColor, vehicle.sqlId]);
	}
});

mp.events.add("ls_customs::setWheel", (player, wheelType, wheelIndex, isBackWheel = false) => {
	const vehicle = player.vehicle;
	const data = getOrCreateSyncData(vehicle);

	if (wheelType !== -1) {
		vehicle.wheelType = wheelType;
		data.wheelType = wheelType;
	}

	if (isBackWheel) {
		data.backWheel = wheelIndex;
	} else {
		data.wheel = wheelIndex;
	}

	mp.players.callInDimension(player.dimension, "ls_customs::sync", [ vehicle.id, JSON.stringify(data) ]);

	if (isVehicleTuningSave(vehicle)) {
		DB.Handle.query(`UPDATE vehicles SET wheelType=?, ${isBackWheel ? "backWheel" : "wheel"}=? WHERE id = ?`, [vehicle.wheelType, wheelIndex, vehicle.sqlId]);
	}
});

mp.events.add("ls_customs::setWheelColor", (player, color) => {
	const vehicle = player.vehicle;
	const data = getOrCreateSyncData(vehicle);

	// vehicle.wheelColor = color;
	data.wheelColor = color;

	mp.players.callInDimension(player.dimension, "ls_customs::sync", [ vehicle.id, JSON.stringify(data) ]);

	if (isVehicleTuningSave(vehicle)) {
		DB.Handle.query("UPDATE vehicles SET wheelColor=? WHERE id = ?", [color, vehicle.sqlId]);
	}
});

mp.events.add("ls_customs::setCustomTires", (player, value) => {
	const vehicle = player.vehicle;
	const data = getOrCreateSyncData(vehicle);

	data.tiresCustomDesign = value;

	mp.players.callInDimension(player.dimension, "ls_customs::sync", [ vehicle.id, JSON.stringify(data) ]);

	if (isVehicleTuningSave(vehicle)) {
		DB.Handle.query("UPDATE vehicles SET tiresCustomDesign=? WHERE id = ?", [Number(value), vehicle.sqlId]);
	}
});

mp.events.add("ls_customs::setTiresBurst", (player, value) => {
	const vehicle = player.vehicle;
	const data = getOrCreateSyncData(vehicle);

	data.tiresCanBurst = value;

	mp.players.callInDimension(player.dimension, "ls_customs::sync", [ vehicle.id, JSON.stringify(data) ]);

	if (isVehicleTuningSave(vehicle)) {
		DB.Handle.query("UPDATE vehicles SET tiresCanBurst=? WHERE id = ?", [Number(value), vehicle.sqlId]);
	}
});

mp.events.add("ls_customs::setTiresSmokeColor", (player, r, g, b) => {
	const vehicle = player.vehicle;
	const data = getOrCreateSyncData(vehicle);

	data.tiresSmokeColor = [ r, g, b ];

	mp.players.callInDimension(player.dimension, "ls_customs::sync", [ vehicle.id, JSON.stringify(data) ]);

	if (isVehicleTuningSave(vehicle)) {
		DB.Handle.query("UPDATE vehicles SET tiresSmokeColor=? WHERE id = ?", [JSON.stringify(data.tiresSmokeColor), vehicle.sqlId]);
	}
});

mp.events.add("ls_customs::setWindowTint", (player, value) => {
	const vehicle = player.vehicle;
	const data = getOrCreateSyncData(vehicle);

	// vehicle.windowTint = value;
	data.windowTint = value;

	mp.players.callInDimension(player.dimension, "ls_customs::sync", [ vehicle.id, JSON.stringify(data) ]);

	if (isVehicleTuningSave(vehicle)) {
		DB.Handle.query("UPDATE vehicles SET windowTint=? WHERE id = ?", [value, vehicle.sqlId]);
	}
});

function playerDeathOrQuit(player, isDeath) {
	if (!interactionInfo.has(player.id)) {
		return;
	}

	if (isDeath) {
		player.call("ls_customs::end_driver")
	}

	endOfTuning(player, !isDeath);
}

function endOfTuning(player, isQuit = false) {
	const playerId = player.id;
	const info = interactionInfo.get(playerId);

	if (!interactionInfo) {
		return;
	}

	const vehicle = info.vehicle;
	const occupants = vehicle.getOccupants();
	const exitVehInfo = customsInfo.places[info.placeId].exitVehInfo;
	const exitInfo = exitVehInfo[Math.floor(Math.random()*exitVehInfo.length)];

	mp.players.call(occupants, "ls_customs::end_occupant");

	for (const occupant of occupants) {
		occupant.dimension = 0;

		if (occupant.id !== playerId) {
			occupant.utils.setSafeQuitPosition(undefined);
		} else if (!isQuit) {
			occupant.utils.setSafeQuitPosition(undefined);
		}
	}

	vehicle.dimension = 0;

	vehicle.position = exitInfo.position;
	vehicle.heading = new mp.Vector3(0, 0, exitInfo.heading);

	mp.players.call("ls_customs::sync", [ vehicle.id, JSON.stringify(getOrCreateSyncData(vehicle)) ]);

	interactionInfo.delete(playerId);
}

function getOrCreateSyncData(vehicle) {
	if (!vehiclesSyncData.has(vehicle.id)) {
		vehiclesSyncData.set(vehicle.id, {
			enabledNeons: [],
			neonColor: [222, 222, 255],
			isXenon: false,
			wheel: undefined,
			backWheel: undefined,
			tiresCustomDesign: false,
			tiresCanBurst: true,
			tiresSmokeColor: false,
			turbo: false,
			mods: [],
			wheelType: undefined,
			numberPlateType: undefined,
			wheelColor: undefined,
			windowTint: undefined
		});
	}

	return vehiclesSyncData.get(vehicle.id);
}

function isVehicleTuningSave(vehicle) {
	return vehicle.sqlId && vehicle.owner >= 2000;
}

mp.events.add("ls_customs::checkPrice", (player, keyItem, modType = 0, index = 0, repairPrice = undefined) => {
	if (!interactionInfo.has(player.id)) {
		player.call("ls_customs::checkPriceResponse", [ false ]);
		return;
	}

	const vehiclePrice = interactionInfo.get(player.id).vehiclePrice;
	const prices = customsInfo.prices[keyItem];

	let price;

	if (keyItem === "mods") {
		if (Array.isArray(prices[modType])) {
			price = prices[modType][index];
		} else if (typeof(prices[modType]) === "object") {
			price = prices[modType].base + (index * prices[modType].add);
		}
	} else if (keyItem === "repair") {
		price = 0;
	} else {
		if (Array.isArray(prices)) {
			price = prices[index];
		} else if (typeof(prices) === "object") {
			price = prices.base + (index * prices.add);
		}
	}

	if (typeof(price) !== "number") {
		player.call("ls_customs::checkPriceResponse", [ false ]);
		return;
	}

	if (Number.isInteger(repairPrice)) {
		price = repairPrice / 7 + vehiclePrice * 0.001;
	} else {
		price *= vehiclePrice;
	}

	price = Math.round(price);

	const newPlayerMoney = player.money - price;

	if (newPlayerMoney >= 0) {
		player.call("ls_customs::checkPriceResponse", [ true ]);
		player.utils.setMoney(newPlayerMoney);
	} else {
		player.utils.warning("У вас недостаточно средств!");
		player.call("ls_customs::checkPriceResponse", [ false ]);
	}
});

function deleteVehicleFromSync(vehicle) {
	if (!vehiclesSyncData.has(vehicle.id)) {
		return;
	}

	vehiclesSyncData.delete(vehicle.id);
	mp.players.call("ls_customs::remove_sync_vehicle", [ vehicle.id ]);
}

module.exports = { 
	tuningVehicle: (vehicle, dbData) => {
		return new Promise((resolve, reject) => {
			const data = getOrCreateSyncData(vehicle);

			if (typeof(dbData.enabledNeons) === "string") {
				data.enabledNeons = JSON.parse(dbData.enabledNeons);
			}
			if (typeof(dbData.neonColor) === "string") {
				data.neonColor = JSON.parse(dbData.neonColor);
			}
			if (typeof(dbData.hasXenon) === "number") {
				data.isXenon = dbData.hasXenon === 1;
			}
			if (typeof(dbData.wheelType) === "number") {
				// vehicle.wheelType = dbData.wheelType;
				data.wheelType = dbData.wheelType;
			}
			if (typeof(dbData.wheel) === "number") {
				data.wheel = dbData.wheel;
			}
			if (typeof(dbData.backWheel) === "number") {
				data.backWheel = dbData.backWheel;
			}
			if (typeof(dbData.tiresCustomDesign) === "number") {
				data.tiresCustomDesign = dbData.tiresCustomDesign === 1;
			}
			if (typeof(dbData.tiresCanBurst) === "number") {
				data.tiresCanBurst = dbData.tiresCanBurst === 1;
			}
			if (typeof(dbData.tiresSmokeColor) === "string") {
				data.tiresSmokeColor = JSON.parse(dbData.tiresSmokeColor);
			}
			if (typeof(dbData.turbo) === "number") {
				data.turbo = dbData.turbo === 1;
			}
			if (typeof(dbData.numberPlateType) === "number") {
				// vehicle.numberPlateType = dbData.numberPlateType;
				data.numberPlateType = dbData.numberPlateType;
			}
			if (typeof(dbData.wheelColor) === "number") {
				// vehicle.wheelColor = dbData.wheelColor;
				data.wheelColor = dbData.wheelColor;
			}
			if (typeof(dbData.windowTint) === "number") {
				// vehicle.windowTint = dbData.windowTint;
				data.windowTint = dbData.windowTint;
			}

			DB.Handle.query("SELECT * FROM vehicles_mods WHERE vehicle_id = ?", [dbData.id], (e, result) => {
				if (e) {
					console.log(e);
					reject(e);
					return;
				}

				if (result.length === 0) {
					resolve();
					return;
				}

				for (const mod of result) {
					// vehicle.setMod(mod.type, mod.index);
					data.mods.push([mod.type, mod.index]);
				}

				mp.players.call("ls_customs::sync", [ vehicle.id, JSON.stringify(data) ]);

				resolve();
			});
		});
	},
	deleteVehicle: (vehicle) => {
		deleteVehicleFromSync(vehicle);
	}
};
