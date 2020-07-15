const { requestAnimDict } = require("gamemode/scripts/helpers/animHelper.js");
const { escapeHtml } = require("gamemode/scripts/helpers/stringHelper.js");
const instructionButtonsDrawler = require("gamemode/scripts/helpers/instructionButtonsDrawler.js");
const cameraRotator = require("gamemode/scripts/helpers/cameraRotator");
const loadingPrompt = require("gamemode/scripts/helpers/loadingPrompt");

const localPlayer = mp.players.local;
const hairColors = [];
const lipstickColors = [];
const makeupColors = [];
const torsoHairComponentsToRemove = [ 3, 7, 8, 9, 11 ];
let barberInfo = undefined;

mp.events.add("playerDeath", (player) => {
	if (isBarberStarted && player.remoteId === localPlayer.remoteId) {
		onBarberFinished();
	}
});

mp.events.add("barbershop::load_info", (rawInfo) => {
	barberInfo = JSON.parse(rawInfo);

	// Hair, Makeup
	const maxColors = Math.max(mp.game.invoke("0xE5C0CF872C2AD150"), mp.game.invoke("0xD1F7CA1535D22818"));

	for (let i = 0; i < maxColors; i++) {
		if (mp.game.ped.isAValidHairColor(i)) {
			hairColors.push(i);
		}

		if (mp.game.ped.isAValidLipstickColor(i)) {
			lipstickColors.push(i);
		}

		if (mp.game.ped.isAValidBlushColor(i)) {
			makeupColors.push(i);
		}
	}
});

let currentPlace = undefined;
let isBarberStarted = false;
let playerPed;
let keeperPed;
let camera = undefined;
let stage = -1;
let scissorsObj = undefined;
let isHighlightingEnabled = false;
let currentCutAnim = undefined;
let cutSoundStarted = false;
let cutAcceptCallback = undefined;
let removedClothing = [];
let currentEyeColor;
let cutSound;

mp.events.add("render", () => {
	if (barberInfo === undefined) {
		return;
	}

	if (isBarberStarted) {
		if (stage === 0 && playerPed && playerPed.hasAnimFinished(currentPlace.animDict, "player_enterchair", 3)) {
			onPedSeat();
		}

		if (stage === 2) {
			if (keeperPed && keeperPed.hasAnimFinished(currentPlace.animDict, currentCutAnim, 3)) {
				onCutFinished();
			}

			if (sceneId !== -1) {
				const phase = mp.game.ped.getSynchronizedScenePhase(sceneId);

				if (phase >= 0.3 && phase <= 0.4 && !cutSoundStarted) {
					if (cutAcceptCallback) {
						cutAcceptCallback();
						cutAcceptCallback = undefined;
					}

					mp.game.audio.playSoundFromEntity(1488, cutSound, keeperPed.handle, "Barber_Sounds", false, 0);
					cutSoundStarted = true;
				} else if (phase >= 0.6 && cutSoundStarted) {
					mp.game.audio.stopSound(1488);
					cutSoundStarted = false;
				}
			}
		}

		if (stage === 3 && playerPed && playerPed.hasAnimFinished(currentPlace.animDict, "player_exitchair", 3)) {
			onBarberFinished();
		}

		mp.game.invoke("0x719FF505F097FD20");

		return;
	}

	const interior = getCurrentInterior();
	let placeIndex;

	if (interior === 0 || (placeIndex = barberInfo.interiors.indexOf(interior)) < 0) {
		if (currentPlace !== undefined) {
			onStopInteraction();
		}

		return;
	}

	const place = barberInfo.places[placeIndex];

	if(!isLocalPlayerInAngledArea(place.interaction.origin, place.interaction.edge, place.interaction.angle)) {
		onStopInteraction();
		return;
	}

	if (currentPlace === undefined) {
		onStartInteraction(place);
	}
});

mp.events.add("barbershop::startBarber", async (hairColor, highlightColor, rawHeadOverlays, eyeColor) => {
	const playerPos = localPlayer.position;
	const playerDimension = localPlayer.dimension;
	const chairInfo = currentPlace.chair;
	const exitPos = currentPlace.exit.position;

	currentHair.color = hairColor;
	currentHair.highlightColor = highlightColor;
	playerHeadOverlays = new Map(JSON.parse(rawHeadOverlays));
	currentEyeColor = eyeColor;

	playerPed = mp.peds.new(localPlayer.model, playerPos, 0, playerDimension);
	keeperPed = mp.peds.new(currentPlace.pedModel, playerPos, 0, playerDimension);
	scissorsObj = mp.objects.new(barberInfo.scissors.model, currentPlace.scissorsPosition, {
		dimension: playerDimension
	});

	while (!scissorsObj.doesExist() && !playerPed.doesExist() && !keeperPed.doesExist()) {
		mp.game.wait(0);
	}

	keeperPed.taskLookAt(playerPed.handle, -1, 2048, 3);

	localPlayer.cloneToTarget(playerPed.handle);
	localPlayer.position = new mp.Vector3(exitPos.x, exitPos.y, exitPos.z);
	localPlayer.setHeading(currentPlace.exit.heading);
	localPlayer.freezePosition(true);
	localPlayer.setAlpha(0);
	localPlayer.setCollision(false, false);

	playVoice("SHOP_HAIR_WHAT_WANT");

	await requestAnimDict(currentPlace.animDict);

	camera = mp.cameras.new("default");

	playerPed.taskPlayAnimAdvanced(currentPlace.animDict, "player_enterchair", chairInfo.position.x, chairInfo.position.y,
		chairInfo.position.z, 0, 0, chairInfo.heading, 1000, -1000, -1, 5642, 0, 2, 1);
	playKeeperAnim("keeper_enterchair", "scissors_enterchair");

	const camInfo = currentPlace.cam;
	const camPos = mp.game.object.getObjectOffsetFromCoords(camInfo.position.x, camInfo.position.y, camInfo.position.z,
		camInfo.heading, camInfo.offset.x, camInfo.offset.y, camInfo.offset.z);

	camera.setCoord(camPos.x, camPos.y, camPos.z);
	camera.pointAtCoord(camInfo.position.x, camInfo.position.y, camInfo.position.z);
	camera.setFov(47);

	fadeScreen(false, 50);
	camera.setActive(true);
	mp.game.cam.renderScriptCams(true, false, 3000, true, false);
});

