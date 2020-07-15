module.exports = {
    Init: () => {
        loadPedsFromDB();
        initPedsUtils();
    }
}

function loadPedsFromDB() {
    mp.dbPeds = [];
    DB.Handle.query("SELECT * FROM peds", (e, result) => {
        for (var i = 0; i < result.length; i++) {
            var p = result[i];
            p.sqlId = p.id;
            p.position = new mp.Vector3(p.x, p.y, p.z);
            p.heading = p.h;
            p.hash = mp.joaat(p.model);
            delete p.x;
            delete p.y;
            delete p.z;
            delete p.h;
            delete p.model;
            delete p.id;

            mp.dbPeds.push(p);
        }

        console.log(`Peds loaded: ${i} units.`);
    });
}

function initPedsUtils() {
    mp.dbPeds.getNear = (player) => {
        var nearPed;
        var minDist = 99999;
        for (var i = 0; i < mp.dbPeds.length; i++) {
            var ped = mp.dbPeds[i];
            var distance = player.dist(ped.position);
            if (distance < minDist) {
                nearPed = ped;
                minDist = distance;
            }
        }

        return nearPed;
    };
    mp.dbPeds.deletePed = (ped) => {
        var index = mp.dbPeds.indexOf(ped);
        if (index == -1) return;

        DB.Handle.query("DELETE FROM peds WHERE id=?", ped.sqlId);
        mp.dbPeds.splice(index, 1);

        mp.players.forEach((rec) => {
            if (rec.sqlId) rec.call(`peds.delete`, [ped.sqlId]);
        });
    };
}
