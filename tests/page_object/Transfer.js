const elements = {

    transfer_tab: 'a[href="#/create-transfer"]',
    sender_acc: 'span.p-dropdown-label',
    primary_acc: 'ul.p-dropdown-items > li:nth-child(1)',
    second_acc: 'ul.p-dropdown-items > li:nth-child(2)', 
    receiver_acc: 'input.w-full:nth-child(2)',
    invalid_icon: '.text-red-400',
    select_contact: 'div.border:nth-child(2)',
    contact_list: 'div.p-tree-wrapper > ul.p-tree-container > li:nth-child(1) > ul:nth-child(2) > li:nth-child(1) > div:nth-child(1)',
    input_password: 'input.w-full:nth-child(1)',
    error_emptypassword: '.error',
    cancel_button: 'a[href="#/dashboard"]',
    transfer_amount: '.supply_input',
    transfer_button: 'button.w-full',
    error_wrongpassword: '.error',
    transaction_successful: 'div.p-toast:nth-child(12) > div:nth-child(1) > div:nth-child(1)',
    password_eyeicon: 'svg.svg-inline--fa:nth-child(2) > path:nth-child(1)',
    add_asset: 'button.my-2',
    select_asset: 'div.select.mb-3 > div:nth-child(1) > span.p-dropdown-label:nth-child(1)',
    asset: 'div.p-virtualscroller > ul:nth-child(1) > li:nth-child(1)',
    input_assetamount: 'div.flex.w-full > input.supply_input:nth-child(1)',
    insufficient_balance: 'div.rounded-md.bg-red-200.w-full.p-2.flex.items-center.justify-center',
    close_contact: 'span.p-sidebar-close-icon',
    owner_account: 'div.p-tree-wrapper > ul.p-tree-container > li:nth-child(1) > div:nth-child(1) > button'
}

const commands = {

    navigation_transfer(browser){
        return this
        .pause(1000)
        .click("@transfer_tab")
        .assert.urlEquals(browser + 'create-transfer', 'User is navigated to create transfer page')
        .click("@cancel_button")
        .assert.urlEquals(browser + 'dashboard', 'User is navigated back to dashboard')
        .click("@transfer_tab")

    },

    sender_account(){
        return this
        .click("@sender_acc")
        .isVisible('@primary_acc', callback = result => {
            this.assert.equal(result.value, true, "If user clicks transfer from drop down, user account is shown")
        })
        // select another account
        .click("@second_acc")
        .pause(1000)
        .click("@sender_acc")
        .click("@primary_acc")
        .pause(1000)
    },

    invalid_address(address, status){
        return this
        .setValue("@receiver_acc", address)
        .assert.textContains('@invalid_icon', status, 'Wallet address is invalid.')
        .clearValue("@receiver_acc")

    },

    create_transfer(amount, password1, password2){
        return this
        .pause(5000)
        .click("@select_contact")
        .click("@owner_account")
        .click("@contact_list")
        .pause(1000)
        .setValue("@transfer_amount", amount)
        .setValue("@input_password", password2)
        .click("@transfer_button")
        // enter wrong password
        .isVisible('@error_wrongpassword', callback = result => {
            this.assert.equal(result.value, true, "If user enters wrong password, an error is shown")
        })
        .clearValue("@input_password")
        .click("@input_password")
        .setValue("@input_password", password1)
        // masked password function
        .click("@password_eyeicon")
        .assert.elementPresent('@password_eyeicon', "When eye icon is clicked, password field is unmasked")
        .click('@password_eyeicon')
        .assert.elementPresent('@password_eyeicon', "When eye icon is clicked, password field is masked again")
        // create transfer
        .click("@transfer_button")
        .isVisible('@transaction_successful', callback = result => {
            this.assert.equal(result.value, true, "A notification is shown after the transaction is processed")
        })
        .pause(4000)
    },

    transfer_asset(amount1, amount2){
        return this
        .click("@transfer_tab")
        .click("@add_asset")
        .click("@select_asset")
        .pause(1000)
        .click("@asset")
        .pause(1000)
        .setValue("@input_assetamount", amount1)
        .updateValue("@input_assetamount", amount2)
        .isVisible('@insufficient_balance', callback = result => {
            this.assert.equal(result.value, true, "An error is shown if it exceeds account balance")
        })
        .pause(1000)

    },


    contact_dropdown(){
        return this
        .click("@select_contact")
        .click("@owner_account")
        .assert.visible('@contact_list', 'When user clicks select contact, contact list is shown')
        .click("@close_contact")
        .pause(1000)
    },

    empty_password(){
        return this
        .click("@input_password")
        .setValue("@input_password", '\ue004')
        .isVisible('@error_emptypassword', callback = result => {
            this.assert.equal(result.value, true, "If user does not enter password, an error is shown")
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