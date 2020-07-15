var cropObjects = {
    0xAA699BB6: [
        [
            ["prop_haybale_01", 5, 0.01, -2.88, -0.26, 0, 0, 90],
        ],
        [
            ["prop_haybale_01", 5, 0.01, -2.88, -0.26, 0, 0, 90],
            ["prop_haybale_01", 5, 0.27, -2, -0.26, 0, 0, 0],
        ],
        [
            ["prop_haybale_01", 5, 0.01, -2.88, -0.26, 0, 0, 90],
            ["prop_haybale_01", 5, 0.27, -2, -0.26, 0, 0, 0],
            ["prop_haybale_01", 5, -0.2, -2, -0.26, 0, 0, 0],
        ],
        [
            ["prop_haybale_01", 5, 0.01, -2.88, -0.26, 0, 0, 90],
            ["prop_haybale_01", 5, 0.27, -2, -0.26, 0, 0, 0],
            ["prop_haybale_01", 5, -0.2, -2, -0.26, 0, 0, 0],
            ["prop_haybale_01", 5, 0.01, -3.4, -0.26, 0, 0, 90],
        ],
        [
            ["prop_haybale_01", 5, 0.01, -2.88, -0.26, 0, 0, 90],
            ["prop_haybale_01", 5, 0.27, -2, -0.26, 0, 0, 0],
            ["prop_haybale_01", 5, -0.2, -2, -0.26, 0, 0, 0],
            ["prop_haybale_01", 5, 0.01, -3.4, -0.26, 0, 0, 90],
            ["prop_haybale_01", 5, 0.6, -2.6, 0.2, 0, 30, 0],
        ],
        [
            ["prop_haybale_01", 5, 0.01, -2.88, -0.26, 0, 0, 90],
            ["prop_haybale_01", 5, 0.27, -2, -0.26, 0, 0, 0],
            ["prop_haybale_01", 5, -0.2, -2, -0.26, 0, 0, 0],
            ["prop_haybale_01", 5, 0.01, -3.4, -0.26, 0, 0, 90],
            ["prop_haybale_01", 5, 0.6, -2.6, 0.2, 0, 30, 0],
            ["prop_haybale_01", 5, -0.53, -2.6, 0.2, 0, 150, 0],
            ["prop_haybale_01", 5, 0.01, -2.6, 0.3, 0, 0, 0],
            ["prop_haybale_01", 5, 0.03, -3.5, 0.3, 0, 0, 90],
        ],

    ],
    0xB802DD46: [
        [
            ["prop_haybale_01", 3, 0.13, -1.60, 0.1, 0, 0, 0],
        ],
        [
            ["prop_haybale_01", 3, 0.13, -1.60, 0.1, 0, 0, 0],
            ["prop_haybale_01", 3, 0.67, -1.60, 0.1, 0, 0, 0],
        ],
        [
            ["prop_haybale_01", 3, 0.13, -1.60, 0.1, 0, 0, 0],
            ["prop_haybale_01", 3, 0.67, -1.60, 0.1, 0, 0, 0],
            ["prop_haybale_01", 3, 0.4, -2.41, 0.1, 0, 0, 90],
        ],
        [
            ["prop_haybale_01", 3, 0.13, -1.60, 0.1, 0, 0, 0],
            ["prop_haybale_01", 3, 0.67, -1.60, 0.1, 0, 0, 0],
            ["prop_haybale_01", 3, 0.4, -2.41, 0.1, 0, 0, 90],
            ["prop_haybale_01", 3, 0.40, -1.3, 0.63, 0, 0, 90],
        ],
        [
            ["prop_haybale_01", 3, 0.13, -1.60, 0.1, 0, 0, 0],
            ["prop_haybale_01", 3, 0.67, -1.60, 0.1, 0, 0, 0],
            ["prop_haybale_01", 3, 0.4, -2.41, 0.1, 0, 0, 90],
            ["prop_haybale_01", 3, 0.40, -1.3, 0.63, 0, 0, 90],
            ["prop_haybale_01", 3, 0.75, -2.1, 0.63, 0, 0, 0],
            ["prop_haybale_01", 3, 0.1, -2.1, 0.63, 0, 0, 0],
        ],
        [
            ["prop_haybale_01", 3, 0.13, -1.60, 0.1, 0, 0, 0],
            ["prop_haybale_01", 3, 0.67, -1.60, 0.1, 0, 0, 0],
            ["prop_haybale_01", 3, 0.4, -2.41, 0.1, 0, 0, 90],
            ["prop_haybale_01", 3, 0.40, -1.3, 0.63, 0, 0, 90],
            ["prop_haybale_01", 3, 0.75, -2.1, 0.63, 0, 0, 0],
            ["prop_haybale_01", 3, 0.1, -2.1, 0.63, 0, 0, 0],
            ["prop_haybale_01", 3, 0.4, -2.1, 1.1, 0, 0, 0],
            ["prop_haybale_01", 3, 0.4, -1.2, 1.1, 0, 0, 90],
        ],
    ],
};

mp.events.addDataHandler("cropLoad", (entity) => {
    // debug(`cropLoad...`)
    if (entity.type != "vehicle") return;
    attachCropObjects(entity);
});

mp.events.add("entityStreamIn", (entity) => {
    if (entity.type != "vehicle") return;
    attachCropObjects(entity);
});

mp.events.add("entityStreamOut", (entity) => {
    if (entity.type != "vehicle") return;
    clearCropObjects(entity);
});

function attachCropObjects(vehicle) {
    if (!cropObjects[vehicle.model]) return;
    var cropLoad = Math.clamp(vehicle.getVariable("cropLoad"), 0, 6);
    clearCropObjects(vehicle);
    if (!cropLoad) return;
    var objects = cropObjects[vehicle.model][cropLoad - 1];
    for (var i = 0; i < objects.length; i++) {
        var o = objects[i];
        var obj = mp.objects.new(mp.game.joaat(o[0]), vehicle.position, {
            rotation: new mp.Vector3(0, 0, 30),
            dimension: -1
        });
        obj.attachTo(vehicle.handle, o[1], o[2], o[3], o[4], o[5], o[6], o[7],
            false, false, false, false, 2, true);

        vehicle.cropObjects.push(obj);
    }
}

function clearCropObjects(vehicle) {
    // debug(`clearCropObjects...`)
    if (!vehicle.cropObjects) vehicle.cropObjects = [];
    for (var i = 0; i < vehicle.cropObjects.length; i++) {
        var obj = vehicle.cropObjects[i];
        if (mp.objects.exists(obj)) obj.destroy();
    }
    vehicle.cropObjects = [];
}
