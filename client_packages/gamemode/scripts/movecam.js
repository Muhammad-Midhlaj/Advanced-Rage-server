//mp.movingcam = mp.cameras.new('default', null, null, 45.0);
exports = function(menu) {

    mp.events.add("startCutscene", (cutSceneId) => {
        StartCutscene(cutSceneId);
    });

    var camPos, camRot;
    mp.events.add("focusOnPlayer", (pos, heading) => {
        var endRot = new mp.Vector3(-20, 0, heading + 180);
        var direction = new mp.Vector3(3.3 * Math.sin(135 - endRot.z * Math.PI / 180), 3.3 * Math.cos(135 - endRot.z * Math.PI / 180), 0);
        var endPos = pos;
        endPos.x += direction.x * 0.8;
        endPos.y += direction.y * 0.8;
        endPos.z += 1;

        if (!mp.movingcam) mp.movingcam = mp.cameras.new('default', pos, endRot, 45.0);
        var startPos = mp.movingcam.getCoord();
        var startRot = mp.game.cam.getGameplayCamRot(0);

        if (mp.movingcam.camType == "focusOnPlayer") return;
        mp.CameraMoveTo(startPos, endPos, startRot, endRot, 5, 45);
        mp.movingcam.camType = "focusOnPlayer";
    });
    mp.events.add("focusOnHead", (pos, heading) => {
        var endRot = new mp.Vector3(-20, 0, heading + 180);
        var direction = new mp.Vector3(3.3 * Math.sin(135 - endRot.z * Math.PI / 180), 3.3 * Math.cos(135 - endRot.z * Math.PI / 180), 0);
        var endPos = pos;
        endPos.x += direction.x * 0.3;
        endPos.y += direction.y * 0.3;
        endPos.z += 0.8;

        if (!mp.movingcam) mp.movingcam = mp.cameras.new('default', pos, endRot, 45.0);
        var startPos = mp.movingcam.getCoord();
        var startRot = mp.game.cam.getGameplayCamRot(0);

        if (mp.movingcam.camType == "focusOnHead") return;
        mp.CameraMoveTo(startPos, endPos, startRot, endRot, 5, 45);
        mp.movingcam.camType = "focusOnHead";
    });
    mp.events.add("focusOnBody", (pos, heading) => {
        var endRot = new mp.Vector3(-20, 0, heading + 180);
        var direction = new mp.Vector3(3.3 * Math.sin(135 - endRot.z * Math.PI / 180), 3.3 * Math.cos(135 - endRot.z * Math.PI / 180), 0);
        var endPos = pos;
        endPos.x += direction.x * 0.4;
        endPos.y += direction.y * 0.4;
        endPos.z += 0.7;

        if (!mp.movingcam) mp.movingcam = mp.cameras.new('default', pos, endRot, 45.0);
        var startPos = mp.movingcam.getCoord();
        var startRot = mp.game.cam.getGameplayCamRot(0);

        if (mp.movingcam.camType == "focusOnHead") return;
        mp.CameraMoveTo(startPos, endPos, startRot, endRot, 5, 45);
        mp.movingcam.camType = "focusOnHead";
    });
    mp.events.add("focusOnLegs", (pos, heading) => {
        var endRot = new mp.Vector3(-20, 0, heading + 180);
        var direction = new mp.Vector3(3.3 * Math.sin(135 - endRot.z * Math.PI / 180), 3.3 * Math.cos(135 - endRot.z * Math.PI / 180), 0);
        var endPos = pos;
        endPos.x += direction.x * 0.5;
        endPos.y += direction.y * 0.5;
        endPos.z += 0;

        if (!mp.movingcam) mp.movingcam = mp.cameras.new('default', pos, endRot, 45.0);
        var startPos = mp.movingcam.getCoord();
        var startRot = mp.game.cam.getGameplayCamRot(0);

        if (mp.movingcam.camType == "focusOnLegs") return;
        mp.CameraMoveTo(startPos, endPos, startRot, endRot, 5, 45);
        mp.movingcam.camType = "focusOnLegs";
    });
    mp.events.add("focusOnFeets", (pos, heading) => {
        var endRot = new mp.Vector3(-30, 0, heading + 180);
        var direction = new mp.Vector3(3.3 * Math.sin(135 - endRot.z * Math.PI / 180), 3.3 * Math.cos(135 - endRot.z * Math.PI / 180), 0);
        var endPos = pos;
        endPos.x += direction.x * 0.5;
        endPos.y += direction.y * 0.5;
        endPos.z += -0.2;

        if (!mp.movingcam) mp.movingcam = mp.cameras.new('default', pos, endRot, 45.0);
        var startPos = mp.movingcam.getCoord();
        var startRot = mp.game.cam.getGameplayCamRot(0);

        if (mp.movingcam.camType == "focusOnFeets") return;
        mp.CameraMoveTo(startPos, endPos, startRot, endRot, 5, 45);
        mp.movingcam.camType = "focusOnFeets";
    });

    mp.events.add("finishMoveCam", () => {
        finishMoveCam();
    });

    mp.events.add("initPointsForMoveCam", (points) => {
        mp.pointsForMoveCam = points;
    });

    // finishMoveCam(); Жмяк F6.
    mp.pointsForMoveCam = {
        '1': {
            points: [{
                    startPosition: new mp.Vector3(-856, -746, 23),
                    endPosition: new mp.Vector3(-860, -800, 20),
                    startRotation: new mp.Vector3(0, 0, 0),
                    endRotation: new mp.Vector3(0, -10, -90),
                    speed: 15,
                    text: "path 1 1"
                },
                {
                    startPosition: new mp.Vector3(-848.2139892578125, -836.5184326171875, 19.22896385192871),
                    endPosition: new mp.Vector3(-782.3574829101562, -837.3258666992188, 21.323766708374023),
                    startRotation: new mp.Vector3(0, 0, 180),
                    endRotation: new mp.Vector3(0, 0, 270),
                    speed: 15,
                    text: "path 1 2"
                },
            ],
            finalText: "path 1 have looked"
        },
        '2': {
            points: [{
                    startPosition: new mp.Vector3(-856, -746, 23),
                    endPosition: new mp.Vector3(-860, -800, 20),
                    startRotation: new mp.Vector3(0, 0, 0),
                    endRotation: new mp.Vector3(0, -10, -90),
                    speed: 15,
                    text: "path 2 1"
                },
                {
                    startPosition: new mp.Vector3(-848.2139892578125, -836.5184326171875, 19.22896385192871),
                    endPosition: new mp.Vector3(-782.3574829101562, -837.3258666992188, 21.323766708374023),
                    startRotation: new mp.Vector3(0, 0, 180),
                    endRotation: new mp.Vector3(0, 0, 270),
                    speed: 15,
                    text: "path 2 2"
                },
            ],
            finalText: "path 2 have looked"
        },
        '3': {
            points: [{
                startPosition: new mp.Vector3(425, -982, 33),
                endPosition: new mp.Vector3(425, -973, 33),
                startRotation: new mp.Vector3(-10, 0, -90),
                endRotation: new mp.Vector3(-10, 0, -90),
                speed: 1,
                text: "bug1"
            }],
            finalText: "bug 2 have looked"
        }
    };

    mp.CameraMoveTo = (startPos, endPos, startRot, endRot, speed, angle) => {
        camPathHandler(-1, startPos, endPos, startRot, endRot, speed, angle);
    }

    function StartCutscene(cutSceneId) {
        if (!cutSceneId) return;
        if (!mp.pointsForMoveCam[cutSceneId]) return;
        if (!mp.pointsForMoveCam[cutSceneId].points.length) return;
        mp.cutSceneName = cutSceneId;
        mp.amountPointsForMoveCam = mp.pointsForMoveCam[cutSceneId].points.length;
        mp.indexPathForMoveCam = 0;
        camPathHandler(0);
        mp.players.local.isFreeze = true;
    }

    function camPathHandler(index, startPos, endPos, startRot, endRot, speed, angle) {
        if (index != -1) {
            var startPos = mp.pointsForMoveCam[mp.cutSceneName].points[index].startPosition;
            var startRot = mp.pointsForMoveCam[mp.cutSceneName].points[index].startRotation;
            var endPos = mp.pointsForMoveCam[mp.cutSceneName].points[index].endPosition;
            var endRot = mp.pointsForMoveCam[mp.cutSceneName].points[index].endRotation;
            var speed = mp.pointsForMoveCam[mp.cutSceneName].points[index].speed
        }
        if (!angle) angle = 90;
        if (!mp.movingcam) mp.movingcam = mp.cameras.new('default', startPos, startRot, angle);
        else {
            mp.movingcam.setRot(startRot.x, startRot.y, startRot.z);
            mp.movingcam.setCoord(startPos.x, startPos.y, startPos.z);
        }
        mp.movingcam.setActive(true);
        mp.game.cam.renderScriptCams(true, false, 0, true, false);

        var dx = endPos.x - startPos.x;
        var dy = endPos.y - startPos.y;
        var dz = endPos.z - startPos.z;

        var length = Math.sqrt(dx * dx + dy * dy + dz * dz);

        mp.movingcam.dx = (dx / length) * (speed / 100);
        mp.movingcam.dy = (dy / length) * (speed / 100);
        mp.movingcam.dz = (dz / length) * (speed / 100);

        var amountFrame = Math.round(dx / mp.movingcam.dx);
        if (amountFrame == null || isNaN(amountFrame)) amountFrame = 1;

        mp.movingcam.rx = (endRot.x - startRot.x) / amountFrame;
        mp.movingcam.ry = (endRot.y - startRot.y) / amountFrame;
        mp.movingcam.rz = (endRot.z - startRot.z) / amountFrame;

        mp.movingcam.startmove = true;
        mp.movingcam.isCutScene = (index == -1) ? false : true;
        mp.drawDescription = (index == -1) ? false : true;

        mp.movingcam.endX = endPos.x;
        mp.movingcam.endY = endPos.y;
        mp.movingcam.endZ = endPos.z;

    }

    function finishMoveCam() {
        if (!mp.movingcam) return;
        mp.movingcam.setActive(false);
        mp.movingcam.startmove = false;
        mp.game.cam.renderScriptCams(false, false, 0, false, false);
        mp.players.local.isFreeze = false;
        //mp.indexPathForMoveCam = mp.amountPointsForMoveCam - 1;
        mp.drawDescription = false;
        mp.finilDescription = true;
        setTimeout(() => {
            mp.finilDescription = false;
        }, 5000);
    }

    function moveCamToPoint() {
        var pos = mp.movingcam.getCoord();
        var rot = mp.game.cam.getGameplayCamRot(0);

        mp.movingcam.setCoord(pos.x += mp.movingcam.dx, pos.y += mp.movingcam.dy, pos.z += mp.movingcam.dz);
        mp.movingcam.setRot(rot.x + mp.movingcam.rx, rot.y + mp.movingcam.ry, rot.z + mp.movingcam.rz, 2);

        if (Math.abs(mp.movingcam.endX - pos.x) < Math.abs(mp.movingcam.dx) || Math.abs(mp.movingcam.endY - pos.y) < Math.abs(mp.movingcam.dy) || Math.abs(mp.movingcam.endZ - pos.z) < Math.abs(mp.movingcam.dz)) {
            if (!mp.movingcam.isCutScene) {
                mp.movingcam.startmove = false;
                return;
            }

            if (mp.indexPathForMoveCam == mp.amountPointsForMoveCam - 1) {
                finishMoveCam();
            } else {
                mp.indexPathForMoveCam++;
                camPathHandler(mp.indexPathForMoveCam);
            }
        }
    }

    mp.events.add("render", (playersWithText, menu2) => {
        if (mp.movingcam)
            if (mp.movingcam.startmove)
                moveCamToPoint();

        if (mp.drawDescription)
            mp.game.graphics.drawText(`${mp.pointsForMoveCam[mp.cutSceneName].points[mp.indexPathForMoveCam].text}`, [0.5, 0.9], {
                font: 1,
                color: [119, 170, 136, 230],
                scale: [0.8, 0.8],
                outline: true
            });

        if (mp.finilDescription && mp.pointsForMoveCam[mp.cutSceneName])
            mp.game.graphics.drawText(`${mp.pointsForMoveCam[mp.cutSceneName].finalText}`, [0.5, 0.9], {
                font: 1,
                color: [119, 170, 136, 230],
                scale: [0.8, 0.8],
                outline: true
            });
    });
};
