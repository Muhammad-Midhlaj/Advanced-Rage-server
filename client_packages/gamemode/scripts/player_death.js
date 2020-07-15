var localPlayer = mp.players.local;
var healthData = {
    lastHealth: localPlayer.getHealth(),
    lastArmour: localPlayer.getArmour(),
};
var healthBar;
var healthBarTimer;
const WAIT_RESPAWN = 3 * 60 * 1000;

mp.events.addDataHandler("knockDown", (entity) => {
    var knockDown = entity.getVariable('knockDown') || false;
    entity.clearTasksImmediately();
    if (knockDown) entity.taskPlayAnim('amb@world_human_bum_slumped@male@laying_on_left_side@base', 'base', 8.0, 0, -1, 1, 1.0, false, false, false);

    if (entity.remoteId == localPlayer.remoteId) {
        clearInterval(healthBarTimer);
        if (knockDown) {
            healthBar = new timerBarLib.TimerBar("DEATH", true);
            healthBar.progress = 1;
            healthBar.pbarFgColor = [224, 50, 50, 255];
            healthBar.pbarBgColor = [112, 25, 25, 255];
            healthBarTimer = setInterval(() => {
                healthBar.progress -= 0.01;
                if (healthBar.progress <= 0 || !localPlayer.getHealth()) {
                    clearInterval(healthBarTimer);
                    mp.events.callRemote("hospital.respawn");
                    healthBar.visible = false;
                }
            }, WAIT_RESPAWN / 100);
        } else if (healthBar) {
            healthBar.visible = false;
        }
        mp.events.call(`effect`, `MP_Killstreak_Out`, 800);
        mp.events.call("inventory.enable", !knockDown);
    }
});

mp.events.add("render", () => {
    if (localPlayer.getVariable("knockDown")) mp.game.controls.disableAllControlActions(0);
    var health = localPlayer.getHealth();
    var armour = localPlayer.getArmour();

    if (healthData.lastHealth > 10 && healthData.lastHealth > health && health <= 10 && health > 0 && !localPlayer.isSwimming()) {
        localPlayer.clearTasksImmediately();
        localPlayer.taskPlayAnim('amb@world_human_bum_slumped@male@laying_on_left_side@base', 'base', 8.0, 0, -1, 1, 1.0, false, false, false);
        localPlayer.setProofs(true, true, true, true, true, true, true, true);

        mp.events.call("inventory.enable", false);
        mp.events.call("choiceMenu.show", "accept_respawn");
        mp.events.callRemote("knockDown", true);
    }
    if (healthData.lastHealth <= 10 && healthData.lastHealth < health && health > 10) {
        localPlayer.clearTasksImmediately();
        localPlayer.setProofs(false, false, false, false, false, false, false, false);

        mp.events.call("inventory.enable", true);
        mp.events.call("choiceMenu.hide");
        mp.events.callRemote("knockDown", false);
    }

    healthData.lastHealth = health;
    healthData.lastArmour = armour;
});
