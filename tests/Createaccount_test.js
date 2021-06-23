var password = "abcd1234";
var password2 = "abcd12345"
var name = "Selenium";
module.exports = {
    "Create-account_test": function (browser) {
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
            .navigate_createnewaccount(browser.launch_url)
            .emptyfield_validation()
            .clearbutton_validation(name,password)
            .wrongpassword_validation(name,password2)
            .createsuccessful(browser.launch_url,name,password)
            .existingname_validation(name,password)
    }
}