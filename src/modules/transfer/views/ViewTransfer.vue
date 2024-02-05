<template>
    <div>
        <Sidebar v-model:visible="toggleContact" :baseZIndex="10000" position="full">
            <SelectAccountAndContact :contacts="contacts" @node-select="onNodeSelect" />
        </Sidebar>
        <ConfirmSendModal :toggleModal="toggleConfirm" />
        <div class='w-10/12 ml-auto mr-auto mt-5'>
            <div class="border filter shadow-lg xl:grid xl:grid-cols-3 mt-8">
                <div class="xl:col-span-2 p-12">
                    <div v-if="showBalanceErr"
                        class="mb-3 rounded-md bg-red-200 w-full p-2 flex items-center justify-center">
                        <div class="rounded-full w-5 h-5 border border-red-500 inline-block relative mr-2">
                            <font-awesome-icon icon="times" class="text-red-500 h-3 w-3 absolute"
                                style="top: 3px; left:4px"></font-awesome-icon></div>
                        <div class="inline-block text-xs">{{ $t('general.insufficientBalance') }}</div>
                    </div>
                    <div class="text-sm font-semibold ">{{ $t('transfer.newTransfer') }}</div>
                    <div class="flex gap-1 mt-3 items-center">
                        <SelectInputAccount :type="'transfer'" />
                        <SelectInputMultisigAccount :selected-address="selectedAddress" />
                    </div>
                    <div v-if="selectedMultisigAddress" class="mt-3">
                        <MultisigInput :select-default-address="selectedMultisigAddress" :select-default-name="selectedMultisigName" :type="'transfer'"/>
                    </div>
                    <div class="text-blue-primary font-semibold uppercase mt-3 text-xxs">Transfer to</div>

                    <div class="flex mt-1 gap-1">
                        <FieldValidationInput :placeholder="$t('transfer.transferPlaceholder')" v-model="recipientInput"
                            v-debounce:1000="checkRecipient" :showError="showAddressError" />
                        <div @click="toggleContact = !toggleContact"
                            class=' border rounded-md cursor-pointer flex flex-col justify-center  p-1.5  '>
                            <font-awesome-icon icon="id-card-alt"
                                class=" text-blue-primary ml-auto mr-auto "></font-awesome-icon>
                            <div class='text-xxs text-blue-primary font-semibold uppercase ml-auto mr-auto'>{{
                                $t('general.select') }}</div>
                            <div class='text-xxs text-blue-primary font-semibold uppercase ml-auto mr-auto'>{{
                                $t('general.contact') }}</div>
                        </div>
                    </div>
                    <div v-for="(_, index) in selectedAssets" :key="index">
                        <SelectInputAsset class="mt-3" :asset-options="assetOptions" :index="index"
                            :selected-assets="selectedAssets" />
                        <TransferInputClean class="mt-3" v-if="selectedAssets[index].id?.length == 16"
                            v-model="selectedAssets[index].amount" :placeholder="$t('transfer.assetAmount')" type="text"
                            :decimal="selectedAssets[index].divisibility" />
                    </div>
                    <button v-if="selectedAssets.length != assetOptions.length"
                        class="my-2 font-semibold text-xs text-blue-primary outline-none focus:outline-none disabled:opacity-50"
                        @click="selectedAssets.push({ id: null, balance: 0, amount: '0', namespace: '', divisibility: 0 })">
                        + {{ $t('transfer.addAssets') }}
                    </button>
                    <div v-else class="h-3" />
                    <TransferInputClean v-model="nativeAmount" :balance="nativeTokenBalance"
                        :placeholder="$t('transfer.transferAmount')" :logo="true" type="text"
                        @clickedMaxAvailable="updateAmountToMax()" :decimal="6" />

                    <TextAreaInput v-model="message" :limit="messageLimit" :placeholder="$t('general.message')"
                        :current-bytes="currentBytes" />
                    <div class="mb-5" v-if="!showAddressError">
                        <input id="encryptedMsg" type="checkbox" v-model="isEncrypted" />
                        <label for="encryptedMsg" class="cursor-pointer font-bold ml-4 mr-5 text-tsm">
                            {{ $t('transfer.enableEncryption') }}
                        </label>
                    </div>
                    <FieldValidationInput v-if="!showAddressError && requirePublicKey && isEncrypted && currentBytes > 0"
                        placeholder="Recipient Public Key" v-model="publicKeyInput" v-debounce:1000="checkPublicKey"
                        :showError="showPublicKeyError" />

                </div>
                <div class='bg-navy-primary py-6 px-6 xl:col-span-1'>
                    <TxnSummary :signer-native-token-balance="signerNativeTokenBalance"
                        :native-amount="nativeAmount" :native-token-balance="nativeTokenBalance" :lock-fund="lockFund"
                        :lock-fund-tx-fee="lockFundTxFee" :selected-multisig-address="selectedMultisigAddress"
                        :txn-fee="txnFee" :total-fee="totalFee" :selected-assets="selectedAssets" />
                    <div class='font-semibold text-xs text-white mb-1.5'>{{ $t('general.enterPasswordContinue') }}</div>
                    <PasswordInput :placeholder="$t('general.enterPassword')" :errorMessage="$t('general.passwordRequired')"
                        v-model="walletPassword" icon="lock" class="mt-5 mb-3" />
                    <button type="submit" class="w-full blue-btn px-3 py-3 disabled:opacity-50 disabled:cursor-auto"
                        :disabled="disableCreate" @click="makeTransferPayload()">
                        {{ $t('general.transfer') }}
                    </button>
                    <div class="text-center">
                        <router-link :to="{ name: 'ViewDashboard' }" class="content-center text-xs text-white underline">{{
                            $t('general.cancel') }}</router-link>
                    </div>
                </div>
            </div>

        </div>

    </div>
