<template>
  <div>
    <div class='lg:w-9/12 ml-2 mr-2 lg:ml-auto lg:mr-auto mt-5'>
    <div class='mt-6 p-6 border filter shadow-lg text-center'>
      <div class="text-md">{{$t('swap.mainNetworkSwap')}}</div>
      <div class="text-xs my-3 mb-5 sm:mb-10"><img src="@/modules/services/submodule/mainnetSwap/img/bsc.svg" class="mr-2 h-5 inline-block">{{$t('swap.swapSiriusToBsc')}}</div>
      <div class="flex my-10">
        <div class="flex-none">
          <div class="flex border border-gray-300 rounded-md filter shadow-md">
            <div class="flex w-6 h-6 sm:w-10 sm:h-10" :class="`${ currentPage>=1?'bg-yellow-500':'bg-gray-300' }`"><div class="self-center inline-block text-center w-full text-txs sm:text-sm font-bold" :class="`${ currentPage>=1?'text-white':'text-gray-400' }`">1</div></div>
            <div class="px-4 sm:px-10 self-center text-xxs sm:text-xs hidden md:inline-block lg:hidden xl:inline-block">{{$t('general.transaction')}}</div>
          </div>
        </div>
        <div class="flex-grow self-center md:mx-4 h-0.5 bg-gray-100"></div>
        <div class="flex-none">
          <div class="flex border border-gray-300 rounded-md filter shadow-md">
            <div class="flex w-6 h-6 sm:w-10 sm:h-10" :class="`${ currentPage>=2?'bg-yellow-500':'bg-gray-300' }`"><div class="self-center inline-block text-center w-full text-txs sm:text-sm font-bold" :class="`${ currentPage>=2?'text-white':'text-gray-400' }`">2</div></div>
            <div class="px-4 sm:px-10 self-center text-xxs sm:text-xs hidden md:inline-block lg:hidden xl:inline-block">{{$t('general.certificate')}}</div>
          </div>
        </div>
      </div>
      <div v-if="currentPage==1">
        <div class="text-sm my-5 font-bold">Select Asset</div>
        <select class="" v-model="selectedToken">
          <option v-for="(element, item) in  tokenList" :value="element" :key="item">
            {{element.name.toUpperCase()}}
          </option>
        </select>
        <div class="text-sm my-5 font-bold">{{$t('general.transactionDetails')}}</div>
        <div class="error error_box mb-5" v-if="err!=''">{{ err }}</div>
        <div class="error error_box mb-5" v-if="xpxFeeErr">{{$t('swap.failCoverTxFee')}}</div>
        <SelectInputAccountOutgoingSwap :otherToken='selectedToken.namespace' :otherTokenId='selectedToken.assetId' :name='selectedToken.name' v-model="siriusAddress" :placeholder="$t('swap.fromSiriusAcc')" :selectDefault="walletState.currentLoggedInWallet.selectDefaultAccount().address" :divisibility="tokenDivisibility"/>
        <div class="relative">
          <div class="opacity-90 w-full h-full absolute z-10 bg-white" v-if="!siriusAddress"></div>
          <SwapInputClean class="mt-5" :disabled="disableAmount" :remarkOption="selectedToken.name=='xpx'" v-model="amount" :balance="selectedAccountBalance" :placeholder="`${selectedToken.name}` +' '+ $t('general.amount')" type="text" :showError="showAmountErr" :errorMessage="$t('general.insufficientBalance')" :emptyErrorMessage="$t('swap.amountEmpty')" :maxAmount="maxSwapAmount" :gasFee="gasPriceInXPX" :transactionFee="txFeeDisplay" @clickedMaxAvailable="updateAmountToMax()"  :toolTip="$t('swap.bscAmountMsg')" :decimal="tokenDivisibility"/>
          <MetamaskAddressInput :placeholder="$t('swap.bscAddress')" :errorMessage="$t('swap.bscAddressErr')" class="mt-5" :showError="showAddressErr" v-model="bscAddress" />
          <div class="tex-center font-bold text-sm my-5">{{$t('general.transactionFee')}} ({{$t('swap.bsc')}} BEP20 {{$t('general.network')}}):</div>
          <div class="md:grid md:grid-cols-3 mb-4">
            <div class="md:col-span-1 mb-3">
              <div class="bscGasStrategy md:mr-6" :class="`${ (bscGasStrategy == 'standard')?'selected':'option' }`" @click="changeGasStrategy('standard')">
                <p class="font-bold text-tsm">{{$t('swap.standard')}}</p>
                <div>BNB {{ standardGasPrice }}</div>
                <div>XPX {{ xpxAmountInStandardGasPrice }} = {{$t('general.usd')}} {{ standardGasPriceInUSD }}</div>
              </div>
            </div>
            <div class="md:col-span-1 mb-3">
              <div class="bscGasStrategy md:mx-3" :class="`${ (bscGasStrategy == 'fast')?'selected':'option' }`" @click="changeGasStrategy('fast')">
                <p class="font-bold text-tsm">{{$t('swap.fast')}}</p>
                <div>BNB {{ fastGasPrice }}</div>
                <div>XPX {{ xpxAmountInFastGasPrice }} = {{$t('general.usd')}} {{ fastGasPriceInUSD }}</div>
              </div>
            </div>
            <div class="md:col-span-1 mb-3">
              <div class="bscGasStrategy md:ml-6" :class="`${ (bscGasStrategy == 'rapid')?'selected':'option' }`" @click="changeGasStrategy('rapid')">
                <p class="font-bold text-tsm">{{$t('swap.rapid')}}</p>
                <div>BNB {{ rapidGasPrice }}</div>
                <div>XPX {{ xpxAmountInRapidGasPrice }} = {{$t('general.usd')}} {{ rapidGasPriceInUSD }}</div>
              </div>
            </div>
          </div>
          <div class="text-sm text-center mb-2 sm:mb-4">{{$t('swap.feesValidDuration')}}: {{ timerMinutes }}:{{ timerSecondsDisplay >= 10 ? timerSecondsDisplay : "0" + timerSecondsDisplay }}</div>
          <div class="tex-center font-bold text-sm mb-2">{{$t('general.transactionFee')}} ({{$t('swap.siriusNetwork')}}):</div>
          <div class="rounded-2xl bg-gray-100 p-5 mb-5">
            <div class="inline-block mr-4 text-xs"><img src="@/assets/img/icon-prx-xpx-blue.svg" class="w-5 inline mr-1 text-gray-500">{{$t('general.transactionFee')}}: <span>{{ txFeeDisplay }}</span> {{ currentNativeTokenName}}</div>
          </div>
          <div class="mb-5">Total Transaction Fee: {{minBalanceAmount}} {{currentNativeTokenName}}</div>
          <PasswordInputClean :placeholder="$t('general.enterPassword')" :errorMessage="$t('general.passwordRequired')" :showError="showPasswdError" icon="lock" v-model="walletPasswd" />
          <div class="bg-blue-50 border border-blue-primary h-20 mt-5 rounded flex items-center justify-center uppercase">
            {{ amount }} {{selectedToken.name}} 
            <img src="@/modules/account/img/metx-logo.svg" v-if="selectedToken.name=='metx'" class="w-5 h-5 ml-4"> 
            <img v-if="selectedToken.name=='xpx'" src="@/modules/account/img/proximax-logo.svg" class='w-5 h-5 ml-4'>
          </div>
          <div class="flex justify-center mt-3">
            <div class="text-xs text-gray-600 mt-2 max-w-screen-md">{{$t('swap.bscOutgoingMsg')}}</div>
          </div>
          <div class="mt-10 text-center">
            <button @click="$router.push({name: 'ViewServicesMainnetSwap'})" class="text-black font-bold text-xs mr-1 sm:mr-5 mt-2 focus:outline-none disabled:opacity-50" :disabled="isDisabledCancel">{{$t('general.later')}}</button>
            <button type="button" class="default-btn focus:outline-none disabled:opacity-50 mt-2" :disabled="isDisabledSwap" @click="swap">{{ swapInProgress?$t('swap.swapInProgress'):$t('swap.confirmSwap') }}</button>
            <button class="default-btn focus:outline-none disabled:opacity-50 mt-2" v-if="canCheckStatus" @click="callTocheckSwapStatus">{{$t('swap.checkSwapStatus')}}</button>
          </div>
        </div>
      </div>
      <div v-if="currentPage==2">
        <div>
          <h1 class="default-title font-bold mt-5 mb-2">{{$t('general.congratz')}}</h1>
          <div class="text-sm mb-7">{{$t('swap.swapStarted')}}</div>
          <SwapCertificateComponent :networkTerm="$t('swap.bsc')" swapType="Out" :swapId="swapId" :swapTimestamp="swapTimestamp" :transactionHash="certTransactionHash" :swapQr="swapQr" :swapLink="swapLink" :siriusName="selectedAccountName" :swappedAmount="amount" :siriusAddress="Helper.createAddress(selectedAccountAddress).pretty()" :siriusTransactionHash="siriusTransactionHash" :xpxExplorer="xpxExplorerUrl" />
          
          <button type="button" class="w-40 hover:shadow-lg bg-blue-primary text-white text-xs hover:opacity-50 rounded font-bold px-4 py-3 border border-blue-primary outline-none mr-4 mt-6" @click="saveCertificate">{{$t('general.downloadCertificate')}}</button>
          <div class="mt-5">
            <a :href="swapLink" target=_new class="underline self-center text-xs font-bold text-blue-primary">{{$t('swap.viewTxInBsc')}}<font-awesome-icon icon="external-link-alt" class="ml-2 text-blue-500 w-3 h-3 self-center inline-block"></font-awesome-icon></a><br>
            <a :href="xpxExplorerUrl" target=_new class="underline self-center text-xs font-bold text-blue-primary">{{$t('swap.viewTxInExplorer')}}<font-awesome-icon icon="external-link-alt" class="ml-2 text-blue-500 w-3 h-3 self-center inline-block"></font-awesome-icon></a>
          </div>
          <div class="md:mx-20 lg:mx-40 font-bold text-center text-tsm py-5 sm:py-10 mt-5 sm:mt-10 border-t border-gray-200">{{$t('swap.swapDetails')}}</div>
          <div class="md:mx-20 lg:mx-10 xl:mx-40 border-2 border-gray-200 mt-4 p-5 text-xs font-bold filter shadow-lg">
            <div class="text-blue-primary mb-1">{{$t('general.from')}}: {{ selectedAccountName }}</div>
            <div class="break-all">{{ Helper.createAddress(selectedAccountAddress).pretty() }}</div>
            <div class="mt-1 ">{{$t('swap.swapAmount')}} {{ amount }} {{selectedToken.name.toUpperCase()}} 
              <img src="@/modules/account/img/metx-logo.svg" v-if="selectedToken.name=='metx'" class="w-3 h-3 ml-2 inline relative" style="top: -2px"> 
              <img v-if="selectedToken.name=='xpx'" src="@/modules/dashboard/img/icon-xpx.svg" class="w-3 h-3 ml-2 inline relative" style="top: -2px"></div>
            <div>
              <img src="@/modules/services/submodule/mainnetSwap/img/icon-dots.svg" class="inline-block h-8 my-2">
            </div>
            <div class="text-blue-primary mb-1">{{$t('general.to')}}: {{$t('swap.metamaskAcc')}}</div>
            <div>{{ bscAddress }}</div>
            <div class="mt-1 ">{{$t('swap.equivalentTo')}} {{ amount }} BEP20 {{selectedToken.name.toUpperCase()}}</div>
          </div>
          <div class="my-5 sm:my-7 text-gray-500 text-xs md:mx-20 lg:mx-10 xl:mx-40">{{$t('swap.swapMsg3')}}</div>
          <label class="inline-flex items-center mb-5">
            <input type="checkbox" class="h-5 w-5 bg-blue-primary" value="true" v-model="savedCheck">
            <span class="ml-2 cursor-pointer text-xs font-bold">{{$t('swap.confirmDownloaded')}}</span>
          </label>
          <div class="sm:mt-5 text-center">
            <router-link :to="{ name: 'ViewServicesMainnetSwap' }" class="default-btn mr-5 focus:outline-none w-40 inline-block mt-1" :class="!savedCheck?'opacity-50':''" :is="!savedCheck?'span':'router-link'" tag="button">{{$t('general.done')}}</router-link>
          </div>
        </div>
      </div>
    </div>
    </div>
  </div>
