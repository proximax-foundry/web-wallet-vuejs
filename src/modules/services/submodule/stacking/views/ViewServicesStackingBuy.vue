<template>
  <div>
    <div class='lg:w-9/12 ml-2 mr-2 lg:ml-auto lg:mr-auto mt-5'>
      <div class='mt-6 px-6 py-10 border filter shadow-lg text-center'>
        <div class="text-md mb-3">Buy {{ selectedToToken }}</div>
        <div>
          <div v-if="!isChainIdValid && isWalletConnected" class="error_box error error-text">
            <div>Please select supported chain, ethereum {{  remoteNetworkType }}/ bsc {{  remoteNetworkType }}</div>
          </div>
          <div v-if="!isSupportedChainId && isWalletConnected" class="error_box error error-text">
            <div>Chain unsupported, please change to supported chain</div>
          </div>
          <div class="flex justify-center mt-10 error_box error error-text" v-if="tokenInvalid">
            Unsupported token
          </div>
          <div class="flex justify-center mt-10 error_box error error-text" v-if="!settingDone && isLoaded">
            Configuration error
          </div>
          <div class="flex justify-center mt-10 error_box error error-text" v-if="submitFailed">
            Submission failed
          </div>
          <div class="flex justify-center mt-10 error_box error error-text" v-if="customErrorMessage">
            {{ customErrorMessage }}
          </div>
          <div class="mt-10 success_box success success-text" v-if="processing">
            <div class="mb-2">Submission is successful.</div>
            <div class="font-normal relative"><b>Transaction hash: </b><a :href="explorerLink + transactionHash" target=_new class="hover:underline">{{ transactionHash.substring(0, 7) + '...' + transactionHash.slice(-7) }} <font-awesome-icon icon="external-link-alt" class="ml-1 w-3 h-3 self-center inline-block"></font-awesome-icon></a></div>
            <div><button type="button" class="w-40 hover:shadow-sm bg-blue-primary text-white text-xs hover:opacity-50 rounded font-bold px-3 py-2 border border-blue-primary outline-none mt-2 mb-2" @click="saveCertificate">{{$t('general.certificate')}}</button></div>
          </div>
          <div class="flex justify-center mt-10 success_box success success-text" v-if="dispalyWaitForConfirmationMessage">
            <div style="border-top-color:transparent" class="inline-block mr-2 relative top-2 w-4 h-4 border-4 border-green-500 border-solid rounded-full animate-spin"></div> Please wait until transaction is confirmed
          </div>
          <div v-if="isWalletConnected" class="text-xs flex items-center justify-end">
            <div v-if="connectedWalletName === 'WC'" class="flex items-center gray-text-300">
              <img src="@/modules/services/submodule/mainnetSwap/img/icon-walletconnect.svg" class="w-4 h-4 inline-block" />&nbsp;{{ tokenType(selectedChainId) }}&nbsp;{{ connectedAddress }}
            </div>
            <div v-else class="flex items-center gray-text-300">
              <img src="@/modules/services/submodule/mainnetSwap/img/icon-metamask-fox.svg" class="w-4 h-4 inline-block" />&nbsp;{{ tokenType(selectedChainId) }}&nbsp;{{ connectedAddress }}
            </div>
            <button @click="manualDisconnect" class="ml-2 text-gray-500 flex items-center group hover:text-gray-900 border border-gray-500 p-1 rounded-md bg-gray-50">Disconnect <font-awesome-icon icon="times" class="text-gray-500 ml-1 group-hover:text-gray-900" /></button>
          </div>
          <div v-else class="text-xs flex items-center justify-end text-gray-500 hover:text-gray-900 group duration-200 transition-all"><button @click="connectWallet" class="border border-gray-500 p-1 rounded-md bg-gray-50 hover:bg-gray-200 transition-all duration-200">Connect Wallet <font-awesome-icon icon="wallet" class="text-gray-500 ml-2 group-hover:text-gray-900" /></button></div>
          <div>
            <BuyFormInput ref="buyFromComponent" formLabel="From" :tokens="stableCoins" v-model="fromInputAmount" :selectedToken="selectedFromToken" :amount="fromAmount" :tokenType="tokenType(selectedChainId)" @confirmedSelectToken="selectFromToken" />
            <BuyFormInputFlex ref="buyToComponent" formLabel="To" :tokens="siriusTokens" v-model="toInputAmount" :selectedToken="selectedToToken" :amount="toAmount" @confirmedSelectToken="selectToToken" :disabled="true" class="mt-5" />
          </div>
          <div class="flex mt-4">
            <AddressInputClean :placeholder="$t('transfer.transferPlaceholder')" v-model="siriusAddress" v-debounce:1000="checkRecipient" :showError="showAddressError" />
            <div @click="toggleContact=!toggleContact" class=' border rounded-md cursor-pointer flex flex-col justify-around p-2 ' >
              <font-awesome-icon icon="id-card-alt" class=" text-blue-primary ml-auto mr-auto "></font-awesome-icon>
              <div class='text-xxs text-blue-primary font-semibold uppercase'>{{$t('general.select')}}</div>
            </div>
          </div>
          <div v-if="toggleContact" class=" border ">
          <div class='text-xxs text-left text-gray-300 font-semibold py-2 px-2 uppercase'>{{$t('general.importFromAB')}}</div>
            <div v-for="(item, number) in contacts" :key="number" class="cursor-pointer">
              <div @click="siriusAddress=item.value;toggleContact=false" class="flex justify-between">
                <div v-if="number%2==0" class="text-xs py-2 bg-gray-100 pl-2 w-full text-left">{{item.label}}</div>
                <div v-if="number%2==1" class="text-xs py-2 pl-2 w-full text-left">{{item.label}}</div>
                <div v-if="number%2==0" class="ml-auto pr-2 text-xxs py-2 font-semibold text-blue-primary bg-gray-100 uppercase">{{$t('general.select')}}</div>
                <div v-if="number%2==1" class="ml-auto mr-2 text-xxs py-2 font-semibold text-blue-primary uppercase">{{$t('general.select')}}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="md:flex md:justify-between mt-5">
          <div class="bg-blue-50 p-3 rounded-md inline-block text-xs text-right w-full">
            <div class="mb-1.5">Exchange Rate: 1 {{ selectedFromToken }} = {{ exchangeRate }} {{ selectedToToken }}</div>
            <div class="mb-1.5">Fee: {{ fee }} {{ selectedToToken }}</div>
            <div class="mb-1.5">{{ selectedFromToken }} Price: {{ selectedFromTokenPrice }} USD</div>
            <div>{{ selectedToToken }} Price: {{ selectedToTokenPrice }} USD</div>
          </div>
          <toggleSwitch v-model="isChecked" class="w-full mt-3 order-last md:order-first" />
        </div>
        <div class="flex justify-center mt-10">
          <button class="blue-btn font-semibold py-2 cursor-pointer text-center w-32 disabled:opacity-50 disabled:cursor-auto" :disabled="disabledBuy" @click="buySiriusToken">Buy</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, ref, watch, shallowRef } from "vue";
