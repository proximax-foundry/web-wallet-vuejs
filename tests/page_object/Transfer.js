const elements = {

    transfer_tab: '#app > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(3) > a:nth-child(2)',
    sender_acc: '#app > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(3) > div:nth-child(1) > div:nth-child(1) > div:nth-child(3) > div:nth-child(1) > div:nth-child(1)',
    primary_acc: '#app > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(3) > div:nth-child(1) > div:nth-child(1) > div:nth-child(3) > div:nth-child(2) > div:nth-child(1) > div:nth-child(2)',
    second_acc: '#app > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(3) > div:nth-child(1) > div:nth-child(1) > div:nth-child(3) > div:nth-child(2) > div:nth-child(1) > div:nth-child(3)',
    receiver_acc: '#app > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(3) > div:nth-child(1) > div:nth-child(1) > div:nth-child(4) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > input',
    invalid_icon: '#app > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(3) > div:nth-child(1) > div:nth-child(1) > div:nth-child(4) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)',
    select_contact: '#app > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(3) > div:nth-child(1) > div:nth-child(1) > div:nth-child(4) > div:nth-child(2)',
    contact_list: '#app > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(3) > div:nth-child(1) > div:nth-child(1) > div:nth-child(5) > div:nth-child(3) > div:nth-child(1)',
    input_password: '#app > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(3) > div:nth-child(1) > div:nth-child(2) > div:nth-child(10) > div:nth-child(1) > input',
    error_emptypassword: '#app > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(3) > div:nth-child(1) > div:nth-child(2) > div:nth-child(10) > div:nth-child(2)',
    cancel_button: '#app > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(3) > div:nth-child(1) > div:nth-child(2) > div:nth-child(12) > a',
    transfer_amount: '.supply_input',
    home_icon: '#app > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > a:nth-child(1) > img',
    transfer_button: '#app > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(3) > div:nth-child(1) > div:nth-child(2) > button:nth-child(11)',
    error_wrongpassword: '#app > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(3) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2)',
    transaction_successful: 'body > div:nth-child(9) > div:nth-child(1) > div:nth-child(1)',
    password_eyeicon: '#app > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(3) > div:nth-child(1) > div:nth-child(2) > div:nth-child(10) > div:nth-child(1) > svg > path',
    input_message: '#app > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(3) > div:nth-child(1) > div:nth-child(1) > div:nth-child(6) > div:nth-child(1) > textarea',
    transaction_fee: '#app > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(3) > div:nth-child(1) > div:nth-child(2) > div:nth-child(4) > div:nth-child(2)',

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
        .assert.containsText('@invalid_icon', status, 'Wallet address is invalid.')

    },

    create_transfer(amount, message, xpx, password1, password2){
        return this
        .pause(5000)
        .clearValue("@receiver_acc")
        .click("@select_contact")
        .click("@contact_list")
        .setValue("@transfer_amount", amount)
        .setValue("@input_password", password2)
        .setValue("@input_password", '\ue004')
        .click("@transfer_button")
        // enter wrong password
        .isVisible('@error_wrongpassword', callback = result => {
            this.assert.equal(result.value, true, "If user enters wrong password, an error is shown")
        })
        .clearValue("@input_password")
        .setValue("@input_password", password1)
        // masked password function
        .click("@password_eyeicon")
        .assert.elementPresent('@password_eyeicon', "When eye icon is clicked, password field is unmasked")
        .click('@password_eyeicon')
        .assert.elementPresent('@password_eyeicon', "When eye icon is clicked, password field is masked again")
        // write message
        .setValue("@input_message", message)
        .assert.containsText('@transaction_fee', xpx, 'Transaction fee increases.')
        // create transfer
        .click("@transfer_button")
        .pause(8000)
        .isVisible('@transaction_successful', callback = result => {
            this.assert.equal(result.value, true, "A notification is shown after the transaction is processed")
        })

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