class InteriorChangedHandler {
	constructor() {
		this.currentInterior = 0;
		this.localPlayer = mp.players.local;
	}

	tick() {
		const newInterior = this.getInterior();

		if (newInterior === this.currentInterior) {
			return;
		}

		mp.events.call("custom_event:interiorChanged", newInterior, this.currentInterior);
		this.currentInterior = newInterior;
	}

	getInterior() {
		return mp.game.invoke("0x2107BA504071A6BB", this.localPlayer.handle);
	}
}

const handler = new InteriorChangedHandler();

exports = handler;
