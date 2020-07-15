$(document).ready(() => {
    $("#taxiMenu .item").click((e) => {
        var itemEl = $(e.target);
        if (itemEl.hasClass("selected")) return;
        var itemSelectedEl = $("#taxiMenu .item.selected");
        var contentClassSelected = itemSelectedEl.data("modal");
        $("#taxiMenu").find("." + contentClassSelected).hide();
        itemSelectedEl.removeClass("selected");

        itemEl.addClass("selected");
        $("#taxiMenu").find("." + itemEl.data("modal")).show();
    });
});


/* Срабатывает при клике на 'Вход'*/
function authTaxi() {
    $("#taxiMenu .welcome").fadeOut("fast", () => {
        $("#taxiMenu .title").slideUp("fast", () => {
            $("#taxiMenu .title").text("Authorization in the system");
            $("#taxiMenu .title").slideDown("fast");
        });
        $("#taxiMenu .auth").fadeIn("fast", () => {
            startPrintingLogin(() => {
                startPrintingPassword(() => {
                    clickAuthButton(() => {
                        $("#taxiMenu .auth").fadeOut("fast", () => {
                            $("#taxiMenu .title").slideUp("fast", () => {
                                $("#taxiMenu .title").text("Network connected");
                                $("#taxiMenu .title").slideDown("fast");
                            });
                            $("#taxiMenu .wait").fadeIn("fast", () => {
                                setTimeout(() => {
                                    $("#taxiMenu .title").slideUp("fast");
                                    $("#taxiMenu .wait").fadeOut("fast", () => {
                                        showTaxiMenu();
                                    });
                                }, 2000);
                            });
                        });
                    });
                });
            });
        });
    });
}

/* for tests */
//window.clientStorage.name = "Carter Slade";
var printingTimerId;

/* Эмуляция ввода логина. */
function startPrintingLogin(callback) {
    var wait = Math.randomInteger(50, 250);
    var playerName = clientStorage.name;
    var tick = () => {
        var login = $("#taxiMenu .login").val();
        var diffLen = playerName.length - login.length;
        if (diffLen <= 0) return callback();
        $("#taxiMenu .login").val(playerName.substr(0, login.length + 1));
        wait = Math.randomInteger(50, 250);
        clearTimeout(printingTimerId);
        printingTimerId = setTimeout(() => {
            tick();
        }, wait);
    };
    clearTimeout(printingTimerId);
    printingTimerId = setTimeout(() => {
        tick();
    }, wait);
}

/* Эмуляция ввода пароля. */
function startPrintingPassword(callback) {
    var wait = Math.randomInteger(50, 250);
    var examplePass = "password";
    var tick = () => {
        var password = $("#taxiMenu .password").val();
        var diffLen = examplePass.length - password.length;
        if (diffLen <= 0) return callback();
        $("#taxiMenu .password").val(examplePass.substr(0, password.length + 1));
        wait = Math.randomInteger(50, 250);
        clearTimeout(printingTimerId);
        printingTimerId = setTimeout(() => {
            tick();
        }, wait);
    };
    clearTimeout(printingTimerId);
    printingTimerId = setTimeout(() => {
        tick();
    }, wait);
}

/* Эмуляция клика на кнопку. */
function clickAuthButton(callback) {
    var btn = $("#taxiMenu .auth button");
    btn.css("background", "#ea0");
    btn.css("color", "#fff");
    setTimeout(() => {
        btn.css("background", "#fb0");
        btn.css("color", "#000");
        callback();
    }, 170);
}

/* Показ главного меню таксиста после авторизации. */
function showTaxiMenu() {
    $("#taxiMenu .title-wrap").hide();
    $("#taxiMenu .main").fadeIn("fast");
}
