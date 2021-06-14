export const MultisigRoutes = [
  {
    path: '/convert-account-multisign/:name?',
    name: 'ViewMultisigConvertAccount',
    props: true,
    component: () => import('@/modules/multisig/views/ViewMultisigConvertAccount.vue'),
    meta: {
      title: "Convert to Multisig Account",
    }
  },
  {
    path: '/edit-account-multisign/:name',
    name: 'ViewMultisigEditAccount',
    props: true,
    component: () => import('@/modules/multisig/views/ViewMultisigEditAccount.vue'),
    meta: {
      title: "Edit Multisig Account",
    }
  },
];