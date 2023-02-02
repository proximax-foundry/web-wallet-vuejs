(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[4],{

/***/ "./node_modules/cache-loader/dist/cjs.js?!./node_modules/ts-loader/index.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader-v16/dist/index.js?!./src/components/PasswordInput.vue?vue&type=script&lang=ts":
/*!********************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/cache-loader/dist/cjs.js??ref--13-0!./node_modules/ts-loader??ref--13-1!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader-v16/dist??ref--0-1!./src/components/PasswordInput.vue?vue&type=script&lang=ts ***!
  \********************************************************************************************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ \"./node_modules/vue/dist/vue.runtime.esm-bundler.js\");\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"defineComponent\"])({\n    props: {\n        placeholder: {\n            type: String\n        },\n        errorMessage: {\n            type: String\n        },\n        icon: {\n            type: String\n        },\n        showError: {\n            type: Boolean\n        },\n        modelValue: {\n            type: String\n        },\n        disabled: {\n            type: Boolean\n        }\n    },\n    emits: [\n        'update:modelValue'\n    ],\n    name: 'PasswordInput',\n    data() {\n        return {\n            inputPassword: \"\",\n            showPassword: false,\n            inputType: 'password',\n            borderColor: 'border border-grey-300',\n            eyeIcon: 'eye',\n            pswdErr: false,\n        };\n    },\n    methods: {\n        hideShowPassword: function () {\n            this.showPassword = !this.showPassword;\n            this.showPassword ? this.eyeIcon = 'eye-slash' : this.eyeIcon = 'eye';\n            this.showPassword ? this.inputType = 'text' : this.inputType = 'password';\n        },\n        clickInputPassword: function () {\n            if (!this.pswdErr) {\n                this.borderColor = 'border-2 border-blue-primary';\n            }\n        },\n        blurInputPassword: function () {\n            var passwdPattern = \"^[^ ]{8,}$\";\n            if (this.modelValue == '') {\n                this.borderColor = 'border-2 border-red-primary';\n                this.pswdErr = true;\n            }\n            else if (Object.keys(this.modelValue).length < 8) {\n                this.borderColor = 'border-2 border-red-primary';\n                this.pswdErr = true;\n            }\n            else {\n                this.borderColor = 'border-2 border-gray-300';\n                this.pswdErr = false;\n                // }\n            }\n        },\n    },\n    mounted() {\n        // this.emitter.on(\"CLEAR_PASSWORD\", (payload) => {\n        //   this.inputPassword = payload;\n        //   this.pswdErr = false;\n        //   this.borderColor = 'border border-gray-300';\n        // });\n    }\n}));\n\n\n//# sourceURL=webpack:///./src/components/PasswordInput.vue?./node_modules/cache-loader/dist/cjs.js??ref--13-0!./node_modules/ts-loader??ref--13-1!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader-v16/dist??ref--0-1");

/***/ }),

/***/ "./node_modules/cache-loader/dist/cjs.js?!./node_modules/ts-loader/index.js?!./node_modules/vue-loader-v16/dist/templateLoader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader-v16/dist/index.js?!./src/components/PasswordInput.vue?vue&type=template&id=03b98a6f&ts=true":
/*!***********************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/cache-loader/dist/cjs.js??ref--13-0!./node_modules/ts-loader??ref--13-1!./node_modules/vue-loader-v16/dist/templateLoader.js??ref--6!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader-v16/dist??ref--0-1!./src/components/PasswordInput.vue?vue&type=template&id=03b98a6f&ts=true ***!
  \***********************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! exports provided: render */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"render\", function() { return render; });\n/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ \"./node_modules/vue/dist/vue.runtime.esm-bundler.js\");\n\nconst _hoisted_1 = { class: \"bg-white py-2 border flex justify-between\" };\nconst _hoisted_2 = [\"type\", \"disabled\", \"value\", \"placeholder\"];\nconst _hoisted_3 = {\n    key: 0,\n    class: \"error error-password text-left my-2\"\n};\nfunction render(_ctx, _cache, $props, $setup, $data, $options) {\n    const _component_font_awesome_icon = Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"resolveComponent\"])(\"font-awesome-icon\");\n    return (Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"openBlock\"])(), Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createElementBlock\"])(\"div\", null, [\n        Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createElementVNode\"])(\"div\", _hoisted_1, [\n            Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createElementVNode\"])(\"input\", {\n                type: _ctx.inputType,\n                disabled: _ctx.disabled == true,\n                value: _ctx.modelValue,\n                onInput: _cache[0] || (_cache[0] = ($event) => (_ctx.$emit('update:modelValue', $event.target.value))),\n                class: \"w-full text-placeholder text-left ml-2\",\n                placeholder: _ctx.placeholder,\n                onClick: _cache[1] || (_cache[1] = ($event) => (_ctx.clickInputPassword())),\n                onBlur: _cache[2] || (_cache[2] = ($event) => (_ctx.blurInputPassword())),\n                autocomplete: \"off\"\n            }, null, 40 /* PROPS, HYDRATE_EVENTS */, _hoisted_2),\n            (!_ctx.showPassword)\n                ? (Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"openBlock\"])(), Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createBlock\"])(_component_font_awesome_icon, {\n                    key: 0,\n                    icon: \"eye\",\n                    class: \"text-gray-500 relative cursor-pointer text-right mt-1 mr-2\",\n                    onClick: _cache[3] || (_cache[3] = ($event) => { _ctx.hideShowPassword(); })\n                }))\n                : Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createCommentVNode\"])(\"v-if\", true),\n            (_ctx.showPassword)\n                ? (Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"openBlock\"])(), Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createBlock\"])(_component_font_awesome_icon, {\n                    key: 1,\n                    icon: \"eye-slash\",\n                    class: \"text-gray-500 relative cursor-pointer text-right mt-1 mr-2\",\n                    onClick: _cache[4] || (_cache[4] = ($event) => { _ctx.hideShowPassword(); })\n                }))\n                : Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createCommentVNode\"])(\"v-if\", true)\n        ]),\n        (_ctx.pswdErr || _ctx.showError)\n            ? (Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"openBlock\"])(), Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createElementBlock\"])(\"div\", _hoisted_3, Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"toDisplayString\"])(_ctx.errorMessage), 1 /* TEXT */))\n            : Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createCommentVNode\"])(\"v-if\", true)\n    ]));\n}\n\n\n//# sourceURL=webpack:///./src/components/PasswordInput.vue?./node_modules/cache-loader/dist/cjs.js??ref--13-0!./node_modules/ts-loader??ref--13-1!./node_modules/vue-loader-v16/dist/templateLoader.js??ref--6!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader-v16/dist??ref--0-1");

