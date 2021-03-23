(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[7],{

/***/ "./node_modules/cache-loader/dist/cjs.js?!./node_modules/babel-loader/lib/index.js!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader-v16/dist/index.js?!./src/components/NotificationModal.vue?vue&type=script&lang=js":
/*!********************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader-v16/dist??ref--0-1!./src/components/NotificationModal.vue?vue&type=script&lang=js ***!
  \********************************************************************************************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ \"./node_modules/vue/dist/vue.runtime.esm-bundler.js\");\n\n/* harmony default export */ __webpack_exports__[\"default\"] = ({\n  name: 'SignInModal',\n  props: ['name', 'toggleModal', 'msg', 'time', 'notiType'],\n  setup: function setup(p) {\n    var internalInstance = Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"getCurrentInstance\"])();\n    var emitter = internalInstance.appContext.config.globalProperties.emitter;\n    var bgColor = Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"computed\"])(function () {\n      if (p.notiType == 'warn') {\n        return 'bg-yellow-200';\n      } else if (p.notiType == 'err') {\n        return 'bg-pink-200';\n      } else {\n        return 'bg-blue-primary';\n      }\n    });\n\n    if (p.toggleModal) {\n      setTimeout(function () {\n        emitter.emit(\"CLOSE_NOTIFICATION\", false);\n      }, p.time);\n    }\n\n    var close = function close() {\n      emitter.emit(\"CLOSE_NOTIFICATION\", false);\n    };\n\n    return {\n      bgColor: bgColor,\n      close: close\n    };\n  }\n});\n\n//# sourceURL=webpack:///./src/components/NotificationModal.vue?./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader-v16/dist??ref--0-1");

/***/ }),

/***/ "./node_modules/cache-loader/dist/cjs.js?!./node_modules/babel-loader/lib/index.js!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader-v16/dist/index.js?!./src/components/WalletTile.vue?vue&type=script&lang=js":
/*!*************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader-v16/dist??ref--0-1!./src/components/WalletTile.vue?vue&type=script&lang=js ***!
  \*************************************************************************************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony default export */ __webpack_exports__[\"default\"] = ({\n  name: 'WalletTile',\n  props: {\n    wallet: {\n      type: Object,\n      default: null\n    }\n  }\n});\n\n//# sourceURL=webpack:///./src/components/WalletTile.vue?./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader-v16/dist??ref--0-1");

/***/ }),

/***/ "./node_modules/cache-loader/dist/cjs.js?!./node_modules/babel-loader/lib/index.js!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader-v16/dist/index.js?!./src/views/ViewWallets.vue?vue&type=script&lang=js":
/*!*********************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader-v16/dist??ref--0-1!./src/views/ViewWallets.vue?vue&type=script&lang=js ***!
  \*********************************************************************************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ \"./node_modules/vue/dist/vue.runtime.esm-bundler.js\");\n/* harmony import */ var _components_WalletTile_vue__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/components/WalletTile.vue */ \"./src/components/WalletTile.vue\");\n/* harmony import */ var _components_NotificationModal_vue__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/components/NotificationModal.vue */ \"./src/components/NotificationModal.vue\");\n\n\n\n/* harmony default export */ __webpack_exports__[\"default\"] = ({\n  name: 'ViewWallets',\n  props: ['deleteWallet'],\n  components: {\n    WalletTile: _components_WalletTile_vue__WEBPACK_IMPORTED_MODULE_1__[\"default\"],\n    NotificationModal: _components_NotificationModal_vue__WEBPACK_IMPORTED_MODULE_2__[\"default\"]\n  },\n  data: function data() {\n    return {\n      toggleModal: false\n    };\n  },\n  setup: function setup() {\n    var appStore = Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"inject\"])(\"appStore\");\n    return {\n      appStore: appStore\n    };\n  },\n  created: function created() {\n    var _this = this;\n\n    if (this.deleteWallet == 'success') {\n      this.toggleModal = true;\n    }\n\n    this.emitter.on(\"CLOSE_NOTIFICATION\", function (payload) {\n      _this.toggleModal = payload;\n    });\n  }\n});\n\n//# sourceURL=webpack:///./src/views/ViewWallets.vue?./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader-v16/dist??ref--0-1");

