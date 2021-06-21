var name = 'Selenium'
var password = "abcd1234";
var password2 = 'abcd12345'
var privatekey = '7c226bf53c10ceb7e0dd7423cd378bbe0e78275756f4ccb8e6f70fa5d46e309b'
var privatekey_2 = 'asdsadasdasdasdasfsgsdaasdasdasdsadsadsafasdfdsfsadsadsadasdddbs'
module.exports = {
    "Create-wallet-with-private-key_test": browser => {
        var create = browser.page.Createwallet();
        create
            .navigate()
            .navigate_createpkwallet(browser.launch_url)
            .emptyfield_validation2()
            .differentpassword_validation2(privatekey,name,password,password2)
            .clearbutton_validation2()
            .successful_create(browser.launch_url,privatekey,name,password)
            .existingname_validation2(privatekey, name, password)
            .pk_masked_password()
    }
}