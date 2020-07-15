/*
	10.11.2018 created by Carter.

	События для обработки и показа/скрытия меню.
*/

function playFocusSound() {
    mp.game.audio.playSoundFrontend(-1, "NAV_UP_DOWN", "HUD_FRONTEND_DEFAULT_SOUNDSET", true);
}

function playBackSound() {
    mp.game.audio.playSoundFrontend(-1, "CANCEL", "HUD_FRONTEND_DEFAULT_SOUNDSET", true);
}

function playSelectSound() {
    mp.game.audio.playSoundFrontend(-1, "SELECT", "HUD_FRONTEND_DEFAULT_SOUNDSET", true);
}

exports = (menu) => {
    var prevMenuName = "";

    var showHandlers = {
        "enter_biz_3": () => {
            var counts = getArrayClothesCounts();
            mp.events.callRemote(`requestClothes`, JSON.stringify(counts));
        },
        "biz_3_top": () => {
            var clothes = mp.storage.data.clothes.top[mp.clientStorage.sex];
            var items = clothesConvertToMenuItems(clothes);
            items.push({
                text: "Back"
            });
            menu.execute(`selectMenuAPI.setSpecialItems('biz_3_top', '${JSON.stringify(items)}')`);
        },
        "biz_3_legs": () => {
            var clothes = mp.storage.data.clothes.legs[mp.clientStorage.sex];
            var items = clothesConvertToMenuItems(clothes);
            items.push({
                text: "Back"
            });
            menu.execute(`selectMenuAPI.setSpecialItems('biz_3_legs', '${JSON.stringify(items)}')`);
        },
        "biz_3_feets": () => {
            var clothes = mp.storage.data.clothes.feets[mp.clientStorage.sex];
            var items = clothesConvertToMenuItems(clothes);
            items.push({
                text: "Back"
            });
            menu.execute(`selectMenuAPI.setSpecialItems('biz_3_feets', '${JSON.stringify(items)}')`);
        },
        "biz_3_hats": () => {
            var clothes = mp.storage.data.clothes.hats[mp.clientStorage.sex];
            var items = clothesConvertToMenuItems(clothes);
            items.push({
                text: "Back"
            });
            menu.execute(`selectMenuAPI.setSpecialItems('biz_3_hats', '${JSON.stringify(items)}')`);
        },
        "biz_3_glasses": () => {
            var clothes = mp.storage.data.clothes.glasses[mp.clientStorage.sex];
            var items = clothesConvertToMenuItems(clothes);
            items.push({
                text: "Back"
            });
            menu.execute(`selectMenuAPI.setSpecialItems('biz_3_glasses', '${JSON.stringify(items)}')`);
        },
        "biz_3_bracelets": () => {
            var clothes = mp.storage.data.clothes.bracelets[mp.clientStorage.sex];
            var items = clothesConvertToMenuItems(clothes);
            items.push({
                text: "Back"
            });
            menu.execute(`selectMenuAPI.setSpecialItems('biz_3_bracelets', '${JSON.stringify(items)}')`);
        },
        "biz_3_ears": () => {
            var clothes = mp.storage.data.clothes.ears[mp.clientStorage.sex];
            var items = clothesConvertToMenuItems(clothes);
            items.push({
                text: "Back"
            });
            menu.execute(`selectMenuAPI.setSpecialItems('biz_3_ears', '${JSON.stringify(items)}')`);
        },
        "biz_3_masks": () => {
            var clothes = mp.storage.data.clothes.masks[mp.clientStorage.sex];
            var items = clothesConvertToMenuItems(clothes);
            items.push({
                text: "Back"
            });
            menu.execute(`selectMenuAPI.setSpecialItems('biz_3_masks', '${JSON.stringify(items)}')`);
        },
        "biz_3_ties": () => {
            var clothes = mp.storage.data.clothes.ties[mp.clientStorage.sex];
            var items = clothesConvertToMenuItems(clothes);
            items.push({
                text: "Back"
            });
            menu.execute(`selectMenuAPI.setSpecialItems('biz_3_ties', '${JSON.stringify(items)}')`);
        },
        "biz_3_watches": () => {
            var clothes = mp.storage.data.clothes.watches[mp.clientStorage.sex];
            var items = clothesConvertToMenuItems(clothes);
            items.push({
                text: "Back"
            });
            menu.execute(`selectMenuAPI.setSpecialItems('biz_3_watches', '${JSON.stringify(items)}')`);
        },
    };
    mp.events.add("selectMenu.show", (menuName, selectedIndex = 0, values = null) => {
        // if (mp.players.local.vehicle) return;
        if (values) values = JSON.stringify(values);
        if (showHandlers[menuName]) showHandlers[menuName]();
        menu.execute(`selectMenuAPI.show('${menuName}', ${selectedIndex}, '${values}')`);
    });

    mp.events.add("selectMenu.hide", () => {
        menu.execute(`selectMenuAPI.hide()`);
    });

    mp.events.add("selectMenu.clearState", (menuName) => {
        menu.execute(`selectMenuAPI.clearState('${menuName}')`);
    });

    mp.events.add("selectMenu.setItems", (menuName, itemsName) => {
        menu.execute(`selectMenuAPI.setItems('${menuName}', '${itemsName}')`);
    });

    mp.events.add("selectMenu.setSpecialItems", (menuName, items) => {
        menu.execute(`selectMenuAPI.setSpecialItems('${menuName}', '${JSON.stringify(items)}')`);
    });

    mp.events.add("selectMenu.setHeader", (menuName, header) => {
        menu.execute(`selectMenuAPI.setHeader('${menuName}', '${header}')`);
    });

    mp.events.add("selectMenu.setPrompt", (menuName, text) => {
        menu.execute(`selectMenuAPI.setPrompt('${menuName}', '${text}')`);
    });

    mp.events.add("selectMenu.setItemValueIndex", (menuName, itemIndex, index) => {
        menu.execute(`selectMenuAPI.setItemValueIndex('${menuName}', ${itemIndex}, ${index})`);
    });

    mp.events.add("selectMenu.setItemName", (menuName, index, newName) => {
        menu.execute(`selectMenuAPI.setItemName('${menuName}', ${index}, ${newName})`);
    });

    var menuHandlers = {
        /* "character_main": {
            "Наследственность": () => {
                mp.events.call('selectMenu.show', 'character_parents');
                mp.events.call('showCharacterSkills');
                mp.events.call("focusOnHead", mp.players.local.position, -10);
            },
            "Appearance": () => {
                mp.events.call('selectMenu.show', 'character_look');
                mp.events.call("focusOnHead", mp.players.local.position, -10);
            },
            "Одежда": () => {
                mp.events.call('selectMenu.show', 'character_clothes');
                mp.events.call("focusOnBody", mp.players.local.position, -10);
            },
            "Далее": () => {
                if (!isFlood()) menu.execute(`regCharacterHandler()`);
                //mp.events.call("selectMenu.hide");
                //mp.events.call("modal.show", "character_reg");
                //setCursor(true);
            }
        },
        "character_parents": {
            "Back": () => {
                mp.events.call('selectMenu.show', 'character_main', 2);
                hideWindow(".infoTable");
                mp.events.call("focusOnPlayer", mp.players.local.position, -10);
            }
        },
        "character_look": {
            "Back": () => {
                mp.events.call('selectMenu.show', 'character_main', 3);
                mp.events.call("focusOnPlayer", mp.players.local.position, -10);
            }
        },
        "character_clothes": {
            "Back": () => {
                mp.events.call('selectMenu.show', 'character_main', 4);
                mp.events.call("focusOnPlayer", mp.players.local.position, -10);
            }
        }, */
        /*"!enter_house": {
        	"Войти в дом": () => {
        		if (!isFlood()) mp.events.callRemote("enterHouse");
        	},
        	"Позвонить в звонок": () => {

        	},
        	"Info о доме": () => {
        		if (!isFlood()) {
        			mp.events.callRemote("getHouseInfo");
        			mp.events.call("selectMenu.hide");
        		}
        	},
        },*/
        /*"!exit_house": {
        	"Выйти на улицу": () => {
        		if (!isFlood()) mp.events.callRemote(`goEnterStreet`);
        	},
        },*/
        /*"enter_garage": {
        	"Войти в гараж": () => {
        		if (!isFlood()) mp.events.callRemote("goEnterGarage");
        	},
        	"Постучать в дверь гаража": () => {

        	},
        	"Info о гараже": () => {
        		if (!isFlood()) {
        			mp.events.callRemote("getGarageInfo");
        			mp.events.call("selectMenu.hide");
        		}
        	}
        },*/
        /*"exit_garage": {
        	"Выйти в дом": () => {
        		if (!isFlood()) mp.events.callRemote(`goExitGarage`);
        	},
        	"Выйти на улицу": () => {
        		if (!isFlood()) mp.events.callRemote(`goEnterStreetFromGarage`);
        	}
        },*/
        "enter_biz_1": {
            "Buy business": () => {
                if (!isFlood()) {
                    mp.events.callRemote("biz.show", "biz_buy");
                    mp.events.call("selectMenu.hide");
                }
            },
            "Control Panel": () => {
                prevMenuName = "enter_biz_1";
                mp.events.call("selectMenu.show", "biz_panel");
            }
        },
        "enter_biz_2": {
            "Buy business": () => {
                if (!isFlood()) {
                    mp.events.callRemote("biz.show", "biz_buy");
                    mp.events.call("selectMenu.hide");
                }
            },
            "Control Panel": () => {
                prevMenuName = "enter_biz_2";
                mp.events.call("selectMenu.show", "biz_panel");
            }
        },
        "enter_biz_3": {
            "Dressing room": () => {
                mp.events.callRemote("biz_3.clearItems");
                mp.events.call("selectMenu.show", "biz_3_clothes");
            },
            "Buy business": () => {
                if (!isFlood()) {
                    mp.events.callRemote("biz.show", "biz_buy");
                    mp.events.call("selectMenu.hide");
                }
            },
            "Control Panel": () => {
                prevMenuName = "enter_biz_3";
                mp.events.call("selectMenu.show", "biz_panel");
            }
        },
        "biz_3_clothes": {
            "Outerwear": (itemValue, itemIndex) => {
                var comp = mp.storage.data.clothes.top[mp.clientStorage.sex][0];
                mp.players.local.setComponentVariation(3, comp.torso, 0, 0);
                mp.players.local.setComponentVariation(11, comp.variation, comp.textures[0], 0);
                mp.events.call("selectMenu.show", "biz_3_top");
            },
            "Underwear": () => {
                var comp = mp.storage.data.clothes.legs[mp.clientStorage.sex][0];
                mp.players.local.setComponentVariation(4, comp.variation, comp.textures[0], 0);
                mp.events.call("selectMenu.show", "biz_3_legs");
            },
            "Shoes": () => {
                var comp = mp.storage.data.clothes.feets[mp.clientStorage.sex][0];
                mp.players.local.setComponentVariation(6, comp.variation, comp.textures[0], 0);
                mp.events.call("selectMenu.show", "biz_3_feets");
            },
            "Hats": () => {
                var comp = mp.storage.data.clothes.hats[mp.clientStorage.sex][0];
                mp.players.local.setPropIndex(0, comp.variation, comp.textures[0], true);
                mp.events.call("selectMenu.show", "biz_3_hats");
            },
            "Glasses": () => {
                var comp = mp.storage.data.clothes.glasses[mp.clientStorage.sex][0];
                mp.players.local.setPropIndex(1, comp.variation, comp.textures[0], true);
                mp.events.call("selectMenu.show", "biz_3_glasses");
            },
            "Bracelets": (itemValue, itemIndex) => {
                var comp = mp.storage.data.clothes.bracelets[mp.clientStorage.sex][0];
                mp.players.local.setPropIndex(7, comp.variation, comp.textures[0], true);
                mp.events.call("selectMenu.show", "biz_3_bracelets");
            },
            "Earrings": (itemValue, itemIndex) => {
                var comp = mp.storage.data.clothes.ears[mp.clientStorage.sex][0];
                mp.players.local.setPropIndex(2, comp.variation, comp.textures[0], true);
                mp.events.call("selectMenu.show", "biz_3_ears");
            },
            "Masks": (itemValue, itemIndex) => {
                var comp = mp.storage.data.clothes.masks[mp.clientStorage.sex][0];
                mp.players.local.setComponentVariation(1, comp.variation, comp.textures[0], 0);
                mp.events.call("selectMenu.show", "biz_3_masks");
            },
            "Accessories": (itemValue, itemIndex) => {
                var comp = mp.storage.data.clothes.ties[mp.clientStorage.sex][0];
                mp.players.local.setComponentVariation(7, comp.variation, comp.textures[0], 0);
                mp.events.call("selectMenu.show", "biz_3_ties");
            },
            "Watch": (itemValue, itemIndex) => {
                var comp = mp.storage.data.clothes.watches[mp.clientStorage.sex][0];
                mp.players.local.setPropIndex(6, comp.variation, comp.textures[0], true);
                mp.events.call("selectMenu.show", "biz_3_watches");
            },
            "Back": () => {
                mp.events.call("selectMenu.show", "enter_biz_3");
            },
        },
        "biz_3_top": {
            "Back": () => {
                mp.events.call("selectMenu.show", "biz_3_clothes");
            },
        },
        "biz_3_legs": {
            "Back": () => {
                mp.events.call("selectMenu.show", "biz_3_clothes", 1);
            },
        },
        "biz_3_feets": {
            "Back": () => {
                mp.events.call("selectMenu.show", "biz_3_clothes", 2);
            },
        },
        "biz_3_hats": {
            "Back": () => {
                mp.events.call("selectMenu.show", "biz_3_clothes", 3);
            },
        },
        "biz_3_glasses": {
            "Back": () => {
                mp.events.call("selectMenu.show", "biz_3_clothes", 4);
            },
        },
        "biz_3_bracelets": {
            "Back": () => {
                mp.events.call("selectMenu.show", "biz_3_clothes", 5);
            },
        },
        "biz_3_ears": {
            "Back": () => {
                mp.events.call("selectMenu.show", "biz_3_clothes", 6);
            },
        },
        "biz_3_masks": {
            "Back": () => {
                mp.events.call("selectMenu.show", "biz_3_clothes", 7);
            },
        },
        "biz_3_ties": {
            "Back": () => {
                mp.events.call("selectMenu.show", "biz_3_clothes", 8);
            },
        },
        "biz_3_watches": {
            "Back": () => {
                mp.events.call("selectMenu.show", "biz_3_clothes", 9);
            },
        },
        "enter_biz_4": {
            "Buy business": () => {
                if (!isFlood()) {
                    mp.events.callRemote("biz.show", "biz_buy");
                    mp.events.call("selectMenu.hide");
                }
            },
            "Control Panel": () => {
                prevMenuName = "enter_biz_4";
                mp.events.call("selectMenu.show", "biz_panel");
            }
        },
        "enter_biz_5": {
            "Fuel": () => {
                mp.events.call('selectMenu.show', 'biz_5_items');
            },
            "Buy business": () => {
                if (!isFlood()) {
                    mp.events.callRemote("biz.show", "biz_buy");
                    mp.events.call("selectMenu.hide");
                }
            },
            "Control Panel": () => {
                prevMenuName = "enter_biz_5";
                mp.events.call("selectMenu.show", "biz_panel");
            }
        },
        "biz_5_items": {
            "Refill car": (value) => {
                mp.events.callRemote("biz_5.buyItem", 0, parseInt(value));
            },
            "Refill canister": (value) => {
                mp.events.callRemote("biz_5.buyItem", 1);
            },
            "Back": () => {
                mp.events.call("selectMenu.show", "enter_biz_5");
            },
        },
        "enter_biz_6": {
            "Shop": () => {
                mp.events.call('selectMenu.show', 'biz_6_items');
            },
            "Buy business": () => {
                if (!isFlood()) {
                    mp.events.callRemote("biz.show", "biz_buy");
                    mp.events.call("selectMenu.hide");
                }
            },
            "Control Panel": () => {
                prevMenuName = "enter_biz_6";
                mp.events.call("selectMenu.show", "biz_panel");
            }
        },
        "biz_6_items": {
            0: () => {
                mp.events.callRemote("biz_6.buyItem", 30);
            },
            1: () => {
                mp.events.callRemote("biz_6.buyItem", 31);
            },
            2: () => {
                mp.events.callRemote("biz_6.buyItem", 32);
            },
            3: () => {
                mp.events.callRemote("biz_6.buyItem", 33);
            },
            4: () => {
                mp.events.callRemote("biz_6.buyItem", 34);
            },
            5: () => {
                mp.events.callRemote("biz_6.buyItem", 35);
            },
            6: () => {
                mp.events.callRemote("biz_6.buyItem", 15);
            },
            7: () => {
                mp.events.callRemote("biz_6.buyItem", 13);
            },
            8: () => {
                mp.events.callRemote("biz_6.buyItem", 36);
            },
            9: () => {
                mp.events.callRemote("biz_6.buyItem", 25);
            },
            10: () => {
                mp.events.call("selectMenu.show", "enter_biz_6");
            },
        },
        "enter_biz_7": {
            "Buy business": () => {
                if (!isFlood()) {
                    mp.events.callRemote("biz.show", "biz_buy");
                    mp.events.call("selectMenu.hide");
                }
            },
            "Control Panel": () => {
                prevMenuName = "enter_biz_7";
                mp.events.call("selectMenu.show", "biz_panel");
            }
        },
        "enter_biz_8": {
            "Weapons": () => {
                mp.events.call("selectMenu.show", "biz_8_guns");
            },
            "Ammo": () => {
                mp.events.call("selectMenu.show", "biz_8_ammo");
            },
            "Buy business": () => {
                if (!isFlood()) {
                    mp.events.callRemote("biz.show", "biz_buy");
                    mp.events.call("selectMenu.hide");
                }
            },
            "Control Panel": () => {
                prevMenuName = "enter_biz_8";
                mp.events.call("selectMenu.show", "biz_panel");
            }
        },
        "biz_8_guns": {
            "Melee": () => {
                mp.events.call("selectMenu.show", "biz_8_melee");
            },
            "Pistols": () => {
                mp.events.call("selectMenu.show", "biz_8_handguns");
            },
            "Submachine guns": () => {
                mp.events.call("selectMenu.show", "biz_8_submachine_guns");
            },
            "Shotguns": () => {
                mp.events.call("selectMenu.show", "biz_8_shotguns");
            },
            "Back": () => {
                mp.events.call("selectMenu.show", "enter_biz_8");
            },
        },
        "biz_8_melee": {
            0: () => {
                mp.events.callRemote(`biz_8.buyItem`, 41);
            },
            1: () => {
                mp.events.callRemote(`biz_8.buyItem`, 42);
            },
            2: () => {
                mp.events.callRemote(`biz_8.buyItem`, 43);
            },
            3: () => {
                mp.events.call("selectMenu.show", `biz_8_guns`);
            },
        },
        "biz_8_handguns": {
            0: () => {
                mp.events.callRemote(`biz_8.buyItem`, 44);
            },
            1: () => {
                mp.events.callRemote(`biz_8.buyItem`, 45);
            },
            2: () => {
                mp.events.call("selectMenu.show", `biz_8_guns`, 1);
            },
        },
        "biz_8_submachine_guns": {
            0: () => {
                mp.events.callRemote(`biz_8.buyItem`, 47);
            },
            1: () => {
                mp.events.callRemote(`biz_8.buyItem`, 48);
            },
            2: () => {
                mp.events.call("selectMenu.show", `biz_8_guns`, 2);
            },
        },
        "biz_8_shotguns": {
            0: () => {
                mp.events.callRemote(`biz_8.buyItem`, 49);
            },
            1: () => {
                mp.events.call("selectMenu.show", `biz_8_guns`, 3);
            },
        },
        "biz_8_ammo": {
            0: (value) => {
                if (!isFlood()) mp.events.callRemote(`biz_8.buyAmmo`, 0, parseInt(value));
            },
            1: (value) => {
                if (!isFlood()) mp.events.callRemote(`biz_8.buyAmmo`, 1, parseInt(value));
            },
            2: (value) => {
                if (!isFlood()) mp.events.callRemote(`biz_8.buyAmmo`, 2, parseInt(value));
            },
            3: (value) => {
                if (!isFlood()) mp.events.callRemote(`biz_8.buyAmmo`, 3, parseInt(value));
            },
            4: () => {
                mp.events.call(`selectMenu.show`, `enter_biz_8`, 1);
            },
        },
        "enter_biz_9": {
            "Buy a car": () => {
                mp.events.callRemote(`autoSaloon.openBuyerMenu`);
            }
            /*,
            "Buy business": () => {
                if (!isFlood()) {
                    mp.events.callRemote("biz.show", "biz_buy");
                    mp.events.call("selectMenu.hide");
                }
            },
            "Control Panel": () => {
                prevMenuName = "enter_biz_9";
                mp.events.call("selectMenu.show", "biz_panel");
            }*/
        },
        "enter_biz_10": {
            "Buy business": () => {
                if (!isFlood()) {
                    mp.events.callRemote("biz.show", "biz_buy");
                    mp.events.call("selectMenu.hide");
                }
            },
            "Control Panel": () => {
                prevMenuName = "enter_biz_10";
                mp.events.call("selectMenu.show", "biz_panel");
            }
        },
        "enter_biz_11": {
            "Buy business": () => {
                if (!isFlood()) {
                    mp.events.callRemote("biz.show", "biz_buy");
                    mp.events.call("selectMenu.hide");
                }
            },
            "Control Panel": () => {
                prevMenuName = "enter_biz_11";
                mp.events.call("selectMenu.show", "biz_panel");
            }
        },
        "biz_panel": {
            "Business Information": () => {
                if (!isFlood()) {
                    mp.events.callRemote("getBizInfo");
                    mp.events.call("selectMenu.hide");
                }
            },
            "Cashbox": () => {
                mp.events.call("selectMenu.show", "biz_cashbox");
            },
            "Income and expenses": () => {
                mp.events.call("selectMenu.show", "biz_stats");
            },
            "Product": () => {
                mp.events.call("selectMenu.show", "biz_products");
            },
            "Staff": () => {
                mp.events.call("selectMenu.show", "biz_staff");
            },
            "Business Improvements": () => {
                mp.events.call("selectMenu.show", "biz_rise");
            },
            "Business status": () => {
                mp.events.call("selectMenu.show", "biz_status");
            },
            "Sell the business": () => {
                mp.events.call("selectMenu.show", "biz_sell");
            },
            "Back": () => {
                mp.events.call("selectMenu.show", prevMenuName);
            },
        },
        "biz_cashbox": {
            "Cash Balance": () => {
                if (!isFlood()) {
                    mp.events.callRemote("biz.balance.get");
                    mp.events.call("selectMenu.hide");
                }
            },
            "Withdraw from the cashier": () => {
                mp.events.call("modal.show", "biz_balance_take");
                mp.events.call("selectMenu.hide");
            },
            "Top up cashier": () => {
                mp.events.call("modal.show", "biz_balance_add");
                mp.events.call("selectMenu.hide");
            },
            "Back": () => {
                mp.events.call("selectMenu.show", "biz_panel", 1);
            }
        },
        "biz_stats": {
            "Box office history": () => {
                if (!isFlood()) {
                    mp.events.call("setLocalVar", "bizLogsOffset", 0);
                    mp.events.callRemote("biz.getStats", mp.clientStorage["bizLogsOffset"]);
                    mp.events.call("selectMenu.hide");
                }
            },
            "Back": () => {
                mp.events.call("selectMenu.show", "biz_panel", 2);
            }
        },
        "biz_products": {
            "Purchase goods": () => {
                if (!isFlood()) {
                    mp.events.callRemote("biz.show", "biz_products_buy");
                    mp.events.call("selectMenu.hide");
                }
            },
            "Write off the goods": () => {
                if (!isFlood()) {
                    mp.events.callRemote("biz.show", "biz_products_sell");
                    mp.events.call("selectMenu.hide");
                }
            },
            "The price of the product": () => {
                if (!isFlood()) {
                    mp.events.callRemote("biz.show", "biz_products_price");
                    mp.events.call("selectMenu.hide");
                }
            },
            "Back": () => {
                mp.events.call("selectMenu.show", "biz_panel", 3);
            }
        },
        "biz_staff": {
            "Back": () => {
                mp.events.call("selectMenu.show", "biz_panel", 4);
            }
        },
        "biz_rise": {
            "Back": () => {
                mp.events.call("selectMenu.show", "biz_panel", 5);
            }
        },
        "biz_status": {
            "Open business": () => {
                if (!isFlood()) {
                    mp.events.callRemote("biz.setStatus", 1);
                    mp.events.call("selectMenu.hide");
                }
            },
            "Close business": () => {
                if (!isFlood()) {
                    mp.events.callRemote("biz.setStatus", 0);
                    mp.events.call("selectMenu.hide");
                }
            },
            "Back": () => {
                mp.events.call("selectMenu.show", "biz_panel", 6);
            }
        },
        "biz_sell": {
            "Citizen": () => {
                if (!isFlood()) {
                    mp.events.callRemote("biz.show", "biz_sell_to_player");
                    mp.events.call("selectMenu.hide");
                }
            },
            "State": () => {
                if (!isFlood()) {
                    mp.events.callRemote("biz.show", "biz_sell_to_gov");
                    mp.events.call("selectMenu.hide");
                }
            },
            "Back": () => {
                mp.events.call("selectMenu.show", "biz_panel", 7);
            }
        },

        "police_storage": {
            "Service weaponry": () => {
                mp.events.call("selectMenu.show", "police_guns");
            },
            "Wardrobe": () => {
                mp.events.call("selectMenu.show", "police_clothes");
            },
            "Specialist items": () => {
                mp.events.call("selectMenu.show", "police_items");
            },
            "Ammo": () => {
                mp.events.call("selectMenu.show", "police_ammo");
            },
        },
        "police_guns": {
            "Nightstick": () => {
                if (!isFlood()) mp.events.callRemote(`policeStorage.takeGun`, 0);
            },
            "Flashlight": () => {
                if (!isFlood()) mp.events.callRemote(`policeStorage.takeGun`, 1);
            },
            "Stun Gun": () => {
                if (!isFlood()) mp.events.callRemote(`policeStorage.takeGun`, 2);
            },
            "Combat Pistol": () => {
                if (!isFlood()) mp.events.callRemote(`policeStorage.takeGun`, 3);
            },
            "Pump Shotgun": () => {
                if (!isFlood()) mp.events.callRemote(`policeStorage.takeGun`, 4);
            },
            "Carbine Rifle": () => {
                if (!isFlood()) mp.events.callRemote(`policeStorage.takeGun`, 5);
            },
            "Sniper Rifle": () => {
                if (!isFlood()) mp.events.callRemote(`policeStorage.takeGun`, 6);
            },
            "Back": () => {
                mp.events.call("selectMenu.show", "police_storage");
            }
        },
        "police_items": {
            "PD Identity Card": () => {
                if (!isFlood()) mp.events.callRemote(`policeStorage.takeItem`, 0);
            },
            "Walkie talkie": () => {
                if (!isFlood()) mp.events.callRemote(`policeStorage.takeItem`, 1);
            },
            "Handcuffs": () => {
                if (!isFlood()) mp.events.callRemote(`policeStorage.takeItem`, 2);
            },
            "Back": () => {
                mp.events.call("selectMenu.show", "police_storage", 2);
            }
        },
        "police_ammo": {
            "Combat Pistol - 9mm": (value) => {
                if (!isFlood()) mp.events.callRemote(`policeStorage.takeAmmo`, 0, parseInt(value));
            },
            "Pump Shotgun - 12mm": (value) => {
                if (!isFlood()) mp.events.callRemote(`policeStorage.takeAmmo`, 1, parseInt(value));
            },
            "Carbine Rifle - 5.56mm": (value) => {
                if (!isFlood()) mp.events.callRemote(`policeStorage.takeAmmo`, 2, parseInt(value));
            },
            "Sniper Rifle - 7.62mm": (value) => {
                if (!isFlood()) mp.events.callRemote(`policeStorage.takeAmmo`, 3, parseInt(value));
            },
            "Back": (value) => {
                mp.events.call("selectMenu.show", "police_storage", 3);
            }
        },
        "police_clothes": {
            "Officer's uniform no.1": () => {
                if (!isFlood()) mp.events.callRemote(`policeStorage.takeClothes`, 0);
            },
            "Форма SWAT": () => {
                if (!isFlood()) mp.events.callRemote(`policeStorage.takeClothes`, 1);
            },
            "Officer's uniform no.2": () => {
                if (!isFlood()) mp.events.callRemote(`policeStorage.takeClothes`, 2);
            },
            "Body armor": () => {
                if (!isFlood()) mp.events.callRemote(`policeStorage.takeArmour`);
            },
            "Back": () => {
                mp.events.call("selectMenu.show", "police_storage", 1);
            }
        },
        "police_service": {
            "Recovery of things": () => {
                mp.events.call("selectMenu.show", "police_service_recovery");
            },
            "Payment of the penalty": () => {
                mp.events.callRemote("policeService.showClearFine");
                mp.events.call("selectMenu.hide");
            },
        },
        "police_service_recovery": {
            "Documents": () => {
                mp.events.callRemote("policeService.recovery.documents");
            },
            "Car keys": () => {
                mp.events.callRemote("policeService.recovery.carKeys");
            },
            "House keys": (value) => {
                if (!value) return mp.events.call(`nError`, `You have no home!`);
                mp.events.callRemote("policeService.recovery.houseKeys", parseInt(value.substr(1)));
            },
            "Back": () => {
                mp.events.call("selectMenu.show", "police_service");
            }
        },

        "police_storage_2": {
            "Service weaponry": () => {
                mp.events.call("selectMenu.show", "police_guns_2");
            },
            "Wardrobe": () => {
                mp.events.call("selectMenu.show", "police_clothes_2");
            },
            "Specialist. items": () => {
                mp.events.call("selectMenu.show", "police_items_2");
            },
            "Ammo": () => {
                mp.events.call("selectMenu.show", "police_ammo_2");
            },
        },
        "police_guns_2": {
            "Nightstick": () => {
                if (!isFlood()) mp.events.callRemote(`policeStorage.takeGun`, 0);
            },
            "Flashlight": () => {
                if (!isFlood()) mp.events.callRemote(`policeStorage.takeGun`, 1);
            },
            "Stun Gun": () => {
                if (!isFlood()) mp.events.callRemote(`policeStorage.takeGun`, 2);
            },
            "Combat Pistol": () => {
                if (!isFlood()) mp.events.callRemote(`policeStorage.takeGun`, 3);
            },
            "Pump Shotgun": () => {
                if (!isFlood()) mp.events.callRemote(`policeStorage.takeGun`, 4);
            },
            "Carbine Rifle": () => {
                if (!isFlood()) mp.events.callRemote(`policeStorage.takeGun`, 5);
            },
            "Sniper Rifle": () => {
                if (!isFlood()) mp.events.callRemote(`policeStorage.takeGun`, 6);
            },
            "Back": () => {
                mp.events.call("selectMenu.show", "police_storage_2");
            }
        },
        "police_items_2": {
            "PD Identity Card": () => {
                if (!isFlood()) mp.events.callRemote(`policeStorage.takeItem`, 0);
            },
            "Walkie talkie": () => {
                if (!isFlood()) mp.events.callRemote(`policeStorage.takeItem`, 1);
            },
            "Handcuffs": () => {
                if (!isFlood()) mp.events.callRemote(`policeStorage.takeItem`, 2);
            },
            "Back": () => {
                mp.events.call("selectMenu.show", "police_storage_2", 2);
            }
        },
        "police_ammo_2": {
            "Combat Pistol - 9mm": (value) => {
                if (!isFlood()) mp.events.callRemote(`policeStorage.takeAmmo`, 0, parseInt(value));
            },
            "Pump Shotgun - 12mm": (value) => {
                if (!isFlood()) mp.events.callRemote(`policeStorage.takeAmmo`, 1, parseInt(value));
            },
            "Carbine Rifle - 5.56mm": (value) => {
                if (!isFlood()) mp.events.callRemote(`policeStorage.takeAmmo`, 2, parseInt(value));
            },
            "Sniper Rifle - 7.62mm": (value) => {
                if (!isFlood()) mp.events.callRemote(`policeStorage.takeAmmo`, 3, parseInt(value));
            },
            "Back": (value) => {
                mp.events.call("selectMenu.show", "police_storage_2", 3);
            }
        },
        "police_clothes_2": {
            "Specialist clothes no.1": () => {
                if (!isFlood()) mp.events.callRemote(`policeStorage.takeClothes`, 0);
            },
            "Form of Cadets": () => {
                if (!isFlood()) mp.events.callRemote(`policeStorage.takeClothes`, 1);
            },
            "Form Sheriff": () => {
                if (!isFlood()) mp.events.callRemote(`policeStorage.takeClothes`, 2);
            },
            "Sergeant's uniform": () => {
                if (!isFlood()) mp.events.callRemote(`policeStorage.takeClothes`, 3);
            },
            "Lieutenant's uniform": () => {
                if (!isFlood()) mp.events.callRemote(`policeStorage.takeClothes`, 4);
            },
            "Captain's Form": () => {
                if (!isFlood()) mp.events.callRemote(`policeStorage.takeClothes`, 5);
            },
            "Sheriff's uniform": () => {
                if (!isFlood()) mp.events.callRemote(`policeStorage.takeClothes`, 6);
            },
            "Body armor": () => {
                if (!isFlood()) mp.events.callRemote(`policeStorage.takeArmour`);
            },
            "Back": () => {
                mp.events.call("selectMenu.show", "police_storage", 1);
            }
        },
        "police_service_2": {
            "Recovery of things": () => {
                mp.events.call("selectMenu.show", "police_service_recovery_2");
            },
            "Payment of the penalty": () => {
                mp.events.callRemote("policeService.showClearFine");
                mp.events.call("selectMenu.hide");
            },
        },
        "police_service_recovery_2": {
            "Documents": () => {
                mp.events.callRemote("policeService.recovery.documents");
            },
            "Car keys": () => {
                mp.events.callRemote("policeService.recovery.carKeys");
            },
            "House keys": (value) => {
                if (!value) return mp.events.call(`nError`, `You have no home!`);
                mp.events.callRemote("policeService.recovery.houseKeys", parseInt(value.substr(1)));
            },
            "Back": () => {
                mp.events.call("selectMenu.show", "police_service_2");
            }
        },

        "army_storage": {
            "Service weaponry": () => {
                mp.events.call("selectMenu.show", "army_guns");
            },
            "Wardrobe": () => {
                mp.events.call("selectMenu.show", "army_clothes");
            },
            "Specialist. items": () => {
                mp.events.call("selectMenu.show", "army_items");
            },
            "Ammo": () => {
                mp.events.call("selectMenu.show", "army_ammo");
            },
        },
        "army_guns": {
            "Combat Pistol": () => {
                if (!isFlood()) mp.events.callRemote(`armyStorage.takeGun`, 0);
            },
            "Pump Shotgun": () => {
                if (!isFlood()) mp.events.callRemote(`armyStorage.takeGun`, 1);
            },
            "Carbine Rifle": () => {
                if (!isFlood()) mp.events.callRemote(`armyStorage.takeGun`, 2);
            },
            "Sniper Rifle": () => {
                if (!isFlood()) mp.events.callRemote(`armyStorage.takeGun`, 3);
            },
            "Back": () => {
                mp.events.call("selectMenu.show", "army_storage");
            }
        },
        "army_items": {
            "Army Certificate": () => {
                if (!isFlood()) mp.events.callRemote(`armyStorage.takeItem`, 0);
            },
            "Walkie talkie": () => {
                if (!isFlood()) mp.events.callRemote(`armyStorage.takeItem`, 1);
            },
            "Back": () => {
                mp.events.call("selectMenu.show", "army_storage", 2);
            }
        },
        "army_clothes": {
            "Recruitment's uniform": () => {
                if (!isFlood()) mp.events.callRemote(`armyStorage.takeClothes`, 0);
            },
            "Tactical set number1": () => {
                if (!isFlood()) mp.events.callRemote(`armyStorage.takeClothes`, 1);
            },
            "IB department": () => {
                if (!isFlood()) mp.events.callRemote(`armyStorage.takeClothes`, 2);
            },
            "FZA department": () => {
                if (!isFlood()) mp.events.callRemote(`armyStorage.takeClothes`, 3);
            },
            "TFB combat form": () => {
                if (!isFlood()) mp.events.callRemote(`armyStorage.takeClothes`, 4);
            },
            "MLG department": () => {
                if (!isFlood()) mp.events.callRemote(`armyStorage.takeClothes`, 5);
            },
            "Army uniform no.1": () => {
                if (!isFlood()) mp.events.callRemote(`armyStorage.takeClothes`, 6);
            },
            "Army uniform no.2": () => {
                if (!isFlood()) mp.events.callRemote(`armyStorage.takeClothes`, 7);
            },
            "Body armor": () => {
                if (!isFlood()) mp.events.callRemote(`armyStorage.takeArmour`);
            },
            "Back": () => {
                mp.events.call("selectMenu.show", "army_storage", 1);
            }
        },
        "army_ammo": {
            "Combat Pistol - 9mm": (value) => {
                if (!isFlood()) mp.events.callRemote(`armyStorage.takeAmmo`, 0, parseInt(value));
            },
            "Pump Shotgun - 12mm": (value) => {
                if (!isFlood()) mp.events.callRemote(`armyStorage.takeAmmo`, 1, parseInt(value));
            },
            "Carbine Rifle - 5.56mm": (value) => {
                if (!isFlood()) mp.events.callRemote(`armyStorage.takeAmmo`, 2, parseInt(value));
            },
            "Sniper Rifle - 7.62mm": (value) => {
                if (!isFlood()) mp.events.callRemote(`armyStorage.takeAmmo`, 3, parseInt(value));
            },
            "Back": (value) => {
                mp.events.call("selectMenu.show", "army_storage", 2);
            }
        },

        "army_storage_2": {
            "Service weaponry": () => {
                mp.events.call("selectMenu.show", "army_guns_2");
            },
            "Wardrobe": () => {
                mp.events.call("selectMenu.show", "army_clothes_2");
            },
            "Specialist. items": () => {
                mp.events.call("selectMenu.show", "army_items_2");
            },
            "Ammo": () => {
                mp.events.call("selectMenu.show", "army_ammo_2");
            },
        },
        "army_guns_2": {
            "Combat Pistol": () => {
                if (!isFlood()) mp.events.callRemote(`armyStorage.takeGun`, 0);
            },
            "Pump Shotgun": () => {
                if (!isFlood()) mp.events.callRemote(`armyStorage.takeGun`, 1);
            },
            "Carbine Rifle": () => {
                if (!isFlood()) mp.events.callRemote(`armyStorage.takeGun`, 2);
            },
            "Sniper Rifle": () => {
                if (!isFlood()) mp.events.callRemote(`armyStorage.takeGun`, 3);
            },
            "Back": () => {
                mp.events.call("selectMenu.show", "army_storage_2");
            }
        },
        "army_items_2": {
            "Army Certificate": () => {
                if (!isFlood()) mp.events.callRemote(`armyStorage.takeItem`, 0);
            },
            "Walkie talkie": () => {
                if (!isFlood()) mp.events.callRemote(`armyStorage.takeItem`, 1);
            },
            "Back": () => {
                mp.events.call("selectMenu.show", "army_storage_2", 2);
            }
        },
        "army_clothes_2": {
            "Detachment - GRS": () => {
                if (!isFlood()) mp.events.callRemote(`armyStorage.takeClothes`, 0);
            },
            "Squad - TLS": () => {
                if (!isFlood()) mp.events.callRemote(`armyStorage.takeClothes`, 1);
            },
            "Squad - FHS": () => {
                if (!isFlood()) mp.events.callRemote(`armyStorage.takeClothes`, 2);
            },
            "Army uniform": () => {
                if (!isFlood()) mp.events.callRemote(`armyStorage.takeClothes`, 3);
            },
            "Specialist uniform": () => {
                if (!isFlood()) mp.events.callRemote(`armyStorage.takeClothes`, 4);
            },
            "Body armor": () => {
                if (!isFlood()) mp.events.callRemote(`armyStorage.takeArmour`);
            },
            "Back": () => {
                mp.events.call("selectMenu.show", "army_storage_2", 1);
            }
        },
        "army_ammo_2": {
            "Combat Pistol - 9mm": (value) => {
                if (!isFlood()) mp.events.callRemote(`armyStorage.takeAmmo`, 0, parseInt(value));
            },
            "Pump Shotgun - 12mm": (value) => {
                if (!isFlood()) mp.events.callRemote(`armyStorage.takeAmmo`, 1, parseInt(value));
            },
            "Carbine Rifle - 5.56mm": (value) => {
                if (!isFlood()) mp.events.callRemote(`armyStorage.takeAmmo`, 2, parseInt(value));
            },
            "Sniper Rifle - 7.62mm": (value) => {
                if (!isFlood()) mp.events.callRemote(`armyStorage.takeAmmo`, 3, parseInt(value));
            },
            "Back": (value) => {
                mp.events.call("selectMenu.show", "army_storage_2", 2);
            }
        },

        "fib_storage": {
            "Service weaponry": () => {
                mp.events.call("selectMenu.show", "fib_guns");
            },
            "Wardrobe": () => {
                mp.events.call("selectMenu.show", "fib_clothes");
            },
            "Specialist. items": () => {
                mp.events.call("selectMenu.show", "fib_items");
            },
            "Ammo": () => {
                mp.events.call("selectMenu.show", "fib_ammo");
            },
        },
        "fib_guns": {
            "Nightstick": () => {
                if (!isFlood()) mp.events.callRemote(`fibStorage.takeGun`, 0);
            },
            "Flashlight": () => {
                if (!isFlood()) mp.events.callRemote(`fibStorage.takeGun`, 1);
            },
            "Stun Gun": () => {
                if (!isFlood()) mp.events.callRemote(`fibStorage.takeGun`, 2);
            },
            "Combat Pistol": () => {
                if (!isFlood()) mp.events.callRemote(`fibStorage.takeGun`, 3);
            },
            "Pump Shotgun": () => {
                if (!isFlood()) mp.events.callRemote(`fibStorage.takeGun`, 4);
            },
            "Carbine Rifle": () => {
                if (!isFlood()) mp.events.callRemote(`fibStorage.takeGun`, 5);
            },
            "Sniper Rifle": () => {
                if (!isFlood()) mp.events.callRemote(`fibStorage.takeGun`, 6);
            },
            "Back": () => {
                mp.events.call("selectMenu.show", "fib_storage");
            }
        },
        "fib_items": {
            "FIB Certification": () => {
                if (!isFlood()) mp.events.callRemote(`fibStorage.takeItem`, 0);
            },
            "Walkie talkie": () => {
                if (!isFlood()) mp.events.callRemote(`fibStorage.takeItem`, 1);
            },
            "Handcuffs": () => {
                if (!isFlood()) mp.events.callRemote(`fibStorage.takeItem`, 2);
            },
            "Back": () => {
                mp.events.call("selectMenu.show", "fib_storage", 2);
            }
        },
        "fib_ammo": {
            "Combat Pistol - 9mm": (value) => {
                if (!isFlood()) mp.events.callRemote(`fibStorage.takeAmmo`, 0, parseInt(value));
            },
            "Pump Shotgun - 12mm": (value) => {
                if (!isFlood()) mp.events.callRemote(`fibStorage.takeAmmo`, 1, parseInt(value));
            },
            "Carbine Rifle - 5.56mm": (value) => {
                if (!isFlood()) mp.events.callRemote(`fibStorage.takeAmmo`, 2, parseInt(value));
            },
            "Sniper Rifle - 7.62mm": (value) => {
                if (!isFlood()) mp.events.callRemote(`fibStorage.takeAmmo`, 3, parseInt(value));
            },
            "Back": (value) => {
                mp.events.call("selectMenu.show", "fib_storage", 3);
            }
        },
        "fib_clothes": {
            "Entrant": () => {
                if (!isFlood()) mp.events.callRemote(`fibStorage.takeClothes`, 0);
            },
            "Agent": () => {
                if (!isFlood()) mp.events.callRemote(`fibStorage.takeClothes`, 1);
            },
            "Tactical set number1": () => {
                if (!isFlood()) mp.events.callRemote(`fibStorage.takeClothes`, 2);
            },
            "Tactical set number2": () => {
                if (!isFlood()) mp.events.callRemote(`fibStorage.takeClothes`, 3);
            },
            "Sniper uniform": () => {
                if (!isFlood()) mp.events.callRemote(`fibStorage.takeClothes`, 4);
            },
            "Body armor": () => {
                if (!isFlood()) mp.events.callRemote(`fibStorage.takeArmour`);
            },
            "Back": () => {
                mp.events.call("selectMenu.show", "fib_storage", 1);
            }
        },

        "hospital_storage": {
            "Office supplies": () => {
                mp.events.call("selectMenu.show", "hospital_items");
            },
            "Wardrobe": () => {
                mp.events.call("selectMenu.show", "hospital_clothes");
            }
        },
        "hospital_items": {
            "First aid kit": (value) => {
                if (!isFlood()) mp.events.callRemote(`hospitalStorage.takeItem`, 0, parseInt(value));
            },
            "Patch": (value) => {
                if (!isFlood()) mp.events.callRemote(`hospitalStorage.takeItem`, 1, parseInt(value));
            },
            " =Hospital Certificate": (value) => {
                if (!isFlood()) mp.events.callRemote(`hospitalStorage.takeItem`, 2);
            },
            "Back": () => {
                mp.events.call("selectMenu.show", "hospital_storage");
            }
        },
        "hospital_clothes": {
            "Paramedic uniform No.1": () => {
                if (!isFlood()) mp.events.callRemote(`hospitalStorage.takeClothes`, 0);
            },
            "Paramedic uniform No.2": () => {
                if (!isFlood()) mp.events.callRemote(`hospitalStorage.takeClothes`, 1);
            },
            "Back": () => {
                mp.events.call("selectMenu.show", "hospital_storage", 1);
            }
        },

        "band_dealer_menu": {
            "Weapons": () => {
                mp.events.call("selectMenu.show", "band_dealer_menu_guns");
            },
            "Ammo": () => {
                mp.events.call("selectMenu.show", "band_dealer_menu_ammo");
            },
            "Наркотики": () => {
                mp.events.call("selectMenu.show", "band_dealer_menu_drugs");
            },
        },
        "band_dealer_menu_guns": {
            "Steel arms": () => {
                mp.events.call("selectMenu.show", "band_dealer_menu_melee");
            },
            "Pistols": () => {
                mp.events.call("selectMenu.show", "band_dealer_menu_handguns");
            },
            "Pistols-пулеметы": () => {
                mp.events.call("selectMenu.show", "band_dealer_menu_submachine_guns");
            },
            "Shotguns": () => {
                mp.events.call("selectMenu.show", "band_dealer_menu_shotguns");
            },
            "Assault rifles": () => {
                mp.events.call("selectMenu.show", "band_dealer_menu_assault_rifles");
            },
            "Light machine guns": () => {
                mp.events.call("selectMenu.show", "band_dealer_menu_light_machine_guns");
            },
            "Sniper rifles": () => {
                mp.events.call("selectMenu.show", "band_dealer_menu_sniper_rifles");
            },
            "Back": () => {
                mp.events.call("selectMenu.show", "band_dealer_menu");
            },
        },
        "band_dealer_menu_melee": {
            "Baseball bat | $200": () => {
                mp.events.callRemote(`bandDealer.buyGun`, 41);
            },
            "Knuckles | $75": () => {
                mp.events.callRemote(`bandDealer.buyGun`, 42);
            },
            "Knife | $300": () => {
                mp.events.callRemote(`bandDealer.buyGun`, 43);
            },
            "Back": () => {
                mp.events.call("selectMenu.show", `band_dealer_menu_guns`);
            },
        },
        "band_dealer_menu_handguns": {
            "Pistol | $800": () => {
                mp.events.callRemote(`bandDealer.buyGun`, 44);
            },
            "AP Pistol | $1200": () => {
                mp.events.callRemote(`bandDealer.buyGun`, 45);
            },
            "Heavy Revolver | $1400": () => {
                mp.events.callRemote(`bandDealer.buyGun`, 46);
            },
            "Back": () => {
                mp.events.call("selectMenu.show", `band_dealer_menu_guns`, 1);
            },
        },
        "band_dealer_menu_submachine_guns": {
            "Micro SMG | $1800": () => {
                mp.events.callRemote(`bandDealer.buyGun`, 47);
            },
            "SMG | $1950": () => {
                mp.events.callRemote(`bandDealer.buyGun`, 48);
            },
            "Back": () => {
                mp.events.call("selectMenu.show", `band_dealer_menu_guns`, 2);
            },
        },
        "band_dealer_menu_shotguns": {
            "Pump Shotgun | $2400": () => {
                mp.events.callRemote(`bandDealer.buyGun`, 21);
            },
            "Sawed-Off Shotgun | $2700": () => {
                mp.events.callRemote(`bandDealer.buyGun`, 49);
            },
            "Back": () => {
                mp.events.call("selectMenu.show", `band_dealer_menu_guns`, 3);
            },
        },
        "band_dealer_menu_assault_rifles": {
            "Assault Rifle | $2800": () => {
                mp.events.callRemote(`bandDealer.buyGun`, 50);
            },
            "Bullpup Rifle | $3000": () => {
                mp.events.callRemote(`bandDealer.buyGun`, 51);
            },
            "Compact Rifle | $3000": () => {
                mp.events.callRemote(`bandDealer.buyGun`, 52);
            },
            "Back": () => {
                mp.events.call("selectMenu.show", `band_dealer_menu_guns`, 4);
            },
        },
        "band_dealer_menu_ammo": {
            "Ammo - 9mm | $6": (value) => {
                if (!isFlood()) mp.events.callRemote(`bandDealer.buyAmmo`, 0, parseInt(value));
            },
            "Ammo - 12mm | $7": (value) => {
                if (!isFlood()) mp.events.callRemote(`bandDealer.buyAmmo`, 1, parseInt(value));
            },
            "Ammo - 5.56mm | $7": (value) => {
                if (!isFlood()) mp.events.callRemote(`bandDealer.buyAmmo`, 2, parseInt(value));
            },
            "Ammo - 7.62mm | $6": (value) => {
                if (!isFlood()) mp.events.callRemote(`bandDealer.buyAmmo`, 3, parseInt(value));
            },
            "Back": () => {
                mp.events.call(`selectMenu.show`, `band_dealer_menu`, 1);
            },
        },
        "band_dealer_menu_drugs": {
            "Marijuana | $6": (value) => {
                if (!isFlood()) mp.events.callRemote(`bandDealer.buyDrgus`, 0, parseInt(value));
            },
            "MDMA | $10": (value) => {
                if (!isFlood()) mp.events.callRemote(`bandDealer.buyDrgus`, 1, parseInt(value));
            },
            "Cocaine | $8": (value) => {
                if (!isFlood()) mp.events.callRemote(`bandDealer.buyDrgus`, 2, parseInt(value));
            },
            "Methamphetamine | $9": (value) => {
                if (!isFlood()) mp.events.callRemote(`bandDealer.buyDrgus`, 3, parseInt(value));
            },
            "Back": () => {
                mp.events.call(`selectMenu.show`, `band_dealer_menu`, 2);
            },
        },

        "enter_driving_school": {
            "Licenses": () => {
                mp.events.call("selectMenu.show", "driving_school_licenses");
            },
        },
        "driving_school_licenses": {
            "Driver": () => {
                mp.events.call("selectMenu.show", "driving_school_car");
            },
            "Water transport": () => {
                mp.events.call("selectMenu.show", "driving_school_water");
            },
            "Pilot": () => {
                mp.events.call("selectMenu.show", "driving_school_fly");
            },
            "Back": () => {
                mp.events.call("selectMenu.show", "enter_driving_school");
            },
        },
        "driving_school_car": {
            "Car License": () => {
                mp.events.callRemote("drivingSchool.buyLic", 1);
            },
            "Moto License": () => {
                mp.events.callRemote("drivingSchool.buyLic", 2);
            },
            "Back": () => {
                mp.events.call("selectMenu.show", "driving_school_licenses");
            }
        },
        "driving_school_water": {
            "Boat License": () => {
                mp.events.callRemote("drivingSchool.buyLic", 3);
            },
            "Yacht License": () => {
                mp.events.callRemote("drivingSchool.buyLic", 4);
            },
            "Back": () => {
                mp.events.call("selectMenu.show", "driving_school_licenses", 1);
            }
        },
        "driving_school_fly": {
            "Helicopter License": () => {
                mp.events.callRemote("drivingSchool.buyLic", 11);
            },
            "Aircraft License": () => {
                mp.events.callRemote("drivingSchool.buyLic", 12);
            },
            "Back": () => {
                mp.events.call("selectMenu.show", "driving_school_licenses", 2);
            }
        },

        "trucker_load": {
            "Trailer": (value) => {
                if (!isFlood()) mp.events.callRemote(`trucker.buyTrailer`, parseInt(value));
                mp.events.call("selectMenu.hide");
            },
        },

        "enter_farm": {
            "Job": () => {
                mp.events.call("selectMenu.show", "enter_farm_job");
            },
            "Info": () => {

            },
            "Help": () => {

            },
        },
        "enter_farm_job": {
            "Work": () => {
                mp.events.callRemote("farm.startJob", 0);
                mp.events.call("selectMenu.hide");
            },
            "Farmer": () => {
                mp.events.callRemote("farm.startJob", 1);
                mp.events.call("selectMenu.hide");
            },
            "Tractor driver": () => {
                mp.events.callRemote("farm.startJob", 2);
                mp.events.call("selectMenu.hide");
            },
            "Pilot": () => {
                mp.events.callRemote("farm.startJob", 3);
                mp.events.call("selectMenu.hide");
            },
            "Quit": () => {
                mp.events.callRemote("farm.stopJob");
                mp.events.call("selectMenu.hide");
            },
            "Back": () => {
                mp.events.call("selectMenu.show", "enter_farm");
            }
        },
        "farm_warehouse": {
            "Grain crops": () => {
                mp.events.call("selectMenu.show", "farm_warehouse_fill_field");
            },
            "Purchase of a harvest": () => {
                mp.events.call("selectMenu.show", "farm_warehouse_buy_crop");
            },
            "Grain sale": () => {
                mp.events.call("selectMenu.show", "farm_warehouse_sell_grain");
            },
            "Unloading of a harvest": () => {
                mp.events.callRemote(`farm.warehouse.unloadCrop`);
                mp.events.call("selectMenu.hide");
            },
        },
        "farm_warehouse_fill_field": {
            "To load": () => {

            },
            "Back": () => {
                mp.events.call("selectMenu.show", "farm_warehouse");
            }
        },
        "farm_warehouse_buy_crop": {
            "To purchase": () => {

            },
            "Back": () => {
                mp.events.call("selectMenu.show", "farm_warehouse", 1);
            }
        },
        "farm_warehouse_sell_grain": {
            "Sale": () => {

            },
            "Back": () => {
                mp.events.call("selectMenu.show", "farm_warehouse", 2);
            }
        },
    };
    for (var key in menuHandlers) {
        menuHandlers[key]["Close"] = () => {
            mp.events.call(`selectMenu.hide`);
        }
    }

    let index_menu = [
      "biz_8_melee",
      "biz_8_handguns",
      "biz_8_submachine_guns",
      "biz_8_shotguns",
      "biz_8_ammo",
      "biz_6_items"
    ];

    mp.events.add("selectMenu.itemSelected", (menuName, itemName, itemValue, itemIndex) => {
        // debug(`itemSelected: ${menuName} ${itemName} ${itemValue} ${itemIndex}`);

        playSelectSound();

        if (menuHandlers[menuName] !== undefined) {
          if (menuHandlers[menuName][itemName] || menuHandlers[menuName][itemIndex]) {
            if (index_menu.includes(menuName))
                menuHandlers[menuName][itemIndex](itemValue, itemIndex);
            else
                menuHandlers[menuName][itemName](itemValue, itemIndex);
          }
        }

        if (menuName == "biz_3_top") {
            if (itemIndex >= mp.storage.data.clothes.top[mp.clientStorage.sex].length) return;
            itemIndex = Math.clamp(itemIndex, 0, mp.storage.data.clothes.top[mp.clientStorage.sex].length - 1);
            var comp = mp.storage.data.clothes.top[mp.clientStorage.sex][itemIndex];
            var texture = comp.textures.indexOf(itemValue);
            if (texture == -1) return mp.events.call("nError", "Texture not found!");
            mp.events.callRemote("biz_3.buyItem", "top", itemIndex, texture);
        } else if (menuName == "biz_3_legs") {
            if (itemIndex >= mp.storage.data.clothes.legs[mp.clientStorage.sex].length) return;
            itemIndex = Math.clamp(itemIndex, 0, mp.storage.data.clothes.legs[mp.clientStorage.sex].length - 1);
            var comp = mp.storage.data.clothes.legs[mp.clientStorage.sex][itemIndex];
            var texture = comp.textures.indexOf(itemValue);
            if (texture == -1) return mp.events.call("nError", "Texture not found!");
            mp.events.callRemote("biz_3.buyItem", "legs", itemIndex, texture);
        } else if (menuName == "biz_3_feets") {
            if (itemIndex >= mp.storage.data.clothes.feets[mp.clientStorage.sex].length) return;
            itemIndex = Math.clamp(itemIndex, 0, mp.storage.data.clothes.feets[mp.clientStorage.sex].length - 1);
            var comp = mp.storage.data.clothes.feets[mp.clientStorage.sex][itemIndex];
            var texture = comp.textures.indexOf(itemValue);
            if (texture == -1) return mp.events.call("nError", "Texture not found!");
            mp.events.callRemote("biz_3.buyItem", "feets", itemIndex, texture);
        } else if (menuName == "biz_3_hats") {
            if (itemIndex >= mp.storage.data.clothes.hats[mp.clientStorage.sex].length) return;
            itemIndex = Math.clamp(itemIndex, 0, mp.storage.data.clothes.hats[mp.clientStorage.sex].length - 1);
            var comp = mp.storage.data.clothes.hats[mp.clientStorage.sex][itemIndex];
            var texture = comp.textures.indexOf(itemValue);
            if (texture == -1) return mp.events.call("nError", "Texture not found!");
            mp.events.callRemote("biz_3.buyItem", "hats", itemIndex, texture);
        } else if (menuName == "biz_3_glasses") {
            if (itemIndex >= mp.storage.data.clothes.glasses[mp.clientStorage.sex].length) return;
            itemIndex = Math.clamp(itemIndex, 0, mp.storage.data.clothes.glasses[mp.clientStorage.sex].length - 1);
            var comp = mp.storage.data.clothes.glasses[mp.clientStorage.sex][itemIndex];
            var texture = comp.textures.indexOf(itemValue);
            if (texture == -1) return mp.events.call("nError", "Texture not found!");
            mp.events.callRemote("biz_3.buyItem", "glasses", itemIndex, texture);
        } else if (menuName == "biz_3_bracelets") {
            if (itemIndex >= mp.storage.data.clothes.bracelets[mp.clientStorage.sex].length) return;
            itemIndex = Math.clamp(itemIndex, 0, mp.storage.data.clothes.bracelets[mp.clientStorage.sex].length - 1);
            var comp = mp.storage.data.clothes.bracelets[mp.clientStorage.sex][itemIndex];
            var texture = comp.textures.indexOf(itemValue);
            if (texture == -1) return mp.events.call("nError", "Texture not found!");
            mp.events.callRemote("biz_3.buyItem", "bracelets", itemIndex, texture);
        } else if (menuName == "biz_3_ears") {
            if (itemIndex >= mp.storage.data.clothes.ears[mp.clientStorage.sex].length) return;
            itemIndex = Math.clamp(itemIndex, 0, mp.storage.data.clothes.ears[mp.clientStorage.sex].length - 1);
            var comp = mp.storage.data.clothes.ears[mp.clientStorage.sex][itemIndex];
            var texture = comp.textures.indexOf(itemValue);
            if (texture == -1) return mp.events.call("nError", "Texture not found!");
            mp.events.callRemote("biz_3.buyItem", "ears", itemIndex, texture);
        } else if (menuName == "biz_3_masks") {
            if (itemIndex >= mp.storage.data.clothes.masks[mp.clientStorage.sex].length) return;
            itemIndex = Math.clamp(itemIndex, 0, mp.storage.data.clothes.masks[mp.clientStorage.sex].length - 1);
            var comp = mp.storage.data.clothes.masks[mp.clientStorage.sex][itemIndex];
            var texture = comp.textures.indexOf(itemValue);
            if (texture == -1) return mp.events.call("nError", "Texture not found!");
            mp.events.callRemote("biz_3.buyItem", "masks", itemIndex, texture);
        } else if (menuName == "biz_3_ties") {
            if (itemIndex >= mp.storage.data.clothes.ties[mp.clientStorage.sex].length) return;
            itemIndex = Math.clamp(itemIndex, 0, mp.storage.data.clothes.ties[mp.clientStorage.sex].length - 1);
            var comp = mp.storage.data.clothes.ties[mp.clientStorage.sex][itemIndex];
            var texture = comp.textures.indexOf(itemValue);
            if (texture == -1) return mp.events.call("nError", "Texture not found!");
            mp.events.callRemote("biz_3.buyItem", "ties", itemIndex, texture);
        } else if (menuName == "biz_3_watches") {
            if (itemIndex >= mp.storage.data.clothes.watches[mp.clientStorage.sex].length) return;
            itemIndex = Math.clamp(itemIndex, 0, mp.storage.data.clothes.watches[mp.clientStorage.sex].length - 1);
            var comp = mp.storage.data.clothes.watches[mp.clientStorage.sex][itemIndex];
            var texture = comp.textures.indexOf(itemValue);
            if (texture == -1) return mp.events.call("nError", "Texture not found!");
            mp.events.callRemote("biz_3.buyItem", "watches", itemIndex, texture);
        }
    });

    mp.events.add("selectMenu.itemValueChanged", (menuName, itemName, itemValue, itemIndex, valueIndex) => {
        //debug(`itemValueChanged: ${menuName} ${itemName} ${itemValue}`);
        var menuHandlers = {};

        if (menuHandlers[menuName] && menuHandlers[menuName][itemName])
            menuHandlers[menuName][itemName](itemValue);
        if (menuName == "biz_3_top") {
            itemIndex = Math.clamp(itemIndex, 0, mp.storage.data.clothes.top[mp.clientStorage.sex].length - 1);
            var comp = mp.storage.data.clothes.top[mp.clientStorage.sex][itemIndex];
            mp.players.local.setComponentVariation(11, comp.variation, comp.textures[valueIndex], 0);
        } else if (menuName == "biz_3_legs") {
            itemIndex = Math.clamp(itemIndex, 0, mp.storage.data.clothes.legs[mp.clientStorage.sex].length - 1);
            var comp = mp.storage.data.clothes.legs[mp.clientStorage.sex][itemIndex];
            mp.players.local.setComponentVariation(4, comp.variation, comp.textures[valueIndex], 0);
        } else if (menuName == "biz_3_feets") {
            itemIndex = Math.clamp(itemIndex, 0, mp.storage.data.clothes.feets[mp.clientStorage.sex].length - 1);
            var comp = mp.storage.data.clothes.feets[mp.clientStorage.sex][itemIndex];
            mp.players.local.setComponentVariation(6, comp.variation, comp.textures[valueIndex], 0);
        } else if (menuName == "biz_3_hats") {
            itemIndex = Math.clamp(itemIndex, 0, mp.storage.data.clothes.hats[mp.clientStorage.sex].length - 1);
            var comp = mp.storage.data.clothes.hats[mp.clientStorage.sex][itemIndex];
            mp.players.local.setPropIndex(0, comp.variation, comp.textures[valueIndex], true);
        } else if (menuName == "biz_3_glasses") {
            itemIndex = Math.clamp(itemIndex, 0, mp.storage.data.clothes.glasses[mp.clientStorage.sex].length - 1);
            var comp = mp.storage.data.clothes.glasses[mp.clientStorage.sex][itemIndex];
            mp.players.local.setPropIndex(1, comp.variation, comp.textures[valueIndex], true);
        } else if (menuName == "biz_3_bracelets") {
            itemIndex = Math.clamp(itemIndex, 0, mp.storage.data.clothes.bracelets[mp.clientStorage.sex].length - 1);
            var comp = mp.storage.data.clothes.bracelets[mp.clientStorage.sex][itemIndex];
            mp.players.local.setPropIndex(7, comp.variation, comp.textures[valueIndex], true);
        } else if (menuName == "biz_3_ears") {
            itemIndex = Math.clamp(itemIndex, 0, mp.storage.data.clothes.ears[mp.clientStorage.sex].length - 1);
            var comp = mp.storage.data.clothes.ears[mp.clientStorage.sex][itemIndex];
            mp.players.local.setPropIndex(2, comp.variation, comp.textures[valueIndex], true);
        } else if (menuName == "biz_3_masks") {
            itemIndex = Math.clamp(itemIndex, 0, mp.storage.data.clothes.masks[mp.clientStorage.sex].length - 1);
            var comp = mp.storage.data.clothes.masks[mp.clientStorage.sex][itemIndex];
            mp.players.local.setComponentVariation(1, comp.variation, comp.textures[valueIndex], 0);
        } else if (menuName == "biz_3_ties") {
            itemIndex = Math.clamp(itemIndex, 0, mp.storage.data.clothes.ties[mp.clientStorage.sex].length - 1);
            var comp = mp.storage.data.clothes.ties[mp.clientStorage.sex][itemIndex];
            mp.players.local.setComponentVariation(7, comp.variation, comp.textures[valueIndex], 0);
        } else if (menuName == "biz_3_watches") {
            itemIndex = Math.clamp(itemIndex, 0, mp.storage.data.clothes.watches[mp.clientStorage.sex].length - 1);
            var comp = mp.storage.data.clothes.watches[mp.clientStorage.sex][itemIndex];
            mp.players.local.setPropIndex(6, comp.variation, comp.textures[valueIndex], true);
        }
        //menuHandlers[menuName][itemName][itemValue]();
    });

    mp.events.add("selectMenu.itemFocusChanged", (menuName, itemName, itemValue, itemIndex, valueIndex) => {
        playFocusSound();
        //menu.execute(`alert('itemFocusChanged: ${menuName} ${itemName} ${itemValue}')`);
        var menuHandlers = { };
        if (menuHandlers[menuName] && menuHandlers[menuName][itemName]) menuHandlers[menuName][itemName](itemValue, itemIndex);
        if (menuName == "biz_3_top") {
            itemIndex = Math.clamp(itemIndex, 0, mp.storage.data.clothes.top[mp.clientStorage.sex].length - 1);
            var comp = mp.storage.data.clothes.top[mp.clientStorage.sex][itemIndex];
            mp.players.local.setComponentVariation(3, comp.torso, 0, 0);
            mp.players.local.setComponentVariation(11, comp.variation, comp.textures[valueIndex], 0);
        } else if (menuName == "biz_3_legs") {
            itemIndex = Math.clamp(itemIndex, 0, mp.storage.data.clothes.legs[mp.clientStorage.sex].length - 1);
            var comp = mp.storage.data.clothes.legs[mp.clientStorage.sex][itemIndex];
            mp.players.local.setComponentVariation(4, comp.variation, comp.textures[valueIndex], 0);
        } else if (menuName == "biz_3_feets") {
            itemIndex = Math.clamp(itemIndex, 0, mp.storage.data.clothes.feets[mp.clientStorage.sex].length - 1);
            var comp = mp.storage.data.clothes.feets[mp.clientStorage.sex][itemIndex];
            mp.players.local.setComponentVariation(6, comp.variation, comp.textures[valueIndex], 0);
        } else if (menuName == "biz_3_hats") {
            itemIndex = Math.clamp(itemIndex, 0, mp.storage.data.clothes.hats[mp.clientStorage.sex].length - 1);
            var comp = mp.storage.data.clothes.hats[mp.clientStorage.sex][itemIndex];
            mp.players.local.setPropIndex(0, comp.variation, comp.textures[valueIndex], true);
        } else if (menuName == "biz_3_glasses") {
            itemIndex = Math.clamp(itemIndex, 0, mp.storage.data.clothes.glasses[mp.clientStorage.sex].length - 1);
            var comp = mp.storage.data.clothes.glasses[mp.clientStorage.sex][itemIndex];
            mp.players.local.setPropIndex(1, comp.variation, comp.textures[valueIndex], true);
        } else if (menuName == "biz_3_bracelets") {
            itemIndex = Math.clamp(itemIndex, 0, mp.storage.data.clothes.bracelets[mp.clientStorage.sex].length - 1);
            var comp = mp.storage.data.clothes.bracelets[mp.clientStorage.sex][itemIndex];
            mp.players.local.setPropIndex(7, comp.variation, comp.textures[valueIndex], true);
        } else if (menuName == "biz_3_ears") {
            itemIndex = Math.clamp(itemIndex, 0, mp.storage.data.clothes.ears[mp.clientStorage.sex].length - 1);
            var comp = mp.storage.data.clothes.ears[mp.clientStorage.sex][itemIndex];
            mp.players.local.setPropIndex(2, comp.variation, comp.textures[valueIndex], true);
        } else if (menuName == "biz_3_masks") {
            itemIndex = Math.clamp(itemIndex, 0, mp.storage.data.clothes.masks[mp.clientStorage.sex].length - 1);
            var comp = mp.storage.data.clothes.masks[mp.clientStorage.sex][itemIndex];
            mp.players.local.setComponentVariation(1, comp.variation, comp.textures[valueIndex], 0);
        } else if (menuName == "biz_3_ties") {
            itemIndex = Math.clamp(itemIndex, 0, mp.storage.data.clothes.ties[mp.clientStorage.sex].length - 1);
            var comp = mp.storage.data.clothes.ties[mp.clientStorage.sex][itemIndex];
            mp.players.local.setComponentVariation(7, comp.variation, comp.textures[valueIndex], 0);
        } else if (menuName == "biz_3_watches") {
            itemIndex = Math.clamp(itemIndex, 0, mp.storage.data.clothes.watches[mp.clientStorage.sex].length - 1);
            var comp = mp.storage.data.clothes.watches[mp.clientStorage.sex][itemIndex];
            mp.players.local.setPropIndex(6, comp.variation, comp.textures[valueIndex], true);
        }
    });

    mp.events.add("selectMenu.backspacePressed", (menuName, itemName, itemValue, itemIndex) => {
        playBackSound();
        //menu.execute(`alert('backspacePressed: ${menuName} ${itemName} ${itemValue}')`);
        var menuHandlers = {
            "!enter_house": (itemName, itemValue) => {
                mp.events.call(`selectMenu.hide`);
            },
            "!exit_house": (itemName, itemValue) => {
                mp.events.call(`selectMenu.hide`);
            },
            "enter_garage": (itemName, itemValue) => {
                mp.events.call(`selectMenu.hide`);
            },
            /*"exit_garage": (itemName, itemValue) => {
            	mp.events.call(`selectMenu.hide`);
            },*/
            "biz_panel": (itemName, itemValue) => {
                mp.events.call(`selectMenu.show`, prevMenuName);
            },
            "biz_cashbox": (itemName, itemValue) => {
                mp.events.call(`selectMenu.show`, "biz_panel", 1);
            },
            "biz_stats": (itemName, itemValue) => {
                mp.events.call(`selectMenu.show`, "biz_panel", 2);
            },
            "biz_products": (itemName, itemValue) => {
                mp.events.call(`selectMenu.show`, "biz_panel", 3);
            },
            "biz_staff": (itemName, itemValue) => {
                mp.events.call(`selectMenu.show`, "biz_panel", 4);
            },
            "biz_rise": (itemName, itemValue) => {
                mp.events.call(`selectMenu.show`, "biz_panel", 5);
            },
            "biz_status": (itemName, itemValue) => {
                mp.events.call(`selectMenu.show`, "biz_panel", 6);
            },
            "biz_sell": (itemName, itemValue) => {
                mp.events.call(`selectMenu.show`, "biz_panel", 7);
            },
            "biz_3_clothes": () => {
                mp.events.call("selectMenu.show", "enter_biz_3");
            },
            "biz_3_top": () => {
                mp.events.call("selectMenu.show", "biz_3_clothes");
            },
            "biz_3_legs": () => {
                mp.events.call("selectMenu.show", "biz_3_clothes", 1);
            },
            "biz_3_feets": () => {
                mp.events.call("selectMenu.show", "biz_3_clothes", 2);
            },
            "biz_3_hats": () => {
                mp.events.call("selectMenu.show", "biz_3_clothes", 3);
            },
            "biz_3_glasses": () => {
                mp.events.call("selectMenu.show", "biz_3_clothes", 4);
            },
            "biz_3_bracelets": () => {
                mp.events.call("selectMenu.show", "biz_3_clothes", 5);
            },
            "biz_3_ears": () => {
                mp.events.call("selectMenu.show", "biz_3_clothes", 6);
            },
            "biz_3_masks": () => {
                mp.events.call("selectMenu.show", "biz_3_clothes", 7);
            },
            "biz_3_ties": () => {
                mp.events.call("selectMenu.show", "biz_3_clothes", 8);
            },
            "biz_3_watches": () => {
                mp.events.call("selectMenu.show", "biz_3_clothes", 9);
            },
            "biz_5_items": () => {
                mp.events.call("selectMenu.show", "enter_biz_5", 0);
            },
            "biz_6_items": () => {
                mp.events.call("selectMenu.show", "enter_biz_6");
            },
            "biz_8_guns": () => {
                mp.events.call("selectMenu.show", "enter_biz_8");
            },
            "biz_8_melee": () => {
                mp.events.call("selectMenu.show", "biz_8_guns");
            },
            "biz_8_handguns": () => {
                mp.events.call("selectMenu.show", "biz_8_guns", 1);
            },
            "biz_8_submachine_guns": () => {
                mp.events.call("selectMenu.show", "biz_8_guns", 2);
            },
            "biz_8_shotguns": () => {
                mp.events.call("selectMenu.show", "biz_8_guns", 3);
            },
            "biz_8_assault_rifles": () => {
                mp.events.call("selectMenu.show", "biz_8_guns", 4);
            },
            "biz_8_light_machine_guns": () => {
                mp.events.call("selectMenu.show", "biz_8_guns", 5);
            },
            "biz_8_sniper_rifles": () => {
                mp.events.call("selectMenu.show", "biz_8_guns", 6);
            },
            "biz_8_ammo": () => {
                mp.events.call("selectMenu.show", "enter_biz_8", 1);
            },
            "police_storage": () => {
                mp.events.call(`selectMenu.hide`);
            },
            "police_guns": () => {
                mp.events.call("selectMenu.show", "police_storage");
            },
            "police_clothes": () => {
                mp.events.call("selectMenu.show", "police_storage", 1);
            },
            "police_items": () => {
                mp.events.call("selectMenu.show", "police_storage", 2);
            },
            "police_ammo": () => {
                mp.events.call("selectMenu.show", "police_storage", 3);
            },
            "police_service_recovery": () => {
                mp.events.call("selectMenu.show", "police_service");
            },

            "police_storage_2": () => {
                mp.events.call(`selectMenu.hide`);
            },
            "police_guns_2": () => {
                mp.events.call("selectMenu.show", "police_storage_2");
            },
            "police_clothes_2": () => {
                mp.events.call("selectMenu.show", "police_storage_2", 1);
            },
            "police_items_2": () => {
                mp.events.call("selectMenu.show", "police_storage_2", 2);
            },
            "police_ammo_2": () => {
                mp.events.call("selectMenu.show", "police_storage_2", 3);
            },
            "police_service_recovery_2": () => {
                mp.events.call("selectMenu.show", "police_service_2");
            },

            "army_storage": () => {
                mp.events.call(`selectMenu.hide`);
            },
            "army_guns": () => {
                mp.events.call("selectMenu.show", "army_storage");
            },
            "army_clothes": () => {
                mp.events.call("selectMenu.show", "army_storage", 1);
            },
            "army_items": () => {
                mp.events.call("selectMenu.show", "army_storage", 2);
            },
            "army_ammo": () => {
                mp.events.call("selectMenu.show", "army_storage", 2);
            },

            "army_storage_2": () => {
                mp.events.call(`selectMenu.hide`);
            },
            "army_guns_2": () => {
                mp.events.call("selectMenu.show", "army_storage_2");
            },
            "army_clothes_2": () => {
                mp.events.call("selectMenu.show", "army_storage_2", 1);
            },
            "army_items_2": () => {
                mp.events.call("selectMenu.show", "army_storage_2", 2);
            },
            "army_ammo_2": () => {
                mp.events.call("selectMenu.show", "army_storage_2", 2);
            },

            "fib_storage": () => {
                mp.events.call(`selectMenu.hide`);
            },
            "fib_guns": () => {
                mp.events.call("selectMenu.show", "fib_storage");
            },
            "fib_clothes": () => {
                mp.events.call("selectMenu.show", "fib_storage", 1);
            },
            "fib_items": () => {
                mp.events.call("selectMenu.show", "fib_storage", 2);
            },
            "fib_ammo": () => {
                mp.events.call("selectMenu.show", "fib_storage", 3);
            },

            "hospital_storage": () => {
                mp.events.call(`selectMenu.hide`);
            },
            "hospital_items": () => {
                mp.events.call("selectMenu.show", "hospital_storage");
            },
            "hospital_clothes": () => {
                mp.events.call("selectMenu.show", "hospital_storage", 1);
            },
            "driving_school_licenses": () => {
                mp.events.call("selectMenu.show", "enter_driving_school");
            },
            "driving_school_car": () => {
                mp.events.call("selectMenu.show", "driving_school_licenses");
            },
            "driving_school_water": () => {
                mp.events.call("selectMenu.show", "driving_school_licenses", 1);
            },
            "driving_school_fly": () => {
                mp.events.call("selectMenu.show", "driving_school_licenses", 2);
            },
            "band_dealer_menu_guns": () => {
                mp.events.call("selectMenu.show", "band_dealer_menu");
            },
            "band_dealer_menu_melee": () => {
                mp.events.call("selectMenu.show", "band_dealer_menu_guns");
            },
            "band_dealer_menu_handguns": () => {
                mp.events.call("selectMenu.show", "band_dealer_menu_guns", 1);
            },
            "band_dealer_menu_submachine_guns": () => {
                mp.events.call("selectMenu.show", "band_dealer_menu_guns", 2);
            },
            "band_dealer_menu_shotguns": () => {
                mp.events.call("selectMenu.show", "band_dealer_menu_guns", 3);
            },
            "band_dealer_menu_assault_rifles": () => {
                mp.events.call("selectMenu.show", "band_dealer_menu_guns", 4);
            },
            "band_dealer_menu_ammo": () => {
                mp.events.call("selectMenu.show", "band_dealer_menu", 1);
            },
            "band_dealer_menu_drugs": () => {
                mp.events.call("selectMenu.show", "band_dealer_menu", 2);
            },
            "enter_farm_job": () => {
                mp.events.call("selectMenu.show", "enter_farm");
            },
            "farm_warehouse_fill_field": () => {
                mp.events.call("selectMenu.show", "farm_warehouse", 0);
            },
            "farm_warehouse_buy_crop": () => {
                mp.events.call("selectMenu.show", "farm_warehouse", 1);
            },
            "farm_warehouse_sell_grain": () => {
                mp.events.call("selectMenu.show", "farm_warehouse", 2);
            },
        };

        if (menuHandlers[menuName])
            menuHandlers[menuName](itemName, itemValue);
    });

    mp.events.add("setSelectMenuActive", (enable) => {
        mp.selectMenuActive = enable;
    });

    function clothesConvertToMenuItems(clothes) {
        var items = [];
        for (var i = 0; i < clothes.length; i++) {
            items.push({
                text: `Clothes <i>${clothes[i].price}$</i> ID: ${clothes[i].id}`,
                values: clothes[i].textures
            });
        }
        return items;
    }

    // Custom events
    mp.events.add("weapon.shop.setAmmoShopName", (args, price) => {
        menu.execute(`selectMenuAPI.setItemName('biz_8_melee', 0, {text: "Baseball bat | $${args[0]}"})`);
        menu.execute(`selectMenuAPI.setItemName('biz_8_melee', 1, {text: "Knuckles | $${args[1]}"})`);
        menu.execute(`selectMenuAPI.setItemName('biz_8_melee', 2, {text: "Knife | $${args[2]}"})`);

        menu.execute(`selectMenuAPI.setItemName('biz_8_handguns', 0, {text: "Pistol | $${args[3]}"})`);
        menu.execute(`selectMenuAPI.setItemName('biz_8_handguns', 1, {text: "AP Pistol | $${args[4]}"})`);

        menu.execute(`selectMenuAPI.setItemName('biz_8_submachine_guns', 0, {text: "Micro SMG | $${args[5]}"})`);
        menu.execute(`selectMenuAPI.setItemName('biz_8_submachine_guns', 1, {text: "SMG | $${args[6]}"})`);

        menu.execute(`selectMenuAPI.setItemName('biz_8_shotguns', 0, {text: "Sawed-Off Shotgun | $${args[7]}"})`);

        menu.execute(`selectMenuAPI.setItemName('biz_8_ammo', 0, {text: "Ammo - 9mm | $${price}", values: ["10 шт.", "20 шт.", "40 шт.", "80 шт."]})`);
        menu.execute(`selectMenuAPI.setItemName('biz_8_ammo', 1, {text: "Ammo - 12mm | $${price}", values: ["10 шт.", "20 шт.", "40 шт.", "80 шт."]})`);
        menu.execute(`selectMenuAPI.setItemName('biz_8_ammo', 2, {text: "Ammo - 5.56mm | $${price}", values: ["10 шт.", "20 шт.", "40 шт.", "80 шт."]})`);
        menu.execute(`selectMenuAPI.setItemName('biz_8_ammo', 3, {text: "Ammo - 7.62mm | $${price}", values: ["10 шт.", "20 шт.", "40 шт.", "80 шт."]})`);
    });
    mp.events.add("food.shop.setFoodShopName", (args) => {
        menu.execute(`selectMenuAPI.setItemName('biz_6_items', 0, {text: "Cola | $${args[0]}"})`);
        menu.execute(`selectMenuAPI.setItemName('biz_6_items', 1, {text: "EgoChaser | $${args[1]}"})`);
        menu.execute(`selectMenuAPI.setItemName('biz_6_items', 2, {text: "Meteorite | $${args[2]}"})`);
        menu.execute(`selectMenuAPI.setItemName('biz_6_items', 3, {text: "P's & Q's | $${args[3]}"})`);
        menu.execute(`selectMenuAPI.setItemName('biz_6_items', 4, {text: "A pack of Redwoods | $${args[4]}"})`);
        menu.execute(`selectMenuAPI.setItemName('biz_6_items', 5, {text: "Pisswasser | $${args[5]}"})`);
        menu.execute(`selectMenuAPI.setItemName('biz_6_items', 6, {text: "uPhone | $${args[6]}"})`);
        menu.execute(`selectMenuAPI.setItemName('biz_6_items', 7, {text: "Bag | $${args[7]}"})`);
        menu.execute(`selectMenuAPI.setItemName('biz_6_items', 8, {text: "Canister | $${args[8]}"})`);
        menu.execute(`selectMenuAPI.setItemName('biz_6_items', 9, {text: "Patch | $${args[9]}"})`);
    });
}