function onStartInteraction(place) {
	currentPlace = place;
	mp.events.call("prompt.show", `Press <span>Е</span> to make a haircut or make up.`);
}

function onStopInteraction(clearPlace = true) {
	if (clearPlace) {
		currentPlace = undefined;
	}

	mp.events.call("prompt.hide");
}

const Keys = {
	PageUp: 0x21,
	PageDown: 0x22,
	Q: 0x51,
	E: 0x45,
	Space: 0x20
};

// E
mp.keys.bind(Keys.E, true, () => {
	onKeyPressed(Keys.E);

	if (currentPlace === undefined || isBarberStarted || mp.gui.cursor.visible) {
		return;
	}

	stage = 0;
	isBarberStarted = true;
	selectedMainMenuIndex = 0;

	mp.game.ui.requestAdditionalText("HAR_MNU", 9);
	mp.game.audio.requestAmbientAudioBank("SCRIPT\\Hair_Cut", false);

	instructionButtonsDrawler.init();
	onStopInteraction(false);
	fadeScreen(true, 50);
	mp.events.callRemote("barbershop::onStart");
});

// PageUp
mp.keys.bind(Keys.PageUp, true, () => {
	onKeyPressed(Keys.PageUp);
});
// PageDown
mp.keys.bind(Keys.PageDown, true, () => {
	onKeyPressed(Keys.PageDown);
});
// Q
mp.keys.bind(Keys.Q, true, () => {
	onKeyPressed(Keys.Q);
});
// Space
mp.keys.bind(Keys.Space, true, () => {
	onKeyPressed(Keys.Space);
});

function onPedSeat() {
	stage = 1;

	playBaseAnims();
	showMainMenu();

	const camInfo = currentPlace.cam;

	cameraRotator.start(camera, camInfo.position, camInfo.position, camInfo.offset, camInfo.heading);
	cameraRotator.setXBound(150, 240);
	mp.gui.cursor.visible = true;
}

function onCutFinished() {
	stage = 1;

	playBaseAnims();
	showConcreteMenu(undefined);

	instructionButtonsDrawler.setActive(true);

	if (currentMenu === 0) {
		camera.setFov(33);
	}

	cameraRotator.pause(false);
}

function onKeyPressed(key) {
	if (!isBarberStarted || currentMenu === -1 || stage !== 1) {
		return;
	}

	switch (key) {
		case Keys.Space:
			if (currentMenu === 0) { // Hair
				isHighlightingEnabled = !isHighlightingEnabled;
				showHairInstructionButtons();
				setHairColorByIndexes();
			}

			break;
		case Keys.PageDown:
		case Keys.PageUp:
			if (currentMenu === 0) { // Hair
				currentHair.selectedColorIndex = getNextValidValue(hairColors, currentHair.selectedColorIndex, key === Keys.PageDown ? -1 : 1);

				setHairColorByIndexes();
			} else if (currentHeadOverlay.id !== -1 && currentHeadOverlay.colorIndex !== -1) {
				currentHeadOverlay.colorIndex = getNextValidValue(getHeadOverlayColors(currentHeadOverlay.id), currentHeadOverlay.colorIndex, key === Keys.PageDown ? -1 : 1);

				setCurrentHeadOverlayColor();
			}

			break;
		case Keys.Q:
		case Keys.E:
			if (currentMenu === 0 && isHighlightingEnabled) {
				currentHair.selectedHighlightColorIndex = getNextValidValue(hairColors, currentHair.selectedHighlightColorIndex, key === Keys.Q ? -1 : 1);

				setHairColorByIndexes();
			} else if (currentHeadOverlay.id !== -1 && currentHeadOverlay.opacity !== -1) {
				currentHeadOverlay.opacity += key === Keys.Q ? -0.05 : 0.05;

				if (currentHeadOverlay.opacity > 1) {
					currentHeadOverlay.opacity = 1;
				} else if (currentHeadOverlay.opacity < 0) {
					currentHeadOverlay.opacity = 0;
				}

				setCurrentHeadOverlay();
			}

			break;
	}
}

