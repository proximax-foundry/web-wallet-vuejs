<template>
  <div>
    <div class="flex justify-between text-xs sm:text-sm">
      <div><span class="text-gray-400">{{$t('welcome.storage')}} ></span> <span class="text-blue-primary font-bold">{{$t('services.uploadfile')}}</span></div>
      <div>
        <router-link :to="{ name: 'ViewServicesStorageMyFile'}" class="font-bold">{{$t('services.files')}}</router-link> |
        <router-link :to="{ name: 'ViewServices'}" class="font-bold">{{$t('services.allservices')}}</router-link>
      </div>
    </div>
    <div class='mt-2 py-3 gray-line lg:px-80'>
      <div>
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
        <SelectInputPlugin showSelectTitleProp="true" placeholder="Select Encryption Method" errorMessage="Select Search Encryption Method" v-model="encryptMethod" :options="encryptOption()" />
        <div v-if="encryptMethod!='no'">
          <PasswordInput content="At least 11 characters, must include UPPER CASE letters and numbers" v-tippy="{ arrow : true,  animation : 'shift-away', theme: 'light-border', trigger: 'click'}" placeholder="File Encryption Password" errorMessage="File Encryption Password required" :showError="showEncryptPasswdError" icon="lock" v-model="encryptPasswd" />
          <PasswordInput content="At least 11 characters, must include UPPER CASE letters and numbers" v-tippy="{ arrow : true,  animation : 'shift-away', theme: 'light-border', trigger: 'click'}" placeholder="Confirm File Encryption Password" errorMessage="Confirm File Encryption Password required" :showError="showConfirmEncryptPasswdError" icon="lock" v-model="confirmEncryptPasswd" />
        </div>
        <div class="rounded-2xl bg-gray-100 p-5 mb-5">
          <div class="inline-block mr-4 text-xs"><img src="@/assets/img/icon-prx-xpx-blue.svg" class="w-5 inline mr-1 text-gray-500">{{$t('namespace.transactionfee')}} <span class="text-txs"></span> {{ currentNativeTokenName }}</div>
        </div>
        <PasswordInput placeholder="Insert wallet password" errorMessage="Wallet password required" :showError="showPasswdError" icon="lock" v-model="walletPasswd" />
        <div class="mt-10">
          <button type="button" class="default-btn mr-5 focus:outline-none" @click="clearInput()">{{$t('signin.clear')}}</button>
          <button type="submit" class="default-btn py-1 disabled:opacity-50" :disabled="disableCreate">{{$t('services.upload')}}</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { getCurrentInstance, ref } from "vue";
import PasswordInput from '@/components/PasswordInput.vue';
import SelectInputPlugin from '@/components/SelectInputPlugin.vue';
import { AppState } from '@/state/appState';
export default {
  name: 'ViewServicesStorageUploadFile',
  components: {
    PasswordInput,
    SelectInputPlugin,

  },

  setup() {
    const currentNativeTokenName = computed(()=> AppState.nativeToken.label);
    const internalInstance = getCurrentInstance();
    const emitter = internalInstance.appContext.config.globalProperties.emitter;
    const fileType = ref('');
    const fileName = ref('');
    const isUploaded = ref(false);
    const showPasswdError = ref(false);
    const showEncryptPasswdError = ref(false);
    const encryptPasswd = ref('');
    const showConfirmEncryptPasswdError = ref(false);
    const disableCreate = ref(false);
    const confirmEncryptPasswd = ref('');
    const walletPasswd = ref('');
    // const disableNext = computed( () => !isUploaded.value);

    const encryptMethod = ref('no');

    const encryptOption = () => {
      let encrypt = [];
      encrypt.push({ label: 'No encryption', value: 'no'});
      encrypt.push({ label: 'Encrypt file only', value: 'file'});
      encrypt.push({ label: 'Encrypt everything', value: 'all'});
      return encrypt;
    }
    const uploadFile = (e) => {
      fileType.value = e.target.files[0].type;
      fileName.value = e.target.files[0].name;
      isUploaded.value = true;
    };

    const clearInput = () => {
      encryptMethod.value = 'no';
      emitter.emit("CLEAR_SELECT", '');
      isUploaded.value = false;
      fileType.value = '';
      fileName.value = '';
      encryptPasswd.value = '';
      confirmEncryptPasswd.value = '';
      walletPasswd.value = '';
    }
    return {
      fileType,
      fileName,
      encryptMethod,
      encryptOption,
      walletPasswd,
      showPasswdError,
      isUploaded,
      uploadFile,
      clearInput,
      showEncryptPasswdError,
      encryptPasswd,
      showConfirmEncryptPasswdError,
      confirmEncryptPasswd,
      disableCreate,
      currentNativeTokenName,
    };
  },
}
</script>
<style lang="scss">
@import "@/assets/scss/tippy-light-border.scss";
</style>