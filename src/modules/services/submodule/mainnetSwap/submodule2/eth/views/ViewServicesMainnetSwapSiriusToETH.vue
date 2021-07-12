<template>
  <div class="flex justify-between text-sm">
    <div><span class="text-gray-400">Swap > ETH > Outgoing > </span> <span class="text-blue-primary font-bold">Transaction</span></div>
    <div>
      <router-link :to="{ name: 'ViewServices' }" class="font-bold">All Services</router-link>
    </div>
  </div>
  <div class='mt-2 py-3 gray-line px-0 lg:px-10 xl:px-80'>
    <div class="flex">
      <div class="flex-none">
        <div class="flex hover:bg-gray-200 p-3 rounded-2xl cursor-pointer">
          <div class="rounded-full flex w-6 h-6 sm:w-10 sm:h-10" :class="`${ currentPage>=1?'bg-blue-primary':'bg-gray-300' }`"><div class="self-center inline-block text-center w-full text-white text-txs sm:text-sm">1</div></div>
          <div class="inline-block self-center ml-3 text-xs sm:text-sm">Account</div>
        </div>
      </div>
      <div class="h-1 bg-gray-200 flex-grow mx-2 self-center"></div>
      <div class="flex-none">
        <div class="flex hover:bg-gray-200 p-3 rounded-2xl cursor-pointer">
          <div class="rounded-full flex w-6 h-6 sm:w-10 sm:h-10" :class="`${ currentPage>=2?'bg-blue-primary':'bg-gray-300' }`"><div class="self-center inline-block text-center w-full text-white text-txs sm:text-sm">2</div></div>
          <div class="inline-block self-center ml-3 text-xs sm:text-sm">Transaction</div>
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
    <div class="text-sm text-center">{{ timerMinutes }}:{{ timerSecondsDisplay > 10 ? timerSecondsDisplay : "0" + timerSecondsDisplay }}</div>
    <div v-if="currentPage==1">
      <p class="text-tsm my-5 text-gray-400">This is a list of your Sirius Accounts available in this wallet.</p>
      <div class="text-lg my-7 font-bold">Please select a Sirius account</div>
      <div v-for="acc of allAvailableAccounts" :key="acc.name">
        <div class="mb-2 flex justify-between bg-gray-100 rounded-2xl p-3 text-left cursor-pointer hover:bg-blue-100 transition" @click="selectAccount(acc.name)">
          <div class="text-tsm ml-3 text-gray-700">
            <div><b>Account Name:</b> {{ acc.name }}</div>
            <div><b>Sirius Address:</b> {{ acc.address }}</div>
            <div><b>Sirius balance:</b> <img src="@/assets/img/icon-prx-xpx-blue.svg" class="w-5 inline ml-1"> {{ acc.balanceDisplay }} XPX</div>
          </div>
          <div class="self-center">
            <img src="@/modules/services/img/icon-account-green-16h-proximax-sirius-wallet.svg" class="w-10 inline mr-3">
          </div>
        </div>
      </div>
    </div>
    <div v-if="currentPage==2">
      <div class="text-lg my-7 font-bold">Transaction Details</div>
      <div class="mb-5 flex justify-between bg-gray-100 rounded-2xl p-3 text-left">
        <div class="text-tsm ml-3 text-gray-700">
          <div><b>Account Name:</b> {{ selectedAccount.name }}</div>
          <div><b>Sirius Address:</b> {{ selectedAccount.address }}</div>
          <div><b>Sirius balance:</b> <img src="@/assets/img/icon-prx-xpx-blue.svg" class="w-5 inline ml-1"> {{ selectedAccount.balanceDisplay }} XPX</div>
        </div>
        <div class="self-center">
          <button @click="currentPage=1" class="hover:shadow-lg bg-white hover:bg-gray-100 rounded-3xl border-2 font-bold px-6 py-1 border-blue-primary text-blue-primary outline-none focus:outline-none">Change</button>
        </div>
      </div>
      <SwapInput v-model="amount" :maxAmount="maxSwapAmount" placeholder="Amount" :gasFee="gasPriceInXPX" :transactionFee="txFeeDisplay" type="text" icon="coins" :showError="showAmountErr" 
                errorMessage="Insufficient balance" emptyErrorMessage="Amount is empty" :disabled="disableAmount" @clickedMaxAvailable="updateAmountToMax()" :remarkOption="true" />
      <TextInput placeholder="ETH address to receive your swap" errorMessage="Valid ETH address is required" v-model="ethAddress" icon="wallet" />
      <div class="tex-center font-bold text-lg mb-2">Transaction Fee (ETH Network):</div>
      <div class="md:grid md:grid-cols-3 mb-10">
        <div class="md:col-span-1 mb-3">
          <div class="ethGasStrategy md:mr-6" :class="`${ (ethGasStrategy == 'standard')?'selected':'option' }`" @click="changeGasStrategy('standard')">
            <p class="font-bold text-tsm">Standard (5 min.)</p>
            <div>ETH {{ safeGasPrice }}</div>
            <div>XPX {{ xpxAmountInSafeGasPrice }} = USD {{ safeGasPriceInUSD }}</div>
          </div>
        </div>
        <div class="md:col-span-1 mb-3">
          <div class="ethGasStrategy md:mx-3" :class="`${ (ethGasStrategy == 'fast')?'selected':'option' }`" @click="changeGasStrategy('fast')">
            <p class="font-bold text-tsm">Fast (2 min.)</p>
            <div>ETH {{ proposedGasPrice }}</div>
            <div>XPX {{ xpxAmountInProposedGasPrice }} = USD {{ proposedGasPriceInUSD }}</div>
          </div>
        </div>
        <div class="md:col-span-1 mb-3">
          <div class="ethGasStrategy md:ml-6" :class="`${ (ethGasStrategy == 'trader')?'selected':'option' }`" @click="changeGasStrategy('trader')">
            <p class="font-bold text-tsm">Trader (ASAP)</p>
            <div>ETH {{ fastGasPrice }}</div>
            <div>XPX {{ xpxAmountInFastGasPrice }} = USD {{ fastGasPriceInUSD }}</div>
          </div>
        </div>
      </div>
      <div class="tex-center font-bold text-lg mb-2">Transaction Fee:</div>
      <div class="rounded-2xl bg-gray-100 p-5 mb-5">
        <div class="inline-block mr-4 text-xs"><img src="@/assets/img/icon-prx-xpx-blue.svg" class="w-5 inline mr-1 text-gray-500">Transaction Fee: <span class="text-txs">{{ txFeeDisplay }}</span> XPX</div>
      </div>
      <PasswordInput placeholder="Insert wallet password" errorMessage="Wallet password required" :showError="showPasswdError" icon="lock" v-model="walletPasswd" />
      <div class="flex justify-between p-4 rounded-xl bg-white border-yellow-500 border-2 my-8">
        <div class="text-center w-full">
          <div class="w-8 h-8 inline-block relative">
            <div class="rounded-full border border-yellow-500 w-7 h-7 relative">
              <font-awesome-icon icon="exclamation" class="w-5 h-5 text-yellow-500 inline-block absolute" style="top:3px; right: 10px;"></font-awesome-icon>
            </div>
          </div>
          <div class="text-tsm mt-2">Swap may take a few hours to complete. If you wish to proceed, you will receive a certificate containing your transaction hash for your records.</div>
        </div>
      </div>
      <div class="mt-10">
        <button @click="$router.push({name: 'ViewServices'})" class="default-btn mr-5 focus:outline-none disabled:opacity-50">Maybe Later</button>
        <button type="submit" class="default-btn focus:outline-none disabled:opacity-50" :disabled="isDisabledSwap" @click="swap">Yes, Swap</button>
      </div>
    </div>
    <div v-if="currentPage==3">
      <div>
        <h1 class="default-title font-bold mt-5 mb-2">Congratulations!</h1>
        <div class="text-sm mb-7">The swap process has already started!</div>
        <swap-certificate-component networkTerm="ETH" swapType="Outgoing" />
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
import { computed, ref, watch } from "vue";
import { useRouter } from "vue-router";
import PasswordInput from '@/components/PasswordInput.vue';
import TextInput from '@/components/TextInput.vue'
import SwapInput from '@/modules/services/submodule/mainnetSwap/components/SwapInput.vue';
import SwapCertificateComponent from '@/modules/services/submodule/mainnetSwap/components/SwapCertificateComponent.vue';
import { walletState } from '@/state/walletState';
import { networkState } from '@/state/networkState';
import { Helper } from "@/util/typeHelper";
import { getCoingeckoCoinPrice, getETH_SafeGwei } from "@/util/functions";
import { BuildTransactions } from "@/util/buildTransactions";
import { ChainSwapConfig } from "@/models/stores/chainSwapConfig"

