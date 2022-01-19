<template>
  <div>
    <div class='flex cursor-pointer'>
      <img src='@/assets/img/chevron_left.svg'>
      <router-link :to='{name:"ViewTransactionStatus", params: {transactionType: "partial" }}' class='text-blue-primary text-xs mt-0.5'>Back</router-link>
    </div>
    <div class='md:w-8/12 lg:w-10/12 xl:w-6/12 ml-2 mr-2 md:ml-auto md:mr-auto mt-5'>
      <div class='border-2'>
        <div class='w-full text-center border-b-2 border-gray-200 p-10' v-if="isSigned">
          <div class="text-xl">No action Required</div>
          <div class="mt-5 text-tsm">You have already approved these transactions</div>
          <div class="mt-1 text-tsm font-bold">Deadline: {{ deadline }}</div>
        </div>
        <div class='w-full text-center border-b-2 border-gray-200 p-10' v-else-if="!invalidCosigner">
          <div class="text-xl">Action Required</div>
          <div class="mt-5 text-tsm">Would you like to approve this transaction? (highlighted in yellow)</div>
          <div class="mt-1 text-tsm font-bold">Deadline: {{ deadline }}</div>
        </div>
        <div class='w-full text-center border-b-2 border-gray-200' v-if="!invalidCosigner">
          <div v-for="(item, index) in innerTransactions" :key="index" class="lg:grid lg:grid-cols-3" :class="innerRelatedList[index] ? 'border-4 border-yellow-400' :'border-2 border-slate-600'">
            <div class="text-center">{{ item.typeName }}</div>
            <div>
              <div class="lg:h-28 lg:flex lg:items-center my-5 mb-10 lg:my-0 lg:mb-0">
                <div>
                  <div class="uppercase text-blue-primary text-xs font-bold">{{ innerSignersNameList[index] }}</div>
                  <div class="uppercase text-xs font-bold p-1">{{ item.signerAddressPretty }}</div>
                </div>
              </div>
              <div class="lg:h-28 flex text-center justify-center">
                <div class="lg:grid lg:grid-cols-3 lg:items-center">
                  <img src="@/modules/transaction/img/icon-line-sign.svg" class="rotate-90 transform mb-5 lg:mb-0 lg:-rotate-90 lg:transform-none">
                  <img v-if="innerSignedList[index]" src="@/modules/transaction/img/icon-signature-success.svg" class="relative" style="top: -3px;">
                  <img v-else src="@/modules/transaction/img/icon-signature.svg" class="relative" style="top: -3px;">
                  <img src="@/modules/transaction/img/icon-arrow-sign.svg" class="rotate-90 transform mt-3 lg:mt-0 lg:ml-2 lg:transform-none">
                </div>
              </div>
              <div class="lg:h-28 lg:flex lg:items-center my-5 lg:my-0">
                <div v-for="(info, infoIndex) in item.infos" :key="infoIndex">
                  <div v-if="info.label">{{ info.label }}: <br></div>
                  <div class="inline-block bg-blue-100 text-blue-700 font-bold text-txs py-1 px-2 my-1 mr-1 rounded" v-if="info.type === 3">{{ info.short ? info.short: info.value }}</div>
                  <div class="inline-block bg-green-200 text-green-700 font-bold text-txs py-1 px-2 my-1 mr-1 rounded" v-else-if="info.type === 1">{{ info.short ? info.short: info.value }}</div>
                  <div class="inline-block bg-red-200 text-red-700 font-bold text-txs py-1 px-2 my-1 mr-1 rounded" v-else-if="info.type === 2">{{ info.short ? info.short: info.value }}</div>
                  <div class="inline-block uppercase text-blue-primary text-xs font-bol">{{ info.short ? info.short: info.value }}</div>
                </div>
              </div>
            </div>   
            <div v-if="item.sdas.length > 0" class="text-center">
              <div v-for="(sdaString, sdaIndex) in item.sdas" :key="sdaIndex">
                <div>{{ sdaString }}</div>
              </div>
            </div>
          </div>
        </div>
        <div class='w-full text-center border-b-2 border-gray-200 py-5 text-tsm text-gray-500' v-else>
          This partial transaction is invalid for this account <b>{{ currentName }}</b>
        </div>
        <div class="flex items-center h-14 lg:h-28 justify-center">
          <router-link :to='{name:"ViewTransactionStatus", params: {transactionType: "partial" }}' class="text-gray-600 bg-white px-5 py-2 lg:px-10 lg:py-3 rounded-md text-xs lg:text-tsm inline-block border-2 border-gray-200 mr-5">Do this later</router-link>
          <CosignPasswordModal :transactionHash = 'txnHash' :disabled="invalidCosigner || isSigned" @return-password="signAggTxn" />
        </div>
      </div>
      <div class='border-2 mt-5'>
        <div class="cursor-pointer flex justify-between p-3" @click="viewTxn = !viewTxn">
          <div class="text-tsm">Transaction information</div>
          <div class="text-xs text-blue-primary uppercase flex justify-evenly items-center">View<img src="@/modules/transaction/img/icon-down-caret.svg" class="ml-2 transition-all duration-200" :class="`${viewTxn?'rotate-180 transform':''}`"></div>
        </div>
        <transition name="slide">
          <div class="p-3" :class="`${ innerTransactions.length>0?'border-t-2 border-gray-200':'' }`" v-if="viewTxn">
            <div class="my-4 text-sm">{{ txnTypeLabel }}</div>
            <div class="table_div pb-5" :class="`${ innerTransactions.length>0?'border-b-2 border-gray-200 mb-5':'' }`">
              <div>
                <div>TX Hash</div>
                <div>{{ txnHash }}</div>
              </div>
              <div>
                <div>Signer</div>
                <div>{{ signerAddress }}</div>
              </div>
            </div>
            <div v-if="innerTransactions.length > 0">
              <div class="mt-10">Transactions ({{ innerTransactions.length }})</div>
              <div class="mt-3 border-2 border-gray-200 p-3" v-for="(item, index) in innerTransactionsSimple" :key="index">
                <div class="text-sm flex justify-between cursor-pointer" @click="viewInnerTxn[index] = !viewInnerTxn[index]">{{ item.Inner }}<img src="@/modules/transaction/img/icon-down-caret-black.svg" class="mr-1 transition-all duration-200" :class="`${viewInnerTxn[index]?'rotate-180 transform':''}`"></div>
                <transition name="slide">
                  <div class="mt-4 table_div" v-if="viewInnerTxn[index]">
                    <div>
                      <div>Type</div>
                      <div>{{ item.Type }}</div>
                    </div>
                    <div>
                      <div>Public Key</div>
                      <div>{{ item.PublicKey }}</div>
                    </div>
                    <div>
                      <div>Signer</div>
                      <div>{{ item.Address }}</div>
                    </div>
                  </div>
                </transition>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script >
