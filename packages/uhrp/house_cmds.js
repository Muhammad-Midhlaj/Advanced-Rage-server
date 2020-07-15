module.exports = {
    "create_house": {
        description: "Create a new home. Position exit from the house is taken according to the position of the player (do not forget about turning the torso, so that the player looked away from the door).",
        minLevel: 5,
        syntax: "[interior]:n [garage]:n [price]:n [class]:n",
        handler: (player, args) => {
            var pos = player.position;

            DB.Handle.query("SELECT id FROM houses WHERE closed=?", [-1], (e, result) => {
                if (result.length == 0) {
                    DB.Handle.query("INSERT INTO houses (interior,garage,x,y,z,h,price,class) VALUES (?,?,?,?,?,?,?,?)",
                        [args[0], args[1], pos["x"], pos["y"], pos["z"], player.heading, args[2], args[3]], (e, result) => {
                            DB.Handle.query("SELECT * FROM houses WHERE id=?", result.insertId, (e, result) => {
                                if (result.length == 0) return terminal.error(`Failed to create a house!`, player);
                                mp.houses.push(mp.createHouseMarker(result[0]));
                                terminal.info(`${player.name} created a house with ID: ${result[0].id}`);
                            });
                        });
                } else {
                    var sqlId = result[0].id;
                    DB.Handle.query("UPDATE houses SET interior=?,balance=?,garage=?,cars=?,x=?,y=?,z=?,h=?,vehX=?,vehY=?,vehZ=?,vehH=?,garageX=?,garageY=?,garageZ=?,garageH=?,owner=?,ownerName=?,closed=?,garageClosed=?,price=?,class=? WHERE id=?",
                        [args[0], 1000, args[1], '[]', pos.x, pos.y, pos.z, player.heading, 0, 0, 0, 0, 0, 0, 0, 0, 0, '', 0, 0, args[2], args[3], sqlId], () => {
                            DB.Handle.query("SELECT * FROM houses WHERE id=?", sqlId, (e, result) => {
                                if (result.length == 0) return terminal.error(`Failed to create a house!`, player);
                                mp.houses.push(mp.createHouseMarker(result[0]));
                                terminal.info(`${player.name} created a house with ID: ${result[0].id}`);
                            });
                        });
                }
            });
        }
    },
    "delete_house": {
        description: "Remove home.",
        minLevel: 5,
        syntax: "[houseId]:n",
        handler: (player, args) => {
            var house = mp.houses.getBySqlId(args[0]);
            if (!house) return terminal.error(`House with ID: ${args[0]} not found!`, player);

            mp.houses.delete(house, (e) => {
                if (e) return terminal.error(e);
                terminal.info(`${player.name} deleted house with ID: ${args[0]}`);
            });
        }
    },
    "set_house_interior": {
        description: "Change the interior of the house.",
        minLevel: 4,
        syntax: "[houseId]:n [interior]:n",
        handler: (player, args) => {
            var house = mp.houses.getBySqlId(args[0]);
            if (!house) return terminal.error(`House with ID: ${args[0]} not found!`, player);
            terminal.info(`${player.name} changed the interior ${house.interior}=>${args[1]} at home with ID: ${house.sqlId}`);
            house.setInterior(args[1]);
        },
    },
    "set_house_position": {
        description: "Change home position.",
        minLevel: 4,
        syntax: "[houseId]:n",
        handler: (player, args) => {
            var pos = player.position;
            var house = mp.houses.getBySqlId(args[0]);
            if (!house) return terminal.error(`House with ID: ${args[0]} not found!`, player);
            terminal.info(`${player.name} changed position at home with ID: ${house.sqlId}`);
            house.changeCoord(pos);
        },
    },
    "set_house_price": {
        description: "Change the price of the house.",
        minLevel: 4,
        syntax: "[houseId]:n [price]:n",
        handler: (player, args) => {
            var house = mp.houses.getBySqlId(args[0]);
            if (!house) return terminal.error(`House with ID: ${args[0]} not found!`, player);
            terminal.info(`${player.name} changed the price ${house.price}$=>${args[1]}$ at home with ID: ${house.sqlId}`);
            house.setPrice(args[1]);
        },
    },
    "set_house_class": {
        description: "Change home class. Classes: A,B,C,D,E,F.",
        minLevel: 4,
        syntax: "[houseId]:n [class]:s",
        handler: (player, args) => {
            var house = mp.houses.getBySqlId(args[0]);
            if (!house) return terminal.error(`House with ID: ${args[0]} not found!`, player);
            var classes = ["A", "B", "C", "D", "E", "F"];
            if (classes.indexOf(args[1]) == -1) return terminal.error(`Class ${args[1]} incorrect!`, player);


            terminal.info(`${player.name} changed class ${classes[house.class - 1]}=>${args[1]} at home with ID: ${house.sqlId}`);
            house.setClass(classes.indexOf(args[1]) + 1);
        }
    },
    "set_house_owner": {
        description: "Change home owner.",
        minLevel: 4,
        syntax: "[houseId]:n [playerName]:s [playerSecondName]:s",
        handler: (player, args) => {
            var house = mp.houses.getBySqlId(args[0]);
            if (!house) return terminal.error(`House with ID: ${args[0]} not found!`, player);
            var fullName = args[1] + " " + args[2];
            DB.Handle.query(`SELECT id FROM characters WHERE name=?`, [fullName], (e, result) => {
                if (result.length == 0) return terminal.error(`Character <b>${fullName}</b> not found!`, player);
                var str = (house.owner == 0) ? fullName : `${house.ownerName}=>${fullName}`;
                terminal.info(`${player.name} changed owner ${str} at home with ID: ${house.sqlId}`);
                house.setOwner(result[0].id, fullName);
            });
        }
    },
    "set_house_garage": {
        description: "Change the garage at home.",
        minLevel: 4,
        syntax: "[houseId]:n [garage]:n",
        handler: (player, args) => {
            var house = mp.houses.getBySqlId(args[0]);
            if (!house) return terminal.error(`House with ID: ${args[0]} not found!`, player);

            terminal.info(`${player.name} changed the garage ${house.garage}=>${args[1]} at home with ID: ${house.sqlId}`);
            house.setGarage(args[1]);
        }
    },
    "set_house_vehspawn": {
        description: "Set the position of the car spawn when leaving the garage. Installation takes place according to the position of the car in which the player is located..",
        minLevel: 4,
        syntax: "[houseId]:n",
        handler: (player, args) => {
            if (!player.vehicle) return terminal.error(`You are not in the car!`, player);
            var house = mp.houses.getBySqlId(args[0]);
            if (!house) return terminal.error(`House with ID: ${args[0]} not found!`, player);
            var pos = player.vehicle.position;
            pos.h = player.vehicle.rotation.z;

            terminal.info(`${player.name} set the position of the car spawn at home with ID: ${house.sqlId}`);
            house.setVehSpawn(pos);
        }
    },
    "set_house_garageenter": {
        description: "Set the position of the entrance to the garage from the street. Installation takes place according to the player’s position.",
        minLevel: 4,
        syntax: "[houseId]:n",
        handler: (player, args) => {
            var house = mp.houses.getBySqlId(args[0]);
            if (!house) return terminal.error(`House with ID: ${args[0]} not found!`, player);
            var pos = player.position;
            pos.h = player.heading;

            terminal.info(`${player.name} изменил позицию входа в гараж с улицы для дома с ID: ${house.sqlId}`);
            house.setGarageEnter(pos);
        }
    },
    "set_interior_spawn": {
        description: "Set the position of the spawn in the interior. Installation takes place according to the player’s position.",
        minLevel: 5,
        syntax: "[interiorId]:n",
        handler: (player, args) => {
            var interior = mp.interiors.getBySqlId(args[0]);
            if (!interior) return terminal.error(`Interior with ID: ${args[0]} not found!`, player);
            var pos = player.position;
            pos.h = player.heading;

            terminal.info(`${player.name} changed the position of spawn in the interior with ID: ${interior.id}`);
            interior.setSpawn(pos);
        }
    },
    "set_interior_enter": {
        description: "Set the entry position from the interior to the garage. Installation takes place on the interior.",
        minLevel: 5,
        syntax: "[interiorId]:n",
        handler: (player, args) => {
            var interior = mp.interiors.getBySqlId(args[0]);
            if (!interior) return terminal.error(`Interior with ID: ${args[0]} not found!`, player);
            var pos = player.position;
            pos.h = player.heading;

            terminal.info(`${player.name} changed the position of the entrance to the interior with ID: ${interior.id}`);
            interior.setEnter(pos);
        }
    },
    "set_interior_garage": {
        description: "Install the interior in the garage. Installation takes place on the interior.",
        minLevel: 5,
        syntax: "[interiorId]:n",
        handler: (player, args) => {
            var interior = mp.interiors.getBySqlId(args[0]);
            if (!interior) return terminal.error(`Interior with ID: ${args[0]} not found!`, player);
            var pos = player.position;
            pos.h = player.heading;

            terminal.info(`${player.name} changed the position of the entrance to the garage in the interior with ID: ${interior.id}`);
            interior.setGarage(pos);
        }
    },
    "set_interior_rooms": {
        description: "Set the number of rooms in the interior.",
        minLevel: 5,
        syntax: "[interiorId]:n [rooms]:n",
        handler: (player, args) => {
            var interior = mp.interiors.getBySqlId(args[0]);
            if (!interior) return terminal.error(`Interior with ID: ${args[0]} not found!`, player);

            terminal.info(`${player.name} changed the number of rooms in the interior with ID: ${interior.id}`);
            interior.setRooms(args[1]);
        }
    },
    "set_interior_square": {
        description: "Set the area near the interior.",
        minLevel: 5,
        syntax: "[interiorId]:n [square]:n",
        handler: (player, args) => {
            var interior = mp.interiors.getBySqlId(args[0]);
            if (!interior) return terminal.error(`Interior with ID: ${args[0]} not found!`, player);

            terminal.info(`${player.name} changed the area in the interior with ID: ${interior.id}`);
            interior.setSquare(args[1]);
        }
    },
    "set_garage_enter": {
        description: "Set the entry position to the garage. Installation takes place according to the player’s position.",
        minLevel: 5,
        syntax: "[garageId]:n",
        handler: (player, args) => {
            var garage = mp.garages.getBySqlId(args[0]);
            if (!garage) return terminal.error(`Garage with ID: ${args[0]} not found!`, player);
            var pos = player.position;
            pos.h = player.heading;

            terminal.info(`${player.name} changed the entry position to the garage with ID: ${garage.id}`);
            garage.setEnter(pos);
        }
    },
    "tp_house": {
        description: "Teleport at home.",
        minLevel: 3,
        syntax: "[houseId]:n",
        handler: (player, args) => {
            var house = mp.houses.getBySqlId(args[0]);
            if (!house) return terminal.error(`House with ID: ${args[0]} not found!`, player);
            var pos = house.position;
            pos.z++;
            player.position = pos;
            terminal.info(`You teleported in the house with ID: ${args[0]}`, player);
        }
    },
}
