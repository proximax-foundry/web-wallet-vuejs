export const NodesRoutes = [
  {
    path: '/nodes',
    name: 'ViewNodes',
    component: () => import('@/modules/nodes/views/ViewNodes.vue'),
    meta: {
      title: "Nodes",
    }
  },
];