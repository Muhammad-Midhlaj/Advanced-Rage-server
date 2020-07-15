module.exports = {
    "trucker.buyTrailer": (player, count) => {
        //debug(`trucker.buyTrailer: ${player.name} ${count}`)
        count = Math.clamp(parseInt(count), 1, 50);
        if (!player.colshape || !player.colshape.truckerLoad) return player.utils.warning(`You need to be at the loading of the cargo!`);
        if (player.job != 5) return player.utils.error(`You are not a trucker!`);
        if (player.rentVehicleId == null) return player.utils.error(`Rent a wagon!`);
        var veh = mp.vehicles.at(player.rentVehicleId);
        if (!veh || -veh.owner != player.job) return player.utils.error(`The van has not been found!`);
        var dist = player.dist(veh.position);
        if (dist > 20) return player.utils.error(`Truck far away!`);

        var skill = mp.trucker.getSkill(player.jobSkills[5 - 1]);
        var maxLoad = mp.trucker.getMaxLoad(veh.name);
        if (count > maxLoad) return player.utils.error(`Maximum load capacity of the wagon ${maxLoad} tone!`);

        var maxPlayerLoad = 4 + skill.level;
        if (count > maxPlayerLoad) return player.utils.error(`The skills of your profession allow you to download no more ${maxPlayerLoad} tone!`);

        var truckerLoad = player.colshape.truckerLoad;

        var price = truckerLoad.price * count;
        if (player.money < price) return player.utils.error(`Need: ${price}$`);

        var isFind = false;
        mp.vehicles.forEachInRange(truckerLoad.trailerPos, 5, (veh) => {
            if (veh) isFind = true;
        });
        if (isFind) return player.utils.error(`Make room for the trailer!`);

        var now = parseInt(new Date().getTime() / 1000);
        if (player.nextBuyTrailer) {
            if (now < player.nextBuyTrailer) return player.utils.error(`The cargo is being prepared, expect ${player.nextBuyTrailer - now} seconds!`);
        }
        player.nextBuyTrailer = now + 7 * 60;

        var model = mp.trucker.getTrailerModel(truckerLoad.loadType);

        var trailer = mp.vehicles.new(mp.joaat(model), truckerLoad.trailerPos, {
            locked: false,
            engine: false
        });
        trailer.rotation = new mp.Vector3(0, 0, truckerLoad.trailerPos.h);
        trailer.loadType = truckerLoad.loadType;
        trailer.loadCount = count;

        player.utils.setMoney(player.money - price);
        player.utils.success(`Trailer bought!`);
        player.utils.info(`Cling trailer and go!`);

        // TODO: Игнорить мелкие лвлы для смены цены груза.
        if (true /*count / maxPlayerLoad > 0.8 && skill.level >= 15*/ ) {
            //изменяем цены
            truckerLoad.price += 10;
            if (truckerLoad.price > 90) truckerLoad.price = 90;
            truckerLoad.label.text = `${truckerLoad.loadTypeName}\n ~b~Tona: ~w~${truckerLoad.price}$`;
            for (var i = 0; i < mp.truckerData.loadPoints.length; i++) {
                var point = mp.truckerData.loadPoints[i];
                if (point.loadType == truckerLoad.loadType && point.id != truckerLoad.id) {
                    point.price -= 10;
                    if (point.price < 10) point.price = 10;
                    point.label.text = `${point.loadTypeName}\n ~b~Tona: ~w~${point.price}$`;
                }
            }
        }

    }
}
