module.exports = {
    "items_list": {
        description: "View inventory items on the server. Updating on your client will happen after the log!",
        minLevel: 5,
        syntax: "",
        handler: (player, args) => {
            var text = "ID) Name (Description) [weight] [height x width] | model | DeltaZ <br/>";
            for (var i = 0; i < mp.inventory.items.length; i++) {
                var item = mp.inventory.items[i];
                text += `${item.sqlId}) ${item.name} (${item.description}) [${item.weight} kg] [${item.height}x${item.width}] | ${item.model} | ${item.deltaZ}<br/>`;
            }

            terminal.log(text, player);
        }
    },
    "set_item_name": {
        description: "Change inventory name. (см. items_list)",
        minLevel: 5,
        syntax: "[item_id]:n [title]:s",
        handler: (player, args) => {
            var item = mp.inventory.getItem(args[0]);
            if (!item) return terminal.error(`Item with ID: ${args[0]} not found!`, player);

            terminal.info(`${player.name} changed the name of the item with ID: ${args[0]}.`);

            args.splice(0, 1);
            item.setName(args.join(" ").trim());
        }
    },
    "set_item_desc": {
        description: "Change inventory description. (см. items_list)",
        minLevel: 5,
        syntax: "[item_id]:n [description]:s",
        handler: (player, args) => {
            var item = mp.inventory.getItem(args[0]);
            if (!item) return terminal.error(`Item with ID: ${args[0]} not found!`, player);

            terminal.info(`${player.name} changed the item description with ID: ${args[0]}.`);

            args.splice(0, 1);
            item.setDescription(args.join(" ").trim());
        }
    },
    "set_item_weight": {
        description: "Change the weight of the inventory. (см. items_list)",
        minLevel: 5,
        syntax: "[item_id]:n [weight]:n",
        handler: (player, args) => {
            var item = mp.inventory.getItem(args[0]);
            if (!item) return terminal.error(`Item with ID: ${args[0]} not found!`, player);

            terminal.info(`${player.name} changed the weight of the item with ID: ${args[0]}.`);
            item.setWeight(args[1]);
        }
    },
    "set_item_size": {
        description: "Change inventory description. (см. items_list)",
        minLevel: 5,
        syntax: "[item_id]:n [height]:n [width]:n",
        handler: (player, args) => {
            var item = mp.inventory.getItem(args[0]);
            if (!item) return terminal.error(`Item with ID: ${args[0]} not found!`, player);

            terminal.info(`${player.name} changed the size of the subject with ID: ${args[0]}.`);
            item.setSize(args[1], args[2]);
        }
    },
    "set_item_model": {
        description: "Change the model of the inventory. This model is used when a player throws out an item.. (см. items_list)",
        minLevel: 5,
        syntax: "[item_id]:n [model]:s",
        handler: (player, args) => {
            var item = mp.inventory.getItem(args[0]);
            if (!item) return terminal.error(`Item with ID: ${args[0]} not found!`, player);

            terminal.info(`${player.name} changed the model of the subject with ID: ${args[0]}.`);
            item.setModel(args[1].trim());
        }
    },
    "set_item_deltaz": {
        description: "Change inventory deltaZ. Model's height offset when a player drops an item. (см. items_list)",
        minLevel: 5,
        syntax: "[item_id]:n [deltaZ]:n",
        handler: (player, args) => {
            var item = mp.inventory.getItem(args[0]);
            if (!item) return terminal.error(`Item with ID: ${args[0]} not found!`, player);

            terminal.info(`${player.name} changed deltaZ item with ID: ${args[0]}.`);
            item.setDeltaZ(args[1]);
        }
    },
    "set_item_rotation": {
        description: "Change the rotation of the inventory. Turning a model when a player throws out an item. (см. items_list)",
        minLevel: 5,
        syntax: "[item_id]:n [x]:n [y]:n",
        handler: (player, args) => {
            var item = mp.inventory.getItem(args[0]);
            if (!item) return terminal.error(`Item with ID: ${args[0]} not found!`, player);

            terminal.info(`${player.name} changed the rotation of the object with ID: ${args[0]}.`);
            item.setRotation(args[1], args[2]);
        }
    },
    "give_test_items": {
        description: "Issue test items to player.",
        minLevel: 6,
        syntax: "[player id]:n",
        handler: (player, args) => {
            var recipient = mp.players.at(args[0]);
            if (!recipient) return terminal.error(`Player with ID: ${args[0]} not found!`, player);
            var response = (e) => {
                if (e) terminal.error(e, player);
            };

            recipient.inventory.add(1, {
                sex: recipient.sex,
                variation: 21,
                texture: 0
            }, {}, response);
            recipient.inventory.add(2, {
                sex: recipient.sex,
                variation: 35,
                texture: 0
            }, {}, response);
            recipient.inventory.add(3, {
                sex: recipient.sex,
                variation: 15,
                texture: 0,
                armour: 100
            }, {}, response);
            recipient.inventory.add(4, {
                count: 100
            }, {}, response);
            /*recipient.inventory.add(5, {
                count: 50
            }, {}, response);*/
            recipient.inventory.add(6, {
                sex: recipient.sex,
                variation: 37,
                texture: 0
            }, {}, response);
            recipient.inventory.add(7, {
                sex: recipient.sex,
                variation: 133,
                texture: 0,
                torso: 0,
                rows: 3,
                cols: 5
            }, {}, response);
            recipient.inventory.add(8, {
                sex: recipient.sex,
                variation: 54,
                texture: 0,
                rows: 3,
                cols: 3
            }, {}, response);
            recipient.inventory.add(9, {
                sex: recipient.sex,
                variation: 67,
                texture: 0
            }, {}, response);
            recipient.inventory.add(10, {
                sex: recipient.sex,
                variation: 17,
                texture: 0
            }, {}, response);
            recipient.inventory.add(11, {
                sex: recipient.sex,
                variation: 3,
                texture: 0
            }, {}, response);
            recipient.inventory.add(12, {
                sex: recipient.sex,
                variation: 3,
                texture: 0
            }, {}, response);
            recipient.inventory.add(13, {
                sex: recipient.sex,
                variation: 45,
                texture: 0,
                rows: 5,
                cols: 10
            }, {}, response);
            recipient.inventory.add(14, {
                sex: recipient.sex,
                variation: 73,
                texture: 0
            }, {}, response);

            recipient.inventory.add(15, {}, {}, response);
            recipient.inventory.add(15, {}, {}, response);
            recipient.inventory.add(15, {}, {}, response);

            recipient.inventory.add(3, {
                sex: recipient.sex,
                variation: 28,
                texture: 0,
                armour: 100
            }, {}, response);
        }
    },
    "clear_inventory": {
        description: "Clear player inventory.",
        minLevel: 6,
        syntax: "[player id]:n",
        handler: (player, args) => {
            var recipient = mp.players.at(args[0]);
            if (!recipient) return terminal.error(`Player with ID: ${args[0]} not found!`, player);
            var response = (e) => {
                if (e) terminal.error(e, player);
            };

            for (var key in recipient.inventory.items) {
                var item = recipient.inventory.items[key];
                recipient.inventory.delete(item.id);
            }

            terminal.info(`${player.name} cleared inventory ${recipient.name}`);
        }
    },
    "clear_floor_items": {
        description: "Clean inventory items from the server floor.",
        minLevel: 5,
        syntax: "",
        handler: (player, args) => {
            var count = 0;
            mp.objects.forEach((obj) => {
                if (obj.getVariable("inventoryItemSqlId") > 0) {
                    count++;
                    obj.destroy();
                }
            });

            terminal.info(`${player.name} cleared inventory items from the server floor.<br/>Removed: ${count} PC.`);
        }
    },
    "clear_player_items": {
        description: "Completely clear the player's inventory items (for fixing the old inventory structure)",
        minLevel: 9,
        syntax: "[player_id]:n",
        handler: (player, args) => {
            var rec = mp.players.at(args[0]);
            if (!rec) return terminal.error(`Player with ID: ${args[0]} not found!`, player);
            var sqlId = rec.sqlId;
            rec.utils.success(`${player.name} cleared your inventory! Need to restart.`);
            rec.kick();
            DB.Handle.query("DELETE FROM inventory_players WHERE playerId=?", [sqlId]);
            terminal.info(`${player.name} cleaned completely cleaned the inventory items ${rec.name}`);
        }
    },



}
