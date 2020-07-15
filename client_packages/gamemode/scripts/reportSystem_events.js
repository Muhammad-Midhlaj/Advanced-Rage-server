exports = (menu) => {
    mp.events.add("reportSystem.createTicket", (message, reason) => {
        message = message.substr(0, 100).escape().trim();
        mp.events.callRemote("reportSystem.createTicket", message, reason);
    });

    mp.events.add("reportSystem.closeTicket", (reportId) => {
        mp.events.callRemote("reportSystem.closeTicket", reportId);
    });

    mp.events.add("reportSystem.sendMessage", (reportId, message) => {
        message = message.substr(0, 100).escape().trim();
        mp.events.callRemote("reportSystem.sendMessage", reportId, message);
    });

    mp.events.add("reportSystem.reports", (reports) => {
        // debug(`[client] reportSystem.reports: ${JSON.stringify(reports)}`)
        if(reports === undefined) {

        } else {
            menu.execute(`mp.events.call('playerMenu', {reports: ${JSON.stringify(reports)}, event: 'reports' })`);
        }
    });

    mp.events.add("reportSystem.messages", (messages) => {
        // debug(`[client] reportSystem.messages: ${JSON.stringify(messages)}`)
        if(messages === undefined) {

        } else {
            menu.execute(`mp.events.call('playerMenu', {messages: ${JSON.stringify(messages)}, event: 'messages' })`);
        }
    });

    mp.events.add("reportSystem.close", (data) => {
        // debug(`[client] reportSystem.close: ${JSON.stringify(data)}`)
        if(data === undefined) {

        } else {
            menu.execute(`mp.events.call('playerMenu', {closeTicket: ${JSON.stringify(data)}, event: 'closeTicket' })`);
        }
    });

    mp.events.add("reportSystem.addReport", (data) => {
        menu.execute(`mp.events.call('playerMenu', {addReport: ${JSON.stringify(data)}, event: 'addReport' })`);
    });
}
