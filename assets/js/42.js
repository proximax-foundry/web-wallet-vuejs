(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[42],{

/***/ "./node_modules/cache-loader/dist/cjs.js?!./node_modules/ts-loader/index.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader-v16/dist/index.js?!./src/modules/wallet/components/WalletTile.vue?vue&type=script&lang=ts":
/*!********************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/cache-loader/dist/cjs.js??ref--13-0!./node_modules/ts-loader??ref--13-1!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader-v16/dist??ref--0-1!./src/modules/wallet/components/WalletTile.vue?vue&type=script&lang=ts ***!
  \********************************************************************************************************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ \"./node_modules/vue/dist/vue.runtime.esm-bundler.js\");\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"defineComponent\"])({\n    name: 'WalletTile',\n    props: {\n        wallet: {\n            type: Object,\n            default: null,\n        },\n    },\n}));\n\n\n//# sourceURL=webpack:///./src/modules/wallet/components/WalletTile.vue?./node_modules/cache-loader/dist/cjs.js??ref--13-0!./node_modules/ts-loader??ref--13-1!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader-v16/dist??ref--0-1");

/***/ }),

/***/ "./node_modules/cache-loader/dist/cjs.js?!./node_modules/ts-loader/index.js?!./node_modules/vue-loader-v16/dist/templateLoader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader-v16/dist/index.js?!./src/modules/wallet/components/WalletTile.vue?vue&type=template&id=5651ff4b&ts=true":
/*!***********************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/cache-loader/dist/cjs.js??ref--13-0!./node_modules/ts-loader??ref--13-1!./node_modules/vue-loader-v16/dist/templateLoader.js??ref--6!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader-v16/dist??ref--0-1!./src/modules/wallet/components/WalletTile.vue?vue&type=template&id=5651ff4b&ts=true ***!
  \***********************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! exports provided: render */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"render\", function() { return render; });\n/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ \"./node_modules/vue/dist/vue.runtime.esm-bundler.js\");\n/* harmony import */ var _modules_wallet_img_deleteWallet_svg__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/modules/wallet/img/deleteWallet.svg */ \"./src/modules/wallet/img/deleteWallet.svg\");\n/* harmony import */ var _modules_wallet_img_deleteWallet_svg__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_modules_wallet_img_deleteWallet_svg__WEBPACK_IMPORTED_MODULE_1__);\n\n\nvar _hoisted_1 = { class: \"p-1\" };\nvar _hoisted_2 = { class: \"rounded-md flex justify-between py-3 bg-white\" };\nvar _hoisted_3 = { class: \"ml-7 text-left text-sm\" };\nvar _hoisted_4 = { class: \"mb-1\" };\nvar _hoisted_5 = { class: \"text-txs text-gray-400\" };\nvar _hoisted_6 = /*#__PURE__*/ Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createTextVNode\"])(\"Number of accounts: \");\nvar _hoisted_7 = { class: \"font-bold\" };\nvar _hoisted_8 = { class: \"mr-7 self-center\" };\nvar _hoisted_9 = /*#__PURE__*/ Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createVNode\"])(\"img\", {\n    src: _modules_wallet_img_deleteWallet_svg__WEBPACK_IMPORTED_MODULE_1___default.a,\n    class: \"w-5 cursor-pointer\"\n}, null, -1 /* HOISTED */);\nfunction render(_ctx, _cache, $props, $setup, $data, $options) {\n    var _component_router_link = Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"resolveComponent\"])(\"router-link\");\n    return (Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"openBlock\"])(), Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createBlock\"])(\"div\", _hoisted_1, [\n        Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createVNode\"])(\"div\", _hoisted_2, [\n            Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createVNode\"])(\"div\", _hoisted_3, [\n                Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createVNode\"])(\"div\", _hoisted_4, Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"toDisplayString\"])(_ctx.wallet.name), 1 /* TEXT */),\n                Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createVNode\"])(\"div\", _hoisted_5, [\n                    _hoisted_6,\n                    Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createVNode\"])(\"span\", _hoisted_7, Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"toDisplayString\"])(_ctx.wallet.accounts.length), 1 /* TEXT */)\n                ])\n            ]),\n            Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createVNode\"])(\"div\", _hoisted_8, [\n                Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createVNode\"])(_component_router_link, {\n                    to: { name: 'ViewWalletDeleteConfirmation', params: { name: _ctx.wallet.name, networkName: _ctx.wallet.networkName } }\n                }, {\n                    default: Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"withCtx\"])(function () { return [\n                        _hoisted_9\n                    ]; }),\n                    _: 1 /* STABLE */\n                }, 8 /* PROPS */, [\"to\"])\n            ])\n        ])\n    ]));\n}\n\n\n//# sourceURL=webpack:///./src/modules/wallet/components/WalletTile.vue?./node_modules/cache-loader/dist/cjs.js??ref--13-0!./node_modules/ts-loader??ref--13-1!./node_modules/vue-loader-v16/dist/templateLoader.js??ref--6!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader-v16/dist??ref--0-1");

