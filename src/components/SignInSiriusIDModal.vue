<template>
  <div>
    <a
      @click="toggleModal = !toggleModal"
      class="block big-default-btn my-3 self-center"
      >Sign In With SiriusID</a
    >
    <transition
      enter-active-class="animate__animated animate__fadeInDown"
      leave-active-class="animate__animated animate__fadeOutUp"
    >
      <div v-if="toggleModal" class="popup-outer absolute flex z-50">
        <div class="modal-popup-box">
          <div class="delete-position">
            <font-awesome-icon
              icon="times"
              class="delete-icon-style"
              @click="toggleModal = !toggleModal"
            ></font-awesome-icon>
          </div>
          <h1 class="default-title">
            Sign in your wallet by scanning this QR Code using your SiriusID
            app.
          </h1>
          <p class="text-sm mt-5">
            This popup will close automatically when your sign in from the
            SiriusID app.
          </p>
          <!-- <img
            src="../assets/img/download.gif"
            class="inline-block w-40 mb-10 mt-6"
          /> -->
          <img v-bind:src="qrInvitation" class="inline-block w-40 mb-10 mt-6" />
          <p>Don't have app? Download it from your store</p>
          <div class="flex justify-center my-3">
            <a
              href="https://apps.apple.com/us/app/proximax-siriusid/id1496615202"
              target="_new"
              class="inline-block mr-2"
              ><img src="../assets/img/app-store.png" class="w-32"
            /></a>
            <a
              href="https://play.google.com/store/apps/details?id=io.proximax.siriusID"
              target="_new"
              class="inline-block ml-2"
              ><img src="../assets/img/google-play.png" class="w-32"
            /></a>
          </div>
        </div>
      </div>
    </transition>
    <div
      @click="toggleModal = !toggleModal"
      v-if="toggleModal"
      class="fixed inset-0 bg-opacity-90 bg-blue-primary"
    ></div>
  </div>
</template>

<script>
import { Account } from "tsjs-xpx-chain-sdk";
import {
  InvitationRequestMessage,
  InvitationResponseMessage,
} from "siriusid-sdk";
import { environment } from "../environment/environment.js";
import Peer from "peerjs";

export default {
  name: "SignInSiriusIDModal",
  data() {
    return {
      toggleModal: false,
    };
  },
  setup() {
    const networkType = environment.typeNetwork.value;
    const nodeUrl =
      environment.blockchainConnection.protocol +
      "://" +
      environment.blockchainConnection.host;
    const account = Account.generateNewAccount(networkType);
    const mess = InvitationRequestMessage.create(
      "Login request from Proximax Sirius Wallet",
      account.publicKey,
      nodeUrl
    );
    const qrInvitation = mess.generateQR();

    const createInvitationRequestMessage = () => {
      let peerHosting = {
        host: "siriusid-peerjs.xpxsirius.io",
        port: 443,
        path: "/",
        secure: true,
        debug: 3,
      };

      let peer = new Peer(mess.getSessionId(), peerHosting);

      // const peer = () => {
      //   environment.peerHosting;
      // };
      peer.on("connection", (conn) => {
        conn.on("data", async (data) => {
          const resMess = InvitationResponseMessage.createFromPayload(
            data,
            account.privateKey
          );

          console.log(resMess);
          // await this.importWalletAndLogin(
          //   resMess.getWltBase64(),
          //   resMess.getSecretKey()
          // );
        });
        conn.on("open", () => {
          // const interval = setInterval(() => {
          //   if (this.withSiriusID) {
          //     conn.send("Received");
          //     this.withSiriusID = false;
          //     clearInterval(interval);
          //   }
          // }, 100);
        });
        conn.on("close", () => {});
      });

      peer.on("error", (error) => {
        console.error("connection has an error", error.message);
      });

      peer.on("close", () => {});
    };
    createInvitationRequestMessage();
    return {
      qrInvitation,
      //createInvitationRequestMessage,
    };
  },
};
</script>
