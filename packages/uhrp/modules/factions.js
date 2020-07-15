module.exports = {
    Init: () => {
        mp.factions = [];
        mp.factionRanks = {};
        initFactionsUtils();
        DB.Handle.query("SELECT * FROM factions", (e, result) => {
            for (var i = 0; i < result.length; i++) {
                result[i].sqlId = result[i].id;
                delete result[i].id;

                var marker = mp.createFactionMarker(result[i]);
                marker.warehouse = mp.createWarehouseMarker(result[i]);
                marker.storage = mp.createStorageMarker(result[i]);
                mp.factions.push(marker);
            }
            console.log(`Organizations loaded: ${i} units.`);


            mp.factions.forEach((faction) => {
                mp.factionRanks[faction.sqlId] = [];
            });
            DB.Handle.query("SELECT * FROM faction_ranks", (e, result) => {
                for (var i = 0; i < result.length; i++) {
                    mp.factionRanks[result[i].factionId][result[i].rank] = result[i];
                    delete result[i].id;
                    delete result[i].factionId;
                    delete result[i].rank;
                }
                console.log(`Ranks loaded: ${i} units.`);
            });
            initFactionProductsMarkers();
            initFactionServiceMarkers();
        });

    }
}

function initFactionsUtils() {
    mp.factions.getBySqlId = (sqlId) => {
        if (!sqlId) return null;
        sqlId = Math.clamp(sqlId, 1, mp.factions.length);
        var result;
        mp.factions.forEach((faction) => {
            if (faction.sqlId == sqlId) {
                result = faction;
                return;
            }
        });
        return result;
    };
    mp.factions.getRankName = (factionId, rank) => {
        factionId = Math.clamp(factionId, 1, mp.factions.length);
        rank = Math.clamp(rank, 1, mp.factionRanks[factionId].length - 1);
        return mp.factionRanks[factionId][rank].name;
    };
    mp.factions.getRankPay = (factionId, rank) => {
        factionId = Math.clamp(factionId, 1, mp.factions.length);
        rank = Math.clamp(rank, 1, mp.factionRanks[factionId].length - 1);
        return mp.factionRanks[factionId][rank].pay;
    };
    mp.factions.setRankName = (factionId, rank, name) => {
        factionId = Math.clamp(factionId, 1, mp.factions.length);
        rank = Math.clamp(rank, 1, mp.factionRanks[factionId].length - 1);
        mp.factionRanks[factionId][rank].name = name;
        DB.Handle.query("UPDATE faction_ranks SET name=? WHERE factionId=? AND rank=?", [name, factionId, rank]);
    };
    mp.factions.setRankPay = (factionId, rank, pay) => {
        factionId = Math.clamp(factionId, 1, mp.factions.length);
        rank = Math.clamp(rank, 1, mp.factionRanks[factionId].length - 1);
        pay = Math.clamp(pay, 0, 20000);
        mp.factionRanks[factionId][rank].pay = pay;
        DB.Handle.query("UPDATE faction_ranks SET pay=? WHERE factionId=? AND rank=?", [pay, factionId, rank]);
    };
    mp.factions.isPoliceFaction = (factionId) => {
        return factionId == 2 || factionId == 3;
    };
    mp.factions.isFibFaction = (factionId) => {
        return factionId == 4;
    };
    mp.factions.isArmyFaction = (factionId) => {
        return factionId == 6 || factionId == 7;
    };
    mp.factions.isHospitalFaction = (factionId) => {
        return factionId == 5;
    };
}

