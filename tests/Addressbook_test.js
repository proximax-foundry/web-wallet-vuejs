var address = "VBOWIG-3YW43I-OK2GAG-26AHFX-FLAHP7-IQVAYF-63ZC"
var address2 ='aaaaaa-aaaaaa-aaaaaa-aaaaaa-aaaaaa-aaaaaa-aaaa'
var address3 = 'VBOWIG-3YW43I-OK2GAG-26AHFX-FLAHP7-IQVAYF-63Z'
var address4 = 'VBOWIG-3YW43I-OK2GAG-26AHFX-FLAHP7-IQVAYF-63ZCC'
var name = "Selenium"
var editname = "Ruby"
var editaddress = "VCBVVDS2FN5JP7AEXUHBTI7JMMLTTQKYBMBBMSHU"
var addressname = "Sully"
var password = "abcd1234"
var custom = "Father"
var emptycontact = "Nothing to show"


module.exports = {

    "AddressBook_test": function (browser) {

        var create = browser.page.Createwallet();
        var signin = browser.page.Signin();
        var addressbook = browser.page.Addressbook();

        browser.fullscreenWindow(function(result) {
            console.log(result);
        });

        // create wallet
        create
            .navigate()
            .change_network()
            .navigate_createnewwallet(browser.launch_url)
            .create_wallet(name, password)

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