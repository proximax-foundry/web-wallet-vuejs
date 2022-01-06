const elements = {

    network_dropdown: '#app > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > form > fieldset > div:nth-child(1) > div:nth-child(1)',
    testnet_1: '#app > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > form > fieldset > div:nth-child(2) > div:nth-child(1) > div:nth-child(3)',
    create_wallet: '#app > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(4) > a',
    next: '#app > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > a:nth-child(4)',
    scan_qr: '#app > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(3) > div:nth-child(1) > div:nth-child(3) > div:nth-child(1) > a',
    copy_address: '#app > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(3) > div:nth-child(1) > div:nth-child(2) > img',
    input_testnetaddress: '#form-name',
    send_button: '#fauceApp > div:nth-child(1) > div:nth-child(3) > button',
    account: '#app > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > a:nth-child(1)',
    view_privatekey: '#app > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(4) > div:nth-child(12) > div:nth-child(2) > svg > path',
    input_password: '#app > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(4) > div:nth-child(12) > div:nth-child(2) > div:nth-child(3) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > input',
    confirm_button: '#app > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(4) > div:nth-child(12) > div:nth-child(2) > div:nth-child(3) > div:nth-child(1) > div:nth-child(3)',
    copy_privatekey: '#app > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(4) > div:nth-child(12) > div:nth-child(3) > svg:nth-child(2) > path',

}

const commands = {

    change_network(){
        return this
        .click("@network_dropdown")
        .click("@testnet_1")
        .pause(2000)

    },

    top_up(){
        return this
        .click("@scan_qr")

    },

    copy_address(){
        return this
        .pause(2000)
        .click("@copy_address")
    },

    input_address(){
        return this
        .click("@input_testnetaddress")

    },

    send_xpx(){
        return this
        .pause(2000)
        .click("@send_button")
        .pause(7000)
    },

    waitfor_xpx(){
        return this
        .pause(10000)
    },
    
    copy_privatekey(password){
        return this
        .click("@account")
        .click("@view_privatekey")
        .setValue("@input_password", password)
        .click("@confirm_button")
        .pause(7000)
        .click("@copy_privatekey")
        .pause(7000)

    },

}

module.exports = {

    elements: elements,
    commands: commands,
    url: function () {
        return '${this.api.launchUrl}'
    }

}