/***/ }),

/***/ "./node_modules/cache-loader/dist/cjs.js?!./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader-v16/dist/templateLoader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader-v16/dist/index.js?!./src/components/NotificationModal.vue?vue&type=template&id=4ff948fc":
/*!***************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/babel-loader/lib!./node_modules/vue-loader-v16/dist/templateLoader.js??ref--6!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader-v16/dist??ref--0-1!./src/components/NotificationModal.vue?vue&type=template&id=4ff948fc ***!
  \***************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! exports provided: render */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"render\", function() { return render; });\n/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ \"./node_modules/vue/dist/vue.runtime.esm-bundler.js\");\n\nvar _hoisted_1 = {\n  class: \"inline-block\"\n};\nvar _hoisted_2 = {\n  key: 0,\n  class: \"popup-outer absolute flex z-50\"\n};\nvar _hoisted_3 = {\n  class: \"modal-popup-box\"\n};\nvar _hoisted_4 = {\n  class: \"delete-position\"\n};\nvar _hoisted_5 = {\n  class: \"w-104\"\n};\nfunction render(_ctx, _cache, $props, $setup, $data, $options) {\n  var _component_font_awesome_icon = Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"resolveComponent\"])(\"font-awesome-icon\");\n\n  return Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"openBlock\"])(), Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createBlock\"])(\"div\", _hoisted_1, [Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createVNode\"])(vue__WEBPACK_IMPORTED_MODULE_0__[\"Transition\"], {\n    \"enter-active-class\": \"animate__animated animate__fadeInDown\",\n    \"leave-active-class\": \"animate__animated animate__fadeOutUp\"\n  }, {\n    default: Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"withCtx\"])(function () {\n      return [$props.toggleModal ? (Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"openBlock\"])(), Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createBlock\"])(\"div\", _hoisted_2, [Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createVNode\"])(\"div\", _hoisted_3, [Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createVNode\"])(\"div\", _hoisted_4, [Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createVNode\"])(_component_font_awesome_icon, {\n        icon: \"times\",\n        class: \"delete-icon-style\",\n        onClick: _cache[1] || (_cache[1] = function ($event) {\n          return $setup.close();\n        })\n      })]), Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createVNode\"])(\"div\", _hoisted_5, Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"toDisplayString\"])($props.msg), 1\n      /* TEXT */\n      )])])) : Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createCommentVNode\"])(\"v-if\", true)];\n    }),\n    _: 1\n    /* STABLE */\n\n  }), $props.toggleModal ? (Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"openBlock\"])(), Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createBlock\"])(\"div\", {\n    key: 0,\n    onClick: _cache[2] || (_cache[2] = function ($event) {\n      $setup.close();\n    }),\n    class: \"fixed inset-0 bg-opacity-30 \".concat($setup.bgColor)\n  }, null, 2\n  /* CLASS */\n  )) : Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createCommentVNode\"])(\"v-if\", true)]);\n}\n\n//# sourceURL=webpack:///./src/components/NotificationModal.vue?./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/babel-loader/lib!./node_modules/vue-loader-v16/dist/templateLoader.js??ref--6!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader-v16/dist??ref--0-1");

/***/ }),

