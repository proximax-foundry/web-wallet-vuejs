(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[55],{

/***/ "./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader-v16/dist/index.js?!./src/components/SelectInputAccount.vue?vue&type=script&lang=js":
/*!**********************************************************************************************************************************************************************!*\
  !*** ./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader-v16/dist??ref--0-1!./src/components/SelectInputAccount.vue?vue&type=script&lang=js ***!
  \**********************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _state_networkState__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @/state/networkState */ \"./src/state/networkState.ts\");\n/* harmony import */ var _state_utils_networkStateUtils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/state/utils/networkStateUtils */ \"./src/state/utils/networkStateUtils.ts\");\n/* harmony import */ var _state_walletState__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/state/walletState */ \"./src/state/walletState.ts\");\n/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! vue */ \"./node_modules/vue/dist/vue.runtime.esm-bundler.js\");\n/* harmony import */ var jdenticon__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! jdenticon */ \"./node_modules/jdenticon/dist/jdenticon-module.mjs\");\n/* harmony import */ var _models_stores_themeStyleConfig__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @/models/stores/themeStyleConfig */ \"./src/models/stores/themeStyleConfig.ts\");\n\n\n\n\n\n\n\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (Object(vue__WEBPACK_IMPORTED_MODULE_3__[\"defineComponent\"])({\n  emits:[\n    'select-account','update:modelValue',\n  ],\n  name: 'SelectInputAccountOutgoingSwap',\n  props: [\n    'modelValue',\n    'selectDefault',\n    'placeholder',\n  ],\n\n  setup(p){\n    const toggleSelection = Object(vue__WEBPACK_IMPORTED_MODULE_3__[\"ref\"])(false);\n\n    let themeConfig = new _models_stores_themeStyleConfig__WEBPACK_IMPORTED_MODULE_5__[\"ThemeStyleConfig\"]('ThemeStyleConfig');\n    themeConfig.init();\n    let jdenticonConfig = themeConfig.jdenticonConfig;\n\n    const accounts = Object(vue__WEBPACK_IMPORTED_MODULE_3__[\"computed\"])(() =>{\n      var accountList = [];\n      const concatOther = _state_walletState__WEBPACK_IMPORTED_MODULE_2__[\"walletState\"].currentLoggedInWallet?_state_walletState__WEBPACK_IMPORTED_MODULE_2__[\"walletState\"].currentLoggedInWallet.accounts.concat(_state_walletState__WEBPACK_IMPORTED_MODULE_2__[\"walletState\"].currentLoggedInWallet.others): []\n      concatOther.forEach(account => {\n        accountList.push({\n          value: account.address,\n          label: account.name,\n        });\n      });\n      // accountList.sort((a, b) => {\n      //   if (a.label > b.label) return 1;\n      //   if (a.label < b.label) return -1;\n      //   return 0;\n      // });\n      return accountList;\n    });\n\n    const selectedAccount = Object(vue__WEBPACK_IMPORTED_MODULE_3__[\"ref\"])(accounts.value.length>0?accounts.value.find(acc => acc.value == p.selectDefault).label:'');\n    const selectedAddress = Object(vue__WEBPACK_IMPORTED_MODULE_3__[\"ref\"])(p.selectDefault);\n    const selectedImg = Object(vue__WEBPACK_IMPORTED_MODULE_3__[\"ref\"])(Object(jdenticon__WEBPACK_IMPORTED_MODULE_4__[\"toSvg\"])(p.selectDefault, 25, jdenticonConfig));\n    const selectAccount = (accountName, accountAddress) => {\n      selectedAccount.value = accountName;\n      selectedAddress.value = accountAddress;\n      selectedImg.value = Object(jdenticon__WEBPACK_IMPORTED_MODULE_4__[\"toSvg\"])(accountAddress, 25, jdenticonConfig);\n      toggleSelection.value = !toggleSelection.value;\n    };\n\n    return {\n      selectAccount,\n      selectedAddress,\n      selectedImg,\n      accounts,\n      toggleSelection,\n      selectedAccount,\n      jdenticonConfig,\n      toSvg: jdenticon__WEBPACK_IMPORTED_MODULE_4__[\"toSvg\"]\n    };\n  }\n}));\n\n\n//# sourceURL=webpack:///./src/components/SelectInputAccount.vue?./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader-v16/dist??ref--0-1");

/***/ }),

