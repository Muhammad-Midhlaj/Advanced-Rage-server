var value_total = null;
var value_add = null;
var stop_timeout;
var visible_timeout;
var cashVisible = false;

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function destroy_add() {
    value_total += value_add;
    value_add = null;
}

mp.events.add('render', () => {
    if ((value_total != undefined || value_total != null) && cashVisible) {
        if (value_total < 0) {
            mp.game.graphics.drawText(`-$${numberWithCommas(value_total)}`, [0.93, 0.04], {
                scale: [0.65, 0.65],
                color: [224, 50, 50, 255],
                font: 7
            });
        } else {
            mp.game.graphics.drawText(`$${numberWithCommas(value_total)}`, [0.93, 0.04], {
                scale: [0.65, 0.65],
                color: [114, 204, 114, 255],
                font: 7
            });
        }
    }
    if ((value_add != undefined || value_add != null) && cashVisible) {
        if (value_add < 0) {
            mp.game.graphics.drawText(`-$${numberWithCommas(Math.abs(value_add))}`, [0.93, 0.085], {
                scale: [0.65, 0.65],
                color: [224, 50, 50, 255],
                font: 7
            });
        } else {
            mp.game.graphics.drawText(`+$${numberWithCommas(value_add)}`, [0.93, 0.085], {
                scale: [0.65, 0.65],
                color: [136, 233, 136, 255],
                font: 7
            })
        }
    }
});


// меняет значение денег в левом верхнем углу!
mp.events.add("setMoney", (money_value) => {
    mp.events.call("setLocalVar", "money", money_value);
    value_add = money_value - value_total;

    if (value_add) {
        clearTimeout(stop_timeout);
        stop_timeout = setTimeout(destroy_add, 5000);
    }

    cashVisible = true;
    clearTimeout(visible_timeout);
    visible_timeout = setTimeout(() => {
        cashVisible = false;
    }, 10000);
});

mp.keys.bind(90, false, () => {
    cashVisible = !cashVisible;
});
