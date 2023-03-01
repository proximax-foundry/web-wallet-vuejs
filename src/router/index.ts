import { createRouter, createWebHashHistory } from "vue-router";
import { HomeRoutes } from '@/modules/home/routingHome';
import { WalletRoutes } from '@/modules/wallet/routingWallet';
import { AccountRoutes } from '@/modules/account/routingAccount';
import { TransferRoutes } from '@/modules/transfer/routingTransfer';
const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    ...HomeRoutes,
    ...WalletRoutes,
    ...AccountRoutes,
    ...TransferRoutes,
  ],
});

export default router;
