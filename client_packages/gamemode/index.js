// CEF browser.
let menu;

var timerBarLib;

// Creating browser.
mp.events.add('guiReady', () => {
    if (!menu) {
        // Creating CEF browser.
				menu = mp.browsers.new('package://gamemode/browser/index.html');
        mp.events.add('browserDomReady', (browser) => {
            if (browser == menu) {
                mp.gui.execute("window.location = 'package://gamemode/chat/index.html'");
                mp.discord.update('UNTAMED Hero Role Play', 'untamedhero.com');
                // Init events.
                require('gamemode/scripts/events.js')(menu);
                require('gamemode/scripts/notifs.js');
                require('gamemode/scripts/browser.js')(menu);
                require('gamemode/scripts/account_events.js')(menu);
                require('gamemode/scripts/character_events.js')(menu);
                require('gamemode/scripts/selectMenu_events.js')(menu);
                require('gamemode/scripts/interactionMenu_events.js')(menu);
                require('gamemode/scripts/infoTable_events.js')(menu);
                require('gamemode/scripts/modal_events.js')(menu);
                require('gamemode/scripts/prompt_events.js')(menu);
                require('gamemode/scripts/choiceMenu_events.js')(menu);
                require('gamemode/scripts/movecam.js')(menu);
                require('gamemode/scripts/console_events.js')(menu);
                require('gamemode/scripts/chat_events.js')(menu);
                require('gamemode/scripts/gamertag.js');
                require('gamemode/scripts/bigmap.js')(menu);
                require('gamemode/scripts/houseMenu.js')(menu);
                require('gamemode/scripts/vehProp.js')(menu);
                require('gamemode/scripts/indicators.js')(menu);
                require('gamemode/scripts/playersOnline_events.js')(menu);
                require('gamemode/scripts/bizLogs_events.js')(menu);
                require('gamemode/scripts/animator.js');
                require('gamemode/scripts/forefinger.js');
                //require('gamemode/scripts/moneyHUD.js');
                require('gamemode/scripts/radioSync.js');
                require('gamemode/scripts/inventory_events.js')(menu);
                require('gamemode/scripts/userInterface.js')(menu);
                require('gamemode/scripts/trade_events.js')(menu);
                require('gamemode/scripts/documents_events.js')(menu);
                require('gamemode/scripts/closed_doors.js');
                require('gamemode/scripts/player_weapon.js')(menu);
                require('gamemode/scripts/jobs/trash/index.js');
                require('gamemode/scripts/jobs/pizza/index.js');
                require('gamemode/scripts/jobs/waterfront/index.js');
                require('gamemode/scripts/jobs/builder/index.js');
                require('gamemode/scripts/jobs/autoroober/index.js');
                require('gamemode/scripts/jobs/bus/bus_control.js');
                require('gamemode/scripts/jobs/taxi/index.js');
                require('gamemode/scripts/jobs/gopostal/gopostal-client.js');
                require('gamemode/scripts/jobs/smuggling/index.js');
                require('gamemode/scripts/medicTablet_events.js')(menu);
                require('gamemode/scripts/fibTablet_events.js')(menu);
                require('gamemode/scripts/armyTablet_events.js')(menu);
                require('gamemode/scripts/pdTablet_events.js')(menu);
                require('gamemode/scripts/sheriffTablet_events.js')(menu);
                require('gamemode/scripts/autoSaloon_events.js')(menu);
                require('gamemode/scripts/policePassport_events.js')(menu);
                require('gamemode/scripts/playerMenu_events.js')(menu);
                require('gamemode/scripts/reportSystem_events.js')(menu);
                require('gamemode/scripts/adminPanel_events.js')(menu);
                require('gamemode/scripts/donateMenu_events.js')(menu);
                require('gamemode/scripts/fbiPassport_events.js')(menu);
                require('gamemode/scripts/telephone_events.js')(menu);
                require('gamemode/scripts/hudControl_events.js')(menu);
                require('gamemode/scripts/ls_customs/index.js')(menu);
                require('gamemode/scripts/rent_veh.js');
                require('gamemode/scripts/helper.js');
                require('gamemode/scripts/client-bank.js');
                require('gamemode/scripts/fly.js');
                require('gamemode/scripts/hudcontrol.js')(menu);
                timerBarLib = require('gamemode/scripts/timebar.js');
                require('gamemode/scripts/player_death.js');
                require('gamemode/scripts/barbershop/index.js');
                require('gamemode/scripts/achievements_events.js')(menu);
                require('gamemode/scripts/walking_events.js');
                require('gamemode/scripts/emotions_events.js');
                require('gamemode/scripts/peds_events.js');
                require('gamemode/scripts/doorControl.js');
                require('gamemode/scripts/custom_events/index.js');
								require('gamemode/scripts/green_zones.js');
                require('gamemode/scripts/admin.js');
								require('gamemode/scripts/character_creation/index.js')(menu);
                require('gamemode/scripts/planeSmoke.js');
                require('gamemode/scripts/farm.js');
                require('gamemode/scripts/atm_trigger.js');
				require('gamemode/scripts/uI18n.js');
                /*require('gamemode/moneyHUD.js');
                //require('freeroam/passenger.js');
                require('gamemode/indicators.js')(menu);
                require('scaleform_messages/index.js');
                require('gamemode/mugshotBoard.js');
                require('gamemode/death_events.js')(menu);
                require('gamemode/events.js')(menu);
                require('gamemode/phone_events.js')(menu);
                require('gamemode/console_events.js')(menu);
                require('gamemode/prompt_events.js')(menu);
                require('gamemode/movecam.js')(menu);*/

                //mp.game.graphics.startScreenEffect('MP_job_load', 9999999, true);
                mp.events.callRemote("playerBrowserReady");
                mp.events.call("setFreeze", true);
                setCursor(true);
                mp.game.ui.setMinimapVisible(false);
                mp.game.ui.displayRadar(false);
                mp.events.call(`effect`, 'MP_job_load', 100000);


								//startFlyingCamera();
								mp.players.local.setVisible(true, false);
                mp.players.local.setAlpha(0);

            }
        });
    }
});


