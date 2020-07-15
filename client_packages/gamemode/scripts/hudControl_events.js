exports = (menu) => {
    var lastServerOnline = 0;

    mp.events.add('hudControl.setData', (data) => {
        menu.execute(`mp.events.call('hudControl', { data: ${JSON.stringify(data)}, event: 'setData' })`);
    });

    mp.events.add('hudControl.updateMoney', (money) => {
        var data = { money: money };
        menu.execute(`mp.events.call('hudControl', { money: ${JSON.stringify(data)}, event: 'updateMoney' })`);
    });

    mp.events.add('hudControl.updateWanted', (wanted) => {
        var data = { wanted: wanted };
        menu.execute(`mp.events.call('hudControl', { wanted: ${JSON.stringify(data)}, event: 'updateWanted' })`);
    });
    
    mp.events.add('hudControl.updateBank', (bank) => {
        var data = { bank: bank };
        menu.execute(`mp.events.call('hudControl', { bank: ${JSON.stringify(data)}, event: 'updateBank' })`);
    });

    mp.events.add("hudControl.enable", (enable) => {
        enableAmmo = true;
        menu.execute(`mp.events.call('hudControl', { status: ${enable}, event: 'enable' })`);
    });

    mp.events.add("setMoney", (money_value) => {
        mp.events.call("setLocalVar", "money", money_value);
    });

    mp.events.add('render', () => {
        
        mp.game.ui.hideHudComponentThisFrame(1);
        mp.game.ui.hideHudComponentThisFrame(2);
        mp.game.ui.hideHudComponentThisFrame(3);
        mp.game.ui.hideHudComponentThisFrame(13);
        mp.game.ui.hideHudComponentThisFrame(4);

        if (mp.players.length != lastServerOnline) {
            lastServerOnline = mp.players.length;
            menu.execute(`mp.events.call('hudControl', { online: ${lastServerOnline}, event: 'setOnline' })`);
        }

        //menu.execute(`mp.events.call('hudControl', { weapon: ${player.weapon}, event: 'weapon' })`);
    });
}