(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[27],{

/***/ "./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist/templateLoader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist/index.js?!./src/modules/account/components/ConfirmDeleteAccountModal.vue?vue&type=template&id=513cbc55":
/*!****************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist/templateLoader.js??ref--6!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist??ref--0-1!./src/modules/account/components/ConfirmDeleteAccountModal.vue?vue&type=template&id=513cbc55 ***!
  \****************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! exports provided: render */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"render\", function() { return render; });\n/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ \"./node_modules/vue/dist/vue.runtime.esm-bundler.js\");\n\n\nconst _hoisted_1 = { class: \"inline-block\" }\nconst _hoisted_2 = {\n  key: 0,\n  class: \"popup-outer absolute flex z-50\"\n}\nconst _hoisted_3 = { class: \"modal-popup-box\" }\nconst _hoisted_4 = { class: \"delete-position\" }\nconst _hoisted_5 = { class: \"w-104\" }\nconst _hoisted_6 = {\n  key: 0,\n  class: \"error error_box\"\n}\nconst _hoisted_7 = { class: \"mt-10 mb-5\" }\nconst _hoisted_8 = { class: \"font-bold text-xl text-gray-900\" }\nconst _hoisted_9 = /*#__PURE__*/Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createTextVNode\"])()\nconst _hoisted_10 = { class: \"text-lg text-gray-700\" }\nconst _hoisted_11 = { class: \"flex justify-between p-4 rounded-xl bg-yellow-100 mb-4\" }\nconst _hoisted_12 = { class: \"text-center w-full\" }\nconst _hoisted_13 = { class: \"border border-gray-600 rounded-full w-8 h-8 inline-block relative\" }\nconst _hoisted_14 = { class: \"font-bold text-sm\" }\nconst _hoisted_15 = { class: \"text-sm mt-3\" }\nconst _hoisted_16 = { class: \"w-full\" }\nconst _hoisted_17 = { class: \"inline-flex items-center mb-10\" }\nconst _hoisted_18 = { class: \"ml-2 cursor-pointer text-xs\" }\n\nfunction render(_ctx, _cache, $props, $setup, $data, $options) {\n  const _component_font_awesome_icon = Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"resolveComponent\"])(\"font-awesome-icon\")\n\n  return (Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"openBlock\"])(), Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createBlock\"])(\"div\", _hoisted_1, [\n    Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createVNode\"])(\"button\", {\n      onClick: _cache[1] || (_cache[1] = $event => ($data.toggleModal = !$data.toggleModal)),\n      class: \"default-btn w-50\"\n    }, Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"toDisplayString\"])(_ctx.$t('deletewallet.proceed')), 1 /* TEXT */),\n    Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createVNode\"])(vue__WEBPACK_IMPORTED_MODULE_0__[\"Transition\"], {\n      \"enter-active-class\": \"animate__animated animate__fadeInDown\",\n      \"leave-active-class\": \"animate__animated animate__fadeOutUp\"\n    }, {\n      default: Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"withCtx\"])(() => [\n        ($data.toggleModal)\n          ? (Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"openBlock\"])(), Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createBlock\"])(\"div\", _hoisted_2, [\n              Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createVNode\"])(\"div\", _hoisted_3, [\n                Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createVNode\"])(\"div\", _hoisted_4, [\n                  Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createVNode\"])(_component_font_awesome_icon, {\n                    icon: \"times\",\n                    class: \"delete-icon-style\",\n                    onClick: _cache[2] || (_cache[2] = $event => ($data.toggleModal = !$data.toggleModal))\n                  })\n                ]),\n                Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createVNode\"])(\"div\", _hoisted_5, [\n                  ($setup.err!='')\n                    ? (Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"openBlock\"])(), Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createBlock\"])(\"div\", _hoisted_6, Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"toDisplayString\"])($setup.err), 1 /* TEXT */))\n                    : Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createCommentVNode\"])(\"v-if\", true),\n                  Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createVNode\"])(\"div\", _hoisted_7, [\n                    Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createVNode\"])(\"div\", _hoisted_8, Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"toDisplayString\"])($props.name), 1 /* TEXT */),\n                    _hoisted_9,\n                    Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createVNode\"])(\"span\", _hoisted_10, Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"toDisplayString\"])(_ctx.$t('deletewallet.deletemessage')), 1 /* TEXT */)\n                  ]),\n                  Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createVNode\"])(\"div\", _hoisted_11, [\n                    Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createVNode\"])(\"div\", _hoisted_12, [\n                      Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createVNode\"])(\"div\", _hoisted_13, [\n                        Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createVNode\"])(_component_font_awesome_icon, {\n                          icon: \"exclamation\",\n                          class: \"w-5 h-5 text-gray-600 inline-block absolute\",\n                          style: {\"top\":\"5px\",\"left\":\"12px\"}\n                        })\n                      ]),\n                      Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createVNode\"])(\"div\", _hoisted_14, Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"toDisplayString\"])(_ctx.$t('deletewallet.warning')), 1 /* TEXT */),\n                      Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createVNode\"])(\"p\", _hoisted_15, Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"toDisplayString\"])(_ctx.$t('deletewallet.warningmessage')), 1 /* TEXT */)\n                    ])\n                  ]),\n                  Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createVNode\"])(\"fieldset\", _hoisted_16, [\n                    Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createVNode\"])(\"label\", _hoisted_17, [\n                      Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"withDirectives\"])(Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createVNode\"])(\"input\", {\n                        type: \"checkbox\",\n                        class: \"h-5 w-5 bg-blue-primary\",\n                        \"onUpdate:modelValue\": _cache[3] || (_cache[3] = $event => ($setup.readCheck = $event))\n                      }, null, 512 /* NEED_PATCH */), [\n                        [vue__WEBPACK_IMPORTED_MODULE_0__[\"vModelCheckbox\"], $setup.readCheck]\n                      ]),\n                      Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createVNode\"])(\"span\", _hoisted_18, Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"toDisplayString\"])(_ctx.$t('deletewallet.deleteconsent')), 1 /* TEXT */)\n                    ]),\n                    Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createVNode\"])(\"div\", null, [\n                      Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createVNode\"])(\"button\", {\n                        type: \"button\",\n                        class: \"default-btn mr-5 focus:outline-none\",\n                        onClick: _cache[4] || (_cache[4] = $event => ($data.toggleModal = !$data.toggleModal))\n                      }, Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"toDisplayString\"])(_ctx.$t('deletewallet.cancel')), 1 /* TEXT */),\n                      Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createVNode\"])(\"button\", {\n                        type: \"submit\",\n                        class: \"default-btn py-1 disabled:opacity-50\",\n                        onClick: _cache[5] || (_cache[5] = $event => {$setup.deleteAccount();}),\n                        disabled: $setup.disableDelete\n                      }, Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"toDisplayString\"])(_ctx.$t('deletewallet.delete')), 9 /* TEXT, PROPS */, [\"disabled\"])\n                    ])\n                  ])\n                ])\n              ])\n            ]))\n          : Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createCommentVNode\"])(\"v-if\", true)\n      ]),\n      _: 1 /* STABLE */\n    }),\n    ($data.toggleModal)\n      ? (Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"openBlock\"])(), Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createBlock\"])(\"div\", {\n          key: 0,\n          onClick: _cache[6] || (_cache[6] = $event => ($data.toggleModal = !$data.toggleModal)),\n          class: \"fixed inset-0 bg-opacity-90 bg-blue-primary\"\n        }))\n      : Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createCommentVNode\"])(\"v-if\", true)\n  ]))\n}\n\n//# sourceURL=webpack:///./src/modules/account/components/ConfirmDeleteAccountModal.vue?./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist/templateLoader.js??ref--6!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist??ref--0-1");

/***/ }),

