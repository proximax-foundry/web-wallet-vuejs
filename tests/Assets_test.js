var name = "Selenium"
var password = "abcd1234"
var supply = "1"
var divisibility = "6"
var forasset = "694D033164D2E96BF383F071AD0FCE9AE4A0520862F296EF18215D99BDC5F857"

module.exports = {

    "Assets_test": function (browser) {

        var create = browser.page.Createwallet();
        var signin = browser.page.Signin();
        var asset = browser.page.Assets();

        browser.fullscreenWindow(function(result) {
            console.log(result);
        });

        // create wallet
        create
            .navigate()
            .change_network()
            .navigate_createpkwallet2(browser.launch_url)
            .create_pkwallet(forasset, name, password)

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