/***/ "./node_modules/vue-loader-v16/dist/templateLoader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader-v16/dist/index.js?!./src/components/SelectInputAccount.vue?vue&type=template&id=17d1c662":
/*!*****************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader-v16/dist/templateLoader.js??ref--6!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader-v16/dist??ref--0-1!./src/components/SelectInputAccount.vue?vue&type=template&id=17d1c662 ***!
  \*****************************************************************************************************************************************************************************************************************************************/
/*! exports provided: render */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"render\", function() { return render; });\n/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ \"./node_modules/vue/dist/vue.runtime.esm-bundler.js\");\n\n\nconst _hoisted_1 = { class: \"flex\" }\nconst _hoisted_2 = [\"innerHTML\"]\nconst _hoisted_3 = [\"innerHTML\"]\nconst _hoisted_4 = { class: \"flex flex-col ml-2 text-left\" }\nconst _hoisted_5 = {\n  class: \"text-blue-primary font-semibold text-xxs uppercase\",\n  style: {\"line-height\":\"9px\"}\n}\nconst _hoisted_6 = {\n  key: 0,\n  class: \"mt-1 text-tsm font-bold\"\n}\nconst _hoisted_7 = {\n  key: 1,\n  class: \"text-tsm font-bold uppercase\"\n}\nconst _hoisted_8 = {\n  key: 2,\n  class: \"text-xxs ml-auto cursor-pointer text-blue-primary font-semibold mt-auto mb-auto\"\n}\nconst _hoisted_9 = {\n  key: 3,\n  class: \"text-xxs ml-auto cursor-pointer text-blue-primary font-semibold mt-auto mb-auto\"\n}\nconst _hoisted_10 = { class: \"relative\" }\nconst _hoisted_11 = {\n  key: 0,\n  class: \"absolute border border-t-0 w-full z-50 bg-white max-h-40 overflow-auto px-3 filter drop-shodow-xl\"\n}\nconst _hoisted_12 = {\n  key: 0,\n  class: \"pl-2 pt-4 text-xxs text-gray-400 uppercase\"\n}\nconst _hoisted_13 = {\n  key: 1,\n  class: \"text-xxs pt-2 pl-2 pb-2\"\n}\nconst _hoisted_14 = [\"onClick\"]\nconst _hoisted_15 = [\"innerHTML\"]\nconst _hoisted_16 = { class: \"text-xs ml-2 font-semibold\" }\nconst _hoisted_17 = {\n  key: 0,\n  class: \"cursor-pointer text-blue-primary text-xxs mt-0.5 ml-auto font-semibold uppercase\"\n}\nconst _hoisted_18 = {\n  key: 1,\n  class: \"text-gray-500 text-xxs mt-0.5 ml-auto uppercase\"\n}\n\nfunction render(_ctx, _cache, $props, $setup, $data, $options) {\n  return (Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"openBlock\"])(), Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createElementBlock\"])(vue__WEBPACK_IMPORTED_MODULE_0__[\"Fragment\"], null, [\n    Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createElementVNode\"])(\"div\", {\n      onClick: _cache[0] || (_cache[0] = $event => (_ctx.toggleSelection = !_ctx.toggleSelection)),\n      class: \"border ml-auto mr-auto py-3 px-2 cursor-pointer rounded-md\"\n    }, [\n      Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createElementVNode\"])(\"div\", _hoisted_1, [\n        (!_ctx.selectedImg)\n          ? (Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"openBlock\"])(), Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createElementBlock\"])(\"div\", {\n              key: 0,\n              innerHTML: _ctx.toSvg('account', 25, _ctx.jdenticonConfig)\n            }, null, 8 /* PROPS */, _hoisted_2))\n          : (Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"openBlock\"])(), Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createElementBlock\"])(\"div\", {\n              key: 1,\n              innerHTML: _ctx.selectedImg\n            }, null, 8 /* PROPS */, _hoisted_3)),\n        Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createElementVNode\"])(\"div\", _hoisted_4, [\n          Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createElementVNode\"])(\"div\", _hoisted_5, Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"toDisplayString\"])(_ctx.placeholder?_ctx.placeholder:_ctx.$t('general.account')), 1 /* TEXT */),\n          (_ctx.selectedAccount!=\"\")\n            ? (Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"openBlock\"])(), Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createElementBlock\"])(\"div\", _hoisted_6, Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"toDisplayString\"])(_ctx.selectedAccount), 1 /* TEXT */))\n            : (Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"openBlock\"])(), Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createElementBlock\"])(\"div\", _hoisted_7, Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"toDisplayString\"])(_ctx.$t('general.selectAccount')), 1 /* TEXT */))\n        ]),\n        (!_ctx.toggleSelection && _ctx.selectedAccount==\"\")\n          ? (Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"openBlock\"])(), Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createElementBlock\"])(\"div\", _hoisted_8, Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"toDisplayString\"])(_ctx.$t('general.select')), 1 /* TEXT */))\n          : Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createCommentVNode\"])(\"v-if\", true),\n        (!_ctx.toggleSelection && _ctx.selectedAccount!=\"\")\n          ? (Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"openBlock\"])(), Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createElementBlock\"])(\"div\", _hoisted_9, Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"toDisplayString\"])(_ctx.$t('general.change')), 1 /* TEXT */))\n          : Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createCommentVNode\"])(\"v-if\", true)\n      ])\n    ]),\n    Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createElementVNode\"])(\"div\", _hoisted_10, [\n      (_ctx.toggleSelection)\n        ? (Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"openBlock\"])(), Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createElementBlock\"])(\"div\", _hoisted_11, [\n            (_ctx.accounts.length>0)\n              ? (Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"openBlock\"])(), Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createElementBlock\"])(\"div\", _hoisted_12, Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"toDisplayString\"])(_ctx.$t('general.selectAccount')), 1 /* TEXT */))\n              : (Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"openBlock\"])(), Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createElementBlock\"])(\"div\", _hoisted_13, Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"toDisplayString\"])(_ctx.$t('general.listEmpty')), 1 /* TEXT */)),\n            (Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"openBlock\"])(true), Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createElementBlock\"])(vue__WEBPACK_IMPORTED_MODULE_0__[\"Fragment\"], null, Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"renderList\"])(_ctx.accounts, (items, index) => {\n              return (Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"openBlock\"])(), Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createElementBlock\"])(\"div\", {\n                key: items,\n                class: Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"normalizeClass\"])([\"px-2 py-3 flex cursor-pointer items-center\", `${(index != _ctx.accounts.length - 1)?\"border-b border-gray-200\":\"\"}`]),\n                onClick: $event => {_ctx.selectAccount(items.label, items.value);_ctx.$emit('update:modelValue', _ctx.selectedAddress);_ctx.$emit('select-account', _ctx.selectedAddress);}\n              }, [\n                Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createElementVNode\"])(\"div\", {\n                  innerHTML: _ctx.toSvg(items.value, 20, _ctx.jdenticonConfig)\n                }, null, 8 /* PROPS */, _hoisted_15),\n                Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createElementVNode\"])(\"div\", _hoisted_16, Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"toDisplayString\"])(items.label), 1 /* TEXT */),\n                (items.label!=_ctx.selectedAccount)\n                  ? (Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"openBlock\"])(), Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createElementBlock\"])(\"div\", _hoisted_17, Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"toDisplayString\"])(_ctx.$t('general.select')), 1 /* TEXT */))\n                  : (Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"openBlock\"])(), Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createElementBlock\"])(\"div\", _hoisted_18, Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"toDisplayString\"])(_ctx.$t('general.current')), 1 /* TEXT */))\n              ], 10 /* CLASS, PROPS */, _hoisted_14))\n            }), 128 /* KEYED_FRAGMENT */))\n          ]))\n        : Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createCommentVNode\"])(\"v-if\", true)\n    ])\n  ], 64 /* STABLE_FRAGMENT */))\n}\n\n//# sourceURL=webpack:///./src/components/SelectInputAccount.vue?./node_modules/vue-loader-v16/dist/templateLoader.js??ref--6!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader-v16/dist??ref--0-1");

