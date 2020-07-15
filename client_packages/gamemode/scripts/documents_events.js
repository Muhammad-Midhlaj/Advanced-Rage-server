exports = (menu) => {

    mp.events.add("setDocumentsActive", (enable) => {
        mp.documentsActive = enable;
    });

    mp.events.add("documents.showAll", (data) => {
        // debug(`documents.showAll: ${JSON.stringify(data)}`);
        data.houses = convertDocHousesToStreets(data.houses);
        menu.execute(`documentsAPI.showAll('true', '${JSON.stringify(data)}')`);
    });

    mp.events.add("documents.showPassport", (data) => {
        menu.execute(`documentsAPI.showPassport('true', '${JSON.stringify(data)}')`);
    });

    mp.events.add("documents.showLicenses", (data) => {
        menu.execute(`documentsAPI.showLicenses('true', '${JSON.stringify(data)}')`);
    });

    mp.events.add("documents.showWeapon", (data) => {
        menu.execute(`documentsAPI.showWeapon('true', '${JSON.stringify(data)}')`);
    });

    mp.events.add("documents.showWork", (data) => {
        menu.execute(`documentsAPI.showWork('true', '${JSON.stringify(data)}')`);
    });

    mp.events.add("documents.showFaction", (data) => {
        if (data.faction == 2 || data.faction == 3) {
            menu.execute(`policeSendData('${JSON.stringify(data)}')`);
        } else if (data.faction == 4) {
            menu.execute(`documentsAPI.showFib(true, '${JSON.stringify(data)}')`);
        } else if (data.faction == 6 || data.faction == 7) {
            menu.execute(`documentsAPI.showArmy(true, '${JSON.stringify(data)}')`);
        } else if (data.faction == 5) {
            menu.execute(`mp.events.call('documents', { medic: ${JSON.stringify(data)}, event: 'medic' })`);
        }
    });
}

function convertDocHousesToStreets(houses) {
    for (var i = 0; i < houses.length; i++) {
        houses[i] = ` ${getStreetName(houses[i].position)}, №${houses[i].id}`;
    }
    return houses;
}
