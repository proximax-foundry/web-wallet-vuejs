<template>
  <div>
    <div class='lg:w-9/12 ml-2 mr-2 lg:ml-auto lg:mr-auto mt-5'>
    <div class='mt-6 p-6 border filter shadow-lg text-center'>
      <div class="text-md">Main Network Swap</div>
      <div class="text-xs my-3 mb-5 sm:mb-10">Swap from ETH to Proximax Sirius Chain</div>
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
      <!-- <div v-if="currentPage==1">
        <p class="text-tsm my-5 text-gray-400">This is a list of your Sirius accounts available in this wallet.</p>
        <div class="text-lg my-7 font-bold">Please select a Sirius account</div>
        <div v-for="acc of allAvailableAccounts" :key="acc.name">
          <div class="mb-2 flex justify-between rounded-2xl p-3 text-left transition" :class="`${(!acc.isMultisig|| includeMultisig)?'cursor-pointer hover:bg-blue-100 bg-gray-100':'bg-gray-50'}`" @click="(!acc.isMultisig || includeMultisig) && selectAccount(acc.name, acc.address)">
            <div class="text-xs sm:text-tsm ml-3" :class="`${(!acc.isMultisig || includeMultisig)?'text-gray-700':'text-gray-200'}`">
              <div class="mb-1 sm:mb-0"><b>Account Name:</b> {{ acc.name }} <div v-if="acc.isMultisig" class="inline-block badge rounded bg-blue-200 p-1 text-white text-txs ml-2">Multisig</div></div>
              <div class="mb-1 sm:mb-0"><b>Sirius Address:</b> <div class="block mt-1 sm:inline-block sm:mt-0">{{ acc.address }}</div></div>
              <div class="mb-1 sm:mb-0"><b>Sirius Balance:</b> <div class="block mt-1 sm:inline-block sm:mt-0"><img src="@/assets/img/icon-prx-xpx-blue.svg" class="w-5 inline sm:ml-1"> {{ acc.balanceDisplay }} {{ currentNativeTokenName }}</div></div>
            </div>
            <div class="self-center">
              <img src="@/modules/services/img/icon-account-green-16h-proximax-sirius-wallet.svg" class="w-10 inline mr-3">
            </div>
          </div>
        </div>
      </div> -->
      <div v-if="currentPage==1">
        <div class="text-sm my-5 font-bold">Transaction Details</div>
        <div class="error error_box mb-5" v-if="err!=''">{{ err }}</div>
        <SelectInputAccountOutgoingSwap v-model="siriusAddress" placeholder="From Sirius Chain Account" :selectDefault="walletState.currentLoggedInWallet.selectDefaultAccount().address" />
        <!-- <div class="mb-5 flex justify-between bg-gray-100 rounded-2xl p-3 text-left">
          <div class="text-xs sm:text-tsm ml-3 text-gray-700">
            <div class="mb-1 sm:mb-0"><b>Account Name:</b> {{ selectedAccount.name }}</div>
            <div class="mb-1 sm:mb-0"><b>Sirius Address:</b> <div class="block mt-1 sm:inline-block sm:mt-0">{{ selectedAccount.address }}</div></div>
            <div class="mb-1 sm:mb-0"><b>Sirius Balance:</b> <div class="block mt-1 sm:inline-block sm:mt-0"><img src="@/assets/img/icon-prx-xpx-blue.svg" class="w-5 inline sm:ml-1"> {{ selectedAccount.balanceDisplay }} {{ currentNativeTokenName }}</div></div>
          </div>
          <div class="self-center">
            <button @click="currentPage=1" class="text-xs sm:text-sm hover:shadow-lg bg-white hover:bg-gray-100 rounded-3xl border-2 font-bold px-6 py-1 border-blue-primary text-blue-primary outline-none focus:outline-none">Change</button>
          </div>
        </div> -->
        <!-- <SwapInput v-model="amount" :maxAmount="maxSwapAmount" placeholder="Amount" :gasFee="gasPriceInXPX" :transactionFee="txFeeDisplay" type="text" icon="coins" :showError="showAmountErr"
                  :errorMessage="(selectedAccountBalance >= minBalanceAmount)?'Insufficient balance':'Balance is insufficient to cover transaction fee.'" emptyErrorMessage="Amount is empty" :disabled="disableAmount" @clickedMaxAvailable="updateAmountToMax()" :remarkOption="true" /> -->
        <div class="relative">
          <div class="opacity-90 w-full h-full absolute z-10 bg-white" v-if="!siriusAddress"></div>
          <SwapInputClean class="mt-5" :disabled="disableAmount" v-model="amount" :balance="selectedAccountBalance" :placeholder="currentNativeTokenName + ' Amount'" type="text" :showError="showAmountErr" :errorMessage="(selectedAccountBalance >= minBalanceAmount)?'Insufficient balance':'Balance is insufficient to cover transaction fee.'" emptyErrorMessage="Amount is empty" :maxAmount="maxSwapAmount" :gasFee="gasPriceInXPX" :transactionFee="txFeeDisplay" @clickedMaxAvailable="updateAmountToMax()" :remarkOption="true" toolTip="XPX amount to swap to ERC20" />

          <MetamaskAddressInput placeholder="ETH address receiving your swap" errorMessage="Valid ETH address is required" class="mt-5" :showError="showAddressErr" v-model="ethAddress" icon="wallet" />
          <div class="tex-center font-bold text-sm my-5">Transaction Fee (ETH Network):</div>
          <div class="md:grid md:grid-cols-3 mb-4">
            <div class="md:col-span-1 mb-3">
              <div class="ethGasStrategy md:mr-6" :class="`${ (ethGasStrategy == 'standard')?'selected':'option' }`" @click="changeGasStrategy('standard')">
                <p class="font-bold text-tsm mb-2">Standard</p>
                <div class="mb-1">ETH {{ standardGasPrice }}</div>
                <div>{{ currentNativeTokenName }} <b>{{ xpxAmountInStandardGasPrice }}</b> = USD {{ standardGasPriceInUSD }}</div>
              </div>
            </div>
            <div class="md:col-span-1 mb-3">
              <div class="ethGasStrategy md:mx-3" :class="`${ (ethGasStrategy == 'fast')?'selected':'option' }`" @click="changeGasStrategy('fast')">
                <p class="font-bold text-tsm mb-2">Fast</p>
                <div class="mb-1">ETH {{ fastGasPrice }}</div>
                <div>{{ currentNativeTokenName }} <b>{{ xpxAmountInFastGasPrice }}</b> = USD {{ fastGasPriceInUSD }}</div>
              </div>
            </div>
            <div class="md:col-span-1 mb-3">
              <div class="ethGasStrategy md:ml-6" :class="`${ (ethGasStrategy == 'rapid')?'selected':'option' }`" @click="changeGasStrategy('rapid')">
                <p class="font-bold text-tsm mb-2">Rapid</p>
                <div class="mb-1">ETH {{ rapidGasPrice }}</div>
                <div>{{ currentNativeTokenName }} <b>{{ xpxAmountInRapidGasPrice }}</b> = USD {{ rapidGasPriceInUSD }}</div>
              </div>
            </div>
          </div>
          <div class="text-tsm text-center mb-2 sm:mb-10">Fees are valid for: {{ timerMinutes }}:{{ timerSecondsDisplay >= 10 ? timerSecondsDisplay : "0" + timerSecondsDisplay }}</div>
          <div class="tex-center font-bold text-sm mb-5">Transaction Fee (Sirius Network):</div>
          <div class="rounded bg-gray-100 p-5 mb-5">
            <div class="inline-block mr-4 text-xs"><img src="@/modules/dashboard/img/icon-xpx.svg" class="w-3 inline mr-2 text-gray-500 relative" style="top: -2px">Transaction Fee: <span>{{ txFeeDisplay }}</span> {{ currentNativeTokenName }}</div>
          </div>
          <PasswordInputClean placeholder="Insert wallet password" errorMessage="Wallet password required" :showError="showPasswdError" icon="lock" v-model="walletPasswd" />
          <div class="bg-blue-50 border border-blue-primary h-20 mt-5 rounded flex items-center justify-center">
            {{ amount }} {{ currentNativeTokenName }} <img src="@/modules/dashboard/img/icon-xpx.svg" class="w-5 h-5 ml-4">
          </div>
          <div class="flex justify-center mt-3">
            <div class="text-xs text-gray-600 mt-2 max-w-screen-md">Swap completion time will vary depending on the performance of the ETH network. The more ETH transaction fees you pay, the faster your swap will occur. Displayed ETH fees are valid for only three minutes due to the ETH network’s fluctuating rates.</div>
          </div>
          <div class="mt-10 text-center">
            <button @click="$router.push({name: 'ViewServicesMainnetSwap'})" class="text-black font-bold text-xs mr-1 sm:mr-5 mt-2 focus:outline-none disabled:opacity-50" :disabled="isDisabledCancel">Maybe Later</button>
            <button type="button" class="default-btn focus:outline-none disabled:opacity-50 mt-2" :disabled="isDisabledSwap" @click="swap">{{ swapInProgress?'Swap in progress. Please wait...':'Yes, Swap' }}</button>
            <button class="default-btn focus:outline-none disabled:opacity-50 mt-2" v-if="canCheckStatus" @click="callTocheckSwapStatus">Check Swap Status</button>
          </div>
        </div>
      </div>
      <div v-if="currentPage==2">
        <div>
          <h1 class="default-title font-bold mt-5 mb-2">Congratulations!</h1>
          <div class="text-sm mb-7">The swap process has already started!</div>
          <swap-certificate-component networkTerm="ETH" swapType="Out" :swapId="swapId" :swapTimestamp="swapTimestamp" :transactionHash="certTransactionHash" :swapQr="swapQr" :swapLink="swapLink" :siriusName="selectedAccountName" :swappedAmount="amount" :siriusAddress="Helper.createAddress(selectedAccountAddress).pretty()" :siriusTransactionHash="siriusTransactionHash" :xpxExplorer="xpxExplorerUrl"  />
          <button type="button" class="w-40 hover:shadow-lg bg-blue-primary text-white text-xs hover:opacity-50 rounded font-bold px-4 py-3 border border-blue-primary outline-none mr-4 mt-6" @click="saveCertificate">Download Certificate</button>
          <div class="mt-5">
            <a :href="swapLink" target=_new class="underline self-center text-xs font-bold text-blue-primary">View Transaction in Ether Scan<font-awesome-icon icon="external-link-alt" class="ml-2 text-blue-500 w-3 h-3 self-center inline-block"></font-awesome-icon></a><br>
            <a :href="xpxExplorerUrl" target=_new class="underline self-center text-xs font-bold text-blue-primary">View Transaction in Explorer<font-awesome-icon icon="external-link-alt" class="ml-2 text-blue-500 w-3 h-3 self-center inline-block"></font-awesome-icon></a>
          </div>
          <div class="md:mx-20 lg:mx-40 font-bold text-center text-tsm py-5 sm:py-10 mt-5 sm:mt-10 border-t border-gray-200">Swap Details</div>
          <div class="md:mx-20 lg:mx-10 xl:mx-40 border-2 border-gray-200 mt-4 p-5 text-xs font-bold filter shadow-lg">
            <div class="text-blue-primary mb-1">From: {{ selectedAccountName }}</div>
            <div class="break-all">{{ Helper.createAddress(selectedAccountAddress).pretty() }}</div>
            <div class="mt-1">Swap Amount {{ amount }} {{ currentNativeTokenName }} <img src="@/modules/dashboard/img/icon-xpx.svg" class="w-3 h-3 ml-2 inline relative" style="top: -2px"></div>
            <div>
              <img src="@/modules/services/submodule/mainnetSwap/img/icon-dots.svg" class="inline-block h-8 my-2">
            </div>
            <div class="text-blue-primary mb-1">To: MetaMask Account</div>
            <div>{{ ethAddress }}</div>
            <div class="mt-1">Equivalent to {{ amount }}</div>
          </div>
          <div class="my-5 sm:my-7 text-gray-500 text-xs md:mx-20 lg:mx-10 xl:mx-40">Please download the certificate. It is needed in the event of an error. You can search the status of your ETH transaction using the above ETH Transaction Hash.</div>
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
import { BuildTransactions } from "@/util/buildTransactions";
import { ChainSwapConfig } from "@/models/stores/chainSwapConfig";
import { useToast } from "primevue/usetoast";
import { ethers } from 'ethers';
import { SwapUtils } from '@/util/swapUtils';
//import { ChainUtils } from "@/util/chainUtils";
//import { ChainAPICall } from "@/models/REST/chainAPICall";
//import { listenerState} from "@/state/listenerState";