/***/ "./node_modules/cache-loader/dist/cjs.js?!./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader-v16/dist/templateLoader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader-v16/dist/index.js?!./src/components/WalletTile.vue?vue&type=template&id=38a614f7":
/*!********************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/babel-loader/lib!./node_modules/vue-loader-v16/dist/templateLoader.js??ref--6!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader-v16/dist??ref--0-1!./src/components/WalletTile.vue?vue&type=template&id=38a614f7 ***!
  \********************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! exports provided: render */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"render\", function() { return render; });\n/* harmony import */ var core_js_modules_es_function_name_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/es.function.name.js */ \"./node_modules/core-js/modules/es.function.name.js\");\n/* harmony import */ var core_js_modules_es_function_name_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_function_name_js__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! vue */ \"./node_modules/vue/dist/vue.runtime.esm-bundler.js\");\n/* harmony import */ var _assets_img_icon_trash_can_gray_16h_proximax_sirius_wallet_svg__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../assets/img/icon-trash-can-gray-16h-proximax-sirius-wallet.svg */ \"./src/assets/img/icon-trash-can-gray-16h-proximax-sirius-wallet.svg\");\n/* harmony import */ var _assets_img_icon_trash_can_gray_16h_proximax_sirius_wallet_svg__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_assets_img_icon_trash_can_gray_16h_proximax_sirius_wallet_svg__WEBPACK_IMPORTED_MODULE_2__);\n\n\n\nvar _hoisted_1 = {\n  class: \"p-3\"\n};\nvar _hoisted_2 = {\n  class: \"bg-gray-200 rounded-2xl flex justify-between py-3\"\n};\nvar _hoisted_3 = {\n  class: \"ml-5 text-left text-sm\"\n};\nvar _hoisted_4 = {\n  class: \"font-bold mb-1\"\n};\nvar _hoisted_5 = {\n  class: \"text-xs\"\n};\nvar _hoisted_6 = {\n  class: \"font-bold\"\n};\nvar _hoisted_7 = {\n  class: \"mr-5 self-center\"\n};\n\nvar _hoisted_8 = /*#__PURE__*/Object(vue__WEBPACK_IMPORTED_MODULE_1__[\"createVNode\"])(\"img\", {\n  src: _assets_img_icon_trash_can_gray_16h_proximax_sirius_wallet_svg__WEBPACK_IMPORTED_MODULE_2___default.a,\n  class: \"w-7 cursor-pointer\"\n}, null, -1\n/* HOISTED */\n);\n\nfunction render(_ctx, _cache, $props, $setup, $data, $options) {\n  var _component_router_link = Object(vue__WEBPACK_IMPORTED_MODULE_1__[\"resolveComponent\"])(\"router-link\");\n\n  return Object(vue__WEBPACK_IMPORTED_MODULE_1__[\"openBlock\"])(), Object(vue__WEBPACK_IMPORTED_MODULE_1__[\"createBlock\"])(\"div\", _hoisted_1, [Object(vue__WEBPACK_IMPORTED_MODULE_1__[\"createVNode\"])(\"div\", _hoisted_2, [Object(vue__WEBPACK_IMPORTED_MODULE_1__[\"createVNode\"])(\"div\", _hoisted_3, [Object(vue__WEBPACK_IMPORTED_MODULE_1__[\"createVNode\"])(\"div\", _hoisted_4, Object(vue__WEBPACK_IMPORTED_MODULE_1__[\"toDisplayString\"])($props.wallet.name), 1\n  /* TEXT */\n  ), Object(vue__WEBPACK_IMPORTED_MODULE_1__[\"createVNode\"])(\"div\", _hoisted_5, [Object(vue__WEBPACK_IMPORTED_MODULE_1__[\"createTextVNode\"])(\"Account\" + Object(vue__WEBPACK_IMPORTED_MODULE_1__[\"toDisplayString\"])($props.wallet.accounts.length > 1 ? 's' : '') + \": \", 1\n  /* TEXT */\n  ), Object(vue__WEBPACK_IMPORTED_MODULE_1__[\"createVNode\"])(\"span\", _hoisted_6, Object(vue__WEBPACK_IMPORTED_MODULE_1__[\"toDisplayString\"])($props.wallet.accounts.length), 1\n  /* TEXT */\n  )])]), Object(vue__WEBPACK_IMPORTED_MODULE_1__[\"createVNode\"])(\"div\", _hoisted_7, [Object(vue__WEBPACK_IMPORTED_MODULE_1__[\"createVNode\"])(_component_router_link, {\n    to: \"/delete-wallet-confirmed/\".concat($props.wallet.name),\n    class: \"hover:font-bold\"\n  }, {\n    default: Object(vue__WEBPACK_IMPORTED_MODULE_1__[\"withCtx\"])(function () {\n      return [_hoisted_8];\n    }),\n    _: 1\n    /* STABLE */\n\n  }, 8\n  /* PROPS */\n  , [\"to\"])])])]);\n}\n\n//# sourceURL=webpack:///./src/components/WalletTile.vue?./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/babel-loader/lib!./node_modules/vue-loader-v16/dist/templateLoader.js??ref--6!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader-v16/dist??ref--0-1");

