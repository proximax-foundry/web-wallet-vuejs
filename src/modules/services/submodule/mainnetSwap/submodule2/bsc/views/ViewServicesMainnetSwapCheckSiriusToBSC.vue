<template>
  <div class="flex justify-between text-xs sm:text-sm">
    <div><span class="text-gray-400">Swap > BSC > Out ></span> <span class="text-blue-primary font-bold">Check Status</span></div>
    <div>
      <router-link :to="{ name: 'ViewServices' }" class="font-bold">{{$t('services.allservices')}}</router-link>
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
          <div class="inline-block self-center ml-3 text-xs sm:text-sm">{{$t('swap.validation')}}</div>
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
        <button class="border px-3 py-2 w-20 text-blue-primary font-bold rounded-l-xl cursor-pointer hover:border-blue-primary hover:bg-blue-50 transition-all duration-200" @click="$router.push({name: 'ViewServicesMainnetSwapCheckBSCToSirius'})">In</button><button class="bg-blue-primary px-3 py-2 w-20 text-white font-bold rounded-r-xl border border-blue-primary cursor-auto">Out</button> <span class="text-gray-500 ml-3 text-tsm">From Sirius to BSC</span>
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
      <p class="font-bold text-tsm text-left mb-1">Sirius Transaction Hash</p>
      <TextInput placeholder="Sirius Transaction Hash" errorMessage="Please key in valid transaction hash" :showError="showTxnHashError" v-model="siriusTxnHash" icon="hashtag" class="w-full" />
      <div class="mt-10">
        <button @click="$router.push({name: 'ViewServices'})" class="default-btn mr-5 focus:outline-none disabled:opacity-50">Cancel</button>
        <button type="submit" class="default-btn focus:outline-none disabled:opacity-50" :disabled="isDisabledCheck" @click="sendRequest()">Check Status</button>
      </div>
    </div>
    <div v-if="currentPage==2">
      <div class="text-lg my-7">
        <div class="error error_box mb-5" v-if="err!=''">{{ err }}</div>
        <div class="font-bold text-left text-xs md:text-sm lg:text-lg" :class="step1?'text-gray-700':'text-gray-300'">Step 1: Check Sirius transaction status</div>
        <div class="flex border-b border-gray-300 p-3">
          <div class="flex-none">
            <div class=" rounded-full border w-6 h-6 md:w-9 md:h-9 transition-all duration-500" :class="step1?'border-blue-primary':'border-gray-300'">
              <div class="flex h-full justify-center">
                <font-awesome-icon icon="check" :class="step1?'text-blue-primary':'text-gray-300'" class="w-3 h-3 md:w-7 md:h-7 self-center inline-block transition-all duration-500"></font-awesome-icon>
              </div>
            </div>
          </div>
          <div class="flex-grow text-left text-xs md:text-sm lg:text-lg ml-3 self-center transition-all duration-500" :class="step1?'text-gray-700':'text-gray-300'">Checking transaction status</div>
        </div>
        <div class="flex border-b border-gray-300 p-3">
          <div class="flex-none">
            <div class=" rounded-full border w-6 h-6 md:w-9 md:h-9 transition-all duration-500" :class="isInvalidSiriusTxnHash?'border-red-primary':(step2?'border-blue-primary':'border-gray-300')">
              <div class="flex h-full justify-center">
                <font-awesome-icon icon="times" class="text-red-primary w-3 h-3 md:w-7 md:h-7 self-center inline-block transition-all duration-500" v-if="isInvalidSiriusTxnHash"></font-awesome-icon>
                <font-awesome-icon icon="check" :class="step2?'text-blue-primary':'text-gray-300'" class="w-3 h-3 md:w-7 md:h-7 self-center inline-block transition-all duration-500" v-else></font-awesome-icon>
              </div>
            </div>
          </div>
          <div class="flex-grow text-left text-xs md:text-sm lg:text-lg ml-3 self-center transition-all duration-500" :class="step2?'text-gray-700':'text-gray-300'">
            {{ isInvalidSiriusTxnHash?'Transaction has failed.':'Sirius transaction is successful:' }}
            <div v-if="!isInvalidSiriusTxnHash && step2" class="mt-2">
              <div v-if="siriusTxnHash" class="bg-yellow-100 py-2 px-5 mt-1 rounded-xl flex">
                <a :href="siriusTxnLink" target=_new :class="isInvalidSiriusTxnHash?'text-gray-300':'text-blue-primary'" class="flex-grow break-all text-tsm self-center hover:underline" id="siriusTx" :copyValue="siriusTxnHash" copySubject="Sirius transaction hash"><font-awesome-icon icon="external-link-alt" class="text-blue-primary w-3 h-3 self-center inline-block mr-2"></font-awesome-icon>{{ siriusTxnHash }}</a>
                <div class="flex-none">
                  <font-awesome-icon icon="copy" @click="copy('siriusTx')" class="w-5 h-5 text-blue-primary cursor-pointer self-center ml-3 absoltue top-2 hover:opacity-90 duration-800 transition-all" v-if="step2"></font-awesome-icon>
                </div>
              </div>
            </div>
            <div v-if="isInvalidSiriusTxnHash && step2" class="mt-2 text-sm text-gray-700">
              Sirius transaction hash is invalid. Please initiate new swap from XPX to BSC
              <router-link :to="{ name: 'ViewServicesMainnetSwapEthOptions' }" class="bg-blue-primary text-white py-2 px-5 rounded-2xl w-24 block text-center my-3 font-bold">Swap</router-link>
            </div>
          </div>
        </div>
        <div class="font-bold text-left text-xs md:text-sm lg:text-lg mt-4" :class="step3?'text-gray-700':'text-gray-300'">Step 2: Check BSC transaction status</div>
        <div class="flex border-b border-gray-300 p-3">
          <div class="flex-none">
            <div class=" rounded-full border w-6 h-6 md:w-9 md:h-9" :class="step3?'border-blue-primary':'border-gray-300'">
              <div class="flex h-full justify-center">
                <font-awesome-icon icon="check" :class="step3?'text-blue-primary':'text-gray-300'" class="w-3 h-3 md:w-7 md:h-7 self-center inline-block"></font-awesome-icon>
              </div>
            </div>
          </div>
          <div class="flex-grow text-left text-xs md:text-sm lg:text-lg ml-3 self-center transition-all duration-500" :class="step3?'text-gray-700':'text-gray-300'">Checking transaction status<div class="text-tsm text-gray-500 my-3" v-if="transactionPending">Pending confirmation: {{ numConfirmation }} of 12 confirmations</div></div>
        </div>
        <div class="flex border-b border-gray-300 p-3">
          <div class="flex-none">
            <div class=" rounded-full border w-6 h-6 md:w-9 md:h-9 transition-all duration-500" :class="isInvalidRemoteTxnHash?'border-red-primary':(step4?'border-blue-primary':'border-gray-300')">
              <div class="flex h-full justify-center">
                <font-awesome-icon icon="times" class="text-red-primary w-3 h-3 md:w-7 md:h-7 self-center inline-block transition-all duration-500" v-if="isInvalidRemoteTxnHash"></font-awesome-icon>
                <font-awesome-icon icon="check" :class="step4?'text-blue-primary':'text-gray-300'" class="w-3 h-3 md:w-7 md:h-7 self-center inline-block transition-all duration-500" v-else></font-awesome-icon>
              </div>
            </div>
          </div>
          <div class="flex-grow text-left text-xs md:text-sm lg:text-lg ml-3 self-center transition-all duration-500" :class="step4?'text-gray-700':'text-gray-300'">
            {{ isInvalidRemoteTxnHash?'Transaction has failed.':'BSC transaction is successful:' }}
            <div v-if="!isInvalidRemoteTxnHash && step4" class="mt-2">
              <div v-if="remoteTxnHash" class="bg-yellow-100 py-2 px-5 mt-1 rounded-xl flex">
                <a :href="remoteTxnLink" target=_new :class="isInvalidRemoteTxnHash?'text-gray-300':'text-blue-primary'" class="flex-grow break-all text-tsm self-center hover:underline" id="remoteTx" :copyValue="remoteTxnHash" copySubject="BSC transaction hash"><font-awesome-icon icon="external-link-alt" class="text-blue-primary w-3 h-3 self-center inline-block mr-2"></font-awesome-icon>{{ remoteTxnHash }}</a>
                <div class="flex-none">
                  <font-awesome-icon icon="copy" @click="copy('remoteTx')" class="w-5 h-5 text-blue-primary cursor-pointer self-center ml-3 absoltue top-2 hover:opacity-90 duration-800 transition-all" v-if="step4"></font-awesome-icon>
                </div>
              </div>
            </div>
            <div v-if="isInvalidRemoteTxnHash && step4" class="mt-2 text-sm text-gray-700">
              BSC transaction hash is invalid. Please contact our <a href="https://t.me/proximaxhelpdesk" target=_new class="text-blue-primary font-bold underline">helpdesk</a>.
            </div>
          </div>
        </div>
      </div>
      <div class="mt-10">
        <router-link :to="{ name: 'ViewServices' }" class="default-btn focus:outline-none w-40 inline-block" :class="isDisabled?'opacity-50':''" :is="isDisabled?'span':'router-link'" tag="button">Done</router-link>
      </div>
    </div>
  </div>
