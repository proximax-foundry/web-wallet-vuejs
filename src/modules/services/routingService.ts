import { AddressbookRoutes } from '@/modules/services/submodule/addressbook/routingAddressbook';
import { NamespaceRoutes } from '@/modules/services/submodule/namespaces/routingNamespace';
import { MainnetSwapRoutes } from '@/modules/services/submodule/mainnetSwap/routingMainnetSwap';
import { AttestationRoutes } from '@/modules/services/submodule/attestation/routingAttestation';
import { VotingRoutes } from '@/modules/services/submodule/voting/routingVoting';
import { StorageRoutes } from '@/modules/services/submodule/storage/routingStorage';
import { SiriusGiftRoutes } from '@/modules/services/submodule/siriusGift/routingSiriusGift';
import { SettingsRoutes } from '@/modules/services/submodule/settings/routingSettings';
import { AssetsRoutes } from '@/modules/services/submodule/assets/routingAssets';
import { StackingRoutes } from '@/modules/services/submodule/stacking/routingStacking';
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
    path: '/view-nft',
    name: 'ViewServicesNFT',
    props: true,
    component: () => import('@/modules/services/submodule/nft/views/ViewServicesNFT.vue'),
    meta:{
      title: "View NFT"
    }
  },
  {
    path: '/nft-details/:assetId',
    name: 'ViewServicesNFTDetails',
    props: true,
    component: () => import('@/modules/services/submodule/nft/views/ViewServicesNFTDetails.vue'),
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
  ...AttestationRoutes,
  ...VotingRoutes,
  ...StorageRoutes,
  ...SiriusGiftRoutes,
  ...SettingsRoutes,
  ...AssetsRoutes,
  ...StackingRoutes,
];