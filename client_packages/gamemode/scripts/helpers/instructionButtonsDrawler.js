const { Scaleform } = require("gamemode/scripts/helpers/scaleformHelper.js");

class InstructionButtonsDrawler {
	constructor() {
		this.isActive = false;
		this.scaleform = undefined;

		mp.events.add("render", () => {
			if (!this.isActive || !this.scaleform) {
				return;
			}
		
			this.draw();
		});
	}

	init() {
		this.scaleform = new Scaleform("instructional_buttons");
	}

	setActive(state) {
		this.isActive = state;
	}

	setButtons(...buttons) {
		this.scaleform.callFunction("SET_DATA_SLOT_EMPTY");

		if (Array.isArray(buttons)) {
			for (let i = 0; i < buttons.length; i++) {
				const button = buttons[i].altControl
					? buttons[i].altControl
					: mp.game.controls.getControlActionName(2, buttons[i].control, true);

					this.scaleform.callFunction("SET_DATA_SLOT", i, button, mp.game.ui.getLabelText(buttons[i].label));
			}
		}
		
		this.scaleform.callFunction("DRAW_INSTRUCTIONAL_BUTTONS", -1);
	}

	draw() {
		this.scaleform.drawFullscreen();
	}

	dispose() {
		this.isActive = false;
		this.scaleform.dispose();
		this.scaleform = undefined;
	}
}

const drawler = new InstructionButtonsDrawler();

exports = drawler;
