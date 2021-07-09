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
];