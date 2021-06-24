const elements = {

    account: '.relative > nav > a:nth-child(3)',
    createaccount: '.page > div:nth-child(1) > div:nth-child(2) > a:nth-child(1)',
    new: 'a.inline-block:nth-child(1)',
    from_privatekey: 'a.inline-block:nth-child(2)',
    accountname: 'input.bg-white',
    password: '.border-grey-300 > input:nth-child(2)',
    password2: '.border-red-primary > input:nth-child(2)',
    password3: 'fieldset.w-full > div:nth-child(2) > div:nth-child(1) > input:nth-child(2)',
    password4: 'fieldset.w-full > div:nth-child(3) > div:nth-child(1) > input:nth-child(2)',
    name_validation: '.error-text',
    password_validation: '.error-password',
    back: '.text-md > div:nth-child(2) > a:nth-child(1)',
    clear: 'button.default-btn:nth-child(1)',
    password_validation2: '.error',
    create: '.mt-10 > button:nth-child(2)',
    show_privatekey: 'div.px-5:nth-child(1) > a:nth-child(1)',
    hide_privatekey: 'div.px-5:nth-child(1) > a:nth-child(1)',
    privatekey: 'div.flex:nth-child(4) > div:nth-child(1) > div:nth-child(1)',
    continue: 'div.px-5:nth-child(3) > a:nth-child(1)',
    privatekey_field: 'div.ml-1:nth-child(1) > div:nth-child(1) > input:nth-child(2)',
    privatekey_field2: 'fieldset.w-full > div:nth-child(2) > div:nth-child(1) > input:nth-child(2)',
    privatekey_validation: '.error',
    import: 'button.default-btn:nth-child(2)',
    password5: '.border-2 > input:nth-child(2)',
    password6: 'fieldset.w-full > div:nth-child(4) > div:nth-child(1) > input:nth-child(2)',
    password7: 'fieldset.w-full > div:nth-child(5) > div:nth-child(1) > input:nth-child(2)'
}

