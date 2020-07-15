module.exports = {
    InitPayDay: () => {
        var lastPayDayHour = new Date().getHours();
        setInterval(() => {
            try {
                var date = new Date();
                if (date.getMinutes() >= 0 && date.getMinutes() <= 3 && date.getHours() != lastPayDayHour) {
                    //чтобы не умерло соединение с БД (по предположению Carter'а)
                    DB.Handle.query("SELECT null FROM accounts LIMIT 1");

                    lastPayDayHour = date.getHours();

                    allBroadcast();
                    // housesTax();
                    // bizesTax();
                    factionsPay(date);
                }
                mp.updateWorldTime();
            } catch (e) {
                terminal.error(e);
            }
        }, 60000);
    },
}

/* оповещение всех игроков */
function allBroadcast() {
    mp.players.forEach((rec) => {
        if (rec.sqlId) {
            rec.minutes += parseInt((new Date().getTime() - rec.authTime) / 1000 / 60);
            rec.account.minutes += parseInt((new Date().getTime() - rec.authTime) / 1000 / 60);
            var characterLevel = mp.convertMinutesToLevelRest(rec.minutes);
            rec.utils.setLocalVar("accountHours", parseInt(rec.account.minutes));
            rec.utils.setLocalVar("hours", parseInt(rec.minutes));
            rec.utils.setLocalVar("nextLevel", characterLevel.nextLevel);
            rec.utils.setLocalVar("level", characterLevel.level);
            rec.utils.setLocalVar("exp", characterLevel.rest);
        }
    });
}

/* Налоги на дом. */
function housesTax() {
    for (var i = 0; i < mp.houses.length; i++) {
        var house = mp.houses[i];
        if (!house.owner) continue;
        house.setBalance(house.balance - house.getTax());
        var owner = mp.players.getBySqlId(house.owner);
        if (house.balance <= 0) {
            if (owner) {
                owner.utils.info(`Your House No.${house.sqlId} sold for non-payment of taxes!`);
                if(owner.houseId == house.sqlId) {
                    owner.utils.setSpawn(3);
                    owner.utils.setHouseId(0);
                }
                owner.utils.removeHouse(house);
            }
            var price = parseInt(house.price * mp.economy["house_sell"].value);
            if (owner) {
                owner.utils.setBankMoney(owner.bank + price);
                owner.utils.bank(`Property`, `Awarded: ~g~$${price}`);
            } else {
                DB.Handle.query("UPDATE characters SET bank=bank+? WHERE id=?", [price, house.owner]);
            }
            house.setOwner(0);
        } else if (house.balance <= house.getTax() * 10 && owner) {
            owner.utils.warning(`Top up House No.${house.sqlId}!`);
        }
    }
}

/* Налоги на бизнес. */
function bizesTax() {
    for (var i = 0; i < mp.bizes.length; i++) {
        var biz = mp.bizes[i];
        if (!biz.owner) continue;
        biz.setBalance(biz.balance - biz.getTax());
        var owner = mp.players.getBySqlId(biz.owner);
        if (biz.balance <= 0) {
            if (owner) {
                owner.utils.info(`Your Business No.${biz.sqlId} sold for non-payment of taxes!`);
                owner.utils.removeBiz(biz);
            }
            var price = parseInt(biz.price * mp.economy["biz_sell"].value);
            if (owner) {
                owner.utils.setBankMoney(owner.bank + price);
                owner.utils.bank(`Business`, `Awarded: ~g~$${price}`);
            } else {
                DB.Handle.query("UPDATE characters SET bank=bank+? WHERE id=?", [price, biz.owner]);
            }
            biz.setOwner(0);
        } else if (biz.balance <= biz.getTax() * 10 && owner) {
            owner.utils.warning(`Top up Business No.${biz.sqlId}!`);
        }
    }
}

/* Начисление ЗП членам организаций. */
function factionsPay(date) {
    mp.players.forEach((rec) => {
        if (rec.faction) {
            var minutes = parseInt((date.getTime() - rec.authTime) / 1000 / 60);
            if (minutes < 15) return rec.utils.bank(`Организация`, `Вы не отыграли 15 минут чтобы получить зарплату!`);
            var pay = mp.factions.getRankPay(rec.faction, rec.rank);
            pay = parseInt(pay);
            rec.utils.setBankMoney(rec.bank + pay);
            rec.utils.bank(`Организация`, `Зарплата: ~g~${pay}$`);
        }
    });
}
