(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[16],{

/***/ "./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist/templateLoader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist/index.js?!./src/modules/services/components/ServiceTile.vue?vue&type=template&id=536b3b2c&scoped=true":
/*!***************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist/templateLoader.js??ref--6!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist??ref--0-1!./src/modules/services/components/ServiceTile.vue?vue&type=template&id=536b3b2c&scoped=true ***!
  \***************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! exports provided: render */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"render\", function() { return render; });\n/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ \"./node_modules/vue/dist/vue.runtime.esm-bundler.js\");\n\n\nconst _withScopeId = n => (Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"pushScopeId\"])(\"data-v-536b3b2c\"),n=n(),Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"popScopeId\"])(),n)\nconst _hoisted_1 = { class: \"p-3 text-center\" }\nconst _hoisted_2 = [\"src\"]\nconst _hoisted_3 = {\n  class: \"py-1\",\n  role: \"none\"\n}\nconst _hoisted_4 = {\n  key: 1,\n  class: \"block px-2 py-1 text-xs text-gray-300\"\n}\n\nfunction render(_ctx, _cache, $props, $setup, $data, $options) {\n  const _component_font_awesome_icon = Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"resolveComponent\"])(\"font-awesome-icon\")\n  const _component_router_link = Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"resolveComponent\"])(\"router-link\")\n\n  return (Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"openBlock\"])(), Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createElementBlock\"])(\"div\", _hoisted_1, [\n    Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createElementVNode\"])(\"img\", {\n      src: `${__webpack_require__(\"./src/modules/services/img sync recursive ^\\\\.\\\\/.*$\")(\"./\" + $props.service.img)}`,\n      style: {\"width\":\"80px\",\"height\":\"80px\"},\n      class: Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"normalizeClass\"])([\"inline-block mb-3\", ($props.service.enable)?'':'filtergrayscale'])\n    }, null, 10 /* CLASS, PROPS */, _hoisted_2),\n    Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createElementVNode\"])(\"div\", {\n      class: Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"normalizeClass\"])([\"text-sm mb-2 font-bold\", ($props.service.enable)?'text-gray-800':'text-gray-300'])\n    }, Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"toDisplayString\"])($props.service.name), 3 /* TEXT, CLASS */),\n    Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createElementVNode\"])(\"div\", {\n      class: Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"normalizeClass\"])([\"text-xs\", ($props.service.enable)?'text-gray-800':'text-gray-300'])\n    }, Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"toDisplayString\"])($props.service.desc), 3 /* TEXT, CLASS */),\n    Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createElementVNode\"])(\"div\", {\n      class: \"relative inline-block text-left\",\n      onMouseover: _cache[1] || (_cache[1] = (...args) => ($setup.hoverOverMenu && $setup.hoverOverMenu(...args))),\n      onMouseout: _cache[2] || (_cache[2] = (...args) => ($setup.hoverOutMenu && $setup.hoverOutMenu(...args)))\n    }, [\n      Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createElementVNode\"])(\"div\", null, [\n        Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createElementVNode\"])(\"button\", {\n          type: \"button\",\n          onClick: _cache[0] || (_cache[0] = $event => {$setup.showHideMenu();}),\n          class: \"justify-center px-4 py-2 text-gray-700 focus:outline-none\",\n          id: \"options-menu\",\n          \"aria-expanded\": \"true\",\n          \"aria-haspopup\": \"true\"\n        }, [\n          Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createVNode\"])(_component_font_awesome_icon, {\n            icon: \"caret-down\",\n            class: \"w-5 h-5 text-gray-500 cursor-pointer inline-block\"\n          })\n        ])\n      ]),\n      Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createElementVNode\"])(\"div\", {\n        class: Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"normalizeClass\"])([$props.showMenuCall?'':'hidden', \"absolute w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50\"]),\n        role: \"menu\",\n        \"aria-orientation\": \"vertical\",\n        \"aria-labelledby\": \"options-menu\"\n      }, [\n        Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createElementVNode\"])(\"div\", _hoisted_3, [\n          (Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"openBlock\"])(true), Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createElementBlock\"])(vue__WEBPACK_IMPORTED_MODULE_0__[\"Fragment\"], null, Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"renderList\"])($props.service.menu, (option, item) => {\n            return (Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"openBlock\"])(), Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createElementBlock\"])(\"div\", { key: item }, [\n              (option.link!='')\n                ? (Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"openBlock\"])(), Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createBlock\"])(_component_router_link, {\n                    key: 0,\n                    to: {name: option.link},\n                    class: \"block px-2 py-1 text-xs text-gray-700 hover:bg-blue-primary hover:text-white\",\n                    role: \"menuitem\"\n                  }, {\n                    default: Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"withCtx\"])(() => [\n                      Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createTextVNode\"])(Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"toDisplayString\"])(option.name), 1 /* TEXT */)\n                    ]),\n                    _: 2 /* DYNAMIC */\n                  }, 1032 /* PROPS, DYNAMIC_SLOTS */, [\"to\"]))\n                : (Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"openBlock\"])(), Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createElementBlock\"])(\"div\", _hoisted_4, Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"toDisplayString\"])(option.name), 1 /* TEXT */))\n            ]))\n          }), 128 /* KEYED_FRAGMENT */))\n        ])\n      ], 2 /* CLASS */)\n    ], 32 /* HYDRATE_EVENTS */)\n  ]))\n}\n\n//# sourceURL=webpack:///./src/modules/services/components/ServiceTile.vue?./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist/templateLoader.js??ref--6!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist??ref--0-1");

/***/ }),

