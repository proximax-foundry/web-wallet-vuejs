(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[47],{

/***/ "./node_modules/cache-loader/dist/cjs.js?!./node_modules/ts-loader/index.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader-v16/dist/index.js?!./src/modules/account/views/ViewAccountNamespaces.vue?vue&type=script&setup=true&lang=ts":
/*!**************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/cache-loader/dist/cjs.js??ref--13-0!./node_modules/ts-loader??ref--13-1!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader-v16/dist??ref--0-1!./src/modules/account/views/ViewAccountNamespaces.vue?vue&type=script&setup=true&lang=ts ***!
  \**************************************************************************************************************************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ \"./node_modules/tslib/tslib.es6.js\");\n/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! vue */ \"./node_modules/vue/dist/vue.runtime.esm-bundler.js\");\n/* harmony import */ var _modules_account_components_AccountComponent_vue__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/modules/account/components/AccountComponent.vue */ \"./src/modules/account/components/AccountComponent.vue\");\n/* harmony import */ var _state_appState__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @/state/appState */ \"./src/state/appState.ts\");\n/* harmony import */ var _state_networkState__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @/state/networkState */ \"./src/state/networkState.ts\");\n/* harmony import */ var _state_walletState__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @/state/walletState */ \"./src/state/walletState.ts\");\n/* harmony import */ var tsjs_xpx_chain_sdk__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! tsjs-xpx-chain-sdk */ \"./node_modules/tsjs-xpx-chain-sdk/dist/index.js\");\n/* harmony import */ var tsjs_xpx_chain_sdk__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(tsjs_xpx_chain_sdk__WEBPACK_IMPORTED_MODULE_6__);\n\n\n\n\n\n\n\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (/*#__PURE__*/Object(vue__WEBPACK_IMPORTED_MODULE_1__[\"defineComponent\"])({\n    props: {\n        address: String\n    },\n    setup(__props, { expose }) {\n        expose();\n        const props = __props;\n        const acc = Object(vue__WEBPACK_IMPORTED_MODULE_1__[\"computed\"])(() => {\n            if (!_state_walletState__WEBPACK_IMPORTED_MODULE_5__[\"walletState\"].currentLoggedInWallet) {\n                return null;\n            }\n            let acc = _state_walletState__WEBPACK_IMPORTED_MODULE_5__[\"walletState\"].currentLoggedInWallet.accounts.find((add) => add.address == props.address) || _state_walletState__WEBPACK_IMPORTED_MODULE_5__[\"walletState\"].currentLoggedInWallet.others.find((add) => add.address == props.address);\n            if (!acc) {\n                return null;\n            }\n            return acc;\n        });\n        const isDelegate = () => {\n            if (!_state_walletState__WEBPACK_IMPORTED_MODULE_5__[\"walletState\"].currentLoggedInWallet) {\n                return false;\n            }\n            let account = _state_walletState__WEBPACK_IMPORTED_MODULE_5__[\"walletState\"].currentLoggedInWallet.others.find(acc => acc.address == props.address);\n            if (account) {\n                return account.type == \"DELEGATE\" ? true : false;\n            }\n            else {\n                return false;\n            }\n        };\n        const isMultiSig = Object(vue__WEBPACK_IMPORTED_MODULE_1__[\"computed\"])(() => {\n            if (!acc.value) {\n                return false;\n            }\n            let isMulti = acc.value.getDirectParentMultisig().length ? true : false;\n            return isMulti;\n        });\n        const toggleMenu = Object(vue__WEBPACK_IMPORTED_MODULE_1__[\"ref\"])([]);\n        const isHover = Object(vue__WEBPACK_IMPORTED_MODULE_1__[\"ref\"])([]);\n        const namespaces = Object(vue__WEBPACK_IMPORTED_MODULE_1__[\"ref\"])([]);\n        const getNamespaceInfo = () => {\n            acc.value.namespaces.forEach(namespace => {\n                namespaces.value.push({\n                    name: namespace.name,\n                    id: namespace.idHex,\n                    linkType: namespace.linkType,\n                    linkedAssetAddress: namespace.linkedId != '' ? namespace.linkType == 2 ? tsjs_xpx_chain_sdk__WEBPACK_IMPORTED_MODULE_6__[\"Address\"].createFromRawAddress(namespace.linkedId).pretty() : namespace.linkedId : '-',\n                    expiringBlock: namespace.endHeight,\n                    isActive: namespace.active\n                });\n            });\n        };\n        const init = () => Object(tslib__WEBPACK_IMPORTED_MODULE_0__[\"__awaiter\"])(this, void 0, void 0, function* () {\n            yield getNamespaceInfo();\n            for (let i = 0; i < namespaces.value.length; i++) {\n                isHover.value.push(false);\n                toggleMenu.value.push(false);\n            }\n        });\n        if (_state_appState__WEBPACK_IMPORTED_MODULE_3__[\"AppState\"].isReady) {\n            init();\n        }\n        else {\n            let readyWatcher = Object(vue__WEBPACK_IMPORTED_MODULE_1__[\"watch\"])(_state_appState__WEBPACK_IMPORTED_MODULE_3__[\"AppState\"], (value) => {\n                if (value.isReady) {\n                    init();\n                    readyWatcher();\n                }\n            });\n        }\n        const internalInstance = Object(vue__WEBPACK_IMPORTED_MODULE_1__[\"getCurrentInstance\"])();\n        const emitter = internalInstance.appContext.config.globalProperties.emitter;\n        const explorerLink = namespaceId => {\n            if (!_state_networkState__WEBPACK_IMPORTED_MODULE_4__[\"networkState\"].currentNetworkProfile) {\n                return '';\n            }\n            return _state_networkState__WEBPACK_IMPORTED_MODULE_4__[\"networkState\"].currentNetworkProfile.chainExplorer.url + '/' + _state_networkState__WEBPACK_IMPORTED_MODULE_4__[\"networkState\"].currentNetworkProfile.chainExplorer.namespaceInfoRoute + '/' + namespaceId;\n        };\n        emitter.on('PAGE_CLICK', () => {\n            if (isHover.value.every(value => value == false) && toggleMenu.value.includes(true)) {\n                for (let i = 0; i < toggleMenu.value.length; i++) {\n                    toggleMenu.value[i] = false;\n                }\n            }\n            else if (isHover.value.includes(true) && toggleMenu.value.includes(true)) {\n                let hoverIndexes = [];\n                let menuIndexes = [];\n                isHover.value.filter((elem, index) => {\n                    if (elem == true) {\n                        hoverIndexes.push(index);\n                    }\n                });\n                toggleMenu.value.filter((elem, index) => {\n                    if (elem == true) {\n                        menuIndexes.push(index);\n                    }\n                });\n                if (hoverIndexes != menuIndexes) {\n                    for (let i = 0; i < toggleMenu.value.length; i++) {\n                        toggleMenu.value[i] = false;\n                    }\n                    toggleMenu.value[hoverIndexes[0]] = true;\n                }\n            }\n        });\n        const __returned__ = { props, acc, isDelegate, isMultiSig, toggleMenu, isHover, namespaces, getNamespaceInfo, init, internalInstance, emitter, explorerLink, AccountComponent: _modules_account_components_AccountComponent_vue__WEBPACK_IMPORTED_MODULE_2__[\"default\"] };\n        Object.defineProperty(__returned__, '__isScriptSetup', { enumerable: false, value: true });\n        return __returned__;\n    }\n}));\n\n\n//# sourceURL=webpack:///./src/modules/account/views/ViewAccountNamespaces.vue?./node_modules/cache-loader/dist/cjs.js??ref--13-0!./node_modules/ts-loader??ref--13-1!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader-v16/dist??ref--0-1");

/***/ }),

