/*
	17.11.2018 created by Carter.

	Events for processing and displaying / hiding info-windows (Persian skills, character window, other information).
*/

exports = (menu) => {
    mp.events.add("infoTable.setValues", (infoTableName, values) => {
        menu.execute(`infoTableAPI.setValues('${infoTableName}', '${JSON.stringify(values)}')`);
    });

    mp.events.add("infoTable.show", (infoTableName, params = null) => {
        //alert(`infoTable.show: ${infoTableName} ${params}`);
        menu.execute(`infoTableAPI.show('${infoTableName}', '${JSON.stringify(params)}')`);
    });

    mp.events.add("infoTable.hide", () => {
        menu.execute(`infoTableAPI.hide()`);
    });
}