/***/ "./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist/templateLoader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist/index.js?!./src/modules/services/views/ViewServices.vue?vue&type=template&id=183dbf78":
/*!***********************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist/templateLoader.js??ref--6!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist??ref--0-1!./src/modules/services/views/ViewServices.vue?vue&type=template&id=183dbf78 ***!
  \***********************************************************************************************************************************************************************************************************************************************************************************************************/
/*! exports provided: render */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"render\", function() { return render; });\n/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ \"./node_modules/vue/dist/vue.runtime.esm-bundler.js\");\n\n\nconst _hoisted_1 = { class: \"mt-2 py-3\" }\nconst _hoisted_2 = { class: \"grid xs-grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6\" }\n\nfunction render(_ctx, _cache, $props, $setup, $data, $options) {\n  const _component_ServiceTile = Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"resolveComponent\"])(\"ServiceTile\")\n\n  return (Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"openBlock\"])(), Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createElementBlock\"])(\"div\", _hoisted_1, [\n    Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createElementVNode\"])(\"div\", _hoisted_2, [\n      (Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"openBlock\"])(true), Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createElementBlock\"])(vue__WEBPACK_IMPORTED_MODULE_0__[\"Fragment\"], null, Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"renderList\"])($setup.services, (item, index) => {\n        return (Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"openBlock\"])(), Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createBlock\"])(_component_ServiceTile, {\n          key: index,\n          service: item,\n          showMenuCall: $setup.showMenu[index],\n          i: index\n        }, null, 8 /* PROPS */, [\"service\", \"showMenuCall\", \"i\"]))\n      }), 128 /* KEYED_FRAGMENT */))\n    ])\n  ]))\n}\n\n//# sourceURL=webpack:///./src/modules/services/views/ViewServices.vue?./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist/templateLoader.js??ref--6!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist??ref--0-1");

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
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ \"./node_modules/vue/dist/vue.runtime.esm-bundler.js\");\n/* harmony import */ var _modules_services_components_ServiceTile_vue__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/modules/services/components/ServiceTile.vue */ \"./src/modules/services/components/ServiceTile.vue\");\n/* harmony import */ var vue_i18n__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! vue-i18n */ \"./node_modules/vue-i18n/dist/vue-i18n.esm-bundler.js\");\n\n\n\n\n\n/* harmony default export */ __webpack_exports__[\"default\"] = ({\n  name: 'ViewServices',\n  components: {\n    ServiceTile: _modules_services_components_ServiceTile_vue__WEBPACK_IMPORTED_MODULE_1__[\"default\"],\n  },\n\n  setup() {\n    const {t} = Object(vue_i18n__WEBPACK_IMPORTED_MODULE_2__[\"useI18n\"])();\n    const internalInstance = Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"getCurrentInstance\"])();\n    const emitter = internalInstance.appContext.config.globalProperties.emitter;\n    const currentMenu = Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"ref\"])('');\n    const showMenu = Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"ref\"])([]);\n    const services = Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"ref\"])([\n      {name: Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"computed\"])(() => t('services.namespaces')), desc: Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"computed\"])(() => t('services.namespacedescription')), img: 'icon-namespace-full-color-80h-proximax-sirius-wallet.svg', enable: true, menu:[\n        {name: Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"computed\"])(() => t('services.register')), link: 'ViewServicesNamespaceCreate'},\n        {name: Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"computed\"])(() => t('services.extendduration')), link: 'ViewServicesNamespaceExtend'}\n      ]},\n      {name: Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"computed\"])(() => t('services.assets')), desc: Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"computed\"])(() => t('services.mosaicsdescription')), img: 'icon-mosaics-full-color-80h-proximax-sirius-wallet.svg', enable: true, menu:[\n        {name: Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"computed\"])(() => t('welcome.create')), link: 'ViewServicesAssetsCreate'},\n        {name: Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"computed\"])(() => t('services.modifysupply')), link: 'ViewServicesAssetsModifySupplyChange'},\n        {name: Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"computed\"])(() => t('services.linktonamespace')), link: 'ViewServicesAssetsLinkToNamespace'}\n      ]},\n      {name: Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"computed\"])(() => t('services.mainnetswap')), desc: Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"computed\"])(() => t('services.swapdescription')), img: 'icon-swap-process-color-80h-proximax-sirius-wallet.svg', enable: true, menu:[\n        { name: Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"computed\"])(() => t('services.nis1')), link: 'ViewServicesMainnetSwapNIS1ToSirius'},\n        { name: Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"computed\"])(() => t('services.eth')), link: 'ViewServicesMainnetSwapEthOptions'},\n        { name: Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"computed\"])(() => t('services.bsc')), link: 'ViewServicesMainnetSwapBscOptions'},\n      ]},\n      {name: Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"computed\"])(() => t('services.addressbook')), desc: Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"computed\"])(() => t('services.addressbookdescription')), img: 'icon-address-book-full-color-80h-proximax-sirius-wallet.svg', enable: true, menu:[\n        {name: Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"computed\"])(() => t('services.list')), link: 'ViewServicesAddressBook'},\n        {name: Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"computed\"])(() => t('services.addcontacts')), link: 'ViewServicesAddressBookAddContact'},\n      ]},\n      {name: Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"computed\"])(() => t('Header.wallet')), desc: Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"computed\"])(() => t('services.walletsdescription')), img: 'icon-address-book-full-color-80h-proximax-sirius-wallet.svg', enable: true, menu:[\n        {name: Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"computed\"])(() => t('services.changepassword')), link: ''},\n        {name: Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"computed\"])(() => t('accounts.export')), link: 'ViewWalletExport'},\n        {name: Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"computed\"])(() => t('accounts.delete')), link: 'ViewWallets'},\n      ]},\n      {name: Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"computed\"])(() => t('dashboard.transactions')), desc: Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"computed\"])(() => t('services.transactiondescription')), img: 'icon-transaction-explorer-full-color-80h-proximax-sirius-wallet.svg', enable: true, menu:[\n        {name: Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"computed\"])(() => t('services.explorer')), link: ''},\n        {name: Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"computed\"])(() => t('accounts.partial')), link: ''},\n      ]},\n      {name: Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"computed\"])(() => t('services.nodes')), desc: Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"computed\"])(() => t('services.nodesdescription')), img: 'icon-nodes-full-color-80h-proximax-sirius-wallet.svg', enable: true, menu:[\n        {name: Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"computed\"])(() => t('welcome.blockchain')), link: 'ViewServicesNodes'},\n        {name: Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"computed\"])(() => t('welcome.storage')), link: ''},\n        {name: Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"computed\"])(() => t('welcome.streaming')), link: ''},\n      ]},\n      {name: Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"computed\"])(() => t('services.attestation')), desc: Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"computed\"])(() => t('services.attestdescription')), img: 'icon-attestation-full-color-80h-proximax-sirius-wallet.svg', enable: true, menu:[\n        {name: Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"computed\"])(() => t('services.attest')), link: 'ViewServicesAttestationCreate'},\n        {name: Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"computed\"])(() => t('services.audit')), link: 'ViewServicesAttestationAudit'},\n      ]},\n      {name: Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"computed\"])(() => t('services.notifications')), desc: Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"computed\"])(() => t('services.notificationdescription')), img: 'icon-notifications-full-color-80h-proximax-sirius-wallet.svg', enable: true, menu:[\n        {name: Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"computed\"])(() => t('services.notifications')), link: 'ViewServicesNotifications'},\n      ]},\n      {name: Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"computed\"])(() => t('services.voting')), desc: Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"computed\"])(() => t('services.votedescription')), img: 'icon-voting-full-color-80h-proximax-sirius-wallet.svg', enable: false, menu:[\n        {name: Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"computed\"])(() => t('services.createpoll')), link: 'ViewServicesVotingCreatePoll'},\n        {name: Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"computed\"])(() => t('services.vote')), link: 'ViewServicesVotingPoll'},\n        {name: Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"computed\"])(() => t('services.viewresults')), link: ''},\n      ]},\n      {name: Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"computed\"])(() => t('welcome.storage')), desc: Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"computed\"])(() => t('services.storagedescription')), img: 'icon-storage-full-color-80h-proximax-sirius-wallet.svg', enable: true, menu:[\n        {name: Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"computed\"])(() => t('services.files')), link: 'ViewServicesStorageMyFile'},\n        {name: Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"computed\"])(() => t('services.uploadfile')), link: 'ViewServicesStorageUploadFile'},\n        {name: Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"computed\"])(() => t('services.sendshare')), link: ''}\n      ]},\n      {name: Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"computed\"])(() => t('services.siriusgift')), desc: Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"computed\"])(() => t('services.siriusgiftdescription')), img: 'icon-gift-sirius-full-color-80h-proximax-sirius-wallet.svg', enable: true, menu:[\n        {name: Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"computed\"])(() => t('welcome.create')), link: 'ViewServicesSiriusGiftCreateGift'},\n        {name: Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"computed\"])(() => t('services.redeem')), link: 'ViewServicesSiriusGiftRedeem'},\n      ]},\n      {name: Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"computed\"])(() => t('services.aggregatetransactions')), desc: Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"computed\"])(() => t('services.aggregatetransactions')), img: 'icon-aggregate-transactions-full-color-80h-proximax-sirius-wallet.svg', enable: true, menu:[\n        {name: Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"computed\"])(() => t('services.complete')), link: 'ViewServicesAggregateTransactionsComplete'},\n        {name: Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"computed\"])(() => t('services.bonded')), link: ''},\n      ]},\n      {name: Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"computed\"])(() => t('services.crosschainswap')), desc: Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"computed\"])(() => t('services.crosschaindescription')), img: 'icon-cross-chain-swap-full-color-80h-proximax-sirius-wallet.svg', enable: false, menu:[\n        {name: Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"computed\"])(() => t('services.secredlock')), link: ''},\n        {name: Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"computed\"])(() => t('services.secredproof')), link: ''},\n      ]},\n     {name: Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"computed\"])(() => t('services.invoice')), desc: Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"computed\"])(() => t('services.invoicedescription')), img: 'icon-invoice-full-color-80h-proximax-sirius-wallet.svg', enable: false, menu:[\n        {name: Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"computed\"])(() => t('welcome.create')), link: ''},\n      ]},\n      {name: Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"computed\"])(() => t('welcome.supercontracts')), desc: Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"computed\"])(() => t('services.supercontractsdescription')), img: 'icon-supercontracts-full-color-80h-proximax-sirius-wallet.svg', enable: false, menu:[\n        {name: Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"computed\"])(() => t('welcome.create')), link: ''},\n        {name: Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"computed\"])(() => t('services.status')), link: ''},\n      ]},\n      {name: Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"computed\"])(() => t('services.chat')), desc: Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"computed\"])(() => t('services.chatdescription')), img: 'icon-chat-full-color-80h-proximax-sirius-wallet.svg', enable: false, menu:[\n        {name: Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"computed\"])(() => t('services.start')), link: ''},\n      ]},\n      {name: Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"computed\"])(() => t('services.videoconferencing')), desc: Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"computed\"])(() => t('services.videoconferencingdescription')), img: 'icon-streaming-full-color-80h-proximax-sirius-wallet.svg', enable: false, menu:[\n        {name: Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"computed\"])(() => t('services.start')), link: ''},\n        {name: Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"computed\"])(() => t('services.schedule')), link: ''},\n      ]},\n    ]);\n\n    // get num of accounts\n    var num_service = services.value.length;\n    var i = 0;\n    while(i < num_service){\n      showMenu.value[i] = false;\n      i++;\n    }\n\n    emitter.on(\"SHOW_MENU_TRIGGER\", payload => {\n      showMenu.value[payload] = true;\n      currentMenu.value = payload;\n    });\n    emitter.on(\"CLOSE_MENU_TRIGGER\", payload => {\n      showMenu.value[payload] = false;\n      currentMenu.value = payload;\n    });\n\n    emitter.on(\"CLOSE_ALL_MENU_TRIGGER\", () => {\n      var j = 0;\n      while(j < num_service){\n        showMenu.value[j] = false;\n        j++;\n      }\n    });\n\n    emitter.on('PAGE_CLICK', () => {\n      if(currentMenu.value === ''){\n        var k = 0;\n        while(k < num_service){\n          showMenu.value[k] = false;\n          k++;\n        }\n      }\n    });\n\n    emitter.on('HOVER_OVER_MENU_TRIGGER', index => {\n      currentMenu.value = index;\n    });\n\n    emitter.on('HOVER_OUT_MENU_TRIGGER', () => {\n      currentMenu.value = '';\n    });\n\n    return {\n      showMenu,\n      services,\n    };\n  },\n});\n\n\n//# sourceURL=webpack:///./src/modules/services/views/ViewServices.vue?./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist??ref--0-1");

