
import { CityView } from '../../Views/Home/LocationViews/CityView/CityView';
import { CityAddView } from '../../Views/Home/LocationViews/CityView/CityManagementView/CityAddView';
import { CityEditView } from '../../Views/Home/LocationViews/CityView/CityManagementView/CityEditView';


export const CitiesRoutes = [
  {
    path: '/view',
    name: 'LocationView:city',
    component: CityView,
    layout: '/home/city',
    default: true,
    isRoute: true,
    authorize: true,
    roles: [],
    isDisabled: false,
    isExact: true,
    breadcrumbs: [
      {
        name: 'LocationView:city',
        isDisabled: false,
        route: '/home/city/view',
        groupName: 'LocationView:locations',
      },
    ],
  },
  {
    path: '/add',
    name: 'LocationView:add',
    component: CityAddView,
    layout: '/home/city',
    default: false,
    isRoute: true,
    authorize: true,
    roles: [],
    isDisabled: false,
    isExact: true,
    breadcrumbs: [
      {
        name: 'LocationView:city',
        isDisabled: false,
        route: '/home/city/view',
        groupName: 'LocationView:locations',
      },
      {
        name: 'LocationView:add',
        isDisabled: false,
        route: '/home/city/add',

      },
    ],
  },
  {
    path: '/edit',
    name: 'LocationView:edit',
    component: CityEditView,
    layout: '/home/city',
    default: false,
    isRoute: true,
    authorize: true,
    roles: [],
    isDisabled: false,
    isExact: true,
    breadcrumbs: [
      {
        name: 'LocationView:city',
        isDisabled: false,
        route: '/home/city/view',
        groupName: 'LocationView:locations',
      },
      {
        name: 'LocationView:edit',
        isDisabled: false,
        route: '/home/city/edit',

      },

    ],
  },
];
