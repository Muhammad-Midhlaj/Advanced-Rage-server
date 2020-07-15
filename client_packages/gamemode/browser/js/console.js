$(document).ready(() => {
    const COUNT_MESSAGES = 30; // макс. кол-во сообщений в консоли
    const COUNT_DIALOG_MESSAGES = 30; // макс. кол-во сообщений в тикете
    const COUNT_REPORTS = 50; // макс. кол-во репортов в консоли
    $("#console .console-bottom input").keydown((e) => {
        if (e.keyCode == 13) { // enter
            var message = $("#console .console-bottom input").val().trim();
            if (message.substr(0, 1) == "/") message = message.substr(1, message.length);
            if (message.length == 0) return consoleAPI.show(false);
            if (message.length > 200) message = message.substr(0, 200);
            consoleAPI.send(message);
            cmdLoggerAPI.save(message);
            $("#console .console-bottom input").val("");
        }
    });
    $("#console .report-dialog input").keydown((e) => {
        if (e.keyCode == 13) { // enter
            var message = $("#console .report-dialog input").val().trim();
            if (message.length == 0) return consoleAPI.show(false);
            if (message.length > 540) message = message.substr(0, 540);
            consoleAPI.sendMessage(message);
            $("#console .report-dialog input").val("");
        }
    });
    $("#console .console-chat input").keydown((e) => {
        if (e.keyCode == 13) { // enter
            var message = $("#console .console-chat input").val().trim();
            if (message.length == 0) return consoleAPI.show(false);
            if (message.length > 200) message = message.substr(0, 200);
            consoleAPI.sendChat(message);
            $("#console .console-chat input").val("");
        }
    });
    window.consoleAPI = {
        log: (message) => {
            consoleAPI.push("log", message);
        },
        info: (message) => {
            consoleAPI.push("info", message);
        },
        warning: (message) => {
            consoleAPI.push("warning", message);
        },
        error: (message) => {
            consoleAPI.push("error", message);
        },
        debug: (message) => {
            consoleAPI.push("debug", message);
        },
        push: (type, message) => {
            $("#console .console-content").append(`<div class="${type}"><p>${message}</p></div>`);
            $("#console .console-content").scrollTop(99999);

            if ($("#console .console-content div").length > COUNT_MESSAGES) {
                $("#console .console-content div:first").remove();
            }
        },
        chat: (player, message) => {
            player = JSON.parse(player);
            var el = $(`<div class="chat"><p>[${player.admin} lvl] ${player.name} [${player.id}]: ${message}</p></div>`);
            $("#console .chat-content").append(el);
            $("#console .chat-content").scrollTop(99999);

            if ($("#console .chat-content div").length > COUNT_MESSAGES) {
                $("#console .chat-content div:first").remove();
            }
            var chatCount = parseInt($("#console .select-chat .count").text().substr(1)) || 0;
            if (!consoleAPI.chatActive()) {
                if (chatCount < COUNT_MESSAGES) $("#console .select-chat .count").text(`(${chatCount+1})`);
            }
            if (!consoleAPI.adminActive()) {
                if (chatCount < COUNT_MESSAGES) {
                    var commonCount = parseInt($("#console .admin-open .count").text().substr(1)) || 0;
                    $("#console .admin-open .count").text(`(${commonCount+1})`);
                }
            }
        },
        reports: {},
        pushReport: (data) => {
            // debug(`consoleAPI.pushReport: ${data}`)
            data = JSON.parse(data);
            if (!Array.isArray(data)) data = [data];
            $("#console .report-list .content .empty").remove();
            var count = $("#console .report-list .report").length;
            var length = Math.clamp(data.length, 0, COUNT_REPORTS - count);
            for (var i = 0; i < length; i++) {
                var report = data[i];
                // debug(`report: ${JSON.stringify(report)}`)
                var ownerName = (report.messages.length) ? report.messages[0].name.substr(0, 17) : "Player";
                var name = (report.messages.length) ? report.messages[report.messages.length - 1].name.substr(0, 17) : "Player";
                var text = (report.messages.length) ? report.messages[report.messages.length - 1].text.substr(0, 23) : "Message";
                if (name != ownerName) text = `[А]: ${text}`;
                $(`#console .report-list .report[data-sqlid='${report.id}']`).remove();
                var el = $(`<div class="report ${report.type} new" data-sqlid="${report.id}">
                <div class="name">${ownerName}</div>
                <div class="title">${text}</div>
                </div>`);
                $("#console .report-list .content").append(el);

                consoleAPI.reports[report.id] = report;
                if (report.status) consoleAPI.updateReportStatus(report.id);
                el.click((e) => {
                    var target = $(e.target);
                    if (!target.hasClass("report")) target = target.parent(".report");
                    consoleAPI.openReport(target.data("sqlid"));
                });
                el.contextmenu((e) => {
                    var target = $(e.target);
                    if (!target.hasClass("report")) target = target.parent(".report");
                    consoleAPI.showReportMenu(target.data("sqlid"), e.pageX, e.pageY);
                });
                var select = $("#console .report-dialog > .selector .active");
                if (select.hasClass("select-claim") && report.type != "claim") el.hide();
                if (select.hasClass("select-help") && report.type != "help") el.hide();
            }
        },
        removeReport: (sqlId) => {
            $(`#console .report-list .report[data-sqlid='${sqlId}']`).remove();
            if (!$("#console .report-list .report").length) {
                $("#console .report-list .content").append(`<div class="empty">We can rest!</div>`);
            }
            if ($("#console .report-dialog").data("sqlid") == sqlId) {
                $("#console .report-dialog").data("sqlid", 0);
                $("#console .dialog-messages").empty();
                $("#console .dialog-messages").append(`<div class="empty">The ticket is closed!</div>`);
            }
            delete consoleAPI.reports[sqlId];
        },
        openReport: (sqlId) => {
            // console.log(`openReport: ${sqlId}`)
            var report = consoleAPI.reports[sqlId];
            if (!report) return;
            if ($("#console .report-dialog").data("sqlid") == sqlId) return;
            $(`#console .report-list .report[data-sqlid='${sqlId}']`).removeClass("new");
            $("#console .report-dialog input").attr("readonly", report.status == 1);
            $("#console .report-dialog").data("sqlid", sqlId);
            $("#console .dialog-messages").empty();
            consoleAPI.pushReportMessage(sqlId, report.messages);
        },
        pushReportMessage: (sqlId, messages) => {
            if (!Array.isArray(messages)) messages = [messages];
            var report = consoleAPI.reports[sqlId];
            if (!report) return;
            if ($("#console .report-dialog").data("sqlid") != sqlId) return;
            $("#console .report-dialog .empty").remove();
            for (var i = 0; i < messages.length; i++) {
                var name = messages[i].name;
                var el = $(`<div class="dialog-message">
                    <div class="text">
                        ${messages[i].text}
                    </div>
                    <div class="date">${name} | ${convertMillsToDate(messages[i].date * 1000)}</div>
                </div>`);
                if (messages[i].playerId != report.playerId) el.addClass("my");
                $("#console .dialog-messages").append(el);
                if ($("#console .report-dialog .dialog-message").length > COUNT_DIALOG_MESSAGES) {
                    $("#console .report-dialog .dialog-message:first").remove();
                }
            }
            $("#console .dialog-messages").scrollTop(99999);
        },
        addReportMessage: (sqlId, messages) => {
            // debug(`addReportMessage: ${sqlId} ${messages}`)
            messages = JSON.parse(messages);
            if (!Array.isArray(messages)) messages = [messages];
            var report = consoleAPI.reports[sqlId];
            if (!report || !messages.length) return;
            report.messages = report.messages.concat(messages);
            if ($("#console .report-dialog").data("sqlid") == sqlId)
                consoleAPI.pushReportMessage(sqlId, messages);
            else {
                $(`#console .report-list .report[data-sqlid='${sqlId}']`).addClass("new");
            }
            var name = messages[messages.length - 1].name;
            var text = messages[messages.length - 1].text;
            var ownerName = report.messages[0].name || "Player";
            if (name != ownerName && ownerName != "Player") text = `[А]: ${text}`;
            $(`#console .report-list .report[data-sqlid='${sqlId}'] .name`).text(ownerName);
            $(`#console .report-list .report[data-sqlid='${sqlId}'] .title`).text(text);

            var reportCount = parseInt($("#console .select-report .count").text().substr(1)) || 0;
            if (!consoleAPI.reportActive()) {
                if (reportCount < COUNT_REPORTS) $("#console .select-report .count").text(`(${reportCount+1})`);
            }
            if (!consoleAPI.adminActive()) {
                if (reportCount < COUNT_REPORTS) {
                    var commonCount = parseInt($("#console .admin-open .count").text().substr(1)) || 0;
                    $("#console .admin-open .count").text(`(${commonCount+1})`);
                }
            }
        },
        updateReportStatus: (sqlId) => {
            // debug(`updateReportStatus: ${sqlId}`)
            var report = consoleAPI.reports[sqlId];
            if (!report) return;
            var status = (report.adminId) ? 1 : 0;
            if (report.adminId == clientStorage.sqlId) status = 2;
            // 0 - свободный, 1 - занятый, 2 - занят мной
            if (status == 0) {
                $(`#console .report-list .report[data-sqlid='${sqlId}']`).removeClass("busy");
                $(`#console .report-list .report[data-sqlid='${sqlId}']`).removeClass("my");
                report.status = 0;
                var select = $("#console .report-dialog > .selector .active");
                if (select.hasClass("select-busy") || select.hasClass("select-my"))
                    $(`#console .report-list .report[data-sqlid='${sqlId}']`).hide();
            } else if (status == 1) {
                $(`#console .report-list .report[data-sqlid='${sqlId}']`).removeClass("my");
                $(`#console .report-list .report[data-sqlid='${sqlId}']`).addClass("busy");
                report.status = 1;
                var select = $("#console .report-dialog > .selector .active");
                if (select.hasClass("select-busy"))
                    $(`#console .report-list .report[data-sqlid='${sqlId}']`).show();
            } else if (status == 2) {
                $(`#console .report-list .report[data-sqlid='${sqlId}']`).removeClass("busy");
                $(`#console .report-list .report[data-sqlid='${sqlId}']`).addClass("my");
                report.status = 2;
            }
            if ($("#console .report-dialog").data("sqlid") == sqlId) {
                if (report.status == 1) $("#console .report-dialog input").val("");
                $("#console .report-dialog input").attr("readonly", report.status == 1);
            }
        },
        setReportAdminId: (sqlId, adminId) => {
            var report = consoleAPI.reports[sqlId];
            if (!report) return;
            report.adminId = adminId;

            consoleAPI.updateReportStatus(sqlId);
        },
        send: (message) => {
            //mp.trigger('console.send', message);
            mp.invoke("command", message.escape());
        },
        sendMessage: (message) => {
            var reportId = $("#console .report-dialog").data("sqlid");
            if (!reportId) return nError(`No ticket ID found!`);
            if (!isFlood()) mp.trigger("events.callRemote", "report.addMessage", JSON.stringify([reportId, message.escape()]));
        },
        sendChat: (message) => {
            if (!isFlood()) mp.trigger("events.callRemote", "admin.chat.push", JSON.stringify([message.escape()]));
        },
        show: (enable) => {
            // if (window.medicTablet.active() || window.pdTablet.active() || window.telephone.active() || window.armyTablet.active() || window.sheriffTablet.active() || window.fibTablet.active() || window.playerMenu.active() || chatAPI.active() || tradeAPI.active() || modalAPI.active()) return;
            if (enable) {
                $("#console").slideDown('fast');
                $("#console .console-content").scrollTop(99999);
                setTimeout(() => {
                    $("#console input").focus();
                }, 5);
            } else $("#console").slideUp('fast');
            $("#console input").blur();
            setCursor(enable);
            mp.trigger('setBlockControl', enable);
            mp.trigger("setConsoleActive", enable);
        },
        adminShow: (enable) => {
            if (enable) {
                var active = $("#console .console-admin .selector .active");
                if (active.hasClass("select-chat")) $("#console .console-admin .console-chat").show();
                else if (active.hasClass("select-report")) $("#console .console-admin .console-report").show();
                $("#console .console-admin .selector").show();
                $("#console .console-admin").animate({
                    right: "0",
                }, 200);
                $("#console .console-content, #console .console-bottom").animate({
                    width: "54%"
                }, 200);
            } else {
                $("#console .console-admin").animate({
                    right: "-40%",
                }, 200, () => {
                    $("#console .console-admin .selector").hide();
                    $("#console .console-admin .console-chat").hide();
                    $("#console .console-admin .console-report").hide();
                });
                $("#console .console-content, #console .console-bottom").animate({
                    width: "95.7%"
                }, 200);
            }
        },
        active: () => {
            return $("#console").css("display") != "none";
        },
        adminActive: () => {
            return $("#console .console-admin > .selector").css("display") != "none";
        },
        chatActive: () => {
            return $("#console .console-admin .select-chat").hasClass("active");
        },
        reportActive: () => {
            return $("#console .console-admin .select-report").hasClass("active");
        },
        enable: (enable) => {
            $(document).unbind('keydown', consoleAPI.showHandler);
            if (enable) {
                $(document).keydown(consoleAPI.showHandler);
            } else {
                consoleAPI.show(false);
                $(document).unbind('keydown', consoleAPI.showHandler);
            }
        },
        showHandler: (e) => {
            if (e.keyCode == 1040 || e.keyCode == 192) {
                consoleAPI.show(!consoleAPI.active());
            }
        },
        showReportMenu: (sqlId, left, top) => {
            // debug(`showReportMenu: ${sqlId}`)
            var report = consoleAPI.reports[sqlId];
            if (!report) return;
            var reportMenuEl = $(`#console .report_menu`);
            $(`#console .report_menu`).empty();
            var menu = ["Secured", "Close", "TP to the player", "TP to yourself"];
            menu.forEach((menuItem) => {
                var menuItemEl = $(`<div class="menu-item">${menuItem}</div>`);
                menuItemEl.click((e) => {
                    if (!reportMenuHandlers[menuItem]) return;
                    reportMenuHandlers[menuItem](report.id);
                });
                reportMenuEl.append(menuItemEl);
            });

            reportMenuEl.css("left", left);
            reportMenuEl.css("top", top);
            reportMenuEl.slideDown("fast");
        },
        init: () => {
            $("#console .admin-open").click(() => {
                if (!consoleAPI.adminActive()) $("#console .admin-open .count").text("");
                consoleAPI.adminShow(!consoleAPI.adminActive());
            });
            $("#console .console-admin > .selector > span").click((e) => {
                var target = $(e.target);
                if (target.hasClass("active")) return;
                if (target.hasClass("count")) target = target.parent();
                $("#console .console-admin > div:not(.selector, .admin-open)").hide();
                if (target.hasClass("select-chat")) {
                    $("#console .select-chat .count").text("");
                    $("#console .console-admin .console-chat").show();
                } else if (target.hasClass("select-report")) {
                    $("#console .select-report .count").text("");
                    $("#console .console-admin .console-report").show();
                } else if (target.hasClass("select-anticheat")) {
                    // TODO: Show Anti-Cheat.
                }

                $("#console .console-admin > .selector > span").removeClass("active");
                target.addClass("active");
            });
            $("#console .report-dialog > .selector > span").click((e) => {
                var target = $(e.target);
                if (target.hasClass("active")) return;
                if (target.hasClass("select-all")) {
                    $("#console .report-list .report").show();
                } else if (target.hasClass("select-claim")) {
                    $("#console .report-list .report:not(.claim)").hide();
                    $("#console .report-list .report.claim").show();
                } else if (target.hasClass("select-help")) {
                    $("#console .report-list .report:not(.help)").hide();
                    $("#console .report-list .report.help").show();
                } else if (target.hasClass("select-my")) {
                    $("#console .report-list .report:not(.my)").hide();
                    $("#console .report-list .report.my").show();
                } else if (target.hasClass("select-busy")) {
                    $("#console .report-list .report:not(.busy)").hide();
                    $("#console .report-list .report.busy").show();
                }

                $("#console .report-dialog > .selector > span").removeClass("active");
                target.addClass("active");
            })
        },
    };

    var cmdLoggerAPI = {
        save: (message) => {
            if (cmdLoggerAPI.messages[cmdLoggerAPI.index - 1] == message) return;
            cmdLoggerAPI.messages.push(message);
            if (cmdLoggerAPI.messages.length > 20) cmdLoggerAPI.messages.splice(0, 1);
            cmdLoggerAPI.index = cmdLoggerAPI.messages.length;
        },
        init: () => {
            $(document).unbind('keydown', cmdLoggerAPI.handler);
            $(document).keydown(cmdLoggerAPI.handler);
        },
        handler: (e) => {
            if (!consoleAPI.active()) return;
            if (e.keyCode == 38) { //up
                cmdLoggerAPI.index--;
                if (cmdLoggerAPI.index < 0) cmdLoggerAPI.index = 0;
                var message = cmdLoggerAPI.messages[cmdLoggerAPI.index];
                setTimeout(() => {
                    $("#console .console-bottom input").val(message);
                }, 5);
            } else if (e.keyCode == 40) { //bottom
                cmdLoggerAPI.index++;
                if (cmdLoggerAPI.index >= cmdLoggerAPI.messages.length) cmdLoggerAPI.index = cmdLoggerAPI.messages.length - 1;
                var message = cmdLoggerAPI.messages[cmdLoggerAPI.index];
                setTimeout(() => {
                    $("#console .console-bottom input").val(message);
                }, 5);
            }
        },
        messages: [],
        index: 0
    };
    cmdLoggerAPI.init();
    consoleAPI.init();

    // consoleAPI.enable(true); //for test
    // consoleAPI.show(true); //for test
});

var reportMenuHandlers = {
    "Secured": (reportId) => {
        mp.trigger(`events.callRemote`, "report.attach", reportId);
    },
    "Close": (reportId) => {
        mp.trigger(`events.callRemote`, "report.close", reportId);
    },
    "TP to the player": (reportId) => {
        mp.trigger(`events.callRemote`, "report.goto", reportId);
    },
    "TP to yourself": (reportId) => {
        mp.trigger(`events.callRemote`, "report.gethere", reportId);
    },
};
