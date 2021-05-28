(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[8],{

/***/ "./node_modules/cache-loader/dist/cjs.js?!./node_modules/babel-loader/lib/index.js!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist/templateLoader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist/index.js?!./src/components/ServiceTile.vue?vue&type=template&id=83d9a0fa&scoped=true":
/*!*********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/babel-loader/lib!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist/templateLoader.js??ref--6!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist??ref--0-1!./src/components/ServiceTile.vue?vue&type=template&id=83d9a0fa&scoped=true ***!
  \*********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! exports provided: render */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"render\", function() { return render; });\n/* harmony import */ var core_js_modules_es_function_name_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/es.function.name.js */ \"./node_modules/core-js/modules/es.function.name.js\");\n/* harmony import */ var core_js_modules_es_function_name_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_function_name_js__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var core_js_modules_es_string_link_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! core-js/modules/es.string.link.js */ \"./node_modules/core-js/modules/es.string.link.js\");\n/* harmony import */ var core_js_modules_es_string_link_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_string_link_js__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! vue */ \"./node_modules/vue/dist/vue.runtime.esm-bundler.js\");\n\n\n\n\nvar _withId = /*#__PURE__*/Object(vue__WEBPACK_IMPORTED_MODULE_2__[\"withScopeId\"])(\"data-v-83d9a0fa\");\n\nObject(vue__WEBPACK_IMPORTED_MODULE_2__[\"pushScopeId\"])(\"data-v-83d9a0fa\");\n\nvar _hoisted_1 = {\n  class: \"p-3 text-center\"\n};\nvar _hoisted_2 = {\n  class: \"py-1\",\n  role: \"none\"\n};\nvar _hoisted_3 = {\n  key: 1,\n  class: \"block px-2 py-1 text-xs text-gray-300\"\n};\n\nObject(vue__WEBPACK_IMPORTED_MODULE_2__[\"popScopeId\"])();\n\nvar render = /*#__PURE__*/_withId(function (_ctx, _cache, $props, $setup, $data, $options) {\n  var _component_font_awesome_icon = Object(vue__WEBPACK_IMPORTED_MODULE_2__[\"resolveComponent\"])(\"font-awesome-icon\");\n\n  var _component_router_link = Object(vue__WEBPACK_IMPORTED_MODULE_2__[\"resolveComponent\"])(\"router-link\");\n\n  return Object(vue__WEBPACK_IMPORTED_MODULE_2__[\"openBlock\"])(), Object(vue__WEBPACK_IMPORTED_MODULE_2__[\"createBlock\"])(\"div\", _hoisted_1, [Object(vue__WEBPACK_IMPORTED_MODULE_2__[\"createVNode\"])(\"img\", {\n    src: \"\".concat(__webpack_require__(\"./src/assets/img/services sync recursive ^\\\\.\\\\/.*$\")(\"./\" + $props.service.img)),\n    style: {\n      \"width\": \"80px\",\n      \"height\": \"80px\"\n    },\n    class: [\"inline-block mb-3\", $props.service.enable ? '' : 'filtergrayscale']\n  }, null, 10\n  /* CLASS, PROPS */\n  , [\"src\"]), Object(vue__WEBPACK_IMPORTED_MODULE_2__[\"createVNode\"])(\"div\", {\n    class: [\"text-sm mb-2 font-bold\", $props.service.enable ? 'text-gray-800' : 'text-gray-300']\n  }, Object(vue__WEBPACK_IMPORTED_MODULE_2__[\"toDisplayString\"])($props.service.name), 3\n  /* TEXT, CLASS */\n  ), Object(vue__WEBPACK_IMPORTED_MODULE_2__[\"createVNode\"])(\"div\", {\n    class: [\"text-xs\", $props.service.enable ? 'text-gray-800' : 'text-gray-300']\n  }, Object(vue__WEBPACK_IMPORTED_MODULE_2__[\"toDisplayString\"])($props.service.desc), 3\n  /* TEXT, CLASS */\n  ), Object(vue__WEBPACK_IMPORTED_MODULE_2__[\"createVNode\"])(\"div\", {\n    class: \"relative inline-block text-left\",\n    onMouseover: _cache[2] || (_cache[2] = function () {\n      return $setup.hoverOverMenu && $setup.hoverOverMenu.apply($setup, arguments);\n    }),\n    onMouseout: _cache[3] || (_cache[3] = function () {\n      return $setup.hoverOutMenu && $setup.hoverOutMenu.apply($setup, arguments);\n    })\n  }, [Object(vue__WEBPACK_IMPORTED_MODULE_2__[\"createVNode\"])(\"div\", null, [Object(vue__WEBPACK_IMPORTED_MODULE_2__[\"createVNode\"])(\"button\", {\n    type: \"button\",\n    onClick: _cache[1] || (_cache[1] = function ($event) {\n      $setup.showHideMenu();\n    }),\n    class: \"justify-center px-4 py-2 text-gray-700 focus:outline-none\",\n    id: \"options-menu\",\n    \"aria-expanded\": \"true\",\n    \"aria-haspopup\": \"true\"\n  }, [Object(vue__WEBPACK_IMPORTED_MODULE_2__[\"createVNode\"])(_component_font_awesome_icon, {\n    icon: \"caret-down\",\n    class: \"w-5 h-5 text-gray-500 cursor-pointer inline-block\"\n  })])]), Object(vue__WEBPACK_IMPORTED_MODULE_2__[\"createVNode\"])(\"div\", {\n    class: [$props.showMenuCall ? '' : 'hidden', \"absolute w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50\"],\n    role: \"menu\",\n    \"aria-orientation\": \"vertical\",\n    \"aria-labelledby\": \"options-menu\"\n  }, [Object(vue__WEBPACK_IMPORTED_MODULE_2__[\"createVNode\"])(\"div\", _hoisted_2, [(Object(vue__WEBPACK_IMPORTED_MODULE_2__[\"openBlock\"])(true), Object(vue__WEBPACK_IMPORTED_MODULE_2__[\"createBlock\"])(vue__WEBPACK_IMPORTED_MODULE_2__[\"Fragment\"], null, Object(vue__WEBPACK_IMPORTED_MODULE_2__[\"renderList\"])($props.service.menu, function (option, item) {\n    return Object(vue__WEBPACK_IMPORTED_MODULE_2__[\"openBlock\"])(), Object(vue__WEBPACK_IMPORTED_MODULE_2__[\"createBlock\"])(\"div\", {\n      key: item\n    }, [option.link != '' ? (Object(vue__WEBPACK_IMPORTED_MODULE_2__[\"openBlock\"])(), Object(vue__WEBPACK_IMPORTED_MODULE_2__[\"createBlock\"])(_component_router_link, {\n      key: 0,\n      to: option.link,\n      class: \"block px-2 py-1 text-xs text-gray-700 hover:bg-blue-primary hover:text-white\",\n      role: \"menuitem\"\n    }, {\n      default: _withId(function () {\n        return [Object(vue__WEBPACK_IMPORTED_MODULE_2__[\"createTextVNode\"])(Object(vue__WEBPACK_IMPORTED_MODULE_2__[\"toDisplayString\"])(option.name), 1\n        /* TEXT */\n        )];\n      }),\n      _: 2\n      /* DYNAMIC */\n\n    }, 1032\n    /* PROPS, DYNAMIC_SLOTS */\n    , [\"to\"])) : (Object(vue__WEBPACK_IMPORTED_MODULE_2__[\"openBlock\"])(), Object(vue__WEBPACK_IMPORTED_MODULE_2__[\"createBlock\"])(\"div\", _hoisted_3, Object(vue__WEBPACK_IMPORTED_MODULE_2__[\"toDisplayString\"])(option.name), 1\n    /* TEXT */\n    ))]);\n  }), 128\n  /* KEYED_FRAGMENT */\n  ))])], 2\n  /* CLASS */\n  )], 32\n  /* HYDRATE_EVENTS */\n  )]);\n});\n\n//# sourceURL=webpack:///./src/components/ServiceTile.vue?./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/babel-loader/lib!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist/templateLoader.js??ref--6!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist??ref--0-1");

/***/ }),