/***/ }),

/***/ "./node_modules/cache-loader/dist/cjs.js?!./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader-v16/dist/templateLoader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader-v16/dist/index.js?!./src/views/ViewWallets.vue?vue&type=template&id=007aab2a":
/*!****************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/babel-loader/lib!./node_modules/vue-loader-v16/dist/templateLoader.js??ref--6!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader-v16/dist??ref--0-1!./src/views/ViewWallets.vue?vue&type=template&id=007aab2a ***!
  \****************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! exports provided: render */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"render\", function() { return render; });\n/* harmony import */ var core_js_modules_es_function_name_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/es.function.name.js */ \"./node_modules/core-js/modules/es.function.name.js\");\n/* harmony import */ var core_js_modules_es_function_name_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_function_name_js__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! vue */ \"./node_modules/vue/dist/vue.runtime.esm-bundler.js\");\n\n\nvar _hoisted_1 = {\n  class: \"container mx-auto text-center\"\n};\n\nvar _hoisted_2 = /*#__PURE__*/Object(vue__WEBPACK_IMPORTED_MODULE_1__[\"createVNode\"])(\"h1\", {\n  class: \"font-bold big-title mt-20\"\n}, \"Wallets\", -1\n/* HOISTED */\n);\n\nvar _hoisted_3 = {\n  class: \"mt-2 py-3 gray-line\"\n};\n\nvar _hoisted_4 = /*#__PURE__*/Object(vue__WEBPACK_IMPORTED_MODULE_1__[\"createVNode\"])(\"p\", null, \"These are the Sirius Wallets available in the local storage of your device.\", -1\n/* HOISTED */\n);\n\nvar _hoisted_5 = {\n  key: 0,\n  class: \"text-center h4 my-2\"\n};\nvar _hoisted_6 = {\n  key: 1,\n  class: \"grid xs-grid-cols-1 sm:grid-cols-2 mt-10\"\n};\nvar _hoisted_7 = {\n  class: \"mt-32\"\n};\n\nvar _hoisted_8 = /*#__PURE__*/Object(vue__WEBPACK_IMPORTED_MODULE_1__[\"createTextVNode\"])(\"Home\");\n\nfunction render(_ctx, _cache, $props, $setup, $data, $options) {\n  var _component_WalletTile = Object(vue__WEBPACK_IMPORTED_MODULE_1__[\"resolveComponent\"])(\"WalletTile\");\n\n  var _component_router_link = Object(vue__WEBPACK_IMPORTED_MODULE_1__[\"resolveComponent\"])(\"router-link\");\n\n  var _component_NotificationModal = Object(vue__WEBPACK_IMPORTED_MODULE_1__[\"resolveComponent\"])(\"NotificationModal\");\n\n  return Object(vue__WEBPACK_IMPORTED_MODULE_1__[\"openBlock\"])(), Object(vue__WEBPACK_IMPORTED_MODULE_1__[\"createBlock\"])(\"div\", _hoisted_1, [_hoisted_2, Object(vue__WEBPACK_IMPORTED_MODULE_1__[\"createVNode\"])(\"div\", _hoisted_3, [_hoisted_4, $setup.appStore.state.wallets == 0 ? (Object(vue__WEBPACK_IMPORTED_MODULE_1__[\"openBlock\"])(), Object(vue__WEBPACK_IMPORTED_MODULE_1__[\"createBlock\"])(\"div\", _hoisted_5, \" No wallets found \")) : (Object(vue__WEBPACK_IMPORTED_MODULE_1__[\"openBlock\"])(), Object(vue__WEBPACK_IMPORTED_MODULE_1__[\"createBlock\"])(\"div\", _hoisted_6, [(Object(vue__WEBPACK_IMPORTED_MODULE_1__[\"openBlock\"])(true), Object(vue__WEBPACK_IMPORTED_MODULE_1__[\"createBlock\"])(vue__WEBPACK_IMPORTED_MODULE_1__[\"Fragment\"], null, Object(vue__WEBPACK_IMPORTED_MODULE_1__[\"renderList\"])($setup.appStore.state.wallets, function (item) {\n    return Object(vue__WEBPACK_IMPORTED_MODULE_1__[\"openBlock\"])(), Object(vue__WEBPACK_IMPORTED_MODULE_1__[\"createBlock\"])(_component_WalletTile, {\n      key: item.name,\n      wallet: item,\n      onDelete: function onDelete($event) {\n        return $setup.appStore.deleteWallet(item.name);\n      }\n    }, null, 8\n    /* PROPS */\n    , [\"wallet\", \"onDelete\"]);\n  }), 128\n  /* KEYED_FRAGMENT */\n  ))]))]), Object(vue__WEBPACK_IMPORTED_MODULE_1__[\"createVNode\"])(\"div\", _hoisted_7, [Object(vue__WEBPACK_IMPORTED_MODULE_1__[\"createVNode\"])(_component_router_link, {\n    to: \"/\",\n    class: \"blue-btn p-3 px-5\"\n  }, {\n    default: Object(vue__WEBPACK_IMPORTED_MODULE_1__[\"withCtx\"])(function () {\n      return [_hoisted_8];\n    }),\n    _: 1\n    /* STABLE */\n\n  })]), Object(vue__WEBPACK_IMPORTED_MODULE_1__[\"createVNode\"])(_component_NotificationModal, {\n    toggleModal: $data.toggleModal,\n    msg: \"Wallet has been removed successfully\",\n    notiType: \"noti\",\n    time: \"1500\"\n  }, null, 8\n  /* PROPS */\n  , [\"toggleModal\"])]);\n}\n\n//# sourceURL=webpack:///./src/views/ViewWallets.vue?./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/babel-loader/lib!./node_modules/vue-loader-v16/dist/templateLoader.js??ref--6!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader-v16/dist??ref--0-1");

