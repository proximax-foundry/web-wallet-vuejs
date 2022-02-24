var name = "Selenium"
var password1 = "abcd1234"
var password2 = "abcd12345"
var privatekey = "43C2BAD9E1768A57D8D432CDCE1B69DB491090D0F84D9239AD1ACE164D545145"
var amount = "1000"
var message = "this is 1000 xpx"
var xpx = "27.450000"
var publickey = "69A95CE3F72B5175E4D16D9ED4CC11778A26D3908A2A0FBAF3F636C80B9F6E1"

module.exports = {

    "Multisig_test": function (browser) {

        var create = browser.page.Createwallet()
        var signin = browser.page.Signin()
        var multisig = browser.page.Multisig()
        var account = browser.page.Createaccount()

        // create wallet
        create
            .navigate()
            .change_network()
            .navigate_createpkwallet(browser.launch_url)
            .create_pkwallet(privatekey, name, password1)

        // sign in
        signin
            .signin_dashboard(browser.launch_url, password1)
        
        // create new account in wallet
        account
            .navigate_createaccount(browser.launch_url)
            .navigate_createnewaccount(browser.launch_url)
            .create_account(name, password1)

        // to transfer 
        // transfer
        //     .navigation_transfer(browser.launch_url)
        //     .create_transfer(amount, message, xpx, password1, password2)

        // multisig test
        multisig
            .navigation_multisig(browser.launch_url)
            .invalid_publickey(publickey)
            .contact_dropdown()
            .add_cosignatory()
            .scheme_validation()
            .invalid_password(password2)
            .empty_password(browser.launch_url)            

    },

    "Insufficientxpx_test": function (browser) {

        var create = browser.page.Createwallet()
        var signin = browser.page.Signin()
        var multisig = browser.page.Multisig()

        // create wallet
        create
            .navigate()
            .change_network()
            .navigate_createnewwallet(browser.launch_url)
            .create_wallet(name, password1)

        // sign in
        signin
            .signin_dashboard(browser.launch_url, password1)

        // multisig test
        multisig
            .navigation_multisig(browser.launch_url)
            .insufficient_xpx()

    },


}