/***/ "./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist/templateLoader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist/index.js?!./src/modules/account/views/ViewAccountDelete.vue?vue&type=template&id=97e65c42":
/*!***************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist/templateLoader.js??ref--6!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist??ref--0-1!./src/modules/account/views/ViewAccountDelete.vue?vue&type=template&id=97e65c42 ***!
  \***************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! exports provided: render */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"render\", function() { return render; });\n/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ \"./node_modules/vue/dist/vue.runtime.esm-bundler.js\");\n\n\nconst _hoisted_1 = { class: \"flex justify-between text-xs sm:text-sm\" }\nconst _hoisted_2 = { class: \"text-gray-400\" }\nconst _hoisted_3 = /*#__PURE__*/Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createTextVNode\"])()\nconst _hoisted_4 = { class: \"text-blue-primary font-bold\" }\nconst _hoisted_5 = { class: \"mt-2 py-3 gray-line\" }\nconst _hoisted_6 = { class: \"container mx-auto text-center\" }\nconst _hoisted_7 = { class: \"mx-auto pt-5 lg:px-20\" }\nconst _hoisted_8 = { class: \"flex justify-between p-4 rounded-xl bg-gray-100 mb-8 items-center\" }\nconst _hoisted_9 = { class: \"text-left w-full relative\" }\nconst _hoisted_10 = { class: \"text-xs font-bold mb-1\" }\nconst _hoisted_11 = { class: \"flex justify-between p-4 rounded-xl bg-gray-100 mb-4 items-center\" }\nconst _hoisted_12 = { class: \"text-left w-full relative\" }\nconst _hoisted_13 = /*#__PURE__*/Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createVNode\"])(\"div\", { class: \"absolute z-20 w-full h-full\" }, null, -1 /* HOISTED */)\nconst _hoisted_14 = { class: \"text-xs font-bold mb-1\" }\nconst _hoisted_15 = { class: \"text-xl mt-10\" }\nconst _hoisted_16 = { class: \"xs:w-full inline-block lg:w-4/12 text-center mt-5\" }\nconst _hoisted_17 = { class: \"w-full flex justify-around\" }\n\nfunction render(_ctx, _cache, $props, $setup, $data, $options) {\n  const _component_router_link = Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"resolveComponent\"])(\"router-link\")\n  const _component_font_awesome_icon = Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"resolveComponent\"])(\"font-awesome-icon\")\n  const _component_ConfirmDeleteAccountModal = Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"resolveComponent\"])(\"ConfirmDeleteAccountModal\")\n\n  return (Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"openBlock\"])(), Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createBlock\"])(vue__WEBPACK_IMPORTED_MODULE_0__[\"Fragment\"], null, [\n    Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createVNode\"])(\"div\", _hoisted_1, [\n      Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createVNode\"])(\"div\", null, [\n        Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createVNode\"])(\"span\", _hoisted_2, Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"toDisplayString\"])(_ctx.$t('NavigationMenu.Accounts')) + \" >\", 1 /* TEXT */),\n        _hoisted_3,\n        Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createVNode\"])(\"span\", _hoisted_4, Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"toDisplayString\"])(_ctx.$t('accounts.delete')), 1 /* TEXT */)\n      ]),\n      Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createVNode\"])(\"div\", null, [\n        Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createVNode\"])(_component_router_link, {\n          to: {name: 'ViewAccountDisplayAll'},\n          class: \"font-bold\",\n          \"active-class\": \"accounts\"\n        }, {\n          default: Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"withCtx\"])(() => [\n            Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createTextVNode\"])(Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"toDisplayString\"])(_ctx.$t('accounts.viewall')), 1 /* TEXT */)\n          ]),\n          _: 1 /* STABLE */\n        })\n      ])\n    ]),\n    Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createVNode\"])(\"div\", _hoisted_5, [\n      Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createVNode\"])(\"div\", _hoisted_6, [\n        Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createVNode\"])(\"div\", _hoisted_7, [\n          Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createVNode\"])(\"div\", _hoisted_8, [\n            Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createVNode\"])(\"div\", _hoisted_9, [\n              Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createVNode\"])(\"div\", _hoisted_10, Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"toDisplayString\"])(_ctx.$t('accounts.name')) + \":\", 1 /* TEXT */),\n              Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createVNode\"])(\"div\", null, Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"toDisplayString\"])($setup.accountNameDisplay), 1 /* TEXT */)\n            ])\n          ]),\n          Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createVNode\"])(\"div\", _hoisted_11, [\n            Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createVNode\"])(\"div\", _hoisted_12, [\n              _hoisted_13,\n              Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createVNode\"])(\"div\", _hoisted_14, Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"toDisplayString\"])(_ctx.$t('createsuccessful.address')) + \":\", 1 /* TEXT */),\n              Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createVNode\"])(\"div\", {\n                id: \"address\",\n                class: \"text-sm w-full outline-none bg-gray-100 z-10\",\n                copyValue: $setup.prettyAddress,\n                copySubject: \"Address\"\n              }, Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"toDisplayString\"])($setup.prettyAddress), 9 /* TEXT, PROPS */, [\"copyValue\"])\n            ]),\n            Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createVNode\"])(_component_font_awesome_icon, {\n              icon: \"copy\",\n              onClick: _cache[1] || (_cache[1] = $event => ($setup.copy('address'))),\n              class: \"w-5 h-5 text-gray-500 cursor-pointer inline-block\"\n            })\n          ]),\n          Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createVNode\"])(\"div\", _hoisted_15, Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"toDisplayString\"])(_ctx.$t('accounts.question')), 1 /* TEXT */),\n          Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createVNode\"])(\"div\", _hoisted_16, [\n            Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createVNode\"])(\"div\", _hoisted_17, [\n              Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createVNode\"])(_component_router_link, {\n                to: {name: 'ViewAccountDisplayAll'},\n                class: \"default-btn w-38 mr-2\"\n              }, {\n                default: Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"withCtx\"])(() => [\n                  Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createTextVNode\"])(Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"toDisplayString\"])(_ctx.$t('deletewallet.goback')), 1 /* TEXT */)\n                ]),\n                _: 1 /* STABLE */\n              }),\n              Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createVNode\"])(_component_ConfirmDeleteAccountModal, {\n                name: $props.name,\n                address: $setup.acc.address\n              }, null, 8 /* PROPS */, [\"name\", \"address\"])\n            ])\n          ])\n        ])\n      ])\n    ])\n  ], 64 /* STABLE_FRAGMENT */))\n}\n\n//# sourceURL=webpack:///./src/modules/account/views/ViewAccountDelete.vue?./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist/templateLoader.js??ref--6!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist??ref--0-1");

