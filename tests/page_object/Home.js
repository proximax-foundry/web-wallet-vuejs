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
    copy_address: 'div > img.w-4.ml-4.inline-block.cursor-pointer:nth-child(2)',
    transfer_xpx: 'a[href="#/create-transfer"] > div:nth-child(3)',          
    copy_successfulpopup: 'div.p-toast:nth-child(12) > div:nth-child(1) > div:nth-child(1)',
    wallet_tab: 'a[href="#/wallets"]',
    wallet_close: 'div.flex.flex-col.justify-between > div > div.inline-block.flex-grow.overflow-hidden > div > div > div:nth-child(4) > div > div > div > div.ml-4.mt-5.mb-5.mr-5.text-txs.text-left > div.font-bold.text-blue-primary.flex.items-center > div > img',
    proceed_button: '.default-btn',
    deletewallet_popup: '.popup-outer > div:nth-child(1)',
    confirmation_password: 'input.w-full',
    deletenow_button: 'button.red-btn',
    deletesuccessful_popup: 'div.p-toast:nth-child(12) > div:nth-child(1) > div:nth-child(1)',
    questionmark_icon: 'div.text-center.w-full.h-7.cursor-pointer:nth-child(1) > img',
    beginnerguide_title: 'div.font-bold.p-2.text-txs.uppercase:nth-child(1)',
    gettingstarted: 'div.grid:nth-child(2) > div:nth-child(1) > div.p-2:nth-child(1) > a',
    siriuschain: 'div.grid:nth-child(2) > div:nth-child(1) > div.p-2:nth-child(2) > a',
    settings: 'a[href="#/settings"]',
    namespaceAns: 'div.grid:nth-child(2) > div:nth-child(2) > div.p-2:nth-child(1) > a',
    notification: 'a[href="#/notification"]',
    assetAns: 'div.grid:nth-child(2) > div:nth-child(2) > div.p-2:nth-child(2) > a',
    swap: 'a[href="#/swap"]',
    scanQR: 'div.flex.justify-center > div.my-2.flex.items-center.cursor-pointer:nth-child(3)',
    QR_popup: 'div.popup-outer-lang.fixed.flex.z-50 > div.modal-popup-box > div.flex.justify-center > img',
    closeQR: 'div.popup-outer-lang.fixed.flex.z-50 > div.modal-popup-box > div:nth-child(2)',
    converttomultisig_button: 'div.flex.justify-between.w-full:nth-child(3) > a.my-2.flex.items-center:nth-child(2)',
    accounts_tab: 'a[href="#/view-all-accounts"]',
    copy_addressatviewall: 'div.inline-block.flex-grow.overflow-hidden > div > div > div.mt-2.py-3 > div > div:nth-child(2) > div > div.flex.flex-col > div.flex.justify-around > svg',
    createnewaccount: 'a[href="#/select-type-creation-account"] > div.w-44',
    accountatviewall: 'div.mt-2.py-3 > div > div:nth-child(2)',
    accountdetails_tab: 'a.w-32:nth-child(1)',
    label_tab: 'div.border.p-2.cursor-pointer.w-52.bg-white.text-xs.justify-between.flex',
    add_label: 'svg.fa-plus',
    delete_label: 'svg.fa-trash',
    label_popup: '.popup-outer > div:nth-child(1)',
    emptyname_error: '.error_box',
    label_input: 'input.text_input',
    label_confirm: 'div.blue-btn',
    label_cancel: '.popup-outer > div:nth-child(1) > div:nth-child(1) > div.text-blue-link',
    accounts_label: 'div.mt-2.py-3 > div > div:nth-child(2) > div > div.ml-auto.mt-auto.mb-auto > img',
    firstlabel_acc: 'div.mt-2.py-3 > div > div:nth-child(2) > div > div.ml-auto.mt-auto.mb-auto > div > div > div > div:nth-child(2) > div',
    label_notification: 'div.p-toast:nth-child(12) > div:nth-child(1) > div:nth-child(1)',
    firstlabel_filter: 'div.border-t-0 > div.flex > div > div.flex:nth-child(1)',
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

    delete_wallet(browser, password){
        return this
        .click("@wallet_tab")
        .assert.urlEquals(browser + 'wallets', 'When wallets tab is clicked, user is directed to wallets page')
        .pause(2000)
        .click("@wallet_close")
        .isVisible('@deletewallet_popup', callback = (result) => {
          this.assert.equal(result.value, true, 'If user clicks on the trash icon, a delete wallet pop up box confirmation is shown')
        })
        .setValue("@confirmation_password", password)
        .click("@deletenow_button")
        .isVisible('@deletesuccessful_popup', callback = (result) => {
          this.assert.equal(result.value, true, 'If user clicks to confirm wallet deletion, a notification saying wallet is deleted is shown')
        })
      
    },

    navigation_beginner(){
      return this
      .click('@questionmark_icon')
      .isVisible('@beginnerguide_title', callback = (result) => {
          this.assert.equal(result.value, true, 'When quention mark is clicked, a list of beginner guides available for user is shown')
      })
  },

  gettingstarted_tab(){
      return this
      .click('@gettingstarted', function() {
          this.windowHandles(function(result) {
              var newTab = result.value[1];
              this.switchToWindow(newTab, callback = () => {
                  this.assert.urlEquals('https://bcdocs.xpxsirius.io/', 'User is navigated to getting started page')
              })
          })
          this.closeWindow()
          this.windowHandles(function(result) {
              var firstTab = result.value[0]
              this.switchToWindow(firstTab)
          })
      })      
  },

  siriuschain_tab(){
      return this
      .click('@siriuschain', function() {
          this.windowHandles(function(result) {
              var newTab = result.value[1];
              this.switchToWindow(newTab, callback = () => {
                  this.assert.urlEquals('https://bcdocs.xpxsirius.io/docs/getting-started/what-is-proximax-sirius-chain/', 'User is navigated to Sirius Chain introduction page')
              })
          })
          this.closeWindow()
          this.windowHandles(function(result) {
              var firstTab = result.value[0]
              this.switchToWindow(firstTab)
          })
      })     
  },

  namespaceAns_tab(){
      return this
      .click('@namespaceAns', function() {
          this.windowHandles(function(result) {
              var newTab = result.value[1];
              this.switchToWindow(newTab, callback = () => {
                  this.assert.urlEquals('https://bcdocs.xpxsirius.io/docs/built-in-features/namespace/', 'User is navigated to namespace introduction page')
              })
          })
          this.closeWindow()
          this.windowHandles(function(result) {
              var firstTab = result.value[0]
              this.switchToWindow(firstTab)
          })
      })    
  },

  assetAns_tab(){
      return this
      .click('@assetAns', function() {
          this.windowHandles(function(result) {
              var newTab = result.value[1];
              this.switchToWindow(newTab, callback = () => {
                  this.assert.urlEquals('https://bcdocs.xpxsirius.io/docs/built-in-features/mosaic/', 'User is navigated to asset introduction page')
              })
          })
          this.closeWindow()
          this.windowHandles(function(result) {
              var firstTab = result.value[0]
              this.switchToWindow(firstTab)
          })
      })   
  },

  navigation_notification(browser){
      return this
      .click('@notification')
      .assert.urlEquals(browser + 'notification', 'User is navigated to notification page')
  },

  navigation_settings(browser){
      return this
      .click('@settings')
      .assert.urlEquals(browser + 'settings', 'User is navigated to settings page')
  },

  navigation_swap(browser){
    return this
    .click('@swap')
    .assert.urlEquals(browser + 'swap', 'User is navigated to swap page')
  },

  scanQR_code(){
    return this
    .click('@scanQR')
    .isVisible('@QR_popup', callback = (result) => {
      this.assert.equal(result.value, true, 'When scan QR code is clicked, a QR code is shown')
    })
    .click('@closeQR')
  },

  navigation_accounts(browser){
    return this
      .click('@accounts_tab')
      .assert.urlEquals(browser + 'view-all-accounts', 'When accounts tab is clicked, user is directed to view all accounts page')
  },

  copy_instancesatviewall(){
    return this
      .click("@copy_addressatviewall")
      .isVisible('@copy_successfulpopup', callback = (result) => {
        this.assert.equal(result.value, true, 'If user clicks to copy account address at view all accounts, a notification is shown')
    })
  },

  navigation_createnewaccount(browser){
    return this
      .click('@createnewaccount')
      .assert.urlEquals(browser + 'select-type-creation-account', 'When create new account is clicked, user is directed to select wallet creation type page')
  },

  navigate_accountdetails(){
    return this
    .click("@accountatviewall")
    .isVisible('@accountdetails_tab', callback = result => {
        this.assert.equal(result.value, true, "If account is clicked at view all accounts, user is navigated to the account details page")
    })
  },
  
  label_test(browser, name){
    return this
    .click('@label_tab')
    .click('@add_label')
    .isVisible('@label_popup', callback = result => {
        this.assert.equal(result.value, true, 'If user click on the plus sign on label, a create label popup is shown')
    })
    .click('@label_confirm')
    .isVisible('@emptyname_error', callback = result => {
        this.assert.equal(result.value, true, 'If name input is left empty, an error is shown')
    })
    .click('@label_cancel')
    .assert.urlEquals(browser + 'view-all-accounts', 'If cancel is clicked, user is directed back to view all account page')
    .click('@label_tab')
    .click('@add_label')
    .isVisible('@label_popup', callback = result => {
        this.assert.equal(result.value, true, 'If user click on the plus sign on label, a create label popup is shown')
    })
    .setValue('@label_input', name)
    .click('@label_confirm')
    .isVisible('@label_notification', callback = result => {
        this.assert.equal(result.value, true, 'If confirm is clicked with name input, a label created notification is shown')
    })
    .pause(5000)
    .click('@accounts_label')
    .click('@firstlabel_acc')
    .isVisible('@label_notification', callback = result => {
        this.assert.equal(result.value, true, 'If user select a label for an account, a label added notification is shown')
    })
    .pause(5000)
    .click('@label_tab')
    .click('@firstlabel_filter')
    .isVisible('@accountatviewall', callback = result => {
        this.assert.equal(result.value, true, "If user click on label on label tab, only accounts with that label is shown")
    })
    .click('@firstlabel_filter')
    .click('@accounts_label')
    .click('@firstlabel_acc')
    .isVisible('@label_notification', callback = result => {
        this.assert.equal(result.value, true, 'If user deselect a label for an account, a label remove notification is shown')
    })
    .pause(7000)
    .click('@delete_label')
    .isVisible('@label_notification', callback = result => {
        this.assert.equal(result.value, true, 'If user click on the trash icon on label, a label remove notification is shown')
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
