(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[38],{

/***/ "./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader-v16/dist/index.js?!./src/modules/account/views/ViewAccountAssets.vue?vue&type=script&lang=js":
/*!********************************************************************************************************************************************************************************!*\
  !*** ./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader-v16/dist??ref--0-1!./src/modules/account/views/ViewAccountAssets.vue?vue&type=script&lang=js ***!
  \********************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ \"./node_modules/vue/dist/vue.runtime.esm-bundler.js\");\n/* harmony import */ var _modules_account_components_AccountComponent_vue__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/modules/account/components/AccountComponent.vue */ \"./src/modules/account/components/AccountComponent.vue\");\n/* harmony import */ var _state_walletState__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/state/walletState */ \"./src/state/walletState.ts\");\n/* harmony import */ var _util_typeHelper__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @/util/typeHelper */ \"./src/util/typeHelper.ts\");\n/* harmony import */ var _state_appState__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @/state/appState */ \"./src/state/appState.ts\");\n/* harmony import */ var _state_networkState__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @/state/networkState */ \"./src/state/networkState.ts\");\n/* harmony import */ var _modules_account_components_AccountTabs_vue__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @/modules/account/components/AccountTabs.vue */ \"./src/modules/account/components/AccountTabs.vue\");\n\n\n\n\n\n\n\n\n/* harmony default export */ __webpack_exports__[\"default\"] = ({\n    name:'ViewAccountAssets',\n    components:{\n        AccountComponent: _modules_account_components_AccountComponent_vue__WEBPACK_IMPORTED_MODULE_1__[\"default\"],\n        AccountTabs: _modules_account_components_AccountTabs_vue__WEBPACK_IMPORTED_MODULE_6__[\"default\"]\n    },\n    props:{\n        address: String,\n    },\n    setup(p){\n        const wallet = _state_walletState__WEBPACK_IMPORTED_MODULE_2__[\"walletState\"].currentLoggedInWallet \n        const currentNativeTokenName = Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"computed\"])(()=> _state_appState__WEBPACK_IMPORTED_MODULE_4__[\"AppState\"].nativeToken.label);\n        const acc= Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"computed\"])(()=>{\n            if(!wallet){\n                return null\n            }\n            let currentAccount=wallet.accounts.find(account=> account.address == p.address)\n            if (currentAccount!=undefined){\n            return currentAccount\n            }else{\n            return wallet.others.filter(accounts=>accounts.type === \"MULTISIG\").find(account=>account.address == p.address)\n            }\n        })\n        const isMultiSig = Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"computed\"])(() => {\n            if(!acc.value){\n                return false\n            }\n            let isMulti = acc.value.getDirectParentMultisig().length? true: false\n            return isMulti;\n        });  \n        let isDelegate = ()=>{\n            if(!_state_walletState__WEBPACK_IMPORTED_MODULE_2__[\"walletState\"].currentLoggedInWallet){\n                return false\n            }\n            let account = _state_walletState__WEBPACK_IMPORTED_MODULE_2__[\"walletState\"].currentLoggedInWallet.others.find(acc=>acc.address==p.address)\n            if(account){\n                return account.type==\"DELEGATE\"?true:false\n            }else{\n                return false\n            }\n        }\n        const mosaics = Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"computed\"])(() => {\n            \n            var mosaicOption = [];\n            if(!_state_walletState__WEBPACK_IMPORTED_MODULE_2__[\"walletState\"].currentLoggedInWallet){\n                return mosaicOption;\n            }\n            const account = _state_walletState__WEBPACK_IMPORTED_MODULE_2__[\"walletState\"].currentLoggedInWallet.accounts.find(\n                (element) => element.address == p.address\n            ) ||  _state_walletState__WEBPACK_IMPORTED_MODULE_2__[\"walletState\"].currentLoggedInWallet.others.find(\n                (element) => element.address == p.address)\n            if(!account){\n                return mosaicOption\n            }\n            account.assets.forEach((i) => {\n            mosaicOption.push({\n                id: i.idHex,\n                name: (i.namespaceNames.length>0?i.namespaceNames[0]:'-'),\n                balance: _util_typeHelper__WEBPACK_IMPORTED_MODULE_3__[\"Helper\"].amountFormatterSimple(i.amount,i.divisibility),\n                isCreator: acc.value? (i.owner == acc.value.publicKey? true:false):false\n            });\n            });\n            \n            return mosaicOption;\n        });\n\n        const toggleMenu = Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"ref\"])([])\n        const isHover = Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"ref\"])([])\n        for(let i = 0;i<mosaics.value.length;i++){\n            isHover.value.push(false)\n            toggleMenu.value.push(false)\n        }\n        const displayTokenName = name =>{\n            if (name=='prx.xpx'){\n                return {name:'XPX',registered:true}\n            }else if (name=='prx.metx'){\n                return {name:'METX',registered:true}\n            }else if (name=='xarcade.xar'){\n                return {name:'XAR',registered:true}\n            }else{\n                return {name:name,registered:false}\n            }\n        }\n        const splitBalance = balance=>{\n            let split = balance.split(\".\")\n            if (split[1]!=undefined){\n                return {left:split[0],right:split[1]}\n            }else{\n                return {left:split[0], right:null}\n            }\n        }\n        const explorerLink = assetId=>{ \n            if(!_state_networkState__WEBPACK_IMPORTED_MODULE_5__[\"networkState\"].currentNetworkProfile){\n                return ''\n            }\n            return _state_networkState__WEBPACK_IMPORTED_MODULE_5__[\"networkState\"].currentNetworkProfile.chainExplorer.url + '/' + _state_networkState__WEBPACK_IMPORTED_MODULE_5__[\"networkState\"].currentNetworkProfile.chainExplorer.assetInfoRoute + '/' + assetId\n        }\n        const internalInstance = Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"getCurrentInstance\"])();\n        const emitter = internalInstance.appContext.config.globalProperties.emitter;\n        emitter.on('PAGE_CLICK', () => {\n           if(isHover.value.every(value=>value==false) && toggleMenu.value.includes(true)){\n                for(let i=0;i<toggleMenu.value.length;i++){\n                    toggleMenu.value[i] = false\n                }\n            } else if(isHover.value.includes(true) && toggleMenu.value.includes(true)){\n                let hoverIndexes = []\n                let menuIndexes = []\n                isHover.value.filter((elem, index)=>{\n                    if(elem == true) {\n                        hoverIndexes.push(index);\n                    }\n                });\n                toggleMenu.value.filter((elem, index)=>{\n                    if(elem == true) {\n                        menuIndexes.push(index);\n                    }\n                });\n                if(hoverIndexes!=menuIndexes){\n                    for(let i=0;i<toggleMenu.value.length;i++){\n                        toggleMenu.value[i] = false\n                    }\n                    toggleMenu.value[hoverIndexes[0]] = true\n                }\n            } \n\n        });\n        return{\n            acc,\n            isDelegate,\n            isMultiSig,\n            mosaics,\n            displayTokenName,\n            splitBalance,\n            explorerLink,\n            currentNativeTokenName,\n            toggleMenu,\n            isHover\n        }\n    }\n});\n\n\n//# sourceURL=webpack:///./src/modules/account/views/ViewAccountAssets.vue?./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader-v16/dist??ref--0-1");

/***/ }),

