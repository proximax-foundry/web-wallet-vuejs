var name = "Selenium"
var password1 = "abcd1234"
var password2 = "abcd12345"
var privatekey = "43C2BAD9E1768A57D8D432CDCE1B69DB491090D0F84D9239AD1ACE164D545145"
var privatekey2 = "1A752B9514FBF5EABACB7C8EA78F61A4D44F693287DDF8428C8C787F59B46D39"
var privatekey3 = "8831759CFB5835B3F976EB5E34FE185B278A62805383C240593DF4B84A10E410"
var privatekey4 = "8633544C6A328D14683D4D7658BA766D14256CEF6202C4BC5357F402F061EA3C"
var amount = "1000"
var message = "this is 1000 xpx"
var xpx = "27.450000"
var publickey = "69A95CE3F72B5175E4D16D9ED4CC11778A26D3908A2A0FBAF3F636C80B9F6E1"

module.exports = {

    "Multisig_test": function (browser) {

        var create = browser.page.Createwallet();
        var signin = browser.page.Signin();
        var multisig = browser.page.Multisig();
        var account = browser.page.Createaccount();

        browser.fullscreenWindow(function(result) {
            console.log(result);
        });

        // create wallet
        create
            .navigate()
            .change_network()
            .navigate_createpkwallet2(browser.launch_url)
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
            .end()          

    },

    "Insufficientxpx_test": function (browser) {

        var create = browser.page.Createwallet()
        var signin = browser.page.Signin()
        var multisig = browser.page.Multisig()

        browser.fullscreenWindow(function(result) {
            console.log(result);
        });

        // create wallet
        create
            .navigate()
            .change_network()
            .navigate_createpkwallet2(browser.launch_url)
            .create_pkwallet(privatekey2, name, password1)

        // sign in
        signin
            .signin_dashboard(browser.launch_url, password1)

        // multisig test
        multisig
            .navigation_multisig_2(browser.launch_url)
            .insufficient_xpx()
            .end()

    },

    "editMultisig_test": function (browser) {

        var create = browser.page.Createwallet();
        var signin = browser.page.Signin();
        var multisig = browser.page.Multisig();
        var account = browser.page.Createaccount();

        browser.fullscreenWindow(function(result) {
            console.log(result);
        });

        // create wallet
        create
            .navigate()
            .change_network()
            .navigate_createpkwallet2(browser.launch_url)
            .create_pkwallet(privatekey3, name, password1)

        // sign in
        signin
            .signin_dashboard(browser.launch_url, password1)

        // create new account in wallet
         account
             .navigate_createaccount(browser.launch_url)
             .navigate_createnewfrompk(browser.launch_url)
             .create_account_pk(privatekey4, name, password1)

        // edit multisig
        multisig
            .navigation_multisig_3(browser.launch_url)
            .remove_test()
            .invalid_publickey2()
            .contact_dropdown2()
            .scheme_validation()
            .invalid_password(password2)
            .empty_password(browser.launch_url)
            .schema_test(browser.launch_url)
    }


}