</template>
<script>
import { computed, ref, watch } from "vue";
import { useRouter } from "vue-router";
import PasswordInputClean from '@/components/PasswordInputClean.vue';
import MetamaskAddressInput from '@/modules/services/submodule/mainnetSwap/components/MetamaskAddressInput.vue';
import SwapInputClean from '@/modules/services/submodule/mainnetSwap/components/SwapInputClean.vue';
import SwapCertificateComponent from '@/modules/services/submodule/mainnetSwap/components/SwapCertificateComponent.vue';
import SelectInputAccountOutgoingSwap from '@/modules/services/submodule/mainnetSwap/components/SelectInputAccountOutgoingSwap.vue';
import { walletState } from '@/state/walletState';
import { networkState } from '@/state/networkState';
import { WalletUtils } from "@/util/walletUtils";
import { Helper } from "@/util/typeHelper";
import { getCurrentPriceUSD } from "@/util/functions";
import { ChainSwapConfig } from "@/models/stores/chainSwapConfig";
import { useToast } from "primevue/usetoast";
import { ethers } from 'ethers';
import { SwapUtils } from '@/util/swapUtils';
import { MosaicId, NetworkType } from "tsjs-xpx-chain-sdk";
import { AppState } from '@/state/appState';
import { useI18n } from 'vue-i18n';


