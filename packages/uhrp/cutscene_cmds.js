  module.exports = {
      "cutscene_start": {
          description: "Run cutscene.",
          minLevel: 6,
          syntax: "[id]:n",
          handler: (player, args) => {
              player.call(`startCutscene`, [args[0]]);
          }
      },
      "cutscene_stop": {
          description: "Stop cutscene.",
          minLevel: 6,
          syntax: "",
          handler: (player, args) => {
              player.call(`finishMoveCam`);
          }
      },
      "cutscenes_list": {
          description: "View the list of cutscenes.",
          minLevel: 6,
          syntax: "",
          handler: (player, args) => {
              var text = "Cutscene list:<br/>";
              for (var i in mp.cutscenes) {
                  var c = mp.cutscenes[i];
                  text += `${i}) Name: ${c.name}. Final text: ${c.finalText}. Frames: ${c.points.length} PC.<br/>`;
              }

              terminal.log(text, player);
          }
      },
      "set_cutscene_name": {
          description: "Change the name of the cutscene.",
          minLevel: 6,
          syntax: "[id]:n [name]:s",
          handler: (player, args) => {
              var c = mp.cutscenes[args[0]];
              if (!c) return terminal.error(`Cutscene with ID: ${args[0]} not found!`, player);
              args.splice(0, 1);
              c.setName(args.join(" "));
              terminal.info(`${player.name} changed the name of the cutscene with ID: ${c.id}`);
          }
      },
      "set_cutscene_finaltext": {
          description: "Change the final cutscene text.",
          minLevel: 6,
          syntax: "[id]:n [text]:s",
          handler: (player, args) => {
              var c = mp.cutscenes[args[0]];
              if (!c) return terminal.error(`Cutscene with ID: ${args[0]} not found!`, player);
              args.splice(0, 1);
              c.setFinalText(args.join(" "));
              terminal.info(`${player.name} changed the final text at the cutscene with ID: ${c.id}`);
          }
      },
      "cutscene_points": {
          description: "View the list of frames at cutscene.",
          minLevel: 6,
          syntax: "[id]:n",
          handler: (player, args) => {
              var c = mp.cutscenes[args[0]];
              if (!c) return terminal.error(`Cutscene with ID: ${args[0]} not found!`, player);

              var text = "List of frames cutscenes:<br/>";
              for (var i = 0; i < c.points.length; i++) {
                  var p = c.points[i];
                  text += `${i+1}) ${p.text}. Speed: ${p.speed}. Position: ${JSON.stringify(p.startPosition)} -> ${JSON.stringify(p.endPosition)}. Turn: ${JSON.stringify(p.startRotation)} -> ${JSON.stringify(p.endRotation)}.<br/>`;
              }

              terminal.log(text, player);
          }
      },
      "set_cutscene_point_text": {
          description: "Change the cutscene frame text.",
          minLevel: 6,
          syntax: "[cutscene_id]:n [point_id]:n [text]:s",
          handler: (player, args) => {
              var c = mp.cutscenes[args[0]];
              if (!c) return terminal.error(`Cutscene with ID: ${args[0]} not found!`, player);
              var pId = args[1] - 1;
              var p = c.points[pId];
              if (!p) return terminal.error(`Cutscene frame with ID: ${args[1]} not found!`, player);
              args.splice(0, 2);
              c.setPointText(pId, args.join(" "));
              terminal.info(`${player.name} changed the text at the cutscene frame with ID: ${pId}`);
          }
      },
      "set_cutscene_point_speed": {
          description: "Change the speed of the camera at the cutscene frame.",
          minLevel: 6,
          syntax: "[cutscene_id]:n [point_id]:n [speed]:n",
          handler: (player, args) => {
              var c = mp.cutscenes[args[0]];
              if (!c) return terminal.error(`Cutscene with ID: ${args[0]} not found!`, player);
              var pId = args[1] - 1;
              var p = c.points[pId];
              if (!p) return terminal.error(`Cutscene frame with ID: ${args[1]} not found!`, player);
              c.setPointSpeed(pId, args[2]);
              terminal.info(`${player.name} changed the speed of the camera flying at the cutscene frame with ID: ${pId}`);
          }
      },
      "set_cutscene_point_startpos": {
          description: "Change the starting position of the camera at the cutscene frame.",
          minLevel: 6,
          syntax: "[cutscene_id]:n [point_id]:n [x]:n [y]:n [z]:n",
          handler: (player, args) => {
              var c = mp.cutscenes[args[0]];
              if (!c) return terminal.error(`Cutscene with ID: ${args[0]} not found!`, player);
              var pId = args[1] - 1;
              var p = c.points[pId];
              if (!p) return terminal.error(`Cutscene frame with ID: ${args[1]} not found!`, player);
              var pos = new mp.Vector3(args[2], args[3], args[4]);
              c.setPointStartPositon(pId, pos);
              terminal.info(`${player.name} changed the starting position of the camera at the cutscene frame from ID: ${pId}`);
          }
      },
      "set_cutscene_point_endpos": {
          description: "Change the end position of the camera at the cutscene frame.",
          minLevel: 6,
          syntax: "[cutscene_id]:n [point_id]:n [x]:n [y]:n [z]:n",
          handler: (player, args) => {
              var c = mp.cutscenes[args[0]];
              if (!c) return terminal.error(`Cutscene with ID: ${args[0]} not found!`, player);
              var pId = args[1] - 1;
              var p = c.points[pId];
              if (!p) return terminal.error(`Cutscene frame with ID: ${args[1]} not found!`, player);
              var pos = new mp.Vector3(args[2], args[3], args[4]);
              c.setPointEndPositon(pId, pos);
              terminal.info(`${player.name} changed the end position of the camera at the cutscene frame with ID: ${pId}`);
          }
      },
      "set_cutscene_point_startrot": {
          description: "Change the initial rotation of the camera at the cutscene frame.",
          minLevel: 6,
          syntax: "[cutscene_id]:n [point_id]:n [x]:n [y]:n [z]:n",
          handler: (player, args) => {
              var c = mp.cutscenes[args[0]];
              if (!c) return terminal.error(`Cutscene with ID: ${args[0]} not found!`, player);
              var pId = args[1] - 1;
              var p = c.points[pId];
              if (!p) return terminal.error(`Cutscene frame with ID: ${args[1]} not found!`, player);
              var pos = new mp.Vector3(args[2], args[3], args[4]);
              c.setPointStartRotation(pId, pos);
              terminal.info(`${player.name} changed the initial rotation of the camera at the cutscene frame with ID: ${pId}`);
          }
      },
      "set_cutscene_point_endrot": {
          description: "Change the final rotation of the camera at the cutscene frame.",
          minLevel: 6,
          syntax: "[cutscene_id]:n [point_id]:n [x]:n [y]:n [z]:n",
          handler: (player, args) => {
              var c = mp.cutscenes[args[0]];
              if (!c) return terminal.error(`Cutscene with ID: ${args[0]} not found!`, player);
              var pId = args[1] - 1;
              var p = c.points[pId];
              if (!p) return terminal.error(`Cutscene frame with ID: ${args[1]} not found!`, player);
              var pos = new mp.Vector3(args[2], args[3], args[4]);
              c.setPointEndRotation(pId, pos);
              terminal.info(`${player.name} changed the final rotation of the camera at the cutscene frame with ID: ${pId}`);
          }
      },
      "cutscene_add_point": {
          description: "Add frame to cutscene.",
          minLevel: 6,
          syntax: "[cutscene_id]:n [speed]:n [name]:s",
          handler: (player, args) => {
              var c = mp.cutscenes[args[0]];
              if (!c) return terminal.error(`Cutscene with ID: ${args[0]} not found!`, player);
              var speed = args[1];
              args.splice(0, 2);
              c.addPoint(speed, args.join(" "))
              terminal.info(`${player.name} added frame to cutscene with ID: ${c.id}`);
          }
      },
      "cutscene_delete_point": {
          description: "Remove frame from cutscene.",
          minLevel: 6,
          syntax: "[cutscene_id]:n [point_id]:n",
          handler: (player, args) => {
              var c = mp.cutscenes[args[0]];
              if (!c) return terminal.error(`Cutscene with ID: ${args[0]} not found!`, player);
              c.deletePoint(args[1] - 1);
              terminal.info(`${player.name} deleted frame from cutscene with ID: ${c.id}`);
          }
      },
  }
