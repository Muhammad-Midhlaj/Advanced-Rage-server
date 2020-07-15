/*
	21.01.2019 created by Carter.

	Events to handle and show / hide the interaction menu.
*/
var interactionEntity;
var offsetX = 5,
    offsetY = 10; // screen menu shift
exports = (menu) => {

    mp.events.add("interactionMenu.showPlayerMenu", (player, values = null) => {
        interactionEntity = player;
        if (values) values = JSON.stringify(values);
        // debug(`interactionMenu.showPlayerMenu: ${player.name} ${values}`)
        menu.execute(`interactionMenuAPI.showPlayerMenu('${values}')`);
        setCursor(true);
    });

    mp.events.add("interactionMenu.showVehicleMenu", (vehicle, values = null) => {
        interactionEntity = vehicle;
        if (values) values = JSON.stringify(values);
        menu.execute(`interactionMenuAPI.showVehicleMenu('${values}')`);
        setCursor(true);
    });

    mp.events.add("interactionMenu.hide", () => {
        interactionEntity = null;
        menu.execute(`interactionMenuAPI.hide()`);
    });

    var playerItemHandlers = {
        "Shake hands": () => {
            if (!mp.storage.data.familiar) mp.storage.data.familiar = {};
            var familiarList = mp.storage.data.familiar;
            if (!familiarList[mp.players.local.name]) familiarList[mp.players.local.name] = [];
            familiarList = familiarList[mp.players.local.name];
            if (!interactionEntity) return mp.events.call(`nError`, `Citizen far!!`);
            var name = interactionEntity.name;
            if (familiarList.indexOf(name) != -1) return mp.events.call(`nError`, `You are already friend with ${name}!`);
            mp.events.callRemote(`familiar.createOffer`, interactionEntity.remoteId);
        },
        "Exchange": () => {
            mp.events.call(`trade.createOffer`);
        },
        "Invite in crew": () => {
            mp.events.callRemote("trash.invite.player", interactionEntity.remoteId);
        },
        "Dismiss from crew": () => {
            mp.events.callRemote("trash.uninvite.player", interactionEntity.remoteId);
        },
        "Invite in group": () => {
            mp.events.callRemote("gopostal.invite.player", interactionEntity.remoteId);
        },
        "Dismiss from group": () => {
            mp.events.callRemote("gopostal.uninvite.player", interactionEntity.remoteId);
        },
        "Show documents": () => {},
        "Certificate": () => {
            mp.events.callRemote("documents.showFaction", interactionEntity.remoteId);
        },
        "Passport": () => {
            mp.events.callRemote(`documents.show`, interactionEntity.remoteId, "passport");
        },
        "Licenses": () => {
            mp.events.callRemote(`documents.show`, interactionEntity.remoteId, "licenses");
        },
        "Weapon": () => {
            mp.events.callRemote(`documents.show`, interactionEntity.remoteId, "weapon");
        },
        "Job": () => {
            mp.events.callRemote(`documents.show`, interactionEntity.remoteId, "work");
        },
        "Invite to faction": () => {
            mp.events.callRemote(`factions.invite`, interactionEntity.remoteId);
        },
        "Promote": () => {
            mp.events.callRemote(`factions.giverank`, interactionEntity.remoteId);
        },
        "Demotion": () => {
            mp.events.callRemote(`factions.ungiverank`, interactionEntity.remoteId);
        },
        "Dismiss from faction": () => {
            mp.events.callRemote(`factions.uninvite`, interactionEntity.remoteId);
        },
        "Handcuffs": () => {
            mp.events.callRemote(`cuffsOnPlayer`, interactionEntity.remoteId);
        },
        "Wanted": () => {
            mp.events.callRemote(`showWantedModal`, interactionEntity.remoteId);
        },
        "Follow": () => {
            mp.events.callRemote(`startFollow`, interactionEntity.remoteId);
        },
        "Put in car": () => {
            var veh = getNearVehicle(mp.players.local.position);
            if (!veh) return mp.events.call(`nError`, `Car not found!`);
            var pos = veh.position;
            var localPos = mp.players.local.position;
            var dist = mp.game.system.vdist(pos.x, pos.y, pos.z, localPos.x, localPos.y, localPos.z);
            if (dist > 10) return mp.events.call(`nError`, `The car is far!`);
            mp.events.callRemote(`putIntoVehicle`, interactionEntity.remoteId, veh.remoteId);
        },
        "Fine": () => {
            mp.events.callRemote(`showFinesModal`, interactionEntity.remoteId);
        },
        "Arrest": () => {
            mp.events.callRemote(`arrestPlayer`, interactionEntity.remoteId);
        },
        "Cure": () => {
            mp.events.callRemote(`hospital.health.createOffer`, interactionEntity.remoteId);
        },
        "Send items": () => {
            var attachedObject = mp.players.local.getVariable("attachedObject");
            var haveProducts = (attachedObject == "prop_box_ammo04a" || attachedObject == "ex_office_swag_pills4");
            if (!haveProducts) return mp.events.call(`nError`, `You have no items!`);

            mp.events.callRemote(`army.transferProducts`, interactionEntity.remoteId);
        },
        "Usual": () => {
            mp.events.callRemote(`emotions.set`, 0);
        },
        "Stubble": () => {
            mp.events.callRemote(`emotions.set`, 1);
        },
        "Angry": () => {
            mp.events.callRemote(`emotions.set`, 2);
        },
        "Happy": () => {
            mp.events.callRemote(`emotions.set`, 3);
        },
        "Stress": () => {
            mp.events.callRemote(`emotions.set`, 4);
        },
        "Inflated": () => {
            mp.events.callRemote(`emotions.set`, 5);
        },
        "Normal": () => {
            mp.events.callRemote(`walking.set`, 0);
        },
        "Brave": () => {
            mp.events.callRemote(`walking.set`, 1);
        },
        "Confident": () => {
            mp.events.callRemote(`walking.set`, 2);
        },
        "Gangster": () => {
            mp.events.callRemote(`walking.set`, 3);
        },
        "Fast": () => {
            mp.events.callRemote(`walking.set`, 4);
        },
        "Sad": () => {
            mp.events.callRemote(`walking.set`, 5);
        },
        "Winged": () => {
            mp.events.callRemote(`walking.set`, 6);
        },
        "Shows the fact": () => {
            mp.events.callRemote(`animation.set`, 0);
        },
        "Rock two hands": () => {
            mp.events.callRemote(`animation.set`, 1);
        },
        "Rock with one hand": () => {
            mp.events.callRemote(`animation.set`, 2);
        },
        "Two fingers": () => {
            mp.events.callRemote(`animation.set`, 3);
        },
        "Stormy applause": () => {
            mp.events.callRemote(`animation.set`, 4);
        },
        "Handjob animation": () => {
            mp.events.callRemote(`animation.set`, 5);
        },
        "Pull ups": () => {
            mp.events.callRemote(`animation.set`, 6);
        },
        "Stretch at the bar": () => {
            mp.events.callRemote(`animation.set`, 7);
        },
        "Standing barbell": () => {
            mp.events.callRemote(`animation.set`, 8);
        },
        "Push ups": () => {
            mp.events.callRemote(`animation.set`, 9);
        },
        "Shakes the press": () => {
            mp.events.callRemote(`animation.set`, 10);
        },
        "Asleep": () => {
            mp.events.callRemote(`animation.set`, 11);
        },
        "Asleep arms": () => {
            mp.events.callRemote(`animation.set`, 12);
        },
        "Sleeps in a ball": () => {
            mp.events.callRemote(`animation.set`, 13);
        },
        "Twisted into a ball": () => {
            mp.events.callRemote(`animation.set`, 14);
        },
        "Sits looking at something": () => {
            mp.events.callRemote(`animation.set`, 15);
        },
        "Sits with a glass and drinks": () => {
            mp.events.callRemote(`animation.set`, 16);
        },
        "Sits freely apart legs": () => {
            mp.events.callRemote(`animation.set`, 17);
        },
        "Sits hand on hand": () => {
            mp.events.callRemote(`animation.set`, 18);
        },
        "Standing hands closed": () => {
            mp.events.callRemote(`animation.set`, 19);
        },
        "Closed by hands and осм.": () => {
            mp.events.callRemote(`animation.set`, 20);
        },
        "Bent over closes hands": () => {
            mp.events.callRemote(`animation.set`, 21);
        },
        "Bent over osm. on both sides": () => {
            mp.events.callRemote(`animation.set`, 22);
        },
        "Shrinks into a ball": () => {
            mp.events.callRemote(`animation.set`, 23);
        },
        "Sitting hands closed osm.": () => {
            mp.events.callRemote(`animation.set`, 24);
        },
        "Looking around and shaking": () => {
            mp.events.callRemote(`animation.set`, 25);
        },
        "Sitting on the cards with fists closed": () => {
            mp.events.callRemote(`animation.set`, 26);
        },
        "Sitting on the cards scared angry": () => {
            mp.events.callRemote(`animation.set`, 27);
        },
        "Shaking hands": () => {
            mp.events.callRemote(`animation.set`, 28);
        },
        "Leaned on the wall": () => {
            mp.events.callRemote(`animation.set`, 29);
        },
        "Dancing shaking pelvis": () => {
            mp.events.callRemote(`animation.set`, 30);
        },
        "Picks up a cigarette": () => {
            mp.events.callRemote(`animation.set`, 31);
        },

    };
    var vehicleItemHandlers = {
        "Throw out of car": () => {
            if (!mp.players.local.vehicle) return mp.events.call(`nError`, `You are not in car!`);
            let players = getOccupants(interactionEntity.remoteId);
            if (players.length < 2) return mp.events.call(`nError`, `Car is empty!`);
            mp.events.call("interactionMenu.hide");
            mp.events.call("modal.show", "throw_from_vehicle", { count: --players.length });
        },
        "Open / Close car": () => {
            if (!mp.players.local.vehicle) return mp.events.call(`nError`, `You are not in car!`);
            mp.events.callRemote("item.lockCar", interactionEntity.remoteId);
            mp.events.call("interactionMenu.hide");
        },
        /*"Open / Close Car": () => {
            if (!mp.players.local.vehicle) return mp.events.call(`nError`, `You are not in car!`);
            var hoodPos = getHoodPosition(interactionEntity);
            if (!hoodPos) return mp.events.call(`nError`, `Car is empty!`);
            mp.events.callRemote("vehicle.hood", interactionEntity.remoteId);
            mp.events.call("interactionMenu.hide");
        },
        "Open / Close the trunk": () => {
            if (!mp.players.local.vehicle) return mp.events.call(`nError`, `You are not in car!`);
            var bootPos = getBootPosition(interactionEntity);
            if (!bootPos) return mp.events.call(`nError`, `The trunk is not found!`);
            mp.events.callRemote("vehicle.boot", interactionEntity.remoteId);
            mp.events.call("interactionMenu.hide");
        },*/
        "Doors": () => {
            var dist = vdist(mp.players.local.position, interactionEntity.position);
            if (dist > 2) return mp.events.call(`nError`, `You are far from the door!`);

            mp.events.callRemote("item.lockCar", interactionEntity.remoteId);
            mp.events.call("interactionMenu.hide");
        },
        "Hood": () => {
            var player = mp.players.local;
            var hoodPos = getHoodPosition(interactionEntity);
            if (!hoodPos) return mp.events.call(`nError`, `Hood not found!`);
            if (vdist(player.position, hoodPos) > 2) return mp.events.call(`nError`, `You are far from the hood!`);

            mp.events.callRemote("vehicle.hood", interactionEntity.remoteId);
            mp.events.call("interactionMenu.hide");
        },
        "Trunk": () => {
            var player = mp.players.local;
            var bootPos = getBootPosition(interactionEntity);
            if (!bootPos) return mp.events.call(`nError`, `The trunk is not found!`);
            if (vdist(player.position, bootPos) > 2) return mp.events.call(`nError`, `Вы далеко от Sullenажника!`);

            mp.events.callRemote("vehicle.boot", interactionEntity.remoteId);
            mp.events.call("interactionMenu.hide");
        },
        "Items": () => {
            var player = mp.players.local;
            var bootPos = getBootPosition(interactionEntity);
            if (!bootPos) return mp.events.call(`nError`, `The trunk is not found!`);
            if (vdist(player.position, bootPos) > 2) return mp.events.call(`nError`, `You are far from the trunk!`);

            mp.events.callRemote("vehicle.products", interactionEntity.remoteId);
            mp.events.call("interactionMenu.hide");
        },
        "Fill up": () => {
            mp.events.callRemote("item.fuelCar", interactionEntity.remoteId);
            mp.events.call("interactionMenu.hide");
        },
        "Open": () => {
            mp.events.callRemote("police.lockVeh", interactionEntity.remoteId);
            mp.events.call("interactionMenu.hide");
        },
        "Push out": () => {
            var occupants = getOccupants(interactionEntity.remoteId);
            //debug(`Push out: occupants.length: ${occupants.length}`);
            if (!occupants.length) return;
            var names = [];
            for (var i = 0; i < occupants.length; i++) {
                names.push(occupants[i].name);
            }
            mp.events.call(`interactionMenu.showVehicleMenu`, interactionEntity, {
                action: "removeFromVehicle",
                names: names
            });
        },
    };

    mp.events.add("interactionMenu.onClickPlayerItem", (itemName) => {
        if (!interactionEntity) return mp.events.call(`nError`, `Citizen far!`);
        if (playerItemHandlers[itemName])
            playerItemHandlers[itemName]();
        mp.events.call("interactionMenu.hide");
    });

    mp.events.add("interactionMenu.onClickVehicleItem", (itemName) => {
        if (!interactionEntity) return mp.events.call(`nError`, `The car is far!`);
        if (vehicleItemHandlers[itemName])
            vehicleItemHandlers[itemName]();
    });
    mp.events.add("render", () => {
        if (interactionEntity) {
            if (!mp.players.exists(interactionEntity) && !mp.vehicles.exists(interactionEntity)) interactionEntity = null; //todo fix
            else {
                var pos3d = interactionEntity.position;
                var dist = vdist(mp.players.local.position, pos3d);
                if (interactionEntity.type == "vehicle") {
                    if (dist > 2) {
                        var bootPos = getBootPosition(interactionEntity);
                        var bootDist = 10;
                        if (bootPos) bootDist = vdist(mp.players.local.position, bootPos);
                        // drawText2d(`trunk: ${bootDist} m.`);
                        if (bootDist < 1) {
                            pos3d = bootPos;
                        } else {
                            var hoodPos = getHoodPosition(interactionEntity);
                            var hoodDist = 10;
                            if (hoodPos) hoodDist = vdist(mp.players.local.position, hoodPos);
                            // drawText2d(`Hood: ${hoodDist} m.`, [0.8, 0.55]);
                            if (hoodDist < 1) {
                                pos3d = hoodPos;
                            } else return mp.events.call("interactionMenu.hide");
                        }
                    }
                } else if (dist > 2 && interactionEntity.type == "player") return mp.events.call("interactionMenu.hide");

                var pos2d = mp.game.graphics.world3dToScreen2d(pos3d.x, pos3d.y, pos3d.z + 1);
                if (!pos2d) return;
                menu.execute(`interactionMenuAPI.move('${pos2d.x * 100 + offsetX}', '${pos2d.y * 100 + offsetY}')`);
            }
        }
    });

}
