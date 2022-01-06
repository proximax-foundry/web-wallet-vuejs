var name = "Selenium"
var password1 = "abcd1234"
var password2 = "abcd12345"
var privatekey = "0ACDDBF848D081613E665144FF48181EBE4E009D27F33C53AC32180D73A6C667"
var invalidaddress = "VBE2LN-QYZS2P-ODPWSO-CARZXJ-3I3RUI-IK5PX5-PMO"
var status = "INVALID"
var amount = "1000"
var message = "this is 1000 xpx"
var xpx = "27.450000"

module.exports = {

    "Namespace_test": function (browser) {

        var create = browser.page.Createwallet()
        var signin = browser.page.Signin()
        var network = browser.page.Topupxpx()
        var transfer = browser.page.Transfer()
        var account = browser.page.Createaccount()

        // change to testnet 1
        network 
            .navigate()
            .change_network()

        // create wallet
        create
            .navigate_createpkwallet(browser.launch_url)
            .create_pkwallet(browser.launch_url, privatekey, name, password1)

        // sign in
        signin
            .signin_dashboard(browser.launch_url, password1)
        
        account
            .navigate_createaccount(browser.launch_url)
            .navigate_createnewaccount(browser.launch_url)
            .create_account(name, password1)
        
        // transfer
        transfer
            .navigation_transfer(browser.launch_url)
            .sender_account()
            .invalid_address(invalidaddress, status)
            .contact_dropdown()
            .empty_password()
            .create_transfer(amount, message, xpx, password1, password2)

    }

}