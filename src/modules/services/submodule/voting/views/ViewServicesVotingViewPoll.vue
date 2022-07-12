<template>
  <div class="flex justify-between text-xs sm:text-sm">
    <div><span class="text-gray-400">{{$t('vote.vote')}} ></span> <span class="text-blue-primary font-bold">{{$t('vote.voteresults')}}</span></div>
    <div>
      <router-link :to="{ name: 'ViewServicesVotingPoll'}" class="font-bold">{{$t('accounts.viewall2')}}</router-link> |
      <router-link :to="{ name: 'ViewServices'}" class="font-bold">{{$t('services.allservices')}}</router-link>
    </div>
  </div>
  <div class='mt-2 py-3 gray-line'>
    <div class='mt-2 py-3 text-center px-0 lg:px-10 xl:px-80'>
      <div class="text-xl font-bold">[[ Vote title ]]</div>
      <div class="text-sm my-2">[[ Vote description ]]</div>
      <div class=" border-t-4 border-b-4 border-solid border-gray-300 mt-5 py-2">
        <div><b>[Status]</b> <div class="inline-block mx-2">></div> {{$t('vote.finish')}} <div class="inline-block mx-2">></div> [date] </div>
      </div>
      <div class="border-8 border-solid border-gray-300 mt-10 grid grid-cols-3 h-40 cursor-pointer" v-if="voted" @click="showCertificateModel = true">
        <div class="col-span-2">
          <div class="grid grid-cols-4 h-full">
            <div class="col-span-1">
              <div class="inline-block h-full">
                <div class="h-full flex">
                  <img src="@/modules/services/submodule/voting/img/download.gif" class="self-center h-28 w-28">
                </div>
              </div>
            </div>
            <div class="col-span-3 text-left pl-2 flex">
              <div class="self-center">
                <b class="text-sm">{{$t('dashboard.hash')}}:</b>
                <div class="break-all text-sm mt-2">AD7B610271C4F830BC9EB840029D03CF1C80E0F3A9A68F72A6AC01EEDFDA8ED2</div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-span-1 text-center w-full" style="background: -webkit-linear-gradient(bottom,#7cbd74,#1f9062)">
          <div class="inline-block h-full">
          <div class="h-full flex">
            <img src="@/modules/services/submodule/voting/img/badge-silver-proximax-sirius-wallet.svg" class="w-24 h-24 self-center">
          </div>
          </div>
        </div>
      </div>
      <div v-else-if="!voted && voteEnded" class="mt-10 p-4 rounded-xl bg-yellow-100">
        {{$t('vote.votemessage')}}
      </div>
      <div v-else-if="!voted && !voteEnded" class="mt-10">
        <div><input id="o1" type="radio" value="opt1" name="pollOption" v-model="pollOption" /><label for="o1" class="cursor-pointer font-bold ml-4 mr-5 text-tsm">{{$t('vote.option1')}}</label></div>
        <div><input id="o2" type="radio" value="opt2" name="pollOption" v-model="pollOption" /><label for="o2"  class="cursor-pointer font-bold ml-4 mr-5 text-tsm">{{$t('vote.option2')}}</label></div>
        <div><input id="o3" type="radio" value="opt3" name="pollOption" v-model="pollOption" /><label for="o3"  class="cursor-pointer font-bold ml-4 mr-5 text-tsm">{{$t('vote.option3')}}</label></div>
      </div>
      <PasswordInput class="mt-10" placeholder="Insert wallet password" errorMessage="Wallet password required" :showError="showPasswdError" icon="lock" v-model="walletPasswd" />
      <div class="mt-20">
        <button type="button" class="default-btn mr-5 focus:outline-none disabled:opacity-50" :disabled="voted || voteEnded">{{$t('vote.vote')}}</button>
        <button type="button" class="default-btn mr-5 focus:outline-none disabled:opacity-50" @click="showCertificateModel=true" :disabled="!voted">{{$t('swap.certificate')}}</button>
        <button type="submit" class="default-btn py-1 focus:outline-none disabled:opacity-50" @click="showResultModel=true" :disabled="!(voteEnded || (!voteEnded && voted))">{{$t('vote.result')}}</button>
      </div>
    </div>
    <CertificateModal :showModal="showCertificateModel" />
    <ResultModal :showModal="showResultModel" />
  </div>
</template>
<script>
import { getCurrentInstance, ref } from "vue";
import PasswordInput from '@/components/PasswordInput.vue';
import CertificateModal from '@/modules/services/submodule/voting/components/CertificateModal.vue';
import ResultModal from '@/modules/services/submodule/voting/components/ResultModal.vue';
import { useToast } from "primevue/usetoast";
export default {
  name: 'ViewServicesVotingViewPoll',
  components: {
    PasswordInput,
    CertificateModal,
    ResultModal,
  },

  props: {
    pollid: String,
  },

  setup(p) {
    const toast = useToast();
    const internalInstance = getCurrentInstance();
    const emitter = internalInstance.appContext.config.globalProperties.emitter;
    const walletPasswd = ref('');
    const showPasswdError = ref(false);
    const showCertificateModel = ref(false);
    const showResultModel = ref(false);
    const voted = ref(false);
    const voteEnded = ref(false);

    if(p.pollid == '23543543535435'){
      voted.value = true;
      toast.add({severity:'info', summary: 'Voted', detail: 'You have already voted in this poll', group: 'br-custom', life: 5000});  
    }
    if(p.pollid == '945675463458'){
      voteEnded.value = true;
      toast.add({severity:'info', summary: 'Voting ended', detail: 'This poll has ended', group: 'br-custom', life: 5000});  
    }

    emitter.on("CLOSE_MODAL", payload => {
      showCertificateModel.value = payload;
      showResultModel.value = payload;
    });

    return {
      walletPasswd,
      showCertificateModel,
      showResultModel,
      showPasswdError,
      voted,
      voteEnded,
    };
  },
}
</script>
