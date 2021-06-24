var password = "abcd1234";
var password2 = "abcd12345"
var name = "Selenium";
var privatekey = '7c226bf53c10ceb7e0dd7423cd378bbe0e78275756f4ccb8e6f70fa5d46e309b'
var privatekey2 = 'asdsadasdasdasdasfsgsdaasdasdasdsadsadsafasdfdsfsadsadsadasdddbs'
module.exports = {
    "Import_account_test":  (browser) => {
        var create = browser.page.Createwallet();
        var signin = browser.page.Signin();
        var account = browser.page.Createaccount();
        //create wallet
        create
            .navigate()
            .createwallet(name,password)
        //signin
        signin
            .signin(password)
        //create new account
        account
            .navigate_createpkaccount(browser.launch_url)
            .emptyfield_validation2()
            .clearbutton_validation2(privatekey,name,password)
            .wrongpassword_validation2(privatekey,name,password2)
            .createsuccessful2(browser.launch_url, privatekey, name, password)
            .existingname_validation2(privatekey, name, password)

    }
}