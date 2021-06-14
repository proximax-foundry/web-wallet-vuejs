import { DelegateRoutes } from '@/modules/account/submodule/delegate/routingDelegate';
import { LinkToNamespaceRoutes } from '@/modules/account/submodule/linkToNamespace/routingLinkToNamespace';
import { MultisigRoutes } from '@/modules/account/submodule/multisig/routingMultisig';

export const AccountRoutes = [
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