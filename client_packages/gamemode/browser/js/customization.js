var customizationApp;

var colors = ["#ff0000", "#a20000", "#370000", "#000000", "#ec00b7", "#8e006e", "#530040", "#4800ff", "#2f00a8", "#1c0161", "#0096ff", "#005692"];

var mothers = [
    ["female_1", "Mom's name 1"],
    ["female_2", "Mom's name 2"],
    ["female_3", "Mom's name 2"],
    ["female_4", "Mom's name 3"],
    ["female_5", "Mom's name 4"],
    ["female_6", "Mom's name 5"],
    ["female_7", "Mom's name 6"],
    ["female_8", "Mom's name 7"],
    ["female_9", "Mom's name 8"],
    ["female_10", "Mom's name 9"],
    ["female_11", "Mom's name 10"],
    ["female_12", "Mom's name 11"],
    ["female_13", "Mom's name 12"],
    ["female_14", "Mom's name 13"],
    ["female_15", "Mom's name 14"],
    ["female_16", "Mom's name 15"],
    ["female_17", "Mom's name 16"],
    ["female_18", "Mom's name 17"],
    ["female_19", "Mom's name 18"],
    ["female_20", "Mom's name 19"],
    ["special_female_0", "Mom's name 20"]
];

var fathers = [
    ["male_1", "Dad's name 1"],
    ["male_2", "Dad's name 2"],
    ["male_3", "Dad's name 3"],
    ["male_4", "Dad's name 4"],
    ["male_5", "Dad's name 5"],
    ["male_6", "Dad's name 6"],
    ["male_7", "Dad's name 7"],
    ["male_8", "Dad's name 8"],
    ["male_9", "Dad's name 9"],
    ["male_10", "Dad's name 10"],
    ["male_11", "Dad's name 11"],
    ["male_12", "Dad's name 12"],
    ["male_13", "Dad's name 13"],
    ["male_14", "Dad's name 14"],
    ["male_15", "Dad's name 15"],
    ["male_16", "Dad's name 16"],
    ["male_17", "Dad's name 17"],
    ["male_18", "Dad's name 18"],
    ["male_19", "Dad's name 19"],
    ["male_20", "Dad's name 20"],
    ["special_male_0", "Tonnie"],
    ["special_male_1", "Niko"]
];

var characters = ["Character 1", "Character 2", "Характе 3", "Character 4", "Character 5", "Character 6"];
var eyebrows = ["Wide", "Narrow", "Abrupt"];

var motherList = [];
for (var i = 0; i < mothers.length; i++) motherList[i] = mothers[i][1];
var fatherList = [];
for (var i = 0; i < fathers.length; i++) fatherList[i] = fathers[i][1];

var items = [
    ["Mother", "motherSelector", motherList, 0],
    ["Father", "fatherSelector", fatherList, 0],
    ["Appearance"],
    ["Skin color"],
    ["Character", "characterSelector", characters, 0],
    ["Eyebrows", "eyebrowsSelector", eyebrows, 0],

];

