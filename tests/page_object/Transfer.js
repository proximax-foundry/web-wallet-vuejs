const elements = {

    transfer_tab: 'a[href="#/create-transfer"]',
    sender_acc: 'div.ml-auto:nth-child(1)',
    primary_acc: 'div.px-2:nth-child(3)',
    second_acc: 'div.px-2:nth-child(4)', 
    receiver_acc: 'input.w-full:nth-child(2)',
    invalid_icon: '.text-red-400',
    select_contact: 'div.border:nth-child(2)',
    contact_list: 'div.text-xs.py-2.pl-2.w-full',
    input_password: 'input.w-full:nth-child(1)',
    error_emptypassword: '.error',
    cancel_button: 'a[href="#/dashboard"]',
    transfer_amount: '.supply_input',
    transfer_button: 'button.w-full',
    error_wrongpassword: '.error',
    transaction_successful: 'div.p-toast:nth-child(12) > div:nth-child(1) > div:nth-child(1)',
    password_eyeicon: 'svg.svg-inline--fa:nth-child(2) > path:nth-child(1)',
    add_asset: 'button.my-2',
    select_asset: 'select.text-gray-600',
    asset: 'option.text-gray-800:nth-child(2)',
    input_assetamount: 'input.supply_input',
    insufficient_balance: '.error',

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
        .click("@contact_list")
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
        .click("@asset")
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
        .assert.visible('@contact_list', 'When user clicks select contact, contact list is shown')
        .click("@select_contact")

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