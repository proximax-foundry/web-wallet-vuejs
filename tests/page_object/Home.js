const elements = {

    new_button: 'div.pr-2:nth-child(1) > div:nth-child(1)',
    transfer_button: 'a[href="#/create-transfer"]',
    digitalasset_button: 'a[href="#/create-asset"]',
    namespace_button: 'a[href="#/create-namespace"]',
    account_button: 'a[href="#/select-type-creation-account"]',
    home_button: 'a[href="#/dashboard"]',
    overview_tab: 'div.px-3:nth-child(1)',
    assets_tab: 'div.px-3:nth-child(1)',
    activities_tab: 'div.px-3:nth-child(2)',
    namespaces_tab: 'div.text-xs:nth-child(3)',
    transactions_tab: 'div.text-xs:nth-child(4)',
    recenttxn_title: 'div.text-txs:nth-child(3) > b:nth-child(1)',
    assetid_title: '.p-datatable-thead > tr:nth-child(1) > th:nth-child(1) > div:nth-child(1) > span:nth-child(1)',
    namespaces_title: 'div.mt-10:nth-child(3) > b:nth-child(1)',
    transactions_title: 'div.text-txs:nth-child(1) > b:nth-child(1)',
    name_title: '.p-datatable-thead > tr:nth-child(1) > th:nth-child(2) > div:nth-child(1) > span:nth-child(1)',
    txhash_title: '.p-datatable-thead > tr:nth-child(1) > th:nth-child(2) > div:nth-child(1) > span:nth-child(1)',
    account_popup: '.popup-outer > div:nth-child(1)',
    copy_address: '.mb-10 > img:nth-child(2)',
    transfer_xpx: 'a[href="#/create-transfer"] > div:nth-child(2)',          
    copy_successfulpopup: 'div.p-toast:nth-child(12) > div:nth-child(1) > div:nth-child(1)',
    wallet_tab: 'a[href="#/wallets"]',
    wallet_close: '.mr-7 > a:nth-child(1) > img:nth-child(1)',
    proceed_button: '.default-btn',
    deletewallet_popup: '.popup-outer > div:nth-child(1)',
    confirmation_checkbox: 'input.h-5',
    deletenow_button: '.py-1',
    deletesuccessful_popup: 'div.p-toast:nth-child(12) > div:nth-child(1) > div:nth-child(1)',
    // primary_account: '.underline',
    // top_up: '#app > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(3) > div:nth-child(1) > a:nth-child(1) > div:nth-child(2)',
    // close: '.popup-outer > div:nth-child(1) > div:nth-child(1) > img:nth-child(1)',

  
  }


const commands = {

    navigate_transfer(browser){
        return this
        .click("@transfer_button")
        .assert.urlEquals(browser + 'create-transfer', 'When transfer xpx is clicked, user is directed to create transfer page')

    },

    navigate_digitalasset(browser){
        return this
        .click("@digitalasset_button")
        .assert.urlEquals(browser + 'create-asset', 'When digital asset is clicked, user is directed to create asset page')
    },

    navigate_namespace(browser){
        return this
        .click("@namespace_button")
        .assert.urlEquals(browser + 'create-namespace', 'When namespace is clicked, user is directed to create namespace page')
    },

    navigate_account(browser){
        return this
        .click("@account_button")
        .assert.urlEquals(browser + 'select-type-creation-account', 'When account is clicked, user is directed to select wallet creation type page')
    },

    home(browser){
        return this
        .pause(1000)
        .click("@home_button")
        .assert.urlEquals(browser + 'dashboard', 'When home icon is clicked, user is directed back to dashboard page')

    },

    click_tabs(){
        return this
        .click("@assets_tab")
        .isVisible('@assetid_title', callback = (result) => {
          this.assert.equal(result.value, true, 'If assets tab is clicked, user assets will be shown')
        })
        .click("@activities_tab")
        .isVisible('@transactions_title', callback = (result) => {
          this.assert.equal(result.value, true, 'If activities tab is clicked, user pending transactions will be shown')
        })
        .isVisible('@recenttxn_title', callback = (result) => {
          this.assert.equal(result.value, true, 'If activities tab is clicked, user recent transactions will be shown')
        })

    },

    click_headercomponents(browser){
        return this
        .click("@transfer_xpx")
        .assert.urlEquals(browser + 'create-transfer', 'When transfer xpx button is clicked, user is directed to create transfer page')
        .click("@home_button")
        .click("@copy_address")
        .isVisible('@copy_successfulpopup', callback = (result) => {
          this.assert.equal(result.value, true, 'If user clicks to copy wallet address, a notification is shown')
        })
        
    },

    delete_wallet(browser){
        return this
        .click("@wallet_tab")
        .assert.urlEquals(browser + 'wallets', 'When wallets tab is clicked, user is directed to wallets page')
        .pause(2000)
        .click("@wallet_close")
        .click("@proceed_button")
        .isVisible('@deletewallet_popup', callback = (result) => {
          this.assert.equal(result.value, true, 'If user clicks to proceed, a delete wallet pop up box confirmation is shown')
        })
        .click("@confirmation_checkbox")
        .click("@deletenow_button")
        .isVisible('@deletesuccessful_popup', callback = (result) => {
          this.assert.equal(result.value, true, 'If user clicks to delete now, a notification saying wallet is deleted is shown')
        })
      
    },


}





module.exports = {
  elements: elements,
  commands: commands,
  url: function () {
    return '${this.api.launchUrl}'
  }

}