</template>

<script setup lang="ts">

import { ref, getCurrentInstance, computed, watch } from 'vue';
import SelectInputAccount from '../components/SelectInputAccount.vue';
import SelectInputMultisigAccount from '../components/SelectInputMultisigAccount.vue';
import MultisigInput from "../components/MultisigInput.vue"
import { Helper } from '@/util/typeHelper';
import { AppState } from '@/state/appState';
import { walletState } from '@/state/walletState';
import { Address, EncryptedMessage, Message, Mosaic, MosaicId, Password, PlainMessage, PublicAccount, UInt64 } from 'tsjs-xpx-chain-sdk';
import SelectAccountAndContact from "@/components/SelectAccountAndContact.vue";
import { useI18n } from 'vue-i18n';
import type {TreeNode } from "primevue/treenode"
import SelectInputAsset from '../components/SelectInputAsset.vue';
import TransferInputClean from "@/modules/transfer/components/TransferInputClean.vue"
import PasswordInput from "@/components/PasswordInput.vue";
import { networkState } from '@/state/networkState';
import { TransactionUtils } from '@/util/transactionUtils';
import TextAreaInput from '../components/TextAreaInput.vue';
import FieldValidationInput from '../components/FieldValidationInput.vue';
import { TransferUtils } from '@/util/transferUtils';
import TxnSummary from '@/components/TxnSummary.vue';
import { useToast } from 'primevue/usetoast';
import { useRouter } from 'vue-router';
import ConfirmSendModal from "@/modules/transfer/components/ConfirmSendModal.vue";
import { WalletUtils } from '@/util/walletUtils';
import { TransactionState } from '@/state/transactionState'
import { WalletAccount } from '@/models/walletAccount';

const addressPatternShort = "^[0-9A-Za-z]{40}$";

const addressPatternLong = "^[0-9A-Za-z-]{46}$";

const passwdPattern = "^[^ ]{8,}$";

const internalInstance = getCurrentInstance();

const { t } = useI18n();

const emitter = internalInstance.appContext.config.globalProperties.emitter;

const selectedMultisigAddress = ref<string | null>(null)

const selectedMultisigName = ref<string | null>(null)

const selectedAddress = ref<string | null>(null)

const toggleContact = ref(false)

const toggleConfirm = ref(false);

const recipientInput = ref('')

