exports = (menu) => {
    mp.events.add('tablet.fib.showPlayerInfo', (data) => {
        menu.execute(`mp.events.call('fibTablet', { showPlayerInfo: ${JSON.stringify(data)}, event: 'showPlayerInfo' })`);
    });

    mp.events.add('tablet.fib.addCall', (data) => {
        menu.execute(`mp.events.call('fibTablet', { addCall: ${JSON.stringify(data)}, event: 'addCall'})`);
    });

    mp.events.add('tablet.fib.removeCall', (playerId) => {
        menu.execute(`mp.events.call('fibTablet', { removeCall: ${playerId}, event: 'removeCall' })`);
    }); 

    mp.events.add('tablet.fib.addTeamPlayer', (data) => {
        menu.execute(`mp.events.call('fibTablet', { addTeamPlayer: ${JSON.stringify(data)}, event: 'addTeamPlayer' })`);
    });

    mp.events.add('tablet.fib.removeTeamPlayer', (playerId) => {
        menu.execute(`mp.events.call('fibTablet', { removeTeamPlayer: ${playerId}, event: 'removeTeamPlayer' })`);
    });

    mp.events.add("tablet.fib.addSearchPlayer", (data) => {
        var houses = [];
        for (var i = 0; i < data.houses.length; i++) {
            var h = data.houses[i];
            var getStreet = mp.game.pathfind.getStreetNameAtCoord(h.pos.x, h.pos.y, h.pos.z, 0, 0);
            var adress = mp.game.ui.getStreetNameFromHashKey(getStreet["streetName"]);
            houses.push({ id: h.sqlId, adress: adress });
        }
        
        data = { playerId: data.playerId, name: data.name, crimes: data.crimes, faction: data.faction, houses: houses };
        menu.execute(`mp.events.call('fibTablet', { addSearchPlayer: ${JSON.stringify(data)}, event: 'addSearchPlayer' })`);
    });

    mp.events.add("tablet.fib.giveFine", (playerId, reason, summ) => {
        var data = { playerId: playerId, summ: summ, reason: reason };
        mp.events.callRemote('fib.giveFine', JSON.stringify(data));
    });

    mp.events.add("tablet.fib.giveWanted", (playerId, stars) => {
        var data = { playerId: playerId, stars: stars };
        mp.events.callRemote('fib.giveWanted', JSON.stringify(data));
    });

    mp.events.add("tablet.fib.searchPlayer", (event, param) => {
        mp.events.callRemote('fib.searchPlayer', event, param);
    });

    mp.events.add('tablet.fib.callTeamHelp', () => {
        mp.events.callRemote('fib.callTeamHelp');
    });

    mp.events.add('tablet.fib.callPoliceHelp', () => {
        mp.events.callRemote('fib.callPoliceHelp');
    });

    mp.events.add('tablet.fib.callHospitalHelp', () => {
        mp.events.callRemote('fib.callHospitalHelp');
    });

    mp.events.add("tablet.fib.acceptCall", (playerId) => {
        mp.events.callRemote('fib.acceptCall', playerId);
    });
    
    mp.events.add("tablet.fib.setEnable", (enable) => {
        menu.execute(`mp.events.call('fibTablet', { status: ${enable}, event: 'enable' })`);
    });

    mp.events.add("setTabletActive", (enable) => {
        mp.tabletActive = enable;
    });
};
