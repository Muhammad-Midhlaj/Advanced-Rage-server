exports = (menu) => {
    var safeZone = null;
    var warningMessage = false;

    mp.events.add('render', () => {
        if (menu) {

            // Система безопасной зоны на CEF
            var lastsafezone = mp.game.graphics.getSafeZoneSize();
            var screen = mp.game.graphics.getScreenActiveResolution(0, 0);
            if (lastsafezone != safeZone) {
                safeZone = lastsafezone;
                menu.execute("safeZone.update(" + screen.x + "," + screen.y + "," + safeZone + ")");
            }

            // Временное решения для отключения отображения CEF, поверх warning screen (Прим: Exit из игры)
            /*var warningMessageActive = mp.game.invoke("0xE18B138FABC53103");
            if (!warningMessage && warningMessageActive)
            {
                  warningMessage = true;
                  menu.execute("browser._data.render = false");
            }
            else if (warningMessage && !warningMessageActive)
            {
                  warningMessage = false;
                  menu.execute("browser._data.render = true");
            }*/
        }
    });
}
