<template>
 <div>
  
  <div class='w-10/12 ml-auto mr-auto'>
    <div class="border filter shadow-lg xl:grid xl:grid-cols-3 mt-8" >
      <div class="xl:col-span-2 p-12">
        <div class='font-semibold mb-4'>{{$t('general.createNamespace')}}</div>
        <div v-if="showNoBalance" class="rounded-md bg-red-200 w-full p-2 flex items-center justify-center">
          <div class="rounded-full w-5 h-5 border border-red-500 inline-block relative mr-2"><font-awesome-icon icon="times" class="text-red-500 h-3 w-3 absolute" style="top: 3px; left:4px"></font-awesome-icon></div><div class="inline-block text-xs">{{$t('general.insufficientBalance')}}</div>
        </div>
        <div v-else-if="isNotCosigner" class="rounded-md bg-yellow-200 w-full p-2 flex items-center justify-center">
          <div class="rounded-full w-5 h-5 bg-yellow-100 inline-block relative mr-2"><font-awesome-icon icon="exclamation" class="text-yellow-500 h-3 w-3 absolute" style="top: 5px; left:7px"></font-awesome-icon></div><div class="inline-block text-xs">{{$t('general.noCosigner')}}</div>
        </div>
        <div class="error error_box" v-if="err!=''">{{ err }}</div>
        <div class="mt-4">
          <SelectInputAccount @select-account="changeSelection" v-model="selectedAccAdd" :selectDefault="defaultAcc?defaultAcc.address:''" />
          <div v-if="getMultiSigCosigner.cosignerList.length > 0">
            <div class="text-tsm text-left mt-3">{{$t('general.initiateBy')}}:
              <span class="font-bold" v-if="getMultiSigCosigner.cosignerList.length == 1">{{ getMultiSigCosigner.cosignerList[0].name }} ({{$t('general.balance')}}: {{ Helper.amountFormatterSimple(getMultiSigCosigner.cosignerList[0].balance, 0) }} {{ currentNativeTokenName }}) <span v-if="getMultiSigCosigner.cosignerList[0].balance < lockFundTotalFee" class="error">- {{$t('general.insufficientBalance')}}</span></span>
              <span class="font-bold" v-else><select v-model="cosignerAddress"><option v-for="(cosigner, item) in getMultiSigCosigner.cosignerList" :value="cosigner.address" :key="item">{{ cosigner.name }} ({{$t('general.balance')}}: {{ cosigner.balance }} {{ currentNativeTokenName }})</option></select></span>
              <div v-if="cosignerBalanceInsufficient" class="error">- {{$t('general.insufficientBalance')}}</div>
            </div>
          </div>
          <SelectInputParentNamespace @select-namespace="updateNamespaceSelection" @clear-namespace="removeNamespace" ref="nsRef" v-model="selectNamespace" :address="selectedAccAdd" class="mt-5" :disabled="disableSelectNamespace" />
          <div class="lg:grid lg:grid-cols-2 mt-5">
            <div class="mb-5 lg:mb-0 lg:mr-2">
              <TextInputTooltip :disabled="disableNamespaceName" :placeholder="$t('general.name')" :errorMessage="namespaceErrorMessage" v-model="namespaceName" v-debounce:1000="checkNamespace" icon="id-card-alt" :showError="showNamespaceNameError" class="w-full inline-block" :toolTip="$t('namespace.namespaceNameMsg1') + '<br><br>' + $t('namespace.namespaceNameMsg2') + '<br><br>' + $t('namespace.namespaceNameMsg3')" />
            </div>
            <div class="mb-5 lg:mb-0 lg:ml-2">
              <DurationInputClean :disabled="disabledDuration" v-model="duration" :max="maxDurationInDays" :placeholder="$t('namespace.duration')" @set-default-duration="setDefaultDuration" :showError="showDurationErr" :toolTip="$t('namespace.durationMsg')+'<br>' +`${maxDurationInDays === 365 ? '1 ' + $t('general.year') : ''}` +' ('+`${maxDurationInDays}`+ $t('general.day',maxDurationInDays) +').'" />
            </div>
          </div>
        </div>
      </div>
      <div class="bg-navy-primary py-6 px-6 xl:col-span-1">
        <div v-if="!isMultiSig(selectedAccAdd)" class='font-bold text-xs text-blue-primary uppercase'>{{$t('general.signerAcc')}}</div>
        <div v-else class='font-bold text-xs text-blue-primary uppercase'>{{$t('general.multisigAcc')}}</div>
        <div class="flex text-gray-200 my-1">
          <div class='font-semibold text-xxs mt-2  text-blue-primary uppercase'>{{$t('general.currentBalance')}}</div>
          <span class='ml-auto' v-html="splitCurrency(balance)"></span>
          <img src="@/modules/account/img/proximax-logo.svg" class='ml-1 h-5 w-5 mt-0.5'>
        </div>
        <div class='border-b-2 border-gray-600 mt-2'/>
        <div class="flex justify-between items-center text-gray-200 text-xs pt-2">
            <div class="font-semibold">{{$t('general.namespacerentalFee')}}</div>
            <div v-html="splitCurrency(rentalFeeCurrency)"></div>
          </div>
        <div v-if="!isMultiSig(selectedAccAdd)">
          <div class="flex justify-between border-gray-600 border-b items-center text-gray-200 text-xs py-3">
            <div class="font-semibold">{{$t('general.transactionFee')}}</div>
            <div v-html="splitCurrency(transactionFee)"></div>
          </div>
          <div class="flex justify-between border-gray-600 text-white text-xs py-5">
            <div class="font-bold uppercase">{{$t('general.total')}}</div>
            <div v-html="splitCurrency(totalFeeFormatted)"></div>
          </div>
        </div>
        <div v-else>
        <div class="flex justify-between border-600 border-b items-center text-gray-200 text-xs my-5" />
          <div class='font-bold text-xs text-blue-primary uppercase'>{{$t('general.signerAcc')}}</div>
          <div class="flex text-gray-200 my-1">
            <div class='font-semibold text-xxs mt-2  text-blue-primary uppercase'>{{$t('general.currentBalance')}}</div>
            <span class='ml-auto font-bold' v-if="getMultiSigCosigner.cosignerList.length == 1">{{ Helper.amountFormatterSimple(getMultiSigCosigner.cosignerList[0].balance, 0) }} {{ currentNativeTokenName }}</span>
            <span class='ml-auto font-bold' v-else>{{ checkCosignBalance }} {{ currentNativeTokenName }}</span>
            <img src="@/modules/account/img/proximax-logo.svg" class='ml-1 h-5 w-5 mt-0.5'>
          </div>
          <div class='border-b-2 border-gray-600 mt-2'/>
          <div class="flex justify-between items-center text-gray-200 text-xs py-3">
            <div class="font-semibold">{{$t('general.aggregateFee')}}</div>
            <div v-html="splitCurrency(transactionFee)"></div>
          </div>
          <div class="flex justify-between items-center text-gray-200 text-xs py-3">
            <div class="font-semibold">{{$t('general.lockFund')}}</div>
            <div v-html="splitCurrency(lockFundCurrency)"></div>
          </div>
          <div class="flex justify-between border-gray-600 border-b items-center text-gray-200 text-xs py-3">
            <div class="font-semibold">{{$t('general.lockFundTxFee')}}</div>
            <div v-html="splitCurrency(lockFundTxFee)"></div>
          </div>
          <div class="flex justify-between border-gray-600 text-white text-xs py-5">
            <div class="font-bold uppercase">{{$t('general.total')}}</div>
            <div v-html="splitCurrency(totalFeeFormatted)"></div>
          </div>
        </div>
        <div class='text-xs text-white my-5'>{{$t('general.enterPasswordContinue')}}</div>
        <PasswordInput :placeholder="$t('general.password')" :errorMessage="$t('general.passwordRequired')" :showError="showPasswdError" v-model="walletPassword" :disabled="disabledPassword" />
        <button type="submit" class="mt-3 w-full blue-btn py-4 disabled:opacity-50 disabled:cursor-auto text-white" :disabled="disableCreate" @click="createNamespace">{{$t('namespace.registerNamespace')}}</button>
        <div class="text-center">
          <router-link :to="{name: 'ViewDashboard'}" class='content-center text-xs text-white border-b-2 border-white'>{{$t('general.cancel')}}</router-link>
        </div>
      </div>
    </div>

    <div class="sm:grid sm:grid-cols-2 mt-10 lg:mt-16">
      <div class="mb-8 sm:pr-1">
        <a href="https://bcdocs.xpxsirius.io/docs/built-in-features/namespace/" target=_new class="sm:h-9 lg:h-5 text-blue-primary font-bold text-tsm items-start flex">{{$t('general.namespaceQues')}}</a>
        <div class="text-gray-400 text-tsm my-3 sm:pr-2">{{$t('namespace.namespaceAns')}}</div>
      </div>
      <div class="mb-8">
        <a href="https://t.me/proximaxhelpdesk" target=_new class="sm:h-9 lg:h-5 text-blue-primary font-bold text-tsm items-start flex">{{$t('general.feedback')}}</a>
        <div class="text-gray-400 text-tsm my-3">{{$t('general.feedbackDescription')}}</div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import { computed, ref, watch } from 'vue';
