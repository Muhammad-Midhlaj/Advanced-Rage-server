$(document).ready(() => {
    window.currentChoiceMenu;
    var menus = {
        "accept_sell_biz": {
            text: "Carter Slade invite you to buy business 'Snack Bar' for 10000$.",
            on: (values) => {
                menus["accept_sell_biz"].text = `${values.owner} invite you to buy business '${values.type}' for ${values.price}$.`;
            },
            yes: () => {
                mp.trigger("events.callRemote", "biz.sell.accept");
            },
            no: () => {
                mp.trigger("events.callRemote", "biz.sell.cancel");
            },
        },
        "accept_trade": {
            text: "Carter Slade wants to bargain with you.",
            on: (values) => {
                menus["accept_trade"].text = `${values.name} wants to bargain with you.`;
            },
            yes: () => {
                mp.trigger("events.callRemote", "trade.offer.agree");
            },
            no: () => {
                mp.trigger("events.callRemote", "trade.offer.cancel");
            },
        },
        "accept_invite": {
            text: "Carter Slade invites you to enter the Government.",
            on: (values) => {
                menus["accept_invite"].text = `${values.name} invites you to join ${values.faction}.`;
            },
            yes: () => {
                mp.trigger("events.callRemote", "factions.offer.agree");
            },
            no: () => {
                mp.trigger("events.callRemote", "factions.offer.cancel");
            },
        },
        "accept_health": {
            text: "Carter Slade offers you a treatment for 9999$.",
            on: (values) => {
                menus["accept_health"].text = `${values.name} offers you a treatment for ${values.price}$.`;
            },
            yes: () => {
                mp.trigger("events.callRemote", "hospital.health.agree");
            },
            no: () => {
                mp.trigger("events.callRemote", "hospital.health.cancel");
            },
        },
        "acccept_trash_team": {
            text: "Tomat Petruchkin invites you to join the team.",
            on: (values) => {
                menus["acccept_trash_team"].text = `${values.name} invites you to join the team.`;
            },
            yes: () => {
                mp.trigger("events.callRemote", "trash.team.agree");
            },
            no: () => {
                mp.trigger("events.callRemote", "trash.team.cancel");
            },
        },
        "acccept_gopostal_team": {
            text: "Tomat Petruchkin invites you to join the group.",
            on: (values) => {
                menus["acccept_gopostal_team"].text = `${values.name} invites you to join the group.`;
            },
            yes: () => {
                mp.trigger("events.callRemote", "gopostal.team.agree");
            },
            no: () => {
                mp.trigger("events.callRemote", "gopostal.team.cancel");
            },
        },
        "accept_job_builder": {
            text: "You want to begin work <Job>?",
            on: (values) => {
                menus["accept_job_builder"].text = `Do you want to ${values.name}`;
            },
            yes: () => {
                mp.trigger("events.callRemote", "job.builder.agree");
            },
            no: () => {
                mp.trigger("client.job.cursor.cancel");
            },
        },
        "accept_job_taxi": {
            text: "You want to begin work <Job>?",
            on: (values) => {
                menus["accept_job_taxi"].text = `Do you want to ${values.name}`;
            },
            yes: () => {
                mp.trigger("events.callRemote", "job.taxi.agree");
            },
            no: () => {
                mp.trigger("client.job.cursor.cancel");
            },
        },
        "accept_job_waterfront": {
            text: "You want to begin work <Job>?",
            on: (values) => {
                menus["accept_job_waterfront"].text = `Do you want to ${values.name}`;
            },
            yes: () => {
                mp.trigger("events.callRemote", "job.waterfront.agree");
            },
            no: () => {
                mp.trigger("client.job.cursor.cancel");
            },
        },
        "accept_job_pizza": {
            text: "You want to begin work <Job>?",
            on: (values) => {
                menus["accept_job_pizza"].text = `Do you want to ${values.name}`;
            },
            yes: () => {
                mp.trigger("events.callRemote", "job.pizza.agree");
            },
            no: () => {
                mp.trigger("client.job.cursor.cancel");
            },
        },
        "accept_job_postal": {
            text: "You want to begin work <Job>?",
            on: (values) => {
                menus["accept_job_postal"].text = `Do you want to ${values.name}`;
            },
            yes: () => {
                mp.trigger("events.callRemote", "job.gopostal.agree");
            },
            no: () => {
                mp.trigger("client.job.cursor.cancel");
            },
        },
        "accept_job_trash": {
            text: "You want to begin work <Job>?",
            on: (values) => {
                menus["accept_job_trash"].text = `Do you want to ${values.name}`;
            },
            yes: () => {
                mp.trigger("events.callRemote", "job.trash.agree");
            },
            no: () => {
                mp.trigger("client.job.cursor.cancel");
            },
        },
        "invite_inhouse_confirm": {
            text: "Carter Slade invites you to the house.",
            on: (values) => {
                houseMenu.__vue__.exitMenu();
                menus["invite_inhouse_confirm"].text = `${values.name} invites you to the house.`;
            },
            yes: () => {
                houseMenu.__vue__.exitMenu();
                mp.trigger("events.callRemote", "house.invite.agree");
            },
            no: () => {
                mp.trigger("events.callRemote", "house.invite.cancel");
            }
        },
        "sellhousegov_confirm": {
            text: "You really want to sell the house to the state for $100.",
            on: (values) => {
                houseMenu.__vue__.exitMenu();
                menus["sellhousegov_confirm"].text = `You really want to sell the house to the state for $${values.price}.`;
            },
            yes: () => {
                houseMenu.__vue__.exitMenu();
                mp.trigger("events.callRemote", "house.sellgov.agree");
            },
            no: () => {}
        },
        "sellhouseplayer_confirm": {
            text: "You really want to sell the house to Carter for $100?",
            on: (values) => {
                houseMenu.__vue__.exitMenu();
                menus["sellhouseplayer_confirm"].text = `You really want to sell the house ${values.name} for $${values.price}?`;
            },
            yes: () => {
                houseMenu.__vue__.exitMenu();
                mp.trigger("events.callRemote", "house.sellplayer.agree");
            },
            no: () => {
                mp.trigger("events.callRemote", "house.sellplayer.cancel");
            }
        },
        "buyhouseplayer_confirm": {
            text: "Carter invites you to buy his House 1 for $ 1000.",
            on: (values) => {
                houseMenu.__vue__.exitMenu();
                menus["buyhouseplayer_confirm"].text = `${values.name} invites you to buy his house ${values.houseid} for $${values.price}.`;
            },
            yes: () => {
                houseMenu.__vue__.exitMenu();
                mp.trigger("events.callRemote", "house.buyhouseplayer.agree");
            },
            no: () => {
                mp.trigger("events.callRemote", "house.buyhouseplayer.cancel");
            }
        },
        "accept_familiar": {
            text: "A citizen wants to meet you.",
            yes: () => {
                mp.trigger("events.callRemote", "familiar.offer.agree");
            },
            no: () => {
                mp.trigger("events.callRemote", "familiar.offer.cancel");
            },
        },
        "accept_delete_character": {
            text: "Remove character Alex Cortez?",
            on: (values) => {
                menus["accept_delete_character"].text = `Remove character ${values.name}?`;
                menus["accept_delete_character"].name = values.name;
            },
            yes: () => {
                var name = menus["accept_delete_character"].name;
                mp.trigger("events.callRemote", "deleteCharacter", name);
            },
            no: () => {},
        },
        "accept_respawn": {
            text: "Do you wish to revive??",
            yes: () => {
                mp.trigger("events.callRemote", "hospital.respawn");
            },
            no: () => {},
        },
        "sellcarplayer_confirm": {
            text: "Do you really want to sell Infernus Carter Slade for of $100?",
            on: (values) => {
                menus["sellcarplayer_confirm"].text = `You really want to sell ${values.model} ${values.name} for $${values.price}?`;
            },
            yes: () => {
                mp.trigger("events.callRemote", "car.sellplayer.agree");
            },
            no: () => {
                mp.trigger("events.callRemote", "car.sellplayer.cancel");
            }
        },
        "buycarplayer_confirm": {
            text: "Carter invites you to buy Infernus for $ 1000.",
            on: (values) => {
                menus["buycarplayer_confirm"].text = `${values.name} invites you to buy ${values.model} for $${values.price}.`;
            },
            yes: () => {
                mp.trigger("events.callRemote", "car.buycarplayer.agree");
            },
            no: () => {
                mp.trigger("events.callRemote", "car.buycarplayer.cancel");
            }
        },
        "accept_fix_car": {
            text: "Are you sure you want to deliver transport for $ 50?",
            on: (sqlId) => {
                menus["accept_fix_car"].text = `Are you sure you want to deliver transport for 50$?`;
                menus["accept_fix_car"].sqlid = sqlId;
            },
            yes: () => {
                var sqlid = menus["accept_fix_car"].sqlid;
                mp.trigger("events.callRemote", "car.fix.accept", sqlid);
            },
            no: () => {
                
            },
        }
    };

    var timerId;
    window.choiceMenuAPI = {
        show: (name, values) => {
            var menu = menus[name];
            if (!menu) return;
            currentChoiceMenu = menu;

            $(".choiceMenu").slideDown("fast");
            if (menu.on && values) menu.on(JSON.parse(values));
            $(".choiceMenu .text").html(menu.text);

            $('.choiceMenu').css('left', Math.max(0, (($(window).width() - $('.choiceMenu').outerWidth()) / 2) + $(window).scrollTop()) + 'px');
            $('.choiceMenu').css('top', '10vh');

            var times = 9;
            $(".choiceMenu .cancel").text(`Open (${times}с)`);
            clearInterval(timerId);
            timerId = setInterval(() => {
                times--;
                $(".choiceMenu .cancel").text(`Open (${times}с)`);
                if (times < 1) {
                    clearInterval(timerId);
                    choiceMenuAPI.hide();
                }
            }, 1000);

            $(".choiceMenu .cancel").on("click", () => {
                currentChoiceMenu.no();
                choiceMenuAPI.hide();
            });
            $(".choiceMenu .agree").on("click", () => {
                currentChoiceMenu.yes();
                choiceMenuAPI.hide();
            });
            $(document).keydown(choiceMenuAPI.handler);

            promptAPI.showByName("choiceMenu_help");
        },
        hide: () => {
            $(".choiceMenu .cancel").off("click");
            $(".choiceMenu .agree").off("click");
            $(document).unbind('keydown', choiceMenuAPI.handler);
            currentChoiceMenu = null;
            $(".choiceMenu").slideUp("fast");
            clearInterval(timerId);
            promptAPI.hide();
        },
        handler: (e) => {
            if (window.medicTablet.active() || window.pdTablet.active() || window.telephone.active() || window.armyTablet.active() || window.sheriffTablet.active() || window.fibTablet.active() || window.playerMenu.active() || chatAPI.active() || consoleAPI.active() || modalAPI.active()) return;
            if (e.keyCode == 78) { // N
                currentChoiceMenu.no();
                choiceMenuAPI.hide();
            } else if (e.keyCode == 89) { // Y
                currentChoiceMenu.yes();
                choiceMenuAPI.hide();
            }
        },
    };
});
