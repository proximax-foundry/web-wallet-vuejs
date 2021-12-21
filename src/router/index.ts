import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import { HomeRoutes } from '@/modules/home/routingHome';
import { DashboardRoutes } from '@/modules/dashboard/routingDashboard';
import { TransferRoutes } from '@/modules/transfer/routingTransfer';
import { WalletRoutes } from '@/modules/wallet/routingWallet';
import { AccountRoutes } from '@/modules/account/routingAccount';
import { ServiceRoutes  } from '@/modules/services/routingService';
import { TransactionRoutes  } from '@/modules/transaction/routingTransaction';

const routes: RouteRecordRaw[] = [
  ...HomeRoutes,
  ...WalletRoutes,
  ...DashboardRoutes,
  ...TransferRoutes,
  ...AccountRoutes,
  ...ServiceRoutes,
  ...TransactionRoutes,
]

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes
})

export default router
