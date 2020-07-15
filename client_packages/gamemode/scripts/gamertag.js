mp.nametags.enabled = false;

const width = 0.025;
const height = 0.004;
const border = 0.001;

let isActive = true;
let isActiveNickname = true;
let isActiveNickId = true;
let resolution;
let iconCount = 0;
let widthText = 0.0;
let iconsWidth = 0.0;
let scale = 0.35;

mp.events.add("familiar.add", (name, playerId) => {
    if (!mp.storage.data.familiar) mp.storage.data.familiar = {};
    var familiarList = mp.storage.data.familiar;
    if (!familiarList[mp.players.local.name]) familiarList[mp.players.local.name] = [];
    familiarList = familiarList[mp.players.local.name];
    if (familiarList.indexOf(name) != -1) return mp.events.call(`nError`, `You are already friend with ${name}!`);
    familiarList.push(name);
    mp.players.atRemoteId(playerId).isFamiliar = true;
    mp.events.call(`nSuccess`, `${name} - Your new friend`);
});

mp.events.add("nametags::show", (state) => {
    isActive = state;
});

mp.events.add("nametags::nickname", (state) => {
    isActiveNickname = state;
    mp.storage.data["nickname"] = state;
});

mp.events.add("nametags::nickId", (state) => {
    isActiveNickId = state;
    mp.storage.data["nickId"] = state;
});

mp.events.add('render', (nametags) => {
    if (!Array.isArray(nametags) || !isActive) {
        return;
    }

    nametags.forEach(nametag => {
        let [player, x, y, distance] = nametag;
        if (
            player.id != mp.players.local.id &&
            player.getAlpha() != 0 &&
            mp.players.local.hasClearLosTo(player.handle, 17)
        ) {
            var username = (mp.clientStorage.admin) ? `${player.name} (${player.remoteId})` : `(${player.remoteId})`;

            if (!isActiveNickname && !isActiveNickId) {
                username = ``;
            }

            if (!isActiveNickname && isActiveNickId) {
                username = `(${player.remoteId})`;
            }

            if (player.isFamiliar && isActiveNickname && !isActiveNickId) {
                username = player.name + ``;
            }

            if (player.isFamiliar && isActiveNickname && isActiveNickId) username = player.name + " (" + player.remoteId + ")";
            if (!player.getVariable("ainvis")) drawMpGamerTag(player, username, x, y, distance);
        }
    });
});

function drawMpGamerTag(player, name, x, y, dist) {

    var distance = vdist(mp.players.local.position, player.position);
    if (distance > 20.0) return;

    if (player.vehicle) {
        y += 0.07;
    }

    resolution = mp.game.graphics.getScreenActiveResolution(0, 0);
    y -= scale * (0.005 * (resolution.y / 1080));

    if (playerChatBubbles[player.remoteId] && playerChatBubbles[player.remoteId].text) gamertag_DrawText(x, y - 0.03, playerChatBubbles[player.remoteId].text, 255);

    // Check if we are pointing at the player and if so draw a strip xn
    if (!isTargetPlayer(player)) {
        drawGamerNameAndIcons(player, name, x, y, distance, 210, false);
    } else {
        drawGamerNameAndIcons(player, name, x, y, distance, 255, true);
    }
}

function getVoiceSprite(isVoiceActive, distance) {
    if (!isVoiceActive) return "leaderboard_audio_inactive";
    if (distance < 5) return "leaderboard_audio_3";
    if (distance < 10) return "leaderboard_audio_2";
    return "leaderboard_audio_1";
}

function getVoiceSpriteColor(name) {
    if (name == "leaderboard_audio_mute") return [255, 255, 255, 180];
    if (name == "leaderboard_audio_1") return [255, 255, 255, 200];
    if (name == "leaderboard_audio_2") return [255, 255, 255, 220];
    if (name == "leaderboard_audio_3") return [255, 255, 255, 255];
    return [255, 255, 255, 255];
}