/***/ "./node_modules/cache-loader/dist/cjs.js?!./node_modules/babel-loader/lib/index.js!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist/templateLoader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist/index.js?!./src/views/ViewAllServices.vue?vue&type=template&id=ada6a620":
/*!********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/babel-loader/lib!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist/templateLoader.js??ref--6!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist??ref--0-1!./src/views/ViewAllServices.vue?vue&type=template&id=ada6a620 ***!
  \********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! exports provided: render */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"render\", function() { return render; });\n/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ \"./node_modules/vue/dist/vue.runtime.esm-bundler.js\");\n\nvar _hoisted_1 = {\n  class: \"mt-2 py-3\"\n};\nvar _hoisted_2 = {\n  class: \"grid xs-grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6\"\n};\nfunction render(_ctx, _cache, $props, $setup, $data, $options) {\n  var _component_ServiceTile = Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"resolveComponent\"])(\"ServiceTile\");\n\n  return Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"openBlock\"])(), Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createBlock\"])(\"div\", _hoisted_1, [Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createVNode\"])(\"div\", _hoisted_2, [(Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"openBlock\"])(true), Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createBlock\"])(vue__WEBPACK_IMPORTED_MODULE_0__[\"Fragment\"], null, Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"renderList\"])($setup.services, function (item, index) {\n    return Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"openBlock\"])(), Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createBlock\"])(_component_ServiceTile, {\n      key: index,\n      service: item,\n      showMenuCall: $setup.showMenu[index],\n      i: index\n    }, null, 8\n    /* PROPS */\n    , [\"service\", \"showMenuCall\", \"i\"]);\n  }), 128\n  /* KEYED_FRAGMENT */\n  )), Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createCommentVNode\"])(\" <div v-for=\\\"(item, index) in services\\\" :key=\\\"index\\\">{{ item.name }}</div> \")])]);\n}\n\n//# sourceURL=webpack:///./src/views/ViewAllServices.vue?./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/babel-loader/lib!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist/templateLoader.js??ref--6!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist??ref--0-1");

/***/ }),

/***/ "./node_modules/cache-loader/dist/cjs.js?!./node_modules/babel-loader/lib/index.js!./node_modules/cache-loader/dist/cjs.js?!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist/index.js?!./src/components/ServiceTile.vue?vue&type=script&lang=js":
/*!********************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist??ref--0-1!./src/components/ServiceTile.vue?vue&type=script&lang=js ***!
  \********************************************************************************************************************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ \"./node_modules/vue/dist/vue.runtime.esm-bundler.js\");\n\n/* harmony default export */ __webpack_exports__[\"default\"] = ({\n  name: 'ServiceTile',\n  props: ['service', 'showMenuCall', 'i'],\n  setup: function setup(p) {\n    var internalInstance = Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"getCurrentInstance\"])();\n    var emitter = internalInstance.appContext.config.globalProperties.emitter;\n\n    var showHideMenu = function showHideMenu() {\n      // show.value = !show.value;\n      emitter.emit(\"CLOSE_ALL_MENU_TRIGGER\");\n\n      if (p.showMenuCall) {\n        emitter.emit(\"CLOSE_MENU_TRIGGER\", p.i);\n      } else {\n        emitter.emit(\"SHOW_MENU_TRIGGER\", p.i);\n      }\n    };\n\n    var hoverOverMenu = function hoverOverMenu() {\n      emitter.emit(\"HOVER_OVER_MENU_TRIGGER\", p.i);\n    };\n\n    var hoverOutMenu = function hoverOutMenu() {\n      emitter.emit(\"HOVER_OUT_MENU_TRIGGER\");\n    };\n\n    return {\n      showHideMenu: showHideMenu,\n      hoverOverMenu: hoverOverMenu,\n      hoverOutMenu: hoverOutMenu\n    };\n  }\n});\n\n//# sourceURL=webpack:///./src/components/ServiceTile.vue?./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist??ref--0-1");

/***/ }),

