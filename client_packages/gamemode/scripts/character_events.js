var throwAttachedObject;
var animationInfo = [{
        dict: "amb@code_human_in_car_mp_actions@finger@std@ps@base",
        name: "idle_a",
        speed: 8,
        flag: 49
    },
    {
        dict: "amb@code_human_in_car_mp_actions@rock@low@ps@base",
        name: "enter",
        speed: 8,
        flag: 49
    },
    {
        dict: "amb@code_human_in_car_mp_actions@rock@std@ds@base",
        name: "enter",
        speed: 8,
        flag: 49
    },
    {
        dict: "amb@code_human_in_car_mp_actions@v_sign@bodhi@rps@base",
        name: "idle_a",
        speed: 8,
        flag: 49
    },
    {
        dict: "amb@world_human_cheering@male_e",
        name: "base",
        speed: 8,
        flag: 49
    },
    {
        dict: "amb@code_human_in_car_mp_actions@wank@bodhi@rps@",
        name: "idle_a",
        speed: 8,
        flag: 49
    },
    {
        dict: "amb@prop_human_muscle_chin_ups@male@base",
        name: "base",
        speed: 8,
        flag: 49
    },
    {
        dict: "amb@prop_human_seat_muscle_bench_press@idle_a",
        name: "idle_a",
        speed: 8,
        flag: 49
    },
    {
        dict: "amb@world_human_muscle_free_weights@male@barbell@base",
        name: "base",
        speed: 8,
        flag: 49
    },
    {
        dict: "amb@world_human_push_ups@male@base",
        name: "base",
        speed: 8,
        flag: 49
    },
    {
        dict: "amb@world_human_push_ups@male@base",
        name: "base",
        speed: 8,
        flag: 49
    }, // 10
    {
        dict: "amb@lo_res_idles@",
        name: "world_human_bum_slumped_right_lo_res_base",
        speed: 8,
        flag: 1
    },
    {
        dict: "amb@world_human_bum_slumped@male@laying_on_left_side@base",
        name: "base",
        speed: 8,
        flag: 1
    },
    {
        dict: "amb@world_human_bum_slumped@male@laying_on_right_side@base",
        name: "base",
        speed: 8,
        flag: 1
    },
    {
        dict: "amb@code_human_cower@female@base",
        name: "base",
        speed: 8,
        flag: 1
    },
    {
        dict: "amb@code_human_in_bus_passenger_idles@female@tablet@idle_a",
        name: "idle_a",
        speed: 8,
        flag: 1
    },
    {
        dict: "amb@code_human_in_bus_passenger_idles@male@coffee@idle_a",
        name: "idle_b",
        speed: 8,
        flag: 1
    },
    {
        dict: "amb@code_human_in_bus_passenger_idles@male@sit@base",
        name: "base",
        speed: 8,
        flag: 1
    },
    {
        dict: "amb@code_human_in_bus_passenger_idles@female@sit@base",
        name: "base",
        speed: 8,
        flag: 1
    },
    {
        dict: "amb@code_human_cower_stand@male@react_cowering",
        name: "base_right",
        speed: 8,
        flag: 1
    },
    {
        dict: "amb@code_human_cower_stand@male@idle_a",
        name: "idle_b",
        speed: 8,
        flag: 1
    }, // 20
    {
        dict: "amb@code_human_cower_stand@male@idle_a",
        name: "idle_b",
        speed: 8,
        flag: 1
    },
    {
        dict: "amb@code_human_cower_stand@female@idle_a",
        name: "idle_c",
        speed: 8,
        flag: 1
    },
    {
        dict: "amb@code_human_cower_stand@female@base",
        name: "base",
        speed: 8,
        flag: 1
    },
    {
        dict: "amb@code_human_cower@male@react_cowering",
        name: "base_back_left",
        speed: 8,
        flag: 1
    },
    {
        dict: "amb@code_human_cower@female@react_cowering",
        name: "base_back_left",
        speed: 8,
        flag: 1
    },
    {
        dict: "amb@code_human_cower@female@base",
        name: "base",
        speed: 8,
        flag: 1
    },
    {
        dict: "amb@code_human_cower@female@idle_a",
        name: "idle_c",
        speed: 8,
        flag: 1
    },
    {
        dict: "amb@world_human_leaning@male@wall@back@foot_up@base",
        name: "base",
        speed: 8,
        flag: 1
    },
    {
        dict: "amb@world_human_leaning@male@wall@back@foot_up@base",
        name: "base",
        speed: 8,
        flag: 1
    },
    {
        dict: "amb@world_human_partying@female@partying_beer@base",
        name: "base",
        speed: 8,
        flag: 1
    }, // 30
    {
        dict: "amb@code_human_in_car_mp_actions@first_person@smoke@std@ds@base",
        name: "enter",
        speed: 8,
        flag: 16
    },
    {
        dict: "amb@world_human_gardener_plant@female@base",
        name: "base_female",
        speed: 8,
        flag: 1
    },
];

