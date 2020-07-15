const vehiclesData = [
	{ position: new mp.Vector3(1465.8673, -1936.9855, 71.0025), heading: 58.727 },
	{ position: new mp.Vector3(880.0251, -2193.5657, 30.3346), heading: 246.5185 },
	{ position: new mp.Vector3(-88.2306, -2220.7869, 7.6273), heading: 76.1280 },
	// { position: new mp.Vector3(-196.9854, -1818.5649, 1.3514), heading: 35.5612 },
	{ position: new mp.Vector3(-346.7971, -1543.4633, 27.5384), heading: 179.2595 },
	{ position: new mp.Vector3(184.1437, -1270.4662, 29.0136), heading: 163.3553 },
	{ position: new mp.Vector3(-230.5522, -1692.0482, 33.6116), heading: 76.2052 },
	{ position: new mp.Vector3(298.0902, -1720.8209, 29.0760), heading: 303.8684 },
	{ position: new mp.Vector3(824.0117, -785.4179, 25.9988), heading: 25.2672 }
];

for (let i = 0; i < vehiclesData.length; i++) {
	mp.blips.new(84, vehiclesData[i].position, {
	    name: 'Dealer',
	    color: 1,
			scale: 0.7,
	    shortRange: true
	});
}

let vehicleIds = [];

for (const vehData of vehiclesData) {
	const veh = mp.vehicles.new("gburrito", vehData.position, {
		heading: vehData.heading,
		locked: true,
		engine: false
	});
	veh.spawnPos = vehData.position;
	veh.isSmuggling = true;

	vehicleIds.push({ id: veh.id, position: vehData.position, heading: vehData.heading});
}

mp.events.add("playerBrowserReady", (player) => {
	player.call("smuggling::createPeds", [ JSON.stringify(vehicleIds) ]);
});
