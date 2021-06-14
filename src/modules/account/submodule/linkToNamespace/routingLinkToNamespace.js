export const LinkToNamespaceRoutes = [
  {
    path: '/alias-address-to-namespace',
    name: 'ViewAccountAliasAddressToNamespace',
    component: () => import('@/modules/account/submodule/linkToNamespace/views/ViewAccountAliasAddressToNamespace.vue'),
    meta: {
      title: "Link to Namespace",
    }
  },
];