export default {
  name: 'ViewServicesMainnetSwapSiriusToETH',

  components: {
    PasswordInput,
    SwapInput,
    TextInput,
    SwapCertificateComponent,
  },

  setup() {
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
    const includeMultisig = false;

    const selectedAccountName = ref("");
    const selectAccount = (name) => {
      currentPage.value = 2;
      selectedAccountName.value = name;

      if(ethGasStrategy.value === ""){
        changeGasStrategy("standard");
      }
    };

    const allAvailableAccounts = computed(()=>{

      let accounts = walletState.currentLoggedInWallet.accounts.map(
        (acc)=>{ 
          return { 
            name: acc.name,
            balance: acc.balance,
            balanceDisplay: Helper.toCurrencyFormat(acc.balance, 6),
            type: "",
            address: Helper.createAddress(acc.address).pretty(),
            publicKey: acc.publicKey
          }; 
        });

      if(includeMultisig){
        let otherAccounts = walletState.currentLoggedInWallet.others.filter((acc)=> acc.type === "MULTISIG").map(
        (acc)=>{ 
          return { 
            name: acc.name,
            balance: acc.balance,
            balanceDisplay: Helper.toCurrencyFormat(acc.balance, 6),
            type: "MULTISIG",
            address: Helper.createAddress(acc.address).pretty(),
            publicKey: acc.publicKey
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

    const showPasswdError = ref(false);
    const walletPasswd = ref('');
    const passwdPattern = "^[^ ]{8,}$";
    const showAmountErr = ref(false);
    const disableAmount = ref(false);
    const ethAddress = ref('');
    const isDisabledSwap = computed(() => 
      !(amount.value > 0 && walletPasswd.value.match(passwdPattern) && ethAddress.value != '' )
    );
    const amount = ref(0);

    const xpxNamespace = networkState.currentNetworkProfile.network.currency.namespace;
    const XpxAsset = Helper.createAsset(Helper.createNamespaceId(xpxNamespace).toHex(), 1);

    const buildClass = new BuildTransactions(networkState);
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
      gasLimit: 21000
    };

    let swapData = new ChainSwapConfig(networkState.chainNetworkName);
    swapData.init();

    let sinkFundAddress = swapData.sinkFundAddress;
    let sinkFeeAddress = swapData.sinkFeeAddress;

    let transferTx = transferBuilder.mosaics([XpxAsset])
                        .recipient(Helper.createAddress(sinkFundAddress))
                        .message(Helper.createPlainMessage(JSON.stringify(message1)))
                        .build();
    let feetransferTx = transferBuilder.mosaics([XpxAsset])
                        .recipient(Helper.createAddress(sinkFeeAddress))
                        .message(Helper.createPlainMessage(JSON.stringify(message2)))
                        .build();
    let aggreateCompleteTransaction = aggregateBuilder
                        .innerTransactions(Helper.createInnerTransaction([transferTx, feetransferTx], "0".repeat(64)))
                        .build();

    let txFee = ref(Helper.convertToExact(aggreateCompleteTransaction.maxFee.compact(), 6));
    const txFeeDisplay = computed(()=>{
      return Helper.toCurrencyFormat(txFee.value, 6);
    });

    const rebuildTranction = ()=>{
      const swapAmountXPX = Helper.createAsset(Helper.createNamespaceId(xpxNamespace).toHex(), Helper.convertToAbsolute(amount.value, 6));
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

    const safeGasPrice = computed(()=>{
       return safeGasPriceInGwei.value * safeGasLimit.value / giga;
    });

    const proposedGasPrice = computed(()=>{
       return proposedGasPriceInGwei.value * proposedGasLimit.value / giga;
    });

    const fastGasPrice = computed(()=>{
       return fastGasPriceInGwei.value * fastGasLimit.value / giga;
    });

    const safeGasPriceInUSD = computed(()=>{
       return Helper.convertNumberMinimumFormat(safeGasPrice.value * currentETH_USD.value, 2);
    });

    const proposedGasPriceInUSD = computed(()=>{
       return Helper.convertNumberMinimumFormat(proposedGasPrice.value * currentETH_USD.value, 2);
    });

    const fastGasPriceInUSD = computed(()=>{
       return Helper.convertNumberMinimumFormat(fastGasPrice.value * currentETH_USD.value, 2);
    });

    const xpxAmountInSafeGasPrice = computed(()=>{
      return Helper.convertNumberMinimumFormat((safeGasPriceInUSD.value/ currentXPX_USD.value) * feeMultiply, 6);
    });

    const xpxAmountInProposedGasPrice = computed(()=>{
      return Helper.convertNumberMinimumFormat((proposedGasPriceInUSD.value/ currentXPX_USD.value) * feeMultiply, 6);
    });

    const xpxAmountInFastGasPrice = computed(()=>{
      return Helper.convertNumberMinimumFormat((fastGasPriceInUSD.value/ currentXPX_USD.value) * feeMultiply, 6);
    });

    const safeGasPriceInGwei = ref(0);
    const proposedGasPriceInGwei = ref(0);
    const fastGasPriceInGwei = ref(0);

    const safeGasLimit = ref(21000);
    const proposedGasLimit = ref(21000);
    const fastGasLimit = ref(50000);

    const updateGasPrice = async ()=>{
      let data = await getETH_SafeGwei(swapData.gasPriceConsultURL);

      if(data.status === 0){
        console.log("Error, no data found. Please try again later");
      }
      else{
        let result = data.result;

        safeGasPriceInGwei.value = result.SafeGasPrice;
        proposedGasPriceInGwei.value = result.ProposeGasPrice;
        fastGasPriceInGwei.value = result.FastGasPrice;
      }
    }
    
    updateGasPrice();

    const currentXPX_USD = ref(0);
    const currentETH_USD = ref(0);

    const getCurrentPrice = async ()=>{

      let xpxPrices = await getCoingeckoCoinPrice("proximax");

      currentXPX_USD.value = xpxPrices.usd;

      let ethereumPrices = await getCoingeckoCoinPrice("ethereum");

      currentETH_USD.value = ethereumPrices.usd;
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

      if(feeStrategy === "trader"){
        selectedGasLimit.value = fastGasLimit.value;
        selectedGasPriceInGwei.value = fastGasPrice.value;
        gasPriceInXPX.value = xpxAmountInFastGasPrice.value;
      }
      else if(feeStrategy === "fast"){
        selectedGasLimit.value = proposedGasLimit.value;
        selectedGasPriceInGwei.value = proposedGasPrice.value;
        gasPriceInXPX.value = xpxAmountInProposedGasPrice.value;
      }
      else{
        selectedGasLimit.value = safeGasLimit.value;
        selectedGasPriceInGwei.value = safeGasPrice.value;
        gasPriceInXPX.value = xpxAmountInSafeGasPrice.value;
      }

      message2.gasPrice = selectedGasPriceInGwei.value;
      message2.gasLimit = selectedGasLimit.value;

      maxSwapAmount.value = Helper.convertNumberMinimumFormat(selectedAccount.value.balance - txFee.value - gasPriceInXPX.value, 6);
      minBalanceAmount.value = Helper.convertNumberMinimumFormat(txFee.value + gasPriceInXPX.value, 6);
      if(amount.value > maxSwapAmount.value){
        amount.value = maxSwapAmount.value;
      }

      if(selectedAccount.value.balance <= minBalanceAmount.value){
        disableAmount.value = true;
      }
      else{
        disableAmount.value = false;
      }

      rebuildTranction();
    }

    const swap = () => {
      rebuildTranction();
      currentPage.value = 3;
    };

    //page 3

    return {
      timerSecondsDisplay,
      timerMinutes,
      currentPage,
      selectAccount,
      ethAddress,
      showPasswdError,
      walletPasswd,
      passwdPattern,
      showAmountErr,
      amount,
      disableAmount,
      updateAmountToMax,
      ethGasStrategy,
      isDisabledSwap,
      swap,
      savedCheck,
      allAvailableAccounts,
      selectedAccount,
      selectedGasPriceInGwei,
      selectedGasLimit,
      safeGasPrice,
      proposedGasPrice,
      fastGasPrice,
      safeGasPriceInUSD,
      proposedGasPriceInUSD,
      fastGasPriceInUSD,
      xpxAmountInSafeGasPrice,
      xpxAmountInProposedGasPrice,
      xpxAmountInFastGasPrice,
      txFeeDisplay,
      gasPriceInXPX,
      maxSwapAmount,
      changeGasStrategy
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