$(document).ready(function() {

    customizationApp = new Vue({
        el: '.customizationMenu',
        data: {
            selectedItem: 0,
            maxItem: 0,

            limit: 0,

            selectedColor: 0,
            maxColor: 0,
            limitColor: 0,

            motherPic: "img/customization/parent/male_18.png",
            fatherPic: "img/customization/parent/female_20.png"
        },
        methods: {

            selectItem: function(item) {
                if (customizationApp.$data.selectedItem !== item) {

                    $(".setting-item:eq(" + customizationApp.$data.selectedItem + ")").removeClass("setting-item-active");
                    $(".setting-item:eq(" + item + ")").addClass("setting-item-active");
                    customizationApp.$data.selectedItem = item;
                }
            },
            navigationTo: function(to) {
                if (to) {
                    moveMenuToBottom();
                } else {
                    moveMenuToTop();
                }
            },
            selectColor: function(color) {
                $(".color-selector-list div:eq(" + customizationApp.$data.selectedColor + ")").find("i").remove();
                customizationApp.$data.selectedColor = color;
                $(".color-selector-list div:eq(" + customizationApp.$data.selectedColor + ")").append("<i class='selected-block'></i>");
            },
            colorsTo: function(to) {
                if (to) {

                    $(".color-selector-list div:eq(" + customizationApp.$data.selectedColor + ")").find("i").remove();

                    customizationApp.$data.selectedColor++;
                    if (customizationApp.$data.selectedColor > customizationApp.$data.limitColor) {
                        customizationApp.$data.limitColor++;
                        if (customizationApp.$data.limitColor >= colors.length - 1) {
                            customizationApp.$data.limitColor = 8;
                        }
                        $(".color-selector-list div:eq(" + (customizationApp.$data.selectedColor - 9) + ")").hide();
                        $(".color-selector-list div:eq(" + customizationApp.$data.selectedColor + ")").show();

                        $(".color-selector-list div:eq(" + (customizationApp.$data.selectedColor - 8) + ")").addClass("first-selected-block");
                        $(".color-selector-list div:eq(" + (customizationApp.$data.selectedColor - 1) + ")").removeClass("last-selected-block");
                        $(".color-selector-list div:eq(" + customizationApp.$data.selectedColor + ")").addClass("last-selected-block");
                    }

                    if (customizationApp.$data.selectedColor > colors.length - 1) {
                        customizationApp.$data.selectedColor = 0;
                        customizationApp.$data.limitColor = 8;

                        for (var i = 0; i < colors.length; i++) {

                            $(".color-selector-list div:eq(" + i + ")").removeClass("first-selected-block");
                            $(".color-selector-list div:eq(" + i + ")").removeClass("last-selected-block");
                            if (i < 9) {

                                if (i == 0) $(".color-selector-list div:eq(" + i + ")").addClass("first-selected-block");
                                else if (i == 8) $(".color-selector-list div:eq(" + i + ")").addClass("last-selected-block");
                                $(".color-selector-list div:eq(" + i + ")").show();
                            } else $(".color-selector-list div:eq(" + i + ")").hide();
                        }
                    }
                    $(".color-selector-list div:eq(" + customizationApp.$data.selectedColor + ")").append("<i class='selected-block'></i>");
                } else {
                    $(".color-selector-list div:eq(" + customizationApp.$data.selectedColor + ")").find("i").remove();

                    customizationApp.$data.selectedColor--;

                    if (customizationApp.$data.selectedColor < (customizationApp.$data.limitColor - 8)) {
                        customizationApp.$data.limitColor = colors.length - 1;
                        $(".color-selector-list div:eq(" + (customizationApp.$data.selectedColor - 8) + ")").hide();
                        $(".color-selector-list div:eq(" + customizationApp.$data.selectedColor + ")").show();

                        $(".color-selector-list div:eq(" + customizationApp.$data.selectedColor + ")").addClass("first-selected-block");
                        $(".color-selector-list div:eq(" + (customizationApp.$data.selectedColor + 1) + ")").removeClass("first-selected-block");
                        $(".color-selector-list div:eq(" + (customizationApp.$data.selectedColor - 8) + ")").addClass("last-selected-block");
                    }

                    if (customizationApp.$data.selectedColor < 0) {
                        customizationApp.$data.selectedColor = colors.length - 1;

                        for (var i = 0; i < colors.length; i++) {

                            $(".color-selector-list div:eq(" + i + ")").removeClass("first-selected-block");
                            $(".color-selector-list div:eq(" + i + ")").removeClass("last-selected-block");

                            if (i > (colors.length - 9 - 1)) {
                                if (i == (colors.length - 9)) $(".color-selector-list div:eq(" + i + ")").addClass("first-selected-block");
                                else if (i == (colors.length - 1)) $(".color-selector-list div:eq(" + i + ")").addClass("last-selected-block");

                                $(".color-selector-list div:eq(" + i + ")").show();
                            } else $(".color-selector-list div:eq(" + i + ")").hide();
                        }
                    }

                    $(".color-selector-list div:eq(" + customizationApp.$data.selectedColor + ")").append("<i class='selected-block'></i>");
                }
            }
        },
        created: function() {
            for (var i = 0; i < items.length; i++) {

                var style = "";
                if (i >= 6) style += "display: none;";

                var settingsItem = "";
                if (items[i][1] === "motherSelector") {
                    settingsItem = `<span class="settings-selector">` + motherList[0] + `</span>`;
                } else if (items[i][1] === "fatherSelector") {
                    settingsItem = `<span class="settings-selector">` + fatherList[0] + `</span>`;
                } else if (items[i][1] === "characterSelector") {
                    settingsItem = `<span class="settings-selector">` + characters[0] + `</span>`;
                } else if (items[i][1] === "eyebrowsSelector") {
                    settingsItem = `<span class="settings-selector">` + eyebrows[0] + `</span>`;
                }

                $(".character-settings").append(`
                    <li class="setting-item" v-on:click="selectItem(` + i + `)" style="` + style + `">
                    <div>` + items[i][0] + settingsItem + `</div>
                    </li>`);
            }

            for (var i = 0; i < colors.length; i++) {

                var style = "";
                if (i >= 9) style += "display: none";

                $(".color-selector-list").append(`
                    <div class="color-block" v-on:click="selectColor(` + i + `)" style="background: ` + colors[i] + `;` + style + `;"></div>
                `);
            }
        }
    });

    customizationApp.$data.selectedItem = 0;
    customizationApp.$data.limitTop = 0;
    customizationApp.$data.limitBottom = 5;
    customizationApp.$data.maxItem = items.length;

    $(".setting-item:eq(" + customizationApp.$data.selectedItem + ")").addClass("setting-item-active");
    $(".color-selector-list div:eq(" + customizationApp.$data.selectedColor + ")").append("<i class='selected-block'></i>");
    $(".color-selector-list div:eq(0)").addClass("first-selected-block");
    $(".color-selector-list div:eq(8)").addClass("last-selected-block");

    customizationApp.$data.maxColor = colors.length;
    customizationApp.$data.limitColor = 8;

    $(document).keyup(function(event) {

        if (event.keyCode == 38) { // Up
            moveMenuToTop();
        } else if (event.keyCode == 40) { // Down
            moveMenuToBottom();
        } else if (event.keyCode == 37) { // Left
            selectorToLeft();
        } else if (event.keyCode == 39) { // Right
            selectorToRight();
        }
    });

    window.addEventListener('wheel', function(e) {
        var delta = e.deltaY || e.detail || e.wheelData;

        if (delta > 0) {
            moveMenuToBottom();
        } else if (delta < 0) {
            moveMenuToTop();
        }
    });
});

