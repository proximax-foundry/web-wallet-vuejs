<template>
  <div>
    <div class='lg:w-9/12 ml-2 mr-2 lg:ml-auto lg:mr-auto mt-5'>
      <div class='mt-6 px-6 py-10 border filter shadow-lg text-center'>
        <div class="text-md mb-3">Buy {{ selectedToToken }}</div>
        <div>
          <div v-if="!isChainIdValid && isWalletConnected" class="error_box error error-text">
            <div>Please select supported chain, ethereum mainnet/ bsc mainnet</div>
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
            <BuyFormInput ref="buyToComponent" formLabel="To" :tokens="siriusTokens" v-model="toInputAmount" :selectedToken="selectedToToken" :amount="toAmount" @confirmedSelectToken="selectToToken" :disabled="true" class="mt-5" />
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
        <div class="flex justify-between mt-5">
          <toggleSwitch v-model="isChecked" />
          <div class="bg-blue-50 p-3 rounded-md inline-block text-xs text-right">
            <div class="mb-1.5">Exchange Rate: 1 {{ selectedFromToken }} = {{ exchangeRate }} {{ selectedToToken }}</div>
            <div class="mb-1.5">{{ selectedFromToken }} Price: {{ selectedFromTokenPrice }} USD</div>
            <div>{{ selectedToToken }} Price: {{ selectedToTokenPrice }} USD</div>
          </div>
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
import AddressInputClean from "@/modules/transfer/components/AddressInputClean.vue"
import WalletConnectProvider from "@walletconnect/web3-provider";
import Web3Modal from 'web3modal';
import { ethers } from 'ethers';
import { abi, SwapUtils } from '@/util/swapUtils';
import { AppState } from "@/state/appState";
import { walletState } from "@/state/walletState";
import { Address } from 'tsjs-xpx-chain-sdk';
import toggleSwitch from '@/modules/services/submodule/stacking/components/toggleSwitch.vue';

