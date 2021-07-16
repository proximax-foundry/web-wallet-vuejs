<template>
  <div class="flex justify-between text-md">
    <div><span class="text-gray-300">{{$t('services.assets')}} ></span> <span class="text-blue-primary font-bold">{{$t('services.modifysupply')}}</span></div>
    <div>
      <router-link :to="{ name: 'ViewServices' }" class="font-bold">{{$t('services.allservices')}}</router-link>
    </div>
  </div>
  <div class='mt-2 py-3 gray-line text-center md:grid md:grid-cols-8 lg:grid-cols-6'>
    <div class="md:col-span-5 lg:col-span-4">
      <form @submit.prevent="modifyMosaic">
        <fieldset class="w-full">
          <div class="mb-5">
            <div v-if="showNoBalance" class="border-2 rounded-3xl border-red-700 w-full h-24 text-center p-4">
              <div class="h-5 text-center">
                <div class="rounded-full w-8 h-8 border border-gray-500 inline-block relative"><font-awesome-icon icon="times" class="text-gray-500 h-5 w-5 absolute" style="top: 5px; left:8px"></font-awesome-icon></div><br>
                <div class="inline-block text-tsm">{{$t('accounts.insufficientbalance')}}</div>
              </div>
            </div>
            <div v-if="showNoAsset" class="border-2 rounded-3xl border-red-700 w-full h-24 text-center p-4">
              <div class="h-5 text-center">
                <div class="rounded-full w-8 h-8 border border-gray-500 inline-block relative"><font-awesome-icon icon="times" class="text-gray-500 h-5 w-5 absolute" style="top: 5px; left:9px"></font-awesome-icon></div><br>
                <div class="inline-block text-tsm">{{$t('services.assetmessage')}}</div>
              </div>
            </div>
            <div v-if="isNotCosigner" class="border-2 rounded-3xl border-yellow-400 w-full h-24 text-center p-4">
              <div class="h-5 text-center">
                <div class="rounded-full w-8 h-8 border border-yellow-500 inline-block relative"><font-awesome-icon icon="exclamation" class="text-yellow-500 h-5 w-5 absolute" style="top: 5px; left:11px"></font-awesome-icon></div><br>
                <div class="inline-block text-tsm">{{$t('accounts.cosigwarning2')}}</div>
              </div>
            </div>
            <div class="error error_box" v-if="err!=''">{{ err }}</div>
            <div v-if="moreThanOneAccount" class="text-left p-4">
              <div class="mb-1 cursor-pointer z-20 border-b border-gray-200" @click="showMenu = !showMenu">
                <div class="font-bold text-xs">{{ selectedAccName }} <span v-if="isMultiSigBool" class="text-xs font-normal ml-2 inline-block py-1 px-2 rounded bg-blue-200 text-gray-800">{{$t('accounts.multisig')}}</span></div>
                <div class="text-gray-400 mt-1 text-sm ">{{ selectedAccAdd }}</div>
              </div>
              <transition name="slide">
              <div v-if="showMenu" class="z-10">
                <div :key="item.address" :i="index" v-for="(item, index) in accounts" class="p-2 cursor-pointer" :class="item.name==selectedAccName?'bg-blue-primary text-white font-bold':'text-gray-800 bg-gray-50 optionDiv'" @click="changeSelection(item)" :title="'Address is ' + item.address">
                  <div>{{ item.name }} <span v-if="isMultiSig(item.address)" class="text-xs font-normal ml-2 inline-block py-1 px-2 rounded bg-blue-200 text-gray-800">{{$t('accounts.multisig')}}</span></div>
                </div>
              </div>
              </transition>
              <input type="hidden" v-model="currentSelectedName">
            </div>
            <div v-else class="text-left p-4">
              <div class="mb-1 z-20 border-b border-gray-200">
                <div class="font-bold text-xs">{{ selectedAccName }} <span v-if="isMultiSigBool" class="text-xs font-normal ml-2 inline-block py-1 px-2 rounded bg-blue-200 text-gray-800">{{$t('accounts.multisig')}}</span></div>
                <div class="text-gray-400 mt-1 text-sm ">{{ selectedAccAdd }}</div>
              </div>
            </div>
            <div v-if="getMultiSigCosigner.list.length > 0">
              <div class="text-tsm">{{$t('transfer.cosigner')}}:
                <span class="font-bold" v-if="getMultiSigCosigner.list.length == 1">{{ getMultiSigCosigner.list[0].name }} ({{$t('services.balance')}}: {{ getMultiSigCosigner.list[0].balance }} XPX) <span v-if="getMultiSigCosigner.list[0].balance < lockFundTotalFee" class="error">- {{$t('accounts.insufficientbalance')}}</span></span>
                <span class="font-bold" v-else><select v-model="cosignerAddress"><option v-for="(cosigner, item) in getMultiSigCosigner.list" :value="cosigner.address" :key="item">{{ cosigner.name }} ({{$t('services.balance')}}: {{ cosigner.balance }} XPX)</option></select></span>
                <div v-if="cosignerBalanceInsufficient" class="error">- {{$t('accounts.insufficientbalance')}}</div>
              </div>
            </div>
          </div>
          <div class="text-left p-3 pb-0 border-l-8 border-gray-100 mb-5">
            <div class="bg-gray-100 rounded-2xl p-3">
              <div class="inline-block mr-4 text-tsm"><img src="@/assets/img/icon-prx-xpx-blue.svg" class="w-5 inline mr-1">Balance: <span class="text-xs">{{ balance }} XPX</span></div>
            </div>
          </div>
          <SelectInputPlugin showSelectTitleProp="true" placeholder="Select asset" errorMessage="" ref="assetOption" noOptionsText="No asset for this account" v-model="selectAsset" :options="assetOptions" @show-selection="changeAsset" :disabled="disabledSelectAsset" />
          <SelectInputPlugin selectDefault="0" showSelectTitleProp="true" placeholder="Increase or decrease" errorMessage="" v-model="selectIncreaseDecrease" :options="increaseDecreaseOption()" :disabled="disabledSelectIncreaseDecrease" />
          <SupplyInput :disabled="disabledSupply" v-model="supply" title="Quantity of Increase/Decrease" :balance="balanceNumber" placeholder="Supply" type="text" icon="coins" :showError="showSupplyErr" :errorMessage="(!supply)?'Required Field':'Insufficient balance'" />
          <div class="rounded-2xl bg-gray-100 p-5 mb-5">
            <div class="inline-block mr-4 text-xs"><img src="@/assets/img/icon-prx-xpx-blue.svg" class="w-5 inline mr-1 text-gray-500">{{$t('namespace.transactionfee')}} {{ transactionFee }} XPX</div>
          </div>
          <PasswordInput placeholder="Enter Wallet Password" :errorMessage="'Please enter wallet password'" :showError="showPasswdError" v-model="walletPassword" icon="lock" :disabled="disabledPassword" />
          <div class="mt-10">
            <button type="button" class="default-btn mr-5 focus:outline-none disabled:opacity-50" :disabled="disabledClear" @click="clearInput()">{{$t('signin.clear')}}</button>
            <button type="submit" class="default-btn py-1 disabled:opacity-50" :disabled="disableCreate" @click="modifyMosaic()">{{$t('welcome.create')}}</button>
          </div>
        </fieldset>
      </form>
    </div>
    <div class="md:col-span-3 lg:col-span-2 pl-10 text-left text-tsm mt-5 md:mt-0 property-table">
      <div class="mb-2 border-b border-gray-300 pb-2 italic">{{$t('services.properties')}}</div>
      <div>
        <div class="italic text-right text-xs">{{$t('services.supply')}}:</div>
        <div>{{ assetSupply }}</div>
      </div>
      <div>
        <div class="italic text-right text-xs">{{$t('dashboard.amount')}}:</div>
        <div>{{ assetAmount }}</div>
      </div>
      <div>
        <div class="italic text-right text-xs">{{$t('dashboard.duration')}}:</div>
        <div>{{ assetDuration }}</div>
      </div>
      <div>
        <div class="italic text-right text-xs">{{$t('services.divisibility')}}:</div>
        <div>{{ assetDivisibility }}</div>
      </div>
      <div>
        <div class="italic text-right text-xs">{{$t('services.transferable')}}:</div>
        <div>
          <font-awesome-icon v-if="assetTransferable" icon="check-circle" class="h-4 w-4 text-green-600"></font-awesome-icon>
          <font-awesome-icon v-else icon="times-circle" class="h-4 w-d text-red-600"></font-awesome-icon>
        </div>
      </div>
      <div>
        <div class="italic text-right text-xs">{{$t('services.supplymutable')}}:</div>
        <div>
          <font-awesome-icon v-if="assetMutable" icon="check-circle" class="h-4 w-4 text-green-600"></font-awesome-icon>
          <font-awesome-icon v-else icon="times-circle" class="h-4 w-d text-red-600"></font-awesome-icon>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { computed, ref, getCurrentInstance, watch } from 'vue';
