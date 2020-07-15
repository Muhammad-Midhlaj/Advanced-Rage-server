module.exports = {
    Init: () => {
        mp.cutscenes = {};
        DB.Handle.query("SELECT * FROM cutscenes", (e, result) => {
            for (var i = 0; i < result.length; i++) {
                result[i].points = [];
                mp.cutscenes[result[i].id] = result[i];
                initCutsceneUtils(result[i]);
            }
            console.log(`Cutscenes loaded: ${i} units.`);

            DB.Handle.query("SELECT * FROM cutscenes_points", (e, result) => {
                for (var i = 0; i < result.length; i++) {
                    var point = result[i];
                    point.startPosition = JSON.parse(result[i].startPosition);
                    point.endPosition = JSON.parse(result[i].endPosition);
                    point.startRotation = JSON.parse(result[i].startRotation);
                    point.endRotation = JSON.parse(result[i].endRotation);

                    var cutscene = mp.cutscenes[point.cutsceneId];
                    cutscene.points.push(point);
                }
            });
        });
    }
}

function initCutsceneUtils(cutscene) {
    cutscene.setName = (name) => {
        cutscene.name = name;
        DB.Handle.query("UPDATE cutscenes SET name=? WHERE id=?", [cutscene.name, cutscene.id]);
    };
    cutscene.setFinalText = (text) => {
        cutscene.finalText = text;
        DB.Handle.query("UPDATE cutscenes SET finalText=? WHERE id=?", [cutscene.finalText, cutscene.id]);
    };
    cutscene.setPointText = (index, text) => {
        index = Math.clamp(index, 0, cutscene.points.length - 1);
        var p = cutscene.points[index];
        if (!p) return;
        p.text = text;
        DB.Handle.query("UPDATE cutscenes_points SET text=? WHERE id=?", [p.text, p.id]);
    };
    cutscene.setPointSpeed = (index, speed) => {
        index = Math.clamp(index, 0, cutscene.points.length - 1);
        var p = cutscene.points[index];
        if (!p) return;
        p.speed = Math.clamp(speed, 1, 50);
        DB.Handle.query("UPDATE cutscenes_points SET speed=? WHERE id=?", [p.speed, p.id]);
    };
    cutscene.setPointStartPositon = (index, pos) => {
        index = Math.clamp(index, 0, cutscene.points.length - 1);
        var p = cutscene.points[index];
        if (!p) return;
        p.startPosition = pos;
        DB.Handle.query("UPDATE cutscenes_points SET startPosition=? WHERE id=?", [JSON.stringify(p.startPosition), p.id]);
    };
    cutscene.setPointEndPositon = (index, pos) => {
        index = Math.clamp(index, 0, cutscene.points.length - 1);
        var p = cutscene.points[index];
        if (!p) return;
        p.endPosition = pos;
        DB.Handle.query("UPDATE cutscenes_points SET endPosition=? WHERE id=?", [JSON.stringify(p.endPosition), p.id]);
    };
    cutscene.setPointStartRotation = (index, rot) => {
        index = Math.clamp(index, 0, cutscene.points.length - 1);
        var p = cutscene.points[index];
        if (!p) return;
        p.startRotation = rot;
        DB.Handle.query("UPDATE cutscenes_points SET startRotation=? WHERE id=?", [JSON.stringify(p.startRotation), p.id]);
    };
    cutscene.setPointEndRotation = (index, rot) => {
        index = Math.clamp(index, 0, cutscene.points.length - 1);
        var p = cutscene.points[index];
        if (!p) return;
        p.endRotation = rot;
        DB.Handle.query("UPDATE cutscenes_points SET endRotation=? WHERE id=?", [JSON.stringify(p.endRotation), p.id]);
    };
    cutscene.addPoint = (speed, text) => {
        speed = Math.clamp(speed, 1, 50);
        DB.Handle.query("INSERT INTO cutscenes_points (speed,text,cutsceneId) VALUES (?,?,?)",
            [speed, text, cutscene.id], (e, result) => {
                var point = {
                    id: result.insertId,
                    startPosition: new mp.Vector3(0, 0, 0),
                    endPosition: new mp.Vector3(0, 0, 0),
                    startRotation: new mp.Vector3(0, 0, 0),
                    endRotation: new mp.Vector3(0, 0, 0),
                    speed: speed,
                    text: text,
                    cutsceneId: cutscene.id
                };
                cutscene.points.push(point);
            });
    };
    cutscene.deletePoint = (index) => {
        index = Math.clamp(index, 0, cutscene.points.length - 1);
        var p = cutscene.points[index];
        if (!p) return;
        DB.Handle.query("DELETE FROM cutscenes_points WHERE id=?", p.id);
        cutscene.points.splice(index, 1);
    };
}
