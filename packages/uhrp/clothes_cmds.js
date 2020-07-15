module.exports = {
    "clothes_variation": {
        description: "Change the variation of clothing. Type:<br/>bracelets,ears,feets,glasses,hats,legs,masks,ties,top,watches",
        minLevel: 5,
        syntax: "[clothes_id]:n [type]:s [variation]:n",
        handler: (player, args) => {
            var names = ["bracelets", "ears", "feets", "glasses", "hats", "legs", "masks", "ties", "top", "watches"];
            if (names.indexOf(args[1]) == -1) return terminal.error(`Wrong type of clothes!`);
            var com = mp.getClothes(args[1], args[0]);
            if (!com) return terminal.error(`Clothing component not found!`, player);

            com.variation = args[2];
            DB.Handle.query(`UPDATE store_${args[1]} SET variation=? WHERE id=?`, [args[2], args[0]]);
            terminal.info(`${player.name} updated the variation of clothes with ID: ${args[0]}`);
        }
    },
    "clothes_price": {
        description: "Change the price of clothes. Type:<br/>bracelets,ears,feets,glasses,hats,legs,masks,ties,top,watches",
        minLevel: 5,
        syntax: "[clothes_id]:n [type]:s [price]:n",
        handler: (player, args) => {
            var names = ["bracelets", "ears", "feets", "glasses", "hats", "legs", "masks", "ties", "top", "watches"];
            if (names.indexOf(args[1]) == -1) return terminal.error(`Wrong type of clothes!`);
            var com = mp.getClothes(args[1], args[0]);
            if (!com) return terminal.error(`Clothing component not found!`, player);

            com.price = args[2];
            DB.Handle.query(`UPDATE store_${args[1]} SET price=? WHERE id=?`, [args[2], args[0]]);
            terminal.info(`${player.name} updated the price of clothes with ID: ${args[0]}`);
        }
    },
    "clothes_size": {
        description: "Change rows and cols. These parameters determine how much clothing can store. Type:<br/>legs,top",
        minLevel: 5,
        syntax: "[clothes_id]:n [type]:s [rows]:n [cols]:n",
        handler: (player, args) => {
            var names = ["legs", "top"];
            if (names.indexOf(args[1]) == -1) return terminal.error(`Wrong type of clothes!`);
            var com = mp.getClothes(args[1], args[0]);
            if (!com) return terminal.error(`Clothing component not found!`, player);

            com.rows = Math.clamp(args[2], 1, 10);
            com.cols = Math.clamp(args[3], 1, 10);
            DB.Handle.query(`UPDATE store_${args[1]} SET rows=?,cols=? WHERE id=?`, [com.rows, com.cols, args[0]]);
            terminal.info(`${player.name} updated rows and cols of outerwear with ID: ${args[0]}`);
        }
    },
    "clothes_addtexture": {
        description: "Add texture clothing. Type:<br/>bracelets,ears,feets,glasses,hats,legs,masks,ties,top,watches",
        minLevel: 5,
        syntax: "[clothes_id]:n [type]:s [texture]:n",
        handler: (player, args) => {
            var names = ["bracelets", "ears", "feets", "glasses", "hats", "legs", "masks", "ties", "top", "watches"];
            if (names.indexOf(args[1]) == -1) return terminal.error(`Wrong type of clothes!`);
            var com = mp.getClothes(args[1], args[0]);
            if (!com) return terminal.error(`Clothing component not found!`, player);
            if (com.textures.indexOf(args[2]) != -1) terminal.error(`Component already has this texture!`, player);

            com.textures.push(args[2]);
            DB.Handle.query(`UPDATE store_${args[1]} SET textures=? WHERE id=?`, [JSON.stringify(com.textures), args[0]]);
            terminal.info(`${player.name} updated textures y ${args[1]} clothes with ID: ${args[0]}`);
        }
    },
    "clothes_deletetexture": {
        description: "Remove clothing texture. Type:<br/>bracelets,ears,feets,glasses,hats,legs,masks,ties,top,watches",
        minLevel: 5,
        syntax: "[clothes_id]:n [type]:s [texture]:n",
        handler: (player, args) => {
            var names = ["bracelets", "ears", "feets", "glasses", "hats", "legs", "masks", "ties", "top", "watches"];
            if (names.indexOf(args[1]) == -1) return terminal.error(`Wrong type of clothes!`);
            var com = mp.getClothes(args[1], args[0]);
            if (!com) return terminal.error(`Clothing component not found!`, player);
            var tIndex = com.textures.indexOf(args[2]);
            if (tIndex == -1) terminal.error(`This texture is not found for the component!`, player);

            com.textures.splice(tIndex, 1);
            DB.Handle.query(`UPDATE store_${args[1]} SET textures=? WHERE id=?`, [JSON.stringify(com.textures), args[0]]);
            terminal.info(`${player.name} updated textures y ${args[1]} clothes with ID: ${args[0]}`);
        }
    },
}
