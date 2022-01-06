const elements = {

    account: '#app > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > a:nth-child(1)',
    accountname_value: '#app > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(3) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1)',
    accountdetails_tab: '#app > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)',
    new_account: '#app > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > a:nth-child(2)',
    back: '#app > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > a',
    copy_address: '#app > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(4) > div:nth-child(7) > svg > path',
    copyaddress_popup: 'body > div:nth-child(9) > div:nth-child(1) > div:nth-child(1)',
    copy_publickey: '#app > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(4) > div:nth-child(10) > svg > path',
    copypublickey_popup: 'body > div:nth-child(9) > div:nth-child(1) > div:nth-child(1)',
    copy_privatekey: '#app > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(4) > div:nth-child(12) > div:nth-child(3) > svg:nth-child(2) > path',
    confirm_button: '#app > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(4) > div:nth-child(12) > div:nth-child(2) > div:nth-child(3) > div:nth-child(1) > div:nth-child(3)',
    confirm_button2: '#app > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(4) > div:nth-child(14) > div:nth-child(2) > div:nth-child(1) > div:nth-child(3)',
    confirm_deletionbutton: '#app > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(4) > div:nth-child(14) > div:nth-child(3) > div:nth-child(1) > div:nth-child(4)',
    cancel_button: '#app > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(4) > div:nth-child(12) > div:nth-child(2) > div:nth-child(3) > div:nth-child(1) > div:nth-child(5)',
    cancel_button2: '#app > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(4) > div:nth-child(12) > div:nth-child(2) > div:nth-child(3) > div:nth-child(1) > div:nth-child(4)',
    cancel_button3: '#app > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(4) > div:nth-child(14) > div:nth-child(2) > div:nth-child(1) > div:nth-child(5)',
    cancel_button4: '#app > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(4) > div:nth-child(14) > div:nth-child(2) > div:nth-child(1) > div:nth-child(4)',
    cancel_deletionbutton: '#app > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(4) > div:nth-child(14) > div:nth-child(3) > div:nth-child(1) > div:nth-child(5)',
    cancel_deletionbutton2: '#app > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(4) > div:nth-child(14) > div:nth-child(3) > div:nth-child(1) > div:nth-child(6)',
    delete: '#app > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(4) > div:nth-child(14) > div:nth-child(2) > div:nth-child(2)',
    deleteaccount_popup: '#app > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(4) > div:nth-child(14) > div:nth-child(3) > div:nth-child(1)',
    delete_successfulpopup: 'body > div:nth-child(9) > div:nth-child(1) > div:nth-child(1)',
    download_button: '#app > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(4) > div:nth-child(14) > div:nth-child(1)',
    download_passwordpopup: '#app > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(4) > div:nth-child(14) > div:nth-child(2) > div:nth-child(1)',
    edit_nameicon: '#app > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(3) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > img',
    enter_passwordpopup: '#app > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(4) > div:nth-child(12) > div:nth-child(2) > div:nth-child(3) > div:nth-child(1)',
    error_emptyname: '#app > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div.error.error_box.mb-3',
    error_existingname: '#app > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div.error.error_box.mb-3',
    error_emptypassword: '#app > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(4) > div:nth-child(12) > div:nth-child(2) > div:nth-child(3) > div:nth-child(1) > div.error.error_box.mb-3',
    error_emptypassword2: '#app > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(4) > div:nth-child(14) > div:nth-child(2) > div:nth-child(1) > div.error.error_box.mb-3',
    error_wrongpassword: '#app > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(4) > div:nth-child(12) > div:nth-child(2) > div:nth-child(3) > div:nth-child(1) > div.error.error_box.mb-3',
    error_wrongpassword2: '#app > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(4) > div:nth-child(14) > div:nth-child(2) > div:nth-child(1) > div.error.error_box.mb-3',
    error_wrongpassworddeletion: '#app > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(4) > div:nth-child(14) > div:nth-child(3) > div:nth-child(1) > div.error.error_box.mb-3',
    input_accountname: '#app > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(3) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > input',
    input_password: '#app > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(4) > div:nth-child(12) > div:nth-child(2) > div:nth-child(3) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > input',
    input_password2: '#app > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(4) > div:nth-child(14) > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > input',
    input_passworddeletion: '#app > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(4) > div:nth-child(14) > div:nth-child(3) > div:nth-child(1) > div:nth-child(3) > div:nth-child(1) > input',
    password_eyeicon: '#app > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(4) > div:nth-child(12) > div:nth-child(2) > div:nth-child(3) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > svg > path',
    password_eyeicon2: '#app > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(4) > div:nth-child(14) > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > svg > path',
    password_eyeicondeletion: '#app > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(4) > div:nth-child(14) > div:nth-child(3) > div:nth-child(1) > div:nth-child(3) > div:nth-child(1) > svg > path',
    private_key: '#private',
    private_keyhidden: '#app > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(4) > div:nth-child(12) > div:nth-child(2) > div:nth-child(1)',
    pk_successfulpopup: 'body > div:nth-child(9) > div:nth-child(1) > div:nth-child(1)',
    hide_privatekey: '#app > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(4) > div:nth-child(12) > div:nth-child(3) > svg:nth-child(3) > path',
    view_privatekey: '#app > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(4) > div:nth-child(12) > div:nth-child(2) > svg > path',
    transfer_button: '#app > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(4) > div:nth-child(3) > div:nth-child(5) > a:nth-child(1) > div:nth-child(2)'

}

