module.exports = {
  "Home_test": function(browser) {
    var home = browser.page.Home();
    home
      .navigate()
      .click_headercomponents(browser.launch_url)
      .click_homecomponents(browser.launch_url)
      
  },
};