/***/ }),

/***/ "./node_modules/cache-loader/dist/cjs.js?!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist/index.js?!./src/modules/account/components/ConfirmDeleteAccountModal.vue?vue&type=script&lang=js":
/*!***************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist??ref--0-1!./src/modules/account/components/ConfirmDeleteAccountModal.vue?vue&type=script&lang=js ***!
  \***************************************************************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ \"./node_modules/vue/dist/vue.runtime.esm-bundler.js\");\n/* harmony import */ var vue_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! vue-router */ \"./node_modules/vue-router/dist/vue-router.esm-bundler.js\");\n/* harmony import */ var _state_walletState__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/state/walletState */ \"./src/state/walletState.ts\");\n/* harmony import */ var vue_i18n__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! vue-i18n */ \"./node_modules/vue-i18n/dist/vue-i18n.esm-bundler.js\");\n\n\n\n\n\n\n/* harmony default export */ __webpack_exports__[\"default\"] = ({\n  name: 'ConfirmDeleteAccountModal',\n  props:['name', 'address'],\n  data() {\n    return {\n      toggleModal: false,\n    };\n  },\n\n  setup(p){\n    const {t} = Object(vue_i18n__WEBPACK_IMPORTED_MODULE_3__[\"useI18n\"])();\n    const router = Object(vue_router__WEBPACK_IMPORTED_MODULE_1__[\"useRouter\"])();\n    const err = Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"ref\"])(\"\");\n    const readCheck = Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"ref\"])(false);\n    const disableDelete = Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"computed\"])(\n      () => !(\n        readCheck.value\n      )\n    );\n\n    const deleteAccount = () => {\n      const accountIndex = _state_walletState__WEBPACK_IMPORTED_MODULE_2__[\"walletState\"].currentLoggedInWallet.accounts.findIndex((element) => element.name == p.name);\n      if(accountIndex > -1){\n        _state_walletState__WEBPACK_IMPORTED_MODULE_2__[\"walletState\"].currentLoggedInWallet.removeAccount(p.name);\n        _state_walletState__WEBPACK_IMPORTED_MODULE_2__[\"walletState\"].wallets.saveMyWalletOnlytoLocalStorage(_state_walletState__WEBPACK_IMPORTED_MODULE_2__[\"walletState\"].currentLoggedInWallet);\n        router.push({ name: 'ViewAccountDisplayAll', params: {deleteAccount: 'success' } });\n      }else{\n        err.value = t('scriptvalues.removeaccount');\n      }\n    };\n\n    return {\n      err,\n      readCheck,\n      disableDelete,\n      deleteAccount,\n    };\n  },\n});\n\n\n//# sourceURL=webpack:///./src/modules/account/components/ConfirmDeleteAccountModal.vue?./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist??ref--0-1");