/***/ "./node_modules/vue-loader-v16/dist/templateLoader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader-v16/dist/index.js?!./src/modules/account/views/ViewAccountAssets.vue?vue&type=template&id=6a47d892":
/*!***************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader-v16/dist/templateLoader.js??ref--6!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader-v16/dist??ref--0-1!./src/modules/account/views/ViewAccountAssets.vue?vue&type=template&id=6a47d892 ***!
  \***************************************************************************************************************************************************************************************************************************************************/
/*! exports provided: render */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"render\", function() { return render; });\n/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ \"./node_modules/vue/dist/vue.runtime.esm-bundler.js\");\n/* harmony import */ var _assets_img_chevron_left_svg__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/assets/img/chevron_left.svg */ \"./src/assets/img/chevron_left.svg\");\n/* harmony import */ var _assets_img_chevron_left_svg__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_assets_img_chevron_left_svg__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _modules_account_img_proximax_logo_svg__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/modules/account/img/proximax-logo.svg */ \"./src/modules/account/img/proximax-logo.svg\");\n/* harmony import */ var _modules_account_img_proximax_logo_svg__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_modules_account_img_proximax_logo_svg__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _modules_account_img_xarcade_logo_svg__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @/modules/account/img/xarcade-logo.svg */ \"./src/modules/account/img/xarcade-logo.svg\");\n/* harmony import */ var _modules_account_img_xarcade_logo_svg__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_modules_account_img_xarcade_logo_svg__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var _modules_account_img_metx_logo_svg__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @/modules/account/img/metx-logo.svg */ \"./src/modules/account/img/metx-logo.svg\");\n/* harmony import */ var _modules_account_img_metx_logo_svg__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_modules_account_img_metx_logo_svg__WEBPACK_IMPORTED_MODULE_4__);\n/* harmony import */ var _modules_dashboard_img_icon_sda_svg__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @/modules/dashboard/img/icon-sda.svg */ \"./src/modules/dashboard/img/icon-sda.svg\");\n/* harmony import */ var _modules_dashboard_img_icon_sda_svg__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_modules_dashboard_img_icon_sda_svg__WEBPACK_IMPORTED_MODULE_5__);\n/* harmony import */ var _assets_img_icon_green_tick_svg__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @/assets/img/icon-green-tick.svg */ \"./src/assets/img/icon-green-tick.svg\");\n/* harmony import */ var _assets_img_icon_green_tick_svg__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_assets_img_icon_green_tick_svg__WEBPACK_IMPORTED_MODULE_6__);\n/* harmony import */ var _assets_img_icon_red_x_svg__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @/assets/img/icon-red-x.svg */ \"./src/assets/img/icon-red-x.svg\");\n/* harmony import */ var _assets_img_icon_red_x_svg__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(_assets_img_icon_red_x_svg__WEBPACK_IMPORTED_MODULE_7__);\n/* harmony import */ var _modules_dashboard_img_icon_more_options_svg__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @/modules/dashboard/img/icon-more-options.svg */ \"./src/modules/dashboard/img/icon-more-options.svg\");\n/* harmony import */ var _modules_dashboard_img_icon_more_options_svg__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(_modules_dashboard_img_icon_more_options_svg__WEBPACK_IMPORTED_MODULE_8__);\n/* harmony import */ var _assets_img_icon_transfer_white_svg__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @/assets/img/icon-transfer-white.svg */ \"./src/assets/img/icon-transfer-white.svg\");\n/* harmony import */ var _assets_img_icon_transfer_white_svg__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(_assets_img_icon_transfer_white_svg__WEBPACK_IMPORTED_MODULE_9__);\n/* harmony import */ var _assets_img_navi_icon_swap_svg__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @/assets/img/navi/icon-swap.svg */ \"./src/assets/img/navi/icon-swap.svg\");\n/* harmony import */ var _assets_img_navi_icon_swap_svg__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(_assets_img_navi_icon_swap_svg__WEBPACK_IMPORTED_MODULE_10__);\n/* harmony import */ var _assets_img_icon_plus_svg__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @/assets/img/icon-plus.svg */ \"./src/assets/img/icon-plus.svg\");\n/* harmony import */ var _assets_img_icon_plus_svg__WEBPACK_IMPORTED_MODULE_11___default = /*#__PURE__*/__webpack_require__.n(_assets_img_icon_plus_svg__WEBPACK_IMPORTED_MODULE_11__);\n\n\n\n\n\n\n\n\n\n\n\n\n\n\nconst _hoisted_1 = { class: \"flex cursor-pointer\" }\nconst _hoisted_2 = /*#__PURE__*/Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createElementVNode\"])(\"img\", { src: _assets_img_chevron_left_svg__WEBPACK_IMPORTED_MODULE_1___default.a }, null, -1 /* HOISTED */)\nconst _hoisted_3 = /*#__PURE__*/Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createTextVNode\"])(\"Back\")\nconst _hoisted_4 = { class: \"lg:w-9/12 ml-2 mr-2 lg:ml-auto lg:mr-auto mt-5\" }\nconst _hoisted_5 = { class: \"border-2 border-t-0 px-6 py-3\" }\nconst _hoisted_6 = {\n  key: 0,\n  class: \"text-blue-primary text-xs text-center font-semibold\"\n}\nconst _hoisted_7 = {\n  key: 1,\n  class: \"text-txs w-9/12 ml-auto mr-auto text-gray-400 text-center\"\n}\nconst _hoisted_8 = {\n  key: 2,\n  class: \"grid grid-cols-7 text-gray-400 font-semibold text-xs uppercase mb-2\"\n}\nconst _hoisted_9 = /*#__PURE__*/Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createElementVNode\"])(\"div\", { class: \"col-span-2\" }, \"ID\", -1 /* HOISTED */)\nconst _hoisted_10 = /*#__PURE__*/Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createElementVNode\"])(\"div\", { class: \"col-span-2\" }, \"Namespace\", -1 /* HOISTED */)\nconst _hoisted_11 = /*#__PURE__*/Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createElementVNode\"])(\"div\", { class: \"col-span-2\" }, \"Balance\", -1 /* HOISTED */)\nconst _hoisted_12 = /*#__PURE__*/Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createElementVNode\"])(\"div\", null, \"Creator\", -1 /* HOISTED */)\nconst _hoisted_13 = [\n  _hoisted_9,\n  _hoisted_10,\n  _hoisted_11,\n  _hoisted_12\n]\nconst _hoisted_14 = { class: \"grid grid-cols-7 text-xs my-4\" }\nconst _hoisted_15 = [\"href\"]\nconst _hoisted_16 = { class: \"inline-block text-xs mt-1.5 cursor-pointer transition-all duration-200 break-all pr-7\" }\nconst _hoisted_17 = { class: \"col-span-2 break-all pr-7\" }\nconst _hoisted_18 = {\n  key: 0,\n  src: _modules_account_img_proximax_logo_svg__WEBPACK_IMPORTED_MODULE_2___default.a,\n  class: \"inline-block h-7 w-7 mr-2 border-2 rounded-3xl\"\n}\nconst _hoisted_19 = {\n  key: 1,\n  src: _modules_account_img_xarcade_logo_svg__WEBPACK_IMPORTED_MODULE_3___default.a,\n  class: \"inline-block h-7 w-7 mr-2 border-2 rounded-3xl\"\n}\nconst _hoisted_20 = {\n  key: 2,\n  src: _modules_account_img_metx_logo_svg__WEBPACK_IMPORTED_MODULE_4___default.a,\n  class: \"inline-block h-7 w-7 mr-2 border-2 rounded-3xl\"\n}\nconst _hoisted_21 = { key: 3 }\nconst _hoisted_22 = {\n  key: 4,\n  src: _modules_dashboard_img_icon_sda_svg__WEBPACK_IMPORTED_MODULE_5___default.a,\n  class: \"inline-block h-6 w-6 mr-2\"\n}\nconst _hoisted_23 = {\n  key: 5,\n  class: \"inline-block text-xs ml-2 mt-1\"\n}\nconst _hoisted_24 = {\n  key: 6,\n  class: \"inline-block text-xs ml-2 cursor-pointer mt-1\"\n}\nconst _hoisted_25 = { class: \"col-span-2 break-all pr-7\" }\nconst _hoisted_26 = { class: \"mt-1.5\" }\nconst _hoisted_27 = { class: \"mt-1.5\" }\nconst _hoisted_28 = { class: \"flex\" }\nconst _hoisted_29 = { class: \"ml-2.5\" }\nconst _hoisted_30 = {\n  key: 0,\n  src: _assets_img_icon_green_tick_svg__WEBPACK_IMPORTED_MODULE_6___default.a,\n  class: \"h-5 w-5\"\n}\nconst _hoisted_31 = {\n  key: 1,\n  src: _assets_img_icon_red_x_svg__WEBPACK_IMPORTED_MODULE_7___default.a,\n  class: \"h-5 w-5\"\n}\nconst _hoisted_32 = [\"onMouseover\", \"onMouseout\", \"onClick\"]\nconst _hoisted_33 = {\n  key: 1,\n  class: \"mt-5 pop-option inline-block w-36 absolute rounded-sm shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10 text-left lg:mr-2\"\n}\nconst _hoisted_34 = { class: \"my-2\" }\nconst _hoisted_35 = /*#__PURE__*/Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createTextVNode\"])(\"Update Metadata\")\nconst _hoisted_36 = {\n  key: 0,\n  class: \"my-2 gray-line\"\n}\nconst _hoisted_37 = { class: \"flex mt-3\" }\nconst _hoisted_38 = /*#__PURE__*/Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createElementVNode\"])(\"img\", {\n  src: _assets_img_icon_transfer_white_svg__WEBPACK_IMPORTED_MODULE_9___default.a,\n  class: \"inline-block w-4 h-4 mt-0.5 cursor-pointer mr-1\"\n}, null, -1 /* HOISTED */)\nconst _hoisted_39 = /*#__PURE__*/Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createElementVNode\"])(\"img\", {\n  src: _assets_img_navi_icon_swap_svg__WEBPACK_IMPORTED_MODULE_10___default.a,\n  class: \"h-5 w-5 pt-0.5 inline-block relative mr-1\"\n}, null, -1 /* HOISTED */)\nconst _hoisted_40 = /*#__PURE__*/Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createElementVNode\"])(\"img\", {\n  src: _assets_img_icon_plus_svg__WEBPACK_IMPORTED_MODULE_11___default.a,\n  class: \"inline-block mr-2\"\n}, null, -1 /* HOISTED */)\n\nfunction render(_ctx, _cache, $props, $setup, $data, $options) {\n  const _component_router_link = Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"resolveComponent\"])(\"router-link\")\n  const _component_AccountComponent = Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"resolveComponent\"])(\"AccountComponent\")\n  const _component_AccountTabs = Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"resolveComponent\"])(\"AccountTabs\")\n\n  return (Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"openBlock\"])(), Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createElementBlock\"])(\"div\", null, [\n    Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createElementVNode\"])(\"div\", _hoisted_1, [\n      _hoisted_2,\n      Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createVNode\"])(_component_router_link, {\n        to: {name:\"ViewDashboard\"},\n        class: \"text-blue-primary text-xs mt-0.5\"\n      }, {\n        default: Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"withCtx\"])(() => [\n          _hoisted_3\n        ]),\n        _: 1 /* STABLE */\n      })\n    ]),\n    Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createElementVNode\"])(\"div\", _hoisted_4, [\n      Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createVNode\"])(_component_AccountComponent, {\n        address: $props.address,\n        class: \"mb-10\"\n      }, null, 8 /* PROPS */, [\"address\"]),\n      Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createVNode\"])(_component_AccountTabs, {\n        address: $props.address,\n        selected: \"assets\"\n      }, null, 8 /* PROPS */, [\"address\"]),\n      Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createElementVNode\"])(\"div\", _hoisted_5, [\n        ($setup.mosaics.length==0)\n          ? (Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"openBlock\"])(), Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createElementBlock\"])(\"div\", _hoisted_6, Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"toDisplayString\"])(_ctx.$t('general.ntgToShow')), 1 /* TEXT */))\n          : Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createCommentVNode\"])(\"v-if\", true),\n        ($setup.mosaics.length==0)\n          ? (Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"openBlock\"])(), Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createElementBlock\"])(\"div\", _hoisted_7, [\n              Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createElementVNode\"])(\"span\", null, Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"toDisplayString\"])(_ctx.$t('account.noAssets')), 1 /* TEXT */)\n            ]))\n          : (Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"openBlock\"])(), Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createElementBlock\"])(\"div\", _hoisted_8, _hoisted_13)),\n        (Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"openBlock\"])(true), Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createElementBlock\"])(vue__WEBPACK_IMPORTED_MODULE_0__[\"Fragment\"], null, Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"renderList\"])($setup.mosaics, (mosaic, index) => {\n          return (Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"openBlock\"])(), Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createElementBlock\"])(\"div\", { key: index }, [\n            Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createElementVNode\"])(\"div\", _hoisted_14, [\n              Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createElementVNode\"])(\"a\", {\n                href: $setup.explorerLink(mosaic.id),\n                target: \"_new\",\n                class: \"col-span-2\"\n              }, [\n                Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createElementVNode\"])(\"div\", _hoisted_16, Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"toDisplayString\"])(mosaic.id), 1 /* TEXT */)\n              ], 8 /* PROPS */, _hoisted_15),\n              Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createElementVNode\"])(\"div\", _hoisted_17, [\n                ($setup.displayTokenName(mosaic.name).name=='XPX')\n                  ? (Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"openBlock\"])(), Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createElementBlock\"])(\"img\", _hoisted_18))\n                  : ($setup.displayTokenName(mosaic.name).name=='XAR')\n                    ? (Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"openBlock\"])(), Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createElementBlock\"])(\"img\", _hoisted_19))\n                    : ($setup.displayTokenName(mosaic.name).name=='METX')\n                      ? (Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"openBlock\"])(), Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createElementBlock\"])(\"img\", _hoisted_20))\n                      : (mosaic.name=='-')\n                        ? (Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"openBlock\"])(), Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createElementBlock\"])(\"div\", _hoisted_21))\n                        : (Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"openBlock\"])(), Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createElementBlock\"])(\"img\", _hoisted_22)),\n                ($setup.displayTokenName(mosaic.name).registered)\n                  ? (Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"openBlock\"])(), Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createElementBlock\"])(\"div\", _hoisted_23, Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"toDisplayString\"])($setup.displayTokenName(mosaic.name).name), 1 /* TEXT */))\n                  : (Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"openBlock\"])(), Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createElementBlock\"])(\"div\", _hoisted_24, Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"toDisplayString\"])(mosaic.name), 1 /* TEXT */))\n              ]),\n              Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createElementVNode\"])(\"div\", _hoisted_25, [\n                Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createElementVNode\"])(\"div\", _hoisted_26, Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"toDisplayString\"])(mosaic.balance), 1 /* TEXT */)\n              ]),\n              Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createElementVNode\"])(\"div\", _hoisted_27, [\n                Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createElementVNode\"])(\"div\", _hoisted_28, [\n                  Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createElementVNode\"])(\"div\", _hoisted_29, [\n                    (mosaic.isCreator)\n                      ? (Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"openBlock\"])(), Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createElementBlock\"])(\"img\", _hoisted_30))\n                      : (Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"openBlock\"])(), Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createElementBlock\"])(\"img\", _hoisted_31))\n                  ]),\n                  (mosaic.isCreator)\n                    ? (Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"openBlock\"])(), Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createElementBlock\"])(\"img\", {\n                        key: 0,\n                        src: _modules_dashboard_img_icon_more_options_svg__WEBPACK_IMPORTED_MODULE_8___default.a,\n                        class: \"w-4 h-4 cursor-pointer inline-block ml-2 mt-0.5\",\n                        onMouseover: $event => ($setup.isHover[index] = true),\n                        onMouseout: $event => ($setup.isHover[index] = false),\n                        onClick: $event => ($setup.toggleMenu[index]=!$setup.toggleMenu[index])\n                      }, null, 40 /* PROPS, HYDRATE_EVENTS */, _hoisted_32))\n                    : Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createCommentVNode\"])(\"v-if\", true),\n                  ($setup.toggleMenu[index]==true)\n                    ? (Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"openBlock\"])(), Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createElementBlock\"])(\"div\", _hoisted_33, [\n                        Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createElementVNode\"])(\"div\", _hoisted_34, [\n                          Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createVNode\"])(_component_router_link, {\n                            to: { name: 'ViewServicesAssetsModifySupplyChange', params: {assetId: mosaic.id, address: $props.address} },\n                            class: \"block hover:bg-gray-100 transition duration-200 p-2 z-20\"\n                          }, {\n                            default: Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"withCtx\"])(() => [\n                              Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createTextVNode\"])(Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"toDisplayString\"])(_ctx.$t('general.modifySupply')), 1 /* TEXT */)\n                            ]),\n                            _: 2 /* DYNAMIC */\n                          }, 1032 /* PROPS, DYNAMIC_SLOTS */, [\"to\"]),\n                          Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createVNode\"])(_component_router_link, {\n                            to: { name: 'ViewServicesAssetsLinkToNamespace', params: {assetId: mosaic.id, address: $props.address} },\n                            class: \"block hover:bg-gray-100 transition duration-200 p-2 z-20\"\n                          }, {\n                            default: Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"withCtx\"])(() => [\n                              Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createTextVNode\"])(Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"toDisplayString\"])(_ctx.$t('general.linkToNamespace')), 1 /* TEXT */)\n                            ]),\n                            _: 2 /* DYNAMIC */\n                          }, 1032 /* PROPS, DYNAMIC_SLOTS */, [\"to\"]),\n                          Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createVNode\"])(_component_router_link, {\n                            to: { name: 'ViewUpdateAssetMetadata', params: {targetId: mosaic.id} },\n                            class: \"block hover:bg-gray-100 transition duration-200 p-2 z-20\"\n                          }, {\n                            default: Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"withCtx\"])(() => [\n                              _hoisted_35\n                            ]),\n                            _: 2 /* DYNAMIC */\n                          }, 1032 /* PROPS, DYNAMIC_SLOTS */, [\"to\"])\n                        ])\n                      ]))\n                    : Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createCommentVNode\"])(\"v-if\", true)\n                ])\n              ])\n            ]),\n            (index != ($setup.mosaics.length - 1))\n              ? (Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"openBlock\"])(), Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createElementBlock\"])(\"div\", _hoisted_36))\n              : Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createCommentVNode\"])(\"v-if\", true)\n          ]))\n        }), 128 /* KEYED_FRAGMENT */)),\n        Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createElementVNode\"])(\"div\", _hoisted_37, [\n          Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createVNode\"])(_component_router_link, {\n            to: { name: 'ViewTransferCreate'},\n            class: \"bg-blue-primary px-5 py-2 text-gray-100 text-xs font-bold rounded-md flex items-center justify-center w-24\"\n          }, {\n            default: Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"withCtx\"])(() => [\n              _hoisted_38,\n              Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createTextVNode\"])(Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"toDisplayString\"])(_ctx.$t('general.transfer')), 1 /* TEXT */)\n            ]),\n            _: 1 /* STABLE */\n          }),\n          Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createVNode\"])(_component_router_link, {\n            to: { name: 'ViewServicesMainnetSwap'},\n            class: \"ml-3 bg-blue-primary px-5 py-2 text-gray-100 text-xs font-bold rounded-md flex items-center justify-center w-20\"\n          }, {\n            default: Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"withCtx\"])(() => [\n              _hoisted_39,\n              Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createTextVNode\"])(Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"toDisplayString\"])(_ctx.$t('general.swap')), 1 /* TEXT */)\n            ]),\n            _: 1 /* STABLE */\n          }),\n          Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createVNode\"])(_component_router_link, {\n            to: { name : 'ViewServicesAssetsCreate'},\n            class: \"ml-3 bg-blue-primary px-5 py-2 text-gray-100 text-xs font-bold rounded-md flex items-center justify-center w-44\"\n          }, {\n            default: Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"withCtx\"])(() => [\n              _hoisted_40,\n              Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createTextVNode\"])(Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"toDisplayString\"])(_ctx.$t('asset.createNewAsset')), 1 /* TEXT */)\n            ]),\n            _: 1 /* STABLE */\n          })\n        ])\n      ])\n    ])\n  ]))\n}\n\n//# sourceURL=webpack:///./src/modules/account/views/ViewAccountAssets.vue?./node_modules/vue-loader-v16/dist/templateLoader.js??ref--6!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader-v16/dist??ref--0-1");

