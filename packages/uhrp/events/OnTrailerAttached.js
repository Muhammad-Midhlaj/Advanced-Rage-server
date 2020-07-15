module.exports = {
    "trailerAttached": (vehicle, trailer) => {
        // debug(`trailerAttached ${vehicle.name} ${trailer}`);
        if (!vehicle.player) return;
        var player = vehicle.player;
        if (player.job == 5) { //дальнобойщик
            if (trailer) { //прицепили прицеп
                if (!trailer.loadCount) return player.utils.error(`Trailer empty!`);
                var maxLoad = mp.trucker.getMaxLoad(vehicle.name);
                vehicle.trailerId = trailer.id;
                player.utils.success(`Cargo attached!`);
                player.utils.info(`Uploaded: ${trailer.loadCount}/${maxLoad} Tons`);
            } else { //отцепили прицеп
                player.utils.success(`Cargo disconnected!`);
                if (!player.colshape || !player.colshape.truckerReceiver) return player.utils.warning(`To sell the goods, you need to unload at the place of receiving the goods`);

                var now = parseInt(new Date().getTime() / 1000);
                if (player.nextBuyTrailer) {
                    if (now < player.nextBuyTrailer) return vehicle.player.utils.error(`There's no room in the warehouse, expect ${player.nextBuyTrailer - now} seconds!`);
                }
                player.nextBuyTrailer = now + 7 * 60;

                var marker = player.colshape.truckerReceiver;
                var trailer = mp.vehicles.at(vehicle.trailerId);
                if (!trailer) return player.utils.error(`No trailer found!`);
                console.log(`trailer`)
                console.log(`${trailer}`)
                var price = marker.prices[trailer.loadType - 1] * trailer.loadCount;
                player.utils.setMoney(player.money + price);
                player.utils.success(`The product is sold for ${price}$`);

                var exp = player.jobSkills[5 - 1];
                var oldLevel = mp.trucker.getSkill(exp).level;
                player.utils.setJobSkills(5, exp + trailer.loadCount);
                var newLevel = mp.trucker.getSkill(exp + trailer.loadCount).level;
                if (oldLevel != newLevel) player.utils.info(`Your trucker skill has improved!`);

                trailer.destroy();

                var skill = mp.trucker.getSkill(0);
                var maxPlayerLoad = 4 + skill.level;
                // TODO: Игнорить мелкие лвлы для смены цены груза.
                if (true /*trailer.loadCount / maxPlayerLoad > 0.8 && skill.level >= 15*/ ) {
                    //изменяем цены
                    marker.prices[trailer.loadType - 1] -= 10;
                    if (marker.prices[trailer.loadType - 1] < 10) marker.prices[trailer.loadType - 1] = 10;
                    marker.label.text = `~g~Tree: ~w~${marker.prices[0]}$\n ~y~Coal: ~w~${marker.prices[1]}$\n ~b~Oil: ~w~${marker.prices[2]}$`;
                    for (var i = 0; i < mp.truckerData.loadReceivers.length; i++) {
                        var point = mp.truckerData.loadReceivers[i];
                        if (point.id != marker.id) {
                            point.prices[trailer.loadType - 1] += 10;
                            if (point.prices[trailer.loadType - 1] > 90) point.prices[trailer.loadType - 1] = 90;
                            point.label.text = `~g~Tree: ~w~${point.prices[0]}$\n ~y~Coal: ~w~${point.prices[1]}$\n ~b~Oil: ~w~${point.prices[2]}$`;
                        }
                    }
                }

                delete vehicle.trailerId;
            }
        }
    }
}
