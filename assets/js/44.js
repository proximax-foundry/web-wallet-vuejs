(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[44],{

/***/ "./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader-v16/dist/index.js?!./src/modules/account/views/ViewAccountDisplayAll.vue?vue&type=script&lang=js":
/*!************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader-v16/dist??ref--0-1!./src/modules/account/views/ViewAccountDisplayAll.vue?vue&type=script&lang=js ***!
  \************************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ \"./node_modules/vue/dist/vue.runtime.esm-bundler.js\");\n/* harmony import */ var _modules_account_components_AccountTile_vue__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/modules/account/components/AccountTile.vue */ \"./src/modules/account/components/AccountTile.vue\");\n/* harmony import */ var _state_walletState__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/state/walletState */ \"./src/state/walletState.ts\");\n/* harmony import */ var _state_appState__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @/state/appState */ \"./src/state/appState.ts\");\n\n\n\n\n\n\n/* harmony default export */ __webpack_exports__[\"default\"] = ({\n  name:\"ViewAccountDisplayAll\",\n  components: {\n    AccountTile: _modules_account_components_AccountTile_vue__WEBPACK_IMPORTED_MODULE_1__[\"default\"],\n  },\n\n  setup() {\n    const totalAcc = Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"computed\"])(()=>{\n\n      if(!_state_walletState__WEBPACK_IMPORTED_MODULE_2__[\"walletState\"].currentLoggedInWallet){\n        return [];\n      }\n      let accounts = _state_walletState__WEBPACK_IMPORTED_MODULE_2__[\"walletState\"].currentLoggedInWallet.accounts.map(\n        (acc)=>{ \n          return { \n            name: acc.name,\n            balance: acc.balance,\n            address: acc.address,\n            publicKey: acc.publicKey,\n            isMultisig: acc.getDirectParentMultisig().length ? true: false,\n            multisigInfo: acc.multisigInfo,\n          }; \n        });\n        \n       \n       let otherAccounts =_state_walletState__WEBPACK_IMPORTED_MODULE_2__[\"walletState\"].currentLoggedInWallet.others.filter((acc)=> acc.type === \"MULTISIG\").map(\n        (acc)=>{ \n          return { \n            name: acc.name,\n            balance: acc.balance,\n            address: acc.address,\n            publicKey: acc.publicKey,\n            isMultisig: true,\n            multisigInfo: acc.multisigInfo,\n          }; \n        });\n\n        return accounts.concat(otherAccounts);\n      \n    });\n\n    const isCosigner = (publicKey)=>{\n      let account = totalAcc.value\n  \n      let verify = false;\n    \n      let tempArr = account.find(acc=>acc.publicKey==publicKey).multisigInfo.filter(account=>account.level == -1)\n      verify = tempArr.length>0 ? true: false\n      \n      return Boolean(verify);\n    }\n\n    const cosignInWallet = publicKey=>{\n      let acc = _state_walletState__WEBPACK_IMPORTED_MODULE_2__[\"walletState\"].currentLoggedInWallet.accounts.find(acc=>acc.publicKey==publicKey)? _state_walletState__WEBPACK_IMPORTED_MODULE_2__[\"walletState\"].currentLoggedInWallet.accounts.find(acc=>acc.publicKey==publicKey) : _state_walletState__WEBPACK_IMPORTED_MODULE_2__[\"walletState\"].currentLoggedInWallet.others.find(acc=>acc.publicKey==publicKey)\n      let cosignerList = acc.getDirectParentMultisig()\n      let cosignerNum = acc.getDirectParentMultisig().length\n      let found = false\n      for(let i=0; i<cosignerNum;i++){\n        if(totalAcc.value.find(acc=>acc.publicKey==cosignerList[i])!= undefined){\n          found= true\n          break;\n        }else{\n          continue;\n        }\n      }\n      return found\n    }\n    \n\n    \n    const accountStructure = Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"computed\"])(()=>{\n      if(!_state_walletState__WEBPACK_IMPORTED_MODULE_2__[\"walletState\"].currentLoggedInWallet){\n        return []\n      }\n      let accountStructure = {normalAcc:[],multisig:[]}\n      \n      totalAcc.value.forEach(account=>{\n        if(account.multisigInfo.find(multisigAcc=>multisigAcc.level==-1)==undefined && account.multisigInfo.find(multisigAcc=>multisigAcc.level==1)==undefined){\n          accountStructure.normalAcc.push(account.publicKey)\n        }\n      }) //add normal accounts into accountStructure(No cosigners nor multisig)\n    \n      let delegateAccounts = _state_walletState__WEBPACK_IMPORTED_MODULE_2__[\"walletState\"].currentLoggedInWallet.others.filter(account=>account.type==\"DELEGATE\")\n      delegateAccounts.forEach(delegateAcc=>{\n        accountStructure.normalAcc.push(delegateAcc.publicKey)\n      })//add delegate accounts into accountStructure\n      \n      totalAcc.value.forEach(acc=>{\n        if(isCosigner(acc.publicKey) &&acc.isMultisig&& !cosignInWallet(acc.publicKey)){ //cosigner account which its cosigner is not in wallet\n          let children = acc.multisigInfo.filter(multisig=>multisig.level==-1)//filter direct child\n          let childObject = []\n          \n          children.forEach(child=>{//each direct child\n            let grandchildAddresses = child.getMultisigAccountsAddress(_state_appState__WEBPACK_IMPORTED_MODULE_3__[\"AppState\"].networkType)// find each child's childen\n            let grandChildObject = [] \n            grandchildAddresses.forEach(address=>{//for each grandchild\n              let acc = totalAcc.value.find(account=>account.address==address)\n              if(acc!= undefined){\n                grandChildObject.push(acc.publicKey)//get grandchild\n              }\n            })\n            childObject.push({publicKey:child.publicKey,cosignOf:grandChildObject})//push grandchild into child\n          })\n          accountStructure.multisig.push({publicKey:acc.publicKey,cosignOf:childObject})//push child into parent\n        }else if(isCosigner(acc.publicKey)&& !acc.isMultisig){//top level cosigner\n          let children = acc.multisigInfo.filter(multisig=>multisig.level==-1)//filter direct child\n          let childObject = []\n          \n          children.forEach(child=>{//each direct child\n            let grandchildAddresses = child.getMultisigAccountsAddress(_state_appState__WEBPACK_IMPORTED_MODULE_3__[\"AppState\"].networkType)// find each child's childen\n            let grandChildObject = [] \n            grandchildAddresses.forEach(address=>{//for each child's children\n              let acc = totalAcc.value.find(account=>account.address==address)\n              let greatGrandChildObject = []\n              if(acc!=undefined){\n                let greatGrandChild = acc.multisigInfo.filter(multisig=>multisig.level==-1)\n                greatGrandChild.forEach(multisig=>{//for each grandchild's children\n                  let acc = totalAcc.value.find(account=>account.publicKey==multisig.publicKey)\n                  if(acc!=undefined){\n                    greatGrandChildObject.push(acc.publicKey)//get great grandchild\n                  }\n                })\n                grandChildObject.push({publicKey:acc.publicKey,cosignOf:greatGrandChildObject}) //push great grandchild into grandchild\n              }\n            })\n            childObject.push({publicKey:child.publicKey,cosignOf:grandChildObject})//push grandchild into child\n          })\n          accountStructure.multisig.push({publicKey:acc.publicKey,cosignOf:childObject})//push child into parent\n        }else{//multisig accounts that are in middle or bottom levels\n          //do nothing\n        }\n      })\n      return accountStructure\n    },{deep:true})\n\n    console.log(accountStructure.value)\n\n    const accounts = Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"computed\"])(\n      () => {\n        if(_state_walletState__WEBPACK_IMPORTED_MODULE_2__[\"walletState\"].currentLoggedInWallet){\n          if(_state_walletState__WEBPACK_IMPORTED_MODULE_2__[\"walletState\"].currentLoggedInWallet.others){\n            const concatOther = _state_walletState__WEBPACK_IMPORTED_MODULE_2__[\"walletState\"].currentLoggedInWallet.accounts.concat(_state_walletState__WEBPACK_IMPORTED_MODULE_2__[\"walletState\"].currentLoggedInWallet.others)\n            return concatOther;\n          } else{\n            return _state_walletState__WEBPACK_IMPORTED_MODULE_2__[\"walletState\"].currentLoggedInWallet.accounts;\n          }\n        } else{\n          return null;\n        }\n      }\n    );\n\n    return {\n      accounts,\n    };\n  },\n});\n\n\n//# sourceURL=webpack:///./src/modules/account/views/ViewAccountDisplayAll.vue?./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader-v16/dist??ref--0-1");

/***/ }),

