import { LookupsItemView, Lookups } from '../../Views/Home';

export const LookupsRoutes = [
  {
    id: 1,
    path: '/lookup-type',
    name: '',
    component: Lookups,
    layout: '/home/lookups',
    default: true,
    isRoute: true,
    authorize: true,
    roles: [],
    groupId: 12,
    order: 5,
    icon: 'mdi mdi-menu c-black',
    iconActive: 'mdi mdi-menu c-black',
    isDisabled: false,
    showInMenu: false,
    isExact: true,
    breadcrumbs: [
      {
        name: 'homeLayout.lookupsView.lookup-type',
        isDisabled: false,
        route: '/home/lookups/lookup-type',
        groupName: 'system-parameters',
      },
    ],
  },
  {
    id: 1,
    path: '/lookup-item',
    name: 'homeLayout.lookupsView.lookup-item',
    component: LookupsItemView,
    layout: '/home/lookups',
    default: false,
    isRoute: true,
    authorize: true,
    roles: [],
    groupId: 12,
    order: 5,
    icon: 'mdi mdi-menu c-black',
    iconActive: 'mdi mdi-menu c-black',
    isDisabled: false,
    showInMenu: false,
    isExact: true,
    breadcrumbs: [
      {
        name: 'homeLayout.lookupsView.lookup-type',
        isDisabled: false,
        route: '/home/lookups/lookup-type',
        groupName: 'system-parameters',
      },
      {
        name: 'homeLayout.lookupsView.lookup-item',
        isDisabled: false,
        route: '/home/lookups/lookup-item',
      },
    ],
  },
];