/***/ }),

/***/ "./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader-v16/dist/index.js?!./src/modules/wallet/views/ViewWallets.vue?vue&type=script&lang=js":
/*!*************************************************************************************************************************************************************************!*\
  !*** ./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader-v16/dist??ref--0-1!./src/modules/wallet/views/ViewWallets.vue?vue&type=script&lang=js ***!
  \*************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ \"./node_modules/vue/dist/vue.runtime.esm-bundler.js\");\n/* harmony import */ var _modules_wallet_components_WalletTile_vue__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/modules/wallet/components/WalletTile.vue */ \"./src/modules/wallet/components/WalletTile.vue\");\n/* harmony import */ var _state_networkState__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/state/networkState */ \"./src/state/networkState.ts\");\n/* harmony import */ var _state_walletState__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @/state/walletState */ \"./src/state/walletState.ts\");\n/* harmony import */ var primevue_usetoast__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! primevue/usetoast */ \"./node_modules/primevue/usetoast/usetoast.esm.js\");\n/* harmony import */ var _util_walletUtils__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../util/walletUtils */ \"./src/util/walletUtils.ts\");\n\n\n\n\n\n\n\n\n/* harmony default export */ __webpack_exports__[\"default\"] = ({\n  name: 'ViewWallets',\n  props:[\n    'deleteWallet'\n  ],\n  components: {\n    WalletTile: _modules_wallet_components_WalletTile_vue__WEBPACK_IMPORTED_MODULE_1__[\"default\"]\n  },\n  setup(p) {\n    const toast = Object(primevue_usetoast__WEBPACK_IMPORTED_MODULE_4__[\"useToast\"])();\n    const wallets = Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"computed\"])(\n      () =>{\n        var wallet = _state_walletState__WEBPACK_IMPORTED_MODULE_3__[\"walletState\"].wallets.filterByNetworkName(_state_networkState__WEBPACK_IMPORTED_MODULE_2__[\"networkState\"].chainNetworkName);\n        return wallet;\n      }\n    );\n\n    _util_walletUtils__WEBPACK_IMPORTED_MODULE_5__[\"WalletUtils\"].initFixOldFormat(_state_walletState__WEBPACK_IMPORTED_MODULE_3__[\"walletState\"].wallets);\n\n    if(p.deleteWallet=='success'){\n      toast.add({severity:'success', summary: 'Notification', detail: 'Wallet has been removed successfully', group: 'br', life: 5000});\n    }\n\n    return {\n      wallets,\n      walletState: _state_walletState__WEBPACK_IMPORTED_MODULE_3__[\"walletState\"],\n      networkState: _state_networkState__WEBPACK_IMPORTED_MODULE_2__[\"networkState\"],\n    };\n  },\n});\n\n\n//# sourceURL=webpack:///./src/modules/wallet/views/ViewWallets.vue?./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader-v16/dist??ref--0-1");

/***/ }),

/***/ "./node_modules/vue-loader-v16/dist/templateLoader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader-v16/dist/index.js?!./src/modules/wallet/views/ViewWallets.vue?vue&type=template&id=4f08debf":
/*!********************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader-v16/dist/templateLoader.js??ref--6!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader-v16/dist??ref--0-1!./src/modules/wallet/views/ViewWallets.vue?vue&type=template&id=4f08debf ***!
  \********************************************************************************************************************************************************************************************************************************************/
