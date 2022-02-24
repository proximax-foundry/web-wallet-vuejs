<template>
  <div class="flex justify-between text-xs sm:text-sm">
    <div><span class="text-gray-400">{{$t('vote.voting')}} ></span> <span class="text-blue-primary font-bold">{{$t('vote.createpoll')}}</span></div>
    <div>
      <router-link :to="{ name: 'ViewServices' }" class="font-bold">{{$t('services.allservices')}}</router-link>
    </div>
  </div>
  <div class='mt-2 py-3 gray-line text-center'>
    <div class="flex">
      <div class="flex-none">
        <div class="flex hover:bg-gray-200 p-0 sm:p-3 rounded-2xl cursor-pointer" @click="navigateTo(1)">
          <div class="rounded-full flex w-10 h-10" :class="`${ isCurrent(1)?'bg-blue-primary':(visitedPage(1)?(verifiedPage(1)?'bg-green-600':'bg-red-500'):'bg-gray-300') }`"><div class="self-center inline-block text-center w-full text-white">1</div></div>
          <div class="inline-block self-center ml-3">{{$t('accounts.details')}}</div>
        </div>
      </div>
      <div class="h-1 bg-gray-200 flex-grow mx-2 self-center"></div>
      <div class="flex-none">
        <div class="flex hover:bg-gray-200 p-0 sm:p-3 rounded-2xl cursor-pointer" @click="navigateTo(2)">
          <div class="rounded-full flex w-10 h-10" :class="`${ isCurrent(2)?'bg-blue-primary':(visitedPage(2)?(verifiedPage(2)?'bg-green-600':'bg-red-500'):'bg-gray-300') }`"><div class="self-center inline-block text-center w-full text-white">2</div></div>
          <div class="inline-block self-center ml-3">{{$t('vote.voteoptions')}}</div>
        </div>
      </div>
      <div class="h-1 bg-gray-200 flex-grow mx-2 self-center"></div>
      <div class="flex-none">
        <div class="flex hover:bg-gray-200 p-0 sm:p-3 rounded-2xl cursor-pointer" @click="navigateTo(3)">
          <div class="rounded-full flex w-10 h-10" :class="`${ isCurrent(3)?'bg-blue-primary':(visitedPage(3)?(verifiedPage(3)?'bg-green-600':'bg-red-500'):'bg-gray-300') }`"><div class="self-center inline-block text-center w-full text-white">3</div></div>
          <div class="inline-block self-center ml-3">{{$t('dashboard.type')}}</div>
        </div>
      </div>
      <div class="h-1 bg-gray-200 flex-grow mx-2 self-center"></div>
      <div class="flex-none">
        <div class="flex hover:bg-gray-200 p-0 sm:p-3 rounded-2xl cursor-pointer" @click="navigateTo(4)">
          <div class="rounded-full flex w-10 h-10" :class="`${ isCurrent(4)?'bg-blue-primary':(visitedPage(4)?(verifiedPage(4)?'bg-green-600':'bg-red-500'):'bg-gray-300') }`"><div class="self-center inline-block text-center w-full text-white">4</div></div>
          <div class="inline-block self-center ml-3">{{$t('vote.activate')}}</div>
        </div>
      </div>
    </div>
    <div class="wrapper">
    <transition tag="div" :name="slideDirection" mode="out-in">
        <div v-if="pageIndex==1" key="1" class="page grid grid-cols-1 md:grid-cols-7">
          <div class="col-span-1 md:col-span-4 px-5 pt-5">
            <TextInput placeholder="Enter Title" errorMessage="Please insert title" v-model="pollTitle" :imgRequired=true icon="modules/services/submodule/voting/img/icon-voting-green-60h.svg" />
            <div class="text-left ml-3">
              <label class="inline-flex items-center">
                <input type="checkbox" class="h-5 w-5 bg-blue-primary" v-model="sendPrivate">
                <span class="ml-2 cursor-pointer text-gray-500 text-sm">{{$t('vote.sendprivate')}}.</span>
              </label>
            </div>
            <TextareaInput placeholder="Write your description here" errorMessage="" v-model="description" icon="comment" class="mt-5" :disabled="disableDescription" />
            <CalanderInput :imgRequired=true icon="modules/services/submodule/voting/img/icon-duration-green-16h-proximax-sirius-wallet.svg" v-model="endDate" title="End Date" />
            <div class="mt-10">
              <button type="submit" class="default-btn py-1 disabled:opacity-50" :disabled="disableNextIndex1" @click="navigateTo(2)">Next</button>
            </div>
          </div>
          <div class="col-span-1 md:col-span-3">
            <div class="rounded-2xl bg-gray-100 p-5 my-5">
              <div class="inline-block text-center self-centerk <div>mHellr-4 text-xs"><img src="@/assets/img/icon-prx-xpx-blue.svg" class="w-5 inline mr-1 text-gray-500">{{$t('namespace.transactionfee')}} {{ currentNativeTokenName }}</div>
            </div>
          </div>
        </div>
        <div v-else-if="pageIndex==2" key="2" class="page">
          <div class="grid grid-cols-1 md:grid-cols-7">
            <div class="col-span-1 md:col-span-4 px-5">
              <div class="rounded-2xl bg-gray-100 py-2 px-5 my-5 text-left">
                <b>{{$t('vote.title')}}:</b><br>
                {{ pollTitle }}
              </div>
              <div class="col-span-1 md:col-span-3">
                <label class="inline-flex items-center">
                  <input type="checkbox" class="h-5 w-5 bg-blue-primary" v-model="allowMultiple">
                  <span class="ml-2 cursor-pointer text-gray-500 text-sm">{{$t('vote.allowmultiple')}}</span>
                </label>
              </div>
              <div class="rounded-2xl bg-gray-100 p-5 my-5" v-if="options.length > 0">
                <div class="text-tsm text-left">{{$t('vote.option')}}{{ (options.length>1?'s':'') }}</div>
                <div class="text-left grid grid-cols-3">
                  <div class="inline-block mr-4 mt-3 text-xs text-left col-span-1" v-for="(option, index) in options" :key="index">
                    <div class="text-xs"><font-awesome-icon icon="trash-alt" class="text-gray-500 mr-2 cursor-pointer" @click="deleteOption(option.name)"></font-awesome-icon> {{ option.name }}</div>
                  </div>
                </div>
              </div>
              <TextInput class="mt-3" placeholder="Option" errorMessage="Please insert Option" v-model="optionText" :imgRequired=true icon="modules/services/submodule/voting/img/icon-type-increase-decrease-green-16h-proximax-sirius-wallet.svg" />
              <div class="mt-3 text-center">
                <button class=" hover:shadow-lg bg-white hover:bg-gray-100 rounded-3xl border-2 font-bold px-6 py-2 border-blue-primary text-blue-primary outline-none focus:outline-none disabled:opacity-50 disabled:cursor-auto" @click="addOption" :disabled="disableAddOption">(+) {{$t('vote.addoptions')}}</button>
              </div>
            </div>
            <div class="col-span-1 md:col-span-3">
              <div class="rounded-2xl bg-gray-100 p-5 my-5">
                <div class="inline-block mr-4 text-xs"><img src="@/assets/img/icon-prx-xpx-blue.svg" class="w-5 inline mr-1 text-gray-500">{{$t('namespace.transactionfee')}} {{ currentNativeTokenName }}</div>
              </div>
            </div>
          </div>
          <div class="mt-10">
            <button type="button" class="default-btn mr-5 focus:outline-none" @click="navigateTo(1);">{{$t('accounts.back')}}</button>
            <button type="submit" class="default-btn py-1 disabled:opacity-50" :disabled="disableNextIndex2" @click="navigateTo(3)">{{$t('services.next')}}</button>
          </div>
        </div>
        <div v-else-if="pageIndex==3" key="3" class="page">
          <div class="grid grid-cols-1 md:grid-cols-7">
            <div class="col-span-1 md:col-span-4 px-5">
              <div class="rounded-2xl bg-gray-100 py-2 px-5 my-5 text-left">
                <b>{{$t('vote.title')}}:</b><br>
                {{ pollTitle }}
              </div>
              <SelectInputPlugin selectDefault="Open" showSelectTitleProp="true" placeholder="Type of vote" errorMessage="Select Type of Vote" v-model="voteType" :options="voteTypeOption()"  />
            </div>
            <div class="col-span-1 md:col-span-3">
              <div class="rounded-2xl bg-gray-100 p-5 my-5">
                <div class="inline-block mr-4 text-xs"><img src="@/assets/img/icon-prx-xpx-blue.svg" class="w-5 inline mr-1 text-gray-500">{{$t('namespace.transactionfee')}} {{ currentNativeTokenName }}</div>
              </div>
              <div class="rounded-2xl bg-gray-100 p-5 my-5">
                <div class="inline-block mr-4 text-xs"><div class="text-tsm">{{$t('vote.optionslist')}}</div><div class="mt-2 text-tsm"><DisplayOptionModal :options="options" class="inline-block" /> | <a @click="navigateTo(2)" class="text-blue-primary font-bold">{{$t('vote.edit')}}</a></div></div>
              </div>
            </div>
          </div>
          <div class="mt-10">
            <button type="button" class="default-btn mr-5 focus:outline-none" @click="navigateTo(2)">{{$t('accounts.back')}}</button>
            <button type="submit" class="default-btn py-1 disabled:opacity-50" :disabled="disableNextIndex3" @click="navigateTo(4)">{{$t('services.next')}}</button>
          </div>
        </div>
        <div v-else-if="pageIndex==4" key="4" class="page">
          <div class="grid grid-cols-1 md:grid-cols-7">
            <div class="col-span-1 md:col-span-4 px-5">
              <div class="rounded-2xl bg-gray-100 py-2 px-5 my-5 text-left">
                <b>{{$t('vote.title')}}:</b><br>
                {{ pollTitle }}
              </div>
              <div class="flex justify-between py-2 px-5 rounded-2xl bg-gray-100 mb-4 items-left">
                <div class="text-left w-full relative">
                  <div class="absolute z-20 w-full h-full"></div>
                  <div class="font-bold mb-1">{{$t('vote.polladdress')}}:</div>
                  <input
                    id="pollIndexAddress"
                    class="text-sm w-full outline-none bg-gray-100 z-10"
                    type="text"
                    value="VDB52J-IIE4SA-CUNOOP-N44H66-47O42B-XTPWJH-LPGW"
                  />
                </div>
                <font-awesome-icon icon="copy" @click="copy('pollIndexAddress')" class="w-5 h-5 text-gray-500 cursor-pointer inline-block self-center"></font-awesome-icon>
              </div>

              <div class="rounded-2xl bg-gray-100 py-2 px-5 my-5 text-left">
                <b>{{$t('vote.enddate')}}:</b><br>
                {{ endDate.toLocaleString() }}
              </div>
              <PasswordInput placeholder="Insert wallet password" errorMessage="Wallet password required" :showError="showPasswdError" icon="lock" v-model="walletPasswd" />
            </div>
            <div class="col-span-1 md:col-span-3">
              <div class="rounded-2xl bg-gray-100 p-5 my-5">
                <div class="inline-block mr-4 text-xs"><img src="@/assets/img/icon-prx-xpx-blue.svg" class="w-5 inline mr-1 text-gray-500">{{$t('namespace.transactionfee')}} {{ currentNativeTokenName }}</div>
              </div>
              <div class="rounded-2xl bg-gray-100 p-5 my-5">
                <div class="inline-block mr-4 text-xs"><div class="text-tsm">Options List</div><div class="mt-2 text-tsm"><DisplayOptionModal :options="options" class="inline-block" /> | <a @click="navigateTo(2)" class="text-blue-primary font-bold">{{$t('vote.edit')}}</a></div></div>
              </div>
            </div>
          </div>
          <div class="mt-10">
            <button type="button" class="default-btn mr-5 focus:outline-none" @click="navigateTo(3)">{{$t('accounts.back')}}</button>
            <button type="submit" class="default-btn py-1 disabled:opacity-50" :disabled="disableNextIndex4" @click="createPoll(); navigateTo(1)">{{$t('welcome.create')}}</button>
          </div>
        </div>
    </transition>
    </div>
  </div>
