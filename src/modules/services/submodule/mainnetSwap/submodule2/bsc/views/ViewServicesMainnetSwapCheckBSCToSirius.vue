<template>
  <div>
    <div class='lg:w-9/12 ml-2 mr-2 lg:ml-auto lg:mr-auto mt-5'>
      <div class='mt-6 p-6 border filter shadow-lg text-center'>
        <div class="text-md">{{$t('swap.mainNetworkSwap')}}</div>
        <div class="text-xs my-3 mb-5 sm:mb-10"><img src="@/modules/services/submodule/mainnetSwap/img/bsc.svg" class="mr-2 h-5 inline-block">{{$t('general.check')}} {{$t('swap.swapBscToSirius')}}</div>
        <div class="flex my-10">
          <div class="flex-none">
            <div class="flex border border-gray-300 rounded-md filter shadow-md">
              <div class="flex w-6 h-6 sm:w-10 sm:h-10" :class="`${ currentPage>=1?'bg-yellow-500':'bg-gray-300' }`"><div class="self-center inline-block text-center w-full text-txs sm:text-sm font-bold" :class="`${ currentPage>=1?'text-white':'text-gray-400' }`">1</div></div>
              <div class="px-4 sm:px-10 self-center text-xxs sm:text-xs hidden md:inline-block lg:hidden xl:inline-block">{{$t('swap.inputInfo')}}</div>
            </div>
          </div>
          <div class="flex-grow self-center md:mx-4 h-0.5 bg-gray-100"></div>
          <div class="flex-none">
            <div class="flex border border-gray-300 rounded-md filter shadow-md">
              <div class="flex w-6 h-6 sm:w-10 sm:h-10" :class="`${ currentPage>=2?'bg-yellow-500':'bg-gray-300' }`"><div class="self-center inline-block text-center w-full text-txs sm:text-sm font-bold" :class="`${ currentPage>=2?'text-white':'text-gray-400' }`">2</div></div>
              <div class="px-4 sm:px-10 self-center text-xxs sm:text-xs hidden md:inline-block lg:hidden xl:inline-block">{{$t('swap.validation')}}</div>
            </div>
          </div>
        </div>
        <div v-if="currentPage==1">
          <div class="text-lg my-7 font-bold">{{$t('swap.checkSwapStatus')}}</div>
          <div class="error error_box mb-5" v-if="!isInstallMetamask">{{$t('swap.noMetamask')}}</div>
          <button @click="recheckMetamask()" v-if="!isInstallMetamask" class="text-xs blue-btn p-2 mb-3">Recheck MetaMask</button>
          <div class="bg-yellow-200 text-yellow-900 text-tsm p-3 mb-5 rounded-2xl" v-if="!verifyMetaMaskPlugin">{{$t('swap.noOtherExtension')}} <b>{{$t('swap.metamask')}}</b>.<div class="my-2">{{$t('swap.referTo')}}<a href="https://bit.ly/3mVayCu" target=_new class="text-blue-primary">{{$t('swap.walkthrough')}}<font-awesome-icon icon="external-link-alt" class="text-blue-primary w-3 h-3 self-center inline-block ml-1"></font-awesome-icon></a>{{$t('swap.forMoreDetails')}}</div>{{$t('swap.refreshMsg')}}</div>
          <div class="error error_box mb-5" v-if="serviceErr!=''">{{ serviceErr }}</div>
          <div class="error error_box mb-5" v-if="err!=''">{{ err }}</div>
          <p class="font-bold text-xs text-left mb-1">{{$t('dashboard.type')}}</p>
          <div class="mb-5 mt-3 text-left">
            <button class="bg-blue-primary px-3 py-2 w-20 text-white font-bold rounded-l border border-blue-primary cursor-auto">{{$t('general.in')}}</button><button class="border px-3 py-2 w-20 text-blue-primary font-bold rounded-r cursor-pointer hover:border-blue-primary hover:bg-blue-50 transition-all duration-200" @click="$router.push({name: 'ViewServicesMainnetSwapCheckSiriusToBSC'})">{{$t('general.out')}}</button> <span class="text-gray-500 ml-3 text-tsm">{{$t('swap.bscToSirius')}}</span>
          </div>
          <div class="mb-5 md:flex md:justify-between border border-gray-200 rounded">
            <div class="flex justify-left">
              <div class="w-18 flex items-center justify-center py-5 sm:h-20">
                <img src="@/modules/services/submodule/mainnetSwap/img/icon-metamask-fox.svg" class="w-8 h-8 inline-block">
              </div>
              <div class="text-left flex items-center">
                <div>
                  <div class="text-xxs uppercase text-blue-primary font-bold mb-1">{{$t('swap.fromMetamaskAddress')}}</div>
                  <div class="font-bold text-black text-tsm break-all mr-2">{{ isMetamaskConnected?(currentAccount?currentAccount:$t('swap.connected')):$t('swap.notConnected') }}</div>
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
          <TextInputClean :placeholder="'BSC '+ $t('swap.transactionHash')" :errorMessage="$t('swap.enterValidHash')" v-bind:showError="showTxnHashError" v-model="remoteTxnHash" class="w-full" />
          <div class="mt-10 text-center">
            <button @click="$router.push({name: 'ViewServicesMainnetSwap'})" class="text-black font-bold text-xs mr-5 focus:outline-none disabled:opacity-50">{{$t('general.cancel')}}</button>
            <button type="submit" class="default-btn focus:outline-none disabled:opacity-50" :disabled="isDisabledCheck" @click="checkStatus">{{$t('swap.checkStatus')}}</button>
          </div>
        </div>
        <div v-if="currentPage==2">
          <div class="text-lg my-7">
            <div class="error error_box mb-5" v-if="err!=''">{{ err }}</div>
            <div class="font-bold text-left text-xs md:text-sm" :class="step1?'text-gray-700':'text-gray-300'">{{$t('swap.checkStep1',{network: $t('swap.bsc')})}}</div>
            <div class="flex border-b border-gray-300 p-3">
              <div class="flex-none">
                <div class=" rounded-full border w-6 h-6 transition-all duration-500" :class="step1?'border-blue-primary':'border-gray-300'">
                  <div class="flex h-full justify-center">
                    <font-awesome-icon icon="check" :class="step1?'text-blue-primary':'text-gray-300'" class="w-3 h-3 self-center inline-block transition-all duration-500"></font-awesome-icon>
                  </div>
                </div>
              </div>
              <div class="flex-grow text-left text-xs md:text-sm ml-3 self-center transition-all duration-500" :class="step1?'text-gray-700':'text-gray-300'">{{$t('swap.checkingStatus',{network: $t('swap.bsc')})}}<div class="text-tsm text-gray-500 my-3" v-if="transactionPending">{{$t('swap.pendingConfirmation',{number: numConfirmation})}} </div></div>
            </div>
            <div class="flex border-b border-gray-300 p-3">
              <div class="flex-none">
                <div class=" rounded-full border w-6 h-6 transition-all duration-500" :class="isInvalidRemoteTxnHash?'border-red-primary':(step2?'border-blue-primary':'border-gray-300')">
                  <div class="flex h-full justify-center">
                    <font-awesome-icon icon="times" class="text-red-primary w-3 h-3 self-center inline-block transition-all duration-500" v-if="isInvalidRemoteTxnHash"></font-awesome-icon>
                    <font-awesome-icon icon="check" :class="step2?'text-blue-primary':'text-gray-300'" class="w-3 h-3 self-center inline-block transition-all duration-500" v-else></font-awesome-icon>
                  </div>
                </div>
              </div>
              <div class="flex-grow text-left text-xs md:text-sm ml-3 self-center transition-all duration-500" :class="step2?'text-gray-700':'text-gray-300'">
                {{ isInvalidRemoteTxnHash?(transactionNotFound? $t('swap.txNotFound'):$t('swap.txFailed')):$t('swap.txSuccessful',{network: $t('swap.bsc')}) }}
                <div v-if="!isInvalidRemoteTxnHash && step2" class="mt-2">
                  <div v-if="remoteTxnHash" class="bg-yellow-100 py-2 px-5 mt-1 rounded-xl flex">
                    <a :href="remoteTxnLink" target=_new :class="isInvalidRemoteTxnHash?'text-gray-300':'text-blue-primary'" class="flex-grow break-all text-tsm self-center hover:underline" id="validateTransfer" :copyValue="remoteTxnHash" :copySubject="$t('swap.transactionHash')"><font-awesome-icon icon="external-link-alt" class="text-blue-primary w-3 h-3 self-center inline-block mr-2"></font-awesome-icon>{{ remoteTxnHash }}</a>
                    <div class="flex-none">
                      <font-awesome-icon icon="copy" @click="copy('validateTransfer')" class="w-5 h-5 text-blue-primary cursor-pointer self-center ml-3 absoltue top-2 hover:opacity-90 duration-800 transition-all" v-if="step2"></font-awesome-icon>
                    </div>
                  </div>
                </div>
                <div v-if="isInvalidRemoteTxnHash && step2" class="mt-2 text-sm text-gray-700">
                  {{ txtRemoteTransactionErrorMsg }}
                  <router-link :to="{ name: 'ViewServicesMainnetSwapBSCToSirius' }" class="bg-blue-primary text-white py-2 px-5 rounded-2xl w-24 block text-center my-3 font-bold">{{$t('general.swap')}}</router-link>
                </div>
              </div>
            </div>
            <div class="font-bold text-left text-xs md:text-sm mt-4" :class="step3?'text-gray-700':'text-gray-300'">{{$t('swap.checkStep2')}}</div>
            <div class="flex border-b border-gray-300 p-3">
              <div class="flex-none">
                <div class=" rounded-full border w-6 h-6" :class="step3?'border-blue-primary':'border-gray-300'">
                  <div class="flex h-full justify-center">
                    <font-awesome-icon icon="check" :class="step3?'text-blue-primary':'text-gray-300'" class="w-3 h-3 self-center inline-block"></font-awesome-icon>
                  </div>
                </div>
              </div>
              <div class="flex-grow text-left text-xs md:text-sm ml-3 self-center transition-all duration-500" :class="step3?'text-gray-700':'text-gray-300'">{{$t('swap.requestFromSwap')}}</div>
            </div>
            <div class="flex border-b border-gray-300 p-3">
              <div class="flex-none">
                <div class=" rounded-full border w-6 h-6" :class="(isInvalidSwapCheck && step4)?'border-red-primary':(step4?'border-blue-primary':'border-gray-300')">
                  <div class="flex h-full justify-center">
                    <font-awesome-icon icon="times" class="text-red-primary w-3 h-3 self-center inline-block" v-if="isInvalidSwapCheck && step4"></font-awesome-icon>
                    <font-awesome-icon icon="check" :class="step4?'text-blue-primary':'text-gray-300'" class="w-3 h-3 self-center inline-block" v-else></font-awesome-icon>
                  </div>
                </div>
              </div>
              <div class="flex-grow text-left text-xs md:text-sm ml-3 self-center transition-all duration-500" :class="step4?'text-gray-700':'text-gray-300'">
                {{ (isInvalidSwapCheck && step4)?(isCheckSwapStatusNotFound?$t('swap.txNotFound'):$t('swap.txInvalid')):$t('swap.swapSuccess') }}
                <div v-if="!isInvalidSwapCheck && step4" class="mt-2">
                  <div v-if="siriusTxnHash" class="bg-yellow-100 py-2 px-5 mt-1 rounded-xl flex">
                    <a :href="siriusTxnLink" target=_new class="text-blue-primary flex-grow break-all text-tsm self-center hover:underline" id="validateTransfer" :copyValue="remoteTxnHash" :copySubject="$t('swap.transactionHash')"><font-awesome-icon icon="external-link-alt" class="text-blue-primary w-3 h-3 self-center inline-block mr-2"></font-awesome-icon>{{ siriusTxnHash }}</a>
                    <div class="flex-none">
                      <font-awesome-icon icon="copy" @click="copy('validateTransfer')" class="w-5 h-5 text-blue-primary cursor-pointer self-center ml-3 absoltue top-2 hover:opacity-90 duration-800 transition-all" v-if="step4"></font-awesome-icon>
                    </div>
                  </div>
                  <div class="text-gray-600 mt-3 text-tsm ml-2">{{$t('swap.swapSuccess2')}}</div>
                </div>
                <div v-if="isInvalidSwapCheck && step4">
                  <div class="sm:flex my-4">
                    <button :disabled="isInitiateSwap" @click="displayInitiateSwapPanel" class="sm:flex-none justify-start sm:justify-end bg-blue-primary h-15 w-40 rounded mr-5 focus:outline-none text-tsm font-bold py-2 border border-blue-primary px-8 text-white hover:shadow-lg mt-3 sm:mt-0 disabled:opacity-50 self-center" type="button">{{$t('swap.initiateSwap')}}</button>
                    <div class="py-2 sm:flex-grow text-tsm">
                      <div class="mb-1">{{$t('swap.initiateSwapWithHash',{network: $t('swap.bsc')})}}</div>
                    </div>
                  </div>
                </div>
                <div v-if="isInitiateSwap">
                  <div class="sm:flex justify-between">
                    <div class="w-full">
                      <div class="flex">
                        <AddressInputClean :placeholder="$t('transfer.transferPlaceholder')" v-model="siriusAddressSelected" v-debounce:1000="checkRecipient" :showError="showAddressError" />
                        <div @click="toggleContact=!toggleContact" class=' border rounded-md cursor-pointer flex flex-col justify-around p-2 ' >
                          <font-awesome-icon icon="id-card-alt" class=" text-blue-primary ml-auto mr-auto "></font-awesome-icon>
                          <div class='text-xxs text-blue-primary font-semibold uppercase'>{{$t('general.select')}}</div>
                        </div>
                      </div>
                      <div v-if="toggleContact" class=" border ">
                        <div class='text-xxs text-left text-gray-300 font-semibold py-2 px-2 uppercase'>{{$t('general.importFromAB')}}</div>
                        <div v-for="(item, number) in contacts" :key="number" class="cursor-pointer">
                          <div @click="siriusAddressSelected=item.value;toggleContact=false" class="flex justify-between">
                            <div v-if="number%2==0" class="text-xs py-2 bg-gray-100 pl-2 w-full text-left">{{item.label}}</div>
                            <div v-if="number%2==1" class="text-xs py-2 pl-2 w-full text-left">{{item.label}}</div>
                            <div v-if="number%2==0" class="ml-auto pr-2 text-xxs py-2 font-semibold text-blue-primary bg-gray-100 uppercase">{{$t('general.select')}}</div>
                            <div v-if="number%2==1" class="ml-auto mr-2 text-xxs py-2 font-semibold text-blue-primary uppercase">{{$t('general.select')}}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <button :disabled="!siriusAddressSelected || !disableConfirmAddressSelection" @click="confirmAddress" class="sm:flex-none justify-start sm:justify-end bg-blue-primary h-15 w-40 rounded-3xl sm:ml-5 focus:outline-none text-tsm font-bold py-2 border border-blue-primary px-8 text-white hover:shadow-lg mt-3 sm:mt-2 disabled:opacity-50 self-center" type="button">{{$t('general.confirm')}}</button>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="isInitiateSwap">
              <div class="font-bold text-left text-xs md:text-sm mt-4" :class="step5?'text-gray-700':'text-gray-300'">{{$t('swap.checkStep3',{network: $t('swap.sirius')})}}</div>
              <div class="flex border-b border-gray-300 p-3">
                <div class="flex-none">
                  <div class=" rounded-full border w-6 h-6" :class="step5?'border-blue-primary':'border-gray-300'">
                    <div class="flex h-full justify-center">
                      <font-awesome-icon icon="check" :class="step5?'text-blue-primary':'text-gray-300'" class="w-3 h-3 self-center inline-block"></font-awesome-icon>
                    </div>
                  </div>
                </div>
                <div class="flex-grow text-left text-xs md:text-sm ml-3 self-center transition-all duration-500" :class="step5?'text-gray-700':'text-gray-300'">{{$t('swap.sendingMsg')}}</div>
              </div>
              <div class="flex border-b border-gray-300 p-3">
                <div class="flex-none">
                  <div class=" rounded-full border w-6 h-6" :class="isInvalidSignedMeta?'border-red-primary':(step6?'border-blue-primary':'border-gray-300')">
                    <div class="flex h-full justify-center">
                      <font-awesome-icon icon="times" class="text-red-primary w-3 h-3 self-center inline-block" v-if="isInvalidSignedMeta"></font-awesome-icon>
                      <font-awesome-icon icon="check" :class="step5?'text-blue-primary':'text-gray-300'" class="w-3 h-3 self-center inline-block" v-else></font-awesome-icon>
                    </div>
                  </div>
                </div>
                <div class="flex-grow text-left text-xs md:text-sm ml-3 self-center transition-all duration-500" :class="step6?'text-gray-700':'text-gray-300'">
                  {{ signatureMessage }}
                  <div v-if="isInvalidSignedMeta" class="mt-5">
                    <button  type="button" class="bg-blue-primary rounded-3xl mr-5 focus:outline-none text-tmd py-2 px-4 text-white hover:shadow-lg w-24" @click="getSigned">{{$t('swap.retry')}}</button>
                  </div>
                </div>
              </div>
              <div class="flex border-b border-gray-300 p-3">
                <div class="flex-none">
                  <div class=" rounded-full border w-6 h-6" :class="step7?'border-blue-primary':'border-gray-300'">
                    <div class="flex h-full justify-center">
                      <font-awesome-icon icon="check" :class="step7?'text-blue-primary':'text-gray-300'" class="w-3 h-3 self-center inline-block"></font-awesome-icon>
                    </div>
                  </div>
                </div>
                <div class="flex-grow text-left text-xs md:text-sm ml-3 self-center transition-all duration-500" :class="step7?'text-gray-700':'text-gray-300'">{{$t('swap.messageSigned')}} <div class="bg-yellow-100 py-2 px-5 mt-1 rounded-xl flex" v-if="messageHash && step7"><div :class="step7?'text-gray-500':'text-gray-300'" class="text-tsm break-all flex-grow" id="validateMessage" :copyValue="messageHash" :copySubject="$t('swap.signatureHash')">{{ messageHash }}</div><div class="flex-none"><font-awesome-icon icon="copy" @click="copy('validateMessage')" class="w-5 h-5 text-blue-primary cursor-pointer self-center ml-3 absoltue top-2 hover:opacity-90 duration-800 transition-all" v-if="step7"></font-awesome-icon></div></div></div>
              </div>
              <div class="font-bold text-left text-xs md:text-sm mt-4" :class="step8?'text-gray-700':'text-gray-300'">{{$t('swap.checkStep4')}}</div>
              <div class="flex border-b border-gray-300 p-3">
                <div class="flex-none">
                  <div class=" rounded-full border w-6 h-6" :class="isInvalidSwapService?'border-red-primary':(step8?'border-blue-primary':'border-gray-300')">
                    <div class="flex h-full justify-center">
                      <font-awesome-icon icon="times" class="text-red-primary w-3 h-3 self-center inline-block" v-if="isInvalidSwapService"></font-awesome-icon>
                      <font-awesome-icon icon="check" :class="step8?'text-blue-primary':'text-gray-300'" class="w-3 h-3 self-center inline-block" v-else></font-awesome-icon>
                    </div>
                  </div>
                </div>
                <div class="flex-grow text-left text-xs md:text-sm ml-3 self-center transition-all duration-500" :class="step8?'text-gray-700':'text-gray-300'">
                  {{ isInvalidSwapService?$t('swap.sendMsgFail'):(swapStatus208?$t('swap.swapInitiated'):$t('swap.messageSent')) }}
                  <div v-if="isInvalidSwapService && swapServerErrIndex <= 3" class="mt-5">
                    <button  type="button" class="bg-blue-primary rounded-3xl mr-5 focus:outline-none text-tmd py-2 px-4 text-white hover:shadow-lg disabled:opacity-50" @click="afterSigned" :disabled="disableRetrySwap">{{ retrySwapButtonText }}</button>
                  </div>
                  <div v-if="swapServerErrIndex > 3" class="mt-5 text-tsm sm:text-sm">
                    {{$t('swap.serverErrMsg1')}}<b>{{$t('swap.transactionHash')}}</b>,<b>{{$t('swap.signature')}}</b> {{$t('swap.serverErrMsg2')}} <a href="https://t.me/proximaxhelpdesk" target=_new class="text-blue-primary font-bold underline">{{$t('home.helpdesk')}}</a>.
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="mt-10 text-center">
            <button type="submit" class="default-btn focus:outline-none disabled:opacity-50" :disabled="isDisabledValidate" @click="validated()" v-if="isInitiateSwap && !swapStatus208">{{$t('general.continue')}}</button>
            <router-link :to="{ name: 'ViewServicesMainnetSwap' }" class="default-btn focus:outline-none w-40 inline-block" :class="isDisabledValidate?'opacity-50':''" :is="isDisabledValidate?'span':'router-link'" tag="button" v-else>{{$t('general.done')}}</router-link>
          </div>
        </div>
        <div v-if="currentPage==3">
          <div>
            <h1 class="default-title font-bold mt-5 mb-2">{{$t('general.congratz')}}</h1>
            <div class="text-tsm mb-7">{{$t('swap.swapStarted')}}</div>
            <swap-certificate-component :networkTerm="$t('swap.bsc')" swapType="In" :swapToken="swapToken" :swapTimestamp="swapTimestamp" :transactionHash="transactionHash" :siriusName="siriusAddressSelectedName" :swappedAmount="amount" :siriusAddress="Helper.createAddress(siriusAddressSelected).pretty()" :swapQr="swapQr" :swapLink="remoteTxnLink" />
            <button type="button" class="w-40 hover:shadow-lg bg-blue-primary text-white text-xs hover:opacity-50 rounded font-bold px-4 py-3 border border-blue-primary outline-none mr-4 mt-6" @click="saveCertificate">{{$t('general.downloadCertificate')}}</button>
            <div class="mt-3">
              <a :href="remoteTxnLink" target=_new class="underline self-center text-xs font-bold text-blue-primary">{{$t('swap.viewTxInExplorer')}}<font-awesome-icon icon="external-link-alt" class="ml-2 text-blue-500 w-3 h-3 self-center inline-block"></font-awesome-icon></a>
            </div>
            <div class="md:mx-20 lg:mx-40 font-bold text-center text-tsm py-5 sm:py-10 mt-5 sm:mt-10 border-t border-gray-200">{{$t('swap.swapDetails')}}</div>
            <div class="md:mx-20 lg:mx-10 xl:mx-40 border-2 border-gray-200 mt-4 p-5 text-xs font-bold filter shadow-lg">
              <div class="text-blue-primary mb-1">{{$t('general.from')}}: {{$t('swap.metamaskAcc')}}</div>
              <div class="break-all">{{ currentAccount }}</div>
              <div class="mt-1">{{$t('swap.swapAmount')}} {{ amount }}</div>
              <div>
                <img src="@/modules/services/submodule/mainnetSwap/img/icon-dots.svg" class="inline-block h-8 my-2">
              </div>
              <div class="text-blue-primary mb-1">{{$t('general.to')}}: {{ siriusAddressSelectedName }}</div>
              <div>{{ Helper.createAddress(siriusAddress).pretty() }}</div>
              <div class="mt-1">{{$t('swap.equivalentTo')}} {{ amountReceived }} of {{ currentNativeTokenName }} <img src="@/modules/dashboard/img/icon-xpx.svg" class="w-3 h-3 ml-2 inline relative" style="top: -2px"></div>
            </div>
            <div class="my-5 sm:my-7 text-gray-500 text-xs md:mx-20 lg:mx-10 xl:mx-40">{{$t('swap.swapMsg2')}}</div>
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
import { computed, ref, watch, onBeforeUnmount, shallowRef } from "vue";
import TextInputClean from '@/components/TextInputClean.vue';
import SwapCertificateComponent from '@/modules/services/submodule/mainnetSwap/components/SwapCertificateComponent.vue';
import SelectInputAccount from '@/components/SelectInputAccount.vue';
import AddressInputClean from "@/modules/transfer/components/AddressInputClean.vue";
import { walletState } from '@/state/walletState';
import { copyToClipboard } from '@/util/functions';
import { useToast } from "primevue/usetoast";
import { ethers } from 'ethers';
import { SwapUtils } from '@/util/swapUtils';
import { networkState } from '@/state/networkState';
import { ChainSwapConfig } from "@/models/stores/chainSwapConfig";
import { Helper } from '@/util/typeHelper';
import { AppState } from '@/state/appState';
import { useI18n } from 'vue-i18n';
import {Address} from 'tsjs-xpx-chain-sdk';