const isEncrypted = ref(false)

const requirePublicKey = ref(false);

const walletPassword = ref('')

const showAddressError = ref(true);

const showPublicKeyError = ref(true)

const assetOptions = ref<{ id: string, balance: number, namespace: string, divisibility: number, hasUpdated: boolean }[]>([])

const selectedAssets = ref<{ id: string, balance: number, namespace: string, divisibility: number, amount: string }[]>([])

const nativeAmount = ref('0')

const nativeTokenBalance = ref(0)

const publicKeyInput = ref('')

const message = ref('')

const signerNativeTokenBalance = ref(0)

const disableCreate = computed(() => {
    return !(
        walletPassword.value.match(passwdPattern) &&
        !showAddressError.value
        && !showBalanceErr.value
        && currentBytes.value <= messageLimit.value
        && canEncrypt.value
    );
});

const canEncrypt = computed(() => {

    if (requirePublicKey.value && isEncrypted.value && currentBytes.value > 0 && showPublicKeyError.value) {
        return false
    }
    return true
})

watch(selectedAssets, n => {
    for (let i = 0; i < n.length; i++) {
        if (isNaN((parseFloat(n[i].amount)))) {
            n[i].amount = '0'
        }
    }
}, { deep: true })

watch(nativeAmount, n => {
    if (isNaN(parseFloat(n))) {
        nativeAmount.value = '0'
    }
})

const showBalanceErr = computed(() => {
    if (!selectedAddress.value) {
        return false
    }
    else if (selectedMultisigAddress.value) {
        if (parseFloat(nativeAmount.value) > nativeTokenBalance.value || !(selectedAssets.value.every(asset => parseFloat(asset.amount) <= asset.balance))) {
            return true
        } else if (totalFee.value > signerNativeTokenBalance.value) {
            return true
        } else {
            return false
        }
    } else {
        if (totalFee.value > nativeTokenBalance.value || !(selectedAssets.value.every(asset => parseFloat(asset.amount) <= asset.balance))) {
            return true
        } else {
            return false
        }
    }
})

const currentBytes = computed(() => message.value.length == 0 ? 0 : isEncrypted.value ? TransactionUtils.getFakeEncryptedMessageSize(message.value) : TransactionUtils.getPlainMessageSize(message.value))

const messageLimit = computed(
    () => networkState?.currentNetworkProfileConfig.maxMessageSize - 1
);

const lockFund = computed(() =>
    Helper.convertToExact(
        networkState?.currentNetworkProfileConfig.lockedFundsPerAggregate,
        AppState.nativeToken.divisibility
    )
);

const lockFundTxFee = computed(() => {
    if (networkState.currentNetworkProfile) {
        return Helper.convertToExact(TransactionUtils.getLockFundFee(), AppState.nativeToken.divisibility);
    }
    return 0;
});

const maxAmount = computed(() => {
    if (!selectedAddress.value) {
        return 0
    }
    let tokenDivisibility = AppState.nativeToken.divisibility
    if (!selectedMultisigAddress.value) {

        return Helper.convertNumberMinimumFormat(nativeTokenBalance.value - txnFee.value, tokenDivisibility)


    } else {
        return Helper.convertNumberMinimumFormat(nativeTokenBalance.value, tokenDivisibility)

    }
})

const totalFee = computed(() => {
    let tokenDivisibility = AppState.nativeToken.divisibility
    if (!selectedMultisigAddress.value) {
        if (tokenDivisibility == 0) {
            return Math.trunc(parseFloat(nativeAmount.value.replace(/,/g, '')) + txnFee.value)
        } else {
            return Math.round((parseFloat(nativeAmount.value.replace(/,/g, '')) + txnFee.value) * Math.pow(10, tokenDivisibility)) / Math.pow(10, tokenDivisibility)
        }
    } else {
        if (tokenDivisibility == 0) {
            return Math.trunc((txnFee.value + lockFundTxFee.value + lockFund.value))
        } else {
            return Math.round((txnFee.value + lockFundTxFee.value + lockFund.value) * Math.pow(10, tokenDivisibility)) / Math.pow(10, tokenDivisibility)
        }
    }
})