/***/ "./node_modules/cache-loader/dist/cjs.js?!./node_modules/babel-loader/lib/index.js!./node_modules/cache-loader/dist/cjs.js?!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist/index.js?!./src/views/ViewAllServices.vue?vue&type=script&lang=js":
/*!*******************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist??ref--0-1!./src/views/ViewAllServices.vue?vue&type=script&lang=js ***!
  \*******************************************************************************************************************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ \"./node_modules/vue/dist/vue.runtime.esm-bundler.js\");\n/* harmony import */ var _components_ServiceTile_vue__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/components/ServiceTile.vue */ \"./src/components/ServiceTile.vue\");\n\n\n/* harmony default export */ __webpack_exports__[\"default\"] = ({\n  name: 'ViewAllServices',\n  components: {\n    ServiceTile: _components_ServiceTile_vue__WEBPACK_IMPORTED_MODULE_1__[\"default\"]\n  },\n  setup: function setup() {\n    var internalInstance = Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"getCurrentInstance\"])();\n    var emitter = internalInstance.appContext.config.globalProperties.emitter;\n    var currentMenu = Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"ref\"])('');\n    var showMenu = Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"ref\"])([]);\n    var services = Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"ref\"])([{\n      name: 'Namespaces',\n      desc: 'Create namespaces and sub-namespaces',\n      img: 'icon-namespace-full-color-80h-proximax-sirius-wallet.svg',\n      enable: true,\n      menu: [{\n        name: 'Register',\n        link: ''\n      }, {\n        name: 'Extend Duration',\n        link: ''\n      }]\n    }, {\n      name: 'Assets',\n      desc: 'Create digital representations with customized properties',\n      img: 'icon-mosaics-full-color-80h-proximax-sirius-wallet.svg',\n      enable: true,\n      menu: [{\n        name: 'Create',\n        link: '/create-mosaic'\n      }, {\n        name: 'Modify Supply',\n        link: ''\n      }, {\n        name: 'Link to Namespace',\n        link: ''\n      }]\n    }, {\n      name: 'Mainnet Swap',\n      desc: 'Swap from NEM to Sirius',\n      img: 'icon-swap-process-color-80h-proximax-sirius-wallet.svg',\n      enable: true,\n      menu: [{\n        name: 'Transfer Assets',\n        link: ''\n      }]\n    }, {\n      name: 'Address Book',\n      desc: 'Assign labels to addresses',\n      img: 'icon-address-book-full-color-80h-proximax-sirius-wallet.svg',\n      enable: true,\n      menu: [{\n        name: 'List',\n        link: '/address-book'\n      }, {\n        name: 'Add Contacts',\n        link: '/add-contacts'\n      }]\n    }, {\n      name: 'Wallets',\n      desc: 'Manage your wallets',\n      img: 'icon-address-book-full-color-80h-proximax-sirius-wallet.svg',\n      enable: true,\n      menu: [{\n        name: 'Change Password',\n        link: ''\n      }, {\n        name: 'Export',\n        link: '/export-wallet'\n      }, {\n        name: 'Delete',\n        link: '/wallets'\n      }]\n    }, {\n      name: 'Transactions',\n      desc: 'Explorer all transactions',\n      img: 'icon-transaction-explorer-full-color-80h-proximax-sirius-wallet.svg',\n      enable: true,\n      menu: [{\n        name: 'Change Password',\n        link: ''\n      }, {\n        name: 'Explorer',\n        link: ''\n      }, {\n        name: 'Partial',\n        link: ''\n      }]\n    }, {\n      name: 'Nodes',\n      desc: 'Add and edit nodes',\n      img: 'icon-nodes-full-color-80h-proximax-sirius-wallet.svg',\n      enable: true,\n      menu: [{\n        name: 'Blockchain',\n        link: '/nodes'\n      }, {\n        name: 'Storage',\n        link: ''\n      }, {\n        name: 'Streaming',\n        link: ''\n      }]\n    }, {\n      name: 'Attestation',\n      desc: 'Proof of existence and origination',\n      img: 'icon-attestation-full-color-80h-proximax-sirius-wallet.svg',\n      enable: true,\n      menu: [{\n        name: 'Attest',\n        link: ''\n      }, {\n        name: 'Audit',\n        link: ''\n      }]\n    }, {\n      name: 'Notifications',\n      desc: 'Check alerts and information about your accounts',\n      img: 'icon-notifications-full-color-80h-proximax-sirius-wallet.svg',\n      enable: true,\n      menu: [{\n        name: 'Notifications',\n        link: ''\n      }]\n    }, {\n      name: 'Voting',\n      desc: 'Create, vote, and view results',\n      img: 'icon-voting-full-color-80h-proximax-sirius-wallet.svg',\n      enable: true,\n      menu: [{\n        name: 'Create Poll',\n        link: ''\n      }, {\n        name: 'Vote',\n        link: ''\n      }, {\n        name: 'View Results',\n        link: ''\n      }]\n    }, {\n      name: 'Storage',\n      desc: 'Upload and download your files and encrypt them',\n      img: 'icon-storage-full-color-80h-proximax-sirius-wallet.svg',\n      enable: true,\n      menu: [{\n        name: 'Files',\n        link: ''\n      }, {\n        name: 'Upload File',\n        link: ''\n      }, {\n        name: 'Send / Share',\n        link: ''\n      }]\n    }, {\n      name: 'Sirius Gift',\n      desc: 'Create a redeemable gift',\n      img: 'icon-gift-sirius-full-color-80h-proximax-sirius-wallet.svg',\n      enable: true,\n      menu: [{\n        name: 'Create',\n        link: ''\n      }, {\n        name: 'Redeem',\n        link: ''\n      }]\n    }, {\n      name: 'Aggregate Transactions',\n      desc: 'Merge multiple transactions into one',\n      img: 'icon-aggregate-transactions-full-color-80h-proximax-sirius-wallet.svg',\n      enable: false,\n      menu: [{\n        name: 'Complete',\n        link: ''\n      }, {\n        name: 'Bonded',\n        link: ''\n      }]\n    }, {\n      name: 'Cross-Chain Swaps',\n      desc: 'Atomic Cross-Chain Swap between public and private networks',\n      img: 'icon-cross-chain-swap-full-color-80h-proximax-sirius-wallet.svg',\n      enable: false,\n      menu: [{\n        name: 'Secred Lock',\n        link: ''\n      }, {\n        name: 'Secred Proof',\n        link: ''\n      }]\n    }, {\n      name: 'Invoice',\n      desc: 'Create and manage invoices',\n      img: 'icon-invoice-full-color-80h-proximax-sirius-wallet.svg',\n      enable: false,\n      menu: [{\n        name: 'Create',\n        link: ''\n      }]\n    }, {\n      name: 'Supercontracts',\n      desc: 'Create and execute logical flows for digital contract obligations',\n      img: 'icon-supercontracts-full-color-80h-proximax-sirius-wallet.svg',\n      enable: false,\n      menu: [{\n        name: 'Create',\n        link: ''\n      }, {\n        name: 'Status',\n        link: ''\n      }]\n    }, {\n      name: 'Chat',\n      desc: 'Encrypted live chat',\n      img: 'icon-chat-full-color-80h-proximax-sirius-wallet.svg',\n      enable: false,\n      menu: [{\n        name: 'Start',\n        link: ''\n      }]\n    }, {\n      name: 'Video Conferencing',\n      desc: 'Encrypted live video streaming',\n      img: 'icon-streaming-full-color-80h-proximax-sirius-wallet.svg',\n      enable: false,\n      menu: [{\n        name: 'Start',\n        link: ''\n      }, {\n        name: 'Schedule',\n        link: ''\n      }]\n    }]); // get num of accounts\n\n    var num_service = services.value.length;\n    var i = 0;\n\n    while (i < num_service) {\n      showMenu.value[i] = false;\n      i++;\n    }\n\n    emitter.on(\"SHOW_MENU_TRIGGER\", function (payload) {\n      showMenu.value[payload] = true;\n      currentMenu.value = payload;\n    });\n    emitter.on(\"CLOSE_MENU_TRIGGER\", function (payload) {\n      showMenu.value[payload] = false;\n      currentMenu.value = payload;\n    });\n    emitter.on(\"CLOSE_ALL_MENU_TRIGGER\", function () {\n      var j = 0;\n\n      while (j < num_service) {\n        showMenu.value[j] = false;\n        j++;\n      }\n    });\n    emitter.on('PAGE_CLICK', function () {\n      if (currentMenu.value === '') {\n        var k = 0;\n\n        while (k < num_service) {\n          showMenu.value[k] = false;\n          k++;\n        }\n      }\n    });\n    emitter.on('HOVER_OVER_MENU_TRIGGER', function (index) {\n      currentMenu.value = index;\n    });\n    emitter.on('HOVER_OUT_MENU_TRIGGER', function () {\n      currentMenu.value = '';\n    });\n    return {\n      showMenu: showMenu,\n      services: services\n    };\n  }\n});\n\n//# sourceURL=webpack:///./src/views/ViewAllServices.vue?./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist??ref--0-1");