/***/ "./node_modules/cache-loader/dist/cjs.js?!./node_modules/ts-loader/index.js?!./node_modules/vue-loader-v16/dist/templateLoader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader-v16/dist/index.js?!./src/modules/account/views/ViewAccountNamespaces.vue?vue&type=template&id=de64f3a8&ts=true":
/*!******************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/cache-loader/dist/cjs.js??ref--13-0!./node_modules/ts-loader??ref--13-1!./node_modules/vue-loader-v16/dist/templateLoader.js??ref--6!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader-v16/dist??ref--0-1!./src/modules/account/views/ViewAccountNamespaces.vue?vue&type=template&id=de64f3a8&ts=true ***!
  \******************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! exports provided: render */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"render\", function() { return render; });\n/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ \"./node_modules/vue/dist/vue.runtime.esm-bundler.js\");\n/* harmony import */ var _assets_img_chevron_left_svg__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/assets/img/chevron_left.svg */ \"./src/assets/img/chevron_left.svg\");\n/* harmony import */ var _assets_img_chevron_left_svg__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_assets_img_chevron_left_svg__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _assets_img_icon_green_tick_svg__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/assets/img/icon-green-tick.svg */ \"./src/assets/img/icon-green-tick.svg\");\n/* harmony import */ var _assets_img_icon_green_tick_svg__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_assets_img_icon_green_tick_svg__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _assets_img_icon_red_x_svg__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @/assets/img/icon-red-x.svg */ \"./src/assets/img/icon-red-x.svg\");\n/* harmony import */ var _assets_img_icon_red_x_svg__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_assets_img_icon_red_x_svg__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var _modules_dashboard_img_icon_more_options_svg__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @/modules/dashboard/img/icon-more-options.svg */ \"./src/modules/dashboard/img/icon-more-options.svg\");\n/* harmony import */ var _modules_dashboard_img_icon_more_options_svg__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_modules_dashboard_img_icon_more_options_svg__WEBPACK_IMPORTED_MODULE_4__);\n/* harmony import */ var _assets_img_icon_plus_svg__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @/assets/img/icon-plus.svg */ \"./src/assets/img/icon-plus.svg\");\n/* harmony import */ var _assets_img_icon_plus_svg__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_assets_img_icon_plus_svg__WEBPACK_IMPORTED_MODULE_5__);\n\n\n\n\n\n\nconst _hoisted_1 = { class: \"flex cursor-pointer\" };\nconst _hoisted_2 = /*#__PURE__*/ Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createElementVNode\"])(\"img\", { src: _assets_img_chevron_left_svg__WEBPACK_IMPORTED_MODULE_1___default.a }, null, -1 /* HOISTED */);\nconst _hoisted_3 = /*#__PURE__*/ Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createTextVNode\"])(\"Back\");\nconst _hoisted_4 = { class: \"lg:w-9/12 ml-2 mr-2 lg:ml-auto lg:mr-auto mt-5\" };\nconst _hoisted_5 = { class: \"flex text-xs font-semibold border-b-2 menu_title_div\" };\nconst _hoisted_6 = { class: \"w-24 text-center border-b-2 pb-3 border-yellow-500\" };\nconst _hoisted_7 = /*#__PURE__*/ Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createTextVNode\"])(\"Metadata\");\nconst _hoisted_8 = { class: \"border-2 border-t-0 filter shadow-lg px-6 py-3\" };\nconst _hoisted_9 = {\n    key: 0,\n    class: \"text-blue-primary text-xs text-center font-semibold\"\n};\nconst _hoisted_10 = {\n    key: 1,\n    class: \"text-txs w-9/12 ml-auto mr-auto text-gray-400 text-center\"\n};\nconst _hoisted_11 = /*#__PURE__*/ Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createElementVNode\"])(\"span\", null, \"You do not own any namespaces.\", -1 /* HOISTED */);\nconst _hoisted_12 = [\n    _hoisted_11\n];\nconst _hoisted_13 = {\n    key: 2,\n    class: \"grid grid-cols-9 text-gray-400 font-semibold text-xs uppercase mb-2\"\n};\nconst _hoisted_14 = /*#__PURE__*/ Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createElementVNode\"])(\"div\", { class: \"col-span-2\" }, \"NAME\", -1 /* HOISTED */);\nconst _hoisted_15 = /*#__PURE__*/ Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createElementVNode\"])(\"div\", { class: \"col-span-2\" }, \"ID\", -1 /* HOISTED */);\nconst _hoisted_16 = /*#__PURE__*/ Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createElementVNode\"])(\"div\", { class: \"col-span-3\" }, \"LINKED\", -1 /* HOISTED */);\nconst _hoisted_17 = /*#__PURE__*/ Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createElementVNode\"])(\"div\", null, \"EXPIRY\", -1 /* HOISTED */);\nconst _hoisted_18 = /*#__PURE__*/ Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createElementVNode\"])(\"div\", null, \"ACTIVE\", -1 /* HOISTED */);\nconst _hoisted_19 = [\n    _hoisted_14,\n    _hoisted_15,\n    _hoisted_16,\n    _hoisted_17,\n    _hoisted_18\n];\nconst _hoisted_20 = { class: \"grid grid-cols-9 text-xs my-4\" };\nconst _hoisted_21 = { class: \"col-span-2 break-all pr-7\" };\nconst _hoisted_22 = [\"href\"];\nconst _hoisted_23 = { class: \"col-span-3 break-all pr-7\" };\nconst _hoisted_24 = { class: \"break-all pr-7\" };\nconst _hoisted_25 = { class: \"flex\" };\nconst _hoisted_26 = {\n    key: 0,\n    src: _assets_img_icon_green_tick_svg__WEBPACK_IMPORTED_MODULE_2___default.a,\n    class: \"h-5 w-5 ml-1\"\n};\nconst _hoisted_27 = {\n    key: 1,\n    src: _assets_img_icon_red_x_svg__WEBPACK_IMPORTED_MODULE_3___default.a,\n    class: \"h-5 w-5 ml-1\"\n};\nconst _hoisted_28 = [\"onMouseover\", \"onMouseout\", \"onClick\"];\nconst _hoisted_29 = {\n    key: 1,\n    class: \"mt-5 pop-option inline-block w-32 absolute rounded-sm shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10 text-left lg:mr-2\"\n};\nconst _hoisted_30 = { class: \"my-2\" };\nconst _hoisted_31 = /*#__PURE__*/ Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createTextVNode\"])(\"Update Metadata\");\nconst _hoisted_32 = {\n    key: 0,\n    class: \"my-2 gray-line\"\n};\nconst _hoisted_33 = /*#__PURE__*/ Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createElementVNode\"])(\"img\", {\n    src: _assets_img_icon_plus_svg__WEBPACK_IMPORTED_MODULE_5___default.a,\n    class: \"inline-block mr-2\"\n}, null, -1 /* HOISTED */);\nfunction render(_ctx, _cache, $props, $setup, $data, $options) {\n    const _component_router_link = Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"resolveComponent\"])(\"router-link\");\n    return (Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"openBlock\"])(), Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createElementBlock\"])(\"div\", null, [\n        Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createElementVNode\"])(\"div\", _hoisted_1, [\n            _hoisted_2,\n            Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createVNode\"])(_component_router_link, {\n                to: { name: \"ViewDashboard\" },\n                class: \"text-blue-primary text-xs mt-0.5\"\n            }, {\n                default: Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"withCtx\"])(() => [\n                    _hoisted_3\n                ]),\n                _: 1 /* STABLE */\n            })\n        ]),\n        Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createElementVNode\"])(\"div\", _hoisted_4, [\n            Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createVNode\"])($setup[\"AccountComponent\"], {\n                address: $props.address,\n                class: \"mb-10\"\n            }, null, 8 /* PROPS */, [\"address\"]),\n            Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createElementVNode\"])(\"div\", _hoisted_5, [\n                Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createVNode\"])(_component_router_link, {\n                    to: { name: 'ViewAccountDetails', params: { address: $props.address } },\n                    class: \"w-32 text-center\"\n                }, {\n                    default: Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"withCtx\"])(() => [\n                        Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createTextVNode\"])(Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"toDisplayString\"])(_ctx.$t('account.accountDetails')), 1 /* TEXT */)\n                    ]),\n                    _: 1 /* STABLE */\n                }, 8 /* PROPS */, [\"to\"]),\n                (!$setup.isDelegate())\n                    ? (Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"openBlock\"])(), Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createBlock\"])(_component_router_link, {\n                        key: 0,\n                        to: { name: 'ViewAccountAssets', params: { address: $props.address } },\n                        class: \"w-18 text-center\"\n                    }, {\n                        default: Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"withCtx\"])(() => [\n                            Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createTextVNode\"])(Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"toDisplayString\"])(_ctx.$t('general.asset', 2)), 1 /* TEXT */)\n                        ]),\n                        _: 1 /* STABLE */\n                    }, 8 /* PROPS */, [\"to\"]))\n                    : Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createCommentVNode\"])(\"v-if\", true),\n                Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createElementVNode\"])(\"div\", _hoisted_6, Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"toDisplayString\"])(_ctx.$t('general.namespace', 2)), 1 /* TEXT */),\n                (!$setup.isDelegate())\n                    ? (Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"openBlock\"])(), Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createBlock\"])(_component_router_link, {\n                        key: 1,\n                        to: { name: 'ViewMetadata', params: { address: $props.address } },\n                        class: \"w-18 text-center\"\n                    }, {\n                        default: Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"withCtx\"])(() => [\n                            _hoisted_7\n                        ]),\n                        _: 1 /* STABLE */\n                    }, 8 /* PROPS */, [\"to\"]))\n                    : Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createCommentVNode\"])(\"v-if\", true),\n                (!$setup.isDelegate())\n                    ? (Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"openBlock\"])(), Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createBlock\"])(_component_router_link, {\n                        key: 2,\n                        to: { name: 'ViewMultisigHome', params: { address: $props.address } },\n                        class: \"w-18 text-center\"\n                    }, {\n                        default: Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"withCtx\"])(() => [\n                            Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createTextVNode\"])(Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"toDisplayString\"])(_ctx.$t('general.multisig')), 1 /* TEXT */)\n                        ]),\n                        _: 1 /* STABLE */\n                    }, 8 /* PROPS */, [\"to\"]))\n                    : Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createCommentVNode\"])(\"v-if\", true)\n            ]),\n            Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createElementVNode\"])(\"div\", _hoisted_8, [\n                ($setup.namespaces.length == 0)\n                    ? (Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"openBlock\"])(), Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createElementBlock\"])(\"div\", _hoisted_9, Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"toDisplayString\"])(_ctx.$t('general.ntgToShow')), 1 /* TEXT */))\n                    : Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createCommentVNode\"])(\"v-if\", true),\n                ($setup.namespaces.length == 0)\n                    ? (Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"openBlock\"])(), Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createElementBlock\"])(\"div\", _hoisted_10, _hoisted_12))\n                    : (Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"openBlock\"])(), Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createElementBlock\"])(\"div\", _hoisted_13, _hoisted_19)),\n                (Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"openBlock\"])(true), Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createElementBlock\"])(vue__WEBPACK_IMPORTED_MODULE_0__[\"Fragment\"], null, Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"renderList\"])($setup.namespaces, (namespace, index) => {\n                    return (Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"openBlock\"])(), Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createElementBlock\"])(\"div\", { key: index }, [\n                        Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createElementVNode\"])(\"div\", _hoisted_20, [\n                            Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createElementVNode\"])(\"div\", _hoisted_21, Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"toDisplayString\"])(namespace.name), 1 /* TEXT */),\n                            Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createElementVNode\"])(\"a\", {\n                                href: $setup.explorerLink(namespace.id),\n                                class: \"col-span-2 break-all pr-7\",\n                                target: \"_new\"\n                            }, [\n                                Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createElementVNode\"])(\"div\", null, Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"toDisplayString\"])(namespace.id), 1 /* TEXT */)\n                            ], 8 /* PROPS */, _hoisted_22),\n                            Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createElementVNode\"])(\"div\", _hoisted_23, Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"toDisplayString\"])(namespace.linkedAssetAddress), 1 /* TEXT */),\n                            Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createElementVNode\"])(\"div\", _hoisted_24, Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"toDisplayString\"])(namespace.expiringBlock), 1 /* TEXT */),\n                            Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createElementVNode\"])(\"div\", _hoisted_25, [\n                                Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createElementVNode\"])(\"div\", null, [\n                                    (namespace.isActive)\n                                        ? (Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"openBlock\"])(), Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createElementBlock\"])(\"img\", _hoisted_26))\n                                        : (Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"openBlock\"])(), Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createElementBlock\"])(\"img\", _hoisted_27))\n                                ]),\n                                (namespace.isActive)\n                                    ? (Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"openBlock\"])(), Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createElementBlock\"])(\"img\", {\n                                        key: 0,\n                                        src: _modules_dashboard_img_icon_more_options_svg__WEBPACK_IMPORTED_MODULE_4___default.a,\n                                        class: \"w-4 h-4 cursor-pointer inline-block ml-2 mt-0.5\",\n                                        onMouseover: ($event) => ($setup.isHover[index] = true),\n                                        onMouseout: ($event) => ($setup.isHover[index] = false),\n                                        onClick: ($event) => ($setup.toggleMenu[index] = !$setup.toggleMenu[index])\n                                    }, null, 40 /* PROPS, HYDRATE_EVENTS */, _hoisted_28))\n                                    : Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createCommentVNode\"])(\"v-if\", true),\n                                ($setup.toggleMenu[index] == true)\n                                    ? (Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"openBlock\"])(), Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createElementBlock\"])(\"div\", _hoisted_29, [\n                                        Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createElementVNode\"])(\"div\", _hoisted_30, [\n                                            Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createVNode\"])(_component_router_link, {\n                                                to: { name: 'ViewServicesNamespaceExtend', params: { address: $props.address, namespaceId: namespace.id } },\n                                                class: \"block hover:bg-gray-100 transition duration-200 p-2 z-20\"\n                                            }, {\n                                                default: Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"withCtx\"])(() => [\n                                                    Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createTextVNode\"])(Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"toDisplayString\"])(_ctx.$t('general.extendDuration')), 1 /* TEXT */)\n                                                ]),\n                                                _: 2 /* DYNAMIC */\n                                            }, 1032 /* PROPS, DYNAMIC_SLOTS */, [\"to\"]),\n                                            Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createVNode\"])(_component_router_link, {\n                                                to: { name: 'ViewUpdateNamespaceMetadata', params: { targetId: namespace.id } },\n                                                class: \"block hover:bg-gray-100 transition duration-200 p-2 z-20\"\n                                            }, {\n                                                default: Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"withCtx\"])(() => [\n                                                    _hoisted_31\n                                                ]),\n                                                _: 2 /* DYNAMIC */\n                                            }, 1032 /* PROPS, DYNAMIC_SLOTS */, [\"to\"])\n                                        ])\n                                    ]))\n                                    : Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createCommentVNode\"])(\"v-if\", true)\n                            ])\n                        ]),\n                        (index != ($setup.namespaces.length - 1))\n                            ? (Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"openBlock\"])(), Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createElementBlock\"])(\"div\", _hoisted_32))\n                            : Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createCommentVNode\"])(\"v-if\", true)\n                    ]));\n                }), 128 /* KEYED_FRAGMENT */)),\n                Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createVNode\"])(_component_router_link, {\n                    to: { name: 'ViewServicesNamespaceCreate' },\n                    class: \"bg-blue-primary py-3 text-gray-100 text-xs font-bold rounded-md flex items-center justify-center w-52\"\n                }, {\n                    default: Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"withCtx\"])(() => [\n                        _hoisted_33,\n                        Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createTextVNode\"])(Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"toDisplayString\"])(_ctx.$t('namespace.registerNewNamespace')), 1 /* TEXT */)\n                    ]),\n                    _: 1 /* STABLE */\n                })\n            ])\n        ])\n    ]));\n}\n\n\n//# sourceURL=webpack:///./src/modules/account/views/ViewAccountNamespaces.vue?./node_modules/cache-loader/dist/cjs.js??ref--13-0!./node_modules/ts-loader??ref--13-1!./node_modules/vue-loader-v16/dist/templateLoader.js??ref--6!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader-v16/dist??ref--0-1");

