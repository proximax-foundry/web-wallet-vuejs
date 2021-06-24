export const MosaicRoutes = [
  {
    path: '/create-mosaic',
    name: 'ViewMosaicCreate',
    component: () => import('@/modules/services/submodule/mosaic/views/ViewServicesMosaicCreate.vue'),
    meta: {
      title: "Create Mosaic",
    }
  },
  {
    path: '/mosaic-supply-change',
    name: 'ViewMosaicModifySupplyChange',
    component: () => import('@/modules/services/submodule/mosaic/views/ViewServicesMosaicModifySupplyChange.vue'),
    meta: {
      title: "Modify Mosaic",
    }
  },
  {
    path: '/mosaic-supply-change',
    name: 'ViewMosaicLinkToNamespace',
    component: () => import('@/modules/services/submodule/mosaic/views/ViewServicesMosaicLinkToNamespace.vue'),
    meta: {
      title: "Link to Namespace",
    }
  },
];
