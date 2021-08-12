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
            <h1 class="default-title font-bold my-5">{{$t('dashboard.transactionInfo')}}</h1>
            <div class="text-left md:justify-start md:flex md:items-stretch">
              <div class="block md:w-7/12 md:inline-block">
                <div class="relative"><span class="font-bold text-md mr-3">{{$t('common.lockFund')}}</span></div>
                <div class="text-xs my-2">{{ timestamp }}</div>
                <div><span class="font-bold">{{$t('common.effectiveFee')}}:</span> <img src="@/assets/img/icon-prx-xpx-blue.svg" class="w-5 inline mx-2"><span class="text-xs">{{ effectiveFee.part1 }}{{ effectiveFee.part2 }}</span> <span class="text-sm">XPX</span></div>
                <div class="content">
                  <div>
                    <div>{{$t('common.type')}}:</div>
                    <div>{{ transaction.type }}</div>
                  </div>
                  <div>
                    <div>{{$t('common.duration')}}:</div>
                    <div>{{ duration }} {{$t('common.blocks')}}</div>
                  </div>
                </div>
                <div class="hash-div">
                  <div>{{$t('dashboard.transactionHash')}}:</div>
                  <div>{{ transaction.hash }}</div>
                </div>
                <div class="mt-5">
                  <span class="font-bold text-md">{{$t('common.amount')}}: </span> <img src="@/assets/img/icon-prx-xpx-blue.svg" class="w-5 inline ml-2"> <span>{{ amount }} XPX</span>
                </div>
              </div>
              <div class="block md:w-5/12 md:inline-block bg-gray-200 rounded-2xl p-2">
                <div class="font-bold text-xs mb-1 block">{{$t('common.signer')}}:</div>
                <div class="w w-96 md:w-full">{{ transaction.signer.address.address }}</div>
                <div class="font-bold text-xs mb-1 block mt-3">{{$t('common.signature')}}:</div>
                <div class="w w-96 md:w-full">{{ transaction.signature }}</div>
                <div class="font-bold text-xs mb-1 block mt-3">{{$t('common.hash')}}:</div>
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
import {
  UInt64,
} from "tsjs-xpx-chain-sdk";

export default{

  name: 'LockFundModal',
  props: {
    'showModal': Boolean,
    'transaction': Object,
  },
  setup(p) {
    const internalInstance = getCurrentInstance();
    const emitter = internalInstance.appContext.config.globalProperties.emitter;
    const hover = ref(false);
    const timestamp = ref('');
    const effectiveFee = ref('');
    const amount = ref('0.000000');
    const duration = ref('');

    const closeModal = () => {
      emitter.emit("CLOSE_MODAL", false);
    };

    watch(() => p.showModal, () => {
      if(p.showModal){
        // console.log(p.transaction);
        if (p.transaction.transactionInfo && p.transaction.transactionInfo.height) {
          const height = p.transaction.transactionInfo.height.compact();
          if (typeof (height) === 'number') {
            const existBlock = dataBridge.filterBlockStorage(height);
            // console.log(existBlock)
            if (existBlock) {
              // console.log('In cache', existBlock);
              timestamp.value = `${transactions.dateFormatUTC(new UInt64([existBlock.timestamp.lower, existBlock.timestamp.higher]))} - UTC`;
              const calculateEffectiveFee = transactions.amountFormatterSimple(existBlock.feeMultiplier * p.transaction.data.size);
              effectiveFee.value = transactions.getDataPart(calculateEffectiveFee, 6);
              // console.log('Effective fee ---> ', transaction.effectiveFee);
            } else {
              dataBridge.getBlockInfo(height).subscribe(
                next => {
                  // console.log('Http', next);
                  dataBridge.validateBlock(next);
                  timestamp.value = `${transactions.dateFormatUTC(next.timestamp)} - UTC`;
                  const calculateEffectiveFee = transactions.amountFormatterSimple(next.feeMultiplier * p.transaction.data.size);
                  effectiveFee.value = transactions.getDataPart(calculateEffectiveFee, 6);
                  // console.log('Effective fee ---> ', effectiveFee.value);
                }
              );
            }
          } else {
            effectiveFee.value = transactions.getDataPart('0.00000', 6);
          }
        } else {
          effectiveFee.value = transactions.getDataPart('0.00000', 6);
        }
        const id = p.transaction.mosaic.id;
        transactions.getLockFundAmount(id, p.transaction).then((amountParts) => {
          amount.value = amountParts.part1 + amountParts.part2;
        });

        duration.value = p.transaction.duration.compact();
      }
    }, {immediate: true})

    return {
      hover,
      closeModal,
      timestamp,
      effectiveFee,
      amount,
      duration,
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