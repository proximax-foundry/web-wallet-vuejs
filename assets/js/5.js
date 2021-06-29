(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[5],{

/***/ "./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist/templateLoader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist/index.js?!./src/modules/services/components/ServiceTile.vue?vue&type=template&id=536b3b2c&scoped=true":
/*!***************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist/templateLoader.js??ref--5!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist??ref--0-1!./src/modules/services/components/ServiceTile.vue?vue&type=template&id=536b3b2c&scoped=true ***!
  \***************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! exports provided: render */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"render\", function() { return render; });\n/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ \"./node_modules/vue/dist/vue.runtime.esm-bundler.js\");\n\nconst _withId = /*#__PURE__*/Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"withScopeId\"])(\"data-v-536b3b2c\")\n\nObject(vue__WEBPACK_IMPORTED_MODULE_0__[\"pushScopeId\"])(\"data-v-536b3b2c\")\nconst _hoisted_1 = { class: \"p-3 text-center\" }\nconst _hoisted_2 = {\n  class: \"py-1\",\n  role: \"none\"\n}\nconst _hoisted_3 = {\n  key: 1,\n  class: \"block px-2 py-1 text-xs text-gray-300\"\n}\nObject(vue__WEBPACK_IMPORTED_MODULE_0__[\"popScopeId\"])()\n\nconst render = /*#__PURE__*/_withId((_ctx, _cache, $props, $setup, $data, $options) => {\n  const _component_font_awesome_icon = Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"resolveComponent\"])(\"font-awesome-icon\")\n  const _component_router_link = Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"resolveComponent\"])(\"router-link\")\n\n  return (Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"openBlock\"])(), Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createBlock\"])(\"div\", _hoisted_1, [\n    Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createVNode\"])(\"img\", {\n      src: `${__webpack_require__(\"./src/modules/services/img sync recursive ^\\\\.\\\\/.*$\")(\"./\" + $props.service.img)}`,\n      style: {\"width\":\"80px\",\"height\":\"80px\"},\n      class: [\"inline-block mb-3\", ($props.service.enable)?'':'filtergrayscale']\n    }, null, 10 /* CLASS, PROPS */, [\"src\"]),\n    Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createVNode\"])(\"div\", {\n      class: [\"text-sm mb-2 font-bold\", ($props.service.enable)?'text-gray-800':'text-gray-300']\n    }, Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"toDisplayString\"])($props.service.name), 3 /* TEXT, CLASS */),\n    Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createVNode\"])(\"div\", {\n      class: [\"text-xs\", ($props.service.enable)?'text-gray-800':'text-gray-300']\n    }, Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"toDisplayString\"])($props.service.desc), 3 /* TEXT, CLASS */),\n    Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createVNode\"])(\"div\", {\n      class: \"relative inline-block text-left\",\n      onMouseover: _cache[2] || (_cache[2] = (...args) => ($setup.hoverOverMenu && $setup.hoverOverMenu(...args))),\n      onMouseout: _cache[3] || (_cache[3] = (...args) => ($setup.hoverOutMenu && $setup.hoverOutMenu(...args)))\n    }, [\n      Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createVNode\"])(\"div\", null, [\n        Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createVNode\"])(\"button\", {\n          type: \"button\",\n          onClick: _cache[1] || (_cache[1] = $event => {$setup.showHideMenu();}),\n          class: \"justify-center px-4 py-2 text-gray-700 focus:outline-none\",\n          id: \"options-menu\",\n          \"aria-expanded\": \"true\",\n          \"aria-haspopup\": \"true\"\n        }, [\n          Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createVNode\"])(_component_font_awesome_icon, {\n            icon: \"caret-down\",\n            class: \"w-5 h-5 text-gray-500 cursor-pointer inline-block\"\n          })\n        ])\n      ]),\n      Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createVNode\"])(\"div\", {\n        class: [$props.showMenuCall?'':'hidden', \"absolute w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50\"],\n        role: \"menu\",\n        \"aria-orientation\": \"vertical\",\n        \"aria-labelledby\": \"options-menu\"\n      }, [\n        Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createVNode\"])(\"div\", _hoisted_2, [\n          (Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"openBlock\"])(true), Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createBlock\"])(vue__WEBPACK_IMPORTED_MODULE_0__[\"Fragment\"], null, Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"renderList\"])($props.service.menu, (option, item) => {\n            return (Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"openBlock\"])(), Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createBlock\"])(\"div\", { key: item }, [\n              (option.link!='')\n                ? (Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"openBlock\"])(), Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createBlock\"])(_component_router_link, {\n                    key: 0,\n                    to: {name: option.link},\n                    class: \"block px-2 py-1 text-xs text-gray-700 hover:bg-blue-primary hover:text-white\",\n                    role: \"menuitem\"\n                  }, {\n                    default: _withId(() => [\n                      Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createTextVNode\"])(Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"toDisplayString\"])(option.name), 1 /* TEXT */)\n                    ]),\n                    _: 2 /* DYNAMIC */\n                  }, 1032 /* PROPS, DYNAMIC_SLOTS */, [\"to\"]))\n                : (Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"openBlock\"])(), Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createBlock\"])(\"div\", _hoisted_3, Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"toDisplayString\"])(option.name), 1 /* TEXT */))\n            ]))\n          }), 128 /* KEYED_FRAGMENT */))\n        ])\n      ], 2 /* CLASS */)\n    ], 32 /* HYDRATE_EVENTS */)\n  ]))\n})\n\n//# sourceURL=webpack:///./src/modules/services/components/ServiceTile.vue?./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist/templateLoader.js??ref--5!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist??ref--0-1");

/***/ }),

/***/ "./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist/templateLoader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist/index.js?!./src/modules/services/views/ViewServices.vue?vue&type=template&id=183dbf78":
/*!***********************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist/templateLoader.js??ref--5!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist??ref--0-1!./src/modules/services/views/ViewServices.vue?vue&type=template&id=183dbf78 ***!
  \***********************************************************************************************************************************************************************************************************************************************************************************************************/
