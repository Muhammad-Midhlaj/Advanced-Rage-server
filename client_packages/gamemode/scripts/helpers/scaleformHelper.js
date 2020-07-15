class Scaleform {
	constructor(movieName) {
		this.handle = Scaleform.requestMovie(movieName);
	}

	callFunction(name, ...args) {
		mp.game.graphics.pushScaleformMovieFunction(this.handle, name);

		for (const arg of args) {
			switch (typeof(arg)) {
				case "string":
					mp.game.graphics.pushScaleformMovieFunctionParameterString(arg);
					break;
				case "boolean":
					mp.game.graphics.pushScaleformMovieFunctionParameterBool(arg);
					break;
				case "number":
					if (Number.isInteger(arg)) {
						mp.game.graphics.pushScaleformMovieFunctionParameterInt(arg);
					} else {
						mp.game.graphics.pushScaleformMovieFunctionParameterFloat(arg);
					}

					break;
				default:
					continue;
			}
		}

		mp.game.graphics.popScaleformMovieFunctionVoid();
	}

	drawFullscreen(red = 255, green = 255, blue = 255, alpha = 255) {
		mp.game.graphics.drawScaleformMovieFullscreen(this.handle, red, green, blue, alpha, false);
	}

	dispose() {
		mp.game.graphics.setScaleformMovieAsNoLongerNeeded(this.handle);
	}

	static requestMovie(movieName) {
		const id = mp.game.graphics.requestScaleformMovie(movieName);

		while (!mp.game.graphics.hasScaleformMovieLoaded(id)) {
			mp.game.wait(0);
		}

		return id;
	}
}

exports = {
	Scaleform: Scaleform
};
