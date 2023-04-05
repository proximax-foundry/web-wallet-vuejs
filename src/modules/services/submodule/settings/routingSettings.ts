import type { RouteRecordRaw } from 'vue-router'
export const SettingsRoutes: RouteRecordRaw[] = [
  {
    path: '/settings',
    name: 'ViewSettings',
    component: () => import('@/modules/services/submodule/settings/views/ViewSettings.vue'),
    meta: {
      title: "Settings",
    }
  },
]