/*! exports provided: render */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"render\", function() { return render; });\n/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ \"./node_modules/vue/dist/vue.runtime.esm-bundler.js\");\n\n\nconst _hoisted_1 = { class: \"mt-2 py-3\" }\nconst _hoisted_2 = { class: \"grid xs-grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6\" }\n\nfunction render(_ctx, _cache, $props, $setup, $data, $options) {\n  const _component_ServiceTile = Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"resolveComponent\"])(\"ServiceTile\")\n\n  return (Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"openBlock\"])(), Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createBlock\"])(\"div\", _hoisted_1, [\n    Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createVNode\"])(\"div\", _hoisted_2, [\n      (Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"openBlock\"])(true), Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createBlock\"])(vue__WEBPACK_IMPORTED_MODULE_0__[\"Fragment\"], null, Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"renderList\"])($setup.services, (item, index) => {\n        return (Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"openBlock\"])(), Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createBlock\"])(_component_ServiceTile, {\n          key: index,\n          service: item,\n          showMenuCall: $setup.showMenu[index],\n          i: index\n        }, null, 8 /* PROPS */, [\"service\", \"showMenuCall\", \"i\"]))\n      }), 128 /* KEYED_FRAGMENT */))\n    ])\n  ]))\n}\n\n//# sourceURL=webpack:///./src/modules/services/views/ViewServices.vue?./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist/templateLoader.js??ref--5!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist??ref--0-1");

/***/ }),

/***/ "./node_modules/cache-loader/dist/cjs.js?!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist/index.js?!./src/modules/services/components/ServiceTile.vue?vue&type=script&lang=js":
/*!**************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist??ref--0-1!./src/modules/services/components/ServiceTile.vue?vue&type=script&lang=js ***!
  \**************************************************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ \"./node_modules/vue/dist/vue.runtime.esm-bundler.js\");\n\n\n\n/* harmony default export */ __webpack_exports__[\"default\"] = ({\n  name: 'ServiceTile',\n  props: ['service', 'showMenuCall', 'i'],\n  setup(p){\n    const internalInstance = Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"getCurrentInstance\"])();\n    const emitter = internalInstance.appContext.config.globalProperties.emitter;\n\n    const showHideMenu = () => {\n      // show.value = !show.value;\n      emitter.emit(\"CLOSE_ALL_MENU_TRIGGER\");\n      if(p.showMenuCall){\n        emitter.emit(\"CLOSE_MENU_TRIGGER\", p.i);\n      }else{\n        emitter.emit(\"SHOW_MENU_TRIGGER\", p.i);\n      }\n    };\n\n    const hoverOverMenu = () => {\n      emitter.emit(\"HOVER_OVER_MENU_TRIGGER\", p.i);\n    };\n\n    const hoverOutMenu = () => {\n      emitter.emit(\"HOVER_OUT_MENU_TRIGGER\");\n    };\n\n    return {\n      showHideMenu,\n      hoverOverMenu,\n      hoverOutMenu,\n    }\n  },\n});\n\n\n//# sourceURL=webpack:///./src/modules/services/components/ServiceTile.vue?./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist??ref--0-1");

/***/ }),

