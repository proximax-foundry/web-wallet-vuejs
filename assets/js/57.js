(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[57],{

/***/ "./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist/templateLoader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist/index.js?!./src/modules/wallet/views/ViewWalletExport.vue?vue&type=template&id=56512bb8":
/*!*************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist/templateLoader.js??ref--6!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist??ref--0-1!./src/modules/wallet/views/ViewWalletExport.vue?vue&type=template&id=56512bb8 ***!
  \*************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! exports provided: render */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"render\", function() { return render; });\n/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ \"./node_modules/vue/dist/vue.runtime.esm-bundler.js\");\n/* harmony import */ var _assets_img_icon_wallet_export_blue_svg__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/assets/img/icon-wallet-export-blue.svg */ \"./src/assets/img/icon-wallet-export-blue.svg\");\n/* harmony import */ var _assets_img_icon_wallet_export_blue_svg__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_assets_img_icon_wallet_export_blue_svg__WEBPACK_IMPORTED_MODULE_1__);\n\n\n\n\nconst _hoisted_1 = { class: \"flex justify-between text-xs sm:text-sm\" }\nconst _hoisted_2 = /*#__PURE__*/Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createVNode\"])(\"span\", { class: \"text-gray-400\" }, \"Wallet >\", -1 /* HOISTED */)\nconst _hoisted_3 = /*#__PURE__*/Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createTextVNode\"])()\nconst _hoisted_4 = { class: \"text-blue-primary font-bold\" }\nconst _hoisted_5 = { class: \"mt-2 py-3 gray-line\" }\nconst _hoisted_6 = { class: \"container mx-auto text-center\" }\nconst _hoisted_7 = { class: \"mx-auto pt-5 lg:px-20\" }\nconst _hoisted_8 = {\n  key: 0,\n  class: \"error error_box mb-3\"\n}\nconst _hoisted_9 = {\n  key: 1,\n  class: \"grid xs-grid-cols-1 sm:grid-cols-2 mt-10\"\n}\nconst _hoisted_10 = { class: \"bg-gray-200 rounded-2xl flex justify-between py-3\" }\nconst _hoisted_11 = { class: \"ml-5 text-left text-sm\" }\nconst _hoisted_12 = { class: \"font-bold mb-1\" }\nconst _hoisted_13 = { class: \"text-xs\" }\nconst _hoisted_14 = { class: \"font-bold\" }\nconst _hoisted_15 = { class: \"mr-5 self-center\" }\n\nfunction render(_ctx, _cache, $props, $setup, $data, $options) {\n  const _component_router_link = Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"resolveComponent\"])(\"router-link\")\n\n  return (Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"openBlock\"])(), Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createBlock\"])(vue__WEBPACK_IMPORTED_MODULE_0__[\"Fragment\"], null, [\n    Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createVNode\"])(\"div\", _hoisted_1, [\n      Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createVNode\"])(\"div\", null, [\n        _hoisted_2,\n        _hoisted_3,\n        Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createVNode\"])(\"span\", _hoisted_4, Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"toDisplayString\"])(_ctx.$t('services.exportwallet')), 1 /* TEXT */)\n      ]),\n      Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createVNode\"])(\"div\", null, [\n        Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createVNode\"])(_component_router_link, {\n          to: { name: 'ViewWallets'},\n          class: \"font-bold\",\n          \"active-class\": \"accounts\"\n        }, {\n          default: Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"withCtx\"])(() => [\n            Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createTextVNode\"])(Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"toDisplayString\"])(_ctx.$t('services.deletewallet')), 1 /* TEXT */)\n          ]),\n          _: 1 /* STABLE */\n        })\n      ])\n    ]),\n    Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createVNode\"])(\"div\", _hoisted_5, [\n      Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createVNode\"])(\"div\", _hoisted_6, [\n        Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createVNode\"])(\"div\", _hoisted_7, [\n          ($setup.err!='')\n            ? (Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"openBlock\"])(), Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createBlock\"])(\"div\", _hoisted_8, Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"toDisplayString\"])($setup.err), 1 /* TEXT */))\n            : (Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"openBlock\"])(), Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createBlock\"])(\"div\", _hoisted_9, [\n                (Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"openBlock\"])(true), Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createBlock\"])(vue__WEBPACK_IMPORTED_MODULE_0__[\"Fragment\"], null, Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"renderList\"])($setup.appStore.state.wallets, (wallet) => {\n                  return (Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"openBlock\"])(), Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createBlock\"])(\"div\", {\n                    class: \"p-3\",\n                    key: wallet.name\n                  }, [\n                    Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createVNode\"])(\"div\", _hoisted_10, [\n                      Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createVNode\"])(\"div\", _hoisted_11, [\n                        Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createVNode\"])(\"div\", _hoisted_12, Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"toDisplayString\"])(wallet.name), 1 /* TEXT */),\n                        Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createVNode\"])(\"div\", _hoisted_13, [\n                          Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createTextVNode\"])(Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"toDisplayString\"])(_ctx.$t('wallets.account')) + Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"toDisplayString\"])((wallet.accounts.length>1)?'s':'') + \": \", 1 /* TEXT */),\n                          Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createVNode\"])(\"span\", _hoisted_14, Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"toDisplayString\"])(wallet.accounts.length), 1 /* TEXT */)\n                        ])\n                      ]),\n                      Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createVNode\"])(\"div\", _hoisted_15, [\n                        Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createVNode\"])(\"img\", {\n                          src: _assets_img_icon_wallet_export_blue_svg__WEBPACK_IMPORTED_MODULE_1___default.a,\n                          class: \"w-7 cursor-pointer\",\n                          onClick: $event => ($setup.exportWallet(wallet.name))\n                        }, null, 8 /* PROPS */, [\"onClick\"])\n                      ])\n                    ])\n                  ]))\n                }), 128 /* KEYED_FRAGMENT */))\n              ]))\n        ])\n      ])\n    ])\n  ], 64 /* STABLE_FRAGMENT */))\n}\n\n//# sourceURL=webpack:///./src/modules/wallet/views/ViewWalletExport.vue?./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist/templateLoader.js??ref--6!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist??ref--0-1");

/***/ }),

