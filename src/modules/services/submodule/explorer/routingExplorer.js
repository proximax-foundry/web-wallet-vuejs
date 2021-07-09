export const ExplorerRoutes = [
  {
    path: '/partial',
    name: 'ViewServicesExplorerPartial',
    component: () => import('@/modules/services/submodule/explorer/views/ViewServicesExplorerPartial.vue'),
    meta: {
      title: "Partial",
    }
  },
  {
    path: '/explorer',
    name: 'ViewServicesExplorer',
    component: () => import('@/modules/services/submodule/explorer/views/ViewServicesExplorer.vue'),
    meta: {
      title: "Explorer",
    }
  },
];
