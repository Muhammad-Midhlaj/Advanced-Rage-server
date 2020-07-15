exports = (menu) => {

    const Use3d = true;
    const UseAutoVolume = false;
    const MaxRange = 7.0;

    mp.keys.bind(78, true, function() { // N
        if (mp.gui.cursor.visible || mp.chatActive || mp.consoleActive) return;
        if (mute_player) return mp.events.call("nError", "The microphone is locked!");
        //if (!mute_player && !mp.clientStorage["admin"]) return mp.events.call("nError", "Микрофон временно выключен!");
        mp.voiceChat.muted = false;
        menu.execute(`voiceAPI.on()`);
    });

    mp.keys.bind(78, false, function() { // N
        mp.voiceChat.muted = true;
        menu.execute(`voiceAPI.off()`);
    });

    let mute_player = false;
    let g_voiceMgr = {
        listeners: [],
        add: function(player) {
            this.listeners.push(player);

            player.isListening = true;
            mp.events.callRemote("voice.add", player);

            if (UseAutoVolume) {
                player.voiceAutoVolume = true;
            } else {
                player.voiceVolume = 1.0;
            }
            if (Use3d) {
                player.voice3d = true;
            }
        },

        remove: function(player, notify) {
            let idx = this.listeners.indexOf(player);

            if (idx !== -1)
                this.listeners.splice(idx, 1);

            player.isListening = false;

            if (notify) {
                mp.events.callRemote("voice.remove", player);
            }
        }
    };

    mp.events.add("playerQuit", (player) => {
        if (player.isListening) {
            g_voiceMgr.remove(player, false);
        }
    });

    mp.events.add("control.voice.chat", (status) => {
       mute_player = status;
       mp.voiceChat.muted = true;
       menu.execute(`voiceAPI.off()`);
    });

    setInterval(() => {
        let localPlayer = mp.players.local;
        let localPos = localPlayer.position;

        mp.players.forEachInStreamRange(player => {
            if (player != localPlayer) {
                if (!player.isListening) {
                    const playerPos = player.position;
                    let dist = mp.game.system.vdist(playerPos.x, playerPos.y, playerPos.z, localPos.x, localPos.y, localPos.z);

                    if (dist <= MaxRange) {
                        g_voiceMgr.add(player);
                    }
                }
            }
        });

        g_voiceMgr.listeners.forEach((player) => {
            if (player.handle !== 0) {
                const playerPos = player.position;
                let dist = mp.game.system.vdist(playerPos.x, playerPos.y, playerPos.z, localPos.x, localPos.y, localPos.z);

                if (dist > MaxRange) {
                    g_voiceMgr.remove(player, true);
                } else if (!UseAutoVolume) {
                    player.voiceVolume = 1 - (dist / MaxRange);
                }
            } else {
                g_voiceMgr.remove(player, true);
            }
        });
    }, 500);
    /*/
          mp.events.add("render", () => {
                mp.players.forEachInStreamRange((rec) => {
                      if (rec != mp.players.local) drawVoiceSprite(rec);
                });
          });*/
}

/*function drawVoiceSprite(player) {
      var headPos = player.getBoneCoords(12844, 0, 0, 0);
      var headPos2d = mp.game.graphics.world3dToScreen2d(headPos.x, headPos.y, headPos.z + 1);
      if (!headPos2d) return;

      var distance = vdist(mp.players.local.position, player.position);
      var scaleSprite = scalable(distance, 25);
      var sprite = getVoiceSprite(player.isVoiceActive, distance);
      var spriteColor = getVoiceSpriteColor(sprite);
	//leaderboard_audio_3
      drawSprite("mpleaderboard", sprite, [scaleSprite, scaleSprite], 0, spriteColor, headPos2d.x, headPos2d.y + 0.038 * scaleSprite);
}*/
