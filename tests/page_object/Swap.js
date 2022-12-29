const { Password } = require("tsjs-xpx-chain-sdk")

const elements = {
    swap_button: 'a[href="#/swap"]',
    swapmethod_button: 'div.inline-block.flex-grow.overflow-hidden > div > div > div > div > div.inline-block.relative.w-full.text-left.mt-5.transition-all.duration-500 > div > div',
    outswap_button: 'div.inline-block.flex-grow.overflow-hidden > div > div > div > div > div.inline-block.relative.w-full.text-left.mt-5.transition-all.duration-500 > div > div.w-full.text-left.z-20.bg-white > div.py-3.px-5.text-sm.font-bold.transition-all.duration-500.flex.justify-between.cursor-pointer',
    select_account: 'div.inline-block.flex-grow.overflow-hidden > div > div > div > div > div:nth-child(4) > div.border.ml-auto.mr-auto.py-3.px-2.cursor-pointer.rounded-md > div',
    account: 'div.inline-block.flex-grow.overflow-hidden > div > div > div > div > div:nth-child(4) > div:nth-child(5) > div > div.px-2.py-3.flex.cursor-pointer.items-center',
    input_amount: 'input.supply_input',
    address_input: 'input.placeholder.bg-white',
    password_input: 'input.text_input',
    address_error: '.error.text-left',
    amount_error: '.error.h-3.mb-2',
    password_error: 'div.h-3.mb-2 > div.error',
    strategy: 'div.inline-block.flex-grow.overflow-hidden > div > div > div > div > div:nth-child(4) > div:nth-child(6) > div.md:grid.md:grid-cols-3.mb-4 > div:nth-child(1) > div > p',
    confirmswap_button: 'div.mt-10.text-center > button:nth-child(2)',
    wrongpassword_error : '.error_box',
    later_button: 'div.mt-10.text-center > button:nth-child(1)',
    select_asset: 'select',
    confirm_message: 'h1.default-title.font-bold.mt-5.mb-2',
    checkbox: 'input.h-5.w-5.bg-blue-primary',
    done_button: 'a[href="#/swap"] > button'
}

const commands = {

    navigate_swap(browser){
        return this
        .click('@swap_button')
        .assert.urlEquals(browser + 'swap', 'User is directed to swap page')
    },

    navigate_outswap(browser){
        return this
        .click('@swapmethod_button')
        .click('@outswap_button')
        .pause(6000)
        .assert.urlEquals(browser + 'swap-sirius-bsc', 'User is directed to outgoing swap page')
    },

    select_account(){
        return this
        .click('@select_account')
        .click('@account')
    },

    empty_input(){
        return this
        .setValue('@address_input', "\ue004")
        .isVisible('@address_error', callback = result =>{
            this.assert.equal(result.value, true, 'If address is empty, an error will shown')
        })
        .setValue('@input_amount', "\ue004")
        .isVisible('@amount_error', callback = result =>{
            this.assert.equal(result.value, true, 'If input amount is 0, an error will shown')
        })
        .setValue('@password_input', "\ue004")
        .isVisible('@password_error', callback = result =>{
            this.assert.equal(result.value, true, 'If password is empty, an error will shown')
        }) 
    },

    wrong_password(address, amount, password){
        return this
        .setValue('@address_input', address)
        .setValue('@input_amount', amount)
        .setValue('@password_input', password)
        .pause(1000)
        .click('@confirmswap_button')
        .isVisible('@wrongpassword_error', callback = result =>{
            this.assert.equal(result.value, true, 'If password is wrong, an error will shown')
        })
    },

    create_swap(password, browser){
        return this
        .setValue('@password_input', password)
        .click('@confirmswap_button')
        .pause(60000)
        .isVisible('@confirm_message', callback = result =>{
            this.assert.equal(result.value, true, 'If swap is successful, a congratulations title is shown')
        })
        .click('@checkbox')
        .click('@done_button')
        .assert.urlEquals(browser + 'swap', 'If user click on done, user is directed back to swap page')
    },

    later_test(browser){
        return this
        .click('@later_button')
        .assert.urlEquals(browser + 'swap', 'If user click on later, user is directed back to swap page')
    }

}

module.exports = {

    elements: elements,
    commands: commands,
    url: function () {
        return '${this.api.launchUrl}'
    }

}