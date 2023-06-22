import { AddressbookRoutes } from '@/modules/services/submodule/addressbook/routingAddressbook';
import { NamespaceRoutes } from '@/modules/services/submodule/namespaces/routingNamespace';
import { MainnetSwapRoutes } from '@/modules/services/submodule/mainnetSwap/routingMainnetSwap';
import { VotingRoutes } from '@/modules/services/submodule/voting/routingVoting';
import { StorageRoutes } from '@/modules/services/submodule/storage/routingStorage';
import { SiriusGiftRoutes } from '@/modules/services/submodule/siriusGift/routingSiriusGift';
import { SettingsRoutes } from '@/modules/services/submodule/settings/routingSettings';
import { AssetsRoutes } from '@/modules/services/submodule/assets/routingAssets';
import { StackingRoutes } from '@/modules/services/submodule/stacking/routingStacking';
import { ExchangeRoutes } from './submodule/exchange/routingExchange';
import { RouteRecordRaw } from 'vue-router'

export const ServiceRoutes: RouteRecordRaw[] = [
  {
    path: '/view-portfolio',
    name: 'ViewServicesPortfolio',
    props: true,
    component: () => import('@/modules/services/submodule/portfolio/views/ViewServicesPortfolio.vue'),
    meta:{
      title: "View Portfolio"
    }
  },
 

  {
    path: '/view-airdrop-token',
    name: 'ViewServicesAirdropToken',
    props: true,
    component: () => import('@/modules/services/submodule/airdropToken/views/ViewServicesAirdropToken.vue'),
    meta:{
      title: "Airdrop Token Utility"
    }
  },
  {
    path: '/services',
    name: 'ViewServices',
    component: () => import('@/modules/services/views/ViewServices.vue'),
    meta: {
      title: "Services",
    }
  },
  ...AddressbookRoutes,
  ...NamespaceRoutes,
  ...MainnetSwapRoutes,
  ...VotingRoutes,
  ...StorageRoutes,
  ...SiriusGiftRoutes,
  ...SettingsRoutes,
  ...AssetsRoutes,
  ...StackingRoutes,
  ...ExchangeRoutes
];