function moveMenuToTop() {

    $(".setting-item:eq(" + customizationApp.$data.selectedItem + ")").removeClass("setting-item-active");
    customizationApp.$data.selectedItem--;

    if (customizationApp.$data.selectedItem < customizationApp.$data.limitTop) {

        customizationApp.$data.limitBottom--;
        if (customizationApp.$data.limitTop-- < 0) {
            customizationApp.$data.limitTop = (customizationApp.$data.maxItem - 6);
        }

        for (var i = 0; i < customizationApp.$data.maxItem; i++) {

            if (i >= customizationApp.$data.limitTop && i <= customizationApp.$data.limitBottom) $(".setting-item:eq(" + i + ")").show();
            else $(".setting-item:eq(" + i + ")").hide();
        }
    }

    if (customizationApp.$data.selectedItem < 0) {
        customizationApp.$data.selectedItem = customizationApp.$data.maxItem - 1;
        customizationApp.$data.limitBottom = customizationApp.$data.selectedItem;
        customizationApp.$data.limitTop = customizationApp.$data.limitBottom - 5;

        // Перестариваем айтимы в зависимости
        for (var i = 0; i < customizationApp.$data.maxItem; i++) {

            if (i >= (customizationApp.$data.limitBottom - 5) && i <= customizationApp.$data.limitBottom) $(".setting-item:eq(" + i + ")").show();
            else $(".setting-item:eq(" + i + ")").hide();
        }
    }
    $(".setting-item:eq(" + customizationApp.$data.selectedItem + ")").addClass("setting-item-active");

}

