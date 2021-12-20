<template>
  <div>
    <div class='lg:w-9/12 ml-2 mr-2 lg:ml-auto lg:mr-auto mt-5'>
      <div class='mt-6 p-6 border filter shadow-lg text-center'>
        <div class="text-md">Main Network Swap</div>
        <div class="text-xs my-3 mb-5 sm:mb-10">Swap from BSC to Proximax Sirius Chain</div>
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
              <div class="px-4 sm:px-10 self-center text-xxs sm:text-xs hidden md:inline-block lg:hidden xl:inline-block">{{$t('swap.validation')}}</div>
            </div>
          </div>
          <div class="flex-grow self-center md:mx-4 h-0.5 bg-gray-100"></div>
          <div class="flex-none">
            <div class="flex border border-gray-300 rounded-md filter shadow-md">
              <div class="flex w-6 h-6 sm:w-10 sm:h-10" :class="`${ currentPage==3?'bg-yellow-500':'bg-gray-300' }`"><div class="self-center inline-block text-center w-full text-txs sm:text-sm font-bold" :class="`${ currentPage>=3?'text-white':'text-gray-400' }`">3</div></div>
              <div class="px-4 sm:px-10 self-center text-xxs sm:text-xs hidden md:inline-block lg:hidden xl:inline-block">{{$t('swap.certificate')}}</div>
            </div>
          </div>
        </div>
        <div v-if="currentPage==1">
          <div class="text-lg my-7 font-bold">Transaction Details</div>
          <div class="bg-yellow-200 text-yellow-900 text-tsm p-3 mb-5 rounded-2xl" v-if="!verifyMetaMaskPlugin">Please make sure there is no other crypto wallet extension currently being enabled except <b>MetaMask</b>.<div class="my-2">Refer to the <a href="https://bit.ly/3mVayCu" target=_new class="text-blue-primary">walkthrough<font-awesome-icon icon="external-link-alt" class="text-blue-primary w-3 h-3 self-center inline-block ml-1"></font-awesome-icon></a> for more details.</div>Please refresh this page after disabling other wallet extensions.</div>
          <div class="error error_box mb-5" v-if="serviceErr!=''">{{ serviceErr }}</div>
          <div class="error error_box mb-5" v-if="err!=''">{{ err }}</div>
          <div class="mb-5 md:flex md:justify-between border border-gray-200 rounded">
            <div class="flex justify-left">
              <div class="w-18 flex items-center justify-center py-5 sm:h-20">
                <img src="@/modules/services/submodule/mainnetSwap/img/icon-metamask-fox.svg" class="w-8 h-8 inline-block">
              </div>
              <div class="text-left flex items-center">
                <div>
                  <div class="text-xxs uppercase text-blue-primary font-bold mb-1">From MetaMask Address</div>
                  <div class="font-bold text-black text-tsm break-all mr-2">{{ isMetamaskConnected?(currentAccount?currentAccount:'Not connected'):'Not connected' }}</div>
                </div>
              </div>
            </div>
            <div class="md:grid hidden " :class="currentAccount?'grid-cols-2':'grid-cols-1'">
              <div class="border-l border-gray-200 text-green-500 font-semibold text-xxs w-16 lg:w-20 flex items-center justify-center uppercase" v-if="currentAccount">
                <div>
                  <img src="@/modules/services/submodule/mainnetSwap/img/icon-connected.svg" class="inline-block">
                  <div>Connected</div>
                </div>
              </div>
              <div class="border-l border-gray-200 text-blue-primary text-tsm font-bold w-16 lg:w-20 flex justify-center items-center">
                <div v-if="isInstallMetamask">
                  <div class="cursor-pointer" @click="connectMetamask()" v-if="!currentAccount">Connect</div>
                  <div class="cursor-pointer" @click="connectMetamask()" v-else>Change</div>
                </div>
                <div v-else>
                  <a href="https://metamask.io/" target=_new>Download</a>
                </div>
              </div>
            </div>
            <div class="md:hidden">
              <div class="border-t border-gray-200 text-green-500 font-semibold text-xxs uppercase p-2" v-if="currentAccount">
                <div class="flex items-center justify-center">
                  <img src="@/modules/services/submodule/mainnetSwap/img/icon-connected.svg" class="inline-block mr-2 w-4 h-4">
                  Connected
                </div>
              </div>
              <div class="border-t border-gray-200 text-blue-primary text-tsm font-bold p-3">
                <div v-if="isInstallMetamask">
                  <div class="cursor-pointer" @click="connectMetamask()" v-if="!currentAccount">Connect</div>
                  <div class="cursor-pointer" @click="connectMetamask()" v-else>Change</div>
                </div>
                <div v-else>
                  <a href="https://metamask.io/" target=_new>Download</a>
                </div>
              </div>
            </div>
          </div>
          <SupplyInputClean :disabled="disableAmount" v-model="amount" :balance="balance" :placeholder="'BEP20 ' + currentNativeTokenName + ' (MINIMUM = 51 )'" type="text" :showError="showAmountErr" :errorMessage="(!amount)?'Required Field':((parseFloat(amount) <= defaultXPXTxFee)?'Insufficient amount':'Insufficient token balance.')" :decimal="6" toolTip="BEP20 token amount to swap. Minimum 51 BEP20 amount is required as 50 will be deducted from the amount as transaction fee." />
          <div class="text-left">
            <SelectInputAccount v-model="siriusAddress" placeholder="To Sirius Chain Account" :selectDefault="walletState.currentLoggedInWallet.selectDefaultAccount().address" />
          </div>
          <div class="bg-blue-50 border border-blue-primary h-20 mt-5 rounded flex items-center justify-center">
            {{ amountReceived }} {{ currentNativeTokenName }} <img src="@/modules/dashboard/img/icon-xpx.svg" class="w-5 h-5 ml-4">
          </div>
          <div class="my-4 text-xs">The fees for the transaction on Sirius Chain will be deducted from this amount, which is 50 {{ currentNativeTokenName }}</div>
          <div class="mt-10 text-center">
            <button @click="$router.push({name: 'ViewServicesMainnetSwap'})" class="text-black font-bold text-xs mr-5 focus:outline-none disabled:opacity-50">Cancel</button>
            <button type="submit" class="default-btn focus:outline-none disabled:opacity-50" :disabled="isDisabledSwap" @click="sendRequest()">Send Request</button>
          </div>
        </div>
        <div v-if="currentPage==2">
          <div class="text-lg my-7">
            <div class="error error_box mb-5" v-if="err!=''">{{ err }}</div>
            <div class="font-bold text-left text-xs md:text-sm" :class="step1?'text-gray-700':'text-gray-300'">Step 1: Send BEP20 {{currentNativeTokenName}} to the escrow account</div>
            <div class="flex border-b border-gray-300 p-3">
              <div class="flex-none">
                <div class=" rounded-full border w-6 h-6 transition-all duration-500" :class="step1?'border-blue-primary':'border-gray-300'">
                  <div class="flex h-full justify-center">
                    <font-awesome-icon icon="check" :class="step1?'text-blue-primary':'text-gray-300'" class="w-3 h-3 self-center inline-block transition-all duration-500"></font-awesome-icon>
                  </div>
                </div>
              </div>
              <div class="flex-grow text-left text-xs md:text-sm ml-3 self-center transition-all duration-500" :class="step1?'text-gray-700':'text-gray-300'">Sending transaction to MetaMask</div>
            </div>
            <div class="flex border-b border-gray-300 p-3">
              <div class="flex-none">
                <div class=" rounded-full border w-6 h-6 transition-all duration-500" :class="isInvalidConfirmedMeta?'border-red-primary':(step2?'border-blue-primary':'border-gray-300')">
                  <div class="flex h-full justify-center">
                    <font-awesome-icon icon="times" class="text-red-primary w-3 h-3 self-center inline-block transition-all duration-500" v-if="isInvalidConfirmedMeta"></font-awesome-icon>
                    <font-awesome-icon icon="check" :class="step2?'text-blue-primary':'text-gray-300'" class="w-3 h-3 self-center inline-block transition-all duration-500" v-else></font-awesome-icon>
                  </div>
                </div>
              </div>
              <div class="flex-grow text-left text-xs md:text-sm ml-3 self-center transition-all duration-500" :class="step2?'text-gray-700':'text-gray-300'">
                {{ isInvalidConfirmedMeta?'Approval in MetaMask is rejected':'Waiting for confirmation in MetaMask' }}
                <div v-if="isInvalidConfirmedMeta" class="mt-5">
                  <button type="button" class="bg-blue-primary rounded mr-5 focus:outline-none text-tsm font-bold py-2 border-blue-primary px-8 text-white hover:shadow-lg" @click="getValidation">Retry</button>
                  <router-link :to="{ name: 'ViewServicesMainnetSwap' }" class="px-6 py-2 text-gray-500 outline-none focus:outline-none mr-4 w-32 text-tsm" tag="button">Cancel this swap</router-link>
                </div>
              </div>
            </div>
            <div class="flex border-b border-gray-300 p-3">
              <div class="flex-none">
                <div class=" rounded-full border w-6 h-6" :class="step3?'border-blue-primary':'border-gray-300'">
                  <div class="flex h-full justify-center">
                    <font-awesome-icon icon="check" :class="step3?'text-blue-primary':'text-gray-300'" class="w-3 h-3 self-center inline-block"></font-awesome-icon>
                  </div>
                </div>
              </div>
              <div class="text-left text-xs md:text-sm ml-3 self-center transition-all duration-500" :class="step3?'text-gray-700':'text-gray-300'">
                Transaction hash:
                <div v-if="validationHash" class="bg-yellow-100 py-2 px-5 mt-3 rounded flex">
                  <a :href="validationLink" target=_new :class="isInvalidConfirmedMeta?'text-gray-300':'text-blue-primary'" class="flex-grow break-all text-tsm self-center hover:underline" id="validateTransfer" :copyValue="validationHash" copySubject="Transfer hash"><font-awesome-icon icon="external-link-alt" class="text-blue-primary w-3 h-3 self-center inline-block mr-2"></font-awesome-icon>{{ validationHash }}</a>
                  <div class="flex-none mr-3">
                    <font-awesome-icon icon="copy" @click="copy('validateTransfer')" class="w-5 h-5 text-blue-primary cursor-pointer self-center mx-3 absolute top-2 hover:opacity-90 duration-800 transition-all" v-if="step3"></font-awesome-icon>
                  </div>
                </div>
                <div class="sm:flex">
                  <button class="sm:flex-none justify-start sm:justify-end bg-blue-primary h-15 w-60 rounded mr-5 focus:outline-none text-xs font-bold py-2 border border-blue-primary px-8 text-white hover:shadow-lg mt-3 sm:mt-0 disabled:opacity-50 self-center" type="button" v-if="validationHash" :disabled="isDisabledCheckTxnConfirmed || transactionFailed" @click="triggerTxnConfirmation">{{ isCheckingTxnConfirmation?'Checking transaction confirmation...':'Check transaction confirmation to proceed' }}</button>
                  <div v-if="validationHash" class="py-2 sm:flex-grow text-xs mt-3">
                    <div class="mb-1">One block confirmation needed to proceed.</div>
                    <div class="mb-1"><b>Do not change Gas Limit, Max Piority Fee or Max Fee</b>.</div>
                    <div class="mb-1">Confirmation might take up to 30 minutes, 1 hour or more due to high transaction volumes.</div>
                    <div class="mb-1">Please <b>do not close or refresh</b> this page until the swap process is complete and you have saved your certificate.</div>
                    <div class="mb-1">View confirmation status on <a :href="validationLink" target="_new" class="text-blue-primary inline-block hover:text-blue-900 hover:underline">BSCScan<font-awesome-icon icon="external-link-alt" class="ml-1 text-blue-primary w-3 h-3 self-center inline-block"></font-awesome-icon></a>.</div>
                  </div>
                </div>
                <div class="text-tsm mt-2 bg-blue-100 px-4 py-2 rounded-xl inline-block text-blue-900" v-if="isTxnNotConfirmed && !transactionFailed">Transaction is not confirmed yet. Please check again in a moment</div>
                <div class="text-tsm mt-2 bg-red-100 px-4 py-2 rounded-xl inline-block text-red-primary" v-if="transactionFailed">Transaction failed. Please try again with suggested gas price and gas limit</div>
              </div>
            </div>
            <div class="font-bold text-left text-xs md:text-sm mt-4" :class="step4?'text-gray-700':'text-gray-300'">Step 2: Validate your Sirius address</div>
            <div class="flex border-b border-gray-300 p-3">
              <div class="flex-none">
                <div class=" rounded-full border w-6 h-6" :class="step4?'border-blue-primary':'border-gray-300'">
                  <div class="flex h-full justify-center">
                    <font-awesome-icon icon="check" :class="step4?'text-blue-primary':'text-gray-300'" class="w-3 h-3 self-center inline-block"></font-awesome-icon>
                  </div>
                </div>
              </div>
              <div class="flex-grow text-left text-xs md:text-sm ml-3 self-center transition-all duration-500" :class="step4?'text-gray-700':'text-gray-300'">Sending message to MetaMask</div>
            </div>
            <div class="flex border-b border-gray-300 p-3">
              <div class="flex-none">
                <div class=" rounded-full border w-6 h-6" :class="isInvalidSignedMeta?'border-red-primary':(step5?'border-blue-primary':'border-gray-300')">
                  <div class="flex h-full justify-center">
                    <font-awesome-icon icon="times" class="text-red-primary w-3 h-3 self-center inline-block" v-if="isInvalidSignedMeta"></font-awesome-icon>
                    <font-awesome-icon icon="check" :class="step5?'text-blue-primary':'text-gray-300'" class="w-3 h-3 self-center inline-block" v-else></font-awesome-icon>
                  </div>
                </div>
              </div>
              <div class="flex-grow text-left text-xs md:text-sm ml-3 self-center transition-all duration-500" :class="step5?'text-gray-700':'text-gray-300'">
                {{ signatureMessage }}
                <div v-if="isInvalidSignedMeta" class="mt-5">
                  <button  type="button" class="bg-blue-primary rounded mr-5 focus:outline-none text-tsm py-2 px-4 text-white hover:shadow-lg w-24" @click="getSigned">Retry</button>
                </div>
              </div>
            </div>
            <div class="flex border-b border-gray-300 p-3">
              <div class="flex-none">
                <div class=" rounded-full border w-6 h-6" :class="step6?'border-blue-primary':'border-gray-300'">
                  <div class="flex h-full justify-center">
                    <font-awesome-icon icon="check" :class="step6?'text-blue-primary':'text-gray-300'" class="w-3 h-3 self-center inline-block"></font-awesome-icon>
                  </div>
                </div>
              </div>
              <div class="flex-grow text-left text-xs md:text-sm ml-3 self-center transition-all duration-500" :class="step6?'text-gray-700':'text-gray-300'">Message signed with signature: <div class="bg-yellow-100 py-2 px-5 mt-2 rounded flex" v-if="messageHash && step6"><div :class="step6?'text-gray-500':'text-gray-300'" class="text-tsm break-all flex-grow" id="validateMessage" :copyValue="messageHash" copySubject="Signature hash">{{ messageHash }}</div><div class="flex-none mr-3"><font-awesome-icon icon="copy" @click="copy('validateMessage')" class="w-5 h-5 text-blue-primary cursor-pointer self-center ml-3 absolute top-2 hover:opacity-90 duration-800 transition-all" v-if="step6"></font-awesome-icon></div></div></div>
            </div>
            <div class="font-bold text-left text-xs md:text-sm mt-4" :class="step7?'text-gray-700':'text-gray-300'">Step 3: Initiate swap</div>
            <div class="flex border-b border-gray-300 p-3">
              <div class="flex-none">
                <div class=" rounded-full border w-6 h-6" :class="isInvalidSwapService?'border-red-primary':(step7?'border-blue-primary':'border-gray-300')">
                  <div class="flex h-full justify-center">
                    <font-awesome-icon icon="times" class="text-red-primary w-3 h-3 self-center inline-block" v-if="isInvalidSwapService"></font-awesome-icon>
                    <font-awesome-icon icon="check" :class="step7?'text-blue-primary':'text-gray-300'" class="w-3 h-3 self-center inline-block" v-else></font-awesome-icon>
                  </div>
                </div>
              </div>
              <div class="flex-grow text-left text-xs md:text-sm ml-3 self-center transition-all duration-500" :class="step7?'text-gray-700':'text-gray-300'">
                {{ isInvalidSwapService?'Unable to send message to swap service':'Message sent to the swap service, swap initiated...' }}
                <div v-if="isInvalidSwapService && swapServerErrIndex <= 3" class="mt-5">
                  <button  type="button" class="bg-blue-primary rounded mr-5 focus:outline-none text-tmd py-2 px-4 text-white hover:shadow-lg disabled:opacity-50" @click="afterSigned" :disabled="disableRetrySwap">{{ retrySwapButtonText }}</button>
                </div>
                <div v-if="swapServerErrIndex>3" class="mt-5 text-tsm sm:text-sm">
                  Sorry. Please save the <b>transaction hash</b>, the <b>signature</b> and contact our <a href="https://t.me/proximaxhelpdesk" target=_new class="text-blue-primary font-bold underline">helpdesk</a>.
                </div>
              </div>
            </div>
          </div>
          <div class="mt-10 text-center">
            <button type="submit" class="default-btn focus:outline-none disabled:opacity-50" :disabled="isDisabledValidate" @click="validated()">{{$t('createsuccessful.continue')}}</button>
          </div>
        </div>
        <div v-if="currentPage==3">
          <div>
            <h1 class="default-title font-bold mt-5 mb-2">Congratulations!</h1>
            <div class="text-tsm mb-7">The swap process has already started!</div>
            <swap-certificate-component networkTerm="BSC" swapType="In" :swapId="swapId" :swapTimestamp="swapTimestamp" :transactionHash="transactionHash" :siriusName="siriusName" :swappedAmount="amount" :siriusAddress="Helper.createAddress(siriusAddress).pretty()" :swapQr="swapQr" :swapLink="validationLink" />
            <button type="button" class="w-40 hover:shadow-lg bg-blue-primary text-white text-xs hover:opacity-50 rounded font-bold px-4 py-3 border border-blue-primary outline-none mr-4 mt-6" @click="saveCertificate">Download Certificate</button>
            <div class="mt-3">
              <a :href="validationLink" target=_new class="underline self-center text-xs font-bold text-blue-primary">View Transaction in Explorer<font-awesome-icon icon="external-link-alt" class="ml-2 text-blue-500 w-3 h-3 self-center inline-block"></font-awesome-icon></a>
            </div>
            <div class="md:mx-20 lg:mx-40 font-bold text-center text-tsm py-5 sm:py-10 mt-5 sm:mt-10 border-t border-gray-200">Swap Details</div>
            <div class="md:mx-20 lg:mx-10 xl:mx-40 border-2 border-gray-200 mt-4 p-5 text-xs font-bold filter shadow-lg">
              <div class="text-blue-primary mb-1">From: MetaMask Account</div>
              <div class="break-all">{{ currentAccount }}</div>
              <div class="mt-1">Swap Amount {{ amount }}</div>
              <div>
                <img src="@/modules/services/submodule/mainnetSwap/img/icon-dots.svg" class="inline-block h-8 my-2">
              </div>
              <div class="text-blue-primary mb-1">To: {{ siriusName }}</div>
              <div>{{ Helper.createAddress(siriusAddress).pretty() }}</div>
              <div class="mt-1">Equivalent to {{ amountReceived }} of {{ currentNativeTokenName }} <img src="@/modules/dashboard/img/icon-xpx.svg" class="w-3 h-3 ml-2 inline relative" style="top: -2px"></div>
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
import { computed, ref, watch, onBeforeUnmount } from "vue";
import SupplyInputClean from '@/components/SupplyInputClean.vue';
import SwapCertificateComponent from '@/modules/services/submodule/mainnetSwap/components/SwapCertificateComponent.vue';
import SelectInputAccount from '@/components/SelectInputAccount.vue';
import { walletState } from '@/state/walletState';
import { copyToClipboard } from '@/util/functions';
import { useToast } from "primevue/usetoast";
import { ethers } from 'ethers';
import { abi, SwapUtils } from '@/util/swapUtils';
import { networkState } from '@/state/networkState';
import { ChainSwapConfig } from "@/models/stores/chainSwapConfig";
import { Helper } from '@/util/typeHelper';

