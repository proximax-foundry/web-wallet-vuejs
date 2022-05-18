const elements = {

    account_ellipsis: 'img.h-6:nth-child(1)',
    multisig_selection: 'a[href="#/multisig-settings/Primary"]',
    managecosign_button: '.blue-btn', 
    addcosign_button: 'button.pl-6',
    input_publickey: 'div.flex.flex-col.gap-2 > div:nth-child(1) > div:nth-child(1) > div:nth-child(3) > div:nth-child(1) > input',
    publickey: '.pb-1 > path:nth-child(2)',
    error_invalidpublickey: '.error',
    select_contact: 'div.border:nth-child(5)',
    contact_list: 'div.bg-gray-100:nth-child(1)',
    reduce_txnapproval: 'div.flex.gap-2.pl-6 > div:nth-child(1) > div:nth-child(2) > button:nth-child(1)',
    add_txnapproval: 'div.flex.gap-2.pl-6 > div:nth-child(1) > div:nth-child(2) > button:nth-child(3)',
    reduce_dltapproval: 'div.flex.gap-2.pl-6 > div:nth-child(2) > div:nth-child(2) > button:nth-child(1)',
    add_dltapproval: 'div.flex.gap-2.pl-6 > div:nth-child(2) > div:nth-child(2) > button:nth-child(3)',
    error_invalidapproval: '.error',
    input_password: 'input.text-left',
    error_emptypassword: '.error',
    cancel_button: '.content-center',
    updatecosign_button: 'button.w-full',
    error_invalidpassword: '.error',
    insufficient_amount: '.flex-cols > div:nth-child(1)',

}

const commands = {

    navigation_multisig(browser){
        return this
        .click("@account_ellipsis")
        .click("@multisig_selection")
        .assert.urlEquals(browser + 'multisig-settings/Primary', 'User is navigated to multisig page')
        .click("@managecosign_button")
        .assert.urlEquals(browser + 'convert-account-multisign/Primary', 'User is navigated to convert account to multisig page')
    
    },

    add_cosignatory(){
        return this
        .click("@contact_list")
        .pause(3000)
    },

    invalid_password(password){
        return this
        .setValue("@input_password", password)
        .click("@updatecosign_button")
        .isVisible('@error_invalidpassword', callback = result => {
            this.assert.equal(result.value, true, "If user enters invalid password, an error is shown")
        })

    },

    insufficient_xpx(){
        return this
        .pause(1000)
        .isVisible('@insufficient_amount', callback = result => {
            this.assert.equal(result.value, true, "If user has insufficient xpx amount, an error is shown")
        })
    },

    empty_password(browser){
        return this
        .clearValue("@input_password")
        .setValue("@input_password", "\ue004")
        .isVisible('@error_emptypassword', callback = result => {
            this.assert.equal(result.value, true, "If password has no input, an error is shown")
        })
        .click("@cancel_button")
        .assert.urlEquals(browser + 'multisig-settings/Primary', 'User is navigated back to multisig page')
        .pause(10000)
        .end()
        
    },

    scheme_validation(){
        return this
        .click("@reduce_txnapproval")
        .isVisible('@error_invalidapproval', callback = result => {
            this.assert.equal(result.value, true, "If number of cosignatories for transaction approval is less than 1, an error is shown")
        })
        .click("@add_txnapproval")
        .click("@reduce_dltapproval")
        .isVisible('@error_invalidapproval', callback = result => {
            this.assert.equal(result.value, true, "If number of cosignatories for deletion approval is less than 1, an error is shown")
        })
        .click("@add_dltapproval")
    },  

    invalid_publickey(publickey){
        return this
        .click("@addcosign_button")
        .assert.visible('@input_publickey', 'When user clicks add cosignatory, cosignatory public key field is opened')
        .pause(3000)
        .setValue("@input_publickey", publickey)
        .isVisible('@error_invalidpublickey', callback = result => {
            this.assert.equal(result.value, true, "If user enters invalid public key, an error is shown")
        })
        .clearValue("@input_publickey")
        
    },

    contact_dropdown(){
        return this
        .pause(1000)
        .click("@select_contact")
        .isVisible('@contact_list', callback = result => {
            this.assert.equal(result.value, true, "If user clicks select contact button, a list of contacts is shown")
        })
    },
    

}

module.exports = {

    elements: elements,
    commands: commands,
    url: function () {
        return this.api.launchUrl 
    }

}