let isEngineToggleEnabled = true;

exports = (menu) => {

    mp.events.call("setLocalVar", "bootVehicleId", -1); // взаимодействие с Sullenажником авто

    mp.events.add("showSelectorCharacters", (data) => {
        mp.events.call(`hideEnterAccount`);
        mp.events.call(`selectMenu.hide`);
        menu.execute(`showSelectorCharacters('${JSON.stringify(data)}')`);

        //mp.events.call("focusOnPlayer", mp.players.local.position, -10);
        mp.players.local.setAlpha(0);
        setCursor(true);
        mp.events.call(`effect`, 'MP_job_load', 100000);
    });

    mp.events.add("authCharacter", (characterIndex) => {
        mp.game.audio.playSoundFrontend(-1, "Start", "DLC_HEIST_HACKING_SNAKE_SOUNDS", true);
        mp.events.callRemote("authCharacter", characterIndex);
        mp.events.call("finishMoveCam");
        mp.events.call("setFreeze", false);
    });

    mp.events.add("initNewCharacter", (sex, openSelectMenu = true) => {
        mp.events.call("hideEnterAccount");
        menu.execute("hideWindow('.characterInfo')");
        menu.execute("hideWindow('#createCharacter')");
        menu.execute("hideWindow('#selectorCharacters')");
        mp.keys.unbind(37, false);
        mp.keys.unbind(39, false);
        mp.keys.unbind(13, false);
        mp.events.call("infoTable.hide");
        if (openSelectMenu) mp.events.call("selectMenu.show", "character_main");
        setCursor(false);
        mp.events.call(`effect`, 'MP_job_load', 1);
        var player = mp.players.local;
        var headBlendData = {
            'mother': 2,
            'father': 6,
            'skinColor': 19,
            'similarity': 0.5
        };
        var faceFeatures = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        var hairColorDefault = 61;
        var eyeColorDefault = 255;
        var skinColorDefault = 19;
        player.skills = [0, 0, 0, 0, 0, 0, 0];
        player.skillIndex = 0;
        player.sex = sex;
        player.setAlpha(255);
        mp.events.call("player.setHeadBlendData", player, headBlendData);
        mp.events.call("player.setFaceFeatures", player, faceFeatures);
        // mp.events.call("player.setHairColor", player, hairColorDefault);
        mp.events.call("player.setEyeColor", player, eyeColorDefault);

        setFreeze(true);

        mp.events.call("focusOnPlayer", mp.players.local.position, -10);
    });

    mp.events.add("player.setHeadBlendData", (player, headBlendData) => {
        player.setHeadBlendData(headBlendData.mother, headBlendData.father, 0, headBlendData.skinColor, 0,
            headBlendData.similarity, headBlendData.similarity, 0, false, false);
        player.headBlendData = headBlendData;
    });

    mp.events.add("player.setFaceFeatures", (player, faceFeatures) => {
        for (var i = 0; i < faceFeatures.length; i++) {
            player.setFaceFeature(i, faceFeatures[i]);
        }
        player.faceFeatures = faceFeatures;
    });

    /* mp.events.add("player.setHairColor", (player, hairColor) => {
        player.setHairColor(hairColor, hairColor);
        player.hairColor = hairColor;
    }); */

    mp.events.add("player.setEyeColor", (player, eyeColor) => {
        player.setEyeColor(eyeColor);
        player.eyeColor = eyeColor;
    });

    mp.events.add("lightCharacterName", () => {
        menu.execute(`lightTextField('.modal .characterName', '#b44')`);
    });

    mp.events.add("throw.fromvehicle.withkey", (id) => {
      mp.events.call("modal.hide");
      if (!mp.players.local.vehicle) return mp.events.call(`nError`, `You're not in transport!`);
      if (mp.players.local.remoteId == id) return mp.events.call(`nError`, `You can't throw yourself out!`);
      let players = getOccupants(mp.players.local.vehicle.remoteId);
      if (players.length < 2) return mp.events.call(`nError`, `Transport is empty!`);
      for (let i = 0; i < players.length; i++) {
        if (players[i].remoteId == id) return mp.events.callRemote("item.throwfromvehicle", mp.players.local.vehicle.remoteId, players[i].remoteId);
      }
      return mp.events.call(`nError`, "Passenger not found!");
    });

    mp.pedsData = [];
    mp.choicePeds = [];
    mp.choicePedIndex = 0;
    mp.pedSlots = [
        new mp.Vector3(-68.36249542236328, -824.1286010742188, 326.083953857421),
        new mp.Vector3(-67.13888549804688, -822.3157958984375, 326.08392333984375),
        new mp.Vector3(-66.46456909179688, -820.1666870117188, 326.08392333984375),
    ];
    mp.pedHeadings = [231.48, 249.65, 266.51];
    var selectMarkers = [];
    mp.events.add("copyPed", (isLast, characterIndex, data) => {
        var player = mp.players.local;
        if (characterIndex == 0) {
            /*mp.events.call("finishMoveCam");
            mp.events.call("hideEnterAccount");
            mp.events.call("modal.hide");
            mp.events.call("setFreeze", true);
            setCursor(false);
            player.setAlpha(0);*/
        }
        mp.pedsData[characterIndex] = data;
        mp.events.call("player.setHeadBlendData", player, data.headBlendData);
        mp.events.call("player.setFaceFeatures", player, data.faceFeatures);
        mp.events.call("player.setEyeColor", player, data.eyeColor);
        // mp.events.call("player.setHairColor", player, data.hairColor);

        var pos = Object.create(mp.pedSlots[characterIndex]);
        mp.events.call("cloneToTarget", data.sex, pos, mp.pedHeadings[characterIndex]);
        pos.z--;
        if (!isLast) setTimeout(() => {
            mp.events.callRemote("copyPed", characterIndex + 1);
        }, 500);
        else {
            if (mp.movingcam) {
                mp.movingcam.setActive(false);
                mp.game.cam.renderScriptCams(false, false, 0, false, false);
            }

            mp.events.call("hideEnterAccount");
            menu.execute(`showCreateCharacterButton()`);
            mp.events.call("modal.hide");
            mp.events.call("setFreeze", true);
            setCursor(true);
            player.setAlpha(0);

            var startPos = Object.create(mp.pedSlots[0]);
            var startH = mp.pedHeadings[0] - 30;
            mp.events.call("focusOnPlayer", startPos, startH);

            var pos = Object.create(mp.pedSlots[0]);
            mp.events.call("focusOnPlayer", pos, mp.pedHeadings[0]);
            initButtonHandlers(mp.choicePeds.length);

            var d = mp.pedsData[mp.choicePedIndex];
            menu.execute(`showCharacterInfo('${JSON.stringify([d.name,d.carsCount+" шт.",d.house,d.biz,d.faction,d.job,d.family])}')`);
            mp.events.call("infoTable.setValues", "character_skills", d.skills);

            createSelectMarkers();
            mp.events.call("setLocalVar", "charactersCount", mp.choicePeds.length);
        }
    });

    function createSelectMarkers() {
        for (var i = 0; i < mp.choicePeds.length; i++) {
            var pos = Object.create(mp.pedSlots[i]);
            pos.z--;
            var color = (i == 0) ? [17, 153, 102, 255] : [255, 255, 255, 120];
            selectMarkers.push(mp.markers.new(25, pos, 1, {
                direction: 0,
                rotation: new mp.Vector3(0, 0, 0),
                color: color,
                visible: true,
                dimension: mp.players.local.dimension
            }));
        }
    }

    function destroySelectMarkers() {
        for (var i = 0; i < selectMarkers.length; i++)
            selectMarkers[i].destroy();
    }

    function markSelectMarker(oldIndex, newIndex) {
        if (newIndex < 0) newIndex = mp.choicePeds.length - 1;
        else if (newIndex >= mp.choicePeds.length) newIndex = 0;

        selectMarkers[oldIndex].destroy();
        selectMarkers[newIndex].destroy();
        var pos = Object.create(mp.pedSlots[oldIndex]);
        pos.z--;
        selectMarkers[oldIndex] = mp.markers.new(25, pos, 1, {
            direction: 0,
            rotation: new mp.Vector3(0, 0, 0),
            color: [255, 255, 255, 120],
            visible: true,
            dimension: mp.players.local.dimension
        });
        var pos = Object.create(mp.pedSlots[newIndex]);
        pos.z--;
        selectMarkers[newIndex] = mp.markers.new(25, pos, 1, {
            direction: 0,
            rotation: new mp.Vector3(0, 0, 0),
            color: [17, 153, 102, 255],
            visible: true,
            dimension: mp.players.local.dimension
        });

    }

    mp.events.add({
        "choiceCharacter.left": () => {
            if (isFlood()) return;
            markSelectMarker(mp.choicePedIndex, mp.choicePedIndex - 1);
            mp.choicePedIndex--;
            if (mp.choicePedIndex < 0) mp.choicePedIndex = mp.choicePeds.length - 1;
            var pos = Object.create(mp.pedSlots[mp.choicePedIndex]);
            mp.events.call("focusOnPlayer", pos, mp.pedHeadings[mp.choicePedIndex]);
            mp.game.audio.playSoundFrontend(-1, "OK", "HUD_FRONTEND_DEFAULT_SOUNDSET", true);

            var d = mp.pedsData[mp.choicePedIndex];
            menu.execute(`showCharacterInfo('${JSON.stringify([d.name,d.carsCount+" шт.",d.house,d.biz,d.faction,d.job,d.family])}')`);
            mp.events.call("infoTable.setValues", "character_skills", d.skills);
        },
        "choiceCharacter.right": () => {
            if (isFlood()) return;
            markSelectMarker(mp.choicePedIndex, mp.choicePedIndex + 1);
            mp.choicePedIndex++;
            if (mp.choicePedIndex >= mp.choicePeds.length) mp.choicePedIndex = 0;
            var pos = Object.create(mp.pedSlots[mp.choicePedIndex]);
            mp.events.call("focusOnPlayer", pos, mp.pedHeadings[mp.choicePedIndex]);
            mp.game.audio.playSoundFrontend(-1, "OK", "HUD_FRONTEND_DEFAULT_SOUNDSET", true);

            var d = mp.pedsData[mp.choicePedIndex];
            menu.execute(`showCharacterInfo('${JSON.stringify([d.name,d.carsCount+" шт.",d.house,d.biz,d.faction,d.job,d.family])}')`);
            mp.events.call("infoTable.setValues", "character_skills", d.skills);
        }
    });

    function initButtonHandlers(charCount) {
        if (charCount > 1) {
            mp.keys.bind(37, false, () => { //left
                mp.events.call("choiceCharacter.left");
            });
            mp.keys.bind(39, false, () => { //right
                mp.events.call("choiceCharacter.right");
            });
        }
        mp.keys.bind(13, false, () => { //enter
            if (isFlood()) return;
            mp.game.audio.playSoundFrontend(-1, "Start", "DLC_HEIST_HACKING_SNAKE_SOUNDS", true);
            mp.keys.unbind(37, false);
            mp.keys.unbind(39, false);
            mp.keys.unbind(13, false);
            mp.events.callRemote("authCharacter", mp.choicePedIndex);

						var player = mp.players.local;

            mp.events.call("finishMoveCam");
            hideWindow(".characterInfo");
            mp.events.call("infoTable.hide");
            setCursor(false);
            player.setAlpha(255);
            mp.events.call("setFreeze", false);

            menu.execute(`hideWindow('#createCharacter')`);
        });

    }

    mp.events.add("cloneToTarget", (sex, pos, heading) => {
        var player = mp.players.local;
        var modelName = (sex == 1) ? 'MP_M_Freemode_01' : 'MP_F_Freemode_01';
        let ped = mp.peds.new(mp.game.joaat(modelName), pos, heading, (streamPed) => {
            player.cloneToTarget(streamPed.handle);
        }, player.dimension);
        mp.choicePeds.push(ped);
    });

    mp.events.add("startFollowToPlayer", (playerId) => {
        var player = mp.players.atRemoteId(playerId);
        if (!player) return;
        followPlayer = player;
    });
    mp.events.add("stopFollowToPlayer", () => {
        followPlayer = null;
    });

		var mainTimerId;

		mp.events.add("vehicle::engineToggleEnable", (state) => {
			isEngineToggleEnabled = state;
		});

    mp.events.add("authCharacter.success", () => {
        mp.game.ui.setMinimapVisible(false);
        mp.game.ui.displayRadar(true);
        mp.game.player.setHealthRechargeMultiplier(0); //Disable regeneration
        mp.events.call("chat.enable", true);
        mp.events.call("inventory.enable", true);
        mp.events.call("playerMenu.enable", true);
        mp.events.call("adminPanel.enable", true);
        mp.events.call("telephone.enable", true);
        mp.events.call("hudControl.enable", true);
        mp.events.call("tablet.police.setEnable", true);
        mp.events.call("tablet.sheriff.setEnable", true);
        mp.events.call("tablet.army.setEnable", true);
        mp.events.call("tablet.fib.setEnable", true);
        mp.events.call("tablet.medic.setEnable", true);
        menu.execute(`hideWindow('#selectorCharacters')`);
        mp.events.call(`effect`, 'MP_job_load', 1);
        setCursor(false);

        menu.execute(`userInterface.__vue__.$data.render=true;`)

        // ALT
        mp.keys.bind(18, false, () => {
            setCursor(!mp.gui.cursor.visible);
        });

        mp.keys.bind(50, true, () => { // кнопка '2'
            if (
                !isEngineToggleEnabled || mp.tabletActive || mp.chatActive || mp.autoSaloonActive || mp.consoleActive
                || mp.inventoryActive || mp.tradeActive || mp.playerMenuActive || !mp.players.local.vehicle
            ) {
                return;
            }

            mp.events.call("vehicleEngineHandler");
        });

        let interectionMenu = 0;

        mp.keys.bind(69, true, () => { // кнопка 'E'
            if (mp.tabletActive || mp.chatActive || mp.autoSaloonActive || mp.consoleActive || mp.inventoryActive || mp.tradeActive || mp.playerMenuActive || mp.players.local.vehicle || mp.documentsActive || mp.houseMenuActive) return;
            /* Поднятие предмета с земли. */
            var pos = mp.players.local.position;
            var itemObj, minDist = 9999;
            mp.objects.forEach((obj) => {
                var objPos = obj.position;
                let dist = mp.game.system.vdist(pos.x, pos.y, pos.z, objPos.x, objPos.y, objPos.z);
                if (dist < mp.clientStorage.maxPickUpItemDist && obj.getVariable("inventoryItemSqlId")) {
                    if (dist < minDist) {
                        minDist = dist;
                        itemObj = obj;
                    }
                }
            });
            if (itemObj && !isFlood() && !mp.players.local.getVariable("attachedObject")) {
                mp.events.callRemote("item.pickUp", itemObj.remoteId);
                return;
            }

            /* Показ меню взаимодействия. */

            var entity = getNearPlayerOrVehicle(pos, 10);
            if (mp.keys.isDown(16)) {
                entity = mp.players.local;
                var animation = entity.getVariable("animation");
                if (animation) mp.events.callRemote("animation.set", animation);
            }
            if (entity) {
                var dist = vdist(pos, entity.position);
                // debug(`dist: ${JSON.stringify(dist)}`);
                if (dist < 10) {
                    if (dist < 2 && entity.type == "player") {
                        interectionMenu = 2;
                        if (mp.players.local.remoteId == entity.remoteId) {
                            mp.events.call("interactionMenu.showPlayerMenu", entity, {
                                action: "showLocal"
                            });
                            return;
                        }
                        var attachedObject = mp.players.local.getVariable("attachedObject");
                        var haveProducts = (attachedObject == "prop_box_ammo04a" || attachedObject == "ex_office_swag_pills4");
                        mp.events.call("interactionMenu.showPlayerMenu", entity, {
                            showTransferProducts: haveProducts
                        });
                    } else if (entity.type == "vehicle") {
                        interectionMenu = 2;
                        if (dist < 2) mp.events.call("interactionMenu.showVehicleMenu", entity, {
                            action: 'showDoors'
                        });
                        else {
                            var bootPos = getBootPosition(entity);

                            // debug(`vdist(pos, bootPos): ${vdist(pos, bootPos)}`);
                            if (bootPos && vdist(pos, bootPos) < 1) mp.events.call("interactionMenu.showVehicleMenu", entity, {
                                action: 'showBoot',
                                showProducts: true,
                            });
                            else {
                                var hoodPos = getHoodPosition(entity);
                                // debug(`vdist(pos, hoodPos): ${vdist(pos, hoodPos)}`);
                                if (hoodPos && vdist(pos, hoodPos) < 1) mp.events.call("interactionMenu.showVehicleMenu", entity, {
                                    action: 'showHood'
                                });
                            }
                        }
                    }
                }
            }

            var attachedObject = mp.players.local.getVariable("attachedObject");

            /* Кладём товар. */
            if (mp.clientStorage.insideWarehouseProducts && (attachedObject == "prop_box_ammo04a" || attachedObject == "ex_office_swag_pills4") && !isFlood()) mp.events.callRemote("warehouse.push");

            /* Берем товар.*/
            if (!attachedObject && mp.clientStorage.insideProducts && !isFlood()) mp.events.callRemote("products.take");

            /* Сбор урожая. */
            if (!attachedObject && mp.clientStorage.farmJobType != null && !isFlood()) {
                if (mp.isCropping) return mp.events.call(`nError`, "You're already harvesting!");
                if (mp.players.local.getVariable("knockDown")) return;
                var object = getNearObject(pos, 3);
                if (object) mp.events.callRemote("farm.field.takeCrop", object.remoteId);
            }
        });
        mp.keys.bind(69, false, () => { // кнопка 'E'
            if (interactionEntity) interactionEntity = null;
            mp.events.call("interactionMenu.hide");
            if (mp.tabletActive || mp.chatActive || mp.consoleActive || mp.autoSaloonActive || mp.inventoryActive || mp.tradeActive || mp.playerMenuActive || mp.documentsActive || mp.houseMenuActive || mp.selectMenuActive) return;
            setCursor(false);
        });

        mp.keys.bind(17, true, () => { // кнопка 'CTRL'
            if (!mp.players.local.vehicle || mp.tabletActive || mp.chatActive || mp.autoSaloonActive || mp.consoleActive || mp.inventoryActive || mp.tradeActive || mp.playerMenuActive || mp.documentsActive || mp.houseMenuActive) return;
            /* Показ меню взаимодействия. */
            var entity = mp.players.local.vehicle;
            if (entity) {
              var isDriver = mp.players.local.vehicle.getPedInSeat(-1) == localPlayer.handle;
              if (!isDriver) return;
              mp.events.call("interactionMenu.showVehicleMenu", entity, {
                  action: 'showEnter'
              });
              interectionMenu = 1;
            }
        });
        mp.keys.bind(17, false, () => { // кнопка 'CTRL'
            if (interectionMenu == 1) {
              mp.events.call("interactionMenu.hide");
              interectionMenu = 0;
              if (mp.tabletActive || mp.chatActive || mp.consoleActive || mp.autoSaloonActive || mp.inventoryActive || mp.tradeActive || mp.playerMenuActive || mp.documentsActive || mp.houseMenuActive || mp.selectMenuActive) return;
              setCursor(false);
            }
        });

        require('gamemode/scripts/voice.js')(menu);
        menu.execute(`$('.bottomHUD').show()`);
        menu.execute(`authCharacterSuccess()`);

        if (!mp.storage.data.familiar) mp.storage.data.familiar = {};
        var familiarList = mp.storage.data.familiar;
        if (!familiarList[mp.players.local.name]) familiarList[mp.players.local.name] = [];
        familiarList = familiarList[mp.players.local.name];
        for (var i = 0; i < familiarList.length; i++) {
            var rec = getPlayerByName(familiarList[i]);
            if (rec) {
                rec.isFamiliar = true;
            }
        }

        destroySelectMarkers();

        clearInterval(mainTimerId);
        mainTimerId = setInterval(() => {
            const localPlayer = mp.players.local;


            mp.events.call("inventory.setHealth", mp.players.local.getHealth());
            mp.events.call("inventory.setArmour", mp.players.local.getArmour());

            localPlayer.getAmmoWeapon = (weaponhash) => mp.game.invoke('0x015A522136D7F951', localPlayer.handle, weaponhash);
            localPlayer.currentWeapon = () => mp.game.invoke('0x0A6DB4965674D243', localPlayer.handle);
            localPlayer.getAmmoType = () => mp.game.invoke(`0xa38dcffcea8962fa`, localPlayer.handle, localPlayer.weapon);
            localPlayer.getWeaponSlot = (weaponhash) => mp.game.invoke('0x4215460B9B8B7FA0', weaponhash);

            var weaponHash = localPlayer.currentWeapon();
            var ammo = localPlayer.getAmmoWeapon(weaponHash);
            var ammoType = localPlayer.getAmmoType(localPlayer.weapon);
            var weaponSlot = localPlayer.getWeaponSlot(weaponHash);
            //let ammoClip = mp.game.weapon.getWeaponClipSize(weaponHash);

            var data = { ammo: ammo, ammoType: ammoType, weaponHash: localPlayer.weapon };
            menu.execute(`mp.events.call('hudControl', { data: ${JSON.stringify(data)}, event: 'setDataWeapon' })`);

            //var data = { ammo: ammo, ammoType: ammoType, ammoClip: ammoClip, weaponHash: weaponHash };
            //menu.execute(`mp.events.call('hudControl', { weapon: ${JSON.stringify(data)}, event: 'weapon' })`);

            if (followPlayer) {
                var pos = followPlayer.position;
                var localPos = mp.players.local.position;
                var dist = mp.game.system.vdist(pos.x, pos.y, pos.z, localPos.x, localPos.y, localPos.z);
                if (dist > 30) {
                    followPlayer = null;
                    return;
                }
                var speed = 3;
                if (dist < 10) speed = 2;
                if (dist < 5) speed = 1;
                mp.players.local.taskFollowNavMeshToCoord(pos.x, pos.y, pos.z, speed, -1, 1, true, 0);
            }

            var entity = getNearPlayerOrVehicle(mp.players.local.position, 10);
            if (entity && entity.type == "vehicle" && entity.getVariable("boot")) {
                var bootPos = getBootPosition(entity);
                var distToBoot = vdist(mp.players.local.position, bootPos);
                if (distToBoot < 1) {
                    if (mp.clientStorage.bootVehicleId == -1) {
                        mp.events.callRemote(`vehicle.requestItems`, entity.remoteId);
                        mp.events.call("setLocalVar", "bootVehicleId", entity.remoteId);
                    }
                } else {
                    if (mp.clientStorage.bootVehicleId != -1) {
                        mp.events.callRemote(`vehicle.requestClearItems`, mp.clientStorage.bootVehicleId);
                        mp.events.call("setLocalVar", "bootVehicleId", -1);
                    }
                }
            } else if (mp.clientStorage.bootVehicleId != -1) {
                mp.events.callRemote(`vehicle.requestClearItems`, mp.clientStorage.bootVehicleId);
                mp.events.call("setLocalVar", "bootVehicleId", -1);
            }

        }, 1000);

        requestAnimDicts();
    });

    var motherSkills = [2, 1, 6, 4, 6, 1, 2, 3, 2, 5, 0, 5, 6, 0, 4, 0, 1, 5, 3, 4, 3, 1];
		var fatherSkills = [4, 2, 4, 2, 1, 3, 6, 2, 5, 3, 1, 5, 0, 4, 6, 1, 5, 0, 3, 0, 3, 2, 6, 3];

    mp.events.add("showCharacterSkills", (fatherIndex, motherIndex) => {
        var player = mp.players.local;

        player.skills = [2, 2, 2, 2, 2, 2, 2];
        player.skills[motherSkills[motherIndex]] += 4;
        player.skills[fatherSkills[fatherIndex]] += 4;
        player.skills[player.skillIndex] += 10;

        mp.events.call("infoTable.setValues", "character_skills", player.skills);
    });

    var attachInfo = {
        "prop_box_ammo04a": {
            offset: {
                x: 0.2,
                y: -0.3,
                z: 0.1,
                rX: -45,
                rY: 20,
                rZ: 120
            },
            bone: 48,
            anim: {
                dict: "anim@heists@box_carry@",
                name: "idle",
                speed: 8,
                flag: 49
            }
        },
        "ex_office_swag_pills4": {
            offset: {
                x: 0.2,
                y: -0.3,
                z: 0.1,
                rX: -45,
                rY: 20,
                rZ: 120
            },
            bone: 48,
            anim: {
                dict: "anim@heists@box_carry@",
                name: "idle",
                speed: 8,
                flag: 49
            }
        },
        "hei_prop_heist_wooden_box": {
            offset: {
                x: 0.0,
                y: -0.3,
                z: 0.3,
                rX: -45.0,
                rY: 20.0,
                rZ: 120.0
            },
            bone: 48,
            anim: {
                dict: "anim@heists@box_carry@",
                name: "idle",
                speed: 8,
                flag: 49
            }
        },
        "prop_bucket_01a": {
            offset: {
                x: 0.2,
                y: -0.37,
                z: 0.2,
                rX: -85.0,
                rY: 0,
                rZ: 20.0
            },
            bone: 44,
            anim: {
                dict: "anim@heists@box_carry@",
                name: "idle",
                speed: 8,
                flag: 49
            }
        },
        "prop_feed_sack_01": {
            offset: {
                x: 0.0,
                y: -0.3,
                z: 0.075,
                rX: -45.0,
                rY: 20.0,
                rZ: 120.0
            },
            bone: 48,
            anim: {
                dict: "anim@heists@box_carry@",
                name: "idle",
                speed: 8,
                flag: 49
            }
        },
        "prop_pizza_box_02": {
            //   offset: {x: 0.0, y: -0.3, z: 0.1, rX: -45.0, rY: 10.0, rZ: 120.0},
            offset: {
                x: 0.0,
                y: -0.3,
                z: 0.0,
                rX: -45.0,
                rY: 0.0,
                rZ: 100.0
            },
            bone: 48,
            anim: {
                dict: "anim@heists@box_carry@",
                name: "idle",
                speed: 8,
                flag: 49
            }
        },
        // take_object 0 hei_prop_heist_binbag
        "hei_prop_heist_binbag": {
            offset: {
                x: 0,
                y: 0,
                z: -0.05,
                rX: -60.0,
                rY: -60.0,
                rZ: 0
            },
            bone: 73,
            anim: {
                dict: "anim@move_m@trash",
                name: "pickup",
                speed: 8,
                flag: 49
            }
        },
        "v_ind_cs_box02": {
            offset: {
                x: 0.0,
                y: -0.3,
                z: 0.3,
                rX: -45.0,
                rY: 10.0,
                rZ: 120.0
            },
            bone: 48,
            anim: {
                dict: "anim@heists@box_carry@",
                name: "idle",
                speed: 8,
                flag: 49
            }
        },
        "prop_veg_crop_03_pump": {
            offset: {
                x: 0.2,
                y: -0.3,
                z: 0.1,
                rX: -45,
                rY: 20,
                rZ: 120
            },
            bone: 48,
            anim: {
                dict: "anim@heists@box_carry@",
                name: "idle",
                speed: 8,
                flag: 49
            }
        },
        "prop_veg_crop_03_cab": {
            offset: {
                x: 0.2,
                y: -0.3,
                z: 0.1,
                rX: -45,
                rY: 20,
                rZ: 120
            },
            bone: 48,
            anim: {
                dict: "anim@heists@box_carry@",
                name: "idle",
                speed: 8,
                flag: 49
            }
        },
        "prop_weed_02": {
            offset: {
                x: 0.2,
                y: -0.3,
                z: 0.1,
                rX: -45,
                rY: 20,
                rZ: 120
            },
            bone: 48,
            anim: {
                dict: "anim@heists@box_carry@",
                name: "idle",
                speed: 8,
                flag: 49
            }
        },
        "prop_cs_trowel": {
            offset: {
                x: 0.01,
                y: 0.03,
                z: 0,
                rX: -119,
                rY: 10,
                rZ: 90
            },
            bone: 77,
            anim: {
                dict: "amb@world_human_gardener_plant@female@base",
                name: "base_female",
                speed: 8,
                flag: 1
            }
        },
    };
    var attachedObjects = {};
    var vehAttachedObjects = {};
    mp.takeObject = (entity, value) => {
        var info = attachInfo[value];
        if (!info) return attachInfo[value];
        var pos = entity.position;
        var a = info.anim;
        entity.clearTasksImmediately();
        entity.taskPlayAnim(a.dict, a.name, a.speed, 0, -1, a.flag, 0, false, false, false);
        if (attachedObjects[entity.remoteId]) {
            attachedObjects[entity.remoteId].destroy();
            delete attachedObjects[entity.remoteId];
        }
        attachedObjects[entity.remoteId] = mp.objects.new(mp.game.joaat(value), pos, {
            rotation: new mp.Vector3(0, 0, 30),
            dimension: -1
        });
        var o = info.offset;
        attachedObjects[entity.remoteId].attachTo(entity.handle, info.bone, o.x, o.y, o.z, o.rX, o.rY, o.rZ,
            false, false, false, false, 2, true);
    };
    mp.putObject = (entity, value) => {
        if (attachedObjects[entity.remoteId]) {
            attachedObjects[entity.remoteId].destroy();
            delete attachedObjects[entity.remoteId];
        }
        entity.clearTasksImmediately();
    };
    mp.events.addDataHandler("attachedObject", (entity, value) => {
        if (entity.type == "player") {
            if (!value) mp.putObject(entity, value);
            else mp.takeObject(entity, value);

            if (mp.players.local.remoteId == entity.remoteId) {
                throwAttachedObject = false;
            }
        }
    });
    mp.events.addDataHandler("animation", (entity, value) => {
        // debug(`setVariable: ${entity.name} animation ${value}`)
        if (entity.type == "player") {
            entity.clearTasksImmediately();
            if (value === null) return;
            value = Math.clamp(value, 0, animationInfo.length - 1);
            var a = animationInfo[value];
            mp.game.streaming.requestAnimDict(a.dict);
            while (!mp.game.streaming.hasAnimDictLoaded(a.dict)) {
                mp.game.wait(0);
            }
            entity.taskPlayAnim(a.dict, a.name, a.speed, 0, -1, a.flag, 0, false, false, false);
        }
    });

    mp.events.add("playAnim", (playerId, index) => {
        var player = mp.players.atRemoteId(playerId);
        if (!player) return;
        player.clearTasksImmediately();
        if (index === null) return;
        index = Math.clamp(index, 0, animationInfo.length - 1);
        var a = animationInfo[index];
        mp.game.streaming.requestAnimDict(a.dict);
        while (!mp.game.streaming.hasAnimDictLoaded(a.dict)) {
            mp.game.wait(0);
        }
        player.taskPlayAnim(a.dict, a.name, a.speed, 0, -1, a.flag, 0, false, false, false);

        if (player.remoteId == mp.players.local.remoteId) {
            if (index == 32) { // сбор урожая на ферме
                mp.isCropping = true;
                setTimeout(() => {
                    delete mp.isCropping;
                }, 7000);
            }
        }
    });

    mp.events.add("testAttach", (model, bone, x, y, z, rX, rY, rZ) => {
        if (attachedObjects[mp.players.local.remoteId]) attachedObjects[mp.players.local.remoteId].destroy();
        attachedObjects[mp.players.local.remoteId] = mp.objects.new(mp.game.joaat(model), mp.players.local.position, {
            rotation: new mp.Vector3(0, 0, 30),
            dimension: -1
        });
        attachedObjects[mp.players.local.remoteId].attachTo(mp.players.local.handle, bone, x, y, z, rX, rY, rZ,
            false, false, false, false, 2, true);
    });

    mp.events.add("testAttachOff", () => {
        if (attachedObjects[mp.players.local.remoteId]) attachedObjects[mp.players.local.remoteId].destroy();
    });

    mp.events.add("testVehAttach", (model, bone, x, y, z, rX, rY, rZ, number) => {
        if (!number) number = 0;
        var veh = mp.players.local.vehicle;
        if (!veh) return;
        if (!vehAttachedObjects[veh.remoteId]) vehAttachedObjects[veh.remoteId] = {};
        if (vehAttachedObjects[veh.remoteId][number]) vehAttachedObjects[veh.remoteId][number].destroy();
        vehAttachedObjects[veh.remoteId][number] = mp.objects.new(mp.game.joaat(model), veh.position, {
            rotation: new mp.Vector3(0, 0, 30),
            dimension: -1
        });
        vehAttachedObjects[veh.remoteId][number].attachTo(veh.handle, bone, x, y, z, rX, rY, rZ,
            false, false, false, false, 2, true);
    });

    mp.events.add("testVehAttachOff", (number) => {
        var veh = mp.players.local.vehicle;
        if (!veh) return;
        if (vehAttachedObjects[veh.remoteId] && vehAttachedObjects[veh.remoteId][number]) vehAttachedObjects[veh.remoteId][number].destroy();
    });
}