/***/ }),

/***/ "./node_modules/core-js/internals/create-html.js":
/*!*******************************************************!*\
  !*** ./node_modules/core-js/internals/create-html.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("var requireObjectCoercible = __webpack_require__(/*! ../internals/require-object-coercible */ \"./node_modules/core-js/internals/require-object-coercible.js\");\n\nvar quot = /\"/g;\n\n// B.2.3.2.1 CreateHTML(string, tag, attribute, value)\n// https://tc39.es/ecma262/#sec-createhtml\nmodule.exports = function (string, tag, attribute, value) {\n  var S = String(requireObjectCoercible(string));\n  var p1 = '<' + tag;\n  if (attribute !== '') p1 += ' ' + attribute + '=\"' + String(value).replace(quot, '&quot;') + '\"';\n  return p1 + '>' + S + '</' + tag + '>';\n};\n\n\n//# sourceURL=webpack:///./node_modules/core-js/internals/create-html.js?");

/***/ }),

/***/ "./node_modules/core-js/internals/string-html-forced.js":
/*!**************************************************************!*\
  !*** ./node_modules/core-js/internals/string-html-forced.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("var fails = __webpack_require__(/*! ../internals/fails */ \"./node_modules/core-js/internals/fails.js\");\n\n// check the existence of a method, lowercase\n// of a tag and escaping quotes in arguments\nmodule.exports = function (METHOD_NAME) {\n  return fails(function () {\n    var test = ''[METHOD_NAME]('\"');\n    return test !== test.toLowerCase() || test.split('\"').length > 3;\n  });\n};\n\n\n//# sourceURL=webpack:///./node_modules/core-js/internals/string-html-forced.js?");

/***/ }),

/***/ "./node_modules/core-js/modules/es.string.link.js":
/*!********************************************************!*\
  !*** ./node_modules/core-js/modules/es.string.link.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nvar $ = __webpack_require__(/*! ../internals/export */ \"./node_modules/core-js/internals/export.js\");\nvar createHTML = __webpack_require__(/*! ../internals/create-html */ \"./node_modules/core-js/internals/create-html.js\");\nvar forcedStringHTMLMethod = __webpack_require__(/*! ../internals/string-html-forced */ \"./node_modules/core-js/internals/string-html-forced.js\");\n\n// `String.prototype.link` method\n// https://tc39.es/ecma262/#sec-string.prototype.link\n$({ target: 'String', proto: true, forced: forcedStringHTMLMethod('link') }, {\n  link: function link(url) {\n    return createHTML(this, 'a', 'href', url);\n  }\n});\n\n\n//# sourceURL=webpack:///./node_modules/core-js/modules/es.string.link.js?");

/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js?!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/dist/cjs.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist/index.js?!./src/components/ServiceTile.vue?vue&type=style&index=0&id=83d9a0fa&lang=scss&scoped=true":
/*!***************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js??ref--8-oneOf-1-1!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist/stylePostLoader.js!./node_modules/postcss-loader/src??ref--8-oneOf-1-2!./node_modules/sass-loader/dist/cjs.js??ref--8-oneOf-1-3!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist??ref--0-1!./src/components/ServiceTile.vue?vue&type=style&index=0&id=83d9a0fa&lang=scss&scoped=true ***!
  \***************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("// Imports\nvar ___CSS_LOADER_API_IMPORT___ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/api.js */ \"./node_modules/css-loader/dist/runtime/api.js\");\nexports = ___CSS_LOADER_API_IMPORT___(false);\n// Module\nexports.push([module.i, \".filtergrayscale[data-v-83d9a0fa] {\\n  filter: grayscale(100%) opacity(50%);\\n  color: gray;\\n}\\n\", \"\"]);\n// Exports\nmodule.exports = exports;\n\n\n//# sourceURL=webpack:///./src/components/ServiceTile.vue?./node_modules/css-loader/dist/cjs.js??ref--8-oneOf-1-1!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist/stylePostLoader.js!./node_modules/postcss-loader/src??ref--8-oneOf-1-2!./node_modules/sass-loader/dist/cjs.js??ref--8-oneOf-1-3!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist??ref--0-1");

/***/ }),

/***/ "./node_modules/vue-style-loader/index.js?!./node_modules/css-loader/dist/cjs.js?!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/dist/cjs.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist/index.js?!./src/components/ServiceTile.vue?vue&type=style&index=0&id=83d9a0fa&lang=scss&scoped=true":
/*!*****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-style-loader??ref--8-oneOf-1-0!./node_modules/css-loader/dist/cjs.js??ref--8-oneOf-1-1!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist/stylePostLoader.js!./node_modules/postcss-loader/src??ref--8-oneOf-1-2!./node_modules/sass-loader/dist/cjs.js??ref--8-oneOf-1-3!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist??ref--0-1!./src/components/ServiceTile.vue?vue&type=style&index=0&id=83d9a0fa&lang=scss&scoped=true ***!
  \*****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("// style-loader: Adds some css to the DOM by adding a <style> tag\n\n// load the styles\nvar content = __webpack_require__(/*! !../../node_modules/css-loader/dist/cjs.js??ref--8-oneOf-1-1!../../node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist/stylePostLoader.js!../../node_modules/postcss-loader/src??ref--8-oneOf-1-2!../../node_modules/sass-loader/dist/cjs.js??ref--8-oneOf-1-3!../../node_modules/cache-loader/dist/cjs.js??ref--0-0!../../node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist??ref--0-1!./ServiceTile.vue?vue&type=style&index=0&id=83d9a0fa&lang=scss&scoped=true */ \"./node_modules/css-loader/dist/cjs.js?!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/dist/cjs.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist/index.js?!./src/components/ServiceTile.vue?vue&type=style&index=0&id=83d9a0fa&lang=scss&scoped=true\");\nif(content.__esModule) content = content.default;\nif(typeof content === 'string') content = [[module.i, content, '']];\nif(content.locals) module.exports = content.locals;\n// add the styles to the DOM\nvar add = __webpack_require__(/*! ../../node_modules/vue-style-loader/lib/addStylesClient.js */ \"./node_modules/vue-style-loader/lib/addStylesClient.js\").default\nvar update = add(\"0e056e88\", content, false, {\"sourceMap\":false,\"shadowMode\":false});\n// Hot Module Replacement\nif(false) {}\n\n//# sourceURL=webpack:///./src/components/ServiceTile.vue?./node_modules/vue-style-loader??ref--8-oneOf-1-0!./node_modules/css-loader/dist/cjs.js??ref--8-oneOf-1-1!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist/stylePostLoader.js!./node_modules/postcss-loader/src??ref--8-oneOf-1-2!./node_modules/sass-loader/dist/cjs.js??ref--8-oneOf-1-3!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist??ref--0-1");

