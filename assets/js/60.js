(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[60],{

/***/ "./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist/templateLoader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist/index.js?!./src/components/SelectInputAccount.vue?vue&type=template&id=17d1c662":
/*!*****************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist/templateLoader.js??ref--6!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist??ref--0-1!./src/components/SelectInputAccount.vue?vue&type=template&id=17d1c662 ***!
  \*****************************************************************************************************************************************************************************************************************************************************************************************************/
/*! exports provided: render */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"render\", function() { return render; });\n/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ \"./node_modules/vue/dist/vue.runtime.esm-bundler.js\");\n\n\nconst _hoisted_1 = {\n  key: 0,\n  class: \"account-item-value account-item\"\n}\nconst _hoisted_2 = { class: \"flex\" }\nconst _hoisted_3 = [\"innerHTML\"]\nconst _hoisted_4 = { class: \"flex flex-col ml-2 text-left\" }\nconst _hoisted_5 = {\n  class: \"text-blue-primary font-semibold text-xxs uppercase\",\n  style: {\"line-height\":\"9px\"}\n}\nconst _hoisted_6 = { class: \"mt-1 text-tsm font-bold\" }\nconst _hoisted_7 = { class: \"account-item\" }\nconst _hoisted_8 = { class: \"flex\" }\nconst _hoisted_9 = [\"innerHTML\"]\nconst _hoisted_10 = { class: \"text-xs ml-2 font-semibold\" }\n\nfunction render(_ctx, _cache, $props, $setup, $data, $options) {\n  const _component_Dropdown = Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"resolveComponent\"])(\"Dropdown\")\n\n  return (Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"openBlock\"])(), Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createElementBlock\"])(\"div\", null, [\n    Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createVNode\"])(_component_Dropdown, {\n      modelValue: _ctx.selectedAccountInfo,\n      \"onUpdate:modelValue\": _cache[0] || (_cache[0] = $event => ((_ctx.selectedAccountInfo) = $event)),\n      style: {'width':'100%'},\n      options: _ctx.filteredAccounts,\n      filter: true,\n      optionLabel: \"label\",\n      emptyFilterMessage: \" \",\n      onChange: _cache[1] || (_cache[1] = $event => {_ctx.selectAccount($event.value.label, $event.value.value);_ctx.$emit('update:modelValue', $event.value.value);_ctx.$emit('select-account', $event.value.value);})\n    }, {\n      value: Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"withCtx\"])((slotProps) => [\n        (slotProps.value)\n          ? (Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"openBlock\"])(), Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createElementBlock\"])(\"div\", _hoisted_1, [\n              Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createElementVNode\"])(\"div\", _hoisted_2, [\n                Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createElementVNode\"])(\"div\", { innerHTML: _ctx.selectedImg }, null, 8 /* PROPS */, _hoisted_3),\n                Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createElementVNode\"])(\"div\", _hoisted_4, [\n                  Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createElementVNode\"])(\"div\", _hoisted_5, Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"toDisplayString\"])(_ctx.$t('transfer.transferFrom')), 1 /* TEXT */),\n                  Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createElementVNode\"])(\"div\", _hoisted_6, Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"toDisplayString\"])(slotProps.value.label), 1 /* TEXT */)\n                ])\n              ])\n            ]))\n          : Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createCommentVNode\"])(\"v-if\", true)\n      ]),\n      option: Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"withCtx\"])((slotProps) => [\n        Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createElementVNode\"])(\"div\", _hoisted_7, [\n          Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createElementVNode\"])(\"div\", _hoisted_8, [\n            Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createElementVNode\"])(\"div\", {\n              innerHTML: _ctx.toSvg(slotProps.option.value, 20, _ctx.jdenticonConfig)\n            }, null, 8 /* PROPS */, _hoisted_9),\n            Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createElementVNode\"])(\"div\", _hoisted_10, Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"toDisplayString\"])(slotProps.option.label), 1 /* TEXT */)\n          ])\n        ])\n      ]),\n      _: 1 /* STABLE */\n    }, 8 /* PROPS */, [\"modelValue\", \"options\"])\n  ]))\n}\n\n//# sourceURL=webpack:///./src/components/SelectInputAccount.vue?./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist/templateLoader.js??ref--6!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist??ref--0-1");

/***/ }),

