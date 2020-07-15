$(document).ready(() => {
    var playerItems = [{
            text: "Shake hands",
            icon: "handshake.png"
        },
        {
            text: "Exchange",
            icon: "trade.png"
        },
        {
            text: "Show documents",
            icon: "card.png"
        },
    ];
    var vehicleItems = [{
        text: "Fill up"
    }, ];

    window.interactionMenuAPI = {
        showPlayerMenu: (data = null) => {
            data = JSON.parse(data);
            $("#interactionMenu").empty();
            for (var i = 0; i < playerItems.length; i++) {
                var info = playerItems[i];
                var iconName = (info.icon) ? info.icon : "default.png";
                var itemEl = $(`<div class="interaction_item"><div class="icon"><img src="img/interactionMenu/${iconName}"/>
                    </div><div class="text">${info.text}</div></div>
                `);
                $("#interactionMenu").append(itemEl);
            }
            addictivePlayerItems(data);
            slideItems();
            initPlayerItemsHandler();

            $("#interactionMenu").fadeIn("fast");
        },
        showVehicleMenu: (data = null) => {
            data = JSON.parse(data);
            $("#interactionMenu").empty();
            for (var i = 0; i < vehicleItems.length; i++) {
                var info = vehicleItems[i];
                var iconName = (info.icon) ? info.icon : "default.png";
                var itemEl = $(`<div class="interaction_item"><div class="icon"><img src="img/interactionMenu/${iconName}"/>
                    </div><div class="text">${info.text}</div></div>
                `);
                $("#interactionMenu").append(itemEl);
            }
            addictiveVehicleItems(data);
            slideItems();
            initVehicleItemsHandler();

            $("#interactionMenu").fadeIn("fast");
        },
        addItem: (iconName, text) => {
            var itemEl = $(`<div class="interaction_item"><div class="icon"><img src="img/interactionMenu/${iconName}"/>
                 </div><div class="text">${text}</div></div>
             `);
            $("#interactionMenu").append(itemEl);
        },
        addBeforeItem: (iconName, text) => {
            var itemEl = $(`<div class="interaction_item"><div class="icon"><img src="img/interactionMenu/${iconName}"/>
                 </div><div class="text">${text}</div></div>
             `);
            $("#interactionMenu").prepend(itemEl);
        },
        active: () => {
            return $("#interactionMenu").css("display") != "none";
        },
        clear: () => {
             $("#interactionMenu").empty();
        },
        hide: () => {
            $("#interactionMenu").fadeOut("fast");
            lastAction = null;
        },
        move: (x, y) => {
            //debug(`interactionMenuAPI.move: ${x} ${y}`)
            $("#interactionMenu").css("left", x + "%");
            $("#interactionMenu").css("top", y + "%");
        },
    };

    /* for tests */
    //interactionMenuAPI.showVehicleMenu();
});

var lastAction;

/* That menu items were not flush from the left edge. */
function slideItems() {
    var itemsCount = $("#interactionMenu .interaction_item").length;
    var slidePx = 10;
    for (var i = 0; i < parseInt((itemsCount - 1) / 2); i++) {
        var itemElA = $($("#interactionMenu .interaction_item")[1 + i]);
        var itemElB = $($("#interactionMenu .interaction_item")[itemsCount - i - 2]);
        itemElA.css("margin-left", slidePx + "px");
        itemElB.css("margin-left", slidePx + "px");
        slidePx += 10;
    }
}

