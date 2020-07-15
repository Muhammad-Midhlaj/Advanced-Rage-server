// REAL TIME SCRIPT
function startTime() {
	 	 	var today = new Date();
	  		var h = today.getHours();
	  		var m = today.getMinutes();
	 		m = checkTime(m);
	 		document.getElementById('txt').innerHTML = h + ":" + m;
	  		var t = setTimeout(startTime, 500);
		}

		function checkTime(i) {
 			if (i < 10) {i = "0" + i};
  			return i;
		}
// ANIMATION "OPEN SETTINGS"
settings = document.getElementById("settings");
windowMenuSettings = document.getElementById("windowSettings");
var checkSettings = 0;
settings.onclick = function changeOpacitySettings() {
	// Проверка
	if(checkDonate == 1 || checkMessages == 1 || checkCalls == 1) {
		windowMenuDonate.style.opacity = "0";
		windowMenuMessages.style.opacity = "0";
		windowMenuCalls.style.opacity = "0";
		checkDonate = 0;
		checkMessages = 0;
		checkCalls = 0;

		windowMenuSettings.style.opacity = "1";
		checkSettings += 1;
		return
	}

	// скрипт переключения 
	if(checkSettings == 0) {
		windowMenuSettings.style.opacity = "1";
		checkSettings += 1;
	}

	else {
		windowMenuSettings.style.opacity = "0";
		checkSettings -= 1;
	}
};

// ANIMATION "OPEN DONATE"
donate = document.getElementById("donate");
windowMenuDonate = document.getElementById("windowDonate");
var checkDonate = 0;
donate.onclick = function changeOpacityDonate() {
	// Проверка
	if(checkDonate == 1 || checkMessages == 1 || checkCalls == 1) {
		windowMenuSettings.style.opacity = "0";
		windowMenuMessages.style.opacity = "0";
		windowMenuCalls.style.opacity = "0";
		checkSettings = 0;
		checkMessages = 0;
		checkCalls = 0;

		windowMenuDonate.style.opacity = "1";
		checkDonate += 1;
		return
	}

	//SCRIPT

	if(checkDonate == 0) {
		windowMenuDonate.style.opacity = "1";
		checkDonate += 1;
	}
	else {
		windowMenuDonate.style.opacity = "0";
		checkDonate -= 1;
	}
};

// ANIMATION "OPEN MESSAGES"
messages = document.getElementById("messages");
windowMenuMessages = document.getElementById("windowMessages");
var checkMessages = 0;
messages.onclick = function changeOpacityMessage() {
	// proverka
	if(checkDonate == 1 || checkMessages == 1 || checkCalls == 1) {
		windowMenuSettings.style.opacity = "0";
		windowMenuDonate.style.opacity = "0";
		windowMenuCalls.style.opacity = "0";
		checkSettings = 0;
		checkDonate = 0;
		checkCalls = 0;

		windowMenuMessages.style.opacity = "1";
		checkMessages += 1;
		return
	}
		// скриптонит ахаха

	if(checkMessages == 0) {
		windowMenuMessages.style.opacity = "1";
		checkMessages += 1;
	}
	else {
		windowMenuMessages.style.opacity = "0";
		checkMessages -= 1;
	}
};

// ANIMATION "OPEN CALLS"
calls = document.getElementById("calls");
windowMenuCalls = document.getElementById("windowCalls");
var checkCalls = 0;
calls.onclick = function changeOpacityCalls() {
	// proverka
	if(checkDonate == 1 || checkMessages == 1 || checkCalls == 1) {
		windowMenuSettings.style.opacity = "0";
		windowMenuDonate.style.opacity = "0";
		windowMenuMessages.style.opacity = "0";
		checkSettings = 0;
		checkDonate = 0;
		checkMessages = 0;

		windowMenuCalls.style.opacity = "1";
		checkCalls += 1;
		return
	}
// script
	if(checkCalls == 0) {
		windowMenuCalls.style.opacity = "1";
		checkCalls += 1;
	}
	else {
		windowMenuCalls.style.opacity = "0";
		checkCalls -= 1;
	}
};

// Кнопка снизу, которая скрывает все открытые приложения

slider = document.getElementById("slider");
slider.onclick = function closeApps() {
	windowMenuSettings.style.opacity = "0";
	windowMenuDonate.style.opacity = "0";
	windowMenuMessages.style.opacity = "0";
	windowMenuCalls.style.opacity = "0";
}