/***/ "./node_modules/cache-loader/dist/cjs.js?!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist/index.js?!./src/components/SelectInputAccount.vue?vue&type=script&lang=js":
/*!****************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist??ref--0-1!./src/components/SelectInputAccount.vue?vue&type=script&lang=js ***!
  \****************************************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _state_walletState__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @/state/walletState */ \"./src/state/walletState.ts\");\n/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! vue */ \"./node_modules/vue/dist/vue.runtime.esm-bundler.js\");\n/* harmony import */ var jdenticon__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! jdenticon */ \"./node_modules/jdenticon/dist/jdenticon-module.mjs\");\n/* harmony import */ var _models_stores_themeStyleConfig__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @/models/stores/themeStyleConfig */ \"./src/models/stores/themeStyleConfig.ts\");\n\n\n\n\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (Object(vue__WEBPACK_IMPORTED_MODULE_1__[\"defineComponent\"])({\nname: 'SelectInputAccount',\nemits:[\n    'select-account','update:modelValue',\n  ],\nprops: [\n    'modelValue',\n    'selectDefault'\n  ],\nsetup(p){\n    const toggleSelection = Object(vue__WEBPACK_IMPORTED_MODULE_1__[\"ref\"])(false);\n    const internalInstance = Object(vue__WEBPACK_IMPORTED_MODULE_1__[\"getCurrentInstance\"])();\n    const emitter = internalInstance.appContext.config.globalProperties.emitter;\n    let themeConfig = new _models_stores_themeStyleConfig__WEBPACK_IMPORTED_MODULE_3__[\"ThemeStyleConfig\"]('ThemeStyleConfig');\n    themeConfig.init();\n    let jdenticonConfig = themeConfig.jdenticonConfig;\n    const accounts = Object(vue__WEBPACK_IMPORTED_MODULE_1__[\"computed\"])(() =>{\n      if(_state_walletState__WEBPACK_IMPORTED_MODULE_0__[\"walletState\"].currentLoggedInWallet){\n        var accountList = [];\n        const concatOther = _state_walletState__WEBPACK_IMPORTED_MODULE_0__[\"walletState\"].currentLoggedInWallet.accounts.concat(_state_walletState__WEBPACK_IMPORTED_MODULE_0__[\"walletState\"].currentLoggedInWallet.others)\n        concatOther.forEach(account => {\n          accountList.push({\n            value: account.address,\n            label: _state_walletState__WEBPACK_IMPORTED_MODULE_0__[\"walletState\"].currentLoggedInWallet.convertAddressToName(account.address,true)\n          });\n        });\n        \n        return accountList;\n      }else{\n        return []\n      }\n      \n    });\n    const selectedAccount = Object(vue__WEBPACK_IMPORTED_MODULE_1__[\"ref\"])(accounts.value.length?accounts.value.find(acc => acc.value == p.selectDefault).label:'');\n    const selectedAddress = Object(vue__WEBPACK_IMPORTED_MODULE_1__[\"ref\"])(p.selectDefault);\n    const selectedAccountInfo = {label : selectedAccount.value, value: selectedAddress.value}\n    const selectedImg = Object(vue__WEBPACK_IMPORTED_MODULE_1__[\"ref\"])(Object(jdenticon__WEBPACK_IMPORTED_MODULE_2__[\"toSvg\"])(p.selectDefault, 25, jdenticonConfig));\n    const selectAccount = (accountName, accountAddress) => {\n      emitter.emit(\"select-account\",accountAddress)\n      selectedAccount.value,selectedAccountInfo.label = accountName;\n      selectedAddress.value,selectedAccountInfo.value = accountAddress;\n      selectedImg.value = Object(jdenticon__WEBPACK_IMPORTED_MODULE_2__[\"toSvg\"])(accountAddress, 25, jdenticonConfig);\n      toggleSelection.value = !toggleSelection.value;\n    };\n    const filterQuery = Object(vue__WEBPACK_IMPORTED_MODULE_1__[\"ref\"])(\"\");\n    const filteredAccounts = Object(vue__WEBPACK_IMPORTED_MODULE_1__[\"computed\"])(() => {\n      const query = filterQuery.value.toLowerCase();\n      if(filterQuery.value == \"\"){\n        return accounts.value;\n      }\n      return accounts.value.filter((items) =>{\n        return Object.values(items).some((word) =>\n          String(word).toLowerCase().includes(query));\n      });\n    });\n    return {\n      selectAccount,\n      selectedAddress,\n      selectedAccountInfo,\n      selectedImg,\n      accounts,\n      toggleSelection,\n      selectedAccount,\n      jdenticonConfig,\n      toSvg: jdenticon__WEBPACK_IMPORTED_MODULE_2__[\"toSvg\"],\n      filterQuery,\n      filteredAccounts\n    };\n}\n}));\n\n\n//# sourceURL=webpack:///./src/components/SelectInputAccount.vue?./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist??ref--0-1");

