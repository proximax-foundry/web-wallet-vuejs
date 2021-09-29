<template>
  <div class="flex justify-between text-xs sm:text-sm">
    <div><span class="text-gray-400">Swap > BSC > In ></span> <span class="text-blue-primary font-bold">Check Status</span></div>
    <div>
      <router-link :to="{ name: 'ViewServices' }" class="font-bold">Home</router-link>
    </div>
  </div>
  <div class='mt-2 py-3 gray-line px-0 lg:px-10 xl:px-80'>
    <div class="flex">
      <div class="flex-none">
        <div class="flex p-0 sm:p-3">
          <div class="rounded-full flex w-6 h-6 sm:w-10 sm:h-10" :class="`${ currentPage>=1?'bg-blue-primary':'bg-gray-300' }`"><div class="self-center inline-block text-center w-full text-white text-txs sm:text-sm">1</div></div>
          <div class="inline-block self-center ml-3 text-xs sm:text-sm">Check status</div>
        </div>
      </div>
      <div class="h-1 bg-gray-200 flex-grow mx-2 self-center"></div>
      <div class="flex-none">
        <div class="flex p-0 sm:p-3">
          <div class="rounded-full flex w-6 h-6 sm:w-10 sm:h-10" :class="`${ currentPage>=2?'bg-blue-primary':'bg-gray-300' }`"><div class="self-center inline-block text-center w-full text-white text-txs sm:text-sm">2</div></div>
          <div class="inline-block self-center ml-3 text-xs sm:text-sm">Validate</div>
        </div>
      </div>
    </div>
    <div v-if="currentPage==1">
      <div class="text-lg my-7 font-bold">Check Swap Status</div>
      <div class="bg-yellow-200 text-yellow-900 text-tsm p-3 mb-5 rounded-2xl" v-if="!verifyMetaMaskPlugin">Please make sure there is no other crypto wallet extension currently being enabled except <b>MetaMask</b>.<div class="my-2">Refer to the <a href="https://bit.ly/3mVayCu" target=_new class="text-blue-primary">walkthrough<font-awesome-icon icon="external-link-alt" class="text-blue-primary w-3 h-3 self-center inline-block ml-1"></font-awesome-icon></a> for more details.</div>Please refresh this page after disabling other wallet extensions.</div>
      <div class="error error_box mb-5" v-if="serviceErr!=''">{{ serviceErr }}</div>
      <div class="error error_box mb-5" v-if="err!=''">{{ err }}</div>
      <p class="font-bold text-tsm text-left mb-1">Type</p>
      <div class="mb-5 mt-3 text-left">
        <button class="bg-blue-primary px-3 py-2 w-20 text-white font-bold rounded-l-xl border border-blue-primary cursor-auto">In</button><button class="border px-3 py-2 w-20 text-blue-primary font-bold rounded-r-xl cursor-pointer hover:border-blue-primary hover:bg-blue-50 transition-all duration-200" @click="$router.push({name: 'ViewServicesMainnetSwapCheckSiriusToBSC'})">Out</button> <span class="text-gray-500 ml-3 text-tsm">From BSC to Sirius</span>
      </div>
      <p class="font-bold text-tsm text-left mb-1">MetaMask Address</p>
      <div class="mb-5 flex justify-between bg-gray-100 rounded-2xl p-3 text-left" v-if="isInstallMetamask">
        <div class="text-tsm text-gray-700 self-center relative">
          <div><img src="@/modules/services/submodule/mainnetSwap/img/icon-metamask.svg" class="w-5 inline ml-1 mr-2 absolute" style="top: 0px;"> <div class="ml-8 inline-block break-all">{{ isMetamaskConnected?(currentAccount?currentAccount:'Not connected'):'Not connected' }}</div></div>
        </div>
        <div class="self-center">
          <button @click="connectMetamask()" class="hover:shadow-lg bg-white hover:bg-gray-100 rounded-3xl border-2 font-bold px-6 py-1 border-blue-primary text-blue-primary outline-none focus:outline-none" v-if="!currentAccount">Connect to MetaMask</button>
          <button class=" bg-green-50 rounded-3xl border font-bold px-6 py-1 border-green-500 text-green-500 text-tsm outline-none focus:outline-none cursor-auto" v-else>Connected</button>
        </div>
      </div>
      <div class="mb-5 flex justify-between bg-yellow-200 rounded-2xl p-3 text-left" v-else>
        <div class="text-tsm text-gray-700 self-center relative">
          <div><img src="@/modules/services/submodule/mainnetSwap/img/icon-metamask.svg" class="w-5 inline ml-1 mr-2 absolute" style="top: 0px;"> <div class="ml-8 inline-block text-gray-800">MetaMask is not installed</div></div>
        </div>
        <div class="self-center">
          <a href="https://metamask.io/" target=_new class="hover:shadow-lg bg-white hover:bg-gray-100 rounded-3xl border-2 font-bold px-6 py-2 border-blue-primary text-blue-primary outline-none focus:outline-none">Download MetaMask</a>
        </div>
      </div>
      <p class="font-bold text-tsm text-left mb-1">BSC Transaction Hash</p>
      <TextInput placeholder="BSC Transaction Hash" errorMessage="Please key in valid transaction hash" :showError="showTxnHashError" v-model="remoteTxnHash" icon="hashtag" class="w-full" />
      <div class="mt-10">
        <button @click="$router.push({name: 'ViewServices'})" class="default-btn mr-5 focus:outline-none disabled:opacity-50">Cancel</button>
        <button type="submit" class="default-btn focus:outline-none disabled:opacity-50" :disabled="isDisabledCheck" @click="checkStatus">Check Status</button>
      </div>
    </div>
    <div v-if="currentPage==2">
      <div class="text-lg my-7">
        <div class="error error_box mb-5" v-if="err!=''">{{ err }}</div>
        <div class="font-bold text-left text-xs md:text-sm lg:text-lg" :class="step1?'text-gray-700':'text-gray-300'">Step 1: Check transaction status</div>
        <div class="flex border-b border-gray-300 p-3">
          <div class="flex-none">
            <div class=" rounded-full border w-6 h-6 md:w-9 md:h-9 transition-all duration-500" :class="step1?'border-blue-primary':'border-gray-300'">
              <div class="flex h-full justify-center">
                <font-awesome-icon icon="check" :class="step1?'text-blue-primary':'text-gray-300'" class="w-3 h-3 md:w-7 md:h-7 self-center inline-block transition-all duration-500"></font-awesome-icon>
              </div>
            </div>
          </div>
          <div class="flex-grow text-left text-xs md:text-sm lg:text-lg ml-3 self-center transition-all duration-500" :class="step1?'text-gray-700':'text-gray-300'">Checking BSC transaction status<div class="text-tsm text-gray-500 my-3" v-if="transactionPending">Pending confirmation: {{ numConfirmation }} of 12 confirmations</div></div>
        </div>
        <div class="flex border-b border-gray-300 p-3">
          <div class="flex-none">
            <div class=" rounded-full border w-6 h-6 md:w-9 md:h-9 transition-all duration-500" :class="isInvalidRemoteTxnHash?'border-red-primary':(step2?'border-blue-primary':'border-gray-300')">
              <div class="flex h-full justify-center">
                <font-awesome-icon icon="times" class="text-red-primary w-3 h-3 md:w-7 md:h-7 self-center inline-block transition-all duration-500" v-if="isInvalidRemoteTxnHash"></font-awesome-icon>
                <font-awesome-icon icon="check" :class="step2?'text-blue-primary':'text-gray-300'" class="w-3 h-3 md:w-7 md:h-7 self-center inline-block transition-all duration-500" v-else></font-awesome-icon>
              </div>
            </div>
          </div>
          <div class="flex-grow text-left text-xs md:text-sm lg:text-lg ml-3 self-center transition-all duration-500" :class="step2?'text-gray-700':'text-gray-300'">
            {{ isInvalidRemoteTxnHash?(transactionNotFound?'Transaction is not found':'Transaction has failed.'):'BSC Transaction is successful:' }}
            <div v-if="!isInvalidRemoteTxnHash && step2" class="mt-2">
              <div v-if="remoteTxnHash" class="bg-yellow-100 py-2 px-5 mt-1 rounded-xl flex">
                <a :href="remoteTxnLink" target=_new :class="isInvalidRemoteTxnHash?'text-gray-300':'text-blue-primary'" class="flex-grow break-all text-tsm self-center hover:underline" id="validateTransfer" :copyValue="remoteTxnHash" copySubject="Transfer hash"><font-awesome-icon icon="external-link-alt" class="text-blue-primary w-3 h-3 self-center inline-block mr-2"></font-awesome-icon>{{ remoteTxnHash }}</a>
                <div class="flex-none">
                  <font-awesome-icon icon="copy" @click="copy('validateTransfer')" class="w-5 h-5 text-blue-primary cursor-pointer self-center ml-3 absoltue top-2 hover:opacity-90 duration-800 transition-all" v-if="step2"></font-awesome-icon>
                </div>
              </div>
            </div>
            <div v-if="isInvalidRemoteTxnHash && step2" class="mt-2 text-sm text-gray-700">
              {{ txtRemoteTransactionErrorMsg }}
              <router-link :to="{ name: 'ViewServicesMainnetSwapBSCToSirius' }" class="bg-blue-primary text-white py-2 px-5 rounded-2xl w-24 block text-center my-3 font-bold">Swap</router-link>
            </div>
          </div>
        </div>
        <div class="font-bold text-left text-xs md:text-sm lg:text-lg mt-4" :class="step3?'text-gray-700':'text-gray-300'">Step 2: Check swap status</div>
        <div class="flex border-b border-gray-300 p-3">
          <div class="flex-none">
            <div class=" rounded-full border w-6 h-6 md:w-9 md:h-9" :class="step3?'border-blue-primary':'border-gray-300'">
              <div class="flex h-full justify-center">
                <font-awesome-icon icon="check" :class="step3?'text-blue-primary':'text-gray-300'" class="w-3 h-3 md:w-7 md:h-7 self-center inline-block"></font-awesome-icon>
              </div>
            </div>
          </div>
          <div class="flex-grow text-left text-xs md:text-sm lg:text-lg ml-3 self-center transition-all duration-500" :class="step3?'text-gray-700':'text-gray-300'">Requesting from swap service</div>
        </div>
        <div class="flex border-b border-gray-300 p-3">
          <div class="flex-none">
            <div class=" rounded-full border w-6 h-6 md:w-9 md:h-9" :class="(isInvalidSwapCheck && step4)?'border-red-primary':(step4?'border-blue-primary':'border-gray-300')">
              <div class="flex h-full justify-center">
                <font-awesome-icon icon="times" class="text-red-primary w-3 h-3 md:w-7 md:h-7 self-center inline-block" v-if="isInvalidSwapCheck && step4"></font-awesome-icon>
                <font-awesome-icon icon="check" :class="step4?'text-blue-primary':'text-gray-300'" class="w-3 h-3 md:w-7 md:h-7 self-center inline-block" v-else></font-awesome-icon>
              </div>
            </div>
          </div>
          <div class="flex-grow text-left text-xs md:text-sm lg:text-lg ml-3 self-center transition-all duration-500" :class="step4?'text-gray-700':'text-gray-300'">
            {{ (isInvalidSwapCheck && step4)?(isCheckSwapStatusNotFound?'Transaction is not found in swap service:':'Transaction is invalid in the swap service:'):'Swap is successful:' }}
            <div v-if="!isInvalidSwapCheck && step4" class="mt-2">
              <div v-if="siriusTxnHash" class="bg-yellow-100 py-2 px-5 mt-1 rounded-xl flex">
                <a :href="siriusTxnLink" target=_new class="text-blue-primary flex-grow break-all text-tsm self-center hover:underline" id="validateTransfer" :copyValue="remoteTxnHash" copySubject="Transfer hash"><font-awesome-icon icon="external-link-alt" class="text-blue-primary w-3 h-3 self-center inline-block mr-2"></font-awesome-icon>{{ siriusTxnHash }}</a>
                <div class="flex-none">
                  <font-awesome-icon icon="copy" @click="copy('validateTransfer')" class="w-5 h-5 text-blue-primary cursor-pointer self-center ml-3 absoltue top-2 hover:opacity-90 duration-800 transition-all" v-if="step4"></font-awesome-icon>
                </div>
              </div>
              <div class="text-gray-600 mt-3 text-tsm ml-2">Swap is already in progress or has been completed successfully.</div>
            </div>
            <div v-if="isInvalidSwapCheck && step4">
              <div class="sm:flex my-4">
                <button :disabled="isInitiateSwap" @click="displayInitiateSwapPanel" class="sm:flex-none justify-start sm:justify-end bg-blue-primary h-15 w-40 rounded-3xl mr-5 focus:outline-none text-tsm font-bold py-2 border border-blue-primary px-8 text-white hover:shadow-lg mt-3 sm:mt-0 disabled:opacity-50 self-center" type="button">Initiate swap</button>
                <div class="py-2 sm:flex-grow text-tsm">
                  <div class="mb-1">Initiative swap with this BSC Transaction Hash</div>
                </div>
              </div>
            </div>
            <div v-if="isInitiateSwap">
              <div class="text-gray-700 text-tsm mt-5 font-bold">To: Sirius Address:</div>
              <div class="sm:flex">
                <SelectSiriusAccountCheckSwapInputPlugin class="sm:flex-grow mt-2" v-model="siriusAddressSelected" icon="card-alt" errorMessage="Sirius Address required" :options="siriusAddressOption" :disabled="disableSiriusAddress" @clear-selection="clearSiriusAddress" />
                <button :disabled="!siriusAddressSelected || disableConfirmAddressSelection" @click="confirmAddress" class="sm:flex-none justify-start sm:justify-end bg-blue-primary h-15 w-40 rounded-3xl sm:ml-5 focus:outline-none text-tsm font-bold py-2 border border-blue-primary px-8 text-white hover:shadow-lg mt-3 sm:mt-2 disabled:opacity-50 self-center" type="button">Confirm</button>
              </div>
            </div>
          </div>
        </div>
        <div v-if="isInitiateSwap">
          <div class="font-bold text-left text-xs md:text-sm lg:text-lg mt-4" :class="step5?'text-gray-700':'text-gray-300'">Step 3: Validate your Sirius address</div>
          <div class="flex border-b border-gray-300 p-3">
            <div class="flex-none">
              <div class=" rounded-full border w-6 h-6 md:w-9 md:h-9" :class="step5?'border-blue-primary':'border-gray-300'">
                <div class="flex h-full justify-center">
                  <font-awesome-icon icon="check" :class="step5?'text-blue-primary':'text-gray-300'" class="w-3 h-3 md:w-7 md:h-7 self-center inline-block"></font-awesome-icon>
                </div>
              </div>
            </div>
            <div class="flex-grow text-left text-xs md:text-sm lg:text-lg ml-3 self-center transition-all duration-500" :class="step5?'text-gray-700':'text-gray-300'">Sending message to MetaMask</div>
          </div>
          <div class="flex border-b border-gray-300 p-3">
            <div class="flex-none">
              <div class=" rounded-full border w-6 h-6 md:w-9 md:h-9" :class="isInvalidSignedMeta?'border-red-primary':(step6?'border-blue-primary':'border-gray-300')">
                <div class="flex h-full justify-center">
                  <font-awesome-icon icon="times" class="text-red-primary w-3 h-3 md:w-7 md:h-7 self-center inline-block" v-if="isInvalidSignedMeta"></font-awesome-icon>
                  <font-awesome-icon icon="check" :class="step5?'text-blue-primary':'text-gray-300'" class="w-3 h-3 md:w-7 md:h-7 self-center inline-block" v-else></font-awesome-icon>
                </div>
              </div>
            </div>
            <div class="flex-grow text-left text-xs md:text-sm lg:text-lg ml-3 self-center transition-all duration-500" :class="step6?'text-gray-700':'text-gray-300'">
              {{ signatureMessage }}
              <div v-if="isInvalidSignedMeta" class="mt-5">
                <button  type="button" class="bg-blue-primary rounded-3xl mr-5 focus:outline-none text-tmd py-2 px-4 text-white hover:shadow-lg w-24" @click="getSigned">Retry</button>
              </div>
            </div>
          </div>
          <div class="flex border-b border-gray-300 p-3">
            <div class="flex-none">
              <div class=" rounded-full border w-6 h-6 md:w-9 md:h-9" :class="step7?'border-blue-primary':'border-gray-300'">
                <div class="flex h-full justify-center">
                  <font-awesome-icon icon="check" :class="step7?'text-blue-primary':'text-gray-300'" class="w-3 h-3 md:w-7 md:h-7 self-center inline-block"></font-awesome-icon>
                </div>
              </div>
            </div>
            <div class="flex-grow text-left text-xs md:text-sm lg:text-lg ml-3 self-center transition-all duration-500" :class="step7?'text-gray-700':'text-gray-300'">Message signed with signature: <div class="bg-yellow-100 py-2 px-5 mt-1 rounded-xl flex" v-if="messageHash && step7"><div :class="step7?'text-gray-500':'text-gray-300'" class="text-tsm break-all flex-grow" id="validateMessage" :copyValue="messageHash" copySubject="Signature hash">{{ messageHash }}</div><div class="flex-none"><font-awesome-icon icon="copy" @click="copy('validateMessage')" class="w-5 h-5 text-blue-primary cursor-pointer self-center ml-3 absoltue top-2 hover:opacity-90 duration-800 transition-all" v-if="step7"></font-awesome-icon></div></div></div>
          </div>
          <div class="font-bold text-left text-xs md:text-sm lg:text-lg mt-4" :class="step8?'text-gray-700':'text-gray-300'">Step 4: Initiate swap</div>
          <div class="flex border-b border-gray-300 p-3">
            <div class="flex-none">
              <div class=" rounded-full border w-6 h-6 md:w-9 md:h-9" :class="isInvalidSwapService?'border-red-primary':(step8?'border-blue-primary':'border-gray-300')">
                <div class="flex h-full justify-center">
                  <font-awesome-icon icon="times" class="text-red-primary w-3 h-3 md:w-7 md:h-7 self-center inline-block" v-if="isInvalidSwapService"></font-awesome-icon>
                  <font-awesome-icon icon="check" :class="step8?'text-blue-primary':'text-gray-300'" class="w-3 h-3 md:w-7 md:h-7 self-center inline-block" v-else></font-awesome-icon>
                </div>
              </div>
            </div>
            <div class="flex-grow text-left text-xs md:text-sm lg:text-lg ml-3 self-center transition-all duration-500" :class="step8?'text-gray-700':'text-gray-300'">
              {{ isInvalidSwapService?'Unable to send message to swap service':(swapStatus208?'Swap has already been initiated earlier.':'Message sent to the swap service, swap initiated...') }}
              <div v-if="isInvalidSwapService && swapServerErrIndex <= 3" class="mt-5">
                <button  type="button" class="bg-blue-primary rounded-3xl mr-5 focus:outline-none text-tmd py-2 px-4 text-white hover:shadow-lg disabled:opacity-50" @click="afterSigned" :disabled="disableRetrySwap">{{ retrySwapButtonText }}</button>
              </div>
              <div v-if="swapServerErrIndex > 3" class="mt-5 text-tsm sm:text-sm">
                Sorry. Please save the <b>transaction hash</b>, the <b>signature</b> and contact our <a href="https://t.me/proximaxhelpdesk" target=_new class="text-blue-primary font-bold underline">helpdesk</a>.
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="mt-10">
        <button type="submit" class="default-btn focus:outline-none disabled:opacity-50" :disabled="isDisabledValidate" @click="validated()" v-if="isInitiateSwap && !swapStatus208">Continue</button>
        <router-link :to="{ name: 'ViewServices' }" class="default-btn focus:outline-none w-40 inline-block" :class="isDisabledValidate?'opacity-50':''" :is="isDisabledValidate?'span':'router-link'" tag="button" v-else>Done</router-link>
      </div>
    </div>
    <div v-if="currentPage==3">
      <div>
        <h1 class="default-title font-bold mt-5 mb-2">Congratulations!</h1>
        <div class="text-sm mb-7">The swap process has already started!</div>
        <swap-certificate-component networkTerm="BSC" swapType="In" :swapId="swapId" :swapTimestamp="swapTimestamp" :transactionHash="transactionHash" :siriusAddress="siriusAddressSelected" :swapQr="swapQr" :swapLink="remoteTxnLink" />
        <div class="flex justify-between p-4 rounded-xl bg-white border-yellow-500 border-2 my-8">
          <div class="text-center w-full">
            <div class="w-8 h-8 inline-block relative">
              <div class="rounded-full border border-yellow-500 w-7 h-7 relative">
                <font-awesome-icon icon="exclamation" class="w-5 h-5 text-yellow-500 inline-block absolute" style="top:3px; right: 10px;"></font-awesome-icon>
              </div>
            </div>
            <div class="text-tsm mt-2">Download your certificate. It is needed in the event of an error.</div>
          </div>
        </div>
        <label class="inline-flex items-center mb-10">
          <input type="checkbox" class="h-5 w-5 bg-blue-primary" value="true" v-model="savedCheck">
          <span class="ml-2 cursor-pointer text-tsm">I confirm that I have downloaded a copy of my certificate.</span>
        </label>
        <div class="sm:mt-10">
          <button type="button" class="hover:shadow-lg bg-white hover:bg-gray-100 rounded-3xl border-2 font-bold px-6 py-2 border-blue-primary text-blue-primary outline-none mr-4 w-60 mt-6" @click="saveCertificate">Download Certificate</button>
          <router-link :to="{ name: 'ViewServices' }" class="default-btn mr-5 focus:outline-none w-60 inline-block mt-6" :class="!savedCheck?'opacity-50':''" :is="!savedCheck?'span':'router-link'" tag="button">Done</router-link>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { computed, ref, watch, onBeforeUnmount } from "vue";
