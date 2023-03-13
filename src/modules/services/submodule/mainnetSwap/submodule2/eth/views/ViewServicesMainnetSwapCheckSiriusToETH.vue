<template>
  <div>
    <div class='lg:w-9/12 ml-2 mr-2 lg:ml-auto lg:mr-auto mt-5'>
      <div class='mt-6 p-6 border filter shadow-lg text-center'>
        <div class="text-md">Main Network Swap</div>
        <div class="text-xs my-3 mb-5 sm:mb-10"><img src="@/modules/services/submodule/mainnetSwap/img/eth.svg" class="mr-2 h-5 inline-block">Check swap from Proximax Sirius Chain to ETH</div>
        <div class="flex my-10">
          <div class="flex-none">
            <div class="flex border border-gray-300 rounded-md filter shadow-md">
              <div class="flex w-6 h-6 sm:w-10 sm:h-10" :class="`${ currentPage>=1?'bg-yellow-500':'bg-gray-300' }`"><div class="self-center inline-block text-center w-full text-txs sm:text-sm font-bold" :class="`${ currentPage>=1?'text-white':'text-gray-400' }`">1</div></div>
              <div class="px-4 sm:px-10 self-center text-xxs sm:text-xs hidden md:inline-block lg:hidden xl:inline-block">Input Information</div>
            </div>
          </div>
          <div class="flex-grow self-center md:mx-4 h-0.5 bg-gray-100"></div>
          <div class="flex-none">
            <div class="flex border border-gray-300 rounded-md filter shadow-md">
              <div class="flex w-6 h-6 sm:w-10 sm:h-10" :class="`${ currentPage>=2?'bg-yellow-500':'bg-gray-300' }`"><div class="self-center inline-block text-center w-full text-txs sm:text-sm font-bold" :class="`${ currentPage>=2?'text-white':'text-gray-400' }`">2</div></div>
              <div class="px-4 sm:px-10 self-center text-xxs sm:text-xs hidden md:inline-block lg:hidden xl:inline-block">{{$t('swap.validation')}}</div>
            </div>
          </div>
        </div>
        <div v-if="currentPage==1">
          <div class="text-lg my-7 font-bold">Check Swap Status</div>
          <div class="error error_box mb-5" v-if="!isInstallMetamask">{{$t('swap.noMetamask')}}</div>
          <div class="bg-yellow-200 text-yellow-900 text-tsm p-3 mb-5 rounded-2xl" v-if="!verifyMetaMaskPlugin">Please make sure there is no other crypto wallet extension currently being enabled except <b>MetaMask</b>.<div class="my-2">Refer to the <a href="https://bit.ly/3mVayCu" target=_new class="text-blue-primary">walkthrough<font-awesome-icon icon="external-link-alt" class="text-blue-primary w-3 h-3 self-center inline-block ml-1"></font-awesome-icon></a> for more details.</div>Please refresh this page after disabling other wallet extensions.</div>
          <div class="error error_box mb-5" v-if="serviceErr!=''">{{ serviceErr }}</div>
          <div class="error error_box mb-5" v-if="err!=''">{{ err }}</div>
          <p class="font-bold text-xs text-left mb-1">Type</p>
          <div class="mb-5 mt-3 text-left">
            <button class="border px-3 py-2 w-20 text-blue-primary font-bold rounded-l cursor-pointer hover:border-blue-primary hover:bg-blue-50 transition-all duration-200" @click="$router.push({name: 'ViewServicesMainnetSwapCheckETHToSirius'})">In</button><button class="bg-blue-primary px-3 py-2 w-20 text-white font-bold rounded-r border border-blue-primary cursor-auto">Out</button> <span class="text-gray-500 ml-3 text-tsm">From Sirius to ETH</span>
          </div>

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
          <TextInputClean placeholder="Sirius Transaction Hash" errorMessage="Please key in valid transaction hash" v-model="siriusTxnHash" :showError="showTxnHashError" class="w-full inline-block mr-2" />
          <div class="mt-10 text-center">
            <button @click="$router.push({name: 'ViewServicesMainnetSwap'})" class="text-black font-bold text-xs mr-5 focus:outline-none disabled:opacity-50">Cancel</button>
            <button type="submit" class="default-btn focus:outline-none disabled:opacity-50" :disabled="isDisabledCheck" @click="sendRequest()">Check Status</button>
          </div>
        </div>
        <div v-if="currentPage==2">
          <div class="text-lg my-7">
            <div class="font-bold text-left text-xs md:text-sm" :class="step1?'text-gray-700':'text-gray-300'">Step 1: Check Sirius transaction status</div>
            <div class="flex border-b border-gray-300 p-3">
              <div class="flex-none">
                <div class=" rounded-full border w-6 h-6 transition-all duration-500" :class="step1?'border-blue-primary':'border-gray-300'">
                  <div class="flex h-full justify-center">
                    <font-awesome-icon icon="check" :class="step1?'text-blue-primary':'text-gray-300'" class="w-3 h-3 self-center inline-block transition-all duration-500"></font-awesome-icon>
                  </div>
                </div>
              </div>
              <div class="flex-grow text-left text-xs md:text-sm ml-3 self-center transition-all duration-500" :class="step1?'text-gray-700':'text-gray-300'">Checking transaction status</div>
            </div>
            <div class="flex border-b border-gray-300 p-3">
              <div class="flex-none">
                <div class=" rounded-full border w-6 h-6 transition-all duration-500" :class="isInvalidSiriusTxnHash?'border-red-primary':(step2?'border-blue-primary':'border-gray-300')">
                  <div class="flex h-full justify-center">
                    <font-awesome-icon icon="times" class="text-red-primary w-3 h-3 self-center inline-block transition-all duration-500" v-if="isInvalidSiriusTxnHash"></font-awesome-icon>
                    <font-awesome-icon icon="check" :class="step2?'text-blue-primary':'text-gray-300'" class="w-3 h-3 self-center inline-block transition-all duration-500" v-else></font-awesome-icon>
                  </div>
                </div>
              </div>
              <div class="flex-grow text-left text-xs md:text-sm ml-3 self-center transition-all duration-500" :class="step2?'text-gray-700':'text-gray-300'">
                {{ isInvalidSiriusTxnHash?'Transaction is not found.':'Sirius transaction is successful:' }}
                <div v-if="!isInvalidSiriusTxnHash && step2" class="mt-2">
                  <div v-if="siriusTxnHash" class="bg-yellow-100 py-2 px-5 mt-1 rounded-xl flex">
                    <a :href="siriusTxnLink" target=_new :class="isInvalidSiriusTxnHash?'text-gray-300':'text-blue-primary'" class="flex-grow break-all text-tsm self-center hover:underline" id="siriusTx" :copyValue="siriusTxnHash" copySubject="Sirius transaction hash"><font-awesome-icon icon="external-link-alt" class="text-blue-primary w-3 h-3 self-center inline-block mr-2"></font-awesome-icon>{{ siriusTxnHash }}</a>
                    <div class="flex-none">
                      <font-awesome-icon icon="copy" @click="copy('siriusTx')" class="w-5 h-5 text-blue-primary cursor-pointer self-center ml-3 absoltue top-2 hover:opacity-90 duration-800 transition-all" v-if="step2"></font-awesome-icon>
                    </div>
                  </div>
                </div>
                <div v-if="isInvalidSiriusTxnHash && step2" class="mt-2 text-sm text-gray-700">
                  Sirius transaction hash is not found in swap service. Please initiate new swap from {{currentNativeTokenName}} to ETH
                  <router-link :to="{ name: 'ViewServicesMainnetSwapEthOptions' }" class="bg-blue-primary text-white py-2 px-5 rounded-2xl w-24 block text-center my-3 font-bold">Swap</router-link>
                </div>
              </div>
            </div>
            <div class="font-bold text-left text-xs md:text-sm mt-4" :class="step3?'text-gray-700':'text-gray-300'">Step 2: Check ETH transaction status</div>
            <div class="flex border-b border-gray-300 p-3">
              <div class="flex-none">
                <div class=" rounded-full border w-6 h-6" :class="step3?'border-blue-primary':'border-gray-300'">
                  <div class="flex h-full justify-center">
                    <font-awesome-icon icon="check" :class="step3?'text-blue-primary':'text-gray-300'" class="w-3 h-3 self-center inline-block"></font-awesome-icon>
                  </div>
                </div>
              </div>
              <div class="flex-grow text-left text-xs md:text-sm ml-3 self-center transition-all duration-500" :class="step3?'text-gray-700':'text-gray-300'">Checking transaction status</div>
            </div>
            <div class="flex border-b border-gray-300 p-3">
              <div class="flex-none">
                <div class=" rounded-full border w-6 h-6 transition-all duration-500" :class="isInvalidRemoteTxnHash && step4?'border-red-primary':(step4?'border-blue-primary':'border-gray-300')">
                  <div class="flex h-full justify-center">
                    <font-awesome-icon icon="times" class="text-red-primary w-3 h-3 self-center inline-block transition-all duration-500" v-if="isInvalidRemoteTxnHash && step4"></font-awesome-icon>
                    <font-awesome-icon icon="check" :class="step4?'text-blue-primary':'text-gray-300'" class="w-3 h-3 self-center inline-block transition-all duration-500" v-else></font-awesome-icon>
                  </div>
                </div>
              </div>
              <div class="flex-grow text-left text-xs md:text-sm ml-3 self-center transition-all duration-500" :class="step4?'text-gray-700':'text-gray-300'">
                {{ txtRemoteTxnSummary }}
                <div v-if="!isInvalidRemoteTxnHash && step4" class="mt-2">
                  <div v-if="remoteTxnHash" class="bg-yellow-100 py-2 px-5 mt-1 rounded-xl flex">
                    <a :href="remoteTxnLink" target=_new :class="isInvalidRemoteTxnHash?'text-gray-300':'text-blue-primary'" class="flex-grow break-all text-tsm self-center hover:underline" id="remoteTx" :copyValue="remoteTxnHash" copySubject="ETH transaction hash"><font-awesome-icon icon="external-link-alt" class="text-blue-primary w-3 h-3 self-center inline-block mr-2"></font-awesome-icon>{{ remoteTxnHash }}</a>
                    <div class="flex-none">
                      <font-awesome-icon icon="copy" @click="copy('remoteTx')" class="w-5 h-5 text-blue-primary cursor-pointer self-center ml-3 absoltue top-2 hover:opacity-90 duration-800 transition-all" v-if="step4"></font-awesome-icon>
                    </div>
                  </div>
                </div>
                <div v-if="isInvalidRemoteTxnHash && step4" class="mt-2 text-xs md:text-sm text-gray-700">
                  ETH transaction hash is not found. Please contact our <a href="https://t.me/proximaxhelpdesk" target=_new class="text-blue-primary font-bold underline">helpdesk</a>.
                </div>
              </div>
            </div>
          </div>
          <div class="mt-10 text-center">
            <router-link :to="{ name: 'ViewServicesMainnetSwap' }" class="default-btn focus:outline-none w-40 inline-block" :class="isDisabled?'opacity-50':''" :is="isDisabled?'span':'router-link'" tag="button">Done</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, ref, onBeforeUnmount } from "vue";
import TextInputClean from '@/components/TextInputClean.vue';
import { copyToClipboard } from '@/util/functions';
import { useToast } from "primevue/usetoast";
import { ethers } from 'ethers';
import { SwapUtils } from '@/util/swapUtils';
import { networkState } from '@/state/networkState';
import { ChainSwapConfig } from "@/models/stores/chainSwapConfig";
import { AppState } from '@/state/appState';


 
    const currentNativeTokenName = computed(()=> AppState.nativeToken.label);
    const serviceErr = ref('');
    const verifyMetaMaskPlugin = ref(true);
    if(window.ethereum){
      if(!window.ethereum.isMetaMask){
        verifyMetaMaskPlugin.value = false;
      }
    }

    let swapData = new ChainSwapConfig(networkState.chainNetworkName);
    swapData.init();

    const custodian = ref('');
    const tokenAddress = ref('');

    (async() => {
      try {
        const fetchService = await SwapUtils.fetchTokenServiceInfo(swapData.swap_IN_SERVICE_URL, "xpx");
        if(fetchService.status==200){
          tokenAddress.value = fetchService.data.ethInfo.scAddress;
          custodian.value = fetchService.data.ethInfo.sinkAddress;
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
    let ethereumChainId = swapData.ETHChainId;
    let ethereumNetworkName = swapData.ETHNetworkName;
    const isInstallMetamask = ref(false);
    const isMetamaskConnected = ref(false);
    const currentAccount = ref(null);
    const currentNetwork = ref('');

    const checkSwapStatusUrl = SwapUtils.getOutgoing_ETHCheckStatus_URL(swapData.swap_IN_SERVICE_URL);
    const ethScanUrl = swapData.ETHScanUrl;
    const remoteTxnLink = computed( () => ethScanUrl + remoteTxnHash.value);

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
        .then((metaChainId:string) => {
          verifyChain(metaChainId);
        })
        .catch((err) => {
          console.error(err);
        });
      ethereum.on('accountsChanged', handleAccountsChanged);
      ethereum.on('chainChanged', (metaChainId:string) => {
        verifyChain(metaChainId);
      });
    }else{
      console.log('MetaMask not installed')
    }
    function fetchMetaAccount(accounts) {
      if (accounts.length === 0) {
        // MetaMask is locked or the user has not connected any accounts
        currentAccount.value = null;
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
          currentAccount.value = null;
        } else if (accounts[0] !== currentAccount.value) {
          currentAccount.value = accounts[0];
          serviceErr.value = '';
        }
      }
      isMetamaskConnected.value = ethereum.isConnected()?true:false;
    }
    function verifyChain(chainId:string){
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
    const copy = (id:string) =>{
      let stringToCopy = document.getElementById(id)?.getAttribute("copyValue");
      let copySubject = document.getElementById(id)?.getAttribute("copySubject");
      copyToClipboard(stringToCopy as string);
      toast.add({severity:'info', summary: copySubject + ' copied', detail: stringToCopy , group: 'br-custom', life: 3000});
    };

    const currentPage = ref(1);
    const showSiriusAddressErr = ref(false);
    const disableSiriusAddress = ref(false);
    const isDisabledValidate = ref(true);
    const siriusAddress = ref('');
    const err = ref('');
    
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

    let xpxExplorerUrl = networkState.currentNetworkProfile?.chainExplorer.url + '/' + networkState.currentNetworkProfile?.chainExplorer.hashRoute + '/';
    const siriusTxnLink = computed(() => xpxExplorerUrl + siriusTxnHash.value);

    const transactionFailed = ref(false);
    const transactionNotFound = ref(false);
    const isInvalidRemoteTxnHash = ref(false);
    const remoteTxnHash = ref(false);
    const transactionPending = ref(false);
    const isDisabled = ref(true);

    const checkSiriusTxn = async () => {
      const data = {
        network: 'eth',
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
            if(!remoteTxnStatus){
              isInvalidRemoteTxnHash.value = true;
            }
            setTimeout( async() => {
              setTimeout(() => step4.value = true, 1000);
              setTimeout(() => isDisabled.value = false, 1000);
            }, 1000);
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

        let isTxnPending = false;
        provider.on("pending", (tx) => {
          if(tx === remoteTxnHash.value){
            isTxnPending = true;
          }
        });

        if(isTxnPending){
          transactionPending.value = true;
          return true;
        }else if(transactionReceipt && transactionReceipt.status === 1 && transactionStatus.to.toLowerCase() == tokenAddress.value.toLowerCase()){ // when transaciton is confirmed but status is 1
          return true;
        }else if(!transactionReceipt && !transactionStatus){ // invalid transaction hash - transaction not found
          transactionNotFound.value = true;
          return false;
        }else{
          transactionFailed.value = true;
          return false;
        }
      }catch(err){
        // console.log(err);
        transactionNotFound.value = true;
        return false;
      }
    };

    const txtRemoteTxnSummary  = computed(() => {
      if(isInvalidRemoteTxnHash.value){
        if(transactionNotFound.value){
          return 'Transaction is not found';
        }else{
          return 'Transaction has failed';
        }
      }else{
        if(transactionPending.value){
          return 'ETH transaction is still pending. Please wait a few more moment';
        }else{
          return 'ETH transaction is successful';
        }
      }
    });

</script>