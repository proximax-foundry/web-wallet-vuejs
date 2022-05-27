import { RouteRecordRaw } from 'vue-router'
export const MetadataTransactionRoutes: RouteRecordRaw[] = [
  {
    path: '/metadata-txn/update-asset-metadata/:targetId?/:scopedMetadataKey?',
    name: 'ViewUpdateAssetMetadata',
    props: true,
    component: () => import('@/modules/metadataTxn/views/ViewUpdateAssetMetadata.vue'),
    meta: {
      title: "Update Asset Metadata",
    }
  },
  {
    path: '/metadata-txn/update-namespace-metadata/:targetId?/:scopedMetadataKey?',
    name: 'ViewUpdateNamespaceMetadata',
    props: true,
    component: () => import('@/modules/metadataTxn/views/ViewUpdateNamespaceMetadata.vue'),
    meta: {
      title: "Update Namespace Metadata",
    }
  },
  {
    path: '/metadata-txn/update-account-metadata/:targetPublicKey?/:scopedMetadataKey?',
    name: 'ViewUpdateAccountMetadata',
    props: true,
    component: () => import('@/modules/metadataTxn/views/ViewUpdateAccountMetadata.vue'),
    meta: {
      title: "Update Account Metadata",
    }
  },
  {
    path: '/view-metadata/:address',
    name: 'ViewMetadata',
    props: true,
    component: () => import('@/modules/metadataTxn/views/ViewMetadata.vue'),
    meta: {
      title: "View Metadata",
    }
  }
];