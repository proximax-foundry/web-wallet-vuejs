<template>
  <div>
    <transition
      enter-active-class="animate__animated animate__fadeInDown"
      leave-active-class="animate__animated animate__fadeOutUp"
    >
      <div v-if="toggleModal" class="popup-outer absolute flex z-50">
        <div class="modal-popup-box">
          <div class="delete-position">
            <font-awesome-icon icon="times" class="delete-icon-style" @click="closeModal()"></font-awesome-icon>
          </div>
          <div class="w-104">
            <h1 class="default-title font-bold my-5">Accounts</h1>
            <div class="mb-2">Account available in wallet:</div>
            <div style="height: 400px; overflow-y: scroll">
              <div @click="selectAccount(defaultAccount.name, 0)" class="flex text-left p-2 py-2 text-gray-800 bg-blue-100 hover:bg-yellow-50 cursor-pointer">
                <div>
                  <div class="font-bold text-tsm">{{ defaultAccount.name }}</div>
                  <div class="text-sm mt-1">{{ defaultAccount.address }}</div>
                </div>
                <div class="self-center">
                  <span class="text-xs font-normal ml-2 py-1 px-2 rounded bg-yellow-200">Default</span> 
                  <span class="text-xs font-normal ml-2 py-1 px-2 rounded bg-blue-200" v-if="isMultiSig(defaultAccount)">MultiSig</span>
                </div>
              </div>
              <div v-for="(account, index) in accounts" :key="index" @click="selectAccount(account.name, 0)" class="flex text-left p-2 py-2 text-gray-800 hover:bg-yellow-50 cursor-pointer" :class="`${ (index%2==0)?'bg-blue-50':'bg-blue-100' }`">
                <div>
                  <div class="font-bold text-tsm">{{ account.name }}</div>
                  <div class="text-sm mt-1">{{ account.address }}</div>
                </div>
                <div class="self-center"><span class="text-xs font-normal ml-2 py-1 px-2 rounded bg-blue-200" v-if="isMultiSig(account)">MultiSig</span></div>
              </div>
              <div v-for="(account, index) in otherAccounts" :key="index" @click="selectAccount(account.name, 1)" class="flex text-left p-2 py-2 text-gray-800 hover:bg-yellow-50 cursor-pointer" :class="`${ (index%2==0)?'bg-blue-50':'bg-blue-100' }`">
                <div>
                  <div class="font-bold text-tsm">{{ account.name }}</div>
                  <div class="text-sm mt-1">{{ account.address }}</div>
                </div>
                <div class="self-center"><span class="text-xs font-normal ml-2 py-1 px-2 rounded bg-blue-200" v-if="isMultiSig(account)">MultiSig</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <div v-if="toggleModal" @click="closeModal()" class="fixed inset-0 bg-opacity-90 bg-blue-primary"></div>
  </div>
</template>

<script>
import { computed, getCurrentInstance } from 'vue';
import { walletState } from '@/state/walletState';

export default{
  name: 'SetAccountDefaultModal',
  props: ['toggleModal'],

  setup(){
    const internalInstance = getCurrentInstance();
    const emitter = internalInstance.appContext.config.globalProperties.emitter;

    const accounts = computed(
      () =>{
        return walletState.currentLoggedInWallet.accounts.filter((element) => element.default == false)
      }
    );

    const otherAccounts = computed(
      () =>{
        return walletState.currentLoggedInWallet.others;
      }
    );

    const defaultAccount = computed( () => {
      return walletState.currentLoggedInWallet.selectDefaultAccount();
    });

    const isMultiSig = (account) => {
      if(account.multisigInfo){

        let multisigInfos = account.multisigInfo.filter((multisigInfo)=> multisigInfo.level === 1);

        return multisigInfos.length ? true : false;
      }
      else{
        return false
      }
    }

    const setDefault = (name) => {
      walletState.currentLoggedInWallet.setDefaultAccountByName(name);
      selectAccount(name);
    };

    const closeModal = () => {
      emitter.emit("CLOSE_SET_DEFAULT_ACCOUNT_MODAL", true);
    }

    return{
      setDefault,
      accounts,
      defaultAccount,
      isMultiSig,
      closeModal,
      otherAccounts
    };
  },
  methods:{
    selectAccount(name, type){
      let data = {
        name: name,
        type: type
      };

      this.$emit("dashboardSelectAccount", data);
      this.closeModal();
    }
  }
}
</script>