/***/ "./node_modules/vue-loader-v16/dist/templateLoader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader-v16/dist/index.js?!./src/modules/account/views/ViewAccountDisplayAll.vue?vue&type=template&id=2a4c6db3":
/*!*******************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader-v16/dist/templateLoader.js??ref--6!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader-v16/dist??ref--0-1!./src/modules/account/views/ViewAccountDisplayAll.vue?vue&type=template&id=2a4c6db3 ***!
  \*******************************************************************************************************************************************************************************************************************************************************/
/*! exports provided: render */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"render\", function() { return render; });\n/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ \"./node_modules/vue/dist/vue.runtime.esm-bundler.js\");\n\n\nconst _hoisted_1 = { class: \"mt-4 w-11/12 ml-auto mr-auto border-b-2\" }\nconst _hoisted_2 = { class: \"flex text-xxs md:text-xs font-semibold\" }\nconst _hoisted_3 = { class: \"w-18 text-center border-b-2 pb-4 lg:pb-3 border-yellow-500\" }\nconst _hoisted_4 = { class: \"my-4 w-11/12 ml-auto mr-auto\" }\nconst _hoisted_5 = { class: \"float-right mb-4 text-center w-44 text-white bg-blue-primary rounded-md font-semibold text-xs p-2\" }\nconst _hoisted_6 = { class: \"mt-2 py-3\" }\nconst _hoisted_7 = { class: \"w-11/12 ml-auto mr-auto flex flex-col gap-3\" }\nconst _hoisted_8 = /*#__PURE__*/Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createElementVNode\"])(\"div\", { class: \"mb-36\" }, null, -1 /* HOISTED */)\n\nfunction render(_ctx, _cache, $props, $setup, $data, $options) {\n  const _component_router_link = Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"resolveComponent\"])(\"router-link\")\n  const _component_AccountTile = Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"resolveComponent\"])(\"AccountTile\")\n\n  return (Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"openBlock\"])(), Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createElementBlock\"])(\"div\", null, [\n    Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createElementVNode\"])(\"div\", _hoisted_1, [\n      Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createElementVNode\"])(\"div\", _hoisted_2, [\n        Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createElementVNode\"])(\"div\", _hoisted_3, Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"toDisplayString\"])(_ctx.$t('general.overview')), 1 /* TEXT */),\n        Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createVNode\"])(_component_router_link, {\n          to: { name: 'ViewNormalAccount'},\n          class: \"w-28 text-center\",\n          style: {\"width\":\"6.5rem\"}\n        }, {\n          default: Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"withCtx\"])(() => [\n            Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createTextVNode\"])(Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"toDisplayString\"])(_ctx.$t('account.myAcc')), 1 /* TEXT */)\n          ]),\n          _: 1 /* STABLE */\n        }),\n        Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createVNode\"])(_component_router_link, {\n          to: { name: 'ViewMultisigAccount'},\n          class: \"text-center\",\n          style: {\"width\":\"9rem\"}\n        }, {\n          default: Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"withCtx\"])(() => [\n            Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createTextVNode\"])(Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"toDisplayString\"])(_ctx.$t('account.multisigAcc')), 1 /* TEXT */)\n          ]),\n          _: 1 /* STABLE */\n        }),\n        Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createVNode\"])(_component_router_link, {\n          to: { name: 'ViewOtherAccount'},\n          class: \"text-center\",\n          style: {\"width\":\"8rem\"}\n        }, {\n          default: Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"withCtx\"])(() => [\n            Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createTextVNode\"])(Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"toDisplayString\"])(_ctx.$t('account.otherAcc')), 1 /* TEXT */)\n          ]),\n          _: 1 /* STABLE */\n        })\n      ])\n    ]),\n    Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createElementVNode\"])(\"div\", _hoisted_4, [\n      Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createVNode\"])(_component_router_link, { to: {name:'ViewAccountCreateSelectType'} }, {\n        default: Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"withCtx\"])(() => [\n          Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createElementVNode\"])(\"div\", _hoisted_5, \"+ \" + Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"toDisplayString\"])(_ctx.$t('general.createNewAcc')), 1 /* TEXT */)\n        ]),\n        _: 1 /* STABLE */\n      })\n    ]),\n    Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createElementVNode\"])(\"div\", _hoisted_6, [\n      Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createElementVNode\"])(\"div\", _hoisted_7, [\n        (Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"openBlock\"])(true), Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createElementBlock\"])(vue__WEBPACK_IMPORTED_MODULE_0__[\"Fragment\"], null, Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"renderList\"])($setup.accounts, (item, index) => {\n          return (Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"openBlock\"])(), Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createBlock\"])(_component_AccountTile, {\n            key: index,\n            account: item\n          }, null, 8 /* PROPS */, [\"account\"]))\n        }), 128 /* KEYED_FRAGMENT */))\n      ])\n    ]),\n    _hoisted_8\n  ]))\n}\n\n//# sourceURL=webpack:///./src/modules/account/views/ViewAccountDisplayAll.vue?./node_modules/vue-loader-v16/dist/templateLoader.js??ref--6!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader-v16/dist??ref--0-1");

