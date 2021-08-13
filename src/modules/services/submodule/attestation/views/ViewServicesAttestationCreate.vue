<template>
  <div class="flex justify-between text-xs sm:text-sm">
    <div><span class="text-gray-400">{{$t('services.attestation')}} ></span> <span class="text-blue-primary font-bold">{{$t('welcome.create')}}</span></div>
    <div>
      <router-link :to="{name: 'ViewServicesAttestationAudit'}" class="font-bold" active-class="accounts">{{$t('services.audit')}}</router-link> |
      <router-link :to="{ name: 'ViewServices' }" class="font-bold">{{$t('services.allservices')}}</router-link>
    </div>
  </div>
  <div class='mt-2 py-3 gray-line text-center px-0 lg:px-10 xl:px-80'>
    <div class="flex">
      <div class="flex-none">
        <div class="flex hover:bg-gray-200 p-0 sm:p-3 rounded-2xl cursor-pointer" @click="naviToProcessing">
          <div class="rounded-full flex w-10 h-10" :class="`${ isNext?'bg-gray-300':'bg-blue-primary' }`"><div class="self-center inline-block text-center w-full text-white">1</div></div>
          <div class="inline-block self-center ml-3">{{$t('services.fileforprocessing')}}</div>
        </div>
      </div>
      <div class="h-1 bg-gray-200 flex-grow mx-2 self-center"></div>
      <div class="flex-none">
        <div class="flex hover:bg-gray-200 p-0 sm:p-3 rounded-2xl cursor-pointer" @click="naviToAttestation">
          <div class="rounded-full flex w-10 h-10" :class="`${ isNext?'bg-blue-primary':'bg-gray-300' }`"><div class="self-center inline-block text-center w-full text-white">2</div></div>
          <div class="inline-block self-center ml-3">{{$t('services.attestation')}}</div>
        </div>
      </div>
    </div>
    <div class="wrapper">
    <transition tag="div" :name="slideDirection" mode="out-in">
        <div v-if="!isNext" key="1" class="page p1">
          <div class="mt-5 mb-10 bg-gray-200 p-3 shadow-md hover:shadow-lg rounded-sm" v-wave="{ color: 'gray', initialOpacity: 0.1, duration: 0.6, easing: 'ease-in'}">
            <div class=" border-gray-400 border-2 border-dashed h-40 relative flex bg-white cursor-pointer text-center">
              <div v-if="isUploaded" class="text-center w-full self-center">
                <div class="h-32 w-32 bg-gray-100 inline-block relative">
                  <div class="absolute rounded-full w-7 h-7 bg-white border-gray-300 border-2" style="top: -9px; right: -9px;">
                    <font-awesome-icon icon="times" class="text-gray-300" @click="isUploaded = !isUploaded"></font-awesome-icon>
                  </div>
                  <div class="flex h-full">
                    <div class="self-center w-full text-center inline-block text-xs">{{ fileName }}<br>({{ fileType }})</div>
                  </div>
                </div>
              </div>
              <div v-else class="self-center text-center w-full"><div><font-awesome-icon icon="cloud-upload-alt" class="text-gray-400 mr-2"></font-awesome-icon> <span class="text-sm text-gray-400">{{$t('services.uploadfile')}}</span></div></div>
                <input type="file" v-if="!isUploaded" class="opacity-0 w-full h-full cursor-pointer absolute" @change="uploadFile" />
            </div>
          </div>
          <div class="rounded-2xl bg-gray-100 p-5 my-5">
            <div class="inline-block text-center self-centerk <div>mHellr-4 text-xs"><img src="@/assets/img/icon-prx-xpx-blue.svg" class="w-5 inline mr-1 text-gray-500">{{$t('namespace.transactionfee')}} XPX</div>
          </div>
          <div class="rounded-2xl bg-gray-100 p-5">
            <input id="computer" type="radio" value="computer" name="uploadSource" v-model="uploadSource" /><label for="computer" class="cursor-pointer font-bold ml-4 mr-5 text-tsm">{{$t('services.mycomputer')}}</label>
            <input id="storage" type="radio" value="storage" name="uploadSource" v-model="uploadSource" :disabled="disabledStorage" /><label for="storage" class="cursor-pointer font-bold ml-4 mr-5 text-tsm" :class="`${ disabledStorage?'text-gray-400':'' }`">{{$t('services.siriusstorage')}}</label>
          </div>
          <div class="mt-10">
            <button type="button" class="default-btn mr-5 focus:outline-none" @click="clearInput();">Clear</button>
            <button type="submit" class="default-btn py-1 disabled:opacity-50" :disabled="disableNext" @click="clickNext()">{{$t('services.next')}}</button>
          </div>
        </div>
        <div v-else key="2" class="page p2">
          <div class="rounded-2xl bg-gray-100 py-2 px-5 my-5 text-left">
            <b>{{$t('services.file')}}:</b><br>
            {{ fileName }}
          </div>
          <TextInput placeholder="+Tags" errorMessage="Please insert tags" v-model="tags" icon="" />
          <SelectInputPlugin selectDefault="2" showSelectTitleProp="true" placeholder="Select hashtag algorithm" errorMessage="" v-model="hashtagAlgorithm" :options="hashtagAlgorithmOption()"  />
          <div class="rounded-2xl bg-gray-100 p-5 my-5">
            <div class="inline-block mr-4 text-xs"><img src="@/assets/img/icon-prx-xpx-blue.svg" class="w-5 inline mr-1 text-gray-500">{{$t('namespace.transactionfee')}}:   XPX</div>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 mb-5">
            <div class="rounded-2xl bg-gray-100 p-5 mr-1 mb-3 flex">
              <div class="self-center text-center w-full">
                <input id="public" type="radio" value="public" name="uploadType" v-model="uploadType" /><label for="public" class="cursor-pointer font-bold ml-4 mr-5 text-tsm">{{$t('createsuccessful.public')}}</label>
                <input id="private" type="radio" value="private" name="uploadType" v-model="uploadType" /><label for="private" class="cursor-pointer font-bold ml-4 mr-5 text-tsm">{{$t('createsuccessful.private')}}</label>
              </div>
            </div>
            <div class="rounded-2xl bg-gray-100 p-5 ml-1 mb-3 flex text-center w-full">
              <div class="w-full">
                <label class="inline-flex items-center">
                  <input type="checkbox" class="h-5 w-5 bg-blue-primary" v-model="isSiriusStorage" disabled="disabledSiriusStorage">
                  <span class="ml-2 cursor-pointer font-bold text-tsm">{{$t('services.saveinsirius')}}</span>
                </label>
              </div>
            </div>
          </div>
          <PasswordInput placeholder="Insert wallet password" errorMessage="Wallet password required" :showError="showPasswdError" icon="lock" v-model="walletPasswd" />
          <div class="mt-10">
            <button type="button" class="default-btn mr-5 focus:outline-none" @click="clearPage2();">{{$t('signin.clear')}}</button>
            <button type="submit" class="default-btn py-1 disabled:opacity-50" :disabled="disableCreate">{{$t('welcome.create')}}</button>
          </div>
        </div>
    </transition>
    </div>
  </div>
