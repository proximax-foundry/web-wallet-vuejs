<template>
  <div>
    <div class="flex justify-between text-xs sm:text-sm">
      <div><span class="text-gray-400">Swap > NIS1 > In ></span> <span class="text-blue-primary font-bold">Transaction</span></div>
      <div>
        <router-link :to="{ name: 'ViewServices' }" class="font-bold">{{$t('services.allservices')}}</router-link>
      </div>
    </div>
    <div class='mt-2 py-3 gray-line px-0 lg:px-10 xl:px-80'>
      <div class="flex">
        <div class="flex-none">
          <div class="flex hover:bg-gray-200 p-0 sm:p-3 rounded-2xl cursor-pointer">
            <div class="rounded-full flex w-6 h-6 sm:w-10 sm:h-10" :class="`${ currentPage>=1?'bg-blue-primary':'bg-gray-300' }`"><div class="self-center inline-block text-center w-full text-white text-txs sm:text-sm">1</div></div>
            <div class="inline-block self-center ml-3 text-xs sm:text-sm">{{$t('wallets.account')}}</div>
          </div>
        </div>
        <div class="h-1 bg-gray-200 flex-grow mx-2 self-center"></div>
        <div class="flex-none">
          <div class="flex hover:bg-gray-200 p-0 sm:p-3 rounded-2xl cursor-pointer">
            <div class="rounded-full flex w-6 h-6 sm:w-10 sm:h-10" :class="`${ currentPage>=2?'bg-blue-primary':'bg-gray-300' }`"><div class="self-center inline-block text-center w-full text-white text-txs sm:text-sm">2</div></div>
            <div class="inline-block self-center ml-3 text-xs sm:text-sm">{{$t('swap.transaction')}}</div>
          </div>
        </div>
        <div class="h-1 bg-gray-200 flex-grow mx-2 self-center"></div>
        <div class="flex-none">
          <div class="flex hover:bg-gray-200 p-0 sm:p-3 rounded-2xl cursor-pointer">
            <div class="rounded-full flex w-6 h-6 sm:w-10 sm:h-10" :class="`${ currentPage==3?'bg-blue-primary':'bg-gray-300' }`"><div class="self-center inline-block text-center w-full text-white text-txs sm:text-sm">3</div></div>
            <div class="inline-block self-center ml-3 text-xs sm:text-sm">{{$t('swap.certificate')}}</div>
          </div>
        </div>
      </div>
      <div v-if="currentPage==1">
        <p class="text-tsm my-5 text-gray-400">{{$t('swap.nis1accountlist')}}.</p>
        <div class="text-lg my-7 font-bold">{{$t('swap.selectnis1account')}}</div>
        <div class="mb-2 flex justify-between bg-gray-100 rounded-2xl p-3 text-left cursor-pointer hover:bg-blue-100 transition" @click="selectAccount">
          <div class="text-tsm ml-3 text-gray-700">
            <div><b>{{$t('swap.accountname')}}:</b> [[accountName]]</div>
            <div><b>{{$t('swap.nis1address')}}:</b> [[account address]]</div>
            <div><b>NIS1 balance:</b> <img src="@/assets/img/icon-prx-xpx-blue.svg" class="w-5 inline ml-1"> [[balance]] {{ currentNativeTokenName }}</div>
          </div>
          <div class="self-center">
            <img src="@/modules/services/img/icon-account-green-16h-proximax-sirius-wallet.svg" class="w-10 inline mr-3">
          </div>
        </div>
        <div class="mb-2 flex justify-between bg-gray-100 rounded-2xl p-3 text-left cursor-pointer hover:bg-blue-100 transition" @click="selectAccount">
          <div class="text-tsm ml-3 text-gray-700">
            <div><b>{{$t('swap.accountname')}}:</b> [[accountName]]</div>
            <div><b>{{$t('swap.nis1address')}}:</b> [[account address]]</div>
            <div><b>{{$t('swap.nis1balance')}}:</b> <img src="@/assets/img/icon-prx-xpx-blue.svg" class="w-5 inline ml-1"> [[balance]] {{ currentNativeTokenName }}</div>
          </div>
          <div class="self-center">
            <img src="@/modules/services/img/icon-account-green-16h-proximax-sirius-wallet.svg" class="w-10 inline mr-3">
          </div>
        </div>
        <div class="mb-2 flex justify-between bg-gray-100 rounded-2xl p-3 text-left cursor-pointer hover:bg-blue-100 transition" @click="selectAccount">
          <div class="text-tsm ml-3 text-gray-700">
            <div><b>{{$t('swap.accountname')}}:</b> [[accountName]]</div>
            <div><b>{{$t('swap.nis1address')}}:</b> [[account address]]</div>
            <div><b>{{$t('swap.nis1balance')}}:</b> <img src="@/assets/img/icon-prx-xpx-blue.svg" class="w-5 inline ml-1"> [[balance]] {{ currentNativeTokenName }}</div>
          </div>
          <div class="self-center">
            <img src="@/modules/services/img/icon-account-green-16h-proximax-sirius-wallet.svg" class="w-10 inline mr-3">
          </div>
        </div>
      </div>
      <div v-if="currentPage==2">
        <div class="text-lg my-7 font-bold">{{$t('swap.nis1accountselected')}}</div>
        <div class="mb-2 flex justify-between bg-gray-100 rounded-2xl p-3 text-left">
          <div class="text-tsm ml-3 text-gray-700">
            <div><b>{{$t('swap.accountname')}}:</b> [[accountName]]</div>
            <div><b>{{$t('swap.nis1address')}}:</b> [[account address]]</div>
            <div><b>{{$t('swap.nis1balance')}}:</b> <img src="@/assets/img/icon-prx-xpx-blue.svg" class="w-5 inline ml-1"> [[balance]] {{ currentNativeTokenName }}</div>
          </div>
          <div class="self-center">
            <button @click="currentPage=1" class="hover:shadow-lg bg-white hover:bg-gray-100 rounded-3xl border-2 font-bold px-6 py-1 border-blue-primary text-blue-primary outline-none focus:outline-none">{{$t('swap.change')}}</button>
          </div>
        </div>
        <div class="text-lg my-7 font-bold">{{$t('swap.swapamount')}}</div>
        <SwapInput v-model="amount" placeholder="Amount" type="text" icon="coins" :showError="showAmountErr" errorMessage="Insufficient balance" :disabled="disableAmount" @clickedMaxAvailable="updateAmountToMax" :remarkOption="false" />
        <PasswordInput placeholder="Insert wallet password" errorMessage="Wallet password required" :showError="showPasswdError" icon="lock" v-model="walletPasswd" />
        <div class="flex justify-between p-4 rounded-xl bg-white border-yellow-500 border-2 my-8">
          <div class="text-center w-full">
            <div class="w-8 h-8 inline-block relative">
              <div class="rounded-full border border-yellow-500 w-7 h-7 relative">
                <font-awesome-icon icon="exclamation" class="w-5 h-5 text-yellow-500 inline-block absolute" style="top:3px; right: 10px;"></font-awesome-icon>
              </div>
            </div>
            <div class="text-tsm mt-2">{{$t('swap.swapmessage')}} {{$t('swap.swapmessage2')}}.</div>
          </div>
        </div>
        <div class="mt-10">
          <button @click="$router.push({name: 'ViewServices'})" class="default-btn mr-5 focus:outline-none disabled:opacity-50">{{$t('swap.later')}}</button>
          <button type="submit" class="default-btn py-1 focus:outline-none disabled:opacity-50" :disabled="isDisabledSwap" @click="swap">{{$t('swap.confirmswap')}}</button>
        </div>
      </div>
      <div v-if="currentPage==3">
        <div>
          <h1 class="default-title font-bold mt-5 mb-2">Congratulations!</h1>
          <div class="text-sm mb-7">The swap process has already started!</div>
          <swap-certificate-component networkTerm="NIS1" swapType="In" />
          <div class="flex justify-between p-4 rounded-xl bg-white border-yellow-500 border-2 my-8">
            <div class="text-center w-full">
              <div class="w-8 h-8 inline-block relative">
                <div class="rounded-full border border-yellow-500 w-7 h-7 relative">
                  <font-awesome-icon icon="exclamation" class="w-5 h-5 text-yellow-500 inline-block absolute" style="top:3px; right: 10px;"></font-awesome-icon>
                </div>
              </div>
              <div class="text-tsm mt-2">{{$t('swap.certmessage')}}.</div>
            </div>
          </div>
          <label class="inline-flex items-center mb-10">
            <input type="checkbox" class="h-5 w-5 bg-blue-primary" value="true" v-model="savedCheck">
            <span class="ml-2 cursor-pointer text-tsm">{{$t('swap.certconsent')}}.</span>
          </label>
          <div class="mt-10">
            <button type="button" class="hover:shadow-lg bg-white hover:bg-gray-100 rounded-3xl border-2 font-bold px-6 py-2 border-blue-primary text-blue-primary outline-none mr-4 w-32">{{$t('accounts.save')}}</button>
            <button type="button" class="default-btn mr-5 focus:outline-none disabled:opacity-50 w-32" :disabled="!savedCheck" >{{$t('swap.done')}}</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { computed, ref } from "vue";
