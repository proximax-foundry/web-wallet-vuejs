(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[66],{

/***/ "./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader-v16/dist/index.js?!./src/modules/account/views/ViewOtherAccount.vue?vue&type=script&lang=js":
/*!*******************************************************************************************************************************************************************************!*\
  !*** ./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader-v16/dist??ref--0-1!./src/modules/account/views/ViewOtherAccount.vue?vue&type=script&lang=js ***!
  \*******************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ \"./node_modules/vue/dist/vue.runtime.esm-bundler.js\");\n/* harmony import */ var _modules_account_components_AccountTile_vue__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/modules/account/components/AccountTile.vue */ \"./src/modules/account/components/AccountTile.vue\");\n/* harmony import */ var primevue_usetoast__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! primevue/usetoast */ \"./node_modules/primevue/usetoast/usetoast.esm.js\");\n/* harmony import */ var _state_walletState__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @/state/walletState */ \"./src/state/walletState.ts\");\n/* harmony import */ var _util_walletUtils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @/util/walletUtils */ \"./src/util/walletUtils.ts\");\n/* harmony import */ var _state_networkState__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @/state/networkState */ \"./src/state/networkState.ts\");\n\n\n\n\n\n\n\n\n\n/* harmony default export */ __webpack_exports__[\"default\"] = ({\n  name: 'ViewOtherAccount',\n  components: {\n    AccountTile: _modules_account_components_AccountTile_vue__WEBPACK_IMPORTED_MODULE_1__[\"default\"],\n  },\n\n  setup() {\n\n    const accounts = Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"computed\"])(\n      () => {\n        if(_state_walletState__WEBPACK_IMPORTED_MODULE_3__[\"walletState\"].currentLoggedInWallet.others){\n            return _state_walletState__WEBPACK_IMPORTED_MODULE_3__[\"walletState\"].currentLoggedInWallet.others;\n        } else{\n          return null;\n        }\n      }\n    );\n   \n    return {\n      accounts,\n    };\n  },\n});\n\n\n//# sourceURL=webpack:///./src/modules/account/views/ViewOtherAccount.vue?./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader-v16/dist??ref--0-1");

/***/ }),

/***/ "./node_modules/vue-loader-v16/dist/templateLoader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader-v16/dist/index.js?!./src/modules/account/views/ViewOtherAccount.vue?vue&type=template&id=7ac10a26":
/*!**************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader-v16/dist/templateLoader.js??ref--6!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader-v16/dist??ref--0-1!./src/modules/account/views/ViewOtherAccount.vue?vue&type=template&id=7ac10a26 ***!
  \**************************************************************************************************************************************************************************************************************************************************/
/*! exports provided: render */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"render\", function() { return render; });\n/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ \"./node_modules/vue/dist/vue.runtime.esm-bundler.js\");\n\n\nconst _hoisted_1 = { class: \"mt-4 w-11/12 ml-auto mr-auto\" }\nconst _hoisted_2 = { class: \"flex text-xxs md:text-xs font-semibold border-b-2\" }\nconst _hoisted_3 = {\n  class: \"text-center border-b-2 pb-4 lg:pb-3 border-yellow-500\",\n  style: {\"width\":\"8rem\"}\n}\nconst _hoisted_4 = { class: \"my-4 w-11/12 ml-auto mr-auto\" }\nconst _hoisted_5 = { class: \"float-right mb-4 text-center w-44 text-white bg-blue-primary rounded-md font-semibold text-xs p-2\" }\nconst _hoisted_6 = { class: \"mt-2 py-3\" }\nconst _hoisted_7 = { class: \"w-11/12 ml-auto mr-auto flex flex-col gap-3\" }\n\nfunction render(_ctx, _cache, $props, $setup, $data, $options) {\n  const _component_router_link = Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"resolveComponent\"])(\"router-link\")\n  const _component_AccountTile = Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"resolveComponent\"])(\"AccountTile\")\n\n  return (Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"openBlock\"])(), Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createElementBlock\"])(\"div\", null, [\n    Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createElementVNode\"])(\"div\", _hoisted_1, [\n      Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createElementVNode\"])(\"div\", _hoisted_2, [\n        Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createVNode\"])(_component_router_link, {\n          to: { name: 'ViewAccountDisplayAll'},\n          class: \"w-18 text-center\"\n        }, {\n          default: Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"withCtx\"])(() => [\n            Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createTextVNode\"])(Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"toDisplayString\"])(_ctx.$t('general.overview')), 1 /* TEXT */)\n          ]),\n          _: 1 /* STABLE */\n        }),\n        Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createVNode\"])(_component_router_link, {\n          to: { name: 'ViewNormalAccount'},\n          class: \"w-28 text-center\",\n          style: {\"width\":\"6.5rem\"}\n        }, {\n          default: Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"withCtx\"])(() => [\n            Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createTextVNode\"])(Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"toDisplayString\"])(_ctx.$t('account.myAcc')), 1 /* TEXT */)\n          ]),\n          _: 1 /* STABLE */\n        }),\n        Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createVNode\"])(_component_router_link, {\n          to: { name: 'ViewMultisigAccount'},\n          class: \"text-center\",\n          style: {\"width\":\"9rem\"}\n        }, {\n          default: Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"withCtx\"])(() => [\n            Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createTextVNode\"])(Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"toDisplayString\"])(_ctx.$t('account.multisigAcc')), 1 /* TEXT */)\n          ]),\n          _: 1 /* STABLE */\n        }),\n        Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createElementVNode\"])(\"div\", _hoisted_3, Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"toDisplayString\"])(_ctx.$t('account.otherAcc')), 1 /* TEXT */)\n      ])\n    ]),\n    Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createElementVNode\"])(\"div\", _hoisted_4, [\n      Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createVNode\"])(_component_router_link, { to: {name:'ViewAccountCreateSelectType'} }, {\n        default: Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"withCtx\"])(() => [\n          Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createElementVNode\"])(\"div\", _hoisted_5, \"+ \" + Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"toDisplayString\"])(_ctx.$t('general.createNewAcc')), 1 /* TEXT */)\n        ]),\n        _: 1 /* STABLE */\n      })\n    ]),\n    Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createElementVNode\"])(\"div\", _hoisted_6, [\n      Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createElementVNode\"])(\"div\", _hoisted_7, [\n        (Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"openBlock\"])(true), Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createElementBlock\"])(vue__WEBPACK_IMPORTED_MODULE_0__[\"Fragment\"], null, Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"renderList\"])($setup.accounts, (item, index) => {\n          return (Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"openBlock\"])(), Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createBlock\"])(_component_AccountTile, {\n            key: index,\n            account: item\n          }, null, 8 /* PROPS */, [\"account\"]))\n        }), 128 /* KEYED_FRAGMENT */))\n      ])\n    ])\n  ]))\n}\n\n//# sourceURL=webpack:///./src/modules/account/views/ViewOtherAccount.vue?./node_modules/vue-loader-v16/dist/templateLoader.js??ref--6!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader-v16/dist??ref--0-1");