/***/ }),

/***/ "./src/components/PasswordInput.vue":
/*!******************************************!*\
  !*** ./src/components/PasswordInput.vue ***!
  \******************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _PasswordInput_vue_vue_type_template_id_03b98a6f_ts_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./PasswordInput.vue?vue&type=template&id=03b98a6f&ts=true */ \"./src/components/PasswordInput.vue?vue&type=template&id=03b98a6f&ts=true\");\n/* harmony import */ var _PasswordInput_vue_vue_type_script_lang_ts__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./PasswordInput.vue?vue&type=script&lang=ts */ \"./src/components/PasswordInput.vue?vue&type=script&lang=ts\");\n/* empty/unused harmony star reexport *//* harmony import */ var _home_runner_work_web_wallet_vuejs_web_wallet_vuejs_node_modules_vue_loader_v16_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./node_modules/vue-loader-v16/dist/exportHelper.js */ \"./node_modules/vue-loader-v16/dist/exportHelper.js\");\n/* harmony import */ var _home_runner_work_web_wallet_vuejs_web_wallet_vuejs_node_modules_vue_loader_v16_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_home_runner_work_web_wallet_vuejs_web_wallet_vuejs_node_modules_vue_loader_v16_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2__);\n\n\n\n\n\nconst __exports__ = /*#__PURE__*/_home_runner_work_web_wallet_vuejs_web_wallet_vuejs_node_modules_vue_loader_v16_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2___default()(_PasswordInput_vue_vue_type_script_lang_ts__WEBPACK_IMPORTED_MODULE_1__[\"default\"], [['render',_PasswordInput_vue_vue_type_template_id_03b98a6f_ts_true__WEBPACK_IMPORTED_MODULE_0__[\"render\"]],['__file',\"src/components/PasswordInput.vue\"]])\n/* hot reload */\nif (false) {}\n\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (__exports__);\n\n//# sourceURL=webpack:///./src/components/PasswordInput.vue?");

/***/ }),

/***/ "./src/components/PasswordInput.vue?vue&type=script&lang=ts":
/*!******************************************************************!*\
  !*** ./src/components/PasswordInput.vue?vue&type=script&lang=ts ***!
  \******************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _node_modules_cache_loader_dist_cjs_js_ref_13_0_node_modules_ts_loader_index_js_ref_13_1_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_v16_dist_index_js_ref_0_1_PasswordInput_vue_vue_type_script_lang_ts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/cache-loader/dist/cjs.js??ref--13-0!../../node_modules/ts-loader??ref--13-1!../../node_modules/cache-loader/dist/cjs.js??ref--0-0!../../node_modules/vue-loader-v16/dist??ref--0-1!./PasswordInput.vue?vue&type=script&lang=ts */ \"./node_modules/cache-loader/dist/cjs.js?!./node_modules/ts-loader/index.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader-v16/dist/index.js?!./src/components/PasswordInput.vue?vue&type=script&lang=ts\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return _node_modules_cache_loader_dist_cjs_js_ref_13_0_node_modules_ts_loader_index_js_ref_13_1_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_v16_dist_index_js_ref_0_1_PasswordInput_vue_vue_type_script_lang_ts__WEBPACK_IMPORTED_MODULE_0__[\"default\"]; });\n\n/* empty/unused harmony star reexport */ \n\n//# sourceURL=webpack:///./src/components/PasswordInput.vue?");

