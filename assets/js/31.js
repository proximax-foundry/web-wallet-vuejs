(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[31],{

/***/ "./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader-v16/dist/index.js?!./src/modules/services/submodule/mainnetSwap/submodule2/bsc/views/ViewServicesMainnetSwapBscOptions.vue?vue&type=script&lang=js":
/*!**************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader-v16/dist??ref--0-1!./src/modules/services/submodule/mainnetSwap/submodule2/bsc/views/ViewServicesMainnetSwapBscOptions.vue?vue&type=script&lang=js ***!
  \**************************************************************************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ \"./node_modules/vue/dist/vue.runtime.esm-bundler.js\");\n/* harmony import */ var vue_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! vue-router */ \"./node_modules/vue-router/dist/vue-router.esm-bundler.js\");\n/* harmony import */ var _util_swapUtils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../../../util/swapUtils */ \"./src/util/swapUtils.ts\");\n/* harmony import */ var _models_stores_chainSwapConfig__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @/models/stores/chainSwapConfig */ \"./src/models/stores/chainSwapConfig.ts\");\n/* harmony import */ var _state_networkState__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @/state/networkState */ \"./src/state/networkState.ts\");\n/* harmony import */ var primevue_inlinemessage__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! primevue/inlinemessage */ \"./node_modules/primevue/inlinemessage/inlinemessage.esm.js\");\n\n\n\n\n\n\n\n\n/* harmony default export */ __webpack_exports__[\"default\"] = ({\n  name: 'ViewServicesMainnetSwapBscOptions',\n  components: {\n    InlineMessage: primevue_inlinemessage__WEBPACK_IMPORTED_MODULE_5__[\"default\"]\n  },\n  setup() {\n    let swapData = new _models_stores_chainSwapConfig__WEBPACK_IMPORTED_MODULE_3__[\"ChainSwapConfig\"](_state_networkState__WEBPACK_IMPORTED_MODULE_4__[\"networkState\"].chainNetworkName);\n    swapData.init();\n\n    const baseURL = swapData.swap_XPX_BSC_URL;\n    const priceURL = swapData.priceConsultURL;\n    const router = Object(vue_router__WEBPACK_IMPORTED_MODULE_1__[\"useRouter\"])();\n    const outgoingText = Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"ref\"])('From Sirius to BSC');\n    const isOutgoingOptionDisabled = Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"ref\"])(false);\n    const displayWaitMessage = Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"ref\"])(false);\n    const displaConnectionMessage = Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"ref\"])(false);\n    const displaErrorMessage = Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"ref\"])(false);\n    const isChecking = Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"ref\"])(false);\n\n    const gotoOutgoingPage = async()=> {\n\n      if(isChecking.value){\n        return;\n      }\n      isOutgoingOptionDisabled.value = true;\n      // outgoingText.value = \"Getting your accounts. Please wait\";\n\n      isChecking.value = true;\n      displayWaitMessage.value = true;\n      displaConnectionMessage.value = false;\n      displaErrorMessage.value = false;\n\n      try {\n        const response = await fetch(_util_swapUtils__WEBPACK_IMPORTED_MODULE_2__[\"SwapUtils\"].checkSwapService(baseURL));\n        const priceResponse = await fetch(_util_swapUtils__WEBPACK_IMPORTED_MODULE_2__[\"SwapUtils\"].checkSwapPrice(priceURL));\n        const priceData = await priceResponse.json();\n\n        isChecking.value = false;\n\n        if(priceData.xpx === 0 || priceData.bnb === 0){\n          displayWaitMessage.value = false;\n          displaErrorMessage.value = true;\n          isOutgoingOptionDisabled.value = false;\n          return;\n        }\n\n        if(response.status == 200 && priceResponse.status == 200){\n          displaErrorMessage.value = false;\n          displayWaitMessage.value = false;\n          router.push({ name: \"ViewServicesMainnetSwapSiriusToBSC\"});\n        }\n        else{\n          displayWaitMessage.value = false;\n          displaErrorMessage.value = true;\n          isOutgoingOptionDisabled.value = false;\n        }\n\n      } catch (error) {\n        displayWaitMessage.value = false;\n        displaErrorMessage.value = false;\n        displaConnectionMessage.value = true;\n        isOutgoingOptionDisabled.value = false;\n        isChecking.value = false;\n      }\n    };\n\n    return {\n      gotoOutgoingPage,\n      displayWaitMessage,\n      displaErrorMessage,\n      displaConnectionMessage,\n      isOutgoingOptionDisabled,\n      outgoingText,\n    };\n  },\n});\n\n\n//# sourceURL=webpack:///./src/modules/services/submodule/mainnetSwap/submodule2/bsc/views/ViewServicesMainnetSwapBscOptions.vue?./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader-v16/dist??ref--0-1");

/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js?!./node_modules/vue-loader-v16/dist/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/dist/cjs.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader-v16/dist/index.js?!./src/modules/services/submodule/mainnetSwap/submodule2/bsc/views/ViewServicesMainnetSwapBscOptions.vue?vue&type=style&index=0&id=67da5318&lang=scss&scoped=true":
/*!**************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js??ref--8-oneOf-1-1!./node_modules/vue-loader-v16/dist/stylePostLoader.js!./node_modules/postcss-loader/src??ref--8-oneOf-1-2!./node_modules/sass-loader/dist/cjs.js??ref--8-oneOf-1-3!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader-v16/dist??ref--0-1!./src/modules/services/submodule/mainnetSwap/submodule2/bsc/views/ViewServicesMainnetSwapBscOptions.vue?vue&type=style&index=0&id=67da5318&lang=scss&scoped=true ***!
  \**************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("// Imports\nvar ___CSS_LOADER_API_IMPORT___ = __webpack_require__(/*! ../../../../../../../../node_modules/css-loader/dist/runtime/api.js */ \"./node_modules/css-loader/dist/runtime/api.js\");\nexports = ___CSS_LOADER_API_IMPORT___(false);\n// Module\nexports.push([module.i, \".option-div[data-v-67da5318]:hover {\\n  transition: all 0.5s;\\n}\\n.option-div:hover > div[data-v-67da5318] {\\n  --tw-text-opacity: 1;\\n  color: rgba(255, 255, 255, var(--tw-text-opacity));\\n}\\n\", \"\"]);\n// Exports\nmodule.exports = exports;\n\n\n//# sourceURL=webpack:///./src/modules/services/submodule/mainnetSwap/submodule2/bsc/views/ViewServicesMainnetSwapBscOptions.vue?./node_modules/css-loader/dist/cjs.js??ref--8-oneOf-1-1!./node_modules/vue-loader-v16/dist/stylePostLoader.js!./node_modules/postcss-loader/src??ref--8-oneOf-1-2!./node_modules/sass-loader/dist/cjs.js??ref--8-oneOf-1-3!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader-v16/dist??ref--0-1");