/* Add / remove items, depending on the data. */
function addictivePlayerItems(data) {
    if (!data) data = {};
    if (data.action == "showDocuments") {
        $("#interactionMenu").empty();
        var items = [{
                text: "Passport",
                icon: "card.png"
            },
            {
                text: "Licenses",
                icon: "card.png"
            },
            {
                text: "Weapon Licenses",
                icon: "card.png"
            },
            {
                text: "Job",
                icon: "card.png"
            },
        ];
        var factions = [2, 3, 4, 5, 6, 7]; // organizations with certificates
        if (factions.indexOf(clientStorage.faction) != -1) items.push({
            text: "Certificate",
            icon: "card.png"
        });
        for (var i = 0; i < items.length; i++) {
            var info = items[i];
            var iconName = (info.icon) ? info.icon : "default.png";
            interactionMenuAPI.addItem(iconName, info.text);
        }
    } else if (data.action == "showLeader") {
        $("#interactionMenu").empty();
        var items = [{
                text: "Faction",
                icon: "default.png"
            },
            {
                text: "Promote",
                icon: "default.png"
            },
            {
                text: "Demote",
                icon: "default.png"
            },
            {
                text: "Dismiss Faction",
                icon: "default.png"
            },
        ];
        for (var i = 0; i < items.length; i++) {
            var info = items[i];
            var iconName = (info.icon) ? info.icon : "default.png";
            interactionMenuAPI.addItem(iconName, info.text);
        }
    } else if (data.action == "showFaction") {
        $("#interactionMenu").empty();
        var list = {
            '1': [{
                text: "todo",
                icon: "default.png"
            }, ],
            '2': [{
                    text: "Handcuffs",
                    icon: "default.png"
                },
                {
                    text: "Search",
                    icon: "default.png"
                },
                {
                    text: "Follow",
                    icon: "default.png"
                },
                {
                    text: "Put in the car",
                    icon: "default.png"
                },
                {
                    text: "Arrest",
                    icon: "default.png"
                },
                {
                    text: "Fine",
                    icon: "default.png"
                },
            ],
            '3': [{
                    text: "Handcuffs",
                    icon: "default.png"
                },
                {
                    text: "Search",
                    icon: "default.png"
                },
                {
                    text: "Lead",
                    icon: "default.png"
                },
                {
                    text: "Put in the car",
                    icon: "default.png"
                },
                {
                    text: "Arrest",
                    icon: "default.png"
                },
                {
                    text: "Fine",
                    icon: "default.png"
                },
            ],
            '4': [{
                    text: "Handcuffs",
                    icon: "default.png"
                },
                {
                    text: "Search",
                    icon: "default.png"
                },
                {
                    text: "Lead",
                    icon: "default.png"
                },
                {
                    text: "Put in the car",
                    icon: "default.png"
                },
                {
                    text: "Arrest",
                    icon: "default.png"
                },
                // {
                //     text: "Прикрепить жучок",
                //     icon: "default.png"
                // },
                // {
                //     text: "Обыскать",
                //     icon: "default.png"
                // },
            ],
            '5': [{
                    text: "Cure",
                    icon: "default.png"
                },
                {
                    text: "Show ID",
                    icon: "default.png"
                }
            ],
            '6': [{
                text: "todo",
                icon: "default.png"
            }, ],
            '7': [{
                text: "todo",
                icon: "default.png"
            }, ],
            '8': [{
                text: "todo",
                icon: "default.png"
            }, ],
            '9': [{
                text: "todo",
                icon: "default.png"
            }, ],
            '10': [{
                text: "todo",
                icon: "default.png"
            }, ],
            '11': [{
                text: "todo",
                icon: "default.png"
            }, ],
            '12': [{
                text: "todo",
                icon: "default.png"
            }, ],
            '13': [{
                text: "todo",
                icon: "default.png"
            }, ],
            '14': [{
                text: "todo",
                icon: "default.png"
            }, ],
            '15': [{
                text: "todo",
                icon: "default.png"
            }, ],
            '16': [{
                text: "todo",
                icon: "default.png"
            }, ],
            '17': [{
                text: "todo",
                icon: "default.png"
            }, ],
        };
        if (list[clientStorage.faction]) {
            var items = list[clientStorage.faction];
            for (var i = 0; i < items.length; i++) {
                var info = items[i];
                var iconName = (info.icon) ? info.icon : "default.png";
                interactionMenuAPI.addItem(iconName, info.text);
            }
        }
    } else if (data.action == "showLocal") {
        $("#interactionMenu").empty();
        var items = [{
                text: "Emotions",
                icon: "default.png"
            },
            {
                text: "Gait",
                icon: "default.png"
            },
            {
                text: "Animations",
                icon: "default.png"
            },
        ];
        for (var i = 0; i < items.length; i++) {
            var info = items[i];
            var iconName = (info.icon) ? info.icon : "default.png";
            interactionMenuAPI.addItem(iconName, info.text);
        }
    } else if (data.action == "showEmotions") {
        $("#interactionMenu").empty();
        var items = [{
                text: "Usual",
                icon: "default.png"
            },
            {
                text: "Sullen",
                icon: "default.png"
            },
            {
                text: "Angry",
                icon: "default.png"
            },
            {
                text: "Happy",
                icon: "default.png"
            },
            {
                text: "Stress",
                icon: "default.png"
            },
            {
                text: "Sulky",
                icon: "default.png"
            },
        ];
        for (var i = 0; i < items.length; i++) {
            var info = items[i];
            var iconName = (info.icon) ? info.icon : "default.png";
            interactionMenuAPI.addItem(iconName, info.text);
        }
    } else if (data.action == "showWalking") {
        $("#interactionMenu").empty();
        var items = [{
                text: "Normal",
                icon: "default.png"
            },
            {
                text: "Brave",
                icon: "default.png"
            },
            {
                text: "Confident",
                icon: "default.png"
            },
            {
                text: "Gangster",
                icon: "default.png"
            },
            {
                text: "Quick",
                icon: "default.png"
            },
            {
                text: "Sad",
                icon: "default.png"
            },
            {
                text: "Winged",
                icon: "default.png"
            },
        ];
        for (var i = 0; i < items.length; i++) {
            var info = items[i];
            var iconName = (info.icon) ? info.icon : "default.png";
            interactionMenuAPI.addItem(iconName, info.text);
        }
    } else if (data.action == "showAnimations") {
        $("#interactionMenu").empty();

        var list = {
            '-1': [{
                    text: "Gestures",
                    icon: "default.png"
                },
                {
                    text: "Sport",
                    icon: "default.png"
                },
                {
                    text: "Lying",
                    icon: "default.png"
                },
                {
                    text: "Sitting",
                    icon: "default.png"
                },
                {
                    text: "Scared",
                    icon: "default.png"
                },
                {
                    text: "Dance",
                    icon: "default.png"
                },
                {
                    text: "Smoking",
                    icon: "default.png"
                },
            ],
            '0': [{
                    text: "Shows the fact",
                    icon: "default.png"
                },
                {
                    text: "Rock two hands",
                    icon: "default.png"
                },
                {
                    text: "Rock with one hand",
                    icon: "default.png"
                },
                {
                    text: "Two fingers",
                    icon: "default.png"
                },
                {
                    text: "Stormy applause",
                    icon: "default.png"
                },
                {
                    text: "Handjob animation",
                    icon: "default.png"
                },
            ],
            '1': [{
                    text: "Pull ups",
                    icon: "default.png"
                },
                {
                    text: "Barbell lying down",
                    icon: "default.png"
                },
                {
                    text: "Standing barbell",
                    icon: "default.png"
                },
                {
                    text: "Push ups",
                    icon: "default.png"
                },
                {
                    text: "Shakes the press",
                    icon: "default.png"
                },
            ],
            '2': [{
                    text: "Sleeps",
                    icon: "default.png"
                },
                {
                    text: "Sleeps having disorganized hands",
                    icon: "default.png"
                },
                {
                    text: "Sleeps having contracted in a ball",
                    icon: "default.png"
                },
            ],
            '3': [{
                    text: "Twisted into a ball",
                    icon: "default.png"
                },
                {
                    text: "Sits examining something",
                    icon: "default.png"
                },
                {
                    text: "Sits with a glass and drinks",
                    icon: "default.png"
                },
                {
                    text: "Sits freely apart legs",
                    icon: "default.png"
                },
                {
                    text: "Sits hand on hand",
                    icon: "default.png"
                },
            ],
            '4': [{
                    text: "Standing hands closed",
                    icon: "default.png"
                },
                {
                    text: "Closed by hands and osm.",
                    icon: "default.png"
                },
                {
                    text: "Bent over closes hands",
                    icon: "default.png"
                },
                {
                    text: "Bent over osm. on both sides",
                    icon: "default.png"
                },
                {
                    text: "Shrinks into a ball",
                    icon: "default.png"
                },
                {
                    text: "Sitting hands closed osm.",
                    icon: "default.png"
                },
                {
                    text: "Looking around and shaking",
                    icon: "default.png"
                },
                {
                    text: "Sitting on the cards with fists closed",
                    icon: "default.png"
                },
                {
                    text: "Sitting on the cards scared angry",
                    icon: "default.png"
                },
            ],
            '5': [{
                    text: "Shaking hands",
                    icon: "default.png"
                },
                {
                    text: "Leaned on the wall",
                    icon: "default.png"
                },
                {
                    text: "Dancing shaking pelvis",
                    icon: "default.png"
                },
            ],
            '6': [{
                    text: "Picks up a cigarette",
                    icon: "default.png"
                },
            ],
        };

        if (list[data.index]) {
            var items = list[data.index];
            for (var i = 0; i < items.length; i++) {
                var info = items[i];
                var iconName = (info.icon) ? info.icon : "default.png";
                interactionMenuAPI.addItem(iconName, info.text);
            }
        }
    } else {
        if (clientStorage.faction > 0) {
            interactionMenuAPI.addItem("default.png", "Faction");
        }
        if (clientStorage.factionRank >= clientStorage.factionLastRank) {
            interactionMenuAPI.addItem("default.png", "Leader");
        }
        if (clientStorage.trashLeader === 1) {
            interactionMenuAPI.addItem("default.png", "Invite in crew");
        }
        if (clientStorage.trashLeader === 2) {
            interactionMenuAPI.addItem("default.png", "Dismiss from crew");
        }
        if (clientStorage.gopostalLeader === 1) {
            interactionMenuAPI.addItem("default.png", "Invite in group");
        }
        if (clientStorage.gopostalLeader === 2) {
            interactionMenuAPI.addItem("default.png", "Dismiss from group");
        }
        if (data.showTransferProducts) {
            interactionMenuAPI.addItem("default.png", "Transfer Products");
        }
    }
}

