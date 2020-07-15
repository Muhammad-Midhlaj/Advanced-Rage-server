const barberInfo = require("./info");

barberInfo.interiors = barberInfo.places.map((place) => place.interior);

const rawBarberInfo = JSON.stringify(barberInfo);

mp.events.add("playerBrowserReady", (player) => {
	player.call("barbershop::load_info", [ rawBarberInfo ]);
});

const usedOverlays = [ 1, 2, 4, 5, 8, 10 ];

mp.events.add("barbershop::onStart", (player) => {
	player.dimension = player.id + 1;

	const playerOverlays = new Map();

	for (const overlay of usedOverlays) {
		const values = player.getHeadOverlay(overlay);

		if (player.overlayColors[overlay]) {
			values[2] = player.overlayColors[overlay][0];
			values[3] = player.overlayColors[overlay][1];
		}

		playerOverlays.set(overlay, values);
	}

	player.call("barbershop::startBarber", [ player.hairColor, player.hairHighlightColor, JSON.stringify([...playerOverlays]), player.eyeColor ]);
});

mp.events.add("barbershop::onStop", (player) => {
	player.dimension = 0;
});

mp.events.add("barbershop::setHair", (player, hair, color, highlightColor) => {
	player.setClothes(2, hair, 0, 0);
	player.setHairColor(color, highlightColor);

	DB.Handle.query("UPDATE characters SET hair=?, hairColor=?, hairHighlightColor=? WHERE id=?", [hair, color, highlightColor, player.sqlId]);
});

mp.events.add("barbershop::setEyeColor", (player, color) => {
	player.eyeColor = color;

	DB.Handle.query("UPDATE characters SET eyeColor=? WHERE id=?", [color, player.sqlId]);
});

mp.events.add("barbershop::setHeadOverlay", (player, overlayId, index, opacity, color, clearOverlayId) => {
	color = color === -1 ? 0 : color;
	opacity = opacity === -1 ? 1 : opacity;

	player.setHeadOverlay(overlayId, [ index, opacity, color, color ]);

	DB.Handle.query(`
		INSERT INTO 
			characters_headoverlays(character_id, overlay_id, overlay_index, opacity, first_color, second_color)
		VALUES 
			(?, ?, ?, ?, ?, ?)
		ON DUPLICATE KEY UPDATE
				overlay_index = ?,
				opacity = ?,
				first_color = ?,
				second_color = ?
		;
	`, [player.sqlId, overlayId, index, opacity, color, color, index, opacity, color, color]);

	if (typeof(clearOverlayId) === "number") {
		player.setHeadOverlay(clearOverlayId, [ 255, 1, 0, 0 ]);
		DB.Handle.query("DELETE FROM characters_headoverlays WHERE character_id = ? AND overlay_id = ?", [player.sqlId, clearOverlayId]);
	}
});

mp.events.add("barbershop::checkPrice", (player, menuIndex, itemIndex, isMale) => {
	const prices = barberInfo.prices[menuIndex];

	if (!Array.isArray(prices)) {
		player.call("barbershop::checkPriceResponse", [ false ]);
		return;
	}

	const price = Array.isArray(prices[0]) ? prices[(isMale ? 0 : 1)][itemIndex] : prices[itemIndex];

	if (typeof(price) !== "number") {
		player.call("barbershop::checkPriceResponse", [ false ]);
		return;
	}

	const newPlayerMoney = player.money - price;

	if (newPlayerMoney >= 0) {
		player.call("barbershop::checkPriceResponse", [ true ]);
		player.utils.setMoney(newPlayerMoney);
	} else {
		player.utils.warning("У вас недостаточно средств!");
		player.call("barbershop::checkPriceResponse", [ false ]);
	}
});
