import { createRouter, createWebHashHistory } from 'vue-router';
import { HomeRoutes } from '@/modules/home/routingHome';
import { ServiceRoutes } from '@/modules/services/routingService';
import { WalletRoutes } from '@/modules/wallet/routingWallet';
import { AccountRoutes } from '@/modules/account/routingAccount';
import { MultisigRoutes } from '@/modules/multisig/routingMultisig';
import { AddressbookRoutes } from '@/modules/addressbook/routingAddressbook';
import { DashboardRoutes } from '@/modules/dashboard/routingDashboard';
import { TransferRoutes } from '@/modules/transfer/routingTransfer';
import { MosaicRoutes } from '@/modules/mosaic/routingMosaic';
import { NodesRoutes } from '@/modules/nodes/routingNodes';

const routes = [
  ...HomeRoutes,
  ...WalletRoutes,
  ...DashboardRoutes,
  ...AccountRoutes,
  ...MultisigRoutes,
  ...TransferRoutes,
  ...MosaicRoutes,
  ...AddressbookRoutes,
  ...ServiceRoutes,
  ...NodesRoutes,
];

const router = createRouter({
  history: createWebHashHistory(), //createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
