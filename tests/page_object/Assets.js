const elements = {

    back: '#app > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > a',
    assets_tab: '#app > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(3) > a:nth-child(4)',
    createnew_asset: '#app > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > a:nth-child(2)',
    input_password: '#app > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(8) > div:nth-child(1) > input',
    error_emptypassword: '#app > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(8) > div.error.error-password.text-left.my-2',
    input_supply: '#app > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(3) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > input',
    input_divisibility: '#app > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(3) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > input',
    transferable: '#app > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(4) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1)',
    supply_mutable: '#app > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(4) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1)',
    createasset_button: '#app > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > button',
    transaction_confirmpopup: 'body > div:nth-child(9) > div:nth-child(1) > div:nth-child(1)',
    asset_id: '#app > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > table:nth-child(1) > tbody:nth-child(2) > tr:nth-child(1) > td:nth-child(2) > span',

}

const commands = {

    navigation_assets(browser){
        return this
        .pause(5000)
        .click("@assets_tab")
        .assert.urlEquals(browser + 'assets', 'User is navigated to assets page')
        .click("@createnew_asset")
        .assert.urlEquals(browser + 'create-asset', 'User is navigated to create asset page')
    },

    empty_password(){
        return this
        .pause(5000)
        .click("@input_password")
        .setValue("@input_password", '\ue004')
        .isVisible('@error_emptypassword', callback = result => {
            this.assert.equal(result.value, true, "If user does not enter password, an error is shown")
        })
    },

    create_asset(supply, divisibility, password){
        return this
        .pause(5000)
        .click("@back")
        .pause(1000)
        .click("@createnew_asset")
        .click("@input_supply")
        .setValue("@input_supply", supply)
        .click("@input_divisibility")
        .setValue("@input_divisibility", divisibility)
        .click("@transferable")
        .click("@supply_mutable")
        .setValue("@input_password", password)
        .click("@createasset_button")
        .pause(5000)
        .isVisible('@transaction_confirmpopup', callback = result => {
            this.assert.equal(result.value, true, "A notification is shown saying transaction is confirmed after creating asset")
        })
        .pause(10000)
        .assert.visible('@asset_id', 'Asset is successfully created with id')


    },
    

}

module.exports = {

    elements: elements,
    commands: commands,
    url: function () {
        return '${this.api.launchUrl}'
    }

}