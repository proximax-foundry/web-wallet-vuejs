<template>
  <div>
    <div class="flex justify-between text-xs sm:text-sm">
      <div><span class="text-gray-400">{{$t('gift.siriusgift')}} ></span> <span class="text-blue-primary font-bold">Generate Gift Card</span></div>
      <div>
        <router-link :to="{ name: 'ViewServices'}" class="font-bold">{{$t('services.allservices')}}</router-link>
      </div>
    </div>
    <div class='mt-2 py-3 gray-line lg:px-80'>
      <div class="mt-5 mb-4 bg-gray-200 p-3 shadow-md hover:shadow-lg rounded-sm" v-wave="{ color: 'gray', initialOpacity: 0.1, duration: 0.6, easing: 'ease-in'}">
        <div class=" border-gray-400 border-2 border-dashed h-40 relative flex bg-white cursor-pointer text-center">
          <div class="self-center text-center w-full"><div><font-awesome-icon icon="cloud-upload-alt" class="text-gray-400 mr-2"></font-awesome-icon> <span class="text-sm text-gray-400">{{$t('services.uploadfile')}}</span></div></div>
            <input type="file" class="opacity-0 w-full h-full cursor-pointer absolute" @change="uploadFile" />
        </div>
        <div class="text-left" v-if="fileName!=''">
          <div class="mt-3 text-xs"><font-awesome-icon icon="trash-alt" class="text-gray-500 mr-2 cursor-pointer" @click="deleteFile()"></font-awesome-icon> {{ fileName }}</div>
        </div>
      </div>
      <SelectInputPlugin placeholder="Select your account" errorMessage="Please select your account" v-model="selectedAccount" :options="accountOption()" />
      <div class="mt-10">
        <button type="button" class="default-btn mr-5 focus:outline-none" @click="clearInput()">{{$t('signin.clear')}}</button>
        <button type="submit" class="default-btn py-1 disabled:opacity-50">{{$t('services.redeem')}}</button>
      </div>
    </div>
  </div>
</template>
<script>
import { getCurrentInstance, inject, ref } from "vue";
import SelectInputPlugin from '@/components/SelectInputPlugin.vue';

export default {
  name: 'ViewServicesSiriusGiftRedeem',
  components: {
    SelectInputPlugin,
  },

  setup() {
    const internalInstance = getCurrentInstance();
    const emitter = internalInstance.appContext.config.globalProperties.emitter;
    const appStore = inject("appStore");
    const selectedAccount = ref('');

    const accountOption = () => {
      const wallet = appStore.getWalletByName(appStore.state.currentLoggedInWallet.name);
      let account = [];
      wallet.accounts.forEach(element => {
        account.push({ value: element.name, label: element.name });
      });
      return account;
    }

    const clearInput = () => {
      emitter.emit("CLEAR_SELECT", '');
    }

    const fileType = ref('');
    const fileName = ref('');

    const uploadFile = (e) => {
      fileType.value = e.target.files[0].type;
      fileName.value = e.target.files[0].name;
    };

    const deleteFile = () => {
      fileType.value = '';
      fileName.value = '';
    }


    return {
      clearInput,
      accountOption,
      selectedAccount,
      uploadFile,
      fileName,
      fileType,
      deleteFile,
    };
  },
}
</script>
