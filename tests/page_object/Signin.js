const elements = {

    wallet_dropdown: 'div.border:nth-child(4)',
    select_wallet: 'div.px-2:nth-child(2) > div:nth-child(1)',
    input_password: 'input.w-full',
    sign_in: '.blue-btn',
    sign_out: '.signout_block',
    error_emptypassword: '.error',
    error_wrongpassword: '.error',
    password_eyeicon: '.svg-inline--fa', 

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
        .pause(2000)
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