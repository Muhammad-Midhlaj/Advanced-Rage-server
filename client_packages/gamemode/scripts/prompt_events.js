exports = (menu) => {
    mp.events.add("prompt.show", (text, header = "HINT") => {
        menu.execute(`promptAPI.show('${text}', '${header}')`);
    });

    mp.events.add("prompt.hide", () => {
        menu.execute(`promptAPI.hide()`);
    });

    mp.events.add("prompt.showByName", (text, header = "HINT") => {
        menu.execute(`promptAPI.showByName('${text}', '${header}')`);
    });
}
