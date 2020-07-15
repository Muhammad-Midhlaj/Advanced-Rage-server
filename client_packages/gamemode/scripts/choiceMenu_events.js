/*
	04.12.2018 created by Carter.

	События для обработки и показа/скрытия меню предложения. (Yes/No)
*/

exports = (menu) => {
    mp.events.add("choiceMenu.show", (name, values) => {
        if (values) {
            var player;
            if (values.owner) {
                player = getPlayerByName(values.owner);
                if (player && !player.isFamiliar) values.owner = "Citizen";
            }
            else if (values.name) {
                player = getPlayerByName(values.name);
                if (player && !player.isFamiliar) values.name = "Citizen";
            }
        }

        menu.execute(`choiceMenuAPI.show('${name}', '${JSON.stringify(values)}')`);
    });

    mp.events.add("choiceMenu.hide", () => {
        menu.execute(`choiceMenuAPI.hide()`);
    });
}
