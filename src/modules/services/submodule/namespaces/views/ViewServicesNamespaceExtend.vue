<template>
 <div>
  <div class="flex cursor-pointer mt-8 ml-8 lg:ml-0 lg:absolute">
    <img src='@/assets/img/chevron_left.svg'>
    <router-link :to="{name: 'ViewServicesNamespace'}" class='text-blue-primary text-xs mt-0.5'>Back</router-link>
  </div>
  <div class='w-10/12 ml-auto mr-auto'>
    <div class="border filter shadow-lg xl:grid xl:grid-cols-3 mt-8" >
      <div class="xl:col-span-2 p-6 lg:p-12">
        <div class="lg:flex lg:justify-between lg:items-center">
          <div class='font-semibold mb-4 inline-block mt-1'>Extend Duration</div>
          <div class="flex items-center">
            <div v-html="svgString" class="inline-block" />
            <div class="ml-2">
              <div class="text-blue-primary text-xxs font-bold uppercase mb-1">Namespace created in</div>
              <div class="font-bold text-black text-sm">{{ selectedAccName }}</div>
            </div>
          </div>
        </div>

        <div v-if="showNoBalance" class="rounded-md bg-red-200 w-full p-2 flex items-center justify-center">
          <div class="rounded-full w-5 h-5 border border-red-500 inline-block relative mr-2"><font-awesome-icon icon="times" class="text-red-500 h-3 w-3 absolute" style="top: 3px; left:4px"></font-awesome-icon></div><div class="inline-block text-xs">{{$t('accounts.insufficientbalance')}}</div>
        </div>
        <div v-else-if="isNotCosigner" class="rounded-md bg-yellow-200 w-full p-2 flex items-center justify-center">
          <div class="rounded-full w-5 h-5 bg-yellow-100 inline-block relative mr-2"><font-awesome-icon icon="exclamation" class="text-yellow-500 h-3 w-3 absolute" style="top: 5px; left:7px"></font-awesome-icon></div><div class="inline-block text-xs">{{$t('accounts.cosigwarning2')}}</div>
        </div>
        <div class="error error_box" v-if="err!=''">{{ err }}</div>
        <div class="text-right w-full">
          <div v-if="getMultiSigCosigner.list.length > 0" class="inline-block">
            <div class="text-tsm text-left mt-3">{{$t('transfer.cosigner')}}:
              <span class="font-bold" v-if="getMultiSigCosigner.list.length == 1">{{ getMultiSigCosigner.list[0].name }} ({{$t('services.balance')}}: {{ Helper.amountFormatterSimple(getMultiSigCosigner.list[0].balance, 0) }} {{ currentNativeTokenName }}) <span v-if="getMultiSigCosigner.list[0].balance < lockFundTotalFee" class="error">- {{$t('accounts.insufficientbalance')}}</span></span>
              <div v-if="cosignerBalanceInsufficient" class="error">- {{$t('accounts.insufficientbalance')}}</div>
            </div>
          </div>
        </div>
        <div class="border border-blue-primary p-4 bg-blue-100 flex items-center rounded mt-5">
          <img src="@/modules/services/submodule/namespaces/img/icon-namespace.svg">
          <div class="ml-1">
            <div class="uppercase text-blue-primary font-semibold text-xxs">Namespace</div>
            <div class="text-black text-sm font-bold">{{ selectNamespace }}</div>
          </div>
        </div>
        <DurationInputClean class="mt-5" :disabled="disabledDuration" v-model="duration" :max="maxDurationInDays" placeholder="Duration (number of days)" :showError="showDurationErr" errorMessage="Required Field - Only Numbers (0 - 6)" :toolTip="`Maximum rental duration is<br>${maxDurationInDays === 365 ? '1 year ' : ''}(${maxDurationInDays} days).`" />
        <div v-if="showMaxDaysLabel" class="text-xs inline-block text-gray-400">Maximum number of days for the extension of this namespace is {{ maxDurationInDays-numDaysleft }} day{{ (maxDurationInDays-numDaysleft)>1?'s':'' }}</div>
      </div>
      <div class="bg-navy-primary py-6 px-12 xl:col-span-1">
        <div class="font-semibold text-xxs text-blue-primary">ACCOUNT CURRENT BALANCE</div>
        <div class="flex text-gray-200 mb-5">
          <span v-html="splitCurrency(balance)"></span>
          <img src="@/modules/account/img/proximax-logo.svg" class='ml-1 h-5 w-5 mt-0.5'>
        </div>
        <div class="flex justify-between border-gray-600 border-b items-center text-gray-200 text-xs py-3">
          <div class="font-semibold">Transaction Fee</div>
          <div v-html="splitCurrency(transactionFee)"></div>
        </div>
        <div class="flex justify-between border-gray-600 border-b items-center text-gray-200 text-xs py-3">
          <div class="font-semibold">Rental Fee</div>
          <div v-html="splitCurrency(rentalFeeCurrency)"></div>
        </div>
        <div class="flex justify-between border-gray-600 border-b items-center text-gray-200 text-xs py-3" v-if="isMultiSig(selectedAccAdd)">
          <div class="font-semibold">{{$t('accounts.lockfund')}}</div>
          <div v-html="splitCurrency(lockFundCurrency)"></div>
        </div>
        <div class="flex justify-between border-gray-600 border-b items-center text-gray-200 text-xs py-3" v-if="isMultiSig(selectedAccAdd)">
          <div class="font-semibold">{{$t('accounts.unconfirmed')}}</div>
          <div v-html="splitCurrency(lockFundTxFee)"></div>
        </div>
        <div class="flex justify-between border-gray-600 text-white text-xs py-5">
          <div class="font-bold uppercase">Total</div>
          <div v-html="splitCurrency(totalFeeFormatted)"></div>
        </div>
        <div class='text-xs text-white mt-5'>Enter your password to continue</div>
        <div class='text-xs text-gray-400 mt-0.5 mb-1.5' >For security, this is required before proceeding to payment.</div>
        <PasswordInput :placeholder="$t('signin.enterpassword')" errorMessage="Wallet password is required" :showError="showPasswdError" v-model="walletPassword" :disabled="disabledPassword" />
        <button type="submit" class="mt-3 w-full blue-btn py-4 disabled:opacity-50 disabled:cursor-auto text-white" :disabled="disableCreate" @click="extendNamespace">Extend Duration</button>
        <div class="text-center">
          <router-link :to="{name: 'ViewServicesNamespace'}" class='content-center text-xs text-white border-b-2 border-white'>Cancel</router-link>
        </div>
      </div>
    </div>
  </div>