// import { useRouter } from "vue-router";
import PasswordInput from '@/components/PasswordInput.vue';
import SupplyInput from '@/components/SupplyInput.vue';
import SelectInputPlugin from '@/components/SelectInputPlugin.vue';
import { ChainProfileConfig } from "@/models/stores/";
import { Wallet } from "@/models/wallet";
import { walletState } from "@/state/walletState";
import { networkState } from "@/state/networkState";
import { Currency } from "@/models/currency";
import { Helper } from '@/util/typeHelper';
import { ChainUtils } from '@/util/chainUtils';
import { AssetsUtils } from '@/util/assetsUtils';
import { WalletUtils } from '@/util/walletUtils';

export default {
  name: 'ViewServicesAssetsModifySupplyChange',
  components: {
    PasswordInput,
    SupplyInput,
    SelectInputPlugin,
  },
  setup(){
    const internalInstance = getCurrentInstance();
    const emitter = internalInstance.appContext.config.globalProperties.emitter;
    const assetOption = ref(null);
    const showSupplyErr = ref(false);
    const walletPassword = ref('');
    const err = ref('');
    const showMenu = ref(false);
    const currentSelectedName = ref('');
    const disabledPassword = ref(false);
    const disabledSupply = ref(false);
    const disabledClear = ref(false);
    const disabledSelectAsset = ref(false);
    const disabledSelectIncreaseDecrease = ref(false);

    const passwdPattern = "^[^ ]{8,}$";
    const showPasswdError = ref(false);

    const cosignerBalanceInsufficient = ref(false);
    const cosignerAddress = ref('');

    const currencyName = computed(() => networkState.currentNetworkProfile.network.currency.name);
    const rentalFee = computed(()=> Helper.convertToExact(networkState.currentNetworkProfileConfig.mosaicRentalFee, networkState.currentNetworkProfile.network.currency.divisibility) );
    const rentalFeeCurrency = computed(()=> Helper.convertToCurrency(networkState.currentNetworkProfileConfig.mosaicRentalFee, networkState.currentNetworkProfile.network.currency.divisibility) );

    const lockFund = computed(()=> Helper.convertToExact(networkState.currentNetworkProfileConfig.lockedFundsPerAggregate, networkState.currentNetworkProfile.network.currency.divisibility))
    const lockFundCurrency = computed(()=> Helper.convertToCurrency(networkState.currentNetworkProfileConfig.lockedFundsPerAggregate, networkState.currentNetworkProfile.network.currency.divisibility))

    const lockFundTxFee = ref(0.0445);
    const lockFundTotalFee = computed(()=> lockFund.value + lockFundTxFee.value);


    const disableCreate = computed(() => !(
      walletPassword.value.match(passwdPattern) && (supply.value > 0)
    ));

    const isMultiSig = (address) => {
      const account = walletState.currentLoggedInWallet.accounts.find((account) => account.address == address);
      let isMulti = false;
      if(account.getDirectParentMultisig().length > 0){
        isMulti = true;
      }
      return isMulti;
    };

    const selectedAccName = ref(walletState.currentLoggedInWallet.selectDefaultAccount().name);
    const selectedAccAdd = ref(walletState.currentLoggedInWallet.selectDefaultAccount().address);
    const balance = ref(Helper.toCurrencyFormat(walletState.currentLoggedInWallet.selectDefaultAccount().balance, networkState.currentNetworkProfile.network.currency.divisibility));
    const balanceNumber = walletState.currentLoggedInWallet.selectDefaultAccount().balance;
    const isMultiSigBool = ref(isMultiSig(walletState.currentLoggedInWallet.selectDefaultAccount().address));

    const showNoBalance = ref(false);
    const showNoAsset = ref(false);
    const isNotCosigner = computed(() => getMultiSigCosigner.value.list.length == 0 && isMultiSig(selectedAccAdd.value) && !showNoAsset.value);

    const supply = ref('0');
    const accounts = computed( () => walletState.currentLoggedInWallet.accounts);
    const moreThanOneAccount = computed(()=> (walletState.currentLoggedInWallet.accounts.length > 1)?true:false);
    const transactionFee = ref('0.000000');
    const transactionFeeExact = ref(0);

    const ownerPublicAccount = ref(WalletUtils.createPublicAccount(walletState.currentLoggedInWallet.selectDefaultAccount().publicKey, networkState.currentNetworkProfile.network.type));

    const getMultiSigCosigner = computed(() => {
      return AssetsUtils.getCosignerList(selectedAccAdd.value);
    });

    const changeSelection = (i) => {
      assetOption.value.clear();
      selectedAccName.value = i.name;
      selectedAccAdd.value = i.address;
      balance.value = i.balance;
      showMenu.value = !showMenu.value;
      currentSelectedName.value = i.name;
      isMultiSigBool.value = isMultiSig(i.address);
      ownerPublicAccount.value = WalletUtils.createPublicAccount(i.publicKey, networkState.currentNetworkProfile.network.type);
      showNoAsset.value = (assetOptions.value.length == 0)?true:false;
      showNoBalance.value = ((balance.value < rentalFee.value) && !isNotCosigner.value && !showNoAsset.value)?true:false;
    }

    const assetSupply = ref(0);
    const assetAmount = ref(0);
    const assetDuration = ref('0 Day');
    const assetDivisibility = ref(0);
    const assetTransferable = ref(false);
    const assetMutable = ref(false);

    const changeAsset = (assetId) => {
      const selectedAsset = walletState.currentLoggedInWallet.selectDefaultAccount().assets.find((asset) => asset.idHex === assetId);
      assetSupply.value =Helper.amountFormatterSimple(selectedAsset.supply, selectedAsset.divisibility);
      if(selectedAsset.duration){
        assetDuration.value = selectedAsset.duration = ' Day' + ((selectedAsset.duration>1)?'s':'');
      }else{
        assetDuration.value = 'No expiration date';
      }
      assetAmount.value = selectedAsset.amount;
      assetDivisibility.value = selectedAsset.divisibility;
      assetTransferable.value = selectedAsset.transferable;
      assetMutable.value = selectedAsset.supplyMutable;
      transactionFee.value = Helper.amountFormatterSimple(AssetsUtils.getMosaicSupplyChangeTransactionFee(networkState.currentNetworkProfile.network.type, networkState.currentNetworkProfile.generationHash, ownerPublicAccount.value, assetId, selectIncreaseDecrease.value, supply.value), networkState.currentNetworkProfile.network.currency.divisibility);
      transactionFeeExact.value = Helper.convertToExact(AssetsUtils.getMosaicSupplyChangeTransactionFee(networkState.currentNetworkProfile.network.type, networkState.currentNetworkProfile.generationHash, ownerPublicAccount.value, assetId, selectIncreaseDecrease.value, supply.value), networkState.currentNetworkProfile.network.currency.divisibility);
    };

    const assetOptions = computed(() => {
      return AssetsUtils.getOwnedAssets(selectedAccAdd.value);
    });

    const increaseDecreaseOption = () => {
      let action = [];
      action.push({value: 0, label: 'Decrease'});
      action.push({value: 1, label: 'Increase'});
      return action;
    };

    const selectAsset = ref('');
    const selectIncreaseDecrease = ref(0);

    const clearInput = () => {
      walletPassword.value = '';
      supply.value = '0';
      assetOption.value.clear();
    };

    const modifyMosaic = () => {
      console.log('Modify mosaic');
    };

    watch(selectIncreaseDecrease, (n) => {
      if(selectAsset.value){
        transactionFee.value = Helper.amountFormatterSimple(AssetsUtils.getMosaicSupplyChangeTransactionFee(networkState.currentNetworkProfile.network.type, networkState.currentNetworkProfile.generationHash, ownerPublicAccount.value, selectAsset.value, n, supply.value), networkState.currentNetworkProfile.network.currency.divisibility);
        transactionFeeExact.value = Helper.convertToExact(AssetsUtils.getMosaicSupplyChangeTransactionFee(networkState.currentNetworkProfile.network.type, networkState.currentNetworkProfile.generationHash, ownerPublicAccount.value, selectAsset.value, n, supply.value), networkState.currentNetworkProfile.network.currency.divisibility);
      }
    });

    watch(supply, (n) => {
      if(selectAsset.value){
        transactionFee.value = Helper.amountFormatterSimple(AssetsUtils.getMosaicSupplyChangeTransactionFee(networkState.currentNetworkProfile.network.type, networkState.currentNetworkProfile.generationHash, ownerPublicAccount.value, selectAsset.value, selectIncreaseDecrease.value, n), networkState.currentNetworkProfile.network.currency.divisibility);
        transactionFeeExact.value = Helper.convertToExact(AssetsUtils.getMosaicSupplyChangeTransactionFee(networkState.currentNetworkProfile.network.type, networkState.currentNetworkProfile.generationHash, ownerPublicAccount.value, selectAsset.value, selectIncreaseDecrease.value, n), networkState.currentNetworkProfile.network.currency.divisibility);
      }
    });

    const totalFee = computed(() => {
      // if multisig
      if(isMultiSig(selectedAccAdd.value)){
        return parseFloat(lockFundTotalFee.value) + rentalFee.value + transactionFeeExact.value;
      }else{
        return rentalFee.value + transactionFeeExact.value;
      }
    });

    const setFormInput = (isValidate) => {
      disabledPassword.value = isValidate;
      disabledSupply.value = isValidate;
      disabledSelectAsset.value = isValidate;
      disabledSelectIncreaseDecrease.value = isValidate;
    };

    watch(totalFee, (n) => {
      if(balance.value < n){
        if(!showNoAsset.value){
          if(!isNotCosigner.value){
            showNoBalance.value = true;
          }
        }
        setFormInput(true);
      }else{
        showNoBalance.value = false;
        setFormInput(false);
      }
    });

    watch(showNoAsset, (n) => {
      if(n){
        setFormInput(true);
      }else{
        setFormInput(false);
      }
    });

    watch(showNoBalance, (n) => {
      if(n){
        setFormInput(true);
      }else{
        setFormInput(false);
      }
    });

    watch(isNotCosigner, (n) => {
      if(n){
        setFormInput(true)
      }else{
        setFormInput(false);
      }
    });

    return {
      assetOption,
      accounts,
      moreThanOneAccount,
      showMenu,
      currentSelectedName,
      selectedAccName,
      selectedAccAdd,
      balance,
      balanceNumber,
      showNoBalance,
      lockFundTotalFee,
      showNoAsset,
      showSupplyErr,
      err,
      walletPassword,
      disableCreate,
      clearInput,
      showPasswdError,
      changeSelection,
      supply,
      disabledPassword,
      disabledSupply,
      disabledClear,
      currencyName,
      isMultiSig,
      isMultiSigBool,
      assetOptions,
      increaseDecreaseOption,
      selectAsset,
      selectIncreaseDecrease,
      modifyMosaic,
      transactionFee,
      transactionFeeExact,
      changeAsset,
      assetSupply,
      assetAmount,
      assetDuration,
      assetDivisibility,
      assetTransferable,
      assetMutable,
      getMultiSigCosigner,
      cosignerBalanceInsufficient,
      cosignerAddress,
      isNotCosigner,
      disabledSelectAsset,
      disabledSelectIncreaseDecrease,
    }
  },

}
</script>
<style scoped lang="scss">