/***/ }),

/***/ "./src/assets/img/icon-trash-can-gray-16h-proximax-sirius-wallet.svg":
/*!***************************************************************************!*\
  !*** ./src/assets/img/icon-trash-can-gray-16h-proximax-sirius-wallet.svg ***!
  \***************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("module.exports = __webpack_require__.p + \"assets/img/icon-trash-can-gray-16h-proximax-sirius-wallet.db2f6fdd.svg\";\n\n//# sourceURL=webpack:///./src/assets/img/icon-trash-can-gray-16h-proximax-sirius-wallet.svg?");

/***/ }),

/***/ "./src/components/NotificationModal.vue":
/*!**********************************************!*\
  !*** ./src/components/NotificationModal.vue ***!
  \**********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _NotificationModal_vue_vue_type_template_id_4ff948fc__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./NotificationModal.vue?vue&type=template&id=4ff948fc */ \"./src/components/NotificationModal.vue?vue&type=template&id=4ff948fc\");\n/* harmony import */ var _NotificationModal_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./NotificationModal.vue?vue&type=script&lang=js */ \"./src/components/NotificationModal.vue?vue&type=script&lang=js\");\n/* empty/unused harmony star reexport */\n\n\n_NotificationModal_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"].render = _NotificationModal_vue_vue_type_template_id_4ff948fc__WEBPACK_IMPORTED_MODULE_0__[\"render\"]\n/* hot reload */\nif (false) {}\n\n_NotificationModal_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"].__file = \"src/components/NotificationModal.vue\"\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (_NotificationModal_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"]);\n\n//# sourceURL=webpack:///./src/components/NotificationModal.vue?");