/***/ }),

/***/ "./src/modules/account/views/ViewOtherAccount.vue":
/*!********************************************************!*\
  !*** ./src/modules/account/views/ViewOtherAccount.vue ***!
  \********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _ViewOtherAccount_vue_vue_type_template_id_7ac10a26__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ViewOtherAccount.vue?vue&type=template&id=7ac10a26 */ \"./src/modules/account/views/ViewOtherAccount.vue?vue&type=template&id=7ac10a26\");\n/* harmony import */ var _ViewOtherAccount_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ViewOtherAccount.vue?vue&type=script&lang=js */ \"./src/modules/account/views/ViewOtherAccount.vue?vue&type=script&lang=js\");\n/* empty/unused harmony star reexport *//* harmony import */ var _home_runner_work_web_wallet_vuejs_web_wallet_vuejs_node_modules_vue_loader_v16_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./node_modules/vue-loader-v16/dist/exportHelper.js */ \"./node_modules/vue-loader-v16/dist/exportHelper.js\");\n/* harmony import */ var _home_runner_work_web_wallet_vuejs_web_wallet_vuejs_node_modules_vue_loader_v16_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_home_runner_work_web_wallet_vuejs_web_wallet_vuejs_node_modules_vue_loader_v16_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2__);\n\n\n\n\n\nconst __exports__ = /*#__PURE__*/_home_runner_work_web_wallet_vuejs_web_wallet_vuejs_node_modules_vue_loader_v16_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2___default()(_ViewOtherAccount_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"], [['render',_ViewOtherAccount_vue_vue_type_template_id_7ac10a26__WEBPACK_IMPORTED_MODULE_0__[\"render\"]],['__file',\"src/modules/account/views/ViewOtherAccount.vue\"]])\n/* hot reload */\nif (false) {}\n\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (__exports__);\n\n//# sourceURL=webpack:///./src/modules/account/views/ViewOtherAccount.vue?");

/***/ }),

/***/ "./src/modules/account/views/ViewOtherAccount.vue?vue&type=script&lang=js":
/*!********************************************************************************!*\
  !*** ./src/modules/account/views/ViewOtherAccount.vue?vue&type=script&lang=js ***!
  \********************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_v16_dist_index_js_ref_0_1_ViewOtherAccount_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/cache-loader/dist/cjs.js??ref--0-0!../../../../node_modules/vue-loader-v16/dist??ref--0-1!./ViewOtherAccount.vue?vue&type=script&lang=js */ \"./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader-v16/dist/index.js?!./src/modules/account/views/ViewOtherAccount.vue?vue&type=script&lang=js\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return _node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_v16_dist_index_js_ref_0_1_ViewOtherAccount_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"]; });\n\n/* empty/unused harmony star reexport */ \n\n//# sourceURL=webpack:///./src/modules/account/views/ViewOtherAccount.vue?");

/***/ }),

/***/ "./src/modules/account/views/ViewOtherAccount.vue?vue&type=template&id=7ac10a26":
/*!**************************************************************************************!*\
  !*** ./src/modules/account/views/ViewOtherAccount.vue?vue&type=template&id=7ac10a26 ***!
  \**************************************************************************************/
/*! exports provided: render */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _node_modules_vue_loader_v16_dist_templateLoader_js_ref_6_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_v16_dist_index_js_ref_0_1_ViewOtherAccount_vue_vue_type_template_id_7ac10a26__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/vue-loader-v16/dist/templateLoader.js??ref--6!../../../../node_modules/cache-loader/dist/cjs.js??ref--0-0!../../../../node_modules/vue-loader-v16/dist??ref--0-1!./ViewOtherAccount.vue?vue&type=template&id=7ac10a26 */ \"./node_modules/vue-loader-v16/dist/templateLoader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader-v16/dist/index.js?!./src/modules/account/views/ViewOtherAccount.vue?vue&type=template&id=7ac10a26\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"render\", function() { return _node_modules_vue_loader_v16_dist_templateLoader_js_ref_6_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_v16_dist_index_js_ref_0_1_ViewOtherAccount_vue_vue_type_template_id_7ac10a26__WEBPACK_IMPORTED_MODULE_0__[\"render\"]; });\n\n\n\n//# sourceURL=webpack:///./src/modules/account/views/ViewOtherAccount.vue?");

/***/ })

}]);