/***/ }),

/***/ "./src/components/SelectInputAccount.vue":
/*!***********************************************!*\
  !*** ./src/components/SelectInputAccount.vue ***!
  \***********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _SelectInputAccount_vue_vue_type_template_id_17d1c662__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./SelectInputAccount.vue?vue&type=template&id=17d1c662 */ \"./src/components/SelectInputAccount.vue?vue&type=template&id=17d1c662\");\n/* harmony import */ var _SelectInputAccount_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./SelectInputAccount.vue?vue&type=script&lang=js */ \"./src/components/SelectInputAccount.vue?vue&type=script&lang=js\");\n/* empty/unused harmony star reexport *//* harmony import */ var _home_runner_work_web_wallet_vuejs_web_wallet_vuejs_node_modules_vue_cli_service_node_modules_vue_loader_v16_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist/exportHelper.js */ \"./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist/exportHelper.js\");\n/* harmony import */ var _home_runner_work_web_wallet_vuejs_web_wallet_vuejs_node_modules_vue_cli_service_node_modules_vue_loader_v16_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_home_runner_work_web_wallet_vuejs_web_wallet_vuejs_node_modules_vue_cli_service_node_modules_vue_loader_v16_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2__);\n\n\n\n\n\nconst __exports__ = /*#__PURE__*/_home_runner_work_web_wallet_vuejs_web_wallet_vuejs_node_modules_vue_cli_service_node_modules_vue_loader_v16_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2___default()(_SelectInputAccount_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"], [['render',_SelectInputAccount_vue_vue_type_template_id_17d1c662__WEBPACK_IMPORTED_MODULE_0__[\"render\"]],['__file',\"src/components/SelectInputAccount.vue\"]])\n/* hot reload */\nif (false) {}\n\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (__exports__);\n\n//# sourceURL=webpack:///./src/components/SelectInputAccount.vue?");

/***/ }),

/***/ "./src/components/SelectInputAccount.vue?vue&type=script&lang=js":
/*!***********************************************************************!*\
  !*** ./src/components/SelectInputAccount.vue?vue&type=script&lang=js ***!
  \***********************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_cli_service_node_modules_vue_loader_v16_dist_index_js_ref_0_1_SelectInputAccount_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/cache-loader/dist/cjs.js??ref--0-0!../../node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist??ref--0-1!./SelectInputAccount.vue?vue&type=script&lang=js */ \"./node_modules/cache-loader/dist/cjs.js?!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist/index.js?!./src/components/SelectInputAccount.vue?vue&type=script&lang=js\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return _node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_cli_service_node_modules_vue_loader_v16_dist_index_js_ref_0_1_SelectInputAccount_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"]; });\n\n/* empty/unused harmony star reexport */ \n\n//# sourceURL=webpack:///./src/components/SelectInputAccount.vue?");

/***/ }),

/***/ "./src/components/SelectInputAccount.vue?vue&type=template&id=17d1c662":
/*!*****************************************************************************!*\
  !*** ./src/components/SelectInputAccount.vue?vue&type=template&id=17d1c662 ***!
  \*****************************************************************************/
/*! exports provided: render */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _node_modules_vue_cli_service_node_modules_vue_loader_v16_dist_templateLoader_js_ref_6_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_cli_service_node_modules_vue_loader_v16_dist_index_js_ref_0_1_SelectInputAccount_vue_vue_type_template_id_17d1c662__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist/templateLoader.js??ref--6!../../node_modules/cache-loader/dist/cjs.js??ref--0-0!../../node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist??ref--0-1!./SelectInputAccount.vue?vue&type=template&id=17d1c662 */ \"./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist/templateLoader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist/index.js?!./src/components/SelectInputAccount.vue?vue&type=template&id=17d1c662\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"render\", function() { return _node_modules_vue_cli_service_node_modules_vue_loader_v16_dist_templateLoader_js_ref_6_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_cli_service_node_modules_vue_loader_v16_dist_index_js_ref_0_1_SelectInputAccount_vue_vue_type_template_id_17d1c662__WEBPACK_IMPORTED_MODULE_0__[\"render\"]; });\n\n\n\n//# sourceURL=webpack:///./src/components/SelectInputAccount.vue?");

/***/ })

}]);