import { reactive } from "vue";
import { Wallets } from "../models/wallets"

export const walletState = reactive({
    wallets: new Wallets(),
    currentLoggedInWallet: null,
    isLogin: false,
  });