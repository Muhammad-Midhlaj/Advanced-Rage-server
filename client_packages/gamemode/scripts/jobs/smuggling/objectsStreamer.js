const objects = {
	entities: [],
	streamed: new Set()
}

mp.events.add("render", () => {
	if (objects.entities.length === 0) {
		return;
	}

	for (const obj of objects.entities) {
		const inStream = objects.streamed.has(obj);

		if (inStream && obj.handle === 0) {
			objects.streamed.delete(obj);

			mp.events.call("entityStreamOut", obj);
		} else if (!inStream && obj.handle !== 0) {
			objects.streamed.add(obj);

			mp.events.call("entityStreamIn", obj);
		}
	}
});

mp.events.add("smuggling:addObjectToStreamer", (obj) => {
	objects.entities.push(obj);
});
