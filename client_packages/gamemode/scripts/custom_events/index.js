const interiorChanged = require("gamemode/scripts/custom_events/interior_changed.js");;

mp.events.add("render", () => {
	interiorChanged.tick();
});