function getHash(str) {
    var sum = 0;
    for (var i = 0; i < str.length; i++) {
        sum += str.charCodeAt(i);
    }
    return sum;
}

function test() {
    setTimeout(() => {
        var player = mp.players.local;
        let Ped = mp.peds.new(mp.game.joaat('MP_M_Freemode_01'), player.position, 270.0, (streamPed) => {
            streamPed.setAlpha(80);
            player.cloneToTarget(streamPed.handle);
        }, player.dimension);

        setTimeout(() => {
            Ped.clearTasks();
            mp.game.streaming.requestAnimDict("switch@michael@sitting");
            Ped.taskPlayAnim("switch@michael@sitting", "idle_chair", 8.0, 0.0, -1, 1, 0.0, false, false, false);

            //mp.game.streaming.requestAnimDict("switch@michael@sitting");
            //Ped.playAnim("idle_chair", "switch@michael@sitting", 1.0, true, true, true, 1.0, 1.0);

        }, 1000);
    }, 2000);
}

function test_kemperrr() {
    const requestAnimDict = (string) => {
        mp.game.streaming.requestAnimDict(string);
        return new Promise((r) => {
            const timer = setInterval(() => {
                if (mp.game.streaming.hasAnimDictLoaded(string)) {
                    clearInterval(timer);
                    r(true);
                }
            }, 50);
        });
    };

    const pedStreamIn = async (ped) => {
        await requestAnimDict("switch@michael@sitting");
        ped.taskPlayAnim("idle_chair", "switch@michael@sitting", 8, 16, -1, 1, 1, false, false, false);
    };

    mp.events.add('cPlayer', async (player) => {
        const ped = mp.peds.new(mp.game.joaat('MP_m_Freemode_01'), player.position, 270.0, pedStreamIn, player.dimension);
    });

    mp.events.call('cPlayer', mp.players.local);
}

var timerId;

function startFlyingCamera() {
    var startPos = new mp.Vector3(randomInteger(-500, 500), randomInteger(-500, 500), 200);
    var startRot = new mp.Vector3(0, 30, randomInteger(0, 360));

    var endPos = new mp.Vector3(randomInteger(-500, 500), randomInteger(-500, 500), 200);
    var endRot = new mp.Vector3(-30, 0, randomInteger(0, 360));
    mp.CameraMoveTo(startPos, endPos, startRot, endRot, 20, 90);
    timerId = setInterval(() => {
        //mp.events.call("startCutscene", "path1");
        var startPos = new mp.Vector3(randomInteger(-500, 500), randomInteger(-500, 500), 200);
        var startRot = new mp.Vector3(0, 30, randomInteger(0, 360));

        var endPos = new mp.Vector3(randomInteger(-500, 500), randomInteger(-500, 500), 200);
        var endRot = new mp.Vector3(0, 30, randomInteger(0, 360));
        mp.CameraMoveTo(startPos, endPos, startRot, endRot, 20, 90);
    }, 15000);
}