/***/ }),

/***/ "./node_modules/vue-loader-v16/dist/templateLoader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader-v16/dist/index.js?!./src/modules/services/submodule/mainnetSwap/submodule2/bsc/views/ViewServicesMainnetSwapBscOptions.vue?vue&type=template&id=67da5318&scoped=true":
/*!*********************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader-v16/dist/templateLoader.js??ref--6!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader-v16/dist??ref--0-1!./src/modules/services/submodule/mainnetSwap/submodule2/bsc/views/ViewServicesMainnetSwapBscOptions.vue?vue&type=template&id=67da5318&scoped=true ***!
  \*********************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! exports provided: render */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"render\", function() { return render; });\n/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ \"./node_modules/vue/dist/vue.runtime.esm-bundler.js\");\n/* harmony import */ var _modules_dashboard_img_arrow_transaction_sender_out_orange_proximax_sirius_explorer_svg__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/modules/dashboard/img/arrow-transaction-sender-out-orange-proximax-sirius-explorer.svg */ \"./src/modules/dashboard/img/arrow-transaction-sender-out-orange-proximax-sirius-explorer.svg\");\n/* harmony import */ var _modules_dashboard_img_arrow_transaction_sender_out_orange_proximax_sirius_explorer_svg__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_modules_dashboard_img_arrow_transaction_sender_out_orange_proximax_sirius_explorer_svg__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _modules_dashboard_img_arrow_transaction_receive_in_green_proximax_sirius_explorer_svg__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/modules/dashboard/img/arrow-transaction-receive-in-green-proximax-sirius-explorer.svg */ \"./src/modules/dashboard/img/arrow-transaction-receive-in-green-proximax-sirius-explorer.svg\");\n/* harmony import */ var _modules_dashboard_img_arrow_transaction_receive_in_green_proximax_sirius_explorer_svg__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_modules_dashboard_img_arrow_transaction_receive_in_green_proximax_sirius_explorer_svg__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _modules_services_submodule_mainnetSwap_img_check_status_svg__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @/modules/services/submodule/mainnetSwap/img/check-status.svg */ \"./src/modules/services/submodule/mainnetSwap/img/check-status.svg\");\n/* harmony import */ var _modules_services_submodule_mainnetSwap_img_check_status_svg__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_modules_services_submodule_mainnetSwap_img_check_status_svg__WEBPACK_IMPORTED_MODULE_3__);\n\n\n\n\n\nconst _withId = /*#__PURE__*/Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"withScopeId\"])(\"data-v-67da5318\")\n\nObject(vue__WEBPACK_IMPORTED_MODULE_0__[\"pushScopeId\"])(\"data-v-67da5318\")\nconst _hoisted_1 = { class: \"flex justify-between text-xs sm:text-sm\" }\nconst _hoisted_2 = /*#__PURE__*/Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createVNode\"])(\"div\", null, [\n  /*#__PURE__*/Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createVNode\"])(\"span\", { class: \"text-gray-400\" }, \"Swap > BSC > \"),\n  /*#__PURE__*/Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createTextVNode\"])(),\n  /*#__PURE__*/Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createVNode\"])(\"span\", { class: \"text-blue-primary font-bold\" }, \"Select option\")\n], -1 /* HOISTED */)\nconst _hoisted_3 = { class: \"mt-2 py-3 gray-line text-center\" }\nconst _hoisted_4 = /*#__PURE__*/Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createVNode\"])(\"div\", { class: \"text-lg sm:text-xl text-gray-600 font-bold mt-10\" }, \"Please select an option\", -1 /* HOISTED */)\nconst _hoisted_5 = { class: \"md:grid lg:grid-cols-3 mx-5 lg:mx-5 2xl:mx-60 mt-5\" }\nconst _hoisted_6 = /*#__PURE__*/Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createTextVNode\"])(\"Out \")\nconst _hoisted_7 = /*#__PURE__*/Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createVNode\"])(\"img\", {\n  src: _modules_dashboard_img_arrow_transaction_sender_out_orange_proximax_sirius_explorer_svg__WEBPACK_IMPORTED_MODULE_1___default.a,\n  class: \"h-8 w-8 inline-block ml-2\"\n}, null, -1 /* HOISTED */)\nconst _hoisted_8 = /*#__PURE__*/Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createTextVNode\"])(\"Retrieving information, please wait...\")\nconst _hoisted_9 = /*#__PURE__*/Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createTextVNode\"])(\"Service unavailable.\")\nconst _hoisted_10 = /*#__PURE__*/Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createTextVNode\"])(\"Unable to connect.\")\nconst _hoisted_11 = { class: \"lg:col-span-1\" }\nconst _hoisted_12 = /*#__PURE__*/Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createVNode\"])(\"div\", { class: \"m-5 lg:mx-3 rounded-2xl border border-blue-primary option-div hover:bg-blue-primary\" }, [\n  /*#__PURE__*/Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createVNode\"])(\"div\", { class: \"mt-5 sm:mt-10 text-blue-primary font-bold text-xl mb-1\" }, [\n    /*#__PURE__*/Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createTextVNode\"])(\"In \"),\n    /*#__PURE__*/Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createVNode\"])(\"img\", {\n      src: _modules_dashboard_img_arrow_transaction_receive_in_green_proximax_sirius_explorer_svg__WEBPACK_IMPORTED_MODULE_2___default.a,\n      class: \"h-8 w-8 inline-block ml-2\"\n    })\n  ]),\n  /*#__PURE__*/Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createVNode\"])(\"div\", { class: \"mt-3 mb-5 sm:mb-10 text-gray-500\" }, \"From BSC to Sirius\")\n], -1 /* HOISTED */)\nconst _hoisted_13 = { class: \"lg:col-span-1\" }\nconst _hoisted_14 = /*#__PURE__*/Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createVNode\"])(\"div\", { class: \"m-5 lg:mx-3 rounded-2xl border border-blue-primary option-div hover:bg-blue-primary\" }, [\n  /*#__PURE__*/Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createVNode\"])(\"div\", { class: \"mt-5 sm:mt-10 text-blue-primary font-bold text-xl mb-1\" }, [\n    /*#__PURE__*/Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createTextVNode\"])(\"Check status \"),\n    /*#__PURE__*/Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createVNode\"])(\"img\", {\n      src: _modules_services_submodule_mainnetSwap_img_check_status_svg__WEBPACK_IMPORTED_MODULE_3___default.a,\n      class: \"h-8 w-8 inline-block\"\n    })\n  ]),\n  /*#__PURE__*/Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createVNode\"])(\"div\", { class: \"mt-3 mb-5 sm:mb-10 text-gray-500\" }, \"Between BSC and Sirius\")\n], -1 /* HOISTED */)\nObject(vue__WEBPACK_IMPORTED_MODULE_0__[\"popScopeId\"])()\n\nconst render = /*#__PURE__*/_withId((_ctx, _cache, $props, $setup, $data, $options) => {\n  const _component_router_link = Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"resolveComponent\"])(\"router-link\")\n  const _component_InlineMessage = Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"resolveComponent\"])(\"InlineMessage\")\n\n  return (Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"openBlock\"])(), Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createBlock\"])(\"div\", null, [\n    Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createVNode\"])(\"div\", _hoisted_1, [\n      _hoisted_2,\n      Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createVNode\"])(\"div\", null, [\n        Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createVNode\"])(_component_router_link, {\n          to: { name: 'ViewServices'},\n          class: \"font-bold\",\n          \"active-class\": \"accounts\"\n        }, {\n          default: _withId(() => [\n            Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createTextVNode\"])(Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"toDisplayString\"])(_ctx.$t('services.allservices')), 1 /* TEXT */)\n          ]),\n          _: 1 /* STABLE */\n        })\n      ])\n    ]),\n    Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createVNode\"])(\"div\", _hoisted_3, [\n      _hoisted_4,\n      Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createVNode\"])(\"div\", _hoisted_5, [\n        Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createVNode\"])(\"div\", {\n          class: [\"lg:col-span-1\", `${!$setup.isOutgoingOptionDisabled?'cursor-pointer':'' }`],\n          onClick: _cache[1] || (_cache[1] = (...args) => ($setup.gotoOutgoingPage && $setup.gotoOutgoingPage(...args)))\n        }, [\n          Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createVNode\"])(\"div\", {\n            class: [\"m-5 lg:mx-3 rounded-2xl border option-div\", `${!$setup.isOutgoingOptionDisabled?'border-blue-primary hover:bg-blue-primary':'border-gray-200 bg-gray-300' }`]\n          }, [\n            Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createVNode\"])(\"div\", {\n              class: [\"mt-5 sm:mt-10 font-bold text-xl mb-1\", `${!$setup.isOutgoingOptionDisabled?'text-blue-primary':'text-white' }`]\n            }, [\n              _hoisted_6,\n              _hoisted_7\n            ], 2 /* CLASS */),\n            Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createVNode\"])(\"div\", {\n              class: [\"mt-3 mb-5 sm:mb-10\", `${!$setup.isOutgoingOptionDisabled?'text-gray-500':'text-white' }`]\n            }, Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"toDisplayString\"])($setup.outgoingText), 3 /* TEXT, CLASS */)\n          ], 2 /* CLASS */),\n          ($setup.displayWaitMessage)\n            ? (Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"openBlock\"])(), Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createBlock\"])(_component_InlineMessage, {\n                key: 0,\n                severity: \"info\",\n                class: \"rounded\"\n              }, {\n                default: _withId(() => [\n                  _hoisted_8\n                ]),\n                _: 1 /* STABLE */\n              }))\n            : Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createCommentVNode\"])(\"v-if\", true),\n          ($setup.displaErrorMessage)\n            ? (Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"openBlock\"])(), Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createBlock\"])(_component_InlineMessage, {\n                key: 1,\n                severity: \"error\"\n              }, {\n                default: _withId(() => [\n                  _hoisted_9\n                ]),\n                _: 1 /* STABLE */\n              }))\n            : Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createCommentVNode\"])(\"v-if\", true),\n          ($setup.displaConnectionMessage)\n            ? (Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"openBlock\"])(), Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createBlock\"])(_component_InlineMessage, {\n                key: 2,\n                severity: \"error\"\n              }, {\n                default: _withId(() => [\n                  _hoisted_10\n                ]),\n                _: 1 /* STABLE */\n              }))\n            : Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createCommentVNode\"])(\"v-if\", true)\n        ], 2 /* CLASS */),\n        Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createVNode\"])(\"div\", _hoisted_11, [\n          Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createVNode\"])(_component_router_link, { to: { name: 'ViewServicesMainnetSwapBSCToSirius' } }, {\n            default: _withId(() => [\n              _hoisted_12\n            ]),\n            _: 1 /* STABLE */\n          })\n        ]),\n        Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createVNode\"])(\"div\", _hoisted_13, [\n          Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createVNode\"])(_component_router_link, { to: { name: 'ViewServicesMainnetSwapCheckBSCToSirius' } }, {\n            default: _withId(() => [\n              _hoisted_14\n            ]),\n            _: 1 /* STABLE */\n          })\n        ])\n      ])\n    ])\n  ]))\n})\n\n//# sourceURL=webpack:///./src/modules/services/submodule/mainnetSwap/submodule2/bsc/views/ViewServicesMainnetSwapBscOptions.vue?./node_modules/vue-loader-v16/dist/templateLoader.js??ref--6!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader-v16/dist??ref--0-1");

