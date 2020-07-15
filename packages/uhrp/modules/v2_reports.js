module.exports = {
    Init: () => {
        loadOpenReportsFromDB();
    }
}

function loadOpenReportsFromDB() {
    mp.v2_reports = {};
    initReportsUtils();
    DB.Handle.query("SELECT * FROM v2_reports WHERE status=?", 1, (e, result) => {
        for (var i = 0; i < result.length; i++) {
            initReportUtils(result[i]);
            mp.v2_reports[result[i].id] = result[i];
            mp.v2_reports[result[i].id].messages = [];
        }

        console.log(`Open reports loaded: ${i} units.`);

        var keys = Object.keys(mp.v2_reports);
        var array = [];
        keys.forEach((k) => {
            array.push("?");
        });
        DB.Handle.query(`SELECT * FROM v2_reports_messages WHERE reportId IN (${array})`, keys, (e, result) => {
            for (var i = 0; i < result.length; i++) {
                var report = mp.v2_reports[result[i].reportId];
                if (report.messages.length > 30) continue;
                report.messages.push(result[i]);
            }
            console.log(`Messages of the report downloaded: ${i} units.`);
        });
    });
}

function initReportUtils(report) {
    report.pushMessage = (player, text) => {
        // debug(`report.pushMessage: ${player.name} ${text}`)
        var message = {
            playerId: player.sqlId,
            name: player.name,
            text: text.substr(0, 100).escape().trim(),
            date: parseInt(new Date().getTime() / 1000)
        };
        if (player.admin) {
            if (!report.adminId) {
                report.setAdminId(player.sqlId);
            } else if (report.adminId != player.sqlId) {
                return player.utils.error(`The report is occupied by another administrator!`);
            }
        }
        if (report.messages.length > 30) report.messages.splice(0, 1);
        report.messages.push(message);
        DB.Handle.query("INSERT INTO v2_reports_messages (reportId,playerId,name,text,date) VALUES (?,?,?,?,?)",
            [report.id, message.playerId, message.name, message.text, message.date], (e, result) => {
                message.id = result.insertId;
            });

        mp.players.forEach((rec) => {
            if (rec.sqlId && rec.admin) rec.call(`console.addReportMessage`, [report.id, message]);
            /*else */
            if (rec.sqlId == report.playerId) {
                // Send to report's owner.
                rec.utils.setReport('setNewMessage', {
                    reportId: report.id,
                    name: player.name,
                    serverId: player.id,
                    playerId: player.sqlId,
                    message: message.text,
                    date: Math.floor(Date.now() / 1000)
                });
            }
        });
    };
    report.setAdminId = (id) => {
        report.adminId = id;
        DB.Handle.query("UPDATE v2_reports SET adminId=? WHERE id=?", [id, report.id]);
        mp.players.forEach((rec) => {
            if (rec.sqlId && rec.admin) rec.call(`console.setReportAdminId`, [report.id, report.adminId]);
        });
    };
    report.setStatus = (status) => {
        report.status = status;
        DB.Handle.query("UPDATE v2_reports SET status=? WHERE id=?", [status, report.id]);
        mp.players.forEach((rec) => {
            if (rec.sqlId && rec.admin) rec.call(`console.removeReport`, [report.id]);
        });
        if (!report.status) delete mp.v2_reports[report.id];
    };
}

function initReportsUtils() {
    mp.v2_reportsUtils = {
        createClaim: (player, text) => {
            createReport("claim", player, text);
        },
        createHelp: (player, text) => {
            createReport("help", player, text);
        },
        unattachReports: (playerSqlId) => {
            for (var id in mp.v2_reports) {
                var report = mp.v2_reports[id];
                if (report.adminId == playerSqlId) report.setAdminId(0);
            }
        },
    };
}

function createReport(type, player, text) {
    var time = parseInt(new Date().getTime() / 1000);
    DB.Handle.query("INSERT INTO v2_reports (playerId,type,date) VALUES (?,?,?)", [player.sqlId, type, time], (e, result) => {
        if (e) return console.log(e);

        var report = {
            id: result.insertId,
            playerId: player.sqlId,
            adminId: 0,
            type: type,
            status: 1,
            date: time,
            messages: [],
        };
        mp.players.forEach((rec) => {
            if (rec.sqlId && rec.admin) rec.call(`console.pushReport`, [report]);
        });
        initReportUtils(report);
        mp.v2_reports[report.id] = report;

        report.pushMessage(player, text);

        // Send to report's owner.
        player.utils.setReport('setNewReport', {
            sqlId: report.id,
            reason: (report.type == "claim") ? "Complaint" : "Help",
            playerId: player.sqlId,
            adminId: null,
            updated_at: Math.floor(Date.now() / 1000),
            created_at: Math.floor(Date.now() / 1000),
            status: 0
        });
    });
}
