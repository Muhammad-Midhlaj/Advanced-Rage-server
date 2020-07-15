exports = (menu) => {
    mp.events.add('tablet.police.showPlayerInfo', (data) => {
        menu.execute(`mp.events.call('pdTablet', { showPlayerInfo: ${JSON.stringify(data)}, event: 'showPlayerInfo' })`);
    });

    mp.events.add('tablet.police.addCall', (data) => {
        menu.execute(`mp.events.call('pdTablet', { addCall: ${JSON.stringify(data)}, event: 'addCall'})`);
    });

    mp.events.add('tablet.police.removeCall', (playerId) => {
        menu.execute(`mp.events.call('pdTablet', { removeCall: ${playerId}, event: 'removeCall' })`);
    }); 

    mp.events.add('tablet.police.addTeamPlayer', (data) => {
        menu.execute(`mp.events.call('pdTablet', { addTeamPlayer: ${JSON.stringify(data)}, event: 'addTeamPlayer' })`);
    });

    mp.events.add('tablet.police.removeTeamPlayer', (playerId) => {
        menu.execute(`mp.events.call('pdTablet', { removeTeamPlayer: ${playerId}, event: 'removeTeamPlayer' })`);
    });

    mp.events.add("tablet.police.addSearchPlayer", (data) => {
        var houses = [];
        for (var i = 0; i < data.houses.length; i++) {
            var h = data.houses[i];
            var getStreet = mp.game.pathfind.getStreetNameAtCoord(h.pos.x, h.pos.y, h.pos.z, 0, 0);
            var adress = mp.game.ui.getStreetNameFromHashKey(getStreet["streetName"]);
            houses.push({ id: h.sqlId, adress: adress });
        }
        data = { playerId: data.playerId, name: data.name, crimes: data.crimes, faction: data.faction, houses: houses };
        menu.execute(`mp.events.call('pdTablet', { addSearchPlayer: ${JSON.stringify(data)}, event: 'addSearchPlayer' })`);
    });

    mp.events.add("tablet.police.setEnable", (enable) => {
        menu.execute(`mp.events.call('pdTablet', { status: ${enable}, event: 'enable' })`);
    });

    mp.events.add("tablet.police.giveFine", (playerId, reason, summ) => {
        var data = { playerId: playerId, summ: summ, reason: reason };
        mp.events.callRemote('police.giveFine', JSON.stringify(data));
    });

    mp.events.add("tablet.police.giveWanted", (playerId, stars) => {
        var data = { playerId: playerId, stars: stars };
        mp.events.callRemote('police.giveWanted', JSON.stringify(data));
    });

    mp.events.add("tablet.police.searchPlayer", (event, param) => {
        mp.events.callRemote('police.searchPlayer', event, param);
    });

    mp.events.add('tablet.police.callTeamHelp', () => {
        mp.events.callRemote('police.callTeamHelp');
    });

    mp.events.add('tablet.police.callFibHelp', () => {
        mp.events.callRemote('police.callFibHelp');
    });

    mp.events.add('tablet.police.callHospitalHelp', () => {
        mp.events.callRemote('police.callHospitalHelp');
    });

    mp.events.add("tablet.police.acceptCall", (playerId) => {
        mp.events.callRemote('police.acceptCall', playerId);
    });

    mp.events.add("setTabletActive", (enable) => {
        mp.tabletActive = enable;
    });
};