export default {
  name: "ViewServicesStackingBuy",
  components: {
    BuyFormInput,
    AddressInputClean,
    toggleSwitch,
  },
  setup(){
    /**
     * To do
     * - toTokenAmount cannot higher than balance
     * - dynamic price for stable coins and sirius token
     * - tick box for user's acknowledgement
     * - sirius recipient's UI 
     * - after click buy, lock/disable the button
     * - get confirmed transaction, send to swap server
     */
    const {t} = useI18n();

    const buyFromComponent = ref(null);
    let stableCoins = availableTokens;
    let siriusTokens = availableToTokens;
    const selectedContractAddress = ref("");
    const selectedStableCoins = ref([]);
    const toAmount = ref(12345.54);
    const fromAmount = ref(12345.87);
    const fromInputAmount = ref(0);
    const toInputAmount = ref(0);
    const recipient = ref(walletState.currentLoggedInWallet.accounts.find(x => x.default).address);
    
    const isChainIdValid = ref(false);
    // const buyingToken = ref("METX");
    let provider;

    const disabledBuy = computed(() => {
      return !isChainIdValid.value || fromInputAmount.value < 1 || !isChecked.value
    });

    const connectedAddress = ref("");
    const selectedFromToken = ref('USDT');
    const selectedToToken = ref('XPX');
    const selectedFromTokenPrice = computed(()=>{
      return stableCoins.find(x => x.name === selectedFromToken.value).price;
    });

    const selectedToTokenPrice = computed(()=>{
      return siriusTokens.find(x => x.name === selectedToToken.value).price;
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

      if(chainId === bscMainnetChainId){
        tokenType = "(BEP20)";
      }
      else if(chainId === ethereumMainnetChainId){
        tokenType = "(ERC20)";
      }

      return tokenType;
    }

    const updateBuyFromTokenBalance = ()=>{
      buyFromComponent.value.updateSeletectedTokenBalance(selectedFromToken.value);
    }

    // connect wallet section
    const ethereumMainnetChainId = 1;
    const bscMainnetChainId = 56;
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
      if(selectedChainId.value === ethereumMainnetChainId || selectedChainId.value === bscMainnetChainId){
        isChainIdValid.value = true;
      }
      else{
        isChainIdValid.value = false;
      }
    }

    const searchAccountStableCoinsBalance = async()=>{

      let contracts = [];
      
      if(selectedChainId.value === ethereumMainnetChainId){
        contracts = ethStableCoins;
      }
      else if(selectedChainId.value === bscMainnetChainId){
        contracts = bscStableCoins;
      }
      else{
        resetStableCoinsBalanceZero();
        return;
      }

      selectedStableCoins.value = contracts;

      let promises = [];
      const web3Provider = new ethers.providers.Web3Provider(provider);
      const signer = web3Provider.getSigner();
      const address = await signer.getAddress();

      for(let i=0; i < contracts.length; ++i){
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

    const updateSelectedContractAddress = ()=>{
      if(selectedStableCoins.value.length){
        selectedContractAddress.value = selectedStableCoins.value.find(x => x.name === selectedFromToken.value).contractAddress;
      }
    }

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

    const buySiriusToken = async ()=>{

      try {
        const web3Provider = new ethers.providers.Web3Provider(provider);
        const signer = web3Provider.getSigner();
        const address = await signer.getAddress();

        const contract = new ethers.Contract(selectedContractAddress.value, abi, signer);

        const decimals = selectedStableCoins.value.find(x => x.contractAddress === selectedContractAddress.value).decimals;

        /* for future references
        let ABI = [
        "function transfer(address to, uint amount)"
        ];
        let iface = new ethers.utils.Interface(ABI);
        let dataPayload = iface.encodeFunctionData("transfer", [ address, ethers.utils.parseUnits(fromInputAmount.value.toString(), decimals) ])

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

        let receipt = await signer.sendTransaction(tx);

        console.log(receipt);
        */

        let options = {
          gasLimit: 57500,
        };
        const receipt = await contract.transfer(
          address,
          ethers.utils.parseUnits(fromInputAmount.value.toString(), decimals),
          options,
        );
        let txnHash = receipt.hash;

        console.log(receipt);
      } catch (error) {
        console.log(error);
        // let txnRejected = true; 
      }
    }

    // section end

    // watcher section
    watch([fromInputAmount, exchangeRate], (newValue)=>{
      toInputAmount.value = newValue[0] * newValue[1];
    });

    watch(selectedFromToken, (newValue)=>{
      updateSelectedContractAddress();
    });

    watch([selectedChainId, connectedAddress], (newChainId)=>{
      checkValidSelectedChainId();

      searchAccountStableCoinsBalance();
      updateSelectedContractAddress(); 
    })
    // watcher section end

    // address
    const showAddressError = shallowRef(true);
    const toggleContact = shallowRef(false);
    const siriusAddress = ref('');
    watch(siriusAddress, n => {
      if(n.length==40 || n.length==46){
        checkRecipient();
      }else{
        showAddressError.value = true;
      }
    });

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
          isMultisig: acc.getDirectParentMultisig().length ? true: false
        };
      });

      let otherAccounts =walletState.currentLoggedInWallet.others.filter((acc)=> acc.type === "MULTISIG").map((acc)=>{
        return {
          name: acc.name,
          balance: acc.balance,
          address: acc.address,
          publicKey: acc.publicKey,
          isMultisig: true
        };
      });

      return accounts.concat(otherAccounts);
    });

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
        }
      } catch (error) {
        try{
          let namespaceId = Helper.createNamespaceId(siriusAddress.value);
          checkNamespace(namespaceId).then((address)=>{
            siriusAddress.value = address.plain();
            showAddressError.value = false;
          }).catch((error)=>{
            showAddressError.value = true;
          });
        }
        catch(error){
          showAddressError.value = true;
        }
      }
    };

    const isChecked = ref(false);

    return {
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
    }
  }
}
</script>
