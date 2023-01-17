const elements = {
    
    back: 'a.text-xs',
    create: 'form > button',
    createnew: 'div.text-center.text-xs.text-blue-link.font-semibold > a',
    createnew_wallet: 'div.radio-toolbar.text-center > label:nth-child(2)',
    createnew_frompk: 'div.radio-toolbar.text-center > label:nth-child(4)',                                    
    createnew_backup: 'div.radio-toolbar.text-center > label:nth-child(6)',
    createsuccessful_message: '.text-green-500',
    close: 'a.mt-4',
    continuelogin: 'a > div',
    next: 'a[href="#/create-wallet"]',
    pknext: '.mt-3',
    backupnext: 'a[href="#/backup-wallet"]',
    input_walletname: 'div:nth-child(1) > div > input',
    input_pkwalletname: 'form > div:nth-child(7) > div:nth-child(2) > div:nth-child(1) > input',
    input_password: 'div:nth-child(2) > div > input',
    input_confirmpassword: 'div:nth-child(3) > div > input',
    input_privatekey: 'form > div:nth-child(7) > div:nth-child(1) > div:nth-child(1) > input',
    input_pkpassword: 'form > div:nth-child(7) > div:nth-child(3) > div:nth-child(1) > input',
    input_pkconfirmpassword: 'form > div:nth-child(7) > div:nth-child(4) > div:nth-child(1) > input',
    empty_walletname: 'div:nth-child(1) > div.error.error-text.text-left.my-2',
    empty_password: 'div:nth-child(2) > div.error.error-password.text-left.my-2',
    empty_confirmpassword: 'div:nth-child(3) > div.error.error-password.text-left.my-2',
    empty_privatekey: 'form > div:nth-child(7) > div:nth-child(1) > div.error.error-password.text-left.my-2',
    empty_pkwalletname: 'form > div:nth-child(7) > div:nth-child(2) > div.error.error-text.text-left.my-2',
    empty_pkpassword: 'form > div:nth-child(7) > div:nth-child(3) > div.error.error-password.text-left.my-2',
    empty_pkconfirmpassword: 'form > div:nth-child(7) > div:nth-child(4) > div.error.error-password.text-left.my-2',
    pk_eyeicon: 'form > div:nth-child(7) > div:nth-child(1) > div > svg > path',
    pkpassword_eyeicon: 'form > div:nth-child(7) > div:nth-child(3) > div:nth-child(1) > svg > path',
    pkconfirmpassword_eyeicon: 'form > div:nth-child(7) > div:nth-child(4) > div > svg > path',
    password_eyeicon: 'form > div:nth-child(5) > div:nth-child(2) > div > svg > path',
    confirmpassword_eyeicon: 'form > div:nth-child(5) > div:nth-child(3) > div > svg > path',
    error_passwordnotmatch: 'form > div:nth-child(5) > div:nth-child(3) > div.error.error-password.text-left.my-2',
    error_passwordlength: 'form > div:nth-child(5) > div:nth-child(2) > div.error.error-password.text-left.my-2',
    error_duplicatename: 'form > div:nth-child(2) > div.error.error_box',
    error_pkpasswordnotmatch: 'form > div:nth-child(7) > div:nth-child(4) > div.error.error-password.text-left.my-2',
    error_pkpasswordlength: 'form > div:nth-child(7) > div:nth-child(3) > div.error.error-password.text-left.my-2',
    error_invalidpk: 'form > div:nth-child(7) > div:nth-child(1) > div.error.error-password.text-left.my-2',
    error_pkduplicatename: 'form > div:nth-child(4) > div',
    signin_here: 'form > div:nth-child(8) > a',
    signin_herepk: 'div.text-center:nth-child(10) > a:nth-child(1)',
    signin_herebackup: 'div.text-center:nth-child(9) > a:nth-child(1)',
    select_network: 'form > fieldset > div:nth-child(1)',
    testnet_2: 'form > fieldset > div:nth-child(2) > div:nth-child(1) > div:nth-child(4)',
}

