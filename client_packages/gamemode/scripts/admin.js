const AdminInfo = {
    freeze_timer: undefined,
    camera: undefined,
    save_entity: undefined
}

mp.events.add('admin.control.freeze', (time) => {
    if (AdminInfo.freeze_timer !== undefined) {
        mp.players.local.freezePosition(false);
        clearTimeout(AdminInfo.freeze_timer);
        delete AdminInfo.freeze_timer;
    }
    if (time === 0) return;
    if (AdminInfo.freeze_timer === undefined) {
        mp.players.local.freezePosition(true);
        let parsedNum = time * 1000;
        AdminInfo.freeze_timer = setTimeout(() => {
            mp.players.local.freezePosition(false);
            mp.events.callRemote("delete.player.admin.freeze");
        }, parsedNum);
    }
});

mp.events.add('admin.set.invisible', (type) => {
    mp.players.local.setVisible(type, type);
});

mp.events.add('admin.get.boneindex', (boneName) => {
    if (mp.players.local.vehicle) {
        let boneid = mp.players.local.vehicle.getBoneIndexByName(boneName);
        if (boneid === -1) return mp.events.call("console.push", `error`, `Your transport has no bone "${boneName}"`);
        mp.events.call("console.push", `info`, `The index of a bone at transport "${boneName}" - ${boneid}`);
    } else {
        let boneid = mp.players.local.getBoneIndexByName(boneName);
        if (boneid === -1) return mp.events.call("console.push", `error`, `Your player has no bone "${boneName}"`);
        mp.events.call("console.push", `info`, `The index of a bone at the player "${boneName}" - ${boneid}`);
    }
});

mp.events.add('render', () => {
    if (AdminInfo.save_entity && AdminInfo.camera) {
        AdminInfo.camera.setRot(0, 0, AdminInfo.save_entity.getHeading(), 0);
        mp.players.local.position = new mp.Vector3(AdminInfo.save_entity.position.x, AdminInfo.save_entity.position.y, AdminInfo.save_entity.position.z - 125.0);
    }
    if (mp.clientStorage["demorganSet"]) {
        let pos = mp.players.local.position;
        if (mp.game.gameplay.getDistanceBetweenCoords(pos.x, pos.y, pos.z, 1651.41, 2570.32, 45.56, true) > 7) {
            mp.players.local.position = new mp.Vector3(1651.41, 2570.32, 45.56);
        }
        var time = new Date();
        time.setHours(time.getHours() + (time.getTimezoneOffset()/60) + 3);
        var now = parseInt(time.getTime() / 1000);
        var diff = mp.clientStorage["demorganSet"].startTime - now;
        mp.game.graphics.drawText(`Demorgan: ~r~${(mp.clientStorage["demorganSet"].demorgan + Math.ceil(diff / 60)).toFixed(0)} minutes`, [0.5, 0.96], {
            scale: 0.6,
            color: [255, 255, 255, 255],
            font: 4,
            outline: true
        });
    }
});
// Переписать 26.04.2019
mp.events.add('admin.start.spectate', (entity) => {
    if (entity && mp.players.exists(entity)) {
        mp.players.local.freezePosition(true);
        setTimeout(() => {
            if (!AdminInfo.camera) AdminInfo.camera = mp.cameras.new('default', new mp.Vector3(entity.position.x, entity.position.y, entity.position.z), new mp.Vector3(0, 0, 0), 40);
            AdminInfo.camera.attachTo(entity.handle, 0, 0, 0.65, false);
            AdminInfo.camera.setActive(true);
            mp.game.cam.renderScriptCams(true, false, 0, true, false);
            AdminInfo.save_entity = entity;
        }, 400);
    } else {
        mp.players.local.freezePosition(false);
        AdminInfo.camera.setActive(false);
        mp.game.cam.renderScriptCams(false, false, 0, false, false);
        AdminInfo.camera.detach(false, false);
        AdminInfo.camera.destroy();
        delete AdminInfo.camera, delete AdminInfo.save_entity;
    }
});

/*mp.events.add('admin.stop.spectate', (entity) => {
  mp.players.local.position = entity.position;
  setTimeout(() => {
    AdminInfo.camera = mp.cameras.new('default', new mp.Vector3(entity.position.x, entity.position.y, entity.position.z), new mp.Vector3(0, 0, 0), 40);
    AdminInfo.camera.setActive(true);
    mp.game.cam.renderScriptCams(true, false, 0, true, false);
  }, 250);

});*/