/***/ }),

/***/ "./src/components/SelectInputAccount.vue":
/*!***********************************************!*\
  !*** ./src/components/SelectInputAccount.vue ***!
  \***********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _SelectInputAccount_vue_vue_type_template_id_17d1c662__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./SelectInputAccount.vue?vue&type=template&id=17d1c662 */ \"./src/components/SelectInputAccount.vue?vue&type=template&id=17d1c662\");\n/* harmony import */ var _SelectInputAccount_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./SelectInputAccount.vue?vue&type=script&lang=js */ \"./src/components/SelectInputAccount.vue?vue&type=script&lang=js\");\n/* empty/unused harmony star reexport *//* harmony import */ var _home_runner_work_web_wallet_vuejs_web_wallet_vuejs_node_modules_vue_loader_v16_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./node_modules/vue-loader-v16/dist/exportHelper.js */ \"./node_modules/vue-loader-v16/dist/exportHelper.js\");\n/* harmony import */ var _home_runner_work_web_wallet_vuejs_web_wallet_vuejs_node_modules_vue_loader_v16_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_home_runner_work_web_wallet_vuejs_web_wallet_vuejs_node_modules_vue_loader_v16_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2__);\n\n\n\n\n\nconst __exports__ = /*#__PURE__*/_home_runner_work_web_wallet_vuejs_web_wallet_vuejs_node_modules_vue_loader_v16_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2___default()(_SelectInputAccount_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"], [['render',_SelectInputAccount_vue_vue_type_template_id_17d1c662__WEBPACK_IMPORTED_MODULE_0__[\"render\"]],['__file',\"src/components/SelectInputAccount.vue\"]])\n/* hot reload */\nif (false) {}\n\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (__exports__);\n\n//# sourceURL=webpack:///./src/components/SelectInputAccount.vue?");

/***/ }),

