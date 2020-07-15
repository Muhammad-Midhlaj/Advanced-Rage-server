var animatorActive = false;
var animIndex = 0;
mp.clientStorage.animName = "";

mp.events.add("animator", () => {
    animatorActive = !animatorActive;
    if (animatorActive) {
        mp.keys.bind(37, false, () => { //left
            animIndex--;
            if (animIndex < 0) animIndex = 0;
            mp.events.callRemote("playAnimation", animIndex);
        });

        mp.keys.bind(39, false, () => { //right
            animIndex++;
            mp.events.callRemote("playAnimation", animIndex);
        });

        mp.keys.bind(38, false, () => { //up
            animIndex -= 100;
            if (animIndex < 0) animIndex = 0;
            mp.events.callRemote("playAnimation", animIndex);
        });

        mp.keys.bind(40, false, () => { //down
            animIndex += 100;
            mp.events.callRemote("playAnimation", animIndex);
        });

        mp.events.callRemote("playAnimation", animIndex);
    } else {
        mp.keys.unbind(37, false);
        mp.keys.unbind(39, false);
        mp.keys.unbind(38, false);
        mp.keys.unbind(40, false);

        mp.events.callRemote("cancelAnimation");
    }
});

mp.events.add("render", () => {
    if (animatorActive) {
        mp.game.graphics.drawText(`~y~left, right ~w~- to thumb through animation`, [0.2, 0.36], {
            font: 4,
            color: [12, 144, 12, 230],
            scale: [0.6, 0.6],
            outline: true
        });
        mp.game.graphics.drawText(`~y~ up, down ~w~- to thumb through on 100 animation`, [0.2, 0.4], {
            font: 4,
            color: [12, 144, 12, 230],
            scale: [0.6, 0.6],
            outline: true
        });
        mp.game.graphics.drawText(`~b~ ${mp.clientStorage.animName}`, [0.2, 0.44], {
            font: 4,
            color: [12, 144, 12, 230],
            scale: [0.6, 0.6],
            outline: true
        });
    }
});
