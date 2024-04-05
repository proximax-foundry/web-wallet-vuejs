<template>
 <div>
  <div class='w-10/12 ml-auto mr-auto'>
    <div class="border filter shadow-lg xl:grid xl:grid-cols-3 mt-8" >
      <div class="xl:col-span-2 p-12">
        <div class='font-semibold mb-4'>{{$t('asset.createAssets')}}</div>
        <div v-if="showNoBalance" class="rounded-md bg-red-200 w-full p-2 flex items-center justify-center">
          <div class="rounded-full w-5 h-5 border border-red-500 inline-block relative mr-2"><font-awesome-icon icon="times" class="text-red-500 h-3 w-3 absolute" style="top: 3px; left:4px"></font-awesome-icon></div><div class="inline-block text-xs">{{$t('general.insufficientBalance')}}</div>
        </div>
        <div class="error error_box" v-if="err!=''">{{ err }}</div>
        <div class="mt-4">
          <div class="flex gap-1 mt-3">
              <SelectInputAccount :type="'asset'" :label="'create asset'" @select-account="selectAccountAddress" @select-account-public-key="selectedAccountPublicKey" />
              <SelectInputMultisigAccount :selected-address="selectedAddress" @select-multisig-account="selectMultisigAccount" />
          </div>
          <div v-if="selectedMultisigAddress" class="mt-3">
            <MultisigInput :select-default-address="selectedMultisigAddress"
              :select-default-name="selectedMultisigName" :type="'asset'" @close-multisig="closeMultisig" />
          </div>
          <div class="lg:grid lg:grid-cols-2 mt-5">
            <div class="lg:mr-2"><SupplyInputClean :disabled="showNoBalance||disabledInput" v-model="supply" :balance="Number.MAX_VALUE" :placeholder="$t('general.supply')" type="text" @show-error="updateSupplyErr"  :decimal="Number(divisibility)" :toolTip="$t('asset.supplyMsg1') +' <br><br>' + $t('asset.supplyMsg2') + '<br>' + $t('asset.supplyMsg3')" /></div>
            <div class="lg:ml-2"><NumberInputClean :disabled="showNoBalance||disabledInput" v-model="divisibility" :max="6" :placeholder="$t('general.divisibility')" :showError="showDivisibilityErr"  :toolTip="$t('asset.divisibilityMsg1') +' <br><br>' + $t('asset.divisibilityMsg2') + '<br>' + $t('asset.divisibilityMsg3')" /></div>
          </div>
          <div class="lg:grid lg:grid-cols-2">
            <div class="mb-5 lg:mb-0 lg:mr-2"><CheckInput :disabled="showNoBalance||disabledInput" v-model="isTransferable" :title="$t('general.transferable')" :toolTip="$t('asset.transferableMsg')" @click="!showNoBalance?(isTransferable = !isTransferable):''"/></div>
            <div class="mb-5 lg:mb-0 lg:ml-2"><CheckInput :disabled="showNoBalance||disabledInput" v-model="isMutable" :title="$t('general.supplyMutable')" :toolTip="$t('asset.supplyMutableMsg')" @click="!showNoBalance?(isMutable = !isMutable):''" /></div>
          </div>
        </div>
      </div>
      <div class="bg-navy-primary py-6 px-6 xl:col-span-1">
        <TxnSummary :signer-native-token-balance="balance" :asset-rental-fee-currency="rentalFeeCurrency"
            :native-token-balance="selectedMultisigAddress ? multisigBalance : balance" :lock-fund="lockFund" :lock-fund-tx-fee="lockFundTxFee"
            :selected-multisig-address="selectedMultisigAddress" :txn-fee="transactionFeeExact" :total-fee="Number(totalFeeFormatted)"/>
        <button type="submit" class="mt-3 w-full blue-btn py-4 disabled:opacity-50 disabled:cursor-auto text-white" :disabled="disableCreate" @click="createAsset">{{$t('asset.createAssets')}}</button>
        <div class="text-center">
          <router-link :to="{name: 'ViewDashboard'}" class='content-center text-xs text-white border-b-2 border-white'>{{$t('general.cancel')}}</router-link>
        </div>
      </div>
    </div>

    <div class="sm:grid sm:grid-cols-2 mt-10 lg:mt-16">
      <div class="mb-8">
        <a href="https://bcdocs.xpxsirius.io/docs/built-in-features/mosaic/" target=_new class="sm:h-9 lg:h-5 text-blue-primary font-bold text-tsm flex items-start">{{$t('general.assetQues')}}</a>
        <div class="text-gray-400 text-xs lg:text-tsm my-3 sm:pr-2">{{$t('asset.assetAns')}}</div>
      </div>
      <div class="mb-8">
        <a href="https://t.me/proximaxhelpdesk" target=_new class="sm:h-9 lg:h-5 text-blue-primary font-bold text-tsm items-start flex">{{$t('general.feedback')}}</a>
        <div class="text-gray-400 text-tsm my-3">{{$t('general.feedbackDescription')}}</div>
      </div>
    </div>
  </div>
