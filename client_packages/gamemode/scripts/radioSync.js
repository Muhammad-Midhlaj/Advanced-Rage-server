var radioTimerId;

mp.events.add('playerEnterVehicle', (vehicle, seat) => {
    radioTimerId = setInterval(() => {
        radio_sync();
    }, 1000);
});

mp.events.add('playerLeaveVehicle', () => {
    clearInterval(radioTimerId);
});

function radio_sync() {
    var player = mp.players.local;
    var radio_index;
    if (player.vehicle) {
        if (!player.vehicle.radio) {
            radio_index = 0;
        } else {
            radio_index = player.vehicle.radio;
        }

        if (player.vehicle && player.vehicle.getPedInSeat(-1) === player.handle) {
            if (radio_index != mp.game.invoke("0xE8AF77C4C06ADC93")) {
                radio_index = mp.game.invoke("0xE8AF77C4C06ADC93");
                mp.events.callRemote('radio.set', radio_index);
            }
        } else {
            if (radio_index == 255) {
                mp.game.audio.setRadioToStationName("OFF");
            } else {
                mp.game.invoke("0xF7F26C6E9CC9EBB8", true);
                mp.game.invoke("0xA619B168B8A8570F ", radio_index);
            }
        }
    }
};