function getNicknameColor(player) {
    var admin = player.getVariable("admin");
    if (!admin) return [255, 255, 255];
    if (admin >= 1 && admin < 6) return [0, 128, 128];
    if (admin >= 6 && admin <= 8) return [50, 205, 50];
    if (admin == 9) return [255, 0, 0];
    return [0, 0, 0];
}

function isTargetPlayer(player) {
    return (
        mp.game.player.isFreeAimingAtEntity(player.handle) ||
        mp.game.player.isTargettingEntity(player.handle)
    );
}

function drawGamerNameAndIcons(player, name, x, y, distance, alpha, healthammobar) {

    iconCount = 0;

    widthText = gamertag_GetWidthText(name);

    var voiceSprite = getVoiceSprite(player.isVoiceActive, distance);
    var voiceSpriteColor = getVoiceSpriteColor(voiceSprite);

    gamertag_AddNameIcon("mpleaderboard", voiceSprite, voiceSpriteColor, false, x, y);

    var sumWidth = iconsWidth + widthText;
    var color = getNicknameColor(player);

    gamertag_DrawText(x + (widthText / 2) - (sumWidth / 2), y, name, alpha, color);

    if (healthammobar) {
        var health = player.getHealth() / 100;
        var armour = player.getArmour() / 100;


        if (!armour) {

            mp.game.graphics.drawRect(x, y + 0.042, width + border * 2, height + border * 2, 0, 0, 0, 200);
            mp.game.graphics.drawRect(x, y + 0.042, width, height, 150, 150, 150, 255);
            mp.game.graphics.drawRect(x - width / 2 * (1 - health), y + 0.042, width * health, height, 255, 255, 255, 200);
        } else {

            let x2 = x - width / 2 - border / 2;
            mp.game.graphics.drawRect(x2, y + 0.042, width + border * 2, 0.0085, 0, 0, 0, 200);
            mp.game.graphics.drawRect(x2, y + 0.042, width, height, 150, 150, 150, 255);
            mp.game.graphics.drawRect(x2 - width / 2 * (1 - health), y + 0.042, width * health, height, 255, 255, 255, 200);

            x2 = x + width / 2 + border / 2;
            mp.game.graphics.drawRect(x2, y + 0.042, width + border * 2, height + border * 2, 0, 0, 0, 200);
            mp.game.graphics.drawRect(x2, y + 0.042, width, height, 41, 66, 78, 255);
            mp.game.graphics.drawRect(x2 - width / 2 * (1 - armour), y + 0.042, width * armour, height, 48, 108, 135, 200);
        }
    }
}

function gamertag_AddNameIcon(dict, name, color, onlytarget, x, y) {
    //onlytarget soon
    mp.game.graphics.requestStreamedTextureDict(dict, true);
    var textureResolution = mp.game.graphics.getTextureResolution(dict, name);

    var scalex = (0.9 * textureResolution.x) / resolution.x;
    var scaley = (0.9 * textureResolution.y) / resolution.y;

    iconsWidth = ((scalex / 2) + 0.005) * 1;
    var sumWidth = widthText + iconsWidth;

    mp.game.graphics.drawSprite(dict, name, x + 0.008 + widthText - (sumWidth / 2), y + 0.0125, scalex, scaley, 0, color[0], color[1], color[2], color[3]);
    iconCount++;
}

function gamertag_GetWidthText(text) {
    mp.game.ui.setTextEntryForWidth("STRING");
    mp.game.ui.addTextComponentSubstringPlayerName(text);
    mp.game.ui.setTextFont(4);
    mp.game.ui.setTextScale(scale, scale);
    return mp.game.ui.getTextScreenWidth(true);
}

function gamertag_DrawText(x, y, text, alpha, color = [255, 255, 255]) {
    mp.game.ui.setTextFont(4);
    mp.game.ui.setTextScale(scale, scale);
    mp.game.ui.setTextColour(color[0], color[1], color[2], alpha);
    mp.game.ui.setTextJustification(0);
    mp.game.invoke("0x2513DFB0FB8400FE");
    mp.game.ui.setTextEntry("STRING");
    mp.game.ui.addTextComponentSubstringPlayerName(text);
    mp.game.ui.drawText(x, y);
}
