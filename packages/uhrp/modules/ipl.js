module.exports = {
	Init: () => {
		DB.Handle.query("SELECT * FROM ipls", (e, result) => {
			if (e) {
				console.log(`Ipl loading ${e}`);
				return;
			}

			for (const ipl of result) {				
				if (ipl.request === 1) {
					mp.world.requestIpl(ipl.name);
				} else {
					mp.world.removeIpl(ipl.name);
				}
			}
		});
	}
};
