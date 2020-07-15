module.exports = {
    "factions_list": {
        description: "View the list of organizations.",
        minLevel: 5,
        syntax: "",
        handler: (player) => {
            var text = "ID) Name (Leader) [product] [color blip]<br/>";
            for (var i = 0; i < mp.factions.length; i++) {
                var faction = mp.factions[i];
                text += `${faction.sqlId}) ${faction.name} (${faction.leaderName}) [${faction.products}/${faction.maxProducts} ед.] [${faction.blip.color}] <br/>`;
            }

            terminal.log(text, player);
        }
    },
    "set_faction_name": {
        description: "Change organization name.",
        minLevel: 5,
        syntax: "[organization_id]:n [name]:s",
        handler: (player, args) => {
            var faction = mp.factions.getBySqlId(args[0]);
            if (!faction) return terminal.error(`Organization with ID: ${args[0]} not found!`, player);

            terminal.info(`${player.name} changed the name of the organization with ID: ${args[0]}!`);
            args.splice(0, 1);
            faction.setName(args.join(" ").trim());
        }
    },
    "set_faction_leader": {
        description: "Change the leader of the organization. Use nonexistent nickname to remove owner.",
        minLevel: 5,
        syntax: "[organization_id]:n [name]:s [surname]:s",
        handler: (player, args) => {
            var faction = mp.factions.getBySqlId(args[0]);
            if (!faction) return terminal.error(`Organization with ID: ${args[0]} not found!`, player);

            var name = `${args[1]} ${args[2]}`;
            DB.Characters.getSqlIdByName(name, (sqlId) => {
                //if (!sqlId) return terminal.error(`Character named ${name} not found!`, player);

                faction.setLeader(sqlId, name);
                if (sqlId) {
                    terminal.info(`${player.name} changed the owner of the organization ${faction.name}`);
                    var rec = mp.players.getBySqlId(sqlId);
                    if (rec) {
                        rec.utils.info(`${player.name} appointed you leader ${faction.name}`);
                    }
                } else terminal.info(`${player.name} removed owner from organization ${faction.name}`);
            });
        }
    },
    "set_faction_products": {
        description: "Change the quantity of goods in the organization's warehouse.",
        minLevel: 5,
        syntax: "[organization_id]:n [product]:n",
        handler: (player, args) => {
            var faction = mp.factions.getBySqlId(args[0]);
            if (!faction) return terminal.error(`Organization with ID: ${args[0]} not found!`, player);

            faction.setProducts(args[1]);
            terminal.info(`${player.name} changed the amount of goods from the organization with ID: ${args[0]}`);
        }
    },
    "set_faction_maxproducts": {
        description: "Change the capacity of the goods in the warehouse of the organization.",
        minLevel: 5,
        syntax: "[organization_id]:n [capacity]:n",
        handler: (player, args) => {
            var faction = mp.factions.getBySqlId(args[0]);
            if (!faction) return terminal.error(`Organization with ID: ${args[0]} not found!`, player);

            faction.setMaxProducts(args[1]);
            terminal.info(`${player.name} changed the warehouse capacity of the organization with ID: ${args[0]}`);
        }
    },
    "set_faction_blipcolor": {
        description: "Change the color of the blip on the map of the organization.",
        minLevel: 5,
        syntax: "[organization_id]:n [цвет_блипа]:n",
        handler: (player, args) => {
            var faction = mp.factions.getBySqlId(args[0]);
            if (!faction) return terminal.error(`Organization with ID: ${args[0]} not found!`, player);

            faction.setBlipColor(args[1]);
            terminal.info(`${player.name} changed the color of the blip at the organization with ID: ${args[0]}`);
        }
    },

    "set_faction_position": {
        description: "Change the position of the organization. Position is taken from player..",
        minLevel: 5,
        syntax: "[organization_id]:n",
        handler: (player, args) => {
            var faction = mp.factions.getBySqlId(args[0]);
            if (!faction) return terminal.error(`Organization with ID: ${args[0]} not found!`, player);

            faction.setPosition(player.position, player.heading);
            terminal.info(`${player.name} changed the organization’s position with ID: ${args[0]}`);
        }
    },

    "set_faction_warehouse": {
        description: "Change the position of the organization's warehouse. Position is taken from player..",
        minLevel: 5,
        syntax: "[organization_id]:n",
        handler: (player, args) => {
            var faction = mp.factions.getBySqlId(args[0]);
            if (!faction) return terminal.error(`Organization with ID: ${args[0]} not found!`, player);

            faction.setWarehousePosition(player.position);
            terminal.info(`${player.name} changed the position of the warehouse at the organization with ID: ${args[0]}`);
        }
    },

    "set_faction_storage": {
        description: "Change the position of issuing items of the organization. Position is taken from player..",
        minLevel: 5,
        syntax: "[organization_id]:n",
        handler: (player, args) => {
            var faction = mp.factions.getBySqlId(args[0]);
            if (!faction) return terminal.error(`Organization with ID: ${args[0]} not found!`, player);

            faction.setStoragePosition(player.position);
            terminal.info(`${player.name} changed the position of issuing items from the organization with ID: ${args[0]}`);
        }
    },

    "tp_faction": {
        description: "Teleport to organization.",
        minLevel: 3,
        syntax: "[organization_id]:n",
        handler: (player, args) => {
            var faction = mp.factions.getBySqlId(args[0]);
            if (!faction) return terminal.error(`Organization with ID: ${args[0]} not found!`, player);
            var pos = faction.position;
            pos.z++;
            player.position = pos;
            terminal.info(`You teleported to the organization with ID: ${args[0]}`, player);
        }
    },

    "set_faction_rankname": {
        description: "Change rank name.",
        minLevel: 5,
        syntax: "[organization_id]:n [id_rank]:n [title]:s",
        handler: (player, args) => {
            var faction = mp.factions.getBySqlId(args[0]);
            if (!faction) return terminal.error(`Organization with ID: ${args[0]} not found!`, player);

            var factionId = args[0];
            var rank = args[1];

            args.splice(0, 2);
            mp.factions.setRankName(factionId, rank, args.join(" ").trim());
            terminal.info(`${player.name} changed the rank name of the organization with ID: ${factionId}`);
        }
    },

    "set_faction_rankpay": {
        description: "Change salary rank.",
        minLevel: 5,
        syntax: "[organization_id]:n [id_rank]:n [price]:n",
        handler: (player, args) => {
            var faction = mp.factions.getBySqlId(args[0]);
            if (!faction) return terminal.error(`Organization with ID: ${args[0]} not found!`, player);

            mp.factions.setRankPay(args[0], args[1], args[2]);
            terminal.info(`${player.name} changed the salary rank of the organization with ID: ${args[0]}`);
        }
    },

    "ranks_list": {
        description: "Get a list of ranks for the faction.",
        minLevel: 5,
        syntax: "[organization_id]:n",
        handler: (player, args) => {
            var faction = mp.factions.getBySqlId(args[0]);
            if (!faction) return terminal.error(`Organization with ID: ${args[0]} not found!`, player);

            var text = `Organization ${faction.name}:<br/>`;
            var ranks = mp.factionRanks[faction.sqlId];
            for (var i = 1; i <= ranks.length - 1; i++) text += `${i}) ${ranks[i].name} - ${ranks[i].pay}$<br/>`;

            terminal.log(text, player);
        }
    },

    "add_faction_veh": {
        description: "Add / update organization's car (color2 must be specified until RAGEMP is fixed).",
        minLevel: 5,
        syntax: "[organization_id]:n [color2]:n",
        handler: (player, args) => {
            var faction = mp.factions.getBySqlId(args[0]);
            if (!faction) return terminal.error(`Organization with ID: ${args[0]} not found!`, player);

            var newVehicle = player.vehicle;
            if (!newVehicle) return terminal.error(`You are not in the car!`, player);

            if (newVehicle.sqlId) {
                if (mp.isOwnerVehicle(newVehicle)) return player.utils.error(`This is a private car!`);
                DB.Handle.query("UPDATE vehicles SET owner=?,model=?,color1=?,color2=?,x=?,y=?,z=?,h=? WHERE id=?",
                    [args[0], newVehicle.name, newVehicle.getColor(0), args[1],
                        newVehicle.position.x, newVehicle.position.y, newVehicle.position.z, newVehicle.rotation.z, newVehicle.sqlId
                    ], (e) => {
                        terminal.info(`${player.name} updated auto organization ${faction.name}`, player);
                    });
            } else {
                DB.Handle.query("INSERT INTO vehicles (owner,model,color1,color2,x,y,z,h) VALUES (?,?,?,?,?,?,?,?)",
                    [args[0], newVehicle.name, newVehicle.getColor(0), newVehicle.getColor(1),
                        newVehicle.position.x, newVehicle.position.y, newVehicle.position.z,
                        newVehicle.rotation.z
                    ], (e, result) => {
                        newVehicle.sqlId = result.insertId;
                        terminal.info(`${player.name} added car for organization ${faction.name}`);
                    });
            }
            newVehicle.owner = args[0];
            newVehicle.spawnPos = newVehicle.position;
        }
    },

    "set_faction_veh_rank": {
        description: "Add / update min. rank for access to auto organization.",
        minLevel: 5,
        syntax: "[rank]:n",
        handler: (player, args) => {
            var faction = mp.factions.getBySqlId(args[0]);
            if (!faction) return terminal.error(`Organization with ID: ${args[0]} not found!`, player);
            var newVehicle = player.vehicle;
            if (!newVehicle) return terminal.error(`You are not in the car!`, player);
            if (!newVehicle.sqlId || !mp.isFactionVehicle(newVehicle)) return player.utils.error(`Auto does not belong to the organization!`);
            var rank = mp.factionRanks[newVehicle.owner][args[0]];
            if (!rank) return player.utils.error(`Invalid rank!`);
            newVehicle.dbData.rank = args[0];

            DB.Handle.query("UPDATE vehicles SET data=? WHERE id=?",
                [JSON.stringify(newVehicle.dbData), newVehicle.sqlId], (e) => {
                    terminal.info(`${player.name} updated min. auto organization rank ${faction.name} on ${rank.name}`, player);
                });
        }
    },

    "uval": {
        description: "Dismiss a player from the organization.",
        minLevel: 3,
        syntax: "[player id]:n",
        handler: (player, args) => {
            var rec = mp.players.at(args[0]);
            if (!rec) return terminal.error(`Player with ID: ${args[0]} not found!`, player);
            if (!rec.faction) return terminal.error(`${rec.name} not affiliated!`);
            var faction = mp.factions.getBySqlId(rec.faction);
            if (rec.rank == mp.factionRanks[rec.faction].length) {
                faction.setLeader(0);
                rec.utils.info(`${player.name} removed you from the leader ${faction.name}`);
                terminal.info(`${player.name} stripped off ${rec.name} from leaderboard ${faction.name}`);
            } else {
                rec.utils.setFaction(0);
                rec.utils.info(`${player.name} fired you from ${faction.name}`);
                terminal.info(`${player.name} laid off ${rec.name} from the organization ${faction.name}`);
            }
        }
    },

    "clear_faction_items": {
        description: "Remove inventory items from the organization belonging to the player from the server.",
        minLevel: 5,
        syntax: "[player_id]:n [organization_id]:n",
        handler: (player, args) => {
            var rec = mp.players.at(args[0]);
            if (!rec) return terminal.error(`Player with ID: ${args[0]} not found!`, player);
            args[1] = Math.clamp(args[1], 0, mp.factions.length - 1);

            mp.fullDeleteItemsByFaction(rec.sqlId, args[1]);
        }
    },

}
