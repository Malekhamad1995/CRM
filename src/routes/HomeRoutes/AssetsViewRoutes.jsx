import { AssetsView } from '../../Views/Home/AssetsView/AssetsView';
import { AssetsManagementView } from '../../Views/Home/AssetsView/AssetsManagementView/AssetsManagementView';

export const AssetsViewRoutes = [
  {
    path: '/view',
    name: 'AssetsView:assets',
    component: AssetsView,
    layout: '/home/assets',
    default: true,
    isRoute: true,
    authorize: true,
    roles: [],
    isDisabled: false,
    isExact: true,
    breadcrumbs: [
      {
        name: 'AssetsView:assets',
        isDisabled: true,
        route: '/home/assets',
        groupName: 'property-management',
      },
    ],
  },
  {
    path: '/edit',
    name: 'AssetsView:assets-edit',
    component: AssetsManagementView,
    layout: '/home/assets',
    default: false,
    isRoute: true,
    authorize: true,
    roles: [],
    isDisabled: false,
    isExact: true,
    breadcrumbs: [
      {
        name: 'AssetsView:assets',
        isDisabled: false,
        route: '/home/assets',
        groupName: 'property-management',
      },
      {
        name: 'AssetsView:assets-edit',
        isDisabled: true,
        route: '/home/assets/edit',
      },
    ],
  },
  {
    path: '/add',
    name: 'AssetsView:assets-add',
    component: AssetsManagementView,
    layout: '/home/assets',
    default: false,
    isRoute: true,
    authorize: true,
    roles: [],
    isDisabled: false,
    isExact: true,
    breadcrumbs: [
      {
        name: 'AssetsView:assets',
        isDisabled: false,
        route: '/home/assets',
        groupName: 'property-management',
      },
      {
        name: 'AssetsView:assets-add',
        isDisabled: true,
        route: '/home/assets/add',
      },
    ],
  },
];
