exports = (menu) => {
    var lastServerOnline = 0;

    // Временный вариант отображения времени (( Потом переделаю ))
    setInterval(function() {
        menu.execute(`userInterface.__vue__.updateTime();`);
    }, 1000);

    mp.events.add('render', () => {

        if (mp.players.length != lastServerOnline) {
            lastServerOnline = mp.players.length;
            menu.execute(`
                        userInterface.__vue__._data.currentOnline=${lastServerOnline};
                        userInterface.__vue__._data.maxOnline=1000;`);
        }

        mp.game.ui.hideHudComponentThisFrame(6);
        mp.game.ui.hideHudComponentThisFrame(7);
        mp.game.ui.hideHudComponentThisFrame(8);
        mp.game.ui.hideHudComponentThisFrame(9);
    });
};
