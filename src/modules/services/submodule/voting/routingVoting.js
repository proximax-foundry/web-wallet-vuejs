export const VotingRoutes = [
  {
    path: '/create-poll',
    name: 'ViewServicesVotingCreatePoll',
    component: () => import('@/modules/services/submodule/voting/views/ViewServicesVotingCreatePoll.vue'),
    meta: {
      title: "Create Poll",
    }
  },
  {
    path: '/polls',
    name: 'ViewServicesVotingPoll',
    component: () => import('@/modules/services/submodule/voting/views/ViewServicesVotingPoll.vue'),
    meta: {
      title: "Polls",
    }
  },
  {
    path: '/vote-poll/:pollid/:pollname',
    name: 'ViewServicesVotingViewPoll',
    props: true,
    component: () => import('@/modules/services/submodule/voting/views/ViewServicesVotingViewPoll.vue'),
    meta: {
      title: "Polls",
    }
  },
];