export default {
  name: 'ViewServicesMainnetSwapSiriusToETH',

  components: {
    PasswordInputClean,
    SwapInputClean,
    MetamaskAddressInput,
    SwapCertificateComponent,
    SelectInputAccountOutgoingSwap,
  },

  setup() {
    const currentNativeTokenName = computed(()=> networkState.currentNetworkProfile.network.currency.name);
    const toast = useToast();
    const router = useRouter();
    const displayTimer = ref(true);
    const timerSeconds = ref(180);
    const timerSecondsDisplay = computed(()=> timerSeconds.value % 60);
    const timerMinutes = computed(()=> Math.floor(timerSeconds.value / 60));

    const timerInterval = setInterval(()=>{
      --timerSeconds.value;
    }, 1000);

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

        if(ethGasStrategy.value === ""){
          changeGasStrategy("standard");
        }
        else{
          changeGasStrategy(ethGasStrategy.value);
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
            balanceDisplay: Helper.toCurrencyFormat(acc.balance, 6),
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
            balanceDisplay: Helper.toCurrencyFormat(acc.balance, 6),
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
        selectedAccountBalance.value = account.balance;
        selectedAccountPublicKey.value = account.publicKey;
        maxSwapAmount.value = Helper.convertNumberMinimumFormat(account.balance - txFee.value - gasPriceInXPX.value, 6);
      }else{
        selectedAccountName.value = '';
        selectedAccountAddress.value = '';
        selectedAccountBalance.value = '';
        selectedAccountPublicKey.value = '';
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
    const ethAddress = ref('');
    const isDisabledSwap = computed(() => 
      !(amount.value > 0 && walletPasswd.value.match(passwdPattern) && ethAddress.value != '' && !swapInProgress.value )
    );
    const amount = ref(0);

    const xpxNamespace = networkState.currentNetworkProfile.network.currency.namespace;
    const XpxAsset = Helper.createAsset(Helper.createNamespaceId(xpxNamespace).toHex(), 1);

    const buildClass = new BuildTransactions(networkState.currentNetworkProfile.network.type);
    const transferBuilder = buildClass.transferBuilder();
    const aggregateBuilder = buildClass.aggregateCompleteBuilder();

    let message1 = {
      type: "Swap-xpx-eth",
      remoteAddress: "0".repeat(42) 
    };

    const updateRemoteAddress = ()=>{
      message1.remoteAddress = ethAddress.value;

      rebuildTranction();
    }

    let message2 = {
      type: 'Swap-xpx-eth-fees',
      gasPrice: 20,
      gasLimit: 57500
    };

    let swapData = new ChainSwapConfig(networkState.chainNetworkName);
    swapData.init();

    let swapServerUrl = swapData.swap_XPX_ETH_URL;
    let ethScanUrl = swapData.ETHScanUrl;
    let xpxExplorerUrl = networkState.currentNetworkProfile.chainExplorer.url + '/' + networkState.currentNetworkProfile.chainExplorer.hashRoute + '/';
    let sinkFundAddress;
    let sinkFeeAddress;

    const updateSinkAddress = async()=>{
      try{
        const swapServiceInfoURL = SwapUtils.getServiceInfoURL(swapServerUrl);

        const serviceInfo = await SwapUtils.getOutgoingSwapServiceInfo(swapServiceInfoURL);

        sinkFundAddress = serviceInfo.siriusInfo.sinkingFundAddress;
        sinkFeeAddress = serviceInfo.siriusInfo.sinkingFeeAddress;

        buildTransaction();
      }
      catch(error){
        addErrorToast("Service unavailable", "Unable to get sink address");
        redirectToSelection();
      }
    }

    updateSinkAddress();

    let aggreateCompleteTransaction;
    let transferTx;
    let feetransferTx;

    const buildTransaction = ()=>{
      transferTx = transferBuilder.mosaics([XpxAsset])
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

      txFee.value = Helper.convertToExact(aggreateCompleteTransaction.maxFee.compact(), 6);
    }

    let txFee = ref(0);
    const txFeeDisplay = computed(()=>{
        return Helper.toCurrencyFormat(txFee.value, 6);
    });

    const rebuildTranction = ()=>{
      let swapAmount;
      if(amount.value < 0){
        swapAmount = 0;
      }
      else{
        swapAmount = amount.value;
      }
      const swapAmountXPX = Helper.createAsset(Helper.createNamespaceId(xpxNamespace).toHex(), Helper.convertToAbsolute(swapAmount, 6));
      const feeXpx = Helper.createAsset(Helper.createNamespaceId(xpxNamespace).toHex(), Helper.convertToAbsolute(gasPriceInXPX.value, 6));
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

      txFee.value = Helper.convertToExact(aggreateCompleteTransaction.maxFee.compact(), 6);
    }

    const standardGasPrice = computed(()=>{
       return standardGasPriceInGwei.value * standardGasLimit.value / giga;
    });

    const rapidGasPrice = computed(()=>{
       return rapidGasPriceInGwei.value * rapidGasLimit.value / giga;
    });

    const fastGasPrice = computed(()=>{
       return fastGasPriceInGwei.value * fastGasLimit.value / giga;
    });

    const standardGasPriceInUSD = computed(()=>{
       return Helper.convertNumberMinimumFormat(standardGasPrice.value * currentETH_USD.value, 2);
    });

    const rapidGasPriceInUSD = computed(()=>{
       return Helper.convertNumberMinimumFormat(rapidGasPrice.value * currentETH_USD.value, 2);
    });

    const fastGasPriceInUSD = computed(()=>{
       return Helper.convertNumberMinimumFormat(fastGasPrice.value * currentETH_USD.value, 2);
    });

    const xpxAmountInStandardGasPrice = computed(()=>{
      return Helper.convertNumberMinimumFormat((standardGasPriceInUSD.value/ currentXPX_USD.value) * feeMultiply, 6);
    });

    const xpxAmountInRapidGasPrice = computed(()=>{
      return Helper.convertNumberMinimumFormat((rapidGasPriceInUSD.value/ currentXPX_USD.value) * feeMultiply, 6);
    });

    const xpxAmountInFastGasPrice = computed(()=>{
      return Helper.convertNumberMinimumFormat((fastGasPriceInUSD.value/ currentXPX_USD.value) * feeMultiply, 6);
    });

    const standardGasPriceInGwei = ref(0);
    const rapidGasPriceInGwei = ref(0);
    const fastGasPriceInGwei = ref(0);

    const standardGasLimit = ref(55000);
    const rapidGasLimit = ref(55000);
    const fastGasLimit = ref(55000);

    const updateGasPrice = async ()=>{
      let data = await SwapUtils.getETH_SafeGwei(swapData.gasPriceConsultURL);

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
    updateGasPrice();

    const updateGasLimit = async()=>{
      const data = await SwapUtils.getETH_GasLimit(swapData.gasPriceConsultURL);

      if(data.status === 0){
        console.log("Error, no data found. Please try again later");
      }
      else{
        standardGasLimit.value = data.standardGasLimit;
        fastGasLimit.value = data.fastGasLimit;
        rapidGasLimit.value = data.rapidGasLimit;
      }
    }

    updateGasLimit();

    const currentXPX_USD = ref(0);
    const currentETH_USD = ref(0);

    const getCurrentPrice = async ()=>{

      let prices = await getCurrentPriceUSD(SwapUtils.checkSwapPrice(swapData.priceConsultURL));

      currentXPX_USD.value = prices.xpx;
      currentETH_USD.value = prices.eth;
    };

    getCurrentPrice();

    const updateAmountToMax = () => {
      amount.value = maxSwapAmount.value;
    };

    const savedCheck = ref(false);

    const ethGasStrategy = ref('');

    let selectedGasLimit = ref(0);

    let selectedGasPriceInGwei = ref(0);

    let gasPriceInXPX = ref(0);

    const maxSwapAmount = ref(0);
    const minBalanceAmount = ref(0);

    const changeGasStrategy = (feeStrategy)=>{
      ethGasStrategy.value = feeStrategy;

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

      maxSwapAmount.value = Helper.convertNumberMinimumFormat(selectedAccountBalance.value - txFee.value - gasPriceInXPX.value, 6);
      minBalanceAmount.value = Helper.convertNumberMinimumFormat(txFee.value + gasPriceInXPX.value, 6);
      if(amount.value > maxSwapAmount.value){
        amount.value = maxSwapAmount.value;
      }

      if(selectedAccount.value.balance <= minBalanceAmount.value){
        amount.value = 0;
      }

      if(selectedAccount.value.balance <= minBalanceAmount.value){
        disableAmount.value = true;
        showAmountErr.value = true;
      }
      else{
        disableAmount.value = false;
        showAmountErr.value = false;
      }

      rebuildTranction();
    }

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
        let validateAddress = ethers.utils.getAddress(ethAddress.value);
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
          changeGasStrategy(ethGasStrategy.value);
          if((amount.value + gasPriceInXPX.value + txFee.value) > selectedAccount.value.balance){
            addErrorToast('Insufficient amount', 'Insufficient amount to perform swap', 5000);
            return;
          }
          disableTimer();
          let signedTransaction = SwapUtils.signTransaction(selectedAccountAddress.value, walletPasswd.value, aggreateCompleteTransaction);
          siriusTransactionHash.value = signedTransaction.hash;
          callSwapServer(signedTransaction.payload);
        } else {
          err.value = "Wallet password is incorrect";
          swapInProgress.value = false;
          isDisabledCancel.value = false;
        }
      }
    };

    // call swap server function
    const callSwapServer = async(payload) =>{
      const data = {
        txnInfo: {
          network: "eth",
          siriusTxnPayload: payload
        }
      };
      let stringifyData = JSON.stringify(data);

      try {
        const response = await fetch(SwapUtils.getOutgoing_SwapTransfer_URL(swapServerUrl), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: stringifyData, // body data type must match "Content-Type" header
        });

        if(response.ok){
          const res = await response.json();
          certTransactionHash.value = res.data.txHash;
          swapLink.value = ethScanUrl + res.data.txHash;
          swapTimestamp.value = '';
          swapId.value = res.data.swapId;
          swapQr.value = SwapUtils.generateQRCode(ethScanUrl + res.data.txHash);
          currentPage.value = 2;
        }
        else if(response.status==400){
          const res = await response.json();
          addErrorToast('Swap operation failed', res.data.message);
          swapInProgress.value = false;
          isDisabledCancel.value = false;
        }
        else if(response.status==409){
          canCheckStatus.value = true;
          //swapInProgress.value = false;
          isDisabledCancel.value = false;
        }
        else if(response.status==503){
          toast.add({
            severity:'warn',
            summary: 'Service is unavailable',
            detail: 'Please try again later',
            group: 'br'
          });
          swapInProgress.value = false;
          isDisabledCancel.value = false;
        }
        else if(response.status==504){
          addErrorToast('Swap request timed-out', 'Please check the status again');
          // swapInProgress.value = false;
          isDisabledCancel.value = false;
          canCheckStatus.value = true;
        }
      } catch (error) {
        addErrorToast('Network error', 'Swap Server not found');
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
        swapQr.value = SwapUtils.generateQRCode(ethScanUrl + res.fulfillTransaction);
        currentPage.value = 2;
      }
      else{
        addErrorToast('Swap not found', 'Swap not found for the current transaction ID');
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
      SwapUtils.generateoutgoingPdfCert('ETH', swapTimestamp.value, selectedAccountAddress.value, swapId.value, certTransactionHash.value, swapQr.value, siriusTransactionHash.value);
    };

    return {
      selectedAccountBalance,
      minBalanceAmount,
      includeMultisig,
      timerSecondsDisplay,
      timerMinutes,
      currentPage,
      // selectAccount,
      ethAddress,
      showAddressErr,
      showPasswdError,
      walletPasswd,
      passwdPattern,
      showAmountErr,
      amount,
      disableAmount,
      updateAmountToMax,
      ethGasStrategy,
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
      rapidGasPrice,
      fastGasPrice,
      standardGasPriceInUSD,
      rapidGasPriceInUSD,
      fastGasPriceInUSD,
      xpxAmountInStandardGasPrice,
      xpxAmountInRapidGasPrice,
      xpxAmountInFastGasPrice,
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
    };
  }
}
</script>
<style lang="scss" scoped>
.select-text{
  top: 5px;
}

.ethGasStrategy{
  @apply rounded p-3 text-xs border cursor-pointer;
}

.ethGasStrategy.selected{
  @apply text-gray-100 bg-blue-primary border-blue-primary;
  p{
    @apply text-white;
  }
}

.ethGasStrategy.option{

transition: all 0.5s;
  @apply text-gray-600 bg-white border-gray-200 hover:bg-blue-100 hover:border-blue-100;
  p{
    @apply text-blue-primary;
  }
}
</style>