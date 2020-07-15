module.exports = {
    "__ragemp_cheat_detected": (player, cheatCode) => {
        terminal.log(`Anti-Cheat: ${player.name}. Code: ${cheatCode} (kicked)`);
        player.kick();
    }
}
