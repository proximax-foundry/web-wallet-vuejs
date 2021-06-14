export const NamespaceRoutes = [
  {
    path: '/create-namespace',
    name: 'ViewServicesNamespaceCreate',
    component: () => import('@/modules/services/submodule/namespaces/views/ViewServicesNamespaceCreate.vue'),
    meta: {
      title: "Register Namespace",
    }
  },
  {
    path: '/extend-namespace',
    name: 'ViewServicesNamespaceExtend',
    component: () => import('@/modules/services/submodule/namespaces/views/ViewServicesNamespaceExtend.vue'),
    meta: {
      title: "Extend Namespace",
    }
  },
];