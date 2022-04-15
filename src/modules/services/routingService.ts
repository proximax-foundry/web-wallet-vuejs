import { AddressbookRoutes } from '@/modules/services/submodule/addressbook/routingAddressbook';
import { NamespaceRoutes } from '@/modules/services/submodule/namespaces/routingNamespace';
import { MainnetSwapRoutes } from '@/modules/services/submodule/mainnetSwap/routingMainnetSwap';
import { AttestationRoutes } from '@/modules/services/submodule/attestation/routingAttestation';
import { VotingRoutes } from '@/modules/services/submodule/voting/routingVoting';
import { StorageRoutes } from '@/modules/services/submodule/storage/routingStorage';
import { SiriusGiftRoutes } from '@/modules/services/submodule/siriusGift/routingSiriusGift';
import { NodesRoutes } from '@/modules/services/submodule/nodes/routingNodes';
import { AssetsRoutes } from '@/modules/services/submodule/assets/routingAssets';
import { AggregateTransactions } from '@/modules/services/submodule/aggregateTransactions/routingAggregateTransactions';
import { RouteRecordRaw } from 'vue-router'

export const ServiceRoutes: RouteRecordRaw[] = [
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
  ...NodesRoutes,
  ...AssetsRoutes,
  ...AggregateTransactions,
];