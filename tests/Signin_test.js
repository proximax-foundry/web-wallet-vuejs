var name = 'Selenium'
var password = "abcd1234";
var password2 = 'abcd12345'
module.exports = {
    "Sign In": browser => {
        var create = browser.page.Createwallet();
        var signin = browser.page.Signin();
        //create an account
        create
            .navigate()
            .createwallet(name,password)
        //signin test
        signin
           .emptyfields_validation()
           .wrongpassword_validation(password2)
           .signinto_dashboard(browser.launch_url,password)
    },
    
}