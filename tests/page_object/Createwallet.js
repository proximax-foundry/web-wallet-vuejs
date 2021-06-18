const elements = {
    create: 'div.px-5:nth-child(3) > a:nth-child(1)',
    createnew: 'div.px-5:nth-child(1) > a:nth-child(3)',
    emptyname_validation: '.error',
    emptypassword_validation: '.mr-1 > div:nth-child(2) > div:nth-child(1)',
    emptyconfirmpasword_validation: '.ml-1 > div:nth-child(2) > div:nth-child(1)',
    create2: 'button.default-btn:nth-child(2)',
    clear_button: 'button.default-btn:nth-child(1)',
    input_walletname: 'input.bg-white',
    input_password: '.mr-1 > div:nth-child(1) > input:nth-child(2)',
    input_confirmpassword: '.ml-1 > div:nth-child(1) > input:nth-child(2)',
    input_confirmpassword2: '.grid > div:nth-child(2) > div:nth-child(1) > input:nth-child(2)',
    createsuccessful_title: 'h1.font-bold',
    show_privatekey: 'div.px-5:nth-child(1) > a:nth-child(1)',
    privatekey: 'div.flex:nth-child(4) > div:nth-child(1) > div:nth-child(1)',
    continue: 'div.px-5:nth-child(3) > a:nth-child(1)',
    duplicatename_validation: '.error',
    createfromprivatekey: 'div.px-5:nth-child(2) > a:nth-child(3)',
    input_privatekey: '.ml-1 >  div:nth-child(1) > input',
    checkbox: '.h-5',
    emptypk_validation: '.error',
    emptyname_validation2: '.error-text',
    emptypassword_validation2: '.mr-1 > div:nth-child(2) > div:nth-child(1)',
    emptyconfirmpassword_validation2: '.grid > div:nth-child(2) > div:nth-child(2) > div:nth-child(1)',
    createpk_title: 'h1.font-bold',
    password_eyeicon:'.mr-1 > div:nth-child(1) > div:nth-child(3) > svg:nth-child(1) > path:nth-child(1)',
    password_slash: '.fa-eye-slash',
    confirmpassword_eyeicon:'.ml-1 > div:nth-child(1) > div:nth-child(3) > svg:nth-child(1)',
    confirmpassword_slash: '.ml-1 > div:nth-child(1) > div:nth-child(3) > svg:nth-child(1)',
    password_eyeicon2: '.fa-eye',
    confirmpassword_eyeicon2: '.ml-1 > div:nth-child(1) > div:nth-child(3) > svg:nth-child(1)',
    confirmpassword_eyeicon3:'div.ml-1:nth-child(2) > div:nth-child(1) > div:nth-child(3) > svg:nth-child(1) > path:nth-child(1)',
    password_slash2:'.fa-eye-slash > path:nth-child(1)',
    confirmpassword_slash2:'div.ml-1:nth-child(2) > div:nth-child(1) > div:nth-child(3) > svg:nth-child(1) > path:nth-child(1)',
    password_eyeicon3:'.mr-1 > div:nth-child(1) > div:nth-child(3) > svg:nth-child(1)',
    confirmpassword_eyeicon4: 'div.ml-1:nth-child(2) > div:nth-child(1) > div:nth-child(3) > svg:nth-child(1)',
    copy_address: 'div.flex:nth-child(2) > svg > path',
    copy_public_key: 'div.flex:nth-child(3) > svg > path',
   /*  copy_private_key: 'div.flex:nth-child(4) > svg > path', */
    copy_prompt: '.p-toast-detail',
    pk_eyeicon: 'div.ml-1:nth-child(3) > div:nth-child(1) > div:nth-child(3) > svg:nth-child(1) > path:nth-child(1)',
    pk_slashicon:'.fa-eye-slash > path:nth-child(1)'
};

