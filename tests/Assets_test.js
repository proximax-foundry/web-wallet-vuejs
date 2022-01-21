var name = "Selenium"
var password = "abcd1234"
var supply = "2"
var divisibility = "6"
// var privatekey = "449198BF93D383DD7F9769DD0ED212B8F28D4A5F2CFD3B282685C3707356DA0C"
// var privatekey1 = "449198BF93D383DD7F9769DD0ED212B8F28D4A5F2CFD3B282685C3707356DA0C"
// var privatekey2 = "AD947A8674BBB115DBC7C33351F808D3ED4C8F2DCBFAFA8C68861B3124CA4E26"
var forasset = "694D033164D2E96BF383F071AD0FCE9AE4A0520862F296EF18215D99BDC5F857"

module.exports = {

    "Assets_test": function (browser) {

        var create = browser.page.Createwallet()
        var signin = browser.page.Signin()
        var asset = browser.page.Assets()

        // create wallet
        create
            .navigate()
            .navigate_createpkwallet(browser.launch_url)
            .create_pkwallet(browser.launch_url, forasset, name, password)

        // sign in
        signin
            .signin_dashboard(browser.launch_url, password)
        
        // asset test
        asset
            .navigation_assets(browser.launch_url)
            .empty_password()
            // .create_asset(supply, divisibility, password)

    }

}