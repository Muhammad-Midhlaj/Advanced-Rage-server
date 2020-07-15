exports = (menu) => {
    mp.events.add("console.push", (type, text) => {
        if (!text) return;
        var types = ['log', 'info', 'warning', 'error', 'debug'];
        var index = types.indexOf(type);
        if (index == -1) return menu.execute(`consoleAPI.error('Log type not recognized!')`);
        //menu.execute(`alert('push')`);
        menu.execute(`consoleAPI.${type}('${text.escape()}')`);
    });

    mp.events.add("console.enable", (enable) => {
        menu.execute(`consoleAPI.enable(${enable})`);
    });

    mp.events.add("console.send", (message) => {
        if (!isFlood()) mp.events.callRemote(`console.send`, message);
    });

    mp.events.add("setConsoleActive", (enable) => {
        mp.consoleActive = enable;
    });

    mp.events.add("console.pushReport", (data) => {
        menu.execute(`consoleAPI.pushReport('${JSON.stringify(data)}')`);
    });

    mp.events.add("console.removeReport", (sqlId) => {
        menu.execute(`consoleAPI.removeReport(${sqlId})`);
    });

    mp.events.add("console.addReportMessage", (sqlId, messages) => {
        menu.execute(`consoleAPI.addReportMessage(${sqlId}, '${JSON.stringify(messages)}')`);
    });

    mp.events.add("console.chat", (player, text) => {
        menu.execute(`consoleAPI.chat('${JSON.stringify(player)}', '${text}')`);
    });

    mp.events.add("console.setReportAdminId", (sqlId, adminId) => {
        menu.execute(`consoleAPI.setReportAdminId(${sqlId}, ${adminId})`);
    });
}
