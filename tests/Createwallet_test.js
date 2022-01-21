var name = 'selenium'
var password = 'abcd1234'
var password2 = 'abcd12345'
var shortpassword = 'abc'
var longpassword = 'abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijkl'
var privatekey = 'D3AE97B58C1E1A417E11A51232A8FCEDA2137405CC6AEDFDB21F2B088A4F44E0'
var privatekey1 = 'D3AE97B58C1E1A417E11A51232A8FCEDA2137405CC6AEDFDB21F2B088A4F44E'

module.exports = {
    
    "Create-wallet_test": (browser) => {
        var create = browser.page.Createwallet();
        create
            .navigate()
            .navigate_createnewwallet(browser.launch_url)
            .emptyinput_wallet()
            .different_password(name, password, password2)
            .navigate_mainpage()
            .navigate_createnewwallet(browser.launch_url)
            .password_length(name, shortpassword)
            .navigate_mainpage()
            .navigate_createnewwallet(browser.launch_url)
            .create_wallet(browser.launch_url, name, password)
            .existing_name(name, password)
            .eye_icon()
    },

    "Create-pkwallet_test": (browser) => {
        var create = browser.page.Createwallet();
        create
            .navigate()
            .navigate_createpkwallet(browser.launch_url)
            .emptyinput_pkwallet()
            .different_password_pk(privatekey, name, password, password2)
            .navigate_mainpage()
            .navigate_createpkwallet(browser.launch_url)
            .password_length_pk(privatekey, name, shortpassword)
            .navigate_mainpage()
            .navigate_createpkwallet(browser.launch_url)
            .invalid_privatekey(privatekey1)
            .navigate_mainpage()
            .navigate_createpkwallet(browser.launch_url)
            .create_pkwallet(browser.launch_url, privatekey, name, password)
            .existing_name_pk(privatekey, name, password)
            .eye_icon_pk()
    },

    "Create-backupwallet_test": (browser) => {
        var create = browser.page.Createwallet();
        create
            .navigate()
            .navigate_createbackupwallet(browser.launch_url)
    }

}