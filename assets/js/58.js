(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[58],{

/***/ "./src/assets/img/icon-prx-xpx-blue.svg":
/*!**********************************************!*\
  !*** ./src/assets/img/icon-prx-xpx-blue.svg ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("module.exports = __webpack_require__.p + \"assets/img/icon-prx-xpx-blue.026c6b2b.svg\";\n\n//# sourceURL=webpack:///./src/assets/img/icon-prx-xpx-blue.svg?");

/***/ }),

/***/ "./src/util/functions.ts":
/*!*******************************!*\
  !*** ./src/util/functions.ts ***!
  \*******************************/
/*! exports provided: copyKeyFunc, copyToClipboard, getCoingeckoCoinPrice, getCurrentPriceUSD, getXPXcurrencyPrice */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"copyKeyFunc\", function() { return copyKeyFunc; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"copyToClipboard\", function() { return copyToClipboard; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"getCoingeckoCoinPrice\", function() { return getCoingeckoCoinPrice; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"getCurrentPriceUSD\", function() { return getCurrentPriceUSD; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"getXPXcurrencyPrice\", function() { return getXPXcurrencyPrice; });\n/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ \"./node_modules/tslib/tslib.es6.js\");\n/* harmony import */ var primevue_usetoast__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! primevue/usetoast */ \"./node_modules/primevue/usetoast/usetoast.esm.js\");\n\n\n// copy address keys\nvar copyKeyFunc = function (id) {\n    var toast = Object(primevue_usetoast__WEBPACK_IMPORTED_MODULE_1__[\"useToast\"])();\n    // Credits: https://www.w3schools.com/howto/howto_js_copy_clipboard.asp\n    var copyText = document.getElementById(id);\n    /* Select the text field */\n    //copyText.innerText;\n    copyText === null || copyText === void 0 ? void 0 : copyText.select();\n    copyText === null || copyText === void 0 ? void 0 : copyText.setSelectionRange(0, 99999); /* For mobile devices */\n    /* Copy the text inside the text field */\n    document.execCommand(\"copy\");\n    var titleType;\n    if (id == 'private') {\n        titleType = 'Private key';\n    }\n    else if (id == 'public') {\n        titleType = 'Public key';\n    }\n    else if (id == 'pollIndexAddress') {\n        titleType = 'Poll Index Address';\n    }\n    else {\n        titleType = 'Address';\n    }\n    // toast.add({severity:'info', summary: titleType + ' copied', detail: copyText.value, group: 'br', life: 5000});\n};\nvar copyToClipboard = function (data) {\n    var listener = function (e) {\n        e.clipboardData.setData('text/plain', data);\n        e.preventDefault();\n        document.removeEventListener('copy', listener);\n    };\n    document.addEventListener('copy', listener);\n    document.execCommand('copy');\n};\nvar getCoingecko = function (coinId) {\n    return fetch(\"https://api.coingecko.com/api/v3/coins/\" + coinId).then(function (res) { return res.json(); }).then(function (data) { return data.market_data.current_price.usd; });\n};\nvar getCoingeckoCoinPrice = function (coinId) {\n    return fetch(\"https://api.coingecko.com/api/v3/coins/\" + coinId).then(function (res) { return res.json(); }).then(function (data) { return data.market_data.current_price; });\n};\nvar getCurrentPriceUSD = function (url) {\n    return fetch(url).then(function (res) { return res.json(); }).then(function (data) { return data; });\n};\nvar getXPXcurrencyPrice = function (balance) { return Object(tslib__WEBPACK_IMPORTED_MODULE_0__[\"__awaiter\"])(void 0, void 0, Promise, function () {\n    var total, coinId, rate;\n    return Object(tslib__WEBPACK_IMPORTED_MODULE_0__[\"__generator\"])(this, function (_a) {\n        switch (_a.label) {\n            case 0:\n                coinId = 'proximax';\n                return [4 /*yield*/, getCoingecko(coinId)];\n            case 1:\n                rate = _a.sent();\n                total = rate * balance;\n                return [2 /*return*/, total];\n        }\n    });\n}); };\n// export const getPrettyAddress = (address: string) => {\n//   const prettyAddress = Address.createFromRawAddress(address);\n//   return prettyAddress.pretty();\n// }\n\n\n//# sourceURL=webpack:///./src/util/functions.ts?");

/***/ })

}]);