export default {
  name: 'ViewServicesMainnetSwapCheckBSCToSirius',

  components: {
    TextInputClean,
    SwapCertificateComponent,
    SelectInputAccount,
    AddressInputClean,
  },

  setup() {
    let verifyingTxn;
    const {t} = useI18n();
    const verifyMetaMaskPlugin = ref(true);

    onBeforeUnmount(() => {
       if(verifyingTxn){
         clearInterval(verifyingTxn);
       }
    })

    let swapData = new ChainSwapConfig(networkState.chainNetworkName);
    swapData.init();

    // const defaultXPXTxFee = ref(0);
    const sinkAddress = ref('');
    const bscTokensInfo = ref([]);

    (async() => {
      try {
        const fetchService = await SwapUtils.fetchAllSwapServiceInfo(swapData.swap_IN_SERVICE_URL);
        if(fetchService.status==200){
          bscTokensInfo.value = fetchService.data.bscScAddressInfo;
          sinkAddress.value = fetchService.data.bscInfo.sinkAddress;
          // defaultXPXTxFee.value = parseInt(fetchService.data.siriusInfo.feeAmount);
          serviceErr.value = '';
        }else{
          serviceErr.value = t('swap.serviceDown');
        }
      } catch (error) {
        serviceErr.value = t('swap.serviceDown');
      }
    })()

    const txnHashPattern= "^[0-9A-Za-z]{66}$";
    const remoteTxnHash = ref('');
    const showTxnHashError = computed(()=> !remoteTxnHash.value.match(txnHashPattern) && remoteTxnHash.value.length > 0);

    /* MetaMask integration */
    let bscChainId = swapData.BSCChainId;
    let bscNetworkName = swapData.BSCNetworkName;
    const isInstallMetamask = ref(false);
    const isMetamaskConnected = ref(false);
    const currentAccount = ref(null);
    const currentNetwork = ref('');

    const isInvalidSignedMeta = ref(false);
    const isInvalidSwapService = ref(false);
    const disableRetrySwap = ref(false);
    const retrySwapButtonText = ref(t('swap.retry'));

    const isInvalidRemoteTxnHash = ref(false);
    const isPendingRemoteTxnHash = ref(false);
    const transactionNotFound = ref(false);
    const transactionFailed = ref(false);
    const transactionPending = ref(false);
    const fromTokenName = ref('xpx');
    const toTokenName = ref('xpx');
    // const transactionSuccess = ref(false);

    const bscScanUrl = swapData.BSCScanUrl;
    const checkSwapStatusUrl = computed(()=>{
      return SwapUtils.getIncoming_BSCCheckStatus_URL(swapData.swap_IN_SERVICE_URL, "bsc", remoteTxnHash.value);
    });
    const siriusTokens = ["XPX", "METX"];

    const swapUrl = computed(()=>{ 

      if(siriusTokens.includes(fromTokenName.value.toUpperCase())){
        return SwapUtils.getIncoming_BSCSwapTransfer_URL(swapData.swap_IN_SERVICE_URL, fromTokenName.value.toLowerCase());
      }
      else{
        return SwapUtils.getIncoming_SwapTransfer_URL(swapData.swap_IN_SERVICE_URL);
      }
    });


    let provider;
    let signer;

    if(window.ethereum){
      if(!window.ethereum.isMetaMask){
        verifyMetaMaskPlugin.value = false;
      }
    }

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
            verifyChain(metaChainId);
          })
          .catch((err) => {
            console.error(err);
          });
        ethereum.on('accountsChanged', handleAccountsChanged);
        ethereum.on('chainChanged', (metaChainId) => {
          verifyChain(metaChainId);
        });
      }else{
        console.log('MetaMask not installed')
      }
    }

    initMetamask()

    function fetchMetaAccount(accounts) {
      if (accounts.length === 0) {
        // MetaMask is locked or the user has not connected any accounts
        // console.log('Please connect to MetaMask.');
        currentAccount.value = '';
      } else if (accounts[0] !== currentAccount.value) {
        currentAccount.value = accounts[0];
      }
      isMetamaskConnected.value = ethereum.isConnected()?true:false;
    }

    // For now, 'eth_accounts' will continue to always return an array
    function handleAccountsChanged(accounts) {
      if(window.ethereum.isMetaMask){
        if (accounts.length === 0) {
          // MetaMask is locked or the user has not connected any accounts
          currentAccount.value = '';
        } else if (accounts[0] !== currentAccount.value) {
          currentAccount.value = accounts[0];
          serviceErr.value = '';
        }
      }
      isMetamaskConnected.value = ethereum.isConnected()?true:false;
    }

    function verifyChain(chainId){
      currentNetwork.value = chainId;
      if(bscChainId === parseInt(chainId)){
        err.value = '';
      }else{
        err.value = t('swap.selectNetworkToSwap',{network: bscNetworkName});
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
    const connectMetamask = () => {
      initMetamask()
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

    const isInvalidSwapCheck = ref(false);
    const isCheckSwapStatusNotFound = ref(false);

    const step1 = ref(false);
    const step2 = ref(false);
    const step3 = ref(false);
    const step4 = ref(false);

    const messageHash = ref('');
    const swapTimestamp = ref('');
    const swapId = ref('');
    const transactionHash = ref('');
    const swapQr = ref('');
    const swapToken = ref('');

    const saveCertificate = () => {
      SwapUtils.generateIncomingPdfCert('BSC', swapTimestamp.value, siriusAddressSelected.value, swapToken.value, transactionHash.value, swapQr.value);
    };

    const toast = useToast();
    const copy = (id) =>{
      let stringToCopy = document.getElementById(id).getAttribute("copyValue");
      let copySubject = document.getElementById(id).getAttribute("copySubject");
      copyToClipboard(stringToCopy);
      toast.add({severity:'info', summary: copySubject + ' ' + t('general.copied'), detail: stringToCopy , group: 'br-custom', life: 3000});
    };

    const currentPage = ref(1);

    const isDisabledValidate = ref(true);

    const siriusAddress = ref('');
    const err = ref('');
    const serviceErr = ref('');
    const isDisabledCheck = computed(() =>
      // verify it has been connected to MetaMask too
      !(!err.value && !(showTxnHashError.value && remoteTxnHash.value.length > 0) && remoteTxnHash.value.length > 0)
    );

    const checkStatus = () => {
      currentPage.value = 2;
      setTimeout(() => step1.value = true, 1000);
      setTimeout(() => {
        (async() => {
          let remoteTxnStatus = await verifyTransaction();
          if(!remoteTxnStatus){
            isInvalidRemoteTxnHash.value = true;
          }else{
            setTimeout( () => {
              step3.value = true;
              setTimeout( async() => {
                await checkSwapTxn();
                setTimeout(() => step4.value = true, 1000);
              }, 3000);
            }, 1000);
          }
          step2.value = true;
        })();
      }, 2000);
    };

    const remoteTxnLink = computed( () => bscScanUrl + remoteTxnHash.value);
    const isDisplayFeeLowRemark = ref(false);
    const numConfirmation = ref(0);

    const verifyTransaction = async () => {
      try{
        let transactionReceipt = await provider.getTransactionReceipt(remoteTxnHash.value);
        let tokenContractAddress = "";

        if(transactionReceipt){

          let bscCoin = bscTokensInfo.value.find(x => x.contractAddress.toLowerCase() == transactionReceipt.to.toLowerCase()); 

          if(bscCoin){
            fromTokenName.value = bscCoin.name;
            tokenContractAddress = bscCoin.contractAddress;

            // comment out if wanted to support other token beside XPX and METX
            if(!siriusTokens.includes(fromTokenName.value)){
              return false;
            }

          }
          else{
            return false;
          }
        }
        else{
          return false;
        }

        let transactionStatus = await provider.getTransaction(remoteTxnHash.value);
        
        if(transactionReceipt && transactionReceipt.status === 1){ // when transaciton is confirmed but status is 1

            if(transactionStatus.to.toLowerCase() !== tokenContractAddress.toLowerCase() 
              || transactionReceipt.logs.length !== 1 || 
              transactionReceipt.logs[0].topics[0] !== "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"
              || transactionReceipt.logs[0].topics[2] !== "0x" + "0".repeat(66 - sinkAddress.value.length) + sinkAddress.value.substring(2).toLowerCase()){
                return false;
            }
          
            if(transactionStatus.confirmations < 12){
            return new Promise(function (resolve) {
              verifyingTxn = setInterval(async () => {
                let transactionStatusLoop = await provider.getTransaction(remoteTxnHash.value);
                if(transactionStatusLoop.confirmations < 12){
                  transactionPending.value = true;
                  numConfirmation.value = transactionStatusLoop.confirmations;
                }else {
                  transactionPending.value = false;
                  clearInterval(verifyingTxn);
                  resolve(true);
                }
              }, 3000);
            });
          }else{
            return true;
          }
        }else if(transactionReceipt && transactionReceipt.status === 0){ // transaction is confirmed but status is 0 - fee too low
          transactionFailed.value = true;
          isDisplayFeeLowRemark.value = true;
          return false;
        }else if(!transactionReceipt && !transactionStatus){ // transaction hash is not found
          transactionNotFound.value = true;
          return false;
        }else{
          if(transactionStatus && transactionStatus.to.toLowerCase() == sinkAddress.value.toLowerCase()){ // when transaction is not confirmed
            // perform confirmation loop here
            return new Promise(function (resolve) {
              verifyingTxn = setInterval(async()=>{
                let transactionStatusLoop = await provider.getTransaction(remoteTxnHash.value);
                if(transactionStatusLoop.confirmations < 12){
                  transactionPending.value = true;
                  numConfirmation.value = transactionStatusLoop.confirmations;
                }else {
                  transactionPending.value = false;
                  clearInterval(verifyingTxn);
                  resolve(true);
                }
              }, 3000);
            });
          }else{
            // invalid transaction
            transactionFailed.value = true;
            return false;
          }
        }
      }catch(err){
        console.log(err);
        transactionNotFound.value = true;
        return false;
      }
    };

    const currentNativeTokenName = computed(()=> AppState.nativeToken.label);

    const txtRemoteTransactionErrorMsg = computed(() => {
      if(isDisplayFeeLowRemark.value){
        return t('swap.feeTooLow');
      }else{
        if(transactionNotFound.value){
          return t('swap.hashNotFound',[t('swap.bsc'),t('swap.sirius')])
        }else{
          return t('swap.hashInvalid',[t('swap.bsc'),t('swap.sirius')])
        }
      }
    });

    const siriusTxnHash = ref('');
    let xpxExplorerUrl = networkState.currentNetworkProfile.chainExplorer.url + '/' + networkState.currentNetworkProfile.chainExplorer.hashRoute + '/';
    const siriusTxnLink = computed(() => xpxExplorerUrl + siriusTxnHash.value);

    const checkSwapTxn = async () => {
      try {
        const response = await fetch(checkSwapStatusUrl.value, {
          method: 'GET'
        });

        if(response.status == 200){
          const data = await response.json();
          siriusTxnHash.value = data.siriusTxnHash ? data.siriusTxnHash : "";
          siriusAddress.value = data.siriusAddress;
          transactionHash.value = data.remoteTxnHash;
          fromTokenName.value = data.fromToken;
          toTokenName.value = data.toToken;
          swapTimestamp.value = Helper.IsoTimeRemoveFormat(new Date(data.timeStamp).toISOString());
          swapToken.value = Helper.toUppercase(fromTokenName.value);
          swapQr.value = SwapUtils.generateQRCode(remoteTxnLink.value);
          isInvalidSwapCheck.value = false;
          setTimeout( ()=> isDisabledValidate.value = false, 1000);
        }else if(response.status == 404){
          isInvalidSwapCheck.value = true;
          isCheckSwapStatusNotFound.value = true;
        }else{
          isInvalidSwapCheck.value = true;
        }
      } catch (error) {
        isInvalidSwapCheck.value = true;
      }
    }

    // section - to do swap
    const step5 = ref(false);
    const step6 = ref(false);
    const step7 = ref(false);
    const step8 = ref(false);
    const isInitiateSwap = ref(false);
    const disableSiriusAddress = ref(false);
    const disableConfirmAddressSelection = ref(true);
    const siriusAddressSelected = ref('');

    const siriusAddressSelectedName = ref(walletState.currentLoggedInWallet.selectDefaultAccount().name);

    watch(siriusAddressSelected, (newAddress) => {
      let accountSelected = walletState.currentLoggedInWallet.accounts.find(account => account.address == newAddress) || walletState.currentLoggedInWallet.others.find(account => account.address == newAddress)
      if(accountSelected){
        siriusAddressSelectedName.value = accountSelected.name;
      }else{
        siriusAddressSelectedName.value = 'ACCOUNT-' + siriusAddressSelected.value.substring(siriusAddressSelected.value.length-4,siriusAddressSelected.value.length)
      }
    });

    const showAddressError = shallowRef(true);
    const toggleContact = shallowRef(false)
    watch(siriusAddressSelected,n=>{
      if(n.length==40 || n.length==46){
        checkRecipient()
      }else{
        showAddressError.value = true
      }
    })
    const checkRecipient = () =>{
    if(!walletState.currentLoggedInWallet){
        return;
    }
    try {
      let recipientAddress = Helper.createAddress(siriusAddressSelected.value);
      let networkOk = Helper.checkAddressNetwork(recipientAddress, AppState.networkType);
      if(!networkOk){
        showAddressError.value = true;
      }
      else{
        showAddressError.value = false;
      }
    } catch (error) {
      try{
        let namespaceId = Helper.createNamespaceId(siriusAddressSelected.value);
        checkNamespace(namespaceId).then((address)=>{
          siriusAddressSelected.value = address.plain();
          showAddressError.value = false;
        }).catch((error)=>{
          showAddressError.value = true;
        });
      }
      catch(error){
        showAddressError.value = true;
      }
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

    const displayInitiateSwapPanel = () => {
      isInitiateSwap.value = true;
    }

    const siriusAddressOption = computed(() => {
      let siriusAddress = [];
      if(walletState.currentLoggedInWallet){
        walletState.currentLoggedInWallet.accounts.forEach((account) => {
          siriusAddress.push({
            label: account.name + ' - ' + account.address,
            value: account.address,
          })
        });
      }
      return siriusAddress;
    });

    const clearSiriusAddress = () => {
      siriusAddressSelected.value= '';
    };

    const signatureMessage = computed(() => {
      if(isInvalidSignedMeta.value){ // when user rejects signature on MetaMask
        return t('swap.rejectMetamask');
      }else{
        return t('swap.signTx');
      }
    });

    const confirmAddress = () => {
      disableConfirmAddressSelection.value = true;
      disableSiriusAddress.value = true;
      setTimeout( ()=> step5.value = true, 1000);
      setTimeout( ()=> {
        step6.value = true;
        (async() => {
          await getSigned();
        })();
      }, 2000);
    };

    const amount = ref(0);
    const amountReceived = ref(0);

    const swapServiceParam = ref('');

    const getSigned = async () => {
      try{
        isInvalidSignedMeta.value = false;
        provider = new ethers.providers.Web3Provider(window.ethereum, 'any');
        signer = provider.getSigner();
        let addressPretty = Helper.createAddress(siriusAddressSelected.value).pretty();
        const messageSignature = await signer.signMessage(addressPretty);
        messageHash.value = messageSignature;
        const data = {
          recipient: addressPretty,
          signature: messageSignature,
          txnInfo: {
            network: "BSC",
            txnHash: remoteTxnHash.value
          }
        };
        swapServiceParam.value = data;
        await afterSigned();
      }catch(err){
        isInvalidSignedMeta.value = true;
      }
    };

    const swapServerErrIndex = ref(0);
    const swapStatus208 = ref(false);

    const afterSigned = async () => {
      step7.value = true;
      step8.value = true;
      retrySwapButtonText.value = t('swap.initiatingSwap');
      disableRetrySwap.value = true;
      let stringifyData = JSON.stringify(swapServiceParam.value);
      try {
        const response = await fetch(swapUrl.value, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: stringifyData, // body data type must match "Content-Type" header
        });

        if(response.status == 200 || response.status == 201){
          const data = await response.json();
          isInvalidSwapService.value = false;
          siriusTxnHash.value = typeof data.siriusSwapInfo.status !== "string" ? data.siriusSwapInfo.status.hash: "";
          // swapStatus.value = typeof data.siriusSwapInfo.status === "string" ? data.siriusSwapInfo.status: data.siriusSwapInfo.status.status;
          amount.value = Helper.convertToCurrency(data.siriusSwapInfo.amount, AppState.nativeToken.divisibility);
          amountReceived.value = Helper.amountFormatterSimple(data.siriusSwapInfo.receiveAmount, AppState.nativeToken.divisibility);
          siriusAddress.value = data.siriusSwapInfo.recipient;
          transactionHash.value = data.transactionId;
          swapTimestamp.value = data.timestamp;
          swapToken.value = fromTokenName.value.toUpperCase();
          swapQr.value = SwapUtils.generateQRCode(remoteTxnLink.value);
          setTimeout( ()=> isDisabledValidate.value = false, 1000);
          swapServerErrIndex.value = 0;
        }
        else if(response.status == 202){
          const data = await response.json();
          isInvalidSwapService.value = false;
          siriusTxnHash.value = typeof data.siriusSwapInfo.status !== "string" ? data.siriusSwapInfo.status.hash: "";
          // swapStatus.value = typeof data.siriusSwapInfo.status === "string" ? data.siriusSwapInfo.status: data.siriusSwapInfo.status.status;
          amount.value = Helper.convertToCurrency(data.siriusSwapInfo.amount, AppState.nativeToken.divisibility);
          amountReceived.value = Helper.amountFormatterSimple(data.siriusSwapInfo.receiveAmount, AppState.nativeToken.divisibility);
          siriusAddress.value = data.siriusSwapInfo.recipient;
          transactionHash.value = data.transactionId;
          swapTimestamp.value = data.timestamp;
          swapToken.value = fromTokenName.value.toUpperCase();
          swapQr.value = SwapUtils.generateQRCode(remoteTxnLink.value);
          setTimeout( ()=> isDisabledValidate.value = false, 1000);
          swapServerErrIndex.value = 0;
        }
        else if(response.status == 208){
          // console.log('208');
          swapStatus208.value = true;
          setTimeout( ()=> isDisabledValidate.value = false, 1000);
        }else{
          isInvalidSwapService.value = true;
          ++swapServerErrIndex.value;
          retrySwapButtonText.value = t('swap.retry');
          disableRetrySwap.value = false;
        }
      } catch (error) {
        console.log(error);
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
      err,
      isInstallMetamask,
      connectMetamask,
      isMetamaskConnected,
      currentAccount,
      copy,
      currentPage,
      isDisabledValidate,
      siriusAddress,
      checkStatus,
      validated,
      isDisabledCheck,
      step1,
      step2,
      step3,
      step4,
      remoteTxnLink,
      messageHash,
      transactionHash,
      swapTimestamp,
      swapId,
      swapQr,
      saveCertificate,
      isInvalidRemoteTxnHash,
      isPendingRemoteTxnHash,
      serviceErr,
      verifyMetaMaskPlugin,
      showTxnHashError,
      remoteTxnHash,
      isInvalidSwapCheck,
      siriusTxnHash,
      siriusTxnLink,
      displayInitiateSwapPanel,
      isInitiateSwap,
      siriusAddressOption,
      disableSiriusAddress,
      disableConfirmAddressSelection,
      siriusAddressSelected,
      siriusAddressSelectedName,
      clearSiriusAddress,
      step5,
      step6,
      step7,
      step8,
      isInvalidSignedMeta,
      isInvalidSwapService,
      disableRetrySwap,
      retrySwapButtonText,
      getSigned,
      signatureMessage,
      afterSigned,
      swapServerErrIndex,
      confirmAddress,
      swapStatus208,
      savedCheck,
      numConfirmation,
      transactionPending,
      transactionNotFound,
      txtRemoteTransactionErrorMsg,
      isCheckSwapStatusNotFound,
      walletState,
      currentNativeTokenName,
      Helper,
      amount,
      amountReceived,
      swapToken,
      contacts,
      showAddressError,
      checkRecipient,
      toggleContact,
    };
  },
}
</script>