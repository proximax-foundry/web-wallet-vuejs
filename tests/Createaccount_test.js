var name = "Selenium"
var name2 = "Selenium2"
var password = "abcd1234"
var password2 = "abcd12345"
var privatekey = '9FB0AC3CE2E5A1A8092EB7B73861F38DFE07768E6AD421CE14AE79B3203D862A'
var privatekey1 = '9FB0AC3CE2E5A1A8092EB7B73861F38DFE07768E6AD421CE14AE79B3203D862'


module.exports = {

    "Create-account_test": function (browser) {

        var create = browser.page.Createwallet();
        var signin = browser.page.Signin();
        var account = browser.page.Createaccount();

        // create wallet
        create
            .navigate()
            .navigate_createnewwallet(browser.launch_url)
            .create_wallet(browser.launch_url, name, password)

        // sign in
        signin
            .signin_dashboard(browser.launch_url, password)

        // create new account
        account
            .navigate_createaccount(browser.launch_url)
            .navigate_createnewaccount(browser.launch_url)
            .empty_inputaccount()
            .wrong_walletpassword(name, password2)
            .eye_icon()
            .create_account(name, password)
            .existing_name(name, password)
            
    },

    "Create-account-frompk_test": function (browser) {

        var create = browser.page.Createwallet();
        var signin = browser.page.Signin();
        var account = browser.page.Createaccount();

        // create wallet
        create
            .navigate()
            .navigate_createnewwallet(browser.launch_url)
            .create_wallet(browser.launch_url, name, password)

        // sign in
        signin
            .signin_dashboard(browser.launch_url, password)

        // create new account from private key
        account
            .navigate_createaccount(browser.launch_url)
            .navigate_createnewfrompk(browser.launch_url)
            .empty_inputaccount_pk()
            .wrong_walletpassword_pk(privatekey, name, password2)
            .eye_icon_pk()
            .invalid_privatekey(privatekey1)
            .create_account_pk(privatekey, name, password)
            .existing_name_pk(privatekey, name, password)
            .existing_privatekey(privatekey, name2, password)

    }


}