let selectedMainMenuIndex = 0;
let currentMenu = -1;
let currentHair = {
	drawable: -1,
	color: 0,
	highlightColor: 0,
	selectedColorIndex: 0,
	selectedHighlightColorIndex: 0
};
let playerHeadOverlays = new Map();
let currentHeadOverlay = {
	id: 0,
	index: 0,
	opacity: 1,
	colorIndex: 0
};

mp.events.add("selectMenu.itemSelected", async (menuName, itemName, itemValue, itemIndex) => {
	if (!menuName.startsWith("barbershop_")) {
		return;
	}

	if (menuName === "barbershop_m_main" || menuName === "barbershop_f_main") {
		if (itemName === "Back") {
			onBarberStop();
			return;
		}

		selectedMainMenuIndex = itemIndex;

		if (itemName === "Makeup") {
			mp.events.call("selectMenu.show", `barbershop_makeupMenu_${localPlayer.isMale() ? "m" : "f"}`);
			instructionButtonsDrawler.setButtons(...mainInstructionButtons);
			instructionButtonsDrawler.setActive(true);
			return;
		}

		showConcreteMenu(itemName);
	} else if (menuName === "barbershop_makeupMenu_m" || menuName === "barbershop_makeupMenu_f") {
		showConcreteMenu(itemName);
	} else if (menuName === "barbershop_concrete") {
		if (currentMenu === 0) { // Hair
			const hair = getHairDrawableByIndex(itemIndex);
			const { color, highlightColor } = getSelectedColors();

			if (hair === currentHair.drawable && color === currentHair.color && highlightColor === currentHair.highlightColor) {
				return;
			}

			if (!await checkPrice(itemIndex)) {
				return;
			}

			setCurrentHair();
			setCurrentHairColor();
			setHair(hair, color, highlightColor);
			playCutAnim(() => {
				setCurrentHair();
				setCurrentHairColor();
			});
		} else if (currentMenu === 4) { // Eye color
			if (currentEyeColor === itemIndex) {
				return;
			}

			if (!await checkPrice(itemIndex)) {
				return;
			}

			playerPed.setEyeColor(currentEyeColor);
			currentEyeColor = itemIndex;
			mp.events.callRemote("barbershop::setEyeColor", currentEyeColor);
			playCutAnim(() => {
				playerPed.setEyeColor(currentEyeColor);
			}, false);
		} else if(currentHeadOverlay.id !== -1) {
			const headOverlay = playerHeadOverlays.get(currentHeadOverlay.id);
			const overlayIndex = currentHeadOverlay.index;
			const overlayOpacity = currentHeadOverlay.opacity;
			const overlayColorIndex = currentHeadOverlay.colorIndex;

			let color = 0;

			if (overlayColorIndex !== -1) {
				color = getHeadOverlayColors(currentHeadOverlay.id)[overlayColorIndex];
			}

			if (
				headOverlay[0] === overlayIndex
				&& (headOverlay[1] === overlayOpacity || overlayOpacity === -1)
				&& (headOverlay[2] === color || overlayColorIndex === -1)
			) {
				return;
			}

			if (!await checkPrice(itemIndex)) {
				return;
			}

			const currentOverlay = currentHeadOverlay.id;
			let dependentOverlayId = undefined;

			resetCurrentHeadOverlay();

			if (currentMenu === 5 || currentMenu === 6 || currentMenu === 8) {
				dependentOverlayId = currentOverlay === 4 ? 5 : 4;

				const dependentOverlay = playerHeadOverlays.get(dependentOverlayId);

				if (dependentOverlay[0] !== 255) {
					currentHeadOverlay.id = dependentOverlayId;
					resetCurrentHeadOverlay();
					currentHeadOverlay.id = currentOverlay;
				}
			}

			setHeadOverlay(overlayIndex, overlayOpacity, color, overlayColorIndex, dependentOverlayId);

			playCutAnim(() => {
				setCurrentHeadOverlay();
				setCurrentHeadOverlayColor();

				if (dependentOverlayId) {
					currentHeadOverlay.id = dependentOverlayId;
					resetCurrentHeadOverlay();
					currentHeadOverlay.id = currentOverlay;
				}
			}, currentMenu <= 3);
		}
	}
});

mp.events.add("selectMenu.itemFocusChanged", (menuName, itemName, itemValue, itemIndex, valueIndex) => {
	if (!menuName.startsWith("barbershop_")) {
		return;
	}

	if (menuName === "barbershop_concrete") {
		if (currentMenu === 0) { // Hair
			playerPed.setComponentVariation(2, getHairDrawableByIndex(itemIndex), 0, 2);
			setHairColorByIndexes();
		} else if (currentMenu === 4) { // Eye color
			playerPed.setEyeColor(itemIndex);
		} else if (currentHeadOverlay.id !== -1) {
			let value = itemIndex === 0 ? 255 : itemIndex - 1;

			if (currentMenu === 5) {
				const painting = barberInfo.facePaintings[itemIndex];

				if (painting.i !== currentHeadOverlay.id) {
					playerPed.setHeadOverlay(currentHeadOverlay.id, 255, 1);

					currentHeadOverlay.id = painting.i;

					if (currentHeadOverlay.colorIndex === -1) {
						const overlayColors = getHeadOverlayColors(currentHeadOverlay.id);

						currentHeadOverlay.colorIndex = overlayColors.length > 0 ? overlayColors.indexOf(playerHeadOverlays.get(currentHeadOverlay.id)[2]) : -1;
					}

					showItemsInstructionButtons(currentHeadOverlay.colorIndex !== -1, currentHeadOverlay.opacity !== -1);
					setCurrentHeadOverlayColor();
				}

				value = painting.v;
			} else if (currentMenu === 6) {
				playerPed.setHeadOverlay(5, 255, 1);
				value = barberInfo.eyeMakeups[itemIndex].v;
			} else if (currentMenu === 8) {
				playerPed.setHeadOverlay(4, 255, 1);
			}

			currentHeadOverlay.index = value;
			setCurrentHeadOverlay();
		}
	}
});

