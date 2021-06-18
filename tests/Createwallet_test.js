var name = 'selenium'
var password = "abcd1234";
var password2 = 'abcd12345'

module.exports = {
    "Create-wallet_test": (browser) => {
        var create = browser.page.Createwallet();
        create
            .navigate()
            .navigate_createnewwallet(browser.launch_url)
            .emptyfield_validation()
            .clearbutton_validation(name,password)
            .differentpassword_validation(name,password,password2)
            .create_wallet(browser.launch_url,name,password)
            .existingname_validation(name,password)
            .masked_password()
            
    }
}