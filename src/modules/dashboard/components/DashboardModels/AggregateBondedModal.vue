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
              <div class="block md:w-7/12 md:inline-block">
                <div class="relative"><span class="font-bold text-md mr-3">Aggregate Bonded</span></div>
                <div class="text-xs my-2">{{ timestamp }}</div>
                <div><span class="font-bold">Effective Fee:</span> <img src="@/assets/img/icon-prx-xpx-blue.svg" class="w-5 inline mx-2"><span class="text-xs">{{ effectiveFee.part1 }}{{ effectiveFee.part2 }}</span> <span class="text-sm">XPX</span></div>
                <div class="content">
                  <div>
                    <div>Type:</div>
                    <div>{{ transaction.type }}</div>
                  </div>
                  <div>
                    <div>Height:</div>
                    <div>{{ transactionHeight }}</div>
                  </div>
                </div>
                <div style="width: 450px;">
                  <div class="font-bold border-b border-gray-300 pb-1 mt-5">Transactions ({{ transaction.innerTransactions.length }})</div>
                  <div class="transactionDetailDiv" v-for="( innerTransaction, index ) in transaction.innerTransactions" :key="index">
                    <transfer :innerTransaction = "innerTransaction" :sender="transaction.signer" v-if="transactions.arraTypeTransaction[transactions.getNameTypeTransaction(innerTransaction.type)].id === transactions.arraTypeTransaction.transfer.id" />
                    <modify-multisig-account-type :innerTransaction = "innerTransaction" v-if="transactions.arraTypeTransaction[transactions.getNameTypeTransaction(innerTransaction.type)].id === transactions.arraTypeTransaction.modifyMultisigAccount.id" />
                    <mosaic-definition :innerTransaction = "innerTransaction" v-if="transactions.arraTypeTransaction[transactions.getNameTypeTransaction(innerTransaction.type)].id === transactions.arraTypeTransaction.mosaicDefinition.id"/>
                    <mosaic-supply-change :innerTransaction = "innerTransaction" :divisibility="divisibility" v-if="transactions.arraTypeTransaction[transactions.getNameTypeTransaction(innerTransaction.type)].id === transactions.arraTypeTransaction.mosaicSupplyChange.id"/>
                  </div>
                </div>
              </div>
              <div class="block md:w-5/12 md:inline-block bg-gray-200 rounded-2xl p-2">
                <div class="font-bold text-xs mb-1 block">Signer:</div>
                <div class="w w-96 md:w-full">{{ transaction.signer.address.address }}</div>
                <div class="font-bold text-xs mb-1 block mt-3">Signature:</div>
                <div class="w w-96 md:w-full">{{ transaction.signature }}</div>
                <div v-if="transaction.cosignatures.length>0">
                  <div class="font-bold text-xs mb-1 mt-3 flex justify-between cursor-pointer hover:bg-gray-300 p-2" @click="showPanel = !showPanel">Others cosignatories:
                    <font-awesome-icon icon="chevron-down" class="text-black w-4 h-4" v-if="!showPanel"></font-awesome-icon>
                    <font-awesome-icon icon="chevron-up" class="text-black w-4 h-4" v-else></font-awesome-icon>
                  </div>
                  <transition name="slide">
                    <div class="w w-96 md:w-full" v-if="showPanel">
                      <div v-for="(cosig, index) in transaction.cosignatures" :key="index">{{ cosig.signer.address.address }}</div>
                    </div>
                  </transition>
                </div>
                <div class="font-bold text-xs mb-1 block mt-3">Hash:</div>
                <div class="w w-96 md:w-full">{{ transaction.transactionInfo.hash }}</div>
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
import { getCurrentInstance, ref, watch } from "vue";
import { transactions } from '@/util/transactions.js';
import { dataBridge } from '@/util/dataBridge.js';
import Transfer from '@/modules/dashboard/components/DashboardModels/SubTransfer.vue';
import ModifyMultisigAccountType from '@/modules/dashboard/components/DashboardModels/SubModifyMultisigAccountType.vue';
import MosaicDefinition from '@/modules/dashboard/components/DashboardModels/SubMosaicDefinition.vue';
import MosaicSupplyChange from '@/modules/dashboard/components/DashboardModels/SubMosaicSupplyChange.vue';
import {
  UInt64,
} from "tsjs-xpx-chain-sdk";

export default{

  name: 'AggregateBondedModal',
  components: {
    Transfer,
    ModifyMultisigAccountType,
    MosaicDefinition,
    MosaicSupplyChange,
  },
  props: {
    'showModal': Boolean,
    'transaction': Object,
  },
  setup(p) {
    const internalInstance = getCurrentInstance();
    const emitter = internalInstance.appContext.config.globalProperties.emitter;
    const timestamp = ref('');
    const effectiveFee = ref('');
    const transactionHeight = ref('');
    const showPanel = ref(false);
    const divisibility = ref('');

    const closeModal = () => {
      emitter.emit("CLOSE_MODAL", false);
    };

    // get divisibility
    p.transaction.innerTransactions.forEach((innerTransaction) => {
      console.log(innerTransaction);
      if(transactions.arraTypeTransaction[transactions.getNameTypeTransaction(innerTransaction.type)].id === transactions.arraTypeTransaction.mosaicDefinition.id){
        divisibility.value = innerTransaction.mosaicProperties.divisibility;
      }
    });

    watch(() => p.showModal, () => {
      if(p.showModal){
        if (p.transaction.transactionInfo && p.transaction.transactionInfo.height) {
          const height = p.transaction.transactionInfo.height.compact();
          transactionHeight.value = height;
          if (typeof (height) === 'number') {
            const existBlock = dataBridge.filterBlockStorage(height);
            console.log('existBlock: ');
            console.log(existBlock);
            if (existBlock) {
              timestamp.value = `${transactions.dateFormatUTC(new UInt64([existBlock.timestamp.lower, existBlock.timestamp.higher]))} - UTC`;
              const calculateEffectiveFee = transactions.amountFormatterSimple(existBlock.feeMultiplier * p.transaction.data.size);
              console.log(p.transaction.data.size);
              effectiveFee.value = transactions.getDataPart(calculateEffectiveFee, 6);
            } else {
              dataBridge.getBlockInfo(height).subscribe(
                next => {
                  dataBridge.validateBlock(next);
                  timestamp.value = `${transactions.dateFormatUTC(next.timestamp)} - UTC`;
                  const calculateEffectiveFee = transactions.amountFormatterSimple(next.feeMultiplier * p.transaction.data.size);
                  effectiveFee.value = transactions.getDataPart(calculateEffectiveFee, 6);
                }
              );
            }
          } else {
            effectiveFee.value = transactions.getDataPart('0.00000', 6);
          }
        } else {
          effectiveFee.value = transactions.getDataPart('0.00000', 6);
        }
      }
    }, {immediate: true})

    return {
      showPanel,
      closeModal,
      divisibility,
      transactionHeight,
      timestamp,
      effectiveFee,
      transactions,
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
  > div{
    @apply text-xs;
    margin-bottom: 5px;
    div:first-child{
      font-weight: bold;
    }
  }
}

.hash-div{
  @apply text-xs;
  div:first-child{
    margin-bottom: 5px;
    font-weight: bold;
  }
}
</style>