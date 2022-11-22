(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[40],{

/***/ "./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader-v16/dist/index.js?!./src/modules/dashboard/views/ViewNotification.vue?vue&type=script&lang=js":
/*!*********************************************************************************************************************************************************************************!*\
  !*** ./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader-v16/dist??ref--0-1!./src/modules/dashboard/views/ViewNotification.vue?vue&type=script&lang=js ***!
  \*********************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ \"./node_modules/vue/dist/vue.runtime.esm-bundler.js\");\n/* harmony import */ var _models_stores___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/models/stores/ */ \"./src/models/stores/index.ts\");\n/* harmony import */ var _state_walletState__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/state/walletState */ \"./src/state/walletState.ts\");\n/* harmony import */ var _models_wallet__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @/models/wallet */ \"./src/models/wallet.ts\");\n/* harmony import */ var _state_networkState__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @/state/networkState */ \"./src/state/networkState.ts\");\n/* harmony import */ var _models_currency__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @/models/currency */ \"./src/models/currency.ts\");\n/* harmony import */ var _util_typeHelper__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @/util/typeHelper */ \"./src/util/typeHelper.ts\");\n/* harmony import */ var _util_chainUtils__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @/util/chainUtils */ \"./src/util/chainUtils.ts\");\n/* harmony import */ var _state_appState__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @/state/appState */ \"./src/state/appState.ts\");\n/* harmony import */ var _util_notificationUtils__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @/util/notificationUtils */ \"./src/util/notificationUtils.ts\");\n/* harmony import */ var _models_stores_themeStyleConfig__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @/models/stores/themeStyleConfig */ \"./src/models/stores/themeStyleConfig.ts\");\n/* harmony import */ var jdenticon__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! jdenticon */ \"./node_modules/jdenticon/dist/jdenticon-module.mjs\");\n\n\n// import { useRouter } from \"vue-router\";\n\n\n\n\n\n\n\n\n\n\n\n\n/* harmony default export */ __webpack_exports__[\"default\"] = ({\n  name: 'ViewNotification',\n\n  setup(){\n    const notifications = Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"ref\"])([]);\n    const internalInstance = Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"getCurrentInstance\"])();\n    const emitter = internalInstance.appContext.config.globalProperties.emitter;\n\n    let themeConfig = new _models_stores_themeStyleConfig__WEBPACK_IMPORTED_MODULE_10__[\"ThemeStyleConfig\"]('ThemeStyleConfig');\n    themeConfig.init();\n    const themeStyleConfig = Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"ref\"])(themeConfig.jdenticonConfig);\n\n    const iniNotification = () => {\n      if(!_state_appState__WEBPACK_IMPORTED_MODULE_8__[\"AppState\"].isReady){\n        setTimeout(iniNotification, 100);\n        return ;\n      }\n      notifications.value = _util_notificationUtils__WEBPACK_IMPORTED_MODULE_9__[\"NotificationUtils\"].getNotificationFromStorage();\n      _util_notificationUtils__WEBPACK_IMPORTED_MODULE_9__[\"NotificationUtils\"].saveVisitedNotification();\n      emitter.emit(\"VIEW_NOTIFICATION\");\n    }\n\n    const updateDefaultAccount = (address) => {\n      if(!_state_walletState__WEBPACK_IMPORTED_MODULE_2__[\"walletState\"].currentLoggedInWallet){\n        return\n      }\n      _state_walletState__WEBPACK_IMPORTED_MODULE_2__[\"walletState\"].currentLoggedInWallet.setDefaultAccountByAddress(address);\n      var name = _state_walletState__WEBPACK_IMPORTED_MODULE_2__[\"walletState\"].currentLoggedInWallet.accounts.find(account => account.address == address);\n      if(!name){\n        name = ''\n      }\n      emitter.emit(\"DEFAULT_ACCOUNT_SWITCHED\", name);\n    }\n\n    const currentTimestamp = () => {\n      let current = new Date();\n      return current.getTime();\n    }\n\n    const init = async() =>{\n      iniNotification();\n    }\n\n    if(_state_appState__WEBPACK_IMPORTED_MODULE_8__[\"AppState\"].isReady){\n      init();\n    }\n    else{\n      let readyWatcher = Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"watch\"])(_state_appState__WEBPACK_IMPORTED_MODULE_8__[\"AppState\"].isReady, (value) => {\n        if(value){\n          init();\n          readyWatcher();\n        }\n      });\n    }\n\n    return {\n      notifications,\n      NotificationUtils: _util_notificationUtils__WEBPACK_IMPORTED_MODULE_9__[\"NotificationUtils\"],\n      updateDefaultAccount,\n      Helper: _util_typeHelper__WEBPACK_IMPORTED_MODULE_6__[\"Helper\"],\n      themeStyleConfig,\n      toSvg: jdenticon__WEBPACK_IMPORTED_MODULE_11__[\"toSvg\"],\n      walletState: _state_walletState__WEBPACK_IMPORTED_MODULE_2__[\"walletState\"],\n      currentTimestamp,\n    }\n  },\n\n});\n\n\n//# sourceURL=webpack:///./src/modules/dashboard/views/ViewNotification.vue?./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader-v16/dist??ref--0-1");

/***/ }),

