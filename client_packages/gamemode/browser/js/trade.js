const CHAT_MAX_SIZE = 10;
var tradeItemsData = {}; // sqlId => index предметов добавленных в обмен
$(document).ready(() => {

    $("#trade .trade_chat .text").keydown((e) => {
        if (e.keyCode == 13) { // enter
            sendTradeChat();
        }
    });

    window.tradeAPI = {
        chatPush: (text, name = null) => {
            if (!name) name = $(`#trade .trade_items .header:eq(1)`).text();
            var newEl = $(`<div class="message">${name}: ${text}</div>`);
            var lastEl = $(`#trade .trade_chat .message:last`);
            if (!lastEl.hasClass("bg")) newEl.addClass("bg");
            if ($(`#trade .trade_chat .message`).length > CHAT_MAX_SIZE - 1)
                $(`#trade .trade_chat .message:first`).remove();

            $(`#trade .trade_chat .messages`).append(newEl);
        },
        show: (enable, traderName = "Продавец") => {
            enable = JSON.parse(enable);
            //debug(`tradeAPI.show: ${enable}`)
            if (enable) {
                var el = $(`#inventory .right-block`).clone();
                $(`#trade .right-block`).remove();
                $(`#trade`).prepend(el);
                $(`#trade .trade_chat .messages`).empty();
                $(`#trade .trade_chat .messages`).append(`<div class="message">The exchange has begun!</div>`);
                $(`#trade .trade_chat input`).val("");
                $(`#trade .playerName`).text(clientStorage.name);
                $(`#trade .traderName`).text(traderName);
                tradeItemsData = {};
                initHandlers();
                el.show();
                //показ контейнеров только тех, которые имеются
                var containers = el.find(".container");
                var ids = [7, 8, 13];
                var openCount = 0;
                for (var sqlId in window.playerInventory) {
                    var item = window.playerInventory[sqlId];
                    var index = ids.indexOf(item.itemId);
                    if (index != -1) {
                        containers.eq(index).slideDown("fast");
                        openCount++;
                    }
                }
                if (openCount == 0) {
                    $("#trade .right-block").append(`<center style='margin-top: 15vh'>Inventory is empty!</center>`);
                }
                $(`#trade`).fadeIn("fast", () => {
                    $(`#trade .trade_chat`).slideDown("fast");
                });

                tradeAPI.cancel();
                tradeAPI.cancelTrader();

                $("#trade .trade_chat .text").focus();
            } else {
                $(`#trade .trade_chat`).slideUp("fast", () => {
                    $(`#trade`).fadeOut("fast");
                });
            }

            var columnsEl = $("#trade .recipientItems .column, #trade .myItems .column");
            columnsEl.removeClass("filled");
            columnsEl.removeAttr("style");
            columnsEl.empty();

            if (mp && mp.trigger) {
                setCursor(enable);
                mp.trigger('setBlockControl', enable);
                mp.trigger("setTradeActive", enable);

            }
        },
        active: () => {
            return $("#trade").css("display") != "none";
        },
        accept: () => {
            $("#trade .accept").removeClass("btn-agree");
            $("#trade .accept").removeClass("btn-cancel");
            $("#trade .accept").removeClass("btn-black");
            $("#trade .accept").addClass("btn-black");
            $("#trade .accept").text("Ready");
        },
        cancel: () => {
            $("#trade .accept").removeClass("btn-agree");
            $("#trade .accept").removeClass("btn-cancel");
            $("#trade .accept").removeClass("btn-black");
            $("#trade .accept").addClass("btn-agree");
            $("#trade .accept").text("Accept");
        },
        acceptTrader: () => {
            //debug(`tradeAPI.acceptTrader`);

            $("#trade .acceptTrader").removeClass("btn-agree");
            $("#trade .acceptTrader").removeClass("btn-cancel");
            $("#trade .acceptTrader").removeClass("btn-black");
            $("#trade .acceptTrader").addClass("btn-black");
            $("#trade .acceptTrader").text("Ready");

        },
        cancelTrader: () => {
            $("#trade .acceptTrader").removeClass("btn-agree");
            $("#trade .acceptTrader").removeClass("btn-cancel");
            $("#trade .acceptTrader").removeClass("btn-black");
            $("#trade .acceptTrader").addClass("btn-cancel");
            $("#trade .acceptTrader").text("Not ready");
        },
        pushChat: (name, text) => {
            if (text.length > 40) text = text.substr(0, 40) + "...";

            var newMessage = $(`<div class="message">${name}: ${text}</div>`);

            if (!$("#trade .messages .message:last").hasClass("bg"))
                newMessage.addClass("bg");

            $("#trade .messages").append(newMessage);
            $("#trade .messages").scrollTop(9999);

            if (count > CHAT_MAX_SIZE) {
                $("#trade .messages div:first").remove();
            }
        },
        addTraderItem: (sqlId, item, itemIndex) => {
            sqlId = parseInt(sqlId);
            itemIndex = parseInt(itemIndex);
            item = JSON.parse(item);
            var itemsEl = $("#trade .recipientItems");
            var columnsEl = $("#trade .recipientItems .column");


            var rows = itemsEl.data("rows");
            var cols = itemsEl.data("cols");

            var h = clientStorage.inventoryItems[item.itemId - 1].height;
            var w = clientStorage.inventoryItems[item.itemId - 1].width;

            var itemColumnsEl = [];
            for (var i = 0; i < h; i++) {
                for (var j = 0; j < w; j++) {
                    itemColumnsEl.push(columnsEl.eq(itemIndex + j + i * cols));
                }
            }

            var freeColumnEl = columnsEl.eq(itemIndex);
            var size = Math.min(h, w) * 2;
            var itemEl = $(`<div class="item" data-sqlid='${sqlId}' style="background-image: url('img/items/${item.itemId}.png'); height: ${size}vh; width: ${size}vh"></div>`);

            if ($(`#trade .recipientItems .item[data-sqlid='${sqlId}']`).length > 0) {
                itemEl = $(`#trade .recipientItems .item[data-sqlid='${sqlId}']`);
                itemEl.parent(".column").removeClass("filled");
                resetColumnSize(itemEl.parent(".column"));
            }

            freeColumnEl.css("background", "");
            freeColumnEl.addClass("filled");
            freeColumnEl.append(itemEl);

            var coord = indexToXY(rows, cols, itemIndex);
            freeColumnEl.css("grid-column-start", coord.x + 1);
            freeColumnEl.css("grid-column-end", `span ${w}`);
            freeColumnEl.css("grid-row-start", coord.y + 1);
            freeColumnEl.css("grid-row-end", `span ${h}`);
            for (var i = 1; i < itemColumnsEl.length; i++) {
                itemColumnsEl[i].hide();
            }
        },
        deleteTraderItem: (sqlId) => {
            if ($(`#trade .recipientItems .item[data-sqlid='${sqlId}']`).length > 0) {
                itemEl = $(`#trade .recipientItems .item[data-sqlid='${sqlId}']`);
                itemEl.parent(".column").removeClass("filled");
                resetColumnSize(itemEl.parent(".column"));
                itemEl.parent(".column").empty();
            }
        }
    };

    var draggingItemEl, freeColumnEl;

    function initHandlers() {
        var items = $(`#trade .right-block .item`);
        items.mousedown((e) => {
            if (e.which == 1) {
                draggingItemEl = $(e.target);
                freeColumnEl = draggingItemEl.parent(".column");

                freeColumnEl.removeClass("filled");
                resetColumnSize(freeColumnEl);
                hoverColumn(draggingItemEl, freeColumnEl);

                draggingItemEl.css("position", "absolute");
                draggingItemEl.css("left", e.pageX + (draggingItemEl.width() / 2));
                draggingItemEl.css("top", e.pageY + (draggingItemEl.height() / 2));
                $(document).mousemove((e) => {
                    draggingItemEl.css("left", e.pageX + (draggingItemEl.width() / 2));
                    draggingItemEl.css("top", e.pageY + (draggingItemEl.height() / 2));
                });
            }
        });
        $(document).mouseup((e) => {
            if (draggingItemEl) {
                var itemsEl = $(freeColumnEl).parents(".items");
                var rows = itemsEl.data("rows");
                var cols = itemsEl.data("cols");

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

                var item = inventoryAPI.getItem(draggingItemEl.data("sqlid"));
                var info = clientStorage.inventoryItems[item.itemId - 1];
                var isExist = tradeItemsData[draggingItemEl.data("sqlid")] != null;
                if (itemsEl.hasClass("myItems")) {
                    var size = Math.min(info.height, info.width) * 2;
                    draggingItemEl.css("height", size + "vh");
                    draggingItemEl.css("width", size + "vh");

                    tradeItemsData[draggingItemEl.data("sqlid")] = freeColumnEl.index();
                    mp.trigger(`trade.queryAddItem`, draggingItemEl.data("sqlid"), freeColumnEl.index());
                } else {
                    var size = Math.min(info.height, info.width) * 3;
                    draggingItemEl.css("height", size + "vh");
                    draggingItemEl.css("width", size + "vh");
                    if (isExist) {
                        delete tradeItemsData[draggingItemEl.data("sqlid")];
                        mp.trigger(`trade.queryDeleteItem`, draggingItemEl.data("sqlid"));
                    }
                }


                draggingItemEl.css("position", "static");
                $(document).off("mousemove");


                draggingItemEl = null;
                freeColumnEl = null;
            }
        });
        $(`#trade .column`).mouseenter((e) => {
            if (draggingItemEl) {
                var itemsEl = $(e.target).parents(".items");
                if (itemsEl.hasClass("recipientItems")) return;
                var rows = itemsEl.data("rows");
                var cols = itemsEl.data("cols");
                var h = draggingItemEl.data("height");
                var w = draggingItemEl.data("width");

                var row = Math.clamp(indexToXY(rows, cols, $(e.target).index()).y, 0, rows - h);
                var col = Math.clamp(indexToXY(rows, cols, $(e.target).index()).x, 0, cols - w);

                var columnEl = $(e.target).parent().children(`.column`).eq(col + row * cols);
                for (var i = 0; i < draggingItemEl.data("height"); i++) {
                    for (var j = 0; j < draggingItemEl.data("width"); j++) {
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
        $(`#trade .close`).off("click");
        $(`#trade .close`).click(() => {
            tradeAPI.show(false);
            mp.trigger(`events.callRemote`, "trade.queryTradeCancel");
        });
    }

    function resetColumnSize(columnEl) {
        if (isFreeColumn(columnEl)) return console.error(`Cannot reset empty cell size!`);
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

    function isFreeColumn(columnEl) {
        return isVisible(columnEl) && columnEl.is(":empty");
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

    /* Подсвет ячеек вовремя переноса предмета. */
    function hoverColumn(itemEl, columnEl, color = "#111") {
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
});

/* Вызывается, когда игрок принял/отменил торговлю. */
function acceptTrade() {
    if ($("#trade .accept").text() == "Accept") {
        mp.trigger(`trade.queryAccept`);
    } else {
        mp.trigger(`trade.queryCancel`);
    }
}

/* Вызывается, когда игрок написал в чат торговли. */
function sendTradeChat() {
    var text = $("#trade .trade_chat .text").val().trim();
    $("#trade .trade_chat .text").val("");
    if (text.length == 0) return;
    if (text.length > 40) text = text.substr(0, 40) + "...";
    mp.trigger(`trade.sendChat`, text);
}