import PasswordInput from '@/components/PasswordInput.vue';
import SwapInput from '@/modules/services/submodule/mainnetSwap/components/SwapInput.vue';
import SwapCertificateComponent from '@/modules/services/submodule/mainnetSwap/components/SwapCertificateComponent.vue';

export default {
  name: 'ViewServicesMainnetSwapNIS1ToSirius',

  components: {
    PasswordInput,
    SwapInput,
    SwapCertificateComponent,
  },

  setup() {
    const currentNativeTokenName = computed(()=> networkState.currentNetworkProfile.network.currency.name);
    const currentPage = ref(1);
    const showPasswdError = ref(false);
    const walletPasswd = ref('');
    const passwdPattern = "^[^ ]{8,}$";
    const showAmountErr = ref(false);
    const disableAmount = ref(false);
    const isDisabledSwap = computed(() => 
      !(amount.value > 0 && walletPasswd.value.match(passwdPattern) )
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

    return {
      currentPage,
      selectAccount,
      showPasswdError,
      walletPasswd,
      passwdPattern,
      showAmountErr,
      amount,
      disableAmount,
      updateAmountToMax,
      isDisabledSwap,
      swap,
      savedCheck,
      currentNativeTokenName,
    };
  },
}
</script>
<style lang="scss" scoped>
.select-text{
  top: 5px;
}
</style>