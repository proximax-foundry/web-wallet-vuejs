<template>
      <DisplaySelectedAccount>
        <template #selectedAcc>
          <div v-if="!isMultiSig(selectedAccAdd)">{{ $t("general.signerAcc") }}</div>
          <div v-else>{{ $t("general.multisigAcc") }}</div>
        </template>
        <template #accBalance>
          <div v-html="splitCurrency(balance)"></div>
        </template>
      </DisplaySelectedAccount>
       
      <div v-if="fundStatus || onPartial || isMultisigAlready || (isMultisig && !isCosigner)">
          <WarningMessageLayout>
            <template #warning>
              <div v-if="fundStatus">
                <div class="flex-cols">
                  <div class="text-txs">{{ $t('general.insufficientBalanceWarning', { tokenName: currentNativeTokenName }) }}</div>
                  <a v-if="networkType == 168" class="text-xs text-blue-primary font-semibold underline " :href="topUpUrl"
                    target="_blank">{{ $t('general.topUp', { tokenName: currentNativeTokenName }) }}<img
                      src="@/modules/dashboard/img/icon-new-page-link.svg" class="w-3 h-3 ml-2 inline-block"></a>
                </div>
              </div>
              <div v-else-if="isMultisig && !isCosigner">
                <div class="text-txs">{{ $t('general.noCosigner') }}</div>
              </div>
              <div v-else-if="onPartial">
                <div class="text-txs">{{ $t('general.hasPartial') }}</div>
              </div>
              <div v-else-if="isMultisigAlready">
                <div class="text-txs">{{ $t('multisig.alreadyMultisig') }}</div>
              </div>
            </template>
          </WarningMessageLayout>
          <label class="text-txs text-gray-100" v-if="onPartial"><input type="checkbox" class="my-2 mr-1 align-top" @change="onTick"/>Tick to proceed modifying multisig</label>
      </div>

      <div class='border-b-2 border-gray-600 mt-2'/>

      <div v-if="sendXPX || namespaceRentalFeeCurrency || assetRentalFeeCurrency">
        <TransactionFeeLayout>
            <template #transactionType>
              <div v-if="sendXPX">
                {{ $t("transfer.transferAmount") }}
              </div>
              <div v-else-if="namespaceRentalFeeCurrency">
                {{ $t("general.namespacerentalFee") }}
              </div>
              <div v-else-if="assetRentalFeeCurrency">
                {{ $t("general.assetRentalFee") }}
              </div>
            </template>
            <template #transactionTypeFee>
              <div v-if="sendXPX">
                <div v-html="splitCurrency(sendXPX)"></div>
              </div>
              <div v-else-if="namespaceRentalFeeCurrency">
                <div v-html="splitCurrency(namespaceRentalFeeCurrency)"></div>
              </div>
              <div v-else-if="assetRentalFeeCurrency">
                <div v-html="splitCurrency(assetRentalFeeCurrency)"></div>
              </div>
            </template>
          </TransactionFeeLayout>
      </div>
      <div v-if="isMultiSig(selectedAccAdd)">
        <div class="lg:grid lg:grid-cols-5 grid grid-cols-7 justify-between items-center text-gray-200 text-xs"  v-for="(mosaic, index) in mosaicsCreated" :key="index">
            <div v-if="isNaN(parseFloat(selectedMosaic[index].amount))" class="lg:col-span-4 col-span-6 ml-auto">0</div>
            <div v-else class="lg:col-span-4 col-span-6 ml-auto">{{selectedMosaic[index].amount}}</div>
            <div class="ml-1 text-blue-400" :index="index"> {{displayAssetName(selectedMosaic[index].namespace)}} </div>
        </div>
      </div>

        <div v-if="!isMultiSig(selectedAccAdd)">
          <div v-if="lockFundCurrencyConvert">
            <TransactionFeeLayout>
              <template #transactionType>
                <div>
                  {{ $t("general.lockFund") }}
                </div>
              </template>
              <template #transactionTypeFee>
                <div>
                  <div v-html="splitCurrency(lockFundCurrencyConvert)"></div>
                </div>
              </template>
            </TransactionFeeLayout>
          </div>

          <div v-if="lockFundTxFeeConvert">
            <TransactionFeeLayout>
              <template #transactionType>
                <div>
                  {{ $t("general.lockFundTxFee") }}
                </div>
              </template>
              <template #transactionTypeFee>
                <div>
                  <div v-html="splitCurrency(lockFundTxFeeConvert)"></div>
                </div>
              </template>
            </TransactionFeeLayout>
          </div>

          <TransactionFeeLayout>
            <template #transactionType>
              <div>
                {{ $t("general.transactionFee") }}
              </div>
            </template>
            <template #transactionTypeFee>
              <div>
                <div v-html="splitCurrency(transactionFee)"></div>
              </div>
            </template>
          </TransactionFeeLayout>

          <div class='border-b-2 border-gray-600 mt-2'/>

          <TransactionFeeLayout>
            <template #transactionType>
              <div>
                {{ $t("general.total") }}
              </div>
            </template>
            <template #transactionTypeFee>
              <div>
                <div v-html="splitCurrency(totalFeeFormatted)"></div>
              </div>
            </template>
          </TransactionFeeLayout>

          <div class="lg:grid lg:grid-cols-5 grid grid-cols-7 text-white text-xs"  v-for="(mosaic, index) in mosaicsCreated" :key="index">
            <div v-if="isNaN(parseFloat(selectedMosaic[index].amount))" class="lg:col-span-4 col-span-6 ml-auto">0</div>
            <div v-else class="lg:col-span-4 col-span-6 ml-auto">{{selectedMosaic[index].amount}}</div>
            <div class="ml-1 text-blue-400" :index="index "> {{displayAssetName(selectedMosaic[index].namespace)}} </div>
          </div>
        </div>
        <div v-else>
          <div v-if="getMultiSigCosigner.cosignerList.length > 0">
              <DisplaySelectedAccount>
              <template #selectedAcc>
                <div class="pt-3">{{ $t("general.signerAcc") }}</div>
              </template>
              <template #accBalance>
                <span class='font-bold' v-if="getMultiSigCosigner.cosignerList.length == 1">{{ Helper.amountFormatterSimple(getMultiSigCosigner.cosignerList[0].balance, 0) }}</span>
                <span class='font-bold' v-else>{{ checkCosignBalance }}</span>
              </template>
            </DisplaySelectedAccount>

            <div class='border-b-2 border-gray-600 mt-2'/>

            <TransactionFeeLayout>
              <template #transactionType>
                <div>
                  {{ $t("general.aggregateFee") }}
                </div>
              </template>
              <template #transactionTypeFee>
                <div>
                  <div v-html="splitCurrency(transactionFee)"></div>
                </div>
              </template>
            </TransactionFeeLayout>

            <TransactionFeeLayout>
              <template #transactionType>
                <div>
                  {{ $t("general.lockFund") }}
                </div>
              </template>
              <template #transactionTypeFee>
                <div>
                  <div v-html="splitCurrency(lockFundCurrency)"></div>
                </div>
              </template>
            </TransactionFeeLayout>

            <TransactionFeeLayout>
              <template #transactionType>
                <div>
                  {{ $t("general.lockFundTxFee") }}
                </div>
              </template>
              <template #transactionTypeFee>
                <div>
                  <div v-html="splitCurrency(lockFundTxFee)"></div>
                </div>
              </template>
            </TransactionFeeLayout>

            <div class='border-b-2 border-gray-600 mt-2'/>

            <TransactionFeeLayout>
              <template #transactionType>
                <div>
                  {{ $t("general.total") }}
                </div>
              </template>
              <template #transactionTypeFee>
                <div>
                  <div v-html="splitCurrency(totalFeeFormatted)"></div>
                </div>
              </template>
            </TransactionFeeLayout>
          </div>
        </div>
