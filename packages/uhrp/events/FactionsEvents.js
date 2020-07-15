module.exports = {
    "factions.invite": (player, recId) => {
        //debug(`${player.name} factions.invite ${recId}`);
        var rec = mp.players.at(recId);
        if (!rec) return player.utils.error(`No citizen found!`);
        var dist = player.dist(rec.position);
        if (dist > Config.maxInteractionDist) return player.utils.error(`A citizen is far away!`);
        if (!player.faction || player.rank < mp.factionRanks[player.faction].length - 2) return player.utils.error(`You don't have a license!`);
        if (rec.faction) return player.utils.error(`Citizen is already in the face!`);

        rec.inviteOffer = {
            leaderId: player.id
        };

        player.utils.info(`You've invited ${rec.name} to the organization`);
        rec.utils.info(`Invitation received to the organization`);
        rec.call("choiceMenu.show", ["accept_invite", {
            name: player.name,
            faction: mp.factions.getBySqlId(player.faction).name
        }]);
    },

    "factions.giverank": (player, recId) => {
        var rec = mp.players.at(recId);
        if (!rec) return player.utils.error(`No citizen found!`);
        var dist = player.dist(rec.position);
        if (dist > Config.maxInteractionDist) return player.utils.error(`A citizen is far away!`);
        if (!player.faction || player.rank < mp.factionRanks[player.faction].length - 2) return player.utils.error(`You don't have a license!`);
        if (rec.faction != player.faction) return player.utils.error(`A citizen is not in your organization!`);
        if (rec.rank >= player.rank - 1) return player.utils.error(`You can't raise higher rank!`);

        var rankName = mp.factionRanks[rec.faction][rec.rank + 1].name;
        rec.utils.setFactionRank(rec.rank + 1);
        player.utils.success(`${rec.name} upgraded to ${rankName}`);
        rec.utils.success(`${player.name} promoted you to ${rankName}`);

        mp.logs.addLog(`${player.name} promoted player ${rec.name} in office. Rank: ${rec.rank + 1}`, 'faction', player.account.id, player.sqlId, { rank: rec.rank + 1, faction: rec.faction });
        mp.logs.addLog(`${rec.name} был повышен игроком ${player.name} in office. Rank: ${rec.rank + 1}`, 'faction', rec.account.id, rec.sqlId, { rank: player.rank, faction: player.faction });

    },

    "factions.ungiverank": (player, recId) => {
        var rec = mp.players.at(recId);
        if (!rec) return player.utils.error(`No citizen found!`);
        var dist = player.dist(rec.position);
        if (dist > Config.maxInteractionDist) return player.utils.error(`A citizen is far away!`);
        if (!player.faction || player.rank < mp.factionRanks[player.faction].length - 2) return player.utils.error(`You don't have a license!`);
        if (rec.faction != player.faction) return player.utils.error(`A citizen is not in your organization!`);
        if (player.rank == mp.factionRanks[player.faction].length - 2 && rec.rank == mp.factionRanks[rec.faction].length - 2) return player.utils.error(`You don't have a license!`);
        if (rec.rank == mp.factionRanks[rec.faction].length - 1) return player.utils.error(`It is impossible to downgrade the leader!`);
        if (rec.rank <= 1) return player.utils.error(`It is impossible to downgrade your rank is to low!`);

        var rankName = mp.factionRanks[rec.faction][rec.rank - 1].name;
        rec.utils.setFactionRank(rec.rank - 1);
        player.utils.success(`${rec.name} downgraded to ${rankName}`);
        rec.utils.success(`${player.name} downgraded you to ${rankName}`);
        
        mp.logs.addLog(`${player.name} downgraded the player ${rec.name} in office. Rank: ${rec.rank - 1}`, 'faction', player.account.id, player.sqlId, { rank: rec.rank - 1, faction: rec.faction });
        mp.logs.addLog(`${rec.name} was demoted by the player ${player.name} in office. Rank: ${rec.rank - 1}`, 'faction', rec.account.id, rec.sqlId, { rank: player.rank, faction: player.faction });

    },

    "factions.uninvite": (player, recId) => {
        //debug(`${player.name} factions.uninvite ${recId}`);
        var rec = mp.players.at(recId);
        if (!rec) return player.utils.error(`No citizen found!`);
        var dist = player.dist(rec.position);
        if (dist > Config.maxInteractionDist) return player.utils.error(`A citizen is far away!`);
        if (!player.faction || player.rank < mp.factionRanks[player.faction].length - 2) return player.utils.error(`You don't have a license!`);
        if (player.rank == mp.factionRanks[player.faction].length - 2 && rec.rank == mp.factionRanks[rec.faction].length - 2) return player.utils.error(`You don't have a license!`);
        if (rec.faction != player.faction) return player.utils.error(`A citizen is not in your organization!`);
        if (rec.rank == mp.factionRanks[rec.faction].length - 1) return player.utils.error(`You can't fire a leader!`);

        rec.utils.setFaction(0);

        player.utils.info(`You're fired. ${rec.name} from the organization`);
        rec.utils.info(`${player.name} fired you from the organization`);
        mp.logs.addLog(`${player.name} fired the player ${rec.name} from the organization. Rank: ${rec.rank}`, 'faction', player.account.id, player.sqlId, { rank: rec.rank, faction: rec.faction });
        mp.logs.addLog(`${rec.name} was sacked by the player ${player.name} from the organization. Rank: ${rec.rank}`, 'faction', rec.account.id, rec.sqlId, { rank: player.rank, faction: player.faction });

    },

    "factions.offer.agree": (player) => {
        if (!player.inviteOffer) return player.utils.error(`No offer found!`);
        var rec = mp.players.at(player.inviteOffer.leaderId);
        if (!rec) return player.utils.error(`Player not found!`);
        var dist = player.dist(rec.position);
        if (dist > 5) return player.utils.error(`The player is too far away!`);
        if (!rec.faction || rec.rank < mp.factionRanks[rec.faction].length - 2) return player.utils.error(`The citizen has no rights!`);
        if (player.faction) return player.utils.error(`You're already in the organization!`);

        delete player.inviteOffer;

        player.utils.setFaction(rec.faction);

        player.utils.info(`Invitation accepted!`);
        rec.utils.info(`${player.name} accepted the invitation!`);

        mp.logs.addLog(`${rec.name} accepted player ${player.name} to the organization. Rank: ${player.rank}`, 'faction', rec.account.id, rec.sqlId, { rank: rec.rank, faction: rec.faction });
        mp.logs.addLog(`${player.name} was accepted by the player ${rec.name} to the organization. Rank: ${player.rank}`, 'faction', player.account.id, player.sqlId, { rank: player.rank, faction: player.faction });

    },

    "factions.offer.cancel": (player) => {
        if (!player.inviteOffer) return player.utils.error(`No offer found!`);

        var rec = mp.players.at(player.inviteOffer.leaderId);
        delete player.inviteOffer;
        player.utils.info(`Invitation rejected`);
        if (!rec) return;
        delete rec.inviteOffer;

        rec.utils.info(`${player.name} rejected the invitation`);
    },

    "warehouse.push": (player) => {
        if (!player.getVariable("attachedObject")) return player.utils.error(`You don't have a load!`);
        if (!player.colshape || !player.colshape.warehouse) return player.utils.error(`You're not at the warehouse!`);
        var factionIds = [2, 3, 4, 7, 6, 5];
        var models = ['prop_box_ammo04a', 'prop_box_ammo04a', 'prop_box_ammo04a', 'prop_box_ammo04a', 'prop_box_ammo04a', 'ex_office_swag_pills4'];
        var weights = [500, 500, 500, 500, 500, 500];
        var index = factionIds.indexOf(player.colshape.warehouse.faction);
        if (index == -1) return player.utils.error(`No organization's warehouse found!`);
        if (models[index] != player.getVariable("attachedObject")) return player.utils.error(`Wrong type of product!`);
        player.setVariable("attachedObject", null);

        var faction = mp.factions.getBySqlId(player.colshape.warehouse.faction);
        if (faction.products + weights[index] > faction.maxProducts) player.utils.warning(`Warehouse full!`);

        faction.setProducts(faction.products + weights[index]);

        if (mp.factions.isArmyFaction(player.faction)) {
            mp.events.call('army.getInfoWareHouse');
        }

        player.utils.info(`Composition: ${faction.products} / ${faction.maxProducts} Units.`);
    },

    "products.take": (player) => {
        if (player.getVariable("attachedObject")) return player.utils.error(`Not enough stamina!`);
        if(!player.factionProducts) return player.utils.error(`You're not at the warehouse!`);

        player.utils.setLocalVar("insideProducts", false);
        player.setVariable("attachedObject", player.factionProducts.modelName);
    },
}
