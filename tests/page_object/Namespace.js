const elements = {

    back: 'a.content-center.text-white:nth-child(1)',
    defaultAcc_icon: 'div.cursor-pointer:nth-child(1) > a.flex:nth-child(1) > div.mr-2:nth-child(1) > img',
    namespace: 'div.flex > a.w-24:nth-child(3)',
    register_namespace: 'a[href="#/create-namespace"]',
    input_name: '.text_input',
    input_password: 'input.w-full',
    error_invalidname: '.error',
    register_button: '.mt-3',
    select_namespace: 'div.border.ml-auto.mr-auto.py-3.px-2.rounded-md.w-full.h-14',
    newroot_namespace: 'div.px-2:nth-child(2)',
    error_emptypassword: '.error',
    created_namespace: '.p-datatable-tbody > tr:nth-child(1) > td:nth-child(2)',
    created_namespaceid: 'div.uppercase',
    ellipsis: 'img.h-6:nth-child(1)',
    namespace_tab: '.router-link-active',
    namespace_link: '#multiselect > div.multiselect-input',
    new_namespace: '#multiselect > div.multiselect-options > span.multiselect-option.is-pointed > span:nth-child(1)',
    editnamespace_icon : 'table > tbody > tr > td:nth-child(6) > img',
    extend_duration: 'table > tbody > tr > td:nth-child(6) > div:nth-child(2) > div:nth-child(1) > a:nth-child(1)',
    wrongpassword_error: '.error_box',
    invalid_password: '.error-password',
    extend_cancel: 'a[href="#/dashboard"].border-b-2',
    password_input: 'input.w-full.text-placeholder.text-left.ml-2',
    extend_button: 'button.w-full.blue-btn',
    extend_notification: 'div.p-toast:nth-child(12) > div:nth-child(1) > div:nth-child(1)',

}

const commands = {

    navigate_namespace(browser){
        return this
        .pause(10000)
        .click("@register_namespace")
        .assert.urlEquals(browser + 'create-namespace', 'User is navigated to create namespace page')

    },

    invalid_name(name){
        return this
        .click("@select_namespace")
        .click("@newroot_namespace")
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
        .pause(3000)
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
        .click("@defaultAcc_icon")
        .click("@namespace")
        .assert.textContains('@created_namespace', name, 'Namespace is successfully created.')
        .assert.visible('@created_namespaceid', 'Namespace is successfully created with id')
    },

    edit_namespace(password, password2){
        return this
        .click("@defaultAcc_icon")
        .click("@namespace")
        .click('@editnamespace_icon')
        .click('@extend_duration')
        .assert.urlContains('extend-namespace', 'If user clicks on extend duration, user is directed to extend duration page')
        .setValue('@password_input', '\ue004')
        .isVisible('@invalid_password', callback = result => {
            this.assert.equal(result.value, true, "If user enter an invalid password, an error is shown and extend button is disabled")
        })
        .setValue('@password_input', password2)
        .click('@extend_button')
        .isVisible('@wrongpassword_error', callback = result => {
            this.assert.equal(result.value, true, "If user enter a wrong password, an error is shown")
        })
        .click('@extend_cancel')
        .assert.urlContains('dashboard', "If user clicks on cancel button, user is directed back to dashboard home page")
        .click("@defaultAcc_icon")
        .click("@namespace")
        .click('@editnamespace_icon')
        .click('@extend_duration')
        .setValue('@password_input', password)
        .click('@extend_button')
        .isVisible('@extend_notification', callback = result => {
            this.assert.equal(result.value, true, "If user clicks on extend button with correct input, a notification is shown")
        })
    },

    link_namespace(){
        return this
        .click("@ellipsis")
        .pause(3000)
        .click("@namespace_tab")
        .pause(5000)
        .click("@namespace_link")
        .click("@new_namespace")

    },

    

}

module.exports = {

    elements: elements,
    commands: commands,
    url: function () {
        return '${this.api.launchUrl}'
    }

}