import TextInput from '@/components/TextInput.vue';
import SwapCertificateComponent from '@/modules/services/submodule/mainnetSwap/components/SwapCertificateComponent.vue';
import SelectSiriusAccountCheckSwapInputPlugin from '@/modules/services/submodule/mainnetSwap/components/SelectSiriusAccountCheckSwapInputPlugin.vue';
import { walletState } from '@/state/walletState';
import { copyToClipboard } from '@/util/functions';
import { useToast } from "primevue/usetoast";
import { ethers } from 'ethers';
import { abi, SwapUtils } from '@/util/swapUtils';
import { networkState } from '@/state/networkState';
import { ChainSwapConfig } from "@/models/stores/chainSwapConfig";

export default {
  name: 'ViewServicesMainnetSwapCheckBSCToSirius',

  components: {
    TextInput,
    SwapCertificateComponent,
    SelectSiriusAccountCheckSwapInputPlugin,
  },

  setup() {
    let verifyingTxn;

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

    // const defaultXPXTxFee = ref(0);
    const custodian = ref('');
    const tokenAddress = ref('');

    (async() => {
      try {
        const fetchService = await SwapUtils.fetchBSCServiceInfo(swapData.swap_IN_SERVICE_URL);
        if(fetchService.status==200){
          tokenAddress.value = fetchService.data.bscInfo.scAddress;
          custodian.value = fetchService.data.bscInfo.sinkAddress;
          // defaultXPXTxFee.value = parseInt(fetchService.data.siriusInfo.feeAmount);
          serviceErr.value = '';
        }else{
          serviceErr.value = 'Swapping service is temporary not available. Please try again later';
        }
      } catch (error) {
        serviceErr.value = 'Swapping service is temporary not available. Please try again later';
      }
    })()

    const txnHashPattern= "^[0-9A-Za-z]{66}$";
    const remoteTxnHash = ref('');
    const showTxnHashError = computed(()=> !remoteTxnHash.value.match(txnHashPattern) && remoteTxnHash.value.length > 0);

    /* MetaMask integration */
    let ethereumChainId = swapData.BSCChainId;
    let ethereumNetworkName = swapData.BSCNetworkName;
    const isInstallMetamask = ref(false);
    const isMetamaskConnected = ref(false);
    const currentAccount = ref(null);
    const currentNetwork = ref('');

    const isInvalidSignedMeta = ref(false);
    const isInvalidSwapService = ref(false);
    const disableRetrySwap = ref(false);
    const retrySwapButtonText = ref('Retry');

    const isInvalidRemoteTxnHash = ref(false);
    const isPendingRemoteTxnHash = ref(false);
    const transactionNotFound = ref(false);
    const transactionFailed = ref(false);
    const transactionPending = ref(false);
    // const transactionSuccess = ref(false);

    const bscScanUrl = swapData.BSCScanUrl;
    const checkSwapStatusUrl = SwapUtils.getIncoming_BSCCheckStatus_URL(swapData.swap_IN_SERVICE_URL);
    const swapServerUrl = SwapUtils.getIncoming_BSCSwapTransfer_URL(swapData.swap_IN_SERVICE_URL);


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

    }else{
      console.log('MetaMask not installed')
    }

    function fetchMetaAccount(accounts) {
      if (accounts.length === 0) {
        // MetaMask is locked or the user has not connected any accounts
        // console.log('Please connect to MetaMask.');
        currentAccount.value = '';
      } else if (accounts[0] !== currentAccount.value) {
        currentAccount.value = accounts[0];
      }
      isMetamaskConnected.value = ethereum.isConnected()?true:false;
    }

    // For now, 'eth_accounts' will continue to always return an array
    function handleAccountsChanged(accounts) {
      if(window.ethereum.isMetaMask){
        if (accounts.length === 0) {
          // MetaMask is locked or the user has not connected any accounts
          currentAccount.value = '';
        } else if (accounts[0] !== currentAccount.value) {
          currentAccount.value = accounts[0];
          serviceErr.value = '';
        }
      }
      isMetamaskConnected.value = ethereum.isConnected()?true:false;
    }

    function verifyChain(chainId){
      currentNetwork.value = chainId;
      if(ethereumChainId === parseInt(chainId)){
        err.value = '';
      }else{
        err.value = 'Please select ' + ethereumNetworkName + ' on MetaMask to swap';
      }
    }

    const connectMetamask = () => {
      if(window.ethereum.isMetaMask == undefined){
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

    const isInvalidSwapCheck = ref(false);
    const isCheckSwapStatusNotFound = ref(false);

    const step1 = ref(false);
    const step2 = ref(false);
    const step3 = ref(false);
    const step4 = ref(false);

    const messageHash = ref('');
    const swapTimestamp = ref('');
    const swapId = ref('');
    const transactionHash = ref('');
    const swapQr = ref('');

    const saveCertificate = () => {
      SwapUtils.generateIncomingPdfCert('BSC', swapTimestamp.value, siriusAddressSelected.value, swapId.value, transactionHash.value, swapQr.value);
    };

    const toast = useToast();
    const copy = (id) =>{
      let stringToCopy = document.getElementById(id).getAttribute("copyValue");
      let copySubject = document.getElementById(id).getAttribute("copySubject");
      copyToClipboard(stringToCopy);
      toast.add({severity:'info', summary: copySubject + ' copied', detail: stringToCopy , group: 'br', life: 3000});
    };

    const currentPage = ref(1);

    const isDisabledValidate = ref(true);

    const siriusAddress = ref('');
    const err = ref('');
    const serviceErr = ref('');
    const isDisabledCheck = computed(() =>
      // verify it has been connected to MetaMask too
      !(!err.value && !(showTxnHashError.value && remoteTxnHash.value.length > 0) && remoteTxnHash.value.length > 0)
    );

    const checkStatus = () => {
      currentPage.value = 2;
      setTimeout(() => step1.value = true, 1000);
      setTimeout(() => {
        (async() => {
          let remoteTxnStatus = await verifyTransaction();
          if(!remoteTxnStatus){
            isInvalidRemoteTxnHash.value = true;
          }else{
            setTimeout( () => {
              step3.value = true;
              setTimeout( async() => {
                await checkSiriusTxn();
                setTimeout(() => step4.value = true, 1000);
              }, 3000);
            }, 1000);
          }
          step2.value = true;
        })();
      }, 2000);
    };

    const remoteTxnLink = computed( () => bscScanUrl + remoteTxnHash.value);
    const isDisplayFeeLowRemark = ref(false);
    const numConfirmation = ref(0);

    const verifyTransaction = async () => {
      try{
        let transactionReceipt = await provider.getTransactionReceipt(remoteTxnHash.value);
        let transactionStatus = await provider.getTransaction(remoteTxnHash.value);
        if(transactionReceipt && transactionReceipt.status === 1 && transactionStatus.to.toLowerCase() == tokenAddress.value.toLowerCase()){ // when transaciton is confirmed but status is 1
          if(transactionStatus.confirmations < 12){
            return new Promise(function (resolve) {
              verifyingTxn = setInterval(async () => {
                let transactionStatusLoop = await provider.getTransaction(remoteTxnHash.value);
                if(transactionStatusLoop.confirmations < 12){
                  transactionPending.value = true;
                  numConfirmation.value = transactionStatusLoop.confirmations;
                }else {
                  transactionPending.value = false;
                  clearInterval(verifyingTxn);
                  resolve(true);
                }
              }, 3000);
            });
          }else{
            return true;
          }
        }else if(transactionReceipt && transactionReceipt.status === 0){ // transaction is confirmed but status is 0 - fee too low
          transactionFailed.value = true;
          isDisplayFeeLowRemark.value = true;
          return false;
        }else if(!transactionReceipt && !transactionStatus){ // transaction hash is not found
          transactionNotFound.value = true;
          return false;
        }else{
          if(transactionStatus && transactionStatus.to.toLowerCase() == tokenAddress.value.toLowerCase()){ // when transaction is not confirmed
            // perform confirmation loop here
            return new Promise(function (resolve) {
              verifyingTxn = setInterval(async()=>{
                let transactionStatusLoop = await provider.getTransaction(remoteTxnHash.value);
                if(transactionStatusLoop.confirmations < 12){
                  transactionPending.value = true;
                  numConfirmation.value = transactionStatusLoop.confirmations;
                }else {
                  transactionPending.value = false;
                  clearInterval(verifyingTxn);
                  resolve(true);
                }
              }, 3000);
            });
          }else{
            // invalid transaction
            transactionFailed.value = true;
            return false;
          }
        }
      }catch(err){
        transactionNotFound.value = true;
        return false;
      }
    };

    const txtRemoteTransactionErrorMsg = computed(() => {
      if(isDisplayFeeLowRemark.value){
        return 'Fees might be too low. Please do not change recommended fee in MetaMask.';
      }else{
        if(transactionNotFound.value){
          return 'BSC transaction hash is not found. Please initiate new swap from BSC to XPX';
        }else{
          return 'BSC transaction hash is invalid. Please initiate new swap from BSC to XPX';
        }
      }
    });

    const siriusTxnHash = ref('');
    let xpxExplorerUrl = networkState.currentNetworkProfile.chainExplorer.url + '/' + networkState.currentNetworkProfile.chainExplorer.hashRoute + '/';
    const siriusTxnLink = computed(() => xpxExplorerUrl + siriusTxnHash.value);

    const checkSiriusTxn = async () => {
      const data = {
        network: 'bsc',
        txnHash: remoteTxnHash.value,
      };
      try {
        let stringifyData = JSON.stringify(data);
        const response = await fetch(checkSwapStatusUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: stringifyData,
        });

        if(response.status == 200){
          const data = await response.json();
          siriusTxnHash.value = data.siriusSwapInfo.status.hash;
          siriusAddress.value = data.siriusSwapInfo.recipient;
          transactionHash.value = data.remoteTxnHash;
          swapTimestamp.value = data.timestamp;
          swapId.value = data.ctxId;
          swapQr.value = SwapUtils.generateQRCode(remoteTxnLink.value);
          isInvalidSwapCheck.value = false;
          setTimeout( ()=> isDisabledValidate.value = false, 1000);
        }else if(response.status == 404){
          isInvalidSwapCheck.value = true;
          isCheckSwapStatusNotFound.value = true;
        }else{
          isInvalidSwapCheck.value = true;
        }
      } catch (error) {
        isInvalidSwapCheck.value = true;
      }
    }

    // section - to do swap
    const step5 = ref(false);
    const step6 = ref(false);
    const step7 = ref(false);
    const step8 = ref(false);
    const isInitiateSwap = ref(false);
    const disableSiriusAddress = ref(false);
    const disableConfirmAddressSelection = ref(false);
    const siriusAddressSelected = ref('');
    const displayInitiateSwapPanel = () => {
      isInitiateSwap.value = true;
    }

    const siriusAddressOption = computed(() => {
      let siriusAddress = [];
      if(walletState.currentLoggedInWallet){
        walletState.currentLoggedInWallet.accounts.forEach((account) => {
          siriusAddress.push({
            label: account.name + ' - ' + account.address,
            value: account.address,
          })
        });
      }
      return siriusAddress;
    });

    const clearSiriusAddress = () => {
      siriusAddressSelected.value= '';
    };

    const signatureMessage = computed(() => {
      if(isInvalidSignedMeta.value){ // when user rejects signature on MetaMask
        return 'Approval on MetaMask is rejected';
      }else{
        return 'Please sign transaction confirmation in MetaMask';
      }
    });

    const confirmAddress = () => {
      disableConfirmAddressSelection.value = true;
      disableSiriusAddress.value = true;
      setTimeout( ()=> step5.value = true, 1000);
      setTimeout( ()=> {
        step6.value = true;
        (async() => {
          await getSigned();
        })();
      }, 2000);
    };

    const swapServiceParam = ref('');

    const getSigned = async () => {
      try{
        isInvalidSignedMeta.value = false;
        provider = new ethers.providers.Web3Provider(window.ethereum, 'any');
        signer = provider.getSigner();
        const messageSignature = await signer.signMessage(siriusAddressSelected.value);
        messageHash.value = messageSignature;
        const data = {
          recipient: siriusAddressSelected.value,
          signature: messageSignature,
          txnInfo: {
            network: "BSC",
            txnHash: remoteTxnHash.value
          }
        };
        swapServiceParam.value = data;
        await afterSigned();
      }catch(err){
        isInvalidSignedMeta.value = true;
      }
    };

    const swapServerErrIndex = ref(0);
    const swapStatus208 = ref(false);

    const afterSigned = async () => {
      step7.value = true;
      step8.value = true;
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
          siriusTxnHash.value = data.siriusSwapInfo.status.hash;
          siriusAddress.value = data.siriusSwapInfo.recipient;
          transactionHash.value = data.remoteTxnHash;
          swapTimestamp.value = data.timestamp;
          swapId.value = data.ctxId;
          swapQr.value = SwapUtils.generateQRCode(remoteTxnLink.value);
          setTimeout( ()=> isDisabledValidate.value = false, 1000);
          swapServerErrIndex.value = 0;
        }else if(response.status == 208){
          // console.log('208');
          swapStatus208.value = true;
          setTimeout( ()=> isDisabledValidate.value = false, 1000);
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
      isInstallMetamask,
      connectMetamask,
      isMetamaskConnected,
      currentAccount,
      copy,
      currentPage,
      isDisabledValidate,
      siriusAddress,
      checkStatus,
      validated,
      isDisabledCheck,
      step1,
      step2,
      step3,
      step4,
      remoteTxnLink,
      messageHash,
      transactionHash,
      swapTimestamp,
      swapId,
      swapQr,
      saveCertificate,
      isInvalidRemoteTxnHash,
      isPendingRemoteTxnHash,
      serviceErr,
      verifyMetaMaskPlugin,
      showTxnHashError,
      remoteTxnHash,
      isInvalidSwapCheck,
      siriusTxnHash,
      siriusTxnLink,
      displayInitiateSwapPanel,
      isInitiateSwap,
      siriusAddressOption,
      disableSiriusAddress,
      disableConfirmAddressSelection,
      siriusAddressSelected,
      clearSiriusAddress,
      step5,
      step6,
      step7,
      step8,
      isInvalidSignedMeta,
      isInvalidSwapService,
      disableRetrySwap,
      retrySwapButtonText,
      getSigned,
      signatureMessage,
      afterSigned,
      swapServerErrIndex,
      confirmAddress,
      swapStatus208,
      savedCheck,
      numConfirmation,
      transactionPending,
      transactionNotFound,
      txtRemoteTransactionErrorMsg,
      isCheckSwapStatusNotFound,
    };
  },
}
</script>