mp.events.add("selectMenu.backspacePressed", (menuName) => {
	if (!menuName.startsWith("barbershop_")) {
		return;
	}

	if (menuName === "barbershop_concrete") {
		if(currentMenu === 0) { // Hair
			setCurrentHair();
			setCurrentHairColor();
		} else if (currentMenu === 4) { // Eye color
			playerPed.setEyeColor(currentEyeColor);
		} else if (currentHeadOverlay.id !== -1) {
			resetCurrentHeadOverlay();

			if (currentMenu === 5 || currentMenu === 6 || currentMenu === 8) {
				const dependentOverlayId = currentHeadOverlay.id === 4 ? 5 : 4;

				currentHeadOverlay.id = dependentOverlayId;
				resetCurrentHeadOverlay();
			}
		}

		if (currentMenu === 6 || currentMenu === 7 || currentMenu === 8) {
			mp.events.call("selectMenu.show", `barbershop_makeupMenu_${localPlayer.isMale() ? "m" : "f"}`);
			instructionButtonsDrawler.setButtons(...mainInstructionButtons);
			instructionButtonsDrawler.setActive(true);
		} else {
			showMainMenu();
		}

		camera.setFov(47);
	} else if (menuName === "barbershop_makeupMenu_m" || menuName === "barbershop_makeupMenu_f") {
		showMainMenu();
	}
});

function getCurrentInterior() {
	return mp.game.invoke("0x2107BA504071A6BB", localPlayer.handle);
}

function isLocalPlayerInAngledArea(origin, edge, angle) {
	return localPlayer.isInAngledArea(origin.x, origin.y, origin.z, edge.x, edge.y, edge.z, angle, false, true, 0);
}

function fadeScreen(state, duration) {
	if (state) {
		mp.game.cam.doScreenFadeOut(duration);
	} else {
		mp.game.cam.doScreenFadeIn(duration);
	}
}

let sceneId = -1;

function createScene(looped = false) {
	if (sceneId !== -1) {
		mp.game.ped.detachSynchronizedScene(sceneId);
		mp.game.ped.disposeSynchronizedScene(sceneId);
		sceneId = -1;
	}

	const chairInfo = currentPlace.chair;

	sceneId = mp.game.ped.createSynchronizedScene(chairInfo.position.x, chairInfo.position.y, chairInfo.position.z, 0, 0, chairInfo.heading, 2);

	mp.game.invoke("0x394B9CD12435C981", sceneId, true);
	mp.game.ped.setSynchronizedSceneLooped(sceneId, looped);

	return sceneId;
}

const mainInstructionButtons = [
	{ control: 201, label: "ITEM_SELECT" },
	{ altControl: "b_114", label: "ITEM_MOV_CAM" }
];
const baseItemsInstructionButtons = [
	{ control: 201, label: "ITEM_BUY" },
	{ control: 194, label: "ITEM_BACK" },
	{ altControl: "b_114", label: "ITEM_MOV_CAM" },
];
const hairInstructionButtons = [
	...baseItemsInstructionButtons,
	{ altControl: "b_1009%b_1010", label: "ITEM_T_HCOL" },
];

function showMainMenu() {
	currentMenu = -1;
	currentHeadOverlay.id = -1;
	restoreClothes();
	mp.events.call("selectMenu.show", `barbershop_${localPlayer.isMale() ? "m" : "f"}_main`, selectedMainMenuIndex);
	instructionButtonsDrawler.setButtons(...mainInstructionButtons);
	instructionButtonsDrawler.setActive(true);
}

