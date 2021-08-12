<template>
  <div class="flex justify-between text-xs sm:text-sm">
    <div><span class="text-gray-400">{{$t('common.account',2)}} ></span> <span class="text-blue-primary font-bold">{{$t('services.linkToNamespace')}}</span></div>
    <div>
      <router-link :to="{name: 'ViewAccountDisplayAll'}" class="font-bold" active-class="accounts">{{$t('common.viewAllAccounts')}}</router-link>
    </div>
  </div>

  <div class='mt-2 py-3 gray-line text-center px-0 lg:px-10 xl:px-60'>
    <div class="flex justify-between p-4 rounded-xl bg-white border-yellow-500 border-2 mb-8 mt-3">
      <div class="text-center w-full">
        <p class="text-xs">{{$t('namespace.namespaceMessage')}}</p>
      </div>
    </div>
    <SelectInputPlugin selectDefault="0" showSelectTitleProp="true" placeholder="Select action" errorMessage="" v-model="selectAction" :options="actions()"  />
    <SelectInputPlugin showSelectTitleProp="true" placeholder="Select namespace" errorMessage="" v-model="selectNamespace" :options="namespaceOption()"  />
    <div class="flex">
      <div class="flex-grow mr-5">
        <TextInput placeholder="Recipient" :errorMessage="addressErrorMsg" :showError="showAddressError" v-model="address" icon="wallet" :disabled="disableAddress" />
      </div>
      <div class="flex-none">
        <div class="rounded-full bg-gray-300 w-14 h-14 cursor-pointer relative" style="top: -5px;">
          <font-awesome-icon icon="id-card-alt" class="h-20 w-20 inline text-blue-primary absolute" style="top:-12px; left: 19px;"></font-awesome-icon>
        </div>
      </div>
    </div>
    <div class="rounded-2xl bg-gray-100 p-5 my-5">
      <div class="inline-block mr-4 text-xs"><img src="@/assets/img/icon-prx-xpx-blue.svg" class="w-5 inline mr-1 text-gray-500">T{{$t('common.transactionFee')}}   XPX</div>
    </div>
    <PasswordInput placeholder="Enter Wallet Password" :errorMessage="'Please enter wallet ' + appStore.state.currentLoggedInWallet.name + '\'s password'" :showError="showPasswdError" v-model="walletPassword" icon="lock" />
    <div class="mt-10">
      <button type="button" class="default-btn mr-5 focus:outline-none">{{$t('common.clear')}}</button>
      <button type="submit" class="default-btn py-1 disabled:opacity-50 disabled:cursor-auto" :disabled="disableCreate">{{$t('common.create')}}</button>
    </div>
  </div>
</template>
<script>
import { inject, ref } from "vue";
import SelectInputPlugin from '@/components/SelectInputPlugin.vue';
import PasswordInput from '@/components/PasswordInput.vue';
import TextInput from '@/components/TextInput.vue';
// import { useToast } from "primevue/usetoast";

export default {
  name: 'ViewAccountAliasAddressToNamespace',

  components: {
    PasswordInput,
    SelectInputPlugin,
    TextInput,
  },

  setup() {
    // const toast = useToast();
    const appStore = inject("appStore");
    const walletPassword = ref('');
    const showPasswdError = ref(false);
    const disableCreate = ref(true);
    const selectAction = ref('');
    const actions = () => {
      let action = [];
      action.push({value: 0, label: 'Link'});
      return action;
    };
    const selectNamespace = ref('');

    const namespaceOption = () => {
      let namespace = [];
      return namespace;
    };

    const disableAddress = ref(false);
    const address = ref('');
    const showAddressError = ref(false);
    const addressErrorMsg = ref('Insert valid address');

    return {
      appStore,
      actions,
      selectAction,
      walletPassword,
      showPasswdError,
      disableCreate,
      namespaceOption,
      selectNamespace,
      disableAddress,
      address,
      showAddressError,
      addressErrorMsg,
    };
  },
}
</script>