const txnFee = computed(() => {
    const assets = selectedAssets.value.map(asset => {
        return { id: asset.id, amount: asset.amount }
    })

    assets.push({ id: AppState.nativeToken.assetId, amount: nativeAmount.value })


    return selectedMultisigAddress.value ?
        TransferUtils.calculateAggregateFee(message.value, nativeAmount.value, assets, isEncrypted.value) : selectedAddress.value ?
            TransferUtils.calculateFee(message.value, nativeAmount.value, assets, isEncrypted.value) : 0

})

const updateAmountToMax = () => {
    nativeAmount.value = maxAmount.value.toString();
    nativeAmount.value = maxAmount.value.toString();
}

const clearInput = () => {
      selectedAddress.value = null;
      walletPassword.value = "";
      recipientInput.value = "";
      isEncrypted.value = false;
      message.value = "";
      nativeAmount.value = "0";
      emitter.emit("CLEAR_SELECT", 0);
      selectedAssets.value = [];
      selectedMultisigAddress.value = null;
      publicKeyInput.value = "";
    };

const toast = useToast()

const router = useRouter()

const createTransferTxn = async () => {
    const isPasswordCorrect = await TransferUtils.createTransaction(
            recipientInput.value,
            nativeAmount.value,
            message.value,
            selectedAssets.value.map(asset => {
                return {
                    id: asset.id,
                    amount: parseFloat(asset.amount),
                    divisibility: asset.divisibility
                }
            }),
            walletPassword.value,
            selectedAddress.value,
            selectedMultisigAddress.value,
            isEncrypted.value,
            publicKeyInput.value
        )
        if (!isPasswordCorrect) {
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: "Password is incorrect",
                group: 'br-custom',
                life: 1000
            });
            return
        }

        router.push({ name: "ViewAccountPendingTransactions", params: { address: selectedAddress.value } })
        clearInput()
}

const makeTransferPayload = async () => {
    // verify password
    let verify = WalletUtils.verifyWalletPassword(walletState.currentLoggedInWallet.name, networkState.chainNetworkName, walletPassword.value)

    if (!verify) {
        toast.add({
                severity: 'error',
                summary: 'Error',
                detail: "Password is incorrect",
                group: 'br-custom',
                life: 1000
            });
            return
    }
    else{
        let xpxAmount = parseFloat(nativeAmount.value) * Math.pow(10, AppState.nativeToken.divisibility);

        let mosaics = [];
        let mosaicsSent = selectedAssets.value.map(asset => {
                return {
                    id: asset.id,
                    amount: parseFloat(asset.amount),
                    divisibility: asset.divisibility
                }
            })
        if (xpxAmount > 0) {
        mosaics.push(new Mosaic(new MosaicId(AppState.nativeToken.assetId), UInt64.fromUint(Number(xpxAmount))));
        }
        if (mosaicsSent.length > 0) {
        mosaicsSent.forEach((mosaicSentInfo) => {
            if (mosaicSentInfo.amount > 0) {
            mosaics.push(
                new Mosaic(
                new MosaicId(mosaicSentInfo.id),
                UInt64.fromUint(Number(mosaicSentInfo.amount * Math.pow(10, mosaicSentInfo.divisibility)))
                )
            );
            }
        });
    }
        let transactionBuilder = AppState.buildTxn

        let initiatorAcc: WalletAccount = walletState.currentLoggedInWallet.accounts.find((element) => element.address === selectedAddress.value)

        let privateKey = WalletUtils.decryptPrivateKey(new Password(walletPassword.value), initiatorAcc.encrypted, initiatorAcc.iv)

        // sending encrypted message

        let msg :Message;

        if (isEncrypted.value &&  message.value.length>0) {
        try {
            const accountInfo = await AppState.chainAPI.accountAPI.getAccountInfo(Address.createFromRawAddress(recipientInput.value))
            msg = EncryptedMessage.create(message.value, accountInfo.publicAccount, privateKey);
        } catch (error) {
            msg = EncryptedMessage.create(message.value, PublicAccount.createFromPublicKey(publicKeyInput.value,AppState.networkType) , privateKey)
        }
        } else {
        msg = PlainMessage.create(message.value);
        }

        let transferTransaction = transactionBuilder.transferBuilder()
        .recipient(Address.createFromRawAddress(recipientInput.value))
        .mosaics(mosaics)
        .message(msg)
        .build()

        const nodeTime = await AppState.chainAPI.nodeAPI.getNodeTime(); 
        let transferPayload = TransactionUtils.signTxnWithPassword(selectedAddress.value,selectedMultisigAddress.value,walletPassword.value,transferTransaction, undefined, new UInt64(nodeTime.sendTimeStamp))

        TransactionState.lockHashPayload = transferPayload.hashLockTxnPayload
        TransactionState.transactionPayload = transferPayload.txnPayload
        TransactionState.selectedAddress = selectedAddress.value
        router.push({ name: "ViewConfirmTransaction" })
        
        clearInput()
    }
}