</template>
<script>

import { computed, ref } from "vue";
import TextInput from '@/components/TextInput.vue';
import CalanderInput from '@/modules/services/submodule/voting/components/CalanderInput.vue';
import TextareaInput from '@/modules/services/submodule/voting/components/TextareaInput.vue';
import DisplayOptionModal from '@/modules/services/submodule/voting/components/DisplayOptionModal.vue';
import PasswordInput from '@/components/PasswordInput.vue';
import SelectInputPlugin from '@/components/SelectInputPlugin.vue';
import { copyKeyFunc } from '@/util/functions';
import { useToast } from "primevue/usetoast";
import { AppState } from '@/state/appState';

export default {
  name: 'ViewServicesVotingCreatePoll',

  components: {
    CalanderInput,
    TextInput,
    PasswordInput,
    TextareaInput,
    SelectInputPlugin,
    DisplayOptionModal,
  },

  setup() {
    const currentNativeTokenName = computed(()=> AppState.nativeToken.label);
    const toast = useToast();
    // const internalInstance = getCurrentInstance();
    // const emitter = internalInstance.appContext.config.globalProperties.emitter;
    const pageIndex = ref(1);
    const isNext = ref(false);
    const showPasswdError = ref(false);
    const walletPasswd = ref('');
    let passwdPattern = "^[^ ]{8,}$";
    const slideDirection = ref('slide-from-right');
    const endDate = ref('');
    const pollTitle = ref('');
    const sendPrivate = ref('');
    const description = ref('');
    const disableDescription = ref(false);
    const allowMultiple = ref('');
    const voteType = ref(0);

    let visited = [1];

    const disableNextIndex1 = computed(() => !(pollTitle.value && description.value && endDate.value));
    const disableNextIndex2 = computed(() => !(options.value.length > 0));
    const disableNextIndex3 = computed(() => !(voteType.value != ''));
    const disableNextIndex4 = computed(() => !(walletPasswd.value.match(passwdPattern)));

    const visitedPage = (page) => {
      return (visited.indexOf(page)>=0)?true:false;
    }

    const verifiedPage = (page) => {
      switch(page){
        case 1:
          return (!disableNextIndex1.value)?true:false;
        case 2:
          return (!disableNextIndex2.value)?true:false;
        case 3:
          return (!disableNextIndex3.value)?true:false;
        case 4:
          return (!disableNextIndex4.value)?true:false;
      }
    }

    const navigateTo = (page) => {
      slideDirection.value = (page > pageIndex.value)?'slide-from-right':'slide-from-left';
      switch(page){
        case 1:
          pageIndex.value = page;
          break;
        case 2:
          if(!disableNextIndex1.value){
            visited.push(page);
            pageIndex.value = page;
          }
          break;
        case 3:
          if(!disableNextIndex2.value){
            visited.push(page);
            pageIndex.value = page;
          }
          break;
        case 4:
          if(!disableNextIndex3.value){
            visited.push(page);
            pageIndex.value = page;
          }
          break;
      }
    }

    const disableCreate = ref(true);
    const clearPage2 = () => {
      walletPasswd.value = '';
    };


    const clickNextIndex1 = () => {
      slideDirection.value = 'slide-from-right';
    };

    // emitter.on('update_endDate', payload => {
    //   console.log(payload);
    //   endDate.value = payload;
    // });

    const optionText = ref('');
    const options = ref([]);
    const disableAddOption = computed(() => !optionText.value);
    const addOption = () => {
      let existOption = options.value.find((element) => element.name === optionText.value);
      if(existOption){
        toast.add({severity:'error', summary: 'Option', detail: 'This option is already exist', group: 'br', life: 5000});
      }else{
        options.value.push({ name: optionText.value });
        optionText.value = '';
      }
    };

    const deleteOption = (optionText) => {
      let optionTextIndex = options.value.findIndex((element) => element.name === optionText);
      if(optionTextIndex != -1){
        options.value.splice(optionTextIndex, 1);
      }
    }

    const isCurrent = (page) => {
      return (page === pageIndex.value)?true:false;
    };

    const voteTypeOption = () => {
      let vote = [];
      vote.push({label: 'Open', value: 'Open'});
      vote.push({label: 'Whitelist', value: 'Whitelist'});
      return vote;
    };

    const copy = (id) => copyKeyFunc(id, toast);

    const createPoll = () => {
      walletPasswd.value = '';
      endDate.value = '';
      pollTitle.value = '';
      sendPrivate.value = '';
      description.value = '';
      allowMultiple.value = '';
      voteType.value = 0;
      optionText.value = '';
      options.value = [];
      visited = [1];
    };

    return {
      isNext,
      showPasswdError,
      walletPasswd,
      disableCreate,
      clearPage2,
      slideDirection,
      clickNextIndex1,
      pageIndex,
      endDate,
      pollTitle,
      sendPrivate,
      description,
      disableDescription,
      disableNextIndex1,
      allowMultiple,
      disableAddOption,
      optionText,
      options,
      addOption,
      deleteOption,
      disableNextIndex2,
      navigateTo,
      isCurrent,
      voteTypeOption,
      voteType,
      copy,
      disableNextIndex3,
      disableNextIndex4,
      visitedPage,
      verifiedPage,
      createPoll,
      currentNativeTokenName,
    };
  },
}
</script>
<style lang="scss" scoped>

.slide-from-left-enter-active,
.slide-from-left-leave-active,
.slide-from-right-enter-active,
.slide-from-right-leave-active {
  transition: 0.5s;
}

.slide-from-left-enter-to {
  position: absolute;
  left: 0;
}

.slide-from-right-enter-to {
  position: absolute;
  right: 0;
}


.slide-from-left-enter-from {
  position: absolute;
  left: -100%;
}

.slide-from-right-enter-from {
  position: absolute;
  right: -100%;
}


.slide-from-left-leave-to {
  position: absolute;
  right: -100%;
}

.slide-from-right-leave-to {
  position: absolute;
  left: -100%;
}


.slide-from-left-leave-from {
  position: absolute;
  right: 0;
}

.slide-from-right-leave-from {
  position: absolute;
  left: 0;
}

.wrapper{
  overflow: hidden;
  position: relative;
  @apply w-full;
  height: 680px;
}

@media (min-width: 640px) {
  .wrapper{
    height: 600px;
  }
}

.page{
  @apply w-full;
}

</style>
