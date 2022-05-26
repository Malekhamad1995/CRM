import { Dashboard } from '../../Views/Home/Dashboard/Dashboard';

export const DashboardRoutes = [
  {
    path: '/dashboard-amdin/view',
    name: 'Dashboard:admin-dashboard',
    component: Dashboard,
    layout: '/home/dashboard',
    default: true,
    isRoute: true,
    authorize: true,
    roles: [],
    isDisabled: false,
    isExact: true,
    breadcrumbs: [
      {
        name: 'Dashboard:admin-dashboard',
        isDisabled: true,
        route: '/home/dashboard-amdin/view',
        groupName: 'dashboard',
      },
    ],
  },
];
