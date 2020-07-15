/**
 * Spin types:
 * 0: LOADING_PROMPT_LEFT,
 * 1: LOADING_PROMPT_LEFT_2
 * 2: LOADING_PROMPT_LEFT_3
 * 3: SAVE_PROMPT_LEFT
 * 4: LOADING_PROMPT_RIGHT
 */

 class LoadingPrompt {
	show(textEntry, spinType = 4) {
		mp.game.ui.setLoadingPromptTextEntry(textEntry);
		mp.game.ui.showLoadingPrompt(spinType);
	}

	showMessage() {
		mp.game.ui.setLoadingPromptTextEntry("STRING");
		mp.game.ui.addTextComponentSubstringPlayerName(message);
		mp.game.ui.showLoadingPrompt(spinType);
	}

	hide() {
		mp.game.invoke("0x10D373323E5B9C0D");
	}
}

const loadingPrompt = new LoadingPrompt();

exports = loadingPrompt
