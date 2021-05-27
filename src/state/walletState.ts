import { reactive } from "vue";
import { Wallets } from "../models/wallets"
import { WalletAccount } from "../models/walletAccount"

interface walletStateInterface {
    wallets: Wallets
    currentLoggedInWallet: WalletAccount | null
    isLogin: boolean
}


export const walletState = reactive<walletStateInterface>({
    wallets: new Wallets(),
    currentLoggedInWallet: null,
    isLogin: false,
  });