function stopFlyingCamera() {
    clearInterval(timerId);
    mp.events.call("finishMoveCam");
}

var floodTimerId;
var FLOOD_TIME = 1000;
var MAX_FLOOD_TIME = 2000;
var lastFloodTime;

function isFlood() {
    return false;
    if (mp.antiFlood) {
        mp.events.call(`nError`, `Anti-FLOOD! ${lastFloodTime/1000} сек.`);
        clearTimeout(floodTimerId);
        lastFloodTime = Math.clamp(lastFloodTime + 1000, 0, MAX_FLOOD_TIME);
        floodTimerId = setTimeout(() => {
            mp.antiFlood = false;
        }, lastFloodTime);
        return true;
    }
    mp.antiFlood = true;
    floodTimerId = setTimeout(() => {
        mp.antiFlood = false;
    }, FLOOD_TIME);
    lastFloodTime = FLOOD_TIME;

    return false;
}


function setCursor(enable) {
    menu.execute(`inventoryAPI.mouseupHandler()`);
    mp.gui.cursor.show(enable, enable);
}

function setFreeze(enable) {
    mp.events.call("setFreeze", enable);
}

function alert(text) {
    menu.execute(`alert('${text}')`);
}

function debug(text) {
    mp.events.call("console.push", "debug", text);
}

function hideWindow(el) {
    menu.execute(`hideWindow('${el}')`);
}

function randomInteger(min, max) {
    var rand = min - 0.5 + Math.random() * (max - min + 1)
    rand = Math.round(rand);
    return rand;
}

