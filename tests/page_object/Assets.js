const elements = {
    back: 'a.text-blue-primary:nth-child(2)',
    assets_tab: 'a[href="#/assets"]',
    createnew_asset: 'a[href="#/create-asset"]',
    input_password: 'input.w-full',
    error_emptypassword: '.error',
    input_supply: '.supply_input',
    input_divisibility: '.number_input',
    transferable: 'div.mb-5:nth-child(1) > div:nth-child(1) > div:nth-child(1)',
    supply_mutable: 'div.mt-4 > div:nth-child(4) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1)',
    createasset_button: '.mt-3',
    transaction_confirmpopup: 'div.p-toast:nth-child(9) > div:nth-child(1) > div:nth-child(1)',
    asset_id: '.p-datatable-tbody > tr:nth-child(1) > td:nth-child(2) > span:nth-child(1)',
}

const commands = {

    navigation_assets(browser){
        return this
        .pause(3000)
        .click("@assets_tab")
        .assert.urlEquals(browser + 'assets', 'User is navigated to assets page')
        .click("@createnew_asset")
        .assert.urlEquals(browser + 'create-asset', 'User is navigated to create asset page')
    },
    empty_password(){
        return this
        .pause(3000)
        .click("@input_password")
        .setValue("@input_password", '\ue004')
        .isVisible('@error_emptypassword', callback = result => {
            this.assert.equal(result.value, true, "If user does not enter password, an error is shown")
        })
    },

    create_asset(supply, divisibility, password){
        return this
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
        .pause(30000)
        .click("@assets_tab")
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