/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js?!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/dist/cjs.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist/index.js?!./src/modules/services/components/ServiceTile.vue?vue&type=style&index=0&id=536b3b2c&lang=scss&scoped=true":
/*!********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js??ref--8-oneOf-1-1!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist/stylePostLoader.js!./node_modules/postcss-loader/src??ref--8-oneOf-1-2!./node_modules/sass-loader/dist/cjs.js??ref--8-oneOf-1-3!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist??ref--0-1!./src/modules/services/components/ServiceTile.vue?vue&type=style&index=0&id=536b3b2c&lang=scss&scoped=true ***!
  \********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("// Imports\nvar ___CSS_LOADER_API_IMPORT___ = __webpack_require__(/*! ../../../../node_modules/css-loader/dist/runtime/api.js */ \"./node_modules/css-loader/dist/runtime/api.js\");\nexports = ___CSS_LOADER_API_IMPORT___(false);\n// Module\nexports.push([module.i, \".filtergrayscale[data-v-536b3b2c] {\\n  filter: grayscale(100%) opacity(50%);\\n  color: gray;\\n}\", \"\"]);\n// Exports\nmodule.exports = exports;\n\n\n//# sourceURL=webpack:///./src/modules/services/components/ServiceTile.vue?./node_modules/css-loader/dist/cjs.js??ref--8-oneOf-1-1!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist/stylePostLoader.js!./node_modules/postcss-loader/src??ref--8-oneOf-1-2!./node_modules/sass-loader/dist/cjs.js??ref--8-oneOf-1-3!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist??ref--0-1");

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
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _ServiceTile_vue_vue_type_template_id_536b3b2c_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ServiceTile.vue?vue&type=template&id=536b3b2c&scoped=true */ \"./src/modules/services/components/ServiceTile.vue?vue&type=template&id=536b3b2c&scoped=true\");\n/* harmony import */ var _ServiceTile_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ServiceTile.vue?vue&type=script&lang=js */ \"./src/modules/services/components/ServiceTile.vue?vue&type=script&lang=js\");\n/* empty/unused harmony star reexport *//* harmony import */ var _ServiceTile_vue_vue_type_style_index_0_id_536b3b2c_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ServiceTile.vue?vue&type=style&index=0&id=536b3b2c&lang=scss&scoped=true */ \"./src/modules/services/components/ServiceTile.vue?vue&type=style&index=0&id=536b3b2c&lang=scss&scoped=true\");\n/* harmony import */ var _home_runner_work_web_wallet_vuejs_web_wallet_vuejs_node_modules_vue_cli_service_node_modules_vue_loader_v16_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist/exportHelper.js */ \"./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist/exportHelper.js\");\n/* harmony import */ var _home_runner_work_web_wallet_vuejs_web_wallet_vuejs_node_modules_vue_cli_service_node_modules_vue_loader_v16_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_home_runner_work_web_wallet_vuejs_web_wallet_vuejs_node_modules_vue_cli_service_node_modules_vue_loader_v16_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_3__);\n\n\n\n\n\n\n\nconst __exports__ = /*#__PURE__*/_home_runner_work_web_wallet_vuejs_web_wallet_vuejs_node_modules_vue_cli_service_node_modules_vue_loader_v16_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_3___default()(_ServiceTile_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"], [['render',_ServiceTile_vue_vue_type_template_id_536b3b2c_scoped_true__WEBPACK_IMPORTED_MODULE_0__[\"render\"]],['__scopeId',\"data-v-536b3b2c\"],['__file',\"src/modules/services/components/ServiceTile.vue\"]])\n/* hot reload */\nif (false) {}\n\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (__exports__);\n\n//# sourceURL=webpack:///./src/modules/services/components/ServiceTile.vue?");

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
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _node_modules_vue_cli_service_node_modules_vue_loader_v16_dist_templateLoader_js_ref_6_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_cli_service_node_modules_vue_loader_v16_dist_index_js_ref_0_1_ServiceTile_vue_vue_type_template_id_536b3b2c_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist/templateLoader.js??ref--6!../../../../node_modules/cache-loader/dist/cjs.js??ref--0-0!../../../../node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist??ref--0-1!./ServiceTile.vue?vue&type=template&id=536b3b2c&scoped=true */ \"./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist/templateLoader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist/index.js?!./src/modules/services/components/ServiceTile.vue?vue&type=template&id=536b3b2c&scoped=true\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"render\", function() { return _node_modules_vue_cli_service_node_modules_vue_loader_v16_dist_templateLoader_js_ref_6_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_cli_service_node_modules_vue_loader_v16_dist_index_js_ref_0_1_ServiceTile_vue_vue_type_template_id_536b3b2c_scoped_true__WEBPACK_IMPORTED_MODULE_0__[\"render\"]; });\n\n\n\n//# sourceURL=webpack:///./src/modules/services/components/ServiceTile.vue?");

/***/ }),

