$(document).ready(() => {
    //fill from server
    /*window.clientStorage.inventoryItems = [
          {name: "Очки", description: "todo", height: 1, width: 1, weight: 0.1, sqlId: 1},
          {name: "Галстук", description: "todo", height: 1, width: 1, weight: 0.3, sqlId: 2},
          {name: "Бронежилет", description: "todo", height: 3, width: 3, weight: 15, sqlId: 3},
          {name: "Деньги", description: "todo", height: 1, width: 1, weight: 0.1, sqlId: 4},
          {name: "VISA", description: "todo", height: 1, width: 1, weight: 0.1, sqlId: 5},
          {name: "Головной убор", description: "todo", height: 1, width: 1, weight: 0.8, sqlId: 6},
          {name: "Верхняя одежда", description: "todo", height: 2, width: 2, weight: 2, sqlId: 7},
          {name: "Брюки", description: "todo", height: 2, width: 1, weight: 1, sqlId: 8},
          {name: "Обувь", description: "todo", height: 2, width: 2, weight: 1, sqlId: 9},
          {name: "Серьги", description: "todo", height: 1, width: 1, weight: 0.1, sqlId: 10},
          {name: "Часы", description: "todo", height: 1, width: 2, weight: 0.1, sqlId: 11},
          {name: "Браслет", description: "todo", height: 1, width: 1, weight: 0.1, sqlId: 12},
          {name: "Сумка", description: "todo", height: 3, width: 3, weight: 4, sqlId: 13},
          {name: "Маска", description: "todo", height: 1, width: 1, weight: 0.1, sqlId: 14},
          {name: "Смартфон", description: "todo", height: 2, width: 2, weight: 0.1, sqlId: 15},
    ];*/
    window.clientStorage.inventoryWeight = 0;
    window.clientStorage.inventoryMaxWeight = 30;

    window.playerInventory = {};
    window.vehicleInventory = {};

    /* Доступные предметы для ячеек основного инвентаря. */
    var mainItemIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];

    /* Черный список типов предметов для хранителей. */
    var blackList = {
        0: [3, 7, 8, 9, 13], // топ
        1: [3, 7, 8, 9, 13], // брюки
        2: [13] // сумка
    };

    /* Контекстное меню для предметов. */
    var itemMenus = {
        1: [],
        2: [],
        3: [],
        4: [{
            text: "Split",
            handler: (sqlId) => {
                inventoryAPI.show(false);
                modalAPI.show("item_split", JSON.stringify({
                    itemSqlId: sqlId
                }));
            }
        }],
        5: [],
        6: [],
        7: [],
        8: [],
        9: [],
        10: [],
        11: [],
        12: [],
        13: [],
        14: [],
        15: [],
        16: [{
            text: "Look",
            handler: (sqlId) => {
                mp.trigger("events.callRemote", "showDocuments", sqlId);
            }
        }],
        17: [],
        18: [],
        19: [],
        20: [],
        21: [],
        22: [],
        23: [],
        24: [],
        25: [{
            text: "Use",
            handler: (sqlId) => {
                mp.trigger("events.callRemote", "item.useHealth", sqlId);
            }
        }],
        26: [],
        27: [],
        28: [],
        29: [{
            text: "Look",
            handler: (sqlId) => {
                mp.trigger("events.callRemote", "documents.showFaction", -1);
            }
        }],
        30: [{
            text: "Drink",
            handler: (sqlId) => {
                mp.trigger("events.callRemote", "item.eat", sqlId);
            }
        }],
        31: [{
            text: "Eat",
            handler: (sqlId) => {
                mp.trigger("events.callRemote", "item.eat", sqlId);
            }
        }],
        32: [{
            text: "Eat",
            handler: (sqlId) => {
                mp.trigger("events.callRemote", "item.eat", sqlId);
            }
        }],
        33: [{
            text: "Suck",
            handler: (sqlId) => {
                mp.trigger("events.callRemote", "item.eat", sqlId);
            }
        }],
        34: [{
            text: "Take out",
            handler: (sqlId) => {
                mp.trigger("events.callRemote", "item.takeSmoke", sqlId);
            }
        }],
        35: [{
            text: "Drink",
            handler: (sqlId) => {
                mp.trigger("events.callRemote", "item.eat", sqlId);
            }
        }],
        36: [],
        37: [{
            text: "Split",
            handler: (sqlId) => {
                inventoryAPI.show(false);
                modalAPI.show("item_split", JSON.stringify({
                    itemSqlId: sqlId
                }));
            }
        }],
        38: [{
            text: "Split",
            handler: (sqlId) => {
                inventoryAPI.show(false);
                modalAPI.show("item_split", JSON.stringify({
                    itemSqlId: sqlId
                }));
            }
        }],
        39: [{
            text: "Split",
            handler: (sqlId) => {
                inventoryAPI.show(false);
                modalAPI.show("item_split", JSON.stringify({
                    itemSqlId: sqlId
                }));
            }
        }],
        40: [{
            text: "Split",
            handler: (sqlId) => {
                inventoryAPI.show(false);
                modalAPI.show("item_split", JSON.stringify({
                    itemSqlId: sqlId
                }));
            }
        }],
        41: [],
        42: [],
        43: [],
        44: [],
        45: [],
        46: [],
        47: [],
        48: [],
        49: [],
        50: [],
        51: [],
        52: [],
        53: [],
        54: [{
                text: "Parking",
                handler: (sqlId) => {
                    mp.trigger("events.callRemote", "item.parkCarByKeys", sqlId);
                }
            },
            {
                text: "Doors",
                handler: (sqlId) => {
                    mp.trigger("events.callRemote", "item.lockCarByKeys", sqlId);
                }
            },
            {
                text: "Search",
                handler: (sqlId) => {
                    mp.trigger("events.callRemote", "item.searchCarByKeys", sqlId);
                }
            },
            {
                text: "Deliver",
                handler: (sqlId) => {
                    var item = inventoryAPI.getItem(sqlId);
                    if (!item) return nError(`No keys found!`);
                    var model = item.params.model;
                    if (clientStorage.sqlId != item.params.owner) return nError(`You are not the owner ${model}!`);
                    inventoryAPI.show(false);
                    mp.trigger("choiceMenu.show", "accept_fix_car", sqlId);
                }
            },
            {
                text: "Sell",
                handler: (sqlId) => {
                    var item = inventoryAPI.getItem(sqlId);
                    if (!item) return nError(`No keys found!`);
                    var model = item.params.model;
                    if (clientStorage.sqlId != item.params.owner) return nError(`You are not the owner ${model}!`);
                    inventoryAPI.show(false);
                    modalAPI.show("sell_player_car", JSON.stringify({sqlId: sqlId}));
                }
            }
        ],
        55: [{
                text: "Use",
                handler: (sqlId) => {
                    mp.trigger("events.callRemote", "item.useDrugs", sqlId);
                }
            },
            {
                text: "Split",
                handler: (sqlId) => {
                    inventoryAPI.show(false);
                    modalAPI.show("item_split", JSON.stringify({
                        itemSqlId: sqlId
                    }));
                }
            }
        ],
        56: [{
                text: "Use",
                handler: (sqlId) => {
                    mp.trigger("events.callRemote", "item.useDrugs", sqlId);
                }
            },
            {
                text: "Split",
                handler: (sqlId) => {
                    inventoryAPI.show(false);
                    modalAPI.show("item_split", JSON.stringify({
                        itemSqlId: sqlId
                    }));
                }
            }
        ],
        57: [{
                text: "Use",
                handler: (sqlId) => {
                    mp.trigger("events.callRemote", "item.useDrugs", sqlId);
                }
            },
            {
                text: "Split",
                handler: (sqlId) => {
                    inventoryAPI.show(false);
                    modalAPI.show("item_split", JSON.stringify({
                        itemSqlId: sqlId
                    }));
                }
            }
        ],
        58: [{
                text: "Use",
                handler: (sqlId) => {
                    mp.trigger("events.callRemote", "item.useDrugs", sqlId);
                }
            },
            {
                text: "Split",
                handler: (sqlId) => {
                    inventoryAPI.show(false);
                    modalAPI.show("item_split", JSON.stringify({
                        itemSqlId: sqlId
                    }));
                }
            }
        ],
        59: [{
            text: "Search",
            handler: (sqlId) => {
                mp.trigger("events.callRemote", "item.searchHouseByKeys", sqlId);
            }
        }],
        60: [{
            text: "Look",
            handler: (sqlId) => {
                mp.trigger("events.callRemote", "documents.showFaction", -1);
            }
        }],
        61: [{
            text: "Look",
            handler: (sqlId) => {
                mp.trigger("events.callRemote", "documents.showFaction", -1);
            }
        }],
        62: [{
            text: "Smoke",
            handler: (sqlId) => {
                mp.trigger("events.callRemote", "item.useSmoke", sqlId);
            }
        }],
        63: [{
            text: "Look",
            handler: (sqlId) => {
                mp.trigger("events.callRemote", "documents.showFaction", -1);
            }
        }],
        64: [],
        65: [],
        66: [],
        67: [],
        68: [],
        69: [],
        70: [],
    };
    for (var i in itemMenus) itemMenus[i].push({
        text: "Throw away",
        handler: (sqlId) => {
            mp.trigger("events.callRemote", "item.throw", sqlId);
        }
    });


    var draggingItemEl, freeColumnEl, mergeItemSqlId;
    var mainContainer = $("#inventory .main"); // контейнер с дефолтными ячейками

    window.inventoryAPI = {
        initHandlers: () => {
            $(document).mouseup((e) => {
                inventoryAPI.mouseupHandler(e);
            });
            /* Для ячеек основного инвентаря. */
            $("#inventory .main .column").mouseenter((e) => {
                if (draggingItemEl) {
                    var item = inventoryAPI.getItem(draggingItemEl.data("sqlid"));
                    if (!item) item = vehicleInventory[draggingItemEl.data("sqlid")];
                    if (mainItemIds[$(e.target).data("index")] != item.itemId) return; // ячейка для другого типа предмета
                    if (!$(e.target).is(":empty") &&
                        $(e.target).find(".item").data("sqlid") != draggingItemEl.data("sqlid")) return; // уже имеется другой предмет
                    if (item.params.sex != null && item.params.sex != clientStorage.sex) return nError(`Gender character does not match the type of clothing!`);
                    hoverColumn(draggingItemEl, freeColumnEl, "#222");
                    freeColumnEl = $(e.target);
                    //freeColumnEl.css("border-color", "#196");
                    //freeColumnEl.css("background", "#222");
                }
            });
            $("#inventory .main .column").mouseleave((e) => {
                if (draggingItemEl) {
                    if (!$(e.target).is(":empty")) return;
                    //$(e.target).css("border-color", "#5c5c5d");
                }
            });
            $(document).keydown((e) => {
                if (draggingItemEl) inventoryAPI.mouseupHandler();
            });
        },
        /* Добавление предмета в основной инвентарь. */
        add: (sqlId, item) => {
            //debug(`inv.add: ${sqlId} ${item}`);
            sqlId = parseInt(sqlId);
            item = JSON.parse(item);
            var itemEl = createItemEl(sqlId, item);
            if (isDefaultColumn(item)) {
                var column = mainContainer.find(`.column[data-index='${item.index}']`);
                column.empty();
                column.append(itemEl);
                column.css("border-color", "#9fa0a1");


                if (isContainerItem(item)) {
                    var containerEl = initContainerEl(sqlId, item);
                    var itemsEl = containerEl.find(".items");
                    for (var key in item.items) {
                        fillColumn(key, item.items[key], itemsEl);
                    }
                    containerEl.slideDown("fast", () => {
                        containerEl.parent().find(".items").hide();
                        containerEl.parent().find(".items").show();
                    });
                }
                playerInventory[sqlId] = item;
            } else {
                var ids = [7, 8, 13];
                var parentItem = inventoryAPI.getItem(item.parentId);
                parentItem.items[sqlId] = item;
                var index = ids.indexOf(parentItem.itemId);
                var itemsEl = $(`#inventory .right-block .container:eq(${index}) .items`);
                fillColumn(sqlId, item, itemsEl);
            }
            clientStorage.inventoryWeight = inventoryAPI.getCommonWeight();
            $("#inventory .weight").text(clientStorage.inventoryWeight.toFixed(1));
        },
        /* Добавление предмета в Trunk авто. */
        vehAdd: (sqlId, item) => {
           ////debug(`inv.vehAdd: ${sqlId} ${item}`);
            sqlId = parseInt(sqlId);
            item = JSON.parse(item);
            item.inVehicle = true;
            if (!item.parentId || item.parentId == -1) delete item.parentId;
            var itemEl = createItemEl(sqlId, item);

            var parentItem = inventoryAPI.getVehItem(item.parentId);
            if (parentItem) parentItem.items[sqlId] = item;
            else vehicleInventory[sqlId] = item;
             //debug(JSON.stringify(vehicleInventory))
            var itemsEl = $(`#inventory .left-block .container:eq(0) .items`);
            fillColumn(sqlId, item, itemsEl);
        },
        /* Search предмета по его sqlId. */
        getItem: (sqlId) => {
            return findItemBySqlId(sqlId, playerInventory);
        },
        /* Search предмета по его sqlId у Trunkа авто. */
        getVehItem: (sqlId) => {
            return findItemBySqlId(sqlId, vehicleInventory);
        },
        /* Обновление параметра предмета. */
        updateParams: (sqlId, params) => {
            params = JSON.parse(params);
            var item = inventoryAPI.getItem(sqlId);
            item.params = params;
        },
        /* Обновить sqlId предмета. */
        updateSqlId: (sqlId, newSqlId) => {
             //debug(`inventoryAPI.updateSqlId: ${sqlId} ${newSqlId}`)
            var itemEl = $(`#inventory .item[data-sqlid='${sqlId}']`);
            itemEl.attr("data-sqlid", newSqlId);
            itemEl.data("sqlid", newSqlId);
             //debug(`len: ${itemEl.length}`)
        },
        /* Получить вес предмета. */
        getWeight: (sqlId) => {
            return getWeightItemBySqlId(sqlId, playerInventory);
        },
        /* Получить общий вес предметов. */
        getCommonWeight: () => {
            var weight = 0;
            for (var sqlId in playerInventory) {
                weight += inventoryAPI.getWeight(sqlId);
            }
            return weight;
        },
        /* Удаление предмета. */
        delete: (sqlId) => {
             //debug(`inv.delete: ${sqlId}`);

            var item = inventoryAPI.getItem(sqlId);
             //debug(`item: ${JSON.stringify(item)}`);

            if (item.parentId == -1 || !item.parentId) {
                delete playerInventory[sqlId];
            } else {
                var parentItem = inventoryAPI.getItem(item.parentId);
                delete parentItem.items[sqlId];
            }
            var itemEl = $(`#inventory .item[data-sqlid='${sqlId}']`);
            var columnsEl = itemEl.parents(".items").find(".column");
            resetColumnSize(itemEl.parent(".column"));
            itemEl.parent(".column").css("border-color", "");
            itemEl.parent(".column").removeClass("filled");
            $(`#inventory .item[data-sqlid="${sqlId}"]`).remove();

            if (!item.parentId || item.parentId == -1) {
                var ids = [7, 8, 13];
                var index = ids.indexOf(item.itemId);
                if (index != -1) {
                    $("#inventory .right-block .container").eq(index).slideUp("fast", () => {
                        $("#inventory .right-block .container .items").hide();
                        $("#inventory .right-block .container .items").show();
                    });
                }
            } else {
                columnsEl.css("background", "");
            }

            clientStorage.inventoryWeight = inventoryAPI.getCommonWeight();
            $("#inventory .weight").text(clientStorage.inventoryWeight.toFixed(1));
        },
        /* Удаление предмета из Trunkа. */
        vehDelete: (sqlId) => {

            var item = vehicleInventory[sqlId];

            if (item.parentId == -1 || !item.parentId) {
                delete vehicleInventory[sqlId];
            } else {
                var parentItem = inventoryAPI.getVehItem(item.parentId);
                delete parentItem.items[sqlId];
            }
            var itemEl = $(`#inventory .item[data-sqlid='${sqlId}']`);
            var columnsEl = itemEl.parents(".items").find(".column");
            resetColumnSize(itemEl.parent(".column"));
            itemEl.parent(".column").css("border-color", "");
            itemEl.parent(".column").removeClass("filled");
            $(`#inventory .item[data-sqlid="${sqlId}"]`).remove();

            columnsEl.css("background", "");
        },
        /* Добавление предметов Trunkа авто. */
        addVehicleItems: (items, veh, rows, cols) => {
             ////debug(`addVehicleItems: ${items} ${veh} ${rows} ${cols}`);
            items = JSON.parse(items);
            veh = JSON.parse(veh);

            var containerEl = initVehicleContainerEl(items, veh, rows, cols);

            var itemsEl = containerEl.find(".items");
            vehicleInventory = {};
            for (var key in items) {
                vehicleInventory[key] = items[key];
                vehicleInventory[key].inVehicle = true;
                fillColumn(key, items[key], itemsEl);
            }
            containerEl.slideDown("fast", () => {
                containerEl.parent().find(".items").hide();
                containerEl.parent().find(".items").show();
            });
        },
        /* Удаление предметов Trunkа авто. */
        deleteVehicleItems: () => {
            var containerEl = $(`#inventory .left-block .container`).eq(0);
            containerEl.slideUp("fast", () => {
                containerEl.parent().find(".items").hide();
                containerEl.parent().find(".items").show();
            });
            vehicleInventory = {};
        },
        setMoney: (value) => {
            value = parseInt(value);
            $('#inventory #feet-items .money').text(value + "$");
        },
        setBankMoney: (value) => {
            value = parseInt(value);
            $('#inventory #feet-items .bank').text(value + "$");
        },
        setHealth: (value) => {
            value = parseInt(value);
            $('#inventory #feet-items .health').css("background", `linear-gradient(to right, #0fa04b ${value}%, #1a5932 ${value}%)`);
        },
        setSatiety: (value) => {
            value = parseInt(value);
            $('#inventory #feet-items .satiety').css("background", `linear-gradient(to right, #a67d10 ${value}%, #493d20 ${value}%)`);
        },
        setThirst: (value) => {
            value = parseInt(value);
            $('#inventory #feet-items .thirst').css("background", `linear-gradient(to right, #1070a0 ${value}%, #1b475c ${value}%)`);
        },
        setArmour: (value) => {
            for (var sqlId in playerInventory) {
                var item = playerInventory[sqlId];
                if (item.itemId == 3) item.params.armour = value;
            }
        },
        /* Показать/скрыть инвентарь. */
        show: (enable) => {
            if (enable) {
                if (window.medicTablet.active() || window.pdTablet.active() || window.telephone.active() || window.armyTablet.active() || window.sheriffTablet.active() || window.fibTablet.active() || window.playerMenu.active() || consoleAPI.active() || modalAPI.active() || chatAPI.active() || tradeAPI.active() || documentsAPI.active() || houseMenu.__vue__.active()) return;
                if (mp) mp.trigger(`toBlur`, 200);
                $(`#inventory .playerName`).text(clientStorage.name || "Гражданин");
                $(`#inventory`).fadeIn("fast", () => {
                    var indexes = [6, 7, 12];
                    indexes.forEach((index) => {
                        var columnEl = $(`#inventory .main .column[data-index='${index}']`);
                        if (!columnEl.is(":empty")) {
                            var containerEl = $("#inventory .right-block .container");
                            containerEl.eq(indexes.indexOf(index)).slideDown("fast", () => {
                                containerEl.parent().find(".items").hide();
                                containerEl.parent().find(".items").show();
                            });
                        }
                    });
                    if (clientStorage.bootVehicleId != -1) {
                        return;
                        var containerEl = $("#inventory .left-block .container");
                        containerEl.eq(0).slideDown("fast", () => {
                            containerEl.parent().find(".items").hide();
                            containerEl.parent().find(".items").show();
                        });
                    }
                });
            } else {
                if (consoleAPI.active()) return;
                mp.trigger(`fromBlur`, 200);
                $(`#inventory .container`).slideUp("fast", () => {
                    $(`#inventory`).fadeOut("fast");
                });
            }
            fixColumnClassFilled();

            $("#inventory .inventory_menu").hide();
            $("#inventory .item_name").hide();

            if (mp) {
                setCursor(enable);
                mp.trigger('setBlockControl', enable);
                mp.trigger("setInventoryActive", enable);
            }
        },
        active: () => {
            return $("#inventory").css("display") != "none";
        },
        enable: (enable) => {
            if (enable) {
                $(document).unbind('keydown', inventoryAPI.showHandler);
                $(document).keydown(inventoryAPI.showHandler);
            } else {
                inventoryAPI.show(false);
                $(document).unbind('keydown', inventoryAPI.showHandler);
            }
        },
        showHandler: (e) => {
            if (e.keyCode == 73) { // I
                inventoryAPI.show(!inventoryAPI.active());
            }
        },
        showItemMenu: (sqlId, left, top) => {
            var item = inventoryAPI.getItem(sqlId);
            if (!item) inventoryAPI.getVehItem(sqlId);
            if (!item) return;
            var menu = itemMenus[item.itemId];
            var itemMenuEl = $(`#inventory .inventory_menu`);
            $(`#inventory .inventory_menu`).empty();
            if (!menu) itemMenuEl.append(`<div class="menu-item">Todo</div>`);
            else {
                menu.forEach((menuItem) => {
                    var menuItemEl = $(`<div class="menu-item">${menuItem.text}</div>`);
                    menuItemEl.click((e) => {
                        menuItem.handler(sqlId);
                    });
                    itemMenuEl.append(menuItemEl);
                });
            }

            itemMenuEl.css("left", left);
            itemMenuEl.css("top", top);
            itemMenuEl.slideDown("fast");
        },
        mouseupHandler: (e) => {
            ////debug(`mouseupHandler`);
            $(`#inventory .inventory_menu`).hide();
            $(`#console .report_menu`).hide();
            if (draggingItemEl) {
                var itemsEl = $(freeColumnEl).parents(".items");
                var containerSqlId = itemsEl.data("sqlid");
                var rows = itemsEl.data("rows");
                var cols = itemsEl.data("cols");

                var item = inventoryAPI.getItem(draggingItemEl.data("sqlid"));
                if (!item) item = vehicleInventory[draggingItemEl.data("sqlid")];
                /* Перетащили на основной инвентарь. */
                if (!itemsEl.data("sqlid") && !itemsEl.data("type")) {
                    // alert("move to main items!")
                    if (e && mainItemIds[$(e.target).data("index")] == item.itemId) freeColumnEl = $(e.target);
                    freeColumnEl.css("border-color", "#9fa0a1");
                    //freeColumnEl.css("background", "");
                    if (!item.inVehicle) freeColumnEl.append(draggingItemEl);
                    var size = 4;
                    if (freeColumnEl.hasClass("center")) size = 7;
                    draggingItemEl.css("height", size + "vh");
                    draggingItemEl.css("width", size + "vh");

                    draggingItemEl.css("pointer-events", "");
                    draggingItemEl.css("position", "static");
                    $(document).off("mousemove");

                    if (item.inVehicle) {
                        inventoryAPI.vehDelete(draggingItemEl.data("sqlid"));
                    } else {
                        var parentItem = inventoryAPI.getItem(item.parentId);
                        if (parentItem) delete parentItem.items[draggingItemEl.data("sqlid")];
                        delete item.parentId;
                        item.index = freeColumnEl.data("index");
                        playerInventory[draggingItemEl.data("sqlid")] = item;
                    }


                    if (isContainerItem(item)) {
                        var containerEl = initContainerEl(draggingItemEl.data("sqlid"), item);
                        var itemsEl = containerEl.find(".items");
                        for (var key in item.items) {
                            fillColumn(key, item.items[key], itemsEl);
                        }
                        containerEl.slideDown("fast", () => {
                            containerEl.parent().find(".items").hide();
                            containerEl.parent().find(".items").show();
                        });
                    }

                    var sqlId = draggingItemEl.data("sqlid");

                    draggingItemEl = null;
                    freeColumnEl = null;

                    if (mp) {
                        mp.trigger("events.callRemote", "item.updatePos", JSON.stringify([sqlId, -1, item.index, item.inVehicle]));
                    }
                    // alert(`qqq`)
                    return;
                }
                var oldItemsEl = draggingItemEl.parents(".items");
                /* Перетащили из основного инвентаря. */
                if (!oldItemsEl.data("sqlid") && !itemsEl.data("type")) {
                    //alert("move from main items!")
                    draggingItemEl.parent(".column").css("border-color", "#5c5c5d");
                    var item = inventoryAPI.getItem(draggingItemEl.data("sqlid"));
                    var info = clientStorage.inventoryItems[item.itemId - 1];
                    var size = Math.min(info.height, info.width) * 3;
                    draggingItemEl.css("height", size + "vh");
                    draggingItemEl.css("width", size + "vh");

                    /* Перенесли в Trunk атво. */
                    if (itemsEl.data("type") == "boot") {

                    } else {
                        item.parentId = parseInt(itemsEl.data("sqlid"));
                        var parentItem = inventoryAPI.getItem(item.parentId);
                        if (parentItem) parentItem.items[draggingItemEl.data("sqlid")] = item;
                        delete playerInventory[draggingItemEl.data("sqlid")];
                    }

                    var ids = [7, 8, 13];
                    var index = ids.indexOf(item.itemId);
                    if (index != -1) {
                        $("#inventory .right-block .container").eq(index).slideUp("fast", () => {
                            $("#inventory .right-block .container .items").hide();
                            $("#inventory .right-block .container .items").show();
                        });
                    }
                }


                var h = draggingItemEl.data("height");
                var w = draggingItemEl.data("width");

                var columnsEl = freeColumnEl.parent().children(".column");
                var itemColumnsEl = [];
                for (var i = 0; i < h; i++) {
                    for (var j = 0; j < w; j++) {
                        itemColumnsEl.push(columnsEl.eq(freeColumnEl.index() + j + i * cols));
                    }
                }

                freeColumnEl.css("background", "");
                freeColumnEl.addClass("filled");
                freeColumnEl.append(draggingItemEl);

                var coord = indexToXY(rows, cols, freeColumnEl.index());
                freeColumnEl.css("grid-column-start", coord.x + 1);
                freeColumnEl.css("grid-column-end", `span ${w}`);
                freeColumnEl.css("grid-row-start", coord.y + 1);
                freeColumnEl.css("grid-row-end", `span ${h}`);
                for (var i = 1; i < itemColumnsEl.length; i++) {
                    itemColumnsEl[i].hide();
                }

                draggingItemEl.css("pointer-events", "");
                draggingItemEl.css("position", "static");
                $(document).off("mousemove");

                // alert(JSON.stringify(item))
                item.index = freeColumnEl.index();
                if (item.parentId > 0 && item.parentId != itemsEl.data("sqlid")) {
                    var oldParentItem = inventoryAPI.getItem(item.parentId);
                    if (oldParentItem) delete oldParentItem.items[draggingItemEl.data("sqlid")];
                    if (itemsEl.data("type") == "boot") {
                        // alert("move from one to boot container");
                    } else {
                        // alert("move from one to two container")
                        var newParentItem = inventoryAPI.getItem(itemsEl.data("sqlid"));
                        newParentItem.items[draggingItemEl.data("sqlid")] = item;
                        item.parentId = parseInt(itemsEl.data("sqlid"));
                    }
                } else if (item.inVehicle && playerInventory[itemsEl.data("sqlid")]) {
                    // alert("move from boot to two player container")
                    // alert(itemsEl.data("sqlid"))
                    delete vehicleInventory[draggingItemEl.data("sqlid")];
                    var newParentItem = inventoryAPI.getItem(itemsEl.data("sqlid"));
                    newParentItem.items[draggingItemEl.data("sqlid")] = item;
                    item.parentId = parseInt(itemsEl.data("sqlid"));
                }

                var index = mainItemIds.indexOf(item.itemId);
                if (index != -1) {
                    var columnEl = $(`#inventory .main .column[data-index="${index}"]`);
                    if (columnEl.is(":empty")) columnEl.css("border-color", "#5c5c5d");
                    else columnEl.css("border-color", "#9fa0a1");
                }

                // alert(`qq`)

                var sqlId = draggingItemEl.data("sqlid");
                if (mergeItemSqlId && draggingItemEl.data("sqlid") != mergeItemSqlId) {
                    if (canMergeItems(draggingItemEl.data("sqlid"), mergeItemSqlId)) {
                        mp.trigger(`events.callRemote`, `items.merge`, JSON.stringify([draggingItemEl.data("sqlid"), mergeItemSqlId]));
                        doItemsMerge(draggingItemEl.data("sqlid"), mergeItemSqlId);
                    }
                } else if (mp) {
                    if (item.inVehicle && itemsEl.data("type") && itemsEl.data("type") != "boot") inventoryAPI.vehDelete(sqlId);
                    if (itemsEl.data("type") == "boot" && !item.inVehicle) {
                        mp.trigger("events.callRemote", "item.updatePos", JSON.stringify([sqlId, -2, item.index, item.inVehicle]));
                    } else {
                        mp.trigger("events.callRemote", "item.updatePos", JSON.stringify([sqlId, item.parentId, item.index, item.inVehicle]));
                    }
                }
                draggingItemEl = null;
                freeColumnEl = null;
            }
        },
    };

    inventoryAPI.initHandlers(); //for test
    //inventoryAPI.enable(true); //for test

    var weaponAmmo = {
        "20": 37, //9mm
        "21": 38, //12mm
        "22": 40, //5.56mm
        "23": 39, //7.62mm
        "44": 37,
        "45": 37,
        "46": 37,
        "47": 37,
        "48": 37,
        "49": 38,
        "50": 39,
        "51": 40,
        "52": 39,
        "53": 39,
    };
    var drugsIds = [55, 56, 57, 58];

    function canMergeItems(itemSqlId, targetItemSqlId) {
        var item = inventoryAPI.getItem(itemSqlId);
        var targetItem = inventoryAPI.getItem(targetItemSqlId);
        if (!item || !targetItem) {
            if (vehicleInventory[itemSqlId] || vehicleInventory[targetItemSqlId]) return false;
            nError(`Client: One of the merge items could not be found!`);
            return false;
        }
        var can = (item.itemId == 4 && targetItem.itemId == 4) //деньги
            ||
            (item.params.ammo && !item.params.weaponHash && targetItem.params.ammo && !targetItem.params.weaponHash && item.itemId == targetItem.itemId) //патроны
            ||
            (item.params.ammo != null && !item.params.weaponHash && targetItem.params.weaponHash &&
                item.itemId == weaponAmmo[targetItem.itemId]) //патроны на пушку
            ||
            (item.itemId == targetItem.itemId && drugsIds.indexOf(item.itemId) != -1) // нарко на нарко
            ||
            (item.itemId == 62 && targetItem.itemId == 34 && targetItem.params.count < 20); // сигарета на пачку
        return can;
    }

    function doItemsMerge(itemSqlId, targetItemSqlId) {
        var item = inventoryAPI.getItem(itemSqlId);
        var targetItem = inventoryAPI.getItem(targetItemSqlId);
        if (!item || !targetItem) {
            nError(`Client: One of the merge items could not be found!`);
            return false;
        }
        if (item.itemId == 4 && targetItem.itemId == 4) {
            inventoryAPI.delete(itemSqlId);
            return true;
        }
        if (item.params.ammo && targetItem.params.ammo && item.itemId == targetItem.itemId) {
            inventoryAPI.delete(itemSqlId);
            return true;
        } else if (item.params.ammo != null && !item.params.weaponHash && targetItem.params.weaponHash &&
            item.itemId == weaponAmmo[targetItem.itemId]) {
            inventoryAPI.delete(itemSqlId);
            return true;
        } else if (item.itemId == targetItem.itemId && drugsIds.indexOf(item.itemId) != -1) {
            inventoryAPI.delete(itemSqlId);
            return true;
        } else if (item.itemId == 62 && targetItem.itemId == 34) {
            if (targetItem.params.count >= 20) {
                nError(`Full pack!`);
                return false;
            }
            inventoryAPI.delete(itemSqlId);
            return true;
        }

        return false;
    }

    function getWeightItemBySqlId(sqlId, items, weight = 0) {
        if (items[sqlId]) {
            weight += clientStorage.inventoryItems[items[sqlId].itemId - 1].weight;
            if (items[sqlId].items) {
                for (var key in items[sqlId].items) {
                    weight += getWeightItemBySqlId(key, items[sqlId].items, 0);
                }
            }
        } else {
            for (var key in items) {
                if (items[key].items) {
                    weight = getWeightItemBySqlId(sqlId, items[key].items, weight);
                }
            }
        }
        return weight;
    }

    function findItemBySqlId(sqlId, items) {
        //alert(`findItemBySqlId: ${JSON.stringify(items)}`);
        if (items[sqlId]) return items[sqlId];
        for (var key in items) {
            if (items[key].items) {
                var item = findItemBySqlId(sqlId, items[key].items);
                if (item) return item;
            }
        }
        return null;
    }

    var invItemNames = {
        3: (item) => { //armour
            var info = clientStorage.inventoryItems[item.itemId - 1];
            var name = info.name;
            if (item.params.faction) name += " " + getNameByFactionId(item.params.faction);
            return `${name} [${item.params.armour}%]`;
        },
        4: (item) => { //money
            var info = clientStorage.inventoryItems[item.itemId - 1];
            return `${info.name} ${item.params.count}$`;
        },
        5: (item) => { //VISA
            var info = clientStorage.inventoryItems[item.itemId - 1];
            return `${info.name} ${item.params.count}$`;
        },
        6: (item) => { //hat
            var info = clientStorage.inventoryItems[item.itemId - 1];
            if (item.params.faction) return `${info.name} ${getNameByFactionId(item.params.faction)}`;
            return info.name;
        },
        7: (item) => { //top
            var info = clientStorage.inventoryItems[item.itemId - 1];
            if (item.params.faction) return `${info.name} ${getNameByFactionId(item.params.faction)}`;
            return info.name;
        },
        8: (item) => { //legs
            var info = clientStorage.inventoryItems[item.itemId - 1];
            if (item.params.faction) return `${info.name} ${getNameByFactionId(item.params.faction)}`;
            return info.name;
        },
        9: (item) => { //feets
            var info = clientStorage.inventoryItems[item.itemId - 1];
            if (item.params.faction) return `${info.name} ${getNameByFactionId(item.params.faction)}`;
            return info.name;
        },
        24: (item) => { //аптечка
            var info = clientStorage.inventoryItems[item.itemId - 1];
            return `${info.name} [${item.params.count} ед.]`;
        },
        25: (item) => { //пластырь
            var info = clientStorage.inventoryItems[item.itemId - 1];
            return `${info.name} [${item.params.count} ед.]`;
        },
        29: (item) => { //удостоверение PD
            var info = clientStorage.inventoryItems[item.itemId - 1];
            return `${info.name} №${item.params.owner}`;
        },
        34: (item) => { //пачка сигарет
            var info = clientStorage.inventoryItems[item.itemId - 1];
            return `${info.name} [${item.params.count} units.]`;
        },
        36: (item) => { //канистра
            var info = clientStorage.inventoryItems[item.itemId - 1];
            return `${info.name} [${item.params.count}/${item.params.maxCount} л.]`;
        },
        37: (item) => { //патроны
            var info = clientStorage.inventoryItems[item.itemId - 1];
            return `${info.name} [${item.params.ammo} units.]`;
        },
        38: (item) => { //патроны
            var info = clientStorage.inventoryItems[item.itemId - 1];
            return `${info.name} [${item.params.ammo} units.]`;
        },
        39: (item) => { //патроны
            var info = clientStorage.inventoryItems[item.itemId - 1];
            return `${info.name} [${item.params.ammo} units.]`;
        },
        40: (item) => { //патроны
            var info = clientStorage.inventoryItems[item.itemId - 1];
            return `${info.name} [${item.params.ammo} units.]`;
        },
        54: (item) => { //ключи авто
            var info = clientStorage.inventoryItems[item.itemId - 1];
            return `${info.name} ${item.params.model}`;
        },
        55: (item) => { //нарко
            var info = clientStorage.inventoryItems[item.itemId - 1];
            return `${info.name} [${item.params.count} г.]`;
        },
        56: (item) => { //нарко
            var info = clientStorage.inventoryItems[item.itemId - 1];
            return `${info.name} [${item.params.count} г.]`;
        },
        57: (item) => { //нарко
            var info = clientStorage.inventoryItems[item.itemId - 1];
            return `${info.name} [${item.params.count} г.]`;
        },
        58: (item) => { //нарко
            var info = clientStorage.inventoryItems[item.itemId - 1];
            return `${info.name} [${item.params.count} г.]`;
        },
        59: (item) => { //ключи дома
            var info = clientStorage.inventoryItems[item.itemId - 1];
            return `${info.name} №${item.params.house}`;
        },
    };

    function getItemNameBySqlId(sqlId) {
        var item = inventoryAPI.getItem(sqlId);
        if (!item) item = vehicleInventory[sqlId];
        if (!item) return "Unknown";

        if (!invItemNames[item.itemId]) return clientStorage.inventoryItems[item.itemId - 1].name;
        return invItemNames[item.itemId](item);
    }

    function initHandlersItem(itemEl) {
        var moveHandler = (e) => {
            $(`#inventory .item_name`).css("left", e.pageX + itemEl.width() / 2);
            $(`#inventory .item_name`).css("top", e.pageY + itemEl.height() / 2);
        };

        itemEl.mousedown((e) => {
            if (e.which == 1) {
                draggingItemEl = $(e.target);
                freeColumnEl = draggingItemEl.parent(".column");

                freeColumnEl.removeClass("filled");
                resetColumnSize(freeColumnEl);

                hoverColumn(draggingItemEl, freeColumnEl);

                draggingItemEl.parents().parents().css("position", "");
                draggingItemEl.css("pointer-events", "none");
                draggingItemEl.css("position", "absolute");
                draggingItemEl.css("left", e.pageX - (draggingItemEl.width() / 2));
                draggingItemEl.css("top", e.pageY - (draggingItemEl.height() / 2));
                $(document).mousemove((e) => {
                    draggingItemEl.css("left", e.pageX - (draggingItemEl.width() / 2));
                    draggingItemEl.css("top", e.pageY - (draggingItemEl.height() / 2));
                });

                var item = inventoryAPI.getItem(draggingItemEl.data("sqlid"));
                if (!item) item = vehicleInventory[draggingItemEl.data("sqlid")];
                var index = mainItemIds.indexOf(item.itemId);
                if (index != -1) {
                    $(`#inventory .main .column[data-index="${index}"]`).css("border-color", "#196");
                    //if (!item.parentId || item.parentId == -1) $(`#inventory .main .column[data-index="${index}"]`).css("background", "#222");
                }
            }

        });
        itemEl.contextmenu((e) => {
            // if (!itemEl.parents(".items").data("sqlid")) return;
            inventoryAPI.showItemMenu(itemEl.data("sqlid"), e.pageX, e.pageY);
        });
        itemEl.mouseenter((e) => {
            if (isVisible(`#inventory .item_name`)) return;
            $(`#inventory .item_name`).html(getItemNameBySqlId(itemEl.data("sqlid")));
            $(`#inventory .item_name`).css("left", e.pageX + itemEl.width() / 2);
            $(`#inventory .item_name`).css("top", e.pageY + itemEl.height() / 2);
            $(`#inventory .item_name`).fadeIn("fast");
            itemEl.mousemove(moveHandler);
        });
        itemEl.mouseleave((e) => {
            clearTimeout(itemEl.timerId);
            $(`#inventory .item_name`).hide();
            itemEl.off("mousemove", moveHandler);
        });
    }

    /* Подсвет ячеек вовремя переноса предмета. */
    function hoverColumn(itemEl, columnEl, color = "#111") {
        //console.log(`hover`)
        var oldColumnIsMain = freeColumnEl.parents(".main").length > 0; //ячейка, из которой перетащили - главная
        if (oldColumnIsMain) return;
        var itemsEl = columnEl.parents(".items");
        var cols = itemsEl.data("cols");
        var columnsEl = itemsEl.find(".column");
        if (!cols) columnEl.css("background", "");

        for (var i = 0; i < itemEl.data("height"); i++) {
            for (var j = 0; j < itemEl.data("width"); j++) {
                columnsEl.eq(columnEl.index() + j + i * cols).css("background", color);
            }
        }

    }

    function resetColumnSize(columnEl) {
        if (isFreeColumn(columnEl)) return console.error(`Cannot reset empty cell size!`);
        if (columnEl.parents(".main").length > 0) return;
        var itemsEl = columnEl.parent(".items");
        var rows = itemsEl.data("rows");
        var cols = itemsEl.data("cols");
        var coord = indexToXY(rows, cols, columnEl.index());

        var h = parseInt(columnEl.css("grid-row-end").split(" ")[1]);
        var w = parseInt(columnEl.css("grid-column-end").split(" ")[1]);

        columnEl.css("grid-column-end", `span 1`);
        columnEl.css("grid-row-end", `span 1`);

        var columnsEl = itemsEl.find(".column");
        for (var i = 0; i < h; i++) {
            for (var j = 0; j < w; j++) {
                columnsEl.eq(columnEl.index() + j + i * cols).show();
            }
        }


        columnEl.css("grid-column-start", );
    }

    function fillColumn(sqlId, item, itemsEl) {
        var columnsEl = itemsEl.find(".column");
        var h = clientStorage.inventoryItems[item.itemId - 1].height;
        var w = clientStorage.inventoryItems[item.itemId - 1].width;
        var rows = itemsEl.data("rows");
        var cols = itemsEl.data("cols");

        var itemColumnsEl = [];
        for (var i = 0; i < h; i++) {
            for (var j = 0; j < w; j++) {
                itemColumnsEl.push(columnsEl.eq(item.index + j + i * cols));
            }
        }
        if (!isFreeColumn(itemColumnsEl[0])) return console.error(`The cell is already taken!`);
        var itemEl = createItemEl(sqlId, item);
        var coord = indexToXY(rows, cols, item.index);
        itemColumnsEl[0].addClass("filled");
        itemColumnsEl[0].append(itemEl);
        itemColumnsEl[0].css("grid-column-start", coord.x + 1);
        itemColumnsEl[0].css("grid-column-end", `span ${w}`);
        itemColumnsEl[0].css("grid-row-start", coord.y + 1);
        itemColumnsEl[0].css("grid-row-end", `span ${h}`);
        for (var i = 1; i < itemColumnsEl.length; i++) {
            itemColumnsEl[i].hide();
        }

        //var columnEl = columnsEl.eq(item.index);
    }

    function isFreeColumn(columnEl) {
        mergeItemSqlId = columnEl.find(".item").data("sqlid");
        return isVisible(columnEl) && columnEl.is(":empty");
    }

    function initContainerEl(sqlId, item) {
        var ids = [7, 8, 13];
        if (!isContainerItem(item)) return null;
        var el = $(`#inventory .right-block .container`).eq(ids.indexOf(item.itemId));
        var items = el.find(".items");
        items.css("grid-template-columns", `repeat(${item.params.cols}, 1fr)`);
        items.css("grid-template-rows", `repeat(${item.params.rows}, 1fr)`);
        items.css("height", item.params.rows * 4 + "vh");
        items.css("width", item.params.cols * 4 + "vh");
        items.data("sqlid", sqlId);
        items.attr("data-rows", item.params.rows);
        items.attr("data-cols", item.params.cols);
        items.empty();
        var count = item.params.rows * item.params.cols;
        for (var i = 0; i < count; i++) {
            var columnEl = $(`<div class="column"></div>`);
            columnEl.mouseenter((e) => {
                if (draggingItemEl) {
                    var containerEl = $(e.target).parents(".container");
                    /* Перетащили из основного инвентаря. */
                    var itemsEl = $(e.target).parents(".items");
                    var item = inventoryAPI.getItem(draggingItemEl.data("sqlid"));
                    if (itemsEl.data("type") != "boot") {
                        if (!draggingItemEl.parents(".items").data("sqlid")) {
                            var itemId = draggingItemEl.parent(".column").data("index");
                            var indexes = [6, 7, 12];
                            var index = indexes.indexOf(itemId);
                            if (index != -1 && containerEl.index() == index) return;
                        }
                        if (!item) item = vehicleInventory[draggingItemEl.data("sqlid")];
                        if (blackList[containerEl.index()].indexOf(item.itemId) != -1) return;
                    }

                    var rows = itemsEl.data("rows");
                    var cols = itemsEl.data("cols");
                    var h = draggingItemEl.data("height");
                    var w = draggingItemEl.data("width");

                    var row = Math.clamp(indexToXY(rows, cols, $(e.target).index()).y, 0, rows - h);
                    var col = Math.clamp(indexToXY(rows, cols, $(e.target).index()).x, 0, cols - w);


                    /*console.log(`col: ${col}`);
                    console.log(`row: ${row}`);
                    console.log(`cols: ${cols}`);
                    console.log(`rows: ${rows}`);*/

                    var columnEl = $(e.target).parent().children(`.column`).eq(col + row * cols);

                    for (var i = 0; i < draggingItemEl.data("height"); i++) {
                        for (var j = 0; j < draggingItemEl.data("width"); j++) {
                            //console.log("index: "+ (col + j + (row + i)*cols));
                            var column = $(e.target).parent().children(`.column`).eq(col + j + (row + i) * cols);
                            if (column.find(".item").data("sqlid") == draggingItemEl.data("sqlid")) continue;
                            if (!isFreeColumn(column)) return;
                        }
                    }

                    hoverColumn(draggingItemEl, freeColumnEl, "#222");
                    freeColumnEl = columnEl;
                    hoverColumn(draggingItemEl, freeColumnEl, "#111");
                }
            });
            items.append(columnEl);
        }
        //debug(`clientStorage: ${JSON.stringify(clientStorage)}`);
        var info = clientStorage.inventoryItems[item.itemId - 1];
        el.find(".header .type").text(`"${info.name}"`);
        el.find(".header .name").text(item.params.name || "Standard");

        return el;
    }

    /* Иниц. контейнера для Trunkа авто. */
    function initVehicleContainerEl(items, veh, rows, cols) {
        console.log(`initVehicleContainerEl`);
        if (!veh.name || !veh.sqlId || !rows || !cols) return null;
        var el = $(`#inventory .left-block .container`).eq(0); // 0 - для Trunkа авто
        var items = el.find(".items");
        items.css("grid-template-columns", `repeat(${cols}, 1fr)`);
        items.css("grid-template-rows", `repeat(${rows}, 1fr)`);
        items.css("height", rows * 4 + "vh");
        items.css("width", cols * 4 + "vh");
        items.css("left", 40 - cols * 4 + "vh");
        items.data("sqlid", veh.sqlId);
        items.attr("data-rows", rows);
        items.attr("data-cols", cols);
        items.empty();
        var count = rows * cols;
        for (var i = 0; i < count; i++) {
            var columnEl = $(`<div class="column"></div>`);
            columnEl.mouseenter((e) => {
                if (draggingItemEl) {
                    var containerEl = $(e.target).parents(".container");
                    var item = inventoryAPI.getItem(draggingItemEl.data("sqlid"));
                    if (!item) item = inventoryAPI.getVehItem(draggingItemEl.data("sqlid"));
                    var itemsEl = $(e.target).parents(".items");
                    if (itemsEl.data("type") == "boot") {
                        if (item.items && Object.keys(item.items).length > 0) return nError(`Release pockets!`);
                    } else {
                        /* Перетащили из основного инвентаря. */
                        if (!draggingItemEl.parents(".items").data("sqlid")) {
                            var itemId = draggingItemEl.parent(".column").data("index");
                            var indexes = [6, 7, 12];
                            var index = indexes.indexOf(itemId);
                            if (index != -1 && containerEl.index() == index) return;
                        }
                    }
                    // if (blackList[containerEl.index()].indexOf(item.itemId) != -1) return;

                    var rows = itemsEl.data("rows");
                    var cols = itemsEl.data("cols");
                    var h = draggingItemEl.data("height");
                    var w = draggingItemEl.data("width");

                    var row = Math.clamp(indexToXY(rows, cols, $(e.target).index()).y, 0, rows - h);
                    var col = Math.clamp(indexToXY(rows, cols, $(e.target).index()).x, 0, cols - w);


                    /*console.log(`col: ${col}`);
                    console.log(`row: ${row}`);
                    console.log(`cols: ${cols}`);
                    console.log(`rows: ${rows}`);*/

                    var columnEl = $(e.target).parent().children(`.column`).eq(col + row * cols);

                    for (var i = 0; i < draggingItemEl.data("height"); i++) {
                        for (var j = 0; j < draggingItemEl.data("width"); j++) {
                            //console.log("index: "+ (col + j + (row + i)*cols));
                            var column = $(e.target).parent().children(`.column`).eq(col + j + (row + i) * cols);
                            if (column.find(".item").data("sqlid") == draggingItemEl.data("sqlid")) continue;
                            if (!isFreeColumn(column)) return;
                        }
                    }

                    hoverColumn(draggingItemEl, freeColumnEl, "#222");
                    freeColumnEl = columnEl;
                    hoverColumn(draggingItemEl, freeColumnEl, "#111");
                }
            });
            items.append(columnEl);
        }
        el.find(".header .type").text(`"Trunk"`);
        el.find(".header .name").text(veh.name || "Vehicle");

        return el;
    }

    function createItemEl(sqlId, item) {
        var info = clientStorage.inventoryItems[item.itemId - 1];
        if (!info) return null;
        var el = $(`<div class="item" data-sqlid='${sqlId}'></div>`);
        el.attr("data-height", info.height);
        el.attr("data-width", info.width);
        el.css("background-image", `url('img/items/${item.itemId}.png')`);
        if (!isDefaultColumn(item) || vehicleInventory[sqlId]) {
            var size = Math.min(info.height, info.width) * 3;
            el.css("height", size + "vh");
            el.css("width", size + "vh");
        } else if (item.index == 6 || item.index == 7) {
            el.css("height", "7vh");
            el.css("width", "7vh");
        }
        initHandlersItem(el);

        return el;
    }

    /* Предмет-контейнер - куртка, брюки, рюкзак. */
    function isContainerItem(item) {
        var ids = [7, 8, 13];
        return ids.indexOf(item.itemId) != -1;
    }

    /* Дефолтная ячейка - та, что по центру инвентаря. */
    function isDefaultColumn(item) {
        return item.index >= 0 && item.index <= 13 && (item.parentId == -1 || !item.parentId);
    }

    function indexToXY(rows, cols, index) {
        if (!rows || !cols) return null;
        var x = index % cols;
        var y = (index - x) / cols;
        if (x >= cols || y >= rows) return null;
        return {
            x: x,
            y: y
        };
    }

    function xyToIndex(rows, cols, coord) {
        //debug(`xyToIndex: ${rows} ${cols} ${JSON.stringify(coord)}`)
        if (!rows || !cols) return -1;
        return coord.y * cols + coord.x;
    }

    /* Иногда класс .filled ячейке почему-то не добавляется. Это фикс. */
    function fixColumnClassFilled() {
        $(`#inventory .column`).each((index, el) => {
            if ($(el).find(".item").length > 0 /* && !$(el).hasClass("filled")*/ ) {
                $(el).addClass("filled");
            }
        });
    }

});