const commands = {

    change_network(){
        return this
        .pause(5000)
        .click("@select_network")
        .click("@testnet_2")
    },

    navigate_mainpage(){
        return this
        .pause(2000)
        .waitForElementVisible("@back")
        .click("@back")
        .pause(2000)
        .click("@back")
    },

    // create new wallet navigation
    navigate_createnewwallet(browser){
        return this
        .pause(5000)
        .click("@createnew")
        .pause(2000)
        .assert.urlEquals(browser + 'create', 'Create acc wallet is clicked, user is navigated to wallet selection type.')
        .click("@createnew_wallet")
        .waitForElementVisible("@next")
        .click("@next")
        .pause(4000)
        .assert.urlEquals(browser + 'create-wallet', 'When next is clicked, user is navigated to create new wallet screen.')
        .click("@signin_here")
        .assert.urlEquals(browser, 'When sign in here is clicked, user is navigated back to the main page for sign in.')
        .click("@createnew")
        .click("@createnew_wallet")
        .click("@next")
    },

    // create pk wallet navigation
    navigate_createpkwallet(browser){
        return this
        .pause(5000)
        .click("@createnew")
        .pause(2000)
        .assert.urlEquals(browser + 'create', 'Create acc wallet is clicked, user is navigated to wallet selection type.')
        .click("@createnew_frompk")
        .pause(2000)
        .click("@pknext")
        .pause(4000)
        .assert.urlEquals(browser + 'import-wallet', 'When next is clicked, user is navigated to create pk wallet screen.')
        .pause(2000)
        .waitForElementVisible("@back")
        .click("@back")
        .pause(2000)
        .click("@back")
        .assert.urlEquals(browser, 'When sign in here is clicked, user is navigated back to the main page for sign in.')
        .click("@createnew")
        .click("@createnew_frompk")
        .click("@pknext")
    },

    navigate_createpkwallet2(browser){
        return this
        .pause(5000)
        .click("@createnew")
        .pause(2000)
        .assert.urlEquals(browser + 'create', 'Create acc wallet is clicked, user is navigated to wallet selection type.')
        .click("@createnew_frompk")
        .pause(2000)
        .click("@pknext")
        .pause(2000)
        .assert.urlEquals(browser + 'import-wallet', 'When next is clicked, user is navigated to create pk wallet screen.')
    },

    // create backup wallet navigation
    navigate_createbackupwallet(browser){
        return this
        .pause(5000)
        .click("@createnew")
        .assert.urlEquals(browser + 'create', 'Create acc wallet is clicked, user is navigated to wallet selection type.')
        .click("@createnew_backup")
        .click("@backupnext")
        .assert.urlEquals(browser + 'backup-wallet', 'When next is clicked, user is navigated to create backup wallet screen.')
        .click("@back")
        .assert.urlEquals(browser + 'create', 'When back is clicked, user is navigated back to wallet selection type.')
        .click("@createnew_backup")
        .click("@backupnext")
        .click("@signin_herebackup")
        .assert.urlEquals(browser, 'When sign in here is clicked, user is navigated back to the main page for sign in.')
        .click("@createnew")
        .click("@createnew_backup")
        .click("@backupnext")
        .pause(1000)
        .end()
    },

    specialinput_wallet(password){
        return this
        .setValue("@input_password", password)
        .setValue("@input_confirmpassword", password)
    },

    // checks for empty input (create wallet)
    emptyinput_wallet(){
        return this
        .click("@input_walletname")
        .setValue("@input_walletname", "\ue004")
        .isVisible('@empty_walletname', callback = (result) => {
            this.assert.equal(result.value, true, 'If wallet name has no input, error is shown')
        })
        .setValue("@input_password", "\ue004")
        .isVisible('@empty_password', callback = (result) => {
            this.assert.equal(result.value, true, 'If password has no input, error is shown')
        })
        .setValue("@input_confirmpassword", "\ue004")
        .isVisible('@empty_confirmpassword', callback = (result) => {
            this.assert.equal(result.value, true, 'If confirm password has no input, error is shown')
        })
    },

    // checks for empty input (create wallet from pk)
    emptyinput_pkwallet(){
        return this
        .click("@input_privatekey")
        .setValue("@input_privatekey", "\ue004")
        .isVisible('@empty_privatekey', callback = (result) => {
            this.assert.equal(result.value, true, 'If private key has no input, error is shown')
        })
        .setValue("@input_pkwalletname", "\ue004")
        .isVisible('@empty_pkwalletname', callback = (result) => {
            this.assert.equal(result.value, true, 'If wallet name has no input, error is shown')
        })
        .setValue("@input_pkpassword", "\ue004")
        .isVisible('@empty_pkpassword', callback = (result) => {
            this.assert.equal(result.value, true, 'If password has no input, error is shown')
        })
        .setValue("@input_pkconfirmpassword", "\ue004")
        .isVisible('@empty_pkconfirmpassword', callback = (result) => {
            this.assert.equal(result.value, true, 'If confirm password has no input, error is shown')
        })
    },

    // create wallet with valid name and password
    create_wallet(name, password){
        return this
        .click("@input_walletname")
        .setValue("@input_walletname", name)
        .setValue("@input_password", password)
        .setValue("@input_confirmpassword", password)
        .click("@create")
        .pause(1000)
        .click("@continuelogin")
        // .assert.visible('@createsuccessful_popup', 'Wallet is successfully created when wallet name, password and confirm password are valid')
        // .click("@close")
        // .assert.urlEquals(browser, 'When close is clicked, user is navigated back to main page.')
    },

    // create wallet from pk with valid pk, name and password
    create_pkwallet(privatekey, name, password){
        return this
        .click("@input_privatekey")
        .setValue("@input_privatekey", privatekey)
        .setValue("@input_pkwalletname", name)
        .setValue("@input_pkpassword", password)
        .setValue("@input_pkconfirmpassword", password)
        .click("@create")
        .pause(1000)
        .click("@continuelogin")
        // .assert.visible('@createsuccessful_popup', 'Wallet is successfully created from private key when private key, wallet name, password and confirm password are valid')
        // .click("@close")
        // .assert.urlEquals(browser, 'When close is clicked, user is navigated back to main page.')
    },

    // checks if wallet name has existed before
    existing_name(name, password){
        return this
        .pause(5000)
        .click("@createnew")
        .click("@createnew_wallet")
        .click("@next")
        .setValue("@input_walletname", name)
        .setValue("@input_password", password)
        .setValue("@input_confirmpassword", password)
        .click("@create")
        .pause(1000)
        .isVisible('@error_duplicatename', callback = (result) => {
            this.assert.equal(result.value, true, 'If wallet name is already taken, error is shown')
        })
    },

    // checks if waller name has existed before (for creating wallet from private key)
    existing_name_pk(privatekey, name, password){
        return this
        .pause(5000)
        .click("@createnew")
        .click("@createnew_frompk")
        .click("@pknext")
        .setValue("@input_privatekey", privatekey)
        .setValue("@input_pkwalletname", name)
        .setValue("@input_pkpassword", password)
        .setValue("@input_pkconfirmpassword", password)
        .click("@create")
        .pause(1000)
        .isVisible('@error_pkduplicatename', callback = (result) => {
            this.assert.equal(result.value, true, 'If wallet name is already taken, error is shown')
        })
    },

    // masking eye icon
    eye_icon(){
        return this
        .click('@password_eyeicon')
        .assert.elementPresent('@password_eyeicon', "When eye icon is clicked, password field is unmasked")
        .click('@confirmpassword_eyeicon')
        .assert.elementPresent('@confirmpassword_eyeicon', "When confirm password eye icon is clicked, confirm password field is unmasked")
        .click('@password_eyeicon')
        .assert.elementPresent('@password_eyeicon', "When eye icon is clicked, password field is masked again")
        .click('@confirmpassword_eyeicon')
        .assert.elementPresent('@confirmpassword_eyeicon', "When confirm password eye icon is clicked, confirm password field is masked again")
        .pause(2000)
        .end()
    },

    // masking eye icon for creating wallet from private key
    eye_icon_pk(){
        return this
        .click("@pk_eyeicon")
        .assert.elementPresent('@pk_eyeicon', "When eye icon is clicked, private key field is unmasked")
        .click('@pkpassword_eyeicon')
        .assert.elementPresent('@pkpassword_eyeicon', "When eye icon is clicked, password field is unmasked")
        .click('@pkconfirmpassword_eyeicon')
        .assert.elementPresent('@pkconfirmpassword_eyeicon', "When confirm password eye icon is clicked, confirm password field is unmasked")
        .click("@pk_eyeicon")
        .assert.elementPresent('@pk_eyeicon', "When eye icon is clicked, private key field is masked again")
        .click('@pkpassword_eyeicon')
        .assert.elementPresent('@pkpassword_eyeicon', "When eye icon is clicked, password field is masked again")
        .click('@pkconfirmpassword_eyeicon')
        .assert.elementPresent('@pkconfirmpassword_eyeicon', "When confirm password eye icon is clicked, confirm password field is masked again")
        .pause(2000)
        .end()
    },

    // user enters different password
    different_password(name, password, password2){
        return this
        .setValue("@input_walletname", name)
        .setValue("@input_password", password)
        .setValue("@input_confirmpassword", password2)
        .isVisible('@error_passwordnotmatch', callback = (result) => {
            this.assert.equal(result.value, true, 'If confirm password is different from password, error is shown')
        })
    },

    // user enters different password (for create wallet from private key)
    different_password_pk(privatekey, name, password, password2){
        return this
        .setValue("@input_privatekey", privatekey)
        .setValue("@input_pkwalletname", name)
        .setValue("@input_pkpassword", password)
        .setValue("@input_pkconfirmpassword", password2)
        .isVisible('@error_pkpasswordnotmatch', callback = (result) => {
            this.assert.equal(result.value, true, 'If confirm password is different from password, error is shown')
        })
    },

    // password length is less than required minimum
    password_length(name, password){
        return this
        .setValue("@input_walletname", name)
        .setValue("@input_password", [password, "\ue004"])
        .isVisible('@error_passwordlength', callback = (result) => {
            this.assert.equal(result.value, true, 'If password length is less than required minimum, error is shown')
        })
    },

    // password length is less than required minimum (for create wallet from private key)
    password_length_pk(privatekey, name, password){
        return this
        .setValue("@input_privatekey", privatekey)
        .setValue("@input_pkwalletname", name)
        .setValue("@input_pkpassword", [password, "\ue004"])
        .isVisible('@error_pkpasswordlength', callback = (result) => {
            this.assert.equal(result.value, true, 'If password length is less than required minimum, error is shown')
        })
    },

    // checks if the private key is invalid
    invalid_privatekey(privatekey){
        return this
        .click("@input_privatekey")
        .setValue("@input_privatekey", privatekey)
        .isVisible('@error_invalidpk', callback = (result) => {
            this.assert.equal(result.value, true, 'If private key is invalid, error is shown')
        })
    }

}

module.exports = {
    elements: elements,
    commands: commands,
    url: 'https://proximax-foundry.github.io/web-wallet-vuejs/#/',

}