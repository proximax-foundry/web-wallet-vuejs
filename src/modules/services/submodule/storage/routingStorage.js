export const StorageRoutes = [
  {
    path: '/my-file',
    name: 'ViewServicesStorageMyFile',
    component: () => import('@/modules/services/submodule/storage/views/ViewServicesStorageMyFile.vue'),
    meta: {
      title: "My Files",
    }
  },
  {
    path: '/upload-file',
    name: 'ViewServicesStorageUploadFile',
    component: () => import('@/modules/services/submodule/storage/views/ViewServicesStorageUploadFile.vue'),
    meta: {
      title: "Upload File",
    }
  },
];