/***/ "./src/modules/services/img sync recursive ^\\.\\/.*$":
/*!************************************************!*\
  !*** ./src/modules/services/img sync ^\.\/.*$ ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("var map = {\n\t\"./icon-account-green-16h-proximax-sirius-wallet.svg\": \"./src/modules/services/img/icon-account-green-16h-proximax-sirius-wallet.svg\",\n\t\"./icon-accounts-full-color-80h-proximax-sirius-wallet.svg\": \"./src/modules/services/img/icon-accounts-full-color-80h-proximax-sirius-wallet.svg\",\n\t\"./icon-address-book-full-color-80h-proximax-sirius-wallet.svg\": \"./src/modules/services/img/icon-address-book-full-color-80h-proximax-sirius-wallet.svg\",\n\t\"./icon-aggregate-transactions-full-color-80h-proximax-sirius-wallet.svg\": \"./src/modules/services/img/icon-aggregate-transactions-full-color-80h-proximax-sirius-wallet.svg\",\n\t\"./icon-attestation-full-color-80h-proximax-sirius-wallet.svg\": \"./src/modules/services/img/icon-attestation-full-color-80h-proximax-sirius-wallet.svg\",\n\t\"./icon-chat-full-color-80h-proximax-sirius-wallet.svg\": \"./src/modules/services/img/icon-chat-full-color-80h-proximax-sirius-wallet.svg\",\n\t\"./icon-cross-chain-swap-full-color-80h-proximax-sirius-wallet.svg\": \"./src/modules/services/img/icon-cross-chain-swap-full-color-80h-proximax-sirius-wallet.svg\",\n\t\"./icon-gift-sirius-full-color-80h-proximax-sirius-wallet.svg\": \"./src/modules/services/img/icon-gift-sirius-full-color-80h-proximax-sirius-wallet.svg\",\n\t\"./icon-invoice-full-color-80h-proximax-sirius-wallet.svg\": \"./src/modules/services/img/icon-invoice-full-color-80h-proximax-sirius-wallet.svg\",\n\t\"./icon-mosaics-full-color-80h-proximax-sirius-wallet.svg\": \"./src/modules/services/img/icon-mosaics-full-color-80h-proximax-sirius-wallet.svg\",\n\t\"./icon-namespace-full-color-80h-proximax-sirius-wallet.svg\": \"./src/modules/services/img/icon-namespace-full-color-80h-proximax-sirius-wallet.svg\",\n\t\"./icon-nodes-full-color-80h-proximax-sirius-wallet.svg\": \"./src/modules/services/img/icon-nodes-full-color-80h-proximax-sirius-wallet.svg\",\n\t\"./icon-notifications-full-color-80h-proximax-sirius-wallet.svg\": \"./src/modules/services/img/icon-notifications-full-color-80h-proximax-sirius-wallet.svg\",\n\t\"./icon-storage-full-color-80h-proximax-sirius-wallet.svg\": \"./src/modules/services/img/icon-storage-full-color-80h-proximax-sirius-wallet.svg\",\n\t\"./icon-streaming-full-color-80h-proximax-sirius-wallet.svg\": \"./src/modules/services/img/icon-streaming-full-color-80h-proximax-sirius-wallet.svg\",\n\t\"./icon-supercontracts-full-color-80h-proximax-sirius-wallet.svg\": \"./src/modules/services/img/icon-supercontracts-full-color-80h-proximax-sirius-wallet.svg\",\n\t\"./icon-swap-process-color-80h-proximax-sirius-wallet.svg\": \"./src/modules/services/img/icon-swap-process-color-80h-proximax-sirius-wallet.svg\",\n\t\"./icon-transaction-explorer-full-color-80h-proximax-sirius-wallet.svg\": \"./src/modules/services/img/icon-transaction-explorer-full-color-80h-proximax-sirius-wallet.svg\",\n\t\"./icon-voting-full-color-80h-proximax-sirius-wallet.svg\": \"./src/modules/services/img/icon-voting-full-color-80h-proximax-sirius-wallet.svg\",\n\t\"./icon-wallet-full-color-80h.svg\": \"./src/modules/services/img/icon-wallet-full-color-80h.svg\"\n};\n\n\nfunction webpackContext(req) {\n\tvar id = webpackContextResolve(req);\n\treturn __webpack_require__(id);\n}\nfunction webpackContextResolve(req) {\n\tif(!__webpack_require__.o(map, req)) {\n\t\tvar e = new Error(\"Cannot find module '\" + req + \"'\");\n\t\te.code = 'MODULE_NOT_FOUND';\n\t\tthrow e;\n\t}\n\treturn map[req];\n}\nwebpackContext.keys = function webpackContextKeys() {\n\treturn Object.keys(map);\n};\nwebpackContext.resolve = webpackContextResolve;\nmodule.exports = webpackContext;\nwebpackContext.id = \"./src/modules/services/img sync recursive ^\\\\.\\\\/.*$\";\n\n//# sourceURL=webpack:///./src/modules/services/img_sync_^\\.\\/.*$?");

/***/ }),