/***/ "./node_modules/cache-loader/dist/cjs.js?!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist/index.js?!./src/modules/services/views/ViewServices.vue?vue&type=script&lang=js":
/*!**********************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist??ref--0-1!./src/modules/services/views/ViewServices.vue?vue&type=script&lang=js ***!
  \**********************************************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ \"./node_modules/vue/dist/vue.runtime.esm-bundler.js\");\n/* harmony import */ var _modules_services_components_ServiceTile_vue__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/modules/services/components/ServiceTile.vue */ \"./src/modules/services/components/ServiceTile.vue\");\n\n\n\n\n/* harmony default export */ __webpack_exports__[\"default\"] = ({\n  name: 'ViewServices',\n  components: {\n    ServiceTile: _modules_services_components_ServiceTile_vue__WEBPACK_IMPORTED_MODULE_1__[\"default\"],\n  },\n\n  setup() {\n    const internalInstance = Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"getCurrentInstance\"])();\n    const emitter = internalInstance.appContext.config.globalProperties.emitter;\n    const currentMenu = Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"ref\"])('');\n    const showMenu = Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"ref\"])([]);\n    const services = Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"ref\"])([\n      {name: 'Namespaces', desc: 'Create namespaces and sub-namespaces', img: 'icon-namespace-full-color-80h-proximax-sirius-wallet.svg', enable: true, menu:[\n        {name: 'Register', link: 'ViewServicesNamespaceCreate'},\n        {name: 'Extend Duration', link: 'ViewServicesNamespaceExtend'}\n      ]},\n      {name: 'Assets', desc: 'Create digital representations with customized properties', img: 'icon-mosaics-full-color-80h-proximax-sirius-wallet.svg', enable: true, menu:[\n        {name: 'Create', link: 'ViewServicesAssetsCreate'},\n        {name: 'Modify Supply', link: 'ViewServicesAssetsModifySupplyChange'},\n        {name: 'Link to Namespace', link: 'ViewServicesAssetsLinkToNamespace'}\n      ]},\n      {name: 'Mainnet Swap', desc: 'Swap from NEM to Sirius', img: 'icon-swap-process-color-80h-proximax-sirius-wallet.svg', enable: true, menu:[\n        { name: 'NIS1 to Sirius', link: 'ViewServicesMainnetSwapNIS1ToSirius'},\n        { name: 'Sirius to ETH', link: 'ViewServicesMainnetSwapSiriusToETH'},\n        { name: 'Sirius to BSC', link: 'ViewServicesMainnetSwapSiriusToBSC'},\n      ]},\n      {name: 'Address Book', desc: 'Assign labels to addresses', img: 'icon-address-book-full-color-80h-proximax-sirius-wallet.svg', enable: true, menu:[\n        {name: 'List', link: 'ViewServicesAddressBook'},\n        {name: 'Add Contacts', link: 'ViewServicesAddressBookAddContacts'},\n      ]},\n      {name: 'Wallets', desc: 'Manage your wallets', img: 'icon-address-book-full-color-80h-proximax-sirius-wallet.svg', enable: true, menu:[\n        {name: 'Change Password', link: ''},\n        {name: 'Export', link: 'ViewWalletExport'},\n        {name: 'Delete', link: 'ViewWallets'},\n      ]},\n      {name: 'Transactions', desc: 'Explorer all transactions', img: 'icon-transaction-explorer-full-color-80h-proximax-sirius-wallet.svg', enable: true, menu:[\n        {name: 'Explorer', link: 'ViewServicesExplorer'},\n        {name: 'Partial', link: 'ViewServicesExplorerPartial'},\n      ]},\n      {name: 'Nodes', desc: 'Add and edit nodes', img: 'icon-nodes-full-color-80h-proximax-sirius-wallet.svg', enable: true, menu:[\n        {name: 'Blockchain', link: 'ViewServicesNodes'},\n        {name: 'Storage', link: ''},\n        {name: 'Streaming', link: ''},\n      ]},\n      {name: 'Attestation', desc: 'Proof of existence and origination', img: 'icon-attestation-full-color-80h-proximax-sirius-wallet.svg', enable: true, menu:[\n        {name: 'Attest', link: 'ViewServicesAttestationCreate'},\n        {name: 'Audit', link: 'ViewServicesAttestationAudit'},\n      ]},\n      {name: 'Notifications', desc: 'Check alerts and information about your accounts', img: 'icon-notifications-full-color-80h-proximax-sirius-wallet.svg', enable: true, menu:[\n        {name: 'Notifications', link: 'ViewServicesNotifications'},\n      ]},\n      {name: 'Voting', desc: 'Create, vote, and view results', img: 'icon-voting-full-color-80h-proximax-sirius-wallet.svg', enable: true, menu:[\n        {name: 'Create Poll', link: 'ViewServicesVotingCreatePoll'},\n        {name: 'Vote', link: 'ViewServicesVotingPoll'},\n        {name: 'View Results', link: ''},\n      ]},\n      {name: 'Storage', desc: 'Upload and download your files and encrypt them', img: 'icon-storage-full-color-80h-proximax-sirius-wallet.svg', enable: true, menu:[\n        {name: 'Files', link: 'ViewServicesStorageMyFile'},\n        {name: 'Upload File', link: 'ViewServicesStorageUploadFile'},\n        {name: 'Send / Share', link: ''},\n      ]},\n      {name: 'Sirius Gift', desc: 'Create a redeemable gift', img: 'icon-gift-sirius-full-color-80h-proximax-sirius-wallet.svg', enable: true, menu:[\n        {name: 'Create', link: 'ViewServicesSiriusGiftCreateGift'},\n        {name: 'Redeem', link: 'ViewServicesSiriusGiftRedeem'},\n      ]},\n      {name: 'Aggregate Transactions', desc: 'Merge multiple transactions into one', img: 'icon-aggregate-transactions-full-color-80h-proximax-sirius-wallet.svg', enable: false, menu:[\n        {name: 'Complete', link: ''},\n        {name: 'Bonded', link: ''},\n      ]},\n      {name: 'Cross-Chain Swaps', desc: 'Atomic Cross-Chain Swap between public and private networks', img: 'icon-cross-chain-swap-full-color-80h-proximax-sirius-wallet.svg', enable: false, menu:[\n        {name: 'Secred Lock', link: ''},\n        {name: 'Secred Proof', link: ''},\n      ]},\n      {name: 'Invoice', desc: 'Create and manage invoices', img: 'icon-invoice-full-color-80h-proximax-sirius-wallet.svg', enable: false, menu:[\n        {name: 'Create', link: ''},\n      ]},\n      {name: 'Supercontracts', desc: 'Create and execute logical flows for digital contract obligations', img: 'icon-supercontracts-full-color-80h-proximax-sirius-wallet.svg', enable: false, menu:[\n        {name: 'Create', link: ''},\n        {name: 'Status', link: ''},\n      ]},\n      {name: 'Chat', desc: 'Encrypted live chat', img: 'icon-chat-full-color-80h-proximax-sirius-wallet.svg', enable: false, menu:[\n        {name: 'Start', link: ''},\n      ]},\n      {name: 'Video Conferencing', desc: 'Encrypted live video streaming', img: 'icon-streaming-full-color-80h-proximax-sirius-wallet.svg', enable: false, menu:[\n        {name: 'Start', link: ''},\n        {name: 'Schedule', link: ''},\n      ]},\n    ]);\n\n    // get num of accounts\n    var num_service = services.value.length;\n    var i = 0;\n    while(i < num_service){\n      showMenu.value[i] = false;\n      i++;\n    }\n\n    emitter.on(\"SHOW_MENU_TRIGGER\", payload => {\n      showMenu.value[payload] = true;\n      currentMenu.value = payload;\n    });\n    emitter.on(\"CLOSE_MENU_TRIGGER\", payload => {\n      showMenu.value[payload] = false;\n      currentMenu.value = payload;\n    });\n\n    emitter.on(\"CLOSE_ALL_MENU_TRIGGER\", () => {\n      var j = 0;\n      while(j < num_service){\n        showMenu.value[j] = false;\n        j++;\n      }\n    });\n\n    emitter.on('PAGE_CLICK', () => {\n      if(currentMenu.value === ''){\n        var k = 0;\n        while(k < num_service){\n          showMenu.value[k] = false;\n          k++;\n        }\n      }\n    });\n\n    emitter.on('HOVER_OVER_MENU_TRIGGER', index => {\n      currentMenu.value = index;\n    });\n\n    emitter.on('HOVER_OUT_MENU_TRIGGER', () => {\n      currentMenu.value = '';\n    });\n\n    return {\n      showMenu,\n      services,\n    };\n  },\n});\n\n\n//# sourceURL=webpack:///./src/modules/services/views/ViewServices.vue?./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist??ref--0-1");

