import { DelegateRoutes } from '@/modules/account/submodule/delegate/routingDelegate';
import { LinkToNamespaceRoutes } from '@/modules/account/submodule/linkToNamespace/routingLinkToNamespace';
import { MultisigRoutes } from '@/modules/account/submodule/multisig/routingMultisig';
import { RouteRecordRaw } from 'vue-router';

export const AccountRoutes: RouteRecordRaw[] = [
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
    path: '/view-all-accounts',
    name: 'ViewAccountDisplayAll',
    props: true,
    component: () => import('@/modules/account/views/ViewAccountDisplayAll.vue'),
    meta: {
      title: "View all accounts",
    }
  },
  {
    path: '/select-type-creation-account',
    name: 'ViewAccountCreateSelectType',
    props: true,
    component: () => import('@/modules/account/views/ViewAccountCreateSelectType.vue'),
    meta: {
      title: "Create account with selection",
    }
  },
  {
    path: '/create-account',
    name: 'ViewAccountCreate',
    component: () => import('@/modules/account/views/ViewAccountCreate.vue'),
    meta: {
      title: "Create account",
    }
  },
  {
    path: '/import-account',
    name: 'ViewAccountCreatePrivateKey',
    component: () => import('@/modules/account/views/ViewAccountCreatePrivateKey.vue'),
    meta: {
      title: "Import account",
    }
  },
  {
    path: '/details-account/:address',
    name: 'ViewAccountDetails',
    props: (route) =>{ return { address: route.params.address, accountCreated: route.params.accountCreated === 'true'}},
    component: () => import('@/modules/account/views/ViewAccountDetails.vue'),
    meta: {
      title: "Account details",
    }
  },
  {
    path: '/view-assets/:address',
    name: 'ViewAccountAssets',
    props: true,
    component: () => import('@/modules/account/views/ViewAccountAssets.vue'),
    meta: {
      title: "Account Assets",
    }
  },
  {
    path: '/view-namespaces/:address',
    name: 'ViewAccountNamespaces',
    props: true,
    component: () => import('@/modules/account/views/ViewAccountNamespaces.vue'),
    meta: {
      title: "Account Namespaces",
    }
  },
  {
    path: '/view-transactions/:address',
    name: 'ViewAccountConfirmedTransactions',
    props: true,
    component: () => import('@/modules/account/views/ViewAccountConfirmedTransactions.vue'),
    meta: {
      title: "Account Confirmed Transactions",
    }
  },
  {
    path: '/view-pending-transactions/:address',
    name: 'ViewAccountPendingTransactions',
    props: true,
    component: () => import('@/modules/account/views/ViewAccountPendingTransactions.vue'),
    meta: {
      title: "Account Pending Transactions",
    }
  },
  
  ...DelegateRoutes,
  ...LinkToNamespaceRoutes,
  ...MultisigRoutes,
];