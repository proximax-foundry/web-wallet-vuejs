import type { RouteRecordRaw } from 'vue-router'
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
    path: '/view-account-metadata/:address',
    name: 'ViewAccountMetadata',
    props: true,
    component: () => import('@/modules/metadataTxn/views/ViewAccountMetadata.vue'),
    meta: {
      title: "View Account Metadata",
    }
  },
  {
    path: '/view-asset-metadata/:address/:assetId',
    name: 'ViewAssetMetadata',
    props: true,
    component: () => import('@/modules/metadataTxn/views/ViewAssetMetadata.vue'),
    meta: {
      title: "View Asset Metadata",
    }
  },
  {
    path: '/view-namespace-metadata/:address/:namespaceId',
    name: 'ViewNamespaceMetadata',
    props: true,
    component: () => import('@/modules/metadataTxn/views/ViewNamespaceMetadata.vue'),
    meta: {
      title: "View Namespace Metadata",
    }
  }
];