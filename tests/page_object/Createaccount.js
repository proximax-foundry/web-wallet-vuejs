const elements = {

    address: '#address',
    account_detailstab: '#app > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)',
    close: '#app > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(4) > div:nth-child(1)',
    create: '#app > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(4) > button',
    create_account: '#app > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > a',
    createnew_account: '#app > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(4) > a:nth-child(1)',
    createnew_frompk: '#app > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(4) > a:nth-child(2)',
    createsuccessful_popup: '#app > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1)',
    input_accountname: '#app > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(3) > div:nth-child(1) > div:nth-child(1) > input',
    input_accountname_pk: '#app > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(3) > div:nth-child(2) > div:nth-child(1) > input',
    input_walletpassword: '#app > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(3) > div:nth-child(2) > div:nth-child(1) > input',
    input_walletpassword_pk: '#app > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(3) > div:nth-child(3) > div:nth-child(1) > input',
    input_privatekey: '#app > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(3) > div:nth-child(1) > div:nth-child(1) > input',
    home_icon: '#app > div:nth-child(1) > header > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > a > img',
    empty_accountname: '#app > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(3) > div:nth-child(1) > div.error.error-text.text-left.my-2',
    empty_accountname_pk: '#app > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(3) > div:nth-child(2) > div.error.error-text.text-left.my-2',
    empty_walletpassword: '#app > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(3) > div:nth-child(2) > div.error.error-password.text-left.my-2',
    empty_walletpassword_pk: '#app > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(3) > div:nth-child(3) > div.error.error-password.text-left.my-2',
    empty_privatekey: '#app > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(3) > div:nth-child(1) > div.error.error-password.text-left.my-2',
    error_existingname: '#app > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(3)',
    error_existingprivatekey: '#app > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(3)',
    error_invalidpk: '#app > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(3) > div:nth-child(1) > div.error.error-password.text-left.my-2',
    wrong_walletpassword: '#app > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(3)',
    password_eyeicon: '#app > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(4) > div:nth-child(2) > div:nth-child(1) > svg > path',
    password_eyeicon_pk: '#app > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(4) > div:nth-child(3) > div:nth-child(1) > svg > path',
    privatekey_eyeicon: '#app > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(4) > div:nth-child(1) > div:nth-child(1) > svg > path',
    public_key: '#public',
    private_key: '#app > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(3) > div:nth-child(9) > div:nth-child(2) > div:nth-child(1)',

}