/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js?!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/dist/cjs.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist/index.js?!./src/modules/services/components/ServiceTile.vue?vue&type=style&index=0&id=536b3b2c&lang=scss&scoped=true":
/*!********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js??ref--8-oneOf-1-1!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist/stylePostLoader.js!./node_modules/postcss-loader/src??ref--8-oneOf-1-2!./node_modules/sass-loader/dist/cjs.js??ref--8-oneOf-1-3!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist??ref--0-1!./src/modules/services/components/ServiceTile.vue?vue&type=style&index=0&id=536b3b2c&lang=scss&scoped=true ***!
  \********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("// Imports\nvar ___CSS_LOADER_API_IMPORT___ = __webpack_require__(/*! ../../../../node_modules/css-loader/dist/runtime/api.js */ \"./node_modules/css-loader/dist/runtime/api.js\");\nexports = ___CSS_LOADER_API_IMPORT___(false);\n// Module\nexports.push([module.i, \".filtergrayscale[data-v-536b3b2c] {\\n  filter: grayscale(100%) opacity(50%);\\n  color: gray;\\n}\\n\", \"\"]);\n// Exports\nmodule.exports = exports;\n\n\n//# sourceURL=webpack:///./src/modules/services/components/ServiceTile.vue?./node_modules/css-loader/dist/cjs.js??ref--8-oneOf-1-1!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist/stylePostLoader.js!./node_modules/postcss-loader/src??ref--8-oneOf-1-2!./node_modules/sass-loader/dist/cjs.js??ref--8-oneOf-1-3!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist??ref--0-1");

/***/ }),

/***/ "./node_modules/vue-style-loader/index.js?!./node_modules/css-loader/dist/cjs.js?!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/dist/cjs.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist/index.js?!./src/modules/services/components/ServiceTile.vue?vue&type=style&index=0&id=536b3b2c&lang=scss&scoped=true":
/*!**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-style-loader??ref--8-oneOf-1-0!./node_modules/css-loader/dist/cjs.js??ref--8-oneOf-1-1!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist/stylePostLoader.js!./node_modules/postcss-loader/src??ref--8-oneOf-1-2!./node_modules/sass-loader/dist/cjs.js??ref--8-oneOf-1-3!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist??ref--0-1!./src/modules/services/components/ServiceTile.vue?vue&type=style&index=0&id=536b3b2c&lang=scss&scoped=true ***!
  \**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("// style-loader: Adds some css to the DOM by adding a <style> tag\n\n// load the styles\nvar content = __webpack_require__(/*! !../../../../node_modules/css-loader/dist/cjs.js??ref--8-oneOf-1-1!../../../../node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist/stylePostLoader.js!../../../../node_modules/postcss-loader/src??ref--8-oneOf-1-2!../../../../node_modules/sass-loader/dist/cjs.js??ref--8-oneOf-1-3!../../../../node_modules/cache-loader/dist/cjs.js??ref--0-0!../../../../node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist??ref--0-1!./ServiceTile.vue?vue&type=style&index=0&id=536b3b2c&lang=scss&scoped=true */ \"./node_modules/css-loader/dist/cjs.js?!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/dist/cjs.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist/index.js?!./src/modules/services/components/ServiceTile.vue?vue&type=style&index=0&id=536b3b2c&lang=scss&scoped=true\");\nif(content.__esModule) content = content.default;\nif(typeof content === 'string') content = [[module.i, content, '']];\nif(content.locals) module.exports = content.locals;\n// add the styles to the DOM\nvar add = __webpack_require__(/*! ../../../../node_modules/vue-style-loader/lib/addStylesClient.js */ \"./node_modules/vue-style-loader/lib/addStylesClient.js\").default\nvar update = add(\"174e6ba1\", content, false, {\"sourceMap\":false,\"shadowMode\":false});\n// Hot Module Replacement\nif(false) {}\n\n//# sourceURL=webpack:///./src/modules/services/components/ServiceTile.vue?./node_modules/vue-style-loader??ref--8-oneOf-1-0!./node_modules/css-loader/dist/cjs.js??ref--8-oneOf-1-1!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist/stylePostLoader.js!./node_modules/postcss-loader/src??ref--8-oneOf-1-2!./node_modules/sass-loader/dist/cjs.js??ref--8-oneOf-1-3!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist??ref--0-1");

/***/ }),

/***/ "./src/modules/services/components/ServiceTile.vue":
/*!*********************************************************!*\
  !*** ./src/modules/services/components/ServiceTile.vue ***!
  \*********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _ServiceTile_vue_vue_type_template_id_536b3b2c_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ServiceTile.vue?vue&type=template&id=536b3b2c&scoped=true */ \"./src/modules/services/components/ServiceTile.vue?vue&type=template&id=536b3b2c&scoped=true\");\n/* harmony import */ var _ServiceTile_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ServiceTile.vue?vue&type=script&lang=js */ \"./src/modules/services/components/ServiceTile.vue?vue&type=script&lang=js\");\n/* empty/unused harmony star reexport *//* harmony import */ var _ServiceTile_vue_vue_type_style_index_0_id_536b3b2c_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ServiceTile.vue?vue&type=style&index=0&id=536b3b2c&lang=scss&scoped=true */ \"./src/modules/services/components/ServiceTile.vue?vue&type=style&index=0&id=536b3b2c&lang=scss&scoped=true\");\n\n\n\n\n\n_ServiceTile_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"].render = _ServiceTile_vue_vue_type_template_id_536b3b2c_scoped_true__WEBPACK_IMPORTED_MODULE_0__[\"render\"]\n_ServiceTile_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"].__scopeId = \"data-v-536b3b2c\"\n/* hot reload */\nif (false) {}\n\n_ServiceTile_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"].__file = \"src/modules/services/components/ServiceTile.vue\"\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (_ServiceTile_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"]);\n\n//# sourceURL=webpack:///./src/modules/services/components/ServiceTile.vue?");

/***/ }),

/***/ "./src/modules/services/components/ServiceTile.vue?vue&type=script&lang=js":
/*!*********************************************************************************!*\
  !*** ./src/modules/services/components/ServiceTile.vue?vue&type=script&lang=js ***!
  \*********************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_cli_service_node_modules_vue_loader_v16_dist_index_js_ref_0_1_ServiceTile_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/cache-loader/dist/cjs.js??ref--0-0!../../../../node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist??ref--0-1!./ServiceTile.vue?vue&type=script&lang=js */ \"./node_modules/cache-loader/dist/cjs.js?!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist/index.js?!./src/modules/services/components/ServiceTile.vue?vue&type=script&lang=js\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return _node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_cli_service_node_modules_vue_loader_v16_dist_index_js_ref_0_1_ServiceTile_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"]; });\n\n/* empty/unused harmony star reexport */ \n\n//# sourceURL=webpack:///./src/modules/services/components/ServiceTile.vue?");

