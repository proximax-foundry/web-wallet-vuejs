export const AssetsRoutes = [
  {
    path: '/create-asset', 
    name: 'ViewServicesAssetsCreate',
    component: () => import('@/modules/services/submodule/assets/views/ViewServicesAssetsCreate.vue'),
    meta: {
      title: "Create Asset",
    }
  },
  {
    path: '/asset-supply-change/:assetId/:address',
    name: 'ViewServicesAssetsModifySupplyChange',
    props: true,
    component: () => import('@/modules/services/submodule/assets/views/ViewServicesAssetsModifySupplyChange.vue'),
    meta: {
      title: "Modify Asset",
    }
  },
  {
    path: '/alias-namespace-to-asset/:assetId/:address',
    name: 'ViewServicesAssetsLinkToNamespace',
    props: true,
    component: () => import('@/modules/services/submodule/assets/views/ViewServicesAssetsLinkToNamespace.vue'),
    meta: {
      title: "Link to Namespace",
    }
  },
];
