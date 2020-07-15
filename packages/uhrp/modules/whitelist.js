let whitelist = [];

function checkPlayer(player) {
	const socialClub = player.socialClub.toLowerCase();

	if (whitelist.indexOf(socialClub) >= 0) {
		return;
	}

	//player.kick("Вы отсутствуете в Whitelist.");
}

function initwhitelist(isRefresh = false) {
	if (whitelist.length > 0) {
		whitelist = [];
	}

	DB.Handle.query("SELECT * FROM whitelist WHERE enabled=1", (e, result) => {
		if (e) {
			console.log(`Whitelist not loaded, ${e}`);
			return;
		}

		for (const row of result) {
			whitelist.push(row.socialClub.toLowerCase());
		}

		if (!isRefresh) {
			mp.events.add("playerJoin", checkPlayer);
		}

		mp.players.forEach(checkPlayer);

		console.log(`WhiteList: uploaded ${whitelist.length} records`);
	});
}

module.exports = {
	Init: () => {
		initwhitelist();
	},
	Refresh() {
		initwhitelist(true);
	}
}