/***/ }),

/***/ "./src/assets/img/services sync recursive ^\\.\\/.*$":
/*!***********************************************!*\
  !*** ./src/assets/img/services sync ^\.\/.*$ ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("var map = {\n\t\"./icon-accounts-full-color-80h-proximax-sirius-wallet.svg\": \"./src/assets/img/services/icon-accounts-full-color-80h-proximax-sirius-wallet.svg\",\n\t\"./icon-address-book-full-color-80h-proximax-sirius-wallet.svg\": \"./src/assets/img/services/icon-address-book-full-color-80h-proximax-sirius-wallet.svg\",\n\t\"./icon-aggregate-transactions-full-color-80h-proximax-sirius-wallet.svg\": \"./src/assets/img/services/icon-aggregate-transactions-full-color-80h-proximax-sirius-wallet.svg\",\n\t\"./icon-attestation-full-color-80h-proximax-sirius-wallet.svg\": \"./src/assets/img/services/icon-attestation-full-color-80h-proximax-sirius-wallet.svg\",\n\t\"./icon-chat-full-color-80h-proximax-sirius-wallet.svg\": \"./src/assets/img/services/icon-chat-full-color-80h-proximax-sirius-wallet.svg\",\n\t\"./icon-cross-chain-swap-full-color-80h-proximax-sirius-wallet.svg\": \"./src/assets/img/services/icon-cross-chain-swap-full-color-80h-proximax-sirius-wallet.svg\",\n\t\"./icon-gift-sirius-full-color-80h-proximax-sirius-wallet.svg\": \"./src/assets/img/services/icon-gift-sirius-full-color-80h-proximax-sirius-wallet.svg\",\n\t\"./icon-invoice-full-color-80h-proximax-sirius-wallet.svg\": \"./src/assets/img/services/icon-invoice-full-color-80h-proximax-sirius-wallet.svg\",\n\t\"./icon-mosaics-full-color-80h-proximax-sirius-wallet.svg\": \"./src/assets/img/services/icon-mosaics-full-color-80h-proximax-sirius-wallet.svg\",\n\t\"./icon-namespace-full-color-80h-proximax-sirius-wallet.svg\": \"./src/assets/img/services/icon-namespace-full-color-80h-proximax-sirius-wallet.svg\",\n\t\"./icon-nodes-full-color-80h-proximax-sirius-wallet.svg\": \"./src/assets/img/services/icon-nodes-full-color-80h-proximax-sirius-wallet.svg\",\n\t\"./icon-notifications-full-color-80h-proximax-sirius-wallet.svg\": \"./src/assets/img/services/icon-notifications-full-color-80h-proximax-sirius-wallet.svg\",\n\t\"./icon-storage-full-color-80h-proximax-sirius-wallet.svg\": \"./src/assets/img/services/icon-storage-full-color-80h-proximax-sirius-wallet.svg\",\n\t\"./icon-streaming-full-color-80h-proximax-sirius-wallet.svg\": \"./src/assets/img/services/icon-streaming-full-color-80h-proximax-sirius-wallet.svg\",\n\t\"./icon-supercontracts-full-color-80h-proximax-sirius-wallet.svg\": \"./src/assets/img/services/icon-supercontracts-full-color-80h-proximax-sirius-wallet.svg\",\n\t\"./icon-swap-process-color-80h-proximax-sirius-wallet.svg\": \"./src/assets/img/services/icon-swap-process-color-80h-proximax-sirius-wallet.svg\",\n\t\"./icon-transaction-explorer-full-color-80h-proximax-sirius-wallet.svg\": \"./src/assets/img/services/icon-transaction-explorer-full-color-80h-proximax-sirius-wallet.svg\",\n\t\"./icon-voting-full-color-80h-proximax-sirius-wallet.svg\": \"./src/assets/img/services/icon-voting-full-color-80h-proximax-sirius-wallet.svg\",\n\t\"./icon-wallet-full-color-80h.svg\": \"./src/assets/img/services/icon-wallet-full-color-80h.svg\"\n};\n\n\nfunction webpackContext(req) {\n\tvar id = webpackContextResolve(req);\n\treturn __webpack_require__(id);\n}\nfunction webpackContextResolve(req) {\n\tif(!__webpack_require__.o(map, req)) {\n\t\tvar e = new Error(\"Cannot find module '\" + req + \"'\");\n\t\te.code = 'MODULE_NOT_FOUND';\n\t\tthrow e;\n\t}\n\treturn map[req];\n}\nwebpackContext.keys = function webpackContextKeys() {\n\treturn Object.keys(map);\n};\nwebpackContext.resolve = webpackContextResolve;\nmodule.exports = webpackContext;\nwebpackContext.id = \"./src/assets/img/services sync recursive ^\\\\.\\\\/.*$\";\n\n//# sourceURL=webpack:///./src/assets/img/services_sync_^\\.\\/.*$?");

/***/ }),

/***/ "./src/assets/img/services/icon-accounts-full-color-80h-proximax-sirius-wallet.svg":
/*!*****************************************************************************************!*\
  !*** ./src/assets/img/services/icon-accounts-full-color-80h-proximax-sirius-wallet.svg ***!
  \*****************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("module.exports = __webpack_require__.p + \"assets/img/icon-accounts-full-color-80h-proximax-sirius-wallet.b7e75d23.svg\";\n\n//# sourceURL=webpack:///./src/assets/img/services/icon-accounts-full-color-80h-proximax-sirius-wallet.svg?");

/***/ }),

/***/ "./src/assets/img/services/icon-address-book-full-color-80h-proximax-sirius-wallet.svg":
/*!*********************************************************************************************!*\
  !*** ./src/assets/img/services/icon-address-book-full-color-80h-proximax-sirius-wallet.svg ***!
  \*********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("module.exports = __webpack_require__.p + \"assets/img/icon-address-book-full-color-80h-proximax-sirius-wallet.64eb80fb.svg\";\n\n//# sourceURL=webpack:///./src/assets/img/services/icon-address-book-full-color-80h-proximax-sirius-wallet.svg?");

/***/ }),

/***/ "./src/assets/img/services/icon-aggregate-transactions-full-color-80h-proximax-sirius-wallet.svg":
/*!*******************************************************************************************************!*\
  !*** ./src/assets/img/services/icon-aggregate-transactions-full-color-80h-proximax-sirius-wallet.svg ***!
  \*******************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("module.exports = __webpack_require__.p + \"assets/img/icon-aggregate-transactions-full-color-80h-proximax-sirius-wallet.aa120552.svg\";\n\n//# sourceURL=webpack:///./src/assets/img/services/icon-aggregate-transactions-full-color-80h-proximax-sirius-wallet.svg?");

/***/ }),

