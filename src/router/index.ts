import { createRouter, createWebHashHistory } from "vue-router";
import { HomeRoutes } from '@/modules/home/routingHome';
import { WalletRoutes } from '@/modules/wallet/routingWallet';

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    ...HomeRoutes,
    ...WalletRoutes,
  ],
});

export default router;
