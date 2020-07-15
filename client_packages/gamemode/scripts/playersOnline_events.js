exports = (menu) => {
    mp.events.add("playersOnline.add", (player) => {
        menu.execute(`playersOnlineAPI.add('${JSON.stringify(player)}')`);

        if (!mp.storage.data.familiar) mp.storage.data.familiar = {};
        var familiarList = mp.storage.data.familiar;
        if (!familiarList[mp.players.local.name]) familiarList[mp.players.local.name] = [];
        familiarList = familiarList[mp.players.local.name];
        var rec = mp.players.atRemoteId(player.id);
        if (!rec) return;
        if (familiarList.indexOf(rec.name) != -1) rec.isFamiliar = true;
    });

    mp.events.add("playersOnline.delete", (playerId) => {
        menu.execute(`playersOnlineAPI.delete('${playerId}')`);
    });
}
