exports = (menu) => {
    mp.events.add("bizLogs.init", (logs, offset) => {
        //alert(`bizLogs.init: ${logs}`);
        menu.execute(`bizLogsAPI.init('${JSON.stringify(logs)}', '${offset}')`);
    });
}
