exports = (menu) => {
    mp.events.add("adminPanel.reports", (reports) => {
        if(reports === undefined) {
            
        } else {
            menu.execute(`mp.events.call('adminPanel', {reports: ${JSON.stringify(reports)}, event: 'reports' })`);
        }
    });

    mp.events.add("adminPanel.messages", (messages) => {
        if(messages === undefined) {
            
        } else {
            menu.execute(`mp.events.call('adminPanel', {messages: ${JSON.stringify(messages)}, event: 'messages' })`);
        }
    });

    mp.events.add("adminPanel.closeTicket", (data) => {
        if(data === undefined) {

        } else {
            menu.execute(`mp.events.call('adminPanel', {closeTicket: ${JSON.stringify(data)}, event: 'closeTicket' })`);
        }
    });

    mp.events.add("adminPanel.enable", (enable) => {
        menu.execute(`mp.events.call('adminPanel', {enable: ${enable}, event: 'enable' })`);
    });

    mp.events.add("setAdminPanel", (enable) => {
        mp.setAdminPanel = enable;
    });

    mp.events.add("atmMenu.open", (enable) => {
        menu.execute(`mp.events.call('atmMenu', {enable: ${enable}, event: 'enable' })`);
    });

};
