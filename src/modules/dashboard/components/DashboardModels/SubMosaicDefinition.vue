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
            <div>Type:</div>
            <div>{{ typeTransactionHex }}</div>
          </div>
          <div>
            <div>Mosaic Id:</div>
            <div>{{ mosaicId }}</div>
          </div>
          <!-- <div v-if="mosaicsStorage !== null && mosaicsStorage.mosaicNames.names.lenght > 0">
            <div>Mosaic:</div>
            <div>{{ mosaicsStorage.mosaicNames.names[0] }}</div>
          </div> -->
          <!-- MOSAIC NONCE -->
          <!-- <div v-if="innerTransaction.nonce !== undefined">
            <div>Nonce:</div>
            <div>{{ innerTransaction.mosaicProperties.divisibility }}</div>
          </div> -->
          <div>
            <div>Divisibility:</div>
            <div>{{ innerTransaction.mosaicProperties.divisibility }}</div>
          </div>
          <div>
            <div>Version:</div>
            <div>{{ innerTransaction.version }}</div>
          </div>
          <div>
            <div>Duration:</div>
            <div>{{ innerTransaction.mosaicProperties.duration == undefined ? 'Does not expire' : innerTransaction.mosaicProperties.duration }}</div>
          </div>
          <div>
            <div>Supply Mutable:</div>
            <div>
              <font-awesome-icon icon="check-circle" class="h-4 w-4 text-green-600" v-if="innerTransaction.mosaicProperties.supplyMutable"></font-awesome-icon>
              <font-awesome-icon icon="times-circle" class="h-4 w-d text-red-600" v-else></font-awesome-icon>
            </div>
          </div>
          <div>
            <div>Transferable:</div>
            <div>
              <font-awesome-icon icon="check-circle"  class="h-4 w-4 text-green-600" v-if="innerTransaction.mosaicProperties.transferable"></font-awesome-icon>
              <font-awesome-icon icon="times-circle" class="h-4 w-d text-red-600" v-else></font-awesome-icon>
            </div>
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
  name: 'SubMosaicDefinition',

  props: {
    'innerTransaction': Object,
  },

  setup(p){
    const appStore = inject("appStore");
    const nameType = ref('');
    const mosaicId = ref('');
    const typeTransactionHex = ref('');
    const showPanel = ref(false);

    // const mosaicsStorage = ref(null);

    // let viewNamespaceId = false;

    typeTransactionHex.value = p.innerTransaction.type.toString(16).toUpperCase();
    nameType.value = transactions.arraTypeTransaction[transactions.getNameTypeTransaction(p.innerTransaction.type)].name;
    mosaicId.value = p.innerTransaction.mosaicId.toHex();
    // await getMosaicStorage([p.innerTransaction.mosaicId]);

    // async function getMosaicStorage (mosaicsId){
    //   viewNamespaceId = false;
    //   mosaicsStorage.value = null;
    //   const mosaics = await mosaic.filterMosaics(mosaicsId);
    //   if (mosaics !== undefined && mosaics !== null) {
    //     // console.log(mosaics);
    //     if (mosaics.length > 0) {
    //       viewNamespaceId = false;
    //       mosaicsStorage.value = mosaics[0];
    //     }
    //   }
    // }

    return {
      appStore,
      typeTransactionHex,
      // // getMosaicStorage,
      mosaicId,
      // viewNamespaceId,
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