/***/ }),

/***/ "./src/modules/account/views/ViewAccountDisplayAll.vue":
/*!*************************************************************!*\
  !*** ./src/modules/account/views/ViewAccountDisplayAll.vue ***!
  \*************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _ViewAccountDisplayAll_vue_vue_type_template_id_2a4c6db3__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ViewAccountDisplayAll.vue?vue&type=template&id=2a4c6db3 */ \"./src/modules/account/views/ViewAccountDisplayAll.vue?vue&type=template&id=2a4c6db3\");\n/* harmony import */ var _ViewAccountDisplayAll_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ViewAccountDisplayAll.vue?vue&type=script&lang=js */ \"./src/modules/account/views/ViewAccountDisplayAll.vue?vue&type=script&lang=js\");\n/* empty/unused harmony star reexport *//* harmony import */ var _home_runner_work_web_wallet_vuejs_web_wallet_vuejs_node_modules_vue_loader_v16_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./node_modules/vue-loader-v16/dist/exportHelper.js */ \"./node_modules/vue-loader-v16/dist/exportHelper.js\");\n/* harmony import */ var _home_runner_work_web_wallet_vuejs_web_wallet_vuejs_node_modules_vue_loader_v16_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_home_runner_work_web_wallet_vuejs_web_wallet_vuejs_node_modules_vue_loader_v16_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2__);\n\n\n\n\n\nconst __exports__ = /*#__PURE__*/_home_runner_work_web_wallet_vuejs_web_wallet_vuejs_node_modules_vue_loader_v16_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2___default()(_ViewAccountDisplayAll_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"], [['render',_ViewAccountDisplayAll_vue_vue_type_template_id_2a4c6db3__WEBPACK_IMPORTED_MODULE_0__[\"render\"]],['__file',\"src/modules/account/views/ViewAccountDisplayAll.vue\"]])\n/* hot reload */\nif (false) {}\n\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (__exports__);\n\n//# sourceURL=webpack:///./src/modules/account/views/ViewAccountDisplayAll.vue?");

/***/ }),

