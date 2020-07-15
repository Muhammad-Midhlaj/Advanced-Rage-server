mp.events.add("doorControl::setDefaultState", (rawInfo) => {
	const doorsInfo = JSON.parse(rawInfo);

	for (const doorInfo of doorsInfo) {
		if(doorInfo.toSystem) {
			mp.game.object.addDoorToSystem(mp.game.joaat("xuy"), doorInfo.model, position.x, position.y, position.z, false, true, false);
		}

		doorControl(doorInfo.locked, doorInfo.model, doorInfo.position);
	}
});

function doorControl(locked, model, position) {
	mp.game.object.doorControl(model, position.x, position.y, position.z, locked, 0, 0, 0);
}
