mp.events.add("entityStreamIn", (entity) => {
	if (entity.type !== "ped" || entity.createResolver === undefined) {
		return;
	}

	clearTimeout(entity.createResolver.timeout);
	entity.createResolver.resolve(entity);
	entity.createResolver = undefined;
});

exports = {
	createPed: (model, position, heading = 0, dimension = 0) => {
		return new Promise((resolve, reject) => {
			const ped = mp.peds.new(model, position, heading, dimension);

			if (ped.handle !== 0) {
				resolve(ped);
				return;
			}

			ped.createResolver = { 
				resolve,
				timeout: setTimeout(() => {
					ped.destroy();
					ped.createResolver = undefined;
					reject("Ped creation timeout");
				}, 15000)
			};
		});
	}
};
