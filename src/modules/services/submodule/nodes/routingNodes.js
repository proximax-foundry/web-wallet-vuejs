export const NodesRoutes = [
  {
    path: '/nodes',
    name: 'ViewServicesNodes',
    component: () => import('@/modules/services/submodule/nodes/views/ViewServicesNodes.vue'),
    meta: {
      title: "Nodes",
    }
  },
];