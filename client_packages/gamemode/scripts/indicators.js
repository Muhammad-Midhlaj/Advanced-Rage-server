exports = (menu) => {
    const localPlayer = mp.players.local;
    localPlayer.belt = false;

    mp.keys.bind(100, false, () => { //left
        if (mp.chatActive || mp.consoleActive) return;
        var veh = localPlayer.vehicle;
        if (!veh) return;
        var leftSignal = veh.getVariable(`leftSignal`);
        var rightSignal = veh.getVariable(`rightSignal`);
        var isDriver = veh.getPedInSeat(-1) == localPlayer.handle;

        if ((!leftSignal || !rightSignal) && isDriver && !isFlood()) {
            mp.events.callRemote(`setLeftSignal`, !leftSignal);
        }
    });

    mp.keys.bind(102, false, () => { //right
        if (mp.chatActive || mp.consoleActive) return;
        var veh = localPlayer.vehicle;
        if (!veh) return;
        var leftSignal = veh.getVariable(`leftSignal`);
        var rightSignal = veh.getVariable(`rightSignal`);
        var isDriver = veh.getPedInSeat(-1) == localPlayer.handle;

        if ((!leftSignal || !rightSignal) && isDriver && !isFlood()) {
            mp.events.callRemote(`setRightSignal`, !rightSignal);
        }
    });

    mp.keys.bind(101, false, () => { //emergency
        if (mp.chatActive || mp.consoleActive) return;
        var veh = localPlayer.vehicle;
        if (!veh) return;
        var leftSignal = veh.getVariable(`leftSignal`);
        var rightSignal = veh.getVariable(`rightSignal`);
        var isDriver = veh.getPedInSeat(-1) == localPlayer.handle;
        if (!isDriver || isFlood()) return;

        if (leftSignal && rightSignal) {
            mp.events.callRemote(`setEmergencySignal`, false);
        } else {
            mp.events.callRemote(`setEmergencySignal`, true);
        }
    });

    mp.keys.bind(66, false, () => { //safety belt
        if (mp.chatActive || mp.consoleActive) return;
        var veh = localPlayer.vehicle;
        if (!veh) return;
        var isDriver = veh.getPedInSeat(-1) == localPlayer.handle;
        if (!isDriver || isFlood()) return;

        localPlayer.belt = !localPlayer.belt;
        mp.events.callRemote(`belt.putOn`, localPlayer.belt);
        menu.execute(`mp.events.call('carSystem', { belt: ${!localPlayer.belt}, event: 'BeltHandler' })`);
    });

    mp.keys.bind(89, false, () => { // Y (sirens sound)
        if (mp.chatActive || mp.consoleActive) return;
        var veh = localPlayer.vehicle;
        if (!veh) return;
        var isDriver = veh.getPedInSeat(-1) == localPlayer.handle;
        if (!isDriver || veh.getClass() != 18 || isFlood()) return;

        var sirenSound = (veh.hasVariable("sirenSound")) ? veh.getVariable("sirenSound") : false;

        mp.events.callRemote(`sirenSound.on`);
    });
}
