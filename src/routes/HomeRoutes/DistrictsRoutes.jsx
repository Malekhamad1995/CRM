
import { DistrictAddView, DistrictEditView } from '../../Views/Home/LocationViews/DistrictView/DistrictManagementView';
import { DistrictView } from '../../Views/Home/LocationViews/DistrictView/DistrictView';

export const DistrictsRoutes = [
  {
    path: '/view',
    name: 'LocationView:District',
    component: DistrictView,
    layout: '/home/District',
    default: true,
    isRoute: true,
    authorize: true,
    roles: [],
    isDisabled: false,
    isExact: true,
    breadcrumbs: [
      {
        name: 'LocationView:District',
        isDisabled: false,
        route: '/home/District/view',
        groupName: 'LocationView:locations',
      },
    ],
  },
  {
    path: '/add',
    name: 'LocationView:add',
    component: DistrictAddView,
    layout: '/home/District',
    default: false,
    isRoute: true,
    authorize: true,
    roles: [],
    isDisabled: false,
    isExact: true,
    breadcrumbs: [
      {
        name: 'LocationView:District',
        isDisabled: false,
        route: '/home/District/view',
        groupName: 'LocationView:locations',
      },
      {
        name: 'LocationView:add',
        isDisabled: false,
        route: '/home/District/add',

      },
    ],
  },
  {
    path: '/edit',
    name: 'LocationView:edit',
    component: DistrictEditView,
    layout: '/home/District',
    default: false,
    isRoute: true,
    authorize: true,
    roles: [],
    isDisabled: false,
    isExact: true,
    breadcrumbs: [
      {
        name: 'LocationView:District',
        isDisabled: false,
        route: '/home/District/view',
        groupName: 'LocationView:locations',
      },
      {
        name: 'LocationView:edit',
        isDisabled: false,
        route: '/home/District/edit',

      },

    ],
  },
];
