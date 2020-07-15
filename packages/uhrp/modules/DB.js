var mysql = require('mysql');

module.exports = {
    Handle: null,
    Connect: function(callback) {
        this.Handle = mysql.createPool({
            connectionLimit: 100,
            host: 'localhost', //173.212.237.12
            user: 'uth_cub',
            password: 'IpqRxqxB', 
            database: 'xdev',
            debug: false,
        });
        callback();
    },
    Characters: {
        getSqlIdByName: (name, callback) => {
            DB.Handle.query("SELECT id FROM characters WHERE name=?", [name], (e, result) => {
                if (result.length > 0) callback(result[0].id);
                else callback(0);
            });
        }
    }
};
