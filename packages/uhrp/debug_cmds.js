  module.exports = {
    "getpos": {
        description: "Print player coordinates in console.",
        minLevel: 6,
        syntax: "",
        handler: (player, args) => {
            //console.log(`${player.name} position: ${player.position.x.toFixed(2)}, ${player.position.y.toFixed(2)}, ${player.position.z.toFixed(2)}`);
            //console.log(`${player.name} heading: ${player.heading.toFixed(2)}`);

            terminal.info(`${player.name} position: ${player.position.x.toFixed(2)}, ${player.position.y.toFixed(2)}, ${player.position.z.toFixed(2)}`, player);
            if(player.vehicle) {
                terminal.info(`${player.name} heading: ${player.vehicle.heading.toFixed(2)}`, player);
            } else {
                terminal.info(`${player.name} heading: ${player.heading.toFixed(2)}`, player);
            }
        }
    },
    "bizes": {
        description: "Show biz coordinates.",
        minLevel: 6,
        syntax: "",
        handler: (player, args) => {
            //console.log(mp.bizes);
        }
    },
    "pinfo": {
        description: "Bring player to console.",
        minLevel: 6,
        syntax: "[playerId]:n",
        handler: (player, args) => {
            var player = mp.players.at(args[0]);
            if (!player) return;
            console.log(player);
        }
    },
    "vinfo": {
        description: "Print car to console.",
        minLevel: 6,
        syntax: "",
        handler: (player, args) => {
            console.log(player.vehicle);
        }
    },
    "iinfo": {
        description: "Display inventory items in console.",
        minLevel: 6,
        syntax: "",
        handler: (player, args) => {
            terminal.info(JSON.stringify(player.inventory.items), player);
        }
    },
    "bank": {
        description: "Test notice from the bank.",
        minLevel: 6,
        syntax: "[icon]:n",
        handler: (player, args) => {
            player.call("BN_ShowWithPicture", ["Headline", "Sender", "Message", "CHAR_BANK_FLEECA", args[0]]);
        }
    },
    "obj": {
        description: "Create object.",
        minLevel: 3,
        syntax: "[model]:s [deltaZ]:n [rX]:n [rY]:n",
        handler: (player, args) => {
            if (player.debugObj) player.debugObj.destroy();

            var pos = player.position;
            pos.z--;
            pos.z += args[1];
            player.debugObj = mp.objects.new(mp.joaat(args[0]), pos, {
                rotation: new mp.Vector3(args[2], args[3], player.heading),
                dimension: 0,
            });

            player.debugObj.name = args[0];

            terminal.info(`You created an object ${args[0]}!`, player);
        }
    },
    "task_goto": {
        description: "Following the player to the point.",
        minLevel: 3,
        syntax: "[player_id]:n [speed]:n",
        handler: (player, args) => {
            var recipient = mp.players.at(args[0]);
            if (!recipient) return terminal.error("Player not found!", player);

            recipient.call(`task.goto`, [player.position, args[1]]);
            terminal.info(`${recipient.name} follows to you`, player);
        }
    },
    "ammo": {
        description: "Get current cartridge quantity.",
        minLevel: 3,
        syntax: "[weapon_hash]:s",
        handler: (player, args) => {
            player.call(`getAmmoWeapon`, [mp.joaat(args[0])]);
        }
    },
    "removeWeapon": {
        description: "Remove the gun.",
        minLevel: 3,
        syntax: "[weapon_hash]:s",
        handler: (player, args) => {
            player.call(`removeWeapon`, [mp.joaat(args[0])]);
        }
    },
    "event": {
        description: "Call an event on the client.",
        minLevel: 3,
        syntax: "[event_name]:s [params]:s",
        handler: (player, args) => {
            var name = args[0];
            args.slice(0, 1);
            player.call(name, args);
        }
    },
    "show_ai": {
        description: "View current AUTO_INCREMENT by players_inventory.",
        minLevel: 3,
        syntax: "",
        handler: (player, args) => {
            terminal.log(`AUTO_INCREMENT: ${mp.inventory.autoIncrement}`, player);
        }
    },
    "take_object": {
        description: "Pick up object.",
        minLevel: 3,
        syntax: "[playerId]:n [model]:s",
        handler: (player, args) => {
            mp.players.at(args[0]).utils.takeObject(args[1]);
        }
    },
    "put_object": {
        description: "Put object.",
        minLevel: 3,
        syntax: "[playerId]:n",
        handler: (player, args) => {
            mp.players.at(args[0]).utils.putObject();
        }
    },
    "test_attach": {
        description: "Test attach.",
        minLevel: 3,
        syntax: "[model]:s [bone]:n [x]:n [y]:n [z]:n [rX]:n [rY]:n [rZ]:n",
        handler: (player, args) => {
            player.call(`testAttach`, args);
        }
    },
    "test_attach_off": {
        description: "Clear test attach.",
        minLevel: 3,
        syntax: "",
        handler: (player, args) => {
            player.call(`testAttachOff`);
        }
    },
    "test_veh_attach": {
        description: "Test attach to the car. The number parameter is used to attach several objects..",
        minLevel: 3,
        syntax: "[model]:s [bone]:n [x]:n [y]:n [z]:n [rX]:n [rY]:n [rZ]:n [number]:n",
        handler: (player, args) => {
            player.call(`testVehAttach`, args);
        }
    },
    "test_veh_attach_off": {
        description: "Clear test attach from auto.",
        minLevel: 3,
        syntax: "[number]:n",
        handler: (player, args) => {
            player.call(`testVehAttachOff`, args);
        }
    },
    "test_cropload": {
        description: "Test team to visualize the harvest in a farm pickup.",
        minLevel: 3,
        syntax: "[cropLoad]:n",
        handler: (player, args) => {
            if (!player.vehicle) return;
            player.vehicle.setVariable("cropLoad", args[0]);
        }
    },
    "test_blip": {
        description: "Create Test Blip.",
        minLevel: 3,
        syntax: "[id_blip]:n [id_cveta]:n",
        handler: (player, args) => {
            if (player.debugBlip) {
                player.debugBlip.destroy();
                delete player.debugBlip;
            }
            player.debugBlip = mp.blips.new(args[0], player.position, {
                color: args[1],
                name: "Test",
                shortRange: 10,
                scale: 1
            });
            terminal.log(`Test blip created!`, player);
        }
    },
    "clothes": {
        description: "Change clothes.",
        minLevel: 3,
        syntax: "[number]:n [drawable]:n [texture]:n",
        handler: (player, args) => {
            player.setClothes(args[0], args[1], args[2], 0);
            terminal.log(`Clothing changed!`, player);
        }
    },
    "prop": {
        description: "Change prop.",
        minLevel: 3,
        syntax: "[id]:n [drawable]:n [texture]:n",
        handler: (player, args) => {
            player.setProp(args[0], args[1], args[2]);
            terminal.log(`Prop changed!`, player);
        }
    },
    "info_spawn": {
        description: "Information about spawns.",
        minLevel: 3,
        syntax: "",
        handler: (player, args) => {
          DB.Handle.query("SELECT * FROM spawn_pos", (e, result) => {
            if (e) {
              callback("Error executing query in the database!");
              return terminal.error(e);
            }
            if (result.length < 1) return terminal.log("On the server 0 spawns", player);
            terminal.log(`--------------------------------------------`, player);
            for (let i = 0; i < result.length; i++) terminal.log(`Spawn <b>#${result[i].id}</b> | Title: <b>${result[i].name}</b>`, player);
            terminal.log(`--------------------------------------------`, player);
          });
        }
    },
    "create_spawn": {
        description: "Create spawn for players.",
        minLevel: 3,
        syntax: "[name]:s",
        handler: (player, args) => {
          DB.Handle.query("SELECT * FROM spawn_pos", (e, result) => {
            if (e) {
              callback("Error executing the query in the database!");
              return terminal.error(e);
            }
              for (let i = 0; i < result.length; i++) {
                if (result[i].name === args[0]) {
                  terminal.log(`Spawn with that name already exists!`, player);
                  return;
                }
              }

              let id = result.length + 1;
              let pos = player.position;
              DB.Handle.query("INSERT INTO spawn_pos (name, x, y, z, rot) VALUES (?, ?, ?, ?, ?)", [args[0], pos.x.toFixed(3), pos.y.toFixed(3), pos.z.toFixed(3), player.heading.toFixed(3)], (e, sresult) => {
                    if (e) {
                      callback("Error executing the query in the database!");
                      return terminal.error(e);
                    }
                    terminal.log("New spawn #" + sresult.insertId + " created! Title: " + args[0], player);
                  });
          });
        }
    },
    "delete_spawn": {
        description: "Remove spawn for players.",
        minLevel: 3,
        syntax: "[id]:n",
        handler: (player, args) => {
          DB.Handle.query("SELECT * FROM spawn_pos WHERE id=?", [args[0]], (e, result) => {
              if (e) {
                callback("Error executing the query in the database!");
                return terminal.error(e);
              }
              if (result.length < 1) return terminal.log("Spawn #" + args[0] + " does not exist!", player);
              DB.Handle.query(`DELETE FROM spawn_pos WHERE id=?`, args[0], (e, result) => {
                  if (e) {
                      callback("Error executing the query in the database!");
                      return terminal.error(e);
                    }
                  });
              terminal.log("Spawn #" + args[0] + " deleted!", player);
          });
        }
    },
    "tp_spawn": {
        description: "Teleport to Spawn.",
        minLevel: 3,
        syntax: "[id]:n",
        handler: (player, args) => {
          DB.Handle.query("SELECT * FROM spawn_pos WHERE id=?", [args[0]], (e, result) => {
              if (e) {
                callback("Error executing the query in the database!");
                return terminal.error(e);
              }
              if (result.length < 1) return terminal.log("Spawn #" + args[0] + " does not exist!", player);
              player.dimension = 0;
              player.position = new mp.Vector3(result[0].x, result[0].y, result[0].z);
              player.heading = result[0].rot;
              terminal.log("You teleported to Spawn #" + args[0] + "!", player);
          });
        }
    },
    "info_flight": {
        description: "Route Information for Buses.",
        minLevel: 3,
        syntax: "",
        handler: (player, args) => {
          DB.Handle.query("SELECT * FROM bus_route", (e, result) => {
            if (e) {
              callback("Error executing the query in the database!");
              return terminal.error(e);
            }
            if (result.length < 1) return terminal.log("On the server 0 routes", player);
            terminal.log(`--------------------------------------------`, player);
            for (let i = 0; i < result.length; i++) terminal.log(`Route <b>#${result[i].id}</b> | Title: <b>${result[i].name}</b> | Salary: <b>$${result[i].money}</b>`, player);
            terminal.log(`--------------------------------------------`, player);
          });
        }
    },
    "select_flight": {
        description: "Choose a route to make changes to it.",
        minLevel: 3,
        syntax: "[id]:n",
        handler: (player, args) => {
          if (player.marsh) return terminal.log("You are already editing another route!", player);
          DB.Handle.query("SELECT * FROM bus_route WHERE id=?", [args[0]], (e, result) => {
              if (e) {
                callback("Error executing the query in the database!");
                return terminal.error(e);
              }
              if (result.length < 1) return terminal.log("Route #" + args[0] + " does not exist!", player);
              terminal.log("You started changing Route #" + args[0], player);
              player.marsh = args[0];
              let arr = [];
              DB.Handle.query("SELECT * FROM bus_place WHERE bus=?", [args[0]], (e, sresult) => {
                if (sresult.length > 0) for (let i = 0; i < sresult.length; i++) arr.push({ id: sresult[i].id, x: sresult[i].x, y: sresult[i].y, z: sresult[i].z, type: sresult[i].type });
                if (arr.length > 0) {
                   player.notify("Total points in the route: ~r~" + arr.length);
                   player.call("create.all.map.bus", [JSON.stringify(arr), true]);
                } else {
                   player.utils.error("Currently, the route is empty!");
                }
              });
          });
        }
    },
    "create_point": {
        description: "Create a checkpoint for the route (0 - gap, 1 - stop).",
        minLevel: 3,
        syntax: "[type]:n",
        handler: (player, args) =>  {
          if (!player.marsh) return terminal.log("You do not edit the route!", player);
          DB.Handle.query("SELECT * FROM bus_route WHERE id=?", [player.marsh], (e, result) => {
              if (e) {
                callback("Error executing the query in the database!");
                return terminal.error(e);
              }
              if (result.length < 1) {
                terminal.log("Route #" + player.marsh + " does not exist!", player);
                delete player.marsh;
                return;
              }
              if (args[0] === 0 || args[0] === 1) {
                DB.Handle.query("INSERT INTO bus_place (bus, x, y, z, type) VALUES (?, ?, ?, ?, ?)", [player.marsh, player.position.x, player.position.y, player.position.z, args[0]], (error, sresult) => {
                    if (error) {
                        callback("Error executing the query in the database!");
                        return terminal.error(error);
                    }
                    terminal.log("You created a point #" + sresult.insertId + "! Type of: " + (args[0] === 0 ? "Intermediate Checkpoint" : "Stop"), player);
                    player.call("create.one.map.bus", [player.position.x, player.position.y, player.position.z, args[0], sresult.insertId]);
                });
              } else {
                terminal.log("0 - Intermediate Checkpoint | 1 - Stop");
              }
          });
        }
    },
    "delete_point": {
        description: "Delete checkpoint for route.",
        minLevel: 3,
        syntax: "[num]:n",
        handler: (player, args) =>  {
          if (!player.marsh) return terminal.log("You do not edit the route!", player);
          DB.Handle.query("SELECT * FROM bus_route WHERE id=?", [player.marsh], (e, sresult) => {
              if (e) { callback("Error executing the query in the database!"); return terminal.error(e); }
              if (sresult.length < 1) {
                terminal.log("Route #" + player.marsh + " does not exist!", player);
                delete player.marsh;
                return;
              }

              DB.Handle.query("SELECT * FROM bus_place WHERE id=?", [args[0]], (e, result) => {
                if (e) { callback("Error executing the query in the database!"); return terminal.error(e); }
                if (result.length < 1) return terminal.log("Points #" + args[0] + " does not exist!", player);
                if (result[0].bus !== player.marsh) return terminal.log("This point belongs to the route #" + result[0].bus, player);
                terminal.log("You deleted point #" + args[0] + "! Type of: " + (result[0].type === 0 ? "Intermediate Checkpoint " : "Stop"), player);
                player.call("delete.one.map.bus", [args[0]]);
                DB.Handle.query(`DELETE FROM bus_place WHERE id=?`, args[0], (e, results) => {
                    if (e) {
                        callback("Error executing the query in the database!");
                        return terminal.error(e);
                      }
                    });
              });
          });
        }
    },
    "stop_flight": {
        description: "Stop working by route.",
        minLevel: 3,
        syntax: "",
        handler: (player, args) => {
          if (!player.marsh) return terminal.log("You do not edit the route!", player);
          DB.Handle.query("SELECT * FROM bus_route WHERE id=?", [player.marsh], (e, result) => {
              if (e) {
                callback("Error executing the query in the database!");
                return terminal.error(e);
              }
              if (result.length < 1) return terminal.log("Route #" + player.marsh + " does not exist!", player);
              terminal.log("You stopped rerouting #" + player.marsh, player);
              player.call("create.all.map.bus", [0, "cancel"]);
              delete player.marsh;
          });
        }
    },
    "create_flight": {
        description: "Create a new route for Buses.",
        minLevel: 3,
        syntax: "[name]:s",
        handler: (player, args) => {
          DB.Handle.query("SELECT * FROM bus_route", (e, result) => {
            if (e) {
              callback("Error executing the query in the database!");
              return terminal.error(e);
            }
              for (let i = 0; i < result.length; i++) {
                if (result[i].name === args[0]) {
                  terminal.log(`Route with that name already exists!`, player);
                  return;
                }
              }

              let id = result.length + 1;
              DB.Handle.query("INSERT INTO bus_route (name) VALUES (?)", [args[0]], (e, sresult) => {
                    if (e) {
                      callback("Error executing the query in the database!");
                      return terminal.error(e);
                    }
                    terminal.log("New Route #" + sresult.insertId + " created! Title: " + args[0], player);
                  });
          });
        }
    },
    "delete_flight": {
        description: "Remove route for Buses.",
        minLevel: 3,
        syntax: "[id]:n",
        handler: (player, args) => {
          DB.Handle.query("SELECT * FROM bus_route WHERE id=?", [args[0]], (e, result) => {
              if (e) {
                callback("Error executing the query in the database!");
                return terminal.error(e);
              }
              if (result.length < 1) return terminal.log("Route #" + args[0] + " does not exist!", player);
              if (player.marsh === args[0]) return terminal.log("You can not delete Route #" + args[0] + ", while changing it!", player);
              DB.Handle.query(`DELETE FROM bus_route WHERE id=?`, args[0], (e, result) => {
                  if (e) {
                      callback("Error executing the query in the database!");
                      return terminal.error(e);
                    }
                  });
              terminal.log("Route #" + args[0] + " deleted!", player);
          });
        }
    },
    "change_pos_point": {
        description: "Change the checkpoint position for the route.",
        minLevel: 3,
        syntax: "[id]:n",
        handler: (player, args) =>  {
          if (!player.marsh) return terminal.log("You do not edit the route!", player);
          DB.Handle.query("SELECT * FROM bus_route WHERE id=?", [player.marsh], (e, sresult) => {
              if (e) { callback("Error executing the query in the database!"); return terminal.error(e); }
              if (sresult.length < 1) {
                terminal.log("Route #" + player.marsh + " does not exist!", player);
                delete player.marsh;
                return;
              }

              DB.Handle.query("SELECT * FROM bus_place WHERE id=?", [args[0]], (e, result) => {
                if (e) { callback("Error executing the query in the database!"); return terminal.error(e); }
                if (result.length < 1) return terminal.log("Points #" + args[0] + " does not exist!", player);
                if (result[0].bus !== player.marsh) return terminal.log("This point belongs to the route #" + result[0].bus, player);
                terminal.log("You have changed the position of Points #" + args[0] + "! Type of: " + (result[0].type === 0 ? "Intermediate Checkpoint " : "Stop"), player);
                player.call("change.one.map.bus.position", [args[0], player.position.x, player.position.y, player.position.z]);
                DB.Handle.query("UPDATE bus_place SET x=?,y=?,z=? WHERE id=?", [player.position.x, player.position.y, player.position.z, args[0]]);
              });
          });
        }
    },
    "change_status_point": {
        description: "Change checkpoint status for route (0 - gap, 1 - Stop).",
        minLevel: 3,
        syntax: "[id]:n [type]:n",
        handler: (player, args) =>  {
          if (!player.marsh) return terminal.log("You do not edit the route!", player);
          DB.Handle.query("SELECT * FROM bus_route WHERE id=?", [player.marsh], (e, sresult) => {
              if (e) { callback("Error executing the query in the database!"); return terminal.error(e); }
              if (sresult.length < 1) {
                terminal.log("Route #" + player.marsh + " does not exist!", player);
                delete player.marsh;
                return;
              }
              if (args[1] === 0 || args[1] === 1) {
                DB.Handle.query("SELECT * FROM bus_place WHERE id=?", [args[0]], (e, result) => {
                  if (e) { callback("Error executing the query in the database!"); return terminal.error(e); }
                  if (result.length < 1) return terminal.log("Points #" + args[0] + " does not exist!", player);
                  if (result[0].bus !== player.marsh) return terminal.log("This point belongs to the route #" + result[0].bus, player);
                  terminal.log("You changed the type of Points" + args[0] + "! Type of: " + (args[1] === 0 ? "Intermediate Checkpoint " : "Stop"), player);
                  player.call("change.one.map.bus.name", [args[0], args[1]]);
                  DB.Handle.query("UPDATE bus_place SET type=? WHERE id=?", [args[1], args[0]]);
                });
              } else {
                terminal.log("0 - Intermediate Checkpoint | 1 - Stop");
              }
          });
        }
    },
    "change_name_flight": {
        description: "Change route name for Buses.",
        minLevel: 3,
        syntax: "[id]:n [name]:s",
        handler: (player, args) => {
          DB.Handle.query("SELECT * FROM bus_route", (e, result) => {
              if (e) {
                callback("Error executing the query in the database!");
                return terminal.error(e);
              }
              for (let i = 0; i < result.length; i++) {
                if (result[i].name === args[1]) return terminal.log(`Route with this name already exists!`, player);
                if (result[i].id === args[0]) {
                  DB.Handle.query("UPDATE bus_route SET name=? WHERE id=?", [args[1], args[0]], (e, result) => {
                      if (e) {
                          callback("Error executing the query in the database!");
                          return terminal.error(e);
                        }
                      });
                  terminal.log("Route name #" + args[0] + " changed! Title: " + args[1], player);
                  return;
                }
              }

              terminal.log("Route #" + args[0] + " does not exist!", player);
          });
        }
    },
    "change_salary_flight": {
        description: "Change the salary for the route for Buses.",
        minLevel: 3,
        syntax: "[id]:n [money]:n",
        handler: (player, args) => {
          DB.Handle.query("SELECT * FROM bus_route WHERE id=?", [args[0]], (e, result) => {
              if (e) {
                callback("Error executing the query in the database!");
                return terminal.error(e);
              }
              if (result.length < 1) return terminal.log("Route #" + args[0] + " does not exist!", player);
              DB.Handle.query("UPDATE bus_route SET money=? WHERE id=?", [args[1], args[0]], (e, result) => {
                  if (e) {
                      callback("Error executing the query in the database!");
                      return terminal.error(e);
                    }
                  });
              terminal.log("Salary for Route #" + args[0] + " changed! Salary: $" + args[1], player);
          });
        }
    },
    "call": {
        description: "Call the phone number",
        minLevel: 10,
        syntax: "[number]:n",
        handler: (player, args) => {
          if (player.phone.number) player.phone.call(args[0]);
        }
    },
    "calltaxi": {
        description: "Call a taxi.",
        minLevel: 9,
        syntax: "",
        handler: (player, args) => {
            let taxiOpen = require("./modules/jobs/taxi/taxi.js");
            taxiOpen.callTaxi(player);
        }
    },
    "canceltaxi": {
        description: "Cancel call taxi.",
        minLevel: 9,
        syntax: "",
        handler: (player, args) => {
            let taxiOpen = require("./modules/jobs/taxi/taxi.js");
            taxiOpen.cancelTaxi(player, true);
        }
    },
    "tptaxi": {
        description: "Teleport to work Taxi.",
        minLevel: 3,
        syntax: "",
        handler: (player, args) => {
            player.position = new mp.Vector3(905.71, -175.35, 74.08);
        }
    },
    "tpport": {
        description: "Teleport to work Port.",
        minLevel: 3,
        syntax: "",
        handler: (player, args) => {
            player.position = new mp.Vector3(-404.38, -2700.34, 6.00);
        }
    },
    "tppizza": {
        description: "Teleport to work Pizzeria.",
        minLevel: 3,
        syntax: "",
        handler: (player, args) => {
            player.position = new mp.Vector3(534.20, 98.95, 96.42);
        }
    },
    "tpbank": {
        description: "Teleport to the Bank.",
        minLevel: 3,
        syntax: "",
        handler: (player, args) => {
            player.position = new mp.Vector3(235.43, 216.95, 106.29);
        }
    },
    "tppost": {
        description: "Teleport to Go Postal.",
        minLevel: 3,
        syntax: "",
        handler: (player, args) => {
            player.position = new mp.Vector3(-258.56, -841.53, 31.42);
        }
    },
    "tptrash": {
        description: "Teleport to the Garbage Truck.",
        minLevel: 3,
        syntax: "",
        handler: (player, args) => {
            player.position = new mp.Vector3(-625.64, -1639.07, 25.96);
        }
    },
    "door": {
        description: "Open the door auto.",
        minLevel: 3,
        syntax: "[door]:n",
        handler: (player, args) => {
            if (!player.vehicle) return;
            player.call(`door`, [args[0]]);
        }
    },
    "tpbone": {
        description: "TP to bone auto.",
        minLevel: 3,
        syntax: "[bone_name]:s",
        handler: (player, args) => {
            if (!player.vehicle) return;
            var vehId = player.vehicle.id;
            player.call(`vehBone.tp`, [args[0]]);
            var playerId = player.id;
            setTimeout(() => {
                try {
                    var player = mp.players.at(playerId);
                    var veh = mp.vehicles.at(vehId);
                    if (!player || !veh) return;
                    player.putIntoVehicle(veh, -1);
                } catch (e) {
                    console.log(e);
                }
            }, 2000);
        }
    },
    "test_mcall": {
        description: "Test Challenge Medic.",
        minLevel: 3,
        syntax: "[text]:s",
        handler: (player, args) => {
            mp.events.call("hospital.addCall", player, args.join(" "));
        }
    },
    "test_mcallremove": {
        description: "Test acceptance / rejection of a medic call.",
        minLevel: 3,
        syntax: "[playerId]:n",
        handler: (player, args) => {
            mp.events.call("hospital.acceptCall", player, args[0]);
        }
    },
    "test_pcall": {
        description: "Cop Test Challenge.",
        minLevel: 3,
        syntax: "[text]:s",
        handler: (player, args) => {
            mp.events.call("police.addCall", player, args.join(" "));
        }
    },
    "test_pcallremove": {
        description: "Test acceptance / rejection of a cop call.",
        minLevel: 3,
        syntax: "[playerId]:n",
        handler: (player, args) => {
            mp.events.call("police.acceptCall", player, args[0]);
        }
    },
    "effect": {
        description: "Enable Screen FX.",
        minLevel: 3,
        syntax: "[name]:s [time]:n",
        handler: (player, args) => {
            player.call(`effect`, [args[0], args[1]]);
        }
    },
    "sound": {
        description: "Sound on.",
        minLevel: 3,
        syntax: "[name]:s [setName]:s",
        handler: (player, args) => {
            player.call(`playSound`, [args[0], args[1]]);
        }
    },
    "query": {
        description: "Check request time.",
        minLevel: 3,
        syntax: "",
        handler: (player, args) => {
            var time = new Date().getTime();
            DB.Handle.query("SELECT 1+1 as result", (e,result) => {
                var ms = new Date().getTime() - time;
                terminal.log(`Time: ${ms} ms.`, player);
            });
        }
    },
}
