export const AttestationRoutes = [
  {
    path: '/create-attestation',
    name: 'ViewServicesAttestationCreate',
    component: () => import('@/modules/services/submodule/attestation/views/ViewServicesAttestationCreate.vue'),
    meta: {
      title: "Create Attestation",
    }
  },
  {
    path: '/audit-attestation',
    name: 'ViewServicesAttestationAudit',
    component: () => import('@/modules/services/submodule/attestation/views/ViewServicesAttestationAudit.vue'),
    meta: {
      title: "Audit Attestation",
    }
  },
];