/***/ }),

/***/ "./node_modules/cache-loader/dist/cjs.js?!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist/index.js?!./src/modules/account/views/ViewAccountDelete.vue?vue&type=script&lang=js":
/*!**************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist??ref--0-1!./src/modules/account/views/ViewAccountDelete.vue?vue&type=script&lang=js ***!
  \**************************************************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ \"./node_modules/vue/dist/vue.runtime.esm-bundler.js\");\n/* harmony import */ var vue_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! vue-router */ \"./node_modules/vue-router/dist/vue-router.esm-bundler.js\");\n/* harmony import */ var _modules_account_components_ConfirmDeleteAccountModal_vue__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/modules/account/components/ConfirmDeleteAccountModal.vue */ \"./src/modules/account/components/ConfirmDeleteAccountModal.vue\");\n/* harmony import */ var _util_functions__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @/util/functions */ \"./src/util/functions.ts\");\n/* harmony import */ var primevue_usetoast__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! primevue/usetoast */ \"./node_modules/primevue/usetoast/usetoast.esm.js\");\n/* harmony import */ var _state_walletState__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @/state/walletState */ \"./src/state/walletState.ts\");\n/* harmony import */ var _util_typeHelper__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @/util/typeHelper */ \"./src/util/typeHelper.ts\");\n\n\n\n\n\n\n\n\n\n/* harmony default export */ __webpack_exports__[\"default\"] = ({\n  name: 'ViewAccountDelete',\n  components: {\n    ConfirmDeleteAccountModal: _modules_account_components_ConfirmDeleteAccountModal_vue__WEBPACK_IMPORTED_MODULE_2__[\"default\"],\n  },\n  props: {\n    name: String,\n  },\n  setup(p){\n    const toast = Object(primevue_usetoast__WEBPACK_IMPORTED_MODULE_4__[\"useToast\"])();\n    const err = Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"ref\"])(false);\n    const accountName = Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"ref\"])(p.name);\n    const accountNameDisplay = Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"ref\"])(p.name);\n    const router = Object(vue_router__WEBPACK_IMPORTED_MODULE_1__[\"useRouter\"])();\n    const copy = (id) =>{\n      let stringToCopy = document.getElementById(id).getAttribute(\"copyValue\");\n      let copySubject = document.getElementById(id).getAttribute(\"copySubject\");\n      Object(_util_functions__WEBPACK_IMPORTED_MODULE_3__[\"copyToClipboard\"])(stringToCopy);\n\n      toast.add({severity:'info', detail: copySubject + ' copied', group: 'br', life: 3000});\n    };\n\n    const getAcccountDetails = () => {\n      const account = _state_walletState__WEBPACK_IMPORTED_MODULE_5__[\"walletState\"].currentLoggedInWallet.accounts.find((accname) => accname.name == (p.name));\n      const other_acc = _state_walletState__WEBPACK_IMPORTED_MODULE_5__[\"walletState\"].currentLoggedInWallet.others.find((accname) => accname.name == p.name);\n      if(!account){\n        if(other_acc){\n          return other_acc;\n        }\n      }else{\n        return account;\n      }\n    };\n\n    // get account details\n    const acc = getAcccountDetails();\n    const prettyAddress = _util_typeHelper__WEBPACK_IMPORTED_MODULE_6__[\"Helper\"].createAddress(acc.address).pretty();\n\n    if(acc==-1 && acc.default){\n      router.push({ name: \"ViewAccountDisplayAll\"});\n    }\n\n    return {\n      err,\n      accountNameDisplay,\n      accountName,\n      prettyAddress,\n      acc,\n      copy\n    };\n  },\n});\n\n\n//# sourceURL=webpack:///./src/modules/account/views/ViewAccountDelete.vue?./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist??ref--0-1");

