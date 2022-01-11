var address = "XANRRV-JWFLWR-4LITVY-JQG6YT-HHZNJ4-QGPY6F-V7IS"
var address2 ='aaaaaa-aaaaaa-aaaaaa-aaaaaa-aaaaaa-aaaaaa-aaaa'
var address3 = 'XANRRV-JWFLWR-4LITVY-JQG6YT-HHZNJ4-QGPY6F-V7I'
var address4 = 'XANRRV-JWFLWR-4LITVY-JQG6YT-HHZNJ4-QGPY6F-V7ISS'
var name = "Selenium"
var editname = "Ruby"
var editaddress = "XCDZKB-7KRER7-OME7B2-DEA3KZ-4RBYKV-IU2C6Q-ZTJC"
var addressname = "Sully"
var password = "abcd1234"
var custom = "Father"
var emptycontact = "Nothing to show"


module.exports = {

    "AddressBook_test": function (browser) {

        var create = browser.page.Createwallet()
        var signin = browser.page.Signin()
        var addressbook = browser.page.Addressbook()

        // create wallet
        create
            .navigate()
            .navigate_createnewwallet(browser.launch_url)
            .create_wallet(browser.launch_url, name, password)

        // sign in
        signin
            .signin_dashboard(browser.launch_url, password)
        
        // address book test
        addressbook
            .navigation_addressbook(browser.launch_url)
            .add_newcontact(browser.launch_url, addressname, address, custom)
            .existing_address(name, address)
            .navigation_addressbook(browser.launch_url)
            .edit_contact(editname, editaddress, address3)
            .navigation_addressbook(browser.launch_url)
            .remove_contact(emptycontact)
            .empty_name(address)
            .navigation_addressbook(browser.launch_url)
            .invalid_address(address2, address3, address4)
            .import_contact()

    }

}