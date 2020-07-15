
//var tags = ["[say]","[shout]","[whisper]","[radio]","[OOC]"];
$(document).ready(() => {

    var chatApp = new Vue({
        el: "#chat",
        data: {
            leftChat: true,
            chatStatus: true,
            leftChatClass: "chatLeft",
            rightChatClass: "chatRight"
        }
    });

    const messageTime = 10000; // время показа сообщения в чате
    const countMessages = 30; // макс. кол-во сообщений в чате
    var chatTimeout = null; // Timeout для чата, для его потухания при неактиве
    var chatFaded = true;

    var tags = ["[say]", "[shout]", "[whisper]", "[radio]", "[OOC]", "[action]", "[explanation]", "[probability]", "[department]"];
    var textColors = ["#ffffff", "#e4a600", "#c0c0c0", "#4bc0c4", "#b0b0b0", "#f0d2f4", "#f0d2f4", "#f0d2f4", "#f4d2d2"];

    $("#chat input").keydown((e) => {
        if (e.keyCode == 13) { // enter

            var message = $("#chat input").val().trim();
            $("#chat input").val("");
            if (message.length == 0) return window.chatAPI.show(false);
            if (message.length > 100) message = message.substr(0, 100);
            var tag = $("#chat .tag a").text();
            window.chatAPI.send(message, tag);
            cmdLoggerAPI.save(message, tag);

        }
    });
    window.chatAPI = {
        push: (playerName, playerId, text, tag) => {

            if (chatTimeout) {
                clearTimeout(chatTimeout);
                chatTimeout = null;
            }
            chatFaded = false;
            $("#chat .chat-content").css("opacity", "1.0");

            var index = tags.indexOf(tag);
            if (index == -1) return alert(`Unknown type of chat message!`);
            var message = "";
            var handlers = {
                "[say]": (playerName, text) => {
                    message = `${playerName}<a class="userId">[${playerId}]</a> he said: ${text}`;
                },
                "[shout]": (playerName, text) => {
                    message = `${playerName}[${playerId}] shouted: ${text}`;
                },
                "[whisper]": (playerName, text) => {
                    message = `${playerName}[${playerId}] whispered: ${text}`;
                },
                "[radio]": (playerName, text) => {
                    message = `${playerName}[${playerId}] said on the radio: ${text}`;
                },
                "[OOC]": (playerName, text) => {
                    message = `(( ${playerName}[${playerId}]: ${text} ))`;
                },
                "[action]": (playerName, text) => {
                    message = `${playerName}[${playerId}] ${text}`;
                },
                "[explanation]": (playerName, text) => {
                    message = `${text} | ${playerName}[${playerId}]`;
                },
                "[probability]": (playerName, text) => {
                    message = `${playerName}[${playerId}] ${text}`;
                },
                "[department]": (playerName, text) => {
                    message = `${playerName}[${playerId}] on department: ${text}`;
                },
            };
            handlers[tag](playerName, text);

            var el = $(`<div>${message}</div>`);
            el.css("color", textColors[index]);
            $("#chat .chat-content").append(el);
            //$("#chat .chat-content").append("<hr />");
            $("#chat .chat-content").scrollTop(9999);

            if ($("#chat .chat-content div").length > countMessages) {
                $("#chat .chat-content div:first").remove();
                $("#chat .chat-content hr:first").remove();
            }

            chatTimeout = setTimeout(() => {
                if (!chatAPI.active()) $("#chat .chat-content").css("opacity", "0.7");
                chatFaded = true;
            }, messageTime);
        },
        custom_push: (text) => {
            if (chatTimeout) {
                clearTimeout(chatTimeout);
                chatTimeout = null;
            }
            chatFaded = false;
            $("#chat .chat-content").css("opacity", "1.0");
            var message = "";
            // chatAPI.custom_push("[A] Tomat Petruchkin: всем доброго времени суток!");
            var el = $(`<div>${text}</div>`);
            $("#chat .chat-content").append(el);
            $("#chat .chat-content").scrollTop(9999);
            if ($("#chat .chat-content div").length > countMessages) {
                $("#chat .chat-content div:first").remove();
                $("#chat .chat-content hr:first").remove();
            }
            chatTimeout = setTimeout(() => {
                if (!chatAPI.active()) $("#chat .chat-content").css("opacity", "0.7");
                chatFaded = true;
            }, messageTime);
        },
        clear: (playerName) => {
            $("#chat .chat-content").empty();
            var el = $(`<div>Administrator ${playerName} cleaned up the chat!</div>`);
            $("#chat .chat-content").append(el);
        },
        changeOptions: (options) => {
            if(options === 1) {
                chatApp.chatStatus = false;
                mp.trigger("playerMenu.Chat", 1);
            } else {
                chatApp.chatStatus = true;
            }

            if(options === 2) {
                chatApp.leftChat = true;
                mp.trigger("playerMenu.Chat", 2);
            } else if(options === 3) {
                mp.trigger("playerMenu.Chat", 3);
                chatApp.leftChat = false;
            }
        },
        send: (message, tag) => {
            if (!isFlood()) mp.invoke("chatMessage", JSON.stringify({
                text: message.escape(),
                tag: tag
            }));
            chatAPI.show(false);
        },
        show: (enable) => {
            if (!chatApp.chatStatus) return;
            if (window.medicTablet.active() || window.pdTablet.active() || window.telephone.active() || window.sheriffTablet.active() || window.armyTablet.active() || window.fibTablet.active() || window.playerMenu.active() || consoleAPI.active() || modalAPI.active() || tradeAPI.active()) return;
            if (enable) {

                $("#chat .chat-content").css("opacity", "1.0");

                $("#chat .chat-bottom").slideDown('fast');
                setTimeout(() => {
                    $("#chat input").focus();
                }, 5);
                $("#chat .chat-content").css("overflow-y", "auto");
                //$("#chat .chat-content div").css("opacity", "1");
            } else {
                if (chatFaded) $("#chat .chat-content").css("opacity", "0.7");

                $("#chat .chat-bottom").slideUp('fast');
                $("#chat .chat-content").css("overflow-y", "hidden");
                //$("#chat .chat-content div").css("opacity", "0.9");
            }
            $("#chat input").blur();
            setCursor(enable);
            mp.trigger('setBlockControl', enable);
            mp.trigger("setChatActive", enable);
        },
        active: () => {
            return $("#chat .chat-bottom").css("display") != "none";
        },
        enable: (enable) => {
            $(document).unbind('keydown', chatAPI.showHandler);
            $(document).unbind('keydown', chatAPI.tabHanlder);
            if (enable) {
                $(document).keydown(chatAPI.showHandler);
                $(document).keydown(chatAPI.tabHanlder);
            } else {
                chatAPI.show(false);
                $(document).unbind('keydown', chatAPI.showHandler);
                $(document).unbind('keydown', chatAPI.tabHanlder);
            }
        },
        showHandler: (e) => {
            if (!chatApp.chatStatus) return;
            if (e.keyCode == 84) {
                if (!chatAPI.active()) chatAPI.show(true);
            }
        },
        tabHanlder: (e) => {
            if (e.keyCode == 9) {
                if (!chatAPI.active()) return;
                var index = tags.indexOf($("#chat .tag a").text()) + 1;
                if (index >= tags.length) index = 0;
                $("#chat .tag a").text(tags[index]);
                // $("#chat .tag").css("color", textColors[index]);
                setTimeout(() => {
                    $("#chat input").focus();
                }, 5);
            }
        },
        isLeft: () => {
            return chatApp.leftChat;
        },
    };

    var cmdLoggerAPI = {
        save: (message, tag) => {
            if (cmdLoggerAPI.messages.length > 0 &&
                cmdLoggerAPI.messages[cmdLoggerAPI.index - 1].text == message) return;

            cmdLoggerAPI.messages.push({
                text: message,
                tag: tag
            });
            if (cmdLoggerAPI.messages.length > 20) cmdLoggerAPI.messages.splice(0, 1);
            cmdLoggerAPI.index = cmdLoggerAPI.messages.length;
        },
        init: () => {
            $(document).unbind('keydown', cmdLoggerAPI.handler);
            $(document).keydown(cmdLoggerAPI.handler);
        },
        handler: (e) => {
            if (!chatAPI.active()) return;
            if (e.keyCode == 38) { //up
                cmdLoggerAPI.index--;
                if (cmdLoggerAPI.index < 0) cmdLoggerAPI.index = 0;
                var message = cmdLoggerAPI.messages[cmdLoggerAPI.index].text;
                var tag = cmdLoggerAPI.messages[cmdLoggerAPI.index].tag;

                setTimeout(() => {
                    $("#chat input").val(message);
                }, 5);
                $("#chat .tag a").text(tag);
                $("#chat .tag").css("color", textColors[index]);
            } else if (e.keyCode == 40) { //bottom
                cmdLoggerAPI.index++;
                if (cmdLoggerAPI.index >= cmdLoggerAPI.messages.length) cmdLoggerAPI.index = cmdLoggerAPI.messages.length - 1;
                var message = cmdLoggerAPI.messages[cmdLoggerAPI.index].text;
                var tag = cmdLoggerAPI.messages[cmdLoggerAPI.index].tag;
                setTimeout(() => {
                    $("#chat input").val(message);
                }, 5);
                $("#chat .tag a").text(tag);
            }
        },
        messages: [],
        index: 0
    };
    cmdLoggerAPI.init();

    //chatAPI.enable(true); //for test
});