function showConcreteMenu(header) {
	let selectedIndex = 0;
	const items = [];

	if (header === undefined) {
		header = getMenuHeaderByIndex(currentMenu);
	} else {
		currentMenu = getUniqueMenuIndexByName(header);
	}

	if (currentMenu === 0) { // Hair
		currentHair.drawable = playerPed.getDrawableVariation(2);
		currentHair.selectedColorIndex = hairColors.indexOf(currentHair.color);
		currentHair.selectedHighlightColorIndex = hairColors.indexOf(currentHair.highlightColor);

		if (currentHair.selectedColorIndex === -1) {
			currentHair.selectedColorIndex = 0;
		}

		if (currentHair.selectedHighlightColorIndex === -1) {
			currentHair.selectedHighlightColorIndex = 0;
		}

		selectedIndex = generateHairValues(items);
		isHighlightingEnabled = currentHair.color !== currentHair.highlightColor;
		showHairInstructionButtons();
	} else if (currentMenu === 4) { // Eye color
		selectedIndex = generateEyeColorValues(items);
		instructionButtonsDrawler.setButtons(...baseItemsInstructionButtons);
		instructionButtonsDrawler.setActive(true);
	} else { // Other overlays
		currentHeadOverlay.id = getOverlayIdByCurrentMenu();

		if (currentHeadOverlay.id === -1) {
			return;
		}

		if (currentMenu === 3 && removedClothing.length === 0) { // Torso hair
			for (const componentId of torsoHairComponentsToRemove) {
				const drawable = playerPed.getDrawableVariation(componentId);
				const texture = playerPed.getTextureVariation(componentId);
				const palette = playerPed.getPaletteVariation(componentId);

				removedClothing.push({ componentId, drawable, texture, palette });

				playerPed.setComponentVariation(componentId, getNakedClothes(componentId), 0, 0);
			}
		}

		resetCurrentHeadOverlay(false);

		if (currentMenu === 5) {
			selectedIndex = generateFacePaintingValues(items);
		} else if (currentMenu === 6) {
			selectedIndex = generateEyeMakeupValues(items);
		} else {
			selectedIndex = generateHeadOverlayValues(currentHeadOverlay.id, items);
		}

		showItemsInstructionButtons(currentHeadOverlay.colorIndex !== -1, currentHeadOverlay.opacity !== -1);
		setCurrentHeadOverlayColor();
	}

	if (currentMenu !== 3) {
		camera.setFov(33);
	}

	mp.events.call("selectMenu.setSpecialItems", "barbershop_concrete", items);
	mp.events.call("selectMenu.setHeader", "barbershop_concrete", header);
	mp.events.call("selectMenu.show", "barbershop_concrete", selectedIndex);
}

function generateHairValues(collection) {
	const hairValues = getHairValues();
	const isMale = playerPed.isMale();
	let selectedIndex = 0;

	for (let i = 0; i < hairValues.length; i++) {
		if (currentHair.drawable === hairValues[i]) {
			selectedIndex = i;
		}

		const label = getHairLabel(isMale, i);
		const text = escapeHtml(mp.game.ui.getLabelText(label));

		addMenuItem(collection, text, i);
	}

	return selectedIndex;
}

function generateHeadOverlayValues(overlayId, collection) {
	let selectedIndex = 0;

	const itemsCount = currentMenu === 8 ? 7 : mp.game.ped.getNumHeadOverlayValues(overlayId);

	for (let i = 0; i < itemsCount + 1; i++) {
		if (currentHeadOverlay.index === i - 1) {
			selectedIndex = i;
		}

		const label = getHeadOverlayLabel(overlayId, i);
		const text = escapeHtml(mp.game.ui.getLabelText(label));

		addMenuItem(collection, text, i);
	}

	return selectedIndex;
}

function generateEyeColorValues(collection) {
	let selectedIndex = 0;

	for (let i = 0; i < 32; i++) {
		if (currentEyeColor === i) {
			selectedIndex = i;
		}

		const label = `FACE_E_C_${i}`;
		const text = escapeHtml(mp.game.ui.getLabelText(label));

		addMenuItem(collection, text, i);
	}

	return selectedIndex;
}

function generateFacePaintingValues(collection) {
	let selectedIndex = 0;

	for (let i = 0; i < barberInfo.facePaintings.length; i++) {
		const facePainting = barberInfo.facePaintings[i];

		if (currentHeadOverlay.index === facePainting.v && currentHeadOverlay.id === facePainting.i) {
			selectedIndex = i;
		}

		const text = escapeHtml(mp.game.ui.getLabelText(facePainting.l));

		addMenuItem(collection, text, i);
	}

	return selectedIndex;
}

function generateEyeMakeupValues(collection) {
	let selectedIndex = 0;

	for (let i = 0; i < barberInfo.eyeMakeups.length; i++) {
		const eyeMakeup = barberInfo.eyeMakeups[i];

		if (currentHeadOverlay.index === eyeMakeup.v) {
			selectedIndex = i;
		}

		const text = escapeHtml(mp.game.ui.getLabelText(eyeMakeup.l));

		addMenuItem(collection, text, i);
	}

	return selectedIndex;
}

function getHeadOverlayDefaultOpacity(overlayId) {
	switch (overlayId) {
		case 1:
		case 2:
		case 4:
		case 5:
		case 10:
			return 1;
		case 8:
			return 0.8;
		default:
			return -1;
	}
}

function getHeadOverlayColors(overlayId) {
	switch (overlayId) {
		case 1:
		case 2:
		case 10:
			return hairColors;
		case 5:
			return makeupColors;
		case 8:
			return lipstickColors;
		default:
			return [];
	}
}