import { Account, Password, TransactionType, 
  PublicAccount 
} from "tsjs-xpx-chain-sdk";
import { watch, ref, computed, getCurrentInstance } from "vue";
import { useRouter } from "vue-router";
import { useToast } from "primevue/usetoast";
import { walletState } from "@/state/walletState";
import { AppState } from "@/state/appState";
import { Helper } from "@/util/typeHelper";
import { networkState } from "@/state/networkState";
import { WalletUtils } from "@/util/walletUtils";
import { useI18n } from 'vue-i18n';
import CosignPasswordModal from '@/modules/transaction/components/CosignPasswordModal.vue'
import { DashboardService } from '@/modules/dashboard/service/dashboardService';
import { TransactionUtils } from '@/util/transactionUtils';
import { CosignUtils } from '@/util/cosignUtils';

export default {
  name: "ViewTransactionSign",
  components: {
    CosignPasswordModal
  },
  props: {
    txnHash: String,
  },
  setup(p) {
    const {t} = useI18n();
    const toast = useToast();
    const router = useRouter();
    const showModal = ref(false)
    // get account details
    const internalInstance = getCurrentInstance();
    const emitter = internalInstance.appContext.config.globalProperties.emitter;

    const viewTxn = ref(true);

    const currentAddress = ref('');
    const currentAddressFormatted = ref('');
    const currentName = ref('');
    const deadline = ref('');
    const txnType = ref('');
    const signerAddress = ref('');
    const signerName = ref('');
    const txnTypeLabel = ref('');

    const innerTransactions = ref([]);
    const innerTransactionsSimple = ref([]);
    const viewInnerTxn = ref([]);
    const invalidCosigner = ref(false);
    const isSigned = ref(false);

    let aggregateTxn = null;

    let allCosigners = []; // hold all the final cosigners public Keys
    let pendingCosigners = []; // pending final cosigners to sign
    let innerOriginSigners = []; // the signer of each innerTxn
    let innerSignersList = []; // the final signers of each innerTxn
    let innerSignersNameList = []; // the signer name of each innerTxn, default - 'Signer'
    let innerSignedList = []; // true, false list - innerTxn is fully signed
    let innerRelatedList = []; // true, false list - related to current account
    let cosignedSigner = []; // all the cosigned final signers, include multisig account (calculated)
    let oriSignedSigners = []; // all the cosigned final signers + initiator
    let signedSigners = []; // all the cosigned final signers + initiator, include multisig account (calculated)

    let currentAccount = walletState.currentLoggedInWallet.selectDefaultAccount() ? walletState.currentLoggedInWallet.selectDefaultAccount() : walletState.currentLoggedInWallet.accounts[0];
    currentAddress.value = currentAccount.address;
    let currentPublicKey = currentAccount.publicKey;
    currentName.value = currentAccount.name;

    const checkCosigner = ()=>{
      let foundCosigner = allCosigners.find(cosigner => cosigner === currentPublicKey);
      if(foundCosigner === undefined){
        invalidCosigner.value = true;
      }
      else{
        let foundSigned = signedSigners.find(cosigner => cosigner === currentPublicKey);
        if(foundSigned !== undefined){
          isSigned.value = true;
        }
      }
    }

    const loadPartialTransaction = async () =>{

      let dashboardService = new DashboardService(walletState.currentLoggedInWallet, currentAccount);

      try {
        aggregateTxn = await AppState.chainAPI.transactionAPI.getPartialTransaction(p.txnHash);

        let thisSignerAddress = aggregateTxn.signer.address.plain();

        signerAddress.value = walletState.currentLoggedInWallet.convertAddressToNamePretty(thisSignerAddress);

        deadline.value = Helper.formatDeadline(aggregateTxn.deadline.adjustedValue.compact());

        txnTypeLabel.value = "Aggregate Bonded";

        let castedAggregateTxn = TransactionUtils.castToAggregate(aggregateTxn);     
      
        allCosigners.push(castedAggregateTxn.signer.publicKey);
        cosignedSigner = castedAggregateTxn.cosignatures.map(cosigner=> cosigner.signer);
        oriSignedSigners = cosignedSigner.concat([aggregateTxn.signer.publicKey]);
        signedSigners = [...oriSignedSigners];

        let allInnerTransactions = [];

        for(let i=0; i < castedAggregateTxn.innerTransactions.length;++i){
          let extractedData = await dashboardService.extractPartialInnerTransaction(castedAggregateTxn.innerTransactions[i]);

          let thisSignerName = walletState.currentLoggedInWallet.convertAddressToNamePretty(extractedData.signerAddressPlain);

          let simpleData = {
            Type: extractedData.typeName,
            PublicKey: extractedData.signer,
            Address: thisSignerName
          };

          if(extractedData.signerAddressPretty === thisSignerName){
            innerSignersNameList.push("Signer");
          }
          else{
            innerSignersNameList.push(thisSignerName);
          }

          innerTransactionsSimple.value.push(simpleData);
          allInnerTransactions.push(extractedData);
          console.log(extractedData);
          let innerSigner = castedAggregateTxn.innerTransactions[i].signer;
          innerOriginSigners.push(innerSigner.publicKey);

          let currentInnerSigners = [];

          if(castedAggregateTxn.innerTransactions[i].type === TransactionType.MODIFY_MULTISIG_ACCOUNT){
            let txn = castedAggregateTxn.innerTransactions[i];

            let allDeepCosigners = await CosignUtils.getAllDeepModifyMultisigCosigners(txn);
            currentInnerSigners = allDeepCosigners;

            let flatCosigners = await CosignUtils.getAllFlatModifyMultisigCosigners(txn);

            for(let a = 0; a < flatCosigners.length; ++a){
              try {
                let accountMultisigGraphInfo = await AppState.chainAPI.accountAPI.getMultisigAccountGraphInfo(PublicAccount.createFromPublicKey(flatCosigners[a], AppState.networkType).address);

                let allMultisigKey = accountMultisigGraphInfo.multisigAccounts.keys().sort((a, b)=>{return a-b}); // ascending keys

                for(let y =0; y < allMultisigKey.length ;++y){
                  const level = allMultisigKey[y];
                  const multisigAccountsInfo = accountMultisigGraphInfo.multisigAccounts.get(level);

                  for(let x =0; x < multisigAccountsInfo.length ;++x){
                    if(CosignUtils.isFulllySigned(multisigAccountsInfo[x], signedSigners)){
                      signedSigners.push(multisigAccountsInfo[x].account.publicKey);
                    }
                  }
                }
              } catch (error) {
                //console.log(error);
              }
              
            }

            signedSigners = Array.from(new Set(signedSigners));
            let isSigned = flatCosigners.every((val) => signedSigners.includes(val));
            innerSignedList.push(isSigned);
            innerRelatedList.push(allDeepCosigners.includes(currentPublicKey));
            // currentInnerSigners = Array.from(new Set(currentInnerSigners));
          }
          else{
            try {
              let accountMultisigGraphInfo = await AppState.chainAPI.accountAPI.getMultisigAccountGraphInfo(innerSigner.address);

              let allMultisigKey = Array.from(accountMultisigGraphInfo.multisigAccounts.keys()).sort((a, b)=>{return a-b}); // ascending keys

              for(let y =0; y < allMultisigKey.length ;++y){
                const level = allMultisigKey[y];
                const multisigAccountsInfo = accountMultisigGraphInfo.multisigAccounts.get(level);

                let cosigners = CosignUtils.findCosigners(multisigAccountsInfo);
                currentInnerSigners = currentInnerSigners.concat(cosigners);

                for(let x =0; x < multisigAccountsInfo.length ;++x){
                  if(CosignUtils.isFulllySigned(multisigAccountsInfo[x], signedSigners)){
                    signedSigners.push(multisigAccountsInfo[x].account.publicKey);
                  }
                }
              }

              // accountMultisigGraphInfo.multisigAccounts.forEach((value, key)=>{
              //     const level = key;

              //     let cosigners = CosignUtils.findCosigner(value);
              //     currentInnerSigners = currentInnerSigners.concat(cosigners);
              // });

              signedSigners = Array.from(new Set(signedSigners));
              currentInnerSigners = Array.from(new Set(currentInnerSigners));
            } catch (error) {
              currentInnerSigners = [innerSigner.publicKey];
              //console.log(error);
            }

            innerRelatedList.push(currentInnerSigners.includes(currentPublicKey));

            innerSignedList.push(signedSigners.includes(innerSigner.publicKey));
          }
          
          innerSignersList.push(currentInnerSigners);
          allCosigners = allCosigners.concat(currentInnerSigners);
        }        

        // remove duplicate
        allCosigners = Array.from(new Set(allCosigners));

        // remove those not signed
        pendingCosigners = allCosigners.filter(pk=> !signedSigners.includes(pk));

        console.log("Inner signers list: ", innerSignersList);
        console.log("Inner signed list: ", innerSignedList);
        console.log("Inner related list: ", innerRelatedList);
        console.log("All cosigners: ", allCosigners);
        console.log("Pending cosigners: ", pendingCosigners);    

        checkCosigner();

        innerTransactions.value = allInnerTransactions;

        console.log(innerTransactions.value);
        
      } catch (error) {
        console.log(error);
      }
    }

    const init = ()=>{
      loadPartialTransaction();
    }

    if(AppState.isReady){
      init();
    }
    else{
      let readyWatcher = watch(AppState.isReady, (value) => {
        if(value){
          init();
          readyWatcher();
        }     
      });
    }

    const signAggTxn = (pswd) => {
      if(aggregateTxn !== null){
          let privateKey = WalletUtils.decryptPrivateKey(new Password(pswd), currentAccount.encrypted, currentAccount.iv);
          const account = Account.createFromPrivateKey(privateKey, AppState.networkType);
          let signedTxn = TransactionUtils.cosignTransaction(aggregateTxn, account);
          AppState.chainAPI.transactionAPI.announceAggregateBondedCosignature(signedTxn);
          router.push({ name : 'ViewTransactionStatus', params: {transactionType: 'partial' }});
      }
      else{
        toast.add({severity: 'error', summary: "It's is still loading, please wait.", life: 2000, group: 'br'})
      }
    }

    return {
      showModal,
      innerTransactions,
      innerTransactionsSimple,
      viewTxn,
      viewInnerTxn,
      deadline,
      signerAddress,
      signerName,
      currentAddressFormatted,
      currentName,
      txnTypeLabel,
      invalidCosigner,
      signAggTxn,
      isSigned,
      innerRelatedList,
      innerSignedList,
      innerSignersNameList
    };
  }
};
</script>
<style scoped lang="scss">
.popup-outer-create-wallet{
  top: 40px; left: 0; right: 0; margin-left: auto; margin-right: auto; max-width: 400px;
}

