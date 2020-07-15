module.exports = {
    Init: () => {
        mp.donateList = [];
        DB.Handle.query("SELECT * FROM donate_list", (e, result) => {
            for (var i = 0; i < result.length; i++) {
                mp.donateList.push({
                    sqlId: result[i].id,
                    name: result[i].name,
                    data: JSON.parse(result[i].data),
                    type: result[i].type,
                    days: result[i].days,
                    price: result[i].price  
                });
            }
            console.log("Donations sheet loaded, number: " + mp.donateList.length);
        });
    }
}
