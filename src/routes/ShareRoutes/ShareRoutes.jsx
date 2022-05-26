import UnitCardView from '../../Views/Share/UnitCardView/UnitCardView';

export const ShareRoutes = [
    {
        path: '/UnitCard',
        name: 'Unit Card',
        component: UnitCardView,
        layout: '/share',
        default: true,
        isExact: true,
        authorize: false,
        roles: [],
        showInMenu: false,
        isRoute: true,
    }
 ];