/***/ }),

/***/ "./src/modules/services/components/ServiceTile.vue?vue&type=style&index=0&id=536b3b2c&lang=scss&scoped=true":
/*!******************************************************************************************************************!*\
  !*** ./src/modules/services/components/ServiceTile.vue?vue&type=style&index=0&id=536b3b2c&lang=scss&scoped=true ***!
  \******************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_node_modules_vue_cli_service_node_modules_vue_loader_v16_dist_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_cli_service_node_modules_vue_loader_v16_dist_index_js_ref_0_1_ServiceTile_vue_vue_type_style_index_0_id_536b3b2c_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/vue-style-loader??ref--8-oneOf-1-0!../../../../node_modules/css-loader/dist/cjs.js??ref--8-oneOf-1-1!../../../../node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist/stylePostLoader.js!../../../../node_modules/postcss-loader/src??ref--8-oneOf-1-2!../../../../node_modules/sass-loader/dist/cjs.js??ref--8-oneOf-1-3!../../../../node_modules/cache-loader/dist/cjs.js??ref--0-0!../../../../node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist??ref--0-1!./ServiceTile.vue?vue&type=style&index=0&id=536b3b2c&lang=scss&scoped=true */ \"./node_modules/vue-style-loader/index.js?!./node_modules/css-loader/dist/cjs.js?!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/dist/cjs.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist/index.js?!./src/modules/services/components/ServiceTile.vue?vue&type=style&index=0&id=536b3b2c&lang=scss&scoped=true\");\n/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_node_modules_vue_cli_service_node_modules_vue_loader_v16_dist_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_cli_service_node_modules_vue_loader_v16_dist_index_js_ref_0_1_ServiceTile_vue_vue_type_style_index_0_id_536b3b2c_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_node_modules_vue_cli_service_node_modules_vue_loader_v16_dist_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_cli_service_node_modules_vue_loader_v16_dist_index_js_ref_0_1_ServiceTile_vue_vue_type_style_index_0_id_536b3b2c_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_node_modules_vue_cli_service_node_modules_vue_loader_v16_dist_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_cli_service_node_modules_vue_loader_v16_dist_index_js_ref_0_1_ServiceTile_vue_vue_type_style_index_0_id_536b3b2c_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0__) if([\"default\"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_node_modules_vue_cli_service_node_modules_vue_loader_v16_dist_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_cli_service_node_modules_vue_loader_v16_dist_index_js_ref_0_1_ServiceTile_vue_vue_type_style_index_0_id_536b3b2c_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));\n\n\n//# sourceURL=webpack:///./src/modules/services/components/ServiceTile.vue?");

/***/ }),

/***/ "./src/modules/services/components/ServiceTile.vue?vue&type=template&id=536b3b2c&scoped=true":
/*!***************************************************************************************************!*\
  !*** ./src/modules/services/components/ServiceTile.vue?vue&type=template&id=536b3b2c&scoped=true ***!
  \***************************************************************************************************/
/*! exports provided: render */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _node_modules_vue_cli_service_node_modules_vue_loader_v16_dist_templateLoader_js_ref_5_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_cli_service_node_modules_vue_loader_v16_dist_index_js_ref_0_1_ServiceTile_vue_vue_type_template_id_536b3b2c_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist/templateLoader.js??ref--5!../../../../node_modules/cache-loader/dist/cjs.js??ref--0-0!../../../../node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist??ref--0-1!./ServiceTile.vue?vue&type=template&id=536b3b2c&scoped=true */ \"./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist/templateLoader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist/index.js?!./src/modules/services/components/ServiceTile.vue?vue&type=template&id=536b3b2c&scoped=true\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"render\", function() { return _node_modules_vue_cli_service_node_modules_vue_loader_v16_dist_templateLoader_js_ref_5_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_cli_service_node_modules_vue_loader_v16_dist_index_js_ref_0_1_ServiceTile_vue_vue_type_template_id_536b3b2c_scoped_true__WEBPACK_IMPORTED_MODULE_0__[\"render\"]; });\n\n\n\n//# sourceURL=webpack:///./src/modules/services/components/ServiceTile.vue?");

/***/ }),