/***/ "./node_modules/vue-loader-v16/dist/templateLoader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader-v16/dist/index.js?!./src/modules/dashboard/views/ViewNotification.vue?vue&type=template&id=9140d7e6":
/*!****************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader-v16/dist/templateLoader.js??ref--6!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader-v16/dist??ref--0-1!./src/modules/dashboard/views/ViewNotification.vue?vue&type=template&id=9140d7e6 ***!
  \****************************************************************************************************************************************************************************************************************************************************/
/*! exports provided: render */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"render\", function() { return render; });\n/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ \"./node_modules/vue/dist/vue.runtime.esm-bundler.js\");\n\n\nconst _hoisted_1 = { class: \"ml-2 mr-2 w-full lg:ml-auto lg:mr-auto mt-5\" }\nconst _hoisted_2 = { class: \"lg:w-9/12 ml-2 mr-2 lg:ml-auto lg:mr-auto mt-5\" }\nconst _hoisted_3 = { class: \"flex justify-between text-sm mb-5\" }\nconst _hoisted_4 = { class: \"text-gray-700\" }\nconst _hoisted_5 = { key: 0 }\nconst _hoisted_6 = { key: 0 }\nconst _hoisted_7 = [\"innerHTML\"]\nconst _hoisted_8 = { class: \"text-gray-600 text-xs\" }\nconst _hoisted_9 = { class: \"mb-1 text-sm text-gray-700 font-bold\" }\nconst _hoisted_10 = { key: 1 }\nconst _hoisted_11 = [\"innerHTML\"]\nconst _hoisted_12 = { class: \"text-gray-600 text-xs\" }\nconst _hoisted_13 = { class: \"mb-1 text-sm text-gray-700 font-bold\" }\nconst _hoisted_14 = /*#__PURE__*/Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createTextVNode\"])()\nconst _hoisted_15 = { key: 0 }\nconst _hoisted_16 = { key: 1 }\nconst _hoisted_17 = {\n  key: 1,\n  class: \"text-xs text-gray-500\"\n}\n\nfunction render(_ctx, _cache, $props, $setup, $data, $options) {\n  const _component_router_link = Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"resolveComponent\"])(\"router-link\")\n\n  return (Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"openBlock\"])(), Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createElementBlock\"])(\"div\", null, [\n    Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createElementVNode\"])(\"div\", _hoisted_1, [\n      Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createElementVNode\"])(\"div\", _hoisted_2, [\n        Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createElementVNode\"])(\"div\", _hoisted_3, [\n          Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createElementVNode\"])(\"div\", null, [\n            Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createElementVNode\"])(\"span\", _hoisted_4, Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"toDisplayString\"])(_ctx.$t('general.notification',2)), 1 /* TEXT */)\n          ])\n        ]),\n        ($setup.notifications!=null && $setup.notifications.length > 0)\n          ? (Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"openBlock\"])(), Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createElementBlock\"])(\"div\", _hoisted_5, [\n              (Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"openBlock\"])(true), Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createElementBlock\"])(vue__WEBPACK_IMPORTED_MODULE_0__[\"Fragment\"], null, Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"renderList\"])($setup.notifications, (notification, index) => {\n                return (Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"openBlock\"])(), Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createElementBlock\"])(\"div\", { key: index }, [\n                  (notification.type=='Partial')\n                    ? (Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"openBlock\"])(), Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createElementBlock\"])(\"div\", _hoisted_6, [\n                        Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createVNode\"])(_component_router_link, {\n                          to: { name : 'ViewAccountPendingTransactions', params: {address: notification.address } },\n                          onClick: $event => ($setup.updateDefaultAccount(notification.address)),\n                          class: \"flex items-center border border-gray-100 w-full p-5 mb-3 text-tsm hover:bg-blue-50 transition-all duration-300\"\n                        }, {\n                          default: Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"withCtx\"])(() => [\n                            Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createElementVNode\"])(\"div\", {\n                              innerHTML: $setup.toSvg(notification.address, 40, $setup.themeStyleConfig),\n                              class: \"mr-2\"\n                            }, null, 8 /* PROPS */, _hoisted_7),\n                            Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createElementVNode\"])(\"div\", _hoisted_8, [\n                              Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createElementVNode\"])(\"div\", _hoisted_9, Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"toDisplayString\"])($setup.walletState.currentLoggedInWallet?$setup.walletState.currentLoggedInWallet.convertAddressToNamePretty(notification.address, true):''), 1 /* TEXT */),\n                              Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createTextVNode\"])(\" \" + Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"toDisplayString\"])(notification.label) + \" \" + Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"toDisplayString\"])(_ctx.$t('notification.pendingSignature',{time:$setup.NotificationUtils.relativeTime(notification.timestamp)})), 1 /* TEXT */)\n                            ])\n                          ]),\n                          _: 2 /* DYNAMIC */\n                        }, 1032 /* PROPS, DYNAMIC_SLOTS */, [\"to\", \"onClick\"])\n                      ]))\n                    : Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createCommentVNode\"])(\"v-if\", true),\n                  (notification.type=='Namespace')\n                    ? (Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"openBlock\"])(), Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createElementBlock\"])(\"div\", _hoisted_10, [\n                        Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createVNode\"])(_component_router_link, {\n                          to: { name: 'ViewServicesNamespaceExtend', params: { address: $setup.Helper.createAddress(notification.address).pretty(), namespaceId: notification.id }},\n                          class: \"flex items-center border border-gray-100 w-full p-5 mb-3 text-tsm hover:bg-blue-50 transition-all duration-300\"\n                        }, {\n                          default: Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"withCtx\"])(() => [\n                            Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createElementVNode\"])(\"div\", {\n                              innerHTML: $setup.toSvg(notification.address, 40, $setup.themeStyleConfig),\n                              class: \"mr-2\"\n                            }, null, 8 /* PROPS */, _hoisted_11),\n                            Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createElementVNode\"])(\"div\", _hoisted_12, [\n                              Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createElementVNode\"])(\"div\", _hoisted_13, Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"toDisplayString\"])($setup.walletState.currentLoggedInWallet.convertAddressToNamePretty(notification.address, true)), 1 /* TEXT */),\n                              Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createTextVNode\"])(\" \" + Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"toDisplayString\"])(_ctx.$t('general.namespace')) + \" \", 1 /* TEXT */),\n                              Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createElementVNode\"])(\"b\", null, Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"toDisplayString\"])(notification.label), 1 /* TEXT */),\n                              _hoisted_14,\n                              ($setup.currentTimestamp() > notification.timestamp)\n                                ? (Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"openBlock\"])(), Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createElementBlock\"])(\"span\", _hoisted_15, \"has expired\"))\n                                : (Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"openBlock\"])(), Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createElementBlock\"])(\"span\", _hoisted_16, Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"toDisplayString\"])(_ctx.$t('notification.isExpiring',{time:$setup.NotificationUtils.relativeTime(notification.timestamp)})), 1 /* TEXT */))\n                            ])\n                          ]),\n                          _: 2 /* DYNAMIC */\n                        }, 1032 /* PROPS, DYNAMIC_SLOTS */, [\"to\"])\n                      ]))\n                    : Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createCommentVNode\"])(\"v-if\", true)\n                ]))\n              }), 128 /* KEYED_FRAGMENT */))\n            ]))\n          : (Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"openBlock\"])(), Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createElementBlock\"])(\"div\", _hoisted_17, Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"toDisplayString\"])(_ctx.$t('notification.noNotification')), 1 /* TEXT */))\n      ])\n    ])\n  ]))\n}\n\n//# sourceURL=webpack:///./src/modules/dashboard/views/ViewNotification.vue?./node_modules/vue-loader-v16/dist/templateLoader.js??ref--6!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader-v16/dist??ref--0-1");

