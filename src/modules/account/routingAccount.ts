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
    path: '/created-account',
    name: 'ViewAccountCreated',
    props: true,
    component: () => import('@/modules/account/views/ViewAccountCreated.vue'),
    meta: {
      title: "Created account",
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
    path: '/view-multisig-scheme/:address',
    name: 'ViewMultisigScheme',
    props: true,
    component: () => import('@/modules/account/views/ViewMultisigScheme.vue'),
    meta: {
      title: "Multisig Scheme",
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
    path: '/delete-account/:name',
    name: 'ViewAccountDelete',
    props: true,
    component: () => import('@/modules/account/views/ViewAccountDelete.vue'),
    meta: {
      title: "Delete account",
    }
  },
  ...DelegateRoutes,
  ...LinkToNamespaceRoutes,
  ...MultisigRoutes,
];