/***/ "./src/modules/services/img sync recursive ^\\.\\/.*$":
/*!************************************************!*\
  !*** ./src/modules/services/img sync ^\.\/.*$ ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("var map = {\n\t\"./icon-account-green-16h-proximax-sirius-wallet.svg\": \"./src/modules/services/img/icon-account-green-16h-proximax-sirius-wallet.svg\",\n\t\"./icon-accounts-full-color-80h-proximax-sirius-wallet.svg\": \"./src/modules/services/img/icon-accounts-full-color-80h-proximax-sirius-wallet.svg\",\n\t\"./icon-address-book-full-color-80h-proximax-sirius-wallet.svg\": \"./src/modules/services/img/icon-address-book-full-color-80h-proximax-sirius-wallet.svg\",\n\t\"./icon-aggregate-transactions-full-color-80h-proximax-sirius-wallet.svg\": \"./src/modules/services/img/icon-aggregate-transactions-full-color-80h-proximax-sirius-wallet.svg\",\n\t\"./icon-attestation-full-color-80h-proximax-sirius-wallet.svg\": \"./src/modules/services/img/icon-attestation-full-color-80h-proximax-sirius-wallet.svg\",\n\t\"./icon-chat-full-color-80h-proximax-sirius-wallet.svg\": \"./src/modules/services/img/icon-chat-full-color-80h-proximax-sirius-wallet.svg\",\n\t\"./icon-cross-chain-swap-full-color-80h-proximax-sirius-wallet.svg\": \"./src/modules/services/img/icon-cross-chain-swap-full-color-80h-proximax-sirius-wallet.svg\",\n\t\"./icon-gift-sirius-full-color-80h-proximax-sirius-wallet.svg\": \"./src/modules/services/img/icon-gift-sirius-full-color-80h-proximax-sirius-wallet.svg\",\n\t\"./icon-invoice-full-color-80h-proximax-sirius-wallet.svg\": \"./src/modules/services/img/icon-invoice-full-color-80h-proximax-sirius-wallet.svg\",\n\t\"./icon-mosaics-full-color-80h-proximax-sirius-wallet.svg\": \"./src/modules/services/img/icon-mosaics-full-color-80h-proximax-sirius-wallet.svg\",\n\t\"./icon-namespace-full-color-80h-proximax-sirius-wallet.svg\": \"./src/modules/services/img/icon-namespace-full-color-80h-proximax-sirius-wallet.svg\",\n\t\"./icon-nodes-full-color-80h-proximax-sirius-wallet.svg\": \"./src/modules/services/img/icon-nodes-full-color-80h-proximax-sirius-wallet.svg\",\n\t\"./icon-notifications-full-color-80h-proximax-sirius-wallet.svg\": \"./src/modules/services/img/icon-notifications-full-color-80h-proximax-sirius-wallet.svg\",\n\t\"./icon-storage-full-color-80h-proximax-sirius-wallet.svg\": \"./src/modules/services/img/icon-storage-full-color-80h-proximax-sirius-wallet.svg\",\n\t\"./icon-streaming-full-color-80h-proximax-sirius-wallet.svg\": \"./src/modules/services/img/icon-streaming-full-color-80h-proximax-sirius-wallet.svg\",\n\t\"./icon-supercontracts-full-color-80h-proximax-sirius-wallet.svg\": \"./src/modules/services/img/icon-supercontracts-full-color-80h-proximax-sirius-wallet.svg\",\n\t\"./icon-swap-process-color-80h-proximax-sirius-wallet.svg\": \"./src/modules/services/img/icon-swap-process-color-80h-proximax-sirius-wallet.svg\",\n\t\"./icon-transaction-explorer-full-color-80h-proximax-sirius-wallet.svg\": \"./src/modules/services/img/icon-transaction-explorer-full-color-80h-proximax-sirius-wallet.svg\",\n\t\"./icon-voting-full-color-80h-proximax-sirius-wallet.svg\": \"./src/modules/services/img/icon-voting-full-color-80h-proximax-sirius-wallet.svg\",\n\t\"./icon-wallet-full-color-80h.svg\": \"./src/modules/services/img/icon-wallet-full-color-80h.svg\"\n};\n\n\nfunction webpackContext(req) {\n\tvar id = webpackContextResolve(req);\n\treturn __webpack_require__(id);\n}\nfunction webpackContextResolve(req) {\n\tif(!__webpack_require__.o(map, req)) {\n\t\tvar e = new Error(\"Cannot find module '\" + req + \"'\");\n\t\te.code = 'MODULE_NOT_FOUND';\n\t\tthrow e;\n\t}\n\treturn map[req];\n}\nwebpackContext.keys = function webpackContextKeys() {\n\treturn Object.keys(map);\n};\nwebpackContext.resolve = webpackContextResolve;\nmodule.exports = webpackContext;\nwebpackContext.id = \"./src/modules/services/img sync recursive ^\\\\.\\\\/.*$\";\n\n//# sourceURL=webpack:///./src/modules/services/img_sync_^\\.\\/.*$?");

/***/ }),

/***/ "./src/modules/services/img/icon-accounts-full-color-80h-proximax-sirius-wallet.svg":
/*!******************************************************************************************!*\
  !*** ./src/modules/services/img/icon-accounts-full-color-80h-proximax-sirius-wallet.svg ***!
  \******************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("module.exports = __webpack_require__.p + \"assets/img/icon-accounts-full-color-80h-proximax-sirius-wallet.b7e75d23.svg\";\n\n//# sourceURL=webpack:///./src/modules/services/img/icon-accounts-full-color-80h-proximax-sirius-wallet.svg?");

/***/ }),

/***/ "./src/modules/services/img/icon-address-book-full-color-80h-proximax-sirius-wallet.svg":
/*!**********************************************************************************************!*\
  !*** ./src/modules/services/img/icon-address-book-full-color-80h-proximax-sirius-wallet.svg ***!
  \**********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("module.exports = __webpack_require__.p + \"assets/img/icon-address-book-full-color-80h-proximax-sirius-wallet.64eb80fb.svg\";\n\n//# sourceURL=webpack:///./src/modules/services/img/icon-address-book-full-color-80h-proximax-sirius-wallet.svg?");

/***/ }),

/***/ "./src/modules/services/img/icon-aggregate-transactions-full-color-80h-proximax-sirius-wallet.svg":
/*!********************************************************************************************************!*\
  !*** ./src/modules/services/img/icon-aggregate-transactions-full-color-80h-proximax-sirius-wallet.svg ***!
  \********************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("module.exports = __webpack_require__.p + \"assets/img/icon-aggregate-transactions-full-color-80h-proximax-sirius-wallet.aa120552.svg\";\n\n//# sourceURL=webpack:///./src/modules/services/img/icon-aggregate-transactions-full-color-80h-proximax-sirius-wallet.svg?");

/***/ }),

/***/ "./src/modules/services/img/icon-attestation-full-color-80h-proximax-sirius-wallet.svg":
/*!*********************************************************************************************!*\
  !*** ./src/modules/services/img/icon-attestation-full-color-80h-proximax-sirius-wallet.svg ***!
  \*********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("module.exports = __webpack_require__.p + \"assets/img/icon-attestation-full-color-80h-proximax-sirius-wallet.73e1faaa.svg\";\n\n//# sourceURL=webpack:///./src/modules/services/img/icon-attestation-full-color-80h-proximax-sirius-wallet.svg?");

/***/ }),

