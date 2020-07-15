var followPlayer;
exports = (menu) => {

    mp.events.add("vehBone.tp", (boneName) => {
        var player = mp.players.local;
        var veh = player.vehicle;
        const pos = veh.position;
        const bonePos = veh.getWorldPositionOfBone(veh.getBoneIndexByName(boneName));
        const distance = vdist(pos, bonePos);
        player.position = bonePos;
    });

    mp.events.add("door", (doorIndex) => {
        var player = mp.players.local;
        player.vehicle.setDoorOpen(doorIndex, false, false);
    });

    mp.events.add("setNewWaypoint", (x, y) => {
        mp.game.ui.setNewWaypoint(x, y);
    });

    /*mp.events.add("checkpoint.create", (routep, direction) => {
        if (mp.currentCheckpoint)
            mp.currentCheckpoint.destroy();

        if (!routep) return;
        var checkpointType = (routep.data.isStation) ? 4 : 1;
        var pos = new mp.Vector3(routep.x, routep.y, routep.z);
        if (!direction) direction = new mp.Vector3(0, 0, 0);

        mp.currentCheckpoint = drawCheckpoint(checkpointType, pos, direction);
    });

    mp.events.add("checkpoints.create", (routeps) => {

        if (mp.routeps)
            for (var i = 0; i < mp.routeps.length; i++) {
                //menu.execute("alert(3)");
                mp.routeps[i].checkpoint.destroy();
                mp.routeps[i].label.destroy();
            }

        mp.routeps = routeps;

        for (var i = 0; i < mp.routeps.length; i++) {
            var pos = new mp.Vector3(routeps[i].x, routeps[i].y, routeps[i].z);

            var direction = (i < mp.routeps.length - 1) ? new mp.Vector3(routeps[i + 1].x, routeps[i + 1].y, routeps[i + 1].z) : pos;
            var checkpointType = (mp.routeps[i].data.isStation) ? 4 : 1;

            mp.routeps[i].checkpoint = drawCheckpoint(checkpointType, pos, direction);

            var text = "";
            text += `id: ${routeps[i].id} \n`;
            text += `name: ${routeps[i].name} \n`;
            text += `routeType: ${routeps[i].type} \n`;
            text += `step: ${routeps[i].step} \n`;
            text += `x: ${routeps[i].x} \n`;
            text += `y: ${routeps[i].y} \n`;
            text += `z: ${routeps[i].z} \n`;

            var pos = new mp.Vector3(routeps[i].x, routeps[i].y, routeps[i].z + 2);
            mp.routeps[i].label = drawLabel(text, pos);
        }
    });*/

    mp.events.add("checkpoint.create", (data) => {
        data = JSON.parse(data);

        if (data.params.isForTractor) {
            mp.checkpoints.forEach((cp) => {
                if (cp.params && cp.params.isForTractor) cp.destroy();
            });
        }
        let checkpoint = mp.checkpoints.new(data.type, data.position, data.scale, {
            direction: data.direction || data.position,
            visible: true,
            dimension: data.dimension || 0,
            color: data.color || [255, 255, 255, 255]
        });

        if (data.params)
            checkpoint.params = data.params;
    });

    mp.events.add("checkpoint.clearForTractor", () => {
        mp.checkpoints.forEach((cp) => {
            if (cp.params && cp.params.isForTractor) cp.destroy();
        });
    });

    function drawCheckpoint(type, pos, direction, radius = 3, color = [255, 255, 255, 255]) {
        return mp.checkpoints.new(type, pos, radius, {
            direction: direction,
            color: color,
            visible: true,
            dimension: 0
        });
    }

    function drawLabel(text, pos) {
        return mp.labels.new(text, pos, {
            font: 6,
            drawDistance: 10,
            color: [22, 255, 22, 255],
        });
    }

    mp.events.add("setPlayerMenuActive", (enable) => {
        mp.playerMenuActive = enable;
    });

    mp.events.add("label.create", (text, pos, data, color = [255, 255, 255, 255], drawDistance = 5) => {
        if (!pos) pos = mp.players.local.position;
        var label = mp.labels.new(text, pos, {
            font: 4,
            drawDistance: drawDistance,
            color: color,
        });
        label.data = data;
    });

    mp.events.add("label.destroy", (id) => {
        var label = mp.labels.atRemoteId(id);
        if (label) label.destroy();
    });
    mp.events.add("requestIpl", (iplName) => {
        mp.game.streaming.requestIpl(iplName);
    });
    mp.events.add("removeIpl", (iplName) => {
        mp.game.streaming.removeIpl(iplName);
    });

    mp.events.add("events.callRemote", (name, values) => {
        mp.events.callRemote(name, values);
    })

    mp.events.add("playSound", (name, setName) => {
        mp.game.audio.playSoundFrontend(-1, name, setName, true);
    });

    mp.events.add("toBlur", (time = 1000) => {
        mp.game.graphics.transitionToBlurred(time);
    });

    mp.events.add("fromBlur", (time = 1000) => {
        mp.game.graphics.transitionFromBlurred(time);
    });

    mp.events.add('effect', (effect, duration) => {
        mp.game.graphics.startScreenEffect(effect, duration, false);
    });

    mp.events.add("lightTextField", (el) => {
        menu.execute(`lightTextField('${el}', '#b44')`);
    });

    mp.events.add("lightTextFieldError", (el, text) => {
        menu.execute(`lightTextFieldError('${el}', '${text}')`);
    });

    mp.events.add("setFreeze", (freeze) => {
        mp.players.local.freezePosition(freeze); // freezes the client at the current position
        mp.players.local.isFreeze = freeze;
    });

    mp.events.add("setBlockControl", (enable) => {
        mp.players.local.isBlockControl = enable;
    });

    mp.events.add("setMpStorageVar", (key, value) => {
        //debug(`setMpStorageVar: ${key} ${value}`)
        mp.storage.data[key] = value;
        mp.events.call("setLocalVar", key, value);
    });

    mp.events.add("setMpStorageVarClothes", (key, value) => {
        //debug(`setMpStorageVar: ${key} ${value}`)
        if (!mp.storage.data.clothes) mp.storage.data.clothes = {};
        mp.storage.data.clothes[key] = value;
    });

    mp.events.add("mpStorage.getHash", (keys) => {
        var hashes = {};
        for (var i = 0; i < keys.length; i++) {
            if (!mp.storage.data[keys[i]]) hashes[keys[i]] = 0;
            else hashes[keys[i]] = getHash(JSON.stringify(mp.storage.data[keys[i]]));
        }

        mp.events.callRemote("mpStorage.update", JSON.stringify(hashes));
    });

    mp.clientStorage = {};
    var localVarHandlers = {
        "admin": (value) => {
            if (value > 0) mp.events.call("console.enable", true);
            else mp.events.call("console.enable", false);
        },
        "playerPings": (value) => {
            alert("playerPings");
        },
        "money": (value) => {
            mp.events.call("inventory.setMoney", value);
        },
        "bank": (value) => {
            mp.events.call("inventory.setBankMoney", value);
        },
        "wanted": (value) => {
            //mp.game.gameplay.setFakeWantedLevel(value);
        },
        "build": (value) => {
            menu.execute(`$('#userInterface .build').text('${value}')`);
        },
        "godmode": (value) => {
            mp.players.local.setProofs(value, value, value, value, value, value, value, value);
        },
    };
    mp.events.add("setLocalVar", (key, value) => {
        mp.clientStorage[key] = value;
        menu.execute(`setLocalVar('${key}', '${JSON.stringify(value)}')`);
        if (localVarHandlers[key]) localVarHandlers[key](value);
    });


    var vehicleVarHandlers = {
        "mileage": (value) => {
            if (!mileageTimer) startMileageCounter(menu);
        }
    };
    mp.events.add("setVehicleVar", (vehicle, key, value) => {
        vehicle[key] = value;
        if (vehicleVarHandlers[key]) vehicleVarHandlers[key](value);
    });

    mp.events.add({
        "entityStreamIn": (entity) => {
            if (entity.type == "player") {
                var attachedObject = entity.getVariable("attachedObject");
                if (!attachedObject) mp.putObject(entity, attachedObject);
                else mp.takeObject(entity, attachedObject);
                var knockDown = entity.getVariable('knockDown') || false;
                entity.clearTasksImmediately();
                if (knockDown) entity.taskPlayAnim('amb@world_human_bum_slumped@male@laying_on_left_side@base', 'base', 8.0, 0, -1, 1, 1.0, false, false, false);

                var animation = entity.getVariable("animation");
                if (animation != null) {
                    value = Math.clamp(animation, 0, animationInfo.length - 1);
                    var a = animationInfo[value];
                    entity.clearTasksImmediately();
                    mp.game.streaming.requestAnimDict(a.dict);
                    while (!mp.game.streaming.hasAnimDictLoaded(a.dict)) {
                        mp.game.wait(0);
                    }
                    entity.taskPlayAnim(a.dict, a.name, a.speed, 0, -1, a.flag, 0, false, false, false);
                }
            }
        },
        "entityStreamOut": (entity) => {
            if (entity.type == "player") {
                if (followPlayer && entity.remoteId == followPlayer.remoteId) followPlayer = null;
                var attachedObject = entity.getVariable("attachedObject");
                if (attachedObject) mp.putObject(entity, attachedObject);
            }
        },
        "playerQuit": (player) => {
            if (followPlayer && player.remoteId == followPlayer.remoteId) followPlayer = null;
        }
    });


    /*
    mp.events.add("render", () => {
        var player = mp.players.local;
        if (player.isFreeze || player.isBlockControl || mp.clientStorage.hasCuffs) mp.game.controls.disableAllControlActions(0);
        if (mp.clientStorage["admin"] > 0) {
            const pos = player.position;
            const heading = player.getHeading();

            mp.game.graphics.drawText(`x: ${pos.x.toFixed(2)}, y: ${pos.y.toFixed(2)}, z: ${pos.z.toFixed(2)}, h: ${heading.toFixed(2)}`, [0.27, 0.965], {
                font: 0,
                color: [255, 255, 255, 230],
                scale: [0.4, 0.4],
                outline: true
            });
        }
        if (mp.clientStorage.insideWarehouseProducts) drawText2d("~y~ Use ~w~E ~y~ for loading goods", [0.5, 0.1]);
        else if (mp.clientStorage.insideProducts) drawText2d("~y~ Use ~w~E ~y~ for taking goods", [0.5, 0.1]);

        drawPlayersText3d();
        drawFPS();
    });*/
    mp.events.add("render", () => {
        var player = mp.players.local;
        if (player.isFreeze || player.isBlockControl || mp.clientStorage.hasCuffs) mp.game.controls.disableAllControlActions(0);
        if (mp.clientStorage.insideWarehouseProducts) drawText2d("~y~ Use ~w~E ~y~ for loading goods", [0.5, 0.1]);
        else if (mp.clientStorage.insideProducts) drawText2d("~y~ Use ~w~E ~y~ for taking goods", [0.5, 0.1]);

        if (player.getVariable("attachedObject") && !throwAttachedObject && (player.isJumping() || player.isShooting() || player.isSwimming() ||
                player.isFalling())) {
            throwAttachedObject = true;
            mp.events.callRemote("attachedObject.throw");
        }

        drawPlayersText3d();
    });
}

