const elements = {

    back: '#app > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > a',
    home_icon: '#app > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > a:nth-child(1) > img',
    namespace: '#app > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(3) > a:nth-child(3)',
    register_namespace: '#app > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > a',
    input_name: '#app > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(4) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > input',
    input_password: '#app > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(8) > div:nth-child(1) > input',
    error_invalidname: '#app > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(4) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1)',
    error_emptypassword: '#app > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(8) > div.error.error-password.text-left.my-2',
    register_button: '#app > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > button',
    select_namespace: '#app > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(3) > div:nth-child(1) > div:nth-child(1)',
    newroot_namespace: '#app > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(3) > div:nth-child(2) > div:nth-child(1) > div:nth-child(2)',
    created_namespace: '#app > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > table:nth-child(1) > tbody:nth-child(2) > tr:nth-child(1) > td:nth-child(2) > span',
    created_namespaceid: '#app > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > table:nth-child(1) > tbody:nth-child(2) > tr:nth-child(1) > td:nth-child(3) > span',
    created_namespacetimestamp: '#app > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > table:nth-child(1) > tbody:nth-child(2) > tr:nth-child(1) > td:nth-child(6) > span',
    account: '#app > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > a:nth-child(1)',

}

const commands = {

    navigate_namespace(browser){
        return this
        .pause(1000)
        .click("@namespace")
        .click("@register_namespace")
        .assert.urlEquals(browser + 'create-namespace', 'User is navigated to create namespace page')

    },

    invalid_name(name){
        return this
        .setValue("@input_name", name)
        .isVisible('@error_invalidname', callback = result => {
            this.assert.equal(result.value, true, "If user enters invalid name in one char, an error is shown")
        })
    },

    empty_password(name){
        return this
        .pause(1000)
        .click("@select_namespace")
        .click("@newroot_namespace")
        .setValue("@input_name", '\ue003')
        .setValue("@input_name", name)
        .click("@input_password")
        .setValue("@input_password", '\ue004')
        .isVisible('@error_emptypassword', callback = result => {
            this.assert.equal(result.value, true, "If wallet password has no input, an error is shown")
        })
        .pause(5000)
    },

    create_namespace(name, password){
        return this
        .pause(1000)
        .click("@back")
        .click("@register_namespace")
        .click("@select_namespace")
        .click("@newroot_namespace")
        .setValue("@input_name", name)
        .setValue("@input_password", password)
        .click("@register_button")
        .pause(3000)
        .click("@account")
        .pause(16000)
        .click("@namespace")
        .assert.containsText('@created_namespace', name, 'Namespace is successfully created.')
        .assert.visible('@created_namespaceid', 'Namespace is successfully created with id')
        .assert.visible('@created_namespacetimestamp', 'Namespace is successfully created with timestamp')

    },

    

}

module.exports = {

    elements: elements,
    commands: commands,
    url: function () {
        return '${this.api.launchUrl}'
    }

}