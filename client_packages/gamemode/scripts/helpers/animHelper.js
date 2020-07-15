exports = {
	requestAnimDict: (dictName) => {
		if (mp.game.streaming.hasAnimDictLoaded(dictName)) {
			return Promise.resolve();
		}

		mp.game.streaming.requestAnimDict(dictName);

		return new Promise((resolve, reject) => {
			let counter = 0;
			const interval = setInterval(() => {
				if (mp.game.streaming.hasAnimDictLoaded(dictName)) {
					clearInterval(interval);
					resolve();
				}

				if (++counter > 100) {
					clearInterval(interval);
					reject(`Reuest anim dictionary timeout. Dict: ${dictName}`);
				}
			}, 10);
		});
	}
}
