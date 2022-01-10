var name = "Selenium"
var password = "abcd1234"
var supply = "2"
var divisibility = "6"
var privatekey = "0ACDDBF848D081613E665144FF48181EBE4E009D27F33C53AC32180D73A6C667" // new account

module.exports = {

    "Namespace_test": function (browser) {

        var create = browser.page.Createwallet()
        var signin = browser.page.Signin()
        var asset = browser.page.Assets()

        // create wallet
        create
            .navigate()
            .navigate_createpkwallet(browser.launch_url)
            .create_pkwallet(browser.launch_url, privatekey, name, password)

        // sign in
        signin
            .signin_dashboard(browser.launch_url, password)
        
        // asset test
        asset
            .navigation_assets(browser.launch_url)
            .empty_password()
            .create_asset(supply, divisibility, password)

    }

}