import { useRouter } from "vue-router";
import { networkState } from "@/state/networkState";
import { ChainSwapConfig } from "@/models/stores/chainSwapConfig";
import { useI18n } from 'vue-i18n';
import { availableTokens } from '@/modules/services/submodule/stacking/stableCoins';
import { availableToTokens } from '@/modules/services/submodule/stacking/siriusTokens';
import { bscStableCoins } from '@/modules/services/submodule/stacking/bscStableCoins';
import { ethStableCoins } from '@/modules/services/submodule/stacking/ethStableCoins';
import BuyFormInput from '@/modules/services/submodule/stacking/components/BuyFormInput.vue';
import BuyFormInputFlex from '@/modules/services/submodule/stacking/components/BuyFormInputFlex.vue';
import AddressInputClean from "@/modules/transfer/components/AddressInputClean.vue"
import WalletConnectProvider from "@walletconnect/web3-provider";
import Web3Modal from 'web3modal';
import { ethers } from 'ethers';
import { abi, SwapUtils } from '@/util/swapUtils';
import { AppState } from "@/state/appState";
import { walletState } from "@/state/walletState";
import { Address, NetworkType } from 'tsjs-xpx-chain-sdk';
import toggleSwitch from '@/modules/services/submodule/stacking/components/toggleSwitch.vue';
import { getCurrentPriceUSD } from "@/util/functions";
import { Utilities } from "@/util/utilities";
import { Helper } from "@/util/typeHelper";


