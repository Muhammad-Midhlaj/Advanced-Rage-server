module.exports = {
    "add_routep": {
        description: "Add a route point.",
        minLevel: 2,
        syntax: "[name]:s [type]:n",
        handler: (player, args) => {
            if ((args[1] ^ 0) !== args[1]) return terminal.error(`Option [type] should be a whole number!`, player);

            var lastStep = -1;
            mp.routeps.forEach((routep) => {
                if (routep.type == args[1] && routep.step > lastStep)
                    lastStep = routep.step;
            });

            var pos = player.position;

            DB.Handle.query("INSERT INTO routeps (name, type, step, data, x, y, z) VALUES (?,?,?,?,?,?,?)",
                [args[0], args[1], lastStep + 1, JSON.stringify({}), pos.x, pos.y, pos.z - 1], (e, result) => {

                    var routep = {
                        id: result.insertId,
                        name: args[0],
                        type: args[1],
                        step: lastStep + 1,
                        data: {},
                        x: pos.x,
                        y: pos.y,
                        z: pos.z - 1,
                    }

                    mp.routeps.push(routep);

                    var colshape = mp.colshapes.newCircle(pos.x, pos.y, 3, 0);
                    colshape.routep = routep;

                    terminal.info(`${player.name} created a point with ID: ${result.insertId} On the route: ${args[1]}`);

                    var route = mp.routeps.getRoute(args[1]);
                    player.debugRoute = args[1];
                    mp.players.forEach((recipient) => {
                        if (recipient.debugRoute == args[1]) {
                            recipient.call("checkpoints.create", [route]);
                        }
                    });
                    //terminal.info(mp.routeps);
                });
        }
    },

    "delete_routep": {
        description: "Remove the route point.",
        minLevel: 2,
        syntax: "[routepId]:n",
        handler: (player, args) => {
            if ((args[0] ^ 0) !== args[0]) return terminal.error(`Option [id] should be a whole number!`, player);

            var routep = mp.routeps.getBySqlId(args[0]);
            var type = routep.type;
            if (!routep) return terminal.error(`Point with ID: ${args[0]} Not found`, player);

            mp.routeps.delete(routep, (e) => {
                if (e) return terminal.error(e, player);
                terminal.info(`${player.name} deleted the point from ID: ${args[0]}`);
            });

            var route = mp.routeps.getRoute(type);

            player.debugRoute = type;
            mp.players.forEach((recipient) => {
                if (recipient.debugRoute == type) {
                    recipient.call("checkpoints.create", [route]);
                }
            });
            //terminal.info(mp.routeps);
        }
    },

    "set_step_routep": {
        description: "Change the order number of the point",
        minLevel: 2,
        syntax: "[routepId]:n [step]:n",
        handler: (player, args) => {
            mp.routeps.updateStep(args[0], args[1], (e, type) => {
                if (e) return terminal.error(e, player);

                var route = mp.routeps.getRoute(type);
                player.debugRoute = type;
                mp.players.forEach((recipient) => {
                    if (recipient.debugRoute == type) {
                        recipient.call("checkpoints.create", [route]);
                    }
                });
                terminal.info(`${player.name} at the point with ID: ${args[0]} Changed step: ${args[1]}`);
            });
        }
    },

    "set_name_routep": {
        description: "Change the name of the point",
        minLevel: 2,
        syntax: "[routepId]:n [name]:s",
        handler: (player, args) => {
            mp.routeps.updateName(args[0], args[1], (e, type) => {
                if (e) return terminal.error(e, player);

                var route = mp.routeps.getRoute(type);
                player.debugRoute = type;
                mp.players.forEach((recipient) => {
                    if (recipient.debugRoute == type) {
                        recipient.call("checkpoints.create", [route]);
                    }
                });
                terminal.info(`${player.name} at the point with ID: ${args[0]} Changed name: ${args[1]}`);
            });
        }
    },

    "set_type_routep": {
        description: "Change the type (route number) of the point",
        minLevel: 2,
        syntax: "[routepId]:n [type]:n",
        handler: (player, args) => {
            mp.routeps.updateType(args[0], args[1], (e) => {
                if (e) return terminal.error(e, player);

                var route = mp.routeps.getRoute(args[1]);
                player.debugRoute = args[1];
                mp.players.forEach((recipient) => {
                    if (recipient.debugRoute == args[1]) {
                        recipient.call("checkpoints.create", [route]);
                    }
                });
                terminal.info(`${player.name} at the point with ID: ${args[0]} Changed type: ${args[1]}`);
            });
        }
    },

    "set_pos_routep": {
        description: "Change the position of the point",
        minLevel: 2,
        syntax: "[routepId]:n [x]:n [y]:n [z]:n",
        handler: (player, args) => {
            mp.routeps.updatePosition(args[0], args[1], args[2], args[3], (e, type) => {
                if (e) return terminal.error(e, player);

                var route = mp.routeps.getRoute(type);
                player.debugRoute = type;
                mp.players.forEach((recipient) => {
                    if (recipient.debugRoute == type) {
                        recipient.call("checkpoints.create", [route]);
                    }
                });
                terminal.info(`${player.name} at the point with ID: ${args[0]} changed the position`);
            });
        }
    },

    "set_station_routep": {
        description: "Change the position of the point",
        minLevel: 2,
        syntax: "[routepId]:n",
        handler: (player, args) => {
            mp.routeps.setStation(args[0], (e, type) => {
                if (e) return terminal.error(e, player);

                var route = mp.routeps.getRoute(type);
                player.debugRoute = type;
                mp.players.forEach((recipient) => {
                    if (recipient.debugRoute == type) {
                        recipient.call("checkpoints.create", [route]);
                    }
                });
                terminal.info(`${player.name} made a point with ID: ${args[0]} Stop`);
            });
        }
    },

    "show_route": {
        description: "Show the route in full.",
        minLevel: 2,
        syntax: "[playerId]:n [routeType]:n",
        handler: (player, args) => {
            if ((args[0] ^ 0) !== args[0]) return terminal.error(`Option [playerId] should be a whole number!`, player);
            if ((args[1] ^ 0) !== args[1]) return terminal.error(`Option [routeType] should be a whole number!`, player);

            var recipient = mp.players.at(args[0]);
            if (!recipient) return terminal.error(`Player with ID: ${args[0]} Not found!`);

            var route = mp.routeps.getRoute(args[1]);

            if (!route[0]) return terminal.error(`Route with TYPE: ${args[1]} doesn't exist!`);

            recipient.debugRoute = args[1];

            recipient.call("checkpoints.create", [route]);
            terminal.info(`${player.name} follows the route with TYPE: ${args[1]}`);
        }
    },

    "hide_route": {
        description: "Hide the route.",
        minLevel: 2,
        syntax: "[playerId]:n",
        handler: (player, args) => {
            if ((args[0] ^ 0) !== args[0]) return terminal.error(`Option [playerId] should be a whole number!`, player);

            var recipient = mp.players.at(args[0]);
            if (!recipient) return terminal.error(`Player with ID: ${args[0]} Not found!`);

            recipient.call("checkpoints.create", [
                []
            ]);

            terminal.info(`${player.name} now does not follow the route with TYPE: ${recipient.debugRoute}`);
            recipient.debugRoute = null;
        }
    },

    "start_route": {
        description: "Start Route.",
        minLevel: 2,
        syntax: "[playerId]:n [routeType]:n",
        handler: (player, args) => {
            var recipient = mp.players.at(args[0]);
            recipient.route = mp.routeps.getRoute(args[1]);

            recipient.currentRoutepIndex = 0;
            var direction = (player.route[1]) ? new mp.Vector3(player.route[1].x, player.route[1].y, player.route[1].z, ) : null;

            recipient.call("checkpoint.create", [recipient.route[0], direction]);
        }
    }
}
