module.exports = {
    "playerBrowserReady": (player) => {
        console.log(`playerBrowserReady: ${player.name}`);
        initPlayerStartUtils(player);
        initBodyUtils(player);

        if (Config.autoLogin) {
            mp.events.call("authAccount", player, Config.login, Config.password);
        } else if (Config.closedMode) player.call("modal.show", ["closed_mode"]);
        else player.call("showAuthAccount");
    }
}
var masksWithHideHairs = [114];

function initPlayerStartUtils(player) {
    player.utils = {
        success: (text) => {
            player.call("nSuccess", [text]);
        },
        error: (text) => {
            player.call("nError", [text]);
        },
        warning: (text) => {
            player.call("nWarning", [text]);
        },
        info: (text) => {
            player.call("nInfo", [text]);
        },
        prompt: (text) => {
            player.call("prompt.show", [text]);
        },
        initChoiceCharacter: () => {
            if (!player.account) return player.utils.error(`You're not logged in!`);

            DB.Handle.query("SELECT *,unix_timestamp(regDate) FROM characters WHERE accountId=?", player.account.id, (e, result) => {
                var characterIds = [];
                for (var i = 0; i < result.length; i++)
                    characterIds.push(result[i].id);

                var array = [];
                characterIds.forEach((id) => {
                    array.push("?");
                });
                var query = `SELECT * FROM inventory_players WHERE parentId=? AND playerId IN (${array})`;
                var values = [-1].concat(characterIds);
                //console.log(query);
                //console.log(values);

                DB.Handle.query(query, values, (e, invResult) => {
                    //console.log(invResult)
                    //if (result.length == 0) return player.utils.initNewCharacter(1);
                    player.spawn(new mp.Vector3(-66.43, -820.07, 326.08)); // крыша
                    var list = [];
                    for (var i = 0; i < result.length; i++) {
                        result[i].faceFeatures = JSON.parse(result[i].faceFeatures);
                        result[i].bodyItems = [];
                        invResult.forEach((item) => {
                            if (item.playerId == result[i].id) {
                                item.params = JSON.parse(item.params);
                                result[i].bodyItems.push(item);
                            }
                        });

                        var factionName = 0;
                        if (result[i].faction) {
                            var faction = mp.factions.getBySqlId(result[i].faction);
                            if (faction) factionName = faction.name;
                        }
                        list.push({
                            regDate: result[i]['unix_timestamp(regDate)'],
                            minutes: result[i].minutes,
                            vipDate: result[i].vipDate,
                            name: result[i].name,
                            spawn: result[i].spawn,
                            donateHouse: result[i].donateHouse,
                            donateBizes: result[i].donateBizes,
                            donateCars: result[i].donateCars,
                            skills: result[i].skills,
                            testDrive: result[i].testDrive,
                            houseId: result[i].houseId,
                            faction: factionName,
                            money: result[i].money,
                            bank: result[i].bank,
                        });
                    }
                    player.characters = result;
                    //player.utils.copyPed(0);
                    player.call(`showSelectorCharacters`, [{
                        donate: player.account.donate,
                        isAchievements: player.account.achievements_slot,
                        isDonate: player.account.donate_slot,
                        characters: list
                    }]);
                });
            });
        },
        copyPed: (characterIndex) => {
            if (!player.characters || !player.characters[characterIndex]) return player.utils.error(`Wrong character!`);
            var character = player.characters[characterIndex];

            var undershirtDefault = (character.sex == 1) ? 15 : 14;
            player.setClothes(8, undershirtDefault, 0, 0);
            player.setClothes(2, character.hair, 0, 0);
            player.sex = character.sex;
            //player.body.loadItems(character.bodyItems);

            var isLast = (characterIndex == player.characters.length - 1);
            var data = {
                headBlendData: {
                    mother: character.mother,
                    father: character.father,
                    skinColor: character.skinColor,
                    similarity: character.similarity
                },
                faceFeatures: character.faceFeatures,
                skills: character.skills,
                // hairColor: character.hairColor,
                eyeColor: character.eyeColor,
                sex: character.sex,
                name: character.name,
                carsCount: character.cars.length,
                house: character.house,
                biz: "todo",
                faction: character.faction,
                job: character.job,
                family: "todo"
            }

            player.call("copyPed", [isLast, characterIndex, data]);
        },

    };
    player.setFaceFeatures = (faceFeatures) => {
        for (var i = 0; i < faceFeatures.length; i++)
            player.setFaceFeature(i, faceFeatures[i]);
    };
}

