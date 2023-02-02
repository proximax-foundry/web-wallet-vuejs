var name = "Selenium"
var password = "abcd1234"
var privatekey = "E3DAB67D1B350ABEE2E27F86B751CBFD368FA592C6EA6FC93F134CD11E871980"
var address = "0x02Cba56aCd0C24E24B3b9C439246F3ce82edAf84"
var wrpassword = "1234abcd"
var amount = "50"


module.exports = {

    "OutgoingSwap_test": function (browser) {

        var create = browser.page.Createwallet();
        var signin = browser.page.Signin();
        var outswap = browser.page.Swap();

        browser.fullscreenWindow(function(result) {
            console.log(result);
        });

        // create wallet
        create
            .navigate()
            .change_network()
            .navigate_createpkwallet2(browser.launch_url)
            .create_pkwallet(privatekey, name, password)

        // sign in
        signin
            .signin_dashboard(browser.launch_url, password)

        outswap
            .navigate_swap(browser.launch_url)
            .navigate_outswap(browser.launch_url)
            .select_account()
            .empty_input()
            .wrong_password(address, amount, wrpassword)
            .create_swap(password, browser.launch_url)
            .navigate_outswap(browser.launch_url)
            .select_account()
            .later_test(browser.launch_url)

    }
}