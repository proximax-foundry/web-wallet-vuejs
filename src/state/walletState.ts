import { reactive } from "vue";
import { Wallets } from "../models/wallets"
import { Wallet } from "../models/wallet"

interface walletStateInterface {
    wallets: Wallets
    currentLoggedInWallet: Wallet | null
    isLogin: boolean
}


export const walletState = reactive<walletStateInterface>({
    wallets: new Wallets(),
    currentLoggedInWallet: null,
    isLogin: false,
  });