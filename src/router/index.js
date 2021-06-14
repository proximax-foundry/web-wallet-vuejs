import { createRouter, createWebHashHistory } from 'vue-router';
import { HomeRoutes } from '@/modules/home/routingHome';
import { ServiceRoutes } from '@/modules/services/routingService';
import { WalletRoutes } from '@/modules/wallet/routingWallet';
import { AccountRoutes } from '@/modules/account/routingAccount';
import { DashboardRoutes } from '@/modules/dashboard/routingDashboard';
import { TransferRoutes } from '@/modules/transfer/routingTransfer';


const routes = [
  ...HomeRoutes,
  ...WalletRoutes,
  ...DashboardRoutes,
  ...AccountRoutes,
  ...TransferRoutes,
  ...ServiceRoutes,
];

const router = createRouter({
  history: createWebHashHistory(), //createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