function initFactionUtils(faction) {
    faction.setName = (name) => {
        faction.name = name;
        //faction.blip.name = faction.name;
        DB.Handle.query("UPDATE factions SET name=? WHERE id=?", [faction.name, faction.sqlId]);
    };
    faction.setLeader = (sqlId, name) => {
        //debug(`faction.setLeader: ${sqlId} ${name}`);
        if (sqlId < 1) {
            sqlId = 0;
            name = "";
        } else {
            for (var i = 0; i < mp.factions.length; i++) {
                var f = mp.factions[i];
                if (f.sqlId != faction.sqlId && f.leader && f.leader == sqlId) {
                    f.setLeader(0);
                }
            }
        }

        if (faction.leader > 0) {
            var leader = mp.players.getBySqlId(faction.leader);
            if (leader) leader.utils.setFaction(0);
            else DB.Handle.query("UPDATE characters SET faction=?,rank=? WHERE id=?", [0, 0, faction.leader]);
            mp.fullDeleteItemsByFaction(faction.leader, faction.sqlId);
        }
        //todo init maxRank for faction leader
        var player = mp.players.getBySqlId(sqlId);
        if (player) player.utils.setFaction(faction.sqlId, mp.factionRanks[faction.sqlId].length - 1);
        else DB.Handle.query("UPDATE characters SET faction=?,rank=? WHERE id=?", [faction.sqlId, mp.factionRanks[faction.sqlId].length - 1, sqlId]);

        faction.leader = sqlId;
        faction.leaderName = name;
        DB.Handle.query("UPDATE factions SET leader=?,leaderName=? WHERE id=?", [sqlId, name, faction.sqlId]);
    };
    faction.setProducts = (products) => {
        faction.products = Math.clamp(products, 0, faction.maxProducts);
        DB.Handle.query("UPDATE factions SET products=? WHERE id=?", [faction.products, faction.sqlId]);
    };
    faction.setMaxProducts = (maxProducts) => {
        if (maxProducts < 1) maxProducts = 1;
        faction.maxProducts = maxProducts;
        DB.Handle.query("UPDATE factions SET maxProducts=? WHERE id=?", [faction.maxProducts, faction.sqlId]);
    };
    faction.setBlipColor = (blipColor) => {
        if (blipColor < 1) blipColor = 1;
        faction.blip.color = blipColor;
        DB.Handle.query("UPDATE factions SET blipColor=? WHERE id=?", [blipColor, faction.sqlId]);
    };
    faction.setPosition = (pos, heading) => {
        pos.z -= 1.5;
        faction.position = pos;
        pos.z += 1.5;
        faction.blip.position = pos;
        faction.h = heading;

        /* It desn't work */
        //faction.showColshape.position = pos;
        //faction.colshape.position = pos;

        faction.showColshape.destroy();
        faction.colshape.destroy();

        //для стриминга игрокам, которые в радиусе
        faction.showColshape = mp.colshapes.newCircle(faction.position.x, faction.position.y, 60);
        faction.showColshape.marker = faction;

        //для отловки события входа
        faction.colshape = mp.colshapes.newSphere(faction.position.x, faction.position.y, faction.position.z, 2);
        faction.colshape.faction = faction;
        //faction.colshape.menuName = `enter_biz_${biz.bizType}`;

        DB.Handle.query("UPDATE factions SET x=?,y=?,z=?,h=? WHERE id=?", [pos.x, pos.y, pos.z, faction.h, faction.sqlId]);
    };
    faction.setWarehousePosition = (pos) => {
        if (!faction.warehouse) return;
        var warehouse = faction.warehouse;
        pos.z -= 1.5;
        warehouse.position = pos;
        pos.z += 1.5;


        /* It desn't work */
        //faction.showColshape.position = pos;
        //faction.colshape.position = pos;

        warehouse.showColshape.destroy();
        warehouse.colshape.destroy();

        //для стриминга игрокам, которые в радиусе
        warehouse.showColshape = mp.colshapes.newCircle(warehouse.position.x, warehouse.position.y, 60);
        warehouse.showColshape.marker = warehouse;

        //для отловки события входа
        warehouse.colshape = mp.colshapes.newSphere(warehouse.position.x, warehouse.position.y, warehouse.position.z, 2);
        warehouse.colshape.warehouse = warehouse;
        //faction.colshape.menuName = `enter_biz_${biz.bizType}`;

        DB.Handle.query("UPDATE factions SET wX=?,wY=?,wZ=? WHERE id=?", [pos.x, pos.y, pos.z, faction.sqlId]);
    };
    faction.setStoragePosition = (pos) => {
        if (!faction.storage) return;
        var storage = faction.storage;
        pos.z -= 1.5;
        storage.position = pos;
        pos.z += 1.5;


        /* It desn't work */
        //faction.showColshape.position = pos;
        //faction.colshape.position = pos;

        storage.showColshape.destroy();
        storage.colshape.destroy();

        //для стриминга игрокам, которые в радиусе
        storage.showColshape = mp.colshapes.newCircle(storage.position.x, storage.position.y, 60);
        storage.showColshape.marker = storage;

        //для отловки события входа
        storage.colshape = mp.colshapes.newSphere(storage.position.x, storage.position.y, storage.position.z, 2);
        storage.colshape[propNames[faction.sqlId - 1]] = storage;
        storage.colshape.menuName = menuNames[faction.sqlId - 1];

        DB.Handle.query("UPDATE factions SET sX=?,sY=?,sZ=? WHERE id=?", [pos.x, pos.y, pos.z, faction.sqlId]);
    };
}