/***/ }),

/***/ "./src/components/NotificationModal.vue?vue&type=script&lang=js":
/*!**********************************************************************!*\
  !*** ./src/components/NotificationModal.vue?vue&type=script&lang=js ***!
  \**********************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _node_modules_cache_loader_dist_cjs_js_ref_12_0_node_modules_babel_loader_lib_index_js_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_v16_dist_index_js_ref_0_1_NotificationModal_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/cache-loader/dist/cjs.js??ref--12-0!../../node_modules/babel-loader/lib!../../node_modules/cache-loader/dist/cjs.js??ref--0-0!../../node_modules/vue-loader-v16/dist??ref--0-1!./NotificationModal.vue?vue&type=script&lang=js */ \"./node_modules/cache-loader/dist/cjs.js?!./node_modules/babel-loader/lib/index.js!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader-v16/dist/index.js?!./src/components/NotificationModal.vue?vue&type=script&lang=js\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return _node_modules_cache_loader_dist_cjs_js_ref_12_0_node_modules_babel_loader_lib_index_js_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_v16_dist_index_js_ref_0_1_NotificationModal_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"]; });\n\n/* empty/unused harmony star reexport */ \n\n//# sourceURL=webpack:///./src/components/NotificationModal.vue?");

/***/ }),

/***/ "./src/components/NotificationModal.vue?vue&type=template&id=4ff948fc":
/*!****************************************************************************!*\
  !*** ./src/components/NotificationModal.vue?vue&type=template&id=4ff948fc ***!
  \****************************************************************************/
/*! exports provided: render */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _node_modules_cache_loader_dist_cjs_js_ref_12_0_node_modules_babel_loader_lib_index_js_node_modules_vue_loader_v16_dist_templateLoader_js_ref_6_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_v16_dist_index_js_ref_0_1_NotificationModal_vue_vue_type_template_id_4ff948fc__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/cache-loader/dist/cjs.js??ref--12-0!../../node_modules/babel-loader/lib!../../node_modules/vue-loader-v16/dist/templateLoader.js??ref--6!../../node_modules/cache-loader/dist/cjs.js??ref--0-0!../../node_modules/vue-loader-v16/dist??ref--0-1!./NotificationModal.vue?vue&type=template&id=4ff948fc */ \"./node_modules/cache-loader/dist/cjs.js?!./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader-v16/dist/templateLoader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader-v16/dist/index.js?!./src/components/NotificationModal.vue?vue&type=template&id=4ff948fc\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"render\", function() { return _node_modules_cache_loader_dist_cjs_js_ref_12_0_node_modules_babel_loader_lib_index_js_node_modules_vue_loader_v16_dist_templateLoader_js_ref_6_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_v16_dist_index_js_ref_0_1_NotificationModal_vue_vue_type_template_id_4ff948fc__WEBPACK_IMPORTED_MODULE_0__[\"render\"]; });\n\n\n\n//# sourceURL=webpack:///./src/components/NotificationModal.vue?");

/***/ }),

