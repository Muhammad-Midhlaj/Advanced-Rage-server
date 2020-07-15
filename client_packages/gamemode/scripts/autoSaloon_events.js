const cameraRotator = require("gamemode/scripts/helpers/cameraRotator.js");

exports = (menu) => {

    auto = { model: null, color: null, entity: null };

    global.checkTestDrive = false;
    global.startTestDrive = 0;
    global.testVeh = null;
    global.bizId = null;
    const player = mp.players.local;

    setInterval(function () {
        if(checkTestDrive) {
            if(new Date().getTime() - startTestDrive > (1000*60)){
                checkTestDrive = false;
                mp.events.call("autoSaloon.setStatusMenu", true);
                mp.events.callRemote("autoSaloon.endTestDrive");
            }
            if(new Date().getTime() - startTestDrive > 2000) {
                if(!player.vehicle) {
                    checkTestDrive = false;
                    mp.events.call("autoSaloon.setStatusMenu", true);
                    mp.events.callRemote("autoSaloon.endTestDrive");
                }
            }
        }
    }, 1000);

    function createCam(x, y, z, rx, ry, rz, viewangle) {
        // camera = mp.cameras.new("Cam", {x, y, z}, {x: rx, y: ry, z: rz}, viewangle);
        camera = mp.cameras.new("default");
        camera.setCoord(x, y, z);
        camera.setRot(rx, ry, rz, 2);
        camera.setFov(viewangle);
        camera.setActive(true);
        
        const vehPosition = new mp.Vector3(-43.9, -1096.6, 26.1);

        cameraRotator.start(camera, vehPosition, vehPosition, new mp.Vector3(-3.0, 3.5, 0.5), 180);
        cameraRotator.setZBound(-0.8, 1.8);
        cameraRotator.setZUpMultipler(5);
        cameraRotator.pause(true);

        mp.game.cam.renderScriptCams(true, false, 3000, true, false);
    }

    mp.events.add('autoSaloon.openBuyerMenu', (data) => {
        //debug(`Test: ${JSON.stringify(data)}`);
        menu.execute(`mp.events.call('autoSaloon', { enable: ${true}, event: 'enable' })`);
        menu.execute(`mp.events.call('autoSaloon', { bizId: ${data.bizId}, event: 'bizId' })`);
        menu.execute(`mp.events.call('autoSaloon', { catalogData: ${JSON.stringify(data.vehicles)}, event: 'catalogData' })`);
        menu.execute(`mp.events.call('autoSaloon', { colorSelect: ${JSON.stringify(data.colorsCFG)}, event: 'colorSelect' })`);
        menu.execute(`mp.events.call('autoSaloon', { dim: ${data.dim}, event: 'dim' })`);
        createCam(-48.1, -1099.7, 26.5, 0, 0, 308, 60);
        mp.game.ui.displayRadar(false);
    });

    mp.events.add('item.fixCarByKeys', (sqlId) => {
        var Data = mp.game.pathfind.getClosestVehicleNodeWithHeading(mp.players.local.position.x, mp.players.local.position.y, mp.players.local.position.z, new mp.Vector3(-3.0, 3.5, 0.5), 1, 5, 3.0, 0);
        var outPosition = JSON.stringify(Data.outPosition);
        var outHeading = JSON.stringify(Data.outHeading);
        mp.events.callRemote("item.fixCarByKeys", sqlId, outPosition, outHeading);
    });

    mp.events.add('autoSaloon.deleteVehicle', () => {
        cameraRotator.stop();
        if(auto.entity !== null) {
            auto.entity.destroy();
            auto = { model: null, color: null, entity: null };
        }
    });

    mp.events.add('autoSaloon.setStatusMenu', (enable) => {
        if(enable === true) {
            createCam(-48.1, -1099.7, 26.5, 0, 0, 308, 60);
            mp.game.ui.displayRadar(false);
            menu.execute(`mp.events.call('autoSaloon', { enable: ${true}, event: 'enable' })`);
        } else {
            mp.game.ui.displayRadar(true);
            menu.execute(`mp.events.call('autoSaloon', { enable: ${false}, event: 'enable' })`);
        }
    });

    mp.events.add('autoSaloon.showCar', (car, dim) => {
        let carData = JSON.parse(car);
        
        if(auto.entity !== null) {
            auto.entity.model = mp.game.joaat(carData.model);
            auto.entity.position = new mp.Vector3(-43.9, -1096.6, 26.1);
            auto.entity.setOnGroundProperly();
            auto.entity.setRotation(0, 0, 180, 2, true);
            auto.entity.setColours(144, 0);
        } else {
            auto.entity = mp.vehicles.new(mp.game.joaat(carData.model), new mp.Vector3(-43.9, -1096.6, 26.1),
            {
                heading: 0,
                numberPlate: 'CARROOM',
                locked: true,
                engine: false,
                dimension: dim
            });

            auto.entity.setColours(144, 0);

            auto.entity.setOnGroundProperly();
            auto.entity.setRotation(0, 0, 180, 2, true);
        }

        cameraRotator.pause(false);
        
        let paramsCar = {
            maxSpeed: mp.game.vehicle.getVehicleModelMaxSpeed(mp.game.joaat(carData.model)), 
            braking: (mp.game.vehicle.getVehicleModelMaxBraking(mp.game.joaat(carData.model)) * 100).toFixed(2), 
            acceleration: (mp.game.vehicle.getVehicleModelAcceleration(mp.game.joaat(carData.model)) * 100).toFixed(2), 
            controllability: mp.game.vehicle.getVehicleModelMaxTraction(mp.game.joaat(carData.model)).toFixed(2),
            //classCar: auto.entity.getClass(),
            maxPassagersCar: mp.game.vehicle.getVehicleModelMaxNumberOfPassengers(mp.game.joaat(carData.model)),
            maxSpeedKm: ((mp.game.vehicle.getVehicleModelMaxSpeed(mp.game.joaat(carData.model)) * 3.6).toFixed(0)), 
        }

        menu.execute(`mp.events.call('autoSaloon', { selectCarParam: ${JSON.stringify(paramsCar)}, event: 'selectCarParam' })`);

    });

    mp.events.add('autoSaloon.testDriveStart', () => {
        cameraRotator.pause(true);
        startTestDrive = new Date().getTime();
        checkTestDrive = true;
        mp.events.call("autoSaloon.setStatusMenu", false);
    });

    mp.events.add('autoSaloon.setActive', (enable) => {
        mp.autoSaloonActive = enable;
    });

    mp.events.add('autoSaloon.updateColor', (data) => {
        let colorData = JSON.parse(data);
        auto.entity.setColours(colorData.sqlId, 0);
    });

    mp.events.add('autoSaloon.destroyCam', () => {
        cameraRotator.stop();
        if (!camera) return;
        camera.setActive(false);
        mp.game.cam.renderScriptCams(false, false, 3000, true, false);
        camera.destroy();
        camera = null;
	});
}