/* Добавляем/удаляем пункты, в зависимости от данных. */
function addictiveVehicleItems(data) {
    if (!data) data = {};
    //debug(`data: ${JSON.stringify(data)}`)
    if (data.action == "showFaction") {
        $("#interactionMenu").empty();
        var list = {
            '1': [{
                text: "todo",
                icon: "default.png"
            }, ],
            '2': [{
                    text: "Open",
                    icon: "default.png"
                },
                {
                    text: "Push out",
                    icon: "default.png"
                },
            ],
            '3': [{
                    text: "Open",
                    icon: "default.png"
                },
                {
                    text: "Push out",
                    icon: "default.png"
                },
            ],
            '4': [{
                text: "todo",
                icon: "default.png"
            }, ],
            '5': [{
                text: "todo",
                icon: "default.png"
            }, ],
            '6': [{
                text: "todo",
                icon: "default.png"
            }, ],
            '7': [{
                text: "todo",
                icon: "default.png"
            }, ],
            '8': [{
                text: "todo",
                icon: "default.png"
            }, ],
            '9': [{
                text: "todo",
                icon: "default.png"
            }, ],
            '10': [{
                text: "todo",
                icon: "default.png"
            }, ],
            '11': [{
                text: "todo",
                icon: "default.png"
            }, ],
            '12': [{
                text: "todo",
                icon: "default.png"
            }, ],
            '13': [{
                text: "todo",
                icon: "default.png"
            }, ],
            '14': [{
                text: "todo",
                icon: "default.png"
            }, ],
            '15': [{
                text: "todo",
                icon: "default.png"
            }, ],
            '16': [{
                text: "todo",
                icon: "default.png"
            }, ],
            '17': [{
                text: "todo",
                icon: "default.png"
            }, ],
        };
        if (list[clientStorage.faction]) {
            var items = list[clientStorage.faction];
            for (var i = 0; i < items.length; i++) {
                var info = items[i];
                var iconName = (info.icon) ? info.icon : "default.png";
                interactionMenuAPI.addItem(iconName, info.text);
            }
        }
    } else if (data.action == "removeFromVehicle") {
        $("#interactionMenu").empty();
        for (var i = 0; i < data.names.length; i++) {
            var name = data.names[i];
            var iconName = "default.png";
            interactionMenuAPI.addItem(iconName, name);
        }
        lastAction = "removeFromVehicle";
    } else if (clientStorage.faction > 0) {
        interactionMenuAPI.addItem("default.png", "Faction");
    }

    if (data.action == "showDoors") {
        interactionMenuAPI.addBeforeItem("default.png", "Doors");
    } else if (data.action == "showHood") {
        interactionMenuAPI.addBeforeItem("default.png", "Hood");
    } else if (data.action == "showBoot") {
        interactionMenuAPI.addBeforeItem("default.png", "UTH Change");
        if (data.showProducts) interactionMenuAPI.addItem("default.png", "Product");
    } else if (data.action == "showEnter") {
        $("#interactionMenu").empty();
        interactionMenuAPI.addItem("default.png", "Throw out of transport");
        interactionMenuAPI.addItem("default.png", "Open / Close transport");
        // interactionMenuAPI.addItem("default.png", "Открыть/Закрыть Hood");
        // interactionMenuAPI.addItem("default.png", "Открыть/Закрыть Sullenажник");
    }
}