/***/ }),

/***/ "./src/components/PasswordInput.vue?vue&type=template&id=03b98a6f&ts=true":
/*!********************************************************************************!*\
  !*** ./src/components/PasswordInput.vue?vue&type=template&id=03b98a6f&ts=true ***!
  \********************************************************************************/
/*! exports provided: render */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _node_modules_cache_loader_dist_cjs_js_ref_13_0_node_modules_ts_loader_index_js_ref_13_1_node_modules_vue_loader_v16_dist_templateLoader_js_ref_6_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_v16_dist_index_js_ref_0_1_PasswordInput_vue_vue_type_template_id_03b98a6f_ts_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/cache-loader/dist/cjs.js??ref--13-0!../../node_modules/ts-loader??ref--13-1!../../node_modules/vue-loader-v16/dist/templateLoader.js??ref--6!../../node_modules/cache-loader/dist/cjs.js??ref--0-0!../../node_modules/vue-loader-v16/dist??ref--0-1!./PasswordInput.vue?vue&type=template&id=03b98a6f&ts=true */ \"./node_modules/cache-loader/dist/cjs.js?!./node_modules/ts-loader/index.js?!./node_modules/vue-loader-v16/dist/templateLoader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader-v16/dist/index.js?!./src/components/PasswordInput.vue?vue&type=template&id=03b98a6f&ts=true\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"render\", function() { return _node_modules_cache_loader_dist_cjs_js_ref_13_0_node_modules_ts_loader_index_js_ref_13_1_node_modules_vue_loader_v16_dist_templateLoader_js_ref_6_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_v16_dist_index_js_ref_0_1_PasswordInput_vue_vue_type_template_id_03b98a6f_ts_true__WEBPACK_IMPORTED_MODULE_0__[\"render\"]; });\n\n\n\n//# sourceURL=webpack:///./src/components/PasswordInput.vue?");

/***/ }),

/***/ "./src/util/multiSignatory.ts":
/*!************************************!*\
  !*** ./src/util/multiSignatory.ts ***!
  \************************************/
