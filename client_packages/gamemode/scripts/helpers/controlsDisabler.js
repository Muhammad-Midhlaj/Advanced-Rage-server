const disabledControls = new Set();

mp.events.add("render", () => {
	if (disabledControls.size === 0) {
		return;
	}

	for (const disabledControl of disabledControls) {
		mp.game.controls.disableControlAction(2, disabledControl, true);
	}
});

exports = {
	add: (control) => {
		disabledControls.add(control);
	},
	addRange: (controls) => {
		if (!Array.isArray(controls)) {
			return;
		}
		
		for (const control of controls) {
			disabledControls.add(control);
		}
	},
	remove: (control) => {
		disabledControls.delete(control);
	},
	removeRange: (controls) => {
		if (!Array.isArray(controls)) {
			return;
		}
		
		for (const control of controls) {
			disabledControls.delete(control);
		}
	},
	removeAll: () => {
		disabledControls.clear();
	}
}
