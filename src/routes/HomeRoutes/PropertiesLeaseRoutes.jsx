import {
  PropertiesManagementView,
  PropertiesProfileManagementView,
  PropertiesView,
} from '../../Views/Home';

export const PropertiesLeaseRoutes = [
  {
    path: '/view',
    name: 'PropertiesView:properties',
    component: PropertiesView,
    layout: '/home/properties-lease',
    default: true,
    isRoute: true,
    authorize: true,
    roles: [],
    isDisabled: false,
    isExact: true,
    breadcrumbs: [
      {
        name: 'PropertiesView:properties',
        isDisabled: false,
        route: '/home/properties-lease/view',
        groupName: 'leasing',
      },
    ],
  },
  {
    path: '/add',
    name: 'homeLayout.propertiesManagementView.properties-management-view',
    component: PropertiesManagementView,
    layout: '/home/properties-lease',
    default: false,
    isRoute: true,
    authorize: true,
    roles: [],
    isDisabled: false,
    isExact: true,
    breadcrumbs: [
      {
        name: 'PropertiesView:properties',
        isDisabled: false,
        route: '/home/properties-lease/view',
        groupName: 'leasing',
      },
      {
        name: 'homeLayout.propertiesManagementView.properties-management-view',
        isDisabled: true,
        route: '/home/properties-lease/add',
      },
    ],
  },
  {
    path: '/edit',
    name: 'homeLayout.propertiesManagementView.properties-management-view',
    component: PropertiesManagementView,
    layout: '/home/properties-lease',
    default: false,
    isRoute: true,
    authorize: true,
    roles: [],
    isDisabled: false,
    isExact: true,
    breadcrumbs: [
      {
        name: 'PropertiesView:properties',
        isDisabled: false,
        route: '/home/properties-lease/view',
        groupName: 'leasing',
      },
      {
        name: 'homeLayout.propertiesManagementView.properties-management-view',
        isDisabled: true,
        route: '/home/properties-lease/edit',
      },
    ],
  },
  {
    path: '/property-profile-edit',
    name: 'PropertiesProfileManagementView:property-profile-edit',
    component: PropertiesProfileManagementView,
    layout: '/home/properties-lease',
    default: false,
    isRoute: true,
    authorize: true,
    roles: [],
    isDisabled: false,
    isExact: true,
    breadcrumbs: [
      {
        name: 'PropertiesView:properties',
        isDisabled: false,
        route: '/home/properties-lease/view',
        groupName: 'leasing',
      },
      {
        name: 'PropertiesProfileManagementView:property-profile-edit',
        isDisabled: true,
        route: '/home/properties-lease/property-profile-edit',
      },
    ],
  },
];