/***/ }),

/***/ "./node_modules/vue-style-loader/index.js?!./node_modules/css-loader/dist/cjs.js?!./node_modules/vue-loader-v16/dist/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/dist/cjs.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader-v16/dist/index.js?!./src/modules/services/submodule/mainnetSwap/submodule2/bsc/views/ViewServicesMainnetSwapBscOptions.vue?vue&type=style&index=0&id=67da5318&lang=scss&scoped=true":
/*!****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-style-loader??ref--8-oneOf-1-0!./node_modules/css-loader/dist/cjs.js??ref--8-oneOf-1-1!./node_modules/vue-loader-v16/dist/stylePostLoader.js!./node_modules/postcss-loader/src??ref--8-oneOf-1-2!./node_modules/sass-loader/dist/cjs.js??ref--8-oneOf-1-3!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader-v16/dist??ref--0-1!./src/modules/services/submodule/mainnetSwap/submodule2/bsc/views/ViewServicesMainnetSwapBscOptions.vue?vue&type=style&index=0&id=67da5318&lang=scss&scoped=true ***!
  \****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("// style-loader: Adds some css to the DOM by adding a <style> tag\n\n// load the styles\nvar content = __webpack_require__(/*! !../../../../../../../../node_modules/css-loader/dist/cjs.js??ref--8-oneOf-1-1!../../../../../../../../node_modules/vue-loader-v16/dist/stylePostLoader.js!../../../../../../../../node_modules/postcss-loader/src??ref--8-oneOf-1-2!../../../../../../../../node_modules/sass-loader/dist/cjs.js??ref--8-oneOf-1-3!../../../../../../../../node_modules/cache-loader/dist/cjs.js??ref--0-0!../../../../../../../../node_modules/vue-loader-v16/dist??ref--0-1!./ViewServicesMainnetSwapBscOptions.vue?vue&type=style&index=0&id=67da5318&lang=scss&scoped=true */ \"./node_modules/css-loader/dist/cjs.js?!./node_modules/vue-loader-v16/dist/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/dist/cjs.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader-v16/dist/index.js?!./src/modules/services/submodule/mainnetSwap/submodule2/bsc/views/ViewServicesMainnetSwapBscOptions.vue?vue&type=style&index=0&id=67da5318&lang=scss&scoped=true\");\nif(content.__esModule) content = content.default;\nif(typeof content === 'string') content = [[module.i, content, '']];\nif(content.locals) module.exports = content.locals;\n// add the styles to the DOM\nvar add = __webpack_require__(/*! ../../../../../../../../node_modules/vue-style-loader/lib/addStylesClient.js */ \"./node_modules/vue-style-loader/lib/addStylesClient.js\").default\nvar update = add(\"66b69a31\", content, false, {\"sourceMap\":false,\"shadowMode\":false});\n// Hot Module Replacement\nif(false) {}\n\n//# sourceURL=webpack:///./src/modules/services/submodule/mainnetSwap/submodule2/bsc/views/ViewServicesMainnetSwapBscOptions.vue?./node_modules/vue-style-loader??ref--8-oneOf-1-0!./node_modules/css-loader/dist/cjs.js??ref--8-oneOf-1-1!./node_modules/vue-loader-v16/dist/stylePostLoader.js!./node_modules/postcss-loader/src??ref--8-oneOf-1-2!./node_modules/sass-loader/dist/cjs.js??ref--8-oneOf-1-3!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader-v16/dist??ref--0-1");

