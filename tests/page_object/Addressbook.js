elements = {
    services: '.relative > nav > a:nth-child(4)',
    addressbook_dropdown: 'div.p-3:nth-child(4) > div:nth-child(4) > div:nth-child(1) > button:nth-child(1) > svg:nth-child(1) > path:nth-child(1)',
    addcontacts: 'div.p-3:nth-child(4) > div:nth-child(4) > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > a:nth-child(1)',
    input_name: 'fieldset.w-full > div:nth-child(1) > div:nth-child(1) > input:nth-child(2)',
    input_address: 'fieldset.w-full > div:nth-child(2) > div:nth-child(1) > input:nth-child(2)',
    emptyname_validation: 'fieldset.w-full > div:nth-child(1) > div:nth-child(2) > div:nth-child(1)',
    input_address: 'fieldset.w-full > div:nth-child(2) > div:nth-child(1) > input:nth-child(2)',
    emptyaddress_validation: 'fieldset.w-full > div:nth-child(2) > div:nth-child(2) > div:nth-child(1)',
    clear: 'button.default-btn:nth-child(1)',
    invalidaddress_validation:'fieldset.w-full > div:nth-child(2) > div:nth-child(2) > div:nth-child(1)',
    save: 'button.default-btn:nth-child(2)'
    
}
commands = [{
    navigate_addcontacts(browser) {
        return this
            .click('@services')
            .click('@addressbook_dropdown')
            .assert.urlEquals(browser + 'services', 'User is navigated to the services page')
            .click('@addcontacts')
            .assert.urlEquals(browser + 'add-contacts', 'User is navigated to the add contacts page')
    },
    emptyfield_validation() {
        return this
            .setValue('@input_name', '\ue004')
            .assert.elementPresent('@emptyname_validation', 'When name field is empty, error is shown')
            .setValue('@input_address', '\ue004')
            .assert.elementPresent('@emptyaddress_validation', 'When address field is empty, error is shown')
    },
    clearbutton_validation(name, address) {
        return this
            .setValue('@input_name', name)
            .setValue('@input_address', address )
            .click('@clear')
            .getValue('@input_name', callback = result => {
                this.assert.equal(result.value, '', 'When clear is clicked, the name field is cleared')
            })
            .getValue('@input_address', callback = result => {
                this.assert.equal(result.value, '', 'When clear is clicked, the address field is cleared')
            })
           
    },
    incorrectaddress_validation(name,address2){
        return this
        .setValue('@input_name', name)
        .setValue('@input_address', address2)
        .assert.elementPresent('@emptyaddress_validation', 'When address is invalid, error is shown')
    },
    save_address(browser,name,address){
        return this
        .click('@clear')
        .setValue('@input_name', name)
        .setValue('@input_address', address)
        .click('@save')
        .assert.urlEquals(browser+ 'address-book','When save is clicked, user is navigated to address book page')
    }
}]

module.exports = {
    elements: elements,
    commands: commands,
    url: function () {
        return '${this.api.launchUrl}'
    }

}