export default {
  name: 'ViewServicesMainnetSwapMetxToBSC',

  components: {
    PasswordInputClean,
    SwapInputClean,
    MetamaskAddressInput,
    SwapCertificateComponent,
    SelectInputAccountOutgoingSwap,
  },

  setup() { 
    const {t} = useI18n();
    const currentNativeTokenName = computed(()=> AppState.nativeToken.label);
    const toast = useToast();
    const router = useRouter();
    const displayTimer = ref(true);
    const timerSeconds = ref(180);
    const timerSecondsDisplay = computed(()=> timerSeconds.value % 60);
    const timerMinutes = computed(()=> Math.floor(timerSeconds.value / 60));
    const timerInterval = setInterval(()=>{
      --timerSeconds.value;
    }, 1000);
    const selectedToken = ref('')
    const timerStop = watch(()=> timerSeconds.value, (newValue)=>{

      if(newValue <= 0){
        disableTimer();
        redirectToSelection();
      }
    });


    const disableTimer = () =>{
      timerStop();
      displayTimer.value = false;
      clearInterval(timerInterval);
    }

    const redirectToSelection = ()=>{
      router.push({ name: "ViewServicesMainnetSwap"});
    };

    const currentPage = ref(1);
    // page 1
    const includeMultisig = ref(false);

    const selectedAccountName = ref("");
    const selectedAccountAddress = ref("");
    const selectedAccountPublicKey = ref("");
    const selectedAccountBalance = ref(0);
    const selectAccount = (name, address) => {
      currentPage.value = 2;
      selectedAccountName.value = name;
      selectedAccountAddress.value = address;

        if(bscGasStrategy.value === ""){
          changeGasStrategy("standard");
        }
        else{
          changeGasStrategy(bscGasStrategy.value);
        }
    };
    const allAvailableAccounts = computed(()=>{

      if(!walletState.currentLoggedInWallet){
        return [];
      }

      let accounts = walletState.currentLoggedInWallet.accounts.map(
        (acc)=>{ 
          return { 
            name: acc.name,
            balance: acc.balance,
            balanceDisplay: Helper.toCurrencyFormat(acc.balance, AppState.nativeToken.divisibility),
            type: "",
            address: Helper.createAddress(acc.address).pretty(),
            publicKey: acc.publicKey,
            isMultisig: acc.getDirectParentMultisig().length ? true: false
          };
        });

      if(includeMultisig.value){
        let otherAccounts = walletState.currentLoggedInWallet.others.filter((acc)=> acc.type === "MULTISIG").map(
        (acc)=>{ 
          return { 
            name: acc.name,
            balance: acc.balance,
            balanceDisplay: Helper.toCurrencyFormat(acc.balance, AppState.nativeToken.divisibility),
            type: "MULTISIG",
            address: Helper.createAddress(acc.address).pretty(),
            publicKey: acc.publicKey,
            isMultisig: true
          }; 
        });

        return accounts.concat(otherAccounts);
      }
      else{
        return accounts;
      }
    });

    const selectedAccount = computed(()=> {
      return allAvailableAccounts.value.find(acc=> acc.name === selectedAccountName.value);
    });

    const siriusAddress = ref('');
    
   

    watch(siriusAddress, (address) => {
      if(address){
        let account = walletState.currentLoggedInWallet.accounts.find(account => account.address == address);
        if(!account){
          account = walletState.currentLoggedInWallet.others.find(account => account.address == address);
        }
        selectedAccountName.value = account.name;
        selectedAccountAddress.value = account.address;
        
        if(selectedToken.value.name!="xpx"){
          selectedAccountBalance.value = account.assets.find(asset=>asset.idHex==selectedToken.value.assetId)? account.assets.find(asset=>asset.idHex==selectedToken.value.assetId).amount/Math.pow(10,tokenDivisibility.value) : 0
          maxSwapAmount.value = Helper.convertNumberMinimumFormat(selectedAccountBalance.value , tokenDivisibility.value);
        }else{//if xpx
          selectedAccountBalance.value = account.balance
          maxSwapAmount.value = Helper.convertNumberMinimumFormat(account.balance - txFee.value - gasPriceInXPX.value, tokenDivisibility.value);
        }
        
        selectedAccountPublicKey.value = account.publicKey;
        
      }else{
        selectedAccountName.value = '';
        selectedAccountAddress.value = '';
        selectedAccountBalance.value = '';
        selectedAccountPublicKey.value = '';
      }
    });
    watch(selectedToken, (token) => {
      if(token!=''&&siriusAddress.value!=''){
        let account = walletState.currentLoggedInWallet.accounts.find(account => account.address == siriusAddress.value);
        if(!account){
          account = walletState.currentLoggedInWallet.others.find(account => account.address == siriusAddress.value);
        }
        if(token.name!="xpx"){
        selectedAccountBalance.value = account.assets.find(asset=>asset.idHex==selectedToken.value.assetId)? account.assets.find(asset=>asset.idHex==selectedToken.value.assetId).amount/Math.pow(10,tokenDivisibility.value) : 0
        maxSwapAmount.value = Helper.convertNumberMinimumFormat(selectedAccountBalance.value , tokenDivisibility.value);
        }else{
          selectedAccountBalance.value = account.balance
          
          maxSwapAmount.value = Helper.convertNumberMinimumFormat(account.balance - txFee.value - gasPriceInXPX.value, tokenDivisibility.value);
        }
      }
    });

    // page 2
    const giga = 1000000000;
    const feeMultiply = 1.2;

    const showAddressErr = ref(false);
    const isDisabledCancel = ref(false);
    const swapInProgress = ref(false);
    const showPasswdError = ref(false);
    const walletPasswd = ref('');
    const passwdPattern = "^[^ ]{8,}$";
    const showAmountErr = ref(false);
    const disableAmount = ref(false);
    const err = ref('');
    const bscAddress = ref('');
    const isDisabledSwap = computed(() => 
      !(amount.value > 0 && walletPasswd.value.match(passwdPattern) && bscAddress.value != '' && !swapInProgress.value )
    );
    const amount = ref(0);

    const xpxNamespace = AppState.nativeToken.fullNamespace; 
    const XpxAsset = Helper.createAsset(Helper.createNamespaceId(xpxNamespace).toHex(), 1);
    const metxAsset = Helper.createAsset(Helper.createNamespaceId('prx.metx').toHex(), 1);
    const buildClass = AppState.buildTxn
    const transferBuilder = buildClass.transferBuilder();
    const aggregateBuilder = buildClass.aggregateCompleteBuilder();

    let message1 = {
      type: "Swap-xpx-bsc",
      remoteAddress: "0".repeat(42) 
    };

    const updateRemoteAddress = ()=>{
      message1.remoteAddress = bscAddress.value;

      rebuildTranction();
    }

    let message2 = {
      type: 'Swap-xpx-bsc-fees',
      gasPrice: 5,
      gasLimit: 57500
    };

    let swapData = new ChainSwapConfig(networkState.chainNetworkName);
    swapData.init();

    let swapServerUrl = swapData.swap_XPX_BSC_URL;
    
    let bscScanUrl = swapData.BSCScanUrl;
    let xpxExplorerUrl = networkState.currentNetworkProfile.chainExplorer.url + '/' + networkState.currentNetworkProfile.chainExplorer.hashRoute + '/';
    let sinkFundAddress;
    let sinkFeeAddress;
    let tokenList = ref([])
    
    const tokenDivisibility = ref(0)

    const getBscSwapTokenList = async()=>{
      
      let tokens = await SwapUtils.getSwapTokenList(swapServerUrl)
      if(tokens){
        
        tokenList.value = tokens.map(token=>{
          return {
            name:token.name,
            assetId: token.assetId,
            contractAddress: token.contractAddress,
            namespace: token.namespace,
          }
        })
        selectedToken.value = tokenList.value[0]
        AppState.chainAPI.assetAPI.getMosaic(new MosaicId(selectedToken.value.assetId)).then(mosaic=>{
          tokenDivisibility.value =  mosaic.properties.divisibility
        })
      }
    }
    
    const updateSinkAddress = async()=>{
      try{
        const swapServiceInfoURL = SwapUtils.getServiceInfoURL(swapServerUrl);
        
        const serviceInfo = await SwapUtils.getOutgoingSwapServiceInfo(swapServiceInfoURL);
        sinkFundAddress = serviceInfo.siriusInfo.sinkingFundAddress;
        sinkFeeAddress = serviceInfo.siriusInfo.sinkingFeeAddress;
        buildTransaction();
      }
      catch(error){
        addErrorToast(t('swap.serviceUnavailable'),t('swap.failGetSink'));
        redirectToSelection();
      }
    }

    updateSinkAddress();
    getBscSwapTokenList()
    let aggreateCompleteTransaction;
    let transferTx;
    let feetransferTx;

    const buildTransaction = ()=>{
      transferTx = transferBuilder.mosaics([metxAsset])
                        .recipient(Helper.createAddress(sinkFundAddress))
                        .message(Helper.createPlainMessage(JSON.stringify(message1)))
                        .build();
      feetransferTx = transferBuilder.mosaics([XpxAsset])
                        .recipient(Helper.createAddress(sinkFeeAddress))
                        .message(Helper.createPlainMessage(JSON.stringify(message2)))
                        .build();
      aggreateCompleteTransaction = aggregateBuilder
                        .innerTransactions(Helper.createInnerTransaction([transferTx, feetransferTx], "0".repeat(64)))
                        .build();

      txFee.value = Helper.convertToExact(aggreateCompleteTransaction.maxFee.compact(), AppState.nativeToken.divisibility);
      minBalanceAmount.value = txFee.value
    }

    let txFee = ref(0);
    const txFeeDisplay = computed(()=>{
        return Helper.toCurrencyFormat(txFee.value, AppState.nativeToken.divisibility);
    });

    const rebuildTranction = ()=>{
      let swapAmount;
      if(amount.value < 0){
        swapAmount = 0;
      }
      else{
        swapAmount = amount.value;
      }
     
      const swapAmountXPX = Helper.createAsset(Helper.createNamespaceId(selectedToken.value.namespace).toHex(), Helper.convertToAbsolute(swapAmount, tokenDivisibility.value));
      const feeXpx = Helper.createAsset(Helper.createNamespaceId(xpxNamespace).toHex(), Helper.convertToAbsolute(gasPriceInXPX.value, AppState.nativeToken.divisibility));
      transferTx = transferBuilder.mosaics([swapAmountXPX])
                        .recipient(Helper.createAddress(sinkFundAddress))
                        .message(Helper.createPlainMessage(JSON.stringify(message1)))
                        .build();
      feetransferTx = transferBuilder.mosaics([feeXpx])
                        .recipient(Helper.createAddress(sinkFeeAddress))
                        .message(Helper.createPlainMessage(JSON.stringify(message2)))
                        .build();
      aggreateCompleteTransaction = aggregateBuilder
                        .innerTransactions(Helper.createInnerTransaction([transferTx, feetransferTx], selectedAccountPublicKey.value))
                        .build();

      txFee.value = Helper.convertToExact(aggreateCompleteTransaction.maxFee.compact(),  AppState.nativeToken.divisibility);
    }

    const standardGasPrice = computed(()=>{
       return standardGasPriceInGwei.value * standardGasLimit.value / giga;
    });

    const fastGasPrice = computed(()=>{
       return fastGasPriceInGwei.value * fastGasLimit.value / giga;
    });

    const rapidGasPrice = computed(()=>{
       return rapidGasPriceInGwei.value * rapidGasLimit.value / giga;
    });

    const standardGasPriceInUSD = computed(()=>{
       return Helper.convertNumberMinimumFormat(standardGasPrice.value * currentBSC_USD.value, 2);
    });

    const fastGasPriceInUSD = computed(()=>{
       return Helper.convertNumberMinimumFormat(fastGasPrice.value * currentBSC_USD.value, 2);
    });

    const rapidGasPriceInUSD = computed(()=>{
       return Helper.convertNumberMinimumFormat(rapidGasPrice.value * currentBSC_USD.value, 2);
    });

    const xpxAmountInStandardGasPrice = computed(()=>{
      return Helper.convertNumberMinimumFormat((standardGasPriceInUSD.value/ currentXPX_USD.value) * feeMultiply, AppState.nativeToken.divisibility);
    });

    const xpxAmountInFastGasPrice = computed(()=>{
      return Helper.convertNumberMinimumFormat((fastGasPriceInUSD.value/ currentXPX_USD.value) * feeMultiply, AppState.nativeToken.divisibility);
    });

    const xpxAmountInRapidGasPrice = computed(()=>{
      return Helper.convertNumberMinimumFormat((rapidGasPriceInUSD.value/ currentXPX_USD.value) * feeMultiply, AppState.nativeToken.divisibility);
    });

    const standardGasPriceInGwei = ref(0);
    const fastGasPriceInGwei = ref(0);
    const rapidGasPriceInGwei = ref(0);

    const standardGasLimit = ref(55000);
    const fastGasLimit = ref(55000);
    const rapidGasLimit = ref(55000);

    const updateGasPrice = async ()=>{

      if(AppState.networkType === NetworkType.TEST_NET){
        standardGasPriceInGwei.value = 10;
        fastGasPriceInGwei.value = 10;
        rapidGasPriceInGwei.value = 10;
      }else{
        let data = await SwapUtils.getBSC_SafeGwei(swapData.gasPriceConsultURL);

        if(data.status === 0){
          console.log("Error, no data found. Please try again later");
        }
        else{
          let result = data.result;

          standardGasPriceInGwei.value = result.ProposeGasPrice;
          fastGasPriceInGwei.value = result.FastGasPrice;
          rapidGasPriceInGwei.value = Math.ceil(fastGasPriceInGwei.value * 1.1);
        }
      }
    }
    updateGasPrice();

    const updateGasLimit = async ()=>{

      let data = await SwapUtils.getBSC_GasLimit(swapData.gasPriceConsultURL);

      if(data.status === 0){
        console.log("Error, no gas limit data found. Please try again later");
      }
      else{
        standardGasLimit.value = data.standardGasLimit;
        fastGasLimit.value = data.fastGasLimit;
        rapidGasLimit.value = data.rapidGasLimit;
      }
    }

    updateGasLimit();

    const currentXPX_USD = ref(0);
    const currentBSC_USD = ref(0);

    const getCurrentPrice = async ()=>{

      let prices = await getCurrentPriceUSD(SwapUtils.checkSwapPrice(swapData.priceConsultURL));

      currentXPX_USD.value = prices.xpx;
      currentBSC_USD.value = prices.bnb;
    };

    getCurrentPrice();

    const updateAmountToMax = () => {
      amount.value = maxSwapAmount.value;
    };

    watch(selectedToken,n=>{
      if(amount.value>maxSwapAmount.value){
        updateAmountToMax()
      }
      AppState.chainAPI.assetAPI.getMosaic(new MosaicId(n.assetId)).then(mosaic=>{
        tokenDivisibility.value =  mosaic.properties.divisibility
      
      })
    })

    

    const savedCheck = ref(false);

    const bscGasStrategy = ref('');

    let selectedGasLimit = ref(0);

    let selectedGasPriceInGwei = ref(0);

    let gasPriceInXPX = ref(0);

    const maxSwapAmount = ref(0);
    const minBalanceAmount = ref(0);
   
    const xpxFeeErr = computed(()=>{
      if(selectedAccount.value){
        if(selectedAccount.value.balance<minBalanceAmount.value){
          return true
        }else{
          return false
        }
      }else{
        return false
      }
      
    })
    const changeGasStrategy = (feeStrategy)=>{
      bscGasStrategy.value = feeStrategy;

      if(feeStrategy === "rapid"){
        selectedGasLimit.value = rapidGasLimit.value;
        selectedGasPriceInGwei.value = rapidGasPriceInGwei.value;
        gasPriceInXPX.value = xpxAmountInRapidGasPrice.value;
      }
      else if(feeStrategy === "fast"){
        selectedGasLimit.value = fastGasLimit.value;
        selectedGasPriceInGwei.value = fastGasPriceInGwei.value;
        gasPriceInXPX.value = xpxAmountInFastGasPrice.value;
      }
      else{
        selectedGasLimit.value = standardGasLimit.value;
        selectedGasPriceInGwei.value = standardGasPriceInGwei.value;
        gasPriceInXPX.value = xpxAmountInStandardGasPrice.value;
      }

      message2.gasPrice = selectedGasPriceInGwei.value;
      message2.gasLimit = selectedGasLimit.value;

      minBalanceAmount.value = Helper.convertNumberMinimumFormat(txFee.value + gasPriceInXPX.value, AppState.nativeToken.divisibility);
     

      if(selectedAccount.value.balance <= minBalanceAmount.value){
        amount.value = 0;
      }

      if(selectedAccount.value.balance <= minBalanceAmount.value){
        disableAmount.value = true;
        /* showAmountErr.value = true; */
      }else{
        disableAmount.value = false;
        showAmountErr.value = false;
      }

      rebuildTranction();
    }
     watch(gasPriceInXPX,price=>{
       let account = walletState.currentLoggedInWallet.accounts.find(account => account.address == siriusAddress.value);
        if(!account){
          account = walletState.currentLoggedInWallet.others.find(account => account.address == siriusAddress.value);
        }
      if(selectedToken.value.name!="xpx"){
        maxSwapAmount.value = Helper.convertNumberMinimumFormat(selectedAccountBalance.value , tokenDivisibility.value);
        if(amount.value>maxSwapAmount.value){
          updateAmountToMax()
        }
      }else{
        maxSwapAmount.value = Helper.convertNumberMinimumFormat(account.balance - txFee.value - price, AppState.nativeToken.divisibility);
        if(amount.value>maxSwapAmount.value){
          updateAmountToMax()
        }
      }
    })
    // watch to fix latency in updating gas price & xpx
    watch(standardGasLimit, () => {
      if(currentPage.value==2){
        if(selectedAccount.value.balance <= minBalanceAmount.value){
          disableAmount.value = true;
          showAmountErr.value = true;
        }
        else{
          disableAmount.value = false;
          showAmountErr.value = false;
        }
      }
    });

    const siriusTransactionHash = ref('');

    const swap = () => {
      swapInProgress.value = true;
      isDisabledCancel.value = true;
      try{
        let validateAddress = ethers.utils.getAddress(bscAddress.value);
        if(validateAddress){
          showAddressErr.value = false;
        }
      }catch(err){
        showAddressErr.value = true;
        swapInProgress.value = false;
        isDisabledCancel.value = false;
      }

      if(!showAddressErr.value){
        if (WalletUtils.verifyWalletPassword(walletState.currentLoggedInWallet.name, networkState.chainNetworkName, walletPasswd.value)) {
          err.value = "";
          updateRemoteAddress();
          changeGasStrategy(bscGasStrategy.value);
          if((amount.value + gasPriceInXPX.value + txFee.value) > selectedAccount.value.balance){
            addErrorToast(t('swap.insufficientAmount'), t('swap.swapInsufficientAmount'), 5000);
            return;
          }
          disableTimer();
          let signedTransaction = SwapUtils.signTransaction(selectedAccountAddress.value, walletPasswd.value, aggreateCompleteTransaction);
          siriusTransactionHash.value = signedTransaction.hash;
          checkTokenBalance().then(balance=>{
            if(amount.value<balance){
              callSwapServer(signedTransaction.payload);
            }else{
              addErrorToast('Swap Server Error', 'Insufficient Balance from Swap Server', 5000);
            }
          })
          
        } else {
          err.value = t('general.walletPasswordInvalid',{name: walletState.currentLoggedInWallet.name});
          swapInProgress.value = false;
          isDisabledCancel.value = false;
        }
      }
    };
    const checkTokenBalance = async() =>{
      const response = await SwapUtils.checkTokenBalance(swapServerUrl,selectedToken.value.name)
      if (response.status){
        return response.tokenBalance
      }else{
        return 0
      }
    }
    // call swap server function
    const callSwapServer = async(payload) =>{
      const data = {
        txnInfo: {
          network: "bsc",
          siriusTxnPayload: payload
        }
      };
      let stringifyData = JSON.stringify(data);

      try {
        const response = await fetch(SwapUtils.getOutgoing_SwapTransfer_URL(swapServerUrl,selectedToken.value.name), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: stringifyData, // body data type must match "Content-Type" header
        });
        if(response.ok){
          const res = await response.json();
          certTransactionHash.value = res.data.txHash;
          swapLink.value = bscScanUrl + res.data.txHash;
          swapTimestamp.value = '';
          swapId.value = res.data.swapId;
          swapQr.value = SwapUtils.generateQRCode(bscScanUrl + res.data.txHash);
          currentPage.value = 2;
        }
        else if(response.status==400){
          const res = await response.json();
          addErrorToast(t('swap.swapOperationFail'), res.data.message);
          swapInProgress.value = false;
          isDisabledCancel.value = false;
        }
        else if(response.status==409){
          canCheckStatus.value = true;
          //swapInProgress.value = false;
          isDisabledCancel.value = false;
        }
        else if(response.status==503){
          const res = await response.json();
          let errorMessage = res.data.message ? res.data.message : "";
          toast.add({
            severity:'warn',
            summary: t('swap.serviceUnavailable'),
            detail: errorMessage ? errorMessage : t('swap.tryAgain'),
            group: 'br'
          });
          swapInProgress.value = false;
          isDisabledCancel.value = false;
        }
        else if(response.status==504){
          addErrorToast(t('swap.timedOut'), t('swap.checkStatusAgain'));
          //swapInProgress.value = false;
          isDisabledCancel.value = false;
          canCheckStatus.value = true;
        }
      } catch (error) {
        addErrorToast(t('swap.networkErr'), t('swap.serverNotFound'));
        swapInProgress.value = false;
        isDisabledCancel.value = false;
      }
    }

    const callTocheckSwapStatus =  async() =>{
      const response = await fetch(SwapUtils.getOutgoing_SwapCheckByTxID_URL(swapServerUrl, siriusTransactionHash.value));

      if(response.status==200){
        const res = await response.json();
        certTransactionHash.value = res.fulfillTransaction;
        swapTimestamp.value = '';
        swapId.value = res.data._id;
        swapQr.value = SwapUtils.generateQRCode(bscScanUrl + res.fulfillTransaction);
        currentPage.value = 2;
      }
      else{
        addErrorToast(t('swap.swapNotFound'), t('swap.txIdNotFound'));
      }
    }

    const addErrorToast = (summary, detail, life=undefined)=>{
      toast.add({
          severity:'error',
          summary: summary,
          detail: detail,
          group: 'br',
          life: life
      });
    }

    // cert component
    const swapLink = ref('');
    const swapTimestamp = ref('');
    const swapId = ref('');
    const certTransactionHash = ref('');
    const swapQr = ref('');

    const canCheckStatus = ref(false);

    //page 3
    const saveCertificate = () => {
      SwapUtils.generateoutgoingPdfCert('BSC', swapTimestamp.value, selectedAccountAddress.value, swapId.value, certTransactionHash.value, swapQr.value, siriusTransactionHash.value);
    };

    return {
      selectedAccountBalance,
      minBalanceAmount,
      includeMultisig,
      timerSecondsDisplay,
      timerMinutes,
      currentPage,
      // selectAccount,
      bscAddress,
      showAddressErr,
      showPasswdError,
      walletPasswd,
      passwdPattern,
      showAmountErr,
      amount,
      disableAmount,
      updateAmountToMax,
      bscGasStrategy,
      isDisabledSwap,
      err,
      swap,
      savedCheck,
      allAvailableAccounts,
      selectedAccount,
      selectedAccountName,
      selectedGasPriceInGwei,
      selectedGasLimit,
      standardGasPrice,
      fastGasPrice,
      rapidGasPrice,
      standardGasPriceInUSD,
      fastGasPriceInUSD,
      rapidGasPriceInUSD,
      xpxAmountInStandardGasPrice,
      xpxAmountInFastGasPrice,
      xpxAmountInRapidGasPrice,
      txFeeDisplay,
      gasPriceInXPX,
      maxSwapAmount,
      changeGasStrategy,
      swapInProgress,
      certTransactionHash,
      swapLink,
      swapTimestamp,
      swapId,
      swapQr,
      saveCertificate,
      selectedAccountAddress,
      isDisabledCancel,
      canCheckStatus,
      callTocheckSwapStatus,
      siriusTransactionHash,
      xpxExplorerUrl,
      currentNativeTokenName,
      siriusAddress,
      walletState,
      Helper,
      xpxFeeErr,
      tokenDivisibility,
      tokenList,
      selectedToken,
    };
  }
}
</script>
<style lang="scss" scoped>
.select-text{
  top: 5px;
}

.bscGasStrategy{
  @apply rounded p-3 text-xs border cursor-pointer;
}

.bscGasStrategy.selected{
  @apply text-gray-100 bg-blue-primary border-blue-primary;
  p{
    @apply text-white;
  }
}

.bscGasStrategy.option{
  transition: all 0.5s;
  @apply text-gray-600 bg-white border-gray-200 hover:bg-blue-100 hover:border-blue-100;
  p{
    @apply text-blue-primary;
  }
}
</style>