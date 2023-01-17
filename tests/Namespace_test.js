var name = "Selenium"
var shortname = "s"
var namespace_input = "justatesting"
var password = "abcd12345678"
var password2 = "12345678"
var privatekey = "0ACDDBF848D081613E665144FF48181EBE4E009D27F33C53AC32180D73A6C667"        // asset acc pk

module.exports = {

    "Namespace_test": function (browser) {

        var create = browser.page.Createwallet();
        var signin = browser.page.Signin();
        var namespace = browser.page.Namespace();

        browser.fullscreenWindow(function(result) {
            console.log(result);
        });

        // create wallet
        create
            .navigate()
            .change_network()
            .navigate_createpkwallet(browser.launch_url)
            .create_pkwallet(privatekey, name, password)

        // sign in
        signin
            .signin_dashboard(browser.launch_url, password)
        
        // namespace test
        namespace
            .navigate_namespace(browser.launch_url)
            .invalid_name(shortname)
            .empty_password(namespace_input)
            //.create_namespace(namespace_input, password)
            //.edit_namespace(password, password2)
            //.link_namespace()

    },



}