const commands = {

    navigate_createaccount(browser){
        return this
        .click("@create_account")
        .assert.urlEquals(browser + 'select-type-creation-account', 'When Create New Account is clicked, user is navigated to select account selection type page.')
        .click("@home_icon")
        .assert.urlEquals(browser + 'dashboard', 'When home icon is clicked, user is navigated back to dashboard page.')
        .click("@create_account")

    },

    navigate_createnewaccount(browser){
        return this
        .click("@createnew_account")
        .assert.urlEquals(browser + 'create-account', 'When Create New is selected, user is navigated to create new account page.')

    },

    navigate_createnewfrompk(browser){
        return this
        .click("@createnew_frompk")
        .assert.urlEquals(browser + 'import-account', 'When From Private Key is selected, user is navigated to create new account from private key page.')
        
    },

    empty_inputaccount(){
        return this
        .click("@input_accountname")
        .setValue("@input_accountname", "\ue004")
        .isVisible('@empty_accountname', callback = (result) => {
            this.assert.equal(result.value, true, 'If account name has no input, error is shown')
        })
        .setValue("@input_walletpassword", "\ue004")
        .isVisible('@empty_walletpassword', callback = (result) => {
            this.assert.equal(result.value, true, 'If wallet password has no input, error is shown')
        })
    },

    empty_inputaccount_pk(){
        return this
        .click("@input_privatekey")
        .setValue("@input_privatekey", "\ue004")
        .isVisible('@empty_privatekey', callback = (result) => {
            this.assert.equal(result.value, true, 'If private key has no input, error is shown')
        })
        .setValue("@input_accountname_pk", "\ue004")
        .isVisible('@empty_accountname_pk', callback = (result) => {
            this.assert.equal(result.value, true, 'If account name has no input, error is shown')
        })
        .setValue("@input_walletpassword_pk", "\ue004")
        .isVisible('@empty_walletpassword_pk', callback = (result) => {
            this.assert.equal(result.value, true, 'If wallet password has no input, error is shown')
        })
    },

    wrong_walletpassword(name, password){
        return this
        .click("@input_accountname")
        .setValue("@input_accountname", name)
        .setValue("@input_walletpassword", password)
        .click("@create")
        .isVisible('@wrong_walletpassword', callback = (result) => {
            this.assert.equal(result.value, true, 'If wallet password is wrong, error is shown')
        })
    },

    wrong_walletpassword_pk(privatekey, name, password){
        return this
        .click("@input_privatekey")
        .setValue("@input_privatekey", privatekey)
        .setValue("@input_accountname_pk", name)
        .setValue("@input_walletpassword_pk", password)
        .click("@create")
        .isVisible('@wrong_walletpassword', callback = (result) => {
            this.assert.equal(result.value, true, 'If wallet password is wrong, error is shown')
        })
    },

    eye_icon(){
        return this
        .click('@password_eyeicon')
        .assert.elementPresent('@password_eyeicon', "When eye icon is clicked, password field is unmasked")
        .click('@password_eyeicon')
        .assert.elementPresent('@password_eyeicon', "When eye icon is clicked, password field is masked again")
        .pause(2000)
    },

    eye_icon_pk(){
        return this
        .click('@privatekey_eyeicon')
        .assert.elementPresent('@privatekey_eyeicon', "When eye icon is clicked, private key field is unmasked")
        .click('@privatekey_eyeicon')
        .assert.elementPresent('@privatekey_eyeicon', "When eye icon is clicked, private key field is masked again")
        .click('@password_eyeicon_pk')
        .assert.elementPresent('@password_eyeicon_pk', "When eye icon is clicked, password field is unmasked")
        .click('@password_eyeicon_pk')
        .assert.elementPresent('@password_eyeicon_pk', "When eye icon is clicked, password field is masked again")
        .pause(2000)
    },

    create_account(name, password){
        return this
        .click("@create_account")
        .click("@createnew_account")
        .click("@input_accountname")
        .setValue("@input_accountname", name)
        .setValue("@input_walletpassword", password)
        .click("@create")
        .pause(1000)
        .assert.visible('@createsuccessful_popup', 'Account is successfully created when account name is valid and wallet password is correct')
        .click("@close")
        .pause(1000)
        .isVisible('@account_detailstab', callback = (result) => {
            this.assert.equal(result.value, true, 'If account is successfully created, user is navigated to the newly created account details page')
        })
        .isVisible('@address', callback = (result) => {
            this.assert.equal(result.value, true, 'If account is successfully created, wallet address is visible')
        })
        .isVisible('@public_key', callback = (result) => {
            this.assert.equal(result.value, true, 'If account is successfully created, public key is visible')
        })
        .isVisible('@private_key', callback = (result) => {
            this.assert.equal(result.value, true, 'If account is successfully created, private key is available')
        })
       
    },

    create_account_pk(privatekey, name, password){
        return this
        .click("@create_account")
        .click("@createnew_frompk")
        .click("@input_privatekey")
        .setValue("@input_privatekey", privatekey)
        .setValue("@input_accountname_pk", name)
        .setValue("@input_walletpassword_pk", password)
        .click("@create")
        .pause(1000)
        .assert.visible('@createsuccessful_popup', 'Account is successfully created when account name is valid and wallet password is correct')
        .click("@close")
        .pause(1000)
        .isVisible('@account_detailstab', callback = (result) => {
            this.assert.equal(result.value, true, 'If account is successfully created, user is navigated to the newly created account details page')
        })
        .isVisible('@address', callback = (result) => {
            this.assert.equal(result.value, true, 'If account is successfully created, wallet address is visible')
        })
        .isVisible('@public_key', callback = (result) => {
            this.assert.equal(result.value, true, 'If account is successfully created, public key is visible')
        })
        .isVisible('@private_key', callback = (result) => {
            this.assert.equal(result.value, true, 'If account is successfully created, private key is available')
        })
    },

    existing_name(name, password){
        return this
        .click("@create_account")
        .click("@createnew_account")
        .setValue("@input_accountname", name)
        .setValue("@input_walletpassword", password)
        .click("@create")
        .isVisible('@error_existingname', function callback(result) {
            this.assert.equal(result.value, true, 'If account name is taken, error is shown')
        })
        .pause(1000)
        .end()
    },

    existing_name_pk(privatekey, name, password){
        return this
        .click("@create_account")
        .click("@createnew_frompk")
        .setValue("@input_privatekey", privatekey)
        .setValue("@input_accountname_pk", name)
        .setValue("@input_walletpassword_pk", password)
        .click("@create")
        .isVisible('@error_existingname', function callback(result) {
            this.assert.equal(result.value, true, 'If account name is taken, error is shown')
        })
    },

    existing_privatekey(privatekey, name, password){
        return this
        .click("@create_account")
        .click("@createnew_frompk")
        .setValue("@input_privatekey", privatekey)
        .setValue("@input_accountname_pk", name)
        .setValue("@input_walletpassword_pk", password)
        .click("@create")
        .isVisible('@error_existingprivatekey', function callback(result) {
            this.assert.equal(result.value, true, 'If account with that private key is taken, error is shown')
        })
        .pause(1000)
        .end()
    },

    invalid_privatekey(privatekey){
        return this
        .click("@create_account")
        .click("@createnew_frompk")
        .click("@input_privatekey")
        .setValue("@input_privatekey", privatekey)
        .isVisible('@error_invalidpk', callback = (result) => {
            this.assert.equal(result.value, true, 'If private key length is less than required minimum, error is shown')
        })

    }

    
}



module.exports = {
    elements: elements,
    commands: commands,
    url: function () {
        return '${this.api.launchUrl}'
    }
}