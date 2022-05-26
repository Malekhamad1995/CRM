
import { SubCommunityEditView } from '../../Views/Home/LocationViews/SubCommunityView/SubCommunityManagementView/SubCommunityEditView';
import { AddFormSubCommunity } from '../../Views/Home/LocationViews/SubCommunityView/SubCommunityUtilities';
import { SubCommunityView } from '../../Views/Home/LocationViews/SubCommunityView/SubCommunityView';


export const SubCommunitiesRoutes = [
  {
    path: '/view',
    name: 'LocationView:SubCommunitie',
    component: SubCommunityView,
    layout: '/home/SubCommunitie',
    default: true,
    isRoute: true,
    authorize: true,
    roles: [],
    isDisabled: false,
    isExact: true,
    breadcrumbs: [
      {
        name: 'LocationView:SubCommunitie',
        isDisabled: false,
        route: '/home/SubCommunitie/view',
        groupName: 'LocationView:locations',
      },
    ],
  },
  {
    path: '/add',
    name: 'LocationView:add',
    component: AddFormSubCommunity,
    layout: '/home/SubCommunitie',
    default: false,
    isRoute: true,
    authorize: true,
    roles: [],
    isDisabled: false,
    isExact: true,
    breadcrumbs: [
      {
        name: 'LocationView:SubCommunitie',
        isDisabled: false,
        route: '/home/SubCommunitie/view',
        groupName: 'LocationView:locations',
      },
      {
        name: 'LocationView:add',
        isDisabled: false,
        route: '/home/SubCommunitie/add',

      },
    ],
  },
  {
    path: '/edit',
    name: 'LocationView:edit',
    component: SubCommunityEditView,
    layout: '/home/SubCommunitie',
    default: false,
    isRoute: true,
    authorize: true,
    roles: [],
    isDisabled: false,
    isExact: true,
    breadcrumbs: [
      {
        name: 'LocationView:SubCommunitie',
        isDisabled: false,
        route: '/home/SubCommunitie/view',
        groupName: 'LocationView:locations',
      },
      {
        name: 'LocationView:edit',
        isDisabled: false,
        route: '/home/SubCommunitie/edit',

      },

    ],
  },
];