export default {
  name: 'ViewServicesMainnetSwapBSCToSirius',

  components: {
    SupplyInputClean,
    SwapCertificateComponent,
    SelectInputAccount,
  },

  setup() {
    let verifyingTxn;

    const currentNativeTokenName = computed(()=> networkState.currentNetworkProfile.network.currency.name);

    const verifyMetaMaskPlugin = ref(true);
    if(!window.ethereum.isMetaMask){
      verifyMetaMaskPlugin.value = false;
    }

    onBeforeUnmount(() => {
       if(verifyingTxn){
         clearInterval(verifyingTxn);
       }
    })

    let swapData = new ChainSwapConfig(networkState.chainNetworkName);
    swapData.init();

    const defaultXPXTxFee = ref(0);
    const custodian = ref('');
    const tokenAddress = ref('');

    (async() => {
      try {
        const fetchService = await SwapUtils.fetchBSCServiceInfo(swapData.swap_IN_SERVICE_URL);
        if(fetchService.status==200){
          tokenAddress.value = fetchService.data.bscInfo.scAddress;
          custodian.value = fetchService.data.bscInfo.sinkAddress;
          defaultXPXTxFee.value = parseInt(fetchService.data.siriusInfo.feeAmount);
          serviceErr.value = '';
        }else{
          serviceErr.value = 'Swapping service is temporary not available. Please try again later';
        }
      } catch (error) {
        serviceErr.value = 'Swapping service is temporary not available. Please try again later';
      }
    })()

    /* MetaMask integration */
    let bscNetworkName = swapData.BSCNetworkName;
    let bscChainId = swapData.BSCChainId;
    const isInstallMetamask = ref(false);
    const isMetamaskConnected = ref(false);
    const currentAccount = ref(null);
    const balance = ref(0);
    const coinBalance = ref(0);
    const currentNetwork = ref('');
    const isInvalidConfirmedMeta = ref(false);
    const isInvalidSignedMeta = ref(false);
    const isInvalidSwapService = ref(false);
    const disableRetrySwap = ref(false);
    const retrySwapButtonText = ref('Retry');
    const bscScanUrl = swapData.BSCScanUrl;
    const swapServerUrl = SwapUtils.getIncoming_BSCSwapTransfer_URL(swapData.swap_IN_SERVICE_URL);
    const transactionFailed = ref(false);

    const signatureMessage = computed(() => {
      if(isInvalidSignedMeta.value){ // when user rejects signature on MetaMask
        return 'Approval on MetaMask is rejected';
      }else{
        return 'Please sign transaction confirmation in MetaMask';
      }
    });

    let provider;
    let signer;

    if (typeof window.ethereum !== 'undefined') {
      provider = new ethers.providers.Web3Provider(window.ethereum);
      signer = provider.getSigner();

      isInstallMetamask.value = true;
      isMetamaskConnected.value = ethereum.isConnected()?true:false;

      ethereum
        .request({ method: 'eth_accounts' })
        .then(fetchMetaAccount)
        .catch((err) => {
          console.error(err);
        });

      ethereum
        .request({ method: 'eth_chainId' })
        .then((metaChainId) => {
          verifyChain(metaChainId, false);
        })
        .catch((err) => {
          console.error(err);
        });

      ethereum.on('accountsChanged', handleAccountsChanged);

      ethereum.on('chainChanged', (metaChainId) => {
        verifyChain(metaChainId, true);
      });

      // ethereum.on('connect', (connectInfo) => {
      //   console.log(connectInfo)
      // });
    }else{
      console.log('MetaMask not installed')
    }

    function fetchMetaAccount(accounts) {
      if (accounts.length === 0) {
        // MetaMask is locked or the user has not connected any accounts
        // console.log('Please connect to MetaMask.');
        coinBalance.value = 0;
        currentAccount.value = '';
      } else if (accounts[0] !== currentAccount.value) {
        currentAccount.value = accounts[0];
        updateToken();
      }
      isMetamaskConnected.value = ethereum.isConnected()?true:false;
    }

    // For now, 'eth_accounts' will continue to always return an array
    function handleAccountsChanged(accounts) {
      if(window.ethereum.isMetaMask){
        if (accounts.length === 0) {
          // MetaMask is locked or the user has not connected any accounts
          // console.log('Please connect to MetaMask.');
          coinBalance.value = 0;
          currentAccount.value = '';
        } else if (accounts[0] !== currentAccount.value) {
          currentAccount.value = accounts[0];
          serviceErr.value = '';
          updateToken();
        }
      }
      isMetamaskConnected.value = ethereum.isConnected()?true:false;
    }

    function verifyChain(chainId, updateTokenBol = false){
      currentNetwork.value = chainId;
      if(bscChainId === parseInt(chainId)){
        err.value = '';
        if(updateTokenBol){
          updateToken();
        }
      }else{
        err.value = 'Please select ' + bscNetworkName + ' on MetaMask to swap';
      }
    }

    function updateToken(){
      // get MetaMask balance
      ethereum
      .request({ method: 'eth_getBalance', params: [
        currentAccount.value, 'latest'
      ] })
      .then(hexDecimalBalance => {
        coinBalance.value = parseInt(hexDecimalBalance)/Math.pow(10, 18);
      })
      .catch((err) => {
        console.error(err);
      });
    }

    const connectMetamask = () => {
      if(!window.ethereum.isMetaMask){
        verifyMetaMaskPlugin.value = false;
      }else{
        verifyMetaMaskPlugin.value = true;
        ethereum
        .request({ method: 'eth_requestAccounts' })
        .then(fetchMetaAccount)
        .catch((err) => {
          if (err.code === 4001) {
            // EIP-1193 userRejectedRequest error
            // If this happens, the user rejected the connection request.
            console.log('Please connect to MetaMask.');
          } else {
            if(err.code == '-32002'){
              serviceErr.value = 'Please click on MetaMask extension to approve connection';
            }
          }
        });
      }
    };

    watch([currentNetwork, currentAccount, tokenAddress], ([newNetwork, newCurrentAccount, newTokenAddress]) => {
      if(newTokenAddress != undefined && newTokenAddress != ''){
        (async () => {
          try{
            provider = new ethers.providers.Web3Provider(window.ethereum, 'any');
            signer = provider.getSigner();
            const contract = new ethers.Contract(newTokenAddress, abi, signer);
            const tokenBalance = await contract.balanceOf(newCurrentAccount);
            balance.value = tokenBalance.toNumber()/Math.pow(10, 6);
          }catch(err) {
            balance.value = 0;
          }
        })();
      }
    });

    watch(balance, (n) => {
      if(n <= defaultXPXTxFee.value){
        showAmountErr.value = true;
      }else{
        showAmountErr.value = false;
      }
    });

    const step1 = ref(false);
    const step2 = ref(false);
    const step3 = ref(false);
    const step4 = ref(false);
    const step5 = ref(false);
    const step6 = ref(false);
    const step7 = ref(false);
    const validationHash = ref('');
    const validationLink = ref('');
    const messageHash = ref('');
    const swapTimestamp = ref('');
    const swapId = ref('');
    const transactionHash = ref('');
    const swapQr = ref('');

    const saveCertificate = () => {
      SwapUtils.generateIncomingPdfCert('BSC', swapTimestamp.value, siriusAddress.value, swapId.value, transactionHash.value, swapQr.value);
    };

    const toast = useToast();
    const copy = (id) =>{
      let stringToCopy = document.getElementById(id).getAttribute("copyValue");
      let copySubject = document.getElementById(id).getAttribute("copySubject");
      copyToClipboard(stringToCopy);
      toast.add({severity:'info', summary: copySubject + ' copied', detail: stringToCopy , group: 'br', life: 3000});
    };

    const currentPage = ref(1);
    const disableSiriusAddress = ref(false);
    const isDisabledValidate = ref(true);
    const showAmountErr = ref(false);
    const disableAmount = ref(false);
    const siriusAddress = ref(walletState.currentLoggedInWallet.selectDefaultAccount().address);
    const err = ref('');
    const serviceErr = ref('');
    const isDisabledSwap = computed(() =>
      // verify it has been connected to MetaMask too
      !(amount.value > 0 && siriusAddress.value != '' && !err.value && (balance.value >= amount.value) && (amount.value > defaultXPXTxFee.value))
    );
    const amount = ref('0');

    const siriusName = computed(() => {
      let accountSelected = walletState.currentLoggedInWallet.accounts.find(account => account.address == siriusAddress.value);
      if(!accountSelected){
        accountSelected = walletState.currentLoggedInWallet.others.find(account => account.address == siriusAddress.value);
      }
      return accountSelected.name;
    });

    const amountReceived = computed(() => {
      if((amount.value - 50) >0 ){
        return (amount.value - 50);
      }else{
        return 0;
      }
    });

    watch(amount, (n) => {
      if(n <= defaultXPXTxFee.value){
        showAmountErr.value = true;
      }else{
        showAmountErr.value = false;
      }
    });

    // const siriusAddressOption = computed(() => {
    //   let siriusAddress = [];
    //   if(walletState.currentLoggedInWallet){
    //     walletState.currentLoggedInWallet.accounts.forEach((account) => {
    //       siriusAddress.push({
    //         label: account.name + ' - ' + account.address,
    //         value: account.address,
    //       })
    //     });
    //   }
    //   return siriusAddress;
    // });

    const sendRequest = () => {
      currentPage.value = 2;
      setTimeout(() => step1.value = true, 1000);
      setTimeout(() => {
        step2.value = true;
        (async() => {
          await getValidation();
          // if(!isInvalidConfirmedMeta.value){
          //   afterConfirmed();
          // }
        })();
      }, 2000);
    };

    const getValidation = async () => {
      try{
        err.value = '';
        isInvalidConfirmedMeta.value = false;
        provider = new ethers.providers.Web3Provider(window.ethereum, 'any');
        signer = provider.getSigner();
        const Contract = new ethers.Contract(tokenAddress.value, abi, signer);
        const data = await SwapUtils.getBSC_GasLimit(swapData.gasPriceConsultURL);
        var options = {
          gasLimit: data.standardGasLimit,
        };
        const receipt = await Contract.transfer(
          custodian.value,
          ethers.utils.parseUnits(amount.value, 6),
          options,
        );
        validationHash.value = receipt.hash;
        validationLink.value = bscScanUrl + receipt.hash;
        let getTransaction = await provider.getTransaction(receipt.hash);

        if(getTransaction.hash === receipt.hash){
          // if(parseInt(getTransaction.gasLimit) >= data.standardGasLimit){
          afterConfirmed();
          // }else{
          //   err.value = 'Gas limit is too low';
          //   isInvalidConfirmedMeta.value = true;
          // }
        }
      }catch(err){
        isInvalidConfirmedMeta.value = true;
        if(err.code = '-32000'){
          err.value = err.message;
        }
      }
    };

    const afterConfirmed = () => {
      step3.value = true;
    };

    const isCheckingTxnConfirmation = ref(false);
    const isDisabledCheckTxnConfirmed = ref(false);
    const isTxnNotConfirmed = ref(false);

    const triggerTxnConfirmation = () => {
      isCheckingTxnConfirmation.value = true;
      isDisabledCheckTxnConfirmed.value = true;
      isTxnNotConfirmed.value = false;
      setTimeout( async () => {
        await checkTxnConfirmation();
      }, 2000);
    }

    const checkTxnConfirmation = async () => {
      const status = await verifyTransaction();
      isCheckingTxnConfirmation.value = false;
      if(status){
        if(!transactionFailed.value){
          isTxnNotConfirmed.value = false;
          setTimeout( ()=> step4.value = true, 1000);
          setTimeout( ()=> {
            step5.value = true;
            (async() => {
              await getSigned(false);
            })();
          }, 2000);
        }else{
          isDisabledCheckTxnConfirmed.value = false;
          isTxnNotConfirmed.value = true;
        }
      }else{
        isDisabledCheckTxnConfirmed.value = false;
        isTxnNotConfirmed.value = true;
      }
    }

    const swapServiceParam = ref('');

    const getSigned = async () => {
      try{
        isInvalidSignedMeta.value = false;
        provider = new ethers.providers.Web3Provider(window.ethereum, 'any');
        signer = provider.getSigner();
        const messageSignature = await signer.signMessage(siriusAddress.value);
        messageHash.value = messageSignature;
        const data = {
          recipient: siriusAddress.value,
          signature: messageSignature,
          txnInfo: {
            network: "BSC",
            txnHash: validationHash.value
          }
        };
        swapServiceParam.value = data;
        await afterSigned();
      }catch(err){
        isInvalidSignedMeta.value = true;
      }
    };

    const verifyTransaction = async () => {
      try{
        let transactionReceipt = await provider.getTransactionReceipt(validationHash.value);
        if(transactionReceipt && transactionReceipt.status === 1){
          return true;
        }
        else if(transactionReceipt && transactionReceipt.status === 0){
          transactionFailed.value = true;
          return true;
        }
        else{
          return false;
        }
      }catch(err){
        console.log(err);
        return false;
      }
    }

    const swapServerErrIndex = ref(0);

    const afterSigned = async () => {
      step6.value = true;
      step7.value = true;
      retrySwapButtonText.value = 'Initiating swap...';
      disableRetrySwap.value = true;
      let stringifyData = JSON.stringify(swapServiceParam.value);
      try {
        const response = await fetch(swapServerUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: stringifyData, // body data type must match "Content-Type" header
        });

        if(response.status == 200 || response.status == 201){
          const data = await response.json();
          isInvalidSwapService.value = false;
          transactionHash.value = data.remoteTxnHash;
          swapTimestamp.value = data.timestamp;
          swapId.value = data.ctxId;
          swapQr.value = SwapUtils.generateQRCode(validationLink.value);
          setTimeout( ()=> isDisabledValidate.value = false, 1000);
          swapServerErrIndex.value = 0;
        }else if(response.status == 208){
          console.log('208');
        }else{
          isInvalidSwapService.value = true;
          ++swapServerErrIndex.value;
          retrySwapButtonText.value = 'Retry';
          disableRetrySwap.value = false;
        }
      } catch (error) {
        isInvalidSwapService.value = true;
        ++swapServerErrIndex.value;
        retrySwapButtonText.value = 'Retry';
        disableRetrySwap.value = false;
      }
    };

    const validated = () => {
      currentPage.value = 3;
    };

    const savedCheck = ref(false);

    return {
      err,
      balance,
      isInstallMetamask,
      connectMetamask,
      isMetamaskConnected,
      currentAccount,
      copy,
      currentPage,
      isDisabledValidate,
      siriusAddress,
      disableSiriusAddress,
      showAmountErr,
      sendRequest,
      validated,
      amount,
      disableAmount,
      isDisabledSwap,
      savedCheck,
      step1,
      step2,
      step3,
      step4,
      step5,
      step6,
      step7,
      validationLink,
      validationHash,
      messageHash,
      transactionHash,
      swapTimestamp,
      swapId,
      swapQr,
      saveCertificate,
      isInvalidConfirmedMeta,
      isInvalidSignedMeta,
      isInvalidSwapService,
      getValidation,
      getSigned,
      defaultXPXTxFee,
      serviceErr,
      swapServerErrIndex,
      afterSigned,
      disableRetrySwap,
      retrySwapButtonText,
      signatureMessage,
      checkTxnConfirmation,
      triggerTxnConfirmation,
      isCheckingTxnConfirmation,
      isDisabledCheckTxnConfirmed,
      isTxnNotConfirmed,
      transactionFailed,
      verifyMetaMaskPlugin,
      currentNativeTokenName,
      walletState,
      amountReceived,
      Helper,
      siriusName,
    };
  },
}
</script>