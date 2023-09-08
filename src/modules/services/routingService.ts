import { AddressbookRoutes } from '@/modules/services/submodule/addressbook/routingAddressbook';
import { NamespaceRoutes } from '@/modules/services/submodule/namespaces/routingNamespace';
import { SettingsRoutes } from '@/modules/services/submodule/settings/routingSettings';
import { AssetsRoutes } from '@/modules/services/submodule/assets/routingAssets';
import { StackingRoutes } from '@/modules/services/submodule/stacking/routingStacking';
import { NftMakerRoutes } from '@/modules/services/submodule/nftMaker/routingNftMaker';
import { RouteRecordRaw } from 'vue-router'

export const ServiceRoutes: RouteRecordRaw[] = [
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
    path: '/view-nft-maker',
    name: 'ViewServicesNftMaker',
    props: true,
    component: () => import('@/modules/services/submodule/nftMaker/views/ViewServicesNftMaker.vue'),
    meta:{
      title: "Nft Maker"
    }
  },


  {
    path: '/view-nft-distribution',
    name: 'ViewServicesNftDistribution',
    props: true,
    component: () => import('@/modules/services/submodule/nftDistribution/views/ViewServicesNftDistribution.vue'),
    meta:{
      title: "Nft Distribution"
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
  ...SettingsRoutes,
  ...AssetsRoutes,
  ...StackingRoutes,
   ...NftMakerRoutes
];