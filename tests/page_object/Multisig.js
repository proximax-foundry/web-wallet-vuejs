const elements = {

    account_ellipsis: 'img.h-6:nth-child(1)',
    multisig_selection: 'a.w-18:nth-child(5)',
    managecosign_button: '.blue-btn', 
    addcosign_button: 'button.pl-6',
    input_publickey: 'div.flex.flex-col.gap-2 > div:nth-child(1) > div:nth-child(1) > div:nth-child(3) > div:nth-child(1) > input',
    input_publickey2: 'div.inline-block.flex-grow.overflow-hidden > div > div > div > div.border-2.border-t-0.lg:grid.lg:grid-cols-3 > div.lg:col-span-2.py-6.pr-6 > div.flex.flex-col.gap-2.mt-2 > div > div > div.w-7/12.mr-2 > div.bg-white.py-2.border > input',
    publickey: '.pb-1 > path:nth-child(2)',
    error_invalidpublickey: '.error',
    select_contact: 'div.border:nth-child(5)',
    select_contact2: 'div.border:nth-child(4) > svg.fa-id-card-alt',
    contact_list: 'div.bg-gray-100:nth-child(1)',
    reduce_txnapproval: 'div.flex.gap-2.pl-6 > div:nth-child(1) > div:nth-child(2) > button:nth-child(1)',
    add_txnapproval: 'div.flex.gap-2.pl-6 > div:nth-child(1) > div:nth-child(2) > button:nth-child(3)',
    reduce_dltapproval: 'div.flex.gap-2.pl-6 > div:nth-child(2) > div:nth-child(2) > button:nth-child(1)',
    add_dltapproval: 'div.flex.gap-2.pl-6 > div:nth-child(2) > div:nth-child(2) > button:nth-child(3)',
    error_invalidapproval: '.error',
    input_password: 'input.text-left',
    error_emptypassword: '.error',
    cancel_button: '.content-center',
    updatecosign_button: 'button.w-full',
    error_invalidpassword: '.error',
    insufficient_amount: '.flex-cols > div:nth-child(1)',
    trash_icon: 'div.flex > img.w-4.h-4.text-gray-500.cursor-pointer.mt-3.mx-1',
    schema: 'a.border-2.border-blue-primary.p-1.mb-3.w-16.text-blue-primary.text-xs.text-center.font-semibold',
    vertical_button: 'div.ml-2.mr-2.mt-5 > input[type=radio]:nth-child(6)',
    vertical_tree: 'div.overflow-auto.w-full.border-2 > div.org-tree-container > div.org-tree'

}

