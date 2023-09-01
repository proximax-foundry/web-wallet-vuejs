export const IssuerRegistrationRoutes = [

    {
      path: '/register-as-issuer',
      name: 'ViewIssuerRegistration',
      component: () => import('@/modules/services/submodule/issuerRegistration/views/ViewIssuerRegistration.vue'),
      meta: {
        title: "Register as Issuer ",
      }
    },
  ];