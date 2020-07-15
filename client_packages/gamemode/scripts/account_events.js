exports = (menu) => {
    mp.events.add("sendEmailCode", (email, login) => {
        mp.events.callRemote("sendEmailCode", email, login);
    });

    mp.events.add("showAuthAccount", () => {
        if (mp.storage.data.account) {
            var loginOrEmail = mp.storage.data.account.loginOrEmail;
            var password = mp.storage.data.account.password;
            menu.execute(`showAuthAccount('${loginOrEmail}', '${password}')`);
        } else {
            menu.execute(`showAuthAccount()`);
        }

    });

    mp.events.add("showRegAccount", () => {
        menu.execute(`showRegAccount()`);
    });

    mp.events.add("showConfirmCode", () => {
        mp.events.call(`nSuccess`, `The code is sent!`);
        menu.execute(`showConfirmCodeTextField()`);
    });

    mp.events.add("showConfirmCodeModal", () => {
        menu.execute(`authenticationApp.showConfirmEmail()`);
    });

    mp.events.add("account.setAutoLogin", (enabled, loginOrEmail, password) => {
        if (enabled) {
            mp.storage.data.account = {
                loginOrEmail: loginOrEmail,
                password: password
            };
        } else delete mp.storage.data.account;

        mp.storage.flush();
    });

    mp.events.add("regAccount", (data) => {
        mp.events.callRemote("regAccount", data);
    });

    mp.events.add("regAccountSuccess", () => {
        menu.execute(`regAccountSuccess()`);
    });

    mp.events.add("lightLogin", () => {
        menu.execute(`lightTextField('#authenticationApp .block div .login', '#b44')`);
    });

    mp.events.add("lightEmail", () => {
        menu.execute(`lightTextField('#authenticationApp .email', '#b44')`);
    });

    mp.events.add("lightEmailCode", () => {
        menu.execute(`lightTextField('#authenticationApp .code', '#b44')`);
    });

    mp.events.add("lightRecoveryLoginOrEmail", () => {
        menu.execute(`lightTextField('#authenticationApp .loginOrEmail', '#b44')`);
    });

    mp.events.add("lightRecoveryCode", () => {
        menu.execute(`lightTextField('#authenticationApp .recovery .code', '#b44')`);
    });

    mp.events.add("recoveryAccount", (loginOrEmail) => {
        mp.events.callRemote(`recoveryAccount`, loginOrEmail);
    });

    mp.events.add("recoveryCodeSent", () => {
        mp.events.call(`nSuccess`, `The code is sent!`);
        menu.execute(`showRecoveryCodeTextField()`);
    });

    mp.events.add("recoveryCodeSuccess", () => {
        menu.execute(`recoveryCodeSuccess()`);
    });

    mp.events.add("recoveryNewPasswordSuccess", () => {
        menu.execute(`recoveryNewPasswordSuccess()`);
    });


    mp.events.add("confirmRecoveryCode", (loginOrEmail, code) => {
        mp.events.callRemote(`confirmRecoveryCode`, loginOrEmail, code);
    });

    mp.events.add("recoveryAccountNewPassword", (password) => {
        mp.events.callRemote(`recoveryAccountNewPassword`, password);
    });

    mp.events.add("authAccount", (loginOrEmail, password) => {
        mp.events.callRemote(`authAccount`, loginOrEmail, password);
    });

    mp.events.add("hideEnterAccount", () => {
        menu.execute(`hideWindow('#authenticationApp')`);
    });

    mp.events.add("closedMode.open", (pin) => {
        mp.events.callRemote("closedMode.open", pin);
    });
}
