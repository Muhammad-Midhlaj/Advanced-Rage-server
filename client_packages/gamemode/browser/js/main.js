window.clientStorage = {};
window.globalConstants = {
    houseClasses: ["-", "A", "B", "C", "D", "E", "F"],
    garageClasses: ["-", "A", "B", "C"],
    garageMaxCars: [0, 2, 6, 10],
    doors: ["Opened", "Closed"],
    bizesInfo: [{
            name: "Diner",
            blip: 106
        },
        {
            name: "Bar",
            blip: 93
        },
        {
            name: "Clothing store",
            blip: 73
        },
        {
            name: "Barbershop",
            blip: 71
        },
        {
            name: "Petrol station",
            blip: 361
        },
        {
            name: "24/7",
            blip: 52
        },
        {
            name: "Tattoo salon",
            blip: 75
        },
        {
            name: "Gun shop",
            blip: 110
        },
        {
            name: "Dealership",
            blip: 524
        },
        {
            name: "LS Customs",
            blip: 72
        },
        {
            name: "СТО",
            blip: 446
        }
    ],
    bizStatus: ["Closed", "Opened"],

};
var mp;
if (mp != null) {
    mp.eventCallRemote = (name, values) => {
        mp.trigger(`events.callRemote`, name, JSON.stringify(values));
    };
}

function getNameByFactionId(id) {
    var names = ["City hall", "LSPD", "BCSO", "FIB", "EMC", "Fort Zancudo", "Merryweather", "Weazel News", "The families",
        "The Ballas Gang", "Varios Los Aztecas Gang", "Los Santos Vagos", "Marabunta Grande", "Russian Mafia",
        "Italian Mafia", "Japanese mafia", "Mexican Mafia"
    ];
    id = Math.clamp(id, 1, names.length - 1);
    return names[id - 1];
}

function setLocalVar(key, value) {
    window.clientStorage[key] = JSON.parse(value);
}

function debug(text) {
    consoleAPI.debug(text);
}

function setCursor(enable) {
    mp.invoke('focus', enable);
}

function setOnlyInt(textField) {
    $(textField).keypress(function(e) {
        if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
            return false;
        }
    });
}

function clearOnlyInt(textField) {
    $(textField).off("keypress");
}

function isFlood() {
    return false;
    if (window.antiFlood) {
        mp.trigger(`nError`, 'Anti-FLOOD!');
        return true;
    }
    window.antiFlood = true;
    setTimeout(() => {
        window.antiFlood = false;
    }, 1000);

    return false;
}

function nSuccess(text) {
    mp.trigger(`nSuccess`, text);
}

function nError(text) {
    console.error(text);
    if (mp) mp.trigger(`nError`, text);
}

function nInfo(text) {
    mp.trigger(`nInfo`, text);
}

// выделить текстовое поле
var lightTextFieldTimer;

function lightTextField(textField, color) {
    if (lightTextFieldTimer) return;
    $(textField).focus();
    var oldColor = $(textField).css("border-color");
    $(textField).css("border-color", color);
    lightTextFieldTimer = setTimeout(() => {
        $(textField).css("border-color", oldColor);
        lightTextFieldTimer = null;
    }, 1000);
}

function lightTextFieldError(textField, text) {
    lightTextField(textField, "#b44");
    nError(text);
}

function authCharacterSuccess() {
    $(document).bind('keydown', (e) => {
        if (e.keyCode === 114) { // F3
            playersOnlineAPI.show(!playersOnlineAPI.active());
        }
    });
}

function convertMillsToDate(mills) {
    var date = new Date(mills);
    var day = date.getDate();
    var month = date.getMonth() + 1;
    var hours = date.getHours();
    var minutes = date.getMinutes();
    if (day < 10) day = "0" + day;
    if (month < 10) month = "0" + month;
    if (hours < 10) hours = "0" + hours;
    if (minutes < 10) minutes = "0" + minutes;
    return day + "." + month + "." + date.getFullYear() + " " + hours + ":" + minutes;
}

function convertMinutesToLevelRest(minutes) {
    var exp = parseInt(minutes / 60);
    if (exp < 8) return {
        level: 1,
        rest: exp
    };
    var i = 2;
    var add = 16;
    var temp = 24;
    while (i < 200) {
        if (exp < temp) {
            /*console.log(`exp: ${exp}`);
            console.log(`temp: ${temp}`);
            console.log(`add: ${add}`);*/
            return {
                level: i,
                rest: exp - (temp - add)
            };
        }
        i++;
        add += 8;
        temp += add;
    }
    return -1;
}

function convertLevelToMaxExp(level) {
    return 8 + (level - 1) * 8;
}

Math.clamp = function(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

Math.randomInteger = (min, max) => {
    var rand = min - 0.5 + Math.random() * (max - min + 1)
    rand = Math.round(rand);
    return rand;
}

function getPaddingNumber(str, max = 5) {
    const string = str.toString();
    return string.length < max ? getPaddingNumber(`0${string}`, max) : string;
}

String.prototype.escape = function() {
    return this.replace(/[&"'\\]/g, "");
};