/***/ "./src/modules/services/img/icon-account-green-16h-proximax-sirius-wallet.svg":
/*!************************************************************************************!*\
  !*** ./src/modules/services/img/icon-account-green-16h-proximax-sirius-wallet.svg ***!
  \************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("module.exports = __webpack_require__.p + \"assets/img/icon-account-green-16h-proximax-sirius-wallet.f8fb8a8a.svg\";\n\n//# sourceURL=webpack:///./src/modules/services/img/icon-account-green-16h-proximax-sirius-wallet.svg?");

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
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _ViewServices_vue_vue_type_template_id_183dbf78__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ViewServices.vue?vue&type=template&id=183dbf78 */ \"./src/modules/services/views/ViewServices.vue?vue&type=template&id=183dbf78\");\n/* harmony import */ var _ViewServices_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ViewServices.vue?vue&type=script&lang=js */ \"./src/modules/services/views/ViewServices.vue?vue&type=script&lang=js\");\n/* empty/unused harmony star reexport *//* harmony import */ var _home_runner_work_web_wallet_vuejs_web_wallet_vuejs_node_modules_vue_cli_service_node_modules_vue_loader_v16_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist/exportHelper.js */ \"./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist/exportHelper.js\");\n/* harmony import */ var _home_runner_work_web_wallet_vuejs_web_wallet_vuejs_node_modules_vue_cli_service_node_modules_vue_loader_v16_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_home_runner_work_web_wallet_vuejs_web_wallet_vuejs_node_modules_vue_cli_service_node_modules_vue_loader_v16_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2__);\n\n\n\n\n\nconst __exports__ = /*#__PURE__*/_home_runner_work_web_wallet_vuejs_web_wallet_vuejs_node_modules_vue_cli_service_node_modules_vue_loader_v16_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2___default()(_ViewServices_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"], [['render',_ViewServices_vue_vue_type_template_id_183dbf78__WEBPACK_IMPORTED_MODULE_0__[\"render\"]],['__file',\"src/modules/services/views/ViewServices.vue\"]])\n/* hot reload */\nif (false) {}\n\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (__exports__);\n\n//# sourceURL=webpack:///./src/modules/services/views/ViewServices.vue?");

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
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _node_modules_vue_cli_service_node_modules_vue_loader_v16_dist_templateLoader_js_ref_6_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_cli_service_node_modules_vue_loader_v16_dist_index_js_ref_0_1_ViewServices_vue_vue_type_template_id_183dbf78__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist/templateLoader.js??ref--6!../../../../node_modules/cache-loader/dist/cjs.js??ref--0-0!../../../../node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist??ref--0-1!./ViewServices.vue?vue&type=template&id=183dbf78 */ \"./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist/templateLoader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist/index.js?!./src/modules/services/views/ViewServices.vue?vue&type=template&id=183dbf78\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"render\", function() { return _node_modules_vue_cli_service_node_modules_vue_loader_v16_dist_templateLoader_js_ref_6_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_cli_service_node_modules_vue_loader_v16_dist_index_js_ref_0_1_ViewServices_vue_vue_type_template_id_183dbf78__WEBPACK_IMPORTED_MODULE_0__[\"render\"]; });\n\n\n\n//# sourceURL=webpack:///./src/modules/services/views/ViewServices.vue?");

/***/ })

}]);