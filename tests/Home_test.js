var name = "Selenium"
var password = "abcd1234"
var account = "Primary"
var name2 = "Selenium2"
var labelname = "TestingLabel"

module.exports = {

    "Home_test": function(browser) {

      var create = browser.page.Createwallet();
      var signin = browser.page.Signin();
      var home = browser.page.Home();

      browser.fullscreenWindow(function(result) {
        console.log(result);
    });
      
      // create wallet
      create
        .navigate()
        .change_network()
        .navigate_createnewwallet(browser.launch_url)
        .create_wallet(name, password)
        .navigate_createnewwallet(browser.launch_url)
        .create_wallet(name2, password)

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
        .home(browser.launch_url)
        .navigation_beginner()
        .gettingstarted_tab()
        .siriuschain_tab()
        .namespaceAns_tab()
        .assetAns_tab()
        .navigation_notification(browser.launch_url)
        .navigation_settings(browser.launch_url)
        .navigation_swap(browser.launch_url)
        .home(browser.launch_url)
        .scanQR_code()
        .navigation_accounts(browser.launch_url)
        .copy_instancesatviewall()
        .navigation_createnewaccount(browser.launch_url)
        .navigation_accounts(browser.launch_url)
        .label_test(browser.launch_url, labelname)
        .navigate_accountdetails()
        .delete_wallet(browser.launch_url, password)

    },
    

  };