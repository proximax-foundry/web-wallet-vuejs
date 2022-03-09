export const MultisigRoutes = [
  {
    path: '/convert-account-multisign/:name?',
    name: 'ViewMultisigConvertAccount',
    props: true,
    component: () => import('@/modules/account/submodule/multisig/views/ViewAccountMultisigConvertAccount.vue'),
    meta: {
      title: "Convert to Multisig Account",
    }
  },
  {
    path: '/edit-account-multisign/:name',
    name: 'ViewMultisigEditAccount',
    props: true,
    component: () => import('@/modules/account/submodule/multisig/views/ViewAccountMultisigEditAccount.vue'),
    meta: {
      title: "Edit Multisig Account",
    }
  },
  {
    path: '/multisig-settings/:name',
    name: 'ViewMultisigHome',
    props: true,
    component: () => import('@/modules/account/submodule/multisig/views/ViewMultisigHome.vue'),
    meta: {
      title: "View Multisig Settings",
    }
  },
  {
    path: '/view-multisig-scheme/:address',
    name: 'ViewMultisigScheme',
    props: true,
    component: () => import('@/modules/account/submodule/multisig/views/ViewMultisigScheme.vue'),
    meta: {
      title: "Multisig Scheme",
    }
  },
];