/***/ "./node_modules/cache-loader/dist/cjs.js?!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist/index.js?!./src/modules/wallet/views/ViewWalletExport.vue?vue&type=script&lang=js":
/*!************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist??ref--0-1!./src/modules/wallet/views/ViewWalletExport.vue?vue&type=script&lang=js ***!
  \************************************************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ \"./node_modules/vue/dist/vue.runtime.esm-bundler.js\");\n/* harmony import */ var crypto_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! crypto-js */ \"./node_modules/crypto-js/index.js\");\n/* harmony import */ var crypto_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(crypto_js__WEBPACK_IMPORTED_MODULE_1__);\n\n\n\n// import FontAwesomeIcon from '../../libs/FontAwesomeIcon.vue';\n\n/* harmony default export */ __webpack_exports__[\"default\"] = ({\n  name: 'ViewWalletExport',\n  components: {\n    // FontAwesomeIcon,\n  },\n  setup(){\n    const appStore = Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"inject\"])(\"appStore\");\n    const siriusStore = Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"inject\"])(\"siriusStore\");\n\n    const err = Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"ref\"])(false);\n\n    const exportWallet = (walletName) => {\n      const wallet = appStore.getWalletByName(walletName);\n      let wordArray = crypto_js__WEBPACK_IMPORTED_MODULE_1___default.a.enc.Utf8.parse(JSON.stringify(wallet));\n      let file = crypto_js__WEBPACK_IMPORTED_MODULE_1___default.a.enc.Base64.stringify(wordArray);\n      const now = Date.now()\n      const date = new Date(now);\n      const year = date.getFullYear();\n      const month = ((date.getMonth() + 1) < 10) ? `0${(date.getMonth() + 1)}` : date.getMonth() + 1;\n      const day = (date.getDate() < 10) ? `0${date.getDate()}` : date.getDate();\n\n      const blob = new Blob([file], { type: '' });\n      const url = window.URL.createObjectURL(blob);\n      const a = document.createElement('a');\n      a.style.display = 'none';\n      a.href = url;\n      // the filename you want\n      // let networkTypeName = siriusStore.getNetworkByType(appStore.getAccountByWallet(appStore.state.currentLoggedInWallet.name).network).name;\n      // networkTypeName = (networkTypeName.includes(' ')) ? networkTypeName.split(' ').join('') : networkTypeName;\n      a.download = `${wallet.name}_${ siriusStore.state.chainNetworkName }_${year}-${month}-${day}.wlt`;\n      document.body.appendChild(a);\n      a.click();\n      window.URL.revokeObjectURL(url);\n    };\n\n\n    return {\n      appStore,\n      exportWallet,\n      err,\n    };\n  },\n});\n\n\n//# sourceURL=webpack:///./src/modules/wallet/views/ViewWalletExport.vue?./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist??ref--0-1");

/***/ }),

/***/ "./src/assets/img/icon-wallet-export-blue.svg":
/*!****************************************************!*\
  !*** ./src/assets/img/icon-wallet-export-blue.svg ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("module.exports = __webpack_require__.p + \"assets/img/icon-wallet-export-blue.520a6231.svg\";\n\n//# sourceURL=webpack:///./src/assets/img/icon-wallet-export-blue.svg?");

/***/ }),

