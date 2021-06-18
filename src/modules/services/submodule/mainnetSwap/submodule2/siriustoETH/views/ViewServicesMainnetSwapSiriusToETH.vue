<template>
  <div class="flex justify-between text-sm">
    <div><span class="text-gray-400">Mainnet Swap ></span> <span class="text-gray-400">Sirius to ETH ></span> <span class="text-blue-primary font-bold">Accounts List</span></div>
    <div>
      <router-link :to="{ name: 'ViewServices' }" class="font-bold">All Services</router-link>
    </div>
</div>
  <div class='mt-2 py-3 gray-line px-0 lg:px-10 xl:px-80' v-if="currentPage==1">
    <p class="text-tsm my-5 text-gray-400">This is a list of your Sirius Accounts available in this wallet.</p>
    <div class="text-lg my-7 font-bold">Please select a Sirius account</div>
    <div class="mb-2 flex justify-between bg-gray-100 rounded-2xl p-3 text-left cursor-pointer hover:bg-blue-100" @click="selectAccount">
      <div class="text-tsm ml-3 text-gray-700">
        <div><b>Account Name:</b> [[accountName]]</div>
        <div><b>Sirius Address:</b> [[account address]]</div>
        <div><b>Sirius balance:</b> <img src="@/assets/img/icon-prx-xpx-blue.svg" class="w-5 inline ml-1"> [[balance]] XPX</div>
      </div>
      <div class="self-center">
        <img src="@/modules/services/img/icon-account-green-16h-proximax-sirius-wallet.svg" class="w-10 inline mr-3">
      </div>
    </div>
    <div class="mb-2 flex justify-between bg-gray-100 rounded-2xl p-3 text-left cursor-pointer hover:bg-blue-100" @click="selectAccount">
      <div class="text-tsm ml-3 text-gray-700">
        <div><b>Account Name:</b> [[accountName]]</div>
        <div><b>Sirius Address:</b> [[account address]]</div>
        <div><b>Sirius balance:</b> <img src="@/assets/img/icon-prx-xpx-blue.svg" class="w-5 inline ml-1"> [[balance]] XPX</div>
      </div>
      <div class="self-center">
        <img src="@/modules/services/img/icon-account-green-16h-proximax-sirius-wallet.svg" class="w-10 inline mr-3">
      </div>
    </div>
    <div class="mb-2 flex justify-between bg-gray-100 rounded-2xl p-3 text-left cursor-pointer hover:bg-blue-100" @click="selectAccount">
      <div class="text-tsm ml-3 text-gray-700">
        <div><b>Account Name:</b> [[accountName]]</div>
        <div><b>Sirius Address:</b> [[account address]]</div>
        <div><b>Sirius balance:</b> <img src="@/assets/img/icon-prx-xpx-blue.svg" class="w-5 inline ml-1"> [[balance]] XPX</div>
      </div>
      <div class="self-center">
        <img src="@/modules/services/img/icon-account-green-16h-proximax-sirius-wallet.svg" class="w-10 inline mr-3">
      </div>
    </div>
  </div>
  <div class='mt-2 py-3 gray-line px-0 lg:px-10 xl:px-80' v-if="currentPage==2">
    <div class="text-lg my-7 font-bold">Transaction Details</div>
    <div class="mb-5 flex justify-between bg-gray-100 rounded-2xl p-3 text-left">
      <div class="text-tsm ml-3 text-gray-700">
        <div><b>Account Name:</b> [[accountName]]</div>
        <div><b>Sirius Address:</b> [[account address]]</div>
        <div><b>Sirius balance:</b> <img src="@/assets/img/icon-prx-xpx-blue.svg" class="w-5 inline ml-1"> [[balance]] XPX</div>
      </div>
      <div class="self-center">
        <button @click="currentPage=1" class="hover:shadow-lg bg-white hover:bg-gray-100 rounded-3xl border-2 font-bold px-6 py-1 border-blue-primary text-blue-primary outline-none focus:outline-none">Change</button>
      </div>
    </div>
    <SwapInput v-model="amount" placeholder="Amount" type="text" icon="coins" :showError="showAmountErr" errorMessage="Insufficient balance" :disabled="disableAmount" @clickedMaxAvailable="updateAmountToMax" :remarkOption="true" />
    <TextInput placeholder="ETH address to receive your swap" errorMessage="Valid ETH address is required" v-model="ethAddress" icon="wallet" />
    <div class="tex-center font-bold text-lg mb-2">Transaction Fee (ETH Network):</div>
    <div class="md:grid md:grid-cols-3 mb-10">
      <div class="md:col-span-1 mb-3">
        <div class="ethNetwork md:mr-6" :class="`${ (ethNetwork == 'standard')?'selected':'option' }`" @click="ethNetwork='standard'">
          <p class="font-bold text-tsm">Standard (5 min.)</p>
          <div>ETH 0.00086000</div>
          <div>XPX 100.000000 = USD 0.08</div>
        </div>
      </div>
      <div class="md:col-span-1 mb-3">
        <div class="ethNetwork md:mx-3" :class="`${ (ethNetwork == 'fast')?'selected':'option' }`" @click="ethNetwork='fast'">
          <p class="font-bold text-tsm">Fast (2 min.)</p>
          <div>ETH 0.00186000</div>
          <div>XPX 200.000000 = USD 0.08</div>
        </div>
      </div>
      <div class="md:col-span-1 mb-3">
        <div class="ethNetwork md:ml-6" :class="`${ (ethNetwork == 'trader')?'selected':'option' }`" @click="ethNetwork='trader'">
          <p class="font-bold text-tsm">Trader (ASAP)</p>
          <div>ETH 0.00286000</div>
          <div>XPX 300.000000 = USD 0.08</div>
        </div>
      </div>
    </div>
    <div class="tex-center font-bold text-lg mb-2">Transaction Fee:</div>
    <div class="rounded-2xl bg-gray-100 p-5 mb-5">
      <div class="inline-block mr-4 text-xs"><img src="@/assets/img/icon-prx-xpx-blue.svg" class="w-5 inline mr-1 text-gray-500">Transaction Fee: <span class="text-txs"></span> XPX</div>
    </div>
    <PasswordInput placeholder="Insert wallet password" errorMessage="Wallet password required" :showError="showPasswdError" icon="lock" v-model="walletPasswd" />
    <div class="flex justify-between p-4 rounded-xl bg-white border-yellow-500 border-2 my-8">
      <div class="text-center w-full">
        <div class="w-8 h-8 inline-block relative">
          <div class="rounded-full border border-yellow-500 w-7 h-7 relative">
            <font-awesome-icon icon="exclamation" class="w-5 h-5 text-yellow-500 inline-block absolute" style="top:3px; right: 10px;"></font-awesome-icon>
          </div>
        </div>
        <div class="text-tsm mt-2">Swap pricess may take a few hours to complete. If you wish to proceed, you will receive a certificate containing your transaction hash for your records.</div>
      </div>
    </div>
    <div class="mt-10">
      <button @click="$router.push({name: 'ViewServices'})" class="default-btn mr-5 focus:outline-none disabled:opacity-50">Maybe Later</button>
      <button type="submit" class="default-btn focus:outline-none disabled:opacity-50" :disabled="isDisabledSwap" @click="swap">Yes, Swap</button>
    </div>
  </div>
  <div class='mt-2 py-3 gray-line px-0 lg:px-10 xl:px-60 2xl-80' v-if="currentPage==3">
    <div>
      <h1 class="default-title font-bold mt-5 mb-2">Congratulations!</h1>
      <div class="text-sm mb-7">The swap process has already started!</div>
      <swap-certificate-component networkTerm="ETH" />
      <div class="flex justify-between p-4 rounded-xl bg-white border-yellow-500 border-2 my-8">
        <div class="text-center w-full">
          <div class="w-8 h-8 inline-block relative">
            <div class="rounded-full border border-yellow-500 w-7 h-7 relative">
              <font-awesome-icon icon="exclamation" class="w-5 h-5 text-yellow-500 inline-block absolute" style="top:3px; right: 10px;"></font-awesome-icon>
            </div>
          </div>
          <div class="text-tsm mt-2">Save a copy of your certificate. It is needed in the event of an error.</div>
        </div>
      </div>
      <label class="inline-flex items-center mb-10">
        <input type="checkbox" class="h-5 w-5 bg-blue-primary" value="true" v-model="savedCheck">
        <span class="ml-2 cursor-pointer text-tsm">I confirm that i have saved a copy of my certificate.</span>
      </label>
      <div class="mt-10">
        <button type="button" class="hover:shadow-lg bg-white hover:bg-gray-100 rounded-3xl border-2 font-bold px-6 py-2 border-blue-primary text-blue-primary outline-none mr-4 w-32">Save</button>
        <button type="button" class="default-btn mr-5 focus:outline-none disabled:opacity-50 w-32" :disabled="!savedCheck" >Done</button>
      </div>
    </div>
  </div>
