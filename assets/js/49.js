(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[49],{

/***/ "./node_modules/primevue/inlinemessage/inlinemessage.esm.js":
/*!******************************************************************!*\
  !*** ./node_modules/primevue/inlinemessage/inlinemessage.esm.js ***!
  \******************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ \"./node_modules/vue/dist/vue.runtime.esm-bundler.js\");\n\n\nvar script = {\n    name: 'InlineMessage',\n    props: {\n        severity: {\n            type: String,\n            default: 'error'\n        }\n    },\n    timeout: null,\n    data() {\n        return {\n            visible: true\n        }\n    },\n    mounted() {\n        if (!this.sticky) {\n            setTimeout(() => {\n                this.visible = false;\n            }, this.life);\n        }\n    },\n    computed: {\n        containerClass() {\n            return ['p-inline-message p-component p-inline-message-' + this.severity, {'p-inline-message-icon-only': !this.$slots.default}];\n        },\n        iconClass() {\n            return ['p-inline-message-icon pi', {\n                'pi-info-circle': this.severity === 'info',\n                'pi-check': this.severity === 'success',\n                'pi-exclamation-triangle': this.severity === 'warn',\n                'pi-times-circle': this.severity === 'error'\n            }];\n        }\n    }\n};\n\nconst _hoisted_1 = { class: \"p-inline-message-text\" };\nconst _hoisted_2 = /*#__PURE__*/Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createTextVNode\"])(\" \");\n\nfunction render(_ctx, _cache, $props, $setup, $data, $options) {\n  return (Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"openBlock\"])(), Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createBlock\"])(\"div\", {\n    \"aria-live\": \"polite\",\n    class: $options.containerClass\n  }, [\n    Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createVNode\"])(\"span\", { class: $options.iconClass }, null, 2),\n    Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"createVNode\"])(\"span\", _hoisted_1, [\n      Object(vue__WEBPACK_IMPORTED_MODULE_0__[\"renderSlot\"])(_ctx.$slots, \"default\", {}, () => [\n        _hoisted_2\n      ])\n    ])\n  ], 2))\n}\n\nfunction styleInject(css, ref) {\n  if ( ref === void 0 ) ref = {};\n  var insertAt = ref.insertAt;\n\n  if (!css || typeof document === 'undefined') { return; }\n\n  var head = document.head || document.getElementsByTagName('head')[0];\n  var style = document.createElement('style');\n  style.type = 'text/css';\n\n  if (insertAt === 'top') {\n    if (head.firstChild) {\n      head.insertBefore(style, head.firstChild);\n    } else {\n      head.appendChild(style);\n    }\n  } else {\n    head.appendChild(style);\n  }\n\n  if (style.styleSheet) {\n    style.styleSheet.cssText = css;\n  } else {\n    style.appendChild(document.createTextNode(css));\n  }\n}\n\nvar css_248z = \"\\n.p-inline-message {\\n    display: -webkit-inline-box;\\n    display: -ms-inline-flexbox;\\n    display: inline-flex;\\n    -webkit-box-align: center;\\n        -ms-flex-align: center;\\n            align-items: center;\\n    -webkit-box-pack: center;\\n        -ms-flex-pack: center;\\n            justify-content: center;\\n    vertical-align: top;\\n}\\n.p-inline-message-icon-only .p-inline-message-text {\\n    visibility: hidden;\\n    width: 0;\\n}\\n.p-fluid .p-inline-message {\\n    display: -webkit-box;\\n    display: -ms-flexbox;\\n    display: flex;\\n}\\n\";\nstyleInject(css_248z);\n\nscript.render = render;\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (script);\n\n\n//# sourceURL=webpack:///./node_modules/primevue/inlinemessage/inlinemessage.esm.js?");

/***/ }),

/***/ "./src/modules/dashboard/img/arrow-transaction-receive-in-green-proximax-sirius-explorer.svg":
/*!***************************************************************************************************!*\
  !*** ./src/modules/dashboard/img/arrow-transaction-receive-in-green-proximax-sirius-explorer.svg ***!
  \***************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("module.exports = __webpack_require__.p + \"assets/img/arrow-transaction-receive-in-green-proximax-sirius-explorer.73ce2a7d.svg\";\n\n//# sourceURL=webpack:///./src/modules/dashboard/img/arrow-transaction-receive-in-green-proximax-sirius-explorer.svg?");

/***/ }),

/***/ "./src/modules/dashboard/img/arrow-transaction-sender-out-orange-proximax-sirius-explorer.svg":
/*!****************************************************************************************************!*\
  !*** ./src/modules/dashboard/img/arrow-transaction-sender-out-orange-proximax-sirius-explorer.svg ***!
  \****************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("module.exports = __webpack_require__.p + \"assets/img/arrow-transaction-sender-out-orange-proximax-sirius-explorer.541d4c2b.svg\";\n\n//# sourceURL=webpack:///./src/modules/dashboard/img/arrow-transaction-sender-out-orange-proximax-sirius-explorer.svg?");

/***/ }),

/***/ "./src/modules/services/submodule/mainnetSwap/img/check-status.svg":
/*!*************************************************************************!*\
  !*** ./src/modules/services/submodule/mainnetSwap/img/check-status.svg ***!
  \*************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("module.exports = __webpack_require__.p + \"assets/img/check-status.6f31b8ab.svg\";\n\n//# sourceURL=webpack:///./src/modules/services/submodule/mainnetSwap/img/check-status.svg?");

/***/ })

}]);