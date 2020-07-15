module.exports.Init = function(callback) {

    DB.Handle.query("SELECT * FROM economy", (e, result) => {
        mp.economy = {};
        for (var i = 0; i < result.length; i++) {
            mp.economy[result[i].key] = {
                key: result[i].key,
                value: result[i].value,
                description: result[i].description
            };
            initEconomyUtils(mp.economy[result[i].key]);
        }

        console.log(`Variable economies are loaded: ${i} units.`);
        callback();
    });
}

function initEconomyUtils(item) {
    item.setValue = (value) => {
        value = parseFloat(value);
        if (isNaN(value)) return;
        item.value = value;
        DB.Handle.query("UPDATE economy SET value=? WHERE `key`=?", [item.value, item.key]);
    };
}