/***/ "./src/modules/wallet/views/ViewWalletExport.vue":
/*!*******************************************************!*\
  !*** ./src/modules/wallet/views/ViewWalletExport.vue ***!
  \*******************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _ViewWalletExport_vue_vue_type_template_id_56512bb8__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ViewWalletExport.vue?vue&type=template&id=56512bb8 */ \"./src/modules/wallet/views/ViewWalletExport.vue?vue&type=template&id=56512bb8\");\n/* harmony import */ var _ViewWalletExport_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ViewWalletExport.vue?vue&type=script&lang=js */ \"./src/modules/wallet/views/ViewWalletExport.vue?vue&type=script&lang=js\");\n/* empty/unused harmony star reexport *//* harmony import */ var _home_runner_work_web_wallet_vuejs_web_wallet_vuejs_node_modules_vue_cli_service_node_modules_vue_loader_v16_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist/exportHelper.js */ \"./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist/exportHelper.js\");\n/* harmony import */ var _home_runner_work_web_wallet_vuejs_web_wallet_vuejs_node_modules_vue_cli_service_node_modules_vue_loader_v16_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_home_runner_work_web_wallet_vuejs_web_wallet_vuejs_node_modules_vue_cli_service_node_modules_vue_loader_v16_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2__);\n\n\n\n\n\nconst __exports__ = /*#__PURE__*/_home_runner_work_web_wallet_vuejs_web_wallet_vuejs_node_modules_vue_cli_service_node_modules_vue_loader_v16_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2___default()(_ViewWalletExport_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"], [['render',_ViewWalletExport_vue_vue_type_template_id_56512bb8__WEBPACK_IMPORTED_MODULE_0__[\"render\"]],['__file',\"src/modules/wallet/views/ViewWalletExport.vue\"]])\n/* hot reload */\nif (false) {}\n\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (__exports__);\n\n//# sourceURL=webpack:///./src/modules/wallet/views/ViewWalletExport.vue?");

/***/ }),

/***/ "./src/modules/wallet/views/ViewWalletExport.vue?vue&type=script&lang=js":
/*!*******************************************************************************!*\
  !*** ./src/modules/wallet/views/ViewWalletExport.vue?vue&type=script&lang=js ***!
  \*******************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_cli_service_node_modules_vue_loader_v16_dist_index_js_ref_0_1_ViewWalletExport_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/cache-loader/dist/cjs.js??ref--0-0!../../../../node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist??ref--0-1!./ViewWalletExport.vue?vue&type=script&lang=js */ \"./node_modules/cache-loader/dist/cjs.js?!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist/index.js?!./src/modules/wallet/views/ViewWalletExport.vue?vue&type=script&lang=js\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return _node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_cli_service_node_modules_vue_loader_v16_dist_index_js_ref_0_1_ViewWalletExport_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"]; });\n\n/* empty/unused harmony star reexport */ \n\n//# sourceURL=webpack:///./src/modules/wallet/views/ViewWalletExport.vue?");

/***/ }),

/***/ "./src/modules/wallet/views/ViewWalletExport.vue?vue&type=template&id=56512bb8":
/*!*************************************************************************************!*\
  !*** ./src/modules/wallet/views/ViewWalletExport.vue?vue&type=template&id=56512bb8 ***!
  \*************************************************************************************/
/*! exports provided: render */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _node_modules_vue_cli_service_node_modules_vue_loader_v16_dist_templateLoader_js_ref_6_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_cli_service_node_modules_vue_loader_v16_dist_index_js_ref_0_1_ViewWalletExport_vue_vue_type_template_id_56512bb8__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist/templateLoader.js??ref--6!../../../../node_modules/cache-loader/dist/cjs.js??ref--0-0!../../../../node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist??ref--0-1!./ViewWalletExport.vue?vue&type=template&id=56512bb8 */ \"./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist/templateLoader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist/index.js?!./src/modules/wallet/views/ViewWalletExport.vue?vue&type=template&id=56512bb8\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"render\", function() { return _node_modules_vue_cli_service_node_modules_vue_loader_v16_dist_templateLoader_js_ref_6_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_cli_service_node_modules_vue_loader_v16_dist_index_js_ref_0_1_ViewWalletExport_vue_vue_type_template_id_56512bb8__WEBPACK_IMPORTED_MODULE_0__[\"render\"]; });\n\n\n\n//# sourceURL=webpack:///./src/modules/wallet/views/ViewWalletExport.vue?");

/***/ })

}]);