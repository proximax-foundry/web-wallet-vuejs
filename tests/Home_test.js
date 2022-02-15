var name = "Selenium"
var password = "abcd1234"
var account = "Primary"

module.exports = {

    "Home_test": function(browser) {

      var create = browser.page.Createwallet();
      var signin = browser.page.Signin();
      var home = browser.page.Home();
      
      // create wallet
      create
        .navigate()
        .navigate_createnewwallet(browser.launch_url)
        .create_wallet(name, password)

      // sign in
      signin
        .signin_dashboard(browser.launch_url, password)
      
      // home page 
      home
        .navigate_transfer(browser.launch_url)
        .home(browser.launch_url)
        .navigate_digitalasset(browser.launch_url)
        .home(browser.launch_url)
        .navigate_namespace(browser.launch_url)
        .home(browser.launch_url)
        .navigate_account(browser.launch_url)
        .home(browser.launch_url)
        .click_tabs()
        .home(browser.launch_url)
        .click_headercomponents(browser.launch_url)
        // .delete_wallet(browser.launch_url)

    },
    

  };