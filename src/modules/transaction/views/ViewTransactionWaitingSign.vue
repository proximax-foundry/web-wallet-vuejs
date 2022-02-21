<template>
  <div>
    <div class='flex cursor-pointer'>
      <img src='@/assets/img/chevron_left.svg'>
      <router-link :to='{name:"ViewTransactionStatus", params: {transactionType: "partial" }}' class='text-blue-primary text-xs mt-0.5'>Back</router-link>
    </div>
    <div class='md:w-8/12 lg:w-10/12 xl:w-6/12 ml-2 mr-2 md:ml-auto md:mr-auto mt-5'>
      <div class='border-2'>
        <div class='w-full text-center p-10'>
          <div class="text-xl">Waiting for signatures</div>
          <div class="mt-5 text-tsm font-bold">Deadline: {{ deadline }}</div>
        </div>
        <div class='flex items-center border-t border-gray-200 py-2'>
          <img src="@/modules/transaction/img/digital-signature-success.png" class="w-14 inline-block ml-2">
          <div class="text-left ml-3 inline-block">
            <div class="uppercase text-blue-primary text-xs font-bold">{{ currentName }} (Signed)</div>
            <div class="uppercase text-xs font-bold mt-1">{{ currentAddressFormatted }}</div>
          </div>
        </div>
        <div class='flex items-center border-t border-gray-200 py-2'>
          <img src="@/modules/transaction/img/digital-signature-not-signed.png" class="w-14 inline-block ml-2">
          <div class="text-left ml-3 inline-block">
            <div class="uppercase text-blue-primary text-xs font-bold">{{ currentName }}</div>
            <div class="uppercase text-xs font-bold mt-1">{{ currentAddressFormatted }}</div>
          </div>
        </div>
        <div class='flex items-center border-t border-gray-200 py-2'>
          <img src="@/modules/transaction/img/digital-signature-not-signed.png" class="w-14 inline-block ml-2">
          <div class="text-left ml-3 inline-block">
            <div class="uppercase text-blue-primary text-xs font-bold">{{ currentName }}</div>
            <div class="uppercase text-xs font-bold mt-1">{{ currentAddressFormatted }}</div>
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
                <div>Type</div>
                <div>{{ txnType }}</div>
              </div>
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
              <div class="mt-3 border-2 border-gray-200 p-3" v-for="(item, index) in innerTransactions" :key="index">
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
import { Account, Password } from "tsjs-xpx-chain-sdk";
import { watch, ref, computed, getCurrentInstance } from "vue";
import { useRouter } from "vue-router";
import { useToast } from "primevue/usetoast";
import { walletState } from "@/state/walletState";
import { Helper } from "@/util/typeHelper";
import { networkState } from "@/state/networkState";
import { WalletUtils } from "@/util/walletUtils";
import { useI18n } from 'vue-i18n';
import { DashboardService } from '@/modules/dashboard/service/dashboardService';
import { TransactionUtils } from '@/util/transactionUtils';
import { AppState } from '@/state/appState';

export default {
  name: "ViewTransactionWaitingSign",
  components: {
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
    const viewInnerTxn = ref([]);

    let currentAccount = walletState.currentLoggedInWallet.selectDefaultAccount() ? walletState.currentLoggedInWallet.selectDefaultAccount() : walletState.currentLoggedInWallet.accounts[0];
    currentAddress.value = currentAccount.address;
    let currentPublicKey = currentAccount.publicKey;
    currentName.value = currentAccount.name;

    (async() => {
      let dashboardService = new DashboardService(walletState.currentLoggedInWallet, currentAccount);
      let aggregateTxn = await dashboardService.autoFindAggregateTransaction(p.txnHash);
      console.log(aggregateTxn)

      // validate cosigner
      // let cosigners = [];
      // if(aggregateTxn.innerTransactions.length > 0){
      //   aggregateTxn.innerTransactions.forEach(inner => {
      //     if(inner.modifications.length > 0){
      //       inner.modifications.forEach(modification => {
      //         cosigners.push(modification.cosignatoryPublicAccount.publicKey);
      //       });
      //     }
      //   });
      // }

      // let foundCosigner = cosigners.find(cosigner => cosigner == currentPublicKey);
      // if(foundCosigner.length == 0){
      //   invalidCosigner.value = true;
      // }

      let formattedAggTxn = await dashboardService.formatPartialTransaction(aggregateTxn);
      deadline.value = Helper.formatDeadline(formattedAggTxn.deadline);
      txnType.value = aggregateTxn.type;
      txnTypeLabel.value = formattedAggTxn.type;
      signerAddress.value = Helper.createAddress(formattedAggTxn.signerAddress).pretty();
      signerName.value = formattedAggTxn.signerName;
      currentAddressFormatted.value = Helper.createAddress(currentAddress.value).pretty();
      if(aggregateTxn.innerTransactions.length > 0){
        aggregateTxn.innerTransactions.forEach(inner => {
          viewInnerTxn.value.push(false);
          let formattedInner = dashboardService.extractInnerTransaction(inner);
          innerTransactions.value.push({
            Inner: formattedInner.typeName,
            Type: formattedInner.extractedData.modifications[0].type,
            PublicKey: formattedInner.signerPublicKeys[0],
            Address: Helper.createAddress(formattedInner.signerAddress).pretty()
          });
        });
      }
    })();

    const signAggTxn = (pswd) => {
      const networkType = AppState.networkType;
      let privateKey = WalletUtils.decryptPrivateKey(new Password(pswd), currentAccount.encrypted, currentAccount.iv);
      const accountDetail = Account.createFromPrivateKey(privateKey, networkType);
      (async() => {
        let dashboardService = new DashboardService(walletState.currentLoggedInWallet, accountDetail);
        let aggregateTxn = await dashboardService.autoFindAggregateTransaction(p.txnHash);
        let signedTxn = TransactionUtils.cosignTransaction(aggregateTxn, accountDetail);
        TransactionUtils.announceCosignitureSignedTransaction(signedTxn);
        router.push({ name : 'ViewTransactionStatus', params: {transactionType: 'partial' }});
      })()
    }

    return {
      showModal,
      innerTransactions,
      viewTxn,
      viewInnerTxn,
      deadline,
      txnType,
      signerAddress,
      signerName,
      currentAddressFormatted,
      currentName,
      txnTypeLabel,
      signAggTxn,
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