/***/ "./src/assets/img/services/icon-attestation-full-color-80h-proximax-sirius-wallet.svg":
/*!********************************************************************************************!*\
  !*** ./src/assets/img/services/icon-attestation-full-color-80h-proximax-sirius-wallet.svg ***!
  \********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("module.exports = __webpack_require__.p + \"assets/img/icon-attestation-full-color-80h-proximax-sirius-wallet.73e1faaa.svg\";\n\n//# sourceURL=webpack:///./src/assets/img/services/icon-attestation-full-color-80h-proximax-sirius-wallet.svg?");

/***/ }),

/***/ "./src/assets/img/services/icon-chat-full-color-80h-proximax-sirius-wallet.svg":
/*!*************************************************************************************!*\
  !*** ./src/assets/img/services/icon-chat-full-color-80h-proximax-sirius-wallet.svg ***!
  \*************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("module.exports = __webpack_require__.p + \"assets/img/icon-chat-full-color-80h-proximax-sirius-wallet.4e202d2e.svg\";\n\n//# sourceURL=webpack:///./src/assets/img/services/icon-chat-full-color-80h-proximax-sirius-wallet.svg?");

/***/ }),

/***/ "./src/assets/img/services/icon-cross-chain-swap-full-color-80h-proximax-sirius-wallet.svg":
/*!*************************************************************************************************!*\
  !*** ./src/assets/img/services/icon-cross-chain-swap-full-color-80h-proximax-sirius-wallet.svg ***!
  \*************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("module.exports = __webpack_require__.p + \"assets/img/icon-cross-chain-swap-full-color-80h-proximax-sirius-wallet.a965b0bb.svg\";\n\n//# sourceURL=webpack:///./src/assets/img/services/icon-cross-chain-swap-full-color-80h-proximax-sirius-wallet.svg?");

/***/ }),

/***/ "./src/assets/img/services/icon-gift-sirius-full-color-80h-proximax-sirius-wallet.svg":
/*!********************************************************************************************!*\
  !*** ./src/assets/img/services/icon-gift-sirius-full-color-80h-proximax-sirius-wallet.svg ***!
  \********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("module.exports = __webpack_require__.p + \"assets/img/icon-gift-sirius-full-color-80h-proximax-sirius-wallet.622b38a9.svg\";\n\n//# sourceURL=webpack:///./src/assets/img/services/icon-gift-sirius-full-color-80h-proximax-sirius-wallet.svg?");

/***/ }),

/***/ "./src/assets/img/services/icon-invoice-full-color-80h-proximax-sirius-wallet.svg":
/*!****************************************************************************************!*\
  !*** ./src/assets/img/services/icon-invoice-full-color-80h-proximax-sirius-wallet.svg ***!
  \****************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("module.exports = __webpack_require__.p + \"assets/img/icon-invoice-full-color-80h-proximax-sirius-wallet.7c33a2c8.svg\";\n\n//# sourceURL=webpack:///./src/assets/img/services/icon-invoice-full-color-80h-proximax-sirius-wallet.svg?");

/***/ }),

/***/ "./src/assets/img/services/icon-mosaics-full-color-80h-proximax-sirius-wallet.svg":
/*!****************************************************************************************!*\
  !*** ./src/assets/img/services/icon-mosaics-full-color-80h-proximax-sirius-wallet.svg ***!
  \****************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("module.exports = __webpack_require__.p + \"assets/img/icon-mosaics-full-color-80h-proximax-sirius-wallet.77a3f8f5.svg\";\n\n//# sourceURL=webpack:///./src/assets/img/services/icon-mosaics-full-color-80h-proximax-sirius-wallet.svg?");

/***/ }),

/***/ "./src/assets/img/services/icon-namespace-full-color-80h-proximax-sirius-wallet.svg":
/*!******************************************************************************************!*\
  !*** ./src/assets/img/services/icon-namespace-full-color-80h-proximax-sirius-wallet.svg ***!
  \******************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("module.exports = __webpack_require__.p + \"assets/img/icon-namespace-full-color-80h-proximax-sirius-wallet.41d9c83d.svg\";\n\n//# sourceURL=webpack:///./src/assets/img/services/icon-namespace-full-color-80h-proximax-sirius-wallet.svg?");

/***/ }),

/***/ "./src/assets/img/services/icon-nodes-full-color-80h-proximax-sirius-wallet.svg":
/*!**************************************************************************************!*\
  !*** ./src/assets/img/services/icon-nodes-full-color-80h-proximax-sirius-wallet.svg ***!
  \**************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("module.exports = __webpack_require__.p + \"assets/img/icon-nodes-full-color-80h-proximax-sirius-wallet.749ea2c7.svg\";\n\n//# sourceURL=webpack:///./src/assets/img/services/icon-nodes-full-color-80h-proximax-sirius-wallet.svg?");

/***/ }),

/***/ "./src/assets/img/services/icon-notifications-full-color-80h-proximax-sirius-wallet.svg":
/*!**********************************************************************************************!*\
  !*** ./src/assets/img/services/icon-notifications-full-color-80h-proximax-sirius-wallet.svg ***!
  \**********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("module.exports = __webpack_require__.p + \"assets/img/icon-notifications-full-color-80h-proximax-sirius-wallet.8c505e29.svg\";\n\n//# sourceURL=webpack:///./src/assets/img/services/icon-notifications-full-color-80h-proximax-sirius-wallet.svg?");

/***/ }),

/***/ "./src/assets/img/services/icon-storage-full-color-80h-proximax-sirius-wallet.svg":
/*!****************************************************************************************!*\
  !*** ./src/assets/img/services/icon-storage-full-color-80h-proximax-sirius-wallet.svg ***!
  \****************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("module.exports = __webpack_require__.p + \"assets/img/icon-storage-full-color-80h-proximax-sirius-wallet.df124eee.svg\";\n\n//# sourceURL=webpack:///./src/assets/img/services/icon-storage-full-color-80h-proximax-sirius-wallet.svg?");

/***/ }),

/***/ "./src/assets/img/services/icon-streaming-full-color-80h-proximax-sirius-wallet.svg":
/*!******************************************************************************************!*\
  !*** ./src/assets/img/services/icon-streaming-full-color-80h-proximax-sirius-wallet.svg ***!
  \******************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("module.exports = __webpack_require__.p + \"assets/img/icon-streaming-full-color-80h-proximax-sirius-wallet.6f349713.svg\";\n\n//# sourceURL=webpack:///./src/assets/img/services/icon-streaming-full-color-80h-proximax-sirius-wallet.svg?");

/***/ }),

/***/ "./src/assets/img/services/icon-supercontracts-full-color-80h-proximax-sirius-wallet.svg":
/*!***********************************************************************************************!*\
  !*** ./src/assets/img/services/icon-supercontracts-full-color-80h-proximax-sirius-wallet.svg ***!
  \***********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("module.exports = __webpack_require__.p + \"assets/img/icon-supercontracts-full-color-80h-proximax-sirius-wallet.a764f8d0.svg\";\n\n//# sourceURL=webpack:///./src/assets/img/services/icon-supercontracts-full-color-80h-proximax-sirius-wallet.svg?");

/***/ }),

