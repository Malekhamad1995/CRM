import { ReportsView } from '../../Views/Home/ReportsView/ReportsView';

export const CRMReportsRoutes = [
  {
    path: '/view',
    name: 'Reports:reports',
    component: ReportsView,
    layout: '/home/Reports-CRM',
    default: true,
    isRoute: true,
    authorize: true,
    roles: [],
    isDisabled: false,
    isExact: true,
    breadcrumbs: [
      {
        name: 'Reports:reports',
        isDisabled: true,
        route: '/home/Reports-CRM/view',
        groupName: 'crm',
      },
    ],
  },
];
