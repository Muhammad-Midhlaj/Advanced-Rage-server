exports = (menu) => {
    mp.events.add('tablet.medic.showPlayerInfo', (data) => {
        menu.execute(`mp.events.call('medicTablet', { showPlayerInfo: ${JSON.stringify(data)}, event: 'showPlayerInfo' })`);
    });

    mp.events.add('tablet.medic.sendAdvert', (data) => {
        mp.events.callRemote('hospital.advert', data);
    });

    mp.events.add('tablet.medic.addCall', (data) => {
        var call = { id: data.id, name: data.name, dist: vdist(data.pos, mp.players.local.position), pos: data.pos, message: data.message };
        menu.execute(`mp.events.call('medicTablet', { addCall: ${JSON.stringify(call)}, event: 'addCall'})`);
    });

    mp.events.add('tablet.medic.removeCall', (playerId) => {
        menu.execute(`mp.events.call('medicTablet', { removeCall: ${playerId}, event: 'removeCall' })`);
    });

    mp.events.add('tablet.medic.addTeamPlayer', (data) => {
        menu.execute(`mp.events.call('medicTablet', { addTeamPlayer: ${JSON.stringify(data)}, event: 'addTeamPlayer' })`);
    });

    mp.events.add('tablet.medic.removeTeamPlayer', (playerId) => {
        menu.execute(`mp.events.call('medicTablet', { removeTeamPlayer: ${playerId}, event: 'removeTeamPlayer' })`);
    });

    mp.events.add('tablet.medic.callTeamHelp', () => {
        mp.events.callRemote('hospital.callTeamHelp');
    });

    mp.events.add('tablet.medic.callPoliceHelp', () => {
        mp.events.callRemote('hospital.callPoliceHelp');
    });

    mp.events.add("tablet.medic.setEnable", (enable) => {
        menu.execute(`mp.events.call('medicTablet', { status: ${enable}, event: 'enable' })`);
    });

    mp.events.add("tablet.medic.acceptCall", (playerId, x, y) => {
        mp.events.callRemote('hospital.acceptCall', playerId, x, y);
    });

    mp.events.add("setTabletActive", (enable) => {
        mp.tabletActive = enable;
    });
};