/***/ }),

/***/ "./src/modules/account/views/ViewAccountNamespaces.vue":
/*!*************************************************************!*\
  !*** ./src/modules/account/views/ViewAccountNamespaces.vue ***!
  \*************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _ViewAccountNamespaces_vue_vue_type_template_id_de64f3a8_ts_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ViewAccountNamespaces.vue?vue&type=template&id=de64f3a8&ts=true */ \"./src/modules/account/views/ViewAccountNamespaces.vue?vue&type=template&id=de64f3a8&ts=true\");\n/* harmony import */ var _ViewAccountNamespaces_vue_vue_type_script_setup_true_lang_ts__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ViewAccountNamespaces.vue?vue&type=script&setup=true&lang=ts */ \"./src/modules/account/views/ViewAccountNamespaces.vue?vue&type=script&setup=true&lang=ts\");\n/* empty/unused harmony star reexport *//* harmony import */ var _home_runner_work_web_wallet_vuejs_web_wallet_vuejs_node_modules_vue_loader_v16_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./node_modules/vue-loader-v16/dist/exportHelper.js */ \"./node_modules/vue-loader-v16/dist/exportHelper.js\");\n/* harmony import */ var _home_runner_work_web_wallet_vuejs_web_wallet_vuejs_node_modules_vue_loader_v16_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_home_runner_work_web_wallet_vuejs_web_wallet_vuejs_node_modules_vue_loader_v16_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2__);\n\n\n\n\n\nconst __exports__ = /*#__PURE__*/_home_runner_work_web_wallet_vuejs_web_wallet_vuejs_node_modules_vue_loader_v16_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2___default()(_ViewAccountNamespaces_vue_vue_type_script_setup_true_lang_ts__WEBPACK_IMPORTED_MODULE_1__[\"default\"], [['render',_ViewAccountNamespaces_vue_vue_type_template_id_de64f3a8_ts_true__WEBPACK_IMPORTED_MODULE_0__[\"render\"]],['__file',\"src/modules/account/views/ViewAccountNamespaces.vue\"]])\n/* hot reload */\nif (false) {}\n\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (__exports__);\n\n//# sourceURL=webpack:///./src/modules/account/views/ViewAccountNamespaces.vue?");

