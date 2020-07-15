module.exports = {
    Init: () => {
        var names = ["bracelets", "ears", "feets", "glasses", "hats", "legs", "masks", "ties", "top", "watches"];
        mp.clothes = {};
        names.forEach((name) => {
            DB.Handle.query(`SELECT * FROM store_${name}`, (e, result) => {
                if (e) console.log(e)
                mp.clothes[name] = [
                    [],
                    []
                ]; // Ж и М
                for (var i = 0; i < result.length; i++) {
                    delete result[i].name; // TODO: Иниц. имени шмота.
                    result[i].textures = JSON.parse(result[i].textures);
                    mp.clothes[name][result[i].sex].push(result[i]);
                    delete result[i].sex
                }
                console.log(`${name} loaded: ${i}`);
            });
        });
    }
}

/* Подсчет количества суммарной цены и количества текстур для каждого типа одежды. */
mp.getArrayClothesCounts = () => {
    var counts = [];

    for (var com in mp.clothes) {
        var count = 0;
        for (var i = 0; i < mp.clothes[com].length; i++) {
            for (var j = 0; j < mp.clothes[com][i].length; j++) {
                count += mp.clothes[com][i][j].price;
                count += mp.clothes[com][i][j].textures.length;
                count += mp.clothes[com][i][j].variation;
                if (mp.clothes[com][i][j].rows) count += mp.clothes[com][i][j].rows;
                if (mp.clothes[com][i][j].cols) count += mp.clothes[com][i][j].cols;
            }
        }
        count += i;
        counts.push(count);
    }
    return counts;
}

/* Получить одежду по типу и ид. */
mp.getClothes = (name, id) => {
    if (!mp.clothes[name]) return null;
    for (var i = 0; i < mp.clothes[name][0].length; i++)
        if (mp.clothes[name][0][i].id == id) return mp.clothes[name][0][i];
    for (var i = 0; i < mp.clothes[name][1].length; i++)
        if (mp.clothes[name][1][i].id == id) return mp.clothes[name][1][i];
    return null;
}