function initBodyUtils(player) {
    player.body = {
        items: [],
        loadItems: () => {
            //console.log(`loadItems: ${player.name}`);
            var bodyItemIds = [1, 2, 3, 6, 7, 8, 9, 10, 11, 12, 13, 14];
            var bodyItems = [];
            for (var key in player.inventory.items) {
                var item = player.inventory.items[key];
                if (bodyItemIds.indexOf(item.itemId) != -1) {
                    bodyItems.push(item);
                }
            }

            player.body.clearItems();
            for (var i = 0; i < bodyItems.length; i++) {
                player.body.add(bodyItems[i].itemId, bodyItems[i].params);
            }
        },
        clearItems: () => {
            player.body.items = [];
            var itemIds = [3, 7, 8, 9, 6, 14, 2, 1, 10, 11, 12, 13];
            itemIds.forEach((itemId) => {
                player.body.updateView(itemId);
            });
            var undershirtDefault = (player.sex == 1) ? 15 : 14;
            player.setClothes(8, undershirtDefault, 0, 0);
        },
        add: (itemId, params, callback) => {
            //console.log(`add: ${itemId} ${params}`)
            if (player.body.getByItemId(itemId)) return callback("Предмет данного типа уже используется");

            player.body.items.push(params);
            player.body.updateView(itemId, params, callback);
        },
        /*delete: (item, callback) => {
                  var i = player.body.items.indexOf(item);
      		if (i == -1) return callback("Предмет не найден!");

      		player.body.items.splice(i,1);
                  player.body.updateView(item);
      		//player.utils.updateBodyItems();
            },*/
        getByItemId: (itemId) => {
            for (var i = 0; i < player.body.items.length; i++) {
                if (player.body.items[i] && player.body.items[i].itemId == itemId)
                    return player.body.items[i];
            }
        },
        updateView: (itemId, params, callback) => {
            if (player.body.denyUpdateView) return;
            if (!callback) callback = () => {};
            // debug(`updateView: ${itemId} ${JSON.stringify(params)}`);
            // if (params && params.variation == null) params.variation = 1;
            // if (params && params.texture == null) params.texture = 0;
            var item = player.body.getByItemId(itemId);
            //console.log(`item: ${item}`);
            if (!params) {
                var clothesIndexes = {
                    "2": 7,
                    "13": 5
                };
                var propsIndexes = {
                    "6": 0,
                    "1": 1,
                    "10": 2,
                    "11": 6,
                    "12": 7
                };
                var otherItems = {
                    "3": () => {
                        for (var key in player.inventory.items) {
                            var item = player.inventory.items[key];
                            if (item.itemId == itemId) {
                                item.params.armour = parseInt(player.armour);
                                player.inventory.updateParams(key, item);
                            }
                        }
                        player.armour = 0;
                        player.setClothes(9, 0, 0, 0);
                    },
                    "7": () => {
                        var index = (player.sex == 1) ? 15 : 82;
                        var undershirtDefault = (player.sex == 1) ? 15 : 14;
                        player.setClothes(3, 15, 0, 0);
                        player.setClothes(11, index, 0, 0);
                        player.setClothes(8, undershirtDefault, 0, 0);
                    },
                    "8": () => {
                        player.setClothes(4, 21, 0, 0);
                    },
                    "9": () => {
                        var index = (player.sex == 1) ? 34 : 35;
                        player.setClothes(6, index, 0, 0);
                    },
                    "14": () => {
                        player.setClothes(2, player.hair, 0, 0);
                        player.setClothes(1, 0, 0, 0);
                    }
                };

                if (clothesIndexes[itemId] != null) {
                    player.setClothes(clothesIndexes[itemId], 0, 0, 0);

                } else if (propsIndexes[itemId] != null) {
                    player.setProp(propsIndexes[itemId], -1, 0);

                } else if (otherItems[itemId] != null) {
                    otherItems[itemId]();
                } else return callback("Inappropriate type of body item!");
            } else {
                var clothesIndexes = {
                    "2": 7,
                    "8": 4,
                    "9": 6,
                    "13": 5
                };
                var propsIndexes = {
                    "6": 0,
                    "1": 1,
                    "10": 2,
                    "11": 6,
                    "12": 7
                };
                var otherItems = {
                    "3": () => {
                        player.armour = parseInt(params.armour);
                        player.setClothes(9, params.variation, params.texture, 0);
                    },
                    "7": () => {
                        var texture = params.tTexture || 0;
                        player.setClothes(3, params.torso, texture, 0);
                        player.setClothes(11, params.variation, params.texture, 0);
                        var texture = params.uTexture || 0;
                        if (params.undershirt != null) player.setClothes(8, params.undershirt, texture, 0);
                    },
                    "14": (params) => {
                        if (masksWithHideHairs.includes(params.variation)) player.setClothes(2, 0, 0, 0);
                        player.setClothes(1, params.variation, params.texture, 0);
                    }
                };

                if (clothesIndexes[itemId] != null) {
                    player.setClothes(clothesIndexes[itemId], params.variation, params.texture, 0);
                } else if (propsIndexes[itemId] != null) {
                    player.setProp(propsIndexes[itemId], params.variation, params.texture);
                } else if (otherItems[itemId] != null) {
                    otherItems[itemId](params);
                } else return callback("Inappropriate type of body item!");
            }
        }
    };
}
