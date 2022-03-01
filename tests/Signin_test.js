var name = 'Selenium'
var password = "abcd1234"
var password2 = 'abcd12345'

module.exports = {
    "Sign In": browser => {
        var create = browser.page.Createwallet();
        var signin = browser.page.Signin();

        // to create wallet
        create
            .navigate()
            .change_network()
            .navigate_createnewwallet(browser.launch_url)
            .create_wallet(name, password)

        // sign in test
        signin
           .empty_password()
           .signin_dashboard(browser.launch_url, password)
           .signout_dashboard()
           .wrong_password(password2)
           .eye_icon()

    }
    
}