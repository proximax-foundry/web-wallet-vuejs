<template>
  <div>
    <div class='flex cursor-pointer'>
      <img src='@/assets/img/chevron_left.svg'>
      <router-link :to='{name:"ViewTransactionStatus", params: {transactionType: "partial" }}' class='text-blue-primary text-xs mt-0.5'>Back</router-link>
    </div>
    <div class='md:w-8/12 lg:w-10/12 xl:w-6/12 ml-2 mr-2 md:ml-auto md:mr-auto mt-5'>
      <div class='border-2 border-gray-200'>
        <div class='w-full text-center pt-10 pl-10 pr-10' v-if="isSigned">
          <div class="text-xl">No action Required</div>
          <div class="mt-5 text-tsm">You have already approved {{ innerTransactions.length>1?'these transactions':'this transaction' }}</div>
          <div class="mt-1 text-tsm font-bold">Deadline: {{ deadline }}</div>
        </div>
        <div class='w-full text-center pt-10 pl-10 pr-10' v-else-if="!invalidCosigner">
          <div class="text-xl">Action Required</div>
          <div class="mt-5 text-tsm">Would you like to approve this transaction? (Highlighted in yellow <div class="inline-block h-3 w-3 bg-yellow-300 ml-1"></div>)</div>
          <div class="mt-1 text-tsm font-bold">Deadline: {{ deadline }}</div>
        </div>
        <div class='w-full text-center pt-10 pl-10 pr-10' v-else>
          <div class="text-xl">No action Required</div>
          <div class="mt-1 text-tsm font-bold">Deadline: {{ deadline }}</div>
        </div>
        <div class='w-full text-center pb-10 pl-10 pr-10'>
          <div class="mt-10">
            <div class='flex items-center border-t border-gray-200 py-2' v-for="cosigner, item in allTxnCosigners" :key="item">
              <img src="@/modules/transaction/img/digital-signature-success.png" class="w-14 inline-block ml-2" v-if="isHasSigned(cosigner)">
              <img src="@/modules/transaction/img/digital-signature-not-signed.png" class="w-14 inline-block ml-2" v-else>
              <div class="text-left ml-3 inline-block">
                <div class="uppercase text-blue-primary text-txs font-bold">{{ displayAccountLabel(cosigner) }} {{ isHasSigned(cosigner)?'(Signed)':'' }}</div>
                <div class="uppercase text-xxs text-gray-500 mt-1">{{ displayAccountAddress(cosigner) }}</div>
              </div>
            </div>
          </div>
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
              <div class="mt-10">Transaction{{ innerTransactions.length>1?'s':'' }} ({{ innerTransactions.length }})</div>
              <div class="mt-3 border border-gray-200 p-1" v-for="(item, index) in innerTransactions" :key="index">
                <div class="table_div" :class="innerRelatedList[index] ? 'highlighted' :''">
                  <div>
                    <div>Type</div>
                    <div>{{ item.typeName }}</div>
                  </div>
                  <div>
                    <div>Signer Public Key</div>
                    <div>{{ item.signer }}</div>
                  </div>
                  <div>
                    <div>Signer</div>
                    <div>{{ convertName(item.signerAddressPlain) }}</div>
                  </div>
                  <div>
                    <div>Fully signed</div>
                    <div>{{ innerSignedList[index] }}</div>
                  </div>
                  <div v-for="(info, infoListindex) in item.infoList" :key="infoListindex">
                    <div>{{ info.label ? info.label : '' }}</div>
                    <div>{{ info.short ? info.short : info.value }}</div>
                  </div>
                  <div v-if="item.infoGreenList.length > 0">
                    <div v-if="item.legendType === InnerTxnLegendType.ADD_REMOVE" >Add</div>
                    <div v-else-if="item.legendType === InnerTxnLegendType.TRUE_FALSE" >True</div>
                    <div v-else-if="item.legendType === InnerTxnLegendType.BUY_SELL" >Buy</div>
                    <div v-else-if="item.legendType === InnerTxnLegendType.ALLOW_BLOCK" >Allow</div>
                    <div>{{ item.infoGreenList.map(info => info.short ? info.short : info.value).join(", ") }}</div>
                  </div>
                  <div v-if="item.infoRedList.length > 0">
                    <div v-if="item.legendType === InnerTxnLegendType.ADD_REMOVE" >Remove</div>
                    <div v-else-if="item.legendType === InnerTxnLegendType.TRUE_FALSE" >False</div>
                    <div v-else-if="item.legendType === InnerTxnLegendType.BUY_SELL" >Sell</div>
                    <div v-else-if="item.legendType === InnerTxnLegendType.ALLOW_BLOCK" >Block</div>
                    <div>{{ item.infoRedList.map(info => info.short ? info.short : info.value).join(", ") }}</div>
                  </div>
                  <div v-if="item.infoInfoList.length > 0">
                    <div>Info</div>
                    <div>{{ item.infoInfoList.map(info => info.short ? info.short : info.value).join(", ") }}</div>
                  </div>
                  <div v-if="item.sdas.length > 0">
                    <div>SDAs</div>
                    <div>{{ item.sdas.join("<br>") }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </transition>
      </div>
      <div class="flex items-center h-14 lg:h-28 justify-center" v-if="!isSigned">
        <router-link :to='{name:"ViewTransactionStatus", params: {transactionType: "partial" }}' class="text-gray-600 bg-white px-5 py-2 lg:px-10 lg:py-3 rounded-md text-xs lg:text-tsm inline-block border-2 border-gray-200 mr-5">Do this later</router-link>
        <CosignPasswordModal :transactionHash = 'txnHash' :disabled="invalidCosigner || isSigned" @return-password="signAggTxn" />
      </div>
      <div class="flex items-center h-14 lg:h-28 justify-center" v-else>
        <router-link :to='{name:"ViewTransactionStatus", params: {transactionType: "partial" }}' class="text-gray-600 bg-white px-5 py-2 lg:px-10 lg:py-3 rounded-md text-xs lg:text-tsm inline-block border-2 border-gray-200 mr-5">Close</router-link>
      </div>
    </div>
  </div>
</template>

<script >
import { Account, Address, Password, TransactionType, PublicAccount } from "tsjs-xpx-chain-sdk";
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
import { DashboardService, InnerTxnLegendType, MsgType } from '@/modules/dashboard/service/dashboardService';
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

    const allTxnCosigners = ref([]);

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
        cosignedSigner = castedAggregateTxn.cosignatures.map(cosigner=> cosigner.signer.publicKey);
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

          extractedData.infoInfoList = extractedData.infos.filter(info => !info.label && info.type === MsgType.INFO);
          extractedData.infoGreenList = extractedData.infos.filter(info => !info.label && info.type === MsgType.GREEN);
          extractedData.infoRedList = extractedData.infos.filter(info => !info.label && info.type === MsgType.RED);
          extractedData.infoList = extractedData.infos.filter(info => info.type === MsgType.NONE);

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
            //currentInnerSigners = Array.from(new Set(currentInnerSigners));
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
        allTxnCosigners.value = allCosigners;

        // remove those not signed
        pendingCosigners = allCosigners.filter(pk=> !signedSigners.includes(pk));

        checkCosigner();

        innerTransactions.value = allInnerTransactions;

        // console.log("Inner signers list: ", innerSignersList);
        // console.log("Inner signed list: ", innerSignedList);
        // console.log("Inner related list: ", innerRelatedList);
        // console.log("All cosigners: ", allCosigners);
        // console.log("Pending cosigners: ", pendingCosigners);
        // console.log("Signed cosigners: ", signedSigners);
        
      } catch (error) {
        console.log(error);
      }
    }

    const isHasSigned = (cosignerPublicKey) => {
      let signed = signedSigners.includes(cosignerPublicKey);
      let isPending = pendingCosigners.includes(cosignerPublicKey);
      return (signed && !isPending);
    }

    const displayAccountLabel = (cosignerPublicKey) => {
      let cosignerAddress = Address.createFromPublicKey(cosignerPublicKey, AppState.networkType);
      return convertCosignerAddressToName(cosignerAddress.address);
    }

    const displayAccountAddress = (cosignerPublicKey) => {
      let cosignerAddress = Address.createFromPublicKey(cosignerPublicKey, AppState.networkType).pretty();
      return cosignerAddress;
    }

    const convertCosignerAddressToName = (address) => {
        let aliasName = "";
        const addressBook = walletState.currentLoggedInWallet.contacts.find((addressBook)=> addressBook.address === address);

        if(addressBook){
            aliasName = addressBook.name;
        }else{
          const walletAccount = walletState.currentLoggedInWallet.accounts.find((walletAccount)=> walletAccount.address === address);

          if(walletAccount){
              aliasName = walletAccount.name;
          }

          const othersAccount = walletState.currentLoggedInWallet.others.find((otherAccount)=> otherAccount.address === address);

          if(othersAccount){
              aliasName = othersAccount.name;
          }
        }
        return aliasName ? aliasName : 'Cosigner';
    }

    const convertName = (address) =>{
      return walletState.currentLoggedInWallet ? walletState.currentLoggedInWallet.convertAddressToNamePretty(address) : address;
    }

    const init = ()=>{
      loadPartialTransaction();
    }

    if(AppState.isReady){
      init();
    }
    else{
      let readyWatcher = watch(AppState, (value) => {
        if(value.isReady){
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
      innerSignersNameList,
      convertName,
      InnerTxnLegendType,
      allTxnCosigners,
      pendingCosigners,
      signedSigners,
      isHasSigned,
      displayAccountLabel,
      displayAccountAddress,
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

.table_div.highlighted{
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

  > div:nth-child(2n){
    @apply bg-yellow-50;
  }

  > div:nth-child(2n+1){
    @apply bg-yellow-100;
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