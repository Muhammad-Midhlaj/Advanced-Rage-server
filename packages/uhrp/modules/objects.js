module.exports = {
    Init: () => {
        loadObjectsFromDB();
        initObjectsUtils();
    }
}

function loadObjectsFromDB() {
    DB.Handle.query("SELECT * FROM objects", (e, result) => {
        for (var i = 0; i < result.length; i++) {
            var o = result[i];
            var pos = new mp.Vector3(o.x, o.y, o.z);
            var object = mp.objects.new(mp.joaat(o.model), pos, {
                rotation: new mp.Vector3(0, 0, o.h),
                alpha: 255,
            });
            object.sqlId = o.id;
            object.data = JSON.parse(o.data);
        }

        console.log(`Objects loaded: ${i} units.`);
    });
}

function initObjectsUtils() {
    mp.objects.save = (model, pos, heading, data = {}) => {
        //debug(`mp.objects.save: ${model} ${pos} ${heading} ${data}`);
        DB.Handle.query("INSERT INTO objects (model,x,y,z,h,data) VALUES (?,?,?,?,?,?)",
            [model, pos.x, pos.y, pos.z, heading, JSON.stringify(data)]);
    };
}
