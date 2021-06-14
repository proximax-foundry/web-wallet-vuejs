export const NodesRoutes = [
  {
    path: '/nodes',
    name: 'ViewNodes',
    component: () => import('@/modules/services/submodule/nodes/views/ViewServicesNodes.vue'),
    meta: {
      title: "Nodes",
    }
  },
];