<template>
  <div>
    <transition
      enter-active-class="animate__animated animate__fadeInDown"
      leave-active-class="animate__animated animate__fadeOutUp"
    >
      <div v-if="showModal" class="popup-outer absolute flex z-50">
        <div class="modal-popup-box relative">
          <div class="delete-position" style=" position: absolute; right: 15px;">
            <font-awesome-icon icon="times" class="delete-icon-style" @click="closeModal();"></font-awesome-icon>
          </div>
          <div>
            <h1 class="default-title font-bold my-5">Transaction Information</h1>
            <div class="text-left md:justify-start md:flex md:items-stretch">
              <div class="block md:w-6/12 md:inline-block break-words">
                <div class="relative"><span class="font-bold text-md mr-3">Aggregate Bonded</span></div>
                <div class="content">
                  <div>
                    <div>Deadline:</div>
                    <div>{{ transaction.formattedDeadline }} - UTC</div>
                  </div>
                  <div>
                    <div>Type:</div>
                    <div>{{ transaction.type }}</div>
                  </div>
                </div>
                <div class="hash-div">
                  <div>Signer:</div>
                  <div>{{ signer }}</div>
                </div>
                <div class="hash-div">
                  <div>Hash:</div>
                  <div class="break-words pr-3">{{ transaction.transactionInfo.hash }}</div>
                </div>
                <div class="font-bold border-b border-gray-300 pb-1 mt-5">Transactions ({{ transaction.innerTransactions.length }})</div>
                <div class="transactionDetailDiv" v-for="(innerTransaction, index ) in transaction.innerTransactions" :key="index">
                  <transfer :innerTransaction = "innerTransaction" :sender="transaction.signer" v-if="transactions.arraTypeTransaction[transactions.getNameTypeTransaction(innerTransaction.type)].id === transactions.arraTypeTransaction.transfer.id" />
                  <modify-multisig-account-type :innerTransaction = "innerTransaction" v-if="transactions.arraTypeTransaction[transactions.getNameTypeTransaction(innerTransaction.type)].id === transactions.arraTypeTransaction.modifyMultisigAccount.id" />
                  <mosaic-definition :innerTransaction = "innerTransaction" v-if="transactions.arraTypeTransaction[transactions.getNameTypeTransaction(innerTransaction.type)].id === transactions.arraTypeTransaction.mosaicDefinition.id"/>
                  <mosaic-supply-change :innerTransaction = "innerTransaction" :divisibility="divisibility" v-if="transactions.arraTypeTransaction[transactions.getNameTypeTransaction(innerTransaction.type)].id === transactions.arraTypeTransaction.mosaicSupplyChange.id"/>
                </div>
              </div>
              <div class="block md:w-6/12 md:inline-block">
                <div class="Notifytable">
                  <div class="bg-yellow-500 text-white text-sm font-bold text-center py-3">Action Required</div>
                  <div class="bg-gray-200 py-4 px-4">
                    <div class="text-xs mb-2 font-bold">Signer Cosignatory Account:</div>
                    <div class="text-txs">{{ appStore.pretty(transaction.signer.address.address) }}</div>
                  </div>
                  <div v-if="transaction.cosignatures.length > 0" class="bg-gray-200 py-4 px-4">
                    <div class="text-xs mb-2 font-bold">Other cosigner{{ (transaction.cosignatures.length > 1)?'s':'' }}:</div>
                    <div class="text-txs" v-for="(cosigner, i) in transaction.cosignatures" :key="i">{{ appStore.pretty(cosigner.signer.address.address) }}</div>
                  </div>
                  <div v-if="!transaction.isSigned">
                    <div class="py-4 px-4">
                      <div class="text-xs mb-2 font-bold">Cosignatory account signing below:</div>
                      <div class="text-txs">{{ appStore.pretty(transaction.account) }}</div>
                    </div>
                    <div class="error error_box p-2 mb-3" v-if="err!=''">{{ err }}</div>
                    <PasswordInput placeholder="Enter Wallet Password" errorMessage="Password is required" :showError="showPasswdError" v-model="passwd" icon="lock" />
                    <div class="text-center">
                      <button type="submit" class="default-btn py-1 disabled:opacity-50" :disabled="disableApprove" @click="approveTransaction()">Approve to Continue</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <div @click="closeModal();" v-if="showModal" class="fixed inset-0 bg-opacity-90 bg-blue-primary"></div>
  </div>
</template>

<script>
import { computed, getCurrentInstance, inject, ref, watch } from "vue";
import { transactions } from '../../util/transactions.js';
import { multiSign } from '../../util/multiSignatory.js';
import Transfer from '@/components/DashboardModels/SubTransfer.vue';
import ModifyMultisigAccountType from '@/components/DashboardModels/SubModifyMultisigAccountType.vue';
import MosaicDefinition from '@/components/DashboardModels/SubMosaicDefinition.vue';
import MosaicSupplyChange from '@/components/DashboardModels/SubMosaicSupplyChange.vue';
import PasswordInput from '@/components/PasswordInput.vue'
// import {
//   UInt64,
// } from "tsjs-xpx-chain-sdk";

export default{

  name: 'PartialTransactionModal',

  components: {
    ModifyMultisigAccountType,
    MosaicDefinition,
    MosaicSupplyChange,
    PasswordInput,
    Transfer,
  },

  props: {
    'showModal': Boolean,
    'transaction': Object,
  },

  setup(p) {
    const internalInstance = getCurrentInstance();
    const emitter = internalInstance.appContext.config.globalProperties.emitter;
    const appStore = inject("appStore");
    const signer = ref('');
    const passwd = ref('');
    const err = ref("");
    const showPasswdError = ref(false);
    const passwdPattern = "^[^ ]{8,}$";
    const disableApprove = computed(
      () => !(
          passwd.value.match(passwdPattern)
      )
    );

    const approveTransaction = () =>{
      let verify = appStore.verifyWalletPassword(appStore.state.currentLoggedInWallet.name, passwd.value);
      if(verify < 1){
        err.value = 'Invalid wallet password';
      }else{
        multiSign.cosignMiltisigTransaction(p.transaction, passwd.value);
        err.value = '';
        closeModal();
      }
    };

    const closeModal = () => {
      emitter.emit("CLOSE_MODAL", false);
    };

    watch(() => p.showModal, () => {
      if(p.showModal){
        // console.log(p.transaction);
        console.log(p.transaction)
        signer.value = appStore.pretty(p.transaction.signer.address.address);
        // deadline.value = transactions.dateFormat(p.transaction.deadline) + ' - UTC';
      }
    }, {immediate: true})

    return {
      appStore,
      err,
      transactions,
      closeModal,
      signer,
      passwd,
      showPasswdError,
      disableApprove,
      approveTransaction,
    };
  }
}
</script>

<style lang="scss">
.w{
  word-wrap: break-word; font-size:12px;
  margin-bottom: 5px;
  display: block;
}
.content {
  margin: 15px auto;
  font-size: 9px;
  > div{
    margin-bottom: 5px;
    div:first-child{
      font-size: 12px; font-weight: bold; display: inline-block; text-align: right; margin-right: 5px; width: 55px !important;
    }
    div:nth-child(2){
      display: inline-block; font-size: 11px;
    }
  }
}

.hash-div{
  @apply mb-2;
  div:first-child{
    margin-bottom: 3px;
    font-weight: bold;
    font-size: 12px;
  }
  div:nth-child(2){
   font-size: 11px; 
  }
}
</style>