/***/ }),

/***/ "./src/modules/account/views/ViewAccountNamespaces.vue?vue&type=script&setup=true&lang=ts":
/*!************************************************************************************************!*\
  !*** ./src/modules/account/views/ViewAccountNamespaces.vue?vue&type=script&setup=true&lang=ts ***!
  \************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _node_modules_cache_loader_dist_cjs_js_ref_13_0_node_modules_ts_loader_index_js_ref_13_1_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_v16_dist_index_js_ref_0_1_ViewAccountNamespaces_vue_vue_type_script_setup_true_lang_ts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/cache-loader/dist/cjs.js??ref--13-0!../../../../node_modules/ts-loader??ref--13-1!../../../../node_modules/cache-loader/dist/cjs.js??ref--0-0!../../../../node_modules/vue-loader-v16/dist??ref--0-1!./ViewAccountNamespaces.vue?vue&type=script&setup=true&lang=ts */ \"./node_modules/cache-loader/dist/cjs.js?!./node_modules/ts-loader/index.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader-v16/dist/index.js?!./src/modules/account/views/ViewAccountNamespaces.vue?vue&type=script&setup=true&lang=ts\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return _node_modules_cache_loader_dist_cjs_js_ref_13_0_node_modules_ts_loader_index_js_ref_13_1_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_v16_dist_index_js_ref_0_1_ViewAccountNamespaces_vue_vue_type_script_setup_true_lang_ts__WEBPACK_IMPORTED_MODULE_0__[\"default\"]; });\n\n/* empty/unused harmony star reexport */ \n\n//# sourceURL=webpack:///./src/modules/account/views/ViewAccountNamespaces.vue?");

