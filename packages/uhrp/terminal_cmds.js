const whitelist = require("./modules/whitelist");
const i18n = require("./modules/uI18n");
module.exports = {
    "veh": {
        description: "Create a car.",
        minLevel: 3,
        syntax: "[model]:s",
        handler: (player, args) => {
            var pos = player.position;
            pos.x += 2.0;

            //var hashes = require(`./vehicle_hashes.js`);
            //var model = hashes[args[0]];
            var model = args[0];
            delete hashes;
            if (!model) return terminal.error(`Model ${args[0]} not found!<br/>Notify the project team, if you are not mistaken in the name.`, player);

            var vehicle = mp.vehicles.new(model, pos, {
                engine: false
            });
            vehicle.name = args[0];
            vehicle.owner = 0;
            vehicle.utils.setFuel(30);
            vehicle.maxFuel = 70;
            vehicle.dimension = player.dimension;
            vehicle.license = 0;
            terminal.info(`${player.name} created a car ${args[0]}`);
            mp.logs.addLog(`${player.name} created a car. Mark: ${args[0]}`, 'main', player.account.id, player.sqlId, { level: player.admin, model: args[0] });
        }
    },
    "delete_veh": {
        description: "Remove car. If there is a car in the database, it is also deleted..",
        minLevel: 3,
        syntax: "",
        handler: (player, args) => {
            var veh = player.vehicle;
            if (!veh) return terminal.error(`You are not in the car!`, player);

            if (veh.sqlId) {
                terminal.info(`${player.name} deleted car from db`, player);
                mp.logs.addLog(`${player.name} deleted car from db`, 'main', player.account.id, player.sqlId, { level: player.admin });
                DB.Handle.query(`DELETE FROM vehicles WHERE id=?`, [veh.sqlId]);
            } else terminal.info(`${player.name} deleted car`, player);
            veh.destroy();
        }
    },
    "veh_color": {
        description: "Change car color.",
        minLevel: 3,
        syntax: "[colorA]:n [colorB]:n",
        handler: (player, args) => {
            var veh = player.vehicle;
            if (!veh) return player.utils.error(`You are not in the car!`, player);

            veh.setColor(args[0], args[1]);
            mp.logs.addLog(`${player.name} changed the color of the car for cars with ID: ${veh.id}`, 'main', player.account.id, player.sqlId, { level: player.admin, vehId: veh.id });
            terminal.log(`Auto color changed`, player);
        }
    },
    "veh_license": {
        description: "Change license for driving cars. Types: <br/> 1 - auto <br/> 2 - moto <br/> 3 - Boat <br/> 4 - Yacht <br/> 11 - helicopter <br/> 12 - aircraft",
        minLevel: 3,
        syntax: "[license]:n",
        handler: (player, args) => {
            var veh = player.vehicle;
            if (!veh) return player.utils.error(`You are not in the car!`, player);
            var types = [1, 2, 3, 4, 11, 12];
            if (args[0] && types.indexOf(args[0]) == -1) return terminal.error(`Invalid license type!`, player);

            veh.utils.setLicense(args[0]);
            mp.logs.addLog(`${player.name} changed license category for auto with ID: ${veh.id}`, 'main', player.account.id, player.sqlId, { level: player.admin, vehId: veh.id });
            terminal.info(`${player.name} changed license category for auto with ID: ${veh.id}`);
        }
    },
    "fix": {
        description: "Car repair.",
        minLevel: 2,
        syntax: "",
        handler: (player) => {
            if (!player.vehicle) return terminal.error(`You are not in the car!`, player);
            player.vehicle.repair();
            player.vehicle.utils.setEngineBroken(false);
            player.vehicle.utils.setOilBroken(false);
            player.vehicle.utils.setAccumulatorBroken(false);
            mp.logs.addLog(`${player.name} repaired cars with ID: ${player.vehicle.id}`, 'main', player.account.id, player.sqlId, { level: player.admin, vehId: player.vehicle.id });
            terminal.info(`${player.name} repaired cars with ID: ${player.vehicle.id}`);
        }
    },
    "tp": {
        description: "Teleport to coordinates.",
        minLevel: 2,
        syntax: "[x]:n [y]:n [z]:n",
        handler: (player, args) => {
            player.position = new mp.Vector3(args[0], args[1], args[2]);
            terminal.info(`You teleported`, player);
        }
    },
    "tps": {
        description: "Teleport to coordinates.",
        minLevel: 2,
        syntax: "[str]:s",
        handler: (player, args) => {
            args = args.map((a) => a.replace(",", "").replace("f", ""));

            player.position = new mp.Vector3(parseFloat(args[0]), parseFloat(args[1]), parseFloat(args[2]));
            terminal.info(`You teleported`, player);
        }
    },
    "hp": {
        description: "Refill the health itself.",
        minLevel: 2,
        syntax: "",
        handler: (player) => {
            player.health = 100;
            terminal.info(`Health refilled!`, player);
        }
    },
    "armour": {
        description: "Refill armor yourself.",
        minLevel: 2,
        syntax: "",
        handler: (player) => {
            player.armour = 100;
            terminal.info(`Armor refilled!`, player);
        }
    },
    "kill": {
        description: "Kill yourself.",
        minLevel: 2,
        syntax: "",
        handler: (player) => {
            player.health = 0;
            terminal.info(`You are killed!`, player);
        }
    },

    "goto": {
        description: "Teleport to player.",
        minLevel: 1,
        syntax: "[id/name]:s",
        handler: (player, args) => {
            if (getPlayerStatus(args[0]) === "on") {
               let recipient = mp.players.at(args[0]);
               if (!recipient) return terminal.error("Player not found!", player);
               if (recipient.admin > player.admin) return terminal.error(`You can not teleport to the admin with a higher level!`, player);
               var pos = recipient.position;
               pos.x += 2;
               player.position = pos;
               player.dimension = recipient.dimension;
               terminal.info(`You teleported to ${recipient.name}`, player);
               mp.logs.addLog(`${player.name} teleported to ${recipient.name}. Coordinates: ${recipient.position}`, 'main', player.account.id, player.sqlId, { level: player.admin, pos: recipient.position });
            } else {
                let name = getSpecialName(args[0], player);
                if (!name) return terminal.error(`Format: LastName`, player);
                let recipient = mp.players.getByName(name);
                if (!recipient) return terminal.error(`Player ${args[0]} not found!`, player);
                if (recipient.admin > player.admin) return terminal.error(`You can not teleport to the admin with a higher level!`, player);
                var pos = recipient.position;
                pos.x += 2;
                player.position = pos;
                player.dimension = recipient.dimension;
                terminal.info(`You teleported to ${recipient.name}`, player);
                mp.logs.addLog(`${player.name} teleported to ${recipient.name}. Coordinates: ${recipient.position}`, 'main', player.account.id, player.sqlId, { level: player.admin, pos: recipient.position });
            }
        }
    },
    "gethere": {
        description: "Teleport player to yourself.",
        minLevel: 1,
        syntax: "[id/name]:s",
        handler: (player, args) => {
          if (getPlayerStatus(args[0]) === "on") {
              let recipient = mp.players.at(args[0]);
              if (!recipient) return terminal.error("Player not found!", player);
              var pos = player.position;
              pos.x += 2;
              recipient.position = pos;
              recipient.dimension = player.dimension;
              recipient.utils.info(`${player.name} teleported you to yourself`);
              terminal.info(`${recipient.name} teleported to you`, player);
              mp.logs.addLog(`${player.name} teleported to myself ${recipient.name}. Coordinates: ${player.position}`, 'main', player.account.id, player.sqlId, { level: player.admin, pos: player.position });
          } else {
              let name = getSpecialName(args[0], player);
              if (!name) return terminal.error(`Format: LastName`, player);
              let recipient = mp.players.getByName(name);
              if (!recipient) return terminal.error(`Player ${args[0]} not found!`, player);
              var pos = player.position;
              pos.x += 2;
              recipient.position = pos;
              recipient.dimension = player.dimension;
              recipient.utils.info(`${player.name} teleported you to yourself`);
              terminal.info(`${recipient.name} teleported to you`, player);
              mp.logs.addLog(`${player.name} teleported to myself ${recipient.name}. Coordinates: ${player.position}`, 'main', player.account.id, player.sqlId, { level: player.admin, pos: player.position });
          }
        }
    },
    "sp": {
        description: "Start spying on the player.",
        minLevel: 3,
        syntax: "[player_id]:n",
        handler: (player, args) => {
            var rec = mp.players.at(args[0]);
            if (!rec) return terminal.error(`Player with ID: ${args[0]} not found!`, player);
            let pos = player.position;
            if (player === rec) return terminal.error(`You can not start surveillance!`, player);
            if (!player.lastsp) player.lastsp = {
                x: pos.x,
                y: pos.y,
                z: pos.z,
                h: player.heading,
                dim: player.dimension
            };
            player.setVariable("ainvis", true);
            player.alpha = 0;
            player.position = new mp.Vector3(rec.position.x, rec.position.y, rec.position.z - 125.0);
            mp.logs.addLog(`${player.name} started spying on a player ${rec.name}. Coordinates: ${rec.position}`, 'main', player.account.id, player.sqlId, { level: player.admin, pos: rec.position });
            player.call(`admin.start.spectate`, [rec]);
        }
    },
    "global": {
        description: "Write a message to all players.",
        minLevel: 3,
        syntax: "[text]:s",
        handler: (player, args) => {
            terminal.info(`${player.name} wrote a message to all players`);
            var text = args.join(" ");
            mp.players.forEach((rec) => {
                if (rec.sqlId) rec.call("chat.custom.push", [`<a style="color: ${adm_color}">[A] ${player.name}:</a> ${text}`]);
                // chatAPI.custom_push(`<a style="color: #FF0000">[A] UNTAMED Hero:</a> Good day to all!`);
            });
            /*
            mp.players.forEach((rec) => {
                if (rec.sqlId) rec.utils.success(`[A] ${player.name}: ` + text);
            });*/
        }
    },
    "del_acc": {
        description: "Delete player account.",
        minLevel: 7,
        syntax: "[login]:s",
        handler: (player, args) => {
            if(player.account.login == args[0]) return player.utils.error("You can not delete your account");
            mp.players.forEach((rec) => { if(rec.account.login == args[0]) rec.kick('KICK') });
            DB.Handle.query("SELECT * FROM accounts WHERE login=?", [args[0]], (e, result) => {
                if (e) return terminal.error(e);
                if (result.length < 1) return terminal.error(`Player with login: ${args[0]} not found!`, player);
                let rec = result;
                if (rec) {

                    DB.Handle.query("DELETE FROM accounts WHERE login=?", [args[0]], (e, result) => {
                        if (e) return terminal.error(e);
                        if (result.length < 1) return;
                    });

                    DB.Handle.query("SELECT * FROM characters WHERE accountId=?", [result[0].id], (e, result) => {
                        if (e) return terminal.error(e);
                        if (result.length < 1) return;
                        result.forEach((recipient) => {
                            DB.Handle.query("DELETE FROM characters WHERE id=?", [recipient.id], (e, result) => {
                                if (e) return terminal.error(e);
                                if (result.length < 1) return;
                            });

                            DB.Handle.query("SELECT * FROM vehicles WHERE owner=?", [2000 + recipient.id], (e, result) => {
                                if (e) return terminal.error(e);
                                if (result.length < 1) return;
                                result.forEach((recipient) => {
                                    DB.Handle.query("DELETE FROM vehicles WHERE owner=?", [recipient.owner]);
                                });
                            });

                            DB.Handle.query("SELECT * FROM houses WHERE owner=?", [recipient.id], (e, result) => {
                                if (e) return terminal.error(e);
                                if (result.length < 1) return;
                                result.forEach((recipient) => {
                                    var house = mp.hosues.getBySqlId(recipient.id);
                                    house.setOwner(0);
                                });
                            });

                            DB.Handle.query("SELECT * FROM bizes WHERE owner=?", [recipient.id], (e, result) => {
                                if (e) return terminal.error(e);
                                if (result.length < 1) return;
                                result.forEach((recipient) => {
                                    var biz = mp.bizes.getBySqlId(recipient.id);
                                    biz.setOwner(0);
                                });
                            });

                            DB.Handle.query("SELECT * FROM characters_headoverlays WHERE character_id=?", [recipient.id], (e, result) => {
                                if (e) return terminal.error(e);
                                if (result.length < 1) return;
                                result.forEach((recipient) => {
                                    DB.Handle.query("DELETE FROM characters_headoverlays WHERE character_id=?", [recipient.character_id]);
                                });
                            });
                        });


                        terminal.info(`${player.name} deleted account ${args[0]}`);
                        mp.logs.addLog(`${player.name} deleted account ${args[0]}`, 'main', player.account.id, player.sqlId, { level: player.admin, login: args[0] });
                        mp.logs.addLog(`${args[0]} removed from database`, 'main', result[0].id, 0, { login: args[0] });

                    });
                }
            });
        }
    },
    "del_char": {
        description: "Delete account character.",
        minLevel: 7,
        syntax: "[name]:s",
        handler: (player, args) => {
            let name = getSpecialName(args[0], player);
            if (!name) return terminal.error(`Format: LastName`, player);
            if(player.name == args[0]) return player.utils.error("You can not delete your own character!");
            mp.players.forEach((rec) => { if(rec.name == name) rec.kick('KICK') });

            DB.Handle.query("SELECT * FROM characters WHERE name=?", [name], (e, result) => {
                if (e) return terminal.error(e);
                if (result.length < 1) return;

                DB.Handle.query("DELETE FROM characters WHERE id=?", [result[0].id], (e, result) => {
                    if (e) return terminal.error(e);
                    if (result.length < 1) return;
                });

                DB.Handle.query("SELECT * FROM vehicles WHERE owner=?", [2000 + result[0].id], (e, result) => {
                    if (e) return terminal.error(e);
                    if (result.length < 1) return;
                    result.forEach((recipient) => {
                        DB.Handle.query("DELETE FROM vehicles WHERE owner=?", [recipient.owner]);
                    });
                });

                DB.Handle.query("SELECT * FROM houses WHERE owner=?", [result[0].id], (e, result) => {
                    if (e) return terminal.error(e);
                    if (result.length < 1) return;
                    result.forEach((recipient) => {
                        var house = mp.hosues.getBySqlId(recipient.id);
                        house.setOwner(0);
                    });
                });
                DB.Handle.query("SELECT * FROM bizes WHERE owner=?", [result[0].id], (e, result) => {
                    if (e) return terminal.error(e);
                    if (result.length < 1) return;
                    result.forEach((recipient) => {
                        var biz = mp.bizes.getBySqlId(recipient.id);
                        biz.setOwner(0);
                    });
                });

                DB.Handle.query("SELECT * FROM characters_headoverlays WHERE character_id=?", [result[0].id], (e, result) => {
                    if (e) return terminal.error(e);
                    if (result.length < 1) return;
                    result.forEach((recipient) => {
                        DB.Handle.query("DELETE FROM characters_headoverlays WHERE character_id=?", [recipient.character_id]);
                    });
                });

                terminal.info(`${player.name} deleted character ${name}`);
                mp.logs.addLog(`${player.name} deleted character ${name}`, 'main', player.account.id, player.sqlId, { level: player.admin, name: name });
                mp.logs.addLog(`${name} removed from database`, 'main', result[0].id, 0, { name: name });

            });
        }
    },
    "info_acc": {
        description: "Account Information.",
        minLevel: 7,
        syntax: "[login]:s",
        handler: (player, args) => {
            DB.Handle.query("SELECT * FROM accounts WHERE login=?", [args[0]], (e, result) => {
                if (e) return terminal.error(e);
                if (result.length < 1) return terminal.error(`Player with login: ${args[0]} not found!`, player);
                let rec = result[0];
                if (rec) {
                    terminal.info(`${player.name} looked at account information ${args[0]}`);
                    terminal.log(`Login: <b>${result[0].login}</b><br/>SC: <b>${result[0].socialClub}</b><br/>Email: <b>${result[0].email} (${result[0].confirmEmail === 1 ? 'true' : 'false'})</b><br/>RegIP: <b>${result[0].regIp}</b><br/>LastIP: <b>${target[0].lastIp}</b><br/>LastDate: <b>${result[0].lastDate}</b><br/>`, player);
                    mp.logs.addLog(`${player.name} looked at account information ${args[0]}`, 'main', player.account.id, player.sqlId, { level: player.admin, login: args[0] });
                }
            });
        }
    },
    "change_login": {
        description: "Change login.",
        minLevel: 7,
        syntax: "[oldLogin]:s [login]:s",
        handler: (player, args) => {
            DB.Handle.query("SELECT * FROM accounts WHERE login=?", [args[0]], (e, result) => {
                if (e) return terminal.error(e);
                if (result.length < 1) return terminal.error(`Player with login: ${args[0]} not found!`, player);
                let rec = result[0];
                let recPlayer = mp.players.getByLogin(args[0]);
                if (rec) {
                    terminal.info(`${player.name} changed account ${result[0].login} with login ${args[0]} login to ${args[1]}`);
                    mp.logs.addLog(`${player.name} changed account ${result[0].login} with login ${args[0]} login to ${args[1]}`, 'main', player.account.id, player.sqlId, { level: player.admin, oldLogin: args[0], login: args[1] });
                    if(recPlayer) {
                        recPlayer.account.login = args[1];
                        recPlayer.utils.success(`Admin ${player.name} changed your login account to ${args[1]}`);
                    }
                    DB.Handle.query(`UPDATE accounts SET login=? WHERE login=?`, [args[0], args[0]]);
                }
            });
        }
    },
    "change_sc": {
        description: "Change SC.",
        minLevel: 7,
        syntax: "[oldSC]:s [SC]:s",
        handler: (player, args) => {
            DB.Handle.query("SELECT * FROM accounts WHERE socialClub=?", [args[0]], (e, result) => {
                if (e) return terminal.error(e);
                if (result.length < 1) return terminal.error(`Player with SC: ${args[0]} not found!`, player);
                let rec = result[0];
                let recPlayer = mp.players.getBySocialClub(args[0]);
                if (rec) {
                    terminal.info(`${player.name} changed account ${result[0].login} с SC ${args[0]} on SC ${args[1]}`);
                    mp.logs.addLog(`${player.name} changed account ${result[0].login} с SC ${args[0]} on SC ${args[1]}`, 'main', player.account.id, player.sqlId, { level: player.admin, oldSC: args[0], SC: args[1] });
                    if(recPlayer) {
                        recPlayer.socialClub = args[1];
                        recPlayer.utils.success(`Admin ${player.name} changed your socialClub account to ${args[1]}`);
                    }
                    DB.Handle.query(`UPDATE accounts SET socialClub=? WHERE socialClub=?`, [args[0], args[0]]);
                }
            });
        }
    },
    "change_pass": {
        description: "Change password.",
        minLevel: 7,
        syntax: "[login]:s [pass]:s",
        handler: (player, args) => {
            DB.Handle.query("SELECT * FROM accounts WHERE login=?", [args[0]], (e, result) => {
                if (e) return terminal.error(e);
                if (result.length < 1) return terminal.error(`Player with login: ${args[0]} not found!`, player);
                let rec = result[0];
                let recPlayer = mp.players.getByLogin(args[0]);
                if (rec) {
                    terminal.info(`${player.name} changed account password ${args[0]} on ${args[1]}`);
                    mp.logs.addLog(`${player.name} changed account password ${args[0]} on ${args[1]}`, 'main', player.account.id, player.sqlId, { level: player.admin, pass: args[1], login: args[0] });
                    if(recPlayer) recPlayer.utils.success(`Admin ${player.name} changed your account password to ${args[1]}`);
                    DB.Handle.query(`UPDATE accounts SET password=? WHERE login=?`, [md5(args[1]), args[0]]);
                }
            });
        }
    },
    "change_email": {
        description: "Change mail.",
        minLevel: 7,
        syntax: "[login]:s [email]:s",
        handler: (player, args) => {
            DB.Handle.query("SELECT * FROM accounts WHERE login=?", [args[0]], (e, result) => {
                if (e) return terminal.error(e);
                if (result.length < 1) return terminal.error(`Player with login: ${args[0]} not found!`, player);
                let rec = result[0];
                let recPlayer = mp.players.getByLogin(args[0]);
                if (rec) {
                    terminal.info(`${player.name} changed account mail ${args[0]} on ${args[1]}`);
                    mp.logs.addLog(`${player.name} changed account mail ${args[0]} on ${args[1]}`, 'main', player.account.id, player.sqlId, { level: player.admin, email: args[1], login: args[0] });
                    if(recPlayer) recPlayer.utils.success(`Admin ${player.name} changed your email account to ${args[1]}`);
                    DB.Handle.query(`UPDATE accounts SET email=? WHERE login=?`, [args[1], args[0]]);
                }
            });
        }
    },
    "email_confirm": {
        description: "Confirm mail. Status 1 - confirmed, 0 - not confirmed.",
        minLevel: 7,
        syntax: "[login]:s [status]:s",
        handler: (player, args) => {
            DB.Handle.query("SELECT * FROM accounts WHERE login=?", [args[0]], (e, result) => {
                if (e) return terminal.error(e);
                if (result.length < 1) return terminal.error(`Player with login: ${args[0]} not found!`, player);
                let rec = result[0];
                let recPlayer = mp.players.getByLogin(args[0]);
                if (rec) {
                    terminal.info(`${player.name} changed account mail status ${args[0]} on ${args[1] === 1 ? 'Verified' : "Unverified"}`);
                    mp.logs.addLog(`${player.name} changed account mail status ${args[0]} on ${args[1] === 1 ? 'Verified' : "Unverified"}`, 'main', player.account.id, player.sqlId, { level: player.admin, email: result[0].confirmEmail, status: args[1], login: args[0] });
                    if(recPlayer) {
                        recPlayer.account.confirmEmail = args[1];
                        recPlayer.utils.success(`Admin ${player.name} changed your email account status to ${args[1] === 1 ? 'Verified' : "Unverified"}`);
                    }
                    DB.Handle.query(`UPDATE accounts SET confirmEmail=? WHERE login=?`, [args[1], args[0]]);
                }
            });
        }
    },
    "info_rpr": {
        description: "Account Information.",
        minLevel: 7,
        syntax: "[login]:s",
        handler: (player, args) => {
            DB.Handle.query("SELECT * FROM accounts WHERE login=?", [args[0]], (e, result) => {
                if (e) return terminal.error(e);
                if (result.length < 1) return terminal.error(`Player with login: ${args[0]} not found!`, player);
                let rec = result[0];
                if (rec) {
                    terminal.info(`${player.name} looked at information about RP account rating ${args[0]}`);
                    terminal.log(`Login: <b>${result[0].login}</b><br/>RP rating: <b>${result[0].rp}</b><br/>`, player);
                    mp.logs.addLog(`${player.name} looked at the information about the RP account rating ${args[0]}`, 'main', player.account.id, player.sqlId, { level: player.admin, login: args[0] });
                }
            });
        }
    },
    "set_rpr": {
        description: "Set RP rating.",
        minLevel: 7,
        syntax: "[login]:s [RP]:s",
        handler: (player, args) => {
            DB.Handle.query("SELECT * FROM accounts WHERE login=?", [args[0]], (e, result) => {
                if (e) return terminal.error(e);
                if (result.length < 1) return terminal.error(`Player with login: ${args[0]} not found!`, player);
                let rec = result[0];
                let recPlayer = mp.players.getByLogin(args[0]);
                if (rec) {
                    terminal.info(`${player.name} set ${args[1]} RP account rating ${args[0]}`);
                    mp.logs.addLog(`${player.name} set ${args[1]} RP account rating ${args[0]}`, 'main', player.account.id, player.sqlId, { level: player.admin, rp: args[1], login: args[0] });
                    if(recPlayer) recPlayer.utils.success(`Admin ${player.name} set your RP account rating to ${args[1]}`);
                    DB.Handle.query(`UPDATE accounts SET rp=? WHERE login=?`, [args[1], args[0]]);
                }
            });
        }
    },
    "give_rpr": {
        description: "Issue RP rating.",
        minLevel: 7,
        syntax: "[login]:s [RP]:s",
        handler: (player, args) => {
            DB.Handle.query("SELECT * FROM accounts WHERE login=?", [args[0]], (e, result) => {
                if (e) return terminal.error(e);
                if (result.length < 1) return terminal.error(`Player with login: ${args[0]} not found!`, player);
                let rec = result[0];
                let recPlayer = mp.players.getByLogin(args[0]);
                if (rec) {
                    terminal.info(`${player.name} added ${args[1]} RP rating account ${args[0]}`);
                    mp.logs.addLog(`${player.name} added ${args[1]} RP rating account ${args[0]}`, 'main', player.account.id, player.sqlId, { level: player.admin, rp: result[0].rp + args[1], login: args[0] });
                    if(recPlayer) recPlayer.utils.success(`Admin ${player.name} added you ${args[1]} RP account rating`);
                    DB.Handle.query(`UPDATE accounts SET rp=rp + ? WHERE login=?`, [args[1], args[0]]);
                }
            });
        }
    },
    "take_rpr": {
        description: "Pick RP Rating.",
        minLevel: 7,
        syntax: "[login]:s [RP]:s",
        handler: (player, args) => {
            DB.Handle.query("SELECT * FROM accounts WHERE login=?", [args[0]], (e, result) => {
                if (e) return terminal.error(e);
                if (result.length < 1) return terminal.error(`Player with login: ${args[0]} not found!`, player);
                let rec = result[0];
                let recPlayer = mp.players.getByLogin(args[0]);
                if (rec) {
                    terminal.info(`${player.name} took ${args[1]} RP rating for account ${args[0]}`);
                    mp.logs.addLog(`${player.name} took ${args[1]} RP rating for account ${args[0]}`, 'main', player.account.id, player.sqlId, { level: player.admin, rp: result[0].rp - args[1], login: args[0] });
                    if(recPlayer) recPlayer.utils.success(`Admin ${player.name} took from you ${args[1]} RP рейтинга аккаунта`);
                    DB.Handle.query(`UPDATE accounts SET rp=rp - ? WHERE login=?`, [args[1], args[0]]);
                }
            });
        }
    },
    "info_vc": {
        description: "uCredits informations.",
        minLevel: 7,
        syntax: "[login]:s",
        handler: (player, args) => {
            DB.Handle.query("SELECT * FROM accounts WHERE login=?", [args[0]], (e, result) => {
                if (e) return terminal.error(e);
                if (result.length < 1) return terminal.error(`Player with login: ${args[0]} not found!`, player);
                let rec = result[0];
                if (rec) {
                    terminal.info(`${player.name} looked at the VC account information ${args[0]}`);
                    terminal.log(`Login: <b>${result[0].login}</b><br/>VC: <b>${result[0].donate}</b><br/>`, player);
                    mp.logs.addLog(`${player.name} looked at the VC account information ${args[0]}`, 'main', player.account.id, player.sqlId, { level: player.admin, login: args[0] });
                }
            });
        }
    },
    "set_vc": {
        description: "Install VC.",
        minLevel: 7,
        syntax: "[login]:s [VC]:s",
        handler: (player, args) => {
            DB.Handle.query("SELECT * FROM accounts WHERE login=?", [args[0]], (e, result) => {
                if (e) return terminal.error(e);
                if (result.length < 1) return terminal.error(`Player with login: ${args[0]} not found!`, player);
                let rec = result[0];
                let recPlayer = mp.players.getByLogin(args[0]);
                if (rec) {
                    terminal.info(`${player.name} set ${args[1]} VC account ${args[0]}`);
                    mp.logs.addLog(`${player.name} set ${args[1]} VC account ${args[0]}`, 'main', player.account.id, player.sqlId, { level: player.admin, donate: args[1], login: args[0] });
                    if(recPlayer) {
                        recPlayer.utils.setDonate(args[1]);
                        recPlayer.utils.success(`Admin ${player.name} set you VC account on ${args[1]}`);
                    }
                }
            });
        }
    },
    "give_vc": {
        description: "Issue VC.",
        minLevel: 7,
        syntax: "[login]:s [VC]:s",
        handler: (player, args) => {
            DB.Handle.query("SELECT * FROM accounts WHERE login=?", [args[0]], (e, result) => {
                if (e) return terminal.error(e);
                if (result.length < 1) return terminal.error(`Player with login: ${args[0]} not found!`, player);
                let rec = result[0];
                let recPlayer = mp.players.getByLogin(args[0]);
                if (rec) {
                    terminal.info(`${player.name} added ${args[1]} VC account ${args[0]}`);
                    mp.logs.addLog(`${player.name} added ${args[1]} VC account ${args[0]}`, 'main', player.account.id, player.sqlId, { level: player.admin, donate: result[0].donate + args[1], login: args[0] });
                    if(recPlayer) {
                        recPlayer.utils.setDonate(args[1] + recPlayer.account.donate);
                        recPlayer.utils.success(`Admin ${player.name} added you ${args[1]} VC account`);
                    }
                }
            });
        }
    },
    "take_vc": {
        description: "Забрать VC.",
        minLevel: 7,
        syntax: "[login]:s [VC]:s",
        handler: (player, args) => {
            DB.Handle.query("SELECT * FROM accounts WHERE login=?", [args[0]], (e, result) => {
                if (e) return terminal.error(e);
                if (result.length < 1) return terminal.error(`Player with login: ${args[0]} not found!`, player);
                let rec = result[0];
                let recPlayer = mp.players.getByLogin(args[0]);
                if (rec) {
                    terminal.info(`${player.name} took ${args[1]} VC account ${args[0]}`);
                    mp.logs.addLog(`${player.name} took ${args[1]} VC account ${args[0]}`, 'main', player.account.id, player.sqlId, { level: player.admin, donate: result[0].donate - args[1], login: args[0] });
                    if(recPlayer) {
                        recPlayer.utils.setDonate(args[1] - recPlayer.account.donate);
                        recPlayer.utils.success(`Admin ${player.name} took from you ${args[1]} VC account`);
                    }
                }
            });
        }
    },
    "unsp": {
        description: "Finish spying on a player.",
        minLevel: 3,
        syntax: "",
        handler: (player, args) => {
            if (!player.lastsp) return terminal.error(`You are not shadowing!`, player);
            player.setVariable("ainvis", null);
            player.call(`admin.start.spectate`, [undefined]);
            player.alpha = 255;
            player.position = new mp.Vector3(player.lastsp.x, player.lastsp.y, player.lastsp.z);
            player.heading = player.lastsp.h;
            player.dimension = player.lastsp.dim;
            player.utils.error("You stopped spying!");
            delete player.lastsp;
        }
    },
    "kick": {
        description: "Kick a player from the server.",
        minLevel: 1,
        syntax: "[playerId]:n [reason]:s",
        handler: (player, args) => {
            var recipient = mp.players.at(args[0]);
            if (!recipient) return terminal.error("Player not found!", player);
            args.splice(0, 1);
            var reason = args.join(" ");
            recipient.utils.error(`${player.name} kicked you`);
            recipient.utils.error(`Cause: ${reason}`);
            recipient.kick(reason);
            terminal.info(`${player.name} kicked ${recipient.name}: ${reason}`);
            mp.logs.addLog(`${player.name} kicked ${recipient.name}. Cause: ${reason}`, 'main', player.account.id, player.sqlId, { level: player.admin, reason: reason });
            mp.logs.addLog(`${recipient.name} was kicked by the administrator ${player.name}. Cause: ${reason}`, 'main', recipient.account.id, recipient.sqlId, { level: player.admin, reason: reason });
            mp.players.forEach((rec) => {
                if (rec.sqlId) rec.call("chat.custom.push", [`<a style="color: ${adm_color}">[A] ${player.name}</a> kicked <a style="color: ${adm_color}">${recipient.name}.</a> Cause: <a style="color: ${adm_color}">${reason}`]);
                // chatAPI.custom_push(`<a style="color: #FF0000">[A] UNTAMED Hero:</a> всем доброго времени суток!`);
            });
        }
    },
    "skick": {
        description: "Kick a player from the server (without notifying the player)",
        minLevel: 1,
        syntax: "[playerId]:n [reason]:s",
        handler: (player, args) => {
            var recipient = mp.players.at(args[0]);
            if (!recipient) return terminal.error("Player not found!", player);
            args.splice(0, 1);
            var reason = args.join(" ");
            terminal.info(`${player.name} quietly kicked ${recipient.name}: ${reason}`);
            mp.logs.addLog(`${player.name} quietly kicked ${recipient.name}. Cause: ${reason}`, 'main', player.account.id, player.sqlId, { level: player.admin, reason: reason });
            mp.logs.addLog(`${recipient.name} was quietly kicked by the administrator ${player.name}. Cause: ${reason}`, 'main', recipient.account.id, recipient.sqlId, { level: player.admin, reason: reason });
            recipient.kick(reason);
        }
    },
    "hp_radius": {
        description: "Change players health in radius.",
        minLevel: 3,
        syntax: "[radius]:n [health]:n",
        handler: (player, args) => {
            let dist = args[0];
            if (dist < 1 || dist > 20000) return terminal.error(`Distance from 1 to 20000!`, player);
            let health = Math.clamp(args[1], 0, 100);
            mp.players.forEachInRange(player.position, dist,
                (rec) => {
                    rec.health = health;
                    rec.utils.info(`${player.name} changed your health to ${health}`);
                }
            );
            terminal.info(`${player.name} changed the health of all players in the radius ${dist}м. to ${health}hp.`);
        }
    },
    "set_hp": {
        description: "Change player health.",
        minLevel: 3,
        syntax: "[player_id]:n [health]:n",
        handler: (player, args) => {
            var rec = mp.players.at(args[0]);
            if (!rec) return terminal.error(`Player with ID: ${args[0]} not found!`, player);
            rec.health = Math.clamp(args[1], 0, 100);
            rec.utils.info(`${player.name} changed your health to ${rec.health}`);
            terminal.info(`${player.name} changed health ${rec.name} he ${rec.health}`);
        }
    },
    "id": {
        description: "Find out the name of the player.",
        minLevel: 1,
        syntax: "[id/name]:s",
        handler: (player, args) => {
            if (getPlayerStatus(args[0]) === "he") {
                let rec = mp.players.at(args[0]);
                if (!rec) return terminal.error(`Player with ID: ${args[0]} not found!`, player);
                terminal.log(`ID: ${rec.id} | NAME: ${rec.name}`, player);
            } else {
                let name = getSpecialName(args[0], player);
                if (!name) return terminal.error(`Format: LastName`, player);
                let rec = mp.players.getByName(name);
                if (!rec) return terminal.error(`Player ${args[0]} not found!`, player);
                terminal.log(`ID: ${rec.id} | NAME: ${rec.name}`, player);
            }
        }
    },
    "set_armor": {
        description: "Change player armor.",
        minLevel: 3,
        syntax: "[player_id]:n [armor]:n",
        handler: (player, args) => {
            var rec = mp.players.at(args[0]);
            if (!rec) return terminal.error(`Player with ID: ${args[0]} not found!`, player);
            rec.armour = Math.clamp(args[1], 0, 100);
            rec.utils.info(`${player.name} changed your armor to ${rec.armour}`);
            terminal.info(`${player.name} changed armor ${rec.name} he ${rec.armour}`);
        }
    },
    "dm": {
        description: "Plant player in demorgan.",
        minLevel: 3,
        syntax: "[id/name]:s [time]:n [reason]:s",
        handler: (player, args) => {
            if (args[1] < 1 || args[1] > 5000) return terminal.error(`Demorgan from 1 min. up to 5000 min!`, player);
            if (getPlayerStatus(args[0]) === "on") {
                let rec = mp.players.at(args[0]);
                if (!rec) return terminal.error(`Player with ID: ${args[0]} not found!`, player);
                if (rec.demorgan > 0) return terminal.error(`Player with ID: ${args[0]} already sitting in demorgan!`, player);
                let spawnOpen = require("./events/CharacterEvents.js");
                rec.position = new mp.Vector3(spawnOpen.SpawnInfo.demorgan.x, spawnOpen.SpawnInfo.demorgan.y, spawnOpen.SpawnInfo.demorgan.z);
                rec.heading = spawnOpen.SpawnInfo.demorgan.h;
                let startDemorgan = parseInt(new Date().getTime() / 1000);
                rec.utils.setLocalVar("demorganSet", { startTime: startDemorgan, demorgan: args[1] });
                rec.startDemorgan = startDemorgan;
                rec.demorganTimerId = timerId = setTimeout(() => {
                    try {
                        rec.utils.leaveDemorgan();
                    } catch (err) {
                        console.log(err.stack);
                    }
                }, (args[1] * 60) * 1000);
                rec.demorgan = args[1];
                rec.utils.error(`${player.name} put you in demorgan on ${args[1]} minutes.`);
                rec.utils.error(`Cause: ${args[2]}`);
                DB.Handle.query("UPDATE characters SET demorgan=? WHERE id=?", [args[1], rec.sqlId]);
                terminal.info(`${player.name} put ${rec.name} to demorgan on ${args[1]} minutes. Cause: ${args[2]}`);

                mp.logs.addLog(`${player.name} put ${rec.name} to demorgan on ${args[1]} minutes. Cause: ${args[2]}`, 'main', player.account.id, player.sqlId, { level: player.admin, time: args[1], reason: args[2] });
                mp.logs.addLog(`${rec.name} was planted by admin ${player.name} to demorgan on ${args[1]} minutes. Cause: ${args[2]}`, 'main', rec.account.id, rec.sqlId, { time: args[1], reason: args[2] });

                mp.players.forEach((newrec) => {
                    if (newrec.sqlId) newrec.call("chat.custom.push", [`<a style="color: ${adm_color}">[A] ${player.name}</a> planted <a style="color: ${adm_color}">${rec.name}</a> to demorgan on <a style="color: ${adm_color}">${args[1]}</a> minutes. <br/><a style="color: ${adm_color}">Cause:</a> ${args[2]}`]);
                });
            } else {
                let name = getSpecialName(args[0], player);
                if (!name) return terminal.error(`Format: LastName`, player);
                DB.Handle.query("SELECT * FROM characters WHERE name=?", [name], (e, result) => {
                    if (e) {
                        callback("Error executing query in the database!");
                        return terminal.error(e);
                    }
                    if (result.length < 1) return terminal.error(`Player with name: ${args[0]} not found!`, player);
                    let rec = result[0];
                    if (rec) {
                        DB.Handle.query("UPDATE characters SET demorgan=? WHERE id=?", [args[1], rec.id]);
                        terminal.info(`${player.name} put offline ${rec.name} to demorgan on ${args[1]} minutes. Cause: ${args[2]}`);

                        mp.logs.addLog(`${player.name} put offline ${rec.name} to demorgan on ${args[1]} minutes. Cause: ${args[2]}`, 'main', player.account.id, player.sqlId, { level: player.admin, time: args[1], reason: args[2] });
                        mp.logs.addLog(`${rec.name} was planted by admin ${player.name} offline demorgan on ${args[1]} minutes. Cause: ${args[2]}`, 'main', rec.accountId, rec.id, { time: args[1], reason: args[2] });

                        mp.players.forEach((newrec) => {
                            if (newrec.sqlId) newrec.call("chat.custom.push", [`<a style="color: ${adm_color}">[A] ${player.name}</a> planted <a style="color: ${adm_color}">${rec.name}</a> to demorgan on <a style="color: ${adm_color}">${args[1]}</a> minutes. <br/><a style="color: ${adm_color}">Cause:</a> ${args[2]}`]);
                        });
                    }
                });
            }
        }
    },
    "undm": {
        description: "Release player from demorgan.",
        minLevel: 3,
        syntax: "[id/name]:s",
        handler: (player, args) => {
            if (getPlayerStatus(args[0]) === "on") {
                let rec = mp.players.at(args[0]);
                if (!rec) return terminal.error(`Player with ID: ${args[0]} not found!`, player);
                if (rec.demorgan === 0) return terminal.error(`Player with ID: ${args[0]} does not sit in demorgan!`, player);
                rec.utils.leaveDemorgan();
                rec.utils.error(`${player.name} released you from demorgan.`);
                terminal.info(`${player.name} released ${rec.name} from demorgan.`);

                mp.logs.addLog(`${player.name} released ${rec.name} from demorgan`, 'main', player.account.id, player.sqlId, { level: player.admin });
                mp.logs.addLog(`${rec.name} был выпущен администратором ${player.name} from demorgan.`, 'main', rec.account.id, rec.sqlId, { level: player.admin });

                mp.players.forEach((newrec) => {
                    if (newrec.sqlId) newrec.call("chat.custom.push", [`<a style="color: ${adm_color}">[A] ${player.name}</a> released <a style="color: ${adm_color}">${rec.name}</a> из деморгаon.`]);
                });
            } else {
                let name = getSpecialName(args[0], player);
                if (!name) return terminal.error(`Format: LastName`, player);
                DB.Handle.query("SELECT * FROM characters WHERE name=?", [name], (e, result) => {
                    if (e) {
                        callback("Error executing query in the database!");
                        return terminal.error(e);
                    }
                    if (result.length < 1) return terminal.error(`Player with name: ${args[0]} not found!`, player);
                    let rec = result[0];
                    if (rec) {
                        if (rec.demorgan === 0) return terminal.error(`The player does not sit in demorgan!`, player);
                        DB.Handle.query("UPDATE characters SET demorgan=? WHERE id=?", [0, rec.id]);
                        terminal.info(`${player.name} released offline ${rec.name} from demorgan.`);

                        mp.logs.addLog(`${player.name} released offline ${rec.name} from demorgan`, 'main', player.account.id, player.sqlId, { level: player.admin });
                        mp.logs.addLog(`${rec.name} was released by admin ${player.name} from offline demorgan`, 'main', rec.accountId, rec.id, { level: player.admin });

                        mp.players.forEach((newrec) => {
                            if (newrec.sqlId) newrec.call("chat.custom.push", [`<a style="color: ${adm_color}">[A] ${player.name}</a> released <a style="color: ${adm_color}">${rec.name}</a> from demorgan.`]);
                        });
                    }
                });
            }
        }
    },
    "stats": {
        description: "View Player Statistics.",
        minLevel: 3,
        syntax: "[id/name]:s",
        handler: (player, args) => {
            if (getPlayerStatus(args[0]) === "on") {
                var rec = mp.players.at(args[0]);
                if (!rec) return terminal.error(`Player with ID: ${args[0]} not found!`, player);
                let add_text;
                DB.Handle.query("SELECT * FROM characters WHERE id=?", [rec.sqlId], (e, result) => {
                    add_text = `Date of registration: <b>${result[0].regDate}</b><br/>IP: <b>${rec.ip}</b><br/>IP at registration: <b>${result[0].regIp}</b><br/>`;
                    terminal.log(`Player: <b>${rec.name}</b><br/>Money: <b>$${rec.money}</b><br/>Bank: <b>$${rec.bank}</b><br/>Donate: <b>${rec.account.donate}</b><br/>Played back: <b>${rec.minutes} minutes</b><br/>Varna: <b>${rec.warn}</b><br/>Organization: <b>${rec.faction === 0 ? "not" : mp.factions.getBySqlId(rec.faction).name}</b><br/>Rank: <b>${rec.rank === 0 ? "not" : mp.factions.getRankName(rec.faction, rec.rank)}</b><br/>Job: <b>${rec.job  === 0 ? "not" : mp.jobs[rec.job - 1].name}</b><br/>Number of houses: <b>${mp.houses.getArrayByOwner(rec.sqlId).length}</b><br/>SC: <b>${rec.socialClub}</b><br/>Total donate: <b>${rec.account.allDonate}</b><br/>` + add_text, player);
                    terminal.info(`${player.name} looked through the statistics ${rec.name}`);
                });
            } else {
                let name = getSpecialName(args[0], player);
                if (!name) return terminal.error(`Format: LastName`, player);
                DB.Handle.query("SELECT * FROM characters WHERE name=?", [name], (e, result) => {
                    if (e) {
                        callback("Error executing query in the database!");
                        return terminal.error(e);
                    }
                    if (result.length < 1) return terminal.error(`Player with name: ${args[0]} not found!`, player);
                    let target = result[0];
                    if (target) {
                        terminal.log(`Player: <b>${target.name}</b><br/>Money: <b>$${target.money}</b><br/>Bank: <b>$${target.bank}</b><br/>Donate: <b>${target.donate}</b><br/>Played back: <b>${target.minutes} minutes</b><br/>Varna: <b>${target.warn}</b><br/>Organization: <b>${target.faction === 0 ? "not" : mp.factions.getBySqlId(target.faction).name}</b><br/>Ранг: <b>${target.rank === 0 ? "not" : mp.factions.getRankName(target.faction, target.rank)}</b><br/>Job: <b>${target.job  === 0 ? "not" : mp.jobs[target.job - 1].name}</b><br/>Number of houses: <b>${mp.houses.getArrayByOwner(target.sqlId).length}</b><br/>Date of registration: <b>${target.regDate}</b><br/>IP at last login: <b>${target.lastIp}</b><br/>IP at registration: <b>${target.regIp}</b><br/>`, player);
                        terminal.info(`${player.name} viewed offline stats ${target.name}`);
                    }
                });
            }
        }
    },
    "clist": {
        description: "Turn on / off display of admin-colors in the nickname.",
        minLevel: 1,
        syntax: "",
        handler: (player, args) => {
          if (!player.getVariable("admin")) {
            player.setVariable("admin", player.admin);
            player.utils.success("You have turned on admin color display!");
          } else {
            player.setVariable("admin", null);
            player.utils.error("You have turned off the admin color display!");
          }
        }
    },
    "makeadminoff": {
        description: "Remove admin offline",
        minLevel: 9,
        syntax: "[name]:s [reason]:s",
        handler: (player, args) => {
            let name = getSpecialName(args[0], player);
            if (!name) return terminal.error(`Format: LastName`, player);
            DB.Handle.query("SELECT * FROM characters WHERE name=?", [name], (e, result) => {
                if (e) {
                    callback("Error executing query in the database!");
                    return terminal.error(e);
                }
                if (result.length < 1) return terminal.error(`Player with name: ${args[0]} not found!`, player);
                let target = result[0];
                if (target) {
                    if (target.admin === 0) return terminal.error(`This player is not an administrator!`, player);
                    if (target.admin > player.admin) return terminal.error(`This administrator is above your level!`, player);
                    DB.Handle.query("UPDATE characters SET admin=? WHERE id=?", [0, target.id]);
                    terminal.info(`${player.name} removed the administrator ${target.name}. Cause: ${args[1]}`);
                    mp.logs.addLog(`${player.name} removed the character administrator ${target.name}. Cause: ${args[1]}`, 'main', player.account.id, player.sqlId, { level: player.admin, reason: args[1] });
                }
            });
        }
    },
    "spawncars": {
        description: "Create free cars on the server.",
        minLevel: 4,
        syntax: "",
        handler: (player, args) => {
            terminal.log(`${player.name} began to spawn all transport on the server.`);
            mp.players.forEach((newrec) => {
              if (newrec.sqlId) newrec.call("chat.custom.push", [`<a style="color: ${adm_color}">[A]</a> All vehicles will be spawn in <a style="color: ${adm_color}">${Config.spawnCarsWaitTime / 1000}</a> seconds.`]);
            });
            setTimeout(function() {
                var startTime = new Date().getTime();
                var spawnCount = 0,
                    destroyCount = 0;
                try {
                    mp.vehicles.forEach((vehicle) => {
                        //todo the cars that load the products
                        var players = vehicle.getOccupants();
                        if (players.length == 0) {
                            if (vehicle.spawnPos) {
                                let pos = vehicle.spawnPos;
                                var dist = (vehicle.position["x"] - pos["x"]) * (vehicle.position["x"] - pos["x"]) + (vehicle.position["y"] - pos["y"]) * (vehicle.position["y"] - pos["y"]) +
                                    (vehicle.position["z"] - pos["z"]) * (vehicle.position["z"] - pos["z"]);

                                if (dist >= 10) {
                                    vehicle.repair();
                                    vehicle.utils.setFuel(30);
                                    vehicle.maxFuel = 70;
                                    vehicle.position = pos;
                                    vehicle.rotation = new mp.Vector3(0, 0, pos.h);
                                    vehicle.setVariable("leftSignal", false);
                                    vehicle.setVariable("rightSignal", false);
                                    if (vehicle.getVariable("engine"))
                                        vehicle.utils.engineOn();
                                    spawnCount++;
                                }
                            } else {
                                destroyCount++;
                                vehicle.destroy();
                            }
                        }
                    });
                    var ms = new Date().getTime() - startTime;
                    mp.players.forEach((newrec) => {
                      if (newrec.sqlId) newrec.call("chat.custom.push", [`<a style="color: ${adm_color}">[A]</a> All vehicles spawn.`]);
                    });
                    terminal.info(`${player.name} ascended the free technique<br/>Auto on server: ${mp.vehicles.length}<br/>Spawn: ${spawnCount}<br/>Removed: ${destroyCount}<br/>Time: ${ms} ms`);
                } catch (err) {
                    terminal.log(err.stack);
                }
            }, Config.spawnCarsWaitTime);
        }
    },
    "fuel_all": {
        description: "Refill all vehicles on the server.",
        minLevel: 5,
        syntax: "",
        handler: (player, args) => {
            terminal.log(`${player.name} started to fill all the transport on the server.`);
            mp.players.forEach((newrec) => {
              if (newrec.sqlId) newrec.call("chat.custom.push", [`<a style="color: ${adm_color}">[A]</a> All vehicles will be tucked in through <a style="color: ${adm_color}">${Config.spawnCarsWaitTime / 1000}</a> seconds.`]);
            });
            setTimeout(function() {
                var startTime = new Date().getTime();
                try {
                    mp.vehicles.forEach((vehicle) => {
                       if (vehicle.owner < 1101) vehicle.utils.setFuel(vehicle.vehPropData.maxFuel);
                    });
                    var ms = new Date().getTime() - startTime;
                    terminal.info(`${player.name} tucked all transport! <br/>Time: ${ms} ms`);
                    mp.players.forEach((newrec) => {
                      if (newrec.sqlId) newrec.call("chat.custom.push", [`<a style="color: ${adm_color}">[A]</a> All vehicles are fueled.`]);
                    });
                } catch (err) {
                    terminal.log(err.stack);
                }
            }, Config.spawnCarsWaitTime);
        }
    },
    "del_car": {
        description: "Remove car.",
        minLevel: 3,
        syntax: "",
        handler: (player, args) => {
            var veh = player.vehicle;
            if (!veh) return terminal.error(`You are not in the car!`, player);
            terminal.info(`${player.name} deleted car`, player);
            veh.destroy();
        }
    },
    "admins": {
        description: "View the list of administrators online.",
        minLevel: 3,
        syntax: "",
        handler: (player, args) => {
          DB.Handle.query("SELECT * FROM characters WHERE admin>?", [0], (e, result) => {
              if (e) {
                  callback("Error executing the query in the database!");
                  return terminal.error(e);
              }
              if (result.length < 1) return terminal.error(`Error, no admins!`, player);
              let admins = ``;
              for (let i = 0; i < result.length; i++) {
                let target = mp.players.getBySqlId(result[i].id);
                admins += `[${i + 1}] NAME: <b>${result[i].name}</b> | Level of rights: <b>${result[i].admin}</b> | Online: <b>${target === undefined ? `not` : `Yes ( id: ${target.id} )`}</b> <br/>`;
              }
              terminal.log(`${admins}`, player);
          });
        }
    },
    "warn": {
        description: "Issue a warning.",
        minLevel: 3,
        syntax: "[id/name]:s [reason]:s",
        handler: (player, args) => {
            let date = new Date();
            if (getPlayerStatus(args[0]) === "on") {
                let rec = mp.players.at(args[0]);
                if (!rec) return terminal.error(`Player with ID: ${args[0]} not found!`, player);
                let warn = ++rec.warn;
                rec.utils.error(`${player.name} gave you warn ( ${warn}/3 )`);
                rec.utils.error(`Cause: ${args[1]}`);
                if (warn > 2) {
                    DB.Handle.query("UPDATE characters SET warn=? WHERE id=?", [0, rec.sqlId]);
                    DB.Handle.query("UPDATE characters SET warntime=? WHERE id=?", [0, rec.sqlId]);
                    DB.Handle.query("UPDATE characters SET ban=? WHERE id=?", [date.getTime() / 1000 + 30 * 24 * 60 * 60, rec.sqlId]);
                    rec.utils.error(`Your account is banned for 30 days!`);
                } else {
                    DB.Handle.query("UPDATE characters SET warn=? WHERE id=?", [warn, rec.sqlId]);
                    DB.Handle.query("UPDATE characters SET warntime=? WHERE id=?", [date.getTime() / 1000 + 15 * 24 * 60 * 60, rec.sqlId]);
                }
                rec.kick("warn");
                terminal.info(`${player.name} kick ${rec.name}. (${warn}/3) Cause: ${args[1]}`);

                mp.logs.addLog(`${player.name} kick ${rec.name}. (${warn}/3) Cause: ${args[1]}`, 'main', player.account.id, player.sqlId, { level: player.admin, reason: args[1], warn: warn });
                mp.logs.addLog(`${rec.name} got kicked ${player.name}. (${warn}/3) Cause: ${args[1]}`, 'main', rec.account.id, rec.sqlId, { time: args[1], warn: warn });

                //mp.logs.sendToDiscord(`${player.name} kick ${rec.name}. ( ${warn}/3 ) Cause: ${args[1]}`, `Social Club: ${player.socialClub}`, 22);
                mp.players.forEach((newrec) => {
                    if (newrec.sqlId) newrec.call("chat.custom.push", [`<a style="color: ${adm_color}">[A] ${player.name}</a> give ${warn} a warning <a style="color: ${adm_color}">${rec.name}.</a> <br/><a style="color: ${adm_color}">Cause:</a> ${args[1]}`]);
                });
            } else {
                let name = getSpecialName(args[0], player);
                if (!name) return terminal.error(`Format: LastName`, player);
                DB.Handle.query("SELECT * FROM characters WHERE name=?", [name], (e, result) => {
                    if (e) {
                        callback("Error executing the query in the database!");
                        return terminal.error(e);
                    }
                    if (result.length < 1) return terminal.error(`Player with name: ${args[0]} not found!`, player);
                    let target = result[0];
                    if (target) {
                        let warn = ++target.warn;
                        if (warn > 2) {
                            DB.Handle.query("UPDATE characters SET warn=? WHERE id=?", [0, target.id]);
                            DB.Handle.query("UPDATE characters SET warntime=? WHERE id=?", [0, target.id]);
                            DB.Handle.query("UPDATE characters SET ban=? WHERE id=?", [date.getTime() / 1000 + 30 * 24 * 60 * 60, target.id]);
                        } else {
                            DB.Handle.query("UPDATE characters SET warn=? WHERE id=?", [target, target.id]);
                            DB.Handle.query("UPDATE characters SET warntime=? WHERE id=?", [date.getTime() / 1000 + 15 * 24 * 60 * 60, target.id]);
                        }
                        terminal.info(`${player.name} give warn offline ${target.name}. ( ${warn}/3 ) Cause: ${args[1]}`);

                        mp.logs.addLog(`${player.name} give warn offline ${target.name}. (${warn}/3) Cause: ${args[1]}`, 'main', player.account.id, player.sqlId, { level: player.admin, reason: args[1], warn: warn });
                        mp.logs.addLog(`${target.name} got offline warn ${player.name}. (${warn}/3) Cause: ${args[1]}`, 'main', target.accountId, target.id, { time: args[1], warn: warn });

                        mp.players.forEach((newrec) => {
                            if (newrec.sqlId) newrec.call("chat.custom.push", [`<a style="color: ${adm_color}">[A] ${player.name}</a> give ${warn} warning <a style="color: ${adm_color}">${target.name}.</a> <br/><a style="color: ${adm_color}">Cause:</a> ${args[1]}`]);
                        });
                    }
                });
            }
        }
    },
    "unwarn": {
        description: "Remove the warning.",
        minLevel: 3,
        syntax: "[id/name]:s [reason]:s",
        handler: (player, args) => {
            let date = new Date();
            if (getPlayerStatus(args[0]) === "on") {
                let rec = mp.players.at(args[0]);
                if (!rec) return terminal.error(`Player with ID: ${args[0]} not found!`, player);
                if (rec.warn < 1) return terminal.error(`This player has 0 warning!`, player);
                let warn = --rec.warn;
                rec.utils.error(`${player.name} warn has removed from you! ( ${warn}/3 )`);
                rec.utils.error(`Cause: ${args[1]}`);
                if (warn > 0) {
                    DB.Handle.query("UPDATE characters SET warn=? WHERE id=?", [warn, rec.sqlId]);
                    DB.Handle.query("UPDATE characters SET warntime=? WHERE id=?", [0, rec.sqlId]);
                } else {
                    DB.Handle.query("UPDATE characters SET warn=? WHERE id=?", [0, rec.sqlId]);
                    DB.Handle.query("UPDATE characters SET warntime=? WHERE id=?", [0, rec.sqlId]);
                }
                terminal.info(`${player.name} took warn ${rec.name}. ( ${warn}/3 ) Cause: ${args[1]}`);

                mp.logs.addLog(`${player.name} took warn ${rec.name}. (${warn}/3) Cause: ${args[1]}`, 'main', player.account.id, player.sqlId, { level: player.admin, reason: args[1], warn: warn });
                mp.logs.addLog(`${rec.name} warned by administrator ${player.name}. (${warn}/3) Cause: ${args[1]}`, 'main', rec.account.id, rec.sqlId, { time: args[1], warn: warn });

                mp.players.forEach((newrec) => {
                    if (newrec.sqlId) newrec.call("chat.custom.push", [`<a style="color: ${adm_color}">[A] ${player.name}</a> removed warning <a style="color: ${adm_color}">${rec.name}.</a>`]);
                });
            } else {
                let name = getSpecialName(args[0], player);
                if (!name) return terminal.error(`Format: LastName`, player);
                DB.Handle.query("SELECT * FROM characters WHERE name=?", [name], (e, result) => {
                    if (e) {
                        callback("Error executing the query in the database!");
                        return terminal.error(e);
                    }
                    if (result.length < 1) return terminal.error(`Player with name: ${args[0]} not found!`, player);
                    let target = result[0];
                    if (target) {
                        if (target.warn < 1) return terminal.error(`This player has 0 warns!`, player);
                        let warn = --target.warn;
                        if (warn > 0) {
                            DB.Handle.query("UPDATE characters SET warn=? WHERE id=?", [warn, target.id]);
                            DB.Handle.query("UPDATE characters SET warntime=? WHERE id=?", [0, target.id]);
                        } else {
                            DB.Handle.query("UPDATE characters SET warn=? WHERE id=?", [0, target.id]);
                            DB.Handle.query("UPDATE characters SET warntime=? WHERE id=?", [0, target.id]);
                        }
                        terminal.info(`${player.name} took off warn offline ${target.name}. ( ${warn}/3 ) Cause: ${args[1]}`);

                        mp.logs.addLog(`${player.name} took off warn offline ${target.name}. (${warn}/3) Cause: ${args[1]}`, 'main', player.account.id, player.sqlId, { level: player.admin, reason: args[1], warn: warn });
                        mp.logs.addLog(`${target.name} warn was raise offline by administrator ${player.name}. (${warn}/3) Cause: ${args[1]}`, 'main', target.accountId, target.id, { time: args[1], warn: warn });

                        //mp.logs.sendToDiscord(`${player.name} снял warn оффлайн ${target.name}. ( ${warn}/3 ) Cause: ${args[1]}`, `Social Club: ${player.socialClub}`, 22);
                        mp.players.forEach((newrec) => {
                            if (newrec.sqlId) newrec.call("chat.custom.push", [`<a style="color: ${adm_color}">[A] ${player.name}</a> removed warning <a style="color: ${adm_color}">${target.name}.</a>`]);
                        });
                    }
                });
            }
        }
    },
    "get_ip": {
        description: "Find the player's IP.",
        minLevel: 3,
        syntax: "[id/name]:s",
        handler: (player, args) => {
            if (getPlayerStatus(args[0]) === "on") {
                let rec = mp.players.at(args[0]);
                if (!rec) return terminal.error(`Player with ID: ${args[0]} not found!`, player);
                terminal.info(`${player.name} checked IP address ${rec.name} ( IP: ${rec.ip} ) `);
            } else {
                let name = getSpecialName(args[0], player);
                if (!name) return terminal.error(`Format: LastName`, player);
                DB.Handle.query("SELECT * FROM characters WHERE name=?", [name], (e, result) => {
                    if (e) {
                        callback("Error executing the query in the database!");
                        return terminal.error(e);
                    }
                    if (result.length < 1) return terminal.error(`Player with name: ${args[0]} not found!`, player);
                    let target = result[0];
                    if (target) terminal.info(`${player.name} Checked offline IP address ${target.name} ( IP at last login: ${target.lastIp} | IP at registration: ${target.regIp} )`);
                });
            }
        }
    },
    "ban_ip": {
        description: "Ban ip address.",
        minLevel: 3,
        syntax: "[ip]:s",
        handler: (player, args) => {
            DB.Handle.query("SELECT * FROM ip_ban WHERE ip=?", args[0], (e, result) => {
                if (e) {
                    callback("Error executing the query in the database!");
                    return terminal.error(e);
                }
                if (result.length > 0) {
                    terminal.log("IP - " + args[0] + " already listed as a banned IP address!", player);
                    return;
                }

                DB.Handle.query("INSERT INTO ip_ban (ip) VALUES (?)", args[0], (error, sresult) => {
                    if (error) {
                        callback("Error executing the query in the database!");
                        return terminal.error(error);
                    }
                    terminal.info(`${player.name} banned IP - ${args[0]}`);
                    mp.logs.addLog(`${player.name} banned IP - ${args[0]}`, 'main', player.account.id, player.sqlId, { ip: args[0] });

                });
            });
        }
    },
    "unban_ip": {
        description: "Unban ip address.",
        minLevel: 3,
        syntax: "[ip]:s",
        handler: (player, args) => {
            DB.Handle.query("SELECT * FROM ip_ban WHERE ip=?", args[0], (e, result) => {
                if (e) {
                    callback("Error executing the query in the database!");
                    return terminal.error(e);
                }
                if (result.length < 1) {
                    terminal.log("IP - " + args[0] + " not listed as a banned IP!", player);
                    return;
                }

                DB.Handle.query(`DELETE FROM ip_ban WHERE ip=?`, args[0], (e, results) => {
                    if (e) {
                        callback("Error executing the query in the database!");
                        return terminal.error(e);
                    }
                });
                terminal.info(`${player.name} unban IP - ${args[0]}`);
                mp.logs.addLog(`${player.name} unban IP - ${args[0]}`, 'main', player.account.id, player.sqlId, { ip: args[0] });
            });
        }
    },
    "freeze": {
        description: "Freeze player.",
        minLevel: 3,
        syntax: "[player_id]:n [time]:n",
        handler: (player, args) => {
            var rec = mp.players.at(args[0]);
            if (!rec) return terminal.error(`Player with ID: ${args[0]} not found!`, player);
            if (args[1] < 1) return terminal.error(`Time from 0 seconds!`, player);
            rec.isFreeze = true;
            rec.call(`admin.control.freeze`, [args[1]]);
            rec.utils.info(`${player.name} froze you on ${args[1]} seconds`);
            terminal.info(`${player.name} froze ${rec.name} on ${args[1]} seconds`);
        }
    },
    "gg": {
        description: "Wish a nice game to player.",
        minLevel: 3,
        syntax: "[player_id]:n",
        handler: (player, args) => {
            var rec = mp.players.at(args[0]);
            if (!rec) return terminal.error(`Player with ID: ${args[0]} not found!`, player);
            rec.utils.warning("UNTAMED Hero administration wishes you a pleasant game!!");
            terminal.info(`${player.name} wished you a pleasant game ${rec.name}`);
        }
    },
    /*"set_name": {
        description: "Change the player's nickname.",
        minLevel: 3,
        syntax: "[old_name]:s [new_name]:s",
        handler: (player, args) => {
          let old_name = getSpecialName(args[0], player);
          let new_name = getSpecialName(args[1], player);
          if (!old_name || !new_name) return terminal.error(`Format: LastName`, player);
          DB.Handle.query("SELECT * FROM characters WHERE name=?", [old_name], (e, result) => {
              if (e) {
                  callback("Error executing the query in the database!");
                  return terminal.error(e);
              }
              if (result.length < 1) return terminal.error(`Player with name: ${args[0]} not found!`, player);
              let target = result[0];
              if (target) {
                  let rec = mp.players.getByName(name);
                  if (rec) {
                    rec.utils.error(`${player.name} changed your nickname to ${new_name}`);
                    rec.kick("changename");
                  }
                  DB.Handle.query("UPDATE characters SET name=? WHERE id=?", [new_name, target.id]);
                  terminal.info(`${player.name} changed character nickname ${old_name} on ${new_name}`);
              }
          });
        }
    },*/
    "mute": {
        description: "Give mute to the player.",
        minLevel: 3,
        syntax: "[player_id]:n [time]:n [reason]:s",
        handler: (player, args) => {
            var rec = mp.players.at(args[0]);
            if (!rec) return terminal.error(`Player with ID: ${args[0]} not found!`, player);
            if (args[1] < 1 || args[1] > 5000) return terminal.error(`Mut from 1 min. up to 5000 min!`, player);
            if (rec.mute > 0) return terminal.error(`The player is already muted!`, player);
            rec.startMute = parseInt(new Date().getTime() / 1000);
            rec.muteTimerId = timerId = setTimeout(() => {
                try {
                    rec.utils.stopMute(); // rec.utils.leaveDemorgan();
                } catch (err) {
                    console.log(err.stack);
                }
            }, (args[1] * 60) * 1000);
            rec.mute = args[1];
            rec.utils.error(`${player.name} muted for ${args[1]} minutes.`);
            rec.utils.error(`Cause: ${args[2]}`);
            DB.Handle.query("UPDATE characters SET mute=? WHERE id=?", [args[1], rec.sqlId]);
            terminal.info(`${player.name} muted ${rec.name} on ${args[1]} minutes. Cause: ${args[2]}`);

            mp.logs.addLog(`${player.name} muted ${rec.name} on ${args[1]} minutes. Cause: ${args[2]}`, 'main', player.account.id, player.sqlId, { level: player.admin, time: args[1], reason: args[2] });
            mp.logs.addLog(`${rec.name} received by the administrator ${player.name} on ${args[1]} minutes. Cause: ${args[2]}`, 'main', rec.account.id, rec.sqlId, { time: args[1], reason: args[2] });

            mp.players.forEach((newrec) => {
                if (newrec.sqlId) newrec.call("chat.custom.push", [`<a style="color: ${adm_color}">[A] ${player.name}</a> blocked chat <a style="color: ${adm_color}">${rec.name}</a> on <a style="color: ${adm_color}">${args[1]}</a> minutes <br/><a style="color: ${adm_color}">Cause:</a> ${args[2]}`]);
            });
        }
    },
    "unmute": {
        description: "Remove the mute from the player.",
        minLevel: 3,
        syntax: "[player_id]:n",
        handler: (player, args) => {
            var rec = mp.players.at(args[0]);
            if (!rec) return terminal.error(`Player with ID: ${args[0]} not found!`, player);
            if (rec.mute < 1) return terminal.error(`The player does not have mute`, player);
            rec.mute = 0;
            rec.utils.error(`${player.name} removed from mute.`);
            DB.Handle.query("UPDATE characters SET mute=? WHERE id=?", [0, rec.sqlId]);
            terminal.info(`${player.name} took a mute with ${rec.name}`);

            mp.logs.addLog(`${player.name} took a mute with ${rec.name}`, 'main', player.account.id, player.sqlId, { level: player.admin });
            mp.logs.addLog(`${rec.name} unmute the administrator ${player.name}`, 'main', rec.account.id, rec.sqlId, { });

            mp.players.forEach((newrec) => {
                if (newrec.sqlId) newrec.call("chat.custom.push", [`<a style="color: ${adm_color}">[A] ${player.name}</a> unblocked chat <a style="color: ${adm_color}">${rec.name}.</a>`]);
            });
        }
    },
    "mute_voice": {
        description: "Give a voice-mute to the player.",
        minLevel: 3,
        syntax: "[player_id]:n [time]:n [reason]:s",
        handler: (player, args) => {
            var rec = mp.players.at(args[0]);
            if (!rec) return terminal.error(`Player with ID: ${args[0]} not found!`, player);
            if (args[1] < 1 || args[1] > 5000) return terminal.error(`Voice-mute from 1 min. up to 5000 min!`, player);
            if (rec.vmute > 0) return terminal.error(`The player is already in voice-mute!`, player);
            rec.startVoiceMute = parseInt(new Date().getTime() / 1000);
            rec.muteVoiceTimerId = timerId = setTimeout(() => {
                try {
                    rec.utils.stopVoiceMute(); // rec.utils.leaveDemorgan();
                } catch (err) {
                    console.log(err.stack);
                }
            }, (args[1] * 60) * 1000);
            rec.vmute = args[1];
            rec.utils.error(`${player.name} gave you a microphone mute on ${args[1]} minutes.`);
            rec.utils.error(`Cause: ${args[2]}`);
            rec.call("control.voice.chat", [true]);
            DB.Handle.query("UPDATE characters SET vmute=? WHERE id=?", [args[1], rec.sqlId]);
            terminal.info(`${player.name} give Voice-mute ${rec.name} on ${args[1]} minutes. Cause: ${args[2]}`);

            mp.logs.addLog(`${player.name} give Voice-mute ${rec.name} on ${args[1]} minutes. Cause: ${args[2]}`, 'main', player.account.id, player.sqlId, { level: player.admin, time: args[1], reason: args[2] });
            mp.logs.addLog(`${rec.name} voice-muted by administrator ${player.name} on ${args[1]} minutes. Cause: ${args[2]}`, 'main', rec.account.id, rec.sqlId, { time: args[1], reason: args[2] });

            mp.players.forEach((newrec) => {
                if (newrec.sqlId) newrec.call("chat.custom.push", [`<a style="color: ${adm_color}">[A] ${player.name}</a> blocked the microphone <a style="color: ${adm_color}">${rec.name}</a> on <a style="color: ${adm_color}">${args[1]}</a> minutes <br/><a style="color: ${adm_color}">Cause:</a> ${args[2]}`]);
            });
        }
    },
    "unmute_voice": {
        description: "remove voice-mute from player.",
        minLevel: 3,
        syntax: "[player_id]:n",
        handler: (player, args) => {
            var rec = mp.players.at(args[0]);
            if (!rec) return terminal.error(`Player with ID: ${args[0]} not found!`, player);
            if (rec.vmute < 1) return terminal.error(`Player has no voice!`, player);
            rec.vmute = 0;
            rec.utils.error(`${player.name} removed a microphone mute from you.`);
            rec.call("control.voice.chat", [false]);
            DB.Handle.query("UPDATE characters SET vmute=? WHERE id=?", [0, rec.sqlId]);
            terminal.info(`${player.name} removed the microphone mute from ${rec.name}`);

            mp.logs.addLog(`${player.name} removed the microphone mute from ${rec.name}`, 'main', player.account.id, player.sqlId, { level: player.admin });
            mp.logs.addLog(`${rec.name} remove microphone mute by administrator ${player.name}`, 'main', rec.account.id, rec.sqlId, {  });

            mp.players.forEach((newrec) => {
                if (newrec.sqlId) newrec.call("chat.custom.push", [`<a style="color: ${adm_color}">[A] ${player.name}</a> unlocked microphone <a style="color: ${adm_color}">${rec.name}.</a>`]);
            });
        }
    },
    "invis": {
        description: "Make the player visible / invisible.",
        minLevel: 3,
        syntax: "[player_id]:n",
        handler: (player, args) => {
            var rec = mp.players.at(args[0]);
            if (!rec) return terminal.error(`Player with ID: ${args[0]} not found!`, player);
            if (rec.getVariable("ainvis")) {
                rec.setVariable("ainvis", null);
                // rec.call("admin.set.invisible", [true]);
                rec.alpha = 255;
                player.utils.error(`you made ${rec.name} visible`);
                rec.utils.error(`${player.name} made you visible`);
            } else {
                rec.setVariable("ainvis", true);
                // rec.call("admin.set.invisible", [false]);
                rec.alpha = 0;
                player.utils.error(`you made ${rec.name} invisible`);
                rec.utils.error(`${player.name} made you invisible`);
            }
        }
    },
    "ban_char": {
        description: "Ban a character",
        minLevel: 3,
        syntax: "[id/name]:s [days]:n [reason]:s",
        handler: (player, args) => {
            if (args[1] < 1 || args[1] > 5000) return terminal.error(`Ban from 1 day to 5000 days!`, player);
            if (getPlayerStatus(args[0]) === "on") {
                let rec = mp.players.at(args[0]);
                if (!rec) return terminal.error(`Player with ID: ${args[0]} not found!`, player);
                let date = new Date();
                DB.Handle.query("UPDATE characters SET ban=? WHERE id=?", [date.getTime() / 1000 + args[1] * 24 * 60 * 60, rec.sqlId]);
                rec.utils.error(`${player.name} banned you`);
                rec.utils.error(`Cause: ${args[2]}`);
                rec.kick(args[2]);
                terminal.info(`${player.name} banned character ${rec.name} on ${args[1]} days Cause: ${args[2]}`);

                // mp.logs.addLog(`${player.name} banned character ${rec.name} on ${args[1]} days Cause: ${args[2]}`, 'main', player.account.id, player.sqlId, { level: player.admin, days: args[1], reason: args[2] });
                // mp.logs.addLog(`${rec.name} character banned by admin ${player.name} on ${args[1]} days. Cause: ${args[2]}`, 'main', rec.account.id, rec.sqlId, { days: args[1], reason: args[2] });

                mp.players.forEach((newrec) => {
                    if (newrec.sqlId) newrec.call("chat.custom.push", [`<a style="color: ${adm_color}">[A] ${player.name}</a> banned <a style="color: ${adm_color}">${rec.name}</a> on <a style="color: ${adm_color}">${args[1]}</a> days. <br/><a style="color: ${adm_color}">Cause:</a> ${args[2]}`]);
                });
            } else {
                let name = getSpecialName(args[0], player);
                if (!name) return terminal.error(`Format: LastName`, player);
                DB.Handle.query("SELECT * FROM characters WHERE name=?", [name], (e, result) => {
                    if (e) {
                        callback("Error executing the query in the database!");
                        return terminal.error(e);
                    }
                    if (result.length < 1) return terminal.error(`Player with name: ${args[0]} not found!`, player);
                    let target = result[0];
                    if (target) {
                        let date = new Date();
                        DB.Handle.query("UPDATE characters SET ban=? WHERE id=?", [date.getTime() / 1000 + args[1] * 24 * 60 * 60, target.id]);
                        terminal.info(`${player.name} banned character offline ${target.name} on ${args[1]} days. Cause: ${args[2]}`);

                        //mp.logs.addLog(`${player.name} banned offline character ${rec.name} on ${args[1]} days. Cause: ${args[2]}`, 'main', player.account.id, player.sqlId, { level: player.admin, days: args[1], reason: args[2] });
                        //mp.logs.addLog(`${target.name} character banned by offline administrator ${player.name} on ${args[1]} days. Cause: ${args[2]}`, 'main', target.accountId, target.id, { days: args[1], reason: args[2] });

                        mp.players.forEach((newrec) => {
                            if (newrec.sqlId) newrec.call("chat.custom.push", [`<a style="color: ${adm_color}">[A] ${player.name}</a> banned <a style="color: ${adm_color}">${target.name}</a> on <a style="color: ${adm_color}">${args[1]}</a> days. <br/><a style="color: ${adm_color}">Cause:</a> ${args[2]}`]);
                        });
                    }
                });
            }
        }
    },
    "unban_char": {
        description: "Unban character",
        minLevel: 3,
        syntax: "[name]:s [reason]:s",
        handler: (player, args) => {
            let name = getSpecialName(args[0], player);
            if (!name) return terminal.error(`Format: LastName`, player);
            DB.Handle.query("SELECT * FROM characters WHERE name=?", [name], (e, result) => {
                if (e) {
                    callback("Error executing the query in the database!");
                    return terminal.error(e);
                }
                if (result.length < 1) return terminal.error(`Player with name: ${args[0]} not found!`, player);
                let target = result[0];
                if (target) {
                    if (target.ban === 0) return terminal.error(`This player is not banned!`, player);
                    DB.Handle.query("UPDATE characters SET ban=? WHERE id=?", [0, target.id]);
                    terminal.info(`${player.name} unban character ${target.name}. Cause: ${args[1]}`);

                    mp.logs.addLog(`${player.name} unban character ${target.name}. Cause: ${args[1]}`, 'main', player.account.id, player.sqlId, { level: player.admin, reason: args[1] });
                    mp.logs.addLog(`${target.name} character unbanned by administrator ${player.name}. Cause: ${args[1]}`, 'main', target.accountId, target.id, { reason: args[1] });

                    mp.players.forEach((newrec) => {
                        if (newrec.sqlId) newrec.call("chat.custom.push", [`<a style="color: ${adm_color}">[A] ${player.name}</a> unban <a style="color: ${adm_color}">${target.name}.</a>`]);
                    });
                }
            });
        }
    },
    "unfreeze": {
        description: "Defrost playerа.",
        minLevel: 3,
        syntax: "[player_id]:n",
        handler: (player, args) => {
            var rec = mp.players.at(args[0]);
            if (!rec) return terminal.error(`Player with ID: ${args[0]} not found!`, player);
            if (!rec.isFreeze) return terminal.error(`This player is not frozen!`, player);
            delete rec.isFreeze;
            rec.call(`admin.control.freeze`, [0]);
            rec.utils.info(`${player.name} defrosted you`);
            terminal.info(`${player.name} defrosted ${rec.name}`);
        }
    },
    "freeze_radius": {
        description: "Freeze players in radius.",
        minLevel: 3,
        syntax: "[radius]:n [time]:n",
        handler: (player, args) => {
            let dist = args[0];
            if (dist < 1 || dist > 20000) return terminal.error(`Distance from 1 to 20000!`, player);
            if (args[1] < 1) return terminal.error(`Time from 0 seconds!`, player);
            mp.players.forEachInRange(player.position, dist,
                (rec) => {
                    rec.isFreeze = true;
                    rec.call(`admin.control.freeze`, [args[1]]);
                    rec.utils.info(`${player.name} froze you on ${args[1]} seconds`);
                }
            );
            terminal.info(`${player.name} froze all players in radius ( ${dist}м. )`);
        }
    },
    "unfreeze_radius": {
        description: "Defrost players in radius.",
        minLevel: 3,
        syntax: "[radius]:n",
        handler: (player, args) => {
            let dist = args[0];
            if (dist < 1 || dist > 20000) return terminal.error(`Distance from 1 to 20000!`, player);
            mp.players.forEachInRange(player.position, dist,
                (rec) => {
                    if (rec.isFreeze) {
                        delete rec.isFreeze;
                        rec.call(`admin.control.freeze`, [0]);
                        rec.utils.info(`${player.name} defrosted you`);
                    }
                }
            );
            terminal.info(`${player.name} defrosted all players in radius ( ${dist}м. )`);
        }
    },
    "aspawn": {
        description: "Spawn the player on possible spawns.",
        minLevel: 3,
        syntax: "[player_id]:n",
        handler: (player, args) => {
            var rec = mp.players.at(args[0]);
            if (!rec) return terminal.error(`Player with ID: ${args[0]} not found!`, player);
            let spawnOpen = require("./events/CharacterEvents.js");
            if (spawnOpen.SpawnInfo.user_spawn.length < 1) return terminal.error(`There are no spawns on the server!`, player);
            let spawn = spawnOpen.SpawnInfo.user_spawn[getRandom(0, spawnOpen.SpawnInfo.user_spawn.length)];

            terminal.info(`${player.name} spawn ${rec.name}`);
            rec.position = new mp.Vector3(spawn.x, spawn.y, spawn.z);
            rec.heading = spawn.h;
            rec.dimension = 0;
            rec.utils.info(`${player.name} spawn you`);
        }
    },
    "bone_index": {
        description: "Get bone index by rank.",
        minLevel: 5,
        syntax: "[bone]:s",
        handler: (player, args) => {
            player.call("admin.get.boneindex", [args[0]]);
        }
    },

    "fuel": {
        description: "Change the amount of fuel in the car.",
        minLevel: 3,
        syntax: "[fuel]:n",
        handler: (player, args) => {
            if (!player.vehicle) return terminal.error("You are not in the car!", player);
            var veh = player.vehicle;
            if (!veh.maxFuel) veh.maxFuel = 70;
            if (veh.maxFuel < args[0]) return terminal.error(`Tank capacity: ${veh.maxFuel} l.`, player);

            veh.utils.setFuel(args[0]);
            player.call("setVehicleVar", [veh, "fuel", args[0]]);

            terminal.info(`${player.name} refuel cars with ID: ${veh.id} on ${args[0]} l.`);
        }
    },

    "settime": {
        description: "Change server time.",
        minLevel: 5,
        syntax: "[hours]:n",
        handler: (player, args) => {
            mp.world.time.hour = parseInt(args[0]);
            terminal.info(`${player.name} changed the time on the server on ${args[0]} h`);
        }
    },

    "alock": {
        description: 'Open / close cars within 5 m.',
        minLevel: 2,
        syntax: "",
        handler: (player) => {
            var count = 0;
            mp.vehicles.forEachInRange(player.position, 5, (veh) => {
                veh.locked = !veh.locked;
                count++;
            });
            if (count == 0) return terminal.error(`No cars nearby!`, player);
            terminal.info(`Cars open / closed: ${count} PC.`, player);
        }
    },

    "animator": {
        description: 'On / Off animation playback mode.',
        minLevel: 2,
        syntax: "",
        handler: (player) => {
            player.call("animator");
            terminal.info(`Animation Play Mode On / Off!`, player);
        }
    },

    "anim": {
        description: 'Play a specific animation.',
        minLevel: 2,
        syntax: "[animDict]:s [animName]:s",
        handler: (player, args) => {
            mp.events.call("anim", player, args[0], args[1]);
        }
    },

    "tp_interior": {
        description: "Teleport to the interior.",
        minLevel: 3,
        syntax: "[ид_интерьера]:n",
        handler: (player, args) => {
            var interior = mp.interiors.getBySqlId(args[0]);
            if (!interior) return terminal.error(`Interior with ID: ${args[0]} not found!`, player);
            player.position = new mp.Vector3(interior.x, interior.y, interior.z);
            player.heading = interior.h;

            terminal.info(`You teleported to the interior with ID: ${args[0]}`, player);
        }
    },

    "tp_garage": {
        description: "Teleport to the garage.",
        minLevel: 3,
        syntax: "[ид_гаража]:n",
        handler: (player, args) => {
            var garage = mp.garages.getBySqlId(args[0]);
            if (!garage) return terminal.error(`Garage with ID: ${args[0]} not found!`, player);
            player.position = new mp.Vector3(garage.x, garage.y, garage.z);
            player.heading = garage.h;

            terminal.info(`You teleported to the garage with ID: ${args[0]}`, player);
        }
    },

    "tp_vehicle": {
        description: "Teleport to the car.",
        minLevel: 3,
        syntax: "[vehicle_id]:n",
        handler: (player, args) => {
            var veh = mp.vehicles.at(args[0]);
            if (!veh) return terminal.error(`Car with ID: ${args[0]} not found!`, player);
            var pos = veh.position;
            player.position = new mp.Vector3(pos.x, pos.y, pos.z + 1);
            player.heading = veh.rotation.z;

            terminal.info(`You teleported to cars with ID: ${args[0]}`, player);
        }
    },

    "tp_object": {
        description: "Teleport to object.",
        minLevel: 3,
        syntax: "[object_id]:n",
        handler: (player, args) => {
            return terminal.warning(`We expect fix...`, player);
            var obj = mp.objects.at(args[0]);
            if (!obj) return terminal.error(`Object with ID: ${args[0]} not found!`, player);
            var pos = obj.position;
            player.position = new mp.Vector3(pos.x, pos.y, pos.z + 1);
            player.heading = obj.rotation.z;

            terminal.info(`You teleport to an object with ID: ${args[0]}`, player);
        }
    },

    "economy_list": {
        description: "View server economics.",
        minLevel: 5,
        syntax: "",
        handler: (player, args) => {
            var text = "Server economy:<br/>";
            for (var key in mp.economy) {
                var item = mp.economy[key];
                text += `${key} = ${item.value} (${item.description})<br/>`;
            }
            terminal.log(text, player);
        }
    },

    "set_economy": {
        description: "Change server economics. (view all variables - economy_list)",
        minLevel: 5,
        syntax: "[имя]:s [зonчение]:n",
        handler: (player, args) => {
            if (!mp.economy[args[0]]) return terminal.error(`Change ${args[0]} not found!`, player);

            mp.economy[args[0]].setValue(args[1]);
            terminal.info(`${player.name} changed the variable ${args[0]}=${args[1]} (server economics)`);
            mp.logs.addLog(`${player.name} changed the variable ${args[0]}=${args[1]} (server economics)`, 'main', player.account.id, player.sqlId, { level: player.admin, old: args[0], new: args[1] });
        }
    },

    "request_ipl": {
        description: "Download IPL. (for additional interiors and locations)",
        minLevel: 9,
        syntax: "[iplName]:s",
        handler: (player, args) => {
            // player.call("requestIpl", [args[0]]);
            DB.Handle.query("INSERT INTO ipls (name, request) VALUES (?, 1) ON DUPLICATE KEY UPDATE request=1", [args[0]], (e) => {
                if (e) {
                    console.log(`Request ipl ${e}`);
                    terminal.error(`IPL: ${args[0]} not loaded. Mistake`)
                    return;
                }

                mp.world.requestIpl(args[0]);
                terminal.info(`IPL: ${args[0]} loaded!`, player);
            });
        }
    },

    "remove_ipl": {
        description: "Unload IPL. (for additional interiors and locations)",
        minLevel: 9,
        syntax: "[iplName]:s",
        handler: (player, args) => {
            // player.call("removeIpl", [args[0]]);
            DB.Handle.query("INSERT INTO ipls (name, request) VALUES (?, 0) ON DUPLICATE KEY UPDATE request=0", [args[0]], (e) => {
                if (e) {
                    console.log(`Remove ipl ${e}`);
                    terminal.error(`IPL: ${args[0]} not unloaded. Mistake`)
                    return;
                }

                mp.world.removeIpl(args[0]);
                terminal.info(`IPL: ${args[0]} unloaded!`, player);
            });
        }
    },

    "give_money": {
        description: "Give money to the player.",
        minLevel: 9,
        syntax: "[playerId]:n [money]:n",
        handler: (player, args) => {
            var rec = mp.players.at(args[0]);
            if (!rec) return terminal.error(`Player with ID: ${args[0]} not found!`, player);
            if (args[1] < 1) args[1] = 1;

            if (rec.sqlId) rec.utils.setMoney(rec.money + args[1]);
            rec.utils.info(`${player.name} gave you ${args[1]}$`);
            terminal.info(`${player.name} gave ${args[1]}$ to the player ${rec.name}`);
            mp.logs.addLog(`${player.name} gave ${args[1]}$ to the player ${rec.name}`, 'main', player.account.id, player.sqlId, { level: player.admin, money: args[1] });
            mp.logs.addLog(`${rec.name} received ${args[1]}$ from admin ${player.name}`, 'main', rec.account.id, rec.sqlId, { money: args[1] });
        }
    },

    "give_donate": {
        description: "Give it to the player.",
        minLevel: 9,
        syntax: "[playerId]:n [donateMoney]:n",
        handler: (player, args) => {
            var rec = mp.players.at(args[0]);
            if (!rec) return terminal.error(`Player with ID: ${args[0]} not found!`, player);
            if (args[1] < 1) args[1] = 1;

            if (rec.sqlId) rec.utils.setDonate(rec.account.donate + args[1]);
            rec.utils.info(`${player.name} gave you ${args[1]} V/C`);
            terminal.info(`${player.name} give ${args[1]} V/C to the player ${rec.name}.`);
            mp.logs.addLog(`${player.name} gave out ${args[1]} to the player ${rec.name}`, 'main', player.account.id, player.sqlId, { level: player.admin, donate: args[1] });
            mp.logs.addLog(`${rec.name} received ${args[1]} V/C от admin ${player.name}`, 'main', rec.account.id, rec.sqlId, { donate: args[1] });
        }
    },

    "takeaway_money": {
        description: "Take away money from a player.",
        minLevel: 5,
        syntax: "[playerId]:n [money]:n",
        handler: (player, args) => {
            var rec = mp.players.at(args[0]);
            if (!rec) return terminal.error(`Player with ID: ${args[0]} not found!`, player);
            if (args[1] > rec.money) args[1] = rec.money;

            rec.utils.setMoney(rec.money - args[1]);
            rec.utils.info(`${player.name} took away from you ${args[1]}$`);
            terminal.info(`${player.name} took away ${args[1]}$ from player ${rec.name}`);

            mp.logs.addLog(`${player.name} took away ${args[1]}$ from player ${rec.name}`, 'main', player.account.id, player.sqlId, { level: player.admin, money: args[1] });
            mp.logs.addLog(`${rec.name} took away ${args[1]}$ from admin ${player.name}`, 'main', rec.account.id, rec.sqlId, { money: args[1] });
        }
    },

    "set_faction": {
        description: "Change player organization. (0 - dismiss)",
        minLevel: 5,
        syntax: "[playerId]:n [factionId]:n",
        handler: (player, args) => {
            var rec = mp.players.at(args[0]);
            if (!rec) return terminal.error(`Player with ID: ${args[0]} not found!`, player);

            for (var i = 0; i < mp.factions.length; i++) {
                var f = mp.factions[i];
                if (f.leader && f.leader == rec.sqlId) {
                    f.leader = 0;
                    f.leaderName = "";
                    DB.Handle.query("UPDATE factions SET leader=?,leaderName=? WHERE id=?", [0, "", f.sqlId]);
                }
            }

            if (args[1] == 0) {
                if (!rec.faction) return terminal.error(`Player is not an organization!`, player);
                rec.utils.setFaction(0);
                rec.utils.info(`${player.name} fired you from the organization`);
                return terminal.info(`${player.name} fired player ${rec.name} from the organization`);
            }
            var faction = mp.factions.getBySqlId(args[1]);
            if (!faction) return terminal.error(`Organization with ID: ${args[1]} not found!`);

            rec.utils.setFaction(faction.sqlId);
            rec.utils.info(`${player.name} took you to ${faction.name}`);
            terminal.info(`${player.name} accepted the player ${rec.name} to organization ${faction.name}`);
            //mp.logs.sendToDiscord(`${player.name} accepted the player ${rec.name} to organization ${faction.name}`, `Social Club: ${player.socialClub}`, 20);

        }
    },

    "set_dimension": {
        description: "Change Dimension.",
        minLevel: 3,
        syntax: "[dimension]:n",
        handler: (player, args) => {
            player.dimension = args[0];
            terminal.info(`You changed measurement on ${args[0]}!`);
        }
    },

    "makeadmin": {
        description: "Make player administrator.",
        minLevel: 6,
        syntax: "[player_id]:n [admin_level]:n",
        handler: (player, args) => {
            var rec = mp.players.at(args[0]);
            if (!rec) return terminal.error(`Player with ID: ${args[0]} not found!`, player);
            if (player.admin < args[1]) return terminal.error(`Max. level to - ${player.admin}!`, player);
            if (rec.admin > player.admin) return terminal.error(`${rec.name} has a higher admin level!`, player);

            rec.utils.setAdmin(args[1]);
            terminal.info(`${player.name} make administrator ${rec.name}`);
            rec.utils.success(`${player.name} make you administrator!`);
            //mp.logs.sendToDiscord(`${player.name} make administrator ${rec.name}`, `Social Club: ${player.socialClub}`, 20);
        }
    },

    "godmode": {
        description: "Immortality mode for the player.",
        minLevel: 3,
        syntax: "[player_id]:n",
        handler: (player, args) => {
            var rec = mp.players.at(args[0]);
            if (!rec) return terminal.error(`Player with ID: ${args[0]} not found!`, player);

            rec.isGodmode = !rec.isGodmode;
            rec.utils.setLocalVar("godmode", rec.isGodmode);
            if (rec.isGodmode) {
                rec.utils.info(`${player.name} made you immortal`);
                //terminal.info(`${player.name} made immortal ${rec.name}`);
            } else {
                rec.utils.info(`${player.name} turned off your immortality`);
                //terminal.info(`${player.name} turned off immortality ${rec.name}`);
            }
        }
    },

    "weapon": {
        description: "Gave a temporary weapon to the player.",
        minLevel: 3,
        syntax: "[player_id]:n [model]:s [ammo]:n",
        handler: (player, args) => {
            var rec = mp.players.at(args[0]);
            if (!rec) return terminal.error(`Player with ID: ${args[0]} not found!`, player);

            rec.giveWeapon(mp.joaat(args[1]), parseInt(args[2]));
            rec.utils.info(`${player.name} gave you a weapon`);
            terminal.info(`${player.name} gave a weapon ${args[1]} ${args[2]}`);
            //mp.logs.sendToDiscord(`${player.name} gave a weapon ${args[1]} ${args[2]}`, `Social Club: ${player.socialClub}`, 20);
        }
    },

    "spawncars": {
        description: "Create free auto on server.",
        minLevel: 4,
        syntax: "",
        handler: (player, args) => {
            terminal.log(`Free car will spawn through ${Config.spawnCarsWaitTime/1000} seconds.`);
            setTimeout(function() {
                var startTime = new Date().getTime();
                var spawnCount = 0,
                    destroyCount = 0;;
                try {
                    mp.vehicles.forEach((vehicle) => {
                        var result = vehicle.utils.spawn();
                        if (result == 0) spawnCount++;
                        else if (result == 2) destroyCount++;
                    });
                    var ms = new Date().getTime() - startTime;
                    terminal.info(`${player.name} ascended the free technique<br/>Auto on server: ${mp.vehicles.length}<br/>Spawn: ${spawnCount}<br/>Removed: ${destroyCount}<br/>Time: ${ms} ms`);
                } catch (err) {
                    terminal.log(err.stack);
                }
            }, Config.spawnCarsWaitTime);
        }
    },

    "spawn_faction_cars": {
        description: "Spread free auto organization on server.",
        minLevel: 4,
        syntax: "[faction_id]:n",
        handler: (player, args) => {
            var faction = mp.factions.getBySqlId(args[0]);
            if (!faction) return terminal.error(`Organization with ID: ${args[0]} not found!`, player);
            terminal.log(`Freedom car ${faction.name} will spawn through ${Config.spawnCarsWaitTime/1000} seconds.`);
            setTimeout(function() {
                var startTime = new Date().getTime();
                var spawnCount = 0,
                    destroyCount = 0;
                try {
                    mp.vehicles.forEach((vehicle) => {
                        if (vehicle.owner == faction.sqlId) {
                            var result = vehicle.utils.spawn();
                            if (result == 0) spawnCount++;
                            else if (result == 2) destroyCount++;
                        }
                    });
                    var ms = new Date().getTime() - startTime;
                    terminal.info(`${player.name} ascended the free technique ${faction.name}<br/>Car on server: ${mp.vehicles.length}<br/>Spawn: ${spawnCount}<br/>Removed: ${destroyCount}<br/>Time: ${ms} ms`);
                } catch (err) {
                    terminal.log(err.stack);
                }
            }, Config.spawnCarsWaitTime);
        }
    },

    "spawn_job_cars": {
        description: "Add free job car on server.",
        minLevel: 4,
        syntax: "[job_id]:n",
        handler: (player, args) => {
            var job = mp.jobs.getBySqlId(args[0]);
            if (!job) return terminal.error(`Job с ID: ${args[0]} not found!`, player);
            terminal.log(`Free work car ${job.name} will spawn through ${Config.spawnCarsWaitTime/1000} seconds.`);
            setTimeout(function() {
                var startTime = new Date().getTime();
                var spawnCount = 0,
                    destroyCount = 0;
                try {
                    mp.vehicles.forEach((vehicle) => {
                        if (vehicle.owner == -job.sqlId) {
                            var result = vehicle.utils.spawn();
                            if (result == 0) spawnCount++;
                            else if (result == 2) destroyCount++;
                        }
                    });
                    var ms = new Date().getTime() - startTime;
                    terminal.info(`${player.name} spawn free job car ${job.name}<br/>Auto on server: ${mp.vehicles.length}<br/>Spawn: ${spawnCount}<br/>Removed: ${destroyCount}<br/>Time: ${ms} ms`);
                } catch (err) {
                    terminal.log(err.stack);
                }
            }, Config.spawnCarsWaitTime);
        }
    },

    "spawn_range_cars": {
        description: "Spawn free cars in radius.",
        minLevel: 4,
        syntax: "[range]:n",
        handler: (player, args) => {
            args[0] = Math.clamp(args[0], 10, 500);
            terminal.log(`Spawn car in radius ${args[0]} м. will spawn through ${Config.spawnCarsWaitTime/1000} seconds.`);
            setTimeout(function() {
                var startTime = new Date().getTime();
                var spawnCount = 0,
                    destroyCount = 0;
                try {
                    mp.vehicles.forEachInRange(player.position, args[0], (vehicle) => {
                            var result = vehicle.utils.spawn();
                            if (result == 0) spawnCount++;
                            else if (result == 2) destroyCount++;
                    });
                    var ms = new Date().getTime() - startTime;
                    terminal.info(`${player.name} hit the free car in radius ${args[0]} м.<br/>Auto on server: ${mp.vehicles.length}<br/>Spawn: ${spawnCount}<br/>Removed: ${destroyCount}<br/>Time: ${ms} ms`);
                } catch (err) {
                    terminal.log(err.stack);
                }
            }, Config.spawnCarsWaitTime);
        }
    },

    "save_obj": {
        description: "Save object to DB (taken from / obj).",
        minLevel: 5,
        syntax: "",
        handler: (player, args) => {
            return terminal.warning(`We expect fix...`, player);
            if (!player.debugObj) return terminal.error(`Object not found! Create with / obj.`, player);
            var obj = player.debugObj;
            mp.objects.save(obj.name, obj.position, obj.rotation.z);
            terminal.info(`${player.name} saved object ${obj.name} in db`);
        }
    },

    "add_rent_veh": {
        description: "Add / update a rented car.",
        minLevel: 5,
        syntax: "[color1]:n [color2]:n",
        handler: (player, args) => {
            var newVehicle = player.vehicle;
            if (!newVehicle) return terminal.error(`You are not in the car!`, player);
            if (args[0] < 0 || args[1] < 0) return terminal.error(`Color cannot be less than 0!`, player);
            if (newVehicle.sqlId) {
                if (mp.isOwnerVehicle(newVehicle)) return player.utils.error(`This is a private car!`);
                DB.Handle.query("UPDATE vehicles SET owner=?,model=?,color1=?,color2=?,x=?,y=?,z=?,h=?,license=? WHERE id=?",
                    [-4001, newVehicle.name, args[0], args[1],
                        newVehicle.position.x, newVehicle.position.y, newVehicle.position.z, newVehicle.rotation.z, 0, newVehicle.sqlId
                    ], (e) => {
                        terminal.info(`${player.name} updated car for rent`, player);
                    });
            } else {
                DB.Handle.query("INSERT INTO vehicles (owner,model,color1,color2,x,y,z,h,license) VALUES (?,?,?,?,?,?,?,?,?)",
                    [-4001, newVehicle.name, args[0], args[1],
                        newVehicle.position.x, newVehicle.position.y, newVehicle.position.z,
                        newVehicle.rotation.z, 0
                    ], (e, result) => {
                        newVehicle.sqlId = result.insertId;
                        terminal.info(`${player.name} added car for rent`);
                    });
            }

            newVehicle.owner = -4001;
            newVehicle.spawnPos = newVehicle.position;
        }
    },

    "add_job_veh": {
        description: "Add / update the working auto (the color must be specified until the fix RAGEMP is fixed).",
        minLevel: 5,
        syntax: "[job_id]:n [color2]:n",
        handler: (player, args) => {
            var job = mp.jobs.getBySqlId(args[0]);
            if (!job) return terminal.error(`Job with the ID: ${args[0]} not found!`, player);

            var newVehicle = player.vehicle;
            if (!newVehicle) return terminal.error(`You are not in the car!`, player);
            args[0] *= -1;

            if (newVehicle.sqlId) {
                if (mp.isOwnerVehicle(newVehicle)) return player.utils.error(`This is a private car!`);
                DB.Handle.query("UPDATE vehicles SET owner=?,model=?,color1=?,color2=?,x=?,y=?,z=?,h=? WHERE id=?",
                    [args[0], newVehicle.name, newVehicle.getColor(0), args[1],
                        newVehicle.position.x, newVehicle.position.y, newVehicle.position.z, newVehicle.rotation.z, newVehicle.sqlId
                    ], (e) => {
                        terminal.info(`${player.name} updated job cars for ${job.name}`, player);
                    });
            } else {
                DB.Handle.query("INSERT INTO vehicles (owner,model,color1,color2,x,y,z,h) VALUES (?,?,?,?,?,?,?,?)",
                    [args[0], newVehicle.name, newVehicle.getColor(0), newVehicle.getColor(1),
                        newVehicle.position.x, newVehicle.position.y, newVehicle.position.z,
                        newVehicle.rotation.z
                    ], (e, result) => {
                        newVehicle.sqlId = result.insertId;
                        terminal.info(`${player.name} added job auto for ${job.name}`);
                    });
            }

            newVehicle.owner = args[0];
            newVehicle.spawnPos = newVehicle.position;
        }
    },

    "add_autosaloon_veh": {
        description: "Add a car for car dealership. Type: 1 - motorcycle, 2 - auto",
        minLevel: 9,
        syntax: "[title]:s [type]:n [price]:n [max]:n",
        handler: (player, args) => {
            var newVehicle = player.vehicle;
            if (!newVehicle) return terminal.error(`You are not in the car!`, player);
            DB.Handle.query("INSERT INTO configvehicle (model, brend, title, fuelTank, fuelRate, price, max) VALUES (?,?,?,?,?,?,?)",
                [newVehicle.name, 888, args[1], args[0], 50, 10, args[2], args[3]], (e, result) => {
                    mp.autosaloons.vehicles.push({
                        sqlId: mp.autosaloons.vehicles.length + 1,
                        modelHash: 888,
                        model: newVehicle.name,
                        brend: args[1],
                        title: args[0],
                        fuelTank: 50,
                        fuelRate: 10,
                        price: args[2],
                        max: args[3],
                        buyed: 0
                    });

                    newVehicle.destroy();

                    terminal.info(`${player.name} added transport ${newVehicle.name} in car dealership. ID: ${result.insertId}`);
                });
        }
    },

    "delete_autosaloon_veh": {
        description: "Remove car for car dealership.",
        minLevel: 9,
        syntax: "[id]:n",
        handler: (player, args) => {
            DB.Handle.query(`DELETE FROM configvehicle WHERE id = ?`, [args[0]], (e, result) => {
                if (result.length === 0) return player.utils.error(`This vehicle is not found in the showroom`);
                terminal.info(`${player.name} deleted transport ${newVehicle.name} car showroom. ID: ${result.insertId}`);
            });
        }
    },

    "add_newbie_veh": {
        description: "Add / update cars for beginners (color must be specified until the fix RAGEMP).",
        minLevel: 5,
        syntax: "[color2]:n",
        handler: (player, args) => {
            var newVehicle = player.vehicle;
            if (!newVehicle) return terminal.error(`You are not in the car!`, player);

            if (newVehicle.sqlId) {
                if (mp.isOwnerVehicle(newVehicle)) return player.utils.error(`This is a private car!`);
                DB.Handle.query("UPDATE vehicles SET owner=?,model=?,color1=?,color2=?,x=?,y=?,z=?,h=? WHERE id=?",
                    [-1001, newVehicle.name, newVehicle.getColor(0), args[0],
                        newVehicle.position.x, newVehicle.position.y, newVehicle.position.z, newVehicle.rotation.z, newVehicle.sqlId
                    ], (e) => {
                        terminal.info(`${player.name} updated cars for beginners`, player);
                    });
            } else {
                DB.Handle.query("INSERT INTO vehicles (owner,model,color1,color2,x,y,z,h) VALUES (?,?,?,?,?,?,?,?)",
                    [-1001, newVehicle.name, newVehicle.getColor(0), newVehicle.getColor(1),
                        newVehicle.position.x, newVehicle.position.y, newVehicle.position.z,
                        newVehicle.rotation.z
                    ], (e, result) => {
                        newVehicle.sqlId = result.insertId;
                        terminal.info(`${player.name} added car for newbies`);
                    });
            }

            newVehicle.owner = -1001;
            newVehicle.spawnPos = newVehicle.position;
        }
    },

    "add_lic_veh": {
        description: "Add / update auto for driving school (color2 must be specified until it is fixed RAGEMP).",
        minLevel: 5,
        syntax: "[color2]:n",
        handler: (player, args) => {
            var newVehicle = player.vehicle;
            if (!newVehicle) return terminal.error(`You are not in the car!`, player);

            if (newVehicle.sqlId) {
                if (mp.isOwnerVehicle(newVehicle)) return player.utils.error(`This is a private car!`);
                DB.Handle.query("UPDATE vehicles SET owner=?,model=?,color1=?,color2=?,x=?,y=?,z=?,h=? WHERE id=?",
                    [-2001, newVehicle.name, newVehicle.getColor(0), args[0],
                        newVehicle.position.x, newVehicle.position.y, newVehicle.position.z, newVehicle.rotation.z, newVehicle.sqlId
                    ], (e) => {
                        terminal.info(`${player.name} updated car for driving school`, player);
                    });
            } else {
                DB.Handle.query("INSERT INTO vehicles (owner,model,color1,color2,x,y,z,h) VALUES (?,?,?,?,?,?,?,?)",
                    [-2001, newVehicle.name, newVehicle.getColor(0), newVehicle.getColor(1),
                        newVehicle.position.x, newVehicle.position.y, newVehicle.position.z,
                        newVehicle.rotation.z
                    ], (e, result) => {
                        newVehicle.sqlId = result.insertId;
                        terminal.info(`${player.name} added car for driving school`);
                    });
            }

            newVehicle.owner = -2001;
            newVehicle.spawnPos = newVehicle.position;
        }
    },

    "add_farm_veh": {
        description: "Add / update auto for farm (color2 must be specified until RAGEMP is fixed).",
        minLevel: 5,
        syntax: "[color2]:n",
        handler: (player, args) => {
            var newVehicle = player.vehicle;
            if (!newVehicle) return terminal.error(`You are not in the car!`, player);

            if (newVehicle.sqlId) {
                if (mp.isOwnerVehicle(newVehicle)) return player.utils.error(`This is a private car!`);
                DB.Handle.query("UPDATE vehicles SET owner=?,model=?,color1=?,color2=?,x=?,y=?,z=?,h=? WHERE id=?",
                    [-3001, newVehicle.name, newVehicle.getColor(0), args[0],
                        newVehicle.position.x, newVehicle.position.y, newVehicle.position.z, newVehicle.rotation.z, newVehicle.sqlId
                    ], (e) => {
                        terminal.info(`${player.name} updated farm cars`, player);
                    });
            } else {
                DB.Handle.query("INSERT INTO vehicles (owner,model,color1,color2,x,y,z,h) VALUES (?,?,?,?,?,?,?,?)",
                    [-3001, newVehicle.name, newVehicle.getColor(0), newVehicle.getColor(1),
                        newVehicle.position.x, newVehicle.position.y, newVehicle.position.z,
                        newVehicle.rotation.z
                    ], (e, result) => {
                        newVehicle.sqlId = result.insertId;
                        terminal.info(`${player.name} added farm cars`);
                    });
            }

            newVehicle.owner = -3001;
            newVehicle.spawnPos = newVehicle.position;
        }
    },

    "restart": {
        description: "Server restart (linux only).",
        minLevel: 5,
        syntax: "",
        handler: (player, args) => {
            terminal.info(`${player.name} launched server restart via ${Config.restartWaitTime / 1000} seconds.`);
            //mp.logs.sendToDiscord(`${player.name} launched server restart via ${Config.restartWaitTime / 1000} seconds.`, `Social Club: ${player.socialClub}`, 20);
            mp.players.forEach((rec) => {
                if (rec.sqlId) {
                    rec.utils.info(`${player.name} started server restart after 10 seconds...`);
                    savePlayerDBParams(rec);
                    saveFarmFieldsDBParams();
                }
            });
            setTimeout(() => {
                process.exit();
            }, Config.restartWaitTime);
        }
    },

    "update": {
        description: "Update mod to afterdays version.",
        minLevel: 5,
        syntax: "[branch]:s",
        handler: (player, args) => {
            // var branches = ["master", "testing", "feature/console"];
            // if (!branches.includes(args[0])) return terminal.error(`Never branch! (${branches})`);
            terminal.info(`${player.name} updates server...`);
            var exec = require("exec");
            exec(`cd ${__dirname} && git clean -d -f && git stash && git checkout ${args[0]} && git pull`, (error, stdout, stderr) => {
                if (error) console.log(stderr);
                console.log(stdout);
                terminal.log(`The latest version of the mod is updated! Restart required.`);

                mp.players.forEach((rec) => {
                    if (rec.sqlId) {
                        rec.utils.success(`${player.name} updated version of the mod! (${args[0]})`);
                    }
                });
            });
        }
    },

    "jobs_list": {
        description: "View the list of job.",
        minLevel: 5,
        syntax: "",
        handler: (player) => {
            var text = "";
            for (var i = 0; i < mp.jobs.length; i++) {
                var job = mp.jobs[i];
                text += `${job.sqlId}) ${job.name} (${job.level} lvl)<br/>`;
            }

            terminal.log(text, player);
        }
    },

    "set_job_name": {
        description: "Change job title.",
        minLevel: 5,
        syntax: "[job_id]:n [name]:s",
        handler: (player, args) => {
            var job = mp.jobs.getBySqlId(args[0]);
            if (!job) return terminal.error(`Job with ID: ${args[0]} not found!`, player);

            terminal.info(`${player.name} changed the name of the organization with ID: ${args[0]}!`);
            args.splice(0, 1);
            job.setName(args.join(" "));
        }
    },

    "set_job_level": {
        description: "Change Min. player level for job.",
        minLevel: 5,
        syntax: "[job_id]:n [level]:n",
        handler: (player, args) => {
            var job = mp.jobs.getBySqlId(args[0]);
            if (!job) return terminal.error(`Job with ID: ${args[0]} not found!`, player);

            terminal.info(`${player.name} changed the name of the min. job level with ID: ${args[0]}!`);
            job.setLevel(args[1]);
        }
    },

    "set_job": {
        description: "Change player job.",
        minLevel: 3,
        syntax: "[player_id]:n [job_id]:n",
        handler: (player, args) => {
            var rec = mp.players.at(args[0]);
            if (!rec) return terminal.error(`Player with ID: ${args[0]} not found!`, player);

            rec.utils.setJob(args[1]);
            terminal.info(`${player.name} changed jobs ${rec.name}`);
        }
    },

    "set_job_skills": {
        description: "Change player job skills.",
        minLevel: 3,
        syntax: "[player_id]:n [job_id]:n [exp]:n",
        handler: (player, args) => {
            var rec = mp.players.at(args[0]);
            if (!rec) return terminal.error(`Player with ID: ${args[0]} not found!`, player);

            var job = mp.jobs.getBySqlId(args[1]);
            if (!job) return terminal.error(`Job with ID: ${args[1]} not found!`, player);


            rec.utils.setJobSkills(job.sqlId, args[2]);
            terminal.info(`${player.name} changed the job skills to ${rec.name}`);
        }
    },

    "set_skin": {
        description: "Change player skin.",
        minLevel: 3,
        syntax: "[player_id]:n [skin]:s",
        handler: (player, args) => {
            var rec = mp.players.at(args[0]);
            if (!rec) return terminal.error(`Player with ID: ${args[0]} not found!`, player);

            rec.model = mp.joaat(args[1]);
            terminal.info(`${player.name} changed skin  ${rec.name}`);
        }
    },

    "set_walking": {
        description: "Change player's walk.",
        minLevel: 3,
        syntax: "[player_id]:n [animSet]:s",
        handler: (player, args) => {
            var rec = mp.players.at(args[0]);
            if (!rec) return terminal.error(`Player with ID: ${args[0]} not found!`, player);

            rec.setVariable("walking", args[1]);
        }
    },

    "give_licenses": {
        description: "Give all licenses to the player.",
        minLevel: 4,
        syntax: "[player_id]:n",
        handler: (player, args) => {
            var rec = mp.players.at(args[0]);
            if (!rec) return terminal.error(`Player with ID: ${args[0]} not found!`, player);

            var docs = rec.inventory.getArrayByItemId(16);
            if (!Object.keys(docs).length) {
                var params = {
                    owner: rec.sqlId,
                    licenses: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17],
                    weapon: [0, 0, 0, 0, 0, 0, 0],
                    work: []
                };
                mp.fullDeleteItemsByParams(16, ["owner"], [rec.sqlId]);
                rec.inventory.add(16, params, null, (e) => {
                    if (e) return terminal.error(e, player);
                    terminal.info(`${player.name} give documents with licenses to the player ${rec.name}`);
                });
            } else {
                for (var key in docs) {
                    if (docs[key].params.owner == rec.sqlId) {
                        docs[key].params.licenses = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17];
                        rec.inventory.updateParams(docs[key].id, docs[key]);
                        //mp.logs.sendToDiscord(`${player.name} added licenses to player documents ${rec.name}`, `Social Club: ${player.socialClub}`, 20);
                        return terminal.info(`${player.name} added licenses to player documents ${rec.name}`);
                    }
                }
                terminal.error(`Failed to give licenses!`, player);
            }

        }
    },

  /*  "setlang": {
        description: "Set your language..",
        minLevel: 1,
        syntax: "[player_id]:n",
        handler: (player, id) => {
                const languages = ['eng', 'rus', 'ger', 'br', 'zhs', 'zht', 'cs', 'ro',];
                const lang = languages[id];
                if (!lang) return;
                player.notify(`~g~${i18n.get('basic', 'success', player.lang)}!`);
                misc.query(`UPDATE users SET lang = '${lang}' WHERE id = '${player.guid}'`);
                player.lang = lang;
        }
    }, */
    "change_lang": {
        description: "Change language.",
        minLevel: 1,
        syntax: "[login]:s [lang]:s",
        handler: (player, args) => {
            DB.Handle.query("SELECT * FROM accounts WHERE login=?", [args[0]], (e, result) => {
                if (e) return terminal.error(e);
                if (result.length < 1) return terminal.error(`Player with login: ${args[0]} not found!`, player);
                let rec = result[0];
                let recPlayer = mp.players.getByLogin(args[0]);
                if (rec) {
                    terminal.info(`${player.name} changed account lang ${args[0]} on ${args[1]}`);
                    mp.logs.addLog(`${player.name} Changed account ${args[0]} main language on ${args[1]}`, 'main', player.account.id, player.sqlId, { level: player.admin, lang: args[1], login: args[0] });
                /* if(recPlayer) player.notifyWithPicture(`${i18n.get('basic', 'informations', player.lang)}`, 'Admin: ~o~${player.name}', `${i18n.get('basic', 'adminChangeLang', player.lang)} ~b~${args[1]}`, "CHAR_SOCIAL_CLUB");
                */
                   if(recPlayer) recPlayer.notifyWithPicture(`${i18n.get('basic', 'informations', player.lang)}`, `Admin: ~o~${player.name}`, `${i18n.get('admin', 'adminChangeSettings', player.lang)} ~n~${i18n.get('admin', 'adminPlayerName', player.lang)} ~b~${args[0]} ~n~~w~${i18n.get('admin', 'adminLangName', player.lang)} ~b~${args[1]}`, "CHAR_SOCIAL_CLUB");
                    DB.Handle.query(`UPDATE accounts SET lang=? WHERE login=?`, [args[1], args[0]]);                
				
				player.lang = args[1];
				}
            });
        }
    },	

    "terminal_cmd_name": {
        description: "Change team name.",
        minLevel: 6,
        syntax: "[cmd_name]:s [name]:s",
        handler: (player, args) => {
            var cmd = cmds[args[0]];
            if (!cmd) return terminal.error(`Team ${args[0]} not found!`, player);
            if (cmds[args[1]]) return terminal.error(`Team ${args[1]} already exists!`, player);

            DB.Handle.query(`SELECT * FROM terminal_cmds WHERE name=?`, [args[0]], (e, result) => {
                terminal.info(`${player.name} changed the team ${args[0]} on ${args[1]}`);
                if (!result.length) {
                    DB.Handle.query(`INSERT INTO terminal_cmds (cmd,name,description,minLevel) VALUES (?,?,?,?)`,
                        [args[0], args[1], cmd.description, cmd.minLevel]);
                } else {
                    DB.Handle.query(`UPDATE terminal_cmds SET name=? WHERE name=?`, [args[1], args[0]]);
                }
                delete cmds[args[0]];
                cmds[args[1]] = cmd;
            });
        }
    },

    "terminal_cmd_description": {
        description: "Change team description.",
        minLevel: 6,
        syntax: "[cmd_name]:s [description]:s",
        handler: (player, args) => {
            var cmdName = args[0];
            args.splice(0, 1);
            var description = args.join(" ");
            var cmd = cmds[cmdName];
            if (!cmd) return terminal.error(`Team ${cmdName} not found!`, player);

            DB.Handle.query(`SELECT * FROM terminal_cmds WHERE name=?`, [cmdName], (e, result) => {
                terminal.info(`${player.name} changed the team description ${cmdName}`);
                if (!result.length) {
                    DB.Handle.query(`INSERT INTO terminal_cmds (cmd,name,description,minLevel) VALUES (?,?,?,?)`,
                        [cmdName, cmdName, description, cmd.minLevel]);
                } else {
                    DB.Handle.query(`UPDATE terminal_cmds SET description=? WHERE name=?`, [description, cmdName]);
                }
                cmd.description = description;
            });
        }
    },

    "terminal_cmd_minlevel": {
        description: "Change Min. team level.",
        minLevel: 6,
        syntax: "[cmd_name]:s [minLevel]:n",
        handler: (player, args) => {
            var cmdName = args[0];
            var cmd = cmds[cmdName];
            if (!cmd) return terminal.error(`Team ${cmdName} not found!`, player);
            if (player.admin < args[1]) return terminal.error(`Max. level to change - ${player.admin}!`, player);
            if (cmd.minLevel > player.admin) return terminal.error(`This team is not available to you!`, player);

            DB.Handle.query(`SELECT * FROM terminal_cmds WHERE name=?`, [cmdName], (e, result) => {
                terminal.info(`${player.name} changed min. team level ${cmdName}`);
                if (!result.length) {
                    DB.Handle.query(`INSERT INTO terminal_cmds (cmd,name,description,minLevel) VALUES (?,?,?,?)`,
                        [cmdName, cmdName, cmd.description, args[1]]);
                } else {
                    DB.Handle.query(`UPDATE terminal_cmds SET minLevel=? WHERE name=?`, [args[1], cmdName]);
                }
                cmd.minLevel = args[1];
            });
        }
    },

    "create_tpmarker": {
        description: "Create a marker for teleport. (specify the coordinates of the end marker)",
        minLevel: 6,
        syntax: "[x]:n [y]:n [z]:n [h]:n",
        handler: (player, args) => {
            var data = {
                x: player.position.x,
                y: player.position.y,
                z: player.position.z - 1,
                h: player.heading,
                tpX: args[0],
                tpY: args[1],
                tpZ: args[2] - 1,
                tpH: args[3],
            };
            var dist = player.dist(new mp.Vector3(data.tpX, data.tpY, data.tpZ));
            if (dist < 2) return terminal.error(`Markers are too close to each other!`, player);
            DB.Handle.query("INSERT INTO markers_tp (x,y,z,h,tpX,tpY,tpZ,tpH) VALUES (?,?,?,?,?,?,?,?)",
                [data.x, data.y, data.z, data.h, data.tpX, data.tpY, data.tpZ, data.tpH], (e, result) => {
                    data.id = result.insertId;
                    createTpMarker(data);
                    terminal.info(`${player.name} created a TP marker number${data.id}`);
                });
        }
    },

    "delete_tpmarker": {
        description: "Remove marker for teleport.",
        minLevel: 6,
        syntax: "",
        handler: (player, args) => {
            mp.markers.forEachInRange(player.position, 2, (m) => {
                if (m.colshape.tpMarker) {
                    DB.Handle.query("DELETE FROM markers_tp WHERE id=?", m.sqlId);
                    terminal.error(`${player.name} deleted TP-Marker No.${m.sqlId}`);

                    m.colshape.targetMarker.destroy();
                    m.destroy();
                }
            });
        }
    },

    "create_ped": {
        description: "Create peda.",
        minLevel: 6,
        syntax: "[model]:s",
        handler: (player, args) => {
            var pos = player.position;
            DB.Handle.query("INSERT INTO peds (model,x,y,z,h) VALUES (?,?,?,?,?)",
                [args[0], pos.x, pos.y, pos.z, player.heading], (e, result) => {
                    var data = {
                        sqlId: result.insertId,
                        position: pos,
                        heading: player.heading,
                        hash: mp.joaat(args[0].trim()),
                    };
                    mp.dbPeds.push(data);
                    mp.players.forEach((rec) => {
                        if (rec.sqlId) rec.call(`peds.create`, [
                            [data]
                        ]);
                    });

                    terminal.info(`${player.name} created a ped with ID: ${data.sqlId}`);
                });
        }
    },

    "delete_ped": {
        description: "Remove the nearest ped.",
        minLevel: 6,
        syntax: "",
        handler: (player, args) => {
            var ped = mp.dbPeds.getNear(player);
            if (!ped) return terminal.error(`Ped not found nearby!`, player);

            mp.dbPeds.deletePed(ped);
            terminal.info(`${player.name} deleted ped with ID: ${ped.sqlId}`);
        }
    },

    "clear_chat": {
        description: "Clear chat.",
        minLevel: 6,
        syntax: "",
        handler: (player, args) => {
            mp.players.forEach((rec) => {
                if (rec.sqlId) rec.call(`chat.clear`, [player.id]);
            });
            terminal.info(`${player.name} cleared chat`);
        }
    },

    "refresh_whitelist": {
        description: "Refresh whitelist.",
        minLevel: 9,
        syntax: "",
        handler: (player, args) => {
            whitelist.Refresh();
        }
    },

    "give_car_keys": {
        description: "Make the admin-car personal and give the keys.",
        minLevel: 9,
        syntax: "",
        handler: (player, args) => {
            if (!player.vehicle) return terminal.error(`You are not in the car!`, player);
            if (player.vehicle.sqlId) return terminal.error(`Car is not admin's!`);
            var freeSlot = player.inventory.findFreeSlot(54);
            if (!freeSlot) return terminal.error(`Make room for keys!`, player);
            var veh = player.vehicle;
            veh.owner = player.sqlId + 2000;

            DB.Handle.query("INSERT INTO vehicles (owner,model,color1,color2,x,y,z,h) VALUES (?,?,?,?,?,?,?,?)",
                [veh.owner, veh.name, veh.getColor(0), veh.getColor(1),
                    veh.position.x, veh.position.y, veh.position.z,
                    veh.rotation.z
                ], (e, result) => {
                    veh.sqlId = result.insertId;
                    terminal.info(`${player.name} made a car ${veh.name} personal `);

                    var params = {
                        owner: player.sqlId,
                        car: veh.sqlId,
                        model: veh.name
                    };

                    player.inventory.add(54, params, null, (e) => {
                        if (e) return terminal.error(e, player);
                    });
                });

            veh.spawnPos = veh.position;
        }
    },
    "add_green_zone": {
        description: "Add green zone",
        minLevel: 9,
        syntax: "",
        handler: (player) => {
            player.call("green_zone::addRemove", [true]);
        }
    },
    "remove_green_zone": {
        description: "Delete green zone",
        minLevel: 9,
        syntax: "",
        handler: (player) => {
            player.call("green_zone::addRemove", [false]);
        }
    },

    "q": {
        description: "Disconnect from server.",
        minLevel: 1,
        syntax: "",
        handler: (player, args) => {
            player.kick();
        }
    },





    /*"chat": {
            description: 'onписать в чат от другого игрока.',
            minLevel: 4,
            syntax: '[playerId]:n [text]:s',
            handler: (player, args) => {
                  var id = parseInt(args[0]);
                  args.splice(0, 1);

                  mp.players.forEach(_player => {
                        if (_player.id == id) {
                              mp.events.call("playerChat", _player, args.join(' '));
                        }
                  });
            }
      },
      "setmoney": {
            description: 'Change себе количество onличных.',
            minLevel: 6,
            syntax: '[money]:n',
            handler: (player, args) => {
                  args[0] = parseInt(args[0]);
                  if (args[0] > 100000000) return terminal.error(`Сумма очень большая!`, player);
                  player.utils.setMoney(args[0]);
                  terminal.info(`${player.name} установил себе onличные: ${args[0]}$`);
            }
      },

      "warn": {
            description: "Выдать warn игроку.",
            minLevel: 2,
            syntax: "[playerId]:n [reason]:s",
            handler: (player, args) => {

                  var recipient = mp.findPlayerByIdOrNickname(args[0]);
                  if (!recipient) return terminal.error(`Игрок не onйден!`,player);

                  args.splice(0, 1);
                  var reason = args.join(" ");
                  var date = new Date();
                  if (recipient.warn == 0) {
                  	//выдаем warn
                  	DB.Handle.query("UPDATE characters SET warn=? WHERE id=?", [date.getTime() / 1000 + 7 * 24 * 60 * 60, recipient.sqlId]);
                  	recipient.utils.error(`Вам выдан warn on 7 days от ${player.name}.`);
                        recipient.utils.error(`Cause: ${reason}`);
                        terminal.info(`${player.name} выдал warn ${recipient.name}: ${reason}`);
                  	recipient.kick(reason);

                  	mp.players.forEach(_player => {
                  		_player.utils.info(`${player.name} выдал warn ${recipient.name}`);
                              _player.utils.info(`Cause: ${reason}`);
                  	});
                  } else {
                  	//баним при повторной выдаче
                  	DB.Handle.query("UPDATE characters SET warn=?,ban=? WHERE id=?", [0, date.getTime() / 1000 + 7 * 24 * 60 * 60, recipient.sqlId]);

                  	recipient.utils.error(`${player.name} banned Вас за 2 warnа`);
                        recipient.utils.error(`Cause: ${reason}`);
                        terminal.info(`${player.name} banned ${recipient.name}: ${reason} [2 warnа]`);
                  	recipient.kick(reason);

                  	mp.players.forEach(_player => {
                  		_player.utils.info(`${player.name} banned ${recipient.name} за 2 warnа`);
                              _player.utils.info(`Cause: ${reason}`);
                  	});
                  }
            }
      },
      "ban": {
            description: "Выдать бан игроку",
            minLevel: 3,
            syntax: "[playerId]:n [days]:n [reason]:s",
            handler: (player, args) => {
            	var recipient = mp.findPlayerByIdOrNickname(args[0]);
        		if (!recipient) return terminal.error(`Игрок не onйден!`,player);
        		if (args[1] > 30) return terminal.error(`Не более 30 days!`,player);

            	var date = new Date();
            	DB.Handle.query("UPDATE characters SET ban=? WHERE id=?", [date.getTime() / 1000 + args[1] * 24 * 60 * 60, recipient.sqlId]);
                  args.splice(0,2);
                  var reason = args.join(" ");

            	recipient.utils.error(`${player.name} banned Вас`);
                  recipient.utils.error(`Cause: ${reason}`);
                  terminal.info(`${player.name} banned ${recipient.name} on ${args[1]} days: ${reason}`);
            	recipient.kick(reason);

            	mp.players.forEach(_player => {
                    _player.utils.info(`${player.name} banned ${recipient.name}`);
                    mp.logs.sendToDiscord(`${player.name} banned ${recipient.name}. Cause: ${reason}`, `Social Club: ${player.socialClub}`, 22);
                        _player.utils.info(`Cause: ${reason}`);
            	});
            }
      },
      "unban": {
            description: "Снять бан с игрока.",
            minLevel: 4,
            syntax: "[name]:s [second_name]:s",
            handler: (player, args) => {
                  DB.Handle.query("UPDATE characters SET ban=? WHERE name=? AND second_name=?", [10, args[0], args[1]]);
                  terminal.info(`${player.name} unban ${args[0]} ${args[1]}`);
            }
      },
      "setcam": {
            description: "Устаonвить камеру on указанные коордиonты.",
            minLevel: 1,
            syntax: "[x]:n [y]:n [z]:n [rX]:n [rY]:n [rZ]:n",
            handler: (player, args) => {
                  args[0] = parseFloat(args[0]);
                  args[1] = parseFloat(args[1]);
                  args[2] = parseFloat(args[2]);
                  args[3] = parseFloat(args[3]);
                  args[4] = parseFloat(args[4]);
                  args[5] = parseFloat(args[5]);
                  var pos = new mp.Vector3(args[0], args[1], args[2]);
                  var rot = new mp.Vector3(args[3], args[4], args[5]);
                  player.call("setCamera", [pos, rot]);
                  terminal.info(`Камера установлеon.`,player);
            },
      },
      "cutscene": {
            description: "Запустить катсцену по onзванию.",
            minLevel: 1,
            syntax: "[cutsceneName]:s",
            handler: (player, args) => {
                  player.call("startCutscene", [args[0]]);
                  terminal.info(`Катсцеon запущеon.`,player);
            }
      },
      "mute": {
            description: "Выдать мут игроку.",
            minLevel: 1,
            syntax: "[playerId]:n [minutes]:n [reason]:s",
            handler: (player, args) => {
            	var recipient = mp.findPlayerByIdOrNickname(args[0]);
            	if (!recipient) return terminal.error(`Игрок не onйден!`,player);

            	var minutes = args[1];
                  args.splice(0,2);
            	var reason = args.join(" ");
                  if (minutes > 180) return terminal.error(`Не более 3 Hours!`,player);

            	var date = new Date();
            	DB.Handle.query("UPDATE characters SET mute=? WHERE id=?", [date.getTime() / 1000 + minutes * 60, recipient.sqlId]);
            	recipient.mute = date.getTime() / 1000 + minutes * 60;
                  terminal.info(`${player.name} выдал мут ${recipient.name} on ${minutes} минут: ${reason}`);

      		mp.players.forEach(_player => {
  				if (_player.utils) {
        	    			_player.utils.info(`${player.name} выдал мут ${recipient.name}.`);
                              _player.utils.info(`Cause: ${reason}`);
                        }
      		});
            }
      },
      "unmute": {
            description: "Снять мут с игрока.",
            minLevel: 2,
            syntax: "[playerId]:n",
            handler: (player, args) => {
            	var recipient = mp.findPlayerByIdOrNickname(args[0]);
            	if (!recipient) return terminal.error(`Игрок не onйден!`,player);
            	if (!recipient.mute) return terminal.error(`Игрок не имеет мут!`,player);

            	recipient.mute = 0;
            	DB.Handle.query("UPDATE characters SET mute=? WHERE id=?", [0, recipient.sqlId]);
            	terminal.info(`${player.name} снял мут с ${recipient.name}`);
        		recipient.utils.info(`${player.name} снял с Вас мут`);
            }
      },

      "makeadmin": {
            description: "onзonчить игрока администратором.",
            minLevel: 6,
            syntax: "[playerId]:n [admin_level]:n",
            handler: (player, args) => {
                  if (args[1] < 0 || args[1] > 6) return terminal.error("Level адмиon 1-6!",player);

                  var recipient = mp.findPlayerByIdOrNickname(args[0]);
                  if (!recipient) return terminal.error("Player not found!",player);

                  if (args[1] == 0) {
                        var index = mp.listenAllIds.indexOf(player.id);
                        if (index != -1) mp.listenAllIds.splice(index, 1);
                  }

                  DB.Handle.query("UPDATE characters SET admin=?,helper=? WHERE id = ?", [args[1], 0, recipient.sqlId], function (e) {
                  	recipient.admin = args[1];
                  	recipient.helper = 0;
            		recipient.utils.info(`${player.name} onзonчил Вас админом`);
                        terminal.info(`${player.name} onзonчил ${recipient.name} администратором ${args[1]}lvl.`);
            	});

            }
      },
      "makehelper": {
            description: "onзonчить игрока хелпером.",
            minLevel: 5,
            syntax: "[playerId]:n [helper_level]:n",
            handler: (player, args) => {
                  if (args[1] < 0 || args[1] > 5) return terminal.error("Level хелпера 1-5!", player);

                  var recipient = mp.findPlayerByIdOrNickname(args[0]);
                  if (!recipient) return terminal.error("Player not found!",player);

                  if (recipient.admin) return terminal.error(`Игрок является администратором!`,player);

                  DB.Handle.query("UPDATE characters SET helper = ? WHERE id = ?", [args[1], recipient.sqlId], function (e) {
                  	recipient.helper = parseInt(args[1]);
                  	recipient.utils.info(`${player.name} onзonчил Вас хелпером`);
                  	terminal.info(`${player.name} onзonчил хелпером ${recipient.name} ${args[1]}lvl.`);
                  });
            }
      },


      "makeleader": {
            description: "onзonчить игрока лидером.",
            minLevel: 4,
            syntax: "[playerId]:n [factionId]:n",
            handler: (player, args) => {
      		var maxFaction;
      		DB.Handle.query("SELECT MAX(id) FROM factions", (e,result) => {
      			maxFaction = result[0]["MAX(id)"];
      			if (args[1] < 1 || args[1] > maxFaction) return terminal.error(`Фракции с ID: ${args[1]} не существует!`,player);

      			DB.Handle.query("SELECT MAX(rank) FROM faction_ranks WHERE factionId=?", args[1], (e,result) => {
      				var recipient = mp.findPlayerByIdOrNickname(args[0]);
      				if (!recipient) return terminal.error(`Player with ID: ${args[0]} not found!`,player);


                              if (recipient.faction != 0) recipient.utils.deleteFactionItems();

      				recipient.faction = parseInt(args[1]);
      				recipient.rank = result[0]["MAX(rank)"];
      				recipient.leader = 1;
      				recipient.canInvite = 1;
      				recipient.inJob = null;
      				recipient.job = 0;
      				recipient.call("initPlayerFaction", [recipient.faction]);



      				Factions.initPlayer(recipient, function () {
      					recipient.utils.success(`${player.name} onзonчил вас контролировать фракцию ${args[1]}`);
      					mp.players.forEach((_player) => {
      						_player.utils.info(`${recipient.name} теперь контролирует фракцию ${args[1]}`);
      					});
      					terminal.info(`${player.name} onзonчил ${recipient.name} лидером ${recipient.factionName}`);

      					DB.Handle.query("UPDATE characters SET job=?, leader=?, canInvite=?, faction=?, rank=? WHERE id = ?",
      						[recipient.job, recipient.leader, recipient.canInvite, recipient.faction, recipient.rank, recipient.sqlId]);
      				});

      			});
      		});
      	}
      },
      "uval": {
            description: "Уволить игрока из фракции.",
            minLevel: 3,
            syntax: "[playerId]:n",
            handler: (player, args) => {
      		var recipient = mp.findPlayerByIdOrNickname(args[0]);
      		if (!recipient) return terminal.error("Player not found!", player);
      		if (recipient.faction == 0) terminal.error("Игрок не состоит в организации!",player);

      		recipient.utils.deleteFactionItems();

      		recipient.faction = 0;
      		recipient.rank = 0;
      		recipient.rankName = null;
      		recipient.leader = 0;
      		recipient.canInvite = 0;
      		recipient.factionName = null;

      		DB.Handle.query("UPDATE characters SET leader=0, canInvite=0, faction=0,rank=0 WHERE id=?", recipient.sqlId);

      		recipient.utils.info(`${player.name} вас уволил!`);
      		terminal.info(`${player.name} уволил ${recipient.name} из фракции`);
      		recipient.call("initPlayerFaction", [0]);
      	}
      },

      "fspawn": {
            description: "Change спавн у фракции. Устаonвливается по позиции игрока.",
            minLevel: 5,
            syntax: "[factionId]:n",
            handler: (player, args) => {
      		var pos = player.position;
      		DB.Handle.query("UPDATE faction_spawns SET x=?, y=?, z=?, h=? WHERE factionId=?", [pos["x"], pos["y"], pos["z"], player.heading, args[0]], function(e, result) {
                        terminal.info(`${player.name} сменил spawn у фракции с ID: ${args[0]}`);
      		});
      	}
      },
      */

}
// Functions | Change
function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function getPlayerStatus(char) {
    let num = parseInt(char, 10);
    if (isNaN(num)) return "off";
    else return "on";
}

function getSpecialName(name, player) {
    if (!name.includes("_")) return false;
    let text = name.split("_");
    return text[0] + " " + text[1];
}

mp.events.add("delete.player.admin.freeze", (player) => {
    if (player.isFreeze) delete player.isFreeze;
});

var adm_color = "#ff6666"; // Color for real boys: #FF0000
