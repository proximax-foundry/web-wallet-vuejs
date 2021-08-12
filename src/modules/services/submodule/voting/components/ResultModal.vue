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
            <h1 class="default-title font-bold my-5">[ Vote title ]</h1>
            <div class="text-left md:justify-start md:flex md:items-stretch">
              <div class="block md:w-7/12 md:inline-block">
                <div class="font-bold text-center my-5">{{$t('common.result')}}</div>
                <Chart type="pie" :data="chartData" />
              </div>
              <div class="block md:w-5/12 md:inline-block">
                <div class="table w-full mt-5">
                  <div class="grid grid-cols-4 bg-blue-primary text-gray-50 text-tsm py-2 font-bold">
                    <div class="col-span-3 px-3">{{$t('common.options',2)}}</div>
                    <div class="col-span-1 px-3">{{$t('vote.total')}}</div>
                  </div>
                  <div class="grid grid-cols-4 text-tsm py-2 bg-gray-200">
                    <div class="col-span-3 px-3">{{$t('vote.option1')}}</div>
                    <div class="col-span-1 px-3">1</div>
                  </div>
                  <div class="grid grid-cols-4 text-tsm py-2 bg-gray-50">
                    <div class="col-span-3 px-3">{{$t('vote.option2')}}</div>
                    <div class="col-span-1 px-3">5</div>
                  </div>
                  <div class="grid grid-cols-4 text-tsm py-2 bg-gray-200">
                    <div class="col-span-3 px-3">{{$t('vote.option3')}}</div>
                    <div class="col-span-1 px-3">3</div>
                  </div>
                </div>
                <div class="table w-full mt-10">
                  <div class="grid grid-cols-4 bg-blue-primary text-gray-50 text-tsm py-2 font-bold">
                    <div class="col-span-3 px-3">{{$t('vote.statistic')}}</div>
                    <div class="col-span-1 px-3">Total</div>
                  </div>
                  <div class="grid grid-cols-4 text-tsm py-2 bg-gray-200">
                    <div class="col-span-3 px-3">{{$t('vote.vote')}}</div>
                    <div class="col-span-1 px-3">9</div>
                  </div>
                  <div class="grid grid-cols-4 text-tsm py-2 bg-gray-50">
                    <div class="col-span-3 px-3">{{$t('vote.uniquevoter')}}</div>
                    <div class="col-span-1 px-3">9</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="mt-20">
              <button type="button" class="default-btn mr-5 focus:outline-none disabled:opacity-50">{{$t('vote.refresh')}}</button>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <div @click="closeModal();" v-if="showModal" class="fixed inset-0 bg-opacity-90 bg-blue-primary"></div>
  </div>
</template>

<script>
import { getCurrentInstance, ref } from "vue";
import Chart from 'primevue/chart';
export default{

  name: 'ResultModal',
  components: {
    Chart,
  },
  props: {
    'showModal': Boolean,
  },
  setup() {
    const internalInstance = getCurrentInstance();
    const emitter = internalInstance.appContext.config.globalProperties.emitter;
    const chartData = ref({
      labels: ['Option 1','Option 2','Option 3'],
      datasets: [
        {
          data: [1, 5, 3],
          backgroundColor: ["#42A5F5","#66BB6A","#FFA726"],
          hoverBackgroundColor: ["#64B5F6","#81C784","#FFB74D"]
        }
      ]
    });

    const closeModal = () => {
      emitter.emit("CLOSE_MODAL", false);
    };

    return {
      closeModal,
      chartData,
    };
  }
}
</script>

<style lang="scss" scoped>
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
</style>