function moveMenuToBottom() {

    $(".setting-item:eq(" + customizationApp.$data.selectedItem + ")").removeClass("setting-item-active");
    customizationApp.$data.selectedItem++;

    if (customizationApp.$data.selectedItem >= items.length) {
        customizationApp.$data.selectedItem = 0;
        customizationApp.$data.limitTop = 0;
        customizationApp.$data.limitBottom = 5;

        // Перестариваем айтимы в зависимости
        for (var i = 0; i < customizationApp.$data.maxItem; i++) {

            if (i >= 0 && i <= customizationApp.$data.limitBottom) $(".setting-item:eq(" + i + ")").show();
            else $(".setting-item:eq(" + i + ")").hide();
        }
    }
    $(".setting-item:eq(" + customizationApp.$data.selectedItem + ")").addClass("setting-item-active");

    if (customizationApp.$data.selectedItem > customizationApp.$data.limitBottom) {

        customizationApp.$data.limitTop++;
        if (customizationApp.$data.limitBottom++ > items.length) {
            customizationApp.$data.limitTop = 0;
            customizationApp.$data.limitBottom = 5;
        }

        for (var i = 0; i < customizationApp.$data.maxItem; i++) {

            if (i >= (customizationApp.$data.limitBottom - 5) && i <= customizationApp.$data.limitBottom) $(".setting-item:eq(" + i + ")").show();
            else $(".setting-item:eq(" + i + ")").hide();
        }
    }
}

function selectorToLeft() {

    var item = customizationApp.$data.selectedItem;
    if (
        items[item][1] === "motherSelector" ||
        items[item][1] === "fatherSelector" ||
        items[item][1] === "characterSelector" ||
        items[item][1] === "eyebrowsSelector"
    ) {

        items[item][3]--;
        if (items[item][3] < 0) {
            items[item][3] = items[item][2].length - 1;
        }

        $(".setting-item:eq(" + item + ")").find("span").text(items[item][2][items[item][3]]);

        if (items[item][1] === "motherSelector") {
            $('.family-preview img:first-child').attr('src', 'img/customization/parent/' + mothers[items[item][3]][0] + '.png');
        } else if (items[item][1] === "fatherSelector") {
            $('.family-preview img:last-child').attr('src', 'img/customization/parent/' + fathers[items[item][3]][0] + '.png');
        }
    }
}

function selectorToRight() {

    var item = customizationApp.$data.selectedItem;
    if (
        items[item][1] === "motherSelector" ||
        items[item][1] === "fatherSelector" ||
        items[item][1] === "characterSelector" ||
        items[item][1] === "eyebrowsSelector"
    ) {

        items[item][3]++;
        if (items[item][3] > items[item][2].length - 1) {
            items[item][3] = 0;
        }

        $(".setting-item:eq(" + item + ")").find("span").text(items[item][2][items[item][3]]);

        if (items[item][1] === "motherSelector") {
            $('.family-preview img:first-child').attr('src', 'img/customization/parent/' + mothers[items[item][3]][0] + '.png');
        } else if (items[item][1] === "fatherSelector") {
            $('.family-preview img:last-child').attr('src', 'img/customization/parent/' + fathers[items[item][3]][0] + '.png');
        }
    }
}
