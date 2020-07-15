module.exports = {
    Init: () => {
        DB.Handle.query("SELECT * FROM markers_tp", (e, result) => {
            for (var i = 0; i < result.length; i++) {

                createTpMarker(result[i]);
            }

            console.log(`TP-Markers loaded: ${i} units.`);
        });
    }
}

global.createTpMarker = (data) => {
    var pos = new mp.Vector3(data.x, data.y, data.z);
    var tpPos = new mp.Vector3(data.tpX, data.tpY, data.tpZ);
    var marker = mp.markers.new(1, pos, 1, {
        color: [187, 255, 0, 70],
        visible: false
    });
    marker.h = data.h;
    marker.sqlId = data.id;

    var targetMarker = mp.markers.new(1, tpPos, 1, {
        color: [187, 255, 0, 70],
        visible: false
    });
    targetMarker.h = data.tpH;
    targetMarker.sqlId = data.id;

    //для стриминга
    var colshape = mp.colshapes.newCircle(pos.x, pos.y, 60);
    colshape.marker = marker;
    marker.showColshape = colshape;

    //для отловки события входа
    var colshape = mp.colshapes.newSphere(pos.x, pos.y, pos.z, 2);
    colshape.tpMarker = marker;
    colshape.targetMarker = targetMarker;
    marker.colshape = colshape;


    //для стриминга
    var colshape = mp.colshapes.newCircle(tpPos.x, tpPos.y, 60);
    colshape.marker = targetMarker;
    targetMarker.showColshape = colshape;

    //для отловки события входа
    var colshape = mp.colshapes.newSphere(tpPos.x, tpPos.y, tpPos.z, 2);
    colshape.tpMarker = targetMarker;
    colshape.targetMarker = marker;
    targetMarker.colshape = colshape;
}
