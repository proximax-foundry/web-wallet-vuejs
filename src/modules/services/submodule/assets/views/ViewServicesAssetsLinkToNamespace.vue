<template>
  <div class="flex justify-between text-md">
    <div><span class="text-gray-300">{{$t('services.assets')}} ></span> <span class="text-blue-primary font-bold">{{$t('services.linktonamespace')}}</span></div>
    <div>
      <router-link :to="{ name: 'ViewServices' }" class="font-bold">{{$t('services.allservices')}}</router-link>
    </div>
  </div>
  <div class='mt-2 py-3 gray-line text-center px-0 lg:px-10 xl:px-80'>
    <div class="md:col-span-3">
      <form @submit.prevent="linkNamespace">
        <fieldset class="w-full">
          <div class="mb-5">
            <div v-if="showNoBalance" class="border-2 rounded-3xl border-red-700 w-full h-24 text-center p-4">
              <div class="h-5 text-center">
                <div class="rounded-full w-8 h-8 border border-gray-500 inline-block relative"><font-awesome-icon icon="times" class="text-gray-500 h-5 w-5 absolute" style="top: 5px; left:4px"></font-awesome-icon></div><br>
                <div class="inline-block text-tsm">{{$t('accounts.insufficientbalance')}}</div>
              </div>
            </div>
            <div v-if="isNotCosigner" class="border-2 rounded-3xl border-yellow-400 w-full h-24 text-center p-4">
              <div class="h-5 text-center">
                <div class="rounded-full w-8 h-8 border border-yellow-500 inline-block relative"><font-awesome-icon icon="exclamation" class="text-yellow-500 h-5 w-5 absolute" style="top: 5px; left:11px"></font-awesome-icon></div><br>
                <div class="inline-block text-tsm">You are not a cosigner to this account</div>
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
                <div class="font-bold text-xs">{{ selectedAccName }} <span v-if="isMultiSigBool" class="text-xs font-normal ml-2 inline-block py-1 px-2 rounded bg-blue-200 text-gray-800">Multisig</span></div>
                <div class="text-gray-400 mt-1 text-sm ">{{ selectedAccAdd }}</div>
              </div>
            </div>
            <div v-if="getMultiSigCosigner.list.length > 0">
              <div class="text-tsm">Cosigner:
                <span class="font-bold" v-if="getMultiSigCosigner.list.length == 1">{{ getMultiSigCosigner.list[0].name }} (Balance: {{ getMultiSigCosigner.list[0].balance }} XPX) <span v-if="getMultiSigCosigner.list[0].balance < lockFundTotalFee" class="error">- Insufficient balance</span></span>
                <span class="font-bold" v-else><select v-model="cosignerAddress"><option v-for="(cosigner, item) in getMultiSigCosigner.list" :value="cosigner.address" :key="item">{{ cosigner.name }} (Balance: {{ cosigner.balance }} XPX)</option></select></span>
                <div v-if="cosignerBalanceInsufficient" class="error">- Insufficient balance</div>
              </div>
            </div>
          </div>
          <div class="text-left p-3 pb-0 border-l-8 border-gray-100 mb-5">
            <div class="bg-gray-100 rounded-2xl p-3">
              <div class="inline-block mr-4 text-tsm"><img src="@/assets/img/icon-prx-xpx-blue.svg" class="w-5 inline mr-1">{{$t('services.balance')}}: <span class="text-xs">{{ balance }} XPX</span></div>
            </div>
          </div>
          <SelectInputPlugin showSelectTitleProp="true" placeholder="Select action" errorMessage="" v-model="selectAction" :disabled="disabledAction" :options="actions"  />
          <SelectInputPlugin showSelectTitleProp="true" placeholder="Select namespace" errorMessage="" ref="selectNamespaceRef" :disabled="disabledNamespaceSelection" noOptionsText="No namespace for this account" v-model="selectNamespace" :options="namespaceOptions" :selectedAddress="selectedAccAdd" :selectedAction="selectAction" @show-selection="namespaceSelected" @clear-selection="clearNamespaceSelection" />
          <SelectInputPlugin v-show="selectAction=='link'" showSelectTitleProp="true" placeholder="Select asset" errorMessage="" ref="selectAssetRef" :disabled="disabledAssetSelection" noOptionsText="No asset for this account" v-model="selectAsset" :options="assetOptions" @show-selection="assetSelected" />
          <div class="rounded-2xl bg-gray-100 p-5 mb-5">
            <div class="inline-block mr-4 text-xs"><img src="@/assets/img/icon-prx-xpx-blue.svg" class="w-5 inline mr-1 text-gray-500">{{$t('namespace.transactionfee')}}: <span class="text-txs">{{ transactionFee }}</span> XPX</div>
          </div>
          <div class="p-4 rounded-xl bg-gray-100 mt-2 items-center w-full text-xs text-gray-800 mb-5" v-if="isMultiSig(selectedAccAdd)">
            <div class="text-center">
              <div class="inline-block">
                <div class="flex">
                  <img src="@/assets/img/icon-prx-xpx-blue.svg" class="w-5 inline-block mr-1 self-center">
                  <div class="inline-block self-center text-left">
                    <div>LockFund: {{ lockFundCurrency }} {{ currencyName }}</div>
                    <div>Unconfirmed/Recommended Fee: {{ lockFundTxFee }} {{ currencyName }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <PasswordInput placeholder="Enter Wallet Password" :errorMessage="'Please enter wallet password'" :showError="showPasswdError" v-model="walletPassword" icon="lock" :disabled="disabledPassword" />
          <div class="mt-10">
            <button type="button" class="default-btn mr-5 focus:outline-none disabled:opacity-50" :disabled="disabledClear" @click="clearInput()">{{$t('signin.clear')}}</button>
            <button type="submit" class="default-btn py-1 disabled:opacity-50" :disabled="disableCreate" @click="linkNamespace()">{{$t('welcome.create')}}</button>
          </div>
        </fieldset>
      </form>
    </div>
  </div>
</template>
<script>
import { computed, ref, watch } from 'vue';
// import { useRouter } from "vue-router";
import PasswordInput from '@/components/PasswordInput.vue';
import SelectInputPlugin from '@/components/SelectInputPlugin.vue';
// import SelectInputNamespaceAsyncOptionPlugin from '@/modules/services/submodule/assets/components/SelectInputNamespaceAsyncOptionPlugin.vue';
import { walletState } from "@/state/walletState";
import { networkState } from "@/state/networkState";
import { Helper } from '@/util/typeHelper';
import { AssetsUtils } from '@/util/assetsUtils';


export default {
  name: 'ViewMosaicLinkToNamespace',
  components: {
    PasswordInput,
    SelectInputPlugin,
    // SelectInputNamespaceAsyncOptionPlugin,
  },
  setup(){
    const selectNamespaceRef = ref(null);
    const selectAssetRef = ref(null);
    const walletPassword = ref('');
    const err = ref('');
    const showMenu = ref(false);
    const currentSelectedName = ref('');
    const disabledPassword = ref(false);
    const disabledClear = ref(false);

    const disabledAction = ref(false);
    const disabledAssetSelection = ref(true);
    const disabledNamespaceSelection = ref(false);

    const selectAction = ref('');
    const actions = computed(() => {
      let action = [];
      action.push({value: 'link', label: 'Link'});
      action.push({value: 'unlink', label: 'Unlink'});
      return action;
    });
    const selectNamespace = ref('');

    // const namespaceOption = computed(() => {
    //   // console.log(selectedAccAdd.value);
    //   const namespacesList = NamespacesUtils.listNamespacesToLink(selectedAccAdd.value, selectAction.value);
    //   // console.log(namespacesList)
    //   return namespacesList;
    // });

    const passwdPattern = "^[^ ]{8,}$";
    const showPasswdError = ref(false);

    const cosignerBalanceInsufficient = ref(false);
    const cosignerAddress = ref('');

    const currencyName = computed(() => networkState.currentNetworkProfile.network.currency.name);

    const lockFund = computed(()=> Helper.convertToExact(networkState.currentNetworkProfileConfig.lockedFundsPerAggregate, networkState.currentNetworkProfile.network.currency.divisibility))
    const lockFundCurrency = computed(()=> Helper.convertToCurrency(networkState.currentNetworkProfileConfig.lockedFundsPerAggregate, networkState.currentNetworkProfile.network.currency.divisibility))

    const lockFundTxFee = ref(0.0445);
    const lockFundTotalFee = computed(()=> lockFund.value + lockFundTxFee.value);

    const disableCreate = computed(() => !(
      walletPassword.value.match(passwdPattern)
    ));

    const isMultiSig = (address) => {
      const account = walletState.currentLoggedInWallet.accounts.find((account) => account.address == address);
      let isMulti = false;
      if(account.getDirectParentMultisig().length>0){
        isMulti = true;
      }
      return isMulti;
    };

    const selectedAccName = ref(walletState.currentLoggedInWallet.selectDefaultAccount().name);
    const selectedAccAdd = ref(walletState.currentLoggedInWallet.selectDefaultAccount().address);
    const balance = ref(Helper.toCurrencyFormat(walletState.currentLoggedInWallet.selectDefaultAccount().balance, networkState.currentNetworkProfile.network.currency.divisibility));
    const isMultiSigBool = ref(isMultiSig(walletState.currentLoggedInWallet.selectDefaultAccount().address));

    const showNoBalance = ref(false);
    const isNotCosigner = computed(() => getMultiSigCosigner.value.list.length == 0 && isMultiSig(selectedAccAdd.value));

    const accounts = computed( () => walletState.currentLoggedInWallet.accounts);
    const moreThanOneAccount = computed(()=> (walletState.currentLoggedInWallet.accounts.length > 1)?true:false);

    const transactionFee = ref('0.000000');
    const transactionFeeExact = ref(0);

    const getMultiSigCosigner = computed(() => {
      return AssetsUtils.getCosignerList(selectedAccAdd.value);
    });

    const changeSelection = (i) => {
      selectNamespaceRef.value.clear();
      selectAssetRef.value.clear();
      selectedAccName.value = i.name;
      selectedAccAdd.value = i.address;
      balance.value = i.balance;
      isMultiSigBool.value = isMultiSig(i.address);
      if(isMultiSigBool.value){
        if((balance.value < (transactionFeeExact.value + lockFundTotalFee.value)) && !isNotCosigner.value && !showNoAsset.value){
          showNoBalance.value = true;
        }else{
          showNoBalance.value = false;
        }
      }else{
        if((balance.value < transactionFeeExact.value) && !isNotCosigner.value && !showNoAsset.value){
          showNoBalance.value = true;
        }else{
          showNoBalance.value = false;
        }
      }
      showMenu.value = !showMenu.value;
      currentSelectedName.value = i.name;
    }

    const assetOptions = computed(() => {
      return AssetsUtils.getOwnedAssets(selectedAccAdd.value);
    });

    const namespaceOptions = computed(() => {
      return AssetsUtils.listActiveNamespacesToLink(selectedAccAdd.value, selectAction.value);
    });

    const selectAsset = ref('');

    const clearInput = () => {
      walletPassword.value = '';
      selectNamespaceRef.value.clear();
      selectAssetRef.value.clear()
    };

    const linkNamespace = () => {
      console.log('Link namespace method here');
      let assetId;
      if(selectAction.value=='link'){
        assetId = selectAsset.value;
      }else{
        assetId = walletState.currentLoggedInWallet.accounts.find(account => account.address === selectedAccAdd.value).namespaces.find(namespace => namespace.name === selectNamespace.value).linkedId;
      }
      AssetsUtils.linkedNamespaceToAsset(selectedAccAdd.value, walletPassword.value, networkState.currentNetworkProfile.network.type, networkState.currentNetworkProfile.generationHash, assetId, selectNamespace.value, selectAction.value );
      clearInput();
    };

    const clearNamespaceSelection = () => {
      selectAssetRef.value.clear()
      disabledAssetSelection.value = true;
    };

    const namespaceSelected = () => {
      disabledAssetSelection.value = false;
    };

    const assetSelected = () => {
      transactionFee.value = Helper.amountFormatterSimple(AssetsUtils.getLinkAssetToNamespaceTransactionFee(networkState.currentNetworkProfile.network.type, networkState.currentNetworkProfile.generationHash, selectAsset.value, selectNamespace.value, selectAction.value ), networkState.currentNetworkProfile.network.currency.divisibility);
      transactionFeeExact.value = Helper.convertToExact(AssetsUtils.getLinkAssetToNamespaceTransactionFee(networkState.currentNetworkProfile.network.type, networkState.currentNetworkProfile.generationHash, selectAsset.value, selectNamespace.value, selectAction.value), networkState.currentNetworkProfile.network.currency.divisibility);
    };

    const setFormInput = (isValidate) => {
      disabledAction.value = isValidate;
      disabledPassword.value = isValidate;
      disabledNamespaceSelection.value = isValidate;
      disabledAssetSelection.value = isValidate;
    };

    const totalFee = computed(() => {
      // if multisig
      if(isMultiSig(selectedAccAdd.value)){
        return parseFloat(lockFundTotalFee.value) + transactionFeeExact.value;
      }else{
        return transactionFeeExact.value;
      }
    });

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

    watch(selectAction, () => {
      selectNamespaceRef.value.clear();
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
      accounts,
      selectNamespaceRef,
      selectAssetRef,
      moreThanOneAccount,
      showMenu,
      currentSelectedName,
      selectedAccName,
      selectedAccAdd,
      balance,
      showNoBalance,
      lockFundCurrency,
      lockFundTxFee,
      lockFundTotalFee,
      err,
      walletPassword,
      disableCreate,
      clearInput,
      showPasswdError,
      changeSelection,
      disabledAction,
      disabledNamespaceSelection,
      disabledAssetSelection,
      disabledPassword,
      disabledClear,
      currencyName,
      isMultiSig,
      isMultiSigBool,
      assetOptions,
      namespaceOptions,
      selectAsset,
      actions,
      selectAction,
      selectNamespace,
      linkNamespace,
      getMultiSigCosigner,
      cosignerBalanceInsufficient,
      cosignerAddress,
      isNotCosigner,
      clearNamespaceSelection,
      namespaceSelected,
      assetSelected,
      transactionFee,
      transactionFeeExact,
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
      width: 120px;
      margin-right: 15px;
    }
  }
}
</style>