/***/ }),

/***/ "./src/modules/services/submodule/mainnetSwap/submodule2/bsc/views/ViewServicesMainnetSwapBscOptions.vue":
/*!***************************************************************************************************************!*\
  !*** ./src/modules/services/submodule/mainnetSwap/submodule2/bsc/views/ViewServicesMainnetSwapBscOptions.vue ***!
  \***************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _ViewServicesMainnetSwapBscOptions_vue_vue_type_template_id_67da5318_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ViewServicesMainnetSwapBscOptions.vue?vue&type=template&id=67da5318&scoped=true */ \"./src/modules/services/submodule/mainnetSwap/submodule2/bsc/views/ViewServicesMainnetSwapBscOptions.vue?vue&type=template&id=67da5318&scoped=true\");\n/* harmony import */ var _ViewServicesMainnetSwapBscOptions_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ViewServicesMainnetSwapBscOptions.vue?vue&type=script&lang=js */ \"./src/modules/services/submodule/mainnetSwap/submodule2/bsc/views/ViewServicesMainnetSwapBscOptions.vue?vue&type=script&lang=js\");\n/* empty/unused harmony star reexport *//* harmony import */ var _ViewServicesMainnetSwapBscOptions_vue_vue_type_style_index_0_id_67da5318_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ViewServicesMainnetSwapBscOptions.vue?vue&type=style&index=0&id=67da5318&lang=scss&scoped=true */ \"./src/modules/services/submodule/mainnetSwap/submodule2/bsc/views/ViewServicesMainnetSwapBscOptions.vue?vue&type=style&index=0&id=67da5318&lang=scss&scoped=true\");\n/* harmony import */ var _home_runner_work_web_wallet_vuejs_web_wallet_vuejs_node_modules_vue_loader_v16_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./node_modules/vue-loader-v16/dist/exportHelper.js */ \"./node_modules/vue-loader-v16/dist/exportHelper.js\");\n/* harmony import */ var _home_runner_work_web_wallet_vuejs_web_wallet_vuejs_node_modules_vue_loader_v16_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_home_runner_work_web_wallet_vuejs_web_wallet_vuejs_node_modules_vue_loader_v16_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_3__);\n\n\n\n\n\n\n\nconst __exports__ = /*#__PURE__*/_home_runner_work_web_wallet_vuejs_web_wallet_vuejs_node_modules_vue_loader_v16_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_3___default()(_ViewServicesMainnetSwapBscOptions_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"], [['render',_ViewServicesMainnetSwapBscOptions_vue_vue_type_template_id_67da5318_scoped_true__WEBPACK_IMPORTED_MODULE_0__[\"render\"]],['__scopeId',\"data-v-67da5318\"],['__file',\"src/modules/services/submodule/mainnetSwap/submodule2/bsc/views/ViewServicesMainnetSwapBscOptions.vue\"]])\n/* hot reload */\nif (false) {}\n\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (__exports__);\n\n//# sourceURL=webpack:///./src/modules/services/submodule/mainnetSwap/submodule2/bsc/views/ViewServicesMainnetSwapBscOptions.vue?");

/***/ }),

