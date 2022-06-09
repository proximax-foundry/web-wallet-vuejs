const elements = {

    account_ellipsis: 'div.link_block > a:nth-child(1) > div:nth-child(2)',
    details_selection: 'a.block:nth-child(1)',
    accountdetails_tab: 'div.w-32:nth-child(1)', 
    accountname_value: 'div.justify-center:nth-child(2) > div:nth-child(1) > div:nth-child(1)',
    change_default: '.font-txs > img:nth-child(1)',
    new_account: 'div.p-2:nth-child(2)',
    back: 'a[href="#/dashboard"]',
    copy_address: 'div.justify-center:nth-child(2) > div:nth-child(2) > svg:nth-child(2) > path:nth-child(2)',
    copyaddress_popup: 'div.p-toast:nth-child(9) > div:nth-child(1) > div:nth-child(1)',
    copy_publickey: '.pb-1 > path:nth-child(2)',
    copypublickey_popup: 'div.p-toast:nth-child(9) > div:nth-child(1) > div:nth-child(1)',
    copy_privatekey: 'div.border-2:nth-child(3) > div:nth-child(8) > div:nth-child(3) > svg:nth-child(2) > path:nth-child(2)',
    confirm_button_pk: 'div.blue-btn:nth-child(3)',
    confirm_button_wp: 'div.blue-btn:nth-child(3)',
    confirm_button_wp_2: 'div.blue-btn:nth-child(4)',
    cancel_button_pk: 'div.text-center:nth-child(4)',
    cancel_button_pk_2:'div.cursor-pointer:nth-child(5)',
    cancel_button_wp: 'div.text-center:nth-child(4)',
    cancel_button_wp_2:'div.cursor-pointer:nth-child(5)',
    delete_successfulpopup: 'body > div:nth-child(9) > div:nth-child(1) > div:nth-child(1)',
    download_button: '.blue-btn',
    download_passwordpopup: '.z-50 > div:nth-child(1)',
    edit_nameicon: 'img.w-4:nth-child(2)',
    enter_passwordpopup: 'div.popup-outer-lang:nth-child(3) > div:nth-child(1)',
    error_emptyname: '.text-red-500',
    error_existingname: '.text-red-500',
    error_emptypassword_pk: 'div.error:nth-child(2)',
    error_emptypassword_wp: 'div.error:nth-child(2)',
    error_wrongpassword_pk: '.error',
    error_wrongpassword_wp: '.error',
    input_accountname: '.outline-none',
    input_password: 'input.w-full',
    input_password_wp: 'input.w-full',
    password_eyeicon_pk: '.text-gray-500 > path:nth-child(1)',
    wallet_paper: '.textLayer',
    private_keyhidden: 'div.border-2:nth-child(3) > div:nth-child(8) > div:nth-child(2) > div:nth-child(1)',    
    pk_successfulpopup: 'div.p-toast:nth-child(9) > div:nth-child(1) > div:nth-child(1)',
    transfer_button: 'div.flex:nth-child(5) > a:nth-child(1) > div:nth-child(2)',
    view_privatekey: '.fa-eye > path:nth-child(2)',
    private_key: '#private',

}

const commands = {

    navigate_accountdetails(){
        return this
        .click("@account_ellipsis")
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
        .click("@account_ellipsis")

    },

    edit_accountname(name){
        return this
        .click("@back")
        .click("@account_ellipsis")
        .click("@edit_nameicon")
        .assert.elementPresent('@input_accountname', 'When edit button is clicked, account name field is open for edit.')
        .click("@input_accountname")
        .setValue('@input_accountname','\ue003\ue003\ue003\ue003\ue003\ue003\ue003\ue003')
        .setValue("@input_accountname", name)
        .click("@edit_nameicon")
        .pause(2000)
        .assert.textContains('@accountname_value', name, 'Account name has successfully edited.')
    
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
        .click("@transfer_button")
        .assert.urlEquals(browser + 'create-transfer', 'When transfer xpx button is clicked, user is directed to create transfer page')
        .pause(1000)
        .end()

    },

    download_walletpaper(password, password2){
        return this
        .click("@download_button")
        .isVisible('@download_passwordpopup', callback = (result) => {
            this.assert.equal(result.value, true, 'If user clicks to download wallet paper, it will prompt for user to enter password')
        })
        .click("@input_password_wp")
        .click("@confirm_button_wp")
        .isVisible('@error_emptypassword_wp', callback = (result) => {
            this.assert.equal(result.value, true, 'If password field has no input, it will show an error')
        })
        .click("@cancel_button_wp")
        .pause(1000)
        .click("@back")
        .click("@account_ellipsis")
        .click("@download_button")
        .click("@input_password_wp")
        .setValue("@input_password_wp", password2)
        .click("@confirm_button_wp")
        .isVisible('@error_wrongpassword_wp', callback = result => {
            this.assert.equal(result.value, true, "If user enters wrong wallet password, an error is shown")
        })
        .click("@cancel_button_wp_2")
        .pause(5000)
        .click("@download_button")
        .click("@input_password_wp")
        .setValue("@input_password_wp", password)
        .pause(1000)
        .click("@confirm_button_wp_2")
        .pause(5000)
        .waitForElementVisible("@wallet_paper")
        .assert.elementPresent('@wallet_paper', "If wallet password is correct, wallet paper will be shown")
        .end()
    },

    show_privatekey(password1, password2){
        return this
        .click("@view_privatekey")
        .isVisible('@enter_passwordpopup', callback = (result) => {
            this.assert.equal(result.value, true, 'If user clicks to view private key, it will prompt for user to enter password')
        })
        .click("@input_password")
        .click("@confirm_button_pk")
        .isVisible('@error_emptypassword_pk', callback = (result) => {
            this.assert.equal(result.value, true, 'If password field has no input, it will show an error')
        })
        .click("@cancel_button_pk")
        .pause(5000)
        .click("@back")
        .click("@account_ellipsis")
        .click("@view_privatekey")
        .click("@input_password")
        .setValue("@input_password", password2)
        .click("@confirm_button_pk")
        .isVisible('@error_wrongpassword_pk', callback = result => {
            this.assert.equal(result.value, true, "If user enters wrong wallet password, an error is shown")
        })
        .pause(5000)
        .waitForElementVisible("@cancel_button_pk_2")
        .click("@cancel_button_pk_2")
        .waitForElementVisible("@back")
        .click("@back")
        .click("@account_ellipsis")
        .click("@view_privatekey")
        .click("@input_password")
        .setValue("@input_password", password1)
        .click("@password_eyeicon_pk")
        .assert.elementPresent('@password_eyeicon_pk', "When eye icon is clicked, private key field is unmasked")
        .click("@confirm_button_pk")
        .isVisible('@private_key', callback = result => {
            this.assert.equal(result.value, true, "If user enters correct wallet password, the private key is shown")
        })
        .click("@copy_privatekey")
        .isVisible('@pk_successfulpopup', callback = result => {
            this.assert.equal(result.value, true, "If user clicks to copy private key, a notification is shown")
        })

    },
    
}



module.exports = {
    elements: elements,
    commands: commands,
    url: function () {
        return '${this.api.launchUrl}'
    }
  
  }
