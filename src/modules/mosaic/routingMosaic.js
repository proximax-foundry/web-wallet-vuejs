export const MosaicRoutes = [
  {
    path: '/create-mosaic',
    name: 'ViewMosaicCreate',
    component: () => import('@/modules/mosaic/views/ViewMosaicCreate.vue'),
    meta: {
      title: "Create Mosaic",
    }
  },
];