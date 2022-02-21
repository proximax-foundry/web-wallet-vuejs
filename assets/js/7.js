(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[7],{

/***/ "./src/assets/img/chevron_left.svg":
/*!*****************************************!*\
  !*** ./src/assets/img/chevron_left.svg ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("module.exports = __webpack_require__.p + \"assets/img/chevron_left.120f1ae7.svg\";\n\n//# sourceURL=webpack:///./src/assets/img/chevron_left.svg?");

/***/ }),

/***/ "./src/util/multiSignatory.ts":
/*!************************************!*\
  !*** ./src/util/multiSignatory.ts ***!
  \************************************/
/*! exports provided: multiSign */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"multiSign\", function() { return multiSign; });\n/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ \"./node_modules/tslib/tslib.es6.js\");\n/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! vue */ \"./node_modules/vue/dist/vue.runtime.esm-bundler.js\");\n/* harmony import */ var tsjs_xpx_chain_sdk__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! tsjs-xpx-chain-sdk */ \"./node_modules/tsjs-xpx-chain-sdk/dist/index.js\");\n/* harmony import */ var tsjs_xpx_chain_sdk__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(tsjs_xpx_chain_sdk__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _util_walletUtils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @/util/walletUtils */ \"./src/util/walletUtils.ts\");\n/* harmony import */ var _state_walletState__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @/state/walletState */ \"./src/state/walletState.ts\");\n/* harmony import */ var _state_networkState__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @/state/networkState */ \"./src/state/networkState.ts\");\n/* harmony import */ var _util_transactionUtils__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @/util/transactionUtils */ \"./src/util/transactionUtils.ts\");\n/* harmony import */ var _state_utils_listenerStateUtils__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @/state/utils/listenerStateUtils */ \"./src/state/utils/listenerStateUtils.ts\");\n/* harmony import */ var _state_listenerState__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @/state/listenerState */ \"./src/state/listenerState.ts\");\n/* harmony import */ var _state_appState__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @/state/appState */ \"./src/state/appState.ts\");\n/* harmony import */ var _typeHelper__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./typeHelper */ \"./src/util/typeHelper.ts\");\n\n\n\n\n\n // chainNetwork\n\n\n\n\n\nconst walletKey = \"sw\";\nconst generationHash = _state_networkState__WEBPACK_IMPORTED_MODULE_5__[\"networkState\"].currentNetworkProfile.generationHash;\nconst networkType = _state_appState__WEBPACK_IMPORTED_MODULE_9__[\"AppState\"].networkType;\nfunction verifyContactPublicKey(address) {\n    const invalidPublicKey = '0000000000000000000000000000000000000000000000000000000000000000';\n    return new Promise((resolve) => {\n        const accountInfo = _util_walletUtils__WEBPACK_IMPORTED_MODULE_3__[\"WalletUtils\"].getAccInfo(address);\n        accountInfo.then((account) => {\n            if (account.publicKey == invalidPublicKey) {\n                console.warn(`The receiver's public key is not valid for sending encrypted messages`);\n                resolve({ status: false, publicKey: account.publicKey });\n            }\n            else {\n                resolve({ status: true, publicKey: account.publicKey });\n            }\n        }, (error) => {\n            console.warn('Err: ' + error);\n            resolve({ status: false, publicKey: \"\" });\n        });\n    });\n}\nfunction generateContact(selected, name) {\n    const wallet = _state_walletState__WEBPACK_IMPORTED_MODULE_4__[\"walletState\"].currentLoggedInWallet;\n    let contact = [];\n    let accounts = wallet.accounts.filter(account => account.name != name);\n    accounts.forEach((element) => {\n        if (element.address == selected) {\n        }\n        else {\n            contact.push({\n                value: element.publicKey,\n                label: element.name + ' - Owner account',\n            });\n        }\n    });\n    if (wallet.contacts != undefined) {\n        wallet.contacts.forEach((element) => {\n            if (selected.indexOf(element.address) < 0) {\n                contact.push({\n                    value: element.address,\n                    label: element.name + ' - Contact',\n                });\n            }\n        });\n    }\n    return contact;\n}\nconst getPublicKey = (address) => {\n    return new Promise((resolve, reject) => {\n        try {\n            _util_transactionUtils__WEBPACK_IMPORTED_MODULE_6__[\"TransactionUtils\"].getAccInfo(address).then(accountInfo => {\n                resolve(accountInfo.publicKey);\n            }).catch(error => {\n                console.log(error);\n                reject(false);\n            });\n        }\n        catch (error) {\n            reject(false);\n            console.log(error);\n        }\n    });\n};\nconst getAggregateFee = (publicKey, addedCosigners, numApprove, numDelete, removeCosign) => Object(tslib__WEBPACK_IMPORTED_MODULE_0__[\"__awaiter\"])(void 0, void 0, void 0, function* () {\n    const acc = _state_walletState__WEBPACK_IMPORTED_MODULE_4__[\"walletState\"].currentLoggedInWallet.accounts.find(acc => acc.publicKey == publicKey) || _state_walletState__WEBPACK_IMPORTED_MODULE_4__[\"walletState\"].currentLoggedInWallet.others.find(acc => acc.publicKey == publicKey);\n    const multisigCosignatory = [];\n    let cosignatory;\n    for (let cosignKey of addedCosigners) {\n        if (cosignKey.length == 64) {\n            cosignatory = tsjs_xpx_chain_sdk__WEBPACK_IMPORTED_MODULE_2__[\"PublicAccount\"].createFromPublicKey(cosignKey, networkType);\n        }\n        else if (cosignKey.length == 40 || cosignKey.length == 46) {\n            let address = tsjs_xpx_chain_sdk__WEBPACK_IMPORTED_MODULE_2__[\"Address\"].createFromRawAddress(cosignKey);\n            try {\n                let publicKey = yield getPublicKey(address);\n                cosignatory = tsjs_xpx_chain_sdk__WEBPACK_IMPORTED_MODULE_2__[\"PublicAccount\"].createFromPublicKey(publicKey, networkType);\n            }\n            catch (error) {\n                console.log(error);\n            }\n        }\n        multisigCosignatory.push(new tsjs_xpx_chain_sdk__WEBPACK_IMPORTED_MODULE_2__[\"MultisigCosignatoryModification\"](tsjs_xpx_chain_sdk__WEBPACK_IMPORTED_MODULE_2__[\"MultisigCosignatoryModificationType\"].Add, cosignatory));\n    }\n    if (removeCosign) {\n        removeCosign.forEach((element, index) => {\n            if (!cosignatory) {\n                cosignatory = [];\n            }\n            cosignatory[addedCosigners.length + index] = tsjs_xpx_chain_sdk__WEBPACK_IMPORTED_MODULE_2__[\"PublicAccount\"].createFromPublicKey(element, networkType);\n            multisigCosignatory.push(new tsjs_xpx_chain_sdk__WEBPACK_IMPORTED_MODULE_2__[\"MultisigCosignatoryModification\"](tsjs_xpx_chain_sdk__WEBPACK_IMPORTED_MODULE_2__[\"MultisigCosignatoryModificationType\"].Remove, cosignatory[addedCosigners.length + index]));\n        });\n    }\n    let relativeNumApproveTransaction = numApprove - acc.multisigInfo.find(element => element.level === 0).minApproval;\n    let relativeNumDeleteUser = numDelete - acc.multisigInfo.find(element => element.level === 0).minRemoval;\n    let convertIntoMultisigTransaction = _state_appState__WEBPACK_IMPORTED_MODULE_9__[\"AppState\"].buildTxn.modifyMultisigAccount(relativeNumApproveTransaction, relativeNumDeleteUser, multisigCosignatory);\n    return _typeHelper__WEBPACK_IMPORTED_MODULE_10__[\"Helper\"].amountFormatterSimple(_state_appState__WEBPACK_IMPORTED_MODULE_9__[\"AppState\"].buildTxn.aggregateBonded([convertIntoMultisigTransaction.toAggregate(tsjs_xpx_chain_sdk__WEBPACK_IMPORTED_MODULE_2__[\"PublicAccount\"].createFromPublicKey(publicKey, networkType))]).maxFee.compact(), _state_appState__WEBPACK_IMPORTED_MODULE_9__[\"AppState\"].nativeToken.divisibility);\n});\n/* coSign: array() */\nfunction convertAccount(coSign, numApproveTransaction, numDeleteUser, accountToConvertName, walletPassword) {\n    var _a;\n    return Object(tslib__WEBPACK_IMPORTED_MODULE_0__[\"__awaiter\"])(this, void 0, void 0, function* () {\n        let verify = _util_walletUtils__WEBPACK_IMPORTED_MODULE_3__[\"WalletUtils\"].verifyWalletPassword(_state_walletState__WEBPACK_IMPORTED_MODULE_4__[\"walletState\"].currentLoggedInWallet.name, _state_networkState__WEBPACK_IMPORTED_MODULE_5__[\"networkState\"].chainNetworkName, walletPassword);\n        if (!verify) {\n            return verify;\n        }\n        const generationHash = _state_networkState__WEBPACK_IMPORTED_MODULE_5__[\"networkState\"].currentNetworkProfile.generationHash;\n        const multisigCosignatory = [];\n        const accountDetails = _state_walletState__WEBPACK_IMPORTED_MODULE_4__[\"walletState\"].currentLoggedInWallet.accounts.find(element => element.name === accountToConvertName);\n        const networkType = _state_networkState__WEBPACK_IMPORTED_MODULE_5__[\"networkState\"].currentNetworkProfile.network.type;\n        let privateKey = _util_walletUtils__WEBPACK_IMPORTED_MODULE_3__[\"WalletUtils\"].decryptPrivateKey(new tsjs_xpx_chain_sdk__WEBPACK_IMPORTED_MODULE_2__[\"Password\"](walletPassword), accountDetails.encrypted, accountDetails.iv);\n        const accountToConvert = tsjs_xpx_chain_sdk__WEBPACK_IMPORTED_MODULE_2__[\"Account\"].createFromPrivateKey(privateKey, networkType);\n        let cosignatory;\n        for (let cosignKey of coSign) {\n            if (cosignKey.length == 64) {\n                cosignatory = tsjs_xpx_chain_sdk__WEBPACK_IMPORTED_MODULE_2__[\"PublicAccount\"].createFromPublicKey(cosignKey, networkType);\n            }\n            else if (cosignKey.length == 40 || cosignKey.length == 46) {\n                let address = tsjs_xpx_chain_sdk__WEBPACK_IMPORTED_MODULE_2__[\"Address\"].createFromRawAddress(cosignKey);\n                try {\n                    /* let publicKey; */\n                    let publicKey = yield getPublicKey(address);\n                    cosignatory = tsjs_xpx_chain_sdk__WEBPACK_IMPORTED_MODULE_2__[\"PublicAccount\"].createFromPublicKey(publicKey, networkType);\n                }\n                catch (error) {\n                    console.log(error);\n                }\n            }\n            multisigCosignatory.push(new tsjs_xpx_chain_sdk__WEBPACK_IMPORTED_MODULE_2__[\"MultisigCosignatoryModification\"](tsjs_xpx_chain_sdk__WEBPACK_IMPORTED_MODULE_2__[\"MultisigCosignatoryModificationType\"].Add, cosignatory));\n        }\n        const txBuilder = _state_appState__WEBPACK_IMPORTED_MODULE_9__[\"AppState\"].buildTxn;\n        const convertIntoMultisigTransaction = txBuilder.modifyMultisigAccount(numApproveTransaction, numDeleteUser, multisigCosignatory);\n        /*  if(enableACT(accountDetails,coSign)){\n           const aggregateCompleteTransaction = AggregateTransaction.createComplete(\n             Deadline.create(),\n             [convertIntoMultisigTransaction.toAggregate(accountToConvert.publicAccount)],\n             networkType,\n             []\n           )\n           let cosignerDetails :WalletAccount\n           let cosignerAccounts :Account[] = []\n           for(let i =0;i<numApproveTransaction;i++){\n             if(coSign[i].length == 64){\n               cosignerDetails = walletState.currentLoggedInWallet.accounts.find(element => element.publicKey ==coSign[i])\n             }else{\n               cosignerDetails = walletState.currentLoggedInWallet.accounts.find(element => element.address ==coSign[i])\n             }\n             let cosignerPrivateKey = WalletUtils.decryptPrivateKey(new Password(walletPassword), cosignerDetails.encrypted, cosignerDetails.iv);\n             let cosignerAcc = Account.createFromPrivateKey(cosignerPrivateKey,networkType)\n             cosignerAccounts.push(cosignerAcc)\n           }\n           const signedAggregateCompleteTransaction = accountToConvert.signTransactionWithCosignatories(aggregateCompleteTransaction,cosignerAccounts,generationHash)\n           let transactionHttp = new TransactionHttp(NetworkStateUtils.buildAPIEndpointURL(networkState.selectedAPIEndpoint));\n           transactionHttp\n           .announce(signedAggregateCompleteTransaction)\n           .subscribe(x => console.log(x), err => console.error(err))\n         }else{ */\n        const aggregateBondedTransaction = txBuilder.aggregateBonded([convertIntoMultisigTransaction.toAggregate(accountToConvert.publicAccount)]);\n        const signedAggregateBondedTransaction = accountToConvert.sign(aggregateBondedTransaction, generationHash);\n        const nativeTokenNamespace = _state_networkState__WEBPACK_IMPORTED_MODULE_5__[\"networkState\"].currentNetworkProfile.network.currency.namespace;\n        const lockingAtomicFee = (_a = _state_networkState__WEBPACK_IMPORTED_MODULE_5__[\"networkState\"].currentNetworkProfileConfig.lockedFundsPerAggregate) !== null && _a !== void 0 ? _a : 0;\n        const lockFundsTransaction = txBuilder.hashLock(new tsjs_xpx_chain_sdk__WEBPACK_IMPORTED_MODULE_2__[\"Mosaic\"](new tsjs_xpx_chain_sdk__WEBPACK_IMPORTED_MODULE_2__[\"NamespaceId\"](nativeTokenNamespace), tsjs_xpx_chain_sdk__WEBPACK_IMPORTED_MODULE_2__[\"UInt64\"].fromUint(lockingAtomicFee)), tsjs_xpx_chain_sdk__WEBPACK_IMPORTED_MODULE_2__[\"UInt64\"].fromUint(1000), signedAggregateBondedTransaction);\n        const lockFundsTransactionSigned = accountToConvert.sign(lockFundsTransaction, generationHash);\n        let autoAnnounceSignedTx = new _state_listenerState__WEBPACK_IMPORTED_MODULE_8__[\"AutoAnnounceSignedTransaction\"](signedAggregateBondedTransaction);\n        autoAnnounceSignedTx.hashAnnounceBlock = new _state_listenerState__WEBPACK_IMPORTED_MODULE_8__[\"HashAnnounceBlock\"](lockFundsTransactionSigned.hash);\n        autoAnnounceSignedTx.hashAnnounceBlock.annouceAfterBlockNum = 1;\n        autoAnnounceSignedTx.type = _state_listenerState__WEBPACK_IMPORTED_MODULE_8__[\"AnnounceType\"].BONDED;\n        _state_utils_listenerStateUtils__WEBPACK_IMPORTED_MODULE_7__[\"ListenerStateUtils\"].addAutoAnnounceSignedTransaction(autoAnnounceSignedTx);\n        _state_appState__WEBPACK_IMPORTED_MODULE_9__[\"AppState\"].chainAPI.transactionAPI.announce(lockFundsTransactionSigned);\n        _state_appState__WEBPACK_IMPORTED_MODULE_9__[\"AppState\"].isPendingTxnAnnounce = true;\n        /*  } */\n        return verify;\n    });\n}\nfunction getAggregateBondedTransactions(publicAccount) {\n    return _util_walletUtils__WEBPACK_IMPORTED_MODULE_3__[\"WalletUtils\"].getAggregateBondedTransactions(publicAccount);\n}\nfunction onPartial(publicAccount) {\n    return Object(tslib__WEBPACK_IMPORTED_MODULE_0__[\"__awaiter\"])(this, void 0, void 0, function* () {\n        let isPartial = new Promise((resolve, reject) => {\n            getAggregateBondedTransactions(publicAccount).then((txOnpartial) => {\n                if (txOnpartial !== null && txOnpartial.length > 0) {\n                    for (const tx of txOnpartial) {\n                        for (let i = 0; i < tx.innerTransactions.length; i++) {\n                            if (tx.innerTransactions[i].signer.publicKey === publicAccount.publicKey) {\n                                resolve(true);\n                                break;\n                            }\n                        }\n                    }\n                }\n            }).catch(error => {\n                /* reject('Err: ' + error) */\n            });\n        });\n        let result = yield isPartial;\n        return Boolean(result);\n    });\n}\nfunction getMultisigAccountGraphInfo(address) {\n    return _util_walletUtils__WEBPACK_IMPORTED_MODULE_3__[\"WalletUtils\"].getMultisigAccGraphInfo(tsjs_xpx_chain_sdk__WEBPACK_IMPORTED_MODULE_2__[\"Address\"].createFromRawAddress(address));\n}\nfunction checkIsMultiSig(accountAddress) {\n    /* let account = walletState.currentLoggedInWallet.accounts.find(element=>element.address ===accountAddress)?walletState.currentLoggedInWallet.accounts.find(element=>element.address ===accountAddress):  walletState.currentLoggedInWallet.others.find(element=>element.address ===accountAddress) */\n    let wallet = _state_walletState__WEBPACK_IMPORTED_MODULE_4__[\"walletState\"].currentLoggedInWallet;\n    let account;\n    if (wallet.accounts.find(element => element.address === accountAddress) === undefined && wallet.others.find(element => element.address === accountAddress) === undefined) {\n        account = null;\n    }\n    else if (wallet.accounts.find(element => element.address === accountAddress) === undefined) {\n        account = wallet.others.find(element => element.address === accountAddress);\n    }\n    else if (wallet.others.find(element => element.address === accountAddress) === undefined) {\n        account = wallet.accounts.find(element => element.address === accountAddress);\n    }\n    let verify = false;\n    verify = account.getDirectParentMultisig().length ? true : false;\n    return Boolean(verify);\n}\nfunction checkHasMultiSig(accountAddress) {\n    /* let account = walletState.currentLoggedInWallet.accounts.find(element=>element.address ===accountAddress)?walletState.currentLoggedInWallet.accounts.find(element=>element.address ===accountAddress):  walletState.currentLoggedInWallet.others.find(element=>element.address ===accountAddress) */\n    let wallet = _state_walletState__WEBPACK_IMPORTED_MODULE_4__[\"walletState\"].currentLoggedInWallet;\n    let account;\n    if (wallet.accounts.find(element => element.address === accountAddress) === undefined && wallet.others.find(element => element.address === accountAddress) === undefined) {\n        account = null;\n    }\n    else if (wallet.accounts.find(element => element.address === accountAddress) === undefined) {\n        account = wallet.others.find(element => element.address === accountAddress);\n    }\n    else if (wallet.others.find(element => element.address === accountAddress) === undefined) {\n        account = wallet.accounts.find(element => element.address === accountAddress);\n    }\n    let verify = false;\n    let tempArr = account.multisigInfo.filter(account => account.level == -1);\n    verify = tempArr.length > 0 ? true : false;\n    return Boolean(verify);\n}\nfunction getCosignerInWallet(publicKey) {\n    let accounts = _state_walletState__WEBPACK_IMPORTED_MODULE_4__[\"walletState\"].currentLoggedInWallet.accounts.map((acc) => {\n        return {\n            publicKey: acc.publicKey,\n            isMultisig: acc.getDirectParentMultisig().length ? true : false,\n            multisigInfo: acc.multisigInfo,\n        };\n    });\n    let otherAccounts = _state_walletState__WEBPACK_IMPORTED_MODULE_4__[\"walletState\"].currentLoggedInWallet.others.filter((acc) => acc.type === \"MULTISIG\").map((acc) => {\n        return {\n            publicKey: acc.publicKey,\n            isMultisig: true,\n            multisigInfo: acc.multisigInfo,\n        };\n    });\n    let totalAcc = accounts.concat(otherAccounts);\n    let foundAcc = totalAcc.find(acc => acc.publicKey == publicKey);\n    let allTopCosignerList = [];\n    totalAcc.forEach(acc => {\n        if (!acc.isMultisig && acc.multisigInfo.filter(acc => acc.level == -1).length > 0) {\n            allTopCosignerList.push(acc);\n        }\n    });\n    let multisigDepth = _state_networkState__WEBPACK_IMPORTED_MODULE_5__[\"networkState\"].currentNetworkProfileConfig.maxMultisigDepth;\n    let filteredCosignerList = [];\n    for (let i = 1; i <= multisigDepth; i++) {\n        let multisigLevel = foundAcc.multisigInfo.filter(acc => acc.level == i);\n        multisigLevel.forEach(info => {\n            allTopCosignerList.forEach(acc => {\n                if (acc.publicKey == info.publicKey) {\n                    filteredCosignerList.push(info.publicKey);\n                }\n            });\n        });\n    }\n    let hasCosigner = false;\n    if (filteredCosignerList.length > 0) {\n        hasCosigner = true;\n    }\n    return { hasCosigner: hasCosigner, cosignerList: filteredCosignerList };\n}\n/* function enableACT (account: WalletAccount|OtherAccount, addedCosigners : string[],signersInWallet? : number) :boolean{\n  let enoughSigner= false\n  \n  let count = Math.max(account.multisigInfo.find(acc=>acc.level==0).minApproval,account.multisigInfo.find(acc=>acc.level==0).minRemoval)\n  if(signersInWallet!=undefined){\n    if (count<=signersInWallet){\n      enoughSigner = true\n    }\n  }\n  let number =0\n  let allAddedCosignInWallet = false\n  for(let signer of addedCosigners){\n    let findAcc =  walletState.currentLoggedInWallet.accounts.find(element => element.publicKey === signer) || walletState.currentLoggedInWallet.accounts.find(element => element.address == signer)\n    if(findAcc!=undefined){\n      number++\n      if(findAcc.getDirectParentMultisig().length>0){\n        number--\n      }\n    }\n  }\n \n  if(number==addedCosigners.length){\n    allAddedCosignInWallet=true\n  }\n  if (enoughSigner==true && allAddedCosignInWallet){\n    return true\n  }else if(signersInWallet==undefined && allAddedCosignInWallet){\n    return true\n  }else{\n    return false\n  }\n} */\n// modify multisig\nfunction modifyMultisigAccount(coSign, removeCosign, numApproveTransaction, numDeleteUser, cosigners, multisigAccount, walletPassword) {\n    var _a;\n    return Object(tslib__WEBPACK_IMPORTED_MODULE_0__[\"__awaiter\"])(this, void 0, void 0, function* () {\n        let verify = _util_walletUtils__WEBPACK_IMPORTED_MODULE_3__[\"WalletUtils\"].verifyWalletPassword(_state_walletState__WEBPACK_IMPORTED_MODULE_4__[\"walletState\"].currentLoggedInWallet.name, _state_networkState__WEBPACK_IMPORTED_MODULE_5__[\"networkState\"].chainNetworkName, walletPassword);\n        if (!verify) {\n            return verify;\n        }\n        const multisigCosignatory = [];\n        const cosignatory = [];\n        for (let [index, cosignKey] of coSign.entries()) {\n            if (cosignKey.length == 64) {\n                cosignatory[index] = tsjs_xpx_chain_sdk__WEBPACK_IMPORTED_MODULE_2__[\"PublicAccount\"].createFromPublicKey(cosignKey, networkType);\n            }\n            else if (cosignKey.length == 40 || cosignKey.length == 46) {\n                // option to accept address\n                let address = tsjs_xpx_chain_sdk__WEBPACK_IMPORTED_MODULE_2__[\"Address\"].createFromRawAddress(cosignKey);\n                try {\n                    let publicKey;\n                    publicKey = yield getPublicKey(address);\n                    cosignatory[index] = tsjs_xpx_chain_sdk__WEBPACK_IMPORTED_MODULE_2__[\"PublicAccount\"].createFromPublicKey(publicKey, networkType);\n                }\n                catch (error) {\n                    console.log(error);\n                }\n            }\n            multisigCosignatory.push(new tsjs_xpx_chain_sdk__WEBPACK_IMPORTED_MODULE_2__[\"MultisigCosignatoryModification\"](tsjs_xpx_chain_sdk__WEBPACK_IMPORTED_MODULE_2__[\"MultisigCosignatoryModificationType\"].Add, cosignatory[index]));\n        }\n        removeCosign.forEach((element, index) => {\n            cosignatory[coSign.length + index] = tsjs_xpx_chain_sdk__WEBPACK_IMPORTED_MODULE_2__[\"PublicAccount\"].createFromPublicKey(element, networkType);\n            multisigCosignatory.push(new tsjs_xpx_chain_sdk__WEBPACK_IMPORTED_MODULE_2__[\"MultisigCosignatoryModification\"](tsjs_xpx_chain_sdk__WEBPACK_IMPORTED_MODULE_2__[\"MultisigCosignatoryModificationType\"].Remove, cosignatory[coSign.length + index]));\n        });\n        let relativeNumApproveTransaction = numApproveTransaction - multisigAccount.multisigInfo.find(element => element.level === 0).minApproval;\n        let relativeNumDeleteUser = numDeleteUser - multisigAccount.multisigInfo.find(element => element.level === 0).minRemoval;\n        const txBuilder = _state_appState__WEBPACK_IMPORTED_MODULE_9__[\"AppState\"].buildTxn;\n        const modifyMultisigTransaction = txBuilder.modifyMultisigAccount(relativeNumApproveTransaction, relativeNumDeleteUser, multisigCosignatory);\n        let coSigner = [];\n        cosigners.forEach((signer) => {\n            const accountDetails = _state_walletState__WEBPACK_IMPORTED_MODULE_4__[\"walletState\"].currentLoggedInWallet.accounts.find(element => element.address === signer.address);\n            let privateKey = _util_walletUtils__WEBPACK_IMPORTED_MODULE_3__[\"WalletUtils\"].decryptPrivateKey(new tsjs_xpx_chain_sdk__WEBPACK_IMPORTED_MODULE_2__[\"Password\"](walletPassword), accountDetails.encrypted, accountDetails.iv);\n            coSigner.push(tsjs_xpx_chain_sdk__WEBPACK_IMPORTED_MODULE_2__[\"Account\"].createFromPrivateKey(privateKey, networkType));\n        });\n        /*  if (enableACT(multisigAccount,coSign,cosigners.length,)) {\n           let firstCosigner = walletState.currentLoggedInWallet.accounts.find(acc=>acc.address==coSigner[0].address.plain())\n           let cosignerPrivateKey = WalletUtils.decryptPrivateKey(new Password(walletPassword), firstCosigner.encrypted, firstCosigner.iv);\n           coSigner.splice(0,1)\n           let account = Account.createFromPrivateKey(cosignerPrivateKey,networkType)\n           coSign.forEach(signer=>{\n             const accountDetails = walletState.currentLoggedInWallet.accounts.find(element => element.publicKey === signer)\n             let privateKey = WalletUtils.decryptPrivateKey(new Password(walletPassword), accountDetails.encrypted, accountDetails.iv);\n             coSigner.push(Account.createFromPrivateKey(privateKey, networkType));\n           })\n           \n           aggregateTransaction = AggregateTransaction.createComplete(\n             Deadline.create(),\n             [modifyMultisigTransaction.toAggregate(PublicAccount.createFromPublicKey(multisigAccount.publicKey,networkType))],\n             networkType,\n             []\n           )\n           let signedAggregateCompleteTransaction = account.signTransactionWithCosignatories(\n             aggregateTransaction,coSigner,generationHash\n           )\n           let transactionHttp = new TransactionHttp(NetworkStateUtils.buildAPIEndpointURL(networkState.selectedAPIEndpoint));\n           transactionHttp\n           .announce(signedAggregateCompleteTransaction)\n           .subscribe(x => console.log(x), err => console.error(err))\n           \n         }else{  */\n        let aggregateBondedTransaction = txBuilder.aggregateBonded([modifyMultisigTransaction.toAggregate(tsjs_xpx_chain_sdk__WEBPACK_IMPORTED_MODULE_2__[\"PublicAccount\"].createFromPublicKey(multisigAccount.publicKey, networkType))]);\n        let firstCosigner = _state_walletState__WEBPACK_IMPORTED_MODULE_4__[\"walletState\"].currentLoggedInWallet.accounts.find(acc => acc.address == coSigner[0].address.plain());\n        let cosignerPrivateKey = _util_walletUtils__WEBPACK_IMPORTED_MODULE_3__[\"WalletUtils\"].decryptPrivateKey(new tsjs_xpx_chain_sdk__WEBPACK_IMPORTED_MODULE_2__[\"Password\"](walletPassword), firstCosigner.encrypted, firstCosigner.iv);\n        let firstSignerAccount = tsjs_xpx_chain_sdk__WEBPACK_IMPORTED_MODULE_2__[\"Account\"].createFromPrivateKey(cosignerPrivateKey, networkType);\n        coSigner.splice(0, 1);\n        const signedAggregateBondedTransaction = firstSignerAccount.signTransactionWithCosignatories(aggregateBondedTransaction, coSigner, generationHash);\n        const nativeTokenNamespace = _state_networkState__WEBPACK_IMPORTED_MODULE_5__[\"networkState\"].currentNetworkProfile.network.currency.namespace;\n        const lockingAtomicFee = (_a = _state_networkState__WEBPACK_IMPORTED_MODULE_5__[\"networkState\"].currentNetworkProfileConfig.lockedFundsPerAggregate) !== null && _a !== void 0 ? _a : 0;\n        const lockFundsTransaction = txBuilder.hashLock(new tsjs_xpx_chain_sdk__WEBPACK_IMPORTED_MODULE_2__[\"Mosaic\"](new tsjs_xpx_chain_sdk__WEBPACK_IMPORTED_MODULE_2__[\"NamespaceId\"](nativeTokenNamespace), tsjs_xpx_chain_sdk__WEBPACK_IMPORTED_MODULE_2__[\"UInt64\"].fromUint(lockingAtomicFee)), tsjs_xpx_chain_sdk__WEBPACK_IMPORTED_MODULE_2__[\"UInt64\"].fromUint(1000), signedAggregateBondedTransaction);\n        const lockFundsTransactionSigned = firstSignerAccount.sign(lockFundsTransaction, generationHash);\n        let autoAnnounceSignedTx = new _state_listenerState__WEBPACK_IMPORTED_MODULE_8__[\"AutoAnnounceSignedTransaction\"](signedAggregateBondedTransaction);\n        autoAnnounceSignedTx.hashAnnounceBlock = new _state_listenerState__WEBPACK_IMPORTED_MODULE_8__[\"HashAnnounceBlock\"](lockFundsTransactionSigned.hash);\n        autoAnnounceSignedTx.hashAnnounceBlock.annouceAfterBlockNum = 1;\n        autoAnnounceSignedTx.type = _state_listenerState__WEBPACK_IMPORTED_MODULE_8__[\"AnnounceType\"].BONDED;\n        _state_utils_listenerStateUtils__WEBPACK_IMPORTED_MODULE_7__[\"ListenerStateUtils\"].addAutoAnnounceSignedTransaction(autoAnnounceSignedTx);\n        _state_appState__WEBPACK_IMPORTED_MODULE_9__[\"AppState\"].chainAPI.transactionAPI.announce(lockFundsTransactionSigned);\n        _state_appState__WEBPACK_IMPORTED_MODULE_9__[\"AppState\"].isPendingTxnAnnounce = true;\n        /*  } */\n        return verify;\n    });\n}\n//level 1 = cosigner\nconst multiSign = Object(vue__WEBPACK_IMPORTED_MODULE_1__[\"readonly\"])({\n    // config,\n    getCosignerInWallet,\n    getPublicKey,\n    generateContact,\n    verifyContactPublicKey,\n    convertAccount,\n    onPartial,\n    checkIsMultiSig,\n    checkHasMultiSig,\n    getMultisigAccountGraphInfo,\n    modifyMultisigAccount,\n    getAggregateFee,\n    /* enableACT */\n});\n\n\n//# sourceURL=webpack:///./src/util/multiSignatory.ts?");

/***/ })

}]);