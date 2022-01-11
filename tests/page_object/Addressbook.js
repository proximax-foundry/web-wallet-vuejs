const elements = {

    address_book: '#app > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(4) > a:nth-child(4)',
    addnew_button: '#app > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > a',
    list_tab: '#app > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1)',
    import_tab: '#app > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > a:nth-child(2)',
    export_tab: '#app > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > a:nth-child(3)',
    input_name: '#app > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > input',
    input_address: '#app > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > input',
    input_group: '#multiselect > div:nth-child(1)',
    inputgroup_value: '#multiselect > div:nth-child(1) > div:nth-child(1)',
    save_address: '#app > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > button',
    custom_button: '#multiselect > div:nth-child(2) > span:nth-child(7) > span',
    custom_popup: '#app > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1)',
    input_customgroup: '#app > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > input',
    addcustom_button: '#app > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > button',
    add_addresssuccessful: 'body > div:nth-child(9) > div:nth-child(1) > div:nth-child(1)',
    addressname_value: '#app > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > table > tbody > tr > td:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1)',
    address_value: '#app > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > table > tbody > tr > td:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)',
    error_emptyname: '#app > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1)',
    error_invalidaddress: '#app > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1)',
    error_duplicateaddress: '#app > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div.error.error_box.mb-5',
    ellipsis_icon: '#app > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > table > tbody > tr > td:nth-child(2) > div:nth-child(1) > img',
    remove_button: '#app > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > table > tbody > tr > td:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1)',
    removecontact_popup: '#app > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > table > tbody > tr > td:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1)',
    removecontact_button: '#app > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > table > tbody > tr > td:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > fieldset > div:nth-child(1) > button',
    nocontacts_available: '#app > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > table > tbody > tr > td > div:nth-child(2)',
    import_tab: '#app > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > a:nth-child(2)',
    import_button: '#app > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(3) > div:nth-child(1)',
    importaddress_popup: '#app > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(3) > div:nth-child(2) > div:nth-child(1)',
    close_button: '#app > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(3) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > svg > path',
    export_tab: '#app > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > a:nth-child(3)',
    edit_button: '#app > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > table > tbody > tr > td:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > a:nth-child(1)',
    contactupdated_popup: 'body > div:nth-child(9) > div:nth-child(1) > div:nth-child(1)',

}



const commands = {

    navigation_addressbook(browser){
        return this
        .click("@address_book")
        .assert.urlEquals(browser + 'address-book', 'User is navigated to address book page')
    },

    empty_name(address){
        return this
        .click("@addnew_button")
        .setValue("@input_name", "\ue004")
        .setValue("@input_address", address)
        .isVisible('@error_emptyname', callback = (result) => {
            this.assert.equal(result.value, true, 'If name has no input, an error is shown')
        })

    },

    existing_address(name, address){
        return this
        .click("@addnew_button")
        .setValue("@input_name", name)
        .setValue("@input_address", address)
        .click("@save_address")
        .isVisible('@error_duplicateaddress', callback = (result) => {
            this.assert.equal(result.value, true, 'If address already exist in address book, an error is shown')
        })
    },

    edit_contact(name, address, address2){
        return this
        .click("@ellipsis_icon")
        .click("@edit_button")
        .clearValue("@input_name")
        .setValue("@input_name", name)
        .clearValue("@input_address")
        .setValue("@input_address", address)
        .click("@save_address")
        .isVisible('@contactupdated_popup', callback = (result) => {
            this.assert.equal(result.value, true, 'If contact is successfully updated, a notification is shown')
        })
        .pause(1000)
        .click("@ellipsis_icon")
        .click("@edit_button")
        .setValue("@input_name", '\ue003\ue003\ue003\ue003')
        .isVisible('@error_emptyname', callback = (result) => {
            this.assert.equal(result.value, true, 'If name field has no input, an error is shown')
        })
        .clearValue("@input_address")
        .setValue("@input_address", address2)
        .isVisible('@error_invalidaddress', callback = (result) => {
            this.assert.equal(result.value, true, 'If address is invalid, an error is shown')
        })

    },

    invalid_address(address1, address2, address3){
        return this
        .click("@addnew_button")
        .setValue("@input_address", address1)
        .isVisible('@error_invalidaddress', callback = (result) => {
            this.assert.equal(result.value, true, 'If address is invalid, an error is shown')
        })
        .click("@address_book")
        .click("@addnew_button")
        .setValue("@input_address", address2)
        .isVisible('@error_invalidaddress', callback = (result) => {
            this.assert.equal(result.value, true, 'If address is less than required values, an error is shown')
        })
        .click("@address_book")
        .click("@addnew_button")
        .setValue("@input_address", address3)
        .isVisible('@error_invalidaddress', callback = (result) => {
            this.assert.equal(result.value, true, 'If address is more than required values, an error is shown')
        })

    },

    import_contact(){
        return this
        .click("@import_tab")
        .click("@import_button")
        .isVisible('@importaddress_popup', callback = (result) => {
            this.assert.equal(result.value, true, 'If user clicks import, an import address pop up box is shown for user to choose file')
        })
        .pause(1000)
        .click("@close_button")
    },

    remove_contact(emptycontact){
        return this
        .click("@ellipsis_icon")
        .click("@remove_button")
        .isVisible('@removecontact_popup', callback = (result) => {
            this.assert.equal(result.value, true, 'If user clicks remove, a remove contact pop up box is shown')
        })
        .click("@removecontact_button")
        .assert.containsText('@nocontacts_available', emptycontact, 'Nothing to show')
    },

    add_newcontact(browser, name, address, custom){
        return this
        .click("@addnew_button")
        .assert.urlEquals(browser + 'add-contact', 'User is navigated to add contact page')
        .setValue("@input_name", name)
        .setValue("@input_address", address)
        .click("@input_group")
        .click("@custom_button")
        .isVisible('@custom_popup', callback = (result) => {
            this.assert.equal(result.value, true, 'If user clicks custom, add custom group pop up is shown')
        })
        .setValue("@input_customgroup", custom)
        .click("@addcustom_button")
        .assert.containsText('@inputgroup_value', custom, 'Custom group is successfully added.')
        .click("@save_address")
        .isVisible('@add_addresssuccessful', callback = (result) => {
            this.assert.equal(result.value, true, 'If user clicks save address, a notification is shown')
        })
        .assert.urlEquals(browser + 'address-book', 'User is navigated back to address book page')
        .assert.containsText('@addressname_value', name, 'New address name is successfully added.')
        .assert.containsText('@address_value', address, 'New address is successfully added.')

    }


}


module.exports = {

    elements: elements,
    commands: commands,
    url: function () {
        return '${this.api.launchUrl}'
    }

}