const maleHairLabels = [ "CC_M_HS_0", "CC_M_HS_1", "CC_M_HS_2", "CC_M_HS_3", "CC_M_HS_4", "CC_M_HS_5", "CC_M_HS_6", "CC_M_HS_7", "CC_M_HS_8", "CC_M_HS_9", "CC_M_HS_10", "CC_M_HS_11", "CC_M_HS_12", "CC_M_HS_13", "CC_M_HS_14", "CC_M_HS_15", "CC_M_HS_16", "CC_M_HS_17", "CC_M_HS_18", "CC_M_HS_19", "CC_M_HS_20", "CC_M_HS_21", "CC_M_HS_22", "CLO_S1M_H_0_0", "CLO_S1M_H_1_0", "CLO_S1M_H_2_0", "CLO_S1M_H_3_0", "CLO_S2M_H_0_0", "CLO_S2M_H_1_0", "CLO_S2M_H_2_0", "CLO_BIM_H_0_0", "CLO_BIM_H_1_0", "CLO_BIM_H_2_0", "CLO_BIM_H_3_0", "CLO_BIM_H_4_0", "CLO_BIM_H_5_0", "CLO_GRM_H_0_0", "CLO_GRM_H_1_0" ];
const femaleHairLabels = [ "CC_F_HS_0", "CC_F_HS_1", "CC_F_HS_2", "CC_F_HS_3", "CC_F_HS_4", "CC_F_HS_5", "CC_F_HS_6", "CC_F_HS_7", "CC_F_HS_8", "CC_F_HS_9", "CC_F_HS_10", "CC_F_HS_11", "CC_F_HS_12", "CC_F_HS_13", "CC_F_HS_14", "CC_F_HS_15", "CC_F_HS_16", "CC_F_HS_17", "CC_F_HS_23", "CC_F_HS_18", "CC_F_HS_19", "CC_F_HS_20", "CC_F_HS_21", "CC_F_HS_22", "CLO_S1F_H_0_0", "CLO_S1F_H_1_0", "CLO_S1F_H_2_0", "CLO_S1F_H_3_0", "CLO_S2F_H_0_0", "CLO_S2F_H_1_0", "CLO_S2F_H_2_0", "CLO_BIF_H_0_0", "CLO_BIF_H_1_0", "CLO_BIF_H_2_0", "CLO_BIF_H_3_0", "CLO_BIF_H_4_0", "CLO_BIF_H_6_0", "CLO_BIF_H_5_0", "CLO_GRF_H_0_0", "CLO_GRF_H_1_0" ];

function getHairLabel(isMale, index) {
	if (isMale) {
		return maleHairLabels[index];
	} else {
		return femaleHairLabels[index];
	}
}

function getHeadOverlayLabel(overlayId, index) {
	switch (overlayId) {
		case 1: // Beard
			return index <= 19 ? `HAIR_BEARD${index}` : `BRD_HP_${index-20}`;
		case 2: // Eyebrows
			return index === 0 ? "NONE" : `CC_EYEBRW_${index-1}`;
		case 5: // Blush
			return index === 0 ? "NONE" : `CC_BLUSH_${index-1}`;
		case 8: // Lipstick
			return index === 0 ? "NONE" : `CC_LIPSTICK_${index-1}`;
		case 10: // Torso hair
			return `CC_BODY_1_${index}`;
		default:
			return "NONE";
	}
}

function getUniqueMenuIndexByName(name) {
	switch (name) {
		case "Haircuts":
			return 0;
		case "Beards":
			return 1;
		case "Eyebrows":
			return 2;
		case "Chest":
			return 3;
		case "Lenses":
			return 4;
		case "Face painting":
			return 5;
		case "Eye":
			return 6;
		case "Lips":
			return 7;
		case "Blush":
			return 8;
		default:
			return -1;
	}
}

function getMenuHeaderByIndex(index) {
	switch (index) {
		case 0:
			return "Haircuts";
		case 1:
			return "Beards";
		case 2:
			return "Eyebrows";
		case 3:
			return "Chest";
		case 4:
			return "Lenses";
		case 5:
			return "Face painting";
		case 6:
			return "Eye";
		case 7:
			return "Lips";
		case 8:
			return "Blush";
		default:
			return "NONE";
	}
}

function getOverlayIdByCurrentMenu() {
	switch (currentMenu) {
		case 1:
			return 1;
		case 2:
			return 2;
		case 3:
			return 10;
		case 5:
			const makeupOverlay = playerHeadOverlays.get(4);

			if (makeupOverlay[0] !== 255) {
				return 4;
			}

			return playerHeadOverlays.get(5)[0] === 255 ? 4 : 5;
		case 6:
			return 4;
		case 7:
			return 8;
		case 8:
			return 5;
		default:
			return -1;
	}
}

function getHairDrawableByIndex(index) {
	return getHairValues()[index];
}

function getHairValues() {
	const genderIndex = playerPed.isMale() ? 0 : 1;

	return barberInfo.hairValues[genderIndex];
}

function showHairInstructionButtons() {
	const buttons = hairInstructionButtons.slice();

	if (isHighlightingEnabled) {
		buttons.splice(3, 0, { control: 203, label: "ITEM_X_TINT" });
		buttons.splice(4, 0, { altControl: "t_E%t_Q", label: "ITEM_B_HILI" });
	} else {
		buttons.splice(3, 0, { control: 203, label: "ITEM_X_HILI" });
	}

	instructionButtonsDrawler.setButtons(...buttons);
	instructionButtonsDrawler.setActive(true);
}

