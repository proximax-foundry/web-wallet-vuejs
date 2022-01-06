var name = "Selenium"
var password = "abcd1234"
var supply = "2"
var divisibility = "6"
// var privatekey = "449198BF93D383DD7F9769DD0ED212B8F28D4A5F2CFD3B282685C3707356DA0C"
// var privatekey1 = "449198BF93D383DD7F9769DD0ED212B8F28D4A5F2CFD3B282685C3707356DA0C"
// var privatekey2 = "AD947A8674BBB115DBC7C33351F808D3ED4C8F2DCBFAFA8C68861B3124CA4E26"
// var privatekey = "D1D60FD83033CB99886A31AEBF92BF82AB283DC2AFD65817B957AB13E6B3D3E8" // testing
var privatekey = "0ACDDBF848D081613E665144FF48181EBE4E009D27F33C53AC32180D73A6C667" // new account

module.exports = {

    "Namespace_test": function (browser) {

        var create = browser.page.Createwallet()
        var signin = browser.page.Signin()
        var network = browser.page.Topupxpx()
        var asset = browser.page.Assets()

        // change to testnet 1
        network 
            .navigate()
            .change_network()

        // create wallet
        create
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