/***/ "./src/modules/account/views/ViewAccountDisplayAll.vue?vue&type=script&lang=js":
/*!*************************************************************************************!*\
  !*** ./src/modules/account/views/ViewAccountDisplayAll.vue?vue&type=script&lang=js ***!
  \*************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_v16_dist_index_js_ref_0_1_ViewAccountDisplayAll_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/cache-loader/dist/cjs.js??ref--0-0!../../../../node_modules/vue-loader-v16/dist??ref--0-1!./ViewAccountDisplayAll.vue?vue&type=script&lang=js */ \"./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader-v16/dist/index.js?!./src/modules/account/views/ViewAccountDisplayAll.vue?vue&type=script&lang=js\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return _node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_v16_dist_index_js_ref_0_1_ViewAccountDisplayAll_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"]; });\n\n/* empty/unused harmony star reexport */ \n\n//# sourceURL=webpack:///./src/modules/account/views/ViewAccountDisplayAll.vue?");

/***/ }),

/***/ "./src/modules/account/views/ViewAccountDisplayAll.vue?vue&type=template&id=2a4c6db3":
/*!*******************************************************************************************!*\
  !*** ./src/modules/account/views/ViewAccountDisplayAll.vue?vue&type=template&id=2a4c6db3 ***!
  \*******************************************************************************************/
/*! exports provided: render */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _node_modules_vue_loader_v16_dist_templateLoader_js_ref_6_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_v16_dist_index_js_ref_0_1_ViewAccountDisplayAll_vue_vue_type_template_id_2a4c6db3__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/vue-loader-v16/dist/templateLoader.js??ref--6!../../../../node_modules/cache-loader/dist/cjs.js??ref--0-0!../../../../node_modules/vue-loader-v16/dist??ref--0-1!./ViewAccountDisplayAll.vue?vue&type=template&id=2a4c6db3 */ \"./node_modules/vue-loader-v16/dist/templateLoader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader-v16/dist/index.js?!./src/modules/account/views/ViewAccountDisplayAll.vue?vue&type=template&id=2a4c6db3\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"render\", function() { return _node_modules_vue_loader_v16_dist_templateLoader_js_ref_6_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_v16_dist_index_js_ref_0_1_ViewAccountDisplayAll_vue_vue_type_template_id_2a4c6db3__WEBPACK_IMPORTED_MODULE_0__[\"render\"]; });\n\n\n\n//# sourceURL=webpack:///./src/modules/account/views/ViewAccountDisplayAll.vue?");

/***/ })

}]);