/***/ }),

/***/ "./src/assets/img/icon-green-tick.svg":
/*!********************************************!*\
  !*** ./src/assets/img/icon-green-tick.svg ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("module.exports = __webpack_require__.p + \"assets/img/icon-green-tick.c68845ee.svg\";\n\n//# sourceURL=webpack:///./src/assets/img/icon-green-tick.svg?");

/***/ }),

/***/ "./src/assets/img/icon-red-x.svg":
/*!***************************************!*\
  !*** ./src/assets/img/icon-red-x.svg ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("module.exports = __webpack_require__.p + \"assets/img/icon-red-x.c9e7ca4c.svg\";\n\n//# sourceURL=webpack:///./src/assets/img/icon-red-x.svg?");

/***/ }),

/***/ "./src/assets/img/icon-transfer-white.svg":
/*!************************************************!*\
  !*** ./src/assets/img/icon-transfer-white.svg ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("module.exports = __webpack_require__.p + \"assets/img/icon-transfer-white.266de0db.svg\";\n\n//# sourceURL=webpack:///./src/assets/img/icon-transfer-white.svg?");

/***/ }),

/***/ "./src/modules/account/img/xarcade-logo.svg":
/*!**************************************************!*\
  !*** ./src/modules/account/img/xarcade-logo.svg ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("module.exports = __webpack_require__.p + \"assets/img/xarcade-logo.4d6c434a.svg\";\n\n//# sourceURL=webpack:///./src/modules/account/img/xarcade-logo.svg?");

/***/ }),

