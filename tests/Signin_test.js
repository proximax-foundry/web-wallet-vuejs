var name = 'Selenium'
var password = "abcd1234"
var password2 = 'abcd12345'
var password3 = 'abcd'

module.exports = {
    "Sign In": browser => {
        var create = browser.page.Createwallet();
        var signin = browser.page.Signin();

        browser.fullscreenWindow(function(result) {
            console.log(result);
        });

        // to create wallet
        create
            .navigate()
            .change_network()
            .navigate_createnewwallet(browser.launch_url)
            .create_wallet(name, password)

        // sign in test
        signin
           .less_password(password3)
           .signin_dashboard(browser.launch_url, password)
           .signout_dashboard()
           .empty_password()
           .wrong_password(password2)
           .eye_icon()

    }
    
}