/***/ "./src/modules/services/img/icon-chat-full-color-80h-proximax-sirius-wallet.svg":
/*!**************************************************************************************!*\
  !*** ./src/modules/services/img/icon-chat-full-color-80h-proximax-sirius-wallet.svg ***!
  \**************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("module.exports = __webpack_require__.p + \"assets/img/icon-chat-full-color-80h-proximax-sirius-wallet.4e202d2e.svg\";\n\n//# sourceURL=webpack:///./src/modules/services/img/icon-chat-full-color-80h-proximax-sirius-wallet.svg?");

/***/ }),

/***/ "./src/modules/services/img/icon-cross-chain-swap-full-color-80h-proximax-sirius-wallet.svg":
/*!**************************************************************************************************!*\
  !*** ./src/modules/services/img/icon-cross-chain-swap-full-color-80h-proximax-sirius-wallet.svg ***!
  \**************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("module.exports = __webpack_require__.p + \"assets/img/icon-cross-chain-swap-full-color-80h-proximax-sirius-wallet.a965b0bb.svg\";\n\n//# sourceURL=webpack:///./src/modules/services/img/icon-cross-chain-swap-full-color-80h-proximax-sirius-wallet.svg?");

/***/ }),

/***/ "./src/modules/services/img/icon-gift-sirius-full-color-80h-proximax-sirius-wallet.svg":
/*!*********************************************************************************************!*\
  !*** ./src/modules/services/img/icon-gift-sirius-full-color-80h-proximax-sirius-wallet.svg ***!
  \*********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("module.exports = __webpack_require__.p + \"assets/img/icon-gift-sirius-full-color-80h-proximax-sirius-wallet.622b38a9.svg\";\n\n//# sourceURL=webpack:///./src/modules/services/img/icon-gift-sirius-full-color-80h-proximax-sirius-wallet.svg?");

/***/ }),

/***/ "./src/modules/services/img/icon-invoice-full-color-80h-proximax-sirius-wallet.svg":
/*!*****************************************************************************************!*\
  !*** ./src/modules/services/img/icon-invoice-full-color-80h-proximax-sirius-wallet.svg ***!
  \*****************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("module.exports = __webpack_require__.p + \"assets/img/icon-invoice-full-color-80h-proximax-sirius-wallet.7c33a2c8.svg\";\n\n//# sourceURL=webpack:///./src/modules/services/img/icon-invoice-full-color-80h-proximax-sirius-wallet.svg?");

/***/ }),

/***/ "./src/modules/services/img/icon-mosaics-full-color-80h-proximax-sirius-wallet.svg":
/*!*****************************************************************************************!*\
  !*** ./src/modules/services/img/icon-mosaics-full-color-80h-proximax-sirius-wallet.svg ***!
  \*****************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("module.exports = __webpack_require__.p + \"assets/img/icon-mosaics-full-color-80h-proximax-sirius-wallet.77a3f8f5.svg\";\n\n//# sourceURL=webpack:///./src/modules/services/img/icon-mosaics-full-color-80h-proximax-sirius-wallet.svg?");

/***/ }),

/***/ "./src/modules/services/img/icon-namespace-full-color-80h-proximax-sirius-wallet.svg":
/*!*******************************************************************************************!*\
  !*** ./src/modules/services/img/icon-namespace-full-color-80h-proximax-sirius-wallet.svg ***!
  \*******************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("module.exports = __webpack_require__.p + \"assets/img/icon-namespace-full-color-80h-proximax-sirius-wallet.41d9c83d.svg\";\n\n//# sourceURL=webpack:///./src/modules/services/img/icon-namespace-full-color-80h-proximax-sirius-wallet.svg?");

/***/ }),

/***/ "./src/modules/services/img/icon-nodes-full-color-80h-proximax-sirius-wallet.svg":
/*!***************************************************************************************!*\
  !*** ./src/modules/services/img/icon-nodes-full-color-80h-proximax-sirius-wallet.svg ***!
  \***************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("module.exports = __webpack_require__.p + \"assets/img/icon-nodes-full-color-80h-proximax-sirius-wallet.749ea2c7.svg\";\n\n//# sourceURL=webpack:///./src/modules/services/img/icon-nodes-full-color-80h-proximax-sirius-wallet.svg?");

/***/ }),

/***/ "./src/modules/services/img/icon-notifications-full-color-80h-proximax-sirius-wallet.svg":
/*!***********************************************************************************************!*\
  !*** ./src/modules/services/img/icon-notifications-full-color-80h-proximax-sirius-wallet.svg ***!
  \***********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("module.exports = __webpack_require__.p + \"assets/img/icon-notifications-full-color-80h-proximax-sirius-wallet.8c505e29.svg\";\n\n//# sourceURL=webpack:///./src/modules/services/img/icon-notifications-full-color-80h-proximax-sirius-wallet.svg?");

/***/ }),

/***/ "./src/modules/services/img/icon-storage-full-color-80h-proximax-sirius-wallet.svg":
/*!*****************************************************************************************!*\
  !*** ./src/modules/services/img/icon-storage-full-color-80h-proximax-sirius-wallet.svg ***!
  \*****************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("module.exports = __webpack_require__.p + \"assets/img/icon-storage-full-color-80h-proximax-sirius-wallet.df124eee.svg\";\n\n//# sourceURL=webpack:///./src/modules/services/img/icon-storage-full-color-80h-proximax-sirius-wallet.svg?");

/***/ }),

/***/ "./src/modules/services/img/icon-streaming-full-color-80h-proximax-sirius-wallet.svg":
/*!*******************************************************************************************!*\
  !*** ./src/modules/services/img/icon-streaming-full-color-80h-proximax-sirius-wallet.svg ***!
  \*******************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("module.exports = __webpack_require__.p + \"assets/img/icon-streaming-full-color-80h-proximax-sirius-wallet.6f349713.svg\";\n\n//# sourceURL=webpack:///./src/modules/services/img/icon-streaming-full-color-80h-proximax-sirius-wallet.svg?");

/***/ }),

