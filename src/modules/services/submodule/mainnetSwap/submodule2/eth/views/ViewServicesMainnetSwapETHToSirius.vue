<template>
  <div class="flex justify-between text-sm">
    <div><span class="text-gray-400">Swap > ETH > Incoming ></span> <span class="text-blue-primary font-bold">Transaction</span></div>
    <div>
      <router-link :to="{ name: 'ViewServices' }" class="font-bold">All Services</router-link>
    </div>
  </div>
  <div class='mt-2 py-3 gray-line px-0 lg:px-10 xl:px-80'>
    <div class="flex">
      <div class="flex-none">
        <div class="flex hover:bg-gray-200 p-3 rounded-2xl cursor-pointer">
          <div class="rounded-full flex w-6 h-6 sm:w-10 sm:h-10" :class="`${ currentPage>=1?'bg-blue-primary':'bg-gray-300' }`"><div class="self-center inline-block text-center w-full text-white text-txs sm:text-sm">1</div></div>
          <div class="inline-block self-center ml-3 text-xs sm:text-sm">Transaction</div>
        </div>
      </div>
      <div class="h-1 bg-gray-200 flex-grow mx-2 self-center"></div>
      <div class="flex-none">
        <div class="flex hover:bg-gray-200 p-3 rounded-2xl cursor-pointer">
          <div class="rounded-full flex w-6 h-6 sm:w-10 sm:h-10" :class="`${ currentPage>=2?'bg-blue-primary':'bg-gray-300' }`"><div class="self-center inline-block text-center w-full text-white text-txs sm:text-sm">2</div></div>
          <div class="inline-block self-center ml-3 text-xs sm:text-sm">Validation</div>
        </div>
      </div>
      <div class="h-1 bg-gray-200 flex-grow mx-2 self-center"></div>
      <div class="flex-none">
        <div class="flex hover:bg-gray-200 p-3 rounded-2xl cursor-pointer">
          <div class="rounded-full flex w-6 h-6 sm:w-10 sm:h-10" :class="`${ currentPage==3?'bg-blue-primary':'bg-gray-300' }`"><div class="self-center inline-block text-center w-full text-white text-txs sm:text-sm">3</div></div>
          <div class="inline-block self-center ml-3 text-xs sm:text-sm">Certificate</div>
        </div>
      </div>
    </div>
    <div v-if="currentPage==1">
      <div class="text-lg my-7 font-bold">Transaction Details</div>
      <div class="error error_box mb-5" v-if="err!=''">{{ err }}</div>
      <p class="font-bold text-tsm text-left mb-1">From: Metamask address</p>
      <div class="mb-5 flex justify-between bg-gray-100 rounded-2xl p-3 text-left" v-if="isInstallMetamask">
        <div class="text-tsm text-gray-700 self-center relative">
          <div><img src="@/modules/services/submodule/mainnetSwap/img/icon-metamask.svg" class="w-5 inline ml-1 mr-2 absolute" style="top: 0px;"> <div class="ml-8 inline-block break-all">{{ isMetamaskConnected?(currentAccount?currentAccount:'Not connected'):'Not connected' }}</div></div>
        </div>
        <div class="self-center">
          <button @click="connectMetamask()" class="hover:shadow-lg bg-white hover:bg-gray-100 rounded-3xl border-2 font-bold px-6 py-1 border-blue-primary text-blue-primary outline-none focus:outline-none" v-if="!currentAccount">Connect to Metamask</button>
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
      <p class="font-bold text-tsm text-left">To: Sirius address</p>
      <SelectSiriusAccountInputPlugin v-model="siriusAddress" icon="card-alt" :showError="showSiriusAddressErr" errorMessage="Sirius Address required" :options="siriusAddressOption" :disabled="disableSiriusAddress" />
      <p class="font-bold text-tsm text-left mb-1">Amount</p>
      <SupplyInput :disabled="disableAmount" v-model="amount" :balance="balance" title="eXPX" placeholder="eXPX" type="text" icon="coins" :showError="showAmountErr" :errorMessage="(!amount)?'Required Field':'Insufficient balance'" :decimal="6" />
      <div class="mt-10">
        <button @click="$router.push({name: 'ViewServices'})" class="default-btn mr-5 focus:outline-none disabled:opacity-50">Cancel</button>
        <button type="submit" class="default-btn focus:outline-none disabled:opacity-50" :disabled="isDisabledSwap" @click="sendRequest()">Send request</button>
      </div>
    </div>
    <div v-if="currentPage==2">
      <div class="text-lg my-7">
        <div class="flex border-b border-gray-300 p-3">
          <div class="flex-none">
            <div class=" rounded-full border border-blue-primary w-6 h-6 md:w-9 md:h-9">
              <div class="flex h-full justify-center">
                <font-awesome-icon icon="check" class="text-blue-primary w-3 h-3 md:w-7 md:h-7 self-center inline-block"></font-awesome-icon>
              </div>
            </div>
          </div>
          <div class="flex-grow text-left text-xs md:text-sm lg:text-lg ml-3 text-gray-700 self-center">Sending transfer to Metamask.</div>
        </div>
        <div class="flex border-b border-gray-300 p-3">
          <div class="flex-none">
            <div class=" rounded-full border border-blue-primary w-6 h-6 md:w-9 md:h-9">
              <div class="flex h-full justify-center">
                <font-awesome-icon icon="check" class="text-blue-primary w-3 h-3 md:w-7 md:h-7 self-center inline-block"></font-awesome-icon>
              </div>
            </div>
          </div>
          <div class="flex-grow text-left text-xs md:text-sm lg:text-lg ml-3 text-gray-700 self-center">Waiting for your approval on Metamask.</div>
        </div>
        <div class="flex border-b border-gray-300 p-3">
          <div class="flex-none">
            <div class=" rounded-full border border-blue-primary w-6 h-6 md:w-9 md:h-9">
              <div class="flex h-full justify-center">
                <font-awesome-icon icon="check" class="text-blue-primary w-3 h-3 md:w-7 md:h-7 self-center inline-block"></font-awesome-icon>
              </div>
            </div>
          </div>
          <div class="flex-grow text-left text-xs md:text-sm lg:text-lg ml-3 text-gray-700 self-center">Transfer validated. <a href="#" class="text-blue-primary" id="validateTransfer" copyValue="wfwefwefw2345tg3y34y34dfwfew3465fe345wfewvrew" copySubject="Transfer Validation">(wfwefwefw2345tg3y34y34dfwfew3465fe345wfewvrew)</a></div>
          <div class="flex-none">
            <font-awesome-icon icon="copy" @click="copy('validateTransfer')" class="w-5 h-5 text-blue-primary cursor-pointer self-center"></font-awesome-icon>
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
          <div class="flex-grow text-left text-xs md:text-sm lg:text-lg ml-3 text-gray-700 self-center">Sending transaction ID message to Metamask.</div>
        </div>
        <div class="flex border-b border-gray-300 p-3">
          <div class="flex-none">
            <div class=" rounded-full border border-blue-primary w-6 h-6 md:w-9 md:h-9">
              <div class="flex h-full justify-center">
                <font-awesome-icon icon="check" class="text-blue-primary w-3 h-3 md:w-7 md:h-7 self-center inline-block"></font-awesome-icon>
              </div>
            </div>
          </div>
          <div class="flex-grow text-left text-xs md:text-sm lg:text-lg ml-3 text-gray-300 self-center">Waiting for your approval on Metamask.</div>
        </div>
        <div class="flex border-b border-gray-300 p-3">
          <div class="flex-none">
            <div class=" rounded-full border border-blue-primary w-6 h-6 md:w-9 md:h-9">
              <div class="flex h-full justify-center">
                <font-awesome-icon icon="check" class="text-blue-primary w-3 h-3 md:w-7 md:h-7 self-center inline-block"></font-awesome-icon>
              </div>
            </div>
          </div>
          <div class="flex-grow text-left text-xs md:text-sm lg:text-lg ml-3 text-gray-300 self-center">Message validated.</div>
          <div class="flex-none">
            <font-awesome-icon icon="copy" class="w-5 h-5 text-gray-300"></font-awesome-icon>
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
          <div class="flex-grow text-left text-xs md:text-sm lg:text-lg ml-3 text-gray-300 self-center">Claiming your XPX.</div>
        </div>
        <div class="flex border-b border-gray-300 p-3">
          <div class="flex-none">
            <div class=" rounded-full border border-blue-primary w-6 h-6 md:w-9 md:h-9">
              <div class="flex h-full justify-center">
                <font-awesome-icon icon="check" class="text-blue-primary w-3 h-3 md:w-7 md:h-7 self-center inline-block"></font-awesome-icon>
              </div>
            </div>
          </div>
          <div class="flex-grow text-left text-xs md:text-sm lg:text-lg ml-3 text-gray-300 self-center">Swap in progress.</div>
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
        <swap-certificate-component networkTerm="ETH" swapType="Incoming" />
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
  </div>
