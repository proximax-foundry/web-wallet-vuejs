export const NamespaceRoutes = [
  {
    path: '/namespace/:address?',
    name: 'ViewServicesNamespace',
    props: true,
    component: () => import('@/modules/services/submodule/namespaces/views/ViewServicesNamespace.vue'),
    meta: {
      title: "Namespace",
    }
  },
  {
    path: '/create-namespace',
    name: 'ViewServicesNamespaceCreate',
    component: () => import('@/modules/services/submodule/namespaces/views/ViewServicesNamespaceCreate.vue'),
    meta: {
      title: "Register Namespace",
    }
  },
  {
    path: '/extend-namespace/:namespaceId/:address',
    name: 'ViewServicesNamespaceExtend',
    props: true,
    component: () => import('@/modules/services/submodule/namespaces/views/ViewServicesNamespaceExtend.vue'),
    meta: {
      title: "Extend Namespace",
    }
    
  },
  {
    path: '/add-namespace-metadata/:namespaceId/:address',
    name: 'ViewServicesNamespaceMetadata',
    props: true,
    component: () => import('@/modules/services/submodule/namespaces/views/ViewServicesNamespaceMetadata.vue'),
    meta: {
      title: "Add Namespace Metadata",
    }
    
  },
];