const commands = [{
    //create new account
    navigate_createnewaccount(browser) {
        return this
            .click('@account')
            .assert.urlEquals(browser + 'view-all-accounts', 'When Account is clicked,User is navigated to the View Accounts page.')
            .click('@createaccount')
            .assert.urlEquals(browser + 'select-type-creation-account', 'When Create a New Account is clicked,User is navigated to the Select Account Creation Type page.')
            .click('@new')
            .assert.urlEquals(browser + 'create-account', 'When New is clicked, User is navigated to the Create New Account page.')
            .click('@back')
            .assert.urlEquals(browser + 'select-type-creation-account', 'When Back is clicked,User is navigated to the Select Account Creation Type page.')
            .click('@new')
    },
    emptyfield_validation() {
        return this
            .setValue('@accountname', '\ue004')
            .isVisible('@name_validation', callback = result => {
                this.assert.equal(result.value, true, 'If account name field is empty, error is shown')
            })
            .setValue('@password', '\ue004')
            .isVisible('@password_validation', callback = result => {
                this.assert.equal(result.value, true, 'If password field is empty, error is shown')
            })
    },
    clearbutton_validation(name, password) {
        return this
            .setValue('@accountname', name)
            .setValue('@password2', password)
            .click('@clear')
            .getValue('@accountname', callback = (result) => {
                this.assert.equal(result.value, '', 'When clear button is clicked, Account name field is cleared')
            })
            .getValue('@password3', callback = (result) => {
                this.assert.equal(result.value, '', 'When clear button is clicked, wallet password field is cleared')
            })
    },
    wrongpassword_validation(name, password2) {
        return this
            .setValue('@accountname', name)
            .setValue('@password3', password2)
            .click('@create')
            .isVisible('@password_validation2', function callback(result) {
                this.assert.equal(result.value, true, 'If wallet password is incorrect, error is shown')
            })
    },
    createsuccessful(browser, name, password) {
        return this
            .click('@clear')
            .setValue('@accountname', name)
            .setValue('@password4', password)
            .click('@create')
            .assert.urlEquals(browser + 'created-account', 'When account name is valid and wallet password is correct, User account is successfully created.')
            .click('@show_privatekey')
            .isVisible('@privatekey', callback = (result) => {
                this.assert.equal(result.value, true, 'When Show private key is clicked, Private key is revealed')
            })
            .click('@hide_privatekey')
            .click('@continue')
            .assert.urlEquals(browser + 'view-all-accounts', 'When continue is clicked,User is navigated to the View Accounts page.')
    },
    existingname_validation(name, password) {
        return this
            .click('@createaccount')
            .click('@new')
            .setValue('@accountname', name)
            .setValue('@password', password)
            .click('@create')
            .isVisible('@password_validation2', callback = result => {
                this.assert.equal(result.value, true, 'If account name is taken, error is shown')
            })
            .end()
    },
    //create account with private key
    navigate_createpkaccount(browser) {
        return this
            .click('@account')
            .assert.urlEquals(browser + 'view-all-accounts', 'When Account is clicked,User is navigated to the View Accounts page.')
            .click('@createaccount')
            .assert.urlEquals(browser + 'select-type-creation-account', 'When Create a New Account is clicked,User is navigated to the Select Account Creation Type page.')
            .click('@from_privatekey')
            .assert.urlEquals(browser + 'import-account', 'When From a Private Key is clicked, User is navigated to the Import Account page.')
            .click('@back')
            .assert.urlEquals(browser + 'select-type-creation-account', 'When back is clicked, User is navigated back to the Select Account Creation Type page.')
            .click('@from_privatekey')
    },
    emptyfield_validation2() {
        return this
            .setValue('@privatekey_field', '\ue004')
            .isVisible('@privatekey_validation', callback = result => {
                this.assert.equal(result.value, true, 'If private key field is empty, error is shown')
            })
            .setValue('@accountname', '\ue004')
            .isVisible('@name_validation', callback = result => {
                this.assert.equal(result.value, true, 'If account name field is empty, error is shown')
            })
            .setValue('@password5', '\ue004')
            .isVisible('@password_validation', callback = result => {
                this.assert.equal(result.value, true, 'If wallet password field is empty, error is shown')
            })
    },
    clearbutton_validation2(privatekey, name, password) {
        return this
            .setValue('@privatekey_field', privatekey)
            .setValue('@accountname', name)
            .setValue('@password6', password)
            .click('@clear')
            .getValue('@privatekey_field', callback = result => {
                this.assert.equal(result.value, '', 'When clear button is clicked, Private key field is cleared')
            })
            .getValue('@accountname', callback = result => {
                this.assert.equal(result.value, '', 'When clear button is clicked, Account name field is cleared')
            })
            .getValue('@password6', callback = result => {
                this.assert.equal(result.value, '', 'When clear button is clicked, password field is cleared')
            })
    },
    wrongpassword_validation2(privatekey, name, password2) {
        return this
            .setValue('@privatekey_field', privatekey)
            .setValue('@accountname', name)
            .setValue('@password6', password2)
            .click('@import')
            .isVisible('@password_validation2', callback = result => {
                this.assert.equal(result.value, true, 'If wallet password is incorrect, error is shown')
            })
    },
    createsuccessful2(browser, privatekey, name, password) {
        return this
            .click('@clear')
            //private key validation not implemented
            .setValue('@privatekey_field2', privatekey)
            .setValue('@accountname', name)
            .setValue('@password7', password)
            .click('@import')
            .assert.urlEquals(browser + 'created-account', 'When private key is valid, account name is valid and wallet password is correct, User account is successfully created.')
            .click('@show_privatekey')
            .isVisible('@privatekey', callback = result => {
                this.assert.equal(result.value, true, 'When Show private key is clicked, Private key is revealed')
            })
            .click('@continue')
            .assert.urlEquals(browser + 'view-all-accounts','When continue is clicked,User is navigated to the View Accounts page.')
    },
    existingname_validation2(privatekey, name, password) {
        return this
            .click('@createaccount')
            .click('@from_privatekey')
            .setValue('@privatekey_field', privatekey)
            .setValue('@accountname', name)
            .setValue('@password', password)
            .click('@import')
            .isVisible('@password_validation2', function callback(result) {
                this.assert.equal(result.value, true, 'If account name is taken, error is shown')
            })
            .end()
    }
}];
module.exports = {
    elements: elements,
    commands: commands,
    url: function () {
        return '${this.api.launchUrl}'
    }
}