const commands = [{
    //create_wallet_test
    navigate_createnewwallet(browser) {
        return this
            .click("@create")
            .assert.urlEquals(browser + 'create', 'When ProximaX logo is clicked, user is navigated to home screen.')
            .click("@createnew")
            .assert.urlEquals(browser + 'create-wallet', 'When ProximaX logo is clicked, user is navigated to home screen.')
    },
    emptyfield_validation() {
        return this
            .setValue("@input_walletname", "\ue004") //clicks tab,  more info: https://www.selenium.dev/selenium/docs/api/py/webdriver/selenium.webdriver.common.keys.html
            .isVisible('@emptyname_validation', callback = (result) => {
                this.assert.equal(result.value, true, 'If wallet name is empty, error is shown')
            })
            .setValue("@input_password", "\ue004")
            .isVisible('@emptypassword_validation', callback = (result) => {
                this.assert.equal(result.value, true, 'If password is empty, error is shown')
            })
            .setValue("@input_confirmpassword", "\ue004")
            .isVisible('@emptyconfirmpasword_validation', callback = (result) => {
                this.assert.equal(result.value, true, 'If confirm password is empty, error is shown')
            })
    },
    clearbutton_validation(name, password) {
        return this
            .setValue('@input_walletname', name)
            .setValue("@input_password", password)
            .setValue("@input_confirmpassword", password)
            .click("@clear_button")
            .getValue('@input_walletname', callback = (result) => {
                this.assert.equal(result.value, '', 'When clear button is clicked, wallet name field is cleared')
            })
            .getValue('@input_password', callback = (result) => {
                this.assert.equal(result.value, '', 'When clear button is clicked, password field is cleared')
            })
            .getValue('@input_confirmpassword', function callback(result) {
                this.assert.equal(result.value, '', 'When clear button is clicked, password field is cleared')
            })
    },
    differentpassword_validation(name, password, password2) {
        return this
            .setValue("@input_walletname", name)
            .setValue("@input_password", password)
            .setValue("@input_confirmpassword", password2)
            .isVisible('@emptyconfirmpasword_validation', callback = (result) => {
                this.assert.equal(result.value, true, 'If confirm password is different from password, error is shown')
            })
    },
    create_wallet(browser, name, password) {
        return this
            .click("@clear_button")
            .setValue("@input_walletname", name)
            .setValue("@input_password", password)
            .setValue("@input_confirmpassword", password)
            .click("@create2")
            .assert.visible('@createsuccessful_title', 'Wallet is successfully created when wallet name, password and confirm password are valid')
            .click('@show_privatekey')
            .assert.visible('@privatekey', 'When Show private key button is clicked, private key is revealed.')
            .click('@copy_address')
            .waitForElementVisible('@copy_prompt')
            .pause(1000)
            .click('@copy_public_key')
            .waitForElementVisible('@copy_prompt')
            .click('@continue')
            .assert.urlEquals(browser, 'When Continue button is clicked, user is navigated to the Home page.')
    },
    existingname_validation(name, password) {
        return this
            .pause(4000)
            .click("@create")
            .click("@createnew")
            .setValue("@input_walletname", name)
            .setValue("@input_password", password)
            .setValue("@input_confirmpassword", password)
            .click("@create2")
            .isVisible('@duplicatename_validation', callback = (result) => {
                this.assert.equal(result.value, true, 'If wallet name is already taken, error is shown')
            })
    },
    //create wallet with private key test
    navigate_createpkwallet(browser) {
        return this
            .click("@create")
            .assert.urlEquals(browser + 'create', 'When Create Button is clicked, user is navigated to the Select Wallet Creation Type page.')
            .click('@createfromprivatekey')
            .assert.urlEquals(browser + 'import-wallet', 'When Create Button is clicked, user is navigated to the Create Wallet with Private Key page.')
    },
    emptyfield_validation2() {
        return this
            .setValue('@input_privatekey', '\ue004')
            .isVisible('@emptypk_validation', callback = (result) => {
                this.assert.equal(result.value, true, 'If private key is empty, error is shown')
            })
            .setValue('@input_walletname', '\ue004')
            .isVisible('@emptyname_validation2', function callback(result) {
                this.assert.equal(result.value, true, 'If wallet name is empty, error is shown')
            })
            .setValue('@input_password', '\ue004')
            .isVisible('@emptypassword_validation2', function callback(result) {
                this.assert.equal(result.value, true, 'If password is empty, error is shown')
            })
            .setValue('@input_confirmpassword2', '\ue004')
            .isVisible('@emptyconfirmpassword_validation2', function callback(result) {
                this.assert.equal(result.value, true, 'If confirm password is empty, error is shown')
            })
    },
    differentpassword_validation2(privatekey, name, password, password2) {
        return this
            .setValue('@input_privatekey', privatekey)
            .setValue('@input_walletname', name)
            .setValue('@input_password', password)
            .setValue('@input_confirmpassword2', password2)
            .isVisible('@emptyconfirmpassword_validation2', callback = (result) => {
                this.assert.equal(result.value, true, 'If confirm password is different from password, error is shown')
            })
    },
    clearbutton_validation2() {
        return this
            .click('@clear_button')
            .getValue('@input_privatekey', callback = result => {
                this.assert.equal(result.value, '', 'When clear button is clicked, private key field is cleared')

            })
            .getValue('@input_walletname', callback = result => {
                this.assert.equal(result.value, '', 'When clear button is clicked, wallet name field is cleared')
            })
            .getValue('@input_password', callback = result => {
                this.assert.equal(result.value, '', 'When clear button is clicked, password field is cleared')
            })
            .getValue('@input_confirmpassword2', callback = result => {
                this.assert.equal(result.value, '', 'When clear button is clicked, confirm password field is cleared')
            })
    },
    successful_create(browser, privatekey, name, password) {
        return this
            .setValue('@input_privatekey', privatekey)
            .setValue('@input_walletname', name)
            .setValue('@input_password', password)
            .setValue('@input_confirmpassword2', password)
            .click('@create2')
            .assert.visible('@createsuccessful_title', 'Wallet is successfully created when wallet name, password and confirm password are valid')
            .click('@show_privatekey')
            .assert.visible('@privatekey', 'When Show private key button is clicked, private key is revealed.')
            .click('@copy_address')
            .waitForElementVisible('@copy_prompt')
            .pause(1000)
            .click('@copy_public_key')
            .waitForElementVisible('@copy_prompt')
            .click('@continue')
            .assert.urlEquals(browser, 'When Continue button is clicked, user is navigated to the Home page.')
    },
    existingname_validation2(privatekey, name, password) {
        return this
            .pause(4000)
            .click("@create")
            .click("@createfromprivatekey")
            .setValue('@input_privatekey', privatekey)
            .setValue("@input_walletname", name)
            .setValue("@input_password", password)
            .setValue("@input_confirmpassword2", password)
            .click("@create2")
            .isVisible('@duplicatename_validation', callback = result => {
                this.assert.equal(result.value, true, 'If wallet name is already taken, error is shown')
            })
    },
    //eye icon
    masked_password() {
        return this
            .click('@password_eyeicon')
            .assert.elementPresent('@password_slash', "When eye icon is clicked, password field is unmasked")
            .click('@confirmpassword_eyeicon')
            .assert.elementPresent('@confirmpassword_slash', "When eye icon is clicked, confirm password field is unmasked")
            .click('@password_slash')
            .assert.elementPresent('@password_eyeicon2', "When eye icon is clicked, password field is masked again")
            .click('@confirmpassword_slash')
            .assert.elementPresent('@confirmpassword_eyeicon2', "When eye icon is clicked, confirm password field is masked again")
            .pause(2000)
            .end()
    },
    pk_masked_password(){
        return this
        .click('@pk_eyeicon')
        .assert.elementPresent('@pk_slashicon',"When eye icon is clicked, Private key field is unmasked")
        .click('@pk_slashicon')
        .assert.elementPresent('@pk_eyeicon',"When eye icon is clicked, Private key field is masked again")
        .click('@password_eyeicon')
        .assert.elementPresent('@password_slash2', "When eye icon is clicked, password field is unmasked")
        .click('@confirmpassword_eyeicon3')
        .assert.elementPresent('@confirmpassword_slash2',"When eye icon is clicked, confirm password field is unmasked")
        .click('@password_slash2')
        .assert.elementPresent('@password_eyeicon3', "When eye icon is clicked, password field is masked again")
        .click('@confirmpassword_slash2')
        .assert.elementPresent('@confirmpassword_eyeicon4', "When eye icon is clicked, confirm password field is masked again")

    },
    //reuse function
    createwallet(name, password) {
        return this
            .click("@create")
            .pause(500)
            .click("@createnew")
            .setValue("@input_walletname", name)
            .setValue("@input_password", password)
            .setValue("@input_confirmpassword", password)
            .click("@create2")
            .click('@continue')
    }
}];

module.exports = {
    elements: elements,
    commands: commands,
    url: function () {
        return '${this.api.launchUrl}'
    }

}