/***/ "./src/modules/services/img/icon-supercontracts-full-color-80h-proximax-sirius-wallet.svg":
/*!************************************************************************************************!*\
  !*** ./src/modules/services/img/icon-supercontracts-full-color-80h-proximax-sirius-wallet.svg ***!
  \************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("module.exports = __webpack_require__.p + \"assets/img/icon-supercontracts-full-color-80h-proximax-sirius-wallet.a764f8d0.svg\";\n\n//# sourceURL=webpack:///./src/modules/services/img/icon-supercontracts-full-color-80h-proximax-sirius-wallet.svg?");

/***/ }),

/***/ "./src/modules/services/img/icon-swap-process-color-80h-proximax-sirius-wallet.svg":
/*!*****************************************************************************************!*\
  !*** ./src/modules/services/img/icon-swap-process-color-80h-proximax-sirius-wallet.svg ***!
  \*****************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("module.exports = __webpack_require__.p + \"assets/img/icon-swap-process-color-80h-proximax-sirius-wallet.3a7567a8.svg\";\n\n//# sourceURL=webpack:///./src/modules/services/img/icon-swap-process-color-80h-proximax-sirius-wallet.svg?");

/***/ }),

/***/ "./src/modules/services/img/icon-transaction-explorer-full-color-80h-proximax-sirius-wallet.svg":
/*!******************************************************************************************************!*\
  !*** ./src/modules/services/img/icon-transaction-explorer-full-color-80h-proximax-sirius-wallet.svg ***!
  \******************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("module.exports = __webpack_require__.p + \"assets/img/icon-transaction-explorer-full-color-80h-proximax-sirius-wallet.b9cff338.svg\";\n\n//# sourceURL=webpack:///./src/modules/services/img/icon-transaction-explorer-full-color-80h-proximax-sirius-wallet.svg?");

/***/ }),

/***/ "./src/modules/services/img/icon-voting-full-color-80h-proximax-sirius-wallet.svg":
/*!****************************************************************************************!*\
  !*** ./src/modules/services/img/icon-voting-full-color-80h-proximax-sirius-wallet.svg ***!
  \****************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("module.exports = __webpack_require__.p + \"assets/img/icon-voting-full-color-80h-proximax-sirius-wallet.38c849a5.svg\";\n\n//# sourceURL=webpack:///./src/modules/services/img/icon-voting-full-color-80h-proximax-sirius-wallet.svg?");

/***/ }),

/***/ "./src/modules/services/img/icon-wallet-full-color-80h.svg":
/*!*****************************************************************!*\
  !*** ./src/modules/services/img/icon-wallet-full-color-80h.svg ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("module.exports = __webpack_require__.p + \"assets/img/icon-wallet-full-color-80h.5e0fe090.svg\";\n\n//# sourceURL=webpack:///./src/modules/services/img/icon-wallet-full-color-80h.svg?");

/***/ }),

/***/ "./src/modules/services/views/ViewServices.vue":
/*!*****************************************************!*\
  !*** ./src/modules/services/views/ViewServices.vue ***!
  \*****************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _ViewServices_vue_vue_type_template_id_183dbf78__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ViewServices.vue?vue&type=template&id=183dbf78 */ \"./src/modules/services/views/ViewServices.vue?vue&type=template&id=183dbf78\");\n/* harmony import */ var _ViewServices_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ViewServices.vue?vue&type=script&lang=js */ \"./src/modules/services/views/ViewServices.vue?vue&type=script&lang=js\");\n/* empty/unused harmony star reexport */\n\n\n_ViewServices_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"].render = _ViewServices_vue_vue_type_template_id_183dbf78__WEBPACK_IMPORTED_MODULE_0__[\"render\"]\n/* hot reload */\nif (false) {}\n\n_ViewServices_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"].__file = \"src/modules/services/views/ViewServices.vue\"\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (_ViewServices_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"]);\n\n//# sourceURL=webpack:///./src/modules/services/views/ViewServices.vue?");

/***/ }),

/***/ "./src/modules/services/views/ViewServices.vue?vue&type=script&lang=js":
/*!*****************************************************************************!*\
  !*** ./src/modules/services/views/ViewServices.vue?vue&type=script&lang=js ***!
  \*****************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_cli_service_node_modules_vue_loader_v16_dist_index_js_ref_0_1_ViewServices_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/cache-loader/dist/cjs.js??ref--0-0!../../../../node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist??ref--0-1!./ViewServices.vue?vue&type=script&lang=js */ \"./node_modules/cache-loader/dist/cjs.js?!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist/index.js?!./src/modules/services/views/ViewServices.vue?vue&type=script&lang=js\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return _node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_cli_service_node_modules_vue_loader_v16_dist_index_js_ref_0_1_ViewServices_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"]; });\n\n/* empty/unused harmony star reexport */ \n\n//# sourceURL=webpack:///./src/modules/services/views/ViewServices.vue?");

/***/ }),

/***/ "./src/modules/services/views/ViewServices.vue?vue&type=template&id=183dbf78":
/*!***********************************************************************************!*\
  !*** ./src/modules/services/views/ViewServices.vue?vue&type=template&id=183dbf78 ***!
  \***********************************************************************************/
/*! exports provided: render */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _node_modules_vue_cli_service_node_modules_vue_loader_v16_dist_templateLoader_js_ref_5_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_cli_service_node_modules_vue_loader_v16_dist_index_js_ref_0_1_ViewServices_vue_vue_type_template_id_183dbf78__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist/templateLoader.js??ref--5!../../../../node_modules/cache-loader/dist/cjs.js??ref--0-0!../../../../node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist??ref--0-1!./ViewServices.vue?vue&type=template&id=183dbf78 */ \"./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist/templateLoader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist/index.js?!./src/modules/services/views/ViewServices.vue?vue&type=template&id=183dbf78\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"render\", function() { return _node_modules_vue_cli_service_node_modules_vue_loader_v16_dist_templateLoader_js_ref_5_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_cli_service_node_modules_vue_loader_v16_dist_index_js_ref_0_1_ViewServices_vue_vue_type_template_id_183dbf78__WEBPACK_IMPORTED_MODULE_0__[\"render\"]; });\n\n\n\n//# sourceURL=webpack:///./src/modules/services/views/ViewServices.vue?");

/***/ })

}]);