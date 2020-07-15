const specialBikeArray = [mp.game.joaat("bmx"), mp.game.joaat("cruiser"), mp.game.joaat("scorcher"), mp.game.joaat("tribike"), mp.game.joaat("tribike2"), mp.game.joaat("tribike3"), mp.game.joaat("fixter")];

function isSpecialBike(vehicleModel) {
	return specialBikeArray.indexOf(vehicleModel) >= 0;
}

// TODO: Change to 0x53AF99BAA671CA47 native (0.4)
function getVehicleMaxSpeed(vehicleModel) {
	return mp.game.vehicle.getVehicleModelMaxSpeed(vehicleModel);
}

const maxSpeeds = [
	[0, 0, 0, 0],
	[0, 0, 0, 0],
	[0, 0, 0, 0],
	[0, 0, 0, 0]
];

function initMaxSpeeds() {
	// Classes
	for (let vehicleClass = 0; vehicleClass < 21; vehicleClass++) {
		const speedIndex = vehicleClassToSpeedIndex(vehicleClass);
		let val = getVehicleClassMaxSpeed(vehicleClass);

		maxSpeeds[speedIndex][0] = maxSpeeds[speedIndex][0] < val ? val : maxSpeeds[speedIndex][0];
		val = mp.game.vehicle.getVehicleClassMaxAcceleration(vehicleClass);
		maxSpeeds[speedIndex][1] = maxSpeeds[speedIndex][1] < val ? val : maxSpeeds[speedIndex][1];
		val = mp.game.vehicle.getVehicleClassMaxBraking(vehicleClass);
		maxSpeeds[speedIndex][2] = maxSpeeds[speedIndex][2] < val ? val : maxSpeeds[speedIndex][2];

		if (vehicleClass === 14 || vehicleClass === 15 || vehicleClass === 16) {
			val = mp.game.vehicle.getVehicleClassMaxAgility(vehicleClass);
		} else {
			val = mp.game.vehicle.getVehicleClassMaxTraction(vehicleClass);
		}

		maxSpeeds[speedIndex][3] = maxSpeeds[speedIndex][3] < val ? val : maxSpeeds[speedIndex][3];
	}
}

function vehicleClassToSpeedIndex(vehicleClass) {
	switch (vehicleClass) {
		case 14:
			return 3;
		case 15:
			return 1;
		case 16:
			return 2;
		default:
			return 0;
	}
}

const classMaxSpeedArray = [41.91737, 45.19532, 45, 48.13213, 48.33334, 51.33334, 50.45626, 51.77096, 49.29604, 40.77992, 33.33334, 37.55594, 39.9117, 21, 45, 57.90723, 91.28709, 42.72843, 48.11407, 35.96391, 36.94718];

// TODO: Change to 0x00C09F246ABEDD82 native (0.4)
function getVehicleClassMaxSpeed(vehicleClass) {
	return classMaxSpeedArray[vehicleClass];
}

function normalizeValue(value) {
	value = Math.round(value * 100);

	return value > 100 ? 100 : value;
}

initMaxSpeeds();

exports = {
	getVehicleCharacteristics: (vehicle) => {
		const vehicleModel = vehicle.getModel();
		const factor = isSpecialBike(vehicleModel) ? 0.5 : 1;
		// [ Speed, Acceleration, Braking, Coupling ]
		const result = [ 0, 0, vehicle.getMaxBraking() * factor, 0 ];

		if (vehicleModel === 0x9F4B77BE) { // Voltic
			result[1] = vehicle.getAcceleration() * 2;
		} else if (vehicleModel === 0x3D7C6410) { // Tezeract
			result[1] = vehicle.getAcceleration() * 2.6753;
		} else {
			result[1] = vehicle.getAcceleration() * factor;
		}

		if (vehicleModel === 0xF330CB6A) { // Jester3
			result[0] = getVehicleMaxSpeed(vehicleModel) * 0.9890084;
		} else if (vehicleModel === 0xFCC2F483) { // Freecrawler
			result[0] = getVehicleMaxSpeed(vehicleModel) * 0.9788762;
		} else if (vehicleModel === 0x1DD4C0FF) { // Swinger
			result[0] = getVehicleMaxSpeed(vehicleModel) * 0.9650553;
		} else if (vehicleModel === 0x79DD18AE) { // Menacer
			result[0] = getVehicleMaxSpeed(vehicleModel) * 0.9730466;
		} else if (vehicleModel === 0xD17099D) { // Speedo4
			result[0] = getVehicleMaxSpeed(vehicleModel) * 0.9426523;
		} else {
			result[0] = getVehicleMaxSpeed(vehicleModel);
		}

		if (mp.game.vehicle.isThisModelAHeli(vehicleModel) || mp.game.vehicle.isThisModelAPlane(vehicleModel)) {
			result[3] = mp.game.invoke("0xC6AD107DDC9054CC", vehicleModel) * factor; // TODO: Mb return pointer
		} else if (mp.game.vehicle.isThisModelABoat(vehicleModel)) {
			result[3] = mp.game.invoke("0x5AA3F878A178C4FC", vehicleModel) * factor; // TODO: Mb return pointer
		} else {
			result[3] = vehicle.getMaxTraction() * factor;
		}

		if (vehicleModel === 0x6322B39A) { // t20
			result[1] -= 0.05;
		} else if (vehicleModel === 0xAF599F01) { // vindicator
			result[1] -= 0.02;
		}

		const speedIndex = vehicleClassToSpeedIndex(vehicle.getClass());

		for (let i = 0; i < 4; i++) {
			result[i] = normalizeValue(result[i] / maxSpeeds[speedIndex][i]);
		}

		return result;
	}
}