/***/ "./src/modules/services/submodule/mainnetSwap/submodule2/bsc/views/ViewServicesMainnetSwapBscOptions.vue?vue&type=script&lang=js":
/*!***************************************************************************************************************************************!*\
  !*** ./src/modules/services/submodule/mainnetSwap/submodule2/bsc/views/ViewServicesMainnetSwapBscOptions.vue?vue&type=script&lang=js ***!
  \***************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_v16_dist_index_js_ref_0_1_ViewServicesMainnetSwapBscOptions_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../../../node_modules/cache-loader/dist/cjs.js??ref--0-0!../../../../../../../../node_modules/vue-loader-v16/dist??ref--0-1!./ViewServicesMainnetSwapBscOptions.vue?vue&type=script&lang=js */ \"./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader-v16/dist/index.js?!./src/modules/services/submodule/mainnetSwap/submodule2/bsc/views/ViewServicesMainnetSwapBscOptions.vue?vue&type=script&lang=js\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return _node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_v16_dist_index_js_ref_0_1_ViewServicesMainnetSwapBscOptions_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"]; });\n\n/* empty/unused harmony star reexport */ \n\n//# sourceURL=webpack:///./src/modules/services/submodule/mainnetSwap/submodule2/bsc/views/ViewServicesMainnetSwapBscOptions.vue?");