/***/ }),

/***/ "./src/modules/account/components/ConfirmDeleteAccountModal.vue":
/*!**********************************************************************!*\
  !*** ./src/modules/account/components/ConfirmDeleteAccountModal.vue ***!
  \**********************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _ConfirmDeleteAccountModal_vue_vue_type_template_id_513cbc55__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ConfirmDeleteAccountModal.vue?vue&type=template&id=513cbc55 */ \"./src/modules/account/components/ConfirmDeleteAccountModal.vue?vue&type=template&id=513cbc55\");\n/* harmony import */ var _ConfirmDeleteAccountModal_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ConfirmDeleteAccountModal.vue?vue&type=script&lang=js */ \"./src/modules/account/components/ConfirmDeleteAccountModal.vue?vue&type=script&lang=js\");\n/* empty/unused harmony star reexport *//* harmony import */ var _home_runner_work_web_wallet_vuejs_web_wallet_vuejs_node_modules_vue_cli_service_node_modules_vue_loader_v16_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist/exportHelper.js */ \"./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist/exportHelper.js\");\n/* harmony import */ var _home_runner_work_web_wallet_vuejs_web_wallet_vuejs_node_modules_vue_cli_service_node_modules_vue_loader_v16_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_home_runner_work_web_wallet_vuejs_web_wallet_vuejs_node_modules_vue_cli_service_node_modules_vue_loader_v16_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2__);\n\n\n\n\n\nconst __exports__ = /*#__PURE__*/_home_runner_work_web_wallet_vuejs_web_wallet_vuejs_node_modules_vue_cli_service_node_modules_vue_loader_v16_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2___default()(_ConfirmDeleteAccountModal_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"], [['render',_ConfirmDeleteAccountModal_vue_vue_type_template_id_513cbc55__WEBPACK_IMPORTED_MODULE_0__[\"render\"]],['__file',\"src/modules/account/components/ConfirmDeleteAccountModal.vue\"]])\n/* hot reload */\nif (false) {}\n\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (__exports__);\n\n//# sourceURL=webpack:///./src/modules/account/components/ConfirmDeleteAccountModal.vue?");

/***/ }),