export default {
  name: "ViewServicesStackingBuy",
  components: {
    BuyFormInput,
    BuyFormInputFlex,
    AddressInputClean,
    toggleSwitch,
  },
  setup(){

    const {t} = useI18n();

    let swapData = new ChainSwapConfig(networkState.chainNetworkName);
    swapData.init();

    const processing = ref(false);
    const submitFailed = ref(false);
    const buyFromComponent = ref(null);
    let stableCoins = availableTokens;
    let siriusTokens = ref(availableToTokens);
    const selectedContractAddress = ref("");
    const selectedStableCoins = ref([]);
    const toAmount = ref(12345.54);
    const fromAmount = ref(12345.87);
    const fromInputAmount = ref(0);
    const toInputAmount = ref(0);
    const recipient = ref(walletState.currentLoggedInWallet.accounts.find(x => x.default).address);
    const isSubmit = shallowRef(false);
    const tokenInvalid = ref(false);

    const transactionHash = ref('');
    const explorerLink = ref('');
    
    const isChainIdValid = ref(false);
    let provider;

    const disabledBuy = computed(() => {
      return tokenInvalid.value || !settingDone.value || !isChainIdValid.value || !isSupportedChainId.value || fromInputAmount.value < 1 || !isChecked.value || isSubmit.value
    });

    const customErrorMessage = ref("");
    const dispalyWaitForConfirmationMessage = ref(false);
    const selectedRemoteSinkAddress = ref("");
    const bscSinkAddress = ref("");
    const ethSinkAddress = ref("");
    const isSupportedChainId = ref(false);
    const bscDisabled = ref(true);
    const ethDisabled = ref(true);
    const connectedAddress = ref("");
    const selectedFromToken = ref('USDT');
    const selectedToToken = ref('XPX');
    const priceUpdated = ref(false);
    const settingDone = ref(false);
    const isLoaded = ref(false);
    const selectedFromTokenPrice = computed(()=>{
      priceUpdated.value; // just to trigger auto recompute
      return stableCoins.find(x => x.name === selectedFromToken.value).price;
    });

    const selectedToTokenPrice = computed(()=>{
      priceUpdated.value; // just to trigger auto recompute
      return siriusTokens.value.find(x => x.name === selectedToToken.value).price;
    });

    const fee = computed(()=>{
      settingDone.value; // just to trigger auto recompute
      return siriusTokens.value.find(x => x.name === selectedToToken.value).fee;
    });

    let siriusTokenAtomicUnits = 1000000;

    const exchangeRate = computed(()=>{
      return Math.trunc((selectedFromTokenPrice.value/ selectedToTokenPrice.value) * siriusTokenAtomicUnits) / siriusTokenAtomicUnits;
    });

    const selectFromToken = (token) => {
      selectedFromToken.value = token;
      updateBuyFromTokenBalance();
    }
    const selectToToken = (token) => {
      selectedToToken.value = token;
    }

    const tokenType = (chainId)=>{

      let tokenType = "";

      if(chainId === bscChainId){
        tokenType = "(BEP20)";
      }
      else if(chainId === ethereumChainId){
        tokenType = "(ERC20)";
      }

      return tokenType;
    }

    const updateBuyFromTokenBalance = ()=>{
      buyFromComponent.value.updateSeletectedTokenBalance(selectedFromToken.value);
    }

    // connect wallet section
    const ethereumChainId = networkState.currentNetworkProfile.network.type === NetworkType.MAIN_NET ? 1 : 5;
    const bscChainId = networkState.currentNetworkProfile.network.type === NetworkType.MAIN_NET ? 56: 97;
    const remoteNetworkType = ethereumChainId === 1 ? "mainnet": "testnet";
    const selectedChainId = ref(0);
    const isWalletConnected = ref(false);
    const connectedWalletName = ref("");

    const web3Modal = new Web3Modal({ cacheProvider: false, providerOptions:{
      // mewconnect: {
      //   package: MewConnect, // required
      //   options: {
      //     infuraId: "27e484dcd9e3efcfd25a83a78777cdf1" // required
      //   }
      // },
      // binancechainwallet: {
      //   package: true
      // },
      walletconnect: {
        package: WalletConnectProvider, // required
        options: {
          infuraId: "27e484dcd9e3efcfd25a83a78777cdf1",
          rpc:{
            1: "https://eth-rpc.gateway.pokt.network/",
            56: "https://bsc-dataseed1.binance.org/"
          }
        }
      }
    }});

    const resetStableCoinsBalanceZero = ()=>{
      fromInputAmount.value = 0;
      for(let i =0; i < stableCoins.length ;++i){
        stableCoins[i].balance = 0;
      }
      selectedStableCoins.value = [];
      updateBuyFromTokenBalance();
    }

    const checkValidSelectedChainId = ()=>{
      if(selectedChainId.value === ethereumChainId || selectedChainId.value === bscChainId){
        isChainIdValid.value = true;

        if(selectedChainId.value === ethereumChainId){
          selectedRemoteSinkAddress.value = ethSinkAddress.value;
        }
        else{
          selectedRemoteSinkAddress.value = bscSinkAddress.value;
        }
      }
      else{
        isChainIdValid.value = false;
      }

      return isChainIdValid.value;
    }

    const checkChainSupported = ()=>{
      if(selectedChainId.value === ethereumChainId){
        isSupportedChainId.value = !ethDisabled.value;
      }
      else if(selectedChainId.value === bscChainId){
        isSupportedChainId.value = !bscDisabled.value;
      }

      return isSupportedChainId.value;
    }

    const searchAccountStableCoinsBalance = async()=>{

      let contracts = [];
      
      if(selectedChainId.value === ethereumChainId){
        contracts = ethStableCoins;
      }
      else if(selectedChainId.value === bscChainId){
        contracts = bscStableCoins;
      }
      else{
        resetStableCoinsBalanceZero();
        return;
      }

      selectedStableCoins.value = contracts;

      let promises = [];
      const web3Provider = new ethers.BrowserProvider(provider);
      const signer = web3Provider.getSigner();
      const address = await signer.getAddress();

      for(let i=0; i < contracts.length; ++i){
        // console.log(contracts[i].disabled);
        if(contracts[i].disabled){
          continue;
        }

        const contract = new ethers.Contract(contracts[i].contractAddress, abi, web3Provider);
        const decimals= contracts[i].decimals;
        const currentName = contracts[i].name;

        let newPromise = new Promise(async(resolve, reject)=>{
          const balance = await contract.balanceOf(address);

          const balanceString = balance.toString();
          const fixedBalance = parseFloat(balanceString.length > decimals ? balanceString.slice(0, -decimals) + '.'+ balanceString.slice(-decimals) : '0.' + '0'.repeat(decimals - balanceString.length) + balanceString);
          let stableCoin = stableCoins.find(x => x.name === contracts[i].name);
          if(selectedFromToken.value === currentName && fromInputAmount.value > fixedBalance){
            fromInputAmount.value = fixedBalance;
          }
          stableCoin.balance = fixedBalance;
          
          resolve(true);
        });
        promises.push(newPromise);
      }

      return Promise.all(promises).then((values)=>{
        updateBuyFromTokenBalance();
        console.log("Stable coins balance updated");
      })
    }

    const checkSelectedTokenSupported = ()=>{
      if(selectedChainId.value === ethereumChainId){
        tokenInvalid.value = ethStableCoins.find(x => x.name === selectedFromToken.value).disabled;
      }
      else if(selectedChainId.value === bscChainId){
        tokenInvalid.value = bscStableCoins.find(x => x.name === selectedFromToken.value).disabled;
      }
      else{
        tokenInvalid.value = true;
      }
    }

    const updateSelectedContractAddress = ()=>{
      if(selectedStableCoins.value.length){
        selectedContractAddress.value = selectedStableCoins.value.find(x => x.name === selectedFromToken.value).contractAddress;
      }
    }

    const fetchServiceInfo = async()=>{
      try{
        const serviceInfo = await SwapUtils.fetchAllSwapServiceInfo(swapData.swap_IN_SERVICE_URL);
        bscSinkAddress.value = serviceInfo.data.bscInfo.sinkAddress;
        ethSinkAddress.value = serviceInfo.data.ethInfo.sinkAddress;

        if(bscSinkAddress.value !== "0x0000000000000000000000000000000000000000"){
          bscDisabled.value = false;
        }

        if(ethSinkAddress.value !== "0x0000000000000000000000000000000000000000"){
          ethDisabled.value = false;
        }

        const siriusTokensInfo = serviceInfo.data.siriusToken;

        for(let siriusToken of siriusTokensInfo){

          let currentSiriusToken = siriusTokens.value.find(x => x.name == siriusToken.name.toUpperCase()); 

          if(currentSiriusToken){
            currentSiriusToken.fee = siriusToken.feeAmount;
          }
        }

        for(let bscStableCoin of bscStableCoins){
          bscStableCoin.disabled = true;
        }

        for(let ethStableCoin of ethStableCoins){
          ethStableCoin.disabled = true;
        }

        const bscTokensInfo = serviceInfo.data.bscScAddressInfo;

        for(let bscScAddress of bscTokensInfo){

          let currentBscStableCoin = bscStableCoins.find(x => x.name == bscScAddress.name); 

          if(currentBscStableCoin){
            currentBscStableCoin.disabled = false;
            currentBscStableCoin.contractAddress = bscScAddress.contractAddress;
            currentBscStableCoin.decimals = bscScAddress.decimals;
          }
        }

        const ethTokensInfo = serviceInfo.data.ethScAddressInfo;

        for(let ethScAddress of ethTokensInfo){

          let currentEthStableCoin = ethStableCoins.find(x => x.name == ethScAddress.name); 

          if(currentEthStableCoin){
            currentEthStableCoin.disabled = false;
            currentEthStableCoin.contractAddress = ethScAddress.contractAddress;
            currentEthStableCoin.decimals = ethScAddress.decimals;
          }
        }
        isLoaded.value = true;
        settingDone.value = true;
      }
      catch(error){
        isLoaded.value = true;
        settingDone.value = false;
      }
    }

    const getCurrentPrice = async ()=>{

      let prices = await getCurrentPriceUSD(SwapUtils.checkSwapPrice(swapData.priceConsultURL));

      for(let siriusToken of siriusTokens.value){
        if(prices[siriusToken.name.toLowerCase()]){
          siriusToken.price = prices[siriusToken.name.toLowerCase()];
        }
      }

      for(let stableCoin of stableCoins){
        if(prices[stableCoin.name.toLowerCase()]){
          stableCoin.price = prices[stableCoin.name.toLowerCase()];
        }
      }

      priceUpdated.value = true;
    };

    getCurrentPrice();
    fetchServiceInfo();

    const setDisconnected = ()=>{  
      provider = null;
      isWalletConnected.value = false;
      connectedWalletName.value = "";
      connectedAddress.value = "";
      selectedChainId.value = 0;
    }

    // events handler
    const handleAccountsChanged = (accounts) => {
      if(accounts[0]){
        connectedAddress.value = accounts[0].substr(0, 5) + '...' + accounts[0].substr(-5);
      }
      else{
        disconnectWallet();
        setDisconnected();
      }
    };

    const handleChainChanged = (chainId) => {

      if(typeof chainId === "string"){
        selectedChainId.value = parseInt(chainId, 16);
      }
      else{
        selectedChainId.value = chainId;
      }
    }

    const handleWCDisconnect = (code, reason) => {
      // console.log(code, reason);
      disconnectWallet(true);
      setDisconnected();
    };

    const handleDisconnect = (error) => {
      // console.log(error);
      // console.log("Call disconnect");
      // disconnectWallet(true);
      // setDisconnected();

      // MetaMask never send disconnect event when all permission removed
      // it trigger when changing to external chain, then trigger connect again 
    };

    const handleConnect = (connectData)=>{
      // MetaMask call after change to external chain 
      handleChainChanged(connectData.chainId);
    }

    // event handler end

    const removeListener = ()=>{
      if(provider){
        provider.removeListener("accountsChanged", handleAccountsChanged);
        provider.removeListener("chainChanged", handleChainChanged);
        provider.removeListener("connect", handleConnect);
        
        if(connectedWalletName.value === "WC"){
          provider.removeListener("disconnect", handleWCDisconnect);
        }
        else{
          provider.removeListener("disconnect", handleDisconnect);
        }
      }
    }

    const connectWallet = async() =>{
      try {
          provider = await (connectedWalletName.value === "WC" ? web3Modal.connectTo("walletconnect") : web3Modal.connect());
          
          // console.log(provider);

          isWalletConnected.value = true;

          provider.on("accountsChanged", handleAccountsChanged);

          // Subscribe to chainId change, working on wc
          provider.on("chainChanged", handleChainChanged);

          provider.on("connect", handleConnect);

          // check if it is walletconnect
          if(provider.wc){
            selectedChainId.value = provider.chainId;
            connectedAddress.value = provider.accounts[0].substr(0, 5) + '...' + provider.accounts[0].substr(-5);
            connectedWalletName.value = "WC";
            // wc disconnect event
            // Subscribe to session disconnection
            provider.on("disconnect", handleWCDisconnect);
          }
          else{
            // only for MetaMask Extension
            selectedChainId.value = parseInt(provider.chainId, 16);
            connectedAddress.value = provider.selectedAddress.substr(0, 5) + '...' + provider.selectedAddress.substr(-5);
            connectedWalletName.value = "MM";

            // Subscribe to provider disconnection
            provider.on("disconnect", handleDisconnect);
          }
      }catch(error){
        // console.log("Error");
        // console.log(error);
      }
    }

    const disconnectWallet = (fromEvent = false)=>{

      if(!fromEvent){
        manualDisconnect();
      }
      else{
        isWalletConnected.value = false;
        connectedWalletName.value = "";
      }
    }

    const manualDisconnect = ()=>{

      if(provider && provider.disconnect){
        console.log("Do disconnect");
        provider.disconnect();
      }
      else if(provider){
        removeListener();
      }

      isWalletConnected.value = false;
      connectedWalletName.value = "";
      setDisconnected()
      resetStableCoinsBalanceZero();
    }

    const checkWalletConnected = ()=>{
      let walletConnectData = localStorage.getItem("walletconnect");

      if(walletConnectData !== null){
        isWalletConnected.value = true;
        connectedWalletName.value = "WC";
        connectWallet();
      }
    }

    checkWalletConnected();

    const swapTimestamp = ref('');
    const buySiriusToken = async ()=>{

      customErrorMessage.value = "";

      try {
        isSubmit.value = true;
        const web3Provider = new ethers.BrowserProvider(provider);
        const signer = web3Provider.getSigner();
        const address = await signer.getAddress();

        let signedMessageSignature;

        if (provider.wc) {
          signedMessageSignature = await provider.send(
              'personal_sign',
              [ ethers.hexlify(ethers.toUtf8Bytes(siriusAddress.value)), address.toLowerCase() ]
          );
        }
        else { 
          signedMessageSignature = await signer.signMessage(siriusAddress.value);
        }

        const contract = new ethers.Contract(selectedContractAddress.value, abi, signer);

        const decimals = selectedStableCoins.value.find(x => x.contractAddress === selectedContractAddress.value).decimals;

        /* for future references
        let ABI = [
        "function transfer(address to, uint amount)"
        ];
        let iface = new ethers.Interface(ABI);
        let dataPayload = iface.encodeFunctionData("transfer", [ address, ethers.parseUnits(fromInputAmount.value.toString(), decimals) ])

        console.log(dataPayload);
        
        const tx = {
          // this could be provider.addresses[0] if it exists
          from: address, 
          // target address, this could be a smart contract address
          to: selectedContractAddress.value, 
          // optional if you want to specify the gas limit 
          gasLimit: 57500, 
          // optional if you are invoking say a payable function 
          value: "0x00",
          // this encodes the ABI of the method and the arguements
          data: dataPayload
        };

        let receipt = await signer.broadcastTransaction(tx);

        console.log(receipt);
        */

        let options = {
          gasLimit: 57500,
        };
        const receipt = await contract.transfer(
          selectedRemoteSinkAddress.value,
          ethers.parseUnits(fromInputAmount.value.toString(), decimals)
          //options,
        );

        dispalyWaitForConfirmationMessage.value = true;

        let loop = 1;
        let receiptFound = false;

        while(loop <= 15 && !receiptFound){
          await Utilities.delay(2000);

          let txnReceipt = await web3Provider.getTransactionReceipt(receipt.hash);
          
          if(txnReceipt){
            receiptFound = true;
            // console.log(txnReceipt);
          }
          ++loop;
        }

        dispalyWaitForConfirmationMessage.value = false;

        if(!receiptFound){
          customErrorMessage.value = "Transaction not confirmed";
          throw "Transaction not confirmed";
        }

        let txnHash = receipt.hash;
        let nonce = receipt.nonce;
        transactionHash.value = txnHash;
        explorerLink.value = selectedChainId.value === bscChainId?swapData.BSCScanUrl:swapData.ETHScanUrl;

        const data = {
          fromToken: selectedFromToken.value,
          toToken: selectedToToken.value,
          nonce: nonce,
          recipient: siriusAddress.value,
          signature: signedMessageSignature,
          txnInfo: {
            txnHash: txnHash,
            network: selectedChainId.value === bscChainId ? "BSC" : "ETH"
          }
        };

        const response = await fetch(SwapUtils.getIncoming_SwapTransfer_URL(swapData.swap_IN_SERVICE_URL), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data)
        });

        if(response.status == 200 || response.status == 201 || response.status == 202){
          const serverResponseData = await response.json();

          console.log(serverResponseData);
          swapTimestamp.value = Helper.IsoTimeRemoveFormat(serverResponseData.timestamp);

          processing.value = true;
          searchAccountStableCoinsBalance();
        }
        else{
          submitFailed.value = true;
        }

      } catch (error) {
        isSubmit.value = false;
        console.log(error);
        // let txnRejected = true; 
      }
    }

    // section end

    // address
    const accounts = computed(()=>{
      if(!walletState.currentLoggedInWallet){
        return [];
      }
      let accounts = walletState.currentLoggedInWallet.accounts.map((acc)=>{
        return {
          name: acc.name,
          balance: acc.balance,
          address: acc.address,
          publicKey: acc.publicKey,
          assets: acc.assets,
          isMultisig: acc.getDirectParentMultisig().length ? true: false
        };
      });

      let otherAccounts =walletState.currentLoggedInWallet.others.filter((acc)=> acc.type === "MULTISIG").map((acc)=>{
        return {
          name: acc.name,
          balance: acc.balance,
          address: acc.address,
          publicKey: acc.publicKey,
          assets: acc.assets,
          isMultisig: true
        };
      });

      return accounts.concat(otherAccounts);
    });

    const refreshSiriusTokenBalance = () => {
      const addressRaw = Helper.createAddress(siriusAddress.value).plain();
      const selectedAccount = accounts.value.find(account => account.address === addressRaw);
      let assets = [];
      if(selectedAccount){
        assets = selectedAccount.assets;
      }

      for(let i =0; i < siriusTokens.value.length ;++i){
        const searchedasset = assets.find(asset => asset.namespaceNames.includes(siriusTokens.value[i].namespaceName));
        if(searchedasset){
          siriusTokens.value[i].balance = searchedasset.amount;
        }else{
          siriusTokens.value[i].balance = 0;
        }
      }
    }

    const showAddressError = shallowRef(true);
    const toggleContact = shallowRef(false);
    const siriusAddress = ref('');

    const checkNamespace = async (nsId)=>{
      return await NamespaceUtils.getLinkedAddress(nsId, chainAPIEndpoint.value);
    }

    const checkRecipient = () =>{
      if(!walletState.currentLoggedInWallet){
        return;
      }
      try {
        let recipientAddress = Helper.createAddress(siriusAddress.value);
        let networkOk = Helper.checkAddressNetwork(recipientAddress, AppState.networkType);
        if(!networkOk){
          showAddressError.value = true;
        }
        else{
          showAddressError.value = false;
          refreshSiriusTokenBalance();
        }
      } catch (error) {
        // console.log(error)
        try{
          let namespaceId = Helper.createNamespaceId(Helper.createAddress(siriusAddress.value).plain().toLowerCase());
          checkNamespace(namespaceId).then((address)=>{
            siriusAddress.value = address.plain();
            showAddressError.value = false;
            refreshSiriusTokenBalance();
          }).catch((error)=>{
            showAddressError.value = true;
          });
        }
        catch(error){
          // console.log(error)
          showAddressError.value = true;
        }
      }
    };
    siriusAddress.value = Helper.createAddress(walletState.currentLoggedInWallet.selectDefaultAccount().address).pretty();
    checkRecipient();
    watch(siriusAddress, n => {
      if(n.length==40 || n.length==46){
        checkRecipient();
      }else{
        showAddressError.value = true;
      }
    });


    // watcher section
    watch([fromInputAmount, exchangeRate], (newValue)=>{
      toInputAmount.value = newValue[0] * newValue[1];
    });

    watch(selectedFromToken, (newValue)=>{
      updateSelectedContractAddress();
      checkSelectedTokenSupported();
    });

    watch([selectedChainId, connectedAddress], (newChainId)=>{

      let isValid = checkValidSelectedChainId();
      let isSupported = checkChainSupported();

      if(isValid && isSupported){
        searchAccountStableCoinsBalance();
        updateSelectedContractAddress();
        checkSelectedTokenSupported();
      }
    })

    // get balance of xpx and metc for currect sirius wallet
    // watch(walletState.currentLoggedInWallet.selectDefaultAccount().assets, () =>{
    watch(showAddressError, (showAddressErrorStatus) =>{
      if(!showAddressErrorStatus){
        (async() => {
          await getSiriusTokenBalance();
        })();
      }
    });

    const getSiriusTokenBalance = async() => {
      const accountInfo = await AppState.chainAPI.accountAPI.getAccountInfo(Helper.createAddress(siriusAddress.value));
      let assetIdList = [];
      let assetAmountList = [];
      accountInfo.mosaics.map((mosaic) => {
        assetIdList.push(mosaic.id)
        assetAmountList.push(mosaic.amount)
      });
      const mosaicInfo = await AppState.chainAPI.assetAPI.getMosaicsNames(assetIdList);
      const filteredMosaics = mosaicInfo.reduce((filtered, mosaic) => {
        if(mosaic.names.length > 0){
          let amount = assetAmountList[assetIdList.findIndex(asset => asset.toHex() == mosaic.mosaicId.toHex())];
          let nsNames = [];
          mosaic.names.forEach(name => {
            nsNames.push(name.name)
          });
          let filterAsset = { names: nsNames, id: mosaic.mosaicId, amount: amount.compact() };
          filtered.push(filterAsset);
        }
        return filtered;
      }, []);

      for(let i =0; i < siriusTokens.value.length ;++i){
        const searchedAsset = filteredMosaics.find(asset => asset.names.includes(siriusTokens.value[i].namespaceName));
        if(searchedAsset){
          siriusTokens.value[i].balance = Helper.convertToExact(searchedAsset.amount, siriusTokens.value[i].divisibility);
        }else{
          siriusTokens.value[i].balance = 0;
        }
      }
    }
    getSiriusTokenBalance();

    // watcher section end

    const contacts = computed(() => {
      if(!walletState.currentLoggedInWallet){
        return [];
      }
      const wallet = walletState.currentLoggedInWallet;
      var contact = [];
      accounts.value.forEach((element) => {
        contact.push({ 
          value: Address.createFromRawAddress(element.address).pretty() ,
          label: element.name + " - "+t('general.ownerAcc'),
        });
      });
      if (wallet.contacts != undefined) {
        wallet.contacts.forEach((element) => {
          contact.push({
            value: Address.createFromRawAddress(element.address).pretty(),
            label: element.name + " - "+t('general.contact'),
          });
        });
      }
      return contact;
    });

    const isChecked = ref(false);

    const saveCertificate = () => {
      const swapQr = SwapUtils.generateQRCode(explorerLink.value + transactionHash.value);
      SwapUtils.generateIncomingPdfCert(selectedChainId.value === bscChainId ? "BSC" : "ETH", swapTimestamp.value, siriusAddress.value, selectedFromToken.value, transactionHash.value, swapQr);
    };

    return {
      isLoaded,
      stableCoins,
      siriusTokens,
      toAmount,
      fromAmount,
      fromInputAmount,
      toInputAmount,
      selectedFromToken,
      selectedToToken,
      selectFromToken,
      selectToToken,
      disabledBuy,
      connectedAddress,
      availableTokens,
      manualDisconnect,
      connectWallet,
      isWalletConnected,
      connectedWalletName,
      tokenType,
      selectedChainId,
      buyFromComponent,
      exchangeRate,
      isChainIdValid,
      selectedFromTokenPrice,
      selectedToTokenPrice,
      buySiriusToken,
      showAddressError,
      toggleContact,
      siriusAddress,
      checkRecipient,
      contacts,
      isChecked,
      isSubmit,
      isSupportedChainId,
      remoteNetworkType,
      settingDone,
      tokenInvalid,
      processing,
      submitFailed,
      fee,
      dispalyWaitForConfirmationMessage,
      customErrorMessage,
      explorerLink,
      transactionHash,
      saveCertificate,
    }
  }
}
</script>