const commands = {

    navigation_multisig(browser){
        return this
        .click("@account_ellipsis")
        .waitForElementVisible("@multisig_selection")
        .click("@multisig_selection")
        .assert.urlEquals(browser + 'multisig-settings/VBTSTBLWIZGSDZTFTAPTYYREMYKJCAKMJY6IM4Z5', 'User is navigated to multisig page')
        .click("@managecosign_button")
        .assert.urlEquals(browser + 'convert-account-multisign/VBTSTBLWIZGSDZTFTAPTYYREMYKJCAKMJY6IM4Z5', 'User is navigated to convert account to multisig page')
    
    },

    navigation_multisig_2(browser){
        return this
        .click("@account_ellipsis")
        .waitForElementVisible("@multisig_selection")
        .click("@multisig_selection")
        .assert.urlEquals(browser + 'multisig-settings/VDDZ5HBHL5AALCM3MVHYBCBYTBUDL7OSO4RBHRGZ', 'User is navigated to multisig page')
        .click("@managecosign_button")
        .assert.urlEquals(browser + 'convert-account-multisign/VDDZ5HBHL5AALCM3MVHYBCBYTBUDL7OSO4RBHRGZ', 'User is navigated to convert account to multisig page')
    
    },

    navigation_multisig_3(browser){
        return this
        .click("@account_ellipsis")
        .waitForElementVisible("@multisig_selection")
        .click("@multisig_selection")
        .assert.urlContains(browser + 'multisig-settings', 'User is navigated to multisig page')
        .click("@managecosign_button")
        .assert.urlContains(browser + 'edit-account-multisign', 'User is navigated to edit account multisig page')
    
    },

    add_cosignatory(){
        return this
        .click("@contact_list")
        .pause(3000)
    },

    invalid_password(password){
        return this
        .setValue("@input_password", password)
        .click("@updatecosign_button")
        .isVisible('@error_invalidpassword', callback = result => {
            this.assert.equal(result.value, true, "If user enters invalid password, an error is shown")
        })

    },

    insufficient_xpx(){
        return this
        .pause(1000)
        .isVisible('@insufficient_amount', callback = result => {
            this.assert.equal(result.value, true, "If user has insufficient xpx amount, an error is shown")
        })
    },

    empty_password(browser){
        return this
        .clearValue("@input_password")
        .setValue("@input_password", "\ue004")
        .isVisible('@error_emptypassword', callback = result => {
            this.assert.equal(result.value, true, "If password has no input, an error is shown")
        })
        .click("@cancel_button")
        .assert.urlContains(browser + 'multisig-settings', 'User is navigated back to multisig page')
    },

    scheme_validation(){
        return this
        .click("@reduce_txnapproval")
        .isVisible('@error_invalidapproval', callback = result => {
            this.assert.equal(result.value, true, "If number of cosignatories for transaction approval is less than 1, an error is shown")
        })
        .click("@add_txnapproval")
        .click("@reduce_dltapproval")
        .isVisible('@error_invalidapproval', callback = result => {
            this.assert.equal(result.value, true, "If number of cosignatories for deletion approval is less than 1, an error is shown")
        })
        .click("@add_dltapproval")
    },  

    invalid_publickey(publickey){
        return this
        .click("@addcosign_button")
        .assert.visible('@input_publickey', 'When user clicks add cosignatory, cosignatory public key field is opened')
        .pause(3000)
        .setValue("@input_publickey", publickey)
        .isVisible('@error_invalidpublickey', callback = result => {
            this.assert.equal(result.value, true, "If user enters invalid public key, an error is shown")
        })
        .clearValue("@input_publickey")
        
    },

    contact_dropdown(){
        return this
        .pause(1000)
        .click("@select_contact")
        .isVisible('@contact_list', callback = result => {
            this.assert.equal(result.value, true, "If user clicks select contact button, a list of contacts is shown")
        })
    },

    contact_dropdown2(){
        return this
        .pause(1000)
        .click("@select_contact2")
        .isVisible('@contact_list', callback = result => {
            this.assert.equal(result.value, true, "If user clicks select contact button, a list of contacts is shown")
        })
    },

    remove_test(){
        return this
        .pause(1000)
        .click('@trash_icon')
        .pause(2000) 
        .getAttribute('@trash_icon', 'src', function(result){
            console.log('result', result)
            console.log('If user clicks on the trash icon, selected cosigner trash icon is highlighted as removing')
        })
        .click('@trash_icon') 
    },

    invalid_publickey2(){
        return this
        .click("@addcosign_button")
        .pause(3000)
        .isVisible('@error_invalidpublickey', callback = result => {
            this.assert.equal(result.value, true, "If user enters invalid public key, an error is shown")
        })    
    },

    schema_test(browser){
        return this
        .click("@account_ellipsis")
        .waitForElementVisible("@multisig_selection")
        .click("@multisig_selection")
        .assert.urlContains(browser + 'multisig-settings', 'User is navigated to multisig page')
        .click('@schema')
        .assert.urlContains(browser + 'view-multisig-scheme', 'If user clicks schema, a multisig graph scheme is displayed')
        .click('@vertical_button')
        .isVisible('@vertical_tree', callback = result => {
            this.assert.equal(result.value, true, 'If user clicks on vertical, vertical tree schema is displayed')
        })
    }
    

}

module.exports = {

    elements: elements,
    commands: commands,
    url: function () {
        return '${this.api.launchUrl}'
    }

}