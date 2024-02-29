<template>
  <div>
    <form>
      <fieldset>
        <div class="w-8/12 text-center mr-auto ml-auto error error_box" v-if="err!=''">{{ err }}</div>
        <SelectNetworkInput/>
        <div class='mt-3'></div>
        <div class="flex justify-center"><img :src="challengeQR" class="inline-block"></div>  
        <div class="mt-1" v-if="showInvalidConnection">
          <div class="text-red-primary" v-if="!verificationPass">
            Verification failed
          </div>
          <div class="text-red-primary" v-else>
            Connection failed, please try again
          </div>
        </div>
      </fieldset>
    </form>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, getCurrentInstance, ref, watch, onUpdated, onBeforeMount } from 'vue';
import { useRouter } from "vue-router";
import SelectNetworkInput from '@/components/SelectNetworkInput.vue';
import SelectWalletInput from '@/components/SelectWalletInput.vue';
import PasswordInput from '@/components/PasswordInput.vue';
import HiddenInput from '@/components/HiddenInput.vue';
import { networkState } from "@/state/networkState";
import { walletState } from '@/state/walletState';
import { Wallet } from '@/models/wallet';
import { WalletUtils } from '@/util/walletUtils';
import { NetworkStateUtils } from '@/state/utils/networkStateUtils';
import { WalletStateUtils } from '@/state/utils/walletStateUtils';
import {useI18n} from 'vue-i18n'
import qrcode from 'qrcode-generator';
import { Peer } from "peerjs";
import { PublicAccount } from "tsjs-xpx-chain-sdk";
import { AppRequestType, ConnType } from "../../../models/qrConnData";
import type { ILoginResponse, IConnQrData } from "../../../models/qrConnData";
import { WalletAccount } from '@/models/walletAccount';
export default defineComponent({
  name: 'QrSignInComponent',
  data() {
    return {
      toggleModal: false,
    };
  },

  setup(){
    const {t} = useI18n();
    const internalInstance = getCurrentInstance();
    const emitter = internalInstance.appContext.config.globalProperties.emitter;
    const router = useRouter();
    const err = ref("");
    const showAPIKeyError = ref(false);
    const challengeQR = ref("");
    const showInvalidConnection = ref(false);
    const verificationPass = ref(false);
    let currentChallenge = "";

    const selectedNetwork = computed(()=>{ return {label: networkState.chainNetworkName, value: networkState.chainNetwork }});

    const initLoginQR = async () => {

      let awaitingExpectedResponse = false;
      showInvalidConnection.value = false;
      currentChallenge = new Date().toISOString();
      const peer = new Peer();
      let qrData: IConnQrData = {
          connId: "",
          type: ConnType.Login,
          generationHash: networkState.currentNetworkProfile.generationHash,
          origin: window.location.origin
      };

      peer.on("open", (id)=>{
        // console.log("My peer Id is :" + id);
        qrData.connId = id;

        let qr = qrcode(0, 'H');
        qr.addData(JSON.stringify(qrData));
        qr.make();
        challengeQR.value = qr.createDataURL();
      })

      // peerjs connection
      peer.on("connection", (conn) => {
        conn.on("data", (data: any) => {

          if(data === AppRequestType.Challenge){
            conn.send({ challenge: currentChallenge });
            awaitingExpectedResponse = true;
          }
          else if(awaitingExpectedResponse){
            try {
              let loginRes: ILoginResponse = JSON.parse(data);

              let userPA = PublicAccount.createFromPublicKey(loginRes.publicKey, networkState.currentNetworkProfile.network.type, 1);

              let verified = userPA.verifySignature(currentChallenge, loginRes.signature);

              if(verified){

                conn.send("success");

                setTimeout(()=>{
                  conn.close();
                  peer.destroy();
                }, 500)
                verificationPass.value = true;

                proceedLogin(loginRes);
              }
              else{
                verificationPass.value = false;
                throw new Error("Verification failed");
              }
            } catch (error) {
              showInvalidConnection.value = true;
              conn.close();
            }
          } 
        });
        conn.on("open", () => {
          conn.send("hello! Web-wallet QR login");
        });
      });
    }

    const proceedLogin = (resData: ILoginResponse)=>{
      const userPubAcc = PublicAccount.createFromPublicKey(
        resData.publicKey, 
        networkState.currentNetworkProfile.network.type,
        1
      );
      sessionStorage.setItem("nodeUrl", resData.apiUrl);
      sessionStorage.setItem("soundSetting", "true");
      WalletUtils.resetNetworkData();
      const walletAcc = new WalletAccount(
        "Sirius Account", 
        userPubAcc.publicKey, 
        userPubAcc.address.plain(),
        "",
        "",
        ""
      );
      let wallet = new Wallet("Sirius", networkState.chainNetworkName, [walletAcc]);
      WalletStateUtils.updateLoggedIn(wallet);
      router.push({ name: "ViewDashboard"});
    }

    onBeforeMount(()=>{
      initLoginQR();
      setTimeout(()=>{
        proceedLogin({
          apiUrl: "http://api-2.testnet2.xpxsirius.io:3000",
          publicKey: "DBAE924D72EBCC42A0F1017590A706EB43631970CE626519BF626DCB803E5B63",
          signature: ""
        })
      }, 5000)
    })

    // proceedLogin({
    //   apiUrl: "http://api-2.testnet2.xpxsirius.io:3000",
    //   publicKey: "DBAE924D72EBCC42A0F1017590A706EB43631970CE626519BF626DCB803E5B63",
    //   signature: ""
    // })

    return{
      networkState,
      err,
      selectedNetwork,
      showAPIKeyError,
      challengeQR,
      showInvalidConnection,
      verificationPass
    };
  },

  components: {
    SelectNetworkInput
  }
});
</script>