</template>
<script>
import { computed, ref } from "vue";
import TextInput from '@/components/TextInput.vue';
import PasswordInput from '@/components/PasswordInput.vue';
import SelectInputPlugin from '@/components/SelectInputPlugin.vue';

export default {
  name: 'ViewServicesAttestationCreate',

  components: {
    TextInput,
    PasswordInput,
    SelectInputPlugin,
  },

  setup() {
    // const toast = useToast();
    // const internalInstance = getCurrentInstance();
    // const emitter = internalInstance.appContext.config.globalProperties.emitter;
    const uploadSource = ref('computer');
    const disabledStorage = ref(true);
    const isUploaded = ref(false);
    const disableNext = computed( () => !isUploaded.value);
    const isNext = ref(false);
    const fileType = ref('');
    const fileName = ref('');
    const tags = ref('');
    const showPasswdError = ref(false);
    const walletPasswd = ref('');
    const hashtagAlgorithm = ref('');
    const attestationTrigger = ref(false);
    const slideDirection = ref('slide-from-right');

    const hashtagAlgorithmOption = () => {
      let options = [];
      options.push({ label: 'MD5', value: 0, disabled: true });
      options.push({ label: 'SHA1', value: 1, disabled: true });
      options.push({ label: 'SHA256', value: 2, disabled: false });
      options.push({ label: 'SHA3', value: 3, disabled: true });
      options.push({ label: 'SHA512', value: 4, disabled: true });
      return options;
    };

    const uploadFile = (e) => {
      fileType.value = e.target.files[0].type;
      fileName.value = e.target.files[0].name;
      isUploaded.value = true;
    };

    const clearInput = () => {
      isUploaded.value = false;
      fileType.value = '';
      fileName.value = '';
    }

    const disableCreate = ref(true);
    const clearPage2 = () => {
      tags.value = '';
      hashtagAlgorithm.value = 2;
      walletPasswd.value = '';
    };

    const uploadType = ref('public');
    const isSiriusStorage = ref(false);
    const disabledSiriusStorage = ref(true);

    const naviToAttestation = () => {
      if(attestationTrigger.value){
        slideDirection.value = 'slide-from-right';
        isNext.value = true;
      }
    };

    const naviToProcessing = () => {
      slideDirection.value = 'slide-from-left';
      isNext.value = false;
    };

    const clickNext = () => {
      slideDirection.value = 'slide-from-right';
      isNext.value = !isNext.value; attestationTrigger.value = true;
    };

    return {
      clearInput,
      uploadSource,
      disabledStorage,
      disableNext,
      uploadFile,
      isUploaded,
      fileName,
      fileType,
      isNext,
      tags,
      showPasswdError,
      walletPasswd,
      hashtagAlgorithm,
      hashtagAlgorithmOption,
      disableCreate,
      clearPage2,
      uploadType,
      isSiriusStorage,
      disabledSiriusStorage,
      attestationTrigger,
      naviToAttestation,
      slideDirection,
      naviToProcessing,
      clickNext,
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