const makeTransfer = () => {
    if (nativeAmount.value == "0" && selectedAssets.value.length == 0) {
      toggleConfirm.value = true;
    } else {
        createTransferTxn()
    }
}

const fetchSignerNativeBalance = async () => {
    if (!AppState.chainAPI) {
        return
    }
    try {
        const accInfo = await AppState.chainAPI.accountAPI.getAccountInfo(Address.createFromRawAddress(selectedAddress.value))
        const findIndex = accInfo.mosaics.findIndex(asset => asset.id.toHex() == AppState.nativeToken.assetId)
        if (findIndex != -1) {
            signerNativeTokenBalance.value = accInfo.mosaics[findIndex].amount.compact() / Math.pow(10, AppState.nativeToken.divisibility)
            accInfo.mosaics.splice(findIndex, 1)
        } else {
            signerNativeTokenBalance.value = 0
        }
    } catch (_) {
        signerNativeTokenBalance.value = 0
    }
}

const fetchAssets = async (address: string) => {
    if (!AppState.chainAPI) {
        return
    }
    if (!address) {
        return
    }
    assetOptions.value = [];
    try {
        const accInfo = await AppState.chainAPI.accountAPI.getAccountInfo(Address.createFromRawAddress(address))
        const findIndex = accInfo.mosaics.findIndex(asset => asset.id.toHex() == AppState.nativeToken.assetId)
        if (findIndex != -1) {
            nativeTokenBalance.value = accInfo.mosaics[findIndex].amount.compact() / Math.pow(10, AppState.nativeToken.divisibility)
            accInfo.mosaics.splice(findIndex, 1)
        } else {
            nativeTokenBalance.value = 0
        }
        for (let i = 0; i < accInfo.mosaics.length; i++) {
            const asset = accInfo.mosaics[i];
            assetOptions.value.push({
                id: asset.id.toHex(),
                balance: asset.amount.compact(),
                divisibility: 0,
                namespace: '',
                hasUpdated: false
            })
        }
    } catch (error) {
        assetOptions.value = []
        nativeTokenBalance.value = 0
    }

}

watch(selectedAddress, async (n,o) => {
    assetOptions.value = [];
    selectedAssets.value = []
    //reload asset
    if(n == null){
        nativeTokenBalance.value = 0
        selectedMultisigName.value = null
        selectedMultisigAddress.value = null
    }
    else if(n != o){
        selectedMultisigName.value = null
        selectedMultisigAddress.value = null
        await fetchAssets(n)
    }
})

watch(selectedMultisigAddress, async (mn, mo) => {
    assetOptions.value = [];
    selectedAssets.value = []
    //reload multisig asset
    if(mn == null){
        signerNativeTokenBalance.value = 0
        selectedMultisigName.value = null
        selectedMultisigAddress.value = null
        await fetchAssets(selectedAddress.value)
    }
    if(mn != mo){
        await fetchSignerNativeBalance()
        await fetchAssets(mn)
    }
})

emitter.on("select-account", (address: string) => {
    selectedAddress.value = address
})

