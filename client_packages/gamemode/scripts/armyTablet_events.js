exports = (menu) => {
    mp.events.add('tablet.army.showPlayerInfo', (data) => {
        menu.execute(`mp.events.call('armyTablet', { showPlayerInfo: ${JSON.stringify(data)}, event: 'showPlayerInfo' })`);
    });

    mp.events.add('tablet.army.addCall', (data) => {
        menu.execute(`mp.events.call('armyTablet', { addCall: ${JSON.stringify(data)}, event: 'addCall'})`);
    });

    mp.events.add('tablet.army.removeCall', (playerId) => { 
        menu.execute(`mp.events.call('armyTablet', { removeCall: ${playerId}, event: 'removeCall' })`);
    });

    mp.events.add('tablet.army.addTeamPlayer', (data) => {
        menu.execute(`mp.events.call('armyTablet', { addTeamPlayer: ${JSON.stringify(data)}, event: 'addTeamPlayer' })`);
    });

    mp.events.add('tablet.army.removeTeamPlayer', (playerId) => {
        menu.execute(`mp.events.call('armyTablet', { removeTeamPlayer: ${playerId}, event: 'removeTeamPlayer' })`);
    });

    mp.events.add('tablet.army.sendAdvert', (data) => {
        mp.events.callRemote('army.advert', data);
    });

    mp.events.add("tablet.army.getInfoWareHouse", () => {
        mp.events.callRemote('army.getInfoWareHouse');
    });

    mp.events.add("tablet.army.setInfoWareHouse", (data) => {
        menu.execute(`mp.events.call('armyTablet', { setInfoWareHouse: ${JSON.stringify(data)}, event: 'setInfoWareHouse' })`);
    });

    mp.events.add("tablet.army.setEnable", (enable) => {
        menu.execute(`mp.events.call('armyTablet', { status: ${enable}, event: 'enable' })`);
    });

    mp.events.add("setTabletActive", (enable) => {
        mp.tabletActive = enable;
    });
};