</template>
<script>
import { computed, ref, onBeforeUnmount } from "vue";
import TextInput from '@/components/TextInput.vue';
import { copyToClipboard } from '@/util/functions';
import { useToast } from "primevue/usetoast";
import { ethers } from 'ethers';
import { SwapUtils } from '@/util/swapUtils';
import { networkState } from '@/state/networkState';
import { ChainSwapConfig } from "@/models/stores/chainSwapConfig";

export default {
  name: 'ViewServicesMainnetSwapCheckSiriusToBSC',

  components: {
    TextInput,
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

    const custodian = ref('');
    const tokenAddress = ref('');

    (async() => {
      try {
        const fetchService = await SwapUtils.fetchBSCServiceInfo(swapData.swap_IN_SERVICE_URL);
        if(fetchService.status==200){
          tokenAddress.value = fetchService.data.bscInfo.scAddress;
          custodian.value = fetchService.data.bscInfo.sinkAddress;
          serviceErr.value = '';
        }else{
          serviceErr.value = 'Swapping service is temporary not available. Please try again later';
        }
      } catch (error) {
        serviceErr.value = 'Swapping service is temporary not available. Please try again later';
      }
    })()

    const siriusTxnHashPattern= "^[0-9A-Za-z]{64}$";
    const siriusTxnHash = ref('');
    const showTxnHashError = computed(()=> !siriusTxnHash.value.match(siriusTxnHashPattern) && siriusTxnHash.value.length > 0);

    /* MetaMask integration */
    let ethereumChainId = swapData.BSCChainId;
    let ethereumNetworkName = swapData.BSCNetworkName;
    const isInstallMetamask = ref(false);
    const isMetamaskConnected = ref(false);
    const currentAccount = ref(null);
    const currentNetwork = ref('');

    const checkSwapStatusUrl = SwapUtils.getOutgoing_BSCCheckStatus_URL(swapData.swap_IN_SERVICE_URL);
    const bscScanUrl = swapData.BSCScanUrl;
    const remoteTxnLink = computed( () => bscScanUrl + remoteTxnHash.value);

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
          verifyChain(metaChainId);
        })
        .catch((err) => {
          console.error(err);
        });

      ethereum.on('accountsChanged', handleAccountsChanged);

      ethereum.on('chainChanged', (metaChainId) => {
        verifyChain(metaChainId);
      });

    }else{
      console.log('MetaMask not installed')
    }

    function fetchMetaAccount(accounts) {
      if (accounts.length === 0) {
        // MetaMask is locked or the user has not connected any accounts
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

    const step1 = ref(false);
    const step2 = ref(false);
    const step3 = ref(false);
    const step4 = ref(false);
    const step5 = ref(false);
    const step6 = ref(false);
    const step7 = ref(false);

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
    const siriusAddress = ref('');
    const err = ref('');
    const serviceErr = ref('');
    const isDisabledCheck = computed(() =>
      // verify it has been connected to MetaMask too
      !(!err.value && !(showTxnHashError.value && siriusTxnHash.value.length > 0) && siriusTxnHash.value.length > 0)
    );
    const isInvalidSiriusTxnHash = ref(false);

    const sendRequest = () => {
      currentPage.value = 2;
      setTimeout(() => step1.value = true, 1000);
      setTimeout(() => {
        (async() => {
          await checkSiriusTxn();
        })();
      }, 2000);
    };

    let xpxExplorerUrl = networkState.currentNetworkProfile.chainExplorer.url + '/' + networkState.currentNetworkProfile.chainExplorer.hashRoute + '/';
    const siriusTxnLink = computed(() => xpxExplorerUrl + siriusTxnHash.value);

    const transactionFailed = ref(false);
    const isInvalidRemoteTxnHash = ref(false);
    const remoteTxnHash = ref(false);
    const transactionPending = ref(false);
    const isDisabled = ref(true);
    const numConfirmation = ref(0);

    const checkSiriusTxn = async () => {
      const data = {
        network: 'bsc',
        txnHash: siriusTxnHash.value,
      };
      try {
        const response = await fetch(checkSwapStatusUrl + siriusTxnHash.value, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        step2.value = true;
        if(response.status == 200){ // data.status == 'fulfilled'
          const data = await response.json();
          remoteTxnHash.value = data.fulfillTransaction;
          setTimeout( async() => {
            step3.value = true;
            let remoteTxnStatus = await validateRemoteTxn();
            if(!remoteTxnStatus && transactionFailed.value){
              isInvalidRemoteTxnHash.value = true;
            }else{
              setTimeout( async() => {
                setTimeout(() => step4.value = true, 1000);
                setTimeout(() => isDisabled.value = false, 1000);
              }, 1000);
            }
          }, 1000);
        }else{
          isInvalidSiriusTxnHash.value = true;
        }
      } catch (error) {
        isInvalidSiriusTxnHash.value = true;
      }
    };

    const validateRemoteTxn = async () => {
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
              }, 1000);
            });
          }else{
            return true;
          }
        }else if(transactionReceipt && transactionReceipt.status === 0){ // transaction is confirmed but status is 0 - fee too low
          transactionFailed.value = true;
          return false;
        }else if(!transactionReceipt && !transactionStatus){ // invalid transaction hash
          transactionFailed.value = true;
          return false;
        }else{
          if(transactionStatus && transactionStatus.to == tokenAddress.value){ // when transaction is not confirmed
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
            return false;
          }
        }
      }catch(err){
        console.log(err);
        return false;
      }
    };

    const afterConfirmed = () => {
      step3.value = true;
    };

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
      showSiriusAddressErr,
      disableSiriusAddress,
      sendRequest,
      isDisabledCheck,
      step1,
      step2,
      step3,
      step4,
      step5,
      step6,
      step7,
      siriusTxnLink,
      serviceErr,
      verifyMetaMaskPlugin,
      showTxnHashError,
      siriusTxnHash,
      isInvalidSiriusTxnHash,
      isInvalidRemoteTxnHash,
      remoteTxnLink,
      remoteTxnHash,
      transactionPending,
      isDisabled,
      numConfirmation,
    };
  },
}
</script>