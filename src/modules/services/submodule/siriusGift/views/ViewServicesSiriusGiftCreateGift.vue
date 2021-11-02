<template>
  <div>
    <div class="flex justify-between text-xs sm:text-sm">
      <div><span class="text-gray-400">{{$t('gift.siriusgift')}} ></span> <span class="text-blue-primary font-bold">{{$t('gift.generategift')}}</span></div>
      <div>
        <router-link :to="{ name: 'ViewServices'}" class="font-bold">{{$t('services.allservices')}}</router-link>
      </div>
    </div>
    <div class='mt-2 py-3 gray-line lg:px-40'>
      <div v-show="!isGeneratedGift">
        <SelectInputPlugin placeholder="Select your account" errorMessage="Please select your account" v-model="selectedAccount" :options="accountOption()" />
        <div class="grid sm:grid-cols-2">
          <div class="sm:col-span-1 sm:pr-1">
            <NumberCardInput :disabled="disabledNumber" v-model="numberCards" placeholder="Cards" title="Number of Gift Cards" icon="credit-card" :showError="numberErr " errorMessage="Number required" />
          </div>
          <div class="sm:col-span-1 sm:pl-1">
            <SupplyInput v-model="amount" title="Amount per Gift Card" placeholder="Amount" type="text" icon="coins" :showError="showAmountErr" errorMessage="Insufficient balance" :decimal="6" :disabled="disableAmount" />
          </div>
        </div>
        <CardMessageInput class="mb-4" :disabled="disabledMessage" v-model="messageCards" :limit="10" placeholder="Message on Gift Cards" title="Message on Gift Cards" icon="comment" :showError="messageErr " errorMessage="Message required" />
        <div class="rounded-2xl bg-gray-100 p-5 mb-5">
          <div class="inline-block mr-4 text-xs"><img src="@/assets/img/icon-prx-xpx-blue.svg" class="w-5 inline mr-1 text-gray-500">{{$t('namespace.transactionfee')}} <span class="text-txs"></span> XPX</div>
        </div>
        <PasswordInput placeholder="Insert wallet password" errorMessage="Wallet password required" :showError="showPasswdError" icon="lock" v-model="walletPasswd" />
        <div class="mt-10">
          <button type="button" class="default-btn mr-5 focus:outline-none" @click="clearInput()">{{$t('signin.clear')}}</button>
          <button type="submit" class="default-btn py-1 disabled:opacity-50" :disabled="disableGenerate" @click="generateGift()">{{$t('gift.generate')}}</button>
        </div>
      </div>
      <div v-show="isGeneratedGift" class="lg:px-40">
        <div class="text-xl font-bold text-blue-primary mt-5">{{$t('createsuccessful.congratz')}}!</div>
        <div class="text-sm my-2">{{$t('gift.giftmessage')}}</div>
        <div class="border-t border-b border-solid border-gray-300 my-10 h-32 flex">
          <div class="self-center text-center w-full">
            <div class="text-md font-bold">[ Gift card name ]</div>
            <div class="text-md mt-3">[ amount ] XPX</div>
            <div class="text-xs mt-3">[ Gift card message ]</div>
          </div>
        </div>
        <div class="flex justify-between p-4 rounded-xl bg-white border-yellow-500 border-2 mb-8">
          <div class="text-center w-full">
            <div class="w-8 h-8 inline-block relative">
              <div class="rounded-full border-yellow-500 border-2 h-8 w-8 relative">
                <font-awesome-icon icon="exclamation" class="w-5 h-5 text-yellow-500 inline-block absolute" style="top:4px; right: 11px;"></font-awesome-icon>
              </div>
            </div>
            <p class="text-xs mt-3">{{$t('gift.giftmessage2')}}</p>
          </div>
        </div>
        <label class="inline-flex items-center mb-10">
          <input type="checkbox" class="h-5 w-5 bg-blue-primary" value="true" v-model="readCheck">
          <span class="ml-2 cursor-pointer text-sm">{{$t('gift.giftmessage3')}}.</span>
        </label>
        <div class="mt-10">
          <button type="button" class="default-btn mr-5 focus:outline-none disabled:opacity-50">{{$t('accounts.save')}}</button>
          <button type="submit" class="default-btn py-1 focus:outline-none disabled:opacity-50" :disabled="!readCheck" @click="backtoPanel()">{{$t('createsuccessful.continue')}}</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { computed, getCurrentInstance, inject, ref } from "vue";
import SupplyInput from '@/components/SupplyInput.vue';
import NumberCardInput from '@/modules/services/submodule/siriusGift/components/NumberCardInput.vue';
import CardMessageInput from '@/modules/services/submodule/siriusGift/components/CardMessageInput.vue';
import PasswordInput from '@/components/PasswordInput.vue';
import SelectInputPlugin from '@/components/SelectInputPlugin.vue';

export default {
  name: 'ViewServicesSiriusGiftCreateGift',
  components: {
    PasswordInput,
    SelectInputPlugin,
    SupplyInput,
    NumberCardInput,
    CardMessageInput,
  },

  setup() {
    const internalInstance = getCurrentInstance();
    const emitter = internalInstance.appContext.config.globalProperties.emitter;
    const appStore = inject("appStore");
    const showPasswdError = ref(false);
    const walletPasswd = ref('');
    const amount = ref(0);
    const disabledNumber = ref(false);
    const numberCards = ref('0');
    const numberErr = ref(false);
    const disabledMessage = ref(false);
    const messageErr = ref(false);
    const messageCards = ref('');
    const disableAmount = ref(false);
    const selectedAccount = ref('');
    const showAmountErr = ref(false);
    const passwdPattern = "^[^ ]{8,}$";
    const isGeneratedGift = ref(false);

    const disableGenerate = computed(() => !( walletPasswd.value.match(passwdPattern) && amount.value != '' && numberCards.value > 0 && messageCards.value != '' && selectedAccount.value != '' ));

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
      showPasswdError.value = false;
      walletPasswd.value = '';
      amount.value = 0;
      numberCards.value = 0;
      messageCards.value = '';
    }

    const generateGift = () => {
      isGeneratedGift.value = true;
    }

    const backtoPanel = () => {
      showPasswdError.value = false;
      walletPasswd.value = '';
      amount.value = 0;
      numberCards.value = 0;
      messageCards.value = '';
      isGeneratedGift.value = false;
    }

    const readCheck = ref(false);

    return {
      amount,
      walletPasswd,
      showPasswdError,
      clearInput,
      disableGenerate,
      accountOption,
      disabledNumber,
      numberCards,
      numberErr,
      disabledMessage,
      messageErr,
      messageCards,
      disableAmount,
      selectedAccount,
      showAmountErr,
      isGeneratedGift,
      generateGift,
      readCheck,
      backtoPanel,
    };
  },
}
</script>
