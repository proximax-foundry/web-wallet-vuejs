<template>
  <div>
    <div class='lg:w-9/12 ml-2 mr-2 lg:ml-auto lg:mr-auto mt-5'>
      <div class='mt-6 p-6 border filter shadow-lg text-center'>
        <div class="text-md">{{$t('swap.mainNetworkSwap')}}</div>
        <div class="text-xs my-3 mb-5 sm:mb-10"><img src="@/modules/services/submodule/mainnetSwap/img/bsc.svg" class="mr-2 h-5 inline-block">{{$t('swap.swapBscToSirius')}}</div>
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
              <div class="px-4 sm:px-10 self-center text-xxs sm:text-xs hidden md:inline-block lg:hidden xl:inline-block">{{$t('swap.validation')}}</div>
            </div>
          </div>
          <div class="flex-grow self-center md:mx-4 h-0.5 bg-gray-100"></div>
          <div class="flex-none">
            <div class="flex border border-gray-300 rounded-md filter shadow-md">
              <div class="flex w-6 h-6 sm:w-10 sm:h-10" :class="`${ currentPage==3?'bg-yellow-500':'bg-gray-300' }`"><div class="self-center inline-block text-center w-full text-txs sm:text-sm font-bold" :class="`${ currentPage>=3?'text-white':'text-gray-400' }`">3</div></div>
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
          <div class="text-lg my-7 font-bold">{{$t('general.transactionDetails')}}</div>
          <div class="error error_box mb-5" v-if="!isInstallMetamask">{{$t('swap.noMetamask')}}</div>
          <button @click="recheckMetamask()" v-if="!isInstallMetamask" class="text-xs blue-btn p-2 mb-3">Recheck MetaMask</button>
          <div class="bg-yellow-200 text-yellow-900 text-tsm p-3 mb-5 rounded-2xl" v-if="!verifyMetaMaskPlugin">{{$t('swap.noOtherExtension')}} <b>{{$t('swap.metamask')}}</b>.<div class="my-2">{{$t('swap.referTo')}}<a href="https://bit.ly/3mVayCu" target=_new class="text-blue-primary">{{$t('swap.walkthrough')}}<font-awesome-icon icon="external-link-alt" class="text-blue-primary w-3 h-3 self-center inline-block ml-1"></font-awesome-icon></a>{{$t('swap.forMoreDetails')}}</div>{{$t('swap.refreshMsg')}}</div>
          <div class="error error_box mb-5" v-if="serviceErr!=''">{{ serviceErr }}</div>
          <div class="error error_box mb-5" v-if="err!=''">{{ err }}</div>
          <div class="mb-5 md:flex md:justify-between border border-gray-200 rounded">
            <div class="flex justify-left">
              <div class="w-18 flex items-center justify-center py-5 sm:h-20">
                <img src="@/modules/services/submodule/mainnetSwap/img/icon-metamask-fox.svg" class="w-8 h-8 inline-block">
              </div>
              <div class="text-left flex items-center">
                <div>
                  <div class="text-xxs uppercase text-blue-primary font-bold mb-1">{{$t('swap.fromMetamaskAddress')}}</div>
                  <div class="font-bold text-black text-tsm break-all mr-2">{{ isMetamaskConnected?(currentAccount?currentAccount:$t('swap.notConnected')):$t('swap.notConnected') }}</div>
                </div>
              </div>
            </div>
            <div class="md:grid hidden " :class="currentAccount?'grid-cols-2':'grid-cols-1'">
              <div class="border-l border-gray-200 text-green-500 font-semibold text-xxs w-16 lg:w-20 flex items-center justify-center uppercase" v-if="currentAccount">
                <div>
                  <img src="@/modules/services/submodule/mainnetSwap/img/icon-connected.svg" class="inline-block">
                  <div>{{$t('swap.connected')}}</div>
                </div>
              </div>
              <div class="border-l border-gray-200 text-blue-primary text-tsm font-bold w-16 lg:w-20 flex justify-center items-center">
                <div v-if="isInstallMetamask">
                  <div class="cursor-pointer" @click="connectMetamask()" v-if="!currentAccount">{{$t('swap.connect')}}</div>
                  <div class="cursor-pointer" @click="connectMetamask()" v-else>{{$t('general.change')}}</div>
                </div>
                <div v-else>
                  <a href="https://metamask.io/" target=_new>{{$t('general.download')}}</a>
                </div>
              </div>
            </div>
            <div class="md:hidden">
              <div class="border-t border-gray-200 text-green-500 font-semibold text-xxs uppercase p-2" v-if="currentAccount">
                <div class="flex items-center justify-center">
                  <img src="@/modules/services/submodule/mainnetSwap/img/icon-connected.svg" class="inline-block mr-2 w-4 h-4">
                  {{$t('swap.connected')}}
                </div>
              </div>
              <div class="border-t border-gray-200 text-blue-primary text-tsm font-bold p-3">
                <div v-if="isInstallMetamask">
                  <div class="cursor-pointer" @click="connectMetamask()" v-if="!currentAccount">{{$t('swap.connect')}}</div>
                  <div class="cursor-pointer" @click="connectMetamask()" v-else>{{$t('general.change')}}</div>
                </div>
                <div v-else>
                  <a href="https://metamask.io/" target=_new>{{$t('general.download')}}</a>
                </div>
              </div>
            </div>
          </div>
          <SupplyInputClean :disabled="disableAmount" v-model="amount" :balance="balance" :placeholder="'BEP20 ' + `${selectedToken?selectedToken.name:''}`" type="text" :showError="showAmountErr" :errorMessage="(!amount)?'Required Field':amount>=minAmount?$t('swap.insufficientTokenBalance'):`Min. amount is ${minAmount}(${feeAmount} ${selectedToken.name.toUpperCase()} will deducted for transaction fee)`" :decimal="tokenDivisibility"  />
          <div class="flex">
            <AddressInputClean :placeholder="$t('transfer.transferPlaceholder')" v-model="siriusAddressInput" v-debounce:1000="checkRecipient" :showError="showAddressError" />
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
          <div class="bg-blue-50 border border-blue-primary h-20 mt-5 rounded flex items-center justify-center">
            {{ amountReceived }} {{selectedToken?selectedToken.name.toUpperCase():''}}
            <img src="@/modules/account/img/metx-logo.svg" v-if="selectedToken?selectedToken.name=='metx'?true:false:false" class=" w-5 h-5 ml-4"> 
            <img v-if="selectedToken?selectedToken.name=='xpx'?true:false:false" src="@/modules/dashboard/img/icon-xpx.svg" class=" w-5 h-5 ml-4">
          </div>
          <div class="my-4 text-xs">{{ selectedToken && selectedToken.name.toUpperCase() !== currentNativeTokenName ? "Estimated" : "" }} Total Amount of {{selectedToken?selectedToken.name.toUpperCase():''}} received after deducting transaction fee</div>
          <div class="mt-10 text-center">
            <button @click="$router.push({name: 'ViewServicesMainnetSwap'})" class="text-black font-bold text-xs mr-5 focus:outline-none disabled:opacity-50">{{$t('general.cancel')}}</button>
            <button type="submit" class="default-btn focus:outline-none disabled:opacity-50" :disabled="isDisabledSwap" @click="sendRequest()">{{$t('swap.sendRequest')}}</button>
          </div>
        </div>
        <div v-if="currentPage==2">
          <div class="text-lg my-7">
            <div class="error error_box mb-5" v-if="err!=''">{{ err }}</div>
            <div class="font-bold text-left text-xs md:text-sm" :class="step1?'text-gray-700':'text-gray-300'">{{$t('swap.step1',{tokenName: selectedToken.name.toUpperCase()})}}</div>
            <div class="flex border-b border-gray-300 p-3">
              <div class="flex-none">
                <div class=" rounded-full border w-6 h-6 transition-all duration-500" :class="step1?'border-blue-primary':'border-gray-300'">
                  <div class="flex h-full justify-center">
                    <font-awesome-icon icon="check" :class="step1?'text-blue-primary':'text-gray-300'" class="w-3 h-3 self-center inline-block transition-all duration-500"></font-awesome-icon>
                  </div>
                </div>
              </div>
              <div class="flex-grow text-left text-xs md:text-sm ml-3 self-center transition-all duration-500" :class="step1?'text-gray-700':'text-gray-300'">{{$t('swap.sendingTx')}}</div>
            </div>
            <div class="flex border-b border-gray-300 p-3">
              <div class="flex-none">
                <div class=" rounded-full border w-6 h-6 transition-all duration-500" :class="isInvalidConfirmedMeta?'border-red-primary':(step2?'border-blue-primary':'border-gray-300')">
                  <div class="flex h-full justify-center">
                    <font-awesome-icon icon="times" class="text-red-primary w-3 h-3 self-center inline-block transition-all duration-500" v-if="isInvalidConfirmedMeta"></font-awesome-icon>
                    <font-awesome-icon icon="check" :class="step2?'text-blue-primary':'text-gray-300'" class="w-3 h-3 self-center inline-block transition-all duration-500" v-else></font-awesome-icon>
                  </div>
                </div>
              </div>
              <div class="flex-grow text-left text-xs md:text-sm ml-3 self-center transition-all duration-500" :class="step2?'text-gray-700':'text-gray-300'">
                {{ isInvalidConfirmedMeta? $t('swap.rejectMetamask'):$t('swap.waitingConfirmMetamask') }}
                <div v-if="isInvalidConfirmedMeta" class="mt-5">
                  <button type="button" class="bg-blue-primary rounded mr-5 focus:outline-none text-tsm font-bold py-2 border-blue-primary px-8 text-white hover:shadow-lg" @click="getValidation">{{$t('swap.retry')}}</button>
                  <router-link :to="{ name: 'ViewServicesMainnetSwap' }" class="px-6 py-2 text-gray-500 outline-none focus:outline-none mr-4 w-32 text-tsm" tag="button">{{$t('swap.cancelSwap')}}</router-link>
                </div>
              </div>
            </div>
            <div class="flex border-b border-gray-300 p-3">
              <div class="flex-none">
                <div class=" rounded-full border w-6 h-6" :class="step3?'border-blue-primary':'border-gray-300'">
                  <div class="flex h-full justify-center">
                    <font-awesome-icon icon="check" :class="step3?'text-blue-primary':'text-gray-300'" class="w-3 h-3 self-center inline-block"></font-awesome-icon>
                  </div>
                </div>
              </div>
              <div class="text-left text-xs md:text-sm ml-3 self-center transition-all duration-500" :class="step3?'text-gray-700':'text-gray-300'">
                {{$t('swap.transactionHash')}}:
                <div v-if="validationHash" class="bg-yellow-100 py-2 px-5 mt-3 rounded flex">
                  <a :href="validationLink" target=_new :class="isInvalidConfirmedMeta?'text-gray-300':'text-blue-primary'" class="flex-grow break-all text-tsm self-center hover:underline" id="validateTransfer" :copyValue="validationHash" :copySubject="$t('swap.transactionHash')"><font-awesome-icon icon="external-link-alt" class="text-blue-primary w-3 h-3 self-center inline-block mr-2"></font-awesome-icon>{{ validationHash }}</a>
                  <div class="flex-none mr-3">
                    <font-awesome-icon icon="copy" @click="copy('validateTransfer')" class="w-5 h-5 text-blue-primary cursor-pointer self-center mx-3 absolute top-2 hover:opacity-90 duration-800 transition-all" v-if="step3"></font-awesome-icon>
                  </div>
                </div>
                <div class="sm:flex">
                  <button class="sm:flex-none justify-start sm:justify-end bg-blue-primary h-15 w-60 rounded mr-5 focus:outline-none text-xs font-bold py-2 border border-blue-primary px-8 text-white hover:shadow-lg mt-3 sm:mt-0 disabled:opacity-50 self-center" type="button" v-if="validationHash" :disabled="isDisabledCheckTxnConfirmed || transactionFailed" @click="triggerTxnConfirmation">{{ isCheckingTxnConfirmation? $t('swap.checkTransaction'):$t('swap.checkingTransaction') }}</button>
                  <div v-if="validationHash" class="py-2 sm:flex-grow text-xs mt-3">
                    <div class="mb-1">{{$t('swap.validationWarning')}}</div>
                    <div class="mb-1"><b>{{$t('swap.validationWarning2')}}</b></div>
                    <div class="mb-1">{{$t('swap.validationWarning3')}}</div>
                    <div class="mb-1"><b>{{$t('swap.validationWarning4')}}</b> {{$t('swap.validationWarning5')}}</div>
                    <div class="mb-1">{{$t('swap.validationWarning6')}} <a :href="validationLink" target="_new" class="text-blue-primary inline-block hover:text-blue-900 hover:underline">{{$t('swap.bscScan')}}<font-awesome-icon icon="external-link-alt" class="ml-1 text-blue-primary w-3 h-3 self-center inline-block"></font-awesome-icon></a>.</div>
                  </div>
                </div>
                <div class="text-tsm mt-2 bg-blue-100 px-4 py-2 rounded-xl inline-block text-blue-900" v-if="isTxnNotConfirmed && !transactionFailed">{{$t('swap.notConfirmed')}}</div>
                <div class="text-tsm mt-2 bg-red-100 px-4 py-2 rounded-xl inline-block text-red-primary" v-if="transactionFailed">{{$t('swap.txFailed')}}</div>
              </div>
            </div>
            <div class="font-bold text-left text-xs md:text-sm mt-4" :class="step4?'text-gray-700':'text-gray-300'">{{$t('swap.step2')}}</div>
            <div class="flex border-b border-gray-300 p-3">
              <div class="flex-none">
                <div class=" rounded-full border w-6 h-6" :class="step4?'border-blue-primary':'border-gray-300'">
                  <div class="flex h-full justify-center">
                    <font-awesome-icon icon="check" :class="step4?'text-blue-primary':'text-gray-300'" class="w-3 h-3 self-center inline-block"></font-awesome-icon>
                  </div>
                </div>
              </div>
              <div class="flex-grow text-left text-xs md:text-sm ml-3 self-center transition-all duration-500" :class="step4?'text-gray-700':'text-gray-300'">{{$t('swap.sendingMsg')}}</div>
            </div>
            <div class="flex border-b border-gray-300 p-3">
              <div class="flex-none">
                <div class=" rounded-full border w-6 h-6" :class="isInvalidSignedMeta?'border-red-primary':(step5?'border-blue-primary':'border-gray-300')">
                  <div class="flex h-full justify-center">
                    <font-awesome-icon icon="times" class="text-red-primary w-3 h-3 self-center inline-block" v-if="isInvalidSignedMeta"></font-awesome-icon>
                    <font-awesome-icon icon="check" :class="step5?'text-blue-primary':'text-gray-300'" class="w-3 h-3 self-center inline-block" v-else></font-awesome-icon>
                  </div>
                </div>
              </div>
              <div class="flex-grow text-left text-xs md:text-sm ml-3 self-center transition-all duration-500" :class="step5?'text-gray-700':'text-gray-300'">
                {{ signatureMessage }}
                <div v-if="isInvalidSignedMeta" class="mt-5">
                  <button  type="button" class="bg-blue-primary rounded mr-5 focus:outline-none text-tsm py-2 px-4 text-white hover:shadow-lg w-24" @click="getSigned">{{$t('swap.retry')}}</button>
                </div>
              </div>
            </div>
            <div class="flex border-b border-gray-300 p-3">
              <div class="flex-none">
                <div class=" rounded-full border w-6 h-6" :class="step6?'border-blue-primary':'border-gray-300'">
                  <div class="flex h-full justify-center">
                    <font-awesome-icon icon="check" :class="step6?'text-blue-primary':'text-gray-300'" class="w-3 h-3 self-center inline-block"></font-awesome-icon>
                  </div>
                </div>
              </div>
              <div class="flex-grow text-left text-xs md:text-sm ml-3 self-center transition-all duration-500" :class="step6?'text-gray-700':'text-gray-300'">{{$t('swap.messageSigned')}}<div class="bg-yellow-100 py-2 px-5 mt-2 rounded flex" v-if="messageHash && step6"><div :class="step6?'text-gray-500':'text-gray-300'" class="text-tsm break-all flex-grow" id="validateMessage" :copyValue="messageHash" :copySubject="$t('swap.signatureHash')">{{ messageHash }}</div><div class="flex-none mr-3"><font-awesome-icon icon="copy" @click="copy('validateMessage')" class="w-5 h-5 text-blue-primary cursor-pointer self-center ml-3 absolute top-2 hover:opacity-90 duration-800 transition-all" v-if="step6"></font-awesome-icon></div></div></div>
            </div>
            <div class="font-bold text-left text-xs md:text-sm mt-4" :class="step7?'text-gray-700':'text-gray-300'">{{$t('swap.step3')}}</div>
            <div class="flex border-b border-gray-300 p-3">
              <div class="flex-none">
                <div class=" rounded-full border w-6 h-6" :class="isInvalidSwapService?'border-red-primary':(step7?'border-blue-primary':'border-gray-300')">
                  <div class="flex h-full justify-center">
                    <font-awesome-icon icon="times" class="text-red-primary w-3 h-3 self-center inline-block" v-if="isInvalidSwapService"></font-awesome-icon>
                    <font-awesome-icon icon="check" :class="step7?'text-blue-primary':'text-gray-300'" class="w-3 h-3 self-center inline-block" v-else></font-awesome-icon>
                  </div>
                </div>
              </div>
              <div class="flex-grow text-left text-xs md:text-sm ml-3 self-center transition-all duration-500" :class="step7?'text-gray-700':'text-gray-300'">
                {{ isInvalidSwapService?$t('swap.sendMsgFail'): $t('swap.messageSent') }}
                <div v-if="isInvalidSwapService && swapServerErrIndex <= 3" class="mt-5">
                  <button  type="button" class="bg-blue-primary rounded mr-5 focus:outline-none text-tmd py-2 px-4 text-white hover:shadow-lg disabled:opacity-50" @click="afterSigned" :disabled="disableRetrySwap">{{ retrySwapButtonText }}</button>
                </div>
                <div v-if="swapServerErrIndex>3" class="mt-5 text-tsm sm:text-sm">
                  {{$t('swap.serverErrMsg1')}} <b>{{$t('swap.transactionHash')}}</b>, <b>{{$t('swap.signature')}}</b> {{$t('swap.serverErrMsg2')}} <a href="https://t.me/proximaxhelpdesk" target=_new class="text-blue-primary font-bold underline">{{$t('home.helpdesk')}}</a>.
                </div>
              </div>
            </div>
          </div>
          <div class="mt-10 text-center">
            <button type="submit" class="default-btn focus:outline-none disabled:opacity-50" :disabled="isDisabledValidate" @click="validated()">{{$t('general.continue')}}</button>
          </div>
        </div>
        <div v-if="currentPage==3">
          <div>
            <h1 class="default-title font-bold mt-5 mb-2">{{$t('general.congratz')}}</h1>
            <div class="text-tsm mb-7">{{$t('swap.swapStarted')}}</div>
            <swap-certificate-component :networkTerm="$t('swap.bsc')" swapType="In" :swapToken="swapToken" :swapTimestamp="swapTimestamp" :transactionHash="transactionHash" :siriusName="siriusName" :swappedAmount="amount" :siriusAddress="Helper.createAddress(siriusAddress).pretty()" :swapQr="swapQr" :swapLink="validationLink" />
            <button type="button" class="w-40 hover:shadow-lg bg-blue-primary text-white text-xs hover:opacity-50 rounded font-bold px-4 py-3 border border-blue-primary outline-none mr-4 mt-6" @click="saveCertificate">{{$t('general.certificate')}}</button>
            <div class="mt-3">
              <a :href="validationLink" target=_new class="underline self-center text-xs font-bold text-blue-primary">{{$t('swap.viewTxInExplorer')}}<font-awesome-icon icon="external-link-alt" class="ml-2 text-blue-500 w-3 h-3 self-center inline-block"></font-awesome-icon></a>
            </div>
            <div class="md:mx-20 lg:mx-40 font-bold text-center text-tsm py-5 sm:py-10 mt-5 sm:mt-10 border-t border-gray-200">{{$t('swap.swapDetails')}}</div>
            <div class="md:mx-20 lg:mx-10 xl:mx-40 border-2 border-gray-200 mt-4 p-5 text-xs font-bold filter shadow-lg">
              <div class="text-blue-primary mb-1">{{$t('general.from')}}: {{$t('swap.metamaskAcc')}}</div>
              <div class="break-all">{{ currentAccount }}</div>
              <div class="mt-1">{{$t('swap.swapAmount')}}: {{ amount }} BEP20 {{selectedToken.name.toUpperCase()}}</div>
              <div>
                <img src="@/modules/services/submodule/mainnetSwap/img/icon-dots.svg" class="inline-block h-8 my-2">
              </div>
              <div class="text-blue-primary mb-1">{{$t('general.to')}}: {{ siriusName }}</div>
              <div>{{ Helper.createAddress(siriusAddress).pretty() }}</div>
              <div class="mt-1">{{$t('swap.equivalentTo')}} {{ amountReceived }} {{selectedToken.name.toUpperCase()}} 
              <img src="@/modules/account/img/metx-logo.svg" v-if="selectedToken.name=='metx'" class="w-3 h-3 ml-2 inline relative" style="top: -2px"> 
              <img v-else-if="selectedToken.name=='xpx'" src="@/modules/dashboard/img/icon-xpx.svg" class="w-3 h-3 ml-2 inline relative" style="top: -2px"></div>
            </div>
            <div class="my-5 sm:my-7 text-gray-500 text-xs md:mx-20 lg:mx-10 xl:mx-40">{{$t('swap.swapMsg2')}}</div>
            <label class="inline-flex items-center mb-5">
              <input type="checkbox" class="h-5 w-5 bg-blue-primary" v-model="savedCheck">
              <span class="ml-2 cursor-pointer text-xs font-bold">{{$t('swap.confirmDownloaded')}}</span>
            </label>
            <div class="sm:mt-3 text-center">
              <router-link :to="{ name: 'ViewServicesMainnetSwap' }">
                <button type="submit" class="default-btn mr-5 focus:outline-none w-40 inline-block disabled:opacity-50" :disabled="!savedCheck">{{$t('general.done')}}</button>          
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { computed, ref, watch, onBeforeUnmount, shallowRef } from "vue";
import SupplyInputClean from '@/components/SupplyInputClean.vue';
import SwapCertificateComponent from '@/modules/services/submodule/mainnetSwap/components/SwapCertificateComponent.vue';
import { walletState } from '@/state/walletState';
import { copyToClipboard, getCurrentPriceUSD } from '@/util/functions';
import { useToast } from "primevue/usetoast";
import AddressInputClean from "@/modules/transfer/components/AddressInputClean.vue"
import { ethers } from 'ethers';
import { abi, SwapUtils } from '@/util/swapUtils';
import { networkState } from '@/state/networkState';
import { ChainSwapConfig } from "@/models/stores/chainSwapConfig";
import { Helper } from '@/util/typeHelper';
import { AppState } from '@/state/appState';
import { useI18n } from 'vue-i18n';
import { NamespaceUtils } from '@/util/namespaceUtils';
import { ChainUtils } from '@/util/chainUtils';
import {Address} from 'tsjs-xpx-chain-sdk';