/***/ }),

/***/ "./src/modules/services/submodule/mainnetSwap/submodule2/bsc/views/ViewServicesMainnetSwapBscOptions.vue?vue&type=style&index=0&id=67da5318&lang=scss&scoped=true":
/*!************************************************************************************************************************************************************************!*\
  !*** ./src/modules/services/submodule/mainnetSwap/submodule2/bsc/views/ViewServicesMainnetSwapBscOptions.vue?vue&type=style&index=0&id=67da5318&lang=scss&scoped=true ***!
  \************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_node_modules_vue_loader_v16_dist_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_v16_dist_index_js_ref_0_1_ViewServicesMainnetSwapBscOptions_vue_vue_type_style_index_0_id_67da5318_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../../../node_modules/vue-style-loader??ref--8-oneOf-1-0!../../../../../../../../node_modules/css-loader/dist/cjs.js??ref--8-oneOf-1-1!../../../../../../../../node_modules/vue-loader-v16/dist/stylePostLoader.js!../../../../../../../../node_modules/postcss-loader/src??ref--8-oneOf-1-2!../../../../../../../../node_modules/sass-loader/dist/cjs.js??ref--8-oneOf-1-3!../../../../../../../../node_modules/cache-loader/dist/cjs.js??ref--0-0!../../../../../../../../node_modules/vue-loader-v16/dist??ref--0-1!./ViewServicesMainnetSwapBscOptions.vue?vue&type=style&index=0&id=67da5318&lang=scss&scoped=true */ \"./node_modules/vue-style-loader/index.js?!./node_modules/css-loader/dist/cjs.js?!./node_modules/vue-loader-v16/dist/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/dist/cjs.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader-v16/dist/index.js?!./src/modules/services/submodule/mainnetSwap/submodule2/bsc/views/ViewServicesMainnetSwapBscOptions.vue?vue&type=style&index=0&id=67da5318&lang=scss&scoped=true\");\n/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_node_modules_vue_loader_v16_dist_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_v16_dist_index_js_ref_0_1_ViewServicesMainnetSwapBscOptions_vue_vue_type_style_index_0_id_67da5318_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_node_modules_vue_loader_v16_dist_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_v16_dist_index_js_ref_0_1_ViewServicesMainnetSwapBscOptions_vue_vue_type_style_index_0_id_67da5318_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_node_modules_vue_loader_v16_dist_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_v16_dist_index_js_ref_0_1_ViewServicesMainnetSwapBscOptions_vue_vue_type_style_index_0_id_67da5318_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0__) if([\"default\"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_node_modules_vue_loader_v16_dist_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_v16_dist_index_js_ref_0_1_ViewServicesMainnetSwapBscOptions_vue_vue_type_style_index_0_id_67da5318_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));\n\n\n//# sourceURL=webpack:///./src/modules/services/submodule/mainnetSwap/submodule2/bsc/views/ViewServicesMainnetSwapBscOptions.vue?");

