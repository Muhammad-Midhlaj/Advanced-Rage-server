/*
Author: Solib aka Alex DeLarje
Project: UnionRP GTA V
URL: https://vk.com/unionrp

mp.parkings: data and methods

mp.parkings.getBySqlId[ParkingID]: select object parking
mp.parkings.delete[obj,callback]: delete object parking

mp.parkings.getBySqlId(ID).loadSlotData[]: load or update data for this parkings
mp.parkings.getBySqlId(ID).showMarker[]: show parking slots for debug
mp.parkings.getBySqlId(ID).hideMarker[]: hide parking slots for debug
*/

module.exports.Init = function() {
    DB.Handle.query("SELECT * FROM parking_city", (e, result) => {
        mp.parkings = [];
        initParkingsUtils();
        for (var i = 0; i < result.length; i++) {
            var park = mp.loadParking(result[i]);
            mp.parkings.push(park);
        }
        console.log(`Start downloading parking lots ${i} units.`);
        console.log(JSON.stringify(mp.parkings));
    });

    function initParkingsUtils() {

        mp.parkings.getBySqlId = (pid) => {
            if (!pid) return null;
            var result;
            mp.parkings.forEach((park) => {
                if (park.pid == pid) {
                    result = park;
                    return;
                }
            });
            return result;
        };

        mp.parkings.delete = (park, callback) => {
            var i = mp.parkings.indexOf(park);
            if (i == -1) return callback("Parking not found!");
            park.blip.destroy();
            DB.Handle.query("DELETE FROM parking_city WHERE id=?", park.pid);
            callback();
            delete park;
        };

    }

    function initParkUtils(park) {

        park.loadSlotData = () => {
            DB.Handle.query("SELECT * FROM parking_city_slots WHERE pid=?", [park.pid], (e, sresult) => {

                park.slotsData = [];

                for (var i = 0; i < sresult.length; i++) {
                    var slot = [];
                    slot.sid = sresult[i]['id'];
                    slot.cords = new mp.Vector3(JSON.parse(sresult[i]["cords"]));
                    park.slotsData.push(slot);
                }
                //закоментить перед релизом
                console.log(`Parking spots No.${ park.pid } Loaded: ${i} шт.`);

            });
        };

        park.deleteSlotData = (slotId) => {
            DB.Handle.query("DELETE FROM parking_city_slots WHERE id=?", slotId);
            park.loadSlotData();
        };

        park.updateParkData = (name,cords) => {
            park.name = name;
            park.cords = new mp.Vector3(JSON.parse(cords));
            park.blip.position = park.cords;
            DB.Handle.query(`UPDATE parking_city SET name=?,cords=? WHERE id=?`, [name, cords, park.pid]);
        };

        park.updateSlotData = (slotID,cords) => {
            for (var i = 0; i < park.slotsData.length; i++) {
                if(slotID === park.slotsData[i].sid){
                    var slot = [];
                    slot.sid = slotID;
                    slot.cords = new mp.Vector3(JSON.parse(cords));
                    park.slotsData[i] = slot;

                    DB.Handle.query(`UPDATE parking_city_slots SET cords=? WHERE id=?`, [cords, slotID]);
                }
            }

        };


        park.showMarker = () => {
            for (var slotShow in park.slotsData) {

                var data = park.slotsData[slotShow];
                var marker = mp.markers.new(1, new mp.Vector3(data.cords.x, data.cords.y, data.cords.z - 1), 0.75);
                marker.setColor(255, 0, 0, 75);

                var label = mp.labels.new("SlotID:"+data.sid, new mp.Vector3(data.cords.x, data.cords.y, data.cords.z+0.5),
                {
                    los: true,
                    font: 0,
                    drawDistance: 15,
                });

                park.markers.push([marker,label]);
            }
        };

        park.hideMarker = () => {
            for (var slotHide in park.markers) {

                var data = park.markers[slotHide];

                data[0].destroy();
                data[1].destroy();
            }
            park.markers = [];
        };

    }

    mp.loadParking = (data) => {
        var parking = [];
        parking.name = data['name'];
        parking.pid = data['id'];
        parking.cords =  new mp.Vector3(JSON.parse(data["cords"]));

        var blip = mp.blips.new(474, parking.cords, {
            color: [255, 0, 0, 1],
            name: "",
            shortRange: true,
            scale: 0.7
        });

        parking.blip = blip;
        parking.slotsData = [];
        parking.markers = [];
        initParkUtils(parking);
        parking.loadSlotData();

        return parking;
    }

}