/***/ "./src/modules/account/views/ViewAccountAssets.vue":
/*!*********************************************************!*\
  !*** ./src/modules/account/views/ViewAccountAssets.vue ***!
  \*********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _ViewAccountAssets_vue_vue_type_template_id_6a47d892__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ViewAccountAssets.vue?vue&type=template&id=6a47d892 */ \"./src/modules/account/views/ViewAccountAssets.vue?vue&type=template&id=6a47d892\");\n/* harmony import */ var _ViewAccountAssets_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ViewAccountAssets.vue?vue&type=script&lang=js */ \"./src/modules/account/views/ViewAccountAssets.vue?vue&type=script&lang=js\");\n/* empty/unused harmony star reexport *//* harmony import */ var _home_runner_work_web_wallet_vuejs_web_wallet_vuejs_node_modules_vue_loader_v16_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./node_modules/vue-loader-v16/dist/exportHelper.js */ \"./node_modules/vue-loader-v16/dist/exportHelper.js\");\n/* harmony import */ var _home_runner_work_web_wallet_vuejs_web_wallet_vuejs_node_modules_vue_loader_v16_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_home_runner_work_web_wallet_vuejs_web_wallet_vuejs_node_modules_vue_loader_v16_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2__);\n\n\n\n\n\nconst __exports__ = /*#__PURE__*/_home_runner_work_web_wallet_vuejs_web_wallet_vuejs_node_modules_vue_loader_v16_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2___default()(_ViewAccountAssets_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"], [['render',_ViewAccountAssets_vue_vue_type_template_id_6a47d892__WEBPACK_IMPORTED_MODULE_0__[\"render\"]],['__file',\"src/modules/account/views/ViewAccountAssets.vue\"]])\n/* hot reload */\nif (false) {}\n\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (__exports__);\n\n//# sourceURL=webpack:///./src/modules/account/views/ViewAccountAssets.vue?");

/***/ }),