/***/ "./src/assets/img/services/icon-swap-process-color-80h-proximax-sirius-wallet.svg":
/*!****************************************************************************************!*\
  !*** ./src/assets/img/services/icon-swap-process-color-80h-proximax-sirius-wallet.svg ***!
  \****************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("module.exports = __webpack_require__.p + \"assets/img/icon-swap-process-color-80h-proximax-sirius-wallet.3a7567a8.svg\";\n\n//# sourceURL=webpack:///./src/assets/img/services/icon-swap-process-color-80h-proximax-sirius-wallet.svg?");

/***/ }),

/***/ "./src/assets/img/services/icon-transaction-explorer-full-color-80h-proximax-sirius-wallet.svg":
/*!*****************************************************************************************************!*\
  !*** ./src/assets/img/services/icon-transaction-explorer-full-color-80h-proximax-sirius-wallet.svg ***!
  \*****************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("module.exports = __webpack_require__.p + \"assets/img/icon-transaction-explorer-full-color-80h-proximax-sirius-wallet.b9cff338.svg\";\n\n//# sourceURL=webpack:///./src/assets/img/services/icon-transaction-explorer-full-color-80h-proximax-sirius-wallet.svg?");

/***/ }),

/***/ "./src/assets/img/services/icon-voting-full-color-80h-proximax-sirius-wallet.svg":
/*!***************************************************************************************!*\
  !*** ./src/assets/img/services/icon-voting-full-color-80h-proximax-sirius-wallet.svg ***!
  \***************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("module.exports = __webpack_require__.p + \"assets/img/icon-voting-full-color-80h-proximax-sirius-wallet.38c849a5.svg\";\n\n//# sourceURL=webpack:///./src/assets/img/services/icon-voting-full-color-80h-proximax-sirius-wallet.svg?");

/***/ }),

/***/ "./src/assets/img/services/icon-wallet-full-color-80h.svg":
/*!****************************************************************!*\
  !*** ./src/assets/img/services/icon-wallet-full-color-80h.svg ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("module.exports = __webpack_require__.p + \"assets/img/icon-wallet-full-color-80h.5e0fe090.svg\";\n\n//# sourceURL=webpack:///./src/assets/img/services/icon-wallet-full-color-80h.svg?");

/***/ }),

/***/ "./src/components/ServiceTile.vue":
/*!****************************************!*\
  !*** ./src/components/ServiceTile.vue ***!
  \****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _ServiceTile_vue_vue_type_template_id_83d9a0fa_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ServiceTile.vue?vue&type=template&id=83d9a0fa&scoped=true */ \"./src/components/ServiceTile.vue?vue&type=template&id=83d9a0fa&scoped=true\");\n/* harmony import */ var _ServiceTile_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ServiceTile.vue?vue&type=script&lang=js */ \"./src/components/ServiceTile.vue?vue&type=script&lang=js\");\n/* empty/unused harmony star reexport *//* harmony import */ var _ServiceTile_vue_vue_type_style_index_0_id_83d9a0fa_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ServiceTile.vue?vue&type=style&index=0&id=83d9a0fa&lang=scss&scoped=true */ \"./src/components/ServiceTile.vue?vue&type=style&index=0&id=83d9a0fa&lang=scss&scoped=true\");\n\n\n\n\n\n_ServiceTile_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"].render = _ServiceTile_vue_vue_type_template_id_83d9a0fa_scoped_true__WEBPACK_IMPORTED_MODULE_0__[\"render\"]\n_ServiceTile_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"].__scopeId = \"data-v-83d9a0fa\"\n/* hot reload */\nif (false) {}\n\n_ServiceTile_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"].__file = \"src/components/ServiceTile.vue\"\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (_ServiceTile_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"]);\n\n//# sourceURL=webpack:///./src/components/ServiceTile.vue?");

/***/ }),

/***/ "./src/components/ServiceTile.vue?vue&type=script&lang=js":
/*!****************************************************************!*\
  !*** ./src/components/ServiceTile.vue?vue&type=script&lang=js ***!
  \****************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _node_modules_cache_loader_dist_cjs_js_ref_12_0_node_modules_babel_loader_lib_index_js_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_cli_service_node_modules_vue_loader_v16_dist_index_js_ref_0_1_ServiceTile_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/cache-loader/dist/cjs.js??ref--12-0!../../node_modules/babel-loader/lib!../../node_modules/cache-loader/dist/cjs.js??ref--0-0!../../node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist??ref--0-1!./ServiceTile.vue?vue&type=script&lang=js */ \"./node_modules/cache-loader/dist/cjs.js?!./node_modules/babel-loader/lib/index.js!./node_modules/cache-loader/dist/cjs.js?!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist/index.js?!./src/components/ServiceTile.vue?vue&type=script&lang=js\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return _node_modules_cache_loader_dist_cjs_js_ref_12_0_node_modules_babel_loader_lib_index_js_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_cli_service_node_modules_vue_loader_v16_dist_index_js_ref_0_1_ServiceTile_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"]; });\n\n/* empty/unused harmony star reexport */ \n\n//# sourceURL=webpack:///./src/components/ServiceTile.vue?");

/***/ }),

/***/ "./src/components/ServiceTile.vue?vue&type=style&index=0&id=83d9a0fa&lang=scss&scoped=true":
/*!*************************************************************************************************!*\
  !*** ./src/components/ServiceTile.vue?vue&type=style&index=0&id=83d9a0fa&lang=scss&scoped=true ***!
  \*************************************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_node_modules_vue_cli_service_node_modules_vue_loader_v16_dist_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_cli_service_node_modules_vue_loader_v16_dist_index_js_ref_0_1_ServiceTile_vue_vue_type_style_index_0_id_83d9a0fa_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/vue-style-loader??ref--8-oneOf-1-0!../../node_modules/css-loader/dist/cjs.js??ref--8-oneOf-1-1!../../node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist/stylePostLoader.js!../../node_modules/postcss-loader/src??ref--8-oneOf-1-2!../../node_modules/sass-loader/dist/cjs.js??ref--8-oneOf-1-3!../../node_modules/cache-loader/dist/cjs.js??ref--0-0!../../node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist??ref--0-1!./ServiceTile.vue?vue&type=style&index=0&id=83d9a0fa&lang=scss&scoped=true */ \"./node_modules/vue-style-loader/index.js?!./node_modules/css-loader/dist/cjs.js?!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/dist/cjs.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist/index.js?!./src/components/ServiceTile.vue?vue&type=style&index=0&id=83d9a0fa&lang=scss&scoped=true\");\n/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_node_modules_vue_cli_service_node_modules_vue_loader_v16_dist_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_cli_service_node_modules_vue_loader_v16_dist_index_js_ref_0_1_ServiceTile_vue_vue_type_style_index_0_id_83d9a0fa_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_node_modules_vue_cli_service_node_modules_vue_loader_v16_dist_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_cli_service_node_modules_vue_loader_v16_dist_index_js_ref_0_1_ServiceTile_vue_vue_type_style_index_0_id_83d9a0fa_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_node_modules_vue_cli_service_node_modules_vue_loader_v16_dist_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_cli_service_node_modules_vue_loader_v16_dist_index_js_ref_0_1_ServiceTile_vue_vue_type_style_index_0_id_83d9a0fa_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0__) if([\"default\"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_node_modules_vue_cli_service_node_modules_vue_loader_v16_dist_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_cli_service_node_modules_vue_loader_v16_dist_index_js_ref_0_1_ServiceTile_vue_vue_type_style_index_0_id_83d9a0fa_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));\n\n\n//# sourceURL=webpack:///./src/components/ServiceTile.vue?");

