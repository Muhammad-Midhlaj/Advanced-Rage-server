const localPlayer = mp.players.local;
//localPlayer.getWeaponTypeInSlot = (weaponSlot) => mp.game.invoke('0xBBDDEBFD9564D52C', localPlayer.handle, weaponSlot);
localPlayer.getAmmoWeapon = (weaponhash) => mp.game.invoke('0x015A522136D7F951', localPlayer.handle, weaponhash);
localPlayer.removeWeapon = (weaponhash) => mp.game.invoke('0x4899CB088EDF59B8', localPlayer.handle, weaponhash);
localPlayer.setWeaponAmmo = (weaponhash, ammo) => mp.game.invoke('0x14E56BC5B5DB6A19', localPlayer.handle, weaponhash, ammo);
localPlayer.currentWeapon = () => mp.game.invoke('0x0A6DB4965674D243', localPlayer.handle);
localPlayer.getAmmoType = () => mp.game.invoke(`0xa38dcffcea8962fa`, localPlayer.handle, localPlayer.weapon); 
//localPlayer.getWeaponType = () => mp.game.invoke(`0xF46CDC33180FDA94`, localPlayer.handle, localPlayer.weapon); 
//let ammoType = mp.game.invoke(`0xa38dcffcea8962fa`, mp.players.local.handle, player.weapon);  
//localPlayer.giveWeaponComponent = (weaponhash, component) => mp.game.invoke('0xAD084726D7F23594', localPlayer.handle, weaponhash, component);
//localPlayer.getWeaponAmmoinClip = (weaponhash) => mp.game.invoke('0x583BE370B1EC6EB4', weaponhash);
/*localPlayer.getAllWeapons = () => {
	const weapons = {};
	weaponSlots.forEach(weaponSlot => {
		const weapon = localPlayer.getWeaponTypeInSlot(weaponSlot);
		if (weapon !== 0 && weapon !== -1569615261) {
			weapons[weapon] = { ammo: localPlayer.getAmmoWeapon(weapon) };
		}
	});
	return weapons;
};*/

mp.events.add("getAmmoWeapon", (weaponhash) => {
    var localPlayer = mp.players.local;
    var weaponHash = localPlayer.currentWeapon();
    var ammo = localPlayer.getAmmoWeapon(weaponHash);
    //debug(`ammo: ${ammo}`)
});

mp.events.add("getWeaponTypeInSlot", (weaponSlot) => {
    var val = mp.players.local.getWeaponTypeInSlot(weaponSlot);
    //debug(`type: ${val}`);
});

mp.events.add("getAmmoWeapon", (weaponhash) => {
    var val = mp.players.local.getAmmoWeapon(weaponhash);
    //debug(`ammo ${val}`);

});
mp.events.add("removeWeapon", (weaponhash) => {
    mp.players.local.removeWeapon(weaponhash);
});

mp.events.add("setWeaponAmmo", (weaponhash, ammo) => {
    //debug(`client setWeaponAmmo: ${weaponhash} ${ammo}`);
    var val = mp.players.local.setWeaponAmmo(weaponhash, ammo);
});

mp.events.add("addWeaponAmmo", (weaponhash, add) => {
    var ammo = mp.players.local.getAmmoWeapon(weaponhash);
    mp.players.local.setWeaponAmmo(weaponhash, ammo + add);
});

mp.events.add("weapon.throw", (itemSqlId, weaponHash) => {
    var ammo = mp.players.local.getAmmoWeapon(weaponHash);
    mp.events.callRemote(`weapon.throw`, itemSqlId, ammo);
    //debug(`client: weapon.throw hash: ${weaponHash}`);
});

mp.events.add("playerWeaponShot", (targetPosition, targetEntity) => {
    var weaponHash = localPlayer.currentWeapon();
    var ammo = localPlayer.getAmmoWeapon(weaponHash);
    //var ammoType = localPlayer.getAmmoType(localPlayer.weapon);
    //let ammoClip = mp.game.weapon.getWeaponClipSize(weaponHash);

    //var data = { ammo: ammo, ammoType: ammoType, weaponHash: localPlayer.weapon };
    ////browserMenu.execute(`mp.events.call('hudControl', { data: ${JSON.stringify(data)}, event: 'setDataWeapon' })`);

    if (ammo % 10 == 0) mp.events.callRemote("weapon.updateAmmo", weaponHash, ammo);
    //menu.execute(`alert(${localPlayer.currentWeapon()})`);
});

exports = (menu) => {
    browserMenu = menu;
}
