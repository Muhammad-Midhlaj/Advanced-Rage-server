module.exports = {
    "create_biz": {
        description: "Create a business. The marker is placed on the player's position. <br/> Type: <br/> 1 - snack bar <br/> 2 - bar <br/> 3 - clothing store <br/> 4 - barbershop <br/> 5 - gas station <br 6> 24/7 <br/> 7 - tattoo parlor <br/> 8 - gun shop <br/> 9 - car dealer <br/> 10 - LS Customs <br/> 11 - SRT",
        minLevel: 5,
        syntax: "[price]:n [type]:n [name]:s",
        handler: (player, args) => {
            var price = args[0];
            var type = args[1];
            args.splice(0, 2);
            var name = args.join(" ");
            mp.bizes.create(name, price, type, player.position);
            terminal.info(`${player.name} created a business "${name}" (price: ${price}$, type: ${type})`);
        }
    },
    "delete_biz": {
        description: "Delete business",
        minLevel: 5,
        syntax: "[business_id]:n",
        handler: (player, args) => {
            mp.bizes.delete(args[0], (e) => {
                if (e) return terminal.error(e, player);
                terminal.info(`${player.name} deleted business with ID: ${args[0]}`);
            });
        }
    },
    "set_biz_name": {
        description: "Change business name",
        minLevel: 5,
        syntax: "[business_id]:n [name]:s",
        handler: (player, args) => {
            var biz = mp.bizes.getBySqlId(args[0]);
            if (!biz) return terminal.error(`Business with ID: ${args[0]} not found!`, player);

            terminal.info(`${player.name} changed the name of the business withID: ${args[0]}`);
            args.splice(0, 1);
            biz.setName(args.join(" ").trim());
        }
    },
    "set_biz_owner": {
        description: "Change business owner.",
        minLevel: 5,
        syntax: "[business_id]:n [firstname]:s [lastname]:s",
        handler: (player, args) => {
            var biz = mp.bizes.getBySqlId(args[0]);
            if (!biz) return terminal.error(`Business with ID: ${args[0]} not found!`, player);

            var name = `${args[1]} ${args[2]}`;
            DB.Characters.getSqlIdByName(name, (sqlId) => {
                if (!sqlId) return terminal.error(`Character named ${name} not found!`, player);

                biz.setOwner(sqlId, name);
                terminal.info(`${player.name} changed the owner of the business withID: ${args[0]}`);
            });
        }
    },
    "delete_biz_owner": {
        description: "Remove business owner.",
        minLevel: 5,
        syntax: "[business_id]:n",
        handler: (player, args) => {
            var biz = mp.bizes.getBySqlId(args[0]);
            if (!biz) return terminal.error(`Business with ID: ${args[0]} not found!`, player);

            biz.setOwner(0, '');
            terminal.info(`${player.name} removed owner from business with ID: ${args[0]}`);
        }
    },
    "set_biz_price": {
        description: "Change business value",
        minLevel: 5,
        syntax: "[id_business]:n [price]:n",
        handler: (player, args) => {
            var biz = mp.bizes.getBySqlId(args[0]);
            if (!biz) return terminal.error(`Business with ID: ${args[0]} not found!`, player);

            biz.setPrice(args[1]);
            terminal.info(`${player.name} changed the price of a business with ID: ${args[0]}`);
        }
    },
    "set_biz_products": {
        description: "Change the quantity of goods in the warehouse of the business.",
        minLevel: 5,
        syntax: "[id_business]:n [product]:n",
        handler: (player, args) => {
            var biz = mp.bizes.getBySqlId(args[0]);
            if (!biz) return terminal.error(`Business with ID: ${args[0]} not found!`, player);

            biz.setProducts(args[1]);
            terminal.info(`${player.name} changed the amount of goods from the business with ID: ${args[0]}`);
        }
    },
    "set_biz_maxproducts": {
        description: "Change the capacity of the goods in the warehouse of the business.",
        minLevel: 5,
        syntax: "[id_business]:n [capacity]:n",
        handler: (player, args) => {
            var biz = mp.bizes.getBySqlId(args[0]);
            if (!biz) return terminal.error(`Business with ID: ${args[0]} not found!`, player);

            biz.setMaxProducts(args[1]);
            terminal.info(`${player.name} changed the warehouse capacity of the business with ID: ${args[0]}`);
        }
    },
    "set_biz_productprice": {
        description: "Change the price for 1 unit. product from the business.",
        minLevel: 5,
        syntax: "[id_business]:n [price]:n",
        handler: (player, args) => {
            var biz = mp.bizes.getBySqlId(args[0]);
            if (!biz) return terminal.error(`Business with ID: ${args[0]} not found!`, player);

            biz.setProductPrice(args[1]);
            terminal.info(`${player.name} changed the value of the goods from the business with ID: ${args[0]}`);
        }
    },
    "set_biz_balance": {
        description: "Change the balance of business.",
        minLevel: 5,
        syntax: "[id_business]:n [balance]:n",
        handler: (player, args) => {
            var biz = mp.bizes.getBySqlId(args[0]);
            if (!biz) return terminal.error(`Business with ID: ${args[0]} not found!`, player);

            biz.setBalance(args[1]);
            terminal.info(`${player.name} changed the balance of business with ID: ${args[0]}`);
        }
    },
    "set_biz_type": {
        description: "Change business type.",
        minLevel: 5,
        syntax: "[id_business]:n [type of]:n",
        handler: (player, args) => {
            var biz = mp.bizes.getBySqlId(args[0]);
            if (!biz) return terminal.error(`Business with ID: ${args[0]} not found!`, player);

            biz.setType(args[1]);
            terminal.info(`${player.name} changed the type of u business with ID: ${args[0]}`);
        }
    },
    "set_biz_status": {
        description: "Change business status.<br/>Statuses:<br/>0 - is closed<br/>1- открыт",
        minLevel: 5,
        syntax: "[id_business]:n [статус]:n",
        handler: (player, args) => {
            var biz = mp.bizes.getBySqlId(args[0]);
            if (!biz) return terminal.error(`Business with ID: ${args[0]} not found!`, player);

            biz.setStatus(args[1]);
            terminal.info(`${player.name} changed the status of the business with ID: ${args[0]}`);
        }
    },
    "set_biz_position": {
        description: "Change the position of the business. Position is taken from player.",
        minLevel: 5,
        syntax: "[id_business]:n",
        handler: (player, args) => {
            var biz = mp.bizes.getBySqlId(args[0]);
            if (!biz) return terminal.error(`Business with ID: ${args[0]} not found!`, player);

            biz.setPosition(player.position);
            terminal.info(`${player.name} changed the position of the business with ID: ${args[0]}`);
        }
    },
    "tp_biz": {
        description: "Teleport to business.",
        minLevel: 3,
        syntax: "[id_business]:n",
        handler: (player, args) => {
            var biz = mp.bizes.getBySqlId(args[0]);
            if (!biz) return terminal.error(`Business with ID: ${args[0]} not found!`, player);
            biz.position.z += 1;
            player.position = biz.position;
            terminal.info(`You teleported to business with ID: ${args[0]}`, player);
        }
    },
}
