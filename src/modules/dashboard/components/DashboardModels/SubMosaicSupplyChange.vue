<template>
  <div @click="showPanel = !showPanel" class="cursor-pointer flex justify-between mt-2 p-2 hover:bg-gray-100 text-tsm font-bold">{{ nameType }} 
    <font-awesome-icon icon="chevron-down" class="text-black w-4 h-4 mr-1 mt-1" v-if="!showPanel"></font-awesome-icon>
    <font-awesome-icon icon="chevron-up" class="text-black w-4 h-4 mr-1 mt-1" v-else></font-awesome-icon>
  </div>
  <transition name="slide">
    <div v-if="showPanel">
      <div style="width: 400px;" class="break-words p-2">
        <div class="subcontent">
          <div>
            <div>{{$t('common.type')}}:</div>
            <div>{{ typeTransactionHex }}</div>
          </div>
          <div>
            <div>{{$t('dashboard.assetId')}}:</div>
            <div>{{ mosaicId }}</div>
          </div>
          <div>
            <div>{{$t('common.increase')}}:</div>
            <!-- <div>{{ appStore.pretty(innerTransaction.signer.address.address) }}</div> -->
            <div class="text-green-800" v-if="innerTransaction.direction === 1">+ {{ delta }}</div>
            <div class="text-red-600" v-else>- {{ delta }}</div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { inject, ref } from "vue";
import { transactions } from '@/util/transactions.js';

export default{
  name: 'SubMosaicSupplyChange',
  props: {
    'innerTransaction': Object,
    'divisibility': Number,
  },

  setup(p){
    const appStore = inject("appStore");
    const nameType = ref('');
    const mosaicId = ref('');
    const showPanel = ref(false);
    const typeTransactionHex = ref('');
    const mosaicsStorage = ref({});
    const delta = ref('');
    // let searching = true;
    // let viewMosaicName = false;
    // const searchMosaics = (mosaicsId) => {
    //   this.mosaicService.filterMosaics(mosaicsId).then(
    //     response => {
    //       searching = false;
    //       if (response.length > 0) {
    //         viewMosaicName = true;
    //         mosaicsStorage = response[0];
    //       }
    //   }).catch(err => {
    //     console.log('err: ' + err);
    //     viewMosaicName = false;
    //     searching = false;
    //   });
    // }

    typeTransactionHex.value = p.innerTransaction.type.toString(16).toUpperCase();
    mosaicId.value = p.innerTransaction.mosaicId.toHex();
    nameType.value = transactions.arraTypeTransaction[transactions.getNameTypeTransaction(p.innerTransaction.type)].name;
    delta.value = transactions.amountFormatter(p.innerTransaction.delta.compact(), p.divisibility);

    return {
      appStore,
      typeTransactionHex,
      mosaicId,
      delta,
      mosaicsStorage,
      // searchMosaics,
      nameType,
      showPanel,
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
      font-weight: bold; display: inline-block; text-align: right; margin-right: 15px; width: 110px;
    }
    div:nth-child(2){
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