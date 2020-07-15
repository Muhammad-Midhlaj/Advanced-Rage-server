$(document).ready(() => {
    window.playersOnlineAPI = {
        players: [],
        add: (player) => {
            player = JSON.parse(player);
            var el = `<tr data-playerId=${player.id}>
                        <td class="id">${player.id}</td>
                        <td class="name">${player.name}</td>
                        <td class="Shop">${convertMinutesToLevelRest(player.score).level}</td>
                        <td class="ping">${player.ping}</td>
                  </tr>`;

            var isInserted = true;
            if ($(".playersOnline tbody tr").length == 0 || clientStorage.name == player.name) $(".playersOnline tbody").append(el);
            else {
                isInserted = false;
                $(".playersOnline tbody tr").each((index, item) => {
                    var playerId = parseInt($(item).children(".id").text());
                    if (playerId > player.id && !isInserted) {
                        isInserted = true;
                        $(item).before(el);
                    }
                });
            }
            if (!isInserted) $(".playersOnline tbody").append(el);
        },
        delete: (playerId) => {
            $(`.playersOnline tbody tr[data-playerId='${playerId}']`).remove();
        },
        show: (enable) => {
            if (chatAPI.active() || consoleAPI.active() || !clientStorage.admin) return;
            if (enable) {
                $(".playersOnline").slideDown('fast');
            } else {
                $(".playersOnline").slideUp('fast');
            }
        },
        active: () => {
            return $(".playersOnline").css("display") != "none";
        }
    }
});
