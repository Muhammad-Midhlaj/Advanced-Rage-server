module.exports = {
    "bandDealer.buyGun": (player, itemId) => {
        // debug(`bandDealer.buyGun: ${player.name} ${itemId}`)
        // TODO: Проверка, стоит ли игрок в колшейпе. Васина контрабанда.

        var gunsInfo = {
            41: {
                price: 200,
                params: {
                    weaponHash: mp.joaat("weapon_bat"),
                },
            },
            42: {
                price: 75,
                params: {
                    weaponHash: mp.joaat("weapon_knuckle"),
                },
            },
            43: {
                price: 300,
                params: {
                    weaponHash: mp.joaat("weapon_knife"),
                },
            },
            44: {
                price: 800,
                params: {
                    weaponHash: mp.joaat("weapon_pistol"),
                },
            },
            45: {
                price: 1200,
                params: {
                    weaponHash: mp.joaat("weapon_appistol"),
                },
            },
            46: {
                price: 1400,
                params: {
                    weaponHash: mp.joaat("weapon_revolver"),
                },
            },
            47: {
                price: 1800,
                params: {
                    weaponHash: mp.joaat("weapon_microsmg"),
                },
            },
            48: {
                price: 1950,
                params: {
                    weaponHash: mp.joaat("weapon_smg"),
                },
            },
            21: {
                price: 2400,
                params: {
                    weaponHash: mp.joaat("weapon_pumpshotgun"),
                },
            },
            49: {
                price: 2700,
                params: {
                    weaponHash: mp.joaat("weapon_sawnoffshotgun"),
                },
            },
            50: {
                price: 2800,
                params: {
                    weaponHash: mp.joaat("weapon_assaultrifle"),
                },
            },
            51: {
                price: 3000,
                params: {
                    weaponHash: mp.joaat("weapon_bullpuprifle"),
                },
            },
            52: {
                price: 3000,
                params: {
                    weaponHash: mp.joaat("weapon_compactrifle"),
                },
            }
        };
        if (!gunsInfo[itemId]) return player.utils.error(`No weapon found!`);
        var info = gunsInfo[itemId];
        if (player.money < info.price) return player.utils.error(`Need ${info.price}$`);
        info.params.ammo = 0;

        player.inventory.add(itemId, info.params, {}, (e) => {
            if (e) return player.utils.error(e);

            // TODO: Начислять % суммы в общак банды, которой принадлежит терра.

            player.utils.setMoney(player.money - info.price);
            player.utils.success(`You bought ${mp.inventory.getItem(itemId).name}`);
        });
    },
    "bandDealer.buyAmmo": (player, index, ammo) => {
        // debug(`bandDealer.buyAmmo: ${player.name} ${index} ${ammo}`)
        // TODO: Проверка, стоит ли игрок в колшейпе. Васина контрабанда.

        var itemIds = [37, 38, 40, 39];
        var prices = [6, 7, 7, 6];
        var index = Math.clamp(index, 0, itemIds.length - 1);
        var price = ammo * prices[index];
        if (player.money < price) return player.utils.error(`Need ${price}$`);

        var params = {
            ammo: ammo,
        };
        player.inventory.add(itemIds[index], params, {}, (e) => {
            if (e) return player.utils.error(e);

            // TODO: Начислять % суммы в общак банды, которой принадлежит терра.

            player.utils.setMoney(player.money - price);
            player.utils.success(`You bought ${mp.inventory.getItem(itemIds[index]).name}!`);
        });
    },
    "bandDealer.buyDrgus": (player, index, count) => {
        // debug(`bandDealer.buyDrgus: ${player.name} ${index} ${count}`)
        // TODO: Проверка, стоит ли игрок в колшейпе. Васина контрабанда.

        var itemIds = [55, 56, 57, 58];
        var index = Math.clamp(index, 0, itemIds.length - 1);
        var prices = [6, 10, 8, 9];
        var price = count * prices[index];
        if (player.money < price) return player.utils.error(`Need ${price}$`);

        var params = {
            count: count,
        };
        player.inventory.add(itemIds[index], params, {}, (e) => {
            if (e) return player.utils.error(e);

            // TODO: Начислять % суммы в общак банды, которой принадлежит терра.

            player.utils.setMoney(player.money - price);
            player.utils.success(`You bought ${mp.inventory.getItem(itemIds[index]).name}!`);
        });
    },
}
