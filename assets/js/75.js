(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[75],{

/***/ "./src/assets/img/chevron_left.svg":
/*!*****************************************!*\
  !*** ./src/assets/img/chevron_left.svg ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("module.exports = __webpack_require__.p + \"assets/img/chevron_left.120f1ae7.svg\";\n\n//# sourceURL=webpack:///./src/assets/img/chevron_left.svg?");

/***/ }),

/***/ "./src/assets/img/chevron_right.svg":
/*!******************************************!*\
  !*** ./src/assets/img/chevron_right.svg ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("module.exports = __webpack_require__.p + \"assets/img/chevron_right.e5f72240.svg\";\n\n//# sourceURL=webpack:///./src/assets/img/chevron_right.svg?");

/***/ }),

/***/ "./src/assets/img/icon-key.svg":
/*!*************************************!*\
  !*** ./src/assets/img/icon-key.svg ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("module.exports = __webpack_require__.p + \"assets/img/icon-key.0e181e5e.svg\";\n\n//# sourceURL=webpack:///./src/assets/img/icon-key.svg?");

/***/ }),

/***/ "./src/modules/account/img/icon-pin.svg":
/*!**********************************************!*\
  !*** ./src/modules/account/img/icon-pin.svg ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("module.exports = __webpack_require__.p + \"assets/img/icon-pin.4428bcf6.svg\";\n\n//# sourceURL=webpack:///./src/modules/account/img/icon-pin.svg?");

/***/ }),

/***/ "./src/util/functions.ts":
/*!*******************************!*\
  !*** ./src/util/functions.ts ***!
  \*******************************/
/*! exports provided: copyKeyFunc, copyToClipboard, getCoingeckoCoinPrice, getCurrentPriceUSD, getXPXcurrencyPrice */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"copyKeyFunc\", function() { return copyKeyFunc; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"copyToClipboard\", function() { return copyToClipboard; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"getCoingeckoCoinPrice\", function() { return getCoingeckoCoinPrice; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"getCurrentPriceUSD\", function() { return getCurrentPriceUSD; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"getXPXcurrencyPrice\", function() { return getXPXcurrencyPrice; });\n/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ \"./node_modules/tslib/tslib.es6.js\");\n/* harmony import */ var primevue_usetoast__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! primevue/usetoast */ \"./node_modules/primevue/usetoast/usetoast.esm.js\");\n\n\n// copy address keys\nconst copyKeyFunc = (id) => {\n    const toast = Object(primevue_usetoast__WEBPACK_IMPORTED_MODULE_1__[\"useToast\"])();\n    // Credits: https://www.w3schools.com/howto/howto_js_copy_clipboard.asp\n    let copyText = document.getElementById(id);\n    /* Select the text field */\n    //copyText.innerText;\n    copyText === null || copyText === void 0 ? void 0 : copyText.select();\n    copyText === null || copyText === void 0 ? void 0 : copyText.setSelectionRange(0, 99999); /* For mobile devices */\n    /* Copy the text inside the text field */\n    document.execCommand(\"copy\");\n    let titleType;\n    if (id == 'private') {\n        titleType = 'Private key';\n    }\n    else if (id == 'public') {\n        titleType = 'Public key';\n    }\n    else if (id == 'pollIndexAddress') {\n        titleType = 'Poll Index Address';\n    }\n    else {\n        titleType = 'Address';\n    }\n    // toast.add({severity:'info', summary: titleType + ' copied', detail: copyText.value, group: 'br', life: 5000});\n};\nconst copyToClipboard = (data) => {\n    const listener = (e) => {\n        e.clipboardData.setData('text/plain', data);\n        e.preventDefault();\n        document.removeEventListener('copy', listener);\n    };\n    document.addEventListener('copy', listener);\n    document.execCommand('copy');\n};\nconst getCoingecko = (coinId) => {\n    return fetch(`https://api.coingecko.com/api/v3/coins/${coinId}`).then((res) => res.json()).then((data) => { return data.market_data.current_price.usd; });\n};\nconst getCoingeckoCoinPrice = (coinId) => {\n    return fetch(`https://api.coingecko.com/api/v3/coins/${coinId}`).then((res) => res.json()).then((data) => { return data.market_data.current_price; });\n};\nconst getCurrentPriceUSD = (url) => {\n    return fetch(url).then((res) => res.json()).then((data) => { return data; });\n};\nconst getXPXcurrencyPrice = (balance) => Object(tslib__WEBPACK_IMPORTED_MODULE_0__[\"__awaiter\"])(void 0, void 0, void 0, function* () {\n    let total;\n    let coinId = 'proximax';\n    let rate = yield getCoingecko(coinId);\n    total = rate * balance;\n    return total;\n});\n// export const getPrettyAddress = (address: string) => {\n//   const prettyAddress = Address.createFromRawAddress(address);\n//   return prettyAddress.pretty();\n// }\n\n\n//# sourceURL=webpack:///./src/util/functions.ts?");

/***/ })

}]);