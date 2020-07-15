module.exports = {
    "promocode_create": {
        description: "Create a promo code.",
        minLevel: 10,
        syntax: "[id]:n [code]:s",
        handler: (player, args) => {
            
            var code_settings = {
                                    "register":100,
                                    "lvl2":100,
                                    "lvl3":100,
                                    "lvl5":100,
                                    "lvl10":100
                                };
            DB.Handle.query("SELECT name FROM characters WHERE id=?", [args[0]], (e, resultp) => {
                if (resultp.length === 0) return terminal.error(`Promo code error - character not found!`, player);
                var namePromotion = resultp[0]['name'];
                    DB.Handle.query("SELECT * FROM promocodes WHERE character_id=? or code=?", [args[0],args[1]], (e, resultcode) => {
                        if (resultcode.length > 0) return terminal.info(`Promo code error - promo code has already been created!`); 
                            DB.Handle.query("INSERT INTO promocodes (character_id,code,add_admin,reward_config) VALUES (?,?,?,?)",
                                [args[0],args[1],player.name, JSON.stringify(code_settings)], (e, result) => {
                                    if(!e){
                                        return terminal.info(`${player.name} created a promo code (${args[1]}) For ${namePromotion} `);
                                    }else{
                                        return terminal.error(`It's a promo code error!`, player);
                                    }
                            });
                    });
            });
        }
    },
    "promocode_edit": {
        description: "Edit promo code.",
        minLevel: 10,
        syntax: "[code]:s [register_reward]:n [lvl2_reward]:n [lvl3_reward]:n [lvl5_reward]:n [lvl10_reward]:n",
        handler: (player, args) => {
            
            var code_settings = {
                                    "register":args[1],
                                    "lvl2":args[2],
                                    "lvl3":args[3],
                                    "lvl5":args[4],
                                    "lvl10":args[5]
                                };

            DB.Handle.query(`UPDATE promocodes SET reward_config=? WHERE code=?`,[JSON.stringify(code_settings),args[0]], (e,result) => {
                    if(result.length === 0){
                        return terminal.error(`Promo code editing error!`, player);
                    }else{
                        terminal.info(`${player.name} updated promo code (${args[0]}) setting ${JSON.stringify(code_settings)}`);
                    }
            });

        }
    },

}