/***/ }),

/***/ "./src/modules/services/submodule/mainnetSwap/submodule2/bsc/views/ViewServicesMainnetSwapBscOptions.vue?vue&type=template&id=67da5318&scoped=true":
/*!*********************************************************************************************************************************************************!*\
  !*** ./src/modules/services/submodule/mainnetSwap/submodule2/bsc/views/ViewServicesMainnetSwapBscOptions.vue?vue&type=template&id=67da5318&scoped=true ***!
  \*********************************************************************************************************************************************************/
/*! exports provided: render */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _node_modules_vue_loader_v16_dist_templateLoader_js_ref_6_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_v16_dist_index_js_ref_0_1_ViewServicesMainnetSwapBscOptions_vue_vue_type_template_id_67da5318_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../../../node_modules/vue-loader-v16/dist/templateLoader.js??ref--6!../../../../../../../../node_modules/cache-loader/dist/cjs.js??ref--0-0!../../../../../../../../node_modules/vue-loader-v16/dist??ref--0-1!./ViewServicesMainnetSwapBscOptions.vue?vue&type=template&id=67da5318&scoped=true */ \"./node_modules/vue-loader-v16/dist/templateLoader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader-v16/dist/index.js?!./src/modules/services/submodule/mainnetSwap/submodule2/bsc/views/ViewServicesMainnetSwapBscOptions.vue?vue&type=template&id=67da5318&scoped=true\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"render\", function() { return _node_modules_vue_loader_v16_dist_templateLoader_js_ref_6_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_v16_dist_index_js_ref_0_1_ViewServicesMainnetSwapBscOptions_vue_vue_type_template_id_67da5318_scoped_true__WEBPACK_IMPORTED_MODULE_0__[\"render\"]; });\n\n\n\n//# sourceURL=webpack:///./src/modules/services/submodule/mainnetSwap/submodule2/bsc/views/ViewServicesMainnetSwapBscOptions.vue?");

/***/ })

}]);