</template>
<script>
import { computed, ref } from "vue";
import PasswordInput from '@/components/PasswordInput.vue';
import TextInput from '@/components/TextInput.vue'
import SwapInput from '@/modules/services/submodule/mainnetSwap/components/SwapInput.vue';
import SwapCertificateComponent from '@/modules/services/submodule/mainnetSwap/components/SwapCertificateComponent.vue';

export default {
  name: 'ViewServicesMainnetSwapSiriusToETH',

  components: {
    PasswordInput,
    SwapInput,
    TextInput,
    SwapCertificateComponent,
  },

  setup() {
    const currentPage = ref(1);
    const showPasswdError = ref(false);
    const walletPasswd = ref('');
    const passwdPattern = "^[^ ]{8,}$";
    const showAmountErr = ref(false);
    const disableAmount = ref(false);
    const ethAddress = ref('');
    const isDisabledSwap = computed(() => 
      !(amount.value > 0 && walletPasswd.value.match(passwdPattern) && ethAddress.value != '' )
    );
    const amount = ref(0);
    const selectAccount = () => {
      currentPage.value = 2;
    };

    const updateAmountToMax = () => {
      amount.value = 1000;
    };

    const swap = () => {
      currentPage.value = 3;
    };

    const savedCheck = ref(false);

    const ethNetwork = ref('standard');

    return {
      currentPage,
      selectAccount,
      ethAddress,
      showPasswdError,
      walletPasswd,
      passwdPattern,
      showAmountErr,
      amount,
      disableAmount,
      updateAmountToMax,
      ethNetwork,
      isDisabledSwap,
      swap,
      savedCheck,
    };
  },
}
</script>
<style lang="scss" scoped>
.select-text{
  top: 5px;
}

.ethNetwork{
  @apply rounded-2xl p-3 text-xs border cursor-pointer;
}

.ethNetwork.selected{
  @apply text-gray-100 bg-blue-primary border-blue-primary;
  p{
    @apply text-white;
  }
}

.ethNetwork.option{
  @apply text-gray-600 bg-white border-gray-200 hover:bg-blue-100 hover:border-blue-100;
  p{
    @apply text-blue-primary;
  }
}
</style>