import { useRouter } from "vue-router";
import PasswordInput from '@/components/PasswordInput.vue';
import TextInputTooltip from '@/components/TextInputTooltip.vue';
import SelectInputAccount from '@/components/SelectInputAccount.vue';
import SelectInputParentNamespace from '@/modules/services/submodule/namespaces/components/SelectInputParentNamespace.vue';
import DurationInputClean from '@/modules/services/submodule/namespaces/components/DurationInputClean.vue';
import { walletState } from "@/state/walletState";
import { networkState } from "@/state/networkState";
import { Helper } from '@/util/typeHelper';
import { NamespaceUtils } from '@/util/namespaceUtils';
import { ChainUtils } from '@/util/chainUtils';
import { TransactionUtils } from '@/util/transactionUtils';
import { UnitConverter } from '@/util/unitConverter';
import { TimeUnit } from '@/models/const/timeUnit';
import { multiSign } from '@/util/multiSignatory';
import { AppState } from '@/state/appState';
import { useI18n } from 'vue-i18n';
import { WalletUtils } from '@/util/walletUtils';

export default {
  name: 'ViewServicesNamespaceCreate',
  components: {
    PasswordInput,
    TextInputTooltip,
    DurationInputClean,
    SelectInputAccount,
    SelectInputParentNamespace
  },
  setup(){
    const router = useRouter();
    const {t} = useI18n();
    const nsRef = ref(null);

    const currentNativeTokenName = computed(()=> AppState.nativeToken.label);
    const currentNativeTokenDivisibility = computed(()=> AppState.nativeToken.divisibility);

    const disableNamespaceName = ref(false);
    const disableSelectNamespace = ref(false);
    const namespaceName = ref('');
    const showDurationErr = ref(false);
    const duration = ref('1');
    const walletPassword = ref('');
    const err = ref('');
    const namespaceErrorMessage = ref(t('namespace.validName'));
    const currentSelectedName = ref('');
    const disabledPassword = ref(false);
    const disabledDuration = ref(false);
    const disabledClear = ref(false);
    const passwdPattern = "^[^ ]{8,}$";
    const showPasswdError = ref(false);
    const maxNamespaceLength = computed(()=>{
      if(networkState.currentNetworkProfileConfig){
        return networkState.currentNetworkProfileConfig.maxNameSize;
      }else{
        return 0
      }
    })
    const namespacePattern = `^[0-9a-z]{2,${maxNamespaceLength.value}}$`;
    const showNamespaceNameError = ref(false);
    const maxDurationInDays = computed(()=>{
      if(networkState.currentNetworkProfileConfig){
        return Math.floor(UnitConverter.configReturn(networkState.currentNetworkProfileConfig.maxNamespaceDuration, TimeUnit.DAY))
      }else{
        return 0
      }
    })
    const selectNamespace = ref('');
    const cosignerBalanceInsufficient = ref(false);
    const cosignerAddress = ref('');

    const namespaceOption = computed(() => {
      let namespace = [];
      namespace.push({
        value: '1',
        label: t('namespace.newRootNamespace'),
        level: 0,
        disabled: false,
      });
      const namespacesList = NamespaceUtils.listNamespaces(selectedAccAdd.value);
      if(namespacesList.length > 0){
        namespace.push.apply(namespace, namespacesList);
      }
      return namespace;
    });
    const currencyName = computed(() => AppState.nativeToken.label);

    const rentalFee = computed(()=> {
      if(selectNamespace.value){
        if(selectNamespace.value == '1'){
          if(duration.value > 0){
            return Helper.convertToExact(networkState.currentNetworkProfileConfig.rootNamespaceRentalFeePerBlock * NamespaceUtils.calculateDuration(duration.value), AppState.nativeToken.divisibility);
          }else{
            return Helper.convertToExact(networkState.currentNetworkProfileConfig.rootNamespaceRentalFeePerBlock, AppState.nativeToken.divisibility);
          }
        }else{
          return Helper.convertToExact(networkState.currentNetworkProfileConfig.childNamespaceRentalFee, AppState.nativeToken.divisibility);
        }
      }else{
        return 0;
      }
    });

    const rentalFeeCurrency = computed(()=> Helper.toCurrencyFormat(rentalFee.value, AppState.nativeToken.divisibility));

     const lockFund = computed(()=> {
      if(networkState.currentNetworkProfileConfig){
        return Helper.convertToExact(networkState.currentNetworkProfileConfig.lockedFundsPerAggregate, AppState.nativeToken.divisibility)
      }else{
        return 0
      }
    })
    const lockFundCurrency = computed(()=>{
      if(networkState.currentNetworkProfileConfig){
        return Helper.amountFormatterSimple(networkState.currentNetworkProfileConfig.lockedFundsPerAggregate, AppState.nativeToken.divisibility)
      }else{
        return 0
      }
    })

    const lockFundTxFee = computed(()=>{
        if(networkState.currentNetworkProfile){
          let networkType = AppState.networkType;
          return Helper.convertToExact(TransactionUtils.getLockFundFee(), AppState.nativeToken.divisibility);
        }
        return 0;  
    });

    const lockFundTxFeeCurrency = ref('0.044500');
    const lockFundTotalFee = computed(()=> lockFund.value + lockFundTxFee.value);

    const disableCreate = computed(() => !(
      walletPassword.value.match(passwdPattern) && namespaceName.value.match(namespacePattern) && (!showDurationErr.value) && (!showNoBalance.value) && (!isNotCosigner.value) && !showNamespaceNameError.value && selectNamespace.value
    ));

    const isMultiSig = (address) => {
      if(walletState.currentLoggedInWallet){
        const account = walletState.currentLoggedInWallet.accounts.find((account) => account.address == address) || walletState.currentLoggedInWallet.others.find((account) => account.address == address);
        const isMulti = account.getDirectParentMultisig().length>0?true:false
        return isMulti
      }else{
        return false
      }
    };
    const defaultAcc = walletState.currentLoggedInWallet?walletState.currentLoggedInWallet.selectDefaultAccount(): null
    const selectedAccName = ref(defaultAcc?defaultAcc.name:'');
    const selectedAccAdd = ref(defaultAcc?defaultAcc.address:'');
    const balance = ref(Helper.toCurrencyFormat(defaultAcc?defaultAcc.balance:0, AppState.nativeToken.divisibility));
    const balanceNumber = ref(defaultAcc?defaultAcc.balance:0);

    const isMultiSigBool =ref(isMultiSig(defaultAcc?defaultAcc.address:''));

    const isNotCosigner = computed(() => getMultiSigCosigner.value.cosignerList.length == 0 && isMultiSig(selectedAccAdd.value));

    const showNoBalance = computed(() => {
      if(isNotCosigner.value){
        return balanceNumber.value < (rentalFee.value + transactionFeeExact.value);
      }else{
        return balanceNumber.value < (rentalFee.value + transactionFeeExact.value + lockFundTotalFee.value);
      }
    });

    // validate enough fee to create namespace
    if(balance.value < rentalFee.value){
      disabledPassword.value = true;
      disabledClear.value = true;
      disabledDuration.value = true;
      disableNamespaceName.value = true;
      disableSelectNamespace.value = true;
    }else{
      disabledPassword.value = false;
      disabledClear.value = false;
      disabledDuration.value = false;
      disableNamespaceName.value = false;
      disableSelectNamespace.value = false;
    }

    const accounts = computed( () => {
      if(walletState.currentLoggedInWallet){
        if(walletState.currentLoggedInWallet.others){
          const concatOther = walletState.currentLoggedInWallet.accounts.concat(walletState.currentLoggedInWallet.others)
          return concatOther;
        } else{
          return walletState.currentLoggedInWallet.accounts;
        }
      } else{
        return [];
      }
    });

    const transactionFee = ref(0);
    const transactionFeeExact = ref(0);

    const fetchAccount = (publicKey) => {
      return walletState.currentLoggedInWallet.accounts.find(account => account.publicKey === publicKey);
    };

    const getMultiSigCosigner = computed(() => {
      if(networkState.currentNetworkProfileConfig){
        let cosigners = multiSign.getCosignerInWallet(accounts.value.find(account => account.address == selectedAccAdd.value)?accounts.value.find(account => account.address == selectedAccAdd.value).publicKey:'');
        let list = [];
        cosigners.cosignerList.forEach( publicKey => {
          list.push({
            publicKey,
            name: fetchAccount(publicKey).name,
            balance: fetchAccount(publicKey).balance,
            address: fetchAccount(publicKey).address
          });
        });

        cosigners.cosignerList = list;
        return cosigners;
      }else{
        return {hasCosigner:false,cosignerList:[]}
      }
      
    });

    const removeNamespace = () => {
      selectNamespace.value = '';
    }

    const changeSelection = (address) => {
      let account = walletState.currentLoggedInWallet.accounts.find(account => account.address == address);
      if(!account){
        account = walletState.currentLoggedInWallet.others.find(account => account.address == address);
      }
      selectNamespace.value = '';
      nsRef.value.clearLabel();
      selectedAccName.value = account.name;
      selectedAccAdd.value = account.address;
      balance.value = Helper.toCurrencyFormat(account.balance, AppState.nativeToken.divisibility);
      balanceNumber.value = account.balance;
      currentSelectedName.value = account.name;
    }

    const updateNamespaceSelection = (namespaceNameSelected) => {
      let fee = 0;
      if(namespaceNameSelected == '1'){
        //root
        disabledDuration.value = false;
        if(namespaceName.value.trim().length > 0 && !showNamespaceNameError.value){
          fee = NamespaceUtils.getRootNamespaceTransactionFee(namespaceName.value);
          transactionFee.value = Helper.convertToCurrency(fee, AppState.nativeToken.divisibility);
          transactionFeeExact.value = Helper.convertToExact(fee, AppState.nativeToken.divisibility);
        }
      }else{
        duration.value = '0';
        //subnamespace
        disabledDuration.value = true;
        if(namespaceName.value.trim().length > 0 && !showNamespaceNameError.value){
          fee = NamespaceUtils.getSubNamespaceTransactionFee( namespaceNameSelected, namespaceName.value);
          transactionFee.value = Helper.convertToCurrency(fee, AppState.nativeToken.divisibility);
          transactionFeeExact.value = Helper.convertToExact(fee, AppState.nativeToken.divisibility);
        }
      }
    };

    const clearNamespaceSelection = () => {
      duration.value = '0';
    };

    const createNamespace = () => {
      let verifyPassword = WalletUtils.verifyWalletPassword(walletState.currentLoggedInWallet.name,networkState.chainNetworkName,walletPassword.value)
      if(!verifyPassword){
        err.value = t('general.walletPasswordInvalid',{name : walletState.currentLoggedInWallet.name})
        return
      }
      if(cosigner.value){
        // for multisig
        if(selectNamespace.value==='1'){
          NamespaceUtils.createRootNamespaceMultisig(cosigner.value, walletPassword.value, namespaceName.value, duration.value, selectedAccAdd.value);
        }else{
          NamespaceUtils.createSubNamespaceMultisig(cosigner.value, walletPassword.value, namespaceName.value, selectNamespace.value, selectedAccAdd.value);
        }
      }else{
        if(selectNamespace.value==='1'){
          NamespaceUtils.createRootNamespace(selectedAccAdd.value, walletPassword.value, namespaceName.value, duration.value);
        }else{
          NamespaceUtils.createSubNamespace(selectedAccAdd.value, walletPassword.value, namespaceName.value, selectNamespace.value);
        }
      }
      router.push({ name: "ViewAccountPendingTransactions",params:{address:selectedAccAdd.value} })
    };

    watch(duration, (n) => {
      if(parseInt(n) > maxDurationInDays.value){
        duration.value = `${maxDurationInDays.value}`;
      }
    });

    const setDefaultDuration = () => {
      duration.value = '1';
    }

    // calculate fees
    const totalFee = computed(() => {
      // if multisig
      if(isMultiSig(selectedAccAdd.value)){
        return parseFloat(lockFundTotalFee.value) + transactionFeeExact.value;
      }else{
        return rentalFee.value + transactionFeeExact.value;
      }
    });

    watch(totalFee, (n) => {
      if(balance.value < n && !isNotCosigner.value){
        disabledPassword.value = true;
        disableSelectNamespace.value = true;
      }else{
        disabledPassword.value = false;
        disableSelectNamespace.value = false;
      }
    });

    const totalFeeFormatted = computed(() => {
      return Helper.amountFormatterSimple(totalFee.value, 0);
    });

    watch(isNotCosigner, (n) => {
      if(n){
        disabledPassword.value = true;
        disabledDuration.value = true;
        disableNamespaceName.value = true;
        disableSelectNamespace.value = true;
      }else{
        disabledPassword.value = false;
        disabledDuration.value = false;
        disableNamespaceName.value = false;
        disableSelectNamespace.value = false;
      }
    });

    const cosigner = computed(() => {
      if(getMultiSigCosigner.value.cosignerList.length > 0){
        if(getMultiSigCosigner.value.cosignerList.length > 1){
          return cosignerAddress.value;
        }else{
          return fetchAccount(getMultiSigCosigner.value.cosignerList[0].publicKey).address;
        }
      }else{
        return '';
      }
    });

    cosignerAddress.value = getMultiSigCosigner.value.cosignerList.length>0?getMultiSigCosigner.value.cosignerList[0].address:''
    
    watch(getMultiSigCosigner,n=>{
      if(n.cosignerList.length>0){
        cosignerAddress.value = n.cosignerList.length>0?getMultiSigCosigner.value.cosignerList[0].address:''
      }
    })

    const findAccWithAddress = address =>{
      return walletState.currentLoggedInWallet.accounts.find(acc=>acc.address==address)
    }

    const checkCosignBalance = computed(() => {
      let cosignBalance = findAccWithAddress(cosignerAddress.value).balance;
      return cosignBalance;
    })

    const splitCurrency = (amount) => {
      let split = amount.toString().split(".")
      if (split[1]!=undefined){
        return '<span class="font-semibold text-sm">' + split[0] + '</span>.<span class="font-semibold text-xs">' + split[1] + ' ' + currentNativeTokenName.value + '</span>';
      }else{
        return '<span class="font-semibold text-sm">' + split[0] + '</span> <span class="font-semibold text-xs">' + currentNativeTokenName.value + '</span>';
      }
    };

    const reservedRootNamespace = computed(()=>{
      if(networkState.currentNetworkProfileConfig){
        return networkState.currentNetworkProfileConfig.reservedRootNamespaceNames.split(",").map(ns => ns.trim());
      }else{
        return []
      }
    })

    const isReservedRootNamespace = ()=>{
      if(selectNamespace.value === "1" && reservedRootNamespace.value.includes(namespaceName.value.trim())){
          showNamespaceNameError.value = true;
          namespaceErrorMessage.value = t('namespace.reservedName');

          return true;
      }
      return false;
    }

    const notRootNamespaceOwner = async ()=>{
      if(selectNamespace.value === "1" && namespaceName.value.trim()){
        try {
          let namespaceInfo = await ChainUtils.getNamespaceInfo(Helper.createNamespaceId(namespaceName.value));
        
          if(namespaceInfo.owner.address.plain !== selectedAccAdd.value){
            showNamespaceNameError.value = true;
            namespaceErrorMessage.value = t('namespace.nameRegistered');

            return true;
          }
        } catch (error) {
          return false;
        }
      }
      return false;
    }

    const checkNamespace = async () =>{
      showNamespaceNameError.value = false;
      if(namespaceName.value.trim()){
        if(isReservedRootNamespace()){
          return;
        }
        else{
          showNamespaceNameError.value = namespaceName.value.match(namespacePattern)? false:true;
          if(showNamespaceNameError.value){
            namespaceErrorMessage.value = t('namespace.validName');
          }
          else{
            let isNotOwner = await notRootNamespaceOwner();
            
            if(isNotOwner){
              return;
            }

            let fee = 0;

            if(selectNamespace.value == '1'){
              
              //root
              if(namespaceName.value.trim().length > 0 && !showNamespaceNameError.value){
                fee = NamespaceUtils.getRootNamespaceTransactionFee( namespaceName.value);
                transactionFee.value = Helper.convertToCurrency(fee, AppState.nativeToken.divisibility);
                transactionFeeExact.value = Helper.convertToExact(fee, AppState.nativeToken.divisibility);
              }
            }else{
              //sub
              if(namespaceName.value.trim().length > 0 && !showNamespaceNameError.value){
                fee = NamespaceUtils.getSubNamespaceTransactionFee(namespaceName.value, selectNamespace.value);
                transactionFee.value = Helper.convertToCurrency(fee, AppState.nativeToken.divisibility);
                transactionFeeExact.value = Helper.convertToExact(fee, AppState.nativeToken.divisibility);
              }
            }
          }
        }
      }
    }

    return {
      Helper,
      accounts,
      currentSelectedName,
      selectedAccName,
      selectedAccAdd,
      balance,
      showNoBalance,
      err,
      showNamespaceNameError,
      namespaceErrorMessage,
      checkNamespace,
      namespaceName,
      disableNamespaceName,
      walletPassword,
      disableCreate,
      showPasswdError,
      changeSelection,
      disableSelectNamespace,
      disabledPassword,
      disabledClear,
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
      createNamespace,
      transactionFee,
      updateNamespaceSelection,
      clearNamespaceSelection,
      getMultiSigCosigner,
      cosignerBalanceInsufficient,
      cosignerAddress,
      isNotCosigner,
      splitCurrency,
      walletState,
      currentNativeTokenName,
      nsRef,
      maxDurationInDays,
      removeNamespace,
      setDefaultDuration,
      cosigner,
      defaultAcc,
      checkCosignBalance
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
</style>
