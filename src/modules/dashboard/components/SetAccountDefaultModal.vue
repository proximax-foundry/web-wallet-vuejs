<template>
  <div>
    <transition
      enter-active-class="animate__animated animate__fadeInDown"
      leave-active-class="animate__animated animate__fadeOutUp"
    >
      <div v-if="toggleModal" class="popup-outer absolute flex z-50">
        <div class="modal-popup-box">
          <div class="delete-position">
            <img src="@/assets/img/delete.svg" class="w-5 inline-block cursor-pointer" @click="closeModal()">
          </div>
          <div>
            <div class="mb-2 text-xs">{{$t('deletewallet.accountsavailable')}}:</div>
            <div style="max-height: 400px; overflow-y: auto">
              <div @click="selectAccount(defaultAccount.name, 0)" class="flex text-left p-2 py-2 text-gray-800 bg-blue-50 hover:bg-yellow-50 cursor-pointer">
                <div>
                  <div class="font-bold text-xs text-gray-700">{{ defaultAccount.name }}</div>
                  <div class="text-xs mt-2 text-gray-400">{{ defaultAccount.address }}</div>
                </div>
                <div class="self-center">
                  <div class="text-xxs font-normal ml-2 py-1 px-2 rounded bg-yellow-200" :class="`${ isMultiSig(defaultAccount)?'mb-1':'' }`">{{$t('accounts.default')}}</div>
                  <div class="text-xxs font-normal ml-2 py-1 px-2 rounded bg-blue-200" v-if="isMultiSig(defaultAccount)">{{$t('accounts.multisig')}}</div>
                </div>
              </div>
              <div v-for="(account, index) in accounts" :key="index" @click="selectAccount(account.name, 0)" class="flex text-left p-2 py-2 text-gray-800 hover:bg-yellow-50 cursor-pointer" :class="`${ (index%2==0)?'bg-gray-50':'bg-blue-50' }`">
                <div>
                  <div class="font-bold text-xs text-gray-700">{{ account.name }}</div>
                  <div class="text-xs mt-2 text-gray-400">{{ account.address }}</div>
                </div>
                <div class="self-center"><div class="text-xxs font-normal ml-2 py-1 px-2 rounded bg-blue-200" v-if="isMultiSig(account)">{{$t('accounts.multisig')}}</div></div>
              </div>
              <div v-for="(account, index) in otherAccounts" :key="index" @click="selectAccount(account.name, 1)" class="flex text-left p-2 py-2 text-gray-800 hover:bg-yellow-50 cursor-pointer" :class="`${ (index%2==0)?'bg-gray-50':'bg-blue-50' }`">
                <div>
                  <div class="font-bold text-tsm text-gray-700">{{ account.name }}</div>
                  <div class="text-sm mt-2 text-gray-400">{{ account.address }}</div>
                </div>
                <div class="self-center"><div class="text-xs font-normal ml-2 py-1 px-2 rounded bg-blue-200" v-if="isMultiSig(account)">{{$t('accounts.multisig')}}</div></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <div v-if="toggleModal" @click="closeModal()" class="fixed inset-0 bg-opacity-90 bg-white z-40"></div>
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
        if(!walletState.currentLoggedInWallet){
          return [];
        }
        return walletState.currentLoggedInWallet.accounts.filter((element) => element.default == false)
      }
    );

    const otherAccounts = computed(
      () =>{
        if(!walletState.currentLoggedInWallet){
          return [];
        }
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
