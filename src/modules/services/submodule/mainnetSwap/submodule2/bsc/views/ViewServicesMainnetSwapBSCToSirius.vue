<template>
  <div class="flex justify-between text-xs sm:text-sm">
    <div><span class="text-gray-400">Swap > BSC > In ></span> <span class="text-blue-primary font-bold">Transaction</span></div>
    <div>
      <router-link :to="{ name: 'ViewServices' }" class="font-bold">Home</router-link>
    </div>
  </div>
  <div class='mt-2 py-3 gray-line px-0 lg:px-10 xl:px-80'>
    <div class="flex">
      <div class="flex-none">
        <div class="flex p-0 sm:p-3">
          <div class="rounded-full flex w-6 h-6 sm:w-10 sm:h-10" :class="`${ currentPage>=1?'bg-blue-primary':'bg-gray-300' }`"><div class="self-center inline-block text-center w-full text-white text-txs sm:text-sm">1</div></div>
          <div class="inline-block self-center ml-3 text-xs sm:text-sm">Transaction</div>
        </div>
      </div>
      <div class="h-1 bg-gray-200 flex-grow mx-2 self-center"></div>
      <div class="flex-none">
        <div class="flex p-0 sm:p-3">
          <div class="rounded-full flex w-6 h-6 sm:w-10 sm:h-10" :class="`${ currentPage>=2?'bg-blue-primary':'bg-gray-300' }`"><div class="self-center inline-block text-center w-full text-white text-txs sm:text-sm">2</div></div>
          <div class="inline-block self-center ml-3 text-xs sm:text-sm">Validation</div>
        </div>
      </div>
      <div class="h-1 bg-gray-200 flex-grow mx-2 self-center"></div>
      <div class="flex-none">
        <div class="flex p-0 sm:p-3">
          <div class="rounded-full flex w-6 h-6 sm:w-10 sm:h-10" :class="`${ currentPage==3?'bg-blue-primary':'bg-gray-300' }`"><div class="self-center inline-block text-center w-full text-white text-txs sm:text-sm">3</div></div>
          <div class="inline-block self-center ml-3 text-xs sm:text-sm">Certificate</div>
        </div>
      </div>
    </div>
    <div v-if="currentPage==1">
      <div class="text-lg my-7 font-bold">Transaction Details</div>
      <div class="error error_box mb-5" v-if="serviceErr!=''">{{ serviceErr }}</div>
      <div class="error error_box mb-5" v-if="err!=''">{{ err }}</div>
      <p class="font-bold text-tsm text-left mb-1">From: Metamask Address</p>
      <div class="mb-5 flex justify-between bg-gray-100 rounded-2xl p-3 text-left" v-if="isInstallMetamask">
        <div class="text-tsm text-gray-700 self-center relative">
          <div><img src="@/modules/services/submodule/mainnetSwap/img/icon-metamask.svg" class="w-5 inline ml-1 mr-2 absolute" style="top: 0px;"> <div class="ml-8 inline-block break-all">{{ isMetamaskConnected?(currentAccount?currentAccount:'Not connected'):'Not connected' }}</div></div>
        </div>
        <div class="self-center">
          <button @click="connectMetamask()" class="hover:shadow-lg bg-white hover:bg-gray-100 rounded-3xl border-2 font-bold px-6 py-1 border-blue-primary text-blue-primary outline-none focus:outline-none" v-if="!currentAccount">Connect to Metamask</button>
          <button class=" bg-green-50 rounded-3xl border font-bold px-6 py-1 border-green-500 text-green-500 text-tsm outline-none focus:outline-none cursor-auto" v-else>Connected</button>
        </div>
      </div>
      <div class="mb-5 flex justify-between bg-yellow-200 rounded-2xl p-3 text-left" v-else>
        <div class="text-tsm text-gray-700 self-center relative">
          <div><img src="@/modules/services/submodule/mainnetSwap/img/icon-metamask.svg" class="w-5 inline ml-1 mr-2 absolute" style="top: 0px;"> <div class="ml-8 inline-block text-gray-800">Metamask is not installed</div></div>
        </div>
        <div class="self-center">
          <a href="https://metamask.io/" target=_new class="hover:shadow-lg bg-white hover:bg-gray-100 rounded-3xl border-2 font-bold px-6 py-2 border-blue-primary text-blue-primary outline-none focus:outline-none">Download Metamask</a>
        </div>
      </div>
      <p class="font-bold text-tsm text-left">To: Sirius Address</p>
      <SelectSiriusAccountInputPlugin v-model="siriusAddress" icon="card-alt" :showError="showSiriusAddressErr" errorMessage="Sirius Address required" :options="siriusAddressOption" :disabled="disableSiriusAddress" />
      <p class="font-bold text-tsm text-left mb-1">Amount</p>
      <SupplyInput :disabled="disableAmount" v-model="amount" :balance="balance" title="bXPX (Minimum 51 bXPX required)" placeholder="bXPX" type="text" icon="coins" :showError="showAmountErr" :errorMessage="(!amount)?'Required Field':((parseFloat(amount) <= defaultXPXTxFee)?'Insufficient amount':'Insufficient token balance.')" :decimal="6" />
      <div class="my-2 float-right text-xs text-blue-primary">* The fees for the transaction on Sirius Chain will be deducted from this amount, which is 50 XPX</div>
      <div class="mt-10">
        <button @click="$router.push({name: 'ViewServices'})" class="default-btn mr-5 focus:outline-none disabled:opacity-50">Cancel</button>
        <button type="submit" class="default-btn focus:outline-none disabled:opacity-50" :disabled="isDisabledSwap" @click="sendRequest()">Send Request</button>
      </div>
    </div>
    <div v-if="currentPage==2">
      <div class="text-lg my-7">
        <div class="font-bold text-left text-xs md:text-sm lg:text-lg" :class="step1?'text-gray-700':'text-gray-300'">Step 1: Send bXPX to the escrow account</div>
        <div class="flex border-b border-gray-300 p-3">
          <div class="flex-none">
            <div class=" rounded-full border border-blue-primary w-6 h-6 md:w-9 md:h-9">
              <div class="flex h-full justify-center">
                <font-awesome-icon icon="check" class="text-blue-primary w-3 h-3 md:w-7 md:h-7 self-center inline-block"></font-awesome-icon>
              </div>
            </div>
          </div>
          <div class="flex-grow text-left text-xs md:text-sm lg:text-lg ml-3 self-center transition-all duration-500" :class="step1?'text-gray-700':'text-gray-300'">Sending transaction to Metamask</div>
        </div>
        <div class="flex border-b border-gray-300 p-3">
          <div class="flex-none">
            <div class=" rounded-full border w-6 h-6 md:w-9 md:h-9" :class="isInvalidConfirmedMeta?'border-red-primary':'border-blue-primary'">
              <div class="flex h-full justify-center">
                <font-awesome-icon icon="times" class="text-red-primary w-3 h-3 md:w-7 md:h-7 self-center inline-block" v-if="isInvalidConfirmedMeta"></font-awesome-icon>
                <font-awesome-icon icon="check" class="text-blue-primary w-3 h-3 md:w-7 md:h-7 self-center inline-block" v-else></font-awesome-icon>
              </div>
            </div>
          </div>
          <div class="flex-grow text-left text-xs md:text-sm lg:text-lg ml-3 self-center transition-all duration-500" :class="step2?'text-gray-700':'text-gray-300'">
            {{ isInvalidConfirmedMeta?'Approval in Metamask is rejected':'Waiting for confirmation in Metamask' }}
            <div v-if="isInvalidConfirmedMeta" class="mt-5">
              <button type="button" class="bg-blue-primary rounded-3xl mr-5 focus:outline-none text-tsm font-bold py-2 border-blue-primary px-8 text-white hover:shadow-lg" @click="getValidation(true)">Retry</button>
              <router-link :to="{ name: 'ViewServices' }" class="hover:shadow-lg bg-white hover:bg-gray-100 rounded-3xl border-2 font-bold px-6 py-2 border-blue-primary text-blue-primary outline-none focus:outline-none mr-4 w-32 text-tsm" tag="button">Cancel this swap</router-link>
            </div>
          </div>
        </div>
        <div class="flex border-b border-gray-300 p-3">
          <div class="flex-none">
            <div class=" rounded-full border border-blue-primary w-6 h-6 md:w-9 md:h-9">
              <div class="flex h-full justify-center">
                <font-awesome-icon icon="check" class="text-blue-primary w-3 h-3 md:w-7 md:h-7 self-center inline-block"></font-awesome-icon>
              </div>
            </div>
          </div>
          <div class="flex-grow text-left text-xs md:text-sm lg:text-lg ml-3 self-center transition-all duration-500" :class="step3?'text-gray-700':'text-gray-300'">Transaction hash: <a :href="validationLink" target=_new v-if="validationHash" class="text-blue-primary break-all text-tsm" id="validateTransfer" :copyValue="validationHash" copySubject="Transfer Validation">{{ validationHash }}</a></div>
          <div class="flex-none">
            <font-awesome-icon icon="copy" @click="copy('validateTransfer')" class="w-5 h-5 text-blue-primary cursor-pointer self-center" v-if="step3"></font-awesome-icon>
          </div>
        </div>
        <div class="font-bold text-left text-xs md:text-sm lg:text-lg mt-4" :class="step4?'text-gray-700':'text-gray-300'">Step 2: Validate your Sirius address</div>
        <div class="flex border-b border-gray-300 p-3">
          <div class="flex-none">
            <div class=" rounded-full border border-blue-primary w-6 h-6 md:w-9 md:h-9">
              <div class="flex h-full justify-center">
                <font-awesome-icon icon="check" class="text-blue-primary w-3 h-3 md:w-7 md:h-7 self-center inline-block"></font-awesome-icon>
              </div>
            </div>
          </div>
          <div class="flex-grow text-left text-xs md:text-sm lg:text-lg ml-3 self-center transition-all duration-500" :class="step4?'text-gray-700':'text-gray-300'">Sending message to Metamask</div>
        </div>
        <div class="flex border-b border-gray-300 p-3">
          <div class="flex-none">
            <div class=" rounded-full border w-6 h-6 md:w-9 md:h-9" :class="isInvalidSignedMeta?'border-red-primary':'border-blue-primary'">
              <div class="flex h-full justify-center">
                <font-awesome-icon icon="times" class="text-red-primary w-3 h-3 md:w-7 md:h-7 self-center inline-block" v-if="isInvalidSignedMeta"></font-awesome-icon>
                <font-awesome-icon icon="check" class="text-blue-primary w-3 h-3 md:w-7 md:h-7 self-center inline-block" v-else></font-awesome-icon>
              </div>
            </div>
          </div>
          <div class="flex-grow text-left text-xs md:text-sm lg:text-lg ml-3 self-center transition-all duration-500" :class="step5?'text-gray-700':'text-gray-300'">
            {{ isInvalidSignedMeta?'Approval on Metamask is rejected':'Waiting for confirmation in Metamask' }}
            <div v-if="isInvalidSignedMeta" class="mt-5">
              <button  type="button" class="bg-blue-primary rounded-3xl mr-5 focus:outline-none text-tmd py-2 px-4 text-white hover:shadow-lg w-24" @click="getSigned">Retry</button>
            </div>
          </div>
        </div>
        <div class="flex border-b border-gray-300 p-3">
          <div class="flex-none">
            <div class=" rounded-full border border-blue-primary w-6 h-6 md:w-9 md:h-9">
              <div class="flex h-full justify-center">
                <font-awesome-icon icon="check" class="text-blue-primary w-3 h-3 md:w-7 md:h-7 self-center inline-block"></font-awesome-icon>
              </div>
            </div>
          </div>
          <div class="flex-grow text-left text-xs md:text-sm lg:text-lg ml-3 self-center transition-all duration-500" :class="step6?'text-gray-700':'text-gray-300'">Message signed with signature: <div v-if="messageHash" class="text-gray-400 text-tsm break-all" id="validateMessage" :copyValue="messageHash" copySubject="Message Validation">{{ messageHash }}</div></div>
          <div class="flex-none">
            <font-awesome-icon icon="copy" @click="copy('validateMessage')" class="w-5 h-5 text-blue-primary cursor-pointer self-center" v-if="step6"></font-awesome-icon>
          </div>
        </div>
        <div class="font-bold text-left text-xs md:text-sm lg:text-lg mt-4" :class="step7?'text-gray-700':'text-gray-300'">Step 3: Initiate swap</div>
        <div class="flex border-b border-gray-300 p-3">
          <div class="flex-none">
            <div class=" rounded-full border w-6 h-6 md:w-9 md:h-9" :class="isInvalidSwapService?'border-red-primary':'border-blue-primary'">
              <div class="flex h-full justify-center">
                <font-awesome-icon icon="times" class="text-red-primary w-3 h-3 md:w-7 md:h-7 self-center inline-block" v-if="isInvalidSwapService"></font-awesome-icon>
                <font-awesome-icon icon="check" class="text-blue-primary w-3 h-3 md:w-7 md:h-7 self-center inline-block" v-else></font-awesome-icon>
              </div>
            </div>
          </div>
          <div class="flex-grow text-left text-xs md:text-sm lg:text-lg ml-3 self-center transition-all duration-500" :class="step7?'text-gray-700':'text-gray-300'">
            {{ isInvalidSwapService?'Unable to send message to swap service':'Message sent to the swap service, swap initiated...' }}
            <div v-if="isInvalidSwapService && swapServerErrIndex <= 3" class="mt-5">
              <button  type="button" class="bg-blue-primary rounded-3xl mr-5 focus:outline-none text-tmd py-2 px-4 text-white hover:shadow-lg disabled:opacity-50" @click="afterSigned" :disabled="disableRetrySwap">{{ retrySwapButtonText }}</button>
            </div>
            <div v-if="swapServerErrIndex>3" class="mt-5 text-tsm sm:text-sm">
              Sorry. Please save the <b>transaction hash</b>, the <b>signature</b> and contact our <a href="https://t.me/proximaxhelpdesk" target=_new class="text-blue-primary font-bold underline">helpdesk</a>.
            </div>
          </div>
        </div>
      </div>
      <div class="mt-10">
        <button type="submit" class="default-btn focus:outline-none disabled:opacity-50" :disabled="isDisabledValidate" @click="validated()">Continue</button>
      </div>
    </div>
    <div v-if="currentPage==3">
      <div>
        <h1 class="default-title font-bold mt-5 mb-2">Congratulations!</h1>
        <div class="text-sm mb-7">The swap process has already started!</div>
        <swap-certificate-component networkTerm="BSC" swapType="In" :swapId="swapId" :swapTimestamp="swapTimestamp" :transactionHash="transactionHash" :siriusAddress="siriusAddress" :swapQr="swapQr" :swapLink="validationLink" />
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
import { computed, ref, watch } from "vue";
import SupplyInput from '@/components/SupplyInput.vue';
import SwapCertificateComponent from '@/modules/services/submodule/mainnetSwap/components/SwapCertificateComponent.vue';
import SelectSiriusAccountInputPlugin from '@/modules/services/submodule/mainnetSwap/components/SelectSiriusAccountInputPlugin.vue';
import { walletState } from '@/state/walletState';
import { copyToClipboard } from '@/util/functions';
import { useToast } from "primevue/usetoast";
import { ethers } from 'ethers';
import { abi, SwapUtils } from '@/util/swapUtils';
import { networkState } from '@/state/networkState';
import { ChainSwapConfig } from "@/models/stores/chainSwapConfig";