/*! exports provided: multiSign */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"multiSign\", function() { return multiSign; });\n/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ \"./node_modules/tslib/tslib.es6.js\");\n/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! vue */ \"./node_modules/vue/dist/vue.runtime.esm-bundler.js\");\n/* harmony import */ var tsjs_xpx_chain_sdk__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! tsjs-xpx-chain-sdk */ \"./node_modules/tsjs-xpx-chain-sdk/dist/index.js\");\n/* harmony import */ var tsjs_xpx_chain_sdk__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(tsjs_xpx_chain_sdk__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _util_walletUtils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @/util/walletUtils */ \"./src/util/walletUtils.ts\");\n/* harmony import */ var _state_walletState__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @/state/walletState */ \"./src/state/walletState.ts\");\n/* harmony import */ var _state_networkState__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @/state/networkState */ \"./src/state/networkState.ts\");\n/* harmony import */ var _util_transactionUtils__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @/util/transactionUtils */ \"./src/util/transactionUtils.ts\");\n/* harmony import */ var _state_appState__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @/state/appState */ \"./src/state/appState.ts\");\n/* harmony import */ var _typeHelper__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./typeHelper */ \"./src/util/typeHelper.ts\");\n/* harmony import */ var _chainUtils__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./chainUtils */ \"./src/util/chainUtils.ts\");\n\n\n\n\n\n\n\n\n\n\nfunction verifyContactPublicKey(address) {\n    const invalidPublicKey = '0000000000000000000000000000000000000000000000000000000000000000';\n    return new Promise((resolve) => {\n        const accountInfo = _util_walletUtils__WEBPACK_IMPORTED_MODULE_3__[\"WalletUtils\"].getAccInfo(address);\n        accountInfo.then((account) => {\n            if (account.publicKey == invalidPublicKey) {\n                console.warn(`The receiver's public key is not valid for sending encrypted messages`);\n                resolve({ status: false, publicKey: account.publicKey });\n            }\n            else {\n                resolve({ status: true, publicKey: account.publicKey });\n            }\n        }, (error) => {\n            console.warn('Err: ' + error);\n            resolve({ status: false, publicKey: \"\" });\n        });\n    });\n}\nfunction generateContact(selected, name) {\n    const wallet = _state_walletState__WEBPACK_IMPORTED_MODULE_4__[\"walletState\"].currentLoggedInWallet;\n    let contact = [];\n    let accounts = wallet.accounts.filter(account => account.name != name);\n    accounts.forEach((element) => {\n        if (element.address == selected) {\n        }\n        else {\n            contact.push({\n                value: element.publicKey,\n                label: wallet.convertAddressToName(element.address, true) + ' - Owner account',\n            });\n        }\n    });\n    if (wallet.contacts != undefined) {\n        wallet.contacts.forEach((element) => {\n            if (selected.indexOf(element.address) < 0) {\n                contact.push({\n                    value: element.address,\n                    label: element.name + ' - Contact',\n                });\n            }\n        });\n    }\n    return contact;\n}\nconst getPublicKey = (address) => {\n    return new Promise((resolve, reject) => {\n        try {\n            _chainUtils__WEBPACK_IMPORTED_MODULE_9__[\"ChainUtils\"].getAccountInfo(address).then(accountInfo => {\n                resolve(accountInfo.publicKey);\n            }).catch(error => {\n                console.log(error);\n                reject(false);\n            });\n        }\n        catch (error) {\n            reject(false);\n            console.log(error);\n        }\n    });\n};\nconst getAggregateFee = (publicKey, addedCosigners, numApprove, numDelete, removeCosign) => Object(tslib__WEBPACK_IMPORTED_MODULE_0__[\"__awaiter\"])(void 0, void 0, void 0, function* () {\n    const acc = _state_walletState__WEBPACK_IMPORTED_MODULE_4__[\"walletState\"].currentLoggedInWallet.accounts.find(acc => acc.publicKey == publicKey) || _state_walletState__WEBPACK_IMPORTED_MODULE_4__[\"walletState\"].currentLoggedInWallet.others.find(acc => acc.publicKey == publicKey);\n    const multisigCosignatory = [];\n    let cosignatory;\n    for (let cosignKey of addedCosigners) {\n        if (cosignKey.length == 64) {\n            cosignatory = tsjs_xpx_chain_sdk__WEBPACK_IMPORTED_MODULE_2__[\"PublicAccount\"].createFromPublicKey(cosignKey, _state_appState__WEBPACK_IMPORTED_MODULE_7__[\"AppState\"].networkType);\n        }\n        else if (cosignKey.length == 40 || cosignKey.length == 46) {\n            let address = tsjs_xpx_chain_sdk__WEBPACK_IMPORTED_MODULE_2__[\"Address\"].createFromRawAddress(cosignKey);\n            try {\n                let publicKey = yield getPublicKey(address);\n                cosignatory = tsjs_xpx_chain_sdk__WEBPACK_IMPORTED_MODULE_2__[\"PublicAccount\"].createFromPublicKey(publicKey, _state_appState__WEBPACK_IMPORTED_MODULE_7__[\"AppState\"].networkType);\n            }\n            catch (error) {\n                console.log(error);\n            }\n        }\n        multisigCosignatory.push(new tsjs_xpx_chain_sdk__WEBPACK_IMPORTED_MODULE_2__[\"MultisigCosignatoryModification\"](tsjs_xpx_chain_sdk__WEBPACK_IMPORTED_MODULE_2__[\"MultisigCosignatoryModificationType\"].Add, cosignatory));\n    }\n    if (removeCosign) {\n        removeCosign.forEach((element, index) => {\n            if (!cosignatory) {\n                cosignatory = [];\n            }\n            cosignatory[addedCosigners.length + index] = tsjs_xpx_chain_sdk__WEBPACK_IMPORTED_MODULE_2__[\"PublicAccount\"].createFromPublicKey(element, _state_appState__WEBPACK_IMPORTED_MODULE_7__[\"AppState\"].networkType);\n            multisigCosignatory.push(new tsjs_xpx_chain_sdk__WEBPACK_IMPORTED_MODULE_2__[\"MultisigCosignatoryModification\"](tsjs_xpx_chain_sdk__WEBPACK_IMPORTED_MODULE_2__[\"MultisigCosignatoryModificationType\"].Remove, cosignatory[addedCosigners.length + index]));\n        });\n    }\n    let txBuilder = _state_appState__WEBPACK_IMPORTED_MODULE_7__[\"AppState\"].buildTxn;\n    let publicAcc = tsjs_xpx_chain_sdk__WEBPACK_IMPORTED_MODULE_2__[\"PublicAccount\"].createFromPublicKey(publicKey, _state_appState__WEBPACK_IMPORTED_MODULE_7__[\"AppState\"].networkType);\n    let relativeNumApproveTransaction = numApprove - acc.multisigInfo.find(element => element.level === 0).minApproval;\n    let relativeNumDeleteUser = numDelete - acc.multisigInfo.find(element => element.level === 0).minRemoval;\n    let convertIntoMultisigTransaction = txBuilder.modifyMultisigAccountBuilder()\n        .minApprovalDelta(relativeNumApproveTransaction)\n        .minRemovalDelta(relativeNumDeleteUser)\n        .modifications(multisigCosignatory)\n        .build();\n    let aggregateBondedTx = txBuilder.aggregateBondedBuilder()\n        .innerTransactions([convertIntoMultisigTransaction.toAggregate(publicAcc)])\n        .build();\n    return _typeHelper__WEBPACK_IMPORTED_MODULE_8__[\"Helper\"].amountFormatterSimple(aggregateBondedTx.maxFee.compact(), _state_appState__WEBPACK_IMPORTED_MODULE_7__[\"AppState\"].nativeToken.divisibility);\n});\n/* coSign: array() */\nfunction convertAccount(coSign, numApproveTransaction, numDeleteUser, accountToConvertName, walletPassword) {\n    return Object(tslib__WEBPACK_IMPORTED_MODULE_0__[\"__awaiter\"])(this, void 0, void 0, function* () {\n        let verify = _util_walletUtils__WEBPACK_IMPORTED_MODULE_3__[\"WalletUtils\"].verifyWalletPassword(_state_walletState__WEBPACK_IMPORTED_MODULE_4__[\"walletState\"].currentLoggedInWallet.name, _state_networkState__WEBPACK_IMPORTED_MODULE_5__[\"networkState\"].chainNetworkName, walletPassword);\n        if (!verify) {\n            return verify;\n        }\n        const multisigCosignatory = [];\n        const accountDetails = _state_walletState__WEBPACK_IMPORTED_MODULE_4__[\"walletState\"].currentLoggedInWallet.accounts.find(element => element.name === accountToConvertName);\n        let privateKey = _util_walletUtils__WEBPACK_IMPORTED_MODULE_3__[\"WalletUtils\"].decryptPrivateKey(new tsjs_xpx_chain_sdk__WEBPACK_IMPORTED_MODULE_2__[\"Password\"](walletPassword), accountDetails.encrypted, accountDetails.iv);\n        const accountToConvert = tsjs_xpx_chain_sdk__WEBPACK_IMPORTED_MODULE_2__[\"Account\"].createFromPrivateKey(privateKey, _state_appState__WEBPACK_IMPORTED_MODULE_7__[\"AppState\"].networkType);\n        let cosignatory;\n        for (let cosignKey of coSign) {\n            if (cosignKey.length == 64) {\n                cosignatory = tsjs_xpx_chain_sdk__WEBPACK_IMPORTED_MODULE_2__[\"PublicAccount\"].createFromPublicKey(cosignKey, _state_appState__WEBPACK_IMPORTED_MODULE_7__[\"AppState\"].networkType);\n            }\n            else if (cosignKey.length == 40 || cosignKey.length == 46) {\n                let address = tsjs_xpx_chain_sdk__WEBPACK_IMPORTED_MODULE_2__[\"Address\"].createFromRawAddress(cosignKey);\n                try {\n                    let publicKey = yield getPublicKey(address);\n                    cosignatory = tsjs_xpx_chain_sdk__WEBPACK_IMPORTED_MODULE_2__[\"PublicAccount\"].createFromPublicKey(publicKey, _state_appState__WEBPACK_IMPORTED_MODULE_7__[\"AppState\"].networkType);\n                }\n                catch (error) {\n                    console.log(error);\n                }\n            }\n            multisigCosignatory.push(new tsjs_xpx_chain_sdk__WEBPACK_IMPORTED_MODULE_2__[\"MultisigCosignatoryModification\"](tsjs_xpx_chain_sdk__WEBPACK_IMPORTED_MODULE_2__[\"MultisigCosignatoryModificationType\"].Add, cosignatory));\n        }\n        const txBuilder = _state_appState__WEBPACK_IMPORTED_MODULE_7__[\"AppState\"].buildTxn;\n        const convertIntoMultisigTransaction = txBuilder.modifyMultisigAccountBuilder()\n            .minApprovalDelta(numApproveTransaction)\n            .minRemovalDelta(numDeleteUser)\n            .modifications(multisigCosignatory)\n            .build();\n        const aggregateBondedTransaction = txBuilder.aggregateBondedBuilder()\n            .innerTransactions([convertIntoMultisigTransaction.toAggregate(accountToConvert.publicAccount)])\n            .build();\n        const signedAggregateBondedTransaction = accountToConvert.sign(aggregateBondedTransaction, _state_networkState__WEBPACK_IMPORTED_MODULE_5__[\"networkState\"].currentNetworkProfile.generationHash);\n        let lockFundsTransaction = _util_transactionUtils__WEBPACK_IMPORTED_MODULE_6__[\"TransactionUtils\"].lockFundTx(signedAggregateBondedTransaction);\n        const lockFundsTransactionSigned = accountToConvert.sign(lockFundsTransaction, _state_networkState__WEBPACK_IMPORTED_MODULE_5__[\"networkState\"].currentNetworkProfile.generationHash);\n        _util_transactionUtils__WEBPACK_IMPORTED_MODULE_6__[\"TransactionUtils\"].announceLF_AND_addAutoAnnounceABT(lockFundsTransactionSigned, signedAggregateBondedTransaction);\n        return verify;\n    });\n}\nfunction getAggregateBondedTransactions(publicAccount) {\n    return _util_walletUtils__WEBPACK_IMPORTED_MODULE_3__[\"WalletUtils\"].getAggregateBondedTransactions(publicAccount);\n}\nfunction onPartial(publicAccount) {\n    return Object(tslib__WEBPACK_IMPORTED_MODULE_0__[\"__awaiter\"])(this, void 0, void 0, function* () {\n        let isPartial = new Promise((resolve, reject) => {\n            getAggregateBondedTransactions(publicAccount).then((txOnpartial) => {\n                if (txOnpartial !== null && txOnpartial.length > 0) {\n                    for (const tx of txOnpartial) {\n                        for (let i = 0; i < tx.innerTransactions.length; i++) {\n                            if (tx.innerTransactions[i].signer.publicKey === publicAccount.publicKey) {\n                                resolve(true);\n                                break;\n                            }\n                        }\n                    }\n                }\n            }).catch(error => {\n                /* reject('Err: ' + error) */\n            });\n        });\n        let result = yield isPartial;\n        return Boolean(result);\n    });\n}\nfunction getMultisigAccountGraphInfo(address) {\n    return _util_walletUtils__WEBPACK_IMPORTED_MODULE_3__[\"WalletUtils\"].getMultisigAccGraphInfo(tsjs_xpx_chain_sdk__WEBPACK_IMPORTED_MODULE_2__[\"Address\"].createFromRawAddress(address));\n}\nfunction checkIsMultiSig(accountAddress) {\n    /* let account = walletState.currentLoggedInWallet.accounts.find(element=>element.address ===accountAddress)?walletState.currentLoggedInWallet.accounts.find(element=>element.address ===accountAddress):  walletState.currentLoggedInWallet.others.find(element=>element.address ===accountAddress) */\n    let wallet = _state_walletState__WEBPACK_IMPORTED_MODULE_4__[\"walletState\"].currentLoggedInWallet;\n    if (!wallet) {\n        return false;\n    }\n    let account;\n    if (wallet.accounts.find(element => element.address === accountAddress) === undefined && wallet.others.find(element => element.address === accountAddress) === undefined) {\n        account = null;\n    }\n    else if (wallet.accounts.find(element => element.address === accountAddress) === undefined) {\n        account = wallet.others.find(element => element.address === accountAddress);\n    }\n    else if (wallet.others.find(element => element.address === accountAddress) === undefined) {\n        account = wallet.accounts.find(element => element.address === accountAddress);\n    }\n    let verify = false;\n    verify = account.getDirectParentMultisig().length ? true : false;\n    return Boolean(verify);\n}\nfunction checkHasMultiSig(accountAddress) {\n    /* let account = walletState.currentLoggedInWallet.accounts.find(element=>element.address ===accountAddress)?walletState.currentLoggedInWallet.accounts.find(element=>element.address ===accountAddress):  walletState.currentLoggedInWallet.others.find(element=>element.address ===accountAddress) */\n    let wallet = _state_walletState__WEBPACK_IMPORTED_MODULE_4__[\"walletState\"].currentLoggedInWallet;\n    if (!wallet) {\n        return false;\n    }\n    let account;\n    if (wallet.accounts.find(element => element.address === accountAddress) === undefined && wallet.others.find(element => element.address === accountAddress) === undefined) {\n        account = null;\n    }\n    else if (wallet.accounts.find(element => element.address === accountAddress) === undefined) {\n        account = wallet.others.find(element => element.address === accountAddress);\n    }\n    else if (wallet.others.find(element => element.address === accountAddress) === undefined) {\n        account = wallet.accounts.find(element => element.address === accountAddress);\n    }\n    let verify = false;\n    let tempArr = account.multisigInfo.filter(account => account.level == -1);\n    verify = tempArr.length > 0 ? true : false;\n    return Boolean(verify);\n}\nfunction getCosignerInWallet(publicKey) {\n    if (!_state_walletState__WEBPACK_IMPORTED_MODULE_4__[\"walletState\"].currentLoggedInWallet) {\n        return { hasCosigner: false, cosignerList: [] };\n    }\n    let accounts = _state_walletState__WEBPACK_IMPORTED_MODULE_4__[\"walletState\"].currentLoggedInWallet.accounts.map((acc) => {\n        return {\n            publicKey: acc.publicKey,\n            isMultisig: acc.getDirectParentMultisig().length ? true : false,\n            multisigInfo: acc.multisigInfo,\n        };\n    });\n    let otherAccounts = _state_walletState__WEBPACK_IMPORTED_MODULE_4__[\"walletState\"].currentLoggedInWallet.others.filter((acc) => acc.type === \"MULTISIG\").map((acc) => {\n        return {\n            publicKey: acc.publicKey,\n            isMultisig: true,\n            multisigInfo: acc.multisigInfo,\n        };\n    });\n    let totalAcc = accounts.concat(otherAccounts);\n    let foundAcc = totalAcc.find(acc => acc.publicKey == publicKey);\n    if (!foundAcc) {\n        return { hasCosigner: false, cosignerList: [] };\n    }\n    let allTopCosignerList = [];\n    totalAcc.forEach(acc => {\n        if (!acc.isMultisig && acc.multisigInfo.filter(acc => acc.level == -1).length > 0) {\n            allTopCosignerList.push(acc);\n        }\n    });\n    let multisigDepth = _state_networkState__WEBPACK_IMPORTED_MODULE_5__[\"networkState\"].currentNetworkProfileConfig.maxMultisigDepth;\n    let filteredCosignerList = [];\n    for (let i = 1; i <= multisigDepth; i++) {\n        let multisigLevel = foundAcc.multisigInfo.filter(acc => acc.level == i);\n        multisigLevel.forEach(info => {\n            allTopCosignerList.forEach(acc => {\n                if (acc.publicKey == info.publicKey) {\n                    filteredCosignerList.push(info.publicKey);\n                }\n            });\n        });\n    }\n    let hasCosigner = false;\n    if (filteredCosignerList.length > 0) {\n        hasCosigner = true;\n    }\n    return { hasCosigner: hasCosigner, cosignerList: filteredCosignerList };\n}\n/* function enableACT (account: WalletAccount|OtherAccount, addedCosigners : string[],signersInWallet? : number) :boolean{\n  let enoughSigner= false\n  \n  let count = Math.max(account.multisigInfo.find(acc=>acc.level==0).minApproval,account.multisigInfo.find(acc=>acc.level==0).minRemoval)\n  if(signersInWallet!=undefined){\n    if (count<=signersInWallet){\n      enoughSigner = true\n    }\n  }\n  let number =0\n  let allAddedCosignInWallet = false\n  for(let signer of addedCosigners){\n    let findAcc =  walletState.currentLoggedInWallet.accounts.find(element => element.publicKey === signer) || walletState.currentLoggedInWallet.accounts.find(element => element.address == signer)\n    if(findAcc!=undefined){\n      number++\n      if(findAcc.getDirectParentMultisig().length>0){\n        number--\n      }\n    }\n  }\n \n  if(number==addedCosigners.length){\n    allAddedCosignInWallet=true\n  }\n  if (enoughSigner==true && allAddedCosignInWallet){\n    return true\n  }else if(signersInWallet==undefined && allAddedCosignInWallet){\n    return true\n  }else{\n    return false\n  }\n} */\n// modify multisig\nfunction modifyMultisigAccount(selectedCosign, coSign, removeCosign, numApproveTransaction, numDeleteUser, multisigAccount, walletPassword) {\n    return Object(tslib__WEBPACK_IMPORTED_MODULE_0__[\"__awaiter\"])(this, void 0, void 0, function* () {\n        let verify = _util_walletUtils__WEBPACK_IMPORTED_MODULE_3__[\"WalletUtils\"].verifyWalletPassword(_state_walletState__WEBPACK_IMPORTED_MODULE_4__[\"walletState\"].currentLoggedInWallet.name, _state_networkState__WEBPACK_IMPORTED_MODULE_5__[\"networkState\"].chainNetworkName, walletPassword);\n        if (!verify) {\n            return verify;\n        }\n        const multisigCosignatory = [];\n        const cosignatory = [];\n        for (let [index, cosignKey] of coSign.entries()) {\n            if (cosignKey.length == 64) {\n                cosignatory[index] = tsjs_xpx_chain_sdk__WEBPACK_IMPORTED_MODULE_2__[\"PublicAccount\"].createFromPublicKey(cosignKey, _state_appState__WEBPACK_IMPORTED_MODULE_7__[\"AppState\"].networkType);\n            }\n            else if (cosignKey.length == 40 || cosignKey.length == 46) {\n                // option to accept address\n                let address = tsjs_xpx_chain_sdk__WEBPACK_IMPORTED_MODULE_2__[\"Address\"].createFromRawAddress(cosignKey);\n                try {\n                    let publicKey = yield getPublicKey(address);\n                    cosignatory[index] = tsjs_xpx_chain_sdk__WEBPACK_IMPORTED_MODULE_2__[\"PublicAccount\"].createFromPublicKey(publicKey, _state_appState__WEBPACK_IMPORTED_MODULE_7__[\"AppState\"].networkType);\n                }\n                catch (error) {\n                    console.log(error);\n                }\n            }\n            multisigCosignatory.push(new tsjs_xpx_chain_sdk__WEBPACK_IMPORTED_MODULE_2__[\"MultisigCosignatoryModification\"](tsjs_xpx_chain_sdk__WEBPACK_IMPORTED_MODULE_2__[\"MultisigCosignatoryModificationType\"].Add, cosignatory[index]));\n        }\n        removeCosign.forEach((element, index) => {\n            cosignatory[coSign.length + index] = tsjs_xpx_chain_sdk__WEBPACK_IMPORTED_MODULE_2__[\"PublicAccount\"].createFromPublicKey(element, _state_appState__WEBPACK_IMPORTED_MODULE_7__[\"AppState\"].networkType);\n            multisigCosignatory.push(new tsjs_xpx_chain_sdk__WEBPACK_IMPORTED_MODULE_2__[\"MultisigCosignatoryModification\"](tsjs_xpx_chain_sdk__WEBPACK_IMPORTED_MODULE_2__[\"MultisigCosignatoryModificationType\"].Remove, cosignatory[coSign.length + index]));\n        });\n        let relativeNumApproveTransaction = numApproveTransaction - multisigAccount.multisigInfo.find(element => element.level === 0).minApproval;\n        let relativeNumDeleteUser = numDeleteUser - multisigAccount.multisigInfo.find(element => element.level === 0).minRemoval;\n        const txBuilder = _state_appState__WEBPACK_IMPORTED_MODULE_7__[\"AppState\"].buildTxn;\n        const modifyMultisigTransaction = txBuilder.modifyMultisigAccountBuilder()\n            .minApprovalDelta(relativeNumApproveTransaction)\n            .minRemovalDelta(relativeNumDeleteUser)\n            .modifications(multisigCosignatory)\n            .build();\n        let publicAcc = tsjs_xpx_chain_sdk__WEBPACK_IMPORTED_MODULE_2__[\"PublicAccount\"].createFromPublicKey(multisigAccount.publicKey, _state_appState__WEBPACK_IMPORTED_MODULE_7__[\"AppState\"].networkType);\n        let aggregateBondedTransaction = txBuilder.aggregateBondedBuilder()\n            .innerTransactions([modifyMultisigTransaction.toAggregate(publicAcc)])\n            .build();\n        let initiator = _state_walletState__WEBPACK_IMPORTED_MODULE_4__[\"walletState\"].currentLoggedInWallet.accounts.find(acc => acc.publicKey == selectedCosign);\n        let initiatorPrivateKey = _util_walletUtils__WEBPACK_IMPORTED_MODULE_3__[\"WalletUtils\"].decryptPrivateKey(new tsjs_xpx_chain_sdk__WEBPACK_IMPORTED_MODULE_2__[\"Password\"](walletPassword), initiator.encrypted, initiator.iv);\n        let initiatorAccount = tsjs_xpx_chain_sdk__WEBPACK_IMPORTED_MODULE_2__[\"Account\"].createFromPrivateKey(initiatorPrivateKey, _state_appState__WEBPACK_IMPORTED_MODULE_7__[\"AppState\"].networkType);\n        const signedAggregateBondedTransaction = initiatorAccount.sign(aggregateBondedTransaction, _state_networkState__WEBPACK_IMPORTED_MODULE_5__[\"networkState\"].currentNetworkProfile.generationHash);\n        const lockFundsTransaction = _util_transactionUtils__WEBPACK_IMPORTED_MODULE_6__[\"TransactionUtils\"].lockFundTx(signedAggregateBondedTransaction);\n        const lockFundsTransactionSigned = initiatorAccount.sign(lockFundsTransaction, _state_networkState__WEBPACK_IMPORTED_MODULE_5__[\"networkState\"].currentNetworkProfile.generationHash);\n        _util_transactionUtils__WEBPACK_IMPORTED_MODULE_6__[\"TransactionUtils\"].announceLF_AND_addAutoAnnounceABT(lockFundsTransactionSigned, signedAggregateBondedTransaction);\n        return verify;\n    });\n}\n//level 1 = cosigner\nconst multiSign = Object(vue__WEBPACK_IMPORTED_MODULE_1__[\"readonly\"])({\n    // config,\n    getCosignerInWallet,\n    getPublicKey,\n    generateContact,\n    verifyContactPublicKey,\n    convertAccount,\n    onPartial,\n    checkIsMultiSig,\n    checkHasMultiSig,\n    getMultisigAccountGraphInfo,\n    modifyMultisigAccount,\n    getAggregateFee,\n    /* enableACT */\n});\n\n\n//# sourceURL=webpack:///./src/util/multiSignatory.ts?");

/***/ })

}]);