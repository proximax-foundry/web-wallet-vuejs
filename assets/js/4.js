(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[4],{

/***/ "./src/assets/img/icon-prx-xpx-blue.svg":
/*!**********************************************!*\
  !*** ./src/assets/img/icon-prx-xpx-blue.svg ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("module.exports = __webpack_require__.p + \"assets/img/icon-prx-xpx-blue.026c6b2b.svg\";\n\n//# sourceURL=webpack:///./src/assets/img/icon-prx-xpx-blue.svg?");

/***/ }),

/***/ "./src/util/assetsUtils.ts":
/*!*********************************!*\
  !*** ./src/util/assetsUtils.ts ***!
  \*********************************/
/*! exports provided: AssetsUtils */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"AssetsUtils\", function() { return AssetsUtils; });\n/* harmony import */ var tsjs_xpx_chain_sdk__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tsjs-xpx-chain-sdk */ \"./node_modules/tsjs-xpx-chain-sdk/dist/index.js\");\n/* harmony import */ var tsjs_xpx_chain_sdk__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(tsjs_xpx_chain_sdk__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _state_walletState__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../state/walletState */ \"./src/state/walletState.ts\");\n/* harmony import */ var _state_networkState__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../state/networkState */ \"./src/state/networkState.ts\");\n/* harmony import */ var _util_chainUtils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../util/chainUtils */ \"./src/util/chainUtils.ts\");\n/* harmony import */ var _util_walletUtils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../util/walletUtils */ \"./src/util/walletUtils.ts\");\n/* harmony import */ var _models_REST_chainAPICall__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../models/REST/chainAPICall */ \"./src/models/REST/chainAPICall.ts\");\n/* harmony import */ var _util_buildTransactions__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../util/buildTransactions */ \"./src/util/buildTransactions.ts\");\n/* harmony import */ var _state_listenerState__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @/state/listenerState */ \"./src/state/listenerState.ts\");\n/* harmony import */ var _state_utils_listenerStateUtils__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @/state/utils/listenerStateUtils */ \"./src/state/utils/listenerStateUtils.ts\");\n/* harmony import */ var _typeHelper__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./typeHelper */ \"./src/util/typeHelper.ts\");\n\n// import { mergeMap, timeout, filter, map, first, skip } from 'rxjs/operators';\n\n\n\n\n\n\n\n\n\nvar AssetsUtils = /** @class */ (function () {\n    function AssetsUtils() {\n    }\n    AssetsUtils.getCosignerList = function (address) {\n        var account = _state_walletState__WEBPACK_IMPORTED_MODULE_1__[\"walletState\"].currentLoggedInWallet.accounts.find(function (account) { return account.address == address; });\n        var other = _state_walletState__WEBPACK_IMPORTED_MODULE_1__[\"walletState\"].currentLoggedInWallet.others.find(function (account) { return account.address == address; });\n        var multiSig = account ? account.getDirectParentMultisig() : [];\n        var multiSigOther = other ? other.getDirectParentMultisig() : [];\n        if (multiSig.length > 0 || multiSigOther.length > 0) {\n            var cosigner = _state_walletState__WEBPACK_IMPORTED_MODULE_1__[\"walletState\"].currentLoggedInWallet.accounts.filter(function (account) {\n                if (multiSig.indexOf(account.publicKey) >= 0 || multiSigOther.indexOf(account.publicKey) >= 0) {\n                    return true;\n                }\n            });\n            var cosignList_1 = [];\n            if (cosigner.length > 0) {\n                cosigner.forEach(function (cosign) {\n                    cosignList_1.push({\n                        name: cosign.name,\n                        address: cosign.address,\n                        balance: cosign.balance,\n                    });\n                });\n            }\n            return { list: cosignList_1 };\n        }\n        else {\n            return { list: [] };\n        }\n    };\n    /**\n     * Method to add leading zeros\n     *\n     * @param cant Quantity of zeros to add\n     * @param amount Amount to add zeros\n     */\n    AssetsUtils.addZeros = function (cant, amount) {\n        if (amount === void 0) { amount = 0; }\n        var realAmount;\n        if (cant > 0) {\n            var decimal = void 0;\n            if (amount === 0) {\n                decimal = this.addDecimals(cant);\n                realAmount = \"0\" + decimal;\n            }\n            else {\n                var arrAmount = amount.toString().replace(/,/g, '').split('.');\n                if (arrAmount.length < 2) {\n                    decimal = this.addDecimals(cant);\n                }\n                else {\n                    var arrDecimals = arrAmount[1].split('');\n                    decimal = this.addDecimals(cant - arrDecimals.length, arrAmount[1]);\n                }\n                realAmount = \"\" + arrAmount[0] + decimal;\n            }\n        }\n        else {\n            realAmount = amount;\n        }\n        return realAmount;\n    };\n    /**\n     * Method to add leading zeros\n     *\n     * @param cant Quantity of zeros to add\n     * @param amount Amount to add zeros\n     */\n    AssetsUtils.addDecimals = function (cant, amount) {\n        if (amount === void 0) { amount = '0'; }\n        var x = '0';\n        if (amount === '0') {\n            for (var index = 0; index < cant - 1; index++) {\n                amount += x;\n            }\n        }\n        else {\n            for (var index = 0; index < cant; index++) {\n                amount += x;\n            }\n        }\n        return amount;\n    };\n    AssetsUtils.createAssetTransaction = function (networkType, generationHash, owner, supply, supplyMutable, transferable, divisibility, duration, changeType) {\n        var buildTransactions = new _util_buildTransactions__WEBPACK_IMPORTED_MODULE_6__[\"BuildTransactions\"](networkType, generationHash);\n        var assetDefinition = buildTransactions.mosaicDefinition(owner, supplyMutable, transferable, divisibility, tsjs_xpx_chain_sdk__WEBPACK_IMPORTED_MODULE_0__[\"UInt64\"].fromUint(AssetsUtils.calculateDuration(duration)));\n        var assetDefinitionTx = assetDefinition.toAggregate(owner);\n        var supplyChangeType;\n        supplyChangeType = (changeType == 'increase') ? tsjs_xpx_chain_sdk__WEBPACK_IMPORTED_MODULE_0__[\"MosaicSupplyType\"].Increase : tsjs_xpx_chain_sdk__WEBPACK_IMPORTED_MODULE_0__[\"MosaicSupplyType\"].Decrease;\n        var assetSupplyChangeTx = buildTransactions.buildMosaicSupplyChange(assetDefinition.mosaicId, supplyChangeType, tsjs_xpx_chain_sdk__WEBPACK_IMPORTED_MODULE_0__[\"UInt64\"].fromUint(AssetsUtils.addZeros(divisibility, supply))).toAggregate(owner);\n        return buildTransactions.aggregateComplete([assetDefinitionTx, assetSupplyChangeTx]);\n    };\n    AssetsUtils.assetSupplyChangeTransaction = function (networkType, generationHash, mosaidStringId, changeType, supply, divisibility) {\n        var buildTransactions = new _util_buildTransactions__WEBPACK_IMPORTED_MODULE_6__[\"BuildTransactions\"](networkType, generationHash);\n        var supplyChangeType;\n        supplyChangeType = (changeType == 'increase') ? tsjs_xpx_chain_sdk__WEBPACK_IMPORTED_MODULE_0__[\"MosaicSupplyType\"].Increase : tsjs_xpx_chain_sdk__WEBPACK_IMPORTED_MODULE_0__[\"MosaicSupplyType\"].Decrease;\n        return buildTransactions.buildMosaicSupplyChange(new tsjs_xpx_chain_sdk__WEBPACK_IMPORTED_MODULE_0__[\"MosaicId\"](mosaidStringId), supplyChangeType, tsjs_xpx_chain_sdk__WEBPACK_IMPORTED_MODULE_0__[\"UInt64\"].fromUint(AssetsUtils.addZeros(divisibility, supply)));\n    };\n    AssetsUtils.linkAssetToNamespaceTransaction = function (networkType, generationHash, mosaicIdString, namespaceString, linkType) {\n        var buildTransactions = new _util_buildTransactions__WEBPACK_IMPORTED_MODULE_6__[\"BuildTransactions\"](networkType, generationHash);\n        var aliasActionType;\n        aliasActionType = (linkType == 'link') ? tsjs_xpx_chain_sdk__WEBPACK_IMPORTED_MODULE_0__[\"AliasActionType\"].Link : tsjs_xpx_chain_sdk__WEBPACK_IMPORTED_MODULE_0__[\"AliasActionType\"].Unlink;\n        return buildTransactions.assetAlias(aliasActionType, new tsjs_xpx_chain_sdk__WEBPACK_IMPORTED_MODULE_0__[\"NamespaceId\"](namespaceString), new tsjs_xpx_chain_sdk__WEBPACK_IMPORTED_MODULE_0__[\"MosaicId\"](mosaicIdString));\n    };\n    AssetsUtils.createAssetTransactionFee = function (networkType, generationHash, owner, supply, supplyMutable, transferable, divisibility, duration, changeType) {\n        var createAssetTransaction = AssetsUtils.createAssetTransaction(networkType, generationHash, owner, supply, supplyMutable, transferable, divisibility, duration, changeType);\n        return createAssetTransaction.maxFee.compact();\n    };\n    AssetsUtils.getMosaicSupplyChangeTransactionFee = function (networkType, generationHash, mosaicId, changeType, supply, divisibility) {\n        var mosaicSupplyChangeTx = AssetsUtils.assetSupplyChangeTransaction(networkType, generationHash, mosaicId, changeType, supply, divisibility);\n        return mosaicSupplyChangeTx.maxFee.compact();\n    };\n    AssetsUtils.getLinkAssetToNamespaceTransactionFee = function (networkType, generationHash, mosaicId, namespaceId, linkType) {\n        var linkAssetToNamespaceTx = AssetsUtils.linkAssetToNamespaceTransaction(networkType, generationHash, mosaicId, namespaceId, linkType);\n        return linkAssetToNamespaceTx.maxFee.compact();\n    };\n    AssetsUtils.calculateDuration = function (durationInDay) {\n        // 5760 = 4 * 60 * 24 -> 15sec per block\n        return durationInDay * 5760;\n    };\n    AssetsUtils.getOwnedAssets = function (address) {\n        var assetSelection = [];\n        var account = _state_walletState__WEBPACK_IMPORTED_MODULE_1__[\"walletState\"].currentLoggedInWallet.accounts.find(function (account) { return account.address === address; });\n        var other = _state_walletState__WEBPACK_IMPORTED_MODULE_1__[\"walletState\"].currentLoggedInWallet.others.find(function (account) { return account.address === address; });\n        var filterAccountAsset = account ? account.assets.filter(function (asset) { return asset.owner === account.publicKey; }) : [];\n        var filterOtherAsset = other ? other.assets.filter(function (asset) { return asset.owner === other.publicKey; }) : [];\n        if (filterAccountAsset.length > 0) {\n            filterAccountAsset.forEach(function (asset) {\n                assetSelection.push({\n                    label: asset.idHex + ' > ' + _typeHelper__WEBPACK_IMPORTED_MODULE_9__[\"Helper\"].amountFormatterSimple(asset.amount, asset.divisibility),\n                    value: asset.idHex,\n                });\n            });\n        }\n        if (filterOtherAsset.length > 0) {\n            filterOtherAsset.forEach(function (asset) {\n                assetSelection.push({\n                    label: asset.idHex + ' > ' + _typeHelper__WEBPACK_IMPORTED_MODULE_9__[\"Helper\"].amountFormatterSimple(asset.amount, asset.divisibility),\n                    value: asset.idHex,\n                });\n            });\n        }\n        return assetSelection;\n    };\n    AssetsUtils.getOwnedAssetsPermutable = function (address) {\n        var assetSelection = [];\n        var account = _state_walletState__WEBPACK_IMPORTED_MODULE_1__[\"walletState\"].currentLoggedInWallet.accounts.find(function (account) { return account.address === address; });\n        var other = _state_walletState__WEBPACK_IMPORTED_MODULE_1__[\"walletState\"].currentLoggedInWallet.others.find(function (account) { return account.address === address; });\n        var filterAccountAsset = account ? account.assets.filter(function (asset) { return (asset.owner === account.publicKey && asset.supplyMutable === true); }) : [];\n        var filterOtherAsset = other ? other.assets.filter(function (asset) { return (asset.owner === other.publicKey && asset.supplyMutable === true); }) : [];\n        if (filterAccountAsset.length > 0) {\n            filterAccountAsset.forEach(function (asset) {\n                assetSelection.push({\n                    label: asset.idHex + ' > ' + _typeHelper__WEBPACK_IMPORTED_MODULE_9__[\"Helper\"].amountFormatterSimple(asset.amount, asset.divisibility),\n                    value: asset.idHex,\n                });\n            });\n        }\n        if (filterOtherAsset.length > 0) {\n            filterOtherAsset.forEach(function (asset) {\n                assetSelection.push({\n                    label: asset.idHex + ' > ' + _typeHelper__WEBPACK_IMPORTED_MODULE_9__[\"Helper\"].amountFormatterSimple(asset.amount, asset.divisibility),\n                    value: asset.idHex,\n                });\n            });\n        }\n        return assetSelection;\n    };\n    AssetsUtils.getSenderAccount = function (selectedAddress, walletPassword) {\n        var accAddress = tsjs_xpx_chain_sdk__WEBPACK_IMPORTED_MODULE_0__[\"Address\"].createFromRawAddress(selectedAddress);\n        var accountDetails = _state_walletState__WEBPACK_IMPORTED_MODULE_1__[\"walletState\"].currentLoggedInWallet.accounts.find(function (account) { return account.address == accAddress.plain(); });\n        var encryptedPassword = _util_walletUtils__WEBPACK_IMPORTED_MODULE_4__[\"WalletUtils\"].createPassword(walletPassword);\n        var privateKey = _util_walletUtils__WEBPACK_IMPORTED_MODULE_4__[\"WalletUtils\"].decryptPrivateKey(encryptedPassword, accountDetails.encrypted, accountDetails.iv);\n        var account = tsjs_xpx_chain_sdk__WEBPACK_IMPORTED_MODULE_0__[\"Account\"].createFromPrivateKey(privateKey, _util_chainUtils__WEBPACK_IMPORTED_MODULE_3__[\"ChainUtils\"].getNetworkType(_state_networkState__WEBPACK_IMPORTED_MODULE_2__[\"networkState\"].currentNetworkProfile.network.type));\n        return account;\n    };\n    AssetsUtils.createAsset = function (selectedAddress, walletPassword, networkType, generationHash, owner, supply, supplyMutable, transferable, divisibility, duration) {\n        var createAssetAggregateTransaction = AssetsUtils.createAssetTransaction(networkType, generationHash, owner, supply, supplyMutable, transferable, divisibility, duration, 'increase');\n        var account = AssetsUtils.getSenderAccount(selectedAddress, walletPassword);\n        var signedTx = account.sign(createAssetAggregateTransaction, _state_networkState__WEBPACK_IMPORTED_MODULE_2__[\"networkState\"].currentNetworkProfile.generationHash);\n        AssetsUtils.annouce(signedTx);\n    };\n    AssetsUtils.createAssetMultiSig = function (selectedAddress, walletPassword, networkType, generationHash, owner, supply, supplyMutable, transferable, divisibility, duration, multiSigAddress) {\n        var buildTransactions = new _util_buildTransactions__WEBPACK_IMPORTED_MODULE_6__[\"BuildTransactions\"](networkType, generationHash);\n        var assetDefinition = buildTransactions.mosaicDefinition(owner, supplyMutable, transferable, divisibility, tsjs_xpx_chain_sdk__WEBPACK_IMPORTED_MODULE_0__[\"UInt64\"].fromUint(AssetsUtils.calculateDuration(duration)));\n        var assetDefinitionTx = assetDefinition.toAggregate(owner);\n        var supplyChangeType;\n        supplyChangeType = tsjs_xpx_chain_sdk__WEBPACK_IMPORTED_MODULE_0__[\"MosaicSupplyType\"].Increase;\n        var assetSupplyChangeTx = buildTransactions.buildMosaicSupplyChange(assetDefinition.mosaicId, supplyChangeType, tsjs_xpx_chain_sdk__WEBPACK_IMPORTED_MODULE_0__[\"UInt64\"].fromUint(AssetsUtils.addZeros(divisibility, supply))).toAggregate(owner);\n        var account = AssetsUtils.getSenderAccount(selectedAddress, walletPassword);\n        var multisSigAccount = _state_walletState__WEBPACK_IMPORTED_MODULE_1__[\"walletState\"].currentLoggedInWallet.accounts.find(function (element) { return element.address === multiSigAddress; });\n        var multisSigOther = _state_walletState__WEBPACK_IMPORTED_MODULE_1__[\"walletState\"].currentLoggedInWallet.others.find(function (element) { return element.address === multiSigAddress; });\n        var multisigPublicKey = multisSigAccount ? multisSigAccount.publicKey : multisSigOther.publicKey;\n        var multisigPublicAccount = tsjs_xpx_chain_sdk__WEBPACK_IMPORTED_MODULE_0__[\"PublicAccount\"].createFromPublicKey(multisigPublicKey, networkType);\n        var innerTxn = [assetDefinitionTx.toAggregate(multisigPublicAccount), assetSupplyChangeTx.toAggregate(multisigPublicAccount)];\n        var aggregateBondedTx = buildTransactions.aggregateBonded(innerTxn);\n        var aggregateBondedTxSigned = account.sign(aggregateBondedTx, generationHash);\n        var hashLockTx = buildTransactions.hashLock(_typeHelper__WEBPACK_IMPORTED_MODULE_9__[\"Helper\"].createAsset(_state_networkState__WEBPACK_IMPORTED_MODULE_2__[\"networkState\"].currentNetworkProfile.network.currency.assetId, 10000000), _typeHelper__WEBPACK_IMPORTED_MODULE_9__[\"Helper\"].createUint64FromNumber(200), aggregateBondedTxSigned);\n        var signedHashlock = account.sign(hashLockTx, generationHash);\n        AssetsUtils.multiSigAnnouce(aggregateBondedTxSigned, signedHashlock);\n    };\n    AssetsUtils.changeAssetSupply = function (selectedAddress, walletPassword, networkType, generationHash, mosaicId, changeType, supply, divisibility) {\n        var createAssetAggregateTransaction = AssetsUtils.assetSupplyChangeTransaction(networkType, generationHash, mosaicId, changeType, supply, divisibility);\n        var account = AssetsUtils.getSenderAccount(selectedAddress, walletPassword);\n        var signedTx = account.sign(createAssetAggregateTransaction, _state_networkState__WEBPACK_IMPORTED_MODULE_2__[\"networkState\"].currentNetworkProfile.generationHash);\n        AssetsUtils.annouce(signedTx);\n    };\n    AssetsUtils.changeAssetSupplyMultiSig = function (selectedAddress, walletPassword, networkType, generationHash, mosaicId, changeType, supply, divisibility, multiSigAddress) {\n        var buildTransactions = new _util_buildTransactions__WEBPACK_IMPORTED_MODULE_6__[\"BuildTransactions\"](networkType, generationHash);\n        var createAssetAggregateTransaction = AssetsUtils.assetSupplyChangeTransaction(networkType, generationHash, mosaicId, changeType, supply, divisibility);\n        var account = AssetsUtils.getSenderAccount(selectedAddress, walletPassword);\n        var multisSigAccount = _state_walletState__WEBPACK_IMPORTED_MODULE_1__[\"walletState\"].currentLoggedInWallet.accounts.find(function (element) { return element.address === multiSigAddress; });\n        var multisSigOther = _state_walletState__WEBPACK_IMPORTED_MODULE_1__[\"walletState\"].currentLoggedInWallet.others.find(function (element) { return element.address === multiSigAddress; });\n        var multisigPublicKey = multisSigAccount ? multisSigAccount.publicKey : multisSigOther.publicKey;\n        var multisigPublicAccount = tsjs_xpx_chain_sdk__WEBPACK_IMPORTED_MODULE_0__[\"PublicAccount\"].createFromPublicKey(multisigPublicKey, networkType);\n        var innerTxn = [createAssetAggregateTransaction.toAggregate(multisigPublicAccount)];\n        var aggregateBondedTx = buildTransactions.aggregateBonded(innerTxn);\n        var aggregateBondedTxSigned = account.sign(aggregateBondedTx, generationHash);\n        var hashLockTx = buildTransactions.hashLock(_typeHelper__WEBPACK_IMPORTED_MODULE_9__[\"Helper\"].createAsset(_state_networkState__WEBPACK_IMPORTED_MODULE_2__[\"networkState\"].currentNetworkProfile.network.currency.assetId, 10000000), _typeHelper__WEBPACK_IMPORTED_MODULE_9__[\"Helper\"].createUint64FromNumber(200), aggregateBondedTxSigned);\n        var signedHashlock = account.sign(hashLockTx, generationHash);\n        AssetsUtils.multiSigAnnouce(aggregateBondedTxSigned, signedHashlock);\n    };\n    AssetsUtils.linkedNamespaceToAsset = function (selectedAddress, walletPassword, networkType, generationHash, mosaicIdString, namespaceString, linkType) {\n        var linkAssetToNamespaceTx = AssetsUtils.linkAssetToNamespaceTransaction(networkType, generationHash, mosaicIdString, namespaceString, linkType);\n        var account = AssetsUtils.getSenderAccount(selectedAddress, walletPassword);\n        var signedTx = account.sign(linkAssetToNamespaceTx, _state_networkState__WEBPACK_IMPORTED_MODULE_2__[\"networkState\"].currentNetworkProfile.generationHash);\n        AssetsUtils.annouce(signedTx);\n    };\n    AssetsUtils.linkedNamespaceToAssetMultiSig = function (selectedAddress, walletPassword, networkType, generationHash, mosaicIdString, namespaceString, linkType, multiSigAddress) {\n        var buildTransactions = new _util_buildTransactions__WEBPACK_IMPORTED_MODULE_6__[\"BuildTransactions\"](networkType, generationHash);\n        var linkAssetToNamespaceTx = AssetsUtils.linkAssetToNamespaceTransaction(networkType, generationHash, mosaicIdString, namespaceString, linkType);\n        var account = AssetsUtils.getSenderAccount(selectedAddress, walletPassword);\n        var multisSigAccount = _state_walletState__WEBPACK_IMPORTED_MODULE_1__[\"walletState\"].currentLoggedInWallet.accounts.find(function (element) { return element.address === multiSigAddress; });\n        var multisSigOther = _state_walletState__WEBPACK_IMPORTED_MODULE_1__[\"walletState\"].currentLoggedInWallet.others.find(function (element) { return element.address === multiSigAddress; });\n        var multisigPublicKey = multisSigAccount ? multisSigAccount.publicKey : multisSigOther.publicKey;\n        var multisigPublicAccount = tsjs_xpx_chain_sdk__WEBPACK_IMPORTED_MODULE_0__[\"PublicAccount\"].createFromPublicKey(multisigPublicKey, networkType);\n        var innerTxn = [linkAssetToNamespaceTx.toAggregate(multisigPublicAccount)];\n        var aggregateBondedTx = buildTransactions.aggregateBonded(innerTxn);\n        var aggregateBondedTxSigned = account.sign(aggregateBondedTx, generationHash);\n        var hashLockTx = buildTransactions.hashLock(_typeHelper__WEBPACK_IMPORTED_MODULE_9__[\"Helper\"].createAsset(_state_networkState__WEBPACK_IMPORTED_MODULE_2__[\"networkState\"].currentNetworkProfile.network.currency.assetId, 10000000), _typeHelper__WEBPACK_IMPORTED_MODULE_9__[\"Helper\"].createUint64FromNumber(200), aggregateBondedTxSigned);\n        var signedHashlock = account.sign(hashLockTx, generationHash);\n        AssetsUtils.multiSigAnnouce(aggregateBondedTxSigned, signedHashlock);\n    };\n    AssetsUtils.listActiveNamespacesToLink = function (address, linkOption) {\n        // const accountNamespaces = walletState.currentLoggedInWallet.accounts.find((account) => account.address === address).namespaces.filter(namespace => namespace.active === true);\n        var account = _state_walletState__WEBPACK_IMPORTED_MODULE_1__[\"walletState\"].currentLoggedInWallet.accounts.find(function (account) { return account.address === address; });\n        var accountNamespaces = account ? account.namespaces.filter(function (namespace) { return namespace.active === true; }) : [];\n        var other = _state_walletState__WEBPACK_IMPORTED_MODULE_1__[\"walletState\"].currentLoggedInWallet.others.find(function (account) { return account.address === address; });\n        var otherNamespaces = other ? other.namespaces.filter(function (namespace) { return namespace.active === true; }) : [];\n        var namespacesNum;\n        var fetchedNamespace;\n        if (accountNamespaces.length > 0) {\n            namespacesNum = accountNamespaces.length;\n            fetchedNamespace = accountNamespaces;\n        }\n        else {\n            namespacesNum = otherNamespaces.length;\n            fetchedNamespace = otherNamespaces;\n        }\n        var namespacesArr = [];\n        if (namespacesNum > 0) {\n            fetchedNamespace.forEach(function (namespaceElement) {\n                var level = namespaceElement.name.split('.');\n                var isDisabled;\n                var label = '';\n                var namespaceName = '';\n                if (namespaceElement.linkedId != '') {\n                    var linkName = void 0;\n                    var linkLabel = void 0;\n                    switch (namespaceElement.linkType) {\n                        case 1:\n                            linkName = \"Asset\";\n                            linkLabel = namespaceElement.linkedId;\n                            isDisabled = (linkOption == 'link' ? true : false);\n                            break;\n                        case 2:\n                            linkName = \"Address\";\n                            linkLabel = _typeHelper__WEBPACK_IMPORTED_MODULE_9__[\"Helper\"].createAddress(namespaceElement.linkedId).pretty();\n                            isDisabled = true;\n                            break;\n                        default:\n                            break;\n                    }\n                    label = namespaceElement.name + ' (Linked to ' + linkName + ') - ' + linkLabel;\n                    namespaceName = namespaceElement.name;\n                }\n                else {\n                    isDisabled = (linkOption == 'link' ? false : true);\n                    label = namespaceElement.name;\n                    namespaceName = namespaceElement.name;\n                }\n                namespacesArr.push({\n                    // value: namespaceElement.idHex,\n                    value: namespaceName,\n                    label: label,\n                    disabled: isDisabled,\n                    level: level\n                });\n            });\n            namespacesArr.sort(function (a, b) {\n                if (a.label > b.label)\n                    return 1;\n                if (a.label < b.label)\n                    return -1;\n                return 0;\n            });\n            namespacesArr.sort(function (a, b) {\n                if (a.level > b.level)\n                    return 1;\n                if (a.level < b.level)\n                    return -1;\n                return 0;\n            });\n        }\n        return namespacesArr;\n    };\n    AssetsUtils.annouce = function (signedTransaction) {\n        var apiEndpoint = _util_chainUtils__WEBPACK_IMPORTED_MODULE_3__[\"ChainUtils\"].buildAPIEndpoint(_state_networkState__WEBPACK_IMPORTED_MODULE_2__[\"networkState\"].selectedAPIEndpoint, _state_networkState__WEBPACK_IMPORTED_MODULE_2__[\"networkState\"].currentNetworkProfile.httpPort);\n        var chainAPICall = new _models_REST_chainAPICall__WEBPACK_IMPORTED_MODULE_5__[\"ChainAPICall\"](apiEndpoint);\n        chainAPICall.transactionAPI.announce(signedTransaction);\n    };\n    AssetsUtils.multiSigAnnouce = function (aggregateTx, hashSigned) {\n        var hashLockAutoAnnounceSignedTx = new _state_listenerState__WEBPACK_IMPORTED_MODULE_7__[\"AutoAnnounceSignedTransaction\"](hashSigned);\n        hashLockAutoAnnounceSignedTx.announceAtBlock = _state_listenerState__WEBPACK_IMPORTED_MODULE_7__[\"listenerState\"].currentBlock + 1;\n        var autoAnnounceSignedTx = new _state_listenerState__WEBPACK_IMPORTED_MODULE_7__[\"AutoAnnounceSignedTransaction\"](aggregateTx);\n        autoAnnounceSignedTx.hashAnnounceBlock = new _state_listenerState__WEBPACK_IMPORTED_MODULE_7__[\"HashAnnounceBlock\"](hashSigned.hash);\n        autoAnnounceSignedTx.hashAnnounceBlock.annouceAfterBlockNum = 1;\n        autoAnnounceSignedTx.type = _state_listenerState__WEBPACK_IMPORTED_MODULE_7__[\"AnnounceType\"].BONDED;\n        _state_utils_listenerStateUtils__WEBPACK_IMPORTED_MODULE_8__[\"ListenerStateUtils\"].addAutoAnnounceSignedTransaction(hashLockAutoAnnounceSignedTx);\n        _state_utils_listenerStateUtils__WEBPACK_IMPORTED_MODULE_8__[\"ListenerStateUtils\"].addAutoAnnounceSignedTransaction(autoAnnounceSignedTx);\n    };\n    return AssetsUtils;\n}());\n\n\n\n//# sourceURL=webpack:///./src/util/assetsUtils.ts?");

/***/ })

}]);