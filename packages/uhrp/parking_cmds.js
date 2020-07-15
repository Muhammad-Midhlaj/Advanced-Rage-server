module.exports = {
    "parking_create": {
        description: "Create a new parking lot. The position of the blip and the location of the ped is taken from the position of the player (the turn of the body is taken into account)",
        minLevel: 10,
        syntax: "[name]:s",
        handler: (player, args) => {

            DB.Handle.query("INSERT INTO parking_city (name,cords) VALUES (?,?)",
                [args[0], JSON.stringify(player.position)], (e, result) => {
                    DB.Handle.query("SELECT * FROM parking_city WHERE id=?", result.insertId, (e, result) => {
                        if (result.length == 0) return terminal.error(`Error creating parking!`, player);
                        terminal.info(`${player.name} created a parking lot with ID: ${result[0].id}`);
                        const park = mp.loadParking(result[0]);
                        mp.parkings.push(park);
                    });
            });

        }
    },

    "parking_delete": {
        description: "Remove parking",
        minLevel: 10,
        syntax: "[idParking]:n",
        handler: (player, args) => {
            var park = mp.parkings.getBySqlId(args[0]);
            if (!park) return terminal.error(`Parking with ID: ${args[0]} not found!`, player);

            mp.parkings.delete(park, (e) => {
                if (e) return terminal.error(e);
                terminal.info(`${player.name} deleted parking from ID: ${args[0]}`);
            });
        }
    },

    "parking_update": {
        description: "Change parking name and blip position",
        minLevel: 10,
        syntax: "[idParking]:n [newName]:s",
        handler: (player, args) => {
            var park = mp.parkings.getBySqlId(args[0]);
            if (!park) return terminal.error(`Parking with ID: ${args[0]} not found!`, player);

            park.updateParkData(args[1],JSON.stringify(player.position));
            terminal.info(`${player.name} changed parking name # ${args[0]} on "${args[1]}"`);
        }
    },

    "parking_create_slot": {
        description: "Create a parking space. The position is taken only from the player in the car (Put the car as it will spawn)",
        minLevel: 10,
        syntax: "[idParking]:n",
        handler: (player, args) => {
            if (!player.vehicle) return terminal.error(`It is necessary to be in transport (The car should be put as it will spawn)!`, player);
            DB.Handle.query("INSERT INTO parking_city_slots (pid,cords) VALUES (?,?)",
                [args[0], JSON.stringify(player.position)], (e, result) => {
                    DB.Handle.query("SELECT * FROM parking_city_slots WHERE id=?", result.insertId, (e, result) => {
                        if (result.length == 0) return terminal.error(`Error creating parking slot!`, player);
                        terminal.info(`${player.name} created a slot(ID:${result[0].id}) in parking with ID:${args[0]} `);
                        var park = mp.parkings.getBySqlId(args[0]);
                        park.loadSlotData();
                    });
            });

        }
    },

    "parking_delete_slot": {
        description: "Create a parking space. The position is taken only from the player in the car (Put the car as it will spawn)",
        minLevel: 10,
        syntax: "[idSlot]:n",
        handler: (player, args) => {
            DB.Handle.query("SELECT * FROM parking_city_slots WHERE id=?", [args[0]], (e, result) => {
                if (!e) {
                    var park = mp.parkings.getBySqlId(result[0]['pid']);
                    if (!park) return terminal.error(`Parking with ID: ${result[0]['pid']} not found!`, player);

                    park.deleteSlotData(args[0]);
                    terminal.info(`${player.name} removed slot number${args[0]} in parking lot${result[0]['pid']}`);
                } else {
                    return terminal.error(`Parking slot with SlotID: ${args[0]} not found!`, player);
                }
            });
        }
    },

    "parking_update_slot": {
        description: "Change the coordinates of the parking space. The position is taken only from the player in the car (Put the car as it will spawn)",
        minLevel: 10,
        syntax: "[idSlot]:n",
        handler: (player, args) => {
            if (!player.vehicle) return terminal.error(`It is necessary to be in transport (The car should be put as it will spawn)!`, player);
            DB.Handle.query("SELECT * FROM parking_city_slots WHERE id=?", [args[0]], (e, result) => {
                if (!e) {
                    var park = mp.parkings.getBySqlId(result[0]['pid']);
                    if (!park) return terminal.error(`Parking with ID: ${result[0]['pid']} not found!`, player);

                    park.updateSlotData(args[0],JSON.stringify(player.position));
                    terminal.info(`${player.name} changed slot No. coordinates${args[0]} in parking lot${result[0]['pid']}`);
                } else {
                    return terminal.error(`Parking slot with SlotID: ${args[0]} not found!`, player);
                }
            });
        }
    },

    "parking_tp": {
        description: "Teleport to parking.",
        minLevel: 10,
        syntax: "[idSlot]:n",
        handler: (player, args) => {
            var park = mp.parkings.getBySqlId(args[0]);
            if (!park) return terminal.error(`Parking slot with ID: ${args[0]} not found!`, player);
            player.position = park.cords;

            terminal.info(`${player.name} teleported to parking no.${args[0]}`);
            /*
            for (var i in park.slotsData) {
                if(park.slotsData[i].sid===args[0]){
                    player.position = park.slotsData[i].cords;
                    terminal.info(`${player.name} teleported to slot no.${args[0]} in parking lot${result[0]['pid']}`);
                }
            }
            */
        }
    },

    "parking_slot_show": {
        description: "Display markers and sign SlotID slots in the parking lot.",
        minLevel: 10,
        syntax: "[idParking]:n",
        handler: (player, args) => {
            var park = mp.parkings.getBySqlId(args[0]);
            if (!park) return terminal.error(`Parking with ID: ${args[0]} not found!`, player);
            park.showMarker();
        }
    },

    "parking_slot_hide": {
        description: "Remove parking slot markers.",
        minLevel: 10,
        syntax: "[idParking]:n",
        handler: (player, args) => {
            var park = mp.parkings.getBySqlId(args[0]);
            if (!park) return terminal.error(`Parking with ID: ${args[0]} not found!`, player);
            park.hideMarker();
        }
    },
}
