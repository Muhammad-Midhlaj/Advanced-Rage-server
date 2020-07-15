exports = (menu) => {
    const bigmap = [];

    bigmap.status = 0;
    bigmap.timer = null;

    mp.game.ui.setRadarZoom(1.0);
    mp.game.ui.setRadarBigmapEnabled(false, false);

    mp.events.add('render', () => {
        if (mp.chatActive || mp.consoleActive || mp.inventoryActive || mp.tradeActive || mp.playerMenuActive) return;

        mp.game.controls.disableControlAction(0, 48, true);
        if (mp.game.controls.isDisabledControlJustPressed(0, 48)) {
            if (bigmap.status === 0) {
                mp.game.ui.setRadarZoom(0.0);
                bigmap.status = 1;

                bigmap.timer = setTimeout(() => {
                    mp.game.ui.setRadarBigmapEnabled(false, true);
                    mp.game.ui.setRadarZoom(1.0);

                    bigmap.status = 0;
                    bigmap.timer = null;
                }, 10000);
            } else if (bigmap.status === 1) {
                if (bigmap.timer != null) {
                    clearTimeout(bigmap.timer);
                    bigmap.timer = null;
                }

                mp.game.ui.setRadarBigmapEnabled(true, false);
                mp.game.ui.setRadarZoom(0.0);
                bigmap.status = 2;

                menu.execute('mapAPI.on()');

                bigmap.timer = setTimeout(() => {
                    mp.game.ui.setRadarBigmapEnabled(false, true);
                    mp.game.ui.setRadarZoom(1.0);

                    bigmap.status = 0;
                    bigmap.timer = null;

                    menu.execute('mapAPI.off()');
                }, 10000);
            } else {
                if (bigmap.timer != null) {
                    clearTimeout(bigmap.timer);
                    bigmap.timer = null;
                }

                mp.game.ui.setRadarBigmapEnabled(false, false);
                mp.game.ui.setRadarZoom(1.0);
                bigmap.status = 0;

                menu.execute('mapAPI.off()');
            }
        }
    });
};