/***/ "./src/modules/account/views/ViewAccountAssets.vue?vue&type=script&lang=js":
/*!*********************************************************************************!*\
  !*** ./src/modules/account/views/ViewAccountAssets.vue?vue&type=script&lang=js ***!
  \*********************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_v16_dist_index_js_ref_0_1_ViewAccountAssets_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/cache-loader/dist/cjs.js??ref--0-0!../../../../node_modules/vue-loader-v16/dist??ref--0-1!./ViewAccountAssets.vue?vue&type=script&lang=js */ \"./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader-v16/dist/index.js?!./src/modules/account/views/ViewAccountAssets.vue?vue&type=script&lang=js\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return _node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_v16_dist_index_js_ref_0_1_ViewAccountAssets_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"]; });\n\n/* empty/unused harmony star reexport */ \n\n//# sourceURL=webpack:///./src/modules/account/views/ViewAccountAssets.vue?");

/***/ }),

/***/ "./src/modules/account/views/ViewAccountAssets.vue?vue&type=template&id=6a47d892":
/*!***************************************************************************************!*\
  !*** ./src/modules/account/views/ViewAccountAssets.vue?vue&type=template&id=6a47d892 ***!
  \***************************************************************************************/
/*! exports provided: render */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _node_modules_vue_loader_v16_dist_templateLoader_js_ref_6_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_v16_dist_index_js_ref_0_1_ViewAccountAssets_vue_vue_type_template_id_6a47d892__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/vue-loader-v16/dist/templateLoader.js??ref--6!../../../../node_modules/cache-loader/dist/cjs.js??ref--0-0!../../../../node_modules/vue-loader-v16/dist??ref--0-1!./ViewAccountAssets.vue?vue&type=template&id=6a47d892 */ \"./node_modules/vue-loader-v16/dist/templateLoader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader-v16/dist/index.js?!./src/modules/account/views/ViewAccountAssets.vue?vue&type=template&id=6a47d892\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"render\", function() { return _node_modules_vue_loader_v16_dist_templateLoader_js_ref_6_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_v16_dist_index_js_ref_0_1_ViewAccountAssets_vue_vue_type_template_id_6a47d892__WEBPACK_IMPORTED_MODULE_0__[\"render\"]; });\n\n\n\n//# sourceURL=webpack:///./src/modules/account/views/ViewAccountAssets.vue?");

/***/ })

}]);