function showItemsInstructionButtons(showColor = false, showOpacity = false) {
	const buttons = baseItemsInstructionButtons.slice();
	let insertIndex = 3;

	if (showOpacity) {
		buttons.splice(insertIndex, 0, { altControl: "t_E%t_Q", label: "ITEM_B_OPACITY" });
		insertIndex++;
	}

	if (showColor) {
		buttons.splice(insertIndex, 0, { altControl: "b_1009%b_1010", label: "ITEM_T_COL" });
	}

	instructionButtonsDrawler.setButtons(...buttons);
	instructionButtonsDrawler.setActive(true);
}

function getNextValidValue(collection, currentValue, additionValue) {
	let value = currentValue + additionValue;

	if (value < 0) {
		value = collection.length - 1;
	}

	if (value >= collection.length) {
		value = 0;
	}

	return value;
}

function setHairColorByIndexes() {
	const { color, highlightColor } = getSelectedColors();

	playerPed.setHairColor(color, highlightColor);
}

function setHair(hair, color, highlightColor) {
	currentHair.drawable = hair;
	currentHair.color = color;
	currentHair.highlightColor = highlightColor;

	mp.events.callRemote("barbershop::setHair", currentHair.drawable, currentHair.color, currentHair.highlightColor);
}

function setCurrentHair() {
	playerPed.setComponentVariation(2, currentHair.drawable, playerPed.getTextureVariation(2), 2);
}

function setCurrentHairColor() {
	playerPed.setHairColor(currentHair.color, currentHair.highlightColor);
}

function getSelectedColors() {
	const color = hairColors[currentHair.selectedColorIndex];
	const highlightColor = isHighlightingEnabled ? hairColors[currentHair.selectedHighlightColorIndex] : color;

	return { color, highlightColor };
}

function playCutAnim(acceptCallback = undefined, withScissors = true) {
	const cutVariant = Math.random() >= 0.5 ? "a" : "b";

	currentCutAnim = getCutAnimPart() + cutVariant;

	instructionButtonsDrawler.setActive(false);

	mp.events.call("selectMenu.hide", "barbershop_concrete");
	camera.setFov(47);

	playVoice("SHOP_CUTTING_HAIR");

	if (withScissors) {
		cutSound = "Scissors";
		playKeeperAnim(currentCutAnim, currentCutAnim.replace("keeper_", "scissors_"));
	} else {
		cutSound = "Makeup";
		playKeeperAnim(currentCutAnim);
	}

	stage = 2;
	cutSoundStarted = false;

	if (acceptCallback) {
		cutAcceptCallback = acceptCallback;
	}
}

function getCutAnimPart() {
	return currentPlace.animDict.indexOf("hair_dressers") >= 0 ? "keeper_hair_cut_" : "keeper_idle_";
}

function playKeeperAnim(keeperAnim, scissorsAnim = undefined, looped = false) {
	sceneId = createScene(looped);

	keeperPed.taskSynchronizedScene(sceneId, currentPlace.animDict, keeperAnim, 1000, -1056964608, 0, 0, 1148846080, 0);

	if (scissorsAnim) {
		scissorsObj.setInvincible(false);
		scissorsObj.playSynchronizedAnim(sceneId, scissorsAnim, currentPlace.animDict, 1000, -1000, 0, 1148846080);
		scissorsObj.forceAiAndAnimationUpdate();
	} else {
		scissorsObj.setInvincible(true);
	}
}

function playBaseAnims() {
	const chairInfo = currentPlace.chair;

	playerPed.taskPlayAnimAdvanced(currentPlace.animDict, "player_base", chairInfo.position.x, chairInfo.position.y,
		chairInfo.position.z, 0, 0, chairInfo.heading, 8, 8, -1, 5641, 0, 2, 1);
	playKeeperAnim("keeper_base", "scissors_base", true);
}

function setHeadOverlay(index, opacity, color, colorIndex, clearOverlayId) {
	const headOverlay = playerHeadOverlays.get(currentHeadOverlay.id);

	headOverlay[0] = index;
	headOverlay[1] = opacity;
	headOverlay[2] = color;
	currentHeadOverlay.index = index;
	currentHeadOverlay.opacity = opacity;
	currentHeadOverlay.colorIndex = colorIndex;

	if (clearOverlayId) {
		const clearOverlay = playerHeadOverlays.get(clearOverlayId);

		clearOverlay[0] = 255;
	}

	mp.events.callRemote("barbershop::setHeadOverlay", currentHeadOverlay.id, index, opacity, color || 0, clearOverlayId);
}

function setCurrentHeadOverlay() {
	playerPed.setHeadOverlay(currentHeadOverlay.id, currentHeadOverlay.index, currentHeadOverlay.opacity);
}

function setCurrentHeadOverlayColor() {
	if (currentHeadOverlay.colorIndex === -1) {
		return;
	}

	const color = getHeadOverlayColors(currentHeadOverlay.id)[currentHeadOverlay.colorIndex];

	if (typeof(color) !== "number") {
		return;
	}

	playerPed.setHeadOverlayColor(currentHeadOverlay.id, getHeadOverlayColorType(currentHeadOverlay.id), color, color);
}

