<template>
  <div>
    <div class='lg:w-9/12 ml-2 mr-2 lg:ml-auto lg:mr-auto mt-5'>
      <div class='mt-6 p-6 border filter shadow-lg text-center'>
        <div class="text-md">Main Network Swap</div>
        <div class="text-xs my-3 mb-5 sm:mb-10"><img src="@/modules/services/submodule/mainnetSwap/submodule2/nis1/img/nem.png" class="mr-2 h-5 inline-block">Swap from NIS1 to Proximax Sirius Chain</div>
        <div class="flex my-10">
          <div class="flex-none">
            <div class="flex border border-gray-300 rounded-md filter shadow-md">
              <div class="flex w-6 h-6 sm:w-10 sm:h-10" :class="`${ currentPage>=1?'bg-yellow-500':'bg-gray-300' }`"><div class="self-center inline-block text-center w-full text-txs sm:text-sm font-bold" :class="`${ currentPage>=1?'text-white':'text-gray-400' }`">1</div></div>
              <div class="px-4 sm:px-10 self-center text-xxs sm:text-xs hidden md:inline-block lg:hidden xl:inline-block">{{$t('swap.transaction')}}</div>
            </div>
          </div>
          <div class="flex-grow self-center md:mx-4 h-0.5 bg-gray-100"></div>
          <div class="flex-none">
            <div class="flex border border-gray-300 rounded-md filter shadow-md">
              <div class="flex w-6 h-6 sm:w-10 sm:h-10" :class="`${ currentPage>=2?'bg-yellow-500':'bg-gray-300' }`"><div class="self-center inline-block text-center w-full text-txs sm:text-sm font-bold" :class="`${ currentPage>=2?'text-white':'text-gray-400' }`">2</div></div>
              <div class="px-4 sm:px-10 self-center text-xxs sm:text-xs hidden md:inline-block lg:hidden xl:inline-block">{{$t('swap.certificate')}}</div>
            </div>
          </div>
        </div>
        <div v-if="currentPage==1">
          <div class="text-lg my-7 font-bold">Transaction Details</div>
          <div class="error error_box mb-5" v-if="err!=''">{{ err }}</div>
          <form @submit.prevent="swap">
            <SelectInputNIS1Account v-model="siriusAddressToSwap" placeholder="From NIS1 Account" />
            <div class="relative">
              <div class="opacity-90 w-full h-full absolute z-10 bg-white" v-if="!siriusAddressToSwap"></div>
              <div v-if="displaySwapOption" class="mt-5">
                <p class="text-gray-500 text-xs text-left mb-1">Swap from:</p>
                <div class="mb-5 mt-3 text-left">
                  <div class="inline-block text-center border px-3 py-2 w-20 border-gray-400 rounded-l-sm transition-all duration-200 text-xs" :class="`${currentSwapTokenName=='xar'?'text-white bg-gray-400 cursor-auto':'hover:border-gray-400 hover:bg-gray-500 hover:text-white cursor-pointer bg-white'}`" @click="currentSwapTokenName='xar'">XAR</div>
                  <div class="inline-block text-center border px-3 py-2 w-20 border-gray-400 rounded-r-sm transition-all duration-200 text-xs" :class="`${currentSwapTokenName=='xpx'?'text-white bg-gray-400 cursor-auto':'hover:border-gray-400 hover:bg-gray-500 hover:text-white cursor-pointer bg-white'}`" @click="currentSwapTokenName='xpx'">XPX</div>
                </div>
              </div>
              <!-- <SwapInput v-model="amount" placeholder="Amount" type="text" icon="coins" :showError="showAmountErr" errorMessage="Insufficient balance" :disabled="disableAmount" @clickedMaxAvailable="updateAmountToMax" :remarkOption="false" /> -->
              <SwapInputClean class="mt-5" :disabled="disableAmount" v-model="amount" :balance="selectedAccountNis1Balance" :placeholder="currentSwapTokenName + ' Amount'" type="text" :showError="showAmountErr" errorMessage="Insufficient balance" emptyErrorMessage="Amount is empty" :maxAmount="maxSwapAmount" :decimal="swapDecimal" @clickedMaxAvailable="updateAmountToMax()" :remarkOption="false" toolTip="XAR or PRX amount to swap to XPX" />
              <!-- <div class="text-left">
                <SelectInputAccount v-model="siriusAddress" placeholder="To Sirius Chain Account" :selectDefault="walletState.currentLoggedInWallet.selectDefaultAccount().address" />
              </div> -->
              <div class="mt-5">
                <SelectInputAccountOutgoingSwap v-model="siriusAddress" placeholder="To Sirius Chain Account" :selectDefault="walletState.currentLoggedInWallet.selectDefaultAccount().address" />
              </div>
              <PasswordInputClean placeholder="Insert wallet password" errorMessage="Wallet password required" :showError="showPasswdError" v-model="walletPasswd" class="mt-5" />
              <div class="bg-blue-50 border border-blue-primary h-20 mt-5 rounded flex items-center justify-center">
                {{ amount }} {{ currentSwapTokenName.toUpperCase() }} <img src="@/modules/dashboard/img/icon-xpx.svg" class="w-5 h-5 ml-4">
              </div>
              <div class="flex justify-center mt-3">
                <div class="text-xs text-gray-600 mt-2 max-w-screen-md">Swap process may take a few hours to complete. If you wish to proceed, you will receive a certificate containing your transaction hash for your records.</div>
              </div>
              <div class="mt-10">
                <button @click="$router.push({name: 'ViewServices'})" class="default-btn mr-5 focus:outline-none disabled:opacity-50" :disabled="isDisabledCancel">{{$t('swap.later')}}</button>
                <button type="submit" class="default-btn py-1 focus:outline-none disabled:opacity-50" :disabled="isDisabledSwap" @click="swap">{{$t('swap.confirmswap')}}</button>
              </div>
            </div>
          </form>
        </div>
        <div v-if="currentPage==2">
          <div>
            <h1 class="default-title font-bold mt-5 mb-2">Congratulations!</h1>
            <div class="text-tsm mb-7">The swap process has already started!</div>
            <swap-certificate-component networkTerm="NIS1" swapType="In" swapId="" swapTimestamp="" :transactionHash="nis1Hash" :siriusName="siriusName" :swappedAmount="amount" :siriusAddress="Helper.createAddress(siriusAddress).pretty()" :swapQr="swapQr" :swapLink="validationLink" />
            <button type="button" class="w-40 hover:shadow-lg bg-blue-primary text-white text-xs hover:opacity-50 rounded font-bold px-4 py-3 border border-blue-primary outline-none mr-4 mt-6" @click="saveCertificate">Download Certificate</button>
            <div class="mt-3">
              <a :href="validationLink" target=_new class="underline self-center text-xs font-bold text-blue-primary">View Transaction in Explorer<font-awesome-icon icon="external-link-alt" class="ml-2 text-blue-500 w-3 h-3 self-center inline-block"></font-awesome-icon></a>
            </div>
            <div class="md:mx-20 lg:mx-40 font-bold text-center text-tsm py-5 sm:py-10 mt-5 sm:mt-10 border-t border-gray-200">Swap Details</div>
            <div class="md:mx-20 lg:mx-10 xl:mx-40 border-2 border-gray-200 mt-4 p-5 text-xs font-bold filter shadow-lg">
              <div class="text-blue-primary mb-1">From: NIS1 Account</div>
              <div class="break-all">{{ Helper.createAddress(siriusAddressToSwap).pretty() }}</div>
              <div class="mt-1">Swap Amount {{ amount }} {{ currentSwapTokenName.toUpperCase() }}</div>
              <div>
                <img src="@/modules/services/submodule/mainnetSwap/img/icon-dots.svg" class="inline-block h-8 my-2">
              </div>
              <div class="text-blue-primary mb-1">To: {{ siriusName }}</div>
              <div>{{ Helper.createAddress(siriusAddress).pretty() }}</div>
              <div class="mt-1">Equivalent to {{ amount }} {{ currentNativeTokenName }} <img src="@/modules/dashboard/img/icon-xpx.svg" class="w-3 h-3 ml-2 inline relative" style="top: -2px"></div>
            </div>
            <div class="my-5 sm:my-7 text-gray-500 text-xs md:mx-20 lg:mx-10 xl:mx-40">Swap process may take a few hours to complete. Please save a copy of your certificate. It is needed in the event of an error.</div>
            <label class="inline-flex items-center mb-5">
              <input type="checkbox" class="h-5 w-5 bg-blue-primary" value="true" v-model="savedCheck">
              <span class="ml-2 cursor-pointer text-xs font-bold">I confirm that I have downloaded a copy of my certificate.</span>
            </label>
            <div class="sm:mt-5 text-center">
              <router-link :to="{ name: 'ViewServicesMainnetSwap' }" class="default-btn mr-5 focus:outline-none w-40 inline-block mt-1" :class="!savedCheck?'opacity-50':''" :is="!savedCheck?'span':'router-link'" tag="button">Done</router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { computed, ref, watch } from "vue";
