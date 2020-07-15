const greenZones = new Set();

mp.events.add("playerBrowserReady", (player) => {
	player.call("green_zone::load", [JSON.stringify([...greenZones])]);
});

mp.events.add("green_zone::add", (player, interior) => {
	if (interior === 0) {
		terminal.error("Nelja add a green area on the street", player);
		return;
	}

	if (greenZones.has(interior)) {
		terminal.error("NeljaSuch a green zone already exists", player);
		return;
	}

	DB.Handle.query("INSERT INTO green_zones (interior_id) VALUES(?)", [interior], (e) => {
		if (e) {
			console.log(`Green zone add-on error. ${e}`);
			terminal.error("The green zone has not been added. Try it later", player);
			return;
		}

		terminal.info("Green zone successfully added", player);
		greenZones.add(interior);
		mp.players.call("green_zone::add", [interior]);
	});
});

mp.events.add("green_zone::remove", (player, interior) => {
	if (!greenZones.has(interior)) {
		terminal.error("This area is not a green zone", player);
		return;
	}

	DB.Handle.query("DELETE FROM green_zones WHERE interior_id = ? LIMIT 1", [interior], (e) => {
		if (e) {
			console.log(`Green zone removal error. ${e}`);
			terminal.error("The green zone has not been removed. Try it later", player);
			return;
		}

		terminal.info("Green zone successfully removed", player);
		greenZones.delete(interior);
		mp.players.call("green_zone::remove", [interior]);
	});
});

module.exports = {
	Init: () => {
		return new Promise((resolve, reject) => {
			DB.Handle.query("SELECT * FROM green_zones", (e, result) => {
				if (e) {
					console.log(`The green areas could not be downloaded. ${e}`);
					reject(e);
					return;
				}

				for (const greenZone of result) {				
					greenZones.add(greenZone.interior_id);
				}

				console.log(`Uploaded ${result.length} green zones`);
				resolve();
			});
		});
	}
};