/***/ }),

/***/ "./src/modules/dashboard/views/ViewNotification.vue":
/*!**********************************************************!*\
  !*** ./src/modules/dashboard/views/ViewNotification.vue ***!
  \**********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _ViewNotification_vue_vue_type_template_id_9140d7e6__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ViewNotification.vue?vue&type=template&id=9140d7e6 */ \"./src/modules/dashboard/views/ViewNotification.vue?vue&type=template&id=9140d7e6\");\n/* harmony import */ var _ViewNotification_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ViewNotification.vue?vue&type=script&lang=js */ \"./src/modules/dashboard/views/ViewNotification.vue?vue&type=script&lang=js\");\n/* empty/unused harmony star reexport *//* harmony import */ var _home_runner_work_web_wallet_vuejs_web_wallet_vuejs_node_modules_vue_loader_v16_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./node_modules/vue-loader-v16/dist/exportHelper.js */ \"./node_modules/vue-loader-v16/dist/exportHelper.js\");\n/* harmony import */ var _home_runner_work_web_wallet_vuejs_web_wallet_vuejs_node_modules_vue_loader_v16_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_home_runner_work_web_wallet_vuejs_web_wallet_vuejs_node_modules_vue_loader_v16_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2__);\n\n\n\n\n\nconst __exports__ = /*#__PURE__*/_home_runner_work_web_wallet_vuejs_web_wallet_vuejs_node_modules_vue_loader_v16_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2___default()(_ViewNotification_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"], [['render',_ViewNotification_vue_vue_type_template_id_9140d7e6__WEBPACK_IMPORTED_MODULE_0__[\"render\"]],['__file',\"src/modules/dashboard/views/ViewNotification.vue\"]])\n/* hot reload */\nif (false) {}\n\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (__exports__);\n\n//# sourceURL=webpack:///./src/modules/dashboard/views/ViewNotification.vue?");

/***/ }),

