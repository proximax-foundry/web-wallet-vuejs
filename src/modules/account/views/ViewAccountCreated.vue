<template>
  <div class="container mx-auto text-center">
    <div class="mx-auto pt-5 lg:px-20">
      <div v-if="accountName == ''" class="flex justify-between p-4 rounded-xl bg-yellow-100 mb-4">
        <div class="text-center w-full">
          <div class="border border-yellow-600 rounded-full w-8 h-8 inline-block mb-4">
            <font-awesome-icon icon="exclamation" class="w-5 h-5 text-yellow-600 inline-block"></font-awesome-icon>
          </div>
          <p>Your account is linked to a delegated account</p>
        </div>
      </div>
      <div v-if="accountName != ''" class="flex justify-between p-4 rounded-xl bg-gray-100 mb-8 items-center">
        <div class="text-left w-full relative">
          <div class="text-xs font-bold mb-1">{{$t('common.name')}}:</div>
          <div>{{ accountName }}</div>
        </div>
      </div>
      <div v-if="accountName != ''" class="flex justify-between p-4 rounded-xl bg-gray-100 mb-4 items-center">
        <div class="text-left w-full relative">
          <div class="absolute z-20 w-full h-full"></div>
          <div class="text-xs font-bold mb-1">{{$t('common.address')}}:</div>
          <div 
            id="address" class="text-sm w-full outline-none bg-gray-100 z-10"
            :copyValue="accountAddress" copySubject="Address"
          >{{accountAddress}}</div>
        </div>
        <font-awesome-icon icon="copy" @click="copy('address')" class="w-5 h-5 text-gray-500 cursor-pointer inline-block"></font-awesome-icon>
      </div>
      <div v-if="accountName == ''" class="flex justify-between p-4 rounded-xl bg-gray-100 mb-4 items-center">
        <div class="text-left w-full relative">
          <div class="absolute z-20 w-full h-full"></div>
          <div class="text-xs font-bold mb-1">{{$t('common.public')}}</div>
          <div
            id="public"
            class="text-sm w-full outline-none bg-gray-100 z-10"
            :copyValue="accountPublicKey" copySubject="Public Key"
          >{{accountPublicKey}}</div>
        </div>
        <font-awesome-icon icon="copy" @click="copy('public')" class="w-5 h-5 text-gray-500 cursor-pointer inline-block"></font-awesome-icon>
      </div>
      <div class="flex justify-between p-4 rounded-xl bg-gray-100 mb-4 items-center" v-if="showPK && accountName != ''">
        <div class="text-left w-full relative">
          <div class="absolute z-20 w-full h-full"></div>
          <div class="text-xs font-bold mb-1">{{$t('common.private')}}:</div>
          <div
            id="private"
            class="text-sm w-full outline-none bg-gray-100 z-10"
            :copyvalue="accountPrivateKey" copySubject="Private Key"
          >{{accountPrivateKey}}</div>
        </div>
        <font-awesome-icon icon="copy" @click="copy('private')" class="w-5 h-5 text-gray-500 cursor-pointer inline-block"></font-awesome-icon>
      </div>
    
      <div v-if="accountName != ''" class="flex justify-between p-4 rounded-xl bg-yellow-100 mb-4">
        <div class="text-center w-full">
          <div class="border border-yellow-600 rounded-full w-8 h-8 inline-block mb-4">
            <font-awesome-icon icon="exclamation" class="w-5 h-5 text-yellow-600 inline-block"></font-awesome-icon>
          </div>
          <p>{{$t('common.warningText1')}}</p>
          <p>{{$t('common.warningText2')}}</p>
        </div>
      </div>
      <div v-if="accountName == ''" class="flex justify-between p-4 rounded-xl bg-yellow-100 mb-4">
        <div class="text-center w-full">
          <div class="border border-yellow-600 rounded-full w-8 h-8 inline-block mb-4">
            <font-awesome-icon icon="exclamation" class="w-5 h-5 text-yellow-600 inline-block"></font-awesome-icon>
          </div>
          <p>Please copy the private key above to the config-harvesting.properties file to enable delegated validating.</p>
          <p>Make sure you store this private key in a safe place as well.</p>
        </div>
      </div>
      <div class="flex justify-between p-4 rounded-xl bg-gray-100 mb-4 items-center" v-if="showPK && accountName == ''">
        <div class="text-left w-full relative">
          <div class="absolute z-20 w-full h-full"></div>
          <div class="text-xs font-bold mb-1">Private key of the delegated account:</div>
          <div
            id="private"
            class="text-sm w-full outline-none bg-gray-100 z-10"
            :copyvalue="accountPrivateKey" copySubject="Private Key"
          >{{accountPrivateKey}}</div>
        </div>
        <font-awesome-icon icon="copy" @click="copy('private')" class="w-5 h-5 text-gray-500 cursor-pointer inline-block"></font-awesome-icon>
      </div>
      <div class="inline-block mt-10 w-full">
        <div class="grid xs:grid-cols-1 md:grid-cols-3">
          <div class="px-5 self-center">
            <a class="block big-default-btn my-3 self-center w-full" @click="showPK = !showPK">{{ showPK? $t('common.hide'): $t('common.show') }} {{$t('common.privateKey')}}</a>
          </div>
          <div class="px-5">
            <a class="block big-default-btn my-3 self-center w-full">{{$t('common.saveWalletPaper')}}</a>
          </div>
          <div class="px-5 self-center"><router-link :to="{name: 'ViewAccountDisplayAll'}" class="block big-default-btn my-3 self-center">{{$t('common.continue')}}</router-link></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { copyToClipboard } from '@/util/functions';
import { useToast } from "primevue/usetoast";
import {useI18n} from 'vue-i18n'
export default {
  name: 'ViewAccountCreated',
  props: [
    'name',
    'publicKey',
    'privateKey',
    'address'
  ],
  data() {
    return {
      showPK: false,
    };
  },
  setup(p){
    const {t} = useI18n();
    const toast = useToast();
    const accountName = ref(p.name);
    const accountPublicKey = ref(p.publicKey);
    const accountPrivateKey = ref(p.privateKey);
    const accountAddress = ref(p.address);
    const copy = (id) =>{
      let stringToCopy = document.getElementById(id).getAttribute("copyValue");
      let copySubject = document.getElementById(id).getAttribute("copySubject");
      copyToClipboard(stringToCopy);
      if (copySubject === "Private Key"){
        toast.add({severity:'info', detail: t('common.privateKey') + ' ' + t('common.copied'), group: 'br', life: 3000});
      }else{
        toast.add({severity:'info', detail:  t('common.address') + ' ' + t('common.copied'), group: 'br', life: 3000});
      }
      
    };

    return {
      copy,
      accountName,
      accountPublicKey,
      accountPrivateKey,
      accountAddress
    };
  },

}
</script>