</div>
</template>
<script>
import { computed, ref, watch } from 'vue';
import { useRouter } from "vue-router";
import PasswordInput from '@/components/PasswordInput.vue';
import DurationInputClean from '@/modules/services/submodule/namespaces/components/DurationInputClean.vue';
import { walletState } from "@/state/walletState";
import { networkState } from "@/state/networkState";
import { Helper } from '@/util/typeHelper';
import { NamespaceUtils } from '@/util/namespaceUtils';
import { ChainAPICall } from "@/models/REST/chainAPICall";
import { ChainUtils } from "@/util/chainUtils";
import { listenerState} from "@/state/listenerState";
import { toSvg } from "jdenticon";
import { useToast } from "primevue/usetoast";
import { ThemeStyleConfig } from '@/models/stores/themeStyleConfig';
import { UnitConverter } from '@/util/unitConverter';
import { TimeUnit } from '@/models/const/timeUnit';

export default {
  name: 'ViewServicesNamespaceExtend',
  components: {
    PasswordInput,
    DurationInputClean,
  },
  props: {
    namespaceId: String,
    address: String,
  },
  setup(props){
    const router = useRouter();
    const toast = useToast();
    const namespaceSelect = ref(null);
    const showDurationErr = ref(false);
    const duration = ref("1");
    const walletPassword = ref('');
    const err = ref('');
    const disabledPassword = ref(false);
    const disabledDuration = ref(false);
    const passwdPattern = "^[^ ]{8,}$";
    const showPasswdError = ref(false);
    const selectNamespace = ref('');
    const showDuration = ref(false);
    const cosignerBalanceInsufficient = ref(false);
    const cosignerAddress = ref('');
    // const startBlock = ref(0);
    const block = ref(0);
    const endBlock = ref(0);
    const numDaysleft = ref(0);
    const showMaxDaysLabel = ref(false);
    const maxDurationInDays = Math.floor(UnitConverter.configReturn(networkState.currentNetworkProfileConfig.maxNamespaceDuration, TimeUnit.DAY));

    const blockListener = computed(()=> listenerState.currentBlock);

    const currentNativeTokenName = computed(()=> networkState.currentNetworkProfile.network.currency.name);

    (async() => {
      const endpoint = ChainUtils.buildAPIEndpoint(networkState.selectedAPIEndpoint, networkState.currentNetworkProfile.httpPort);
      const chainAPICall = new ChainAPICall(endpoint);
      block.value = await chainAPICall.chainAPI.getBlockchainHeight();
    })();

    const namespaceOption = computed(() => {
      let namespace = [];
      const namespacesList = NamespaceUtils.listRootNamespaces(selectedAccAdd.value);
      namespace.push.apply(namespace, namespacesList);
      return namespace;
    });

    const currencyName = computed(() => networkState.currentNetworkProfile.network.currency.name);
    const rentalFee = computed(()=> {
      if(duration.value > 0){
        return Helper.convertToExact(networkState.currentNetworkProfileConfig.rootNamespaceRentalFeePerBlock * NamespaceUtils.calculateDuration(duration.value), networkState.currentNetworkProfile.network.currency.divisibility);
      }else{
        return Helper.convertToExact(networkState.currentNetworkProfileConfig.rootNamespaceRentalFeePerBlock, networkState.currentNetworkProfile.network.currency.divisibility);
      }
    });

    const rentalFeeCurrency = computed(()=> Helper.toCurrencyFormat(rentalFee.value, 6) );

    const lockFund = computed(()=> Helper.convertToExact(networkState.currentNetworkProfileConfig.lockedFundsPerAggregate, networkState.currentNetworkProfile.network.currency.divisibility))
    const lockFundCurrency = computed(()=> Helper.amountFormatterSimple(networkState.currentNetworkProfileConfig.lockedFundsPerAggregate, networkState.currentNetworkProfile.network.currency.divisibility))

    const lockFundTxFee = ref(0.0445);
    const lockFundTxFeeCurrency = ref('0.044500');
    const lockFundTotalFee = computed(()=> lockFund.value + lockFundTxFee.value);

    const disableCreate = computed(() => !(
      walletPassword.value.match(passwdPattern) && (!showDurationErr.value) && (!showNoBalance.value) && (!isNotCosigner.value)
    ));

    const isMultiSig = (address) => {
      const account = walletState.currentLoggedInWallet.accounts.find((account) => account.address == address);
      const other = walletState.currentLoggedInWallet.others.find((account) => account.address == address);
      let isMulti = false;
      const accountDirectParent = account?account.getDirectParentMultisig():[];
      const otherDirectParent = other?other.getDirectParentMultisig():[];
      if((accountDirectParent.length + otherDirectParent.length) > 0){
        isMulti = true;
      }
      return isMulti;
    };

    const selectedAccName = ref('');
    const selectedAccAdd = ref('');
    const balance = ref('');
    const balanceNumber = ref('');
    const isMultiSigBool = ref(isMultiSig(walletState.currentLoggedInWallet.selectDefaultAccount().address));

    let account = walletState.currentLoggedInWallet.accounts.find((account) => Helper.createAddress(account.address).pretty() == props.address);
    if(!account){
      account = walletState.currentLoggedInWallet.others.find((account) => Helper.createAddress(account.address).pretty() == props.address);
    }

    if(account != undefined){
      selectedAccName.value = account.name;
      selectedAccAdd.value = account.address;
      balance.value = Helper.toCurrencyFormat(account.balance, networkState.currentNetworkProfile.network.currency.divisibility);
      balanceNumber.value = account.balance;
    }else{
      toast.add({severity:'error', detail: 'Addres is invalid', group: 'br', life: 3000});
      router.push({ name: "ViewServicesNamespace" });
    }

    let themeConfig = new ThemeStyleConfig('ThemeStyleConfig');
    themeConfig.init();

    const svgString = ref(toSvg(Helper.createAddress(selectedAccAdd.value).pretty(), 40, themeConfig.jdenticonConfig));

    if(account){
      let namespace = account.namespaces.find( namespace => namespace.idHex === props.namespaceId);
      if(namespace != undefined){
        endBlock.value = namespace.endHeight;
        const nsElement = namespace.name.split('.');
        if(nsElement.length > 1){
          selectNamespace.value = nsElement[0];
        }else{
          selectNamespace.value = namespace.name;
        }
      }else{
        toast.add({severity:'error', detail: 'Namespace ID is invalid', group: 'br', life: 3000});
        router.push({ name: "ViewServicesNamespace" });
      }
    }

    const transactionFee = ref('0');
    const transactionFeeExact = ref(0);
    transactionFee.value = Helper.convertToCurrency(NamespaceUtils.getRootNamespaceTransactionFee(networkState.currentNetworkProfile.network.type, networkState.currentNetworkProfile.generationHash, selectNamespace.value, duration.value), networkState.currentNetworkProfile.network.currency.divisibility);
    transactionFeeExact.value = Helper.convertToExact(NamespaceUtils.getRootNamespaceTransactionFee(networkState.currentNetworkProfile.network.type, networkState.currentNetworkProfile.generationHash, selectNamespace.value, duration.value), networkState.currentNetworkProfile.network.currency.divisibility);

    let isMaxDuration = false;
    watch(duration, (n) => {
      if(n > maxDurationInDays){
        duration.value = `${maxDurationInDays}`;
      }else if(n < 1){
        duration.value = 1;
      }else{
        let remainingBlock = endBlock.value - block.value;
        let availableDays = 0;
        numDaysleft.value = Math.ceil(remainingBlock/(24 * 60 * 4));
        if((parseInt(n) + numDaysleft.value) > maxDurationInDays){
          availableDays = maxDurationInDays - numDaysleft.value;
          duration.value = availableDays.toString();
          showMaxDaysLabel.value = true;
          isMaxDuration = true;
        }else{
          if(!isMaxDuration){
            showMaxDaysLabel.value = false;
          }
          isMaxDuration = false;
        }
      }
    });

    // calculate fees
    const totalFee = computed(() => {
      // if multisig
      if(isMultiSig(selectedAccAdd.value)){
        return parseFloat(lockFundTotalFee.value) + rentalFee.value + transactionFeeExact.value;
      }else{
        return rentalFee.value + transactionFeeExact.value;
      }
    });

    const totalFeeFormatted = computed(() => {
      return Helper.amountFormatterSimple(totalFee.value, 0);
    });

    watch(totalFee, (n) => {
      if(balance.value < n && !isNotCosigner.value){
        // showNoBalance.value = true;
        disabledPassword.value = true;
      }else{
        // showNoBalance.value = false;
        disabledPassword.value = false;
      }
    });

    watch(blockListener, (n) => {
      block.value = n;
    });

    const extendNamespace = () => {
      if(cosigner.value){
        NamespaceUtils.extendNamespaceMultisig(cosigner.value, walletPassword.value, networkState.currentNetworkProfile.network.type, networkState.currentNetworkProfile.generationHash, selectNamespace.value, duration.value, selectedAccAdd.value);
      }else{
        NamespaceUtils.extendNamespace(selectedAccAdd.value, walletPassword.value, networkState.currentNetworkProfile.network.type, networkState.currentNetworkProfile.generationHash, selectNamespace.value, duration.value);
      }
      router.push({ name: "ViewServicesNamespace", params: { address: Helper.createAddress(selectedAccAdd.value).pretty()}});
    };

    const getMultiSigCosigner = computed(() => {
      return NamespaceUtils.getCosignerList(selectedAccAdd.value);
    });

    const isNotCosigner = computed(() => getMultiSigCosigner.value.list.length == 0 && isMultiSig(selectedAccAdd.value));

    const showNoBalance = computed(() => {
      if(isNotCosigner.value){
        return balanceNumber.value < (rentalFee.value + transactionFeeExact.value);
      }else{
        console.log(balanceNumber.value)
        return balanceNumber.value < (rentalFee.value + transactionFeeExact.value + lockFundTotalFee.value);
      }
    });

    watch(isNotCosigner, (n) => {
      if(n){
        disabledPassword.value = true;
        disabledDuration.value = true;
      }else{
        disabledPassword.value = false;
        disabledDuration.value = false;
      }
    });

    const cosigner = ref('');
    // get cosigner
    watch(getMultiSigCosigner, (n) => {
      // if it is a multisig
      if(n.list.length > 0){
        if(n.list.length > 1){
          cosigner.value = cosignerAddress.value;
        }else{
          cosigner.value = n.list[0].address;
        }
      }else{
        cosigner.value = '';
      }
    });

    const splitCurrency = (amount) => {
      let split = amount.toString().split(".")
      if (split[1]!=undefined){
        return '<span class="font-semibold text-sm">' + split[0] + '</span>.<span class="font-semibold text-xs">' + split[1] + ' ' + currentNativeTokenName.value + '</span>';
      }else{
        return '<span class="font-semibold text-sm">' + split[0] + '</span> <span class="font-semibold text-xs">' + currentNativeTokenName.value + '</span>';
      }
    };

    return {
      namespaceSelect,
      selectedAccName,
      selectedAccAdd,
      balance,
      showNoBalance,
      err,
      walletPassword,
      disableCreate,
      showPasswdError,
      disabledPassword,
      showDuration,
      disabledDuration,
      duration,
      showDurationErr,
      isMultiSig,
      isMultiSigBool,
      rentalFee,
      rentalFeeCurrency,
      lockFundTxFee,
      lockFundCurrency,
      currencyName,
      lockFundTxFeeCurrency,
      lockFundTotalFee,
      totalFeeFormatted,
      selectNamespace,
      namespaceOption,
      extendNamespace,
      transactionFee,
      getMultiSigCosigner,
      cosignerBalanceInsufficient,
      cosignerAddress,
      isNotCosigner,
      // startBlock,
      block,
      endBlock,
      numDaysleft,
      showMaxDaysLabel,
      splitCurrency,
      svgString,
      Helper,
      currentNativeTokenName,
      maxDurationInDays
    }
  },

}
</script>
<style scoped lang="scss">
</style>