.table_div{
  @apply text-xs;
  > div{
    @apply grid grid-cols-4;
    > div{
      @apply p-2;
    }
    > div:first-child{
      @apply text-blue-primary w-24 font-bold;
    }
    > div:nth-child(2){
      @apply break-all col-span-3;
    }
  }

  > div:nth-child(2n+1){
    @apply bg-gray-100;
  }
}

.slide-enter-active {
   -moz-transition-duration: 0.5s;
   -webkit-transition-duration: 0.5s;
   -o-transition-duration: 0.5s;
   transition-duration: 0.5s;
   -moz-transition-timing-function: ease-in-out;
   -webkit-transition-timing-function: ease-in-out;
   -o-transition-timing-function: ease-in-out;
   transition-timing-function: ease-in-out;
}
.slide-leave-active {
   -moz-transition-duration: 0.5s;
   -webkit-transition-duration: 0.5s;
   -o-transition-duration: 0.5s;
   transition-duration: 0.5s;
   -moz-transition-timing-function: cubic-bezier(0, 1, 0.5, 1);
   -webkit-transition-timing-function: cubic-bezier(0, 1, 0.5, 1);
   -o-transition-timing-function: cubic-bezier(0, 1, 0.5, 1);
   transition-timing-function: cubic-bezier(0, 1, 0.5, 1);
}
.slide-enter-to, .slide-leave-from {
   max-height: 1000px;
   overflow: hidden;
}
.slide-enter-from, .slide-leave-to {
   overflow: hidden;
   max-height: 0;
}
</style>