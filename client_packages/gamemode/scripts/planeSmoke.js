const allowedModels = [0x81794C70, 0x39D6779E, 0x96E24857, 0xC3F25753, 0xA52F6866, 0x3DC92356],
    dict = "scr_carsteal4",
    effect = "scr_carsteal4_wheel_burnout",
    defaultColor = [255, 255, 255], localPlayer = mp.players.local, smokeSize = 1.8;
let planeSmokeColors = {},
planesWithSmoke = [];

mp.game.streaming.requestNamedPtfxAsset(dict);

mp.events.add({
    'render': () => {
        var vehicle = localPlayer.vehicle;
        if (mp.game.controls.isControlJustPressed(0, 22) && isDriver(localPlayer) && vehicle && allowedModels.includes(vehicle.model)) mp.events.callRemote('toggleSmoke');
        if (planesWithSmoke.length > 0) {
            planesWithSmoke.forEach(plane => {
                if (mp.game.streaming.hasNamedPtfxAssetLoaded(dict)) {
                    if (plane && plane.getIsEngineRunning()) {
                        let color = planeSmokeColors[plane.handle];
                        if (!color) return;
                        mp.game.graphics.setParticleFxNonLoopedColour(color[0], color[1], color[2]);
                        mp.game.graphics.setPtfxAssetNextCall(dict);
                        mp.game.graphics.startParticleFxNonLoopedOnEntity(effect, plane.handle, -0.15, -5.0, 0.3, 0, 0, 0, smokeSize, false, true, false);
                    }
                }
            });
        }
    },
    'entityStreamIn': (entity) => {
        if (entity.type === 'vehicle' && entity.getVariable('smokeActive')) {
            let color = entity.getVariable('smokeColor');
            startSmoke(entity, color);
        }
    },
});

mp.events.addDataHandler("smokeActive", (entity, value) => {
    value ? startSmoke(entity) : removeSmoke(entity);
});

function hexToRGB(hex) { // Thanks to root and lovely stackoverflow
    let bigint = parseInt(hex.replace(/[^0-9A-F]/gi, ''), 16);
    return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
}

function startSmoke (...args) {
    // debug("startSmoke...")
    let vehicle = args[0];
    if (!allowedModels.includes(vehicle.model)) return;
    if (planesWithSmoke.includes(vehicle)) return false;
    if (!planeSmokeColors[vehicle.handle]) planeSmokeColors[vehicle.handle] = defaultColor;
    planesWithSmoke.push(vehicle);
}

function removeSmoke (entity) {
    // debug("removeSmoke...")
    if (planesWithSmoke.length > 0) {
        let idx = planesWithSmoke.indexOf(entity);
        return idx > -1 ? planesWithSmoke.splice(idx, 1) : false;
    }
}

function isDriver (player) {
    if (player.vehicle) return player.vehicle.getPedInSeat(-1) === player.handle;
}