/*! exports provided: render */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"render\", function() { return render; });\n/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ \"./node_modules/vue/dist/vue.runtime.esm-bundler.js\");\n/* harmony import */ var _assets_img_chevron_left_svg__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/assets/img/chevron_left.svg */ \"./src/assets/img/chevron_left.svg\");\n/* harmony import */ var _assets_img_chevron_left_svg__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_assets_img_chevron_left_svg__WEBPACK_IMPORTED_MODULE_1__);\n\n\n\n\nconst _hoisted_1 = { class: \"container mx-auto text-center w-60 sm:w-80\" }\nconst _hoisted_2 = { class: \"big-title\" }\nconst _hoisted_3 = { class: \"my-3\" }\nconst _hoisted_4 = { class: \"text-tsm mx-3 sm:text-tsm\" }\nconst _hoisted_5 = {\n  key: 0,\n  class: \"text-center h4 my-2\"\n}\nconst _hoisted_6 = {\n  key: 1,\n  class: \"mt-8\"\n}\nconst _hoisted_7 = {\n  key: 0,\n  class: \"mt-8 text-center w-full\"\n}\nconst _hoisted_8 = { class: \"inline-block\" }\nconst _hoisted_9 = /*#__PURE__*/Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createVNode\"])(\"img\", {\n  src: _assets_img_chevron_left_svg__WEBPACK_IMPORTED_MODULE_1___default.a,\n  class: \"w-5 inline-block\"\n}, null, -1 /* HOISTED */)\nconst _hoisted_10 = /*#__PURE__*/Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createTextVNode\"])(\"Back to Home\")\n\nfunction render(_ctx, _cache, $props, $setup, $data, $options) {\n  const _component_WalletTile = Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"resolveComponent\"])(\"WalletTile\")\n  const _component_router_link = Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"resolveComponent\"])(\"router-link\")\n\n  return (Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"openBlock\"])(), Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createBlock\"])(\"div\", _hoisted_1, [\n    Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createVNode\"])(\"h1\", _hoisted_2, Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"toDisplayString\"])(_ctx.$t('Header.walletTitle')), 1 /* TEXT */),\n    Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createVNode\"])(\"div\", _hoisted_3, [\n      Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createVNode\"])(\"p\", _hoisted_4, Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"toDisplayString\"])(_ctx.$t('wallets.description', {network: $setup.networkState.chainNetworkName})), 1 /* TEXT */),\n      ($setup.wallets.length == 0)\n        ? (Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"openBlock\"])(), Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createBlock\"])(\"div\", _hoisted_5, Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"toDisplayString\"])(_ctx.$t('wallets.walletvalidation')), 1 /* TEXT */))\n        : (Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"openBlock\"])(), Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createBlock\"])(\"div\", _hoisted_6, [\n            (Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"openBlock\"])(true), Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createBlock\"])(vue__WEBPACK_IMPORTED_MODULE_0__[\"Fragment\"], null, Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"renderList\"])($setup.wallets, (item) => {\n              return (Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"openBlock\"])(), Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createBlock\"])(_component_WalletTile, {\n                key: item.name,\n                wallet: item\n              }, null, 8 /* PROPS */, [\"wallet\"]))\n            }), 128 /* KEYED_FRAGMENT */))\n          ]))\n    ]),\n    (!$setup.walletState.currentLoggedInWallet)\n      ? (Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"openBlock\"])(), Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createBlock\"])(\"div\", _hoisted_7, [\n          Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createVNode\"])(\"div\", _hoisted_8, [\n            Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createVNode\"])(_component_router_link, {\n              to: { name : 'Home'},\n              class: \"flex items-center text-xs text-blue-link\"\n            }, {\n              default: Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"withCtx\"])(() => [\n                _hoisted_9,\n                _hoisted_10\n              ]),\n              _: 1 /* STABLE */\n            })\n          ])\n        ]))\n      : Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createCommentVNode\"])(\"v-if\", true)\n  ]))\n}\n\n//# sourceURL=webpack:///./src/modules/wallet/views/ViewWallets.vue?./node_modules/vue-loader-v16/dist/templateLoader.js??ref--6!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader-v16/dist??ref--0-1");

/***/ }),

/***/ "./src/assets/img/chevron_left.svg":
/*!*****************************************!*\
  !*** ./src/assets/img/chevron_left.svg ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("module.exports = __webpack_require__.p + \"assets/img/chevron_left.120f1ae7.svg\";\n\n//# sourceURL=webpack:///./src/assets/img/chevron_left.svg?");

/***/ }),

