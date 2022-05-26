import { AgentsView } from '../../Views/Home/AgentsView/AgentsView';

export const AgentsViewRoutes = [
  {
    path: '/agent-management',
    name: 'agent',
    component: AgentsView,
    layout: '/home/agent',
    default: true,
    isRoute: true,
    authorize: true,
    roles: [],
    isDisabled: false,
    isExact: true,
    breadcrumbs: [
      {
        name: 'agent',
        isDisabled: true,
        route: '/home/agent',
        groupName: 'agent-management',
      },
    ],
  },
];
