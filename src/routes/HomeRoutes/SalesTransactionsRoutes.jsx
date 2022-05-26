import { SalesTransactionsView, SalesTransactionsProfile } from '../../Views/Home';

export const SalesTransactionsRoutes = [
  {
    path: '/view',
    name: 'SalesTransactionsView:sales-transactions',
    component: SalesTransactionsView,
    layout: '/home/sales-transactions',
    default: true,
    isRoute: true,
    authorize: true,
    roles: [],
    isDisabled: false,
    isExact: true,
    breadcrumbs: [
      {
        name: 'SalesTransactionsView:sales-transactions',
        isDisabled: true,
        route: '/home/sales-transactions/view',
        groupName: 'accounts',
      },
    ],
  },
  {
    path: '/transaction-profile',
    name: 'SalesTransactionsProfileView:transaction-profile',
    component: SalesTransactionsProfile,
    layout: '/home/sales-transactions',
    default: true,
    isRoute: true,
    authorize: true,
    roles: [],
    isDisabled: false,
    isExact: true,
    breadcrumbs: [
      {
        name: 'SalesTransactionsView:sales-transactions',
        isDisabled: false,
        route: '/home/sales-transactions/view',
        groupName: 'accounts',
      },
      {
        name: 'SalesTransactionsProfileView:transaction-profile',
        isDisabled: true,
        route: '/home/sales-transactions/transaction-profile',
        groupName: 'accounts',
      },
    ],
  },
];
