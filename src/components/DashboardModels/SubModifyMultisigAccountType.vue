<template>
  <div @click="showPanel = !showPanel" class="cursor-pointer flex justify-between mt-2 p-2 hover:bg-gray-100 text-tsm font-bold">{{ nameType }} 
    <font-awesome-icon icon="chevron-down" class="text-black w-4 h-4 mr-1 mt-1" v-if="!showPanel"></font-awesome-icon>
    <font-awesome-icon icon="chevron-up" class="text-black w-4 h-4 mr-1 mt-1" v-else></font-awesome-icon>
  </div>
  <transition name="slide">
    <div v-if="showPanel">
      <div style="max-height: 200px; overflow-y: scroll;" class="break-words p-2">
        <div class="subcontent">
          <div>
            <div>Type:</div>
            <div>{{ innerTransaction.type }}</div>
          </div>
          <div v-if="innerTransaction.transactionInfo!=undefined">
            <div>Aggregate Id:</div>
            <div>{{ innerTransaction.transactionInfo.aggregateId }}</div>
          </div>
          <div>
            <div>Signer Address:</div>
            <div>{{ appStore.pretty(innerTransaction.signer.address.address) }}</div>
          </div>
          <div>
            <div>Signer Public Key:</div><br>
            <div>{{ innerTransaction.signer.publicKey }}</div>
          </div>
          <div>
            <div>Signature:</div><br>
            <div>{{ innerTransaction.signature }}</div>
          </div>
          <div>
            <div>Minimum Approval Delta:</div>
            <div>{{ innerTransaction.minApprovalDelta }}</div>
          </div>
          <div>
            <div>Minimum Removal Delta:</div>
            <div>{{ innerTransaction.minRemovalDelta }}</div>
          </div>
          <div class="font-bold mt-5" style="font-size: 13px;">Multisig Cosignatory Modification</div>
        </div>
        <div v-for="(modification, index ) in innerTransaction.modifications" :key="index">
          <div class="cursor-pointer bg-white hover:bg-gray-100 p-1 flex justify-between" style="font-size: 13px" @click="showMiniPanel[index] = !showMiniPanel[index]">Cosignatory {{ index + 1 }}
            <font-awesome-icon icon="chevron-down" class="text-black w-3 h-3 mr-1 mt-1" v-if="!showMiniPanel[index]"></font-awesome-icon>
            <font-awesome-icon icon="chevron-up" class="text-black w-3 h-3 mr-1 mt-1" v-else></font-awesome-icon>
          </div>
          <transition name="slide">
            <div v-if="showMiniPanel[index]" class="break-words cosig-block">
              <div>
                <div>Type:</div>
                <div>{{ !modification.type?'Add':'Remove' }}</div>
              </div>
              <div>
                <div>Address:</div>
                <div>{{ appStore.pretty(modification.cosignatoryPublicAccount.address.address) }}</div>
              </div>
              <div>
                <div>Public Key:</div>
                <div>{{ modification.cosignatoryPublicAccount.publicKey }}</div>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { inject, ref } from "vue";
import { transactions } from '../../util/transactions.js';

export default{
  name: 'SubModifyMultisigAccountType',
  props: {
    'innerTransaction': Object,
  },

  setup(p){
    const appStore = inject("appStore");
    const nameType = ref('');
    const showPanel = ref(false);
    const showMiniPanel = ref([]);

    p.innerTransaction.modifications.forEach(() => {
      showMiniPanel.value.push(false);
    });

    nameType.value = transactions.arraTypeTransaction[transactions.getNameTypeTransaction(p.innerTransaction.type)].name;
    return {
      appStore,
      nameType,
      showPanel,
      showMiniPanel,
    }
  }
}
</script>

<style lang="scss" scoped>
.subcontent {
  margin: 15px auto;
  > div{
    font-size: 12px; 
    margin-bottom: 5px;
    div:first-child{
      font-weight: bold; display: inline-block; text-align: right; margin-right: 5px;
    }
    div:nth-child(2){
      display: inline-block;
    }
  }
}

.cosig-block{
  padding-top: 10px;
  padding-left: 4px;
  font-size: 11px;
  > div{
    margin-bottom: 10px;
    > div:first-child{
      font-weight: bold;
      margin-right: 10px;
    }
  }
  > div:first-child{
    > div{
      display: inline-block;
    }
  }
}

.slide-enter-active {
   -moz-transition-duration: 1s;
   -webkit-transition-duration: 1s;
   -o-transition-duration: 1s;
   transition-duration: 1s;
   -moz-transition-timing-function: ease-in-out;
   -webkit-transition-timing-function: ease-in-out;
   -o-transition-timing-function: ease-in-out;
   transition-timing-function: ease-in-out;
}

.slide-leave-active {
   -moz-transition-duration: 1s;
   -webkit-transition-duration: 1s;
   -o-transition-duration: 1s;
   transition-duration: 1s;
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