/***/ }),

/***/ "./src/components/ServiceTile.vue?vue&type=template&id=83d9a0fa&scoped=true":
/*!**********************************************************************************!*\
  !*** ./src/components/ServiceTile.vue?vue&type=template&id=83d9a0fa&scoped=true ***!
  \**********************************************************************************/
/*! exports provided: render */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _node_modules_cache_loader_dist_cjs_js_ref_12_0_node_modules_babel_loader_lib_index_js_node_modules_vue_cli_service_node_modules_vue_loader_v16_dist_templateLoader_js_ref_6_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_cli_service_node_modules_vue_loader_v16_dist_index_js_ref_0_1_ServiceTile_vue_vue_type_template_id_83d9a0fa_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/cache-loader/dist/cjs.js??ref--12-0!../../node_modules/babel-loader/lib!../../node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist/templateLoader.js??ref--6!../../node_modules/cache-loader/dist/cjs.js??ref--0-0!../../node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist??ref--0-1!./ServiceTile.vue?vue&type=template&id=83d9a0fa&scoped=true */ \"./node_modules/cache-loader/dist/cjs.js?!./node_modules/babel-loader/lib/index.js!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist/templateLoader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist/index.js?!./src/components/ServiceTile.vue?vue&type=template&id=83d9a0fa&scoped=true\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"render\", function() { return _node_modules_cache_loader_dist_cjs_js_ref_12_0_node_modules_babel_loader_lib_index_js_node_modules_vue_cli_service_node_modules_vue_loader_v16_dist_templateLoader_js_ref_6_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_cli_service_node_modules_vue_loader_v16_dist_index_js_ref_0_1_ServiceTile_vue_vue_type_template_id_83d9a0fa_scoped_true__WEBPACK_IMPORTED_MODULE_0__[\"render\"]; });\n\n\n\n//# sourceURL=webpack:///./src/components/ServiceTile.vue?");

/***/ }),

/***/ "./src/views/ViewAllServices.vue":
/*!***************************************!*\
  !*** ./src/views/ViewAllServices.vue ***!
  \***************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _ViewAllServices_vue_vue_type_template_id_ada6a620__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ViewAllServices.vue?vue&type=template&id=ada6a620 */ \"./src/views/ViewAllServices.vue?vue&type=template&id=ada6a620\");\n/* harmony import */ var _ViewAllServices_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ViewAllServices.vue?vue&type=script&lang=js */ \"./src/views/ViewAllServices.vue?vue&type=script&lang=js\");\n/* empty/unused harmony star reexport */\n\n\n_ViewAllServices_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"].render = _ViewAllServices_vue_vue_type_template_id_ada6a620__WEBPACK_IMPORTED_MODULE_0__[\"render\"]\n/* hot reload */\nif (false) {}\n\n_ViewAllServices_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"].__file = \"src/views/ViewAllServices.vue\"\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (_ViewAllServices_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"]);\n\n//# sourceURL=webpack:///./src/views/ViewAllServices.vue?");

/***/ }),

/***/ "./src/views/ViewAllServices.vue?vue&type=script&lang=js":
/*!***************************************************************!*\
  !*** ./src/views/ViewAllServices.vue?vue&type=script&lang=js ***!
  \***************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _node_modules_cache_loader_dist_cjs_js_ref_12_0_node_modules_babel_loader_lib_index_js_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_cli_service_node_modules_vue_loader_v16_dist_index_js_ref_0_1_ViewAllServices_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/cache-loader/dist/cjs.js??ref--12-0!../../node_modules/babel-loader/lib!../../node_modules/cache-loader/dist/cjs.js??ref--0-0!../../node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist??ref--0-1!./ViewAllServices.vue?vue&type=script&lang=js */ \"./node_modules/cache-loader/dist/cjs.js?!./node_modules/babel-loader/lib/index.js!./node_modules/cache-loader/dist/cjs.js?!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist/index.js?!./src/views/ViewAllServices.vue?vue&type=script&lang=js\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return _node_modules_cache_loader_dist_cjs_js_ref_12_0_node_modules_babel_loader_lib_index_js_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_cli_service_node_modules_vue_loader_v16_dist_index_js_ref_0_1_ViewAllServices_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"]; });\n\n/* empty/unused harmony star reexport */ \n\n//# sourceURL=webpack:///./src/views/ViewAllServices.vue?");

/***/ }),

/***/ "./src/views/ViewAllServices.vue?vue&type=template&id=ada6a620":
/*!*********************************************************************!*\
  !*** ./src/views/ViewAllServices.vue?vue&type=template&id=ada6a620 ***!
  \*********************************************************************/
/*! exports provided: render */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _node_modules_cache_loader_dist_cjs_js_ref_12_0_node_modules_babel_loader_lib_index_js_node_modules_vue_cli_service_node_modules_vue_loader_v16_dist_templateLoader_js_ref_6_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_cli_service_node_modules_vue_loader_v16_dist_index_js_ref_0_1_ViewAllServices_vue_vue_type_template_id_ada6a620__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/cache-loader/dist/cjs.js??ref--12-0!../../node_modules/babel-loader/lib!../../node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist/templateLoader.js??ref--6!../../node_modules/cache-loader/dist/cjs.js??ref--0-0!../../node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist??ref--0-1!./ViewAllServices.vue?vue&type=template&id=ada6a620 */ \"./node_modules/cache-loader/dist/cjs.js?!./node_modules/babel-loader/lib/index.js!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist/templateLoader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist/index.js?!./src/views/ViewAllServices.vue?vue&type=template&id=ada6a620\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"render\", function() { return _node_modules_cache_loader_dist_cjs_js_ref_12_0_node_modules_babel_loader_lib_index_js_node_modules_vue_cli_service_node_modules_vue_loader_v16_dist_templateLoader_js_ref_6_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_cli_service_node_modules_vue_loader_v16_dist_index_js_ref_0_1_ViewAllServices_vue_vue_type_template_id_ada6a620__WEBPACK_IMPORTED_MODULE_0__[\"render\"]; });\n\n\n\n//# sourceURL=webpack:///./src/views/ViewAllServices.vue?");

/***/ })

}]);