/* Установка обработчиков на пункты меню взаимодействия с игроком. */
function initPlayerItemsHandler() {
    $("#interactionMenu .interaction_item").each((index, el) => {
        $(el).click((e) => {
            onClickPlayerItem($(el).find(".text").text());
        });
    });
}

/* Установка обработчиков на пункты меню взаимодействия с авто. */
function initVehicleItemsHandler() {
    $("#interactionMenu .interaction_item").each((index, el) => {
        $(el).click((e) => {
            onClickVehicleItem($(el).find(".text").text());
        });
    });
}

/* Вызывается при клике на меню взаимодействия с игроком. */
function onClickPlayerItem(itemName) {
    //console.log(`onClickPlayerItem: ${itemName}`);
    if (itemName == "Show documents") {
        interactionMenuAPI.showPlayerMenu(JSON.stringify({
            action: "showDocuments"
        }));
        return;
    } else if (itemName == "Leader") {
        interactionMenuAPI.showPlayerMenu(JSON.stringify({
            action: "showLeader"
        }));
        return;
    } else if (itemName == "Faction") {
        interactionMenuAPI.showPlayerMenu(JSON.stringify({
            action: "showFaction"
        }));
        return;
    } else if (itemName == "Emotions") {
        interactionMenuAPI.showPlayerMenu(JSON.stringify({
            action: "showEmotions"
        }));
        return;
    } else if (itemName == "Gait") {
        interactionMenuAPI.showPlayerMenu(JSON.stringify({
            action: "showWalking"
        }));
        return;
    } else if (itemName == "Animations") {
        interactionMenuAPI.showPlayerMenu(JSON.stringify({
            action: "showAnimations",
            index: -1
        }));
        return;
    } else if (itemName == "Gestures") {
        interactionMenuAPI.showPlayerMenu(JSON.stringify({
            action: "showAnimations",
            index: 0
        }));
        return;
    } else if (itemName == "Sport") {
        interactionMenuAPI.showPlayerMenu(JSON.stringify({
            action: "showAnimations",
            index: 1
        }));
        return;
    } else if (itemName == "Lying") {
        interactionMenuAPI.showPlayerMenu(JSON.stringify({
            action: "showAnimations",
            index: 2
        }));
        return;
    } else if (itemName == "Sitting") {
        interactionMenuAPI.showPlayerMenu(JSON.stringify({
            action: "showAnimations",
            index: 3
        }));
        return;
    } else if (itemName == "Scared") {
        interactionMenuAPI.showPlayerMenu(JSON.stringify({
            action: "showAnimations",
            index: 4
        }));
        return;
    } else if (itemName == "Dance") {
        interactionMenuAPI.showPlayerMenu(JSON.stringify({
            action: "showAnimations",
            index: 5
        }));
        return;
    } else if (itemName == "Smoking") {
        interactionMenuAPI.showPlayerMenu(JSON.stringify({
            action: "showAnimations",
            index: 6
        }));
        return;
    }

    mp.trigger(`interactionMenu.onClickPlayerItem`, itemName);
}

/* Вызывается при клике на меню взаимодействия с авто. */
function onClickVehicleItem(itemName) {
    //console.log(`onClickVehicleItem: ${itemName}`);
    if (itemName == "Faction") {
        interactionMenuAPI.showVehicleMenu(JSON.stringify({
            action: "showFaction"
        }));
        return;
    } else if (lastAction == "removeFromVehicle") {
        mp.trigger(`events.callRemote`, `removeFromVehicle`, itemName);
        interactionMenuAPI.hide();
    }
    mp.trigger(`interactionMenu.onClickVehicleItem`, itemName);
}
