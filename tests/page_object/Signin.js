const elements = {

    wallet_dropdown: 'form > fieldset > div:nth-child(4) > div:nth-child(1)',
    select_wallet: 'form > fieldset > div:nth-child(5) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1)',
    input_password: 'form > fieldset > div:nth-child(7) > div:nth-child(1) > div:nth-child(1) > input',
    clearinput_password: 'form > fieldset > div:nth-child(8) > div:nth-child(1) > div:nth-child(1)',
    sign_in: 'form > fieldset > div:nth-child(8) > button',
    sign_out: '#app > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(6) > a',
    error_emptypassword: 'form > fieldset > div:nth-child(7) > div:nth-child(1) > div.error.error-password.text-left.my-2',
    error_wrongpassword: 'form > fieldset > div:nth-child(1)',
    password_eyeicon: 'form > fieldset > div:nth-child(8) > div:nth-child(1) > div:nth-child(1) > svg > path',
    create: '#app > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(5) > a'

  }

  
const commands = {

    signin_dashboard(browser, password){
        return this
        .click("@wallet_dropdown")
        .click("@select_wallet")
        .click("@input_password")
        .setValue("@input_password", password)
        .click("@sign_in")
        .assert.urlEquals(browser + 'dashboard', 'User is successfully signed in with valid wallet name and password')
    },

    signout_dashboard(){
        return this
        .pause(1000)
        .click("@sign_out")
    },

    empty_password(){
        return this
        .click("@wallet_dropdown")
        .click("@select_wallet")
        .click("@input_password")
        .setValue("@input_password", "\ue004")
        .isVisible('@error_emptypassword', callback = result => {
            this.assert.equal(result.value, true, "If password field is empty, error is shown")
        })
    },

    wrong_password(password){
        return this
        .click("@wallet_dropdown")
        .click("@select_wallet")
        .click("@input_password")
        .setValue("@input_password", password)
        .click("@sign_in")
        .isVisible('@error_wrongpassword', callback = result => {
            this.assert.equal(result.value, true, "If password is wrong, error is shown")
        })
    },

    eye_icon(){
        return this
        .click('@password_eyeicon')
        .assert.elementPresent('@password_eyeicon', "When eye icon is clicked, password field is unmasked")
        .click('@password_eyeicon')
        .assert.elementPresent('@password_eyeicon', "When eye icon is clicked, password field is masked again")
        .pause(2000)
        .end()
    }
    
  
}




module.exports = {
    elements: elements,
    commands: commands,
    url: function () {
      return '${this.api.launchUrl}'
    }

}