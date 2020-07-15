module.exports.Init = function() {
    DB.Handle.query("SELECT * FROM garages", function(e, result) {
        mp.garages = [];
        initGaragesUtils();

        for (var i = 0; i < result.length; i++) {
            mp.garages[i] = result[i];
            mp.garages[i]["slots"] = JSON.parse(mp.garages[i]["slots"]);

            var pos = new mp.Vector3(result[i]["x"], result[i]["y"], result[i]["z"] - 1);
            mp.garages[i].exitMarker = createExitMarker(pos);
            initGarageUtils(mp.garages[i]);
        }

        console.log(`Garages loaded: ${i} units.`);
    });
}

function initGaragesUtils() {
    mp.garages.getBySqlId = (sqlId) => {
        if (!sqlId) return null;
        var result;
        mp.garages.forEach((garage) => {
            if (garage.id === sqlId) {
                result = garage;
                return;
            }
        });
        return result;
    }
}

function initGarageUtils(garage) {
    garage.setEnter = (pos) => {
        garage.x = pos.x;
        garage.y = pos.y;
        garage.z = pos.z;
        garage.h = pos.h;
        DB.Handle.query(`UPDATE garages SET x=?,y=?,z=?,h=? WHERE id=?`,
            [pos.x, pos.y, pos.z, pos.h, garage.id]);
    }
}

function createExitMarker(pos) {
    /*var exitMarker = mp.markers.new(1, pos, 1,
    	{
    		color: [0,187,255,70],
    		visible: false,
    		dimension: -1
    	});*/
    //для отловки события входа
    var colshape = mp.colshapes.newSphere(pos["x"], pos["y"], pos["z"], 2);
    colshape.dimension = -1;
    colshape.menuName = "exit_garage";

    return exitMarker;
}