Math.clamp = function(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

function vdist(posA, posB) {
    if (!posA || !posB) return Number.MAX_VALUE;
    return mp.game.system.vdist(posA.x, posA.y, posA.z, posB.x, posB.y, posB.z);
}

function scalable(dist, maxDist) {
    return Math.max(0.1, 1 - (dist / maxDist));
}

function drawSprite(dist, name, scale, heading, colour, x, y, layer) {
    const graphics = mp.game.graphics,
        resolution = graphics.getScreenActiveResolution(0, 0),
        textureResolution = graphics.getTextureResolution(dist, name),
        SCALE = [(scale[0] * textureResolution.x) / resolution.x, (scale[1] * textureResolution.y) / resolution.y]

    if (graphics.hasStreamedTextureDictLoaded(dist) === 1) {
        if (typeof layer === 'number') {
            graphics.set2dLayer(layer);
        }

        graphics.drawSprite(dist, name, x, y, SCALE[0], SCALE[1], heading, colour[0], colour[1], colour[2], colour[3]);
    } else {
        graphics.requestStreamedTextureDict(dist, true);
    }
}

function drawText3d(text, pos, scale = 0.3, color = [0, 187, 255, 255]) {
    mp.game.graphics.drawText(text, [pos.x, pos.y, pos.z], {
        font: 4,
        color: color,
        scale: [scale, scale],
        outline: true
    });
}

function getNearPlayer(pos) {
    var nearPlayer;
    var minDist = 99999;
    mp.players.forEachInStreamRange((rec) => {
        if (rec == mp.players.local) return;
        var distance = vdist(pos, rec.position);
        if (distance < minDist) {
            nearPlayer = rec;
            minDist = distance;
        }
    });
    return nearPlayer;
}

function getNearVehicle(pos, range = 10) {
    var nearVehicle;
    var minDist = 99999;
    mp.vehicles.forEachInStreamRange((veh) => {
        var distToVeh = vdist(pos, veh.position);
        if (distToVeh < range) {
            var distToHood = vdist(pos, getHoodPosition(veh));
            var distToBoot = vdist(pos, getBootPosition(veh));
            var dist = Math.min(distToVeh, distToHood, distToBoot);
            if (dist < minDist) {
                nearVehicle = veh;
                minDist = dist;
            }
        }
    });
    if (nearVehicle) nearVehicle.minDist = minDist;
    return nearVehicle;
}

function getNearObject(pos, range = 10) {
    var nearObj;
    var minDist = 99999;
    mp.objects.forEach((obj) => {
        var distance = vdist(pos, obj.position);
        if (distance < minDist && distance < range) {
            nearObj = obj;
            minDist = distance;
        }
    });
    return nearObj;
}

function getNearPlayerOrVehicle(pos, range = 10) {
    var nearPlayer = getNearPlayer(pos);
    var nearVehicle = getNearVehicle(pos);
    if (!nearPlayer) return nearVehicle;
    if (!nearVehicle) return nearPlayer;
    var distToPlayer = vdist(pos, nearPlayer.position);
    if (distToPlayer <= nearVehicle.minDist) return nearPlayer;
    else return nearVehicle;
}

function getOccupants(vehId) {
    var veh = mp.vehicles.atRemoteId(vehId);
    if (!veh) return [];
    var occupants = [];
    mp.players.forEach((rec) => {
        if (rec.vehicle && rec.vehicle.remoteId == vehId) occupants.push(rec);
    });
    return occupants;
}

function drawText2d(text, pos = [0.8, 0.5], color = [255, 255, 255, 255], scale = [0.3, 0.3]) {
    mp.game.graphics.drawText(text, pos, {
        font: 0,
        color: color,
        scale: scale,
        outline: true
    });
}

let timeStart = Date.now(),
    frame = 0;

/*function drawFPS() {
    frame++;
    let timeNow = Date.now() - timeStart;

    fps = Math.round(frame / (timeNow / 1000.0));
    drawText2d(`FPS: ${fps}`, [0.6, 0.008], [0, 255, 0, 120]);
}*/

function requestAnimDicts() {
    var anims = ["anim@heists@box_carry@", "amb@world_human_bum_slumped@male@laying_on_left_side@base",
        "amb@world_human_gardener_plant@female@base"];
    for (var i = 0; i < anims.length; i++) {
        mp.game.streaming.requestAnimDict(anims[i]);
        while (!mp.game.streaming.hasAnimDictLoaded(anims[i])) {
            mp.game.wait(0);
        }
    }
}

/* Подсчет количества суммарной цены и количества текстур для каждого типа одежды. */
function getArrayClothesCounts() {
    var names = ["bracelets", "ears", "feets", "glasses", "hats", "legs", "masks", "ties", "top", "watches"];
    if (!mp.storage.data.clothes || Object.keys(mp.storage.data.clothes).length != names.length) {
        mp.storage.data.clothes = {};
        return [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    }


    var counts = [];
    for (var com in mp.storage.data.clothes) {
        var count = 0;
        for (var i = 0; i < mp.storage.data.clothes[com].length; i++) {
            for (var j = 0; j < mp.storage.data.clothes[com][i].length; j++) {
                count += mp.storage.data.clothes[com][i][j].price;
                count += mp.storage.data.clothes[com][i][j].textures.length;
                count += mp.storage.data.clothes[com][i][j].variation;
                if (mp.storage.data.clothes[com][i][j].rows) count += mp.storage.data.clothes[com][i][j].rows;
                if (mp.storage.data.clothes[com][i][j].cols) count += mp.storage.data.clothes[com][i][j].cols;
            }
        }
        count += i;
        counts.push(count);
    }
    return counts;


}

function getHoodPosition(veh) {
    if (!veh) return null
    var vehPos = veh.position;
    var hoodPos = veh.getWorldPositionOfBone(veh.getBoneIndexByName("bonnet"));
    var hoodDist = vdist(vehPos, hoodPos);
    if (hoodDist > 10) return null;
    return veh.getOffsetFromInWorldCoords(0, hoodDist + 2, 0);
}

function getBootPosition(veh) {
    if (!veh) return null;
    var vehPos = veh.position;
    var bootPos = veh.getWorldPositionOfBone(veh.getBoneIndexByName("boot"));
    var bootDist = vdist(vehPos, bootPos);
    if (bootDist > 10) return null;
    return veh.getOffsetFromInWorldCoords(0, -bootDist - 1, 0);
}

function getPlayerByName(name) {
    if (!name) return null;
    var result;
    mp.players.forEach((recipient) => {
        if (recipient.name == name) {
            result = recipient;
            return;
        }
    });
    return result;
}

function getPedBySqlId(sqlId) {
    if (!sqlId) return null;
    var result;
    mp.peds.forEach((ped) => {
        if (ped.sqlId == sqlId) {
            result = ped;
            return;
        }
    });
    return result;
}

function getStreetName(pos) {
    var getStreet = mp.game.pathfind.getStreetNameAtCoord(pos.x, pos.y, pos.z, 0, 0);
    var streetName = mp.game.ui.getStreetNameFromHashKey(getStreet["streetName"]);
    return streetName;
}

String.prototype.escape = function() {
    return this.replace(/[&"'\\]/g, "");
};