</template>

<script setup lang='ts'>
import { computed } from 'vue';
import { AppState } from '@/state/appState';
import { walletState } from '@/state/walletState';
import { Helper } from "@/util/typeHelper";
import { networkState } from "@/state/networkState";
import DisplaySelectedAccount from '@/components/DisplaySelectedAccount.vue';
import TransactionFeeLayout from "@/components/TransactionFeeLayout.vue";
import WarningMessageLayout from "@/components/WarningMessageLayout.vue";

const props = defineProps({
    transactionFee: String,
    lockFundCurrency: String,
    lockFundTxFee: String,
    totalFeeFormatted: String,
    selectedAccAdd: String,
    balance: String,
    sendXPX: String,
    getMultiSigCosigner: Object,
    checkCosignBalance: String,
    selectedMosaic: Object,
    mosaicsCreated: Object,
    assetRentalFeeCurrency: String,
    namespaceRentalFeeCurrency: String,
    fundStatus: Boolean,
    isMultisig: Boolean,
    isCosigner: Boolean,
    onPartial: Boolean,
    isMultisigAlready: Boolean,
    lockFundCurrencyConvert: String,
    lockFundTxFeeConvert: String,
})
const emit = defineEmits(['ticked'])

const currentNativeTokenName = computed(()=> AppState.nativeToken.label);
const isMultiSig = (address) => {
      if(walletState.currentLoggedInWallet){
        const account = walletState.currentLoggedInWallet.accounts.find((account) => account.address == address) || walletState.currentLoggedInWallet.others.find((account) => account.address == address);
        const isMulti = account.getDirectParentMultisig().length>0?true:false
        return isMulti
      }else{
        return false
      }
    };
const splitCurrency = (amount) => {
      let split = amount.toString().split(".")
      if (split[1]!=undefined){
        return '<span class="font-semibold text-sm">' + split[0] + '</span>.<span class="font-semibold text-xs">' + split[1] + '</span>';
      }else{
        return '<span class="font-semibold text-sm">' + split[0] + '</span>';
      }
    };
  const displayAssetName = asset =>{
      let assetName = asset.toString()
      // if there name less than 7 word, does not need to truncate
      if (assetName.length <= 7){
        return assetName
      }
      else{
        let part1 = assetName.slice(0,3)
        let part2 = assetName.slice(-4)
        return part1 + "..." + part2
      }
    }
const topUpUrl = computed(()=>{
  if (networkType.value == 168 && networkState.chainNetworkName=='Sirius Testnet 1'){
    return 'https://bctestnetfaucet.xpxsirius.io/#/'
  }else if (networkType.value == 168 && networkState.chainNetworkName=='Sirius Testnet 2'){
    return 'https://bctestnet2faucet.xpxsirius.io/#/'
  }else{
    return ''
  }
}) 

const networkType = computed(()=>AppState.networkType)

const onTick = (e: any) => {
  emit('ticked', e.target.checked)
}
</script>