/***/ "./src/modules/wallet/components/WalletTile.vue":
/*!******************************************************!*\
  !*** ./src/modules/wallet/components/WalletTile.vue ***!
  \******************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _WalletTile_vue_vue_type_template_id_5651ff4b_ts_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./WalletTile.vue?vue&type=template&id=5651ff4b&ts=true */ \"./src/modules/wallet/components/WalletTile.vue?vue&type=template&id=5651ff4b&ts=true\");\n/* harmony import */ var _WalletTile_vue_vue_type_script_lang_ts__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./WalletTile.vue?vue&type=script&lang=ts */ \"./src/modules/wallet/components/WalletTile.vue?vue&type=script&lang=ts\");\n/* empty/unused harmony star reexport *//* harmony import */ var _home_runner_work_web_wallet_vuejs_web_wallet_vuejs_node_modules_vue_loader_v16_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./node_modules/vue-loader-v16/dist/exportHelper.js */ \"./node_modules/vue-loader-v16/dist/exportHelper.js\");\n/* harmony import */ var _home_runner_work_web_wallet_vuejs_web_wallet_vuejs_node_modules_vue_loader_v16_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_home_runner_work_web_wallet_vuejs_web_wallet_vuejs_node_modules_vue_loader_v16_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2__);\n\n\n\n\n\nconst __exports__ = /*#__PURE__*/_home_runner_work_web_wallet_vuejs_web_wallet_vuejs_node_modules_vue_loader_v16_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2___default()(_WalletTile_vue_vue_type_script_lang_ts__WEBPACK_IMPORTED_MODULE_1__[\"default\"], [['render',_WalletTile_vue_vue_type_template_id_5651ff4b_ts_true__WEBPACK_IMPORTED_MODULE_0__[\"render\"]],['__file',\"src/modules/wallet/components/WalletTile.vue\"]])\n/* hot reload */\nif (false) {}\n\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (__exports__);\n\n//# sourceURL=webpack:///./src/modules/wallet/components/WalletTile.vue?");

/***/ }),

/***/ "./src/modules/wallet/components/WalletTile.vue?vue&type=script&lang=ts":
/*!******************************************************************************!*\
  !*** ./src/modules/wallet/components/WalletTile.vue?vue&type=script&lang=ts ***!
  \******************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _node_modules_cache_loader_dist_cjs_js_ref_13_0_node_modules_ts_loader_index_js_ref_13_1_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_v16_dist_index_js_ref_0_1_WalletTile_vue_vue_type_script_lang_ts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/cache-loader/dist/cjs.js??ref--13-0!../../../../node_modules/ts-loader??ref--13-1!../../../../node_modules/cache-loader/dist/cjs.js??ref--0-0!../../../../node_modules/vue-loader-v16/dist??ref--0-1!./WalletTile.vue?vue&type=script&lang=ts */ \"./node_modules/cache-loader/dist/cjs.js?!./node_modules/ts-loader/index.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader-v16/dist/index.js?!./src/modules/wallet/components/WalletTile.vue?vue&type=script&lang=ts\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return _node_modules_cache_loader_dist_cjs_js_ref_13_0_node_modules_ts_loader_index_js_ref_13_1_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_v16_dist_index_js_ref_0_1_WalletTile_vue_vue_type_script_lang_ts__WEBPACK_IMPORTED_MODULE_0__[\"default\"]; });\n\n/* empty/unused harmony star reexport */ \n\n//# sourceURL=webpack:///./src/modules/wallet/components/WalletTile.vue?");

/***/ }),

/***/ "./src/modules/wallet/components/WalletTile.vue?vue&type=template&id=5651ff4b&ts=true":
/*!********************************************************************************************!*\
  !*** ./src/modules/wallet/components/WalletTile.vue?vue&type=template&id=5651ff4b&ts=true ***!
  \********************************************************************************************/
/*! exports provided: render */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _node_modules_cache_loader_dist_cjs_js_ref_13_0_node_modules_ts_loader_index_js_ref_13_1_node_modules_vue_loader_v16_dist_templateLoader_js_ref_6_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_v16_dist_index_js_ref_0_1_WalletTile_vue_vue_type_template_id_5651ff4b_ts_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/cache-loader/dist/cjs.js??ref--13-0!../../../../node_modules/ts-loader??ref--13-1!../../../../node_modules/vue-loader-v16/dist/templateLoader.js??ref--6!../../../../node_modules/cache-loader/dist/cjs.js??ref--0-0!../../../../node_modules/vue-loader-v16/dist??ref--0-1!./WalletTile.vue?vue&type=template&id=5651ff4b&ts=true */ \"./node_modules/cache-loader/dist/cjs.js?!./node_modules/ts-loader/index.js?!./node_modules/vue-loader-v16/dist/templateLoader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader-v16/dist/index.js?!./src/modules/wallet/components/WalletTile.vue?vue&type=template&id=5651ff4b&ts=true\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"render\", function() { return _node_modules_cache_loader_dist_cjs_js_ref_13_0_node_modules_ts_loader_index_js_ref_13_1_node_modules_vue_loader_v16_dist_templateLoader_js_ref_6_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_v16_dist_index_js_ref_0_1_WalletTile_vue_vue_type_template_id_5651ff4b_ts_true__WEBPACK_IMPORTED_MODULE_0__[\"render\"]; });\n\n\n\n//# sourceURL=webpack:///./src/modules/wallet/components/WalletTile.vue?");

