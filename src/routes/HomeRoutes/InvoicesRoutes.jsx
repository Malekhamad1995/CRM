import { InvoicesView } from '../../Views/Home';

export const InvoicesRoutes = [
  {
    path: '/view',
    name: 'InvoicesView:invoices',
    component: InvoicesView,
    layout: '/home/invoices',
    default: true,
    isRoute: true,
    authorize: true,
    roles: [],
    isDisabled: false,
    isExact: true,
    breadcrumbs: [
      {
        name: 'InvoicesView:invoices',
        isDisabled: true,
        route: '/home/invoices/view',
        groupName: 'accounts',
      },
    ],
  },
];
