module.exports.Init = function() {
    mp.truckerData = {};

    initTruckerUtils();
    initLoadPoints();
    initLoadReceivers();
}

function initTruckerUtils() {
    mp.trucker = {
        getSkill: (exp) => {
            if (exp < 8) return {
                level: 1,
                rest: exp
            };
            if (exp >= 5096) return {
                level: 50,
                rest: exp - 5096
            };
            var i = 2;
            var add = 16;
            var temp = 20;
            while (i < 100000) {
                if (exp < temp) return {
                    level: i,
                    rest: exp - (temp - add + 4)
                };
                i++;
                temp += add;
                add += 4;
            }
            return -1;
        },
        getMaxLoad: (vehModel) => {
            var models = ["phantom", "packer", "hauler"];
            var index = models.indexOf(vehModel);
            if (index == -1) return 0;
            var maxLoads = [15, 30, 60];
            return maxLoads[index];
        },
        getMinLevel: (vehModel) => {
            var models = ["phantom", "packer", "hauler"];
            var index = models.indexOf(vehModel);
            if (index == -1) return 1;
            var levels = [1, 15, 25];
            return levels[index];
        },
        getTrailerModel: (loadType) => {
            var models = ["trailerlogs", "trailers", "tanker"];
            loadType = Math.clamp(loadType, 1, models.length);
            return models[loadType - 1];
        },
    };
}

function initLoadPoints() {
    mp.truckerData.loadPoints = [];

    var positions = [
        new mp.Vector3(-522.13, 5245.28, 78.68), new mp.Vector3(-797.59, 5411.85, 33.12),
        new mp.Vector3(300.4, 2893.21, 42.61), new mp.Vector3(989.76, -1961.37, 29.72),
        new mp.Vector3(2930.27, 4303.78, 49.63), new mp.Vector3(2717.1, 1422.49, 23.49)
    ];
    var loadTypes = [1, 1, 2, 2, 3, 3];
    var loadTypeNames = ["Дерево", "Дерево", "Уголь", "Уголь", "Нефть", "Нефть"];
    var prices = [40, 60, 40, 60, 40, 60];
    var trailerPositions = [
        new mp.Vector3(-515.42, 5242.60, 80.23), new mp.Vector3(-773, 5430.48, 36.37),
        new mp.Vector3(271.34, 2881.28, 43.61), new mp.Vector3(978.81, -1950.1, 30.9),
        new mp.Vector3(2929.03, 4327.05, 50.42), new mp.Vector3(2729.04, 1452.22, 24.5)
    ];
    var trailerHeadings = [70.1, 94.15, 299.56, 260.3, 197.04, 170.04];
    var blipColors = [43, 43, 47, 47, 67, 67];
    var blipNames = [`Sawmill #1`, `Sawmill #2`, `Coal mining #1`, `Coal mining #2`, `Oil refinery #1`, `Oil refinery #2`];
    for (var i = 0; i < positions.length; i++) {
        var pos = positions[i];

        var marker = mp.markers.new(1, pos, 1, {
            color: [0, 187, 255, 100],
            visible: false
        });

        marker.loadType = loadTypes[i];
        marker.loadTypeName = loadTypeNames[i];
        marker.price = prices[i];
        marker.trailerPos = trailerPositions[i];
        marker.trailerPos.h = trailerHeadings[i];

        var blip = mp.blips.new(479, pos, {
            color: blipColors[i],
            name: blipNames[i],
            scale: 0.7,
            shortRange: true
        });

        marker.label = mp.labels.new(`${loadTypeNames[i]}\n ~b~Тонна: ~w~${prices[i]}$`, new mp.Vector3(pos.x, pos.y, pos.z + 2), {
            los: true,
            font: 4,
            drawDistance: 30,
            color: [0, 187, 255, 255],
        });

        var colshape = mp.colshapes.newCircle(pos["x"], pos["y"], 60);
        colshape.marker = marker;

        //дл¤ отловки событи¤ входа в маркер
        var colshape = mp.colshapes.newSphere(pos["x"], pos["y"], pos["z"] + 1, 1); //+1 to fix bug
        colshape.truckerLoad = marker;
        colshape.menuName = "trucker_load";

        mp.truckerData.loadPoints.push(marker);
    }

}

function initLoadReceivers() {
    mp.truckerData.loadReceivers = [];

    var positions = [new mp.Vector3(528.45, -3048.61, 5.07), new mp.Vector3(-73.29, 6269.16, 30.37)];
    // var positions = [new mp.Vector3(-547, 5257, 73), new mp.Vector3(-73.29, 6269.16, 30.37)]; // test
    var prices = [
        [60, 40, 60],
        [40, 60, 40]
    ];
    var blips = [410, 270];
    var blipNames = [`Port`, `Factory (receiving cargo)`];

    for (var i = 0; i < positions.length; i++) {
        var pos = positions[i];
        var marker = mp.markers.new(1, pos, 4, {
            color: [0, 187, 255, 100],
            visible: false
        });
        marker.prices = prices[i];

        var blip = mp.blips.new(blips[i], pos, {
            color: 1,
            scale: 0.7,
            name: blipNames[i],
            shortRange: true
        });

        marker.label = mp.labels.new(`~g~Tree: ~w~${prices[i][0]}$\n ~y~Coal: ~w~${prices[i][1]}$\n ~b~Oil: ~w~${prices[i][2]}$`, new mp.Vector3(pos.x, pos.y, pos.z + 2), {
            los: true,
            font: 4,
            drawDistance: 30,
            color: [0, 187, 255, 255],
        });

        var colshape = mp.colshapes.newCircle(pos["x"], pos["y"], 60);
        colshape.marker = marker;

        //дл¤ отловки событи¤ входа в маркер
        colshape = mp.colshapes.newSphere(pos["x"], pos["y"], pos["z"] + 1, 15); //+1 to fix bug
        colshape.truckerReceiver = marker;

        mp.truckerData.loadReceivers.push(marker);
    }
}