function resetCurrentHeadOverlay(applyOnPed = true) {
	const headOverlay = playerHeadOverlays.get(currentHeadOverlay.id);
	const overlayColors = getHeadOverlayColors(currentHeadOverlay.id);
	const defaultOpacity = getHeadOverlayDefaultOpacity(currentHeadOverlay.id);

	currentHeadOverlay.index = headOverlay[0];
	currentHeadOverlay.opacity = defaultOpacity;
	currentHeadOverlay.colorIndex = overlayColors.length > 0 ? overlayColors.indexOf(headOverlay[2]) : -1;

	if (applyOnPed) {
		setCurrentHeadOverlay();
		setCurrentHeadOverlayColor();
	}
}

function getHeadOverlayColorType(overlayId) {
	switch (overlayId) {
		case 1: case 2: case 10:
			return 1;
		case 5: case 8:
			return 2;
		default:
			return 0;
	}
}

function getNakedClothes(componentId) {
	switch (componentId) {
		case 3:
			return 15;
		case 7:
			return 0;
		case 8:
			return 15;
		case 9:
			return 0;
		case 11:
			return 15;
		default:
			return undefined;
	}
}

function restoreClothes() {
	if (removedClothing.length === 0) {
		return;
	}

	for (const clothes of removedClothing) {
		playerPed.setComponentVariation(clothes.componentId, clothes.drawable, clothes.texture, clothes.palette);
	}

	removedClothing = [];
}

function onBarberStop(withAnim = true) {
	mp.events.call("selectMenu.hide");
	cameraRotator.pause(true);
	cameraRotator.reset();
	mp.gui.cursor.visible = false;
	instructionButtonsDrawler.dispose();

	if (withAnim) {
		const chairInfo = currentPlace.chair;

		playVoice("SHOP_GOODBYE");

		playerPed.taskPlayAnimAdvanced(currentPlace.animDict, "player_exitchair", chairInfo.position.x, chairInfo.position.y,
			chairInfo.position.z, 0, 0, chairInfo.heading, 1000, -1000, -1, 5642, 0, 2, 1);
		playKeeperAnim("keeper_exitchair", "scissors_exitchair");

		stage = 3;
	} else {
		onBarberFinished();
	}
}

function onBarberFinished() {
	cameraRotator.stop();
	mp.game.cam.renderScriptCams(false, false, 3000, true, false);
	stage = -1;
	isBarberStarted = false;
	destroyEntities();
	mp.events.callRemote("barbershop::onStop");
	localPlayer.setCollision(true, true);
	localPlayer.freezePosition(false);
	localPlayer.setAlpha(255);
}

function destroyEntities() {
	keeperPed.destroy();
	scissorsObj.destroy();
	playerPed.destroy();
	camera.destroy();

	keeperPed = undefined;
	scissorsObj = undefined;
	playerPed = undefined;
	camera = undefined;
}

function playVoice(speechName) {
	const voice = currentPlace.pedModel === 0x418DFF92 ? "S_M_M_HAIRDRESSER_01_BLACK_MINI_01" : "S_F_M_FEMBARBER_BLACK_MINI_01";

	mp.game.audio.playAmbientSpeechWithVoice(keeperPed.handle, speechName, voice, "SPEECH_PARAMS_FORCE", false);
}

function addMenuItem(collection, itemName, itemIndex) {
	const price = getItemPrice(itemIndex);

	collection.push({ text: itemName, values: [ `${price} $` ] });
}

function getItemPrice(itemIndex) {
	const prices = barberInfo.prices[currentMenu];

	if (!Array.isArray(prices)) {
		return NaN;
	}

	return Array.isArray(prices[0]) ? prices[(localPlayer.isMale() ? 0 : 1)][itemIndex] : prices[itemIndex];
}

let checkPriceResolver;

function checkPrice(itemIndex) {
	cameraRotator.pause(true);
	cameraRotator.reset();

	return new Promise((resolve, reject) => {
		if (checkPriceResolver) {
			return reject("CheckPrice is already requested");
		}

		mp.events.call("selectMenu.hide");
		instructionButtonsDrawler.setActive(false);
		loadingPrompt.show("HUD_TRANSP", 4);

		checkPriceResolver = {
			resolve: (result) => {
				clearPriceCheck(result);
				resolve(result);
			},
			reject: (message) => {
				clearPriceCheck(false);
				reject(message);
			}
		}

		checkPriceResolver.timeout = setTimeout(() => {
			if (checkPriceResolver) {
				checkPriceResolver.reject("CheckPrice timeout");
			}
		}, 10000);

		mp.events.callRemote("barbershop::checkPrice", currentMenu, itemIndex, localPlayer.isMale());
	});
}

function clearPriceCheck(isSucces) {
	clearTimeout(checkPriceResolver.timeout);
	checkPriceResolver = undefined;
	loadingPrompt.hide();
	cameraRotator.pause(false);

	if (!isSucces) {
		showConcreteMenu(undefined);
	}
}

mp.events.add("barbershop::checkPriceResponse", (result) => {
	if(!checkPriceResolver || typeof(result) !== "boolean") {
		return;
	}

	if (isBarberStarted) {
		checkPriceResolver.resolve(result);
	} else {
		checkPriceResolver.resolve(false);
	}
});
