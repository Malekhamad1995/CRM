import { PropertiesManagementView, PropertiesProfileManagementView, PropertiesView } from '../../Views/Home';

export const PropertiesSalesRoutes = [
  {
    path: '/view',
    name: 'PropertiesView:properties',
    component: PropertiesView,
    layout: '/home/properties-sales',
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
        route: '/home/properties-sales/view',
        groupName: 'sales',
      },
    ],
  },
  {
    path: '/add',
    name: 'homeLayout.propertiesManagementView.properties-management-view',
    component: PropertiesManagementView,
    layout: '/home/properties-sales',
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
        route: '/home/properties-sales/view',
        groupName: 'sales',
      },
      {
        name: 'homeLayout.propertiesManagementView.properties-management-view',
        isDisabled: true,
        route: '/home/properties-sales/add',
      },
    ],
  },
  {
    path: '/edit',
    name: 'homeLayout.propertiesManagementView.properties-management-view',
    component: PropertiesManagementView,
    layout: '/home/properties-sales',
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
        route: '/home/properties-sales/view',
        groupName: 'sales',
      },
      {
        name: 'homeLayout.propertiesManagementView.properties-management-view',
        isDisabled: true,
        route: '/home/properties-sales/edit',
      },
    ],
  },
  {
    path: '/property-profile-edit',
    name: 'PropertiesProfileManagementView:property-profile-edit',
    component: PropertiesProfileManagementView,
    layout: '/home/properties-sales',
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
        route: '/home/properties-sales/view',
        groupName: 'sales',
      },
      {
        name: 'PropertiesProfileManagementView:property-profile-edit',
        isDisabled: true,
        route: '/home/properties-sales/property-profile-edit',
      },
    ],
  },
];