/***/ "./src/components/WalletTile.vue":
/*!***************************************!*\
  !*** ./src/components/WalletTile.vue ***!
  \***************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _WalletTile_vue_vue_type_template_id_38a614f7__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./WalletTile.vue?vue&type=template&id=38a614f7 */ \"./src/components/WalletTile.vue?vue&type=template&id=38a614f7\");\n/* harmony import */ var _WalletTile_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./WalletTile.vue?vue&type=script&lang=js */ \"./src/components/WalletTile.vue?vue&type=script&lang=js\");\n/* empty/unused harmony star reexport */\n\n\n_WalletTile_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"].render = _WalletTile_vue_vue_type_template_id_38a614f7__WEBPACK_IMPORTED_MODULE_0__[\"render\"]\n/* hot reload */\nif (false) {}\n\n_WalletTile_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"].__file = \"src/components/WalletTile.vue\"\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (_WalletTile_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"]);\n\n//# sourceURL=webpack:///./src/components/WalletTile.vue?");

/***/ }),

/***/ "./src/components/WalletTile.vue?vue&type=script&lang=js":
/*!***************************************************************!*\
  !*** ./src/components/WalletTile.vue?vue&type=script&lang=js ***!
  \***************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _node_modules_cache_loader_dist_cjs_js_ref_12_0_node_modules_babel_loader_lib_index_js_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_v16_dist_index_js_ref_0_1_WalletTile_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/cache-loader/dist/cjs.js??ref--12-0!../../node_modules/babel-loader/lib!../../node_modules/cache-loader/dist/cjs.js??ref--0-0!../../node_modules/vue-loader-v16/dist??ref--0-1!./WalletTile.vue?vue&type=script&lang=js */ \"./node_modules/cache-loader/dist/cjs.js?!./node_modules/babel-loader/lib/index.js!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader-v16/dist/index.js?!./src/components/WalletTile.vue?vue&type=script&lang=js\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return _node_modules_cache_loader_dist_cjs_js_ref_12_0_node_modules_babel_loader_lib_index_js_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_v16_dist_index_js_ref_0_1_WalletTile_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"]; });\n\n/* empty/unused harmony star reexport */ \n\n//# sourceURL=webpack:///./src/components/WalletTile.vue?");

/***/ }),

/***/ "./src/components/WalletTile.vue?vue&type=template&id=38a614f7":
/*!*********************************************************************!*\
  !*** ./src/components/WalletTile.vue?vue&type=template&id=38a614f7 ***!
  \*********************************************************************/
/*! exports provided: render */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _node_modules_cache_loader_dist_cjs_js_ref_12_0_node_modules_babel_loader_lib_index_js_node_modules_vue_loader_v16_dist_templateLoader_js_ref_6_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_v16_dist_index_js_ref_0_1_WalletTile_vue_vue_type_template_id_38a614f7__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/cache-loader/dist/cjs.js??ref--12-0!../../node_modules/babel-loader/lib!../../node_modules/vue-loader-v16/dist/templateLoader.js??ref--6!../../node_modules/cache-loader/dist/cjs.js??ref--0-0!../../node_modules/vue-loader-v16/dist??ref--0-1!./WalletTile.vue?vue&type=template&id=38a614f7 */ \"./node_modules/cache-loader/dist/cjs.js?!./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader-v16/dist/templateLoader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader-v16/dist/index.js?!./src/components/WalletTile.vue?vue&type=template&id=38a614f7\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"render\", function() { return _node_modules_cache_loader_dist_cjs_js_ref_12_0_node_modules_babel_loader_lib_index_js_node_modules_vue_loader_v16_dist_templateLoader_js_ref_6_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_v16_dist_index_js_ref_0_1_WalletTile_vue_vue_type_template_id_38a614f7__WEBPACK_IMPORTED_MODULE_0__[\"render\"]; });\n\n\n\n//# sourceURL=webpack:///./src/components/WalletTile.vue?");

/***/ }),