mp.createFactionMarker = (data) => {
    var pos = new mp.Vector3(data["x"], data["y"], data["z"] - 1);
    pos.z -= 0.5;

    var marker = mp.markers.new(1, pos, 1, {
        color: [255, 187, 0, 0],
        visible: false,
    });

    var keys = ["sqlId", "name", "leader", "leaderName", "products", "maxProducts", "h"];
    keys.forEach((key) => {
        marker[key] = data[key];
    });

    initFactionUtils(marker);

    //if (data["vehX"] == 0 && data["vehY"] == 0) color = 67;
    var blip = mp.blips.new(data.blip, pos, {
        color: data.blipColor,
        name: data.name,
        shortRange: 10,
        scale: 0.7
    });

    marker.blip = blip;

    //для стриминга для игроков, которые в радиусе
    var colshape = mp.colshapes.newCircle(pos["x"], pos["y"], 60);
    colshape.marker = marker;
    marker.showColshape = colshape;

    //для отловки события входа
    var colshape = mp.colshapes.newSphere(pos["x"], pos["y"], pos["z"], 2);
    colshape.faction = marker;
    marker.colshape = colshape;
    //colshape.menuName = `enter_biz_${data.bizType}`;

    return marker;
}

mp.createWarehouseMarker = (data) => {
    // Склады с товаром у организаций.
    var pos = new mp.Vector3(data.wX, data.wY, data.wZ - 1);
    pos.z -= 0.5;
    var warehouseMarker = mp.markers.new(1, pos, 1, {
        color: [0, 187, 255, 70],
        visible: false,
    });
    warehouseMarker.faction = data.sqlId;

    //для стриминга
    var colshape = mp.colshapes.newCircle(pos.x, pos.y, 60);
    colshape.marker = warehouseMarker;
    warehouseMarker.showColshape = colshape;

    //для отловки события входа
    var colshape = mp.colshapes.newSphere(pos.x, pos.y, pos.z, 2);
    colshape.warehouse = warehouseMarker;
    warehouseMarker.colshape = colshape;

    return warehouseMarker;
}

