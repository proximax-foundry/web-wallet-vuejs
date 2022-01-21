const elements = {

    back: 'a.text-blue-primary:nth-child(2)',
    home_icon: 'div.text-center.w-full.h-7 > a[href="#/dashboard"] > img',
    namespace: 'a[href="#/namespace"]',
    register_namespace: 'a[href="#/create-namespace"]',
    input_name: '.text_input',
    input_password: 'input.w-full',
    error_invalidname: '.error',
    register_button: '.mt-3',
    select_namespace: 'div.border.ml-auto.mr-auto.py-3.px-2.rounded-md.w-full.h-14',
    newroot_namespace: 'div.px-2:nth-child(2)',
    error_emptypassword: '.error',
    created_namespace: '.p-datatable-tbody > tr:nth-child(1) > td:nth-child(2) > span:nth-child(1)',
    created_namespaceid: 'span.uppercase',
    created_namespacetimestamp: '.text-yellow-500',

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
        .pause(1000)
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
        .pause(60000)
        .click("@home_icon")
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