
import { CountryEditView } from '../../Views/Home/LocationViews/CountryView/CountryManagementView';
import { CountryAddView } from '../../Views/Home/LocationViews/CountryView/CountryManagementView/CountryAddView';
import { CountryView } from '../../Views/Home/LocationViews/CountryView';


export const CountryRoutes = [
  {
    path: '/view',
    name: 'LocationView:country',
    component: CountryView,
    layout: '/home/country',
    default: true,
    isRoute: true,
    authorize: true,
    roles: [],
    isDisabled: false,
    isExact: true,
    breadcrumbs: [
      {
        name: 'LocationView:country',
        isDisabled: false,
        route: '/home/country/view',
        groupName: 'LocationView:locations',
      },
    ],
  },
  {
    path: '/add',
    name: 'LocationView:add',
    component: CountryAddView,
    layout: '/home/country',
    default: false,
    isRoute: true,
    authorize: true,
    roles: [],
    isDisabled: false,
    isExact: true,
    breadcrumbs: [
      {
        name: 'LocationView:country',
        isDisabled: false,
        route: '/home/country/view',
        groupName: 'LocationView:locations',
      },
      {
        name: 'LocationView:add',
        isDisabled: false,
        route: '/home/country/add',

      },
    ],
  },
  {
    path: '/edit',
    name: 'LocationView:edit',
    component: CountryEditView,
    layout: '/home/country',
    default: false,
    isRoute: true,
    authorize: true,
    roles: [],
    isDisabled: false,
    isExact: true,
    breadcrumbs: [
      {
        name: 'LocationView:country',
        isDisabled: false,
        route: '/home/country/view',
        groupName: 'LocationView:locations',
      },
      {
        name: 'LocationView:edit',
        isDisabled: false,
        route: '/home/country/edit',

      },

    ],
  },
];