.slide-enter-active {
   -moz-transition-duration: 1s;
   -webkit-transition-duration: 1s;
   -o-transition-duration: 1s;
   transition-duration: 1s;
   -moz-transition-timing-function: ease-in;
   -webkit-transition-timing-function: ease-in;
   -o-transition-timing-function: ease-in;
   transition-timing-function: ease-in;
}

.slide-leave-active {
   -moz-transition-duration: 1s;
   -webkit-transition-duration: 1s;
   -o-transition-duration: 1s;
   transition-duration: 1s;
   -moz-transition-timing-function: cubic-bezier(0, 1, 0.5, 1);
   -webkit-transition-timing-function: cubic-bezier(0, 1, 0.5, 1);
   -o-transition-timing-function: cubic-bezier(0, 1, 0.5, 1);
   transition-timing-function: cubic-bezier(0, 1, 0.5, 1);
}

.slide-enter-to, .slide-leave-from {
  max-height: 1000px;
  overflow: hidden;
}

.slide-enter-from, .slide-leave-to {
   overflow: hidden;
   max-height: 0;
}

.optionDiv:hover{
  background: #D9EBFF;
}

.property-table{
  > div {
    margin-bottom: 7px;
    > div{
      display: inline-block;
    }
    > div:first-child{
      width: 75px;
      margin-right: 15px;
    }
  }
}

@media(min-width: 1024px){
  .property-table{
    > div {
      > div:first-child{
        width: 90px;
      }
    }
  }
}
</style>