emitter.on("select-multisig-account", (node: TreeNode) => {
    selectedMultisigName.value = node.label
    selectedMultisigAddress.value = node.value
})

emitter.on("CLOSE_MULTISIG", () =>{
    selectedMultisigName.value = null
    selectedMultisigAddress.value = null
})

emitter.on("CLOSE_CONFIRM_SEND_MODAL", (emitValue: boolean) => {
    toggleConfirm.value = emitValue;
  });
emitter.on("CONFIRM_PROCEED_SEND", (emitValue: boolean) => {

  if (emitValue) {
    toggleConfirm.value = false
    createTransferTxn()
  }
});

const onNodeSelect = (node: TreeNode) => {
    toggleContact.value = false
    recipientInput.value = node.data
}

const contacts = computed(() => {
    const wallet = walletState.currentLoggedInWallet;

    if (!wallet) {
        return <{ key: string, label: string, selectable: boolean, children: { key: string, label: string, data: string }[] }[]>[];
    }
    const totalAcc = [...wallet.accounts, ...wallet.others]
    if (wallet.contacts.length) {
        return <{ key: string, label: string, selectable: boolean, children: { key: string, label: string, data: string }[] }[]>[{
            key: '0',
            label: t('general.ownerAcc'),
            selectable: false,
            children: totalAcc.map((acc, index) => {
                return {
                    key: "0-" + index.toString(),
                    label: acc.name,
                    data: Address.createFromRawAddress(acc.address).pretty(),
                    selectable: true
                }
            })
        }, {
            key: '1',
            label: t('general.contact'),
            selectable: false,
            children: wallet.contacts.map((contact, index) => {
                return {
                    key: "1-" + index.toString(),
                    label: contact.name,
                    data: Address.createFromRawAddress(contact.address).pretty(),
                    selectable: true
                }
            })
        }];
    }
    return <{ key: string, label: string, selectable: boolean, children: { key: string, label: string, data: string }[] }[]>[{
        key: '0',
        label: t('general.ownerAcc'),
        selectable: false,
        children: totalAcc.map((acc, index) => {
            return {
                key: "0-" + index.toString(),
                label: acc.name,
                data: Address.createFromRawAddress(acc.address).pretty(),
                selectable: true
            }
        })
    }]



});

watch([recipientInput, showAddressError], (m) => {

    if (m[0].match(addressPatternLong) || m[0].match(addressPatternShort)) {
        if (!m[1]) {
            checkEncryptable()
            return
        }
        checkRecipient()
    } else {
        showAddressError.value = true
    }
})

const checkEncryptable = () => {
    AppState.chainAPI.accountAPI.getAccountInfo(Address.createFromRawAddress(recipientInput.value)).then(accInfo => {
        requirePublicKey.value = accInfo.publicKey == '0'.repeat(64)
    }).catch(_ => requirePublicKey.value = true)

}

const checkPublicKey = () => {
    try {
        const publicAccount = PublicAccount.createFromPublicKey(publicKeyInput.value, AppState.networkType)
        if (publicAccount.address.plain() == Address.createFromRawAddress(recipientInput.value).plain()) {
            showPublicKeyError.value = false;
        }

    } catch (_) {
        showPublicKeyError.value = true
    }
}

const checkRecipient = () => {
    if (!walletState.currentLoggedInWallet) {
        return;
    }
    try {
        let recipientAddress = Helper.createAddress(recipientInput.value);
        let networkOk = Helper.checkAddressNetwork(recipientAddress, AppState.networkType);
        if (!networkOk) {
            showAddressError.value = true;
        } else {
            showAddressError.value = false
        }

    } catch (error) {
        try {
            let namespaceId = Helper.createNamespaceId(recipientInput.value);
            AppState.chainAPI.namespaceAPI.getLinkedAddress(namespaceId).then((address: Address) => {
                recipientInput.value = address.plain();
                showAddressError.value = false;
                /* checkEncryptable(recipientInput.value); */
            }).catch((_) => {
                showAddressError.value = true;
            });
        }
        catch (_) {
            showAddressError.value = true;
        }
    }
}

</script>