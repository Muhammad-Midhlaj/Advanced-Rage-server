mp.events.add("peds.create", (list) => {
    // debug(`peds.create: ${JSON.stringify(list)}`)
    for (var i = 0; i < list.length; i++) {
        var ped = mp.peds.new(list[i].hash, list[i].position, list[i].heading);
        ped.sqlId = list[i].sqlId;
    }
});

mp.events.add("peds.delete", (pedSqlId) => {
    // debug(`peds.delete: ${pedSqlId}`)
    var ped = getPedBySqlId(pedSqlId);
    if (ped) ped.destroy();
});