import PasswordInputClean from '@/components/PasswordInputClean.vue';
// import SwapInput from '@/modules/services/submodule/mainnetSwap/components/SwapInput.vue';
import SwapCertificateComponent from '@/modules/services/submodule/mainnetSwap/components/SwapCertificateComponent.vue';
import SelectInputNIS1Account from '@/modules/services/submodule/mainnetSwap/components/SelectInputNIS1Account.vue';
import { networkState } from '@/state/networkState';
import { walletState } from '@/state/walletState';
import SelectInputAccountOutgoingSwap from '@/modules/services/submodule/mainnetSwap/components/SelectInputAccountOutgoingSwap.vue';
import SwapInputClean from '@/modules/services/submodule/mainnetSwap/components/SwapInputClean.vue';
import { Nis1SwapUtils } from '@/util/nis1SwapUtils';
import { SwapUtils } from '@/util/swapUtils';
import { WalletUtils } from '@/util/walletUtils';
import { Helper } from '@/util/typeHelper';
// import SelectInputAccount from '@/components/SelectInputAccount.vue';

export default {
  name: 'ViewServicesMainnetSwapNIS1ToSirius',

  components: {
    PasswordInputClean,
    // SwapInput,
    SwapInputClean,
    SwapCertificateComponent,
    SelectInputNIS1Account,
    SelectInputAccountOutgoingSwap,
    // SelectInputAccount,
  },

  setup() {
    const err = ref('');
    const currentNativeTokenName = computed(()=> networkState.currentNetworkProfile.network.currency.name);
    const currentPage = ref(1);
    const showPasswdError = ref(false);
    const walletPasswd = ref('');
    const passwdPattern = "^[^ ]{8,}$";
    const showAmountErr = ref(false);
    const disableAmount = ref(false);
    const isDisabledCancel = ref(false);
    const isDisabledSwap = computed(() => 
      !(amount.value > 0 && walletPasswd.value.match(passwdPattern) && siriusAddress.value!='' && siriusAddressToSwap.value!='')
    );

    const selectedAccountNis1Balance = ref(0);

    const currentSwapTokenName = ref('');
    const maxSwapAmount = ref(0);

    const siriusAddressToSwap = ref('');
    const siriusAddress = ref('');
    const swapDecimal = ref(0);

    const amount = ref(0);

    const nis1Hash = ref('');
    const siriusName = ref('');
    const validationLink = ref('');
    const swapQr = ref('');

    const updateAmountToMax = () => {
      amount.value = maxSwapAmount.value;
    };

    const swap = () => {
      isDisabledCancel.value = true;
      if (WalletUtils.verifyWalletPassword(walletState.currentLoggedInWallet.name, networkState.chainNetworkName, walletPasswd.value)) {
        err.value = "";
        const concatOther = walletState.currentLoggedInWallet.accounts.concat(walletState.currentLoggedInWallet.others);
        let account = concatOther.find((account) => account.address == siriusAddress.value); //siriusAddressToSwap
        let accountSender = concatOther.find((account) => account.address == siriusAddressToSwap.value); //siriusAddressToSwap
        (async() => {
          const swapTransaction = await Nis1SwapUtils.initiateNis1Swap(walletPasswd.value, amount.value, swapDecimal.value, currentSwapTokenName.value, account, accountSender); //, appSetting.nis1.nodes
          if(swapTransaction.code == 1){
            nis1Hash.value = swapTransaction.hash;
            validationLink.value = swapTransaction.link;
            swapQr.value = SwapUtils.generateQRCode(swapTransaction.link);
            currentPage.value = 2;
          }else{
            err.value = swapTransaction.message;
          }
        })();
      }
    };

    const saveCertificate = () => {
      Nis1SwapUtils.generateNis1PdfCert('NIS1', '', siriusAddress.value, currentSwapTokenName.value.toUpperCase(), nis1Hash.value, swapQr.value);
    };

    const savedCheck = ref(false);
    const displaySwapOption = ref(false);

    watch(siriusAddressToSwap, (address) => {
      if(address){
        const selected = walletState.currentLoggedInWallet.accounts.find(account => account.address == address);
        if(selected.nis1Account.balance.length > 1){
          displaySwapOption.value = true;
        }
        currentSwapTokenName.value = selected.nis1Account.balance[0].assetId.name;
        swapDecimal.value = selected.nis1Account.balance[0].divisibility;
        maxSwapAmount.value = selected.nis1Account.balance[0].amount;
      }
    });

    watch(currentSwapTokenName, (token) => {
      const selected = walletState.currentLoggedInWallet.accounts.find(account => account.address == siriusAddressToSwap.value);
      swapDecimal.value = selected.nis1Account.balance.find(bal => bal.assetId.name == token).divisibility;
      maxSwapAmount.value = selected.nis1Account.balance.find(bal => bal.assetId.name == token).amount;
    });

    watch(siriusAddress, address => {
      if(address){
        const selected = walletState.currentLoggedInWallet.accounts.find(account => account.address == address);
        siriusName.value = selected.name;
      }
    });

    return {
      err,
      isDisabledCancel,
      currentPage,
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
      siriusAddressToSwap,
      siriusAddress,
      walletState,
      selectedAccountNis1Balance,
      currentSwapTokenName,
      maxSwapAmount,
      displaySwapOption,
      swapDecimal,
      nis1Hash,
      Helper,
      siriusName,
      validationLink,
      swapQr,
      saveCertificate,
    };
  },
}
</script>
<style lang="scss" scoped></style>