</div>
</template>

<script setup lang="ts">
import { computed, getCurrentInstance, ref, watch } from 'vue';
import { useRouter } from "vue-router";
import SelectInputAccount from '@/components/SelectInputAccount.vue';
import SelectInputMultisigAccount from '@/components/SelectInputMultisigAccount.vue';
import MultisigInput from "@/modules/transfer/components/MultisigInput.vue"
import SupplyInputClean from '@/components/SupplyInputClean.vue';
import CheckInput from '@/components/CheckInput.vue';
import NumberInputClean from '@/modules/services/submodule/assets/components/NumberInputClean.vue';
import TxnSummary from '@/components/TxnSummary.vue';
import {useI18n} from 'vue-i18n'
import { walletState } from "@/state/walletState";
import { networkState } from "@/state/networkState";
import { Helper } from '@/util/typeHelper';
import { AssetsUtils } from '@/util/assetsUtils';
import { WalletUtils } from '@/util/walletUtils';
import { AppState } from '@/state/appState';
import { TransactionUtils } from '@/util/transactionUtils';
import type { TreeNode } from 'primevue/treenode';
import { Address, MosaicSupplyType, PublicAccount, UInt64 } from 'tsjs-xpx-chain-sdk';
import { TransactionState } from '@/state/transactionState';

    const router = useRouter();

    const internalInstance = getCurrentInstance();
    const emitter = internalInstance.appContext.config.globalProperties.emitter;
    const showSupplyErr = ref(false);
    const {t} = useI18n();
    const err = ref('');
    const divisibility = ref('0');
    const showDivisibilityErr = ref(false);
    const isTransferable = ref(false);
    const isMutable = ref(false);
    const disabledInput = computed(() => disableAllInput.value)
    const disabledClear = ref(false);
    const disabledDuration = ref(false);
    const durationOption =ref('month');
    const duration = ref('1');
    const showDurationErr = ref(false);
    const durationCheckDisabled = ref(false);
    const supply = ref('0');
    const disableAllInput = ref(false);

    const ownerPublicAccount = ref<PublicAccount | null>()
    const multisigPublicAccount = ref<PublicAccount | null>()
    try {
      ownerPublicAccount.value = WalletUtils.createPublicAccount(walletState.currentLoggedInWallet?walletState.currentLoggedInWallet.selectDefaultAccount().publicKey:'', AppState.networkType)
    } catch (error) {
      console.log(error)
    }
    const transactionFee = ref('0')
    const transactionFeeExact = ref(0)
    try {
      transactionFee.value =  Helper.amountFormatterSimple(AssetsUtils.createAssetTransactionFee( ownerPublicAccount.value, Number(supply.value), isMutable.value, isTransferable.value, Number(divisibility.value)), AppState.nativeToken.divisibility);
      transactionFeeExact.value = Helper.convertToExact(AssetsUtils.createAssetTransactionFee( ownerPublicAccount.value, Number(supply.value), isMutable.value, isTransferable.value, Number(divisibility.value)), AppState.nativeToken.divisibility);
    } catch (error) {
      console.log(error)
    }
     
    const rentalFee = computed(()=>{
      if(networkState.currentNetworkProfileConfig){
        return  Helper.convertToExact(networkState.currentNetworkProfileConfig.mosaicRentalFee, AppState.nativeToken.divisibility)
      }else{
        return 0
      }
    })
    const rentalFeeCurrency = computed(()=> {
      if(networkState.currentNetworkProfileConfig){
        return Helper.convertToCurrency(networkState.currentNetworkProfileConfig.mosaicRentalFee, AppState.nativeToken.divisibility) 
      }else{
        return '0'
      }
    })
   const lockFund = computed(()=>{
      if(networkState.currentNetworkProfileConfig){
        return Helper.convertToExact(networkState.currentNetworkProfileConfig.lockedFundsPerAggregate, AppState.nativeToken.divisibility)
      }else{
        return 0
      }
    })

    const lockFundTxFee = computed(()=>{
      if(networkState.currentNetworkProfile){ 
        return Helper.convertToExact(TransactionUtils.getLockFundFee(), AppState.nativeToken.divisibility);
      }
      return 0;  
    });
    const lockFundTotalFee = computed(()=> lockFund.value + lockFundTxFee.value);

    const disableCreate = computed(() => !(
      (selectedAddress.value != null) && (divisibility.value != null) && (Number(supply.value) > 0) && (!showSupplyErr.value) && (!showDurationErr.value) && (!showNoBalance.value)
    ));

    const selectedMultisigAddress = ref<string | null>(null)
    const selectedMultisigName = ref<string | null>(null)
    const selectedAddress = ref<string | null>(null)
    const balance = ref(0);
    const multisigBalance = ref(0)

    const fetchAccountBalance = async (address: string) => {
      if (!AppState.chainAPI) {
        return
      }
      if (!address) {
        return
      }
      try {
        const accInfo = await AppState.chainAPI.accountAPI.getAccountInfo(Address.createFromRawAddress(address))
        const findIndex = accInfo.mosaics.findIndex(asset => asset.id.toHex() == AppState.nativeToken.assetId)
        if (findIndex != -1) {
          return accInfo.mosaics[findIndex].amount.compact() / Math.pow(10, AppState.nativeToken.divisibility)
        }
        else {
          return 0
        }
      }
      catch (e) {
        return 0
      }
    }

    const showNoBalance = computed(() => {
      if (!selectedAddress.value) {
        return
      }
      if(selectedMultisigAddress.value) {
        if(multisigBalance.value < (rentalFee.value)){
          return true
        }
        else if(balance.value < (transactionFeeExact.value + lockFundTotalFee.value)){
          return true
        }
        else{
          return false
        }
      } else {
        return balance.value < (rentalFee.value + transactionFeeExact.value) 
      }
    });

    if(balance.value < (rentalFee.value + transactionFeeExact.value)){
      disabledClear.value = true;
      disabledDuration.value = true;
      durationCheckDisabled.value = true;
    }else{
      disabledClear.value = false;
      disabledDuration.value = false;
      durationCheckDisabled.value = false;
    }

    const clearInput = () => {
      divisibility.value = '0';
      supply.value = '0';
      duration.value = '1';
      durationOption.value = 'month';
      disabledDuration.value = false;
      isTransferable.value = false;
      isMutable.value = false;
    };

    watch(selectedAddress, async (newValue, oldValue) => {
      if (newValue == null) {
        balance.value = 0
        clearInput()
        selectedMultisigName.value = null
        selectedMultisigAddress.value = null
        multisigPublicAccount.value = null
      }
      else if (newValue != oldValue) {
        clearInput()
        selectedMultisigName.value = null
        selectedMultisigAddress.value = null
        multisigPublicAccount.value = null
        balance.value = await fetchAccountBalance(newValue)
      }
    })

    watch(selectedMultisigAddress, async (multisigNewValue, multisigOldValue) => {
      if (multisigNewValue == null) {
        multisigBalance.value = 0
        clearInput()
        selectedMultisigName.value = null
        selectedMultisigAddress.value = null
        multisigPublicAccount.value = null
        balance.value = await fetchAccountBalance(selectedAddress.value)
      }
      else if (multisigNewValue != multisigOldValue) {
        clearInput()
        multisigBalance.value = await fetchAccountBalance(multisigNewValue)
      }
    })

    // calculate fees
    const totalFee = computed(() => {
      // if multisig
      if(selectedMultisigAddress){
        return lockFundTotalFee.value + transactionFeeExact.value;
      }else{
        return rentalFee.value + transactionFeeExact.value;
      }
    });

    const totalFeeFormatted = computed(() => {
      return Helper.amountFormatterSimple(totalFee.value, 0);
    });

    const updateSupplyErr = (bolError) => {
      showSupplyErr.value = bolError;
    }

    const createAsset = () => {
      if(selectedMultisigAddress.value){
        const assetDefinition = AppState.buildTxn.mosaicDefinition(multisigPublicAccount.value, isMutable.value, isTransferable.value, Number(divisibility.value));
        let supplyChangeType: MosaicSupplyType = MosaicSupplyType.Increase
        const assetSupplyChangeTx = AppState.buildTxn.buildMosaicSupplyChange(assetDefinition.mosaicId, supplyChangeType, UInt64.fromUint(AssetsUtils.addZeros(Number(divisibility.value), Number(supply.value))));
        const unsignedInnerTxn = [assetDefinition.serialize(),assetSupplyChangeTx.serialize()];
        TransactionState.unsignedTransactionPayload = unsignedInnerTxn
      }else{
        const assetDefinition = AppState.buildTxn.mosaicDefinition(ownerPublicAccount.value, isMutable.value, isTransferable.value, Number(divisibility.value));
        const assetDefinitionTx = assetDefinition.toAggregateV1(ownerPublicAccount.value);
        let supplyChangeType: MosaicSupplyType = MosaicSupplyType.Increase;
        const assetSupplyChangeTx = AppState.buildTxn.buildMosaicSupplyChange(assetDefinition.mosaicId, supplyChangeType, UInt64.fromUint(AssetsUtils.addZeros(Number(divisibility.value), Number(supply.value)))).toAggregateV1(ownerPublicAccount.value);
        let unsignedAssetAggregateTransaction = AppState.buildTxn.aggregateComplete([assetDefinitionTx, assetSupplyChangeTx]).serialize();
        TransactionState.unsignedTransactionPayload = unsignedAssetAggregateTransaction
      }
      clearInput();
      TransactionState.selectedAddress = selectedAddress.value
      TransactionState.selectedMultisigAddress = selectedMultisigAddress.value
      router.push({ name: "ViewConfirmTransaction" })
    };

    const selectAccountAddress = (address: string) => {
      selectedAddress.value = address
    }

    const selectedAccountPublicKey = (publicKey: string) => {
      ownerPublicAccount.value = WalletUtils.createPublicAccount(publicKey,AppState.networkType)
    }

    const selectMultisigAccount = (node: TreeNode) => {
        selectedMultisigName.value = node.label
        selectedMultisigAddress.value = node.value
        multisigPublicAccount.value = WalletUtils.createPublicAccount(node.publicKey,AppState.networkType)
    }

    const closeMultisig = () => {
        selectedMultisigName.value = null
        selectedMultisigAddress.value = null
    }

</script>
<style scoped>
/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type=number] {
  -moz-appearance: textfield;
}

::deep(.p-inputtext) {
      font-size: 1rem;
      text-align: left;
      padding: 0.5rem;
    }
</style>