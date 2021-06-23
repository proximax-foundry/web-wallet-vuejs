var address = "XANRRV-JWFLWR-4LITVY-JQG6YT-HHZNJ4-QGPY6F-V7IS";
var address2 ='aaaaaa-aaaaaa-aaaaaa-aaaaaa-aaaaaa-aaaaaa-aaaa'
var name = "Selenium";
var password = "abcd1234";
module.exports = {
    "AddressBook_test": function (browser) {
        var create = browser.page.Createwallet();
        var signin = browser.page.Signin();
        var addressbook = browser.page.Addressbook();
        //create wallet
        create
            .navigate()
            .createwallet(name,password)
        //signin
        signin
            .signin(password)
        addressbook
            .navigate_addcontacts(browser.launch_url)
            .emptyfield_validation()
            .clearbutton_validation(name, address)
            .incorrectaddress_validation(name,address2)
            .save_address(browser.launch_url,name,address)

    }
}