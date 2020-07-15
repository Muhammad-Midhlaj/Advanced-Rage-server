let moods = null;

function setMood(player, mood) {
    if (!mood) {
        player.clearFacialIdleAnimOverride();
    } else {
        mp.game.invoke("0xFFC24B988B938B38", player.handle, mood, 0);
    }
}

mp.events.add("entityStreamIn", (entity) => {
    if (entity.type === "player") setMood(entity, entity.getVariable("emotion"));
});

mp.events.addDataHandler("emotion", (entity, value) => {
    if (entity.type === "player") setMood(entity, value);
});