var playerChatBubbles = {};

function addPlayerChatBubble(playerId, text) {
    if (playerChatBubbles[playerId]) clearTimeout(playerChatBubbles[playerId].timerId);

    playerChatBubbles[playerId] = {
        text: text,
        timerId: setTimeout(() => {
            delete playerChatBubbles[playerId];
        }, 5000)
    };
}

var playerText3d = {};

function addPlayerText3d(playerId, text, color) {
    if (text.length > 30) {
        text = text.substr(0, 30);
        text += "...";
    }
    if (playerText3d[playerId]) clearTimeout(playerText3d[playerId].timerId);

    playerText3d[playerId] = {
        text: text,
        color: color,
        timerId: setTimeout(() => {
            delete playerText3d[playerId];
        }, 5000)
    };
}

function drawPlayersText3d() {
    var player = mp.players.local;
    for (var key in playerText3d) {
        var rec = mp.players.atRemoteId(key);
        if (rec) {
            var text3d = playerText3d[key];
            //var testPos = new mp.Vector3(-69, -1769, 29);
            var distance = vdist(player.position, rec.position);
            var scale = scalable(distance, 25) * 0.5;
            var headPos = rec.getBoneCoords(12844, 0, 0, 0);
            headPos.z += 0.8;
            drawText3d(text3d.text, headPos, scale, text3d.color);
        }
    }

}