/***/ }),

/***/ "./src/modules/account/views/ViewAccountNamespaces.vue?vue&type=template&id=de64f3a8&ts=true":
/*!***************************************************************************************************!*\
  !*** ./src/modules/account/views/ViewAccountNamespaces.vue?vue&type=template&id=de64f3a8&ts=true ***!
  \***************************************************************************************************/
/*! exports provided: render */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _node_modules_cache_loader_dist_cjs_js_ref_13_0_node_modules_ts_loader_index_js_ref_13_1_node_modules_vue_loader_v16_dist_templateLoader_js_ref_6_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_v16_dist_index_js_ref_0_1_ViewAccountNamespaces_vue_vue_type_template_id_de64f3a8_ts_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/cache-loader/dist/cjs.js??ref--13-0!../../../../node_modules/ts-loader??ref--13-1!../../../../node_modules/vue-loader-v16/dist/templateLoader.js??ref--6!../../../../node_modules/cache-loader/dist/cjs.js??ref--0-0!../../../../node_modules/vue-loader-v16/dist??ref--0-1!./ViewAccountNamespaces.vue?vue&type=template&id=de64f3a8&ts=true */ \"./node_modules/cache-loader/dist/cjs.js?!./node_modules/ts-loader/index.js?!./node_modules/vue-loader-v16/dist/templateLoader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader-v16/dist/index.js?!./src/modules/account/views/ViewAccountNamespaces.vue?vue&type=template&id=de64f3a8&ts=true\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"render\", function() { return _node_modules_cache_loader_dist_cjs_js_ref_13_0_node_modules_ts_loader_index_js_ref_13_1_node_modules_vue_loader_v16_dist_templateLoader_js_ref_6_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_v16_dist_index_js_ref_0_1_ViewAccountNamespaces_vue_vue_type_template_id_de64f3a8_ts_true__WEBPACK_IMPORTED_MODULE_0__[\"render\"]; });\n\n\n\n//# sourceURL=webpack:///./src/modules/account/views/ViewAccountNamespaces.vue?");

/***/ })

}]);