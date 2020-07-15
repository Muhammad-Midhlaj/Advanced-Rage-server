module.exports = {
    "farm_field_fill": {
        description: "Sow the field.",
        minLevel: 5,
        syntax: "[fieldId]:n [grain]:n",
        handler: (player, args) => {
            var field = mp.farmFields.getBySqlId(args[0]);
            if (!field) return terminal.error(`Field with ID: ${args[0]} not found!`, player);
            args[1] = Math.clamp(args[1], 0, 3);

            field.fill(args[1]);
            terminal.info(`${player.name} I planted a field with ID: ${args[0]}`)
        }
    },

    "tp_farm": {
        description: "Teleport to the farm.",
        minLevel: 3,
        syntax: "[ид_фермы]:n",
        handler: (player, args) => {
            var farm = mp.farms.getBySqlId(args[0]);
            if (!farm) return terminal.error(`Farm with ID: ${args[0]} not found!`, player);
            farm.position.z += 1;
            player.position = farm.position;
            terminal.info(`You teleported to the farm with ID: ${args[0]}`, player);
        }
    },
}