/***/ "./src/views/ViewWallets.vue":
/*!***********************************!*\
  !*** ./src/views/ViewWallets.vue ***!
  \***********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _ViewWallets_vue_vue_type_template_id_007aab2a__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ViewWallets.vue?vue&type=template&id=007aab2a */ \"./src/views/ViewWallets.vue?vue&type=template&id=007aab2a\");\n/* harmony import */ var _ViewWallets_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ViewWallets.vue?vue&type=script&lang=js */ \"./src/views/ViewWallets.vue?vue&type=script&lang=js\");\n/* empty/unused harmony star reexport */\n\n\n_ViewWallets_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"].render = _ViewWallets_vue_vue_type_template_id_007aab2a__WEBPACK_IMPORTED_MODULE_0__[\"render\"]\n/* hot reload */\nif (false) {}\n\n_ViewWallets_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"].__file = \"src/views/ViewWallets.vue\"\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (_ViewWallets_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"]);\n\n//# sourceURL=webpack:///./src/views/ViewWallets.vue?");

/***/ }),

/***/ "./src/views/ViewWallets.vue?vue&type=script&lang=js":
/*!***********************************************************!*\
  !*** ./src/views/ViewWallets.vue?vue&type=script&lang=js ***!
  \***********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _node_modules_cache_loader_dist_cjs_js_ref_12_0_node_modules_babel_loader_lib_index_js_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_v16_dist_index_js_ref_0_1_ViewWallets_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/cache-loader/dist/cjs.js??ref--12-0!../../node_modules/babel-loader/lib!../../node_modules/cache-loader/dist/cjs.js??ref--0-0!../../node_modules/vue-loader-v16/dist??ref--0-1!./ViewWallets.vue?vue&type=script&lang=js */ \"./node_modules/cache-loader/dist/cjs.js?!./node_modules/babel-loader/lib/index.js!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader-v16/dist/index.js?!./src/views/ViewWallets.vue?vue&type=script&lang=js\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return _node_modules_cache_loader_dist_cjs_js_ref_12_0_node_modules_babel_loader_lib_index_js_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_v16_dist_index_js_ref_0_1_ViewWallets_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"]; });\n\n/* empty/unused harmony star reexport */ \n\n//# sourceURL=webpack:///./src/views/ViewWallets.vue?");

/***/ }),

/***/ "./src/views/ViewWallets.vue?vue&type=template&id=007aab2a":
/*!*****************************************************************!*\
  !*** ./src/views/ViewWallets.vue?vue&type=template&id=007aab2a ***!
  \*****************************************************************/
/*! exports provided: render */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _node_modules_cache_loader_dist_cjs_js_ref_12_0_node_modules_babel_loader_lib_index_js_node_modules_vue_loader_v16_dist_templateLoader_js_ref_6_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_v16_dist_index_js_ref_0_1_ViewWallets_vue_vue_type_template_id_007aab2a__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/cache-loader/dist/cjs.js??ref--12-0!../../node_modules/babel-loader/lib!../../node_modules/vue-loader-v16/dist/templateLoader.js??ref--6!../../node_modules/cache-loader/dist/cjs.js??ref--0-0!../../node_modules/vue-loader-v16/dist??ref--0-1!./ViewWallets.vue?vue&type=template&id=007aab2a */ \"./node_modules/cache-loader/dist/cjs.js?!./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader-v16/dist/templateLoader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader-v16/dist/index.js?!./src/views/ViewWallets.vue?vue&type=template&id=007aab2a\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"render\", function() { return _node_modules_cache_loader_dist_cjs_js_ref_12_0_node_modules_babel_loader_lib_index_js_node_modules_vue_loader_v16_dist_templateLoader_js_ref_6_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_v16_dist_index_js_ref_0_1_ViewWallets_vue_vue_type_template_id_007aab2a__WEBPACK_IMPORTED_MODULE_0__[\"render\"]; });\n\n\n\n//# sourceURL=webpack:///./src/views/ViewWallets.vue?");

/***/ })

}]);