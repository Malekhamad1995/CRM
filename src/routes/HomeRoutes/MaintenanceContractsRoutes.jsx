import { AddMaintenanContractView, MaintenanceContractManagementView, MaintenanceContractsView } from '../../Views/Home';

export const MaintenanceContractsRoutes = [
  {
    path: '/view',
    name: 'MaintenanceContracts:Maintenance-Contracts',
    component: MaintenanceContractsView,
    layout: '/home/Maintenance-Contracts',
    default: true,
    isRoute: true,
    authorize: true,
    roles: [],
    isDisabled: false,
    isExact: true,
    breadcrumbs: [
      {
        name: 'MaintenanceContracts:Maintenance-Contracts',
        isDisabled: true,
        route: '/home/MaintenanceContractsView/view',
        groupName: 'property-management',
      },
    ],
  },
  {
    path: '/add',
    name: 'MaintenanceContracts:add',
    component: AddMaintenanContractView,
    layout: '/home/Maintenance-Contracts',
    default: false,
    isRoute: true,
    authorize: true,
    roles: [],
    isDisabled: false,
    isExact: true,
    breadcrumbs: [
      {
        name: 'MaintenanceContracts:Maintenance-Contracts',
        isDisabled: false,
        route: '/home/Maintenance-Contracts',
        groupName: 'property-management',
      },
      {
        name: 'MaintenanceContracts:AddMaintenanceContracts',
        isDisabled: true,
        route: '/home/Maintenance-Contracts/add',
      },
    ],
  },
  {
    path: '/edit',
    name: 'MaintenanceContracts:edit',
    component: MaintenanceContractManagementView,
    layout: '/home/Maintenance-Contracts',
    default: false,
    isRoute: true,
    authorize: true,
    roles: [],
    isDisabled: false,
    isExact: true,
    breadcrumbs: [
      {
        name: 'MaintenanceContracts:Maintenance-Contracts',
        isDisabled: false,
        route: '/home/Maintenance-Contracts',
        groupName: 'property-management',
      },
      {
        name: 'MaintenanceContracts:editMaintenanceContracts',
        isDisabled: true,
        route: '/home/Maintenance-Contracts/edit',
      },
    ],
  },
];