export default {
  name: 'ViewServicesMainnetSwapBSCToSirius',

  components: {
    SupplyInput,
    SwapCertificateComponent,
    SelectSiriusAccountInputPlugin,
  },

  setup() {

    let swapData = new ChainSwapConfig(networkState.chainNetworkName);
    swapData.init();

    const defaultXPXTxFee = ref(0);
    const custodian = ref('');
    const tokenAddress = ref('');

    (async() => {
      try {
        const fetchService = await SwapUtils.fetchBSCServiceInfo(swapData.swap_SERVICE_URL);
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

    /* metamask integration */
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
    const swapServerUrl = swapData.swap_BSC_XPX_URL;

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

      ethereum.on('connect', (connectInfo) => {
        console.log(connectInfo)
      });
    }else{
      console.log('metamask not installed')
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

    function verifyChain(chainId, updateTokenBol = false){
      currentNetwork.value = chainId;
      if(bscChainId === parseInt(chainId)){
        err.value = '';
        if(updateTokenBol){
          updateToken();
        }
      }else{
        err.value = 'Please select ' + bscNetworkName + ' on Metamark to swap BSC';
      }
    }

    function updateToken(){
      // get metamask balance
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
      ethereum
      .request({ method: 'eth_requestAccounts' })
      .then(fetchMetaAccount)
      .catch((err) => {
        if (err.code === 4001) {
          // EIP-1193 userRejectedRequest error
          // If this happens, the user rejected the connection request.
          console.log('Please connect to MetaMask.');
        } else {
          console.error(err);
        }
      });
    };

    watch([currentNetwork, currentAccount, tokenAddress], ([newNetwork, newCurrentAccount, newTokenAddress]) => {
      if(newTokenAddress != undefined){
        (async () => {
          try{
            provider = new ethers.providers.Web3Provider(window.ethereum, 'any');
            signer = provider.getSigner();
            const contract = new ethers.Contract(tokenAddress.value, abi, signer);
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
    const showSiriusAddressErr = ref(false);
    const disableSiriusAddress = ref(false);
    const isDisabledValidate = ref(true);
    const showAmountErr = ref(false);
    const disableAmount = ref(false);
    const siriusAddress = ref('');
    const err = ref('');
    const serviceErr = ref('');
    const isDisabledSwap = computed(() =>
      // verify it has been connected to metamask too
      !(amount.value > 0 && siriusAddress.value != '' && !err.value && (balance.value >= amount.value) && (amount.value > defaultXPXTxFee.value))
    );
    const amount = ref('0');

    watch(amount, (n) => {
      if(n <= defaultXPXTxFee.value){
        showAmountErr.value = true;
      }else{
        showAmountErr.value = false;
      }
    });

    const siriusAddressOption = computed(() => {
      let siriusAddress = [];
      walletState.currentLoggedInWallet.accounts.forEach((account) => {
        siriusAddress.push({
          label: account.name + ' - ' + account.address,
          value: account.address,
        })
      });
      return siriusAddress;
    });

    const sendRequest = () => {
      currentPage.value = 2;
      setTimeout(() => step1.value = true, 1000);
      setTimeout(() => {
        step2.value = true;
        (async() => {
          await getValidation(false);
          if(!isInvalidConfirmedMeta.value){
            afterConfirmed();
          }
        })();
      }, 2000);
    };

    const getValidation = async (initiated) => {
      try{
        const Contract = new ethers.Contract(tokenAddress.value, abi, signer);
        const receipt = await Contract.transfer(
          custodian.value,
          ethers.utils.parseUnits(amount.value, 6),
        );
        validationHash.value = receipt.hash;
        validationLink.value = bscScanUrl + receipt.hash;
        isInvalidConfirmedMeta.value = false;
        if(initiated){
          afterConfirmed();
        }
      }catch(err){
        isInvalidConfirmedMeta.value = true;
      }
    };

    const afterConfirmed = () => {
      step3.value = true;
      setTimeout( ()=> step4.value = true, 1000);
      setTimeout( ()=> {
        step5.value = true;
        (async() => {
          await getSigned(false);
            })();
      }, 2000);
    };

    const swapServiceParam = ref('');

    const getSigned = async () => {
      try{
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
        isInvalidSignedMeta.value = false;
        await afterSigned();
      }catch(err){
        isInvalidSignedMeta.value = true;
      }
    };

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

        if(response.status == 200){
          const data = await response.json();
          isInvalidSwapService.value = false;
          transactionHash.value = data.ethTransactionId;
          swapTimestamp.value = data.timestamp;
          swapId.value = data.ctxId;
          swapQr.value = SwapUtils.generateQRCode(validationLink.value);
          setTimeout( ()=> isDisabledValidate.value = false, 1000);
          swapServerErrIndex.value = 0;
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
      siriusAddressOption,
      showSiriusAddressErr,
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
    };
  },
}
</script>
