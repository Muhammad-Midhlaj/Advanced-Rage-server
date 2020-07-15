module.exports = {
    "playerExitVehicle": (player, vehicle) => {
        if (vehicle.player == player) delete vehicle.player;

        if (player && player.hasCuffs) player.playAnimation("mp_arresting", 'idle', 1, 49);
        mp.setVehSpawnTimer(vehicle);
    }
}
