<template>
  <div v-if="showNoBalance" class="rounded-md bg-red-200 w-full p-2 flex items-center justify-center">
        <div class="rounded-full w-5 h-5 border border-red-500 inline-block relative mr-2"><font-awesome-icon icon="times" class="text-red-500 h-3 w-3 absolute" style="top: 3px; left:4px"></font-awesome-icon></div><div class="inline-block text-xs">{{$t('general.insufficientBalance')}}</div>
      </div>
      <div v-else-if="isNotCosigner" class="rounded-md bg-yellow-200 w-full p-2 flex items-center justify-center">
        <div class="rounded-full w-5 h-5 bg-yellow-100 inline-block relative mr-2"><font-awesome-icon icon="exclamation" class="text-yellow-500 h-3 w-3 absolute" style="top: 5px; left:7px"></font-awesome-icon></div><div class="inline-block text-xs">{{$t('general.noCosigner')}}</div>
      </div>
      <div class="error error_box" v-if="errorMessage!=''">{{ errorMessage }}</div>
      <div class="text-right w-full">
        <div v-if="getMultiSigCosigner?getMultiSigCosigner.cosignerList.length:0 > 0" class="inline-block">
          <div class="text-tsm text-left mt-3">{{$t('general.initiateBy')}}:
            <span class="font-bold" v-if="getMultiSigCosigner.cosignerList.length == 1">{{ getMultiSigCosigner.cosignerList[0].name }} ({{$t('general.balance')}}: {{ Helper.amountFormatterSimple(getMultiSigCosigner.cosignerList[0].balance, 0) }} {{ currentNativeTokenName }}) <span v-if="getMultiSigCosigner.cosignerList[0].balance < lockFundTotalFee" class="error">- {{$t('general.insufficientBalance')}}</span></span>
            <span class="font-bold" v-else><select v-model="cosignerAccAddress"><option v-for="(cosigner, item) in getMultiSigCosigner.cosignerList" :value="cosigner.address" :key="item">{{ cosigner.name }} ({{$t('general.balance')}}: {{ cosigner.balance }} {{ currentNativeTokenName }})</option></select></span>
            <div v-if="cosignerBalanceInsufficient" class="error">- {{$t('general.insufficientBalance')}}</div>
          </div>
        </div>
      </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { Helper } from '@/util/typeHelper';
import { computed, ref, watch, getCurrentInstance } from 'vue';
import { AppState } from '@/state/appState';
import { networkState } from '@/state/networkState';
import { findAcc, findAccWithAddress, isMultiSig, TransactionUtils } from '@/util/transactionUtils';
import { MultisigUtils } from '@/util/multisigUtils';

const props = defineProps({
  cosignerAddress: {
    type: String,
    required: true
  },
  showNoBalance: {
    type: Boolean,
    required: true
  },
  errorMessage: {
    type: String,
    required: true
  },
  selectedAcc: {
    type: Object,
    required: true
  },
  cosignerBalanceInsufficient: {
    type: Boolean,
    required: true
  }
})
const emit = defineEmits(["select-cosigner","get-multisig-cosigner","check-cosigner","check-cosign-balance","check-lock-fund", "check-total-lock-fund"]);

const { t } = useI18n();
const internalInstance = getCurrentInstance();
const emitter = internalInstance.appContext.config.globalProperties.emitter;
const currentNativeTokenName = computed(()=> AppState.nativeToken.label);
const cosignerAccAddress = ref(props.cosignerAddress)

const getMultiSigCosigner = computed(()=>{
      if(!props.selectedAcc){
        return {hasCosigner:false,cosignerList: []}
      }
      if(networkState.currentNetworkProfileConfig){
        let cosigners = MultisigUtils.getCosignerInWallet(props.selectedAcc?props.selectedAcc.publicKey:'');
        let list = [];
        cosigners.cosignerList.forEach( publicKey => {
          list.push({
            publicKey,
            name: findAcc(publicKey).name,
            balance: findAcc(publicKey).balance,
            address: findAcc(publicKey).address
          });
        });
        emitter.emit("get-multisig-cosigner",{hasCosigner:cosigners.hasCosigner,cosignerList:list})
        return {hasCosigner:cosigners.hasCosigner,cosignerList:list}
      }else{
        emitter.emit("get-multisig-cosigner",{hasCosigner:false,cosignerList: []})
        return {hasCosigner:false,cosignerList: []}
      }
    })
    
const lockFund = computed(()=> {
    if(networkState.currentNetworkProfileConfig){
      return Helper.convertToExact(networkState.currentNetworkProfileConfig.lockedFundsPerAggregate, AppState.nativeToken.divisibility)
    }else{
      return 0
    }
  })
const lockFundTxFee = computed(()=>{
  if(networkState.currentNetworkProfile){ 
    let txFee = Helper.convertToExact(TransactionUtils.getLockFundFee(), AppState.nativeToken.divisibility);
    return txFee;
  }
  return 0;  
});

const lockFundTotalFee = computed(()=> {
  return lockFund.value + lockFundTxFee.value
});

emitter.emit("check-lock-fund",lockFundTxFee.value)
emitter.emit("check-total-lock-fund",lockFundTotalFee.value)

cosignerAccAddress.value = getMultiSigCosigner.value.cosignerList.length>0?getMultiSigCosigner.value.cosignerList[0].address:''
let cosignBalance = findAccWithAddress(cosignerAccAddress.value)?findAccWithAddress(cosignerAccAddress.value).balance:0;

const isNotCosigner = computed(() => (getMultiSigCosigner.value?getMultiSigCosigner.value.cosignerList.length: 0) == 0 && isMultiSig(props.selectedAcc));

watch(lockFundTxFee, (newValue,oldValue)=>{
  if(newValue !== oldValue){
    emitter.emit("check-lock-fund",newValue)
  }
})

watch(lockFundTotalFee, (newValue,oldValue)=>{
  if(newValue !== oldValue){
    emitter.emit("check-total-lock-fund",newValue)
  }
})

watch(getMultiSigCosigner,n=>{
    if(n){
      if(n.cosignerList.length>0){
          cosignerAccAddress.value = n.cosignerList.length>0?getMultiSigCosigner.value.cosignerList[0].address:''
          let cosignBalance = findAccWithAddress(cosignerAccAddress.value)?findAccWithAddress(cosignerAccAddress.value).balance:0;
          emitter.emit("check-cosign-balance",Helper.toCurrencyFormat(cosignBalance,AppState.nativeToken.divisibility))
      }
    }
  })

  watch(cosignerAccAddress, (newValue,oldValue)=>{
      if(newValue !== oldValue){
          let cosignBalance = findAccWithAddress(newValue)?findAccWithAddress(newValue).balance:0;
          emitter.emit("check-cosign-balance",Helper.toCurrencyFormat(cosignBalance,AppState.nativeToken.divisibility))
          emitter.emit("select-cosigner",newValue)
      }
      else{
          let cosignBalance = findAccWithAddress(oldValue)?findAccWithAddress(oldValue).balance:0;
          emitter.emit("check-cosign-balance",Helper.toCurrencyFormat(cosignBalance,AppState.nativeToken.divisibility))
          emitter.emit("select-cosigner",oldValue)
      }
  })

  emitter.emit("check-lock-fund",lockFundTxFee.value)
  emitter.emit("check-total-lock-fund",lockFundTotalFee.value)
  emitter.emit("check-cosign-balance",Helper.toCurrencyFormat(cosignBalance,AppState.nativeToken.divisibility))
  emitter.emit("check-cosigner",isNotCosigner.value)
</script>