(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[78],{

/***/ "./node_modules/primevue/tooltip/tooltip.esm.js":
/*!******************************************************!*\
  !*** ./node_modules/primevue/tooltip/tooltip.esm.js ***!
  \******************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var primevue_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! primevue/utils */ \"./node_modules/primevue/utils/utils.esm.js\");\n\n\nfunction bindEvents(el) {\n    const modifiers = el.$_ptooltipModifiers;\n    if (modifiers.focus) {\n        el.addEventListener('focus', onFocus);\n        el.addEventListener('blur', onBlur);\n    }\n    else {\n        el.addEventListener('mouseenter', onMouseEnter);\n        el.addEventListener('mouseleave', onMouseLeave);\n        el.addEventListener('click', onClick);\n    }\n}\n\nfunction unbindEvents(el) {\n    const modifiers = el.$_ptooltipModifiers;\n    if (modifiers.focus) {\n        el.removeEventListener('focus', onFocus);\n        el.removeEventListener('blur', onBlur);\n    }\n    else {\n        el.removeEventListener('mouseenter', onMouseEnter);\n        el.removeEventListener('mouseleave', onMouseLeave);\n        el.removeEventListener('click', onClick);\n    }\n}\n\nfunction bindScrollListener(el) {\n    if (!el.$_ptooltipScrollHandler) {\n        el.$_ptooltipScrollHandler = new primevue_utils__WEBPACK_IMPORTED_MODULE_0__[\"ConnectedOverlayScrollHandler\"](el, function() {\n            hide(el);\n        });\n    }\n\n    el.$_ptooltipScrollHandler.bindScrollListener();\n}\n\nfunction unbindScrollListener(el) {\n    if (el.$_ptooltipScrollHandler) {\n        el.$_ptooltipScrollHandler.unbindScrollListener();\n    }\n}\n\nfunction onMouseEnter(event) {\n    show(event.currentTarget);\n}\n\nfunction onMouseLeave(event) {\n    hide(event.currentTarget);\n}\n\nfunction onFocus(event) {\n    show(event.currentTarget);\n}\n\nfunction onBlur(event) {\n    hide(event.currentTarget);\n}\n\nfunction onClick(event) {\n    hide(event.currentTarget);\n}\n\nfunction show(el) {\n    if (el.$_ptooltipDisabled) {\n        return;\n    }\n\n    let tooltipElement = create(el);\n    align(el);\n    primevue_utils__WEBPACK_IMPORTED_MODULE_0__[\"DomHandler\"].fadeIn(tooltipElement, 250);\n\n    window.addEventListener('resize', function onWindowResize() {\n        if (!primevue_utils__WEBPACK_IMPORTED_MODULE_0__[\"DomHandler\"].isAndroid()) {\n            hide(el);\n        }\n        this.removeEventListener('resize', onWindowResize);\n    });\n\n    bindScrollListener(el);\n    primevue_utils__WEBPACK_IMPORTED_MODULE_0__[\"ZIndexUtils\"].set('tooltip', tooltipElement, el.$_ptooltipZIndex);\n}\n\nfunction hide(el) {\n    remove(el);\n    unbindScrollListener(el);\n    primevue_utils__WEBPACK_IMPORTED_MODULE_0__[\"ZIndexUtils\"].clear(el);\n}\n\nfunction getTooltipElement(el) {\n    return document.getElementById(el.$_ptooltipId);\n}\n\nfunction create(el) {\n    const id = Object(primevue_utils__WEBPACK_IMPORTED_MODULE_0__[\"UniqueComponentId\"])() + '_tooltip';\n    el.$_ptooltipId = id;\n\n    let container = document.createElement('div');\n    container.id = id;\n\n    let tooltipArrow = document.createElement('div');\n    tooltipArrow.className = 'p-tooltip-arrow';\n    container.appendChild(tooltipArrow);\n\n    let tooltipText = document.createElement('div');\n    tooltipText.className = 'p-tooltip-text';\n    tooltipText.innerHTML = el.$_ptooltipValue;\n\n    container.appendChild(tooltipText);\n    document.body.appendChild(container);\n\n    container.style.display = 'inline-block';\n\n    return container;\n}\n\nfunction remove(el) {\n    if (el) {\n        let tooltipElement = getTooltipElement(el);\n        if (tooltipElement && tooltipElement.parentElement) {\n            document.body.removeChild(tooltipElement);\n        }\n        el.$_ptooltipId = null;\n    }\n}\n\nfunction align(el) {\n    const modifiers = el.$_ptooltipModifiers;\n\n    if (modifiers.top) {\n        alignTop(el);\n        if (isOutOfBounds(el)) {\n            alignBottom(el);\n        }\n    }\n    else if (modifiers.left) {\n        alignLeft(el);\n        if (isOutOfBounds(el)) {\n            alignRight(el);\n\n            if (isOutOfBounds(el)) {\n                alignTop(el);\n\n                if (isOutOfBounds(el)) {\n                    alignBottom(el);\n                }\n            }\n        }\n    }\n    else if (modifiers.bottom) {\n        alignBottom(el);\n        if (isOutOfBounds(el)) {\n            alignTop(el);\n        }\n    }\n    else {\n        alignRight(el);\n        if (isOutOfBounds(el)) {\n            alignLeft(el);\n\n            if (isOutOfBounds(el)) {\n                alignTop(el);\n\n                if (isOutOfBounds(el)) {\n                    alignBottom(el);\n                }\n            }\n        }\n    }\n}\n\nfunction getHostOffset(el) {\n    let offset = el.getBoundingClientRect();\n    let targetLeft = offset.left + primevue_utils__WEBPACK_IMPORTED_MODULE_0__[\"DomHandler\"].getWindowScrollLeft();\n    let targetTop = offset.top + primevue_utils__WEBPACK_IMPORTED_MODULE_0__[\"DomHandler\"].getWindowScrollTop();\n\n    return {left: targetLeft, top: targetTop};\n}\n\nfunction alignRight(el) {\n    preAlign(el, 'right');\n    let tooltipElement = getTooltipElement(el);\n    let hostOffset = getHostOffset(el);\n    let left = hostOffset.left + primevue_utils__WEBPACK_IMPORTED_MODULE_0__[\"DomHandler\"].getOuterWidth(el);\n    let top = hostOffset.top + (primevue_utils__WEBPACK_IMPORTED_MODULE_0__[\"DomHandler\"].getOuterHeight(el) - primevue_utils__WEBPACK_IMPORTED_MODULE_0__[\"DomHandler\"].getOuterHeight(tooltipElement)) / 2;\n    tooltipElement.style.left = left + 'px';\n    tooltipElement.style.top = top + 'px';\n}\n\nfunction alignLeft(el) {\n    preAlign(el, 'left');\n    let tooltipElement = getTooltipElement(el);\n    let hostOffset = getHostOffset(el);\n    let left = hostOffset.left - primevue_utils__WEBPACK_IMPORTED_MODULE_0__[\"DomHandler\"].getOuterWidth(tooltipElement);\n    let top = hostOffset.top + (primevue_utils__WEBPACK_IMPORTED_MODULE_0__[\"DomHandler\"].getOuterHeight(el) - primevue_utils__WEBPACK_IMPORTED_MODULE_0__[\"DomHandler\"].getOuterHeight(tooltipElement)) / 2;\n    tooltipElement.style.left = left + 'px';\n    tooltipElement.style.top = top + 'px';\n}\n\nfunction alignTop(el) {\n    preAlign(el, 'top');\n    let tooltipElement = getTooltipElement(el);\n    let hostOffset = getHostOffset(el);\n    let left = hostOffset.left + (primevue_utils__WEBPACK_IMPORTED_MODULE_0__[\"DomHandler\"].getOuterWidth(el) - primevue_utils__WEBPACK_IMPORTED_MODULE_0__[\"DomHandler\"].getOuterWidth(tooltipElement)) / 2;\n    let top = hostOffset.top - primevue_utils__WEBPACK_IMPORTED_MODULE_0__[\"DomHandler\"].getOuterHeight(tooltipElement);\n    tooltipElement.style.left = left + 'px';\n    tooltipElement.style.top = top + 'px';\n}\n\nfunction alignBottom(el) {\n    preAlign(el, 'bottom');\n    let tooltipElement = getTooltipElement(el);\n    let hostOffset = getHostOffset(el);\n    let left = hostOffset.left + (primevue_utils__WEBPACK_IMPORTED_MODULE_0__[\"DomHandler\"].getOuterWidth(el) - primevue_utils__WEBPACK_IMPORTED_MODULE_0__[\"DomHandler\"].getOuterWidth(tooltipElement)) / 2;\n    let top = hostOffset.top + primevue_utils__WEBPACK_IMPORTED_MODULE_0__[\"DomHandler\"].getOuterHeight(el);\n    tooltipElement.style.left = left + 'px';\n    tooltipElement.style.top = top + 'px';\n}\n\nfunction preAlign(el, position) {\n    let tooltipElement = getTooltipElement(el);\n    tooltipElement.style.left = -999 + 'px';\n    tooltipElement.style.top = -999 + 'px';\n    tooltipElement.className = 'p-tooltip p-component p-tooltip-' + position;\n}\n\nfunction isOutOfBounds(el) {\n    let tooltipElement = getTooltipElement(el);\n    let offset = tooltipElement.getBoundingClientRect();\n    let targetTop = offset.top;\n    let targetLeft = offset.left;\n    let width = primevue_utils__WEBPACK_IMPORTED_MODULE_0__[\"DomHandler\"].getOuterWidth(tooltipElement);\n    let height = primevue_utils__WEBPACK_IMPORTED_MODULE_0__[\"DomHandler\"].getOuterHeight(tooltipElement);\n    let viewport = primevue_utils__WEBPACK_IMPORTED_MODULE_0__[\"DomHandler\"].getViewport();\n\n    return (targetLeft + width > viewport.width) || (targetLeft < 0) || (targetTop < 0) || (targetTop + height > viewport.height);\n}\n\nfunction getTarget(el) {\n    return primevue_utils__WEBPACK_IMPORTED_MODULE_0__[\"DomHandler\"].hasClass(el, 'p-inputwrapper') ? primevue_utils__WEBPACK_IMPORTED_MODULE_0__[\"DomHandler\"].findSingle(el, 'input'): el;\n}\n\nconst Tooltip = {\n    beforeMount(el, options) {\n        let target = getTarget(el);\n        target.$_ptooltipModifiers = options.modifiers;\n        if (typeof options.value === 'string') {\n            target.$_ptooltipValue = options.value;\n            target.$_ptooltipDisabled = false;\n        }\n        else {\n            target.$_ptooltipValue = options.value.value;\n            target.$_ptooltipDisabled = options.value.disabled || false;\n        }\n\n        target.$_ptooltipZIndex = options.instance.$primevue && options.instance.$primevue.config && options.instance.$primevue.config.zIndex.tooltip;\n        bindEvents(target);\n    },\n    unmounted(el) {\n        let target = getTarget(el);\n        remove(target);\n        unbindEvents(target);\n\n        if (target.$_ptooltipScrollHandler) {\n            target.$_ptooltipScrollHandler.destroy();\n            target.$_ptooltipScrollHandler = null;\n        }\n\n        primevue_utils__WEBPACK_IMPORTED_MODULE_0__[\"ZIndexUtils\"].clear(el);\n    },\n    updated(el, options) {\n        let target = getTarget(el);\n        target.$_ptooltipModifiers = options.modifiers;\n\n        if (typeof options.value === 'string') {\n            target.$_ptooltipValue = options.value;\n            target.$_ptooltipDisabled = false;\n        }\n        else {\n            target.$_ptooltipValue = options.value.value;\n            target.$_ptooltipDisabled = options.value.disabled;\n        }\n    },\n\n};\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (Tooltip);\n\n\n//# sourceURL=webpack:///./node_modules/primevue/tooltip/tooltip.esm.js?");

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