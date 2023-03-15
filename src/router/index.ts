import { createRouter, createWebHashHistory } from "vue-router";
import { HomeRoutes } from '@/modules/home/routingHome';
import { WalletRoutes } from '@/modules/wallet/routingWallet';
import { MainnetSwapRoutes }from '@/modules/services/submodule/mainnetSwap/routingMainnetSwap'
import { AccountRoutes } from '@/modules/account/routingAccount';
import { TransferRoutes } from '@/modules/transfer/routingTransfer';
import { ServiceRoutes  } from '@/modules/services/routingService';
import { DashboardRoutes } from '@/modules/dashboard/routingDashboard';
import { MetadataTransactionRoutes  } from '@/modules/metadataTxn/routingMetadataTransaction';
import { StackingRoutes } from '@/modules/services/submodule/stacking/routingStacking';
import { TransactionRoutes } from "@/modules/transaction/routingTransaction";

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    ...HomeRoutes,
    ...WalletRoutes,
    ...AccountRoutes,
    ...TransferRoutes,
    ...ServiceRoutes,
    ...DashboardRoutes,
    ...MetadataTransactionRoutes,
    ...StackingRoutes,
    ...MainnetSwapRoutes,
    ...TransactionRoutes
  ],
});

export default router;
