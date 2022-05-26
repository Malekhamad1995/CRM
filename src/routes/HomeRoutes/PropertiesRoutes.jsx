import {
  PropertiesManagementView,
  PropertiesView,
  PropertiesProfileManagementView,
} from '../../Views/Home';

export const PropertiesRoutes = [
  {
    path: '/view',
    name: 'PropertiesView:properties-management',
    component: PropertiesView,
    layout: '/home/properties',
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
        route: '/home/properties/view',
        groupName: 'property-management',
      },
    ],
  },
  {
    path: '/add',
    name: 'homeLayout.propertiesManagementView.properties-management-view',
    component: PropertiesManagementView,
    layout: '/home/properties',
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
        route: '/home/properties/view',
        groupName: 'property-management',
      },
      {
        name: 'homeLayout.propertiesManagementView.properties-management-view',
        isDisabled: true,
        route: '/home/propertiesadd',
      },
    ],
  },
  {
    path: '/edit',
    name: 'homeLayout.propertiesManagementView.properties-management-view',
    component: PropertiesManagementView,
    layout: '/home/properties',
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
        route: '/home/properties/view',
        groupName: 'property-management',
      },
      {
        name: 'homeLayout.propertiesManagementView.properties-management-view',
        isDisabled: true,
        route: '/home/properties/edit',
      },
    ],
  },
  {
    path: '/property-profile-edit',
    name: 'PropertiesProfileManagementView:property-profile-edit',
    component: PropertiesProfileManagementView,
    layout: '/home/properties',
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
        route: '/home/properties/view',
        groupName: 'property-management',
      },
      {
        name: 'PropertiesProfileManagementView:property-profile-edit',
        isDisabled: true,
        route: '/home/properties/property-profile-edit',
      },
    ],
  },
];
