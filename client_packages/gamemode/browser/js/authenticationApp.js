var authenticationApp = new Vue({
    el: '#authenticationApp',
    data: {
        showedwelcome: 0,
        curselector: -1,
        cursex: -1,
        result_icon: "img/authentication/result_err.png",
        result_text: "",
        result_button: ""
    },
    methods: {

        setSelector: function(selector) {
            if (!selector) {

                if (authenticationApp.$data.curselector !== 0) {
                    var list = document.getElementsByClassName("select-block");
                    list[0].classList.add("select-block-active");
                    list[1].classList.remove("select-block-active");

                    document.getElementsByClassName("registration")[0].style.display = "none";
                    document.getElementsByClassName("login")[0].style.display = "block";

                    authenticationApp.$data.curselector = 0;
                    $(".authentication .login .loginOrEmail").focus();
                }
            } else {

                if (authenticationApp.$data.curselector !== 1) {
                    var list = document.getElementsByClassName("select-block");
                    list[0].classList.remove("select-block-active");
                    list[1].classList.add("select-block-active");

                    document.getElementsByClassName("login")[0].style.display = "none";
                    document.getElementsByClassName("registration")[0].style.display = "block";

                    $(".authentication .registration .name").focus();
                    authenticationApp.$data.curselector = 1;
                }
            }
        },
        /*setSex: function(selector) {
              if(!selector) {

                  if(authenticationApp.$data.cursex !== 0) {
                      var list = $(".sex-block");
                      list[1].classList.add("sex-block-active");
                      list[0].classList.remove("sex-block-active");

                      authenticationApp.$data.cursex = 0;
                  }
              }
              else {
                  if(authenticationApp.$data.cursex !== 1) {
                      var list = $(".sex-block");
                      list[1].classList.remove("sex-block-active");
                      list[0].classList.add("sex-block-active");

                      authenticationApp.$data.cursex = 1;
                  }
              }
        },*/
        showRecoveryScreen: function() {
            $(".select,.login,.registration,.confirmEmail").fadeOut(500).promise().done(function() {
                $(".recovery").fadeIn(250);
                $(".recovery .email").focus();
            });
        },
        hideRecoveryScreen: function() {

            $(".recovery").fadeOut(500).promise().done(function() {
                $(".select,.login").fadeIn(250);
            });
        },
        hideRecoveryResultScreen: function() {

            $(".recovery-result").fadeOut(500).promise().done(function() {
                $(".select,.login").fadeIn(250);
            });
        },
        hideGoogleAuthScreen: function() {

            $(".google").fadeOut(500).promise().done(function() {
                $(".select,.login").fadeIn(250);
            });
        },
        hidePinCodeScreen: function() {
            $(".pincode").fadeOut(500).promise().done(function() {
                $(".select,.login").fadeIn(250);
            });
        },
        showConfirmEmail: function() {
            sendEmailCode();
            initConfirmEmailHandler();
            $(".select,.login,.registration").fadeOut(500).promise().done(function() {
                $(".confirmEmail").fadeIn(250);
                $(".confirmEmail .code").focus();
            });
        },
        showAuthAccount: function() {
            $(".select,.login,.registration, .confirmEmail").fadeOut(500).promise().done(function() {
                $(".select").fadeIn(250);
                authenticationApp.setSelector(0);
                $(".authentication .login .loginOrEmail").focus();
            });
        },
    }
});

authenticationApp.setSelector(0);

// Global function
function showWelcomeScreen() {

    $(".welcome").fadeIn(1500, function() {
        authenticationApp.$data.showedwelcome = 0;
        $("body").click(function() {
            hideWelcomeScreen();
        });

        $("body").keyup(function() {
            hideWelcomeScreen();
        });
    });;
}

function hideWelcomeScreen() {

    if (authenticationApp.$data.showedwelcome) return;
    authenticationApp.$data.showedwelcome = 1;

    $(".welcome").addClass("hide-welcome");

    $(".logo").fadeOut(1000);
    setTimeout(function() {
        $(".welcome").hide();
        showWelcomeTest();

    }, 1500);
}

function showWelcomeTest() {
    $("#alphaTest").fadeIn(100, function() {
        authenticationApp.$data.showwelcometest = 0;
        $("body").click(function() {
            $("#alphaTest").addClass("hide-welcome");
            $("#alphaTest").hide();
            showAuthenticationScreen();
        });

        $("body").keyup(function() {
            $("#alphaTest").addClass("hide-welcome");
            $("#alphaTest").hide();
            showAuthenticationScreen();
        });
    });;
}

function showAuthenticationScreen() {
    if (authenticationApp.$data.showwelcometest) return;
    authenticationApp.$data.showwelcometest = 1;

    $(".authentication").fadeIn(400);
    $(".authentication .login .loginOrEmail").focus();
}

function hideAuthenticationScreen() {
    $(".authentication").fadeOut(400);
}

function showRecoveryResultScreen(error, message, button) {

    if (error) authenticationApp.$data.result_icon = "img/authentication/result_err.png";
    else authenticationApp.$data.result_icon = "img/authentication/result_ok.png";

    authenticationApp.$data.result_text = message;
    authenticationApp.$data.result_button = button;

    $(".select,.login").fadeOut(500).promise().done(function() {
        $(".recovery-result").fadeIn(250);
    });
}
