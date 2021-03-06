import { UnitsReservationView } from '../../Views/Home';
import {
  UnitsLeaseView,
  UnitsLeaseManagementView,
  UnitsLeaseStatusManagementView,
  UnitsLeaseProfileManagementView,
} from '../../Views/Home/UnitsLeaseView';

export const UnitsPropertyManagement = [
  {
    path: '/view',
    name: 'UnitsView:units',
    component: UnitsLeaseView,
    layout: '/home/units-property-management',
    default: true,
    isRoute: true,
    authorize: true,
    roles: [],
    isDisabled: false,
    isExact: true,
    breadcrumbs: [
      {
        name: 'UnitsView:units',
        isDisabled: false,
        route: '/home/units-property-management/view',
        groupName: 'property-management',
      },
    ],
  },
  {
    path: '/edit',
    name: 'homeLayout.unitsManagementView.units-management-view',
    component: UnitsLeaseManagementView,
    layout: '/home/units-property-management',
    default: false,
    isRoute: true,
    authorize: true,
    roles: [],
    isDisabled: false,
    isExact: true,
    breadcrumbs: [
      {
        name: 'UnitsView:units',
        isDisabled: false,
        route: '/home/units-property-management/view',
        groupName: 'property-management',
      },
      {
        name: 'homeLayout.unitsManagementView.units-management-view',
        isDisabled: true,
        route: '/home/units-property-management/edit',
      },
    ],
  },
  {
    path: '/unit-profile-edit',
    name: 'UnitsProfileManagementView:unit-profile-edit',
    component: UnitsLeaseProfileManagementView,
    layout: '/home/units-property-management',
    default: false,
    isRoute: true,
    authorize: true,
    roles: [],
    isDisabled: false,
    isExact: true,
    breadcrumbs: [
      {
        name: 'unitsView:units',
        isDisabled: false,
        route: '/home/units-property-management/view',
        groupName: 'property-management',
      },
      {
        name: 'UnitsProfileManagementView:unit-profile-edit',
        isDisabled: true,
        route: '/home/units-property-management/unit-profile-edit',
      },
    ],
  },
  {
    path: '/add',
    name: 'homeLayout.unitsManagementView.units-management-view',
    component: UnitsLeaseManagementView,
    layout: '/home/units-property-management',
    default: false,
    isRoute: true,
    authorize: true,
    roles: [],
    isDisabled: false,
    isExact: true,
    breadcrumbs: [
      {
        name: 'UnitsView:units',
        isDisabled: false,
        route: '/home/units-property-management/view',
        groupName: 'property-management',
      },
      {
        name: 'homeLayout.unitsManagementView.units-management-view',
        isDisabled: true,
        route: '/home/units-property-management/add',
      },
    ],
  },
  {
    path: '/unit-status-management',
    name: 'UnitsStatusManagementView:unit-status-management',
    component: UnitsLeaseStatusManagementView,
    layout: '/home/units-property-management',
    default: false,
    isRoute: true,
    authorize: true,
    roles: [],
    isDisabled: false,
    isExact: true,
    breadcrumbs: [
      {
        name: 'unitsView:units',
        isDisabled: false,
        route: '/home/units-property-management/view',
        groupName: 'property-management',
      },
      {
        name: 'UnitsStatusManagementView:unit-status-management',
        isDisabled: true,
        route: '/home/units-property-management/unit-status-management',
      },
    ],
  },

  {
    path: '/unit-profile-reservation',
    name: 'UnitsProfileManagementView:unit-profile-reservation',
    component: UnitsReservationView,
    layout: '/home/units-lease',
    default: false,
    isRoute: true,
    authorize: true,
    roles: [],
    isDisabled: false,
    isExact: true,
    breadcrumbs: [
      {
        name: 'unitsView:units',
        isDisabled: false,
        route: '/home/units-lease/view',
        groupName: 'property-management',
      },
      {
        name: 'UnitsProfileManagementView:unit-profile-reservation',
        isDisabled: true,
        route: '/home/units-sales/unit-profile-reservation',
      },
    ],
  },
];
