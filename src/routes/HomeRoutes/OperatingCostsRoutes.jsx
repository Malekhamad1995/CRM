import { OperatingCostsView } from '../../Views/Home';
import { OperatingCostsViewManagement } from '../../Views/Home/OperatingCosts/OperatingCostsViewManagement/OperatingCostsViewManagement';

export const OperatingCostsRoutes = [
  {
    path: '/view',
    name: 'OperatingCostsView:operating-costs',
    component: OperatingCostsView,
    layout: '/home/operating-costs',
    default: true,
    isRoute: true,
    authorize: true,
    roles: [],
    isDisabled: false,
    isExact: true,
    breadcrumbs: [
      {
        name: 'OperatingCostsView:operating-costs',
        isDisabled: false,
        route: '/home/operating-costs/view',
        groupName: 'property-management',
      },
    ],
  },
  {
    path: '/add',
    name: 'OperatingCostsView:operating-costs-management',
    component: OperatingCostsViewManagement,
    layout: '/home/operating-costs',
    default: false,
    isRoute: true,
    authorize: true,
    roles: [],
    isDisabled: false,
    isExact: true,
    breadcrumbs: [
      {
        name: 'OperatingCostsView:operating-costs',
        isDisabled: false,
        route: '/home/operating-costs/view',
        groupName: 'property-management',
      },
      {
        name: 'OperatingCostsView:operating-costs-management',
        isDisabled: true,
        route: '/home/operating-costs/add',
      },
    ],
  },
  {
    path: '/edit',
    name: 'OperatingCostsView:operating-costs',
    component: OperatingCostsViewManagement,
    layout: '/home/operating-costs',
    default: false,
    isRoute: true,
    authorize: true,
    roles: [],
    isDisabled: false,
    isExact: true,
    breadcrumbs: [
      {
        name: 'OperatingCostsView:operating-costs',
        isDisabled: false,
        route: '/home/operating-costs/view',
        groupName: 'property-management',
      },
      {
        name: 'OperatingCostsView:operating-costs-management',
        isDisabled: true,
        route: '/home/operating-costs/edit',
      },
    ],
  },
];
