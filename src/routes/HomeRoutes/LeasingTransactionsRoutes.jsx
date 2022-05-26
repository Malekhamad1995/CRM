import { LeasingTransactionsProfile, LeasingTransactions } from '../../Views/Home';

export const LeasingTransactionsRoutes = [
  {
    path: '/view',
    name: 'LeasingTransactionsView:leasing-transactions',
    component: LeasingTransactions,
    layout: '/home/leasing-transactions',
    default: true,
    isRoute: true,
    authorize: true,
    roles: [],
    isDisabled: false,
    isExact: true,
    breadcrumbs: [
      {
        name: 'LeasingTransactionsView:leasing-transactions',
        isDisabled: true,
        route: '/home/leasing-transactions/view',
        groupName: 'accounts',
      },
    ],
  },
  {
    path: '/transaction-profile',
    name: 'LeasingTransactionsProfileView:transaction-profile',
    component: LeasingTransactionsProfile,
    layout: '/home/leasing-transactions',
    default: true,
    isRoute: true,
    authorize: true,
    roles: [],
    isDisabled: false,
    isExact: true,
    breadcrumbs: [
      {
        name: 'LeasingTransactionsView:leasing-transactions',
        isDisabled: false,
        route: '/home/leasing-transactions/view',
        groupName: 'accounts',
      },
      {
        name: 'LeasingTransactionsProfileView:transaction-profile',
        isDisabled: true,
        route: '/home/leasing-transactions/transaction-profile',
        groupName: 'accounts',
      },
    ],
  },
];
