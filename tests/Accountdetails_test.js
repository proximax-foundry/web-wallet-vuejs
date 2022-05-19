var name = "Selenium"
var password = "abcd1234"
var password2 = 'abcd12345'


module.exports = {

    "Account-Details_test": function (browser) {

        var create = browser.page.Createwallet();
        var signin = browser.page.Signin();
        var account = browser.page.Accountdetails();

        browser.fullscreenWindow(function(result) {
            console.log(result);
        });
          
        // create wallet
        create
            .navigate()
            .change_network()
            .navigate_createnewwallet(browser.launch_url)
            .create_wallet(name, password)

        // sign in
        signin
            .signin_dashboard(browser.launch_url, password)

        // account details
        account
            .navigate_accountdetails()
            .empty_input()
            .edit_accountname(name)
            .existing_name(name)
            .show_privatekey(password, password2)
            .copy_instances()

    },

    // to test delete account
    "Account-details_test2": function (browser) {

        var create = browser.page.Createwallet();
        var createaccount = browser.page.Createaccount();
        var signin = browser.page.Signin();
        var account = browser.page.Accountdetails();

        browser.fullscreenWindow(function(result) {
            console.log(result);
        });

        // create wallet
        create
            .navigate()
            .change_network()
            .navigate_createnewwallet(browser.launch_url)
            .create_wallet(name, password)

        // sign in
        signin
            .signin_dashboard(browser.launch_url, password)

        // create new account
        createaccount
            .navigate_createaccount(browser.launch_url)
            .navigate_createnewaccount(browser.launch_url)
            .create_account(name, password)

        // account details
        account
            .navigate_accountdetails()
            .download_walletpaper(password, password2)

    }


}