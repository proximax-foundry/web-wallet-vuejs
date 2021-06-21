var password = "abcd1234";
var password2 = 'abcd12345'
var name = "Selenium";
module.exports = {
    "Account-Details_test": function (browser) {
        var create = browser.page.Createwallet();
        var signin = browser.page.Signin();
        var account = browser.page.Accountdetails();
        //create wallet
        create
            .navigate()
            .createwallet(name,password)
        //signin
        signin
            .signin(password)
        //account details
        account
        .navigate_accountdetails(browser.launch_url)
        .edit_accountname(name)
        .show_privatekey(password,password2)

    }
}