/*
	16.11.2018 created by Carter.

	События для обработки и показа/скрытия модального окна.
*/

exports = (menu) => {
    mp.events.add("modal.show", (modalName, values = null) => {
        menu.execute(`modalAPI.show('${modalName}', '${JSON.stringify(values)}')`);
    });

    mp.events.add("modal.hide", () => {
        menu.execute(`modalAPI.hide()`);
    });
}
