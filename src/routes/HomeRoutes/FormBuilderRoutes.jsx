import FormEditBuilder from '../../Views/FormBuilder';
import { PickFormBuilder } from '../../Views/FormBuilder/PickFormBuilder';

export const FormBuilderRoutes = [
  {
    id: 18,
    path: '/Form',
    name: 'SideMenuView.FormBuilder',
    component: PickFormBuilder,
    layout: '/home/FormBuilder',
    default: true,
    isRoute: true,
    authorize: true,
    roles: [],
    groupId: 16,
    order: 1,
    icon: 'icons i-box-circle-white',
    iconActive: 'icons i-contacts-blue-dark',
    isDisabled: false,
    showInMenu: false,
    isExact: true,
    breadcrumbs: [
      {
        name: 'SideMenuView.FormBuilder',
        isDisabled: false,
        route: '/home/FormBuilder/Form',
        groupName: 'system-parameters',
      },
    ],
  },
  {
    id: 19,
    path: '/FormEdit',
    name: 'SideMenuView.FormBuilder',
    component: FormEditBuilder,
    layout: '/home/FormBuilder',
    default: false,
    isRoute: true,
    authorize: true,
    roles: [],
    groupId: 16,
    order: 1,
    icon: 'icons i-box-circle-white',
    iconActive: 'icons i-box-circle-blue',
    isDisabled: false,
    showInMenu: false,
    isExact: true,
    breadcrumbs: [
      {
        name: 'SideMenuView.FormBuilder',
        isDisabled: false,
        route: '/home/FormBuilder/Form',
        groupName: 'system-parameters',
      },
      {
        name: 'SideMenuView.FormBuilder',
        isDisabled: false,
        route: '/home/FormBuilder/FormEdit',
      },
    ],
  },
];
