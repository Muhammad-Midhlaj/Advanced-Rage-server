module.exports = {
    Init: () => {
        mp.reports = {
            reports: [],
            messages: []
        }

        initReportUtils();

        DB.Handle.query("SELECT * FROM reports", (e, result) => {
            for (var i = 0; i < result.length; i++) {
                mp.reports.reports[result[i].id - 1] = result[i];
                result[i].sqlId = result[i].id;
                delete result[i].id;
            }
        });

        DB.Handle.query("SELECT * FROM reports_messages", (e, result) => {
            for (var i = 0; i < result.length; i++) {
                mp.reports.messages[result[i].id - 1] = result[i];
                delete result[i].id;
            }
        });

        function initReportUtils() {
            mp.reports.messages.getArrayBySqlId = (sqlId) => {
                if (!owner) return [];
                var array = [];
                mp.reports.messages.forEach((message) => {
                    if (message.reportId == sqlId) {
                        array.push(message);
                    }
                });
                return array;
            };
        }
    }
}