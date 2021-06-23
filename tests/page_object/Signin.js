const elements = {
  signin_button: '.w-full',
  wallet_dropdown: '.selectPlugin > div:nth-child(1) > div:nth-child(1)',
  remove_wallet: '.multiselect-clear',
  emptywallet_validation: '.error',
  emptypassword_validation: '.error-password',
  select_wallet: '.selectPlugin > div:nth-child(1) > div:nth-child(2) > span:nth-child(1)',
  inputpassword: '.text-placeholder',
  signin_title: '.default-title',
  invalid_password: '.error',
  signin_button2: 'button.default-btn:nth-child(2)'
};
const commands = [{
  emptyfields_validation() {
    return this
      .click('@signin_button')
      .click('@wallet_dropdown')
      .click('@select_wallet')
      .click('@remove_wallet')
      .click('@signin_title')
      .isVisible('@emptywallet_validation', callback = result => {
        this.assert.equal(result.value, true, "If wallet field is empty, error is shown")
      })
      .setValue("@inputpassword", '\ue004')
      .isVisible('@emptypassword_validation', callback = result => {
        this.assert.equal(result.value, true, "If password field is empty, error is shown")
      })
  },
  wrongpassword_validation(password2) {
    return this
      .click('@wallet_dropdown')
      .click('@select_wallet')
      .setValue("@inputpassword", password2)
      .click('@signin_button2')
      .isVisible('@invalid_password', callback = result => {
        this.assert.equal(result.value, true, "If password is incorrect, error is shown")
      })
  },
  signinto_dashboard(browser, password) {
    return this
      .clearValue("@inputpassword")
      .setValue("@inputpassword", password)
      .click('@signin_button2')
      .assert.urlEquals(browser + 'dashboard', 'User is successfully signed in with valid wallet name and password')
      .end()
  },
  signin(password) {
    return this
      .click('@signin_button')
      .click('@wallet_dropdown')
      .click('@select_wallet')
      .setValue("@inputpassword", password)
      .click('@signin_button2')
  }

}];
module.exports = {
  elements: elements,
  commands: commands,
  url: function () {
    return '${this.api.launchUrl}'
  }

}