/***/ "./src/modules/account/components/ConfirmDeleteAccountModal.vue?vue&type=script&lang=js":
/*!**********************************************************************************************!*\
  !*** ./src/modules/account/components/ConfirmDeleteAccountModal.vue?vue&type=script&lang=js ***!
  \**********************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_cli_service_node_modules_vue_loader_v16_dist_index_js_ref_0_1_ConfirmDeleteAccountModal_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/cache-loader/dist/cjs.js??ref--0-0!../../../../node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist??ref--0-1!./ConfirmDeleteAccountModal.vue?vue&type=script&lang=js */ \"./node_modules/cache-loader/dist/cjs.js?!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist/index.js?!./src/modules/account/components/ConfirmDeleteAccountModal.vue?vue&type=script&lang=js\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return _node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_cli_service_node_modules_vue_loader_v16_dist_index_js_ref_0_1_ConfirmDeleteAccountModal_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"]; });\n\n/* empty/unused harmony star reexport */ \n\n//# sourceURL=webpack:///./src/modules/account/components/ConfirmDeleteAccountModal.vue?");

/***/ }),

/***/ "./src/modules/account/components/ConfirmDeleteAccountModal.vue?vue&type=template&id=513cbc55":
/*!****************************************************************************************************!*\
  !*** ./src/modules/account/components/ConfirmDeleteAccountModal.vue?vue&type=template&id=513cbc55 ***!
  \****************************************************************************************************/
/*! exports provided: render */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _node_modules_vue_cli_service_node_modules_vue_loader_v16_dist_templateLoader_js_ref_6_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_cli_service_node_modules_vue_loader_v16_dist_index_js_ref_0_1_ConfirmDeleteAccountModal_vue_vue_type_template_id_513cbc55__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist/templateLoader.js??ref--6!../../../../node_modules/cache-loader/dist/cjs.js??ref--0-0!../../../../node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist??ref--0-1!./ConfirmDeleteAccountModal.vue?vue&type=template&id=513cbc55 */ \"./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist/templateLoader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist/index.js?!./src/modules/account/components/ConfirmDeleteAccountModal.vue?vue&type=template&id=513cbc55\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"render\", function() { return _node_modules_vue_cli_service_node_modules_vue_loader_v16_dist_templateLoader_js_ref_6_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_cli_service_node_modules_vue_loader_v16_dist_index_js_ref_0_1_ConfirmDeleteAccountModal_vue_vue_type_template_id_513cbc55__WEBPACK_IMPORTED_MODULE_0__[\"render\"]; });\n\n\n\n//# sourceURL=webpack:///./src/modules/account/components/ConfirmDeleteAccountModal.vue?");

/***/ }),

