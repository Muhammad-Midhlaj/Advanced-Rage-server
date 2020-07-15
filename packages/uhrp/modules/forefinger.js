mp.events.add("fpsync.update", (player, camPitch, camHeading) => {
    mp.players.call(player.streamedPlayers, "fpsync.update", [player.id, camPitch, camHeading]);

});

mp.events.add("pointingStop", (player) => {
    player.stopAnimation();
});