export default {
  name: 'ViewServicesMainnetSwapBSCToSirius',

  components: {
    AddressInputClean,
    SupplyInputClean,
    SwapCertificateComponent,
  },

  setup() {
    const BASE_BYTE_SIZE = 321;
    const nativeFee = ref(0);

    let verifyingTxn;
    const {t} = useI18n();
    const currentNativeTokenName = computed(()=> AppState.nativeToken.label);
    const toggleContact = shallowRef(false)
    const verifyMetaMaskPlugin = ref(true);
    const siriusAddressInput = ref('')
    const siriusAddress = computed(() => {
      if(siriusAddressInput.value.length == 40 || siriusAddressInput.value.length == 46){
        return Helper.createAddress(siriusAddressInput.value).pretty()
      }else{
        return ''
      }
    })
    const showAddressError = shallowRef(true); 
     const chainAPIEndpoint = computed(()=> ChainUtils.buildAPIEndpoint(networkState.selectedAPIEndpoint, networkState.currentNetworkProfile.httpPort));
    watch(siriusAddress,n=>{
      if(n.length==40 || n.length==46){
        checkRecipient()
      }else{
        showAddressError.value = true
      }
    })
  const checkNamespace = async (nsId)=>{
    return await NamespaceUtils.getLinkedAddress(nsId, chainAPIEndpoint.value);
  } 
  const checkRecipient = () =>{
    if(!walletState.currentLoggedInWallet){
        return;
    }
    if(siriusAddress.value.length == 46){
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
    }else{
      showAddressError.value = true;
    }
  }

  const accounts = computed(()=>{
      if(!walletState.currentLoggedInWallet){
        return [];
      }
      let accounts = walletState.currentLoggedInWallet.accounts.map(
        (acc)=>{ 
          return { 
            name: acc.name,
            balance: acc.balance,
            address: acc.address,
            publicKey: acc.publicKey,
            isMultisig: acc.getDirectParentMultisig().length ? true: false
          }; 
        });
        
       
       let otherAccounts =walletState.currentLoggedInWallet.others.filter((acc)=> acc.type === "MULTISIG").map(
        (acc)=>{ 
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
    onBeforeUnmount(() => {
       if(verifyingTxn){
         clearInterval(verifyingTxn);
       }
    })

    let swapData = new ChainSwapConfig(networkState.chainNetworkName);
    swapData.init();

    const minAmount = ref(0)
    const feeAmount = ref(0)
    const tokenDivisibility = ref(0)
    const custodian = ref('');
    const tokenAddress = ref('');
    const selectedToken = ref(null);
    const tokenList = ref([])
    const getBscSwapTokenList = async()=>{
    
      let tokens = await SwapUtils.getSwapTokenList(swapData.swap_XPX_BSC_URL)
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
      }
    }

    /* MetaMask integration */
    let bscNetworkName = swapData.BSCNetworkName;
    let bscChainId = swapData.BSCChainId;
    const isInstallMetamask = ref(false);
    const isMetamaskConnected = ref(false);
    const currentAccount = ref(null);
    const balance = ref(0);
    const coinBalance = ref(0);
    const currentNetwork = ref('');
    const isInvalidConfirmedMeta = ref(false);
    const isInvalidSignedMeta = ref(false);
    const isInvalidSwapService = ref(false);
    const disableRetrySwap = ref(false);
    const retrySwapButtonText = ref(t('swap.retry'));
    const bscScanUrl = swapData.BSCScanUrl;
    
    const transactionFailed = ref(false);

    const signatureMessage = computed(() => {
      if(isInvalidSignedMeta.value){ // when user rejects signature on MetaMask
        return t('swap.rejectMetamask');
      }else{
        return t('swap.signTx');
      }
    });
    getBscSwapTokenList()
    
    const swapServerUrl = computed(()=>{
      
      if (selectedToken.value!=null){
        console.log(SwapUtils.getIncoming_BSCSwapTransfer_URL(swapData.swap_IN_SERVICE_URL,selectedToken.value.name))
        return SwapUtils.getIncoming_BSCSwapTransfer_URL(swapData.swap_IN_SERVICE_URL,selectedToken.value.name)
      }else{
        return ''
      }
    })
    
    watch(selectedToken,token=>{
       SwapUtils.fetchTokenServiceInfo(swapData.swap_IN_SERVICE_URL,token.name).then(async (fetchService)=>{
          if(fetchService.status==200){
            tokenAddress.value = fetchService.data.bscInfo.scAddress;
            custodian.value = fetchService.data.bscInfo.sinkAddress;
            serviceErr.value = '';
            tokenDivisibility.value = fetchService.data.siriusInfo.divisibility;
            nativeFee.value = Helper.safeMultiply(BASE_BYTE_SIZE + (fetchService.data.feeInfo.cosigners * 96), fetchService.data.feeInfo.feePerByte);
            feeAmount.value = fetchService.data.feeInfo.multiplier ?
              Helper.safeMultiply(nativeFee.value, fetchService.data.feeInfo.multiplier) : nativeFee.value;

            if(token.name !== fetchService.data.feeInfo.tokenName.toLowerCase()){
              let prices = await getCurrentPriceUSD(SwapUtils.checkSwapPrice(swapData.priceConsultURL));

              let totalFeeInUSD = Helper.safeMultiply(prices[fetchService.data.feeInfo.tokenName.toLowerCase()], nativeFee.value);
              feeAmount.value = Helper.safeDivideCeilDecimals(totalFeeInUSD, prices[token.name], tokenDivisibility.value);
            }
            
            minAmount.value = Helper.safeMultiplyCeilDecimals(feeAmount.value, 1.2, fetchService.data.feeInfo.decimals);
          }else{
            serviceErr.value = t('swap.serviceDown');
          }
        })
    })
    let provider;
    let signer;

    const initMetamask = ()=>{
       if (typeof window.ethereum !== 'undefined') {
        provider = new ethers.providers.Web3Provider(window.ethereum);
        signer = provider.getSigner();
        isInstallMetamask.value = true;
        isMetamaskConnected.value = ethereum.isConnected()?true:false;
        ethereum
          .request({ method: 'eth_accounts' })
          .then(fetchMetaAccount)
          .catch((err) => {
            console.error(err);
          });
        ethereum
          .request({ method: 'eth_chainId' })
          .then((metaChainId) => {
            verifyChain(metaChainId, false);
          })
          .catch((err) => {
            console.error(err);
          });
        ethereum.on('accountsChanged', handleAccountsChanged);
        ethereum.on('chainChanged', (metaChainId) => {
          verifyChain(metaChainId, true);
        });
      }else{
        console.log('MetaMask not installed')
      }
    }

    initMetamask()

    if(window.ethereum){
      if(!window.ethereum.isMetaMask){
        verifyMetaMaskPlugin.value = false;
      }
    }

    const recheckMetamask = () =>{
      if(window.ethereum){
        initMetamask()
        if(!window.ethereum.isMetaMask){
          verifyMetaMaskPlugin.value = false;
        }
      }
    }

    function fetchMetaAccount(accounts) {
      if (accounts.length === 0) {
        // MetaMask is locked or the user has not connected any accounts
        // console.log('Please connect to MetaMask.');
        coinBalance.value = 0;
        currentAccount.value = '';
      } else if (accounts[0] !== currentAccount.value) {
        currentAccount.value = accounts[0];
        updateToken();
      }
      isMetamaskConnected.value = ethereum.isConnected()?true:false;
    }

    // For now, 'eth_accounts' will continue to always return an array
    function handleAccountsChanged(accounts) {
      if(window.ethereum.isMetaMask){
        if (accounts.length === 0) {
          // MetaMask is locked or the user has not connected any accounts
          // console.log('Please connect to MetaMask.');
          coinBalance.value = 0;
          currentAccount.value = '';
        } else if (accounts[0] !== currentAccount.value) {
          currentAccount.value = accounts[0];
          serviceErr.value = '';
          updateToken();
        }
      }
      isMetamaskConnected.value = ethereum.isConnected()?true:false;
    }

    function verifyChain(chainId, updateTokenBol = false){
      currentNetwork.value = chainId;
      if(bscChainId === parseInt(chainId)){
        err.value = '';
        if(updateTokenBol){
          updateToken();
        }
      }else{
        err.value = t('swap.selectNetworkToSwap',{network: bscNetworkName});
      }
    }

    function updateToken(){
      // get MetaMask balance
      ethereum
      .request({ method: 'eth_getBalance', params: [
        currentAccount.value, 'latest'
      ] })
      .then(hexDecimalBalance => {
        coinBalance.value = parseInt(hexDecimalBalance)/Math.pow(10, 18);
      })
      .catch((err) => {
        console.error(err);
      });
    }

    const connectMetamask = () => {
      if(!window.ethereum.isMetaMask){
        verifyMetaMaskPlugin.value = false;
      }else{
        verifyMetaMaskPlugin.value = true;
        ethereum
        .request({ method: 'eth_requestAccounts' })
        .then(fetchMetaAccount)
        .catch((err) => {
          if (err.code === 4001) {
            // EIP-1193 userRejectedRequest error
            // If this happens, the user rejected the connection request.
            console.log('Please connect to MetaMask.');
          } else {
            if(err.code == '-32002'){
              serviceErr.value = t('swap.approveConnection');
            }
          }
        });
      }
    };

    watch([currentNetwork, currentAccount, tokenAddress], ([newNetwork, newCurrentAccount, newTokenAddress]) => {
      if(newTokenAddress != undefined && newTokenAddress != ''){
        (async () => {
          try{
            provider = new ethers.providers.Web3Provider(window.ethereum, 'any');
            signer = provider.getSigner();
            const contract = new ethers.Contract(newTokenAddress, abi, signer);
            const tokenBalance = await contract.balanceOf(newCurrentAccount);
            balance.value = tokenBalance.toNumber()/Math.pow(10, tokenDivisibility.value);
          }catch(err) {
            balance.value = 0;
          }
        })();
      }
    });

   

    const step1 = ref(false);
    const step2 = ref(false);
    const step3 = ref(false);
    const step4 = ref(false);
    const step5 = ref(false);
    const step6 = ref(false);
    const step7 = ref(false);
    const validationHash = ref('');
    const validationLink = ref('');
    const messageHash = ref('');
    const swapTimestamp = ref('');
    const swapToken = ref('');
    const transactionHash = ref('');
    const swapQr = ref('');

    const saveCertificate = () => {
      SwapUtils.generateIncomingPdfCert('BSC', swapTimestamp.value, siriusAddress.value, swapToken.value, transactionHash.value, swapQr.value);
    };

    const toast = useToast();
    const copy = (id) =>{
      let stringToCopy = document.getElementById(id).getAttribute("copyValue");
      let copySubject = document.getElementById(id).getAttribute("copySubject");
      copyToClipboard(stringToCopy);
      toast.add({severity:'info', summary: copySubject + ' '+ t('general.copied'), detail: stringToCopy , group: 'br-custom', life: 3000});
    };

    const currentPage = ref(1);
    const disableSiriusAddress = ref(false);
    const isDisabledValidate = ref(true);
    const showAmountErr = computed(()=>{
      if(amount.value<= balance.value && amount.value >= minAmount.value){
        return false
      }else{
        return true
      }
    })
    const disableAmount = ref(false);
   
    const err = ref('');
    const serviceErr = ref('');
    const isDisabledSwap = computed(() =>
      // verify it has been connected to MetaMask too
      !(amount.value > 0 && showAddressError.value == false && !err.value && (balance.value >= amount.value) && amount.value>=minAmount.value)
    );
    const amount = ref('0');

    const siriusName = computed(() => {
      let accountSelected = walletState.currentLoggedInWallet.accounts.find(account => account.address == siriusAddress.value) || walletState.currentLoggedInWallet.others.find(account => account.address == siriusAddress.value)
      if(accountSelected){
        return accountSelected.name;
      }else{
        return 'ACCOUNT-' + siriusAddress.value.substring(siriusAddress.value.length-4,siriusAddress.value.length)
      }
    });

    const amountReceived = computed(() => {
      if(Math.round((amount.value - feeAmount.value)*Math.pow(10,tokenDivisibility.value))/Math.pow(10,tokenDivisibility.value) >0 ){
        return Math.round((amount.value - feeAmount.value)*Math.pow(10,tokenDivisibility.value))/Math.pow(10,tokenDivisibility.value)
      }else{
        return 0;
      }
    });


    // const siriusAddressOption = computed(() => {
    //   let siriusAddress = [];
    //   if(walletState.currentLoggedInWallet){
    //     walletState.currentLoggedInWallet.accounts.forEach((account) => {
    //       siriusAddress.push({
    //         label: account.name + ' - ' + account.address,
    //         value: account.address,
    //       })
    //     });
    //   }
    //   return siriusAddress;
    // });

    const sendRequest = () => {
      currentPage.value = 2;
      setTimeout(() => step1.value = true, 1000);
      setTimeout(() => {
        step2.value = true;
        (async() => {
          await getValidation();
          // if(!isInvalidConfirmedMeta.value){
          //   afterConfirmed();
          // }
        })();
      }, 2000);
    };

    const getValidation = async () => {
      try{
        err.value = '';
        isInvalidConfirmedMeta.value = false;
        provider = new ethers.providers.Web3Provider(window.ethereum, 'any');
        signer = provider.getSigner();
        const Contract = new ethers.Contract(tokenAddress.value, abi, signer);
        const data = await SwapUtils.getBSC_GasLimit(swapData.gasPriceConsultURL);
        var options = {
          gasLimit: data.standardGasLimit,
        };
        const receipt = await Contract.transfer(
          custodian.value,
          ethers.utils.parseUnits(amount.value, tokenDivisibility.value),
          options,
        );
        validationHash.value = receipt.hash;
        validationLink.value = bscScanUrl + receipt.hash;
        let getTransaction = await provider.getTransaction(receipt.hash);

        if(getTransaction.hash === receipt.hash){
          // if(parseInt(getTransaction.gasLimit) >= data.standardGasLimit){
          afterConfirmed();
          // }else{
          //   err.value = 'Gas limit is too low';
          //   isInvalidConfirmedMeta.value = true;
          // }
        }
      }catch(err){
        isInvalidConfirmedMeta.value = true;
        if(err.code = '-32000'){
          err.value = err.message;
        }
      }
    };

    const afterConfirmed = () => {
      step3.value = true;
    };

    const isCheckingTxnConfirmation = ref(false);
    const isDisabledCheckTxnConfirmed = ref(false);
    const isTxnNotConfirmed = ref(false);

    const triggerTxnConfirmation = () => {
      isCheckingTxnConfirmation.value = true;
      isDisabledCheckTxnConfirmed.value = true;
      isTxnNotConfirmed.value = false;
      setTimeout( async () => {
        await checkTxnConfirmation();
      }, 2000);
    }

    const checkTxnConfirmation = async () => {
      const status = await verifyTransaction();
      isCheckingTxnConfirmation.value = false;
      if(status){
        if(!transactionFailed.value){
          isTxnNotConfirmed.value = false;
          setTimeout( ()=> step4.value = true, 1000);
          setTimeout( ()=> {
            step5.value = true;
            (async() => {
              await getSigned(false);
            })();
          }, 2000);
        }else{
          isDisabledCheckTxnConfirmed.value = false;
          isTxnNotConfirmed.value = true;
        }
      }else{
        isDisabledCheckTxnConfirmed.value = false;
        isTxnNotConfirmed.value = true;
      }
    }

    const swapServiceParam = ref('');

    const getSigned = async () => {
      try{
        isInvalidSignedMeta.value = false;
        provider = new ethers.providers.Web3Provider(window.ethereum, 'any');
        signer = provider.getSigner();
        const messageSignature = await signer.signMessage(siriusAddress.value);
        messageHash.value = messageSignature;
        const data = {
          recipient: siriusAddress.value,
          signature: messageSignature,
          txnInfo: {
            network: "BSC",
            txnHash: validationHash.value
          }
        };
        swapServiceParam.value = data;
        await afterSigned();
      }catch(err){
        isInvalidSignedMeta.value = true;
      }
    };

    const verifyTransaction = async () => {
      try{
        let transactionReceipt = await provider.getTransactionReceipt(validationHash.value);
        if(transactionReceipt && transactionReceipt.status === 1){
          return true;
        }
        else if(transactionReceipt && transactionReceipt.status === 0){
          transactionFailed.value = true;
          return true;
        }
        else{
          return false;
        }
      }catch(err){
        console.log(err);
        return false;
      }
    }

    const swapServerErrIndex = ref(0);

    const afterSigned = async () => {
      step6.value = true;
      step7.value = true;
      retrySwapButtonText.value = t('swap.initiatingSwap');
      disableRetrySwap.value = true;
      let stringifyData = JSON.stringify(swapServiceParam.value);
      try {
        const response = await fetch(swapServerUrl.value, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: stringifyData, // body data type must match "Content-Type" header
        });

        if(response.status == 200 || response.status == 201){
          const data = await response.json();
          isInvalidSwapService.value = false;
          transactionHash.value = data.transactionId;
          swapTimestamp.value = Helper.IsoTimeRemoveFormat(data.timestamp);
          swapToken.value = Helper.toUppercase(selectedToken.value.name);
          swapQr.value = SwapUtils.generateQRCode(validationLink.value);
          setTimeout( ()=> isDisabledValidate.value = false, 1000);
          swapServerErrIndex.value = 0;
        }
        else if(response.status == 202){
          const data = await response.json();
          isInvalidSwapService.value = false;
          transactionHash.value = data.transactionId;
          swapTimestamp.value = Helper.IsoTimeRemoveFormat(data.timestamp);
          swapToken.value = Helper.toUppercase(selectedToken.value.name);
          swapQr.value = SwapUtils.generateQRCode(validationLink.value);
          setTimeout( ()=> isDisabledValidate.value = false, 1000);
          swapServerErrIndex.value = 0;
        }
        else if(response.status == 208){
          console.log('208');
        }else{
          isInvalidSwapService.value = true;
          ++swapServerErrIndex.value;
          retrySwapButtonText.value = t('swap.retry');
          disableRetrySwap.value = false;
        }
      } catch (error) {
        isInvalidSwapService.value = true;
        ++swapServerErrIndex.value;
        retrySwapButtonText.value = t('swap.retry');
        disableRetrySwap.value = false;
      }
    };

    const validated = () => {
      currentPage.value = 3;
    };

    const savedCheck = ref(false);

    return {
      recheckMetamask,
      contacts,
      err,
      balance,
      isInstallMetamask,
      connectMetamask,
      isMetamaskConnected,
      currentAccount,
      copy,
      currentPage,
      isDisabledValidate,
      siriusAddressInput,
      siriusAddress,
      disableSiriusAddress,
      showAmountErr,
      sendRequest,
      validated,
      amount,
      disableAmount,
      isDisabledSwap,
      savedCheck,
      toggleContact,
      step1,
      step2,
      step3,
      step4,
      step5,
      step6,
      step7,
      validationLink,
      validationHash,
      messageHash,
      transactionHash,
      swapTimestamp,
      swapToken,
      swapQr,
      saveCertificate,
      isInvalidConfirmedMeta,
      isInvalidSignedMeta,
      isInvalidSwapService,
      getValidation,
      getSigned,
      serviceErr,
      swapServerErrIndex,
      afterSigned,
      disableRetrySwap,
      retrySwapButtonText,
      signatureMessage,
      checkTxnConfirmation,
      triggerTxnConfirmation,
      isCheckingTxnConfirmation,
      isDisabledCheckTxnConfirmed,
      isTxnNotConfirmed,
      transactionFailed,
      verifyMetaMaskPlugin,
      currentNativeTokenName,
      walletState,
      amountReceived,
      Helper,
      siriusName,
      minAmount,
      feeAmount,
      tokenDivisibility,
      tokenList,
      selectedToken,
      checkRecipient,
      showAddressError,
    };
  },
}
</script>