var menuNames = ['gover_storage', 'police_storage', 'police_storage_2', 'fib_storage', 'hospital_storage', 'army_storage',
    'army_storage_2', 'news_storage', 'band_storage', 'band_storage', 'band_storage', 'band_storage', 'band_storage',
    'mafia_storage', 'mafia_storage', 'mafia_storage', 'mafia_storage', 'biker_storage', 'biker_storage'
];
var propNames = ['goverStorage', 'policeStorage', 'policeStorage', 'fibStorage', 'hospitalStorage',
    'armyStorage', 'armyStorage', 'newsStorage', 'bandStorage', 'bandStorage', 'bandStorage', 'bandStorage', 'bandStorage',
    'mafiaStorage', 'mafiaStorage', 'mafiaStorage', 'mafiaStorage', 'bikerStorage', 'bikerStorage'
];
mp.createStorageMarker = (data) => {
    /* Выдача предметов организаций. */

    var pos = new mp.Vector3(data.sX, data.sY, data.sZ - 1);
    pos.z -= 0.5;
    var storageMarker = mp.markers.new(1, pos, 1, {
        color: [0, 187, 255, 70],
        visible: false,
    });
    storageMarker.faction = data.sqlId;

    //для стриминга
    var colshape = mp.colshapes.newCircle(pos.x, pos.y, 60);
    colshape.marker = storageMarker;
    storageMarker.showColshape = colshape;

    //для отловки события входа
    var colshape = mp.colshapes.newSphere(pos.x, pos.y, pos.z, 2);
    colshape[propNames[data.sqlId - 1]] = storageMarker;
    storageMarker.colshape = colshape;
    colshape.menuName = menuNames[data.sqlId - 1];

    return storageMarker;
}

function initFactionProductsMarkers() {
    // Маркеры, где можно взять товары для организаций.
    var models = ['prop_box_ammo04a', 'prop_box_ammo04a', 'prop_box_ammo04a', 'prop_box_ammo04a', 'ex_office_swag_pills4',
        'prop_box_ammo04a', 'prop_box_ammo04a', 'prop_box_ammo04a', 'prop_box_ammo04a', 'prop_box_ammo04a', 'prop_box_ammo04a',
        'prop_box_ammo04a', 'prop_box_ammo04a', 'prop_box_ammo04a', 'prop_box_ammo04a', 'prop_box_ammo04a', 'prop_box_ammo04a',
        'prop_box_ammo04a', 'prop_box_ammo04a'
    ];

    // Организации, который могут брать маты с бесконечного склада.
    var factionIds = [
        [5, 6, 7],
        [6, 7],
        [7],
    ];
    var positions = [new mp.Vector3(3607.36, 3720.41, 29.69), new mp.Vector3(1248.69, -3017.11, 9.32), new mp.Vector3(3108.95, -4818.94, 15.26)];
    var blips = [153, 473, 473];
    var blipNames = [`Medicines`, `Ammunition`, `Ammunition`];

    for (var i = 0; i < positions.length; i++) {
        var pos = positions[i];
        pos.z -= 1.5;
        var marker = mp.markers.new(1, pos, 2, {
            color: [0, 187, 255, 70],
            visible: false,
        });
        marker.factionIds = factionIds[i];
        marker.modelName = models[marker.factionIds[0] - 1];

        //для стриминга
        var colshape = mp.colshapes.newCircle(pos.x, pos.y, 60);
        colshape.marker = marker;
        marker.showColshape = colshape;

        //для отловки события входа
        var colshape = mp.colshapes.newSphere(pos.x, pos.y, pos.z, 2);
        colshape.factionProducts = marker;
        marker.colshape = colshape;

        marker.blip = mp.blips.new(blips[i], pos, {
            color: 1,
            name: blipNames[i],
            shortRange: 10,
            scale: 0.7
        });
    }

}

/* Иниц. услуг организации, доступных для игроков. */
function initFactionServiceMarkers() {

    var positions = [new mp.Vector3(441.07, -981.72, 30.69), new mp.Vector3(-447.20, 6013.94, 31.72)];
    var menuNames = ["police_service", "police_service_2"];

    for (var i = 0; i < positions.length; i++) {
        var pos = positions[i];
        pos.z -= 1.5;
        var marker = mp.markers.new(1, pos, 1, {
            color: [0, 187, 255, 70],
            visible: false,
        });

        //для стриминга
        var colshape = mp.colshapes.newCircle(pos.x, pos.y, 60);
        colshape.marker = marker;
        marker.showColshape = colshape;

        //для отловки события входа
        var colshape = mp.colshapes.newSphere(pos.x, pos.y, pos.z, 2);
        colshape.factionService = marker;
        colshape.menuName = menuNames[i];
        marker.colshape = colshape;
    }
}
