<template>
  <div class="flex justify-between text-xs sm:text-sm">
    <div><span class="text-gray-400">Swap > ETH > Out > </span> <span class="text-blue-primary font-bold">Transaction</span></div>
    <div>
      <router-link :to="{ name: 'ViewServices' }" class="font-bold">{{$t('services.allservices')}}</router-link>
    </div>
  </div>
  <div class='mt-2 py-3 gray-line px-0 lg:px-10 xl:px-80'>
    <div class="flex">
      <div class="flex-none">
        <div class="flex p-0 sm:p-3">
          <div class="rounded-full flex w-6 h-6 sm:w-10 sm:h-10" :class="`${ currentPage>=1?'bg-blue-primary':'bg-gray-300' }`"><div class="self-center inline-block text-center w-full text-white text-txs sm:text-sm">1</div></div>
          <div class="inline-block self-center ml-3 text-xs sm:text-sm">{{$t('wallets.account')}}</div>
        </div>
      </div>
      <div class="h-1 bg-gray-200 flex-grow mx-2 self-center"></div>
      <div class="flex-none">
        <div class="flex p-0 sm:p-3">
          <div class="rounded-full flex w-6 h-6 sm:w-10 sm:h-10" :class="`${ currentPage>=2?'bg-blue-primary':'bg-gray-300' }`"><div class="self-center inline-block text-center w-full text-white text-txs sm:text-sm">2</div></div>
          <div class="inline-block self-center ml-3 text-xs sm:text-sm">{{$t('swap.transaction')}}</div>
        </div>
      </div>
      <div class="h-1 bg-gray-200 flex-grow mx-2 self-center"></div>
      <div class="flex-none">
        <div class="flex p-0 sm:p-3">
          <div class="rounded-full flex w-6 h-6 sm:w-10 sm:h-10" :class="`${ currentPage==3?'bg-blue-primary':'bg-gray-300' }`"><div class="self-center inline-block text-center w-full text-white text-txs sm:text-sm">3</div></div>
          <div class="inline-block self-center ml-3 text-xs sm:text-sm">{{$t('swap.certificate')}}</div>
        </div>
      </div>
    </div>
    <div v-if="currentPage==1">
      <p class="text-tsm my-5 text-gray-400">This is a list of your Sirius accounts available in this wallet.</p>
      <div class="text-lg my-7 font-bold">Please select a Sirius account</div>
      <div v-for="acc of allAvailableAccounts" :key="acc.name">
        <div class="mb-2 flex justify-between rounded-2xl p-3 text-left transition" :class="`${(!acc.isMultisig|| includeMultisig)?'cursor-pointer hover:bg-blue-100 bg-gray-100':'bg-gray-50'}`" @click="(!acc.isMultisig || includeMultisig) && selectAccount(acc.name, acc.address)">
          <div class="text-xs sm:text-tsm ml-3" :class="`${(!acc.isMultisig || includeMultisig)?'text-gray-700':'text-gray-200'}`">
            <div class="mb-1 sm:mb-0"><b>Account Name:</b> {{ acc.name }} <div v-if="acc.isMultisig" class="inline-block badge rounded bg-blue-200 p-1 text-white text-txs ml-2">Multisig</div></div>
            <div class="mb-1 sm:mb-0"><b>Sirius Address:</b> <div class="block mt-1 sm:inline-block sm:mt-0">{{ acc.address }}</div></div>
            <div class="mb-1 sm:mb-0"><b>Sirius Balance:</b> <div class="block mt-1 sm:inline-block sm:mt-0"><img src="@/assets/img/icon-prx-xpx-blue.svg" class="w-5 inline sm:ml-1"> {{ acc.balanceDisplay }} XPX</div></div>
          </div>
          <div class="self-center">
            <img src="@/modules/services/img/icon-account-green-16h-proximax-sirius-wallet.svg" class="w-10 inline mr-3">
          </div>
        </div>
      </div>
    </div>
    <div v-if="currentPage==2">
      <div class="text-lg my-7 font-bold">Transaction Details</div>
      <div class="error error_box mb-5" v-if="err!=''">{{ err }}</div>
      <div class="mb-5 flex justify-between bg-gray-100 rounded-2xl p-3 text-left">
        <div class="text-xs sm:text-tsm ml-3 text-gray-700">
          <div class="mb-1 sm:mb-0"><b>Account Name:</b> {{ selectedAccount.name }}</div>
          <div class="mb-1 sm:mb-0"><b>Sirius Address:</b> <div class="block mt-1 sm:inline-block sm:mt-0">{{ selectedAccount.address }}</div></div>
          <div class="mb-1 sm:mb-0"><b>Sirius Balance:</b> <div class="block mt-1 sm:inline-block sm:mt-0"><img src="@/assets/img/icon-prx-xpx-blue.svg" class="w-5 inline sm:ml-1"> {{ selectedAccount.balanceDisplay }} XPX</div></div>
        </div>
        <div class="self-center">
          <button @click="currentPage=1" class="text-xs sm:text-sm hover:shadow-lg bg-white hover:bg-gray-100 rounded-3xl border-2 font-bold px-6 py-1 border-blue-primary text-blue-primary outline-none focus:outline-none">Change</button>
        </div>
      </div>
      <SwapInput v-model="amount" :maxAmount="maxSwapAmount" placeholder="Amount" :gasFee="gasPriceInXPX" :transactionFee="txFeeDisplay" type="text" icon="coins" :showError="showAmountErr"
                :errorMessage="(selectedAccount.balance >= minBalanceAmount)?'Insufficient balance':'Balance is insufficient to cover transaction fee.'" emptyErrorMessage="Amount is empty" :disabled="disableAmount" @clickedMaxAvailable="updateAmountToMax()" :remarkOption="true" />
      <TextInput placeholder="ETH address receiving your swap" errorMessage="Valid ETH address is required" :showError="showAddressErr" v-model="ethAddress" icon="wallet" />
      <div class="tex-center font-bold text-lg mb-2">Transaction Fee (ETH Network):</div>
      <div class="md:grid md:grid-cols-3 mb-10">
        <div class="md:col-span-1 mb-3">
          <div class="ethGasStrategy md:mr-6" :class="`${ (ethGasStrategy == 'standard')?'selected':'option' }`" @click="changeGasStrategy('standard')">
            <p class="font-bold text-tsm">Standard</p>
            <div>ETH {{ standardGasPrice }}</div>
            <div>XPX {{ xpxAmountInStandardGasPrice }} = USD {{ standardGasPriceInUSD }}</div>
          </div>
        </div>
        <div class="md:col-span-1 mb-3">
          <div class="ethGasStrategy md:mx-3" :class="`${ (ethGasStrategy == 'fast')?'selected':'option' }`" @click="changeGasStrategy('fast')">
            <p class="font-bold text-tsm">Fast</p>
            <div>ETH {{ fastGasPrice }}</div>
            <div>XPX {{ xpxAmountInFastGasPrice }} = USD {{ fastGasPriceInUSD }}</div>
          </div>
        </div>
        <div class="md:col-span-1 mb-3">
          <div class="ethGasStrategy md:ml-6" :class="`${ (ethGasStrategy == 'rapid')?'selected':'option' }`" @click="changeGasStrategy('rapid')">
            <p class="font-bold text-tsm">Rapid</p>
            <div>ETH {{ rapidGasPrice }}</div>
            <div>XPX {{ xpxAmountInRapidGasPrice }} = USD {{ rapidGasPriceInUSD }}</div>
          </div>
        </div>
      </div>
      <div class="text-sm text-center mb-2 sm:mb-4">Fees are valid for: {{ timerMinutes }}:{{ timerSecondsDisplay >= 10 ? timerSecondsDisplay : "0" + timerSecondsDisplay }}</div>
      <div class="tex-center font-bold text-lg mb-2">Transaction Fee (Sirius Network):</div>
      <div class="rounded-2xl bg-gray-100 p-5 mb-5">
        <div class="inline-block mr-4 text-xs"><img src="@/assets/img/icon-prx-xpx-blue.svg" class="w-5 inline mr-1 text-gray-500">Transaction Fee: <span>{{ txFeeDisplay }}</span> XPX</div>
      </div>
      <PasswordInput placeholder="Insert wallet password" errorMessage="Wallet password required" :showError="showPasswdError" icon="lock" v-model="walletPasswd" />
      <div class="flex justify-between p-4 rounded-xl bg-white border-yellow-500 border-2 my-8">
        <div class="text-center w-full">
          <div class="w-8 h-8 inline-block relative">
            <div class="rounded-full border border-yellow-500 w-7 h-7 relative">
              <font-awesome-icon icon="exclamation" class="w-5 h-5 text-yellow-500 inline-block absolute" style="top:3px; right: 10px;"></font-awesome-icon>
            </div>
          </div>
          <div class="text-tsm mt-2">Swap completion time will vary depending on the performance of the ETH network. The more ETH transaction fees you pay, the faster your swap will occur. Displayed ETH fees are valid for only three minutes due to the ETH network’s fluctuating rates.</div>
        </div>
      </div>
      <div class="mt-10">
        <button @click="$router.push({name: 'ViewServices'})" class="default-btn mr-1 sm:mr-5 mt-2 focus:outline-none disabled:opacity-50" :disabled="isDisabledCancel">Maybe Later</button>
        <button type="button" class="default-btn focus:outline-none disabled:opacity-50 mt-2" :disabled="isDisabledSwap" @click="swap">{{ swapInProgress?'Swap in progress. Please wait...':'Yes, Swap' }}</button>
        <button class="default-btn focus:outline-none disabled:opacity-50 mt-2" v-if="canCheckStatus" @click="callTocheckSwapStatus">Check Swap Status</button>
      </div>
    </div>
    <div v-if="currentPage==3">
      <div>
        <h1 class="default-title font-bold mt-5 mb-2">Congratulations!</h1>
        <div class="text-sm mb-7">The swap process has already started!</div>
        <swap-certificate-component networkTerm="ETH" swapType="Out" :swapId="swapId" :swapTimestamp="swapTimestamp" :transactionHash="certTransactionHash" :siriusAddress="selectedAccountAddress" :swapQr="swapQr" :swapLink="swapLink" :siriusTransactionHash="siriusTransactionHash" :xpxExplorer="xpxExplorerUrl" />
        <div class="flex justify-between p-4 rounded-xl bg-white border-yellow-500 border-2 my-8">
          <div class="text-center w-full">
            <div class="w-8 h-8 inline-block relative">
              <div class="rounded-full border border-yellow-500 w-7 h-7 relative">
                <font-awesome-icon icon="exclamation" class="w-5 h-5 text-yellow-500 inline-block absolute" style="top:3px; right: 10px;"></font-awesome-icon>
              </div>
            </div>
            <div class="text-tsm mt-2">Please download the certificate. It is needed in the event of an error. You can search the status of your ETH transaction using the above ETH Transaction Hash.</div>
          </div>
        </div>
        <label class="inline-flex items-center mb-10">
          <input type="checkbox" class="h-5 w-5 bg-blue-primary" value="true" v-model="savedCheck">
          <span class="ml-2 cursor-pointer text-tsm">{{$t('certconsent')}}.</span>
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
import { useRouter } from "vue-router";
import PasswordInput from '@/components/PasswordInput.vue';
import TextInput from '@/components/TextInput.vue';
import SwapInput from '@/modules/services/submodule/mainnetSwap/components/SwapInput.vue';
import SwapCertificateComponent from '@/modules/services/submodule/mainnetSwap/components/SwapCertificateComponent.vue';
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
    PasswordInput,
    SwapInput,
    TextInput,
    SwapCertificateComponent,
  },

  setup() {
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
      router.push({ name: "ViewServicesMainnetSwapEthOptions"});
    };

    const currentPage = ref(1);
    // page 1
    const includeMultisig = ref(false);

    const selectedAccountName = ref("");
    const selectedAccountAddress = ref("");
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
                        .innerTransactions(Helper.createInnerTransaction([transferTx, feetransferTx], selectedAccount.value.publicKey))
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

      maxSwapAmount.value = Helper.convertNumberMinimumFormat(selectedAccount.value.balance - txFee.value - gasPriceInXPX.value, 6);
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
          currentPage.value = 3;
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
        currentPage.value = 3;
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
      minBalanceAmount,
      includeMultisig,
      timerSecondsDisplay,
      timerMinutes,
      currentPage,
      selectAccount,
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
    };
  }
}
</script>
<style lang="scss" scoped>
.select-text{
  top: 5px;
}

.ethGasStrategy{
  @apply rounded-2xl p-3 text-xs border cursor-pointer;
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