/***/ "./src/modules/dashboard/views/ViewNotification.vue?vue&type=script&lang=js":
/*!**********************************************************************************!*\
  !*** ./src/modules/dashboard/views/ViewNotification.vue?vue&type=script&lang=js ***!
  \**********************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_v16_dist_index_js_ref_0_1_ViewNotification_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/cache-loader/dist/cjs.js??ref--0-0!../../../../node_modules/vue-loader-v16/dist??ref--0-1!./ViewNotification.vue?vue&type=script&lang=js */ \"./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader-v16/dist/index.js?!./src/modules/dashboard/views/ViewNotification.vue?vue&type=script&lang=js\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return _node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_v16_dist_index_js_ref_0_1_ViewNotification_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"]; });\n\n/* empty/unused harmony star reexport */ \n\n//# sourceURL=webpack:///./src/modules/dashboard/views/ViewNotification.vue?");

/***/ }),

/***/ "./src/modules/dashboard/views/ViewNotification.vue?vue&type=template&id=9140d7e6":
/*!****************************************************************************************!*\
  !*** ./src/modules/dashboard/views/ViewNotification.vue?vue&type=template&id=9140d7e6 ***!
  \****************************************************************************************/
/*! exports provided: render */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _node_modules_vue_loader_v16_dist_templateLoader_js_ref_6_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_v16_dist_index_js_ref_0_1_ViewNotification_vue_vue_type_template_id_9140d7e6__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/vue-loader-v16/dist/templateLoader.js??ref--6!../../../../node_modules/cache-loader/dist/cjs.js??ref--0-0!../../../../node_modules/vue-loader-v16/dist??ref--0-1!./ViewNotification.vue?vue&type=template&id=9140d7e6 */ \"./node_modules/vue-loader-v16/dist/templateLoader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader-v16/dist/index.js?!./src/modules/dashboard/views/ViewNotification.vue?vue&type=template&id=9140d7e6\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"render\", function() { return _node_modules_vue_loader_v16_dist_templateLoader_js_ref_6_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_v16_dist_index_js_ref_0_1_ViewNotification_vue_vue_type_template_id_9140d7e6__WEBPACK_IMPORTED_MODULE_0__[\"render\"]; });\n\n\n\n//# sourceURL=webpack:///./src/modules/dashboard/views/ViewNotification.vue?");

/***/ })

}]);