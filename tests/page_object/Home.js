
const elements = {
  logo: '.w-32',
  network_dropdown: '.p-dropdown-trigger-icon',
  networks: 'li.p-dropdown-item-group:nth-child(1)',
  home: '.font-normal',
  signin_button: '.w-full',
  signin_title: '.default-title',
  signin_close: '.fixed',
  siriusid: 'div.px-5:nth-child(2) > div:nth-child(1) > a:nth-child(1)',
  siriusid_title: '.default-title',
  wallet: 'div.w-16:nth-child(4) > a:nth-child(1)',
  create: 'div.px-5:nth-child(3) > a:nth-child(1)',
};

const commands = [{
  click_headercomponents(browser) {
    return this
      .pause(1000)
      .click('@logo')
      .assert.urlEquals(browser, 'When ProximaX logo is clicked, user is navigated to home screen.')
      .click('@network_dropdown')
      .assert.visible('@networks', 'When network dropdown button is clicked, list of available networks is shown.')
      .click('@wallet')
      .assert.urlEquals(browser + 'wallets', 'When Wallet is clicked, user is navigated to the wallets page.')
      .click('@home')
      .assert.urlEquals(browser, 'When Home is clicked, user is navigated to the home page.')
      .click('@signin_button')
      .assert.visible('@signin_title', 'When Sign In button is clicked, the Sign in pop-up appeared.')
  },
  click_homecomponents(browser) {
    return this
      .click('@signin_close')
      .click("@create")
      .assert.urlEquals(browser + 'create', 'When Create Button is clicked, user is navigated to the Select Wallet Creation Type page.')
      .click('@home')
      .click('@siriusid')
      .assert.visible('@siriusid_title', 'When Sign In With Sirius ID button is clicked, the Sirius ID pop-up appeared')
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
