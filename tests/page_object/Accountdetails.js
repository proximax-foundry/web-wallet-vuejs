const elements = {
    account: '.relative > nav > a:nth-child(3)',
    account_dropdown: 'svg.w-5:nth-child(1) > path:nth-child(1)',
    details: 'a.block:nth-child(1)',
    back:'.page > div:nth-child(1) > div:nth-child(2) > a:nth-child(1)',
    edit_accountname: 'svg.text-gray-500:nth-child(1) > path:nth-child(1)',
    input_name: '.text-placeholder',
    tick_button:'svg.text-gray-500:nth-child(1) > path:nth-child(1)',
    accountname_value: 'div.bg-gray-100:nth-child(1) > div:nth-child(1) > div:nth-child(2)',
    emptyname_validation: '.error',
    show_privatekey:'div.pt-5:nth-child(1) > div:nth-child(4) > div:nth-child(2) > button:nth-child(2)',
    pk_passwordfield:'.text-placeholder',
    pk_passwordeyeicon:'.fa-eye',
    pk_passwordslashicon:'.fa-eye-slash',
    pk_passwordvalidation: '.error',
    submit_button:'div.pt-5:nth-child(1) > div:nth-child(4) > div:nth-child(2) > button:nth-child(2)',
    privatekey:'div.absolute:nth-child(2)',
    password_validation:'.error',
    pk_passwordfield2:'.text-icon> text-placeholder'
    
}

const commands = [{
    navigate_accountdetails(browser) {
        return this
        .click('@account')
        .click('@account_dropdown')
        .click('@details')
        .assert.urlContains(browser +'details-account/','User is navigated to the account details page.')
        .click('@back')
        .assert.urlEquals(browser+ 'view-all-accounts','When View All Accounts button is clicked, user is navigated back to Accounts page.')
        .click('@account_dropdown')
        .click('@details')
    },
    edit_accountname(name){
        return this
        .click('@edit_accountname')
        .assert.elementPresent('@input_name','When edit button is clicked, account name field is open for edit.')
        .setValue('@input_name','\ue003\ue003\ue003\ue003\ue003\ue003\ue003')
        .setValue('@input_name', '\ue004')
        .assert.elementPresent('@emptyname_validation','When account name is empty, error is shown')
        .setValue('@input_name',name)
        .click('@tick_button')
        .assert.containsText('@accountname_value',name,'Account name has successfully edited.')
    },
    show_privatekey(password,password2){
        return this
        .click('@show_privatekey')
        .assert.elementPresent('@pk_passwordfield','When show button is clicked, password field is open')
        .setValue('@pk_passwordfield','\ue004')
        .assert.elementPresent('@pk_passwordvalidation','When password field is empty, error is shown')
        .setValue('@pk_passwordfield',password2)
        .click('@pk_passwordeyeicon')
        .assert.elementPresent('@pk_passwordslashicon','When eye icon is clicked, password field is revealed')
        .click('@pk_passwordslashicon')
        .assert.elementPresent('@pk_passwordeyeicon','When slash icon is clicked, password field is hidden again')
        .click('@submit_button')
        .assert.elementPresent('@password_validation','When user enters incorrect password, error is shown')
        .click('@account')
        .click('@account_dropdown')
        .click('@details')
        .click('@show_privatekey')
        .setValue('@pk_passwordfield',password)
        .click('@submit_button')
        .assert.elementPresent('@privatekey','If password is correct, private key is revealed')
    },
//swap, save paper wallet
}]

module.exports = {
    elements: elements,
    commands: commands,
    url: function () {
      return '${this.api.launchUrl}'
    }
  
  }