/***/ "./src/modules/account/views/ViewAccountDelete.vue":
/*!*********************************************************!*\
  !*** ./src/modules/account/views/ViewAccountDelete.vue ***!
  \*********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _ViewAccountDelete_vue_vue_type_template_id_97e65c42__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ViewAccountDelete.vue?vue&type=template&id=97e65c42 */ \"./src/modules/account/views/ViewAccountDelete.vue?vue&type=template&id=97e65c42\");\n/* harmony import */ var _ViewAccountDelete_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ViewAccountDelete.vue?vue&type=script&lang=js */ \"./src/modules/account/views/ViewAccountDelete.vue?vue&type=script&lang=js\");\n/* empty/unused harmony star reexport *//* harmony import */ var _home_runner_work_web_wallet_vuejs_web_wallet_vuejs_node_modules_vue_cli_service_node_modules_vue_loader_v16_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist/exportHelper.js */ \"./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist/exportHelper.js\");\n/* harmony import */ var _home_runner_work_web_wallet_vuejs_web_wallet_vuejs_node_modules_vue_cli_service_node_modules_vue_loader_v16_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_home_runner_work_web_wallet_vuejs_web_wallet_vuejs_node_modules_vue_cli_service_node_modules_vue_loader_v16_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2__);\n\n\n\n\n\nconst __exports__ = /*#__PURE__*/_home_runner_work_web_wallet_vuejs_web_wallet_vuejs_node_modules_vue_cli_service_node_modules_vue_loader_v16_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2___default()(_ViewAccountDelete_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"], [['render',_ViewAccountDelete_vue_vue_type_template_id_97e65c42__WEBPACK_IMPORTED_MODULE_0__[\"render\"]],['__file',\"src/modules/account/views/ViewAccountDelete.vue\"]])\n/* hot reload */\nif (false) {}\n\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (__exports__);\n\n//# sourceURL=webpack:///./src/modules/account/views/ViewAccountDelete.vue?");

/***/ }),

/***/ "./src/modules/account/views/ViewAccountDelete.vue?vue&type=script&lang=js":
/*!*********************************************************************************!*\
  !*** ./src/modules/account/views/ViewAccountDelete.vue?vue&type=script&lang=js ***!
  \*********************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_cli_service_node_modules_vue_loader_v16_dist_index_js_ref_0_1_ViewAccountDelete_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/cache-loader/dist/cjs.js??ref--0-0!../../../../node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist??ref--0-1!./ViewAccountDelete.vue?vue&type=script&lang=js */ \"./node_modules/cache-loader/dist/cjs.js?!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist/index.js?!./src/modules/account/views/ViewAccountDelete.vue?vue&type=script&lang=js\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return _node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_cli_service_node_modules_vue_loader_v16_dist_index_js_ref_0_1_ViewAccountDelete_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"]; });\n\n/* empty/unused harmony star reexport */ \n\n//# sourceURL=webpack:///./src/modules/account/views/ViewAccountDelete.vue?");

/***/ }),

/***/ "./src/modules/account/views/ViewAccountDelete.vue?vue&type=template&id=97e65c42":
/*!***************************************************************************************!*\
  !*** ./src/modules/account/views/ViewAccountDelete.vue?vue&type=template&id=97e65c42 ***!
  \***************************************************************************************/
/*! exports provided: render */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _node_modules_vue_cli_service_node_modules_vue_loader_v16_dist_templateLoader_js_ref_6_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_cli_service_node_modules_vue_loader_v16_dist_index_js_ref_0_1_ViewAccountDelete_vue_vue_type_template_id_97e65c42__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist/templateLoader.js??ref--6!../../../../node_modules/cache-loader/dist/cjs.js??ref--0-0!../../../../node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist??ref--0-1!./ViewAccountDelete.vue?vue&type=template&id=97e65c42 */ \"./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist/templateLoader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist/index.js?!./src/modules/account/views/ViewAccountDelete.vue?vue&type=template&id=97e65c42\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"render\", function() { return _node_modules_vue_cli_service_node_modules_vue_loader_v16_dist_templateLoader_js_ref_6_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_cli_service_node_modules_vue_loader_v16_dist_index_js_ref_0_1_ViewAccountDelete_vue_vue_type_template_id_97e65c42__WEBPACK_IMPORTED_MODULE_0__[\"render\"]; });\n\n\n\n//# sourceURL=webpack:///./src/modules/account/views/ViewAccountDelete.vue?");

/***/ })

}]);