const commands = {

    navigate_accountdetails(){
        return this
        .click("@account")
        .isVisible('@accountdetails_tab', callback = result => {
            this.assert.equal(result.value, true, "If account is clicked, user is navigated to account details page")
        })
    },

    empty_input(){
        return this
        .click("@edit_nameicon")
        .click("@input_accountname")
        .setValue('@input_accountname','\ue003\ue003\ue003\ue003\ue003\ue003\ue003\ue003')
        .click("@edit_nameicon")
        .assert.elementPresent('@error_emptyname', 'When account name is empty, error is shown')
        .pause(2000)
    },

    existing_name(name){
        return this
        .click("@edit_nameicon")
        .setValue('@input_accountname','\ue003\ue003\ue003\ue003\ue003\ue003\ue003\ue003')
        .setValue("@input_accountname", name)
        .click("@edit_nameicon")
        .assert.elementPresent('@error_existingname',' When account name is already taken, error is shown')
        .click("@back")
        .click("@account")
    },

    edit_accountname(name){
        return this
        .click("@back")
        .click("@account")
        .click("@edit_nameicon")
        .assert.elementPresent('@input_accountname', 'When edit button is clicked, account name field is open for edit.')
        .click("@input_accountname")
        .setValue('@input_accountname','\ue003\ue003\ue003\ue003\ue003\ue003\ue003\ue003')
        .setValue("@input_accountname", name)
        .click("@edit_nameicon")
        .pause(2000)
        .assert.containsText('@accountname_value', name, 'Account name has successfully edited.')
    
    },

    copy_instances(){
        return this
        .click("@copy_address")
        .isVisible('@copyaddress_popup', callback = (result) => {
            this.assert.equal(result.value, true, 'If user clicks to copy wallet address, a notification is shown')
        })
        .click("@copy_publickey")
        .isVisible('@copypublickey_popup', callback = (result) => {
            this.assert.equal(result.value, true, 'If user clicks to copy public key, a notification is shown')
        })
        .pause(1000)
        .end()
    },

    transfer_xpx(browser){
        return this
        .click("@account")
        .click("@transfer_button")
        .assert.urlEquals(browser + 'create-transfer', 'When transfer xpx button is clicked, user is directed to create transfer page')
        .pause(1000)
        .end()

    },

    delete_account(browser, password, password2){
        return this
        .click("@new_account")
        .click("@delete")
        .isVisible('@deleteaccount_popup', callback = (result) => {
            this.assert.equal(result.value, true, 'If user clicks to delete account, it will prompt for user confirmation and password')
        })
        .click("@input_passworddeletion")
        .setValue("@input_passworddeletion", password)
        .click("@cancel_deletionbutton")
        .isVisible('@accountdetails_tab', callback = result => {
            this.assert.equal(result.value, true, "If user clicks cancel, user is navigated back to account details page")
        })
        .click("@delete")
        .click("@input_passworddeletion")
        .setValue("@input_passworddeletion", password2)
        .click("@confirm_deletionbutton")
        .isVisible('@error_wrongpassworddeletion', callback = (result) => {
            this.assert.equal(result.value, true, 'If user enters wrong wallet password, it will show an error')
        })
        .click("@cancel_deletionbutton2")
        .click("@back")
        .click("@new_account")
        .click("@delete")
        .pause(2000)
        .click("@input_passworddeletion")
        .setValue("@input_passworddeletion", password)
        .click("@password_eyeicondeletion")
        .assert.elementPresent('@password_eyeicondeletion', "When eye icon is clicked, password field is unmasked")
        .click("@confirm_deletionbutton")
        .pause(2000)
        .isVisible('@delete_successfulpopup', callback = (result) => {
            this.assert.equal(result.value, true, 'If user clicks to delete account, a notification is shown')
        })
        .assert.urlEquals(browser + 'view-all-accounts', 'When account is successfully deleted, user is directed to view all accounts page')

    },

    download_walletpaper(password, password2){
        return this
        .click("@download_button")
        .isVisible('@download_passwordpopup', callback = (result) => {
            this.assert.equal(result.value, true, 'If user clicks to download wallet paper, it will prompt for user to enter password')
        })
        .click("@input_password2")
        .click("@confirm_button2")
        .isVisible('@error_emptypassword2', callback = (result) => {
            this.assert.equal(result.value, true, 'If password field has no input, it will show an error')
        })
        .click("@cancel_button3")
        .pause(1000)
        .click("@back")
        .click("@account")
        .click("@download_button")
        .click("@input_password2")
        .setValue("@input_password2", password)
        .pause(1000)
        .click("@cancel_button4")
        .isVisible('@accountdetails_tab', callback = result => {
            this.assert.equal(result.value, true, "If user clicks cancel, user is navigated back to account details page")
        })
        .pause(2000)
        .click("@download_button")
        .click("@input_password2")
        .setValue("@input_password2", password)
        .click("@password_eyeicon2")
        .assert.elementPresent('@password_eyeicon2', "When eye icon is clicked, password field is unmasked")
        .pause(1000)
        .click("@confirm_button2")
        .pause(5000)
        .click("@download_button")
        .click("@input_password2")
        .setValue("@input_password2", password2)
        .click("@confirm_button2")
        .isVisible('@error_wrongpassword2', callback = result => {
            this.assert.equal(result.value, true, "If user enters wrong wallet password, an error is shown")
        })
        .click("@cancel_button3")
        .pause(5000)
        
    },

    show_privatekey(password1, password2){
        return this
        .click("@view_privatekey")
        .isVisible('@enter_passwordpopup', callback = (result) => {
            this.assert.equal(result.value, true, 'If user clicks to view private key, it will prompt for user to enter password')
        })
        .click("@input_password")
        .click("@confirm_button")
        .isVisible('@error_emptypassword', callback = (result) => {
            this.assert.equal(result.value, true, 'If password field has no input, it will show an error')
        })
        .click("@cancel_button")
        .click("@back")
        .click("@account")
        .click("@view_privatekey")
        .click("@input_password")
        .setValue("@input_password", password1)
        .pause(1000)
        .click("@cancel_button2")
        .isVisible('@accountdetails_tab', callback = result => {
            this.assert.equal(result.value, true, "If user clicks cancel, user is navigated back to account details page")
        })
        .click("@view_privatekey")
        .click("@input_password")
        .setValue("@input_password", password2)
        .click("@confirm_button")
        .isVisible('@error_wrongpassword', callback = result => {
            this.assert.equal(result.value, true, "If user enters wrong wallet password, an error is shown")
        })
        .click("@cancel_button")
        .click("@back")
        .click("@account")
        .click("@view_privatekey")
        .click("@input_password")
        .setValue("@input_password", password1)
        .click("@password_eyeicon")
        .assert.elementPresent('@password_eyeicon', "When eye icon is clicked, private key field is unmasked")
        .click("@confirm_button")
        .assert.elementPresent('@private_key','If wallet password is correct, private key is revealed')
        .click("@copy_privatekey")
        .isVisible('@pk_successfulpopup', callback = result => {
            this.assert.equal(result.value, true, "If user clicks to copy private key, a notification is shown")
        })
        .pause(5000)
        .click("@hide_privatekey")
        .assert.elementPresent('@private_keyhidden', 'When hide private key button is clicked, private key field is masked again.')

    },
    
}



module.exports = {
    elements: elements,
    commands: commands,
    url: function () {
      return '${this.api.launchUrl}'
    }
  
  }
