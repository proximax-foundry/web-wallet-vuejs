import { DelegateRoutes } from '@/modules/account/submodule/delegate/routingDelegate';
import { LinkToNamespaceRoutes } from '@/modules/account/submodule/linkToNamespace/routingLinkToNamespace';
import { MultisigRoutes } from '@/modules/account/submodule/multisig/routingMultisig';
import { RouteRecordRaw } from 'vue-router';

export const AccountRoutes: RouteRecordRaw[] = [
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
    path: '/view-my-accounts',
    name: 'ViewNormalAccount',
    props: true,
    component: () => import('@/modules/account/views/ViewNormalAccount.vue'),
    meta: {
      title: "View normal accounts",
    }
  },
  {
    path: '/view-multisig-accounts',
    name: 'ViewMultisigAccount',
    props: true,
    component: () => import('@/modules/account/views/ViewMultisigAccount.vue'),
    meta: {
      title: "View multisig accounts",
    }
  },
  {
    path: '/view-other-accounts',
    name: 'ViewOtherAccount',
    props: true,
    component: () => import('@/modules/account/views/ViewOtherAccount.vue'),
    meta: {
      title: "View other accounts",
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
    props: true,
    component: () => import('@/modules/account/views/ViewAccountDetails.vue'),
    meta: {
      title: "Account details",
    }
  },
  {
    path: '/swap-account/:address',
    name: 'ViewAccountSwap',
    props: true,
    component: () => import('@/modules/account/views/ViewAccountSwap.vue'),
    meta: {
      title: "NIS1 Swap",
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
    path: '/add-account-metadata/:address',
    name: 'ViewAccountMetadata',
    props: true,
    component: () => import('@/modules/account/views/ViewAccountMetadata.vue'),
    meta: {
      title: "Account Metadata",
    }
  },
  ...DelegateRoutes,
  ...LinkToNamespaceRoutes,
  ...MultisigRoutes,
];