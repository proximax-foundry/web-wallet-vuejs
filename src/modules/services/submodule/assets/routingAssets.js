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
    path: '/asset-supply-change',
    name: 'ViewServicesAssetsModifySupplyChange',
    component: () => import('@/modules/services/submodule/assets/views/ViewServicesAssetsModifySupplyChange.vue'),
    meta: {
      title: "Modify Asset",
    }
  },
  {
    path: '/asset-supply-change',
    name: 'ViewServicesAssetsLinkToNamespace',
    component: () => import('@/modules/services/submodule/assets/views/ViewServicesAssetsLinkToNamespace.vue'),
    meta: {
      title: "Link to Namespace",
    }
  },
];
