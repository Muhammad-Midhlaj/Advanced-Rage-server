const {
    tuningVehicle
} = require("../modules/ls_customs/index");
const phoneOpen = require("../modules/phone.js");

function showRegError(player, errorText) {
    player.call("character_creation::continue");
    player.utils.error(errorText);
}

module.exports = {
    "setSex": (player, sex) => {
        player.utils.initNewCharacter(sex, false);
    },

    "setClothes": (player, componentId, drawable, texture = 0) => {
        player.setClothes(componentId, drawable, texture, 0);
    },

    "setSpawn": (player, spawnPoint) => {
        player.spawnPoint = spawnPoint;
        DB.Handle.query(`UPDATE characters SET spawn = ? WHERE id = ?`,
            [spawnPoint, player.sqlId]);
        player.call(`playerMenu.setSpawn`, [player.spawnPoint, 'server']);
    },

    "setHouseId": (player, houseId) => {
        player.houseId = houseId;
        DB.Handle.query(`UPDATE characters SET houseId = ? WHERE id = ?`,
            [houseId, player.sqlId]);
        player.call(`playerMenu.setHouseId`, [player.houseId, 'server']);
    },

    "regCharacter": (player, rawData) => {
        // console.log(`regCharacter: ${rawData}`);
        const data = JSON.parse(rawData);

        if (!player.account) return showRegError(player, `You're not logged in!`);
        var reg = /^([A-Z][a-z]{1,15}) ([A-Z][a-z]{1,15})$/;
        if (!reg.test(data.characterName)) return showRegError(player, `Name ${characterName} Incorrectly!`);
        if (data.skills.length != 7) return showRegError(player, `Wrong number of skills!`);
        var skillsCount = 0;
        var startMoney = 250;
        data.skills.forEach((skill) => {
            skillsCount += skill;
        });
        if (skillsCount > 10 + 10 + 6 * 2) return showRegError(player, `Exceeded the number of skill points!`);
        DB.Handle.query("SELECT null FROM characters WHERE accountId=?", [player.account.id], (e, result) => {
            if (result.length >= Config.maxCharacters) return showRegError(player, `You've got max number of characters!`);
            /*if (result.length === 0) {
                var PromoId = player.account.promoId;
                DB.Handle.query(`UPDATE accounts SET promocode='' WHERE id=?`, [player.account.id], (e, result) => {});
            } else {
                var PromoId = 0;
            }*/

            DB.Handle.query(`SELECT null FROM characters WHERE name=?`, [data.characterName], (e, result) => {
                if (e) {
                    showRegError(player, "There was an unforeseen error, try again");
                    console.log(e);
                    return;
                }

                if (result.length > 0) {
                    player.call(`lightCharacterName`);
                    return showRegError(player, `Character ${data.characterName} already registered!`);
                }

                player.sex = data.gender;
                var bodyItems = [{
                        itemId: 7,
                        params: {
                            owner: 0,
                            sex: player.sex,
                            variation: data.clothes.top.drawable, // player.getClothes(11).drawable,
                            texture: data.clothes.top.texture, // player.getClothes(11).texture,
                            torso: data.clothes.top.torso, // player.getClothes(3).drawable,
                            rows: 4,
                            cols: 4,
                        }
                    },
                    {
                        itemId: 8,
                        params: {
                            owner: 0,
                            sex: player.sex,
                            variation: data.clothes.legs.drawable, // player.getClothes(4).drawable,
                            texture: data.clothes.legs.texture, // player.getClothes(4).texture,
                            rows: 3,
                            cols: 5,
                        }
                    },
                    {
                        itemId: 9,
                        params: {
                            owner: 0,
                            sex: player.sex,
                            variation: data.clothes.shoes.drawable, // player.getClothes(6).drawable,
                            texture: data.clothes.shoes.texture, // player.getClothes(6).texture,
                        }
                    }
                ];

                const pos = SpawnInfo.user_spawn[getRandom(0, SpawnInfo.user_spawn.length)];
                const faceFeatures = data.faceFeatures.map((faceFeature) => Math.round(faceFeature * 100) / 100);
                let new_number = phoneOpen.getPhoneNumber();
                var query = `INSERT INTO characters (name,regIp,sex,lastIp,mother,father,shapeMix,skinMix,
                    eyeColor,hair,hairColor,faceFeatures,skills,accountId,x,y,z,h,bank,phone) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
                var values = [data.characterName, player.ip, player.sex, player.ip, data.mother,
                    data.father, data.shapeMix, data.skinMix, data.appearance.eyeColor, data.appearance.hair,
                    data.appearance.hairColor, JSON.stringify(faceFeatures), JSON.stringify(data.skills),
                    player.account.id, pos.x, pos.y, pos.z, pos.h, startMoney, new_number
                ];

                DB.Handle.query("INSERT INTO phone_taken (num) VALUES (?)", new_number);

                DB.Handle.query(query, values, (e, result) => {
                    if (e) {
                        showRegError(player, "There was an unforeseen error, try again");
                        console.log(e);
                        return;
                    }
                    const headOverlayQuery = "INSERT INTO characters_headoverlays (character_id, overlay_id, overlay_index, opacity, first_color, second_color) VALUES ?";
                    const headOverlayParams = [];

                    for (const headOverlay of data.appearance.headOverlays) {
                        headOverlayParams.push([result.insertId, headOverlay.id, headOverlay.value, headOverlay.opacity, headOverlay.color, headOverlay.color]);
                    }
                    DB.Handle.query(headOverlayQuery, [headOverlayParams]);

                    for (var i = 1; i < bodyItems.length; i++) {
                        var item = bodyItems[i];
                        item.params.owner = result.insertId;
                        mp.inventory.autoIncrement++;
                        DB.Handle.query("INSERT INTO inventory_players (playerId,itemId,`index`,params) VALUES (?,?,?,?)",
                        [result.insertId, item.itemId, item.itemId - 1, JSON.stringify(item.params)], (e, result) => {
                            mp.inventory.autoIncrement = result.insertId + 1;
                        });
                    }

                    var item = bodyItems[0];
                    item.params.owner = result.insertId;
                    // mp.inventory.autoIncrement++;
                    DB.Handle.query("INSERT INTO inventory_players (playerId,itemId,`index`,params) VALUES (?,?,?,?)",
                    [result.insertId, item.itemId, item.itemId - 1, JSON.stringify(item.params)], (e, result2) => {
                        // mp.inventory.autoIncrement = result.insertId + 1;

                        // кладем доки в брюки
                        var docsParams = {
                            owner: result.insertId,
                            licenses: [],
                            weapon: [0, 0, 0, 0, 0, 0, 0],
                            work: []
                        };

                        DB.Handle.query("INSERT INTO inventory_players (playerId,itemId,`index`,params,parentId) VALUES (?,?,?,?,?)",
                            [result.insertId, 16, 0, JSON.stringify(docsParams), result2.insertId], (e) => {
                            if (e) console.log(e);
                            // mp.inventory.autoIncrement = result.insertId + 1;
                        });

                    });

                    player.utils.success(`Character ${data.characterName} Registered!`);
                    player.dimension = 0;
                    player.call("character_creation::stop");
                    player.utils.initChoiceCharacter();
                });
            });
        });
    },

    "copyPed": (player, characterIndex) => {
        player.utils.copyPed(characterIndex);
    },

    "authCharacter": (player, characterIndex) => {
        //console.log(`authCharacter: ${characterIndex}`);
        if (!player.account) return player.utils.error(`You're not logged in!`);
        if (!player.characters) return player.utils.error(`Character not found!`);
        var character = player.characters[characterIndex];
        if (character.ban > 0) {
            let now = new Date().getTime() / 1000;
            let diff = now - character.ban;
            if (diff > 0) {
                player.utils.success(`Your character is banned!`);
                DB.Handle.query("UPDATE characters SET ban=? WHERE id=?", [0, character.id]);
            } else {
                let ban_time = Math.abs(diff / 24 / 60 / 60);
                if (ban_time < 1) ban_time = 1;
                player.utils.error(`Your character is banned ${Math.round(ban_time)} Days!`);
                player.kick("BAN");
                return;
            }
        }
        player.model = (character.sex == 1) ? mp.joaat("MP_M_Freemode_01") : mp.joaat("MP_F_Freemode_01");
        player.dimension = 0;

        var undershirtDefault = (character.sex == 1) ? 15 : 14;
        player.setClothes(8, undershirtDefault, 0, 0);
        player.setClothes(2, character.hair, 0, 0);
        player.setHairColor(character.hairColor, character.hairHighlightColor);
        player.eyeColor = character.eyeColor;
        player.setHeadBlend(character.mother, character.father, 0, character.mother, character.father, 0, character.shapeMix, character.skinMix, 0);
        player.setFaceFeatures(character.faceFeatures);

        DB.Handle.query("SELECT * FROM characters_headoverlays WHERE character_id = ?", [character.id], (e, result) => {
            player.overlayColors = {};
            for (let i = 0; i < result.length; i++) {
                player.overlayColors[result[i].overlay_id] = [result[i].first_color, result[i].second_color];
                player.setHeadOverlay(result[i].overlay_id, [result[i].overlay_index, result[i].opacity, result[i].first_color, result[i].second_color]);
            }
        });

        initPlayerUtils(player);
        initDBParams(player, character);
        initLocalParams(player);
        initPlayerInventory(player);
        initPlayerTelephone(player);
        initFinesCount(player);
        // initSatietyTimer(player);
        initJobSkills(player);
        spawnPlayerCars(player);
        mp.broadcastEnterFactionPlayers(player);
        initPeds(player);
        initCutscenes(player);
        initPlayerReports(player);

        delete player.characters;
        delete player.accountRegistrated;

        character.health = 100;
        player.utils.spawn(character.health);
        player.armour = character.armour;

        player.call("setMoney", [player.money]);
        player.call(`hudControl.setData`, [{
            money: player.money,
            bank: player.bank,
            wanted: player.wanted
        }]);
        player.call("authCharacter.success");

        player.authTime = new Date().getTime();

        /*//начисление награды за промокоды
        DB.Handle.query(`SELECT * FROM promocodes WHERE character_id=? and reward_sum > 0`, [character.id], (e, result) => {
            //console.log("chekreward");
            if (result.length > 0) {
                //console.log("начисляем награду "+result[0]['reward_sum']);
                player.utils.success(`На ваш счет зачислено ${result[0]['reward_sum']}$`);
                player.utils.setBankMoney(player.bank + result[0]['reward_sum']);
                DB.Handle.query("UPDATE promocodes SET reward_sum=0 WHERE character_id=?", [character.id]);
            }
        });

        if (character.promoId !== 0) {
            var characterLevel = mp.convertMinutesToLevelRest(character.minutes);
            //console.log("За персонажем закреплен промо-код! Level = ",characterLevel);
            //DB.Handle.query(`SELECT * FROM promocodes_data WHERE regId=? and idcode=?`, [player.account.id, character.promoId], (e, result) => {
            DB.Handle.query(`SELECT c.reward_config,d.rewarded FROM promocodes_data as d LEFT JOIN promocodes as c ON  d.idcode = c.id WHERE d.regId=?`, [player.account.id], (e, result) => {
                if (result.length > 0) {
                    var dataRewardPromo = JSON.parse(result[0]['rewarded']);
                    var configRewardPromo = JSON.parse(result[0]['reward_config']);

                    var characterSumRevard = 0;
                    var streamerSumRevard = 0;

                    if (!dataRewardPromo.lvl2 && characterLevel.level >= 2) {
                        //console.log("награда за 2й лвл выдаётся");
                        dataRewardPromo.lvl2 = true;
                        characterSumRevard = characterSumRevard + configRewardPromo.lvl2;
                        streamerSumRevard = streamerSumRevard + configRewardPromo.lvl2;
                    }

                    if (!dataRewardPromo.lvl3 && characterLevel.level >= 3) {
                        //console.log("награда за 3й лвл выдаётся");
                        dataRewardPromo.lvl3 = true;
                        characterSumRevard = characterSumRevard + configRewardPromo.lvl3;
                    }

                    if (!dataRewardPromo.lvl5 && characterLevel.level >= 5) {
                        //console.log("награда за 5й лвл выдаётся");
                        dataRewardPromo.lvl5 = true;
                        characterSumRevard = characterSumRevard + configRewardPromo.lvl5;
                    }

                    if (!dataRewardPromo.lvl10 && characterLevel.level >= 10) {
                        //console.log("награда за 10й лвл выдаётся");
                        dataRewardPromo.lvl10 = true;
                        characterSumRevard = characterSumRevard + configRewardPromo.lvl10;
                        streamerSumRevard = streamerSumRevard + configRewardPromo.lvl10;
                    }


                    if (streamerSumRevard > 0) {
                        DB.Handle.query("UPDATE promocodes SET reward_sum=reward_sum+? WHERE id=?", [streamerSumRevard, character.promoId]);
                    }
                    if (characterSumRevard > 0) {
                        DB.Handle.query("UPDATE promocodes_data SET rewarded=? WHERE idcode=? and regId=?", [JSON.stringify(dataRewardPromo), character.promoId, player.account.id]);
                        player.utils.setBankMoney(player.bank + characterSumRevard);
                    }
                }
            });

        } */

        // конец начисления награды

        var data = {
            id: player.id,
            name: player.name,
            score: player.minutes,
            ping: player.ping
        };

        if (player.warntime > 0) {
            let now = new Date().getTime() / 1000;
            let diff = now - player.warntime;
            if (diff > 0) {
                player.warn--;
                player.utils.success(`Players was warned. Warn: ${player.warn}`);
                DB.Handle.query("UPDATE characters SET warn=? WHERE id=?", [player.warn, character.id]);
                if (player.warn > 0)
                    DB.Handle.query("UPDATE characters SET warntime=? WHERE id=?", [date.getTime() / 1000 + 15 * 24 * 60 * 60, character.id]);
                else
                    DB.Handle.query("UPDATE characters SET warntime=? WHERE id=?", [0, character.id]);
            } else {
                player.utils.error(`Warn: ${player.warn}`);
            }
        }

        if (player.mute > 0) {
            player.startMute = parseInt(new Date().getTime() / 1000);
            player.muteTimerId = timerId = setTimeout(() => {
                try {
                    player.utils.stopMute();
                } catch (err) {
                    console.log(err.stack);
                }
            }, (player.mute * 60) * 1000);
            player.utils.error(`Chat is blocked on ${player.mute.toFixed(0)} Minutes!`);
        }

        if (player.vmute > 0) {
            player.call("control.voice.chat", [true]);
            player.startVoiceMute = parseInt(new Date().getTime() / 1000);
            player.muteVoiceTimerId = timerId = setTimeout(() => {
                try {
                    player.utils.stopVoiceMute();
                } catch (err) {
                    console.log(err.stack);
                }
            }, (player.vmute * 60) * 1000);
            player.utils.error(`The microphone is locked on ${player.vmute.toFixed(0)} Minutes!`);
        }

        mp.players.forEach((rec) => {
            if (rec.sqlId) {
                if (rec.admin > 0) rec.call(`playersOnline.add`, [data]);
                if (rec.id != player.id && player.admin > 0) player.call(`playersOnline.add`, [{
                    id: rec.id,
                    name: rec.name,
                    score: rec.minutes,
                    ping: rec.ping
                }]);
            }
        });
    },

    "deleteCharacter": (player, name) => {
        // debug(`deleteCharacter: ${player.name} ${name}`)
        if (player.characters) {
            for (var i = 0; i < player.characters.length; i++) {
                var ch = player.characters[i];
                if (ch.name == name) {
                    if (ch.ban > 0) {
                      let now = new Date().getTime() / 1000;
                      let diff = now - ch.ban;
                      if (diff < 0) {
                          let ban_time = Math.abs(diff / 24 / 60 / 60);
                          if (ban_time < 1) ban_time = 1;
                          player.utils.error(`Your character is banned ${Math.round(ban_time)} Days!`);
                          player.kick("BAN");
                          return;
                      }
                    } else {
                      DB.Handle.query(`UPDATE characters SET accountId=? WHERE id=?`, [-player.account.id, ch.id], () => {
                          player.utils.initChoiceCharacter();
                          player.utils.success(`Character ${name} Removed!`);
                      });
                      return;
                    }
                }
            }
        }
        player.utils.error(`Character ${name} Not found!`);
    },

    "newCharacter": (player) => {
        player.utils.initNewCharacter(1);
    },

    "initNewCharacter": (player) => {
        player.dimension = player.id + 1;
        player.call("character_creation::init");
    },

    "characters.openSlot": (player, type) => {
        // debug(`characters.openSlot: ${player.name} ${type}`);
        if (type == "achievements") {
            var achievements = mp.economy["open_slot_achievements_count"].value;
            var count = player.achievements.getFinishedCount();
            if (player.account.achievements_slot) return player.utils.error(`The achievement slot is already open!`);
            if (count < achievements) return player.utils.error(`Achievements must be discovered! (${count} out of ${achievements})`);
            DB.Handle.query(`UPDATE accounts SET achievements_slot=? WHERE id=?`,
                [1, player.account.id]);
            player.account.achievements_slot = true;
        } else if (type == "donate") {
            if (!player.account.achievements_slot) return player.utils.error(`First, unlock the achievement slot!`);
            if (player.account.donate_slot) return player.utils.error(`The uC slot is already open!`);
            var price = mp.economy["open_slot_donate_price"].value;
            if (player.account.donate < price) return player.utils.error(`Need ${price} uC!`);
            player.account.donate -= price;
            DB.Handle.query(`UPDATE accounts SET donate_slot=?,donate=? WHERE id=?`,
                [1, player.account.donate, player.account.id]);
            player.account.donate_slot = true;
        }
        player.utils.initChoiceCharacter();
    },
}

function initDBParams(player, params) {
    player.sqlId = params.id;
    player.name = params.name;
    player.sex = params.sex;
    player.satiety = params.satiety;
    player.thirst = params.thirst;
    player.hair = params.hair;
    player.admin = params.admin;
    player.lang = params.lang;
    player.helper = params.helper;
    player.phone = { number: params.phone, contacts: [], messages: [] };
    player.faction = params.faction;
    player.spawnPoint = params.spawn;
    player.donateBizes = params.donateBizes;
    player.donateHouse = params.donateHouse;
    player.donateCars = params.donateCars;
    player.testDrive = params.testDrive;
    player.mute = params.mute;
    player.vmute = params.vmute;
    player.houseId = params.houseId;
    player.rank = params.rank;
    player.warntime = params.warntime;
    player.factionDate = params.factionDate;
    player.job = params.job;
    player.warn = params.warn;
    player.demorgan = params.demorgan;
    player.jobDate = params.jobDate;
    player.wanted = params.wanted;
    player.law = params.law;
    player.crimes = params.crimes;
    player.money = params.money;
    player.bank = params.bank;
    player.pay = params.pay;
    player.skills = params.skills;
    player.rp = params.rp;
    player.minutes = params.minutes;
    player.vipDate = params.vipDate;
    player.arrestCell = params.arrestCell;
    player.arrestTime = params.arrestTime;
    player.spawnPos = {
        x: params.x,
        y: params.y,
        z: params.z,
        h: params.h
    };

    player.utils.setWanted(player.wanted);
    player.call(`inventory.setSatiety`, [player.satiety]);
    player.call(`inventory.setThirst`, [player.thirst]);
    if (player.admin) player.setVariable("admin", player.admin);
}

function initPlayerUtils(player) {
    player.utils.spawn = (health = 100) => {
        if (player.arrestTime > 0 && player.demorgan < 1) return player.utils.doArrest(player.arrestCell, player.arrestTime, true);
        var pos = getPlayerSpawnPos(player);
        player.spawn(pos);
        player.heading = pos.h;
        player.health = health;
        player.dimension = 0;
    };
    player.utils.setLocalVar = (key, value) => {
        //debug(`setLocalVar: ${key} => ${value}`);
        player.call("setLocalVar", [key, value]);
    };
    player.utils.setBankMoney = (newMoney) => {
        newMoney = Math.clamp(newMoney, 0, Number.MAX_VALUE);
        mp.logs.addLog(`Player ${player.name} was appointed with ${player.bank} on ${newMoney} bank money`, 'main', player.account.id, player.sqlId, { oldMoney: player.money, newMoney: newMoney });
        var diff = newMoney - player.bank;
        if (diff == 0) return;
        player.call(`hudControl.updateBank`, [newMoney]);
        player.bank = newMoney;
        DB.Handle.query("UPDATE characters SET bank=? WHERE id=?", [player.bank, player.sqlId]);
        player.utils.setLocalVar("bank", player.bank);
    };
    player.utils.leaveDemorgan = () => {
        player.utils.setLocalVar("demorganSet", undefined);
        player.position = new mp.Vector3(SpawnInfo.demorgan_exit.x, SpawnInfo.demorgan_exit.y, SpawnInfo.demorgan_exit.z);
        player.heading = SpawnInfo.demorgan_exit.h;
        player.demorgan = 0;
        DB.Handle.query("UPDATE characters SET demorgan=? WHERE id=?", [0, player.sqlId]);
        player.utils.success(`You're released from the demorgan!`);
        if (player.demorganTimerId) {
          clearTimeout(player.demorganTimerId);
          delete player.demorganTimerId;
        }
        delete player.startDemorgan;
    };
    player.utils.stopVoiceMute = () => {
        player.vmute = 0;
        DB.Handle.query("UPDATE characters SET vmute=? WHERE id=?", [0, player.sqlId]);
        player.call("control.voice.chat", [false]);
        player.utils.success(`Your microphone is unlocked!`);
        if (player.muteTimerId) {
          clearTimeout(player.muteVoiceTimerId);
          delete player.muteVoiceTimerId;
        }
        delete player.startVoiceMute;
	 };
	  player.utils.stopMute = () => {
        player.mute = 0;
        DB.Handle.query("UPDATE characters SET mute=? WHERE id=?", [0, player.sqlId]);
        player.utils.success(`Your chat is unlocked!`);
        if (player.muteTimerId) {
          clearTimeout(player.muteTimerId);
          delete player.muteTimerId;
        }
        delete player.startMute;
  	};
    player.utils.setDonate = (newDonate) => {
        player.account.donate = newDonate;
        player.utils.setLocalVar("donate", player.account.donate);
        DB.Handle.query("UPDATE accounts SET donate = ? WHERE id=?", [player.account.donate, player.account.id]);
    };
    player.utils.setMoney = (newMoney, dontTouchInventory, callback) => {
        newMoney = Math.clamp(newMoney, 0, Number.MAX_VALUE);
        mp.logs.addLog(`Player ${player.name} was appointed with ${player.money} on ${newMoney} Cash`, 'main', player.account.id, player.sqlId, { oldMoney: player.money, newMoney: newMoney });
        var diff = newMoney - player.money;
        if (diff == 0) return;

        player.call(`hudControl.updateMoney`, [newMoney]);
        player.utils.setLocalVar("money", newMoney);

        player.money = newMoney;
        DB.Handle.query("UPDATE characters SET money=? WHERE id=?", [player.money, player.sqlId], () => {
            callback();
        });

        if (dontTouchInventory) return;
        if (diff < 0) {
            //take money
            diff *= -1;
            var array = player.inventory.getArrayByItemId(4); // money
            for (var key in array) {
                var item = array[key];
                if (item.params.count > diff) {
                    item.params.count -= diff;
                    diff = 0;
                    player.inventory.updateParams(item.id, item);
                    break;
                }

                diff -= item.params.count;
                player.inventory.delete(item.id, null, true);
            }
            if (player.money == 0) {
                var array = player.inventory.getArrayByItemId(4); // money
                for (var key in array) {
                    var item = array[key];
                    player.inventory.delete(item.id);
                }
            }
        } else {
            //give money
            var array = player.inventory.getArrayByItemId(4); //money
            var values = Object.values(array);
            if (values.length == 0) {
                player.inventory.add(4, {
                    count: newMoney
                }, {}, null, true);
            } else {
                var moneyItem = values[0];
                moneyItem.params.count += diff;
                player.inventory.updateParams(moneyItem.id, moneyItem);
            }
        }
    };
    player.utils.bank = (title, text) => {
        player.call("BN_ShowWithPicture", [title, "Bank", text, "CHAR_BANK_MAZE", 2]);
    };
    player.utils.setFaction = (faction, rank = 0) => {
        //debug(`player.utils.setFaction: ${faction}`);
        mp.fullDeleteItemsByFaction(player.sqlId, player.faction);
        if(faction <= 0) {
            mp.broadcastExitFactionPlayers(player);
            mp.clearFactionPlayers(player);
        }
        player.faction = Math.clamp(faction, 0, mp.factions.length);
        player.rank = rank;
        if (player.faction && !rank) player.rank = 1;
        player.utils.setLocalVar("faction", player.faction);
        player.utils.setLocalVar("factionRank", player.rank);
        DB.Handle.query("UPDATE characters SET faction=?,rank=? WHERE id=?", [player.faction, player.rank, player.sqlId]);
        if (player.faction > 0) {
            var faction = mp.factions.getBySqlId(player.faction);
            var rankName = mp.factions.getRankName(player.faction, player.rank);
            var rankPay = mp.factions.getRankPay(player.faction, player.rank);
            player.utils.setSpawn(2);
            player.utils.setLocalVar("factionRankPay", rankPay);
            player.utils.setLocalVar("factionName", faction.name);
            player.utils.setLocalVar("factionRankName", rankName);
            player.utils.setLocalVar("factionLeader", faction.leaderName);
            player.utils.setLocalVar("factionLastRank", mp.factionRanks[player.faction].length - 2);
            mp.broadcastEnterFactionPlayers(player);
        }

    };
    player.utils.setFactionRank = (rank = 1) => {
        //debug(`player.utils.setFaction: ${faction}`);
        if (rank < 1) rank = 1;
        player.rank = rank;
        if (player.faction && !rank) player.rank = 1;
        player.utils.setLocalVar("factionRank", player.rank);
        DB.Handle.query("UPDATE characters SET rank=? WHERE id=?", [player.rank, player.sqlId]);
        if (player.faction > 0) {
            var faction = mp.factions.getBySqlId(player.faction);
            var rankName = mp.factions.getRankName(player.faction, player.rank);
            var rankPay = mp.factions.getRankPay(player.faction, player.rank);
            player.utils.setLocalVar("factionRankPay", rankPay);
            player.utils.setLocalVar("factionRankName", rankName);
            player.utils.setLocalVar("factionLeader", faction.leaderName);
            mp.updateFactionPlayers(player);
        }
    };
    player.utils.setAdmin = (adminLevel) => {
        player.admin = Math.clamp(adminLevel, 0, Config.maxLevelAdmin);
        player.utils.setLocalVar("admin", player.admin);
        player.setVariable("admin", player.admin);
        DB.Handle.query("UPDATE characters SET admin=? WHERE id=?", [player.admin, player.sqlId]);
        if (player.admin) initPlayerReports(player);
    };
    player.utils.changeJob = (job) => { // ВРЕМЕННЫЙ ВАРИАНТ
        if (job < 0) job = 0;
        player.job = job;
        if (job !== 0) {
            var jobName = mp.jobs[player.job - 1].name;
            player.utils.setLocalVar("jobName", jobName);
        }
        player.utils.setLocalVar("job", player.job);
    };
    player.utils.setJob = (job) => {
        if (job < 0) job = 0;
        player.job = job;
        if (job !== 0) {
            var jobName = mp.jobs[player.job - 1].name;
            player.utils.setLocalVar("jobName", jobName);
        }
        player.utils.setLocalVar("job", player.job);
        DB.Handle.query("UPDATE characters SET job=? WHERE id=?", [player.job, player.sqlId]);
    };
    player.utils.setJobSkills = (job, exp) => {
        job = Math.clamp(job, 1, mp.jobs.length - 1);
        if (!player.jobSkills[job - 1]) {
            DB.Handle.query("INSERT INTO jobs_skills (playerId, jobId, exp) VALUES (?,?,?)",
                [player.sqlId, job, exp]);
        } else if (!exp) {
            DB.Handle.query("DELETE FROM jobs_skills WHERE playerId=? AND jobId=?", [player.sqlId, job]);
        } else {
            DB.Handle.query("UPDATE jobs_skills SET exp=? WHERE playerId=? AND jobId=?",
                [exp, player.sqlId, job]);
        }
        player.jobSkills[job - 1] = exp;
    };
    player.utils.setWanted = (newWanted) => {
        //debug(`player.utils.setWanted: ${newWanted}`)
        newWanted = Math.clamp(newWanted, 0, Config.maxWantedLevel);
        var crime = 0;
        player.call(`hudControl.updateWanted`, [newWanted]);
        if (newWanted > player.wanted) crime = newWanted - player.wanted;
        player.crimes += crime;
        player.law -= crime;
        player.utils.setLocalVar("wanted", newWanted);
        //player.setVariable("wanted", newWanted);

        if (player.wanted != newWanted) DB.Handle.query("UPDATE characters SET wanted=?,law=?,crimes=? WHERE id=?", [newWanted, player.law, player.crimes, player.sqlId]);
        player.wanted = newWanted;
        if (!player.wanted) return;

        //таймер на автом. снятие розыска
        var playerId = player.id;
        var playerSqlId = player.sqlId;
        if (player.wantedTimer) clearInterval(player.wantedTimer);
        player.wantedTimer = timerId = setInterval(() => {
            try {
                var rec = mp.players.at(playerId);
                if (!rec || rec.sqlId != playerSqlId || rec.wanted <= 0) {
                    clearInterval(timerId);
                    return 0;
                }
                rec.wanted--;
                player.call(`hudControl.updateWanted`, [rec.wanted]);
                rec.utils.setLocalVar("wanted", rec.wanted);
                if (!rec.wanted) rec.utils.info(`Your level of tracing has been cleared!`);
                DB.Handle.query("UPDATE characters SET wanted=? WHERE id=?", [rec.wanted, rec.sqlId]);
                if (rec.wanted <= 0) clearInterval(timerId);
            } catch (err) {
                terminal.log(err.stack);
            }
        }, mp.economy["clear_wanted_time"].value);
    };
    player.utils.setArrestTime = (arrestSeconds) => {
        //debug(`${player.name} setArrestTime ${arrestSeconds}`);
        if (arrestSeconds < 0) arrestSeconds = 0;
        player.arrestTime = arrestSeconds;

        DB.Handle.query("UPDATE characters SET arrestTime=? WHERE id=?", [arrestSeconds, player.sqlId]);
    };
    player.utils.doArrest = (cellIndex, arrestSeconds, isSpawn) => {
        //debug(`player doArrest ${player.name}<br/>cellIndex: ${cellIndex}<br/>seconds: ${arrestSeconds} isSpawn:  ${isSpawn}`);
        cellIndex = Math.clamp(cellIndex, 0, mp.policeCells.length - 1);
        if (player.vehicle) player.removeFromVehicle();
        player.startArrest = parseInt(new Date().getTime() / 1000);
        player.arrestCell = cellIndex;
        // TODO: одевать в форму тюремщика
        if (player.hasCuffs) {
            delete player.hasCuffs;
            player.playAnimation("special_ped@tonya@intro", 'idle', 1, 49);
            player.utils.setLocalVar("hasCuffs", false)
            player.setClothes(7, 0, 0, 0);
        }
        player.call("stopFollowToPlayer");
        if (isSpawn) player.spawn(mp.policeCells[cellIndex]);
        else player.position = mp.policeCells[cellIndex];
        player.heading = mp.policeCells[cellIndex].h;

        player.utils.setArrestTime(arrestSeconds);

        var playerId = player.id;
        var playerSqlId = player.sqlId;
        if (player.arrestUpdaterId) clearInterval(player.arrestUpdaterId);
        player.arrestUpdaterId = updaterId = setInterval(() => {
            try {
                var rec = mp.players.at(playerId);
                if (!rec || rec.sqlId != playerSqlId || rec.arrestTime <= 0) {
                    clearInterval(updaterId);
                    return 0;
                }

                rec.utils.setArrestTime(rec.arrestTime - 120);
                if (rec.arrestTime - 120 <= 0) {
                    clearInterval(updaterId);
                    delete rec.arrestUpdaterId;
                }
            } catch (err) {
                terminal.error(err.stack);
            }
        }, 120000);

        if (player.arrestTimerId) clearTimeout(player.arrestTimerId);
        player.arrestTimerId = timerId = setTimeout(() => {
            try {
                var rec = mp.players.at(playerId);
                if (!rec || rec.sqlId != playerSqlId || rec.arrestTime <= 0) {
                    clearTimeout(timerId);
                    return 0;
                }
                delete rec.startArrest;
                delete rec.arrestCell;
                delete rec.arrestUpdaterId;
                delete rec.arrestTimerId;

                rec.position = mp.policeCellsExit;
                //rec.spawn(mp.policeCellsExit);
                rec.heading = mp.policeCellsExit.h;

                rec.utils.setArrestTime(0);
                DB.Handle.query("UPDATE characters SET arrestCell=? WHERE id=?", [0, rec.sqlId]);
                rec.utils.success(`You're released! Please follow state laws`);
            } catch (err) {
                console.log(err.stack);
            }
        }, arrestSeconds * 1000);
    };
    player.utils.clearArrest = () => {
        delete player.startArrest;
        delete player.arrestCell;
        delete player.arrestUpdaterId;
        delete player.arrestTimerId;

        player.position = mp.policeCellsExit;
        //rec.spawn(mp.policeCellsExit);
        player.heading = mp.policeCellsExit.h;

        player.utils.setArrestTime(0);
        DB.Handle.query("UPDATE characters SET arrestCell=? WHERE id=?", [0, player.sqlId]);
    };
    player.utils.setCuffs = (enable) => {
        if (enable) {
            player.playAnimation("mp_arresting", 'idle', 1, 49);
            player.utils.setLocalVar("hasCuffs", true);
            var index = (player.sex == 1) ? 41 : 25;
            player.setClothes(7, index, 0, 0);
            player.hasCuffs = true;
        } else {
            delete player.hasCuffs;
            player.playAnimation("special_ped@tonya@intro", 'idle', 1, 49);
            player.utils.setLocalVar("hasCuffs", false)
            player.setClothes(7, 0, 0, 0);
        }
    };
    player.utils.giveWeapon = (item) => {
        if (!item.params.weaponHash) return;
        player.giveWeapon(item.params.weaponHash, 0);
        player.setWeaponAmmo(item.params.weaponHash, parseInt(item.params.ammo));
        //player.call(`setWeaponAmmo`, [hash, item.params.ammo]);
    };
    player.utils.setSpawn = (spawnPoint) => {
        player.spawnPoint = spawnPoint;
        DB.Handle.query(`UPDATE characters SET spawn = ? WHERE id = ?`,
            [spawnPoint, player.sqlId]);
        player.call(`playerMenu.setSpawn`, [player.spawnPoint, 'server']);
    };
    player.utils.setHouseId = (houseId) => {
        player.houseId = houseId;
        DB.Handle.query(`UPDATE characters SET houseId = ? WHERE id = ?`,
            [houseId, player.sqlId]);
        player.call(`playerMenu.setHouseId`, [player.houseId, 'server']);
    };
    player.utils.setReport = (event, param) => {
        // if (player.admin <= 0) {
            if(event == 'setNewReport') {
                player.call(`reportSystem.reports`, [param]);
            } else if(event == 'setNewMessage') {
                player.call(`reportSystem.messages`, [param]);
            } else if(event == 'closeTicket') {
                player.call(`reportSystem.close`, [param]);
            }
        // }

        mp.players.forEach((rec) => {
            if (rec.admin > 0 && rec.load == 1) {
                if(event == 'setNewReport') {
                    rec.call(`adminPanel.reports`, [param]);
                    rec.utils.warning(`A new ticket has arrived...`);
                } else if(event == 'setNewMessage') {
                    rec.call(`adminPanel.messages`, [param]);
                } else if(event == 'closeTicket') {
                    rec.call(`adminPanel.closeTicket`, [param]);
                }
            }
        });
    };
    player.utils.addHouse = (house) => {
        var houses = {
            sqlId: house.sqlId,
            class: house.class,
            price: house.price,
            garage: house.garage,
            status: house.closed,
            rentPrice: parseInt(house.price / 100) * mp.economy["house_tax"].value,
            x: house.h,
            y: house.y,
            z: house.z,
            h: house.h
        };

        player.call(`playerMenu.addHouse`, [houses]);
    };
    player.utils.removeHouse = (house) => {
        player.call(`playerMenu.removeHouse`, [house.sqlId]);
    };
    player.utils.setAchievement = () => {
        if (player.achievements.items !== 0) {
            player.call(`playerMenu.achievementsPlayer`, [player.achievements.items]);
        } else {
            player.call(`playerMenu.achievementsPlayer`, undefined);
        }
    };
    player.utils.addBiz = (biz) => {
        var bizes = {
            sqlId: biz.id,
            bizType: biz.bizType,
            name: biz.name,
            price: biz.price,
            status: biz.status,
            rentPrice: parseInt(biz.price / 100) * mp.economy["biz_tax"].value,
            x: biz.h,
            y: biz.y,
            z: biz.z
        };

        player.call(`playerMenu.addBiz`, [bizes]);
    };
    player.utils.removeBiz = (biz) => {
        player.call(`playerMenu.removeBiz`, [biz.id]);
    };
    player.utils.takeObject = (model) => {
        player.setVariable("attachedObject", model);
    };
    player.utils.putObject = () => {
        player.setVariable("attachedObject", null);
    };
    player.utils.setSatiety = (newSatiety) => {
        player.satiety = Math.clamp(newSatiety, 0, 100);
        DB.Handle.query("UPDATE characters SET satiety=? WHERE id=?", [player.satiety, player.sqlId]);
        player.call(`inventory.setSatiety`, [player.satiety]);

        if (player.satiety <= 10) {
            // player.utils.drawTextOverPlayer(`хочет перекусить`);
            player.utils.warning(`You're hungry! Need to eat!`);
        }
    };
    player.utils.setThirst = (newThirst) => {
        player.thirst = Math.clamp(newThirst, 0, 100);
        DB.Handle.query("UPDATE characters SET thirst=? WHERE id=?", [player.thirst, player.sqlId]);
        player.call(`inventory.setThirst`, [player.thirst]);

        if (player.thirst <= 10) {
            // player.utils.drawTextOverPlayer(`хочет пить`);
            player.utils.warning(`You're thirsty! Need a drink!`);
        }
    };
    player.utils.setSafeQuitPosition = (position) => {
        player.safeQuitPosition = position;
    };
}

function initLocalParams(player) {
    if (player.faction != 0) {
        var faction = mp.factions.getBySqlId(player.faction);
        var rankName = mp.factions.getRankName(player.faction, player.rank);
        var rankPay = mp.factions.getRankPay(player.faction, player.rank);
        player.utils.setLocalVar("factionRankPay", rankPay);
        player.utils.setLocalVar("factionName", faction.name);
        player.utils.setLocalVar("factionRankName", rankName);
        player.utils.setLocalVar("factionLeader", faction.leaderName);
        player.utils.setLocalVar("factionLastRank", mp.factionRanks[player.faction].length - 2);
    }

    if (player.job != 0) {
        var jobName = mp.jobs[player.job - 1].name;
        player.utils.setLocalVar("jobName", jobName);
    }

    var houses = mp.houses.getHouseArrayByOwner(player.sqlId);
    var bizes = mp.bizes.getArrayByOwner(player.sqlId);

    if (houses.length != 0) {
        player.call(`playerMenu.houses`, [houses, mp.economy["house_tax"].value]);
    } else {
        player.call(`playerMenu.houses`, undefined);
    }

    if (bizes.length != 0) {
        player.call(`playerMenu.bizes`, [bizes, mp.economy["biz_tax"].value]);
    } else {
        player.call(`playerMenu.bizes`, undefined);
    }

    if (mp.achievements.items.length !== 0) {
        player.call(`playerMenu.achievements`, [mp.achievements.items]);
    } else {
        player.call(`playerMenu.achievements`, undefined);
    }


    DB.Handle.query(`SELECT * FROM characters WHERE accountId = ?`,
    [player.account.id], (e, character) => {
        var characters = {
            minutes: 0
        };

        for (var i = 0; i < character.length; i++) {
            characters.minutes += character[i].minutes;
        }

        player.account.minutes = characters.minutes;

        player.utils.setLocalVar("accountHours", parseInt(characters.minutes));
    });


    DB.Handle.query(`SELECT * FROM unitpay_payments WHERE account = ? ORDER BY id DESC LIMIT 5`,
    [player.account.login], (e, result) => {
        if (result.length >= 0) {
            var payments = [];
            for (var i = 0; i < result.length; i++) {
                var r = result[i];
                if (r.status == 1) {
                    payments.push({
                        sqlId: r.id,
                        sum: r.sum,
                        dateComplete: r.dateComplete
                    });

                    //player.account.allDonate += r.sum;
                }

                /*if(r.status == 1 && r.id <= 618) {
                    if(player.account.done == 0) player.account.donate = r.sum + r.sum * 0.5;
                }*/
            }

            /*if(player.account.done == 0) {
                player.account.done = 1;
                DB.Handle.query("UPDATE accounts SET donate = ? WHERE login = ?", [player.account.donate, player.account.login]);
                DB.Handle.query("UPDATE accounts SET done = 1 WHERE login = ?", [player.account.login]);
            }*/

            player.call(`donateSystem.paymentsAccount`, [payments]);
        } else {
            player.call(`donateSystem.paymentsAccount`, undefined);
        }
    });

    if (player.achievements.items.length != 0) {
        player.call(`playerMenu.achievementsPlayer`, [player.achievements.items]);
    } else {
        player.call(`playerMenu.achievementsPlayer`, undefined);
    }

    var characterLevel = mp.convertMinutesToLevelRest(player.minutes);

    //player.call(`adminPanel.levelAdmin`, [player.admin]);
    //console.log(player.admin);

    player.utils.setLocalVar("admin", player.admin);
    player.utils.setLocalVar("level", characterLevel.level);
    player.utils.setLocalVar("exp", characterLevel.rest);
    player.utils.setLocalVar("nextLevel", characterLevel.nextLevel);
    player.utils.setLocalVar("accountLogin", player.account.login);
    player.utils.setLocalVar("accountSqlId", player.account.id);
    player.utils.setLocalVar("accountExp", player.account.exp);
    player.utils.setLocalVar("accountRP", player.account.rp);
    player.utils.setLocalVar("charactersCount", player.characters.length);
    player.utils.setLocalVar("hours", parseInt(player.minutes));
    player.utils.setLocalVar("name", player.name);
    player.utils.setLocalVar("sqlId", player.sqlId);
    player.utils.setLocalVar("RP", player.rp);
    player.utils.setLocalVar("sex", player.sex);
    player.utils.setLocalVar("faction", player.faction);
    player.utils.setLocalVar("factionRank", player.rank);
    player.utils.setLocalVar("donate", player.account.donate);
    player.utils.setLocalVar("factionDate", player.factionDate);
    player.utils.setLocalVar("job", player.job);
    player.utils.setLocalVar("jobDate", player.jobDate);
    player.utils.setLocalVar("relationshipName", player.relationshipName);
    player.utils.setLocalVar("relationshipDate", player.relationshipDate);
    player.utils.setLocalVar("wanted", player.wanted);
    player.utils.setLocalVar("build", Config.build);
    player.utils.setLocalVar("bank", player.bank);
    player.call(`playerMenu.setSpawn`, [player.spawnPoint, 'server']);
    player.call(`playerMenu.setHouseId`, [player.houseId, 'server']);
    player.call(`playerMenu.skills`, [player.skills]);

    mp.logs.addLog(`${player.name}[${player.id}] authorized on the server. IP: ${player.ip}, socialClub: ${player.socialClub}`, 'main', player.account.id, player.sqlId, { socialClub: player.socialClub, id: player.id, ip: player.ip });
}

const SpawnInfo = {
    user_spawn: [],
    demorgan: {
        x: 1651.41,
        y: 2570.28,
        z: 45.56,
        h: 0
    },
    demorgan_exit: {
        x: 463.62,
        y: -998.10,
        z: 24.91,
        h: 270
    }
};
module.exports.SpawnInfo = SpawnInfo;

function getPlayerSpawnPos(player) {
    //var pos = new mp.Vector3(-1039.5, -2772.1, 4.64); // аэропорт
    //var pos = new mp.Vector3(62, -1916, 22); // грув у дома
    //var pos = new mp.Vector3(-69, -1769, 29); // грув у АЗС
    //pos.h = 150;
    const houses = mp.houses.getArrayByOwner(player.sqlId);
    let spawn = SpawnInfo.user_spawn[getRandom(0, SpawnInfo.user_spawn.length - 1)];
    let houseSpawn = houses[getRandom(0, houses.length - 1)];
    var pos;

    if (player.account.login == "Carter") pos = new mp.Vector3(107, -1942, 20); // грув

    if (player.demorgan > 0) {
        pos = new mp.Vector3(SpawnInfo.demorgan.x, SpawnInfo.demorgan.y, SpawnInfo.demorgan.z);
        pos.h = SpawnInfo.demorgan.h;
        if (player.demorganTimerId) return pos;
        let startDemorgan = parseInt(new Date().getTime() / 1000);
        player.utils.setLocalVar("demorganSet", { startTime: startDemorgan, demorgan: player.demorgan });
        player.startDemorgan = startDemorgan;
        player.demorganTimerId = timerId = setTimeout(() => {
            try {
                player.utils.leaveDemorgan();
            } catch (err) {
                console.log(err.stack);
            }
        }, (player.demorgan * 60) * 1000);
        return pos;
    }

    if (player.spawnPos && player.spawnPos.x != 0 && player.spawnPos.y != 0 && player.hospital == true) {
        player.hospital = false;
        return player.spawnPos;
    }

    if (player.spawnPoint == 1) {
        if (houses.length != 0 && player.houseId != 0) {
            var house = mp.houses.getBySqlId(player.houseId);
            pos = new mp.Vector3(house.x, house.y, house.z);
            pos.h = house.h;
        } else if (houses.length != 0) {
            pos = new mp.Vector3(houseSpawn.x, houseSpawn.y, houseSpawn.z);
            pos.h = houseSpawn.h;
        } else {
            pos = new mp.Vector3(spawn.x, spawn.y, spawn.z);
            pos.h = spawn.h;
        }
    } else if (player.spawnPoint == 2) {
        if (player.faction != 0) {
            var faction = mp.factions.getBySqlId(player.faction);
            pos = faction.position;
            pos.h = faction.h;
        } else {
            pos = new mp.Vector3(spawn.x, spawn.y, spawn.z);
            pos.h = spawn.h;
        }
    } else if (player.spawnPoint == 3) {
        pos = new mp.Vector3(spawn.x, spawn.y, spawn.z);
        pos.h = spawn.h;
    } else if (player.spawnPos.length !== 0 && player.spawnPoint == 4) {
        return player.spawnPos;
    } else if (player.spawnPoint == 0 && player.spawnPoint >= 5) {
        pos = new mp.Vector3(spawn.x, spawn.y, spawn.z);
        pos.h = spawn.h;
    }

    return pos;
}

function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function initFinesCount(player) {
    DB.Handle.query(`SELECT * FROM fines WHERE recipient=?`, [player.sqlId], (e, result) => {
        player.fines = result.length;
    });
}

function initSatietyTimer(player) {
    var playerId = player.id;
    var playerSqlId = player.sqlId;
    player.satietyTimer = timerId = setInterval(() => {
        try {
            var rec = mp.players.at(playerId);
            if (!rec || rec.sqlId != playerSqlId) {
                clearInterval(timerId);
                return 0;
            }

            if (rec.satiety <= 0) {
                rec.health -= mp.economy["satiety_satiety_health"].value;
                if (rec.health <= 0) return rec.utils.warning(`You've starved to death!`);
                // rec.utils.drawTextOverPlayer(`держится за живот`);
                if (rec.health < 30) rec.utils.warning(`You're hungry! Visit the diner or buy something from the shop!`);
                return;
            }
            if (rec.thirst <= 0) {
                rec.health -= mp.economy["satiety_thirst_health"].value;
                if (rec.health <= 0) return rec.utils.warning(`You've died of thirst!`);
                // rec.utils.drawTextOverPlayer(`тяжело дышит`);
                if (rec.health < 30) rec.utils.warning(`You die of thirst! Have a drink urgently!`);
                return;
            }
            rec.utils.setSatiety(rec.satiety - mp.economy["satiety_satiety_value"].value);
            rec.utils.setThirst(rec.thirst - mp.economy["satiety_thirst_value"].value);
        } catch (err) {
            terminal.error(err.stack);
        }
    }, mp.economy["satiety_time"].value * 60 * 1000);

}

function initJobSkills(player) {
    player.jobSkills = [];
    mp.jobs.forEach((job) => player.jobSkills.push(0));

    DB.Handle.query("SELECT * FROM jobs_skills WHERE playerId=?", player.sqlId, (e, result) => {
        for (var i = 0; i < result.length; i++) {
            player.jobSkills[Math.clamp(result[i].jobId - 1, 0, player.jobSkills.length - 1)] = result[i].exp;
        }
    });
}

function spawnPlayerCars(player) {
    player.carIds = [];
    player.cars = [];
    DB.Handle.query("SELECT * FROM vehicles WHERE owner=?", [2000 + player.sqlId], async (e, result) => {
        var streetCars = mp.economy["player_streetcars_count"].value;
        for (var i = 0; i < result.length; i++) {
            var v = result[i];
            if (!v.x && !v.y) continue;
            if (!v.dimension && streetCars > 0) {
                streetCars--;
                var pos = new mp.Vector3(v.x, v.y, v.z);
                pos.h = v.h;
                var vehicle = mp.vehicles.new(mp.joaat(v.model), pos, {
                    locked: true,
                    engine: false,
                    heading: pos.h,
                    color: [v.color1, v.color2]
                    // color: v["color1"]
                });

                vehicle.spawnPos = pos;
                vehicle.name = v.model.toLowerCase();
                vehicle.sqlId = v.id;

                // vehicle.setColor(v["color1"], v["color2"]);
                //vehicle.rotation = new mp.Vector3(0, 0, pos.h);
                vehicle.vehPropData.engineBroken = v.engineBroken;
                vehicle.vehPropData.oilBroken = v.oilBroken;
                vehicle.vehPropData.accumulatorBroken = v.accumulatorBroken;
                vehicle.vehPropData.fuel = v.fuel;
                vehicle.vehPropData.maxFuel = v.maxFuel;
                vehicle.vehPropData.consumption = v.consumption;
                vehicle.vehPropData.mileage = v.mileage;
                vehicle.bodyHealth = v.health;
                vehicle.license = v.license;
                vehicle.owner = v.owner;
                try {
                    await tuningVehicle(vehicle, v);
                } catch (tunError) {
                    console.log(`Tuning not setted for vehicle with id '${v.id}'. ${tunError}`);
                }

                player.carIds.push(vehicle.id);
                initVehicleInventory(vehicle);
            }

            player.cars.push({
                name: v.model
            });
        }

        if (player.cars.length != 0) {
            player.call(`playerMenu.cars`, [player.cars]);
        } else {
            player.call(`playerMenu.cars`, undefined);
        }
    });
}

function showRegError(player, errorText) {
    player.call("character_creation::continue");
    player.utils.error(errorText);
}

function initPeds(player) {
    player.call(`peds.create`, [mp.dbPeds]);
}

function initCutscenes(player) {
    player.call(`initPointsForMoveCam`, [mp.cutscenes]);
}

function initPlayerReports(player) {
    if (player.admin) {
        var values = Object.values(mp.v2_reports);
        if (values.length) player.call(`console.pushReport`, [values]);
    } else {

    }
}