/***/ "./src/components/SelectInputAccount.vue?vue&type=script&lang=js":
/*!***********************************************************************!*\
  !*** ./src/components/SelectInputAccount.vue?vue&type=script&lang=js ***!
  \***********************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_v16_dist_index_js_ref_0_1_SelectInputAccount_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/cache-loader/dist/cjs.js??ref--0-0!../../node_modules/vue-loader-v16/dist??ref--0-1!./SelectInputAccount.vue?vue&type=script&lang=js */ \"./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader-v16/dist/index.js?!./src/components/SelectInputAccount.vue?vue&type=script&lang=js\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return _node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_v16_dist_index_js_ref_0_1_SelectInputAccount_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"]; });\n\n/* empty/unused harmony star reexport */ \n\n//# sourceURL=webpack:///./src/components/SelectInputAccount.vue?");

/***/ }),

/***/ "./src/components/SelectInputAccount.vue?vue&type=template&id=17d1c662":
/*!*****************************************************************************!*\
  !*** ./src/components/SelectInputAccount.vue?vue&type=template&id=17d1c662 ***!
  \*****************************************************************************/
/*! exports provided: render */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _node_modules_vue_loader_v16_dist_templateLoader_js_ref_6_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_v16_dist_index_js_ref_0_1_SelectInputAccount_vue_vue_type_template_id_17d1c662__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/vue-loader-v16/dist/templateLoader.js??ref--6!../../node_modules/cache-loader/dist/cjs.js??ref--0-0!../../node_modules/vue-loader-v16/dist??ref--0-1!./SelectInputAccount.vue?vue&type=template&id=17d1c662 */ \"./node_modules/vue-loader-v16/dist/templateLoader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader-v16/dist/index.js?!./src/components/SelectInputAccount.vue?vue&type=template&id=17d1c662\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"render\", function() { return _node_modules_vue_loader_v16_dist_templateLoader_js_ref_6_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_v16_dist_index_js_ref_0_1_SelectInputAccount_vue_vue_type_template_id_17d1c662__WEBPACK_IMPORTED_MODULE_0__[\"render\"]; });\n\n\n\n//# sourceURL=webpack:///./src/components/SelectInputAccount.vue?");

/***/ })

}]);