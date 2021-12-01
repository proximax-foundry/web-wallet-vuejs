export const LinkToNamespaceRoutes = [{
    path: '/alias-address-to-namespace/:address',
    name: 'ViewAccountAliasAddressToNamespace',
    props: true,
    component: () =>
        import ('@/modules/account/submodule/linkToNamespace/views/ViewAccountAliasAddressToNamespace.vue'),
    meta: {
        title: "Link to Namespace",
    }
}, ];