/***/ }),

/***/ "./src/modules/wallet/img/deleteWallet.svg":
/*!*************************************************!*\
  !*** ./src/modules/wallet/img/deleteWallet.svg ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("module.exports = __webpack_require__.p + \"assets/img/deleteWallet.1b443f11.svg\";\n\n//# sourceURL=webpack:///./src/modules/wallet/img/deleteWallet.svg?");

/***/ }),

/***/ "./src/modules/wallet/views/ViewWallets.vue":
/*!**************************************************!*\
  !*** ./src/modules/wallet/views/ViewWallets.vue ***!
  \**************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _ViewWallets_vue_vue_type_template_id_4f08debf__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ViewWallets.vue?vue&type=template&id=4f08debf */ \"./src/modules/wallet/views/ViewWallets.vue?vue&type=template&id=4f08debf\");\n/* harmony import */ var _ViewWallets_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ViewWallets.vue?vue&type=script&lang=js */ \"./src/modules/wallet/views/ViewWallets.vue?vue&type=script&lang=js\");\n/* empty/unused harmony star reexport *//* harmony import */ var _home_runner_work_web_wallet_vuejs_web_wallet_vuejs_node_modules_vue_loader_v16_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./node_modules/vue-loader-v16/dist/exportHelper.js */ \"./node_modules/vue-loader-v16/dist/exportHelper.js\");\n/* harmony import */ var _home_runner_work_web_wallet_vuejs_web_wallet_vuejs_node_modules_vue_loader_v16_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_home_runner_work_web_wallet_vuejs_web_wallet_vuejs_node_modules_vue_loader_v16_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2__);\n\n\n\n\n\nconst __exports__ = /*#__PURE__*/_home_runner_work_web_wallet_vuejs_web_wallet_vuejs_node_modules_vue_loader_v16_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2___default()(_ViewWallets_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"], [['render',_ViewWallets_vue_vue_type_template_id_4f08debf__WEBPACK_IMPORTED_MODULE_0__[\"render\"]],['__file',\"src/modules/wallet/views/ViewWallets.vue\"]])\n/* hot reload */\nif (false) {}\n\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (__exports__);\n\n//# sourceURL=webpack:///./src/modules/wallet/views/ViewWallets.vue?");

/***/ }),

/***/ "./src/modules/wallet/views/ViewWallets.vue?vue&type=script&lang=js":
/*!**************************************************************************!*\
  !*** ./src/modules/wallet/views/ViewWallets.vue?vue&type=script&lang=js ***!
  \**************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_v16_dist_index_js_ref_0_1_ViewWallets_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/cache-loader/dist/cjs.js??ref--0-0!../../../../node_modules/vue-loader-v16/dist??ref--0-1!./ViewWallets.vue?vue&type=script&lang=js */ \"./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader-v16/dist/index.js?!./src/modules/wallet/views/ViewWallets.vue?vue&type=script&lang=js\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return _node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_v16_dist_index_js_ref_0_1_ViewWallets_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"]; });\n\n/* empty/unused harmony star reexport */ \n\n//# sourceURL=webpack:///./src/modules/wallet/views/ViewWallets.vue?");

/***/ }),

/***/ "./src/modules/wallet/views/ViewWallets.vue?vue&type=template&id=4f08debf":
/*!********************************************************************************!*\
  !*** ./src/modules/wallet/views/ViewWallets.vue?vue&type=template&id=4f08debf ***!
  \********************************************************************************/
/*! exports provided: render */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _node_modules_vue_loader_v16_dist_templateLoader_js_ref_6_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_v16_dist_index_js_ref_0_1_ViewWallets_vue_vue_type_template_id_4f08debf__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/vue-loader-v16/dist/templateLoader.js??ref--6!../../../../node_modules/cache-loader/dist/cjs.js??ref--0-0!../../../../node_modules/vue-loader-v16/dist??ref--0-1!./ViewWallets.vue?vue&type=template&id=4f08debf */ \"./node_modules/vue-loader-v16/dist/templateLoader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader-v16/dist/index.js?!./src/modules/wallet/views/ViewWallets.vue?vue&type=template&id=4f08debf\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"render\", function() { return _node_modules_vue_loader_v16_dist_templateLoader_js_ref_6_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_v16_dist_index_js_ref_0_1_ViewWallets_vue_vue_type_template_id_4f08debf__WEBPACK_IMPORTED_MODULE_0__[\"render\"]; });\n\n\n\n//# sourceURL=webpack:///./src/modules/wallet/views/ViewWallets.vue?");

/***/ })

}]);