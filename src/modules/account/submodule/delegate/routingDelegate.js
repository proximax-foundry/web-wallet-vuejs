export const DelegateRoutes = [{
    path: '/delegate/:address',
    name: 'ViewAccountDelegate',
    props: true,
    component: () =>
        import ('@/modules/account/submodule/delegate/views/ViewAccountDelegate.vue'),
    meta: {
        title: "Delegate",
    }
}, ];