</template>
<script>
import { computed, ref } from "vue";
import SupplyInput from '@/components/SupplyInput.vue';
import SwapCertificateComponent from '@/modules/services/submodule/mainnetSwap/components/SwapCertificateComponent.vue';
import SelectSiriusAccountInputPlugin from '@/modules/services/submodule/mainnetSwap/components/SelectSiriusAccountInputPlugin.vue';
import { walletState } from '@/state/walletState';
import { copyToClipboard } from '@/util/functions';
import { useToast } from "primevue/usetoast";

export default {
  name: 'ViewServicesMainnetSwapETHToSirius',

  components: {
    SupplyInput,
    SwapCertificateComponent,
    SelectSiriusAccountInputPlugin,
  },

  setup() {

    /* metamask integration */
    const isInstallMetamask = ref(false);
    const isMetamaskConnected = ref(false);
    const currentAccount = ref(null);
    const balance = ref(0);

    if (typeof window.ethereum !== 'undefined') {
      console.log('MetaMask is installed!');
      isInstallMetamask.value = true;
      isMetamaskConnected.value = ethereum.isConnected()?true:false;
      // isMetamaskConnected.value = false;

      ethereum
      .request({ method: 'eth_accounts' })
      .then(handleAccountsChanged)
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
        verifyChain(metaChainId)
      });

      ethereum.on('connect', (connectInfo) => {
        console.log(connectInfo)
      });

    }else{
      console.log('metamask not installed')
    }

    function verifyChain(chainId){
      let ethereumChainId = [1, 3, 4, 5, 42];
      if(ethereumChainId.find(ethChain => ethChain === parseInt(chainId)) == undefined){
        err.value = 'Please select an Ethereum network on Metamark to swap ETH';
      }else{
        err.value = '';
      }
    }

    // For now, 'eth_accounts' will continue to always return an array
    function handleAccountsChanged(accounts) {
      if (accounts.length === 0) {
        // MetaMask is locked or the user has not connected any accounts
        console.log('Please connect to MetaMask.');
      } else if (accounts[0] !== currentAccount.value) {
        currentAccount.value = accounts[0];

        // get metamask balance
        ethereum
        .request({ method: 'eth_getBalance', params: [
          currentAccount.value, 'latest'
        ] })
        .then(hexDecimalBalance => {
          balance.value = parseInt(hexDecimalBalance)/Math.pow(10, 18)
        })
        .catch((err) => {
          console.error(err);
        });
      }
    }

    const connectMetamask = () => {
      ethereum
      .request({ method: 'eth_requestAccounts' })
      .then(handleAccountsChanged)
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
    const isDisabledValidate = ref(false);
    const showAmountErr = ref(false);
    const disableAmount = ref(false);
    const siriusAddress = ref('');
    const err = ref('');
    const isDisabledSwap = computed(() =>
      // verify it has been connected to metamask too
      !(amount.value > 0 && siriusAddress.value != '' && !err.value)
    );
    const amount = ref(0);

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
    };
  },
}
</script>