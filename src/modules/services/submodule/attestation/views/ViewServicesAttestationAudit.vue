<template>
  <div class="flex justify-between text-xs sm:text-sm">
    <div><span class="text-gray-400">{{$t('services.attestation')}} ></span> <span class="text-blue-primary font-bold">{{$t('services.audit')}}</span></div>
    <div>
      <router-link :to="{name: 'ViewServicesAttestationCreate'}" class="font-bold" active-class="accounts">{{$t('welcome.create')}}</router-link> |
      <router-link :to="{ name: 'ViewServices' }" class="font-bold">{{$t('services.allservices')}}</router-link>
    </div>
  </div>
  <div class='mt-2 py-3 gray-line text-center px-0 lg:px-10 xl:px-80'>
    <div class="mt-5 mb-10 bg-gray-200 p-3 shadow-md hover:shadow-lg rounded-sm" v-wave="{ color: 'gray', initialOpacity: 0.1, duration: 0.6, easing: 'ease-in'}">
      <div class=" border-gray-400 border-2 border-dashed h-40 relative flex bg-white cursor-pointer text-center">
        <div class="self-center text-center w-full"><div><font-awesome-icon icon="cloud-upload-alt" class="text-gray-400 mr-2"></font-awesome-icon> <span class="text-sm text-gray-400">{{$t('services.uploadfile')}}</span></div></div>
          <input type="file" class="opacity-0 w-full h-full cursor-pointer absolute" @change="uploadFile" />
      </div>
      <div class="text-left" v-for="(file, index) in files" :key="index">
        <div class="mt-3 text-xs"><font-awesome-icon icon="trash-alt" class="text-gray-500 mr-2 cursor-pointer" @click="deleteFile(index)"></font-awesome-icon> {{ file.name }}</div>
      </div>
    </div>
    <div class="flex justify-between p-4 rounded-xl bg-white border-yellow-500 border-2 mb-8">
      <div class="text-center w-full">
        <div class="w-8 h-8 inline-block relative">
          <div class="rounded-full border border-yellow-500 w-7 h-7 relative">
            <font-awesome-icon icon="exclamation" class="w-5 h-5 text-yellow-500 inline-block absolute" style="top:3px; right: 10px;"></font-awesome-icon>
          </div>
        </div>
        <div class="font-bold text-sm">{{$t('services.filemessage')}}<br>{{$t('services.example')}}:</div>
        <p class="text-xs mt-3">{{$t('services.fileexample')}}</p>
      </div>
    </div>
    <div class="mt-10">
      <button type="submit" class="default-btn py-1">{{$t('services.audit')}}</button>
    </div>
  </div>
</template>
<script>
import { ref } from "vue";

export default {
  name: 'ViewServicesAttestationAudit',

  setup() {
    // const toast = useToast();
    // const internalInstance = getCurrentInstance();
    // const emitter = internalInstance.appContext.config.globalProperties.emitter;
    const uploadSource = ref('computer');
    const files = ref([]);
    const fileType = ref('');
    const fileName = ref('');

    const uploadFile = (e) => {
      fileType.value = e.target.files[0].type;
      fileName.value = e.target.files[0].name;
      files.value.push({name: e.target.files[0].name});
    };

    const deleteFile = (index) => {
      files.value.splice(index, 1);
    }

    const disableAudit = ref(true);



    return {
      uploadSource,
      